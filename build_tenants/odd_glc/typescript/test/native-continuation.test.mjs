import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {SourceTextModule,SyntheticModule} from 'node:vm';
import * as p from '@abiogenesis/typescript-tenant/product';
import * as gtl from '@abiogenesis/typescript-tenant/gtl';
import * as v from '@abiogenesis/typescript-tenant/validator';
const consumerRoot=process.env.ABI5_CONSUMER_ROOT;
const r=consumerRoot ? await import(pathToFileURL(join(consumerRoot,JSON.parse(await fs.readFile(join(consumerRoot,'package.json'),'utf8')).exports['./native-continuation'])).href) : await import('../src/native-continuation-runtime.mjs');
import {ids,stages,ASSESSMENT_SCHEMA_TEXT} from '../src/native-continuation-contracts.mjs';
import {constructNativeContinuationPublication,constructNativeContinuationEnvironmentRoles} from '../src/native-continuation-declarations.mjs';
const root=process.env.ABI5_COMPONENT_ROOT;if(!root)throw Error('explicit built ABI5 root required');
const load=path=>import(pathToFileURL(join(root,path)).href);
const {worksiteFixture,loadWorksiteOwner}=await load('test_env/support/t287-generic-job-worksite.mjs');
const physical=await loadWorksiteOwner(),native=await load('build/code/src/product/native_workspace_work.js'),c2=await load('build/code/src/product/worksite_command_execution.js');
const store=await load('build/code/src/abg/event_store.js');
const hash=p.sha256Canonical,version='5.0.0',h=hash('uninstalled-component');
const artifact={productId:p.ABI5_PRODUCT_ID,packageName:p.ABI5_PACKAGE_NAME,packageVersion:p.ABI5_PACKAGE_VERSION,artifactDigest:h,productContentDigest:h,manifestDigest:h,productManifestDigest:h};
const pub=constructNativeContinuationPublication({artifact,product:p,gtl});
const nativePubs=[gtl.constructWorksiteCommandExecutionModulePublication(artifact),gtl.constructNativeWorkspaceWorkModulePublication(artifact)];
const pubs=[pub,...nativePubs],raw=(x,k)=>v.rawAdmitValue(x,k,'contract://component/'+k);
const validation=()=>v.validateProgram({declarationBasisDigest:hash(pubs),programPublication:raw(pub,'module_publication'),program:raw(pub.programs[0],'gtl_program'),graphFunctions:pubs.flatMap(p=>p.graphFunctions).map(x=>raw(x,'graph_function')),contracts:pubs.flatMap(p=>p.contracts).map(x=>raw(x,'contract_declaration')),implementationBindings:pubs.flatMap(p=>p.implementationBindings).map(x=>raw(x,'implementation_binding')),closureContracts:pubs.flatMap(p=>p.closureContracts).map(x=>raw(x,'closure_contract')),rules:[],evaluators:[]});
const provenance=label=>({cCallRef:'c-call://component/'+label,executionAuthorityRef:'authority://component/'+label,executionAuthorityDigest:hash(label),actorInvocationRef:'actor-invocation://component/'+label,transportBindingRef:'transport://component',transportBindingDigest:h,promptDigest:h,transportDigest:h});
const stream=text=>({kind:'worksite_observed_stream',schemaVersion:version,encoding:'base64',payload:Buffer.from(text).toString('base64'),byteLength:Buffer.byteLength(text),digest:p.sha256Bytes(Buffer.from(text))});
async function fixture(t,label,paddingBytes=0){
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
 const bound=p.constructRetainedGraphInput(input,execution),assessmentTask=r.assessmentTask(bound);
 const assessment={kind:'native_asset_criterion_assessment',criteria:[{criterionRef:'criterion://'+label,disposition:'satisfied',rationale:'Synthetic component disposition, not semantic evidence.',evidence:[{path:'source.txt',quote:texts['source.txt']},{path:'candidate.txt',quote:texts['candidate.txt'].slice(0,100)},{path:'oracle.json',quote:label},{path:'command-1.stdout',quote:label}]}],residuals:[]};
 const observation=native.constructNativeWorkspaceWorkObservation(assessmentTask,context,null,provenance(label+'-assessor'),assessment);
 return {input,bound,assessmentTask,observation,context,execution,job,label};
}
test('consumer command role produces a real native C2 instruction assembly',async t=>{
 const f=await fixture(t,'calendar'),task=f.execution.task;
 const roles=constructNativeContinuationEnvironmentRoles({gtl,product:p,publication:pub,nativePublications:nativePubs,
  sourceBasisRef:'stdo://releases/v2.5.0-rc.4/',accessRefs:[],sourceSelections:{common:[],worker:[],reviewer:[],evidence:[],execution:[]}});
 const commandRole=roles.find(r=>r.role==='command_executor'),assessorRole=roles.find(r=>r.role==='assessor');
 assert.deepEqual(assessorRole.contextPolicy.selectors,['current_worksite']);
 const graphFunction=nativePubs.flatMap(p=>p.graphFunctions).find(g=>g.name===commandRole.graphFunctionRef);
 const call={regime:'F_P',cCallRef:'c-call://component/consumer-assembly',cCallDigest:hash('assembly-call'),
  runId:'run://component/consumer-assembly',graphCallId:'graph-call://component/consumer-assembly',frameId:'frame://component/consumer-assembly',
  taskOrdinal:null,attempt:1,programLocusRef:commandRole.programLocusRef,graphFunctionRef:graphFunction.name,
  implementationRef:p.WORKSITE_COMMAND_EXECUTION_IDS.implementationRef,inputContractRef:p.WORKSITE_COMMAND_EXECUTION_IDS.taskContractRef,
  outputContractRef:p.WORKSITE_COMMAND_EXECUTION_IDS.observationContractRef};
 const basis={publication:pub,graphFunction,predecessorPrefix:{coordinateDigest:hash('unadmitted-component-prefix')}};
 const owner={inputRef:'raw-input://component/consumer-assembly',inputDigest:hash(task),inputValue:task,call,
  execution:{basisRef:'execution-basis://component/consumer-assembly',basisDigest:hash('assembly-basis'),invocationAdmissionRef:'invocation://component/consumer-assembly',programRef:pub.programs[0].programRef}};
 const context={...commandRole,invocationAdmissionRef:owner.execution.invocationAdmissionRef,environmentRef:'environment://component/consumer-assembly',
  environmentDigest:hash('environment'),evidenceDigest:hash('evidence'),contextPolicyDigest:hash(commandRole.contextPolicy),sourceContent:[],accessContent:[]};
 let selectedOwner=owner,selectedContext=context;
 // Reuse ABI's native-C2 assembly fixture seam. Native authentication and role
 // evidence are explicit lower-owner premises. Consumer roles, task predicates,
 // required selectors, helper plan, prompt and response schema execute unchanged.
 const ownerRoot=process.env.ABI5_ASSEMBLY_OWNER_ROOT??root;
 const implementationPath=join(ownerRoot,'build/code/src/abg/instruction_assembly.js');
 const module=new SourceTextModule(await fs.readFile(implementationPath,'utf8'),{identifier:implementationPath});
 await module.link(async specifier=>{
  const native=await import(specifier.startsWith('node:')?specifier:new URL(specifier,pathToFileURL(implementationPath)).href);
  const values={...native,...(specifier==='./execution_basis.js'?{authenticateNativeInstructionAssemblyBasis:()=>selectedOwner}:{}),
   ...(specifier==='./stdo_environment.js'?{projectRunEnvironmentRoleEvidence:()=>selectedContext}:{})};
  return new SyntheticModule(Object.keys(values),function(){for(const[k,value]of Object.entries(values))this.setExport(k,value);});
 });
 await module.evaluate();
 const construct=module.namespace.constructWorksiteNativeInstructionAssembly;
 const assembly=construct(basis,task);
 assert(assembly,'consumer-produced command context must satisfy the actual native assembly owner');
 assert.equal(assembly.request.inputDigest,hash(task));assert.equal(assembly.plan.role,'command_executor');
 const assemblyOwner=await import(pathToFileURL(join(ownerRoot,'build/code/src/abg/instruction_assembly.js')).href);
 const plan=c2.worksiteCommandExecutionHelperPlan(task,assemblyOwner.worksiteCommandExecutionAttemptRef(call));
 assert.deepEqual(assembly.request.responseJsonSchema,c2.worksiteCommandExecutionWorkerResultSchema(task,plan));
 assert(assembly.request.prompt.includes(plan.toolCommand));
 selectedContext={...context,contextPolicy:{...context.contextPolicy,selectors:['current_worksite']}};
 assert.equal(construct(basis,task),null,'original producer defect must still refuse');
 assert.throws(()=>module.namespace.requireWorksiteNativeInstructionAssembly(basis,task),/exact native admitted instruction assembly/);
 selectedContext=context;selectedOwner=null;assert.equal(construct(basis,task),null,'missing native authority must still refuse');
 selectedOwner=owner;assert.equal(construct(basis,{...task,taskDigest:hash('crossed-task')}),null);
 t.diagnostic('Component proof only: consumer-produced context reaches real assembly; native authentication/context evidence and source/execution observations are explicit fixture premises. No helper, actor or admitted Run.');
});
test('one canonical Program has one retention and complete contract handoffs',()=>{
 const result=validation();assert.equal(result.kind,'program_validation',JSON.stringify(result.diagnostics));
 const program=pub.programs[0],graphs=pubs.flatMap(p=>p.graphFunctions).filter(g=>program.callableMembership.includes(g.name));
 assert.equal(graphs.flatMap(g=>g.template.edges).filter(e=>e.inputBinding).length,1);assert.equal(pub.implementationBindings.length,2);
 for(const graph of graphs)for(const node of graph.template.nodes)for(const field of ['inputCarrierRef','outputCarrierRef']){
  const contract=pubs.flatMap(p=>p.contracts).find(c=>c.contractRef===node.term[field]);assert(contract);assert(r.contractValuePredicate(contract.valueKind),contract.valueKind);
 }
 assert.equal(pub.graphFunctions[0].declarations['abg.raw_result_contract'],ids.rawContractRef);
 const roles=constructNativeContinuationEnvironmentRoles({gtl,product:p,publication:pub,nativePublications:nativePubs,sourceBasisRef:'stdo://releases/v2.5.0-rc.4/',accessRefs:[],sourceSelections:{common:[],worker:[],reviewer:[],evidence:[],execution:[]}});
 assert.deepEqual(roles.map(r=>r.role).sort(),['assessor','command_executor']);assert(roles.every(r=>!r.policy.text.includes('accounting')));
});
test('two ordinary jobs use identical declaration/schema and exact typed input through assessment judgment',async t=>{
 const a=await fixture(t,'accounting'),b=await fixture(t,'calendar');
 for(const f of [a,b]){
  assert(r.isNativeContinuationInput(f.input));assert(r.isNativeContinuationBoundInput(f.bound));assert.equal(r.selectRequest(f.input).resultCandidate,f.input.reacquisitionRequest);
  assert.deepEqual(r.prepareAssessment(f.bound).resultCandidate,f.assessmentTask);assert.deepEqual(f.assessmentTask.writeRoots,[]);
  assert.equal(r.interpretExecutionAssessment(f.bound,f.observation).disposition,'satisfied');
  assert.equal(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(ids.wrapperPredicateRef).evaluate(f.bound,f.observation),true);
  assert.equal(f.assessmentTask.assessment.schemaAsset.bytesBase64,Buffer.from(ASSESSMENT_SCHEMA_TEXT).toString('base64'));
 }
 if(process.env.ABI5_COMPONENT_OUTPUT)for(const f of [a,b])await fs.writeFile(join(process.env.ABI5_COMPONENT_OUTPUT,f.label+'-component-input.json'),JSON.stringify(f.input,null,2)+'\n',{flag:'wx'});
 assert.notEqual(hash(a.input),hash(b.input));assert.equal(hash(pub),hash(constructNativeContinuationPublication({artifact,product:p,gtl})));
 assert.equal(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(ids.wrapperPredicateRef).evaluate(a.bound,b.observation),false);
 const oracleEntry=a.context.entries.find(e=>e.relativePath===a.job.oracle.path),oracleText=Buffer.from(oracleEntry.bytes,'base64').toString('utf8');
 const inlineOracle={ref:'oracle://component/accounting',digest:p.sha256Bytes(Buffer.from(oracleText)),text:oracleText};
 const inlineInput={...a.input,job:{...a.job,oracle:inlineOracle}};
 assert(r.isNativeContinuationInput(inlineInput));assert(!r.isNativeContinuationInput({...inlineInput,job:{...inlineInput.job,oracle:{...inlineOracle,text:oracleText+'crossed'}}}));
 const inlineBound={...a.bound,entry:inlineInput},inlineTask=r.assessmentTask(inlineBound);
 assert(inlineTask.instructions.some(s=>s.includes(inlineOracle.ref)&&s.includes(oracleText)));
 const inlineAssessment={...a.observation.assessment,criteria:a.observation.assessment.criteria.map(c=>({...c,evidence:c.evidence.map(e=>e.path===a.job.oracle.path?{...e,path:inlineOracle.ref}:e)}))};
 const inlineObservation=native.constructNativeWorkspaceWorkObservation(inlineTask,a.context,null,provenance('inline-assessor'),inlineAssessment);
 assert.equal(r.interpretExecutionAssessment(inlineBound,inlineObservation).disposition,'satisfied');
 const crossed={...a.input,job:{...a.job,oracle:b.job.oracle}};assert(!r.isNativeContinuationInput(crossed));
 const residual=native.constructNativeWorkspaceWorkObservation(a.assessmentTask,a.context,null,provenance('other-assessor'),{...a.observation.assessment,residuals:[{scope:'selected-assessment',criterionRef:'criterion://accounting',description:'Unresolved selected requirement.'}]});
 assert.equal(r.interpretExecutionAssessment(a.bound,residual).disposition,'unsatisfied');
 const missing=native.constructNativeWorkspaceWorkObservation(a.assessmentTask,a.context,null,provenance('missing-assessor'),{...a.observation.assessment,criteria:[{...a.observation.assessment.criteria[0],criterionRef:'criterion://wrong'}]});
 assert.equal(r.interpretExecutionAssessment(a.bound,missing).disposition,'unsatisfied');
 for(const disposition of ['falsified','indeterminate']){
  const unsatisfied=native.constructNativeWorkspaceWorkObservation(a.assessmentTask,a.context,null,provenance(disposition+'-assessor'),{...a.observation.assessment,criteria:[{...a.observation.assessment.criteria[0],disposition}]});
  assert.equal(r.interpretExecutionAssessment(a.bound,unsatisfied).disposition,'unsatisfied');
 }
 assert.equal(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(ids.wrapperPredicateRef).evaluate(a.bound,{...a.observation,assessment:null,report:{summary:'done',gaps:[]}}),false);
 assert.throws(()=>r.assessmentTask({...a.bound,entry:b.input}));
 assert(!r.isNativeContinuationBoundInput({...a.bound,entry:b.input}));
 t.diagnostic(JSON.stringify({mode:'Real typed Product constructors and cold structural predicates; synthetic source/executor/assessor dispositions are explicit fixture premises, never ABG admission or semantic acceptance.',jobs:[a.label,b.label],programRef:ids.programRef,publicationDigest:hash(pub),inputBytes:[a,b].map(f=>Buffer.byteLength(JSON.stringify(f.input)))}));
});

test('material typed job and C2 bodies retain once through preparation and interpretation',async t=>{
 const started=performance.now(),f=await fixture(t,'calendar',1474560);
 assert.equal(f.bound.entry,f.input);assert.equal(f.bound.source,f.execution);
 assert.equal(r.interpretExecutionAssessment(f.bound,f.observation).disposition,'satisfied');
 assert.deepEqual(Object.keys(f.bound).sort(),['entry','kind','schemaVersion','source']);
 const sizes=Object.fromEntries(['input','execution','bound','assessmentTask','observation'].map(k=>[k,Buffer.byteLength(JSON.stringify(f[k]))]));
 assert(sizes.bound>20*1024*1024&&sizes.bound<26*1024*1024,JSON.stringify(sizes));
 t.diagnostic(JSON.stringify({sizes,entryRetainedByReference:true,sourceRetainedByReference:true,retentionConstructions:1,secondRetention:0,preparationAndInterpretation:true,elapsedMs:performance.now()-started,peakRss:process.resourceUsage().maxRSS,premises:'Actual Product typed constructors/context observer; source, C2 execution, and assessor dispositions remain explicit synthetic component premises, not ABG evidence.'}));
});
