import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {SourceTextModule,SyntheticModule} from 'node:vm';
import * as p from '@abiogenesis/typescript-tenant/product';
import * as abg from '@abiogenesis/typescript-tenant/abg';
import * as gtl from '@abiogenesis/typescript-tenant/gtl';
import * as v from '@abiogenesis/typescript-tenant/validator';
import * as r from '../src/native-continuation-runtime.mjs';
import {ids,correction,correctionStages,reentry,reentryStages,ASSESSMENT_SCHEMA_TEXT,CORRECTION_SELECTION_SCHEMA_TEXT,DESIGN_ASSESSMENT_SCHEMA_TEXT} from '../src/native-continuation-contracts.mjs';
import {constructNativeContinuationPublication,constructNativeContinuationEnvironmentRoles} from '../src/native-continuation-declarations.mjs';
import {fixture,provenance,physical,native,executionObservation} from './support/native-continuation-fixture.mjs';
const hash=p.sha256Canonical,coord=label=>({ref:'component://'+label,digest:hash(label)});
const bound=(entry,source)=>p.constructRetainedGraphInput(entry,source);
const clone=x=>structuredClone(x);
const diagnostic='Component premises: R10 successful terminal/current prefix, native author/selector/C2/assessor observations and their admission are explicitly supplied. Actual GTL validation, Product construction, physical scratch observations, consumer ingress/interpretation and judgment routing execute. No original history, native actor or admitted Run.';
const assessmentOwner=await import(pathToFileURL(join(process.env.ABI5_COMPONENT_ROOT,'build/code/src/product/native_workspace_assessment.js')).href);

async function correctionFixture(t,label,paddingBytes=0){
 const f=await fixture(t,label,paddingBytes),residuals=[{scope:'selected-assessment',criterionRef:'criterion://'+label,description:'Observed behavior requires a bounded construction correction.'},
  {scope:'outside-assessment',criterionRef:null,description:'Broader source outcomes and plan derivation remain pending.'}];
 const assessment=native.constructNativeWorkspaceWorkObservation(f.assessmentTask,f.context,null,provenance(label+'-prior-assessor'),{...f.observation.assessment,residuals});
 const terminal={kind:'abg_typed_terminal_result',schemaVersion:'5.0.0',result:coord(label+'-result'),contract:coord('native-observation-contract'),
  valueKind:'native_workspace_work_observation',valueDigest:hash(assessment),value:assessment,
  producer:{runRef:'run://component/'+label,graphCallRef:'graph-call://component/'+label+'-assessment',invocationAdmissionRef:'invocation://component/'+label,
   program:coord('old-program'),graphFunction:{ref:p.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef,digest:hash('native-assessment')},
   executionBasis:coord(label+'-basis'),cCallRef:assessment.provenance.cCallRef,resultAdmissionEventRef:'event://component/'+label+'-result',
   judgmentRef:'judgment://component/'+label,judgmentAdmissionEventRef:'event://component/'+label+'-judgment',terminalRoute:coord(label+'-route')},projectionBasis:coord('prior-prefix')};
 assert(abg.isAbgTypedTerminalResult(terminal));
 const h=hash('component'),artifact={productId:p.ABI5_PRODUCT_ID,packageName:p.ABI5_PACKAGE_NAME,packageVersion:p.ABI5_PACKAGE_VERSION,artifactDigest:h,productContentDigest:h,productManifestDigest:h,manifestDigest:h};
 const historicalSource={terminalResult:terminal,input:{graphFunctionRef:ids.assessmentWrapperRef,contractRef:ids.boundInputContractRef,value:f.bound},
  publication:constructNativeContinuationPublication({artifact,gtl,product:p})};
 const input=r.constructNativeCorrectionInput({...r.projectNativeCorrectionPrior(historicalSource),
  workspaceAuthorityBasis:f.env.workspaceAuthorityBasis,workspaceBinding:f.env.workspaceBinding,capabilityGrant:f.env.capabilityGrant,
  currentContext:f.context,writeCandidates:['candidate.txt']});
 const selection={kind:'native_correction_selection',disposition:'construction_repair',reason:'Supplied semantic selection for a construction-only change.',
  issues:[{causeRef:'residual:0',writePaths:['candidate.txt'],reason:'Selected candidate behavior is affected.',evidence:[{path:'candidate.txt',quote:f.texts['candidate.txt']}]}],
  dependencyPaths:['candidate.txt','source.txt','design.json']};
 const selector=raw=>native.constructNativeWorkspaceWorkObservation(r.correctionSelectionTask(input),f.context,null,provenance(label+'-selector'),raw);
 return {...f,input,terminal,historicalSource,selection,selector,selectionObservation:selector(selection)};
}

