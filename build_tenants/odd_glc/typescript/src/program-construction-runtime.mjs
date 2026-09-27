import * as product from '@abiogenesis/typescript-tenant/product';
import {isDeepStrictEqual as same} from 'node:util';
import {ids,stages,constructionStages,evaluationStages,bindingFor,inputContract,evaluatorInputContract,nativeConstructionInputContract,constructionStateContract,evaluationStateContract,dependencyKind,VERSION,PACKAGE_NAME,PACKAGE_VERSION} from './program-construction-contracts.mjs';
import {checkModel,checkConstructionGroups,coordinate,need,freeze,projectNativeSource,selectLifecycleWork} from './program-construction.mjs';
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const only=(x,keys)=>record(x)&&same(Object.keys(x).sort(),[...keys].sort());
const selectedDuties=input=>input.model.duties.filter(d=>input.selectedDutyRefs.includes(d.ref));
const sourceFields=['kind','schemaVersion','model','origin','historicalSelection','sourceSelection','authority','currentContext','selectedDutyRefs'];
function sourceInput(input) {
  checkModel(input.model);const o=input.origin;
  return input.schemaVersion===VERSION&&record(o)&&coordinate(o.construction)&&coordinate(o.execution)&&
    product.isNativeWorksiteCommandExecutionObservation(o.observation)&&product.isWorksiteContextObservation(input.currentContext)&&
    input.model.taskRef===o.taskRef&&same(input.model.sourceRefs,o.sourceRefs)&&same(input.model.bindingRefs,o.bindingRefs)&&
    input.model.duties.every(d=>o.obligationBindings.some(b=>b.bindingRef===d.bindingRef&&b.obligationRef===d.obligationRef))&&
    coordinate(input.historicalSelection?.result)&&typeof input.historicalSelection?.valueDigest==='string';
}

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
export function isNativeConstructionInput(input) {try {
  const combined=Object.hasOwn(input,'evaluator');
  if(!only(input,[...sourceFields,'constructionGroups',...(combined?['evaluator']:[])])||input.kind!==nativeConstructionInputContract.valueKind||!sourceInput(input))return false;
  const selection=selectionFor(input),prospective=[...selection.work,...selection.gaps];
  // Shape admission does not claim predecessor currentness. The acquired-context
  // preparation checks it before the first native constructor can be called.
  const construction=prospective.filter(d=>d.role==='provenance');
  return construction.length>0&&prospective.every(d=>d.applicability.value==='true'&&(d.role==='provenance'&&d.dependentPaths?.length>0||combined&&d.role==='evaluate'))&&
    selectedDuties(input).every(d=>d.role==='provenance'||combined&&d.role==='evaluate')&&
    (!combined||prospective.some(d=>d.role==='evaluate')&&coordinate(input.evaluator?.graphFunction)&&coordinate(input.evaluator?.fitJudgment)&&
      typeof input.evaluator.resultContractRef==='string'&&record(input.evaluator.parameters))&&
    !!checkConstructionGroups(input.model,{work:construction},input.constructionGroups);
}catch{return false;}}
export function constructNativeConstructionInput(value) {
  const input={kind:nativeConstructionInputContract.valueKind,schemaVersion:VERSION,...value};
  need(isNativeConstructionInput(input),'exact source and dependency-ready native construction groups required');return freeze(input);
}
const isConstructionEntry=input=>isConstructionInput(input)||isNativeConstructionInput(input);
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
  need(isConstructionEntry(input),'supported construction input required');
  const old=input.origin.observation.task;
  return product.constructNativeWorksiteCommandReacquisitionRequest({...input.authority,
    sourceNativeWork:old.sourceNativeWork,source:input.sourceSelection,currentContext:input.currentContext,
    selectedSources:old.protectedObservations.map(r=>({subjectUri:r.subject.subjectUri,relativePath:r.subject.relativePath})),
    commands:old.commands,outcomePredicates:old.outcomePredicates,allowedWriteTerritories:old.allowedWriteTerritories});
}
/** This call is made by the installed Product judgment, never by a local reader. */
export function authenticSource(input,currentOwnerPrefix,nativeProof) {try {
  if(!isConstructionEntry(input)||!currentOwnerPrefix)return false;
  const owner=nativeProof?.historicalGraphCallSource?.();if(!owner)return false;
  const {value,projectionBasis,...selection}=owner.terminalResult;
  if(!same(selection,input.historicalSelection))return false;
  return same(projectNativeSource(product,value),input.origin);
}catch{return false;}}
export function evaluationInput(bound) {
  if(bound?.entry?.kind===nativeConstructionInputContract.valueKind&&bound.entry.evaluator)return constructedEvaluationInput(bound);
  need(product.isRetainedGraphInput(bound)&&isConstructionInput(bound.entry)&&
    product.isNativeWorksiteCommandExecutionTask(bound.source), 'actual retained entry and native acquisition output required');
  const entry=bound.entry,acquired=bound.source,request=acquired.sourceReacquisition?.request;
  need(request&&same(request,reacquisitionRequest(entry)), 'acquisition must bind the exact original entry');
  const context=request.currentContext,execution=entry.origin.observation;
  need(execution.snapshotMembers.every(member=>context.entries.some(e=>e.state==='file'&&e.relativePath===member.relativePath&&
    e.digest===member.digest&&e.byteLength===member.byteLength)), 'retained execution has stale or unavailable consumed bytes');
  return evaluationView(entry,context,{requestRef:request.requestRef,requestDigest:request.requestDigest,nativeBasis:acquired.sourceReacquisition.nativeBasis});
}
function evaluationView(entry,context,acquisition) {
  const selection=selectionFor(entry),execution=entry.origin.observation;
  return freeze({kind:evaluatorInputContract.valueKind,schemaVersion:VERSION,taskRef:entry.model.taskRef,
    sourceRefs:entry.model.sourceRefs,interpretation:entry.model.interpretation,
    selectedDutyRefs:entry.selectedDutyRefs,selectedObligationRefs:selectedDuties(entry).map(d=>d.obligationRef),
    carriedDutyRefs:selection.carriedDutyRefs,carriedBindingRefs:selection.carriedBindingRefs,
    sourceResult:entry.historicalSelection.result,construction:entry.origin.construction,execution:entry.origin.execution,
    executionRecord:{observation:{ref:execution.observationRef,digest:execution.observationDigest},
      commandResults:execution.commandResults,snapshotMembers:execution.snapshotMembers},
    currentContext:context,evaluator:entry.evaluator,
    acquisition,
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

const currentFile=(context,path)=>{
  const matches=context.entries.filter(e=>e.relativePath===path&&e.state==='file');
  need(matches.length===1,'one actual predecessor/output file required: '+path);return matches[0];
};
function resolvedDependencies(entry,index,context,observations) {
  const group=entry.constructionGroups[index];
  need(group,'one remaining declared construction group required');
  return group.dutyRefs.flatMap(dutyRef=>entry.model.duties.find(d=>d.ref===dutyRef).dependencies.map(dependency=>{
    if(dependencyKind(dependency)==='observed') {
      need(currentFile(context,dependency.path).digest===dependency.digest,'declared predecessor does not match current context: '+dependency.path);
      return {dutyRef,...dependency};
    }
    const producerIndex=entry.constructionGroups.findIndex(g=>g.dutyRefs.includes(dependency.producerDutyRef));
    need(producerIndex>=0&&producerIndex<index,'producer output must cross its earlier declared child');
    const producers=observations.filter(row=>row.groupRef===entry.constructionGroups[producerIndex].ref&&row.dutyRefs.includes(dependency.producerDutyRef));
    need(producers.length===1,'exact actual producer observation required');
    const observation=producers[0].observation,file=currentFile(observation.after,dependency.path);
    need(currentFile(context,dependency.path).digest===file.digest,'producer output is stale in current context: '+dependency.path);
    return {dutyRef,...dependency,digest:file.digest,observation:{ref:observation.observationRef,digest:observation.observationDigest}};
  }));
}
function taskForGroup(entry,index,context,observations) {
  const group=entry.constructionGroups[index],dependencies=resolvedDependencies(entry,index,context,observations);
  need(dependencies.every(d=>group.readFirst.includes(d.path)),'actual predecessors must be included in readFirst');
  return product.constructNativeWorkspaceWorkTask({...entry.authority,context,outcome:group.outcome,
    instructions:[...group.instructions,
      'Perform only the selected legitimate dependent work. Preserve governing source and retained execution. Do not run application commands or checks, inspect evaluator-only oracle material, install dependencies or choose continuation. Preserve useful partial work and report remaining gaps.',
      `Selected group: ${group.ref}. Fit judgment: ${product.canonicalJson(group.fitJudgment)}. Selected duties: ${JSON.stringify(group.dutyRefs)}. Current predecessor bindings: ${product.canonicalJson(dependencies)}.`],
    readFirst:group.readFirst,writeRoots:group.writeRoots,checks:[]});
}
function observedGaps(entry,observations,context) {
  const gaps=observations.flatMap(row=>row.observation.report.gaps.map(reason=>({groupRef:row.groupRef,cause:'author_reported_gap',reason})));
  for(const row of observations)for(const dutyRef of row.dutyRefs) {
    const duty=entry.model.duties.find(d=>d.ref===dutyRef);
    for(const path of duty.dependentPaths)if(!row.observation.after.entries.some(e=>e.relativePath===path&&e.state==='file'))
      gaps.push({dutyRef,path,cause:'dependent_output_absent'});
    for(const dep of row.resolvedDependencies.filter(d=>d.dutyRef===dutyRef))
      if(!context.entries.some(e=>e.relativePath===dep.path&&e.state==='file'&&e.digest===dep.digest))
        gaps.push({dutyRef,path:dep.path,cause:'consumed_predecessor_stale'});
  }
  for(const member of entry.executionSnapshotMembers)
    if(!context.entries.some(e=>e.relativePath===member.relativePath&&e.state==='file'&&e.digest===member.digest&&e.byteLength===member.byteLength))
      gaps.push({path:member.relativePath,cause:'retained_execution_stale'});
  return gaps;
}
function constructionBasis(input) {
  const selection=selectionFor(input);
  // The authenticated source keeps the historical envelopes. Children carry
  // only the selected construction basis and the evidence coordinates they use.
  return {model:input.model,selectedDutyRefs:input.selectedDutyRefs,constructionGroups:input.constructionGroups,
    authority:input.authority,currentContext:input.currentContext,sourceResult:input.historicalSelection.result,
    origin:{construction:input.origin.construction,execution:input.origin.execution},
    executionSnapshotMembers:input.origin.observation.snapshotMembers,
    pendingDutyRefs:[...new Set([...selection.work,...selection.gaps].map(d=>d.dutyRef).concat(selection.carriedDutyRefs))],
    carriedBindingRefs:selection.carriedBindingRefs};
}
function isConstructionBasis(entry) {try {
  if(!only(entry,['model','selectedDutyRefs','constructionGroups','authority','currentContext','sourceResult','origin','executionSnapshotMembers','pendingDutyRefs','carriedBindingRefs'])||
    !coordinate(entry.sourceResult)||!only(entry.origin,['construction','execution'])||!coordinate(entry.origin.construction)||!coordinate(entry.origin.execution)||
    !product.isWorksiteContextObservation(entry.currentContext)||!Array.isArray(entry.executionSnapshotMembers)||
    !entry.executionSnapshotMembers.every(m=>typeof m.relativePath==='string'&&/^sha256:[a-f0-9]{64}$/.test(m.digest)&&Number.isSafeInteger(m.byteLength))||
    !Array.isArray(entry.selectedDutyRefs)||entry.selectedDutyRefs.length===0||!Array.isArray(entry.pendingDutyRefs)||!Array.isArray(entry.carriedBindingRefs))return false;
  checkModel(entry.model);
  const grouped=entry.constructionGroups.flatMap(g=>g.dutyRefs);
  return entry.selectedDutyRefs.every(ref=>entry.model.duties.some(d=>d.ref===ref&&(d.role==='evaluate'||grouped.includes(ref))))&&
    entry.pendingDutyRefs.every(ref=>entry.model.duties.some(d=>d.ref===ref))&&entry.carriedBindingRefs.every(ref=>entry.model.bindingRefs.includes(ref))&&
    !!checkConstructionGroups(entry.model,{work:grouped.map(dutyRef=>({dutyRef}))},entry.constructionGroups);
}catch{return false;}}
function stateValue(entry,acquisition,observations,context) {
  const gaps=observedGaps(entry,observations,context);
  return {kind:constructionStateContract.valueKind,schemaVersion:VERSION,entry,acquisition,constructionObservations:observations,currentContext:context,gaps,
    disposition:gaps.length?'partial':observations.length===entry.constructionGroups.length?'observed':'pending',
    pendingDutyRefs:entry.pendingDutyRefs,carriedBindingRefs:entry.carriedBindingRefs,
    evaluationDisposition:'not_performed',assessmentDisposition:'not_performed',originalTaskCompletion:'not_claimed'};
}
export function constructionState(bound) {
  need(product.isRetainedGraphInput(bound)&&isNativeConstructionInput(bound.entry)&&product.isNativeWorksiteCommandExecutionTask(bound.source),
    'actual construction entry and acquired native task required');
  const entry=bound.entry,request=reacquisitionRequest(entry),acquired=bound.source.sourceReacquisition;
  need(acquired&&same(acquired.request,request),'acquisition must bind the exact original construction entry');
  const context=acquired.request.currentContext,retained=entry.origin.observation.task.sourceNativeWork.after;
  need(['entries','readRoots','maxFiles','maxBytes'].every(k=>same(context[k],retained[k])),'complete retained native context must be reacquired');
  need(selectionFor(entry).gaps.length===0,'declared predecessor basis is stale or unavailable');
  const basis=constructionBasis(entry),state=stateValue(basis,{requestRef:request.requestRef,requestDigest:request.requestDigest,nativeBasis:acquired.nativeBasis},[],context);
  need(state.gaps.length===0,'retained execution has stale or unavailable consumed bytes');
  // Validate the first task against the actual acquisition before any native call.
  taskForGroup(basis,0,context,[]);return freeze(state);
}
function appendObservation(state,observation) {
  const entry=state.entry,index=state.constructionObservations.length,group=entry.constructionGroups[index];
  need(state.gaps.length===0,'partial construction cannot authorize dependent preparation');
  const task=taskForGroup(entry,index,state.currentContext,state.constructionObservations);
  need(product.isNativeWorkspaceWorkObservation(observation)&&same(observation.task,task),
    'actual native child observation must match its exact prepared task');
  need(!state.constructionObservations.some(row=>row.observation.provenance.cCallRef===observation.provenance.cCallRef||
    row.observation.provenance.actorInvocationRef===observation.provenance.actorInvocationRef),'each producer child requires a distinct actual occurrence');
  const row={groupRef:group.ref,dutyRefs:group.dutyRefs,
    resolvedDependencies:resolvedDependencies(entry,index,state.currentContext,state.constructionObservations),observation};
  return stateValue(entry,state.acquisition,[...state.constructionObservations,row],observation.after);
}
export function isConstructionState(value) {try {
  if(!only(value,['kind','schemaVersion','entry','acquisition','constructionObservations','currentContext','gaps','disposition','pendingDutyRefs',
    'carriedBindingRefs','evaluationDisposition','assessmentDisposition','originalTaskCompletion'])||value.kind!==constructionStateContract.valueKind||
    value.schemaVersion!==VERSION||!isConstructionBasis(value.entry)||!Array.isArray(value.constructionObservations)||
    !only(value.acquisition,['requestRef','requestDigest','nativeBasis'])||!record(value.acquisition.nativeBasis)||
    typeof value.acquisition.requestRef!=='string'||!/^sha256:[a-f0-9]{64}$/.test(value.acquisition.requestDigest))return false;
  let expected=stateValue(value.entry,value.acquisition,[],value.entry.currentContext);
  if(expected.gaps.length)return false;
  for(const row of value.constructionObservations)expected=appendObservation(expected,row.observation);
  return same(value,expected);
}catch{return false;}}
export function nativeConstructionTask(state) {
  need(isConstructionState(state)&&state.disposition==='pending','current acquired construction state required');
  return taskForGroup(state.entry,state.constructionObservations.length,state.currentContext,state.constructionObservations);
}
export function constructionOutput(bound) {
  need(product.isRetainedGraphInput(bound)&&isConstructionState(bound.entry),'actual construction child input/output join required');
  return freeze(appendObservation(bound.entry,bound.source));
}
function constructionChildConserves(input,output) {try {
  return isConstructionState(input)&&isConstructionState(output)&&output.constructionObservations.length===input.constructionObservations.length+1&&
    same(output,constructionOutput(product.constructRetainedGraphInput(input,output.constructionObservations.at(-1).observation)));
}catch{return false;}}
function constructionCompleted(input,output) {
  if(!isNativeConstructionInput(input)||!isConstructionState(output)||!same(constructionBasis(input),output.entry)||
    output.constructionObservations.length!==input.constructionGroups.length)return false;
  const request=reacquisitionRequest(input);
  return output.acquisition.requestRef===request.requestRef&&output.acquisition.requestDigest===request.requestDigest;
}
/** The retained root authenticates old records; actual child state supplies new observations. */
export function constructedEvaluationInput(bound) {
  need(product.isRetainedGraphInput(bound)&&bound.entry?.evaluator&&
    constructionCompleted(bound.entry,bound.source),'actual original entry and completed construction output required');
  const entry=bound.entry,state=bound.source,execution=entry.origin.observation,selection=selectionFor(entry);
  need(state.disposition==='observed'&&state.gaps.length===0,'partial or stale construction cannot authorize current evaluation');
  const context=state.currentContext;
  need(execution.snapshotMembers.every(m=>context.entries.some(e=>e.state==='file'&&e.relativePath===m.relativePath&&e.digest===m.digest&&e.byteLength===m.byteLength)),
    'every retained execution snapshot member must remain current');
  // Source/plan bytes are among protected execution sources. Check all of them,
  // plus observed dependencies of selected evaluation duties, without domain paths.
  need(execution.task.protectedObservations.every(p=>context.entries.some(e=>e.state==='file'&&e.relativePath===p.subject.relativePath&&
    e.digest===p.observation.fileDigest&&e.byteLength===p.observation.byteLength)), 'protected source basis is stale or unavailable');
  for(const duty of selection.work.filter(d=>d.role==='evaluate'))for(const dep of duty.dependencies) {
    let digest=dep.digest;
    if(dependencyKind(dep)==='producer_output') {
      const rows=state.constructionObservations.filter(r=>r.dutyRefs.includes(dep.producerDutyRef));
      need(rows.length===1,'exact selected evaluation predecessor required');digest=currentFile(rows[0].observation.after,dep.path).digest;
    }
    need(currentFile(context,dep.path).digest===digest,'selected evaluation dependency is stale');
  }
  const view=evaluationView(entry,context,state.acquisition);
  return freeze({...view,executionRecord:{...view.executionRecord,outcomePredicates:execution.task.outcomePredicates,
    predicateObservations:execution.predicateObservations,protectedObservations:execution.task.protectedObservations,provenance:execution.provenance},
    constructionObservations:state.constructionObservations,
    constructionEdges:selection.work.filter(d=>d.role==='provenance').map(d=>({dutyRef:d.dutyRef,obligationRef:d.obligationRef,
      bindingRef:d.bindingRef,dependencies:d.dependencies,dependentPaths:d.dependentPaths})),
    dutyPopulation:entry.model.duties,carriedDuties:selection.carriedDuties,pendingDutyRefs:state.pendingDutyRefs,
    acceptedResultsDisposition:'requires_separate_owner_conjunction',assessmentDisposition:'not_performed'});
}
export function evaluationOutput(bound) {
  need(product.isRetainedGraphInput(bound)&&isEvaluationInput(bound.entry)&&computedResultConserves(bound.entry,bound.source),
    'actual evaluation input and conserved computed child output required');
  return freeze({kind:evaluationStateContract.valueKind,schemaVersion:VERSION,evaluationInput:bound.entry,computedRecords:bound.source,
    assessmentDisposition:'not_performed',originalTaskCompletion:'not_claimed'});
}
export function isEvaluationState(value) {try {
  return only(value,['kind','schemaVersion','evaluationInput','computedRecords','assessmentDisposition','originalTaskCompletion'])&&
    same(value,evaluationOutput(product.constructRetainedGraphInput(value.evaluationInput,value.computedRecords)));
}catch{return false;}}
function evaluatedConstructionConserves(input,output) {
  if(!input.evaluator||!isEvaluationState(output))return false;
  const view=output.evaluationInput;
  const state=stateValue(constructionBasis(input),view.acquisition,view.constructionObservations,view.currentContext);
  return same(view,constructedEvaluationInput(product.constructRetainedGraphInput(input,state)));
}
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
const constructionTransforms=[reacquisitionRequest,constructionState,nativeConstructionTask,constructionOutput];
const realizeConstruction=(index,input)=>{const resultCandidate=constructionTransforms[index](input);return freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,
  disposition:'success',resultCandidate,evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,
    implementationRef:constructionStages[index].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const prepareNativeReacquisition=input=>realizeConstruction(0,input),prepareConstruction=input=>realizeConstruction(1,input),
  prepareNativeTask=input=>realizeConstruction(2,input),joinNativeOutput=input=>realizeConstruction(3,input);
export const NATIVE_AUTHENTICATE_DESCRIPTOR=descriptor(constructionStages[0]),PREPARE_CONSTRUCTION_DESCRIPTOR=descriptor(constructionStages[1]),
  PREPARE_NATIVE_TASK_DESCRIPTOR=descriptor(constructionStages[2]),JOIN_NATIVE_OUTPUT_DESCRIPTOR=descriptor(constructionStages[3]);
const evaluationTransforms=[constructedEvaluationInput,evaluationOutput];
const realizeEvaluation=(index,input)=>{const resultCandidate=evaluationTransforms[index](input);return freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,
  disposition:'success',resultCandidate,evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,
    implementationRef:evaluationStages[index].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const prepareConstructedEvaluation=input=>realizeEvaluation(0,input),joinEvaluation=input=>realizeEvaluation(1,input);
export const PREPARE_CONSTRUCTED_EVALUATION_DESCRIPTOR=descriptor(evaluationStages[0]),JOIN_EVALUATION_DESCRIPTOR=descriptor(evaluationStages[1]);
const relation=(predicateRef,evaluate)=>({predicateRef,advanceReasonRef:predicateRef+'/satisfied',rejectionReasonRef:predicateRef+'/refused',
  evaluate(...args){try{return evaluate(...args);}catch{return false;}}});
export const PROGRAM_CONSTRUCTION_SEMANTICS=Object.freeze({kind:'product_semantics_provider',schemaVersion:VERSION,bindingRef:ids.semanticsBindingRef,
  packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,
  admitInput(ref,value){return (ref===ids.inputContractRef&&isConstructionInput(value)||ref===ids.nativeInputContractRef&&isNativeConstructionInput(value))?freeze(value):null;},
  evaluateInteractionResponse(){return null;},
  validateContractValue(kind,value){return ({lifecycle_construction_input:isConstructionInput,lifecycle_evaluation_input:isEvaluationInput,
    lifecycle_native_construction_input:isNativeConstructionInput,lifecycle_construction_state:isConstructionState,lifecycle_evaluation_state:isEvaluationState,
    native_workspace_work_task:product.isNativeWorkspaceWorkTask,native_workspace_work_observation:product.isNativeWorkspaceWorkObservation,
    lifecycle_computed_records:v=>v?.kind==='lifecycle_computed_records'&&v.schemaVersion===VERSION&&coordinate(v.evaluator)&&
      coordinate(v.sourceResult)&&coordinate(v.execution)&&record(v.records)&&v.evidenceRole==='computed_derivation'&&v.originalTaskCompletion==='not_claimed',
    retained_graph_input:product.isRetainedGraphInput,native_worksite_command_reacquisition_request:product.isNativeWorksiteCommandReacquisitionRequest,
    worksite_command_execution_task:product.isNativeWorksiteCommandExecutionTask})[kind]?.(value)??false;},
  resolveJudgmentRelation(ref){
    const evaluationStage=evaluationStages.findIndex(s=>s.predicateRef===ref);
    if(evaluationStage>=0)return relation(ref,(input,output)=>same(output,evaluationTransforms[evaluationStage](input)));
    if(ref===ids.evaluationChildPredicateRef)return relation(ref,(input,output)=>isEvaluationState(output)&&same(input,output.evaluationInput));
    if(ref===ids.constructedEvaluationPredicateRef)return relation(ref,evaluatedConstructionConserves);
    const constructionStage=constructionStages.findIndex(s=>s.predicateRef===ref);
    if(constructionStage>=0)return relation(ref,(input,output,prefix,proof)=>same(output,constructionTransforms[constructionStage](input))&&
      (constructionStage!==0||authenticSource(input,prefix,proof)));
    if(ref===ids.constructionChildPredicateRef)return relation(ref,constructionChildConserves);
    if(ref===ids.nativeCompletionPredicateRef)return relation(ref,(input,output)=>!input.evaluator&&constructionCompleted(input,output));
    if(ref===ids.nativeStepPredicateRef)return relation(ref,(input,output)=>{
      if(isNativeConstructionInput(input))return same(output,reacquisitionRequest(input));
      if(product.isNativeWorksiteCommandReacquisitionRequest(input))return product.isNativeWorksiteCommandExecutionTask(output)&&same(output.sourceReacquisition?.request,input);
      if(product.isRetainedGraphInput(input))return same(output,isNativeConstructionInput(input.entry)?
        (input.source?.kind===constructionStateContract.valueKind?constructedEvaluationInput(input):constructionState(input)):
        isEvaluationInput(input.entry)?evaluationOutput(input):constructionOutput(input));
      if(isEvaluationInput(input))return isEvaluationState(output)?same(input,output.evaluationInput):computedResultConserves(input,output);
      if(isConstructionState(input))return product.isNativeWorkspaceWorkTask(output)?same(output,nativeConstructionTask(input)):constructionChildConserves(input,output);
      return product.isNativeWorkspaceWorkTask(input)&&product.isNativeWorkspaceWorkObservation(output)&&same(input,output.task);
    });
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
