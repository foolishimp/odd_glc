// Shared component premises. Native source/executor/assessor observations below
// are supplied fixture values, never admitted runtime or semantic success.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import * as p from '@abiogenesis/typescript-tenant/product';
const consumerRoot=process.env.ABI5_CONSUMER_ROOT;
const r=consumerRoot?await import(pathToFileURL(join(consumerRoot,JSON.parse(await fs.readFile(join(consumerRoot,'package.json'),'utf8')).exports['./native-continuation'])).href):await import('../../src/native-continuation-runtime.mjs');
const root=process.env.ABI5_COMPONENT_ROOT;if(!root)throw Error('explicit component core required');
const load=path=>import(pathToFileURL(join(root,path)).href);
const {worksiteFixture,loadWorksiteOwner}=await import(pathToFileURL(join(process.env.ABI5_FIXTURE_ROOT??root,'test_env/support/t287-generic-job-worksite.mjs')).href);
export const physical=await loadWorksiteOwner(),native=await load('build/code/src/product/native_workspace_work.js'),c2=await load('build/code/src/product/worksite_command_execution.js');
const store=await load('build/code/src/abg/event_store.js');
const hash=p.sha256Canonical,version='5.0.0',h=hash('uninstalled-component');
export const provenance=label=>({cCallRef:'c-call://component/'+label,executionAuthorityRef:'authority://component/'+label,executionAuthorityDigest:hash(label),actorInvocationRef:'actor-invocation://component/'+label,transportBindingRef:'transport://component',transportBindingDigest:h,promptDigest:h,transportDigest:h});
export const stream=text=>({kind:'worksite_observed_stream',schemaVersion:version,encoding:'base64',payload:Buffer.from(text).toString('base64'),byteLength:Buffer.byteLength(text),digest:p.sha256Bytes(Buffer.from(text))});
export async function fixture(t,label,paddingBytes=0){
 const env=await worksiteFixture(physical);t.after(()=>fs.rm(env.scratch,{recursive:true,force:true}));
 const texts={'source.txt':label==='accounting'?'Preserve typed original accounting records and fresh query evidence.':'Normalize unordered calendar rows without losing dates.',
 'design.json':JSON.stringify({selectedCommand:['node','check.mjs'],scope:label}),
 'candidate.txt':label==='accounting'?'typed accounting artifact':'calendar artifact',
 'oracle.json':JSON.stringify({evaluationOnly:true,criterion:'criterion://'+label,expectation:label}),
 'rubric.json':JSON.stringify({criteria:[{criterionRef:'criterion://'+label,mandatory:true,instruction:'Independently compare the selected actual artifacts and execution with this job source and oracle.'}]})};
 texts['candidate.txt']+='x'.repeat(paddingBytes);
 for(const[path,bytes]of Object.entries(texts))await fs.writeFile(join(env.canonicalRoot,path),bytes);
 const context=await physical.observeWorksiteContext({...env,readRoots:Object.keys(texts),maxFiles:10,maxBytes:paddingBytes+10000});
 const task=p.constructNativeWorkspaceWorkTask({workspaceAuthorityBasis:env.workspaceAuthorityBasis,workspaceBinding:env.workspaceBinding,capabilityGrant:env.capabilityGrant,context,outcome:'Component source',instructions:['Selected fixture only'],readFirst:['source.txt'],writeRoots:['candidate.txt'],checks:[]});
 const source=native.constructNativeWorkspaceWorkObservation(task,context,{summary:'Component only; no author was dispatched',gaps:[]},provenance(label+'-author'));
 const prefixBody={kind:'durable_prefix_coordinate',schemaVersion:version,eventLogRef:pathToFileURL(join(env.scratch,'unadmitted.jsonl')).href,prefixLength:0,prefixDigest:p.sha256Bytes(Buffer.alloc(0)),storeIdentity:{device:0,inode:0,eventContractDigest:store.ROOT_EVENT_CONTRACT_DIGEST}};
 const prefix={...prefixBody,coordinateDigest:hash(prefixBody)};
 const request=p.constructNativeWorksiteCommandReacquisitionRequest({...env,sourceNativeWork:source,currentContext:context,
  source:{prefix,graphCallRef:'graph-call://component/'+label,declarationProof:{kind:'abg_historical_declaration_proof',schemaVersion:version,catalog:{},catalogView:{}}},
  selectedSources:[{relativePath:'candidate.txt',subjectUri:pathToFileURL(join(env.canonicalRoot,'candidate.txt')).href}],
  commands:[{commandId:'command://'+label,executable:'node',args:[label+'-check.mjs'],relativeCwd:'.',environment:{},timeoutMs:1000,terminationGraceMs:100,expectedReports:[]}],outcomePredicates:[],allowedWriteTerritories:[{pathKind:'subtree',relativePath:'evidence'}]});
 const coord=path=>({path,digest:context.entries.find(e=>e.relativePath===path).digest});
 const job={jobRef:'job://'+label,claim:'Bounded '+label+' component evidence only',planBasis:[{assetKind:'design',...coord('design.json'),provenance:null}],candidatePaths:['candidate.txt'],sourcePaths:['source.txt','design.json'],rubric:coord('rubric.json'),oracle:coord('oracle.json'),criterionEvidence:[{criterionRef:'criterion://'+label,roles:['source','candidate','execution','oracle']}],evidenceExpectations:['Report missing upstream admitted plan derivation; no full lifecycle claim.']};
 const input=r.constructNativeContinuationInput({job,reacquisitionRequest:request});
 const executionTask=p.constructNativeWorksiteCommandExecutionTask({...request,sourceReacquisition:{request,nativeBasis:{predecessorPrefix:prefix,cCallRef:'c-call://component/reacquisition'},bindingCoverEventRefs:[]}});
 const execution=executionObservation(executionTask,label);
 const bound=p.constructRetainedGraphInput(input,execution),assessmentTask=r.assessmentTask(bound);
 const assessment={kind:'native_asset_criterion_assessment',criteria:[{criterionRef:'criterion://'+label,disposition:'satisfied',rationale:'Synthetic component disposition, not semantic evidence.',evidence:[{path:'source.txt',quote:texts['source.txt']},{path:'candidate.txt',quote:texts['candidate.txt'].slice(0,100)},{path:'oracle.json',quote:label},{path:'command-1.stdout',quote:label}]}],residuals:[]};
 const observation=native.constructNativeWorkspaceWorkObservation(assessmentTask,context,null,provenance(label+'-assessor'),assessment);
 return {input,bound,assessmentTask,observation,context,execution,job,label,env,texts};
}