test('actual generic GTL declares one bounded correction path and complete implementation/role/schema contracts',()=>{
 const h=hash('component'),artifact={productId:p.ABI5_PRODUCT_ID,packageName:p.ABI5_PACKAGE_NAME,packageVersion:p.ABI5_PACKAGE_VERSION,artifactDigest:h,productContentDigest:h,productManifestDigest:h,manifestDigest:h};
 const pub=constructNativeContinuationPublication({artifact,gtl,product:p}),nativePubs=[gtl.constructNativeWorkspaceWorkModulePublication(artifact),gtl.constructWorksiteCommandExecutionModulePublication(artifact)],pubs=[pub,...nativePubs];
 const raw=(value,kind)=>v.rawAdmitValue(value,kind,'contract://component/'+kind);
 const validation=v.validateProgram({declarationBasisDigest:hash(pubs),programPublication:raw(pub,'module_publication'),program:raw(pub.programs[0],'gtl_program'),
  graphFunctions:pubs.flatMap(x=>x.graphFunctions).map(x=>raw(x,'graph_function')),contracts:pubs.flatMap(x=>x.contracts).map(x=>raw(x,'contract_declaration')),
  implementationBindings:pubs.flatMap(x=>x.implementationBindings).map(x=>raw(x,'implementation_binding')),closureContracts:pubs.flatMap(x=>x.closureContracts).map(x=>raw(x,'closure_contract')),rules:[],evaluators:[]});
 assert.equal(validation.kind,'program_validation',JSON.stringify(validation.diagnostics));
 const graph=pub.graphFunctions.find(g=>g.name===correction.graphFunctionRef),nodes=graph.template.nodes;
 assert.equal(nodes.length,8);assert.equal(graph.template.edges.length,7);assert.equal(graph.template.edges.filter(e=>e.inputBinding).length,3);
 assert(graph.template.edges.every((edge,i)=>edge.fromNodeRef===nodes[i].nodeRef&&edge.toNodeRef===nodes[i+1].nodeRef),'finite forward edges; no repetition');
 assert.equal(nodes[0].term.judgmentPredicateRef,correctionStages[0].predicateRef);
 assert.equal(nodes[2].term.judgmentPredicateRef,correctionStages[1].predicateRef);
 for(const stage of [...correctionStages,...reentryStages]){
  const matches=Object.values(r).filter(x=>x?.kind==='packaged_leaf_implementation_descriptor'&&x.namedSymbol===stage.namedSymbol);
  assert.equal(matches.length,1);assert(p.isPackagedLeafImplementationDescriptor(matches[0]));assert.equal(typeof r[stage.namedSymbol],'function');
 }
 const roles=constructNativeContinuationEnvironmentRoles({gtl,product:p,publication:pub,nativePublications:nativePubs,sourceBasisRef:'stdo://releases/v2.5.0-rc.4/',accessRefs:[],
  sourceSelections:{common:[],worker:[],reviewer:[],construction:[],execution:[],evidence:[]}});
 assert.deepEqual(roles.map(x=>x.role).sort(),['assessor','command_executor','constructor']);
 assert.deepEqual(roles.find(x=>x.role==='constructor').contextPolicy.selectors,['current_worksite']);
 assert.deepEqual(roles.find(x=>x.role==='command_executor').contextPolicy.selectors,['current_worksite','admitted_execution_evidence']);
 const designSource={sourceRef:'source://component/design-method'};
 const designRoles=constructNativeContinuationEnvironmentRoles({gtl,product:p,publication:pub,nativePublications:nativePubs,sourceBasisRef:'stdo://releases/v2.5.0-rc.4/',accessRefs:[],
  sourceSelections:{common:[],worker:[],reviewer:[],construction:[],execution:[],evidence:[],design:[designSource]}});
 assert(designRoles.filter(row=>row.role!=='command_executor').every(row=>row.sourceBindings.includes(designSource)));
 assert.notEqual(JSON.parse(CORRECTION_SELECTION_SCHEMA_TEXT).$id,JSON.parse(ASSESSMENT_SCHEMA_TEXT).$id);
 assert.deepEqual(JSON.parse(CORRECTION_SELECTION_SCHEMA_TEXT).properties.disposition.enum,['construction_repair','stage_revision_required','blocked']);
});

