// Transport-only successor. Reuse admitted Products and unchanged worksite;
// construct one ordinary new Public invocation at the genuine latest close.
import assert from 'node:assert/strict';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {installedFullSandboxApis,prepareFullSandboxTransport}
 from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';
import {definitionCall} from '../../../../../build_tenants/odd_glc/typescript/test/generic-live-workflow-support.mjs';
const D=import.meta.dirname,repo=resolve(D,'../../../../..'),prior=join(D,'../pc05-02');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const save=(n,v)=>writeFile(join(D,n),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const started=performance.now(),activation=await read(join(prior,'activation.json'));
const {product,abg,installedPublic}=await installedFullSandboxApis(activation.coreRoot);
const bind=async p=>({path:p,digest:await product.sha256File(p)});
const priorResult=await read(join(prior,'execution/result.json'));
assert.equal(priorResult.disposition,'runtime_failed');
const diagnostic=await read(join(prior,'execution/actor-diagnostic.json'));
const hostFailure=diagnostic.find(r=>r.kind==='actor_result_artifact_observed');
assert(hostFailure.finalOutput.includes('version 2.1.280 or newer is required'));
assert.equal(hostFailure.toolCallCount,0);assert.equal(hostFailure.timedOut,false);
const old=await read(activation.launchPath),receipt=(await read(join(D,'../pc05-03/execution/graphExecution.json'))).receipt;
const closeHandoff=receipt.resources.eventResource.closeHandoff;
assert.deepEqual(closeHandoff,priorResult.closeHandoff);
assert.equal((await stat(new URL(closeHandoff.prefix.eventLogRef))).size,closeHandoff.prefix.prefixLength);
const oldCall=old.invocation,input=oldCall.invocation.request.input.value,ctx=input.currentContext;
const current=await product.observeWorksiteContext({...input.authority,
 readRoots:ctx.readRoots,maxFiles:ctx.maxFiles,maxBytes:ctx.maxBytes});
assert.deepEqual(current,ctx,'complete worksite observation unchanged after rejected host invocation');
await save('worksite-conservation.json',{priorRun:priorResult.run,contextDigest:product.sha256Canonical(current),
 files:current.entries.filter(e=>e.state==='file').map(e=>({path:e.relativePath,digest:e.digest,bytes:e.byteLength})),
 relation:'Exact owning observation equality; no candidate edits or new evidence of task success.'});
const transport={...activation.transport,command:'/Users/jim/.local/share/claude/versions/2.1.280',expectedVersion:'2.1.280 (Claude Code)'};
const checked=await prepareFullSandboxTransport(transport,{product,abg});
await save('selected-transport.json',checked);
const resources={...oldCall.resources,eventResource:{kind:'reopen_abg_event_resource',schemaVersion:'5.0.0',closeHandoff,handoffDigest:product.sha256Canonical(closeHandoff)}};
const steeringDigest=product.sha256Canonical(resources.eventResource);
const slots={...oldCall.invocation.invocationAuthority.slots,transport_steering:{
 ref:'transport-steering://abiogenesis/'+steeringDigest.slice(7),digest:steeringDigest}};
const call=definitionCall({publicApi:installedPublic,product,verified:activation.abiArtifact,
 operationId:'abg.operation.run.invoke',memberKey:'start',ordinal:10015,
 request:oldCall.invocation.request,slots,resources});
assert.notEqual(call.invocation.invocationRef,oldCall.invocation.invocationRef);
assert.deepEqual(call.invocation.request,oldCall.invocation.request);
const authority=call.invocation.invocationAuthority,{authorityDigest,...authorityBody}=authority;
assert.equal(product.sha256Canonical(authorityBody),authorityDigest);
assert.equal(authority.slots.transport_steering.digest,product.sha256Canonical(call.resources.eventResource));
assert.equal(authority.slots.transport_steering.ref,'transport-steering://abiogenesis/'+steeringDigest.slice(7));
assert.equal(call.resources.eventResource.handoffDigest,product.sha256Canonical(closeHandoff));
for(const [key,value] of Object.entries(oldCall.invocation.invocationAuthority.slots))
 if(key!=='transport_steering')assert.deepEqual(authority.slots[key],value,key);
const stale=await read(join(D,'../pc05-03/start.jsonl'));
assert.notEqual(stale.invocation.invocation.invocationAuthority.slots.transport_steering.digest,
 product.sha256Canonical(stale.invocation.resources.eventResource),'retained refused caller discriminates the failed relation');
await save('steering-discriminator.json',{status:'exact_failed_relation_corrected',priorRefusedInvocation:stale.invocation.invocation.invocationRef,
 oldSteering:stale.invocation.invocation.invocationAuthority.slots.transport_steering,newSteering:authority.slots.transport_steering,
 currentResourceDigest:steeringDigest,nonSteeringSlots:'unchanged',request:'unchanged',productAuthority:'unchanged',
 publicAuthorityDigest:authorityDigest,scope:'Pure exact relation; actual admission remains pending'});
await writeFile(join(D,'start.jsonl'),JSON.stringify({...old,acquisition:{kind:'reopen',closeHandoff},invocation:call})+'\n',{flag:'wx'});
const freeze=await read(activation.sourceFreeze.path);
for(const row of [...freeze.files,...freeze.reusedUnchanged])assert.equal(await product.sha256File(join(repo,row.path)),row.sha256,row.path);
freeze.subject='PC05-04 transport successor with current event-resource steering: installed PC05-02 Products, original request and context; supported native host';
freeze.transport=transport;
freeze.files.push({path:join(D,'resume.mjs').slice(repo.length+1),sha256:await product.sha256File(join(D,'resume.mjs')),bytes:(await stat(join(D,'resume.mjs'))).size});
freeze.transportSuccessor={prior:activation.sourceFreeze,priorRun:priorResult.run,changed:['transport.command','transport.expectedVersion','Public invocation transport_steering bound to genuine current event resource'],
 coreAndConsumerProducts:'reused unchanged',semanticRequest:'unchanged',worksite:'exact owning observation unchanged'};
await save('source-freeze.json',freeze);
await save('setup-receipt.json',{packageMs:0,installMs:0,setupMs:performance.now()-started,
 reusedSetup:await bind(activation.setupReceiptPath),priorRun:priorResult.run,closeHandoff,
 scope:'No package, install, catalog rebuild, journal acquisition or setup event. One current worksite observation, host version selection and pure Public caller construction.'});
const next={...activation,sourceFreeze:await bind(join(D,'source-freeze.json')),launchPath:join(D,'start.jsonl'),
 launchDigest:await product.sha256File(join(D,'start.jsonl')),setupReceiptPath:join(D,'setup-receipt.json'),
 outputRoot:join(D,'execution'),transport,callerFreeze:null,
 executiveSelection:'One PC05 successor on the same admitted Products/worksite/history after host version refusal and corrected exact steering relation. Select installed Claude Code 2.1.280; model, effort, scope and limits unchanged. No reinstall, retry loop, C2 or history transplant.'};
await save('activation-pending-review.json',next);
console.log(JSON.stringify({status:'transport_successor_prepared_no_Run',sourceFreeze:next.sourceFreeze,
 invocationRef:call.invocation.invocationRef,inputDigest:call.invocation.request.input.valueDigest,
 entryBytes:closeHandoff.prefix.prefixLength,setupMs:performance.now()-started,transport:checked.configuration}));
