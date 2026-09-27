// One installed PC05 Run. No task dispatch, stage steering or automatic retry.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {installedFullSandboxApis,prepareFullSandboxTransport,fullSandboxTransportEnvironment}
 from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';

const read=async p=>JSON.parse(await readFile(p,'utf8')),exec=promisify(execFile);
const D=import.meta.dirname,repo=resolve(D,'../../../../..');
const [activationPath,...extra]=process.argv.slice(2);assert(activationPath&&!extra.length,'execute.mjs <activation.json>');
const activation=await read(resolve(activationPath));
const {product,abg}=await installedFullSandboxApis(activation.coreRoot);
assert.equal(activation.mode,'construction_evaluation_assessment');
for(const selected of [activation.sourceFreeze,activation.constructionReview,activation.callerFreeze])
 assert.equal(await product.sha256File(selected.path),selected.digest);
const source=await read(activation.sourceFreeze.path),caller=await read(activation.callerFreeze.path);
assert.deepEqual(activation.transport,source.transport);assert.equal(activation.timeoutMs,source.transport.wholeRunMs);
for(const row of [...source.files,...source.reusedUnchanged,...caller.files])
 assert.equal(await product.sha256File(join(repo,row.path)),row.sha256,row.path);
assert.equal(await product.sha256File(activation.launchPath),activation.launchDigest);
const launch=await read(activation.launchPath),call=launch.invocation,request=call.invocation.request,resources=call.resources,input=request.input.value;
assert.equal(call.invocation.definitionKey.operationId,'abg.operation.run.invoke');
assert.equal(call.invocation.definitionKey.memberKey,'start');assert.equal(request.rootMode,'direct');assert.equal(request.scope,'program');
assert.equal(input.kind,'lifecycle_native_construction_input');
assert.equal(product.sha256Canonical(input),request.input.valueDigest);
assert.deepEqual(resources.historicalSource.terminal,input.historicalSelection);
assert(input.sourceSelection.declarationReference);assert.equal(resources.historicalSource.declarationDependencies.length,1);
assert.equal(input.sourceSelection.prefix.eventLogRef,activation.preservedPrefix.eventLogRef);
assert.equal(resources.eventResource.closeHandoff.prefix.eventLogRef,activation.preservedPrefix.eventLogRef);
assert(!input.sourceSelection.graphCallRef.includes('component/'));
const publications=resources.catalog.boundPublications;
const program=publications.flatMap(p=>p.programs).find(p=>p.programRef===request.program.ref);assert(program);
const root=publications.flatMap(p=>p.graphFunctions).find(g=>g.name===program.starts[0].graphFunctionRef);assert(root);
assert.deepEqual(root.template.nodes.map(n=>n.term.graphFunctionRef),source.expectedRootCalls);
assert(program.callableMembership.includes(product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
assert(program.callableMembership.includes(product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
assert(!program.callableMembership.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef));
assert.equal(input.model.bindingRefs.length,15);assert.equal(input.model.duties.length,38);
assert.equal(input.assessment.recordSelections.length,15);assert.equal(input.constructionGroups.length,1);
assert.deepEqual(input.constructionGroups[0].writeRoots,source.selectedWriteRoots);
const output=resolve(activation.outputRoot);await mkdir(output,{recursive:false});
const save=(name,value)=>writeFile(join(output,name),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const timings={},setup=await read(activation.setupReceiptPath);
const frozen=await prepareFullSandboxTransport(activation.transport,{product,abg});
assert.equal(frozen.configuration.model,'claude-opus-5-5');assert.equal(frozen.configuration.effort,'xhigh');
await save('transport.json',frozen);
const before=(await stat(fileURLToPath(activation.preservedPrefix.eventLogRef))).size;
assert.equal(before,resources.eventResource.closeHandoff.prefix.prefixLength);
await save('execution-basis.json',{activationPath:resolve(activationPath),activationDigest:await product.sha256File(resolve(activationPath)),
 sourceFreeze:activation.sourceFreeze,constructionReview:activation.constructionReview,callerFreeze:activation.callerFreeze,
 launchDigest:activation.launchDigest,beforeBytes:before,startedAt:new Date().toISOString(),transportDigest:frozen.transportDigest,
 setup:{packageMs:setup.packageMs,installMs:setup.installMs,setupMs:setup.setupMs,timingLimitation:setup.packageTimingLimitation}});
let receipt;
try{
 const started=performance.now();let processResult;
 try{processResult=await exec(process.execPath,[activation.cliPath,'--jsonl',activation.launchPath],{cwd:output,
  env:fullSandboxTransportEnvironment(frozen,process.env),timeout:activation.timeoutMs,maxBuffer:128*1024*1024});}
 catch(error){processResult={stdout:error.stdout??'',stderr:error.stderr??''};
  await save('process-failure.json',{message:error.message,code:error.code??null,signal:error.signal??null});}
 timings.graphExecutionMs=performance.now()-started;
 await save('graphExecution.json',processResult.stdout);await save('graphExecution.stderr',processResult.stderr);
 receipt=JSON.parse(processResult.stdout).receipt;
 if(!receipt?.ownerOutput?.value?.run)throw new Error('Run not admitted: '+JSON.stringify(receipt?.failure??receipt?.ownerOutput));
 await save('execution-complete.json',{timings,disposition:receipt.ownerOutput.value.disposition,run:receipt.ownerOutput.value.run,
  closeHandoff:receipt.resources.eventResource.closeHandoff,completedAt:new Date().toISOString()});
 const driver=join(repo,'build_tenants/odd_glc/typescript/test/abi5-installed-program-construction.test.mjs');
 const readStart=performance.now(),fresh=await exec(process.execPath,[driver,'--readback',resolve(activationPath),join(output,'graphExecution.json'),output],
  {cwd:output,env:{...process.env,NODE_OPTIONS:'',ABG_TS_CLAUDE_COMMAND:'/unavailable/readback-has-no-actors'},timeout:activation.timeoutMs,maxBuffer:2*1024*1024});
 timings.freshReadbackMs=performance.now()-readStart;await save('fresh-readback.stderr',fresh.stderr);
 const readback=JSON.parse(fresh.stdout);assert.equal(readback.acquisitions,2);
 assert.deepEqual(readback.closeHandoff.prefix,receipt.resources.eventResource.closeHandoff.prefix);
 const reads=await Promise.all(['run_result','run_replay'].map(async name=>(await read(join(output,'fresh-'+name+'.json'))).receipt));
 const terminal=reads[0].ownerOutput.value.projection?.terminalResult??null;
 assert.deepEqual(terminal,reads[1].ownerOutput.value.projection.terminalResult??null);
 const value=terminal?.value??null,counts=readback.counts;
 assert(!counts.graphFunctions.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef),'no C2 rerun');
 if(receipt.ownerOutput.value.disposition==='completed'){
  assert.equal(value?.kind,'lifecycle_assessment_state');
  assert(['satisfied','unsatisfied'].includes(value.assessmentDisposition));
  assert(['true','false','unknown'].includes(value.computedEvidenceDisposition));
  assert.equal(value.originalTaskCompletion,'not_claimed');assert.equal(value.semanticClosure,'not_claimed');
  assert.equal(value.acceptedResultsDisposition,'requires_separate_owner_conjunction');
  assert.equal(counts.actorOccurrenceCount,2);
  assert(counts.graphFunctions.includes(product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
  assert(counts.graphFunctions.includes(product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
  await save('terminal-value.json',value);
 }
 const after=(await stat(fileURLToPath(activation.preservedPrefix.eventLogRef))).size;
 const result={status:'installed_PC05_outcome_observed',disposition:receipt.ownerOutput.value.disposition,run:receipt.ownerOutput.value.run,
  terminalResult:receipt.ownerOutput.value.result,assessmentDisposition:value?.assessmentDisposition??null,
  computedEvidenceDisposition:value?.computedEvidenceDisposition??null,interpretation:value?.interpretation??null,
  timings:{...timings,...readback.timings},setup:{packageMs:setup.packageMs,installMs:setup.installMs,setupMs:setup.setupMs},counts,
  log:{beforeBytes:before,afterBytes:after,appendedBytes:after-before},closeHandoff:readback.closeHandoff,
  originalTaskCompletion:'not_claimed',s06Closure:'not_claimed',releaseReadiness:'not_claimed'};
 await save('result.json',result);console.log(JSON.stringify(result));
}catch(error){await save('first-cause.json',{message:error.message,stack:error.stack,timings,
 disposition:receipt?.ownerOutput?.value?.disposition??null,run:receipt?.ownerOutput?.value?.run??null});throw error;}