test('generic correction selection and final assessment both satisfy the unchanged native raw-contract gate',async t=>{
 const f=await correctionFixture(t,'calendar'),task=r.correctionSelectionTask(f.input);
 const h=hash('component'),artifact={productId:p.ABI5_PRODUCT_ID,packageName:p.ABI5_PACKAGE_NAME,packageVersion:p.ABI5_PACKAGE_VERSION,
  artifactDigest:h,productContentDigest:h,manifestDigest:h,productManifestDigest:h};
 const pub=constructNativeContinuationPublication({artifact,gtl,product:p});
 const nativePub=gtl.constructNativeWorkspaceWorkModulePublication(artifact),graphFunction=nativePub.graphFunctions.find(g=>g.name===p.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef);
 const rows=[];
 for(const [contractRef,text,path]of [[correction.selectionContractRef,CORRECTION_SELECTION_SCHEMA_TEXT,'selection.json'],[ids.rawContractRef,ASSESSMENT_SCHEMA_TEXT,'assessment.json'],[reentry.rawContractRef,DESIGN_ASSESSMENT_SCHEMA_TEXT,'design.json']]){
  await fs.writeFile(join(f.env.scratch,path),text);const digest=p.sha256Bytes(Buffer.from(text));
  rows.push({contractKind:'schema_asset',contractId:contractRef,contractVersion:'5.0.0',owningProduct:ids.productId,contractDigest:digest,
   assetLocator:{path,mediaType:'application/schema+json',contentDigest:digest}});
 }
 const role={contextPolicy:{selectors:['current_worksite']},frameRefs:[],policy:{},sourceContent:[],accessContent:[]};
 let selectedTask=task,selectedPub=pub;
 const call={regime:'F_P',cCallRef:'c-call://component/selector',cCallDigest:h,implementationRef:p.NATIVE_WORKSPACE_WORK_IDS.implementationRef,
  graphFunctionRef:graphFunction.name,inputContractRef:p.NATIVE_WORKSPACE_WORK_IDS.taskContractRef,outputContractRef:p.NATIVE_WORKSPACE_WORK_IDS.observationContractRef,
  programLocusRef:graphFunction.template.nodes[0].nodeRef};
 const owner=()=>({inputValue:selectedTask,inputDigest:hash(selectedTask),inputRef:'input://component',call,events:[],program:selectedPub.programs[0],
  execution:{invocationAdmissionRef:'invocation://component',programRef:ids.programRef,basisRef:'basis://component',basisDigest:h},
  environment:{kind:'exact_prefix_workspace_environment',productInstalls:[{productId:ids.productId,installedRoot:f.env.scratch,publicContracts:rows}]}});
 const path=join(process.env.ABI5_COMPONENT_ROOT,'build/code/src/abg/instruction_assembly.js');
 const module=new SourceTextModule(await fs.readFile(path,'utf8'),{identifier:path});
 await module.link(async specifier=>{
  const imported=await import(specifier.startsWith('.')?new URL(specifier,pathToFileURL(path)).href:specifier);
  const values={...imported,...(specifier==='./execution_basis.js'?{authenticateNativeInstructionAssemblyBasis:owner}:{}),
   ...(specifier==='./stdo_environment.js'?{projectRunEnvironmentRoleEvidence:()=>role}:{})};
  return new SyntheticModule(Object.keys(values),function(){for(const[k,v]of Object.entries(values))this.setExport(k,v);});
 });await module.evaluate();
 const assemble=()=>module.namespace.constructWorksiteNativeInstructionAssembly({publication:selectedPub,graphFunction,predecessorPrefix:{component:true}},selectedTask);
 assert.equal(assemble().request.resultContractRef,correction.selectionContractRef);
 assert.deepEqual(assemble().request.responseJsonSchema,JSON.parse(CORRECTION_SELECTION_SCHEMA_TEXT));
 selectedTask=f.assessmentTask;assert.equal(assemble().request.resultContractRef,ids.rawContractRef);
 assert.deepEqual(assemble().request.responseJsonSchema,JSON.parse(ASSESSMENT_SCHEMA_TEXT));
 const d=await designFixture(t,'calendar');selectedTask=d.reviewTask;
 assert.equal(assemble().request.resultContractRef,reentry.rawContractRef);
 assert.deepEqual(assemble().request.responseJsonSchema,JSON.parse(DESIGN_ASSESSMENT_SCHEMA_TEXT));
 selectedPub={...pub,graphFunctions:pub.graphFunctions.map(g=>({...g,declarations:{...g.declarations,'abg.raw_result_contract':ids.rawContractRef}}))};
 assert.equal(assemble(),null,'Design raw contract must be declared in the selected callable closure');
 selectedPub=pub;
 selectedTask=task;
 const oldGraphs=pub.graphFunctions.map(g=>({...g,declarations:{...g.declarations,'abg.raw_result_contract':ids.rawContractRef}}));
 selectedPub={...pub,graphFunctions:oldGraphs};assert.equal(assemble(),null,'original all-criterion-verdicts declaration refuses the selection task');
 selectedPub={...pub,programs:[{...pub.programs[0],callableMembership:pub.programs[0].callableMembership.filter(ref=>ref!==correction.graphFunctionRef)}]};
 assert.equal(assemble(),null,'a contract on a callable outside the selected closure is insufficient');
 selectedPub=pub;await fs.writeFile(join(f.env.scratch,'selection.json'),'{}');assert.equal(assemble(),null,'changed installed schema bytes still refuse');
 t.diagnostic('Actual native assembly with supplied admission/role premises; generic source declaration and all three exact installed schemas. No native actor or admitted Run.');
});

