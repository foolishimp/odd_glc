import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as product from '@abiogenesis/typescript-tenant/product';
import * as gtl from '@abiogenesis/typescript-tenant/gtl';
import * as validator from '@abiogenesis/typescript-tenant/validator';
import {constructLifecycleProgram,constructProgramConstructionLibrary,selectLifecycleWork,projectNativeSource} from '../src/program-construction.mjs';
import {ids,stages,dependencyKind} from '../src/program-construction-contracts.mjs';
import {isConstructionInput,authenticSource,reacquisitionRequest,evaluationInput,PROGRAM_CONSTRUCTION_SEMANTICS} from '../src/program-construction-runtime.mjs';
import {loadNative44Fixture,constructNative44Candidate} from './fixtures/program-construction/native44-input.mjs';
import {evaluatorPublication,deriveNativeRecords,evaluateNativeRecords,EVALUATOR_SEMANTICS,fixtureIds} from './fixtures/program-construction/native-records-evaluator.mjs';
const hash=product.sha256Canonical,z='sha256:'+'0'.repeat(64),version='5.0.0';
const artifact={productId:product.ABI5_PRODUCT_ID,packageName:product.ABI5_PACKAGE_NAME,packageVersion:product.ABI5_PACKAGE_VERSION,
  artifactDigest:z,productContentDigest:z,manifestDigest:z,productManifestDigest:z};
const library=constructProgramConstructionLibrary({gtl,product,artifact}),core=gtl.constructWorksiteCommandExecutionModulePublication(artifact),evaluator=evaluatorPublication({gtl,artifact});
const f=await loadNative44Fixture({evaluatorGraph:evaluator.graphFunctions[0]});
const basis=input=>({executionObservation:input.origin.observation,nativeWork:input.origin.observation.task.sourceNativeWork,
  construction:input.origin.construction,execution:input.origin.execution,sourceRefs:input.origin.sourceRefs,currentContext:input.currentContext,evaluations:[]});
const select=(input=f.input,override={})=>selectLifecycleWork({product,model:input.model,basis:basis(input),selectedDutyRefs:input.selectedDutyRefs,...override});
const route={roles:['evaluate'],fitJudgment:{ref:'judgment://component/contract-fit',digest:hash('contract-fit')},
  obligationRefs:f.input.model.duties.filter(d=>d.role==='evaluate').map(d=>d.obligationRef),permittedEffects:[],
  publications:[library,core,evaluator],graphFunctionRefs:[ids.authenticateGraphFunctionRef,product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,ids.prepareGraphFunctionRef,fixtureIds.graphFunctionRef],retainEntryAfter:[1]};
const construct=(input=f.input,routes=[route])=>constructLifecycleProgram({gtl,product,artifact,model:input.model,basis:basis(input),selectedDutyRefs:input.selectedDutyRefs,routes});
function validation(candidate){const pubs=[candidate.publication,core,evaluator];const raw=(x,k)=>validator.rawAdmitValue(x,k,'contract://component/'+k);
  return validator.validateProgram({declarationBasisDigest:hash(pubs),programPublication:raw(candidate.publication,'module_publication'),program:raw(candidate.publication.programs[0],'gtl_program'),
    graphFunctions:pubs.flatMap(p=>p.graphFunctions).map(x=>raw(x,'graph_function')),contracts:pubs.flatMap(p=>p.contracts).map(x=>raw(x,'contract_declaration')),
    implementationBindings:pubs.flatMap(p=>p.implementationBindings).map(x=>raw(x,'implementation_binding')),closureContracts:pubs.flatMap(p=>p.closureContracts).map(x=>raw(x,'closure_contract')),rules:[],evaluators:[]});}
function componentEvaluationInput(input=f.input){const request=reacquisitionRequest(input),acquired=product.constructNativeWorksiteCommandExecutionTask({...request,
  sourceReacquisition:{request,nativeBasis:{predecessorPrefix:request.source.prefix,cCallRef:'c-call://component/unadmitted-reacquisition'},bindingCoverEventRefs:[]}});
  return evaluationInput(product.constructRetainedGraphInput(input,acquired));}

