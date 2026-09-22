import * as product from '@abiogenesis/typescript-tenant/product';
import {isDeepStrictEqual} from 'node:util';
import {ids,stages,bindingFor,inputContract,executionContract,rawContract,VERSION,PACKAGE_NAME,PACKAGE_VERSION,ASSESSMENT_SCHEMA_TEXT,constructBoundContract} from './native-continuation-contracts.mjs';
const same = (a,b) => a === b || isDeepStrictEqual(a,b);
const need = (ok,message) => { if (!ok) throw new TypeError(message); };
const record = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const exact = (x,keys) => record(x) && same(Object.keys(x).sort(),[...keys].sort());
const text = x => typeof x === 'string' && x.trim().length > 0;
const unique = xs => Array.isArray(xs) && xs.length > 0 && xs.every(text) && new Set(xs).size === xs.length;
const freeze = x => { if (record(x) || Array.isArray(x)) { if (!Object.isFrozen(x)) { Object.values(x).forEach(freeze); Object.freeze(x); } } return x; };
const decode = entry => new TextDecoder('utf-8',{fatal:true}).decode(Buffer.from(entry.bytes,'base64'));
const file = (context,path) => { const rows=context.entries.filter(e=>e.relativePath===path&&e.state==='file'); need(rows.length===1,'one selected observed file required: '+path); return rows[0]; };
const body = (context,path) => decode(file(context,path));
const observed = (context,coordinate) => exact(coordinate,['path','digest']) && file(context,coordinate.path).digest===coordinate.digest;
// Evaluation-only oracle may be an observed file or exact ordinary job bytes.
// Neither form is runtime authority or a newly admitted lifecycle asset.
const oracleLabel = oracle => oracle.path ?? oracle.ref;
const oracleText = (context,oracle) => oracle.path === undefined ? oracle.text : body(context,oracle.path);
const validOracle = (context,oracle) => oracle===null ||
  (exact(oracle,['path','digest']) ? observed(context,oracle) :
    exact(oracle,['ref','digest','text']) && /^oracle:\/\//.test(oracle.ref) && typeof oracle.text==='string' &&
    product.sha256Bytes(Buffer.from(oracle.text))===oracle.digest);
export const boundContract = constructBoundContract(product);
export const retentionBinding = product.graphInputRetentionBinding(inputContract.contractRef,executionContract.contractRef);
function rubric(input) {
 const value=JSON.parse(body(input.reacquisitionRequest.currentContext,input.job.rubric.path));
 need(record(value)&&Array.isArray(value.criteria)&&value.criteria.length>0&&value.criteria.every(c=>record(c)&&text(c.criterionRef)&&typeof c.mandatory==='boolean'&&text(c.instruction))&&
   new Set(value.criteria.map(c=>c.criterionRef)).size===value.criteria.length,'finite unique criterion rubric required');
 return value;
}
/** This identity check does not establish that a supplied plan is an admitted Design. */
export function isNativeContinuationInput(input) { try {
 if (!exact(input,['kind','schemaVersion','job','reacquisitionRequest'])||input.kind!==inputContract.valueKind||input.schemaVersion!==VERSION||
   !product.isNativeWorksiteCommandReacquisitionRequest(input.reacquisitionRequest)) return false;
 const job=input.job, context=input.reacquisitionRequest.currentContext;
 if (!exact(job,['jobRef','claim','planBasis','candidatePaths','sourcePaths','rubric','oracle','criterionEvidence','evidenceExpectations'])||
   !text(job.jobRef)||!text(job.claim)||!unique(job.candidatePaths)||!unique(job.sourcePaths)||
   !observed(context,job.rubric)||!validOracle(context,job.oracle)||
   !Array.isArray(job.planBasis)||job.planBasis.length===0||!job.planBasis.every(p=>exact(p,['assetKind','path','digest','provenance'])&&
     ['requirements','design'].includes(p.assetKind)&&file(context,p.path).digest===p.digest&&
     (p.provenance===null||exact(p.provenance,['ref','digest'])&&text(p.provenance.ref)&&/^sha256:[0-9a-f]{64}$/.test(p.provenance.digest)))||
   !Array.isArray(job.evidenceExpectations)||!job.evidenceExpectations.every(text)) return false;
 const selected=input.reacquisitionRequest.selectedSources.map(s=>s.relativePath);
 if (!job.candidatePaths.every(p=>selected.includes(p))||!job.sourcePaths.every(p=>file(context,p))||
   job.candidatePaths.some(p=>job.sourcePaths.includes(p))||job.candidatePaths.includes(job.rubric.path)||
   job.oracle!==null&&job.candidatePaths.includes(job.oracle.path)) return false;
 const criteria=rubric(input).criteria;
 if (!Array.isArray(job.criterionEvidence)||job.criterionEvidence.length!==criteria.length||
   new Set(job.criterionEvidence.map(r=>r.criterionRef)).size!==criteria.length||
   !job.criterionEvidence.every(row=>exact(row,['criterionRef','roles'])&&criteria.some(c=>c.criterionRef===row.criterionRef)&&unique(row.roles)&&
     row.roles.every(role=>['source','candidate','execution','oracle'].includes(role))&&(!row.roles.includes('oracle')||job.oracle!==null))) return false;
 return true;
 } catch { return false; } }