test('R10 cause gate consumes owner values once and refuses missing or altered complete candidate facts before selector/author',async t=>{
 const f=await correctionFixture(t,'calendar'),prefix={fixture:'current owned prefix'};let calls=0;
 const nativeProof={historicalGraphCallSource:()=>{calls++;return f.historicalSource;}};
 const relation=r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(correctionStages[0].predicateRef),task=r.prepareCorrectionSelection(f.input).resultCandidate;
 assert(relation.evaluate(f.input,task,prefix,nativeProof));assert.equal(calls,1);
 assert(!relation.evaluate(f.input,task,prefix));assert(!relation.evaluate(f.input,task,undefined,nativeProof));
 assert(!relation.evaluate(f.input,task,prefix,{historicalGraphCallSource:()=>null}));
 assert.equal(calls,1,'absence never infers an owner or a source');
 for(const mutate of [x=>x.priorSource.producer.runRef+='-forged',x=>x.priorSource.result.digest=hash('forged'),
  x=>x.priorSource.producer.judgmentAdmissionEventRef+='-forged',x=>x.priorAuthor.provenance.actorInvocationRef+='-forged',
  x=>x.priorExecution.provenance.actorInvocationRef+='-forged',x=>x.priorAssessment.assessment.residuals.pop(),
  x=>x.executionPlan.commands[0].args=['different-command'],x=>x.currentContext.entries[0].digest=hash('stale'),
  x=>x.job.oracle={...x.job.oracle,digest:hash('wrong-oracle')},x=>x.job.jobRef='job://crossed',x=>x.workspaceBinding.bindingDigest=hash('crossed-binding')]){
  const input=clone(f.input);mutate(input);let output;try{output=r.prepareCorrectionSelection(input).resultCandidate;}catch{output=task;}
  assert(!relation.evaluate(input,output,prefix,nativeProof));
 }
 for(const change of [source=>source.publication.productSemanticsBinding.packageName='foreign-package',
  source=>source.publication.contracts.find(c=>c.contractRef===ids.rawContractRef).valueKind='foreign-assessment',
  source=>source.terminalResult.value.task.assessment.schemaAsset.bytesBase64=Buffer.from('{}').toString('base64'),
  source=>source.input.value.entry.job.claim='Different historical meaning']){
  const source=clone(f.historicalSource);change(source);
  assert(!relation.evaluate(f.input,task,prefix,{historicalGraphCallSource:()=>source}),'consumer contract/task meaning remains necessary after the owner premise');
 }
 await fs.writeFile(join(f.env.canonicalRoot,'candidate.txt'),'changed current subject');
 const changedContext=await physical.observeWorksiteContext({...f.env,readRoots:f.context.readRoots,maxFiles:f.context.maxFiles,maxBytes:f.context.maxBytes});
 const changedInput=r.constructNativeCorrectionInput({...f.input,currentContext:changedContext});
 assert(r.isNativeCorrectionInput(changedInput),'changed context is a valid native observation');
 assert(!relation.evaluate(changedInput,r.prepareCorrectionSelection(changedInput).resultCandidate,prefix,nativeProof),'valid current changed bytes refuse the historical cause');
 const oldOwner='product://odd_glc/route-one-typescript@0.2.0-dev.4',priorTask=clone(f.terminal.value.task);
 priorTask.assessment.schemaAsset.productId=oldOwner;
 const priorObservation=native.constructNativeWorkspaceWorkObservation(priorTask,f.context,null,f.terminal.value.provenance,f.terminal.value.assessment);
 const priorPublication=clone(f.historicalSource.publication);priorPublication.owningProductId=oldOwner;priorPublication.productSemanticsBinding.packageVersion='0.2.0-dev.4';
 const oldSource={...f.historicalSource,publication:priorPublication,terminalResult:{...f.terminal,value:priorObservation,valueDigest:hash(priorObservation)}};
 const oldInput=r.constructNativeCorrectionInput({...f.input,...r.projectNativeCorrectionPrior(oldSource)}),oldTask=r.prepareCorrectionSelection(oldInput).resultCandidate;
 assert.equal(oldTask.assessment.schemaAsset.productId,ids.productId,'new selector keeps current schema authority');
 assert(relation.evaluate(oldInput,oldTask,prefix,{historicalGraphCallSource:()=>oldSource}),'original schema owner remains part of the historical task');
 const legacy={...f.input,prior:{bound:f.bound,assessment:f.terminal.value,source:{terminalResult:f.terminal}}};
 assert(!r.isNativeCorrectionInput(legacy),'obsolete full-prior successor shape is removed');
 const decision=r.correctionDecision(bound(f.input,f.selectionObservation));r.correctionAuthorTask(decision);
 assert(!('prior' in f.input));assert(!JSON.stringify(f.input).includes('declarationProof'));
 t.diagnostic(diagnostic);
});

test('affectedness stops preserve typed reasons; coverage, scope, quotes and independent identity gate author',async t=>{
 const f=await correctionFixture(t,'accounting'),gate=r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(correctionStages[1].predicateRef);
 const selected=bound(f.input,f.selectionObservation),decision=r.selectCorrection(selected).resultCandidate;
 assert.equal(decision.disposition,'construction_repair');assert(gate.evaluate(selected,decision));
 const task=r.prepareCorrectionAuthor(decision).resultCandidate;assert.deepEqual(task.writeRoots,['candidate.txt']);assert.deepEqual(task.checks,[]);
 const selectionSchema=native.nativeWorkspaceWorkResponseSchema(r.correctionSelectionTask(f.input));
 assert(assessmentOwner.parseNativeWorkspaceAssessmentResult(selectionSchema,JSON.stringify(f.selection)));
 assert.equal(assessmentOwner.parseNativeWorkspaceAssessmentResult(selectionSchema,JSON.stringify({...f.selection,unexpectedAuthority:true})),null);
 for(const disposition of ['stage_revision_required','blocked']){
  const b=bound(f.input,f.selector({...f.selection,disposition,issues:[]})),d=r.selectCorrection(b).resultCandidate;
  assert.equal(d.disposition,disposition);assert(!gate.evaluate(b,d));assert.throws(()=>r.prepareCorrectionAuthor(d),/construction-only/);
 }
 for(const mutate of [s=>s.issues=[],s=>s.issues.push(s.issues[0]),s=>s.issues[0].causeRef='residual:wrong',s=>s.issues[0].writePaths=['source.txt'],
  s=>s.issues[0].writePaths=['../outside'],s=>s.issues[0].evidence[0].quote='invented semantic proof',s=>s.dependencyPaths=['source.txt']]){
  const selection=clone(f.selection);mutate(selection);const b=bound(f.input,f.selector(selection)),d=r.selectCorrection(b).resultCandidate;
  assert.equal(d.disposition,'blocked');assert(!gate.evaluate(b,d));assert.throws(()=>r.prepareCorrectionAuthor(d));
 }
 const reused=native.constructNativeWorkspaceWorkObservation(r.correctionSelectionTask(f.input),f.context,null,f.input.priorAssessment.provenance,f.selection);
 assert.throws(()=>r.selectCorrection(bound(f.input,reused)),/independent/);
 t.diagnostic(diagnostic);
});

