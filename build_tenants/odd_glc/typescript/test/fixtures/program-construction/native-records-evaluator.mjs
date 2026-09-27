// Qualification-subject evaluator. Domain meanings stay outside generic GLC.
// This module reads supplied immutable observations only. It imports no subject,
// opens no files, spawns nothing, and emits no runtime event or acceptance verdict.
import * as product from '@abiogenesis/typescript-tenant/product';
import * as gtl from '@abiogenesis/typescript-tenant/gtl';
import {isDeepStrictEqual as same} from 'node:util';
export const fixtureIds=Object.freeze({
  packageName:'@odd-glc/program-construction-fixture',packageVersion:'0.1.0-dev.2',
  productId:'product://odd-glc/program-construction-fixture@0.1.0-dev.2',
  moduleRef:'module://odd-glc/qualification/native-records@5',
  programRef:'program://odd-glc/qualification/native-records@5',
  graphFunctionRef:'graph-function://odd-glc/qualification/native-records@5',
  nodeRef:'node://odd-glc/qualification/native-records@5',
  inputContractRef:'contract://odd-glc/program-construction/evaluation-input@5',
  outputContractRef:'contract://odd-glc/qualification/native-records@5',
  bindingRef:'implementation-binding://odd-glc/qualification/native-records@5',
  implementationRef:'implementation://odd-glc/qualification/native-records@5',
  predicateRef:'predicate://odd-glc/qualification/native-records@5',
  closureRef:'contract://odd-glc/qualification/native-records-closure@5',
  semanticsRef:'product-semantics://odd-glc/qualification/native-records@5',
});
const need=(value,message)=>{if(!value)throw new TypeError(message);};
const text=stream=>{const bytes=Buffer.from(stream.payload,'base64');need(bytes.toString('base64')===stream.payload&&
  bytes.length===stream.byteLength&&product.sha256Bytes(bytes)===stream.digest,'exact retained stream required');return new TextDecoder('utf-8',{fatal:true}).decode(bytes);};
const count=(stdout,label)=>{const rows=stdout.split(/\r?\n/u).filter(line=>new RegExp(`^(?:#|ℹ) ${label} [0-9]+$`,'u').test(line));
  need(rows.length===1,'one observed '+label+' count required');return Number(rows[0].match(/[0-9]+$/u)[0]);};
const success=row=>row.exitStatus===0&&row.timedOut===false&&row.processSignal===null;
function file(input,path,digest){const rows=input.currentContext.entries.filter(e=>e.relativePath===path&&e.state==='file'&&e.digest===digest);
  need(rows.length===1,'exact current selected fixture artifact required: '+path);return new TextDecoder('utf-8',{fatal:true}).decode(Buffer.from(rows[0].bytes,'base64'));}
export function isEvaluatorInput(input) {return input?.kind==='lifecycle_evaluation_input'&&input.schemaVersion==='5.0.0'&&
  Array.isArray(input.executionRecord?.commandResults)&&Array.isArray(input.executionRecord.snapshotMembers)&&
  product.isWorksiteContextObservation(input.currentContext)&&
  input.evaluator?.graphFunction?.ref===fixtureIds.graphFunctionRef&&input.evaluator.graphFunction.digest===graphDigest&&
  input.originalTaskCompletion==='not_claimed';}