export function constructNativeContinuationInput({job,reacquisitionRequest}) {
 const input={kind:inputContract.valueKind,schemaVersion:VERSION,job,reacquisitionRequest};
 need(isNativeContinuationInput(input),'exact native continuation job, observed basis and request required'); return freeze(input);
}
export function isNativeContinuationBoundInput(value) {try {
 return exact(value,['kind','schemaVersion','entry','source'])&&value.kind===boundContract.valueKind&&value.schemaVersion===VERSION&&
   isNativeContinuationInput(value.entry)&&product.isNativeWorksiteCommandExecutionObservation(value.source)&&
   same(value.source.task.sourceReacquisition?.request,value.entry.reacquisitionRequest)&&
   same(value.source.task,product.constructNativeWorksiteCommandExecutionTask({...value.entry.reacquisitionRequest,sourceReacquisition:value.source.task.sourceReacquisition}));
 }catch{return false;} }
export function executionEvidence(execution) {
 need(product.isNativeWorksiteCommandExecutionObservation(execution),'typed C2 observation required');
 return execution.commandResults.flatMap((command,i)=>['stdout','stderr'].map(stream=>({label:`command-${i+1}.${stream}`,
   text:new TextDecoder('utf-8',{fatal:true}).decode(Buffer.from(command[stream].payload,'base64')),commandId:command.commandId,
   digest:command[stream].digest,byteLength:command[stream].byteLength})));
}
export function assessmentTask(bound) {
 need(isNativeContinuationBoundInput(bound),'retained exact job and admitted C2 relation required');
 const {entry,source:execution}=bound, {job,reacquisitionRequest:request}=entry, context=request.currentContext, source=request.sourceNativeWork;
 const evidence=executionEvidence(execution), candidatePath=job.candidatePaths[0], candidate=file(context,candidatePath), rubricFile=file(context,job.rubric.path);
 const sources=context.entries.filter(e=>e.state==='file'&&e.relativePath!==candidatePath&&e.relativePath!==job.rubric.path).map(e=>({path:e.relativePath,digest:e.digest}));
 const instructions=[
  'Independently assess the complete selected source, actual candidate and exact typed execution evidence against the selected rubric and oracle. The candidate anchor is one file; every declared candidate path belongs to the assessed subject. Exit status, shape and counts do not prove semantic satisfaction.',
  'The selected Requirements/Design paths and declared provenance are evidence to examine, not newly admitted lifecycle results. Preserve any absent plan-derivation evidence and all outstanding obligations; this bounded continuation does not establish source-to-Design or full lifecycle completion.',
  'Quote short actual substrings from worksite paths, the exact selected oracle label, or command-N.stdout/command-N.stderr labels. Satisfy each declared evidence role, retain exact criterion coverage, and report selected/outside residuals. Never reconstruct runtime authority from prose or read archive paths mentioned in command output.',
  `Selected job: ${job.jobRef}\nBounded claim: ${job.claim}`,
  `Candidate paths: ${JSON.stringify(job.candidatePaths)}\nSource paths: ${JSON.stringify(job.sourcePaths)}\nPlan basis: ${JSON.stringify(job.planBasis)}\nRequired evidence roles: ${JSON.stringify(job.criterionEvidence)}`,
  ...job.evidenceExpectations.map(expectation=>'Selected semantic evidence expectation: '+expectation),
  ...(job.oracle===null?[]:[`Evaluator-only selected oracle (${oracleLabel(job.oracle)}):\n${oracleText(context,job.oracle)}`]),
  ...evidence.map(e=>`Exact admitted command evidence (${e.label}; command ${e.commandId}):\n${e.text}`),
  `Typed execution facts, not file bodies:\n${product.canonicalJson({commandResults:execution.commandResults.map(({stdout,stderr,...rest})=>rest),predicateObservations:execution.predicateObservations,snapshotMembers:execution.snapshotMembers})}`,
  'Return the declared criterion result only. Read-only assessment: no file changes, report repair, missing-evidence invention or computed identity transcription.',
 ];
 return product.constructNativeWorkspaceWorkTask({workspaceAuthorityBasis:request.workspaceAuthorityBasis,workspaceBinding:request.workspaceBinding,capabilityGrant:request.capabilityGrant,
  context,outcome:'Independently assess the selected job and its actual typed command evidence.',instructions,
  readFirst:context.entries.filter(e=>e.state==='file').map(e=>e.relativePath),writeRoots:[],checks:[],assessment:{resultContract:rawContract,
   schemaAsset:{productId:ids.productId,contractId:ids.rawContractRef,bytesBase64:Buffer.from(ASSESSMENT_SCHEMA_TEXT).toString('base64')},sources,
   candidate:{path:candidatePath,digest:candidate.digest},rubric:{path:job.rubric.path,digest:rubricFile.digest},
   producer:{resultRef:source.observationRef,resultDigest:source.observationDigest,cCallRef:source.provenance.cCallRef,actorInvocationRef:source.provenance.actorInvocationRef}}});
}
/** Finite arithmetic over F_P judgments. Never a domain oracle or admission. */
export function interpretEvidenceRows(entry,assessment,bytes,streamLabels) {
 need(isNativeContinuationInput(entry),'exact selected job required');
 const {job}=entry, criteria=rubric(entry).criteria, required=criteria.map(c=>c.criterionRef), rows=assessment?.criteria, diagnostics=[];
 if (!Array.isArray(rows)||rows.length!==required.length||new Set(rows.map(r=>r.criterionRef)).size!==required.length||!required.every(ref=>rows.some(r=>r.criterionRef===ref)))
  diagnostics.push('criterion_coverage_mismatch');
 const rolePaths={source:job.sourcePaths,candidate:job.candidatePaths,execution:streamLabels,oracle:job.oracle===null?[]:[oracleLabel(job.oracle)]};
 for (const row of rows??[]) {
  const refs=row.evidence??[];
  if (!Array.isArray(refs)||!refs.every(e=>text(e.quote)&&bytes.get(e.path)?.includes(e.quote))) { diagnostics.push('evidence_quote_mismatch:'+row.criterionRef); continue; }
  const roles=job.criterionEvidence.find(r=>r.criterionRef===row.criterionRef)?.roles??[];
  if (row.disposition==='satisfied'&&roles.some(role=>!refs.some(e=>rolePaths[role].includes(e.path)))) diagnostics.push('missing_declared_evidence_role:'+row.criterionRef);
 }
 const residuals=assessment?.residuals;
 if (!Array.isArray(residuals)) diagnostics.push('residuals_absent');
 const satisfied=diagnostics.length===0&&criteria.filter(c=>c.mandatory).every(c=>rows.some(r=>r.criterionRef===c.criterionRef&&r.disposition==='satisfied'))&&
   !residuals.some(r=>r.scope==='selected-assessment');
 return Object.freeze({disposition:satisfied?'satisfied':'unsatisfied',diagnostics:Object.freeze(diagnostics),requiredCriteria:Object.freeze(required),claim:job.claim});
}
export function interpretExecutionAssessment(bound,observation) {
 need(isNativeContinuationBoundInput(bound)&&product.isNativeWorkspaceWorkObservation(observation)&&same(observation.task,assessmentTask(bound)),
   'assessment must be the exact successor of this retained job and typed C2 input');
 need(product.nativeWorkspaceAssessmentMatchesContext(observation,observation.after),'current exact read-only assessment subject required');
 const execution=bound.source, author=execution.task.sourceNativeWork.provenance;
 need(observation.provenance.actorInvocationRef!==author.actorInvocationRef&&observation.provenance.actorInvocationRef!==execution.provenance.actorInvocationRef&&
   observation.provenance.cCallRef!==author.cCallRef,'independent assessment invocation required');
 const streams=executionEvidence(execution), bytes=new Map(streams.map(e=>[e.label,e.text]));
 for(const e of observation.after.entries)if(e.state==='file')bytes.set(e.relativePath,decode(e));
 if(bound.entry.job.oracle!==null)bytes.set(oracleLabel(bound.entry.job.oracle),oracleText(observation.after,bound.entry.job.oracle));
 return interpretEvidenceRows(bound.entry,observation.assessment,bytes,streams.map(s=>s.label));
}
const transforms=[input=>{need(isNativeContinuationInput(input),'exact continuation input required');return input.reacquisitionRequest;},assessmentTask];
const descriptor=stage=>{const {kind,bindingRef,...value}=bindingFor(stage);return Object.freeze({kind:'packaged_leaf_implementation_descriptor',schemaVersion:VERSION,...value,descriptorDigest:product.sha256Canonical(value)});};
export const SELECT_DESCRIPTOR=descriptor(stages[0]), ASSESSMENT_DESCRIPTOR=descriptor(stages[1]);
const realize=(i,input)=>{const resultCandidate=transforms[i](input);return Object.freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,disposition:'success',resultCandidate,
 evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,implementationRef:stages[i].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const selectRequest=input=>realize(0,input);
export const prepareAssessment=input=>realize(1,input);
export function contractValuePredicate(kind) {
 return ({native_continuation_input:isNativeContinuationInput,retained_graph_input:isNativeContinuationBoundInput,
  native_worksite_command_reacquisition_request:product.isNativeWorksiteCommandReacquisitionRequest,native_workspace_work_task:product.isNativeWorkspaceWorkTask,
  native_workspace_work_observation:product.isNativeWorkspaceWorkObservation,worksite_command_execution_task:product.isNativeWorksiteCommandExecutionTask,
  worksite_command_execution_observation:product.isNativeWorksiteCommandExecutionObservation})[kind]??null;
}
const relation=(predicateRef,evaluate)=>Object.freeze({predicateRef,advanceReasonRef:predicateRef+'/satisfied',rejectionReasonRef:predicateRef+'/refused',evaluate(input,output){try{return evaluate(input,output);}catch{return false;}}});
export const NATIVE_CONTINUATION_SEMANTICS=Object.freeze({kind:'product_semantics_provider',schemaVersion:VERSION,bindingRef:ids.semanticsBindingRef,packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,
 admitInput(contractRef,value){return contractRef===ids.inputContractRef&&isNativeContinuationInput(value)?freeze(value):null;},evaluateInteractionResponse(){return null;},
 validateContractValue(kind,value){return contractValuePredicate(kind)?.(value)??false;},
 resolveJudgmentRelation(predicateRef){
  const index=stages.findIndex(s=>s.predicateRef===predicateRef);if(index>=0)return relation(predicateRef,(input,output)=>same(output,transforms[index](input)));
  if(predicateRef===ids.wrapperPredicateRef)return relation(predicateRef,(input,output)=>interpretExecutionAssessment(input,output).disposition==='satisfied');
  if(predicateRef===ids.wrapperStepPredicateRef)return relation(predicateRef,(input,output)=>product.isNativeWorkspaceWorkTask(input)&&product.isNativeWorkspaceWorkObservation(output)&&same(input,output.task));
  if(predicateRef===ids.stepPredicateRef)return relation(predicateRef,(input,output)=>
   product.isNativeWorksiteCommandReacquisitionRequest(input)&&product.isNativeWorksiteCommandExecutionTask(output)&&same(input,output.sourceReacquisition?.request)||
   product.isNativeWorksiteCommandExecutionTask(input)&&product.isNativeWorksiteCommandExecutionObservation(output)&&same(input,output.task)||
   isNativeContinuationBoundInput(input)&&interpretExecutionAssessment(input,output).disposition==='satisfied');
  if(predicateRef===ids.completionPredicateRef)return relation(predicateRef,(input,output)=>isNativeContinuationInput(input)&&product.isNativeWorkspaceWorkObservation(output)&&output.task.assessment!==undefined&&
   same(input.reacquisitionRequest.workspaceAuthorityBasis,output.task.workspaceAuthorityBasis)&&same(input.reacquisitionRequest.workspaceBinding,output.task.workspaceBinding)&&
   same(input.reacquisitionRequest.capabilityGrant,output.task.capabilityGrant)&&same(input.reacquisitionRequest.currentContext,output.task.context)&&
   output.task.assessment.rubric.path===input.job.rubric.path&&output.task.assessment.rubric.digest===input.job.rubric.digest&&
   product.nativeWorkspaceAssessmentMatchesContext(output,output.after)&&
   rubric(input).criteria.filter(c=>c.mandatory).every(c=>output.assessment.criteria.filter(r=>r.criterionRef===c.criterionRef&&r.disposition==='satisfied').length===1)&&
   !output.assessment.residuals.some(r=>r.scope==='selected-assessment'));
  return null;
 }});