test('actual retained native projection selects only the missing computation, retaining the original population',()=>{
  assert(isConstructionInput(f.input));assert.equal(f.componentPremises,true);
  const selection=select();assert.equal(selection.disposition,'candidate');assert.deepEqual(selection.work.map(w=>w.role),['evaluate','evaluate']);
  assert.equal(selection.support.length,2);assert.equal(selection.carriedBindingRefs.length,13);assert.equal(selection.originalTaskCompletion,'not_claimed');
  assert.equal(f.input.origin.bindingRefs.length,15);assert.equal(f.input.origin.observation.commandResults.length,9);
});
test('real installed GTL validation accepts the ordinary generated acquisition/evaluation composition',async()=>{
  const candidate=construct();assert.equal(candidate.kind,'candidate');const result=validation(candidate);
  assert.equal(result.kind,'program_validation',JSON.stringify(result));
  const actualFixture=await constructNative44Candidate({gtl,artifact});
  assert.equal(actualFixture.candidate.start.programRef,candidate.start.programRef);
  const root=candidate.publication.graphFunctions.find(g=>g.name===candidate.start.graphFunctionRef);assert.equal(root.template.nodes.length,4);
  assert.equal(root.template.edges.filter(e=>e.inputBinding).length,1);
  const membership=candidate.publication.programs[0].callableMembership;
  assert(!membership.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef));
  assert(!membership.includes(product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
  assert(!membership.includes(product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
  assert.deepEqual(root.effects,[]);
});
test('packaging fixture publishes an admissible callable with exact Program membership',()=>{
  const raw=(x,k)=>validator.rawAdmitValue(x,k,'contract://abiogenesis/gtl/'+k.replaceAll('_','-')+'@5');
  const check=publication=>validator.validatePublication(raw(publication,'module_publication'),
    publication.contributions.map(c=>raw(c,'catalog_contribution')));
  assert.equal(check(evaluator).kind,'publication_validation',JSON.stringify(check(evaluator)));
  const absent=structuredClone(evaluator);absent.programs=[];absent.contributions[0].programMembershipRefs=[];
  assert.equal(check(absent).kind,'static_validation_refusal');
  const duplicate=structuredClone(evaluator);duplicate.contributions[0].provenanceRefs=[z,z];
  assert.equal(check(duplicate).kind,'static_validation_refusal');
});
test('missing artifact versus missing execution preserve necessity; absent published compositions stay gaps',()=>{
  const absent={...basis(f.input),nativeWork:undefined,executionObservation:undefined};
  assert.deepEqual(select(f.input,{basis:absent}).work.map(r=>r.role),['construct','execute','evaluate','evaluate']);
  assert.deepEqual(select(f.input,{basis:{...absent,currentContext:{entries:[]}}}).work.map(r=>r.role),['construct','execute','evaluate','evaluate']);
  const unexecuted={...basis(f.input),executionObservation:undefined};
  assert.deepEqual(select(f.input,{basis:unexecuted}).work.map(r=>r.role),['execute','evaluate','evaluate']);
  const missing=constructLifecycleProgram({gtl,product,artifact,model:f.input.model,basis:absent,selectedDutyRefs:f.input.selectedDutyRefs,routes:[route]});
  assert.equal(missing.kind,'gap');assert.equal(missing.gaps[0].cause,'compatible_published_composition_absent');
  const broader=constructLifecycleProgram({gtl,product,artifact,model:f.input.model,basis:absent,selectedDutyRefs:f.input.selectedDutyRefs,
    routes:[{...route,roles:['construct','execute','evaluate']}]});
  assert.equal(broader.gaps[0].cause,'executable_evidence_regime_not_supported');
});
test('assessment requires exact evidence/source, complete scope, satisfactory verdict and independence',()=>{
  const input=structuredClone(f.input),d=input.model.duties.at(-1);d.role='assess';input.selectedDutyRefs=[d.ref];
  const relation={dutyRef:d.ref,result:{ref:'result://component/assessment',digest:hash('assessment')},scopeRefs:d.scopeRefs,
    sourceRefs:input.origin.sourceRefs,execution:input.origin.execution,verdict:'satisfied',producer:{actorInvocationRef:'actor://component/independent',cCallRef:'c-call://component/independent'}};
  const b=basis(input);b.evaluations=[relation];assert.equal(select(input,{basis:b}).disposition,'report_refs');
  for(const change of [{verdict:'negative'},{verdict:'indeterminate'},{scopeRefs:d.scopeRefs.slice(1)},
    {sourceRefs:[]},{execution:{ref:'result://wrong',digest:hash('wrong')}},{producer:input.origin.observation.task.sourceNativeWork.provenance}]) {
    assert.equal(select(input,{basis:{...b,evaluations:[{...relation,...change}]}}).work.at(-1).role,'assess');
  }
  assert.equal(isConstructionInput(input),false,'the first executable adapter cannot authenticate arbitrary assessment projections');
});
test('all selected duties supported reports references without creating original-task completion',()=>{
  const b=basis(f.input);b.evaluations=f.input.model.duties.filter(d=>d.role==='evaluate').map(d=>({dutyRef:d.ref,
    result:{ref:'result://component/'+d.ref,digest:hash(d.ref)},scopeRefs:d.scopeRefs,sourceRefs:f.input.origin.sourceRefs,
    execution:f.input.origin.execution,verdict:'satisfied'}));
  const selection=select(f.input,{basis:b});assert.equal(selection.disposition,'report_refs');assert.equal(selection.work.length,0);
  assert.equal(selection.originalTaskCompletion,'not_claimed');assert.equal(selection.carriedBindingRefs.length,13);
  assert.equal(constructLifecycleProgram({gtl,product,artifact,model:f.input.model,basis:b,selectedDutyRefs:f.input.selectedDutyRefs,routes:[]}).kind,'report_refs');
});
test('stale or unknown support blocks affected reuse and never infers rollback',()=>{
  const input=structuredClone(f.input);input.currentContext.entries.find(e=>e.relativePath==='test-execution-plan.json').digest=hash('changed');
  assert.equal(select(input).disposition,'gap');assert.equal(isConstructionInput(input),false);
  const missing=select(f.input,{basis:{...basis(f.input),currentContext:null}});assert.equal(missing.disposition,'gap');
  assert(missing.gaps.every(g=>g.state==='unknown'));
});
test('missing historical construction input remains a prospective obligation',()=>{
  const input=structuredClone(f.input),d={...input.model.duties[0],ref:'duty://component/constructed-from',role:'provenance'};
  input.model.duties.push(d);input.selectedDutyRefs=[d.ref];
  assert.equal(select(input).work[0].reason,'historical_input_relation_absent');
  assert.equal(construct(input).kind,'gap');
});
function prospectiveInput() {
  const input=structuredClone(f.input),template=input.model.duties[0],retained=input.origin.observation.task.sourceNativeWork;
  const predecessor=retained.before.entries.find(e=>e.state==='file'&&retained.task.readFirst.includes(e.relativePath)&&
    input.currentContext.entries.some(c=>c.relativePath===e.relativePath&&c.state==='file'&&c.digest===e.digest));
  assert(predecessor,'the representative retained basis has an unchanged historical input');
  const producer={...template,ref:'duty://component/prospective-producer',role:'provenance',requires:[],
    dependencies:[{path:predecessor.relativePath,digest:predecessor.digest}],dependentPaths:['prospective-design.md']};
  const consumer={...template,ref:'duty://component/prospective-consumer',role:'provenance',requires:[producer.ref],
    dependencies:[{producerDutyRef:producer.ref,path:producer.dependentPaths[0]}],dependentPaths:['prospective-source.mjs']};
  const evaluation={...input.model.duties.at(-1),ref:'duty://component/prospective-evaluation',requires:[consumer.ref],
    dependencies:[{producerDutyRef:consumer.ref,path:consumer.dependentPaths[0]}]};
  const assessment={...evaluation,ref:'duty://component/prospective-assessment',role:'assess',requires:[evaluation.ref,consumer.ref]};
  input.model.duties.push(producer,consumer,evaluation,assessment);input.selectedDutyRefs=[assessment.ref];
  return {input,producer,consumer,evaluation,assessment};
}
test('future outputs bind prerequisite duties and paths without borrowing retained digests or provenance',()=>{
  const {input,producer,consumer,evaluation,assessment}=prospectiveInput(),before=structuredClone(input);
  const result=select(input);
  assert.equal(result.disposition,'candidate');
  assert.deepEqual(result.interpretation,input.model.interpretation);assert.deepEqual(result.sourceRefs,input.model.sourceRefs);
  assert.deepEqual(result.work.map(w=>w.dutyRef),[producer.ref,consumer.ref,evaluation.ref,assessment.ref]);
  assert.equal(result.work[0].reason,'prospective_input_relation_not_established');
  assert.deepEqual(result.work[0].dependentPaths,producer.dependentPaths);
  for(const row of result.work.slice(1)) {
    assert.deepEqual(row.dependencies,input.model.duties.find(d=>d.ref===row.dutyRef).dependencies);
    assert(row.dependencies.every(d=>dependencyKind(d)==='producer_output'&&!Object.hasOwn(d,'digest')));
    assert(!Object.hasOwn(row,'refs'),'no historical support coordinate belongs to future work');
    assert.equal(row.bindingRef,input.model.duties.find(d=>d.ref===row.dutyRef).bindingRef);
  }
  assert.deepEqual(input,before);assert.equal(Object.isFrozen(input.model.duties[0]),false);
  assert.equal(result.originalTaskCompletion,'not_claimed');
  assert.equal(isConstructionInput(input),false);
  const allRoles={...route,roles:['provenance','evaluate','assess'],obligationRefs:[...new Set(result.work.map(w=>w.obligationRef))]};
  assert.equal(construct(input,[allRoles]).gaps[0].cause,'executable_evidence_regime_not_supported');
  // Removing the prospective output declaration exposes only the original
  // historical input relation, never credit for the newly declared work.
  const historical=structuredClone(input);historical.model.duties=historical.model.duties.filter(d=>d.ref!==consumer.ref&&d.ref!==evaluation.ref&&d.ref!==assessment.ref);
  delete historical.model.duties.find(d=>d.ref===producer.ref).dependentPaths;historical.selectedDutyRefs=[producer.ref];
  assert.equal(select(historical).disposition,'report_refs');
});
test('missing, ambiguous, undeclared and cyclic producer bindings refuse before candidate construction',()=>{
  const cases=[
    [({consumer})=>{consumer.dependencies[0].producerDutyRef='duty://absent';},/exact producer duty/],
    [({input,producer})=>{input.model.duties.push(structuredClone(producer));},/unique duty/],
    [({consumer})=>{consumer.requires=[];},/declared prerequisite/],
    [({consumer})=>{consumer.dependencies[0].path='undeclared.md';},/declared producer output/],
    [({consumer})=>{consumer.dependencies[0].digest=hash('invented future');},/invalid duty/],
    [({consumer})=>{consumer.dependencies.push({...consumer.dependencies[0]});},/ambiguous dependency path/],
    [({producer})=>{producer.dependentPaths.push(producer.dependentPaths[0]);},/invalid duty/],
    [({producer,consumer})=>{producer.requires=[consumer.ref];producer.dependencies=[{producerDutyRef:consumer.ref,path:consumer.dependentPaths[0]}];},/cyclic/],
  ];
  for(const [change,expected] of cases){const fixture=prospectiveInput();change(fixture);assert.throws(()=>select(fixture.input),expected);}
});
test('present, absent, changed and unavailable observed inputs retain affected dependency states',()=>{
  const {input,producer,consumer,assessment}=prospectiveInput(),path=producer.dependencies[0].path;
  assert.equal(select(input).disposition,'candidate');
  const cases=[
    [entry=>{entry.digest=hash('changed predecessor');},'stale','current_dependency_changed'],
    [entry=>{entry.state='absent';delete entry.digest;},'stale','current_dependency_absent'],
    [entry=>{entry.state='unavailable';delete entry.digest;},'unknown','current_dependency_unavailable'],
  ];
  for(const [change,state,reason] of cases) {
    const changed=structuredClone(input);change(changed.currentContext.entries.find(e=>e.relativePath===path));
    const selection=select(changed);assert.equal(selection.disposition,'gap');assert.equal(selection.work.length,0);
    assert.equal(selection.gaps.find(g=>g.dutyRef===producer.ref).dependencyStates[0].reason,reason);
    for(const ref of [producer.ref,consumer.ref,assessment.ref])assert.equal(selection.gaps.find(g=>g.dutyRef===ref).state,state);
  }
  for(const modify of [ctx=>{ctx.entries=ctx.entries.filter(e=>e.relativePath!==path);},
    ctx=>{ctx.entries.push({...ctx.entries.find(e=>e.relativePath===path)});}]) {
    const changed=structuredClone(input);modify(changed.currentContext);
    assert.equal(select(changed).gaps.find(g=>g.dutyRef===producer.ref).state,'unknown');
  }
  const mixed=structuredClone(input);mixed.model.duties.find(d=>d.ref===consumer.ref).dependencies.push({path:'not-observed.md',digest:hash('not-observed')});
  assert.equal(select(mixed).gaps.find(g=>g.dutyRef===consumer.ref).state,'unknown','a selected producer does not invent an unrelated observed input');
});
test('missing prerequisite work withdraws old assessments and preserves exact unsatisfactory relations',()=>{
  const {input,assessment}=prospectiveInput(),b=basis(input);
  const previous={dutyRef:assessment.ref,result:{ref:'result://component/prior-assessment',digest:hash('prior')},
    sourceRefs:b.sourceRefs,execution:b.execution,scopeRefs:assessment.scopeRefs,verdict:'satisfied',
    producer:{actorInvocationRef:'actor://component/independent',cCallRef:'c-call://component/independent'}};
  for(const verdict of ['satisfied','negative','indeterminate']) {
    const relation={...previous,verdict},result=select(input,{basis:{...b,evaluations:[relation]}});
    const row=result.work.find(w=>w.dutyRef===assessment.ref);
    assert.equal(row.state,'missing');assert.deepEqual(row.evaluations,[relation]);
    assert(!result.support.some(s=>s.dutyRef===assessment.ref));assert(!Object.hasOwn(row,'refs'));
  }
  // Even an assessment without a direct future-output reference cannot reuse
  // its old result when a required prospective predecessor is unresolved.
  assessment.dependencies=[];
  const missing=select(input,{basis:{...b,evaluations:[previous]}});
  assert(!missing.support.some(s=>s.dutyRef===assessment.ref));
  input.model.duties.find(d=>d.ref===assessment.requires[0]).applicability={value:'unknown',basisRefs:['ruling://pending']};
  const unknown=select(input,{basis:{...b,evaluations:[previous]}}).gaps.find(g=>g.dutyRef===assessment.ref);
  assert.equal(unknown.state,'unknown');assert(!Object.hasOwn(unknown,'refs'));assert.deepEqual(unknown.evaluations,[previous]);
});
test('partial binding selection carries other duties and mandatory assessment with their uncertainty',()=>{
  const {input,producer,consumer,assessment}=prospectiveInput();input.selectedDutyRefs=[producer.ref];
  const result=select(input);
  assert(result.carriedDutyRefs.includes(consumer.ref));assert(result.carriedDutyRefs.includes(assessment.ref));
  assert(result.carriedBindingRefs.includes(producer.bindingRef));
  assert.equal(result.carriedDuties.find(d=>d.dutyRef===assessment.ref).role,'assess');
  const originalUnknown=structuredClone(input);originalUnknown.model.duties.find(d=>d.ref===assessment.ref).applicability.value='unknown';
  assert.equal(select(originalUnknown).carriedDuties.find(d=>d.dutyRef===assessment.ref).state,'unknown');
});
test('excluded producer cannot supply a future output; excluded consumer selects no prerequisite work',()=>{
  const {input,producer,consumer}=prospectiveInput();producer.applicability={value:'false',basisRefs:['ruling://producer/inapplicable']};
  const result=select(input);assert.equal(result.gaps.find(g=>g.dutyRef===consumer.ref).reason,'producer_excluded');
  assert.deepEqual(result.excluded.find(e=>e.dutyRef===producer.ref).basisRefs,producer.applicability.basisRefs);
  const excluded=prospectiveInput();excluded.input.selectedDutyRefs=[excluded.consumer.ref];
  excluded.consumer.applicability={value:'false',basisRefs:['ruling://consumer/inapplicable']};
  const skipped=select(excluded.input);assert.equal(skipped.disposition,'report_refs');assert.equal(skipped.work.length,0);
  assert(skipped.carriedDutyRefs.includes(excluded.producer.ref));
});
test('applicability unknown stays residual, false records basis, cycles refuse',()=>{
  for(const [value,expected] of [['unknown','gap'],['false','report_refs']]) {
    const input=structuredClone(f.input);input.model.duties.filter(d=>d.role==='evaluate').forEach(d=>d.applicability.value=value);
    assert.equal(select(input).disposition,expected);
  }
  const cyclic=structuredClone(f.input);cyclic.model.duties[0].requires=[cyclic.model.duties.at(-1).ref];assert.throws(()=>select(cyclic),/cyclic/);
});
test('actual incompatible effects/interfaces and ambiguous candidates refuse selection',()=>{
  const changed=structuredClone(route);changed.publications[2].graphFunctions[0].effects=['effect://component/ungranted'];
  assert.equal(construct(f.input,[changed]).gaps[0].cause,'effect_not_permitted');
  const incompatible=structuredClone(route);incompatible.publications[2].graphFunctions[0].inputs=['contract://component/wrong'];
  assert.throws(()=>construct(f.input,[incompatible]),/incompatible/);
  assert.equal(construct(f.input,[route,route]).gaps[0].cause,'ambiguous_compatible_composition');
});
test('irrelevant history and task labels do not change declaration identity or residual reduction',()=>{
  const input=structuredClone(f.input);input.model.taskRef='task://different-label';
  const a=construct(),b=construct(input);assert.equal(a.start.programRef,b.start.programRef);
  assert.equal(a.start.programRef,construct(f.input,[{...route,fitJudgment:{ref:'judgment://other-task/fit',digest:hash('other-fit')}}]).start.programRef);
  assert.deepEqual(select(f.input,{basis:{...basis(f.input),unrelatedHistory:['unused audit']}}),select());
});
test('first judgment refuses absent owner proof and forged retained source even when caller JSON is shaped',()=>{
  const request=reacquisitionRequest(f.input),relation=PROGRAM_CONSTRUCTION_SEMANTICS.resolveJudgmentRelation(stages[0].predicateRef);
  assert.equal(relation.evaluate(f.input,request),false);assert.equal(authenticSource(f.input,{},{}),false);
  const changed=structuredClone(f.terminalValue);changed.current.basis.jobRef='semantic-job://forged';
  assert.equal(authenticSource(f.input,{}, {historicalGraphCallSource:()=>({terminalResult:{...f.terminal,value:changed}})}),false);
  const substituted=structuredClone(f.input);substituted.origin.execution.digest=hash('forged');
  assert.equal(authenticSource(substituted,{}, {historicalGraphCallSource:()=>({terminalResult:f.terminal})}),false);
});
test('actual retained streams compute exact reviewed-candidate records; pure checks grant no admission',async()=>{
  const input=componentEvaluationInput(),output=deriveNativeRecords(input),expected=JSON.parse(await fs.readFile(new URL('./fixtures/program-construction/expected-native44.json',import.meta.url),'utf8'));
  assert.deepEqual(evaluateNativeRecords(input).resultCandidate,output,'actual packaged leaf hashes only I-JSON values');
  assert.deepEqual(output.records.derivationBasis.executionObservation,input.executionRecord.observation);
  assert.equal(Object.hasOwn(output.records.derivationBasis,'producer'),false,'absent historical fields remain absent');
  for(const [key,value] of Object.entries(expected))assert.deepEqual(output.records[key],value,key);
  assert.equal(output.records.perSuite.length,2);assert(output.records.perSuite.every(s=>s.passed));
  assert.equal(input.executionObservation,undefined,'evaluator gets an admitted compact record view, never native prompt bodies');
  assert.equal(input.executionRecord.commandResults.length,9);
  assert.equal(output.execution.ref,f.coordinates.execution.resultRef);assert.equal(output.evidenceRole,'computed_derivation');
  assert.equal(EVALUATOR_SEMANTICS.resolveJudgmentRelation(fixtureIds.predicateRef).evaluate(input,output),true);
  const altered=structuredClone(output);altered.records.conditions.componentPassed=false;
  assert.equal(EVALUATOR_SEMANTICS.resolveJudgmentRelation(fixtureIds.predicateRef).evaluate(input,altered),false);
  const stale=structuredClone(input);stale.currentContext.entries.find(e=>e.relativePath==='test-execution-plan.json').digest=hash('stale');
  assert.throws(()=>deriveNativeRecords(stale),/selected native evaluator input required/);
});

test('TAP headings are not results; role attribution still rejects absent, duplicate or conflicting results',()=>{
  const input=componentEvaluationInput(),titles=input.evaluator.parameters.suites.map(s=>s.title);
  const summaries=['1..2','# tests 2','# suites 0','# pass 2','# fail 0','# cancelled 0','# skipped 0','# todo 0'];
  const records=lines=>{
    // These are unadmitted parser premises, never replacements for native44 evidence.
    const changed=structuredClone(input),bytes=Buffer.from(['TAP version 13',...lines,...summaries,''].join('\n'));
    changed.executionRecord.commandResults.find(r=>r.commandId===changed.evaluator.parameters.plannedCommandId).stdout={
      payload:bytes.toString('base64'),byteLength:bytes.length,digest:product.sha256Bytes(bytes)};
    return deriveNativeRecords(changed).records;
  };
  const lines=[`# Subtest: ${titles[0]}`,`ok 1 - ${titles[0]}`,`# Subtest: ${titles[1]}`,`ok 2 - ${titles[1]}`];
  const passed=records(lines);
  assert.deepEqual(passed.conditions,{componentPassed:true,uatPassed:true,planSatisfied:true,passFloor:true});
  assert(passed.perSuite.every(s=>s.witnesses.length===1));
  for(const first of [[],[`ok 1 - ${titles[0]}`,`ok 3 - ${titles[0]}`],
    [`ok 1 - ${titles[0]}`,`not ok 3 - ${titles[0]}`],[`ok 1 - unrelated ${titles[0]}`]]) {
    const refused=records([`# Subtest: ${titles[0]}`,...first,...lines.slice(2)]);
    assert.equal(refused.conditions.componentPassed,false);
    assert.equal(refused.conditions.uatPassed,true);
  }
});