export function executionObservation(executionTask,label){
 const plan=c2.worksiteCommandExecutionHelperPlan(executionTask,'attempt://component/'+label);
 const command=executionTask.commands[0],{kind:ck,schemaVersion:cv,expectedReports,...commandBody}=command;
 const observed={...commandBody,exitStatus:0,timedOut:false,processSignal:null,signalSequence:[],terminationConfirmed:true,stdout:stream('component observed '+label),stderr:stream(''),reports:[],reportCount:0};
 const commandResult={kind:'worksite_command_result',schemaVersion:version,...observed,observationDigest:hash(observed),observationRef:'worksite-command-observation://abiogenesis/'+hash(observed).slice(7)};
 const members=executionTask.protectedObservations.map((row,ordinal)=>({kind:'worksite_snapshot_member',schemaVersion:version,ordinal,sourceMemberRef:row.sourceMemberRef,relativePath:row.subject.relativePath,sourceObservationRef:row.observation.observationRef,sourceObservationDigest:row.observation.observationDigest,byteLength:row.observation.byteLength,digest:row.observation.fileDigest}));
 const snapshotDigest=hash(members),snapshotRef='worksite-command-snapshot://abiogenesis/'+snapshotDigest.slice(7);
 const helper=c2.constructWorksiteExecutionHelperArtifact({task:executionTask,disposition:'success',commandResults:[commandResult],predicateObservations:[],worksiteDelta:[],productDelta:[],snapshotRoot:plan.sandboxRoot,snapshotRef,snapshotDigest,snapshotMembers:members,protectedBefore:executionTask.protectedObservations.map(r=>r.observation),protectedAfter:executionTask.protectedObservations.map(r=>r.observation)});
 const acknowledgement={kind:'worksite_command_execution_worker_result',schemaVersion:version,taskRef:executionTask.taskRef,taskDigest:executionTask.taskDigest,attemptRef:plan.attemptRef,helperArtifactRef:helper.artifactRef,helperArtifactDigest:helper.artifactDigest};
 const actor={actorRef:executionTask.workerActorRef,workerBindingRef:executionTask.workerBindingRef,implementationRef:p.WORKSITE_COMMAND_EXECUTION_IDS.implementationRef,inputDigest:hash(executionTask),transportLane:'worker_executes',disposition:'success',toolCallCount:1,
 toolInvocations:[{kind:'worker_tool_invocation_evidence',schemaVersion:version,ordinal:0,toolName:'Bash',toolUseRef:'tool://component',inputDigest:plan.toolInputDigest,inputByteLength:plan.toolInputByteLength}],actorInvocationRef:'actor-invocation://component/'+label+'-executor',processRef:'process://component',transportBindingRef:'transport://component',transportBindingDigest:h,transportDigest:h};
 const execution=c2.constructWorksiteExecutionObservation(executionTask,acknowledgement,actor,helper,plan);
 assert(p.isNativeWorksiteCommandExecutionObservation(execution));
 return execution;
}