test('two ordinary jobs preserve unaffected assets and oracle through new author, same-Run C2 and final assessment',async t=>{
 for(const label of ['calendar','accounting']){
  const f=await correctionFixture(t,label),decision=r.correctionDecision(bound(f.input,f.selectionObservation)),authorTask=r.correctionAuthorTask(decision);
  await fs.writeFile(join(f.env.canonicalRoot,'candidate.txt'),'corrected '+f.texts['candidate.txt']);
  const after=await physical.observeWorksiteContext({...f.env,readRoots:f.context.readRoots,maxFiles:f.context.maxFiles,maxBytes:f.context.maxBytes});
  const author=native.constructNativeWorkspaceWorkObservation(authorTask,after,{summary:'Supplied native author premise.',gaps:[]},provenance(label+'-new-author'));
  const c2Task=r.prepareCorrectionExecution(bound(f.input,author)).resultCandidate;
  assert.equal(c2Task.sourceReacquisition,undefined);assert.equal(c2Task.sourceNativeWork,author);assert.notEqual(c2Task.taskDigest,f.execution.task.taskDigest);
  assert.deepEqual(c2Task.commands,f.execution.task.commands);assert.deepEqual(c2Task.outcomePredicates,f.execution.task.outcomePredicates);
  for(const e of f.context.entries.filter(x=>x.relativePath!=='candidate.txt'))assert.deepEqual(after.entries.find(x=>x.relativePath===e.relativePath),e);
  const execution=executionObservation(c2Task,label+'-new'),b=bound(f.input,execution),task=r.prepareCorrectionAssessment(b).resultCandidate;
  assert.deepEqual(task.context,after);assert.deepEqual(task.writeRoots,[]);assert.equal(task.assessment.producer.actorInvocationRef,author.provenance.actorInvocationRef);
  assert(task.instructions.some(text=>text.includes('Prior assessment and conserved outside obligations:')));
  assert(task.instructions.some(text=>text.includes('component observed '+label+'-new')));
  const raw={...f.observation.assessment,residuals:f.input.priorAssessment.assessment.residuals.filter(x=>x.scope==='outside-assessment')};
  const assess=candidate=>native.constructNativeWorkspaceWorkObservation(task,after,null,provenance(label+'-new-assessor'),candidate);
  const result=assess(raw);assert.equal(r.interpretCorrectionAssessment(b,result).disposition,'satisfied');
  assert(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(correction.wrapperPredicateRef).evaluate(b,result));
  assert(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(ids.completionPredicateRef).evaluate(f.input,result));
  assert.equal(r.interpretCorrectionAssessment(b,assess({...raw,residuals:[]})).disposition,'unsatisfied','outside obligations cannot disappear');
  assert.equal(r.interpretCorrectionAssessment(b,assess({...raw,residuals:f.input.priorAssessment.assessment.residuals})).disposition,'unsatisfied','selected residual blocks completion');
  assert.throws(()=>r.correctionAssessmentTask(bound(f.input,f.execution)),/new C2/);
  const corrupted=clone(author);corrupted.after.entries.find(x=>x.relativePath==='source.txt').digest=hash('mutated-source');
  assert.throws(()=>r.correctionExecutionTask(bound(f.input,corrupted)),/new exact/);
  await fs.unlink(join(f.env.canonicalRoot,'candidate.txt'));
  const missing=await physical.observeWorksiteContext({...f.env,readRoots:f.context.readRoots,maxFiles:f.context.maxFiles,maxBytes:f.context.maxBytes});
  const partial=native.constructNativeWorkspaceWorkObservation(authorTask,missing,{summary:'Supplied partial construction; required candidate missing.',gaps:['candidate absent']},provenance(label+'-partial-author'));
  assert(!r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(correction.stepPredicateRef).evaluate(authorTask,partial),'missing C2 source blocks at author foldback before task construction');
 }
 t.diagnostic(diagnostic);
});


test('material compact correction preserves every meaning/provenance fact without re-admitting historical native graphs',async t=>{
 const f=await correctionFixture(t,'calendar',131072),location=fileURLToPath(new URL('../src/native-continuation-runtime.mjs',import.meta.url));
 let historicalShapeCalls=0,reads=0;
 const oldValues=new Set([f.bound.entry.reacquisitionRequest,f.bound.source,f.terminal.value]);
 const observed={...p};
 for(const name of ['isNativeWorksiteCommandReacquisitionRequest','isNativeWorksiteCommandExecutionObservation','isNativeWorkspaceWorkObservation']){
  observed[name]=value=>{if(oldValues.has(value))historicalShapeCalls++;return p[name](value);};
 }
 const module=new SourceTextModule(await fs.readFile(location,'utf8'),{identifier:location});
 await module.link(async specifier=>{
  const namespace=specifier==='@abiogenesis/typescript-tenant/product'?observed:await import(specifier.startsWith('.')?new URL(specifier,pathToFileURL(location)).href:specifier);
  return new SyntheticModule(Object.keys(namespace),function(){for(const[k,value]of Object.entries(namespace))this.setExport(k,value);});
 });await module.evaluate();const runtime=module.namespace;
 const task=runtime.prepareCorrectionSelection(f.input).resultCandidate;
 const proof={historicalGraphCallSource:()=>{reads++;return f.historicalSource;}};
 assert(runtime.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(correctionStages[0].predicateRef).evaluate(f.input,task,{},proof));
 const decision=runtime.correctionDecision(bound(f.input,f.selectionObservation));runtime.correctionAuthorTask(decision);
 assert.equal(reads,1);assert.equal(historicalShapeCalls,0,'borrowed historical native values are never re-admitted by consumer transforms');
 assert.strictEqual(f.input.job,f.bound.entry.job);assert.strictEqual(f.input.priorAssessment.assessment,f.terminal.value.assessment);
 assert.strictEqual(f.input.executionPlan.commands,f.bound.entry.reacquisitionRequest.commands);
 assert.equal(f.input.priorExecution.streams[0].payload,f.bound.source.commandResults[0].stdout.payload,'exact original stream bytes are retained independently of UTF-8 decoding');
 const observations={compactInputBytes:Buffer.byteLength(p.canonicalJson(f.input)),historicalBoundBytes:Buffer.byteLength(p.canonicalJson(f.bound)),
  currentContextBytes:Buffer.byteLength(p.canonicalJson(f.context)),historicalShapeCalls,ownerReads:reads,
  historicalProofBytes:null,currentCatalogBytes:null,resourceSizes:'Not present in this consumer component; core resource test reports its actual historical proof separately.'};
 assert(observations.compactInputBytes<observations.historicalBoundBytes/3);
 if(process.env.ABI5_HISTORICAL_SOURCE_EVIDENCE)await fs.writeFile(join(process.env.ABI5_HISTORICAL_SOURCE_EVIDENCE,'consumer-observations.json'),JSON.stringify(observations,null,2)+'\n');
 t.diagnostic(JSON.stringify(observations));
});

