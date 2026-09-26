import * as product from '@abiogenesis/typescript-tenant/product';
import {isDeepStrictEqual as same} from 'node:util';
import {ids,stages,bindingFor,inputContract,evaluatorInputContract,VERSION,PACKAGE_NAME,PACKAGE_VERSION} from './program-construction-contracts.mjs';
import {checkModel,coordinate,need,freeze,projectNativeSource,selectLifecycleWork} from './program-construction.mjs';
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const only=(x,keys)=>record(x)&&same(Object.keys(x).sort(),[...keys].sort());
const selectedDuties=input=>input.model.duties.filter(d=>input.selectedDutyRefs.includes(d.ref));

export function isConstructionInput(input) {try {
  if(!only(input,['kind','schemaVersion','model','origin','historicalSelection','sourceSelection','authority','currentContext','selectedDutyRefs','evaluator'])||
    input.kind!==inputContract.valueKind||input.schemaVersion!==VERSION)return false;
  checkModel(input.model);
  const o=input.origin;
  if(!record(o)||!coordinate(o.construction)||!coordinate(o.execution)||!product.isNativeWorksiteCommandExecutionObservation(o.observation)||
    !product.isWorksiteContextObservation(input.currentContext)||input.model.taskRef!==o.taskRef||
    !same(input.model.sourceRefs,o.sourceRefs)||!same(input.model.bindingRefs,o.bindingRefs)||
    !input.model.duties.every(d=>o.obligationBindings.some(b=>b.bindingRef===d.bindingRef&&b.obligationRef===d.obligationRef))||
    !coordinate(input.evaluator?.fitJudgment)||!coordinate(input.evaluator?.graphFunction)||
    typeof input.evaluator.resultContractRef!=='string'||!record(input.evaluator.parameters)||
    !coordinate(input.historicalSelection?.result)||typeof input.historicalSelection?.valueDigest!=='string')return false;
  const selection=selectionFor(input);
  // This increment's executable adapters support retained computation only.
  // Other compositions can be authored with independently published adapters.
  return selection.disposition==='candidate'&&selection.gaps.length===0&&selection.work.length>0&&
    selection.work.every(w=>w.role==='evaluate')&&selectedDuties(input).every(d=>d.role==='evaluate');
}catch{return false;}}
export function selectionFor(input) {
  return selectLifecycleWork({product,model:input.model,selectedDutyRefs:input.selectedDutyRefs,basis:{
    executionObservation:input.origin.observation,construction:input.origin.construction,execution:input.origin.execution,
    sourceRefs:input.origin.sourceRefs,currentContext:input.currentContext,evaluations:[]}});
}
export function constructConstructionInput(value) {
  const input={kind:inputContract.valueKind,schemaVersion:VERSION,...value};
  need(isConstructionInput(input),'exact retained native source and selected computation duties required');return freeze(input);
}
export function reacquisitionRequest(input) {
  need(isConstructionInput(input),'supported construction input required');
  const old=input.origin.observation.task;
  return product.constructNativeWorksiteCommandReacquisitionRequest({...input.authority,
    sourceNativeWork:old.sourceNativeWork,source:input.sourceSelection,currentContext:input.currentContext,
    selectedSources:old.protectedObservations.map(r=>({subjectUri:r.subject.subjectUri,relativePath:r.subject.relativePath})),
    commands:old.commands,outcomePredicates:old.outcomePredicates,allowedWriteTerritories:old.allowedWriteTerritories});
}
/** This call is made by the installed Product judgment, never by a local reader. */
export function authenticSource(input,currentOwnerPrefix,nativeProof) {try {
  if(!isConstructionInput(input)||!currentOwnerPrefix)return false;
  const owner=nativeProof?.historicalGraphCallSource?.();if(!owner)return false;
  const {value,projectionBasis,...selection}=owner.terminalResult;
  if(!same(selection,input.historicalSelection))return false;
  return same(projectNativeSource(product,value),input.origin);
}catch{return false;}}
export function evaluationInput(bound) {
  need(product.isRetainedGraphInput(bound)&&isConstructionInput(bound.entry)&&
    product.isNativeWorksiteCommandExecutionTask(bound.source), 'actual retained entry and native acquisition output required');
  const entry=bound.entry,acquired=bound.source,request=acquired.sourceReacquisition?.request;
  need(request&&same(request,reacquisitionRequest(entry)), 'acquisition must bind the exact original entry');
  const context=request.currentContext,execution=entry.origin.observation;
  need(execution.snapshotMembers.every(member=>context.entries.some(e=>e.state==='file'&&e.relativePath===member.relativePath&&
    e.digest===member.digest&&e.byteLength===member.byteLength)), 'retained execution has stale or unavailable consumed bytes');
  const selection=selectionFor(entry);
  return freeze({kind:evaluatorInputContract.valueKind,schemaVersion:VERSION,taskRef:entry.model.taskRef,
    sourceRefs:entry.model.sourceRefs,interpretation:entry.model.interpretation,
    selectedDutyRefs:entry.selectedDutyRefs,selectedObligationRefs:selectedDuties(entry).map(d=>d.obligationRef),
    carriedDutyRefs:selection.carriedDutyRefs,carriedBindingRefs:selection.carriedBindingRefs,
    sourceResult:entry.historicalSelection.result,construction:entry.origin.construction,execution:entry.origin.execution,
    executionRecord:{observation:{ref:execution.observationRef,digest:execution.observationDigest},
      commandResults:execution.commandResults,snapshotMembers:execution.snapshotMembers},
    currentContext:context,evaluator:entry.evaluator,
    acquisition:{requestRef:request.requestRef,requestDigest:request.requestDigest,nativeBasis:acquired.sourceReacquisition.nativeBasis},
    originalTaskCompletion:'not_claimed'});
}
export function isEvaluationInput(x) {try {
  return x?.kind===evaluatorInputContract.valueKind&&x.schemaVersion===VERSION&&coordinate(x.execution)&&coordinate(x.construction)&&
    coordinate(x.sourceResult)&&coordinate(x.interpretation)&&coordinate(x.executionRecord?.observation)&&
    Array.isArray(x.executionRecord.commandResults)&&x.executionRecord.commandResults.length>0&&Array.isArray(x.executionRecord.snapshotMembers)&&
    product.isWorksiteContextObservation(x.currentContext)&&Array.isArray(x.selectedDutyRefs)&&x.selectedDutyRefs.length>0&&
    Array.isArray(x.carriedBindingRefs)&&record(x.evaluator)&&coordinate(x.evaluator.graphFunction)&&
    record(x.acquisition)&&x.originalTaskCompletion==='not_claimed';
}catch{return false;}}
// The evaluator owns record meaning. This checks conservation only, never truth of its records.
export function computedResultConserves(input,output) {
  const entry=isConstructionInput(input)?{taskRef:input.model.taskRef,sourceResult:input.historicalSelection.result,
    execution:input.origin.execution,construction:input.origin.construction,sourceRefs:input.model.sourceRefs,
    interpretation:input.model.interpretation,selectedObligationRefs:selectedDuties(input).map(d=>d.obligationRef),
    selectedDutyRefs:input.selectedDutyRefs,carriedDutyRefs:selectionFor(input).carriedDutyRefs,carriedBindingRefs:selectionFor(input).carriedBindingRefs,
    evaluator:input.evaluator}:input;
  return record(output)&&output.kind==='lifecycle_computed_records'&&output.schemaVersion===VERSION&&
    ['taskRef','sourceResult','execution','construction','sourceRefs','interpretation','selectedObligationRefs',
      'selectedDutyRefs','carriedDutyRefs','carriedBindingRefs'].every(k=>same(entry[k],output[k]))&&
    same(entry.evaluator.graphFunction,output.evaluator)&&record(output.records)&&
    output.originalTaskCompletion==='not_claimed'&&output.evidenceRole==='computed_derivation';
}
const transforms=[reacquisitionRequest,evaluationInput];
const realize=(index,input)=>{const resultCandidate=transforms[index](input);return freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,
  disposition:'success',resultCandidate,evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,
    implementationRef:stages[index].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const prepareReacquisition=input=>realize(0,input);
export const prepareEvaluation=input=>realize(1,input);
const descriptor=s=>{const {kind,bindingRef,...body}=bindingFor(s);return freeze({kind:'packaged_leaf_implementation_descriptor',schemaVersion:VERSION,...body,descriptorDigest:product.sha256Canonical(body)});};
export const AUTHENTICATE_DESCRIPTOR=descriptor(stages[0]),PREPARE_EVALUATION_DESCRIPTOR=descriptor(stages[1]);
const relation=(predicateRef,evaluate)=>({predicateRef,advanceReasonRef:predicateRef+'/satisfied',rejectionReasonRef:predicateRef+'/refused',
  evaluate(...args){try{return evaluate(...args);}catch{return false;}}});
export const PROGRAM_CONSTRUCTION_SEMANTICS=Object.freeze({kind:'product_semantics_provider',schemaVersion:VERSION,bindingRef:ids.semanticsBindingRef,
  packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,
  admitInput(ref,value){return ref===ids.inputContractRef&&isConstructionInput(value)?freeze(value):null;},
  evaluateInteractionResponse(){return null;},
  validateContractValue(kind,value){return ({lifecycle_construction_input:isConstructionInput,lifecycle_evaluation_input:isEvaluationInput,
    lifecycle_computed_records:v=>v?.kind==='lifecycle_computed_records'&&v.schemaVersion===VERSION&&coordinate(v.evaluator)&&
      coordinate(v.sourceResult)&&coordinate(v.execution)&&record(v.records)&&v.evidenceRole==='computed_derivation'&&v.originalTaskCompletion==='not_claimed',
    retained_graph_input:product.isRetainedGraphInput,native_worksite_command_reacquisition_request:product.isNativeWorksiteCommandReacquisitionRequest,
    worksite_command_execution_task:product.isNativeWorksiteCommandExecutionTask})[kind]?.(value)??false;},
  resolveJudgmentRelation(ref){
    if(ref===stages[0].predicateRef)return relation(ref,(input,output,prefix,proof)=>same(output,reacquisitionRequest(input))&&authenticSource(input,prefix,proof));
    if(ref===stages[1].predicateRef)return relation(ref,(input,output)=>same(output,evaluationInput(input)));
    if(ref===ids.completionPredicateRef)return relation(ref,(input,output)=>isConstructionInput(input)&&computedResultConserves(input,output));
    if(ref===ids.stepPredicateRef)return relation(ref,(input,output)=>
      isConstructionInput(input)&&same(output,reacquisitionRequest(input))||
      product.isNativeWorksiteCommandReacquisitionRequest(input)&&product.isNativeWorksiteCommandExecutionTask(output)&&same(output.sourceReacquisition?.request,input)||
      product.isRetainedGraphInput(input)&&same(output,evaluationInput(input))||
      isEvaluationInput(input)&&computedResultConserves(input,output));
    return null;
  },
});
