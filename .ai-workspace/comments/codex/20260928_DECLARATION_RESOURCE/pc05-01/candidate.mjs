// Pure original-source PC05 declaration. No dispatch, filesystem effect or proof creation.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {caseBasis as compactBasis} from '../installed-01/candidate.mjs';
import {loadNative44Fixture} from '../../../../../build_tenants/odd_glc/typescript/test/fixtures/program-construction/native44-input.mjs';
import {evaluatorPublication} from '../../../../../build_tenants/odd_glc/typescript/test/fixtures/program-construction/native-records-evaluator.mjs';
import {constructProgramConstructionLibrary,constructLifecycleProgram,projectNativeSource,selectLifecycleWork} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction.mjs';
import {constructNativeConstructionInput} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-runtime.mjs';
import {ids} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-contracts.mjs';

export async function caseBasis() {
  const base=await compactBasis();
  const original=JSON.parse(await readFile(base.configurationPath,'utf8'));
  const roles=original.runEnvironment.roles.filter(r=>r.role==='constructor'||r.role==='assessor');
  assert.deepEqual(roles.map(r=>r.role).sort(),['assessor','constructor']);
  const configuration={...original,
    // Current PC05 selection explicitly supersedes the predecessor's model name.
    transport:{...original.transport,model:'claude-opus-5-5',effort:'xhigh'},
    runEnvironment:{...original.runEnvironment,declarationRef:'environment://odd-glc/T-043/pc05-original-source@5',roles}};
  return {...base,configuration};
}