async function designFixture(t,label){
 const f=await correctionFixture(t,label),selection={...f.selection,disposition:'stage_revision_required'},selector=f.selector(selection);
 const terminal={...f.terminal,result:coord(label+'-closed-selector'),value:selector,valueDigest:hash(selector),
  producer:{...f.terminal.producer,graphCallRef:'graph-call://component/'+label+'-selector',cCallRef:selector.provenance.cCallRef}};
 const historicalSource={terminalResult:terminal,input:{graphFunctionRef:correction.graphFunctionRef,contractRef:correction.inputContractRef,value:f.input},publication:f.historicalSource.publication};
 const designPath='successor-design.json',currentContext=await physical.observeWorksiteContext({...f.env,readRoots:[...f.context.readRoots,designPath],maxFiles:f.context.maxFiles,maxBytes:f.context.maxBytes});
 const input=r.constructNativeDesignReentryInput({...r.projectNativeDesignReentryPrior(historicalSource),...Object.fromEntries(['workspaceAuthorityBasis','workspaceBinding','capabilityGrant'].map(k=>[k,f.input[k]])),currentContext,designPath});
 const task=r.designAuthorTask(input),asset={kind:'native_revision_design',designText:'A warranted revision preserving '+label+' source and every obligation.',commands:input.executionPlan.commands,outcomePredicates:input.executionPlan.outcomePredicates};
 await fs.writeFile(join(f.env.canonicalRoot,designPath),JSON.stringify(asset));
 const after=await physical.observeWorksiteContext({...f.env,readRoots:currentContext.readRoots,maxFiles:currentContext.maxFiles,maxBytes:currentContext.maxBytes});
 const author=native.constructNativeWorkspaceWorkObservation(task,after,{summary:'Supplied Design author premise.',gaps:[]},provenance(label+'-design-author'));
 const reviewInput=bound(input,author),reviewTask=r.designReviewTask(reviewInput);
 const raw={kind:'native_design_assessment',disposition:'satisfied',reason:'Supplied independent warranted Design judgment, not semantic proof.',
  evidence:[{path:'source.txt',quote:f.texts['source.txt']},{path:designPath,quote:asset.designText}],
  causes:[{causeRef:'residual:0',writePaths:['candidate.txt'],reason:'This exact candidate is affected.',evidence:[{path:designPath,quote:asset.designText}]}],
  dependencyPaths:['source.txt','candidate.txt',designPath]};
 const review=candidate=>native.constructNativeWorkspaceWorkObservation(reviewTask,after,null,provenance(label+'-design-reviewer'),candidate);
 return {...f,input,selector,historicalSource,terminal,designPath,asset,author,after,reviewInput,reviewTask,raw,review};
}

