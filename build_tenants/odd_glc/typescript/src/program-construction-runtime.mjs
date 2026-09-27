import * as product from '@abiogenesis/typescript-tenant/product';
import {isDeepStrictEqual as same} from 'node:util';
import {ids,stages,constructionStages,evaluationStages,assessmentStages,bindingFor,inputContract,evaluatorInputContract,nativeConstructionInputContract,constructionStateContract,evaluationStateContract,assessmentInputContract,assessmentStateContract,dependencyKind,VERSION,PACKAGE_NAME,PACKAGE_VERSION} from './program-construction-contracts.mjs';
import {rawContract as assessmentResultContract,ASSESSMENT_SCHEMA_TEXT} from './native-continuation-contracts.mjs';
import {checkCriterionEvidence,interpretJobEvidenceRows} from './native-continuation-runtime.mjs';
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
  const combined=Object.hasOwn(input,'evaluator'),assessed=Object.hasOwn(input,'assessment');
  if(!only(input,[...sourceFields,'constructionGroups',...(combined?['evaluator']:[]),...(assessed?['assessment']:[])])||input.kind!==nativeConstructionInputContract.valueKind||!sourceInput(input))return false;
  const selection=selectionFor(input),prospective=[...selection.work,...selection.gaps];
  // Shape admission does not claim predecessor currentness. The acquired-context
  // preparation checks it before the first native constructor can be called.
  const construction=prospective.filter(d=>d.role==='provenance');
  return construction.length>0&&prospective.every(d=>d.applicability.value==='true'&&(d.role==='provenance'&&d.dependentPaths?.length>0||combined&&d.role==='evaluate'||assessed&&d.role==='assess'))&&
    selectedDuties(input).every(d=>d.role==='provenance'||combined&&d.role==='evaluate'||assessed&&d.role==='assess')&&
    (!combined||prospective.some(d=>d.role==='evaluate')&&coordinate(input.evaluator?.graphFunction)&&coordinate(input.evaluator?.fitJudgment)&&
      typeof input.evaluator.resultContractRef==='string'&&record(input.evaluator.parameters))&&
    (!assessed||combined&&prospective.some(d=>d.role==='assess')&&record(input.origin.assessmentBasis?.evaluationData)&&assessmentSelectionShape(input.assessment))&&
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
  return same(projectNativeSource(product,value,{includeAssessment:!!input.assessment}),input.origin);
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
  const selected=entry.assessment?selection.selectedDutyRefs:entry.selectedDutyRefs;
  return freeze({kind:evaluatorInputContract.valueKind,schemaVersion:VERSION,taskRef:entry.model.taskRef,
    sourceRefs:entry.model.sourceRefs,interpretation:entry.model.interpretation,
    selectedDutyRefs:selected,selectedObligationRefs:entry.model.duties.filter(d=>selected.includes(d.ref)).map(d=>d.obligationRef),
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
  return entry.selectedDutyRefs.every(ref=>entry.model.duties.some(d=>d.ref===ref&&(['evaluate','assess'].includes(d.role)||grouped.includes(ref))))&&
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
const texts=xs=>Array.isArray(xs)&&xs.length>0&&xs.every(x=>typeof x==='string'&&x.length>0)&&new Set(xs).size===xs.length;
const assessmentRoles=['source','candidate','execution','oracle','construction_record','comparison_record'];
function assessmentSelectionShape(s) {
  return only(s,['claim','fitJudgment','rubric','sourcePaths','candidatePaths','criterionEvidence','recordSelections'])&&typeof s.claim==='string'&&s.claim.length>0&&
    coordinate(s.fitJudgment)&&only(s.rubric,['path','digest','stageRef'])&&typeof s.rubric.path==='string'&&coordinate({ref:s.rubric.stageRef,digest:s.rubric.digest})&&
    texts(s.sourcePaths)&&texts(s.candidatePaths)&&Array.isArray(s.criterionEvidence)&&s.criterionEvidence.length>0&&
    s.criterionEvidence.every(r=>only(r,['criterionRef','dutyRefs','roles'])&&typeof r.criterionRef==='string'&&texts(r.dutyRefs)&&texts(r.roles)&&r.roles.every(role=>assessmentRoles.includes(role)))&&
    Array.isArray(s.recordSelections)&&s.recordSelections.length>0&&s.recordSelections.every(r=>only(r,['recordPath','role','dutyRef'])&&
      typeof r.recordPath==='string'&&r.recordPath.startsWith('/')&&['construction_record','comparison_record'].includes(r.role)&&typeof r.dutyRef==='string');
}
function pointer(value,path) {
  need(typeof path==='string'&&path.startsWith('/')&&!/~(?:[^01]|$)/u.test(path),'exact computed record JSON Pointer required');
  for(const part of path.slice(1).split('/').map(p=>p.replaceAll('~1','/').replaceAll('~0','~'))) {
    need(value!==null&&typeof value==='object'&&Object.hasOwn(value,part),'computed record JSON Pointer is unavailable: '+path);value=value[part];
  }
  return value;
}
function independentProducers(entry,view) {
  const native=view.constructionObservations.map(r=>({observation:r.observation,dutyRefs:r.dutyRefs}));
  const selected=entry.model.duties.filter(d=>view.selectedDutyRefs.includes(d.ref)&&d.role==='assess');
  const observations=native.map(r=>r.observation);
  for(const ref of selected.flatMap(d=>d.independentOf??[])) {
    const duty=entry.model.duties.find(d=>d.ref===ref),rows=native.filter(r=>r.dutyRefs.includes(ref));
    const observation=rows.length===1?rows[0].observation:duty?.role==='construct'?entry.origin.observation.task.sourceNativeWork:
      duty?.role==='execute'?entry.origin.observation:null;
    need(observation,'requested independent producer unavailable: '+ref);observations.push(observation);
  }
  const rows=observations.map(o=>({ref:o.observationRef,digest:o.observationDigest,actorInvocationRef:o.provenance.actorInvocationRef,cCallRef:o.provenance.cCallRef??null}));
  return rows.filter((r,index)=>rows.findIndex(x=>same(x,r))===index);
}
/** The oracle crosses only this post-evaluator join from authenticated root input. */
export function constructionAssessmentInput(bound) {
  need(product.isRetainedGraphInput(bound)&&bound.entry?.assessment&&evaluatedConstructionConserves(bound.entry,bound.source),
    'actual original entry and conserved evaluator child required for assessment');
  const entry=bound.entry,view=bound.source.evaluationInput,text=product.canonicalJson(entry.origin.assessmentBasis.evaluationData),digest=product.sha256Bytes(Buffer.from(text));
  const result={kind:assessmentInputContract.valueKind,schemaVersion:VERSION,evaluationState:bound.source,selection:entry.assessment,authority:entry.authority,
    oracle:{ref:'oracle://odd-glc/program-construction/'+digest.slice(7),digest,text},
    independentProducers:independentProducers(entry,view),originalTaskCompletion:'not_claimed'};
  assessmentEvidence(result);return freeze(result);
}
export function isAssessmentInput(input) {try {
  return only(input,['kind','schemaVersion','evaluationState','selection','authority','oracle','independentProducers','originalTaskCompletion'])&&
    input.kind===assessmentInputContract.valueKind&&input.schemaVersion===VERSION&&isEvaluationState(input.evaluationState)&&assessmentSelectionShape(input.selection)&&
    record(input.authority)&&only(input.oracle,['ref','digest','text'])&&coordinate(input.oracle)&&input.oracle.ref.startsWith('oracle://')&&typeof input.oracle.text==='string'&&
    product.sha256Bytes(Buffer.from(input.oracle.text))===input.oracle.digest&&Array.isArray(input.independentProducers)&&input.independentProducers.length>0&&
    input.independentProducers.every(p=>only(p,['ref','digest','actorInvocationRef','cCallRef'])&&coordinate(p)&&typeof p.actorInvocationRef==='string'&&
      (p.cCallRef===null||typeof p.cCallRef==='string'))&&input.originalTaskCompletion==='not_claimed';
}catch{return false;}}
/** Disposable invocation maps; computed labels/text are never another authority. */
export function assessmentEvidence(input) {
  need(isAssessmentInput(input),'exact retained assessment input required');
  const {evaluationInput:view,computedRecords:computed}=input.evaluationState,s=input.selection,context=view.currentContext;
  const author=view.constructionObservations.at(-1)?.observation;
  need(author&&same(context,author.after),'assessment must use the actual latest author after-context');
  const rubricFile=currentFile(context,s.rubric.path);
  need(rubricFile.digest===s.rubric.digest,'exact current rubric required');
  const body=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.from(rubricFile.bytes,'base64')));
  const stages=body.kind==='semantic_job_lifecycle_declaration'?body.stages?.filter(stage=>stage.declarationRef===s.rubric.stageRef):[];
  need(stages?.length===1&&Array.isArray(stages[0].rubric)&&stages[0].rubric.length>0,'one explicitly selected lifecycle stage rubric required');
  const criteria=stages[0].rubric.map(c=>{need(only(c,['criterionRef','instruction'])&&typeof c.criterionRef==='string'&&typeof c.instruction==='string','exact original stage criterion required');return {...c,mandatory:true};});
  need(same(criteria.map(c=>c.criterionRef),s.criterionEvidence.map(r=>r.criterionRef)),'complete ordered original stage criterion coverage required');
  need(s.sourcePaths.every(path=>!s.candidatePaths.includes(path)&&path!==s.rubric.path)&&!s.candidatePaths.includes(s.rubric.path),
    'candidate, source and rubric paths must be disjoint');
  [...s.sourcePaths,...s.candidatePaths].forEach(path=>currentFile(context,path));
  need(view.constructionEdges.every(edge=>edge.dependentPaths.every(path=>s.candidatePaths.includes(path))&&
    edge.dependencies.every(dep=>s.sourcePaths.includes(dep.path)||s.candidatePaths.includes(dep.path))),
    'complete constructed candidates and their source paths required');
  // Every complete source member must be available, not just a named excerpt.
  need(view.sourceRefs.every(source=>s.sourcePaths.some(path=>currentFile(context,path).digest===source.digest)),'complete original source access required');
  const bytes=new Map(),add=(label,text)=>{need(!bytes.has(label),'colliding assessment evidence label: '+label);bytes.set(label,text);};
  for(const file of context.entries.filter(e=>e.state==='file'))add(file.relativePath,new TextDecoder('utf-8',{fatal:true}).decode(Buffer.from(file.bytes,'base64')));
  const streams=view.executionRecord.commandResults.flatMap((command,index)=>['stdout','stderr'].map(name=>{
    const stream=command[name],raw=Buffer.from(stream.payload,'base64');need(raw.length===stream.byteLength&&product.sha256Bytes(raw)===stream.digest,'exact retained execution stream required');
    const label=`command-${index+1}.${name}`,text=new TextDecoder('utf-8',{fatal:true}).decode(raw);add(label,text);return {label,text};
  }));
  add(input.oracle.ref,input.oracle.text);
  const outputDigest=product.sha256Canonical(computed),paths=s.recordSelections.map(r=>r.recordPath);
  need(new Set(paths).size===paths.length,'distinct computed record selections required');
  const records=s.recordSelections.map(selection=>{
    const duty=view.dutyPopulation.find(d=>d.ref===selection.dutyRef),record=pointer(computed,selection.recordPath);
    need(duty&&view.selectedDutyRefs.includes(duty.ref)&&record&&record.recordKind===selection.role&&
      duty.obligationRef===record.obligationRef&&duty.bindingRef===record.bindingRef&&
      (selection.role==='construction_record'?duty.role==='provenance'&&record.dutyRef===duty.ref:duty.role==='evaluate')&&
      ['true','false','unknown'].includes(record.verdict),'computed record role and selected obligation must agree');
    const label=`computed:${outputDigest}:${selection.recordPath}`,text=product.canonicalJson({evaluator:computed.evaluator,outputDigest,recordPath:selection.recordPath,record});
    add(label,text);return {...selection,label,text,verdict:record.verdict};
  });
  const duties=view.dutyPopulation.filter(d=>view.selectedDutyRefs.includes(d.ref)),assessmentDuties=duties.filter(d=>d.role==='assess');
  need(assessmentDuties.length>0&&duties.filter(d=>['provenance','evaluate'].includes(d.role)).every(d=>records.some(r=>r.dutyRef===d.ref)),
    'every selected construction/evaluation duty requires actual computed evidence');
  need(s.criterionEvidence.every(row=>row.dutyRefs.every(ref=>duties.some(d=>d.ref===ref)))&&
    assessmentDuties.every(d=>s.criterionEvidence.some(row=>row.dutyRefs.includes(d.ref)))&&
    records.every(r=>s.criterionEvidence.some(row=>row.dutyRefs.includes(r.dutyRef)&&row.roles.includes(r.role))), 'source-linked criterion/duty coverage required');
  const rolePaths={source:s.sourcePaths,candidate:s.candidatePaths,execution:streams.map(e=>e.label),oracle:[input.oracle.ref]};
  const roleLabels=Object.fromEntries(s.criterionEvidence.map(row=>[row.criterionRef,Object.fromEntries(row.roles.map(role=>[role,
    rolePaths[role]??records.filter(r=>r.role===role&&row.dutyRefs.includes(r.dutyRef)).map(r=>r.label)]))]));
  checkCriterionEvidence({criteria,roleLabels},bytes);
  need(input.independentProducers.some(p=>p.ref===author.observationRef&&p.digest===author.observationDigest&&
    p.actorInvocationRef===author.provenance.actorInvocationRef&&p.cCallRef===author.provenance.cCallRef),'actual latest author independence required');
  return {criteria,roleLabels,bytes,records,streams,author,claim:s.claim};
}
export function constructionAssessmentTask(input) {
  return buildConstructionAssessmentTask(input,assessmentEvidence(input));
}
function buildConstructionAssessmentTask(input,evidence) {
  const view=input.evaluationState.evaluationInput,context=view.currentContext,s=input.selection,author=evidence.author;
  const candidate=currentFile(context,s.candidatePaths[0]),sources=context.entries.filter(e=>e.state==='file'&&e.relativePath!==candidate.relativePath&&e.relativePath!==s.rubric.path)
    .map(e=>({path:e.relativePath,digest:e.digest}));
  return product.constructNativeWorkspaceWorkTask({...input.authority,context,outcome:s.claim,readFirst:context.entries.filter(e=>e.state==='file').map(e=>e.relativePath),writeRoots:[],checks:[],
    instructions:['Independently assess the selected original obligations against the complete original source, actual new construction and exact derived records. The selected rubric stage is an exact projection, not a rewritten rubric. No new execution or artifact mutation is authorized.',
      'A true computed condition is evidence to judge, not proof of faithful derivation. Preserve negative/unknown records, missing raw argument/type fields, carried duties and separate owner conjunction of accepted scopes. Do not infer original-task or full semantic closure.',
      `Complete candidate paths: ${product.canonicalJson(s.candidatePaths)}. Complete source paths: ${product.canonicalJson(s.sourcePaths)}.`,
      `Exact original rubric stage: ${s.rubric.stageRef}. All declared criteria are required: ${product.canonicalJson(evidence.criteria)}.`,
      `Exact criterion/role/allowed-label mapping: ${product.canonicalJson(evidence.roleLabels)}. Quote actual substrings from these labels; old command evidence cannot stand for a computed record.`,
      `Original duty population and carried scope: ${product.canonicalJson({duties:view.dutyPopulation,carriedDuties:view.carriedDuties,carriedBindingRefs:view.carriedBindingRefs,pendingDutyRefs:view.pendingDutyRefs})}`,
      `Unchanged evaluator-only oracle (${input.oracle.ref}):\n${input.oracle.text}`,
      ...evidence.records.map(r=>`Exact derived evidence (${r.label}):\n${r.text}`),
      ...evidence.streams.map(r=>`Exact retained execution evidence (${r.label}):\n${r.text}`),
      `Original execution/predicate facts and preserved computed residuals: ${product.canonicalJson({execution:view.execution,construction:view.construction,
        observation:view.executionRecord.observation,predicates:view.executionRecord.predicateObservations,provenance:view.executionRecord.provenance,
        residuals:input.evaluationState.computedRecords.records.residuals,acceptedResultsDisposition:view.acceptedResultsDisposition})}`,
      `Independence is required from every producer: ${product.canonicalJson(input.independentProducers)}. Return the declared criterion assessment; preserve selected and outside residuals.`],
    assessment:{resultContract:assessmentResultContract,schemaAsset:{productId:ids.productId,contractId:assessmentResultContract.contractRef,bytesBase64:Buffer.from(ASSESSMENT_SCHEMA_TEXT).toString('base64')},sources,
      candidate:{path:candidate.relativePath,digest:candidate.digest},rubric:{path:s.rubric.path,digest:s.rubric.digest},
      producer:{resultRef:author.observationRef,resultDigest:author.observationDigest,cCallRef:author.provenance.cCallRef,actorInvocationRef:author.provenance.actorInvocationRef}}});
}
export function constructionAssessmentOutput(bound) {
  need(product.isRetainedGraphInput(bound)&&product.isNativeWorkspaceWorkObservation(bound.source),
    'actual retained assessment input and native observation required');
  const input=bound.entry,evidence=assessmentEvidence(input),observation=bound.source,context=input.evaluationState.evaluationInput.currentContext;
  need(same(observation.task,buildConstructionAssessmentTask(input,evidence))&&same(observation.before,context)&&same(observation.after,context)&&
    product.nativeWorkspaceAssessmentMatchesContext(observation,context),'exact task and unchanged read-only assessment context required');
  need(input.independentProducers.every(p=>p.actorInvocationRef!==observation.provenance.actorInvocationRef&&
    (p.cCallRef===null||p.cCallRef!==observation.provenance.cCallRef)),'independent assessor actor and C-call required');
  const interpreted=interpretJobEvidenceRows(evidence,observation.assessment,evidence.bytes);
  const cited=new Set(observation.assessment.criteria.flatMap(row=>row.evidence.map(e=>e.path)));
  const missing=evidence.records.filter(r=>!cited.has(r.label));
  const judgment=missing.length?{...interpreted,disposition:'unsatisfied',diagnostics:[...interpreted.diagnostics,
    ...missing.map(r=>'computed_record_coverage_missing:'+r.recordPath)]}:interpreted;
  const recordsCurrent=evidence.records.every(r=>r.verdict==='true');
  return freeze({kind:assessmentStateContract.valueKind,schemaVersion:VERSION,assessmentInput:input,assessmentObservation:observation,
    interpretation:judgment,assessmentDisposition:judgment.disposition==='satisfied'&&recordsCurrent?'satisfied':'unsatisfied',
    computedEvidenceDisposition:recordsCurrent?'true':evidence.records.some(r=>r.verdict==='false')?'false':'unknown',
    preservedResiduals:input.evaluationState.computedRecords.records.residuals,carriedDutyRefs:input.evaluationState.evaluationInput.carriedDutyRefs,
    acceptedResultsDisposition:'requires_separate_owner_conjunction',semanticClosure:'not_claimed',originalTaskCompletion:'not_claimed'});
}
export function isAssessmentState(value) {try {
  return value?.kind===assessmentStateContract.valueKind&&same(value,constructionAssessmentOutput(product.constructRetainedGraphInput(value.assessmentInput,value.assessmentObservation)));
}catch{return false;}}
function assessedConstructionConserves(input,output) {
  return isAssessmentState(output)&&same(output.assessmentInput,constructionAssessmentInput(product.constructRetainedGraphInput(input,output.assessmentInput.evaluationState)));
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
const assessmentTransforms=[constructionAssessmentInput,constructionAssessmentTask,constructionAssessmentOutput];
const realizeAssessment=(index,input)=>{const resultCandidate=assessmentTransforms[index](input);return freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,
  disposition:'success',resultCandidate,evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,
    implementationRef:assessmentStages[index].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const prepareAssessmentInput=input=>realizeAssessment(0,input),prepareAssessmentTask=input=>realizeAssessment(1,input),joinAssessment=input=>realizeAssessment(2,input);
export const PREPARE_ASSESSMENT_INPUT_DESCRIPTOR=descriptor(assessmentStages[0]),PREPARE_ASSESSMENT_TASK_DESCRIPTOR=descriptor(assessmentStages[1]),JOIN_ASSESSMENT_DESCRIPTOR=descriptor(assessmentStages[2]);
const relation=(predicateRef,evaluate)=>({predicateRef,advanceReasonRef:predicateRef+'/satisfied',rejectionReasonRef:predicateRef+'/refused',
  evaluate(...args){try{return evaluate(...args);}catch{return false;}}});
export const PROGRAM_CONSTRUCTION_SEMANTICS=Object.freeze({kind:'product_semantics_provider',schemaVersion:VERSION,bindingRef:ids.semanticsBindingRef,
  packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,
  admitInput(ref,value){return (ref===ids.inputContractRef&&isConstructionInput(value)||ref===ids.nativeInputContractRef&&isNativeConstructionInput(value))?freeze(value):null;},
  evaluateInteractionResponse(){return null;},
  validateContractValue(kind,value){return ({lifecycle_construction_input:isConstructionInput,lifecycle_evaluation_input:isEvaluationInput,
    lifecycle_native_construction_input:isNativeConstructionInput,lifecycle_construction_state:isConstructionState,lifecycle_evaluation_state:isEvaluationState,
    lifecycle_assessment_input:isAssessmentInput,lifecycle_assessment_state:isAssessmentState,
    native_workspace_work_task:product.isNativeWorkspaceWorkTask,native_workspace_work_observation:product.isNativeWorkspaceWorkObservation,
    lifecycle_computed_records:v=>v?.kind==='lifecycle_computed_records'&&v.schemaVersion===VERSION&&coordinate(v.evaluator)&&
      coordinate(v.sourceResult)&&coordinate(v.execution)&&record(v.records)&&v.evidenceRole==='computed_derivation'&&v.originalTaskCompletion==='not_claimed',
    retained_graph_input:product.isRetainedGraphInput,native_worksite_command_reacquisition_request:product.isNativeWorksiteCommandReacquisitionRequest,
    worksite_command_execution_task:product.isNativeWorksiteCommandExecutionTask})[kind]?.(value)??false;},
  resolveJudgmentRelation(ref){
    const assessmentStage=assessmentStages.findIndex(s=>s.predicateRef===ref);
    if(assessmentStage>=0)return relation(ref,(input,output)=>same(output,assessmentTransforms[assessmentStage](input)));
    if(ref===ids.assessmentChildPredicateRef)return relation(ref,(input,output)=>isAssessmentState(output)&&same(input,output.assessmentInput));
    if(ref===ids.assessedConstructionPredicateRef)return relation(ref,assessedConstructionConserves);
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
        (input.source?.kind===constructionStateContract.valueKind?constructedEvaluationInput(input):input.source?.kind===evaluationStateContract.valueKind?constructionAssessmentInput(input):constructionState(input)):
        isEvaluationInput(input.entry)?evaluationOutput(input):input.entry?.kind===assessmentInputContract.valueKind?constructionAssessmentOutput(input):constructionOutput(input));
      if(isEvaluationInput(input))return isEvaluationState(output)?same(input,output.evaluationInput):computedResultConserves(input,output);
      if(input?.kind===assessmentInputContract.valueKind)return output?.kind===assessmentStateContract.valueKind?
        isAssessmentState(output)&&same(input,output.assessmentInput):same(output,constructionAssessmentTask(input));
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