export async function constructCase({product,gtl,artifact,sourceSelection,runEnvironment,authority,currentContext}) {
  assert(sourceSelection?.declarationReference,'explicit compact original source selection required');
  const evaluator=evaluatorPublication({gtl,artifact});
  const fixture=await loadNative44Fixture({evaluatorGraph:evaluator.graphFunctions[0],sourceSelection,authority,currentContext});
  assert.equal(fixture.componentPremises,false);
  const original=fixture.input,bindings=fixture.terminalValue.current.bindingVersions;
  assert.equal(bindings.length,15);
  const origin=projectNativeSource(product,fixture.terminalValue,{includeAssessment:true});
  const model=structuredClone(original.model),retainedDependencies=structuredClone(model.duties[0].dependencies);
  const common=(binding,role,requires=[])=>({ref:binding.binding.obligationRef+'/'+role,role,
    obligationRef:binding.binding.obligationRef,bindingRef:binding.versionRef,requires,
    scopeRefs:[binding.binding.proofPolicyRef,binding.binding.proofShapeRef],
    applicability:{value:'true',basisRefs:[binding.binding.proofPolicyRef]},dependencies:structuredClone(retainedDependencies)});
  // Preserve the original duties and every binding's unresolved evaluation/assessment pressure.
  for(const binding of bindings) {
    let evaluation=model.duties.find(d=>d.bindingRef===binding.versionRef&&d.role==='evaluate');
    if(!evaluation){evaluation=common(binding,'evaluate');model.duties.push(evaluation);}
    model.duties.push(common(binding,'assess',[evaluation.ref]));
  }
  const observed=path=>{
    const rows=original.currentContext.entries.filter(e=>e.relativePath===path&&e.state==='file');
    assert.equal(rows.length,1,'one actual current predecessor: '+path);return {path,digest:rows[0].digest};
  };
  const surface=['package.json','src/hello.mjs'];
  const edgePlan=[
    {ordinal:5,key:'implementation-design',dependentPaths:['design/implementation-design.md'],predecessors:['specification/project-conformance.md']},
    {ordinal:12,key:'source',dependentPaths:surface,predecessors:['design/implementation-design.md']},
    {ordinal:6,key:'test-design',dependentPaths:['design/test-design.md'],predecessors:surface},
    {ordinal:12,key:'component',dependentPaths:['test/component/hello.test.mjs'],predecessors:['design/test-design.md',...surface]},
    {ordinal:12,key:'uat',dependentPaths:['test/uat/hello.uat.test.mjs'],predecessors:['test/component/hello.test.mjs','design/test-design.md',...surface]},
    {ordinal:9,key:'plan',dependentPaths:['test-execution-plan.json'],predecessors:['test/component/hello.test.mjs','test/uat/hello.uat.test.mjs']},
  ];
  const provenance=edgePlan.map(row=>({...common(bindings[row.ordinal],'provenance'),
    ref:bindings[row.ordinal].binding.obligationRef+'/provenance/'+row.key,
    dependentPaths:row.dependentPaths,dependencies:row.predecessors.map(observed)}));
  model.duties.push(...provenance);
  const candidatePaths=edgePlan.flatMap(row=>row.dependentPaths);
  assert.equal(new Set(candidatePaths).size,7);
  const originalGrant=origin.observation.task.sourceNativeWork.task.writeRoots;
  assert(candidatePaths.every(path=>originalGrant.includes(path)),'all seven dependents within original native grant');
  assert(bindings[5].policy.realizationMeaning.some(s=>s.includes('specification/project-conformance.md')));
  assert(bindings[6].policy.scope.includes('design/test-design.md'));
  assert(bindings[9].policy.scope.includes('test-execution-plan.json'));
  assert(bindings[12].policy.realizationMeaning.some(s=>s.includes('both verifiers to the plan')));
  const comparison=model.duties.find(d=>d.bindingRef===bindings[14].versionRef&&d.role==='evaluate');
  comparison.requires=provenance.map(d=>d.ref);
  const selectedOrdinals=[5,6,9,12,14];
  const assessors=selectedOrdinals.map(ordinal=>model.duties.find(d=>d.bindingRef===bindings[ordinal].versionRef&&d.role==='assess'));
  const originalProducers=original.model.duties.filter(d=>['construct','execute'].includes(d.role)).map(d=>d.ref);
  for(const assessor of assessors) {
    assessor.requires=[comparison.ref];
    assessor.independentOf=[...provenance.map(d=>d.ref),...originalProducers];
  }
  model.interpretation={ref:'interpretation://odd-glc/T-043/pc05-original-source/construction-comparison-assessment',
    digest:product.sha256Canonical({sourceRefs:model.sourceRefs,edgePlan,
      bindings:selectedOrdinals.map(i=>({ref:bindings[i].versionRef,digest:bindings[i].versionDigest,policy:bindings[i].policy,shape:bindings[i].shape})),
      evaluator:original.evaluator.fitJudgment,
      rule:'Actual prospective derivation from observed predecessors; every edge reaches independent assessment. Retain the complete duty population, original oracle and non-closing residuals. Changed command dependencies forbid retained execution reuse.'})};
  const constructionGroups=[{ref:'group://odd-glc/T-043/pc05-original-source/seven-dependents',
    dutyRefs:provenance.map(d=>d.ref),fitJudgment:model.interpretation,
    outcome:'Derive the seven selected dependent surfaces from the named current predecessors under the complete original Hello World declaration. Report actual work, basis and unresolved gaps; original task closure is not claimed.',
    instructions:[
      'Read the complete original-js-sdlc-bootstrap-declaration.txt and specification/project-conformance.md. Preserve their source meaning and all fifteen original obligations. This selected group supplies prospective construction, followed by supplied computation and a separate independent assessor.',
      'Perform actual source-grounded dependent derivation for every relation below, using the observed predecessor bytes at their declared digests. They already exist; this group claims no future-output dependency. Follow the original content requirements for each selected surface.',
      ...edgePlan.map(row=>row.dependentPaths.join(' and ')+' must be derived from '+row.predecessors.join(' and ')+'.'),
      'Retain correct existing content when warranted by actual derivation and explain that decision. Do not reread, touch or rewrite solely to manufacture provenance. Do not force byte equality or suppress a needed correction. Report which predecessor basis informed each dependent and any conflicts or gaps.',
      'If a needed correction changes a declared predecessor or retained command/snapshot dependency, report the changed basis and stop any claim that old execution evidence remains current. A later owner decision handles affected execution; this continuation does not rerun C2.',
      'Write only the seven selected paths. Do not execute application commands, tests, verification scripts or any evaluator oracle. Native checks are empty. Do not create success reports, raw observations, proof records, a substitute oracle or a second rubric.',
      'Preserve the absent raw argument/type-field residual and the separate Executive conjunction of accepted bindings10/11. Construction and a later assessment do not close the original task or carried duties.'
    ],
    readFirst:[...new Set(['original-js-sdlc-bootstrap-declaration.txt',...edgePlan.flatMap(row=>row.predecessors),...candidatePaths])],
    writeRoots:candidatePaths,checks:[]}];
  const basis={executionObservation:origin.observation,construction:origin.construction,execution:origin.execution,
    sourceRefs:origin.sourceRefs,currentContext:original.currentContext,evaluations:[]};
  const selectedDutyRefs=assessors.map(d=>d.ref);
  const selection=selectLifecycleWork({product,model,basis,selectedDutyRefs});
  assert.equal(selection.disposition,'candidate',JSON.stringify(selection.gaps));
  const rubricFile=original.currentContext.entries.find(e=>e.relativePath==='semantic-assets/lifecycle-rubric.json'&&e.state==='file');
  assert.equal(rubricFile?.digest,'sha256:c77a38d684dde09c38197415796c9594c900278dcc047abf8744c07f382a0edf');
  const rubric=JSON.parse(Buffer.from(rubricFile.bytes,'base64').toString('utf8'));
  const stages=rubric.stages.filter(s=>s.declarationRef==='stage://odd-glc/generic-lifecycle/evidence@5');
  assert.equal(stages.length,1);assert.equal(stages[0].rubric.length,5);
  // Match the unchanged evaluator's exact duty/dependent/predecessor iteration.
  const recordEdges=selection.work.filter(d=>d.role==='provenance').flatMap(d=>d.dependentPaths.flatMap(path=>
    d.dependencies.map(dependency=>({dutyRef:d.dutyRef,dependentPath:path,predecessor:dependency}))));
  const recordSelections=recordEdges.map((edge,index)=>({recordPath:'/records/constructionEdges/'+index,role:'construction_record',dutyRef:edge.dutyRef}));
  recordSelections.push({recordPath:'/records/comparison',role:'comparison_record',dutyRef:comparison.ref});
  const sourcePaths=original.currentContext.entries.filter(e=>e.state==='file'&&!candidatePaths.includes(e.relativePath)&&e.relativePath!==rubricFile.relativePath).map(e=>e.relativePath);
  assert(origin.sourceRefs.every(s=>sourcePaths.some(path=>observed(path).digest===s.digest)),'complete original source access');
  const assessment={claim:'Independently judge the selected actual construction relations and retained comparison under the complete original rubric and oracle. Preserve every false/unknown record and residual; the original task remains open.',
    fitJudgment:model.interpretation,rubric:{path:rubricFile.relativePath,digest:rubricFile.digest,stageRef:stages[0].declarationRef},
    sourcePaths,candidatePaths,recordSelections,
    criterionEvidence:stages[0].rubric.map(c=>({criterionRef:c.criterionRef,dutyRefs:selection.selectedDutyRefs,
      roles:['source','candidate','execution','oracle','construction_record','comparison_record']}))};
  const {kind,schemaVersion,evaluator:originalEvaluator,...source}=original;
  const input=constructNativeConstructionInput({...source,origin,model,selectedDutyRefs,constructionGroups,assessment,
    evaluator:{...originalEvaluator,fitJudgment:model.interpretation,parameters:{...originalEvaluator.parameters,
      comparison:{obligationRef:bindings[14].binding.obligationRef,bindingRef:bindings[14].versionRef,
        predicateId:'hello-world-return-exact',predicateKind:'module_export_return_exact',ordinal:6}}}});
  const core=gtl.constructWorksiteCommandExecutionModulePublication(artifact),native=gtl.constructNativeWorkspaceWorkModulePublication(artifact);
  const library=constructProgramConstructionLibrary({gtl,product,artifact,includeNativeConstruction:true,evaluationGraph:evaluator.graphFunctions[0],includeAssessment:true});
  const route={roles:[...new Set(selection.work.map(d=>d.role))],fitJudgment:model.interpretation,
    obligationRefs:[...new Set(selection.work.map(d=>d.obligationRef))],permittedEffects:[product.NATIVE_WORKSPACE_WORK_IDS.effectUri],
    publications:[library,core,native,evaluator],graphFunctionRefs:[ids.nativeAuthenticateGraphFunctionRef,
      product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,ids.prepareConstructionGraphFunctionRef,ids.constructionChildGraphFunctionRef,
      ids.prepareConstructedEvaluationGraphFunctionRef,ids.evaluationChildGraphFunctionRef,ids.prepareAssessmentInputGraphFunctionRef,ids.assessmentChildGraphFunctionRef],
    retainEntryAfter:[1,3,5]};
  const candidate=constructLifecycleProgram({gtl,product,artifact,runEnvironment,model,basis,selectedDutyRefs,constructionGroups,routes:[route]});
  assert.equal(candidate.kind,'candidate',JSON.stringify(candidate.gaps));
  assert.deepEqual(model.duties.slice(0,original.model.duties.length),original.model.duties,'original duties preserved');
  assert(!candidate.publication.programs[0].callableMembership.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef),'no C2 rerun');
  return {fixture:{...fixture,input},candidate,evaluatorPublication:evaluator,originalGrant,edgePlan,recordEdges};
}