test('closed selector of a later blocked parent is reused once; exact ancestor/task/cause and currentness conditions remain',async t=>{
 const f=await designFixture(t,'calendar'),gate=r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentryStages[0].predicateRef),task=r.prepareDesignAuthor(f.input).resultCandidate;
 let reads=0;const proof={historicalGraphCallSource(){reads++;return f.historicalSource;}};
 assert(gate.evaluate(f.input,task,{currentOwner:true},proof));assert.equal(reads,1);
 assert(!('parentResult' in f.historicalSource));assert(!('declarationProof' in f.input));assert(!('value' in f.input.selectorSource));
 assert(!JSON.stringify(f.input).includes('projectionBasis'));assert(!JSON.stringify(f.input).includes('sourceReacquisition'));
 assert(!gate.evaluate(f.input,task,undefined,proof));assert(!gate.evaluate(f.input,task,{},{}));
 for(const mutate of [s=>s.input.graphFunctionRef=ids.assessmentWrapperRef,s=>s.input.contractRef=ids.boundInputContractRef,
  s=>s.terminalResult.producer.cCallRef+='-crossed',s=>s.terminalResult.value.task.assessment.schemaAsset.bytesBase64=Buffer.from('{}').toString('base64'),
  s=>s.terminalResult.value.assessment.issues=[],s=>s.terminalResult.value.assessment.disposition='construction_repair',
  s=>s.publication.owningProductId='product://foreign',s=>s.input.value.job.claim+='-changed']){
  const source=clone(f.historicalSource);mutate(source);assert(!gate.evaluate(f.input,task,{}, {historicalGraphCallSource:()=>source}));
 }
 for(const mutate of [x=>x.priorSelector.assessment.issues.pop(),x=>x.selectorSource.producer.runRef+='-crossed',x=>x.job.claim+='-different',
  x=>x.executionPlan.commands[0].args=['other'],x=>x.currentContext.entries.find(e=>e.relativePath==='source.txt').digest=hash('changed')]){
  const input=clone(f.input);mutate(input);let output;try{output=r.prepareDesignAuthor(input).resultCandidate;}catch{output=task;}
  assert(!gate.evaluate(input,output,{},proof));
 }
 const owner='product://odd_glc/route-one-typescript@0.2.0-dev.6',source=clone(f.historicalSource);
 source.publication.owningProductId=owner;source.publication.productSemanticsBinding.packageVersion='0.2.0-dev.6';
 source.terminalResult.value=native.constructNativeWorkspaceWorkObservation(r.correctionSelectionTask(source.input.value,owner),source.input.value.currentContext,null,f.selector.provenance,f.selector.assessment);
 source.terminalResult.valueDigest=hash(source.terminalResult.value);
 const successor=r.constructNativeDesignReentryInput({...f.input,...r.projectNativeDesignReentryPrior(source)});
 assert(gate.evaluate(successor,r.prepareDesignAuthor(successor).resultCandidate,{}, {historicalGraphCallSource:()=>source}),'historical schema owner remains exact');
 const readsBeforeTransforms=reads;r.designAuthorTask(f.input);r.designReviewTask(f.reviewInput);assert.equal(reads,readsBeforeTransforms,'transforms never resolve history');
 t.diagnostic(diagnostic+' Parent Run is explicitly nonterminal/blocked; only the selector child terminal is a supplied R10 premise.');
});

test('two unrelated jobs traverse judged Design, sole-current plan, construction, same-Run C2 and complete independent outcome',async t=>{
 for(const label of ['calendar','accounting']){
  const f=await designFixture(t,label),review=f.review(f.raw),reviewGate=r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentry.reviewPredicateRef);
  assert(reviewGate.evaluate(f.reviewInput,review),JSON.stringify(r.interpretDesignReview(f.input,review)));
  const handoff=r.selectCurrentDesign(bound(f.input,review)).resultCandidate;assert(r.isSelectedDesign(handoff));
  assert.equal(handoff.job.planBasis.filter(p=>p.assetKind==='design').length,1);assert.equal(handoff.job.planBasis.find(p=>p.assetKind==='design').path,f.designPath);
  assert(!handoff.job.sourcePaths.includes('design.json'));assert(handoff.predecessorDesigns.some(p=>p.path==='design.json'));
  for(const key of ['jobRef','claim','candidatePaths','rubric','oracle','criterionEvidence','evidenceExpectations'])assert.deepEqual(handoff.job[key],f.input.job[key]);
  assert.deepEqual(handoff.priorAssessment,f.input.priorAssessment);assert.deepEqual(handoff.executionPlan,f.input.executionPlan);
  const task=r.designConstructionTask(handoff);assert.deepEqual(task.writeRoots,['candidate.txt']);assert(!task.readFirst.includes('oracle.json'));assert(!task.readFirst.includes('design.json'));
  assert(!task.instructions.join('\n').includes(f.texts['oracle.json']));
  await fs.writeFile(join(f.env.canonicalRoot,'candidate.txt'),'revised '+f.texts['candidate.txt']);
  const after=await physical.observeWorksiteContext({...f.env,readRoots:f.after.readRoots,maxFiles:f.after.maxFiles,maxBytes:f.after.maxBytes});
  const author=native.constructNativeWorkspaceWorkObservation(task,after,{summary:'Supplied construction premise.',gaps:[]},provenance(label+'-reentry-constructor'));
  const executionTask=r.prepareDesignExecution(bound(handoff,author)).resultCandidate;
  assert.equal(executionTask.sourceReacquisition,undefined);assert.equal(executionTask.sourceNativeWork,author);
  const execution=executionObservation(executionTask,label+'-reentry'),assessmentInput=bound(handoff,execution),assessmentTask=r.prepareDesignOutcome(assessmentInput).resultCandidate;
  const raw={...f.observation.assessment,residuals:f.input.priorAssessment.assessment.residuals.filter(r=>r.scope==='outside-assessment')};
  const assess=(raw,who=provenance(label+'-outcome-reviewer'))=>native.constructNativeWorkspaceWorkObservation(assessmentTask,after,null,who,raw),result=assess(raw);
  assert.equal(r.interpretDesignOutcome(assessmentInput,result).disposition,'satisfied');
  assert(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentry.assessmentPredicateRef).evaluate(assessmentInput,result));
  assert(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentry.constructionPredicateRef).evaluate(handoff,result));
  assert(r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(ids.completionPredicateRef).evaluate(f.input,result));
  for(const row of f.context.entries)if(row.relativePath!=='candidate.txt')assert.deepEqual(after.entries.find(e=>e.relativePath===row.relativePath),row);
  assert.equal(r.interpretDesignOutcome(assessmentInput,assess({...raw,residuals:[]})).disposition,'unsatisfied');
  assert.equal(r.interpretDesignOutcome(assessmentInput,assess({...raw,residuals:f.input.priorAssessment.assessment.residuals})).disposition,'unsatisfied');
  assert(!r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentry.assessmentPredicateRef).evaluate(assessmentInput,assess({...raw,criteria:[]})));
  for(const who of [author.provenance,execution.provenance,review.provenance,f.author.provenance,f.selector.provenance,f.input.priorAssessment.provenance])assert.throws(()=>r.interpretDesignOutcome(assessmentInput,assess(raw,who)),/independent/);
  assert.throws(()=>r.designOutcomeTask(bound(handoff,f.execution)),/same-Run/);
  const crossed=clone(handoff);crossed.job.planBasis.push(...handoff.predecessorDesigns);assert(!r.isSelectedDesign(crossed),'two current Designs refuse');
 }
 t.diagnostic(diagnostic);
});

