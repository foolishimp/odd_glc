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
  actorOccurrenceCount:new Set(actorAtoms.map(a=>a.aggregateId)).size,
  graphFunctions:calls.map(a=>a.graphFunctionRef),cCallRefs:cCalls.map(a=>a.aggregateId)};
}

export async function runInstalledConstruction(activationPath){
 const activation=await read(activationPath),{product,gtl,abg,installedPublic}=await installedApis(activation.coreRoot);
 assert.equal(activation.kind,'reviewed_program_construction_activation');
 for(const row of [activation.sourceFreeze,activation.evaluatorReview])assert.equal(await product.sha256File(row.path),row.digest);
 assert.equal(await product.sha256File(activation.launchPath),activation.launchDigest);
 // The setup receipt reports actual separately timed operations. No duration is inferred.
 const setup=await read(activation.setupReceiptPath);
 for(const field of ['packageMs','installMs','setupMs'])assert(Number.isFinite(setup[field])&&setup[field]>=0,field);
 const launch=await read(activation.launchPath),call=launch.invocation,resources=call.resources;
 const request=call.invocation.request,input=request.input.value,catalog=resources.catalog;
 assert.equal(call.invocation.definitionKey.operationId,'abg.operation.run.invoke');
 assert.equal(call.invocation.definitionKey.memberKey,'start');
 assert.equal(request.rootMode,'direct');assert.equal(request.scope,'program');
 assert.equal(input.kind,'lifecycle_construction_input');
 assert.deepEqual(resources.historicalSource.terminal,input.historicalSelection);
 assert.equal(resources.historicalSource.kind,'abg_historical_graph_call_source_resource');
 assert.equal(input.sourceSelection.prefix.eventLogRef,activation.preservedPrefix.eventLogRef);
 assert.equal(resources.eventResource.closeHandoff.prefix.eventLogRef,activation.preservedPrefix.eventLogRef);
 assert(resources.eventResource.closeHandoff.prefix.prefixLength>=activation.preservedPrefix.prefixLength);
 assert(!input.sourceSelection.graphCallRef.includes('component/'),'no structural component premise is a launch selector');
 const program=catalog.boundPublications.flatMap(p=>p.programs).find(p=>p.programRef===request.program.ref);assert(program);
 const root=catalog.boundPublications.flatMap(p=>p.graphFunctions).find(g=>g.name===program.starts[0].graphFunctionRef);assert(root);
 const expectedCalls=['graph-function://odd-glc/program-construction/authenticate@5',
  product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,'graph-function://odd-glc/program-construction/prepare-evaluation@5',input.evaluator.graphFunction.ref];
 assert.deepEqual(root.template.nodes.map(n=>n.term.graphFunctionRef),expectedCalls,
  'only the reviewed four callable composition may enter');
 assert.deepEqual(root.effects,[]);
 const evaluator=catalog.boundPublications.flatMap(p=>p.graphFunctions).find(g=>g.name===input.evaluator.graphFunction.ref);
 assert.equal(product.sha256Canonical(evaluator),input.evaluator.graphFunction.digest);
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
  const reads={};
  for(const memberKey of ['run_result','run_replay']){
   const definition=publicReadDefinition({product,abg,installedPublic,workspaceAuthorityBasis:activation.environment.workspaceAuthorityBasis,
    workspaceBinding:activation.environment.workspaceBinding,admittedInstalls:activation.environment.productInstalls,
    install:{verified:activation.abiArtifact}}, {receipt,closeHandoff},memberKey);
   const path=join(rootDir,memberKey+'.jsonl');
   await writeFile(path,JSON.stringify({kind:'abg_cli_transport_request',schemaVersion:'5.0.0',acquisition:{kind:'reopen',closeHandoff},invocation:definition})+'\n',{flag:'wx'});
   const fresh=await cli(path,'fresh-'+memberKey);assert.deepEqual(fresh.resources.eventResource.closeHandoff.prefix,closeHandoff.prefix);
   reads[memberKey]=fresh;
  }
  const countStart=performance.now(),counts=occurrenceCounts(abg,closeHandoff.prefix,run);timings.ownerCountReadMs=performance.now()-countStart;
  assert.equal(counts.actorEventCount,0);assert.equal(counts.actorOccurrenceCount,0);
  assert(!counts.graphFunctions.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef));
  assert(!counts.graphFunctions.includes(gtl.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
  assert(!counts.graphFunctions.includes(gtl.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
  const value=reads.run_result.ownerOutput.value.projection?.terminalResult?.value;
  if(activation.expectation==='computed_records'){
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
   assert.equal(activation.expectation,'source_refusal');assert.notEqual(receipt.ownerOutput.value.disposition,'completed');
   assert.equal(value,undefined);assert(!counts.graphFunctions.includes(input.evaluator.graphFunction.ref));
  }
  const after=(await stat(fileURLToPath(activation.preservedPrefix.eventLogRef))).size;
  const result={status:'installed_discriminator_observed',expectation:activation.expectation,run,result:receipt.ownerOutput.value.result??null,
   preservedPrefix:activation.preservedPrefix,prefix:closeHandoff.prefix,timings,counts,log:{beforeBytes:before,afterBytes:after,appendedBytes:after-before},
   originalTaskCompletion:'not_claimed',s06Closure:'not_claimed'};
  await save(rootDir,'result.json',result);return result;
 }catch(error){await save(rootDir,'first-cause.json',{message:error.message,stack:error.stack,timings,receiptDisposition:receipt?.ownerOutput??null});throw error;}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv[2]==='--execute'){
 if(!process.argv[3]||process.argv[4])throw new TypeError('usage: --execute <reviewed-owner-activation.json>');
 console.log(JSON.stringify(await runInstalledConstruction(resolve(process.argv[3]))));
}
