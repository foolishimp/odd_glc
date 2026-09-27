// Recover only the lock abandoned by this qualification caller's OOM.
import assert from 'node:assert/strict';
import {readFile,writeFile,stat,lstat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL,fileURLToPath} from 'node:url';
const D=import.meta.dirname,read=async p=>JSON.parse(await readFile(p,'utf8'));
const activation=await read(join(D,'activation-02.json'));
const pkg=await read(join(activation.coreRoot,'package.json'));
const api=async name=>import(pathToFileURL(join(activation.coreRoot,pkg.exports['./'+name].import)).href);
const [product,abg]=await Promise.all([api('product'),api('abg')]),hash=product.sha256Canonical;
const lastClose=(await read(join(D,'negative-02/readback-02/fresh-run_result.json'))).receipt.resources.eventResource.closeHandoff;
const prefix=lastClose.prefix,log=fileURLToPath(prefix.eventLogRef),before=await stat(log);
assert.equal(before.size,prefix.prefixLength);assert.equal(before.ino,prefix.storeIdentity.inode);
const lockPath=join(tmpdir(),'abiogenesis-event-store-locks-v5',`${before.dev}-${before.ino}.lock`);
const lock=await lstat(lockPath),bytes=await readFile(lockPath),locked=JSON.parse(bytes);
assert.equal(locked.ownerPid,46062);assert.equal(locked.device,before.dev);assert.equal(locked.inode,before.ino);
let absent=false;try{process.kill(locked.ownerPid,0);}catch(e){assert.equal(e.code,'ESRCH');absent=true;}assert(absent);
const save=(name,value)=>writeFile(join(D,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const observation={kind:'executive_readback_interruption_observation',observedAt:new Date().toISOString(),ownerPid:locked.ownerPid,
 pidProbe:'ESRCH',lockPath,lockDigest:product.sha256Bytes(bytes),logSize:before.size,logDevice:before.dev,logInode:before.ino,
 diagnostic:{path:join(D,'readback-02.stderr'),digest:await product.sha256File(join(D,'readback-02.stderr'))},
 scope:'Read-only replay process exhausted heap; original Run and the successful first Public read are closed. No writer or live actor is active.',
 authorization:'Executive continuation under user instruction do it; recover this exact abandoned read-only lock without changing event content.'};
await save('readback-recovery-observation.json',observation);
const core=await read(resolve(D,'../../../../../../abiogenesis/.ai-workspace/comments/codex/20260928_DECLARATION_RESOURCE/core-01/selected-core.json'));
const b=core.basis,requestArtifact={artifactPath:core.artifactPath,artifactRef:activation.abiArtifact.artifactRef,
 ...Object.fromEntries(['ArtifactDigest','ProductContentDigest','ManifestDigest','ProductId','PackageName','PackageVersion'].map(k=>['expected'+k,b[k[0].toLowerCase()+k.slice(1)]]))};
const observed={ref:pathToFileURL(join(D,'readback-recovery-observation.json')).href,digest:await product.sha256File(join(D,'readback-recovery-observation.json'))};
const request={kind:'abg_interrupted_event_resource_recovery',schemaVersion:'5.0.0',lastCloseHandoff:lastClose,
 expectedCurrent:{byteLength:prefix.prefixLength,digest:prefix.prefixDigest},abandonedLock:{path:lockPath,device:lock.dev,inode:lock.ino,bytesBase64:bytes.toString('base64'),digest:product.sha256Bytes(bytes)},
 interruption:{ownerPid:locked.ownerPid,evidence:observed,quiescenceEvidence:observed,exclusiveMaintenance:true},
 ownerArtifact:{request:requestArtifact,verified:activation.abiArtifact}};
const actorRef='actor://odd-glc/T-043/executive',value={actorRef,authorityMode:'trusted_developer'},approval={decision:'allow',actorRef,
 definitionRef:abg.ABG_EVENT_RESOURCE_RECOVERY.definitionRef,definitionDigest:abg.ABG_EVENT_RESOURCE_RECOVERY_DIGEST,
 requestDigest:hash(request),scopeDigest:abg.abgEventRecoveryScope(request).digest};
const authority={kind:'resolved_admission_authority',schemaVersion:'5.0.0',actorRef,authorityMode:'trusted_developer',
 authority:{ref:'authority://odd-glc/T-043/executive-continuation',digest:hash(value),value},
 approval:{ref:'approval://odd-glc/T-043/readback-interruption-01',digest:hash(approval),value:approval}};
await save('readback-recovery-selection.json',{request,authority});
const start=performance.now(),result=await abg.recoverInterruptedAbgEventResource(request,authority);
await save('readback-recovery-result.json',{result,elapsedMs:performance.now()-start});
assert.equal(result.kind,'abg_event_resource_recovery_receipt');assert.equal(result.outcome.kind,'recovered',JSON.stringify(result));
const after=await stat(log);assert.equal(after.size,before.size);assert.equal(after.ino,before.ino);
console.log(JSON.stringify({outcome:result.outcome.kind,unchangedPrefix:prefix}));