test('Design rejection, independence, source protection, currentness and complete affectedness block before construction',async t=>{
 const f=await designFixture(t,'calendar'),gate=r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentry.reviewPredicateRef);
 for(const change of [x=>x.disposition='falsified',x=>x.disposition='indeterminate',x=>x.causes=[],x=>x.causes.push(x.causes[0]),
  x=>x.causes[0].writePaths=['source.txt'],x=>x.causes[0].evidence[0].quote='invented',x=>x.dependencyPaths=['source.txt'],x=>x.evidence=x.evidence.filter(e=>e.path!=='source.txt')]){
  const raw=clone(f.raw);change(raw);const review=f.review(raw);assert(!gate.evaluate(f.reviewInput,review));assert.throws(()=>r.selectDesign(bound(f.input,review)),/positive independent/);
 }
 for(const who of [f.author.provenance,f.selector.provenance,f.input.priorAssessment.provenance]){
  const review=native.constructNativeWorkspaceWorkObservation(f.reviewTask,f.after,null,who,f.raw);assert(!gate.evaluate(f.reviewInput,review));
 }
 const originalSource=f.texts['source.txt'];await fs.writeFile(join(f.env.canonicalRoot,'source.txt'),'unauthorized governing change');
 const crossed=await physical.observeWorksiteContext({...f.env,readRoots:f.after.readRoots,maxFiles:f.after.maxFiles,maxBytes:f.after.maxBytes});
 const author=native.constructNativeWorkspaceWorkObservation(r.designAuthorTask(f.input),crossed,{summary:'Forbidden source write.',gaps:[]},f.author.provenance);
 assert.throws(()=>r.designReviewTask(bound(f.input,author)),/bounded Design/);
 await fs.writeFile(join(f.env.canonicalRoot,'source.txt'),originalSource);
 for(const mutate of [a=>a.commands=[],a=>a.commands.push({...a.commands[0],commandId:'command://extra',executable:'different-tool'}),
  a=>a.commands.push({...a.commands[0],commandId:'command://extra',timeoutMs:999999}),a=>a.commands.push(a.commands[0])]){
  const asset=clone(f.asset);mutate(asset);await fs.writeFile(join(f.env.canonicalRoot,f.designPath),JSON.stringify(asset));
  const context=await physical.observeWorksiteContext({...f.env,readRoots:f.after.readRoots,maxFiles:f.after.maxFiles,maxBytes:f.after.maxBytes});
  const a=native.constructNativeWorkspaceWorkObservation(r.designAuthorTask(f.input),context,{summary:'Inadequate command plan.',gaps:[]},f.author.provenance),b=bound(f.input,a),task=r.designReviewTask(b);
  const review=native.constructNativeWorkspaceWorkObservation(task,context,null,provenance('independent-invalid-plan'),f.raw);
  assert(!gate.evaluate(b,review),'raw positive cannot admit weakened or unauthorized execution plan');
  assert(!gate.evaluate(f.reviewInput,review),'a later valid observation cannot replace the selected current subject');
 }
 const extended={...f.asset,commands:[...f.asset.commands,{...f.asset.commands[0],commandId:'command://extra',args:['additional-check.mjs']}]};
 await fs.writeFile(join(f.env.canonicalRoot,f.designPath),JSON.stringify(extended));
 const extensionContext=await physical.observeWorksiteContext({...f.env,readRoots:f.after.readRoots,maxFiles:f.after.maxFiles,maxBytes:f.after.maxBytes});
 const extensionAuthor=native.constructNativeWorkspaceWorkObservation(r.designAuthorTask(f.input),extensionContext,{summary:'Scoped additional proof command.',gaps:[]},f.author.provenance),extensionInput=bound(f.input,extensionAuthor);
 const extensionReview=native.constructNativeWorkspaceWorkObservation(r.designReviewTask(extensionInput),extensionContext,null,provenance('independent-extension'),f.raw);
 assert(gate.evaluate(extensionInput,extensionReview),'existing command bounds permit independently assessed additional proof');
 assert.equal(r.selectDesign(bound(f.input,extensionReview)).executionPlan.commands.length,f.asset.commands.length+1);
 await fs.unlink(join(f.env.canonicalRoot,f.designPath));
 const missing=await physical.observeWorksiteContext({...f.env,readRoots:f.after.readRoots,maxFiles:f.after.maxFiles,maxBytes:f.after.maxBytes});
 const missingAuthor=native.constructNativeWorkspaceWorkObservation(r.designAuthorTask(f.input),missing,{summary:'No Design was produced.',gaps:['candidate absent']},f.author.provenance);
 assert(!r.NATIVE_CONTINUATION_SEMANTICS.resolveJudgmentRelation(reentry.stepPredicateRef).evaluate(missingAuthor.task,missingAuthor),'missing Design blocks at author foldback before preparation');
 t.diagnostic(diagnostic);
});
