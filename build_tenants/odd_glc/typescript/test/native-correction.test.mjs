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
import {ids,correction,correctionStages,ASSESSMENT_SCHEMA_TEXT,CORRECTION_SELECTION_SCHEMA_TEXT} from '../src/native-continuation-contracts.mjs';
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
 for(const stage of correctionStages){
  const matches=Object.values(r).filter(x=>x?.kind==='packaged_leaf_implementation_descriptor'&&x.namedSymbol===stage.namedSymbol);
  assert.equal(matches.length,1);assert(p.isPackagedLeafImplementationDescriptor(matches[0]));assert.equal(typeof r[stage.namedSymbol],'function');
 }
 const roles=constructNativeContinuationEnvironmentRoles({gtl,product:p,publication:pub,nativePublications:nativePubs,sourceBasisRef:'stdo://releases/v2.5.0-rc.4/',accessRefs:[],
  sourceSelections:{common:[],worker:[],reviewer:[],construction:[],execution:[],evidence:[]}});
 assert.deepEqual(roles.map(x=>x.role).sort(),['assessor','command_executor','constructor']);
 assert.deepEqual(roles.find(x=>x.role==='constructor').contextPolicy.selectors,['current_worksite']);
 assert.deepEqual(roles.find(x=>x.role==='command_executor').contextPolicy.selectors,['current_worksite','admitted_execution_evidence']);
 assert.notEqual(JSON.parse(CORRECTION_SELECTION_SCHEMA_TEXT).$id,JSON.parse(ASSESSMENT_SCHEMA_TEXT).$id);
 assert.deepEqual(JSON.parse(CORRECTION_SELECTION_SCHEMA_TEXT).properties.disposition.enum,['construction_repair','stage_revision_required','blocked']);
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
