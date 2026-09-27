// Explicit installed qualification driver. Merely importing/testing this file
// performs no runtime operation. --execute requires a separately reviewed and
// admitted launch packet; setup and publication precede this ordinary Run.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {publicReadDefinition} from './generic-live-workflow-support.mjs';
const exec=promisify(execFile),read=async path=>JSON.parse(await readFile(path,'utf8'));
async function installedApis(root){const pkg=await read(join(root,'package.json'));
 return Object.fromEntries(await Promise.all(['product','gtl','abg','public'].map(async name=>{
  const exp=pkg.exports['./'+name],path=typeof exp==='string'?exp:exp.import;
  assert(path.startsWith('./build/')&&!path.includes('..'));
  return [name==='public'?'installedPublic':name,await import(pathToFileURL(join(root,path)).href)];})));}
const save=(root,name,value)=>writeFile(join(root,name),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});

// The reviewed mode selects an ordinary declared topology, never a test-time
// traversal controller. This helper performs no native or filesystem operation.
export function checkInstalledConstructionTopology({product,activation,input,catalog,programRef}) {
 const mode=activation.mode??'evaluate_only';assert(['evaluate_only','construction_only'].includes(mode));
 const program=catalog.boundPublications.flatMap(p=>p.programs).find(p=>p.programRef===programRef);assert(program);
 const root=catalog.boundPublications.flatMap(p=>p.graphFunctions).find(g=>g.name===program.starts[0].graphFunctionRef);assert(root);
 const ref=name=>'graph-function://odd-glc/program-construction/'+name+'@5';
 let expectedCalls;
 if(mode==='evaluate_only') {
  assert.equal(input.kind,'lifecycle_construction_input');
  expectedCalls=[ref('authenticate'),product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,ref('prepare-evaluation'),input.evaluator.graphFunction.ref];
  assert.deepEqual(root.effects,[]);
  const evaluator=catalog.boundPublications.flatMap(p=>p.graphFunctions).find(g=>g.name===input.evaluator.graphFunction.ref);
  assert.equal(product.sha256Canonical(evaluator),input.evaluator.graphFunction.digest);
 }else {
  assert.equal(input.kind,'lifecycle_native_construction_input');assert.equal(activation.expectation,'predecessor_refusal');
  assert(input.constructionGroups.length>0);
  expectedCalls=[ref('authenticate-construction'),product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,ref('prepare-construction'),
    ...input.constructionGroups.map(()=>ref('construction-child'))];
  assert.deepEqual(root.effects,[product.NATIVE_WORKSPACE_WORK_IDS.effectUri]);
  const children=catalog.boundPublications.flatMap(p=>p.graphFunctions).filter(g=>g.name===ref('construction-child'));assert.equal(children.length,1);
  const child=children[0];assert.deepEqual(child.template.nodes.map(n=>n.term.graphFunctionRef),
    [ref('prepare-native-task'),product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef,ref('join-native-output')]);
  assert.deepEqual(child.template.edges[1].inputBinding,product.graphInputRetentionBinding(
    'contract://odd-glc/program-construction/construction-state@5',product.NATIVE_WORKSPACE_WORK_IDS.observationContractRef));
  assert(program.callableMembership.includes(product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
  assert(!program.callableMembership.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef));
  assert(!program.callableMembership.includes(product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
 }
 assert.deepEqual(root.template.nodes.map(n=>n.term.graphFunctionRef),expectedCalls,'only the reviewed ordinary child composition may enter');
 return {mode,root,expectedCalls};
}

// This reads the installed owner's projection; it never opens/parses the journal.
export function occurrenceCounts(abg,prefix,run){
 const selected=abg.projectRuntimePrefixesAtDurablePrefix(prefix,run.ref);
 const projected=abg.projectRunSemanticReplayProjection(selected.authorityPrefix,run.ref,prefix);
 assert.equal(projected.kind,'run_semantic_relation_view');
 assert.equal(projected.runId,run.ref);
 const atoms=projected.eventAtoms;assert(Array.isArray(atoms));
 const calls=atoms.filter(a=>a.eventKind==='graph_call_opened'),cCalls=atoms.filter(a=>a.eventKind==='c_call_opened');
 const actorAtoms=atoms.filter(a=>a.eventKind.startsWith('actor_'));
 return {projectionRef:projected.viewRef,projectionDigest:projected.viewDigest,
  graphCallCount:calls.length,cCallCount:cCalls.length,actorEventCount:actorAtoms.length,
  actorOccurrenceCount:new Set(actorAtoms.filter(a=>a.eventKind==='actor_invocation_started').map(a=>a.aggregateId)).size,
  graphFunctions:calls.map(a=>a.graphFunctionRef),cCallRefs:cCalls.map(a=>a.aggregateId),
  failures:selected.authorityPrefix.events.filter(e=>e.runId===run.ref&&e.kind==='runtime_failure_observed')
   .map(e=>({eventId:e.eventId,payload:e.payload}))};
}

// Public project-read owns reopen/close. Each cold read gets its own process:
// a completed first projection must not retain a second decoded history.
export async function readInstalledConstructionMember(activationPath,receiptPath,rootDir,memberKey){
 assert(['run_result','run_replay'].includes(memberKey));
 const activation=await read(activationPath),{product,abg,installedPublic}=await installedApis(activation.coreRoot);
 const receipt=(await read(receiptPath)).receipt,closeHandoff=receipt.resources.eventResource.closeHandoff;
 const timings={};
 try{
  const definition=publicReadDefinition({product,abg,installedPublic,workspaceAuthorityBasis:activation.environment.workspaceAuthorityBasis,
   workspaceBinding:activation.environment.workspaceBinding,admittedInstalls:activation.environment.productInstalls,
   install:{verified:activation.abiArtifact}},{receipt,closeHandoff},memberKey);
  const began=performance.now(),result=await installedPublic.runInstalledDefinitionCallTransport({kind:'reopen',closeHandoff},definition);
  timings[memberKey+'Ms']=performance.now()-began;
  await save(rootDir,'fresh-'+memberKey+'.json',result);
  assert.equal(result.kind,'installed_definition_call_transport_result');
  if(!result.receipt.ownerOutput)throw new Error('Public '+memberKey+' failed: '+JSON.stringify(result.receipt.failure));
  const expectedAbsence=memberKey==='run_result'&&receipt.ownerOutput.value.disposition==='runtime_failed'&&
   receipt.ownerOutput.value.result===null&&result.receipt.ownerOutput.outcomeKind==='refusal'&&
   result.receipt.ownerOutput.value.code==='not_found';
  if(expectedAbsence)assert.equal(result.receipt.exitCode,1);
  else {assert.equal(result.receipt.ownerOutput.outcomeKind,'result');assert.equal(result.receipt.exitCode,0);}
  const completion=result.receipt.resources.eventResource;
  assert.equal(completion.kind,'abg_event_resource_receipt');assert.equal(completion.acquisitionKind,'reopen');
  assert.deepEqual(completion.entryPrefix,closeHandoff.prefix);assert.deepEqual(completion.closeHandoff.prefix,closeHandoff.prefix);
  let counts=null;
  if(memberKey==='run_replay'){
   const countStart=performance.now();counts=occurrenceCounts(abg,completion.entryPrefix,receipt.ownerOutput.value.run);
   timings.ownerCountReadMs=performance.now()-countStart;
  }
  return {timings,counts,closeHandoff,acquisitions:1,memberKey};
 }catch(error){await save(rootDir,memberKey+'-readback-first-cause.json',{message:error.message,stack:error.stack,timings});throw error;}
}

export async function readInstalledConstruction(activationPath,receiptPath,rootDir){
 const activation=await read(activationPath),timings={};let replay;
 for(const member of ['run_result','run_replay']){
  const began=performance.now(),child=await exec(process.execPath,[fileURLToPath(import.meta.url),'--readback-member',activationPath,receiptPath,rootDir,member],
   {cwd:rootDir,env:{...process.env,NODE_OPTIONS:'',ABG_TS_CLAUDE_COMMAND:'/unavailable/readback-has-no-actors'},timeout:activation.timeoutMs,maxBuffer:2*1024*1024});
  await save(rootDir,'fresh-'+member+'.stderr',child.stderr);
  const value=JSON.parse(child.stdout);assert.equal(value.acquisitions,1);Object.assign(timings,value.timings);
  timings[member+'ProcessMs']=performance.now()-began;
  if(member==='run_replay')replay=value;
 }
 const result={timings,counts:replay.counts,closeHandoff:replay.closeHandoff,acquisitions:2,projections:['run_result','run_replay'],
  boundary:'Two existing Public reopen/close calls in separate fresh processes; counts reuse replay owner prefix. No third recovery or journal copy.'};
 await save(rootDir,'fresh-readback.json',result);return result;
}

export async function runInstalledConstruction(activationPath){
 const activation=await read(activationPath),{product,gtl,abg,installedPublic}=await installedApis(activation.coreRoot);
 assert.equal(activation.kind,'reviewed_program_construction_activation');
 for(const row of [activation.sourceFreeze,activation.mode==='construction_only'?activation.constructionReview:activation.evaluatorReview])
  assert.equal(await product.sha256File(row.path),row.digest);
 assert.equal(await product.sha256File(activation.launchPath),activation.launchDigest);
 // The setup receipt reports actual separately timed operations. No duration is inferred.
 const setup=await read(activation.setupReceiptPath);
 for(const field of ['packageMs','installMs','setupMs'])assert(Number.isFinite(setup[field])&&setup[field]>=0,field);
 const launch=await read(activation.launchPath),call=launch.invocation,resources=call.resources;
 const request=call.invocation.request,input=request.input.value,catalog=resources.catalog;
 assert.equal(call.invocation.definitionKey.operationId,'abg.operation.run.invoke');
 assert.equal(call.invocation.definitionKey.memberKey,'start');
 assert.equal(request.rootMode,'direct');assert.equal(request.scope,'program');
 assert.deepEqual(resources.historicalSource.terminal,input.historicalSelection);
 assert.equal(resources.historicalSource.kind,'abg_historical_graph_call_source_resource');
 assert.equal(input.sourceSelection.prefix.eventLogRef,activation.preservedPrefix.eventLogRef);
 assert.equal(resources.eventResource.closeHandoff.prefix.eventLogRef,activation.preservedPrefix.eventLogRef);
 assert(resources.eventResource.closeHandoff.prefix.prefixLength>=activation.preservedPrefix.prefixLength);
 assert(!input.sourceSelection.graphCallRef.includes('component/'),'no structural component premise is a launch selector');
 const {mode,root,expectedCalls}=checkInstalledConstructionTopology({product,activation,input,catalog,programRef:request.program.ref});
 assert.equal(product.sha256Canonical(input),request.input.valueDigest);
 for(const install of activation.environment.productInstalls)assert.equal(await product.installedProductContentMatches(install),true);
 const rootDir=resolve(activation.outputRoot);await mkdir(rootDir,{recursive:false});
 const timings={packageMs:setup.packageMs,installMs:setup.installMs,setupMs:setup.setupMs};
 const before=(await stat(fileURLToPath(activation.preservedPrefix.eventLogRef))).size;
 async function cli(path,name){let result;const start=performance.now();
  try{result=await exec(process.execPath,[activation.cliPath,'--jsonl',path],{cwd:rootDir,
   env:{...process.env,NODE_OPTIONS:'',ABG_TS_CLAUDE_COMMAND:'/unavailable/program-construction-has-no-actors'},timeout:activation.timeoutMs,maxBuffer:64*1024*1024});}
  catch(error){result={stdout:error.stdout??'',stderr:error.stderr??String(error)};await save(rootDir,name+'-process-failure.json',{message:error.message,code:error.code??null});}
  await save(rootDir,name+'.json',result.stdout);await save(rootDir,name+'.stderr',result.stderr);
  timings[name+'Ms']=performance.now()-start;
  return JSON.parse(result.stdout).receipt;
 }
 let receipt;
 try{
  receipt=await cli(activation.launchPath,'graphExecution');
  const closeHandoff=receipt.resources.eventResource.closeHandoff,run=receipt.ownerOutput.value.run;
  assert(run,'preserve the first owner refusal if no Run was admitted');
  const readStart=performance.now();
  const fresh=await exec(process.execPath,[fileURLToPath(import.meta.url),'--readback',activationPath,join(rootDir,'graphExecution.json'),rootDir],
   {cwd:rootDir,env:{...process.env,NODE_OPTIONS:'',ABG_TS_CLAUDE_COMMAND:'/unavailable/program-construction-has-no-actors'},timeout:activation.timeoutMs,maxBuffer:1024*1024});
  timings.freshReadbackMs=performance.now()-readStart;await save(rootDir,'fresh-readback.stderr',fresh.stderr);
  const readback=JSON.parse(fresh.stdout);assert.equal(readback.acquisitions,2);assert.deepEqual(readback.closeHandoff.prefix,closeHandoff.prefix);
  Object.assign(timings,readback.timings);const counts=readback.counts,reads={};
  for(const memberKey of ['run_result','run_replay'])reads[memberKey]=(await read(join(rootDir,'fresh-'+memberKey+'.json'))).receipt;
  assert.equal(counts.actorEventCount,0);assert.equal(counts.actorOccurrenceCount,0);
  assert(!counts.graphFunctions.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef));
  assert(!counts.graphFunctions.includes(gtl.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
  assert(!counts.graphFunctions.includes(gtl.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
  const value=reads.run_result.ownerOutput.value.projection?.terminalResult?.value;
  if(activation.expectation==='computed_records'){
   assert.equal(mode,'evaluate_only');
   assert.equal(receipt.ownerOutput.value.disposition,'completed');assert(value);
   assert.equal(value.evidenceRole,'computed_derivation');assert.equal(value.originalTaskCompletion,'not_claimed');
   assert.deepEqual(value.execution,input.origin.execution);assert.deepEqual(value.construction,input.origin.construction);
   assert.deepEqual(value.records.derivationBasis.executionObservation,{ref:input.origin.observation.observationRef,digest:input.origin.observation.observationDigest});
   assert.deepEqual(value.selectedDutyRefs,input.selectedDutyRefs);assert.equal(value.carriedBindingRefs.length,13);
   const expected=await read(activation.expectedRecordsPath);
   for(const [key,record] of Object.entries(expected))assert.deepEqual(value.records[key],record,key);
   assert.equal(counts.graphCallCount,5);assert.equal(counts.cCallCount,8);
   assert.deepEqual(counts.graphFunctions,[root.name,...expectedCalls]);
   assert.deepEqual(reads.run_result.ownerOutput.value.projection.terminalResult,reads.run_replay.ownerOutput.value.projection.terminalResult);
  }else{
   assert.equal(activation.expectation,mode==='construction_only'?'predecessor_refusal':'source_refusal');
   assert.notEqual(receipt.ownerOutput.value.disposition,'completed');assert.equal(value,undefined);
   if(mode==='construction_only')assert(counts.graphFunctions.includes('graph-function://odd-glc/program-construction/prepare-construction@5'),
     'the wrong predecessor must reach actual acquired-context preparation');
   else assert(!counts.graphFunctions.includes(input.evaluator.graphFunction.ref));
   if(activation.expectedDiagnostic){
    const diagnostics=JSON.stringify(counts.failures);
    assert(diagnostics.includes(activation.expectedDiagnostic)||diagnostics.includes(encodeURIComponent(activation.expectedDiagnostic)),
     'the admitted runtime failure must retain the selected first cause');
   }
  }
  const after=(await stat(fileURLToPath(activation.preservedPrefix.eventLogRef))).size;
  const result={status:'installed_discriminator_observed',mode,expectation:activation.expectation,run,result:receipt.ownerOutput.value.result??null,
   preservedPrefix:activation.preservedPrefix,prefix:closeHandoff.prefix,timings,counts,log:{beforeBytes:before,afterBytes:after,appendedBytes:after-before},
   originalTaskCompletion:'not_claimed',s06Closure:'not_claimed'};
  await save(rootDir,'result.json',result);return result;
 }catch(error){await save(rootDir,'first-cause.json',{message:error.message,stack:error.stack,timings,receiptDisposition:receipt?.ownerOutput??null});throw error;}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv[2]==='--execute'){
 if(!process.argv[3]||process.argv[4])throw new TypeError('usage: --execute <reviewed-owner-activation.json>');
 console.log(JSON.stringify(await runInstalledConstruction(resolve(process.argv[3]))));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv[2]==='--readback'){
 if(!process.argv[3]||!process.argv[4]||!process.argv[5]||process.argv[6])throw new TypeError('usage: --readback <activation.json> <run-receipt.json> <output-root>');
 console.log(JSON.stringify(await readInstalledConstruction(resolve(process.argv[3]),resolve(process.argv[4]),resolve(process.argv[5]))));
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv[2]==='--readback-member'){
 if(!process.argv[3]||!process.argv[4]||!process.argv[5]||!process.argv[6]||process.argv[7])throw new TypeError('usage: --readback-member <activation.json> <run-receipt.json> <output-root> <member>');
 console.log(JSON.stringify(await readInstalledConstructionMember(resolve(process.argv[3]),resolve(process.argv[4]),resolve(process.argv[5]),process.argv[6])));
}
