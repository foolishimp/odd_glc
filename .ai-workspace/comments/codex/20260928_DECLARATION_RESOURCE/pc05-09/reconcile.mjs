// Reconcile only PC05-09's abandoned physical resource; this does not close or resume its Run.
import assert from 'node:assert/strict';
import {readFile,writeFile,stat,lstat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL,fileURLToPath} from 'node:url';
const D=import.meta.dirname,read=async p=>JSON.parse(await readFile(p,'utf8'));
const activation=await read(join(D,'activation.json'));
const pkg=await read(join(activation.coreRoot,'package.json'));
const api=async name=>import(pathToFileURL(join(activation.coreRoot,pkg.exports['./'+name].import)).href);
const [product,abg]=await Promise.all([api('product'),api('abg')]),hash=product.sha256Canonical;
const setup=await read(activation.setupReceiptPath),lastClose=setup.closeHandoff;
const current=await read(join(D,'recovery-physical-selection.json'));
assert.equal(current.ownerPid,25062);
const prefix=lastClose.prefix,log=fileURLToPath(prefix.eventLogRef),before=await stat(log);
assert.equal(before.size,current.byteLength);assert.equal(before.ino,prefix.storeIdentity.inode);assert.equal(before.dev,prefix.storeIdentity.device);
const lockPath=join(tmpdir(),'abiogenesis-event-store-locks-v5',`${before.dev}-${before.ino}.lock`);
const lock=await lstat(lockPath),bytes=await readFile(lockPath),locked=JSON.parse(bytes);
assert.equal(locked.ownerPid,25062);assert.equal(locked.device,before.dev);assert.equal(locked.inode,before.ino);
let absent=false;try{process.kill(locked.ownerPid,0);}catch(e){assert.equal(e.code,'ESRCH');absent=true;}assert(absent);
const save=(name,value)=>writeFile(join(D,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const observation={kind:'executive_native_run_interruption_observation',observedAt:new Date().toISOString(),ownerPid:locked.ownerPid,
 pidProbe:'ESRCH',lockPath,lockDigest:product.sha256Bytes(bytes),logSize:before.size,logDevice:before.dev,logInode:before.ino,
 diagnostic:{path:join(D,'execution/graphExecution.stderr'),digest:await product.sha256File(join(D,'execution/graphExecution.stderr'))},
 scope:'Native CLI aborted on heap exhaustion after an admitted judgment. The Run has no terminal or returned close; its history and no-actor diagnostic are preserved. PID25062 is absent; one Executive reserves maintenance and starts no other writer or recovery.',
 authorization:'Executive continuation under user instruction do it; reconcile this exact abandoned resource without changing event content, closing/resuming the Run, or authorizing another execution.'};
await save('recovery-observation.json',observation);
const core=await read(resolve(D,'../../../../../../abiogenesis/.ai-workspace/comments/codex/20260928_DECLARATION_RESOURCE/core-04/selected-core.json'));
const b=core.basis,requestArtifact={artifactPath:core.artifactPath,artifactRef:activation.abiArtifact.artifactRef,
 ...Object.fromEntries(['ArtifactDigest','ProductContentDigest','ManifestDigest','ProductId','PackageName','PackageVersion'].map(k=>['expected'+k,b[k[0].toLowerCase()+k.slice(1)]]))};
const observed={ref:pathToFileURL(join(D,'recovery-observation.json')).href,digest:await product.sha256File(join(D,'recovery-observation.json'))};
const request={kind:'abg_interrupted_event_resource_recovery',schemaVersion:'5.0.0',lastCloseHandoff:lastClose,
 expectedCurrent:{byteLength:current.byteLength,digest:current.digest},abandonedLock:{path:lockPath,device:lock.dev,inode:lock.ino,bytesBase64:bytes.toString('base64'),digest:product.sha256Bytes(bytes)},
 interruption:{ownerPid:locked.ownerPid,evidence:observed,quiescenceEvidence:observed,exclusiveMaintenance:true},
 ownerArtifact:{request:requestArtifact,verified:activation.abiArtifact}};
const actorRef='actor://odd-glc/T-043/executive',value={actorRef,authorityMode:'trusted_developer'},approval={decision:'allow',actorRef,
 definitionRef:abg.ABG_EVENT_RESOURCE_RECOVERY.definitionRef,definitionDigest:abg.ABG_EVENT_RESOURCE_RECOVERY_DIGEST,
 requestDigest:hash(request),scopeDigest:abg.abgEventRecoveryScope(request).digest};
const authority={kind:'resolved_admission_authority',schemaVersion:'5.0.0',actorRef,authorityMode:'trusted_developer',
 authority:{ref:'authority://odd-glc/T-043/executive-continuation',digest:hash(value),value},
 approval:{ref:'approval://odd-glc/T-043/pc05-09-resource-reconciliation',digest:hash(approval),value:approval}};
await save('recovery-selection.json',{request,authority});
const start=performance.now(),result=await abg.recoverInterruptedAbgEventResource(request,authority);
await save('recovery-result.json',{result,elapsedMs:performance.now()-start});
assert.equal(result.kind,'abg_event_resource_recovery_receipt');assert.equal(result.outcome.kind,'recovered',JSON.stringify(result));
const after=await stat(log);assert.equal(after.size,before.size);assert.equal(after.ino,before.ino);
console.log(JSON.stringify({outcome:result.outcome.kind,currentPrefix:result.outcome.closeHandoff.prefix,runClosure:"not_claimed"}));