export function deriveNativeRecords(input) {
  need(isEvaluatorInput(input),'selected native evaluator input required');
  if(input.constructionObservations)return deriveConstructionRecords(input);
  const p=input.evaluator.parameters,e=input.executionRecord;
  const plan=JSON.parse(file(input,p.plan.path,p.plan.digest));
  need(typeof plan.command==='string'&&Array.isArray(plan.args)&&Number.isSafeInteger(plan.expectedTestPassCount)&&
    plan.expectedTestPassCount>=2&&typeof plan.expectedStdoutMatch==='string'&&plan.expectedStdoutMatch.length>0,'selected plan contract required');
  const rows=e.commandResults.filter(r=>r.commandId===p.plannedCommandId);need(rows.length===1,'one planned command observation required');
  const run=rows[0],stdout=text(run.stdout);text(run.stderr);
  const pass=count(stdout,'pass'),fail=count(stdout,'fail'),cancelled=count(stdout,'cancelled');
  const commandAgreement=plan.command===p.commandResolution.planCommand&&run.executable===p.commandResolution.executable;
  const argumentAgreement=same(run.args,plan.args),cwdAgreement=run.relativeCwd===p.relativeCwd;
  const stdoutMatch=stdout.includes(plan.expectedStdoutMatch),passFloor=pass>=plan.expectedTestPassCount;
  const perSuite=p.suites.map(s=>{
    const body=file(input,s.path,s.digest);need(body.includes(s.title),'reviewed test-role title must occur in the exact verifier body');
    const witnesses=stdout.split(/\r?\n/u).filter(line=>{
      const result=/^(?:[✔✓✖✗] |(?:not )?ok [0-9]+ - )(.+)$/u.exec(line);
      return result!==null&&(result[1]===s.title||result[1].replace(/ \([0-9]+(?:\.[0-9]+)?ms\)$/u,'')===s.title);
    });
    const passed=witnesses.length===1&&(/^[✔✓] /u.test(witnesses[0])||/^ok [0-9]+ - /u.test(witnesses[0]))&&
      !/^not ok\b/u.test(witnesses[0])&&success(run)&&fail===0&&cancelled===0&&passFloor;
    return {role:s.role,path:s.path,digest:s.digest,title:s.title,passed,commandObservationRef:run.observationRef,
      stdoutDigest:run.stdout.digest,witnesses};
  });
  need(perSuite.length===2&&new Set(perSuite.map(s=>s.role)).size===2&&
    perSuite.some(s=>s.role==='component')&&perSuite.some(s=>s.role==='uat'),'two reviewed distinct test roles required');
  const planSatisfied=commandAgreement&&argumentAgreement&&cwdAgreement&&success(run)&&stdoutMatch&&passFloor&&fail===0&&cancelled===0;
  return {kind:'lifecycle_computed_records',schemaVersion:'5.0.0',taskRef:input.taskRef,sourceResult:input.sourceResult,
    execution:input.execution,construction:input.construction,sourceRefs:input.sourceRefs,interpretation:input.interpretation,
    evaluator:input.evaluator.graphFunction,selectedDutyRefs:input.selectedDutyRefs,selectedObligationRefs:input.selectedObligationRefs,
    carriedDutyRefs:input.carriedDutyRefs,carriedBindingRefs:input.carriedBindingRefs,evidenceRole:'computed_derivation',originalTaskCompletion:'not_claimed',
    records:{executionStatus:{exitStatus:run.exitStatus,timedOut:run.timedOut,processSignal:run.processSignal},
      commandAgreement,argumentAgreement,cwdAgreement,expectedStdoutMatch:plan.expectedStdoutMatch,stdoutMatch,
      observedTestPassCount:pass,expectedTestPassCount:plan.expectedTestPassCount,observedFailureCount:fail,
      observedCancelledCount:cancelled,stdoutDigest:run.stdout.digest,perSuite,planSatisfied,
      conditions:{componentPassed:perSuite.find(s=>s.role==='component').passed,uatPassed:perSuite.find(s=>s.role==='uat').passed,planSatisfied,passFloor},
      derivationBasis:{plan:p.plan,commandObservation:{ref:run.observationRef,digest:run.observationDigest},
        executionObservation:e.observation,
        interpretation:input.interpretation,acquisition:input.acquisition},
      absentHistoricalFields:['computed records were not fields of the original command observation'],
      residuals:['historical construction-input relations','binding14 comparison unless separately selected','required semantic assessment','original task and owner acceptance']}};
}
const verdict=(value,reason)=>({value:value===null?'unknown':value?'true':'false',reason});
const conjunction=conditions=>Object.values(conditions).some(c=>c.value==='false')?'false':Object.values(conditions).some(c=>c.value==='unknown')?'unknown':'true';
const one=rows=>rows.length===1?rows[0]:null;
const observedFile=(context,path)=>one(context.entries.filter(e=>e.relativePath===path&&e.state==='file'));
const coordinate=o=>({ref:o.observationRef,digest:o.observationDigest});
function constructionEdges(input) {
  return input.constructionEdges.flatMap(edge=>edge.dependentPaths.flatMap(path=>edge.dependencies.map(dependency=>{
    const producers=input.constructionObservations.filter(row=>row.dutyRefs.includes(edge.dutyRef)),row=one(producers),observation=row?.observation;
    const resolved=one(row?.resolvedDependencies.filter(d=>d.dutyRef===edge.dutyRef&&d.path===dependency.path)??[]);
    const before=observation&&observedFile(observation.before,dependency.path),after=observation&&observedFile(observation.after,path);
    const current=observedFile(input.currentContext,dependency.path),dependentCurrent=observedFile(input.currentContext,path);
    const predecessorRows=dependency.producerDutyRef?input.constructionObservations.filter(r=>r.dutyRefs.includes(dependency.producerDutyRef)):[];
    const predecessor=one(predecessorRows),predecessorFile=predecessor&&observedFile(predecessor.observation.after,dependency.path);
    const expected=dependency.digest??predecessorFile?.digest;
    let declares=null;
    if(after) {
      const body=text({payload:after.bytes,byteLength:after.byteLength,digest:after.digest});
      try {declares=path.endsWith('.json')?JSON.parse(body).derivedFrom?.includes(dependency.path)===true:body.includes(dependency.path);}catch{declares=false;}
    }
    const conditions={uniqueProducer:verdict(producers.length===1,'exact selected duty producer'),
      predecessorBinding:verdict(!resolved||!before||!expected?null:resolved.digest===expected&&before.digest===expected&&
        (!dependency.producerDutyRef||same(resolved.observation,coordinate(predecessor.observation))),'declared or actual earlier child predecessor digest'),
      predecessorCurrent:verdict(!before||!current?null:before.digest===current.digest&&before.byteLength===current.byteLength,'consumed predecessor remains current'),
      dependentCurrent:verdict(!after||!dependentCurrent?null:after.digest===dependentCurrent.digest&&after.byteLength===dependentCurrent.byteLength,'actual dependent output remains current'),
      declaredRead:verdict(observation?observation.task.readFirst.includes(dependency.path):null,'actual native task declares predecessor readFirst'),
      declaresPredecessor:verdict(declares,'fixture derivedFrom or textual predecessor reference; faithful derivation requires assessment'),
      completeReport:verdict(observation?observation.report.gaps.length===0:null,'native author reports no remaining gaps')};
    return {recordKind:'construction_record',dutyRef:edge.dutyRef,obligationRef:edge.obligationRef,bindingRef:edge.bindingRef,dependent:{path,afterDigest:after?.digest??null},
      predecessor:{path:dependency.path,declaredDigest:dependency.digest??null,producerDutyRef:dependency.producerDutyRef??null,
        beforeDigest:before?.digest??null,currentDigest:current?.digest??null,producerObservation:predecessor?coordinate(predecessor.observation):null},
      declaredReadPath:dependency.path,observation:observation?coordinate(observation):null,producer:observation?.provenance??null,
      cardinality:{producers:producers.length,predecessorProducers:predecessorRows.length},conditions,verdict:conjunction(conditions)};
  })));
}
function comparison(input) {
  const selected=input.evaluator.parameters.comparison,e=input.executionRecord,p=input.evaluator.parameters;
  if(!selected)return null;
  const matches=row=>['predicateId','predicateKind','ordinal'].every(k=>row[k]===selected[k]);
  const declarations=e.outcomePredicates.filter(matches),observations=e.predicateObservations.filter(matches),declaration=one(declarations),observation=one(observations);
  const d=declaration?.declaration,path=d?.path,evidence=observation?.evidence??[];
  const protectedRows=e.protectedObservations.filter(r=>r.subject.relativePath===path&&evidence.some(c=>
    c.kind==='worksite_observation_coordinate'&&c.ref===r.observation.observationRef&&c.digest===r.observation.observationDigest));
  const protectedRow=one(protectedRows),snapshot=one(e.snapshotMembers.filter(m=>m.relativePath===path));
  const current=path?observedFile(input.currentContext,path):null,planFile=observedFile(input.currentContext,p.plan.path);
  const planSnapshot=one(e.snapshotMembers.filter(m=>m.relativePath===p.plan.path));
  let plan=null,callable=null;
  try {if(planFile)plan=JSON.parse(text({payload:planFile.bytes,byteLength:planFile.byteLength,digest:planFile.digest}));}catch{}
  if(current&&d?.export==='helloWorld') {
    const body=text({payload:current.bytes,byteLength:current.byteLength,digest:current.digest});
    // Narrow reviewed fixture grammar: an exported zero-parameter function.
    // Do not execute the module or infer callability from the return observation.
    callable=/^\s*(?:\/\/[^\n]*\n\s*)*export function helloWorld\(\)\s*\{\s*return ["']Hello, world!["'];\s*\}\s*$/u.test(body)?true:null;
  }
  const hasValue=observation&&Object.hasOwn(observation,'observedValue'),hasExpected=d&&Object.hasOwn(d,'equals');
  const derivedType=hasValue?(observation.observedValue===null?'null':Array.isArray(observation.observedValue)?'array':typeof observation.observedValue):null;
  const conditions={selectedDuty:verdict(input.dutyPopulation.some(d=>input.selectedDutyRefs.includes(d.ref)&&d.role==='evaluate'&&
      d.bindingRef===selected.bindingRef&&d.obligationRef===selected.obligationRef),'comparison belongs to an explicitly selected evaluation duty'),
    uniquePredicate:verdict(declarations.length===1&&observations.length===1,'unique predicateId, predicateKind and ordinal join'),
    predicateMeaning:verdict(declaration?declaration.predicateKind==='module_export_return_exact'&&d.export==='helloWorld'&&path==='src/hello.mjs':null,'selected fixture callable-export predicate'),
    protectedEvidence:verdict(!observation?null:protectedRows.length===1&&evidence.length===1&&same(observation.evidenceRefs,evidence.map(c=>c.ref)), 'predicate evidence resolves to exactly one protected module observation'),
    moduleCurrent:verdict(!protectedRow||!snapshot||!current?null:protectedRow.observation.fileDigest===snapshot.digest&&snapshot.digest===current.digest&&
      protectedRow.observation.byteLength===snapshot.byteLength&&snapshot.byteLength===current.byteLength,'protected module, retained snapshot and current bytes agree'),
    planCurrent:verdict(!planFile||!planSnapshot?null:planFile.digest===p.plan.digest&&planSnapshot.digest===planFile.digest&&planSnapshot.byteLength===planFile.byteLength,'asserted value comes from current retained plan bytes'),
    observedEqualsDeclared:verdict(!hasValue||!hasExpected?null:same(observation.observedValue,d.equals),'actual observedValue equals predicate declaration'),
    observedEqualsPlan:verdict(!hasValue||!plan||!Object.hasOwn(plan,'assertedReturnValue')?null:same(observation.observedValue,plan.assertedReturnValue),'actual observedValue equals observed plan assertedReturnValue'),
    observedType:verdict(derivedType===null?null:derivedType==='string','type derived from actual observedValue'),
    noArguments:verdict(callable,'source-backed callable export plus owning module_export_return_exact exported() rule')};
  return {recordKind:'comparison_record',obligationRef:selected.obligationRef,bindingRef:selected.bindingRef,selection:{predicateId:selected.predicateId,predicateKind:selected.predicateKind,ordinal:selected.ordinal},
    execution:input.execution,executionObservation:e.observation,provenance:e.provenance,
    predicateDeclaration:declaration??null,predicateObservation:observation??null,evidence,protectedObservation:protectedRow??null,
    cardinality:{declarations:declarations.length,observations:observations.length,protectedObservations:protectedRows.length},
    module:{path:path??null,snapshotDigest:snapshot?.digest??null,currentDigest:current?.digest??null},
    plan:{path:p.plan.path,declaredDigest:p.plan.digest,currentDigest:planFile?.digest??null,assertedValue:plan?.assertedReturnValue??null},
    observedValue:hasValue?observation.observedValue:null,declaredExpected:hasExpected?d.equals:null,
    derived:{type:{value:derivedType,basis:'typeof actual observedValue (null and array distinguished); not a raw observation field'},
      noArguments:{value:callable===true?'true':'unknown',basis:'reviewed module source and implementation/worksite_command_helper.ts module_export_return_exact: callable exported() without arguments; non-callable exports also permitted'}},
    conditions,verdict:conjunction(conditions),residuals:['raw argument-list and raw type fields are absent from the original predicate observation; strict raw-field compliance needs owner disposition']};
}
function deriveConstructionRecords(input) {
  const edges=constructionEdges(input),compared=comparison(input),conditions={constructionEdges:verdict(edges.length?edges.every(r=>r.verdict==='true')?true:edges.some(r=>r.verdict==='false')?false:null:null,'all selected construction edge conditions'),
    ...(compared?{comparison:verdict(compared.verdict==='unknown'?null:compared.verdict==='true','selected retained predicate comparison')}: {})};
  return {kind:'lifecycle_computed_records',schemaVersion:'5.0.0',taskRef:input.taskRef,sourceResult:input.sourceResult,
    execution:input.execution,construction:input.construction,sourceRefs:input.sourceRefs,interpretation:input.interpretation,
    evaluator:input.evaluator.graphFunction,selectedDutyRefs:input.selectedDutyRefs,selectedObligationRefs:input.selectedObligationRefs,
    carriedDutyRefs:input.carriedDutyRefs,carriedBindingRefs:input.carriedBindingRefs,evidenceRole:'computed_derivation',originalTaskCompletion:'not_claimed',
    records:{constructionEdges:edges,comparison:compared,conditions,verdict:conjunction(conditions),
      acceptedResultsDisposition:'requires_separate_owner_conjunction',semanticClosure:'not_claimed',
      residuals:[...(compared?.residuals??['binding14 comparison not selected']),'faithful derivation requires independent semantic assessment',
        'accepted bindings10/11 require separate owner conjunction','carried duties and original task acceptance remain open']}};
}
const binding={kind:'implementation_binding',bindingRef:fixtureIds.bindingRef,implementationRef:fixtureIds.implementationRef,
  packageName:fixtureIds.packageName,packageVersion:fixtureIds.packageVersion,modulePath:'build/native-records-evaluator.mjs',
  namedSymbol:'evaluateNativeRecords',computeRegime:'F_D',inputContractRef:fixtureIds.inputContractRef,outputContractRef:fixtureIds.outputContractRef,
  failureContractRef:'contract://odd-glc/qualification/native-records-failure@5',refusalContractRef:'contract://odd-glc/qualification/native-records-refusal@5'};
const {kind,bindingRef,...body}=binding;
export const EVALUATOR_DESCRIPTOR=Object.freeze({kind:'packaged_leaf_implementation_descriptor',schemaVersion:'5.0.0',...body,descriptorDigest:product.sha256Canonical(body)});
export function evaluateNativeRecords(input){const resultCandidate=deriveNativeRecords(input);return {kind:'leaf_realization_candidate',schemaVersion:'5.0.0',disposition:'success',resultCandidate,
  evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:'5.0.0',implementationRef:fixtureIds.implementationRef,
    inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]};}
export const EVALUATOR_SEMANTICS=Object.freeze({kind:'product_semantics_provider',schemaVersion:'5.0.0',bindingRef:fixtureIds.semanticsRef,
  packageName:fixtureIds.packageName,packageVersion:fixtureIds.packageVersion,
  admitInput(ref,value){return ref===fixtureIds.inputContractRef&&isEvaluatorInput(value)?value:null;},evaluateInteractionResponse(){return null;},
  validateContractValue(kind,value){return kind==='lifecycle_evaluation_input'?isEvaluatorInput(value):kind==='lifecycle_computed_records'&&value?.kind===kind&&value.originalTaskCompletion==='not_claimed';},
  resolveJudgmentRelation(ref){return ref!==fixtureIds.predicateRef?null:{predicateRef:ref,advanceReasonRef:ref+'/computed',rejectionReasonRef:ref+'/refused',
    evaluate(input,output){try{return same(output,deriveNativeRecords(input));}catch{return false;}}};},
});
export function evaluatorPublication({gtl,artifact}) {
  const c=(contractRef,contractKind,valueKind)=>({contractRef,contractVersion:'5.0.0',contractKind,valueKind});
  const evidence='contract://odd-glc/qualification/native-records-evidence@5',judgment='contract://odd-glc/qualification/native-records-judgment@5',transition='contract://odd-glc/qualification/native-records-transition@5';
  const closure={kind:'closure_contract',closureContractRef:fixtureIds.closureRef,predicateRef:fixtureIds.predicateRef,evidenceContractRef:evidence,
    resultContractRef:fixtureIds.outputContractRef,refusalContractRef:binding.refusalContractRef,refusalValueKind:'native_records_refusal',judgmentContractRef:judgment,
    rejectionContractRef:binding.failureContractRef,transitionContractRef:transition,replayProjectionRef:'projection://odd-glc/qualification/native-records@5',
    terminalKind:'completed',closureScope:'graph_call',eventKindRefs:['terminal_reached','frame_closed','graph_call_closed']};
  const graph={kind:'graph_function',name:fixtureIds.graphFunctionRef,version:'5.0.0',inputs:[fixtureIds.inputContractRef],outputs:[fixtureIds.outputContractRef],
    environment:{requires:[fixtureIds.inputContractRef],provides:[fixtureIds.outputContractRef],carries:[]},effects:[],tags:['qualification-fixture','deterministic-derivation'],
    declarations:{'abg.compute_regime':'F_D','abg.closure_contract':fixtureIds.closureRef,'abg.child_closure_contract':fixtureIds.closureRef,
      'abg.evidence_contract':evidence,'abg.judgment_contract':judgment,'abg.judgment_predicate':fixtureIds.predicateRef,'abg.transition_contract':transition},
    template:{kind:'inline_graph',graphRef:'graph://odd-glc/qualification/native-records@5',startNodeRef:fixtureIds.nodeRef,terminalNodeRefs:[fixtureIds.nodeRef],edges:[],applications:[],
      nodes:[{nodeRef:fixtureIds.nodeRef,nodeKind:'c_locus',term:gtl.C.of({input:gtl.cCarrier(fixtureIds.inputContractRef),output:gtl.cCarrier(fixtureIds.outputContractRef),programLocusRef:fixtureIds.nodeRef,
        stageRole:'compute-records',fibre:'F_D',armId:fixtureIds.nodeRef+'/arm',compositionRef:null,vectorIndex:0,judgmentPredicateRef:fixtureIds.predicateRef,resultBearing:true,
        requirement:{kind:'executable_leaf_requirement',implementationBindingRef:fixtureIds.bindingRef,inputContractRef:fixtureIds.inputContractRef,outputContractRef:fixtureIds.outputContractRef,
          evidenceContractRef:evidence,failureContractRef:binding.failureContractRef,refusalContractRef:binding.refusalContractRef,judgmentContractRef:judgment}})}]}};
  return gtl.modulePublication({kind:'module_publication',moduleRef:fixtureIds.moduleRef,moduleVersion:'5.0.0',owningProductId:fixtureIds.productId,
    artifactDigest:artifact.artifactDigest,productContentDigest:artifact.productContentDigest,productManifestDigest:artifact.manifestDigest,
    descriptorRef:`descriptor://odd-glc/program-construction-fixture@${fixtureIds.packageVersion}`,contributionManifestRef:`contribution-manifest://odd-glc/program-construction-fixture@${fixtureIds.packageVersion}`,
    productSemanticsBinding:{kind:'product_semantics_binding',bindingRef:fixtureIds.semanticsRef,packageName:fixtureIds.packageName,packageVersion:fixtureIds.packageVersion,
      modulePath:'build/native-records-evaluator.mjs',namedSymbol:'EVALUATOR_SEMANTICS'},
    contracts:[c(fixtureIds.outputContractRef,'output','lifecycle_computed_records'),c(evidence,'evidence','deterministic_evidence_candidate'),
      c(binding.failureContractRef,'failure','native_records_failure'),c(binding.refusalContractRef,'refusal','native_records_refusal'),
      c(judgment,'judgment','native_records_judgment'),c(transition,'transition','native_records_transition'),c(fixtureIds.closureRef,'closure','native_records_closure')],
    implementationBindings:[binding],closureContracts:[closure,{...closure,closureContractRef:fixtureIds.closureRef+'/run',closureScope:'run',
      eventKindRefs:[...closure.eventKindRefs,'run_closed']}],graphFunctions:[graph],
    programs:[{kind:'gtl_program',programRef:fixtureIds.programRef,version:'5.0.0',moduleRef:fixtureIds.moduleRef,
      starts:[{startRef:fixtureIds.programRef+'/start',graphFunctionRef:graph.name}],callableMembership:[graph.name],closureContractRef:fixtureIds.closureRef+'/run',
      policies:{'abg.root_mode':'direct','abg.compute_regime':'F_D','abg.default_start_ref':fixtureIds.programRef+'/start'}}],rules:[],evaluators:[],
    contributions:[{handle:graph.name,kind:'graph_function',declarationOrContractRef:graph.name,owningProductId:fixtureIds.productId,
      programMembershipRefs:[fixtureIds.programRef],readinessPrerequisiteRefs:[fixtureIds.programRef],
      compatibilityRefs:['compatibility://abiogenesis/major/5'],provenanceRefs:[`provenance://odd-glc/program-construction-fixture@${fixtureIds.packageVersion}`]}]});
}
const placeholder='sha256:'+'0'.repeat(64);
const graphDigest=product.sha256Canonical(evaluatorPublication({gtl,artifact:{artifactDigest:placeholder,
  productContentDigest:placeholder,manifestDigest:placeholder}}).graphFunctions[0]);
