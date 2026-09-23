import * as product from '@abiogenesis/typescript-tenant/product';
import {isDeepStrictEqual} from 'node:util';
import {ids,stages,bindingFor,inputContract,executionContract,rawContract,VERSION,PACKAGE_NAME,PACKAGE_VERSION,ASSESSMENT_SCHEMA_TEXT,constructBoundContract,
 correction,correctionStages,correctionSelectionContract,CORRECTION_SELECTION_SCHEMA_TEXT} from './native-continuation-contracts.mjs';
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
 const value=JSON.parse(body(input.currentContext??input.reacquisitionRequest.currentContext,input.job.rubric.path));
 need(record(value)&&Array.isArray(value.criteria)&&value.criteria.length>0&&value.criteria.every(c=>record(c)&&text(c.criterionRef)&&typeof c.mandatory==='boolean'&&text(c.instruction))&&
   new Set(value.criteria.map(c=>c.criterionRef)).size===value.criteria.length,'finite unique criterion rubric required');
 return value;
}
/** This identity check does not establish that a supplied plan is an admitted Design. */
export function isNativeContinuationInput(input) { try {
 if (!exact(input,['kind','schemaVersion','job','reacquisitionRequest'])||input.kind!==inputContract.valueKind||input.schemaVersion!==VERSION||
   !product.isNativeWorksiteCommandReacquisitionRequest(input.reacquisitionRequest)) return false;
 return isContinuationJob(input.job,input.reacquisitionRequest.currentContext,input.reacquisitionRequest.selectedSources);
 } catch { return false; } }
function isContinuationJob(job,context,selectedSources) {try {
 if (!exact(job,['jobRef','claim','planBasis','candidatePaths','sourcePaths','rubric','oracle','criterionEvidence','evidenceExpectations'])||
   !text(job.jobRef)||!text(job.claim)||!unique(job.candidatePaths)||!unique(job.sourcePaths)||
   !observed(context,job.rubric)||!validOracle(context,job.oracle)||
   !Array.isArray(job.planBasis)||job.planBasis.length===0||!job.planBasis.every(p=>exact(p,['assetKind','path','digest','provenance'])&&
     ['requirements','design'].includes(p.assetKind)&&file(context,p.path).digest===p.digest&&
     (p.provenance===null||exact(p.provenance,['ref','digest'])&&text(p.provenance.ref)&&/^sha256:[0-9a-f]{64}$/.test(p.provenance.digest)))||
   !Array.isArray(job.evidenceExpectations)||!job.evidenceExpectations.every(text)) return false;
 const selected=selectedSources.map(s=>s.relativePath);
 if (!job.candidatePaths.every(p=>selected.includes(p))||!job.sourcePaths.every(p=>file(context,p))||
   job.candidatePaths.some(p=>job.sourcePaths.includes(p))||job.candidatePaths.includes(job.rubric.path)||
   job.oracle!==null&&job.candidatePaths.includes(job.oracle.path)) return false;
 const criteria=rubric({job,currentContext:context}).criteria;
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
 return executionStreams(execution);
}
function retainedExecutionStreams(execution) {
 return execution.commandResults.flatMap((command,i)=>['stdout','stderr'].map(stream=>({label:`command-${i+1}.${stream}`,
  commandId:command.commandId,payload:command[stream].payload,digest:command[stream].digest,byteLength:command[stream].byteLength})));
}
const streamEvidence=({payload,...stream})=>({...stream,text:new TextDecoder('utf-8',{fatal:true}).decode(Buffer.from(payload,'base64'))});
function executionStreams(execution) { return retainedExecutionStreams(execution).map(streamEvidence); }
export function assessmentTask(bound) {
 need(isNativeContinuationBoundInput(bound),'retained exact job and admitted C2 relation required');
 const {entry,source:execution}=bound, {job,reacquisitionRequest:request}=entry, context=request.currentContext, source=request.sourceNativeWork;
 return buildAssessmentTask(job,request,context,source,execution);
}
function buildAssessmentTask(job,request,context,source,execution,schemaOwner=ids.productId,evidence=executionEvidence(execution)) {
 const candidatePath=job.candidatePaths[0], candidate=file(context,candidatePath), rubricFile=file(context,job.rubric.path);
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
   schemaAsset:{productId:schemaOwner,contractId:ids.rawContractRef,bytesBase64:Buffer.from(ASSESSMENT_SCHEMA_TEXT).toString('base64')},sources,
   candidate:{path:candidatePath,digest:candidate.digest},rubric:{path:job.rubric.path,digest:rubricFile.digest},
   producer:{resultRef:source.observationRef,resultDigest:source.observationDigest,cCallRef:source.provenance.cCallRef,actorInvocationRef:source.provenance.actorInvocationRef}}});
}
/** Finite arithmetic over F_P judgments. Never a domain oracle or admission. */
export function interpretEvidenceRows(entry,assessment,bytes,streamLabels) {
 need(isNativeContinuationInput(entry)||isNativeCorrectionInput(entry),'exact selected job required');
 return interpretJobEvidenceRows(entry,assessment,bytes,streamLabels);
}
function interpretJobEvidenceRows(entry,assessment,bytes,streamLabels) {
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
 return interpretAssessment(bound.entry,bound.source,observation);
}
function interpretPriorAssessment(bound,observation,publication,streams) {
 const owner=observation.task.assessment?.schemaAsset.productId;
 // R10 supplies the publication belonging to the exact admitted ancestor.
 need(publication.moduleRef===ids.moduleRef&&publication.owningProductId===owner,'one original assessment schema publication required');
 const binding=publication.productSemanticsBinding;
 need(binding?.kind==='product_semantics_binding'&&binding.bindingRef===ids.semanticsBindingRef&&binding.packageName===PACKAGE_NAME&&
  text(binding.packageVersion)&&binding.modulePath==='build/native-continuation-runtime.mjs'&&binding.namedSymbol==='NATIVE_CONTINUATION_SEMANTICS'&&
  same(publication.contracts.filter(contract=>contract.contractRef===ids.rawContractRef),[rawContract]),'unchanged historical assessment contract required');
 const {entry,source:execution}=bound,{job,reacquisitionRequest:request}=entry;
 need(isContinuationJob(job,request.currentContext,request.selectedSources)&&same(observation.before,observation.after)&&
  same(execution.task.sourceReacquisition?.request,request)&&
  same(observation.task,buildAssessmentTask(job,request,request.currentContext,request.sourceNativeWork,execution,owner,streams)),
  'historical assessment must retain the exact job, schema bytes and typed C2 relation');
 return interpretAssessmentFacts(entry,execution,observation,streams);
}
function interpretAssessment(entry,execution,observation) {
 need(product.nativeWorkspaceAssessmentMatchesContext(observation,observation.after),'current exact read-only assessment subject required');
 need(isNativeContinuationInput(entry)||isNativeCorrectionInput(entry),'exact selected job required');
 return interpretAssessmentFacts(entry,execution,observation,executionEvidence(execution));
}
function interpretAssessmentFacts(entry,execution,observation,streams) {
 const author=execution.task.sourceNativeWork.provenance;
 need(observation.provenance.actorInvocationRef!==author.actorInvocationRef&&observation.provenance.actorInvocationRef!==execution.provenance.actorInvocationRef&&
   observation.provenance.cCallRef!==author.cCallRef,'independent assessment invocation required');
 const bytes=new Map(streams.map(e=>[e.label,e.text]));
 for(const e of observation.after.entries)if(e.state==='file')bytes.set(e.relativePath,decode(e));
 if(entry.job.oracle!==null)bytes.set(oracleLabel(entry.job.oracle),oracleText(observation.after,entry.job.oracle));
 return interpretJobEvidenceRows(entry,observation.assessment,bytes,streams.map(s=>s.label));
}
const priorFields=['job','priorSource','priorAssessment','priorExecution','priorAuthor','executionPlan'];
const stableTerminal=({value,projectionBasis,...selection})=>selection;
const observationCoordinate=observation=>({observationRef:observation.observationRef,observationDigest:observation.observationDigest,provenance:observation.provenance});
const coordinateShape=value=>text(value.observationRef)&&/^sha256:[a-f0-9]{64}$/.test(value.observationDigest)&&record(value.provenance)&&text(value.provenance.actorInvocationRef);

/** Candidate facts only. This pure projection confers no admission. At first J
 * its source is supplied by the invoking ABG owner, never by input assertions.
 * R10 and the original basis/producer admissions own native value validity and
 * the exact ancestor input. We reuse those facts; only consumer meaning is
 * compared here, without walking earlier tasks through native shape admission. */
export function projectNativeCorrectionPrior(source){
 const terminal=source.terminalResult,bound=source.input.value,assessment=terminal.value;
 need(source.input.graphFunctionRef===ids.assessmentWrapperRef&&source.input.contractRef===ids.boundInputContractRef&&
  terminal.kind==='abg_typed_terminal_result'&&terminal.schemaVersion===VERSION&&
  bound.kind===boundContract.valueKind&&bound.schemaVersion===VERSION&&bound.entry.kind===inputContract.valueKind&&bound.entry.schemaVersion===VERSION&&
  assessment.kind==='native_workspace_work_observation'&&assessment.schemaVersion===VERSION&&
  terminal.producer.graphFunction.ref===product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef&&
  terminal.producer.cCallRef===assessment.provenance.cCallRef,'exact original terminal assessment and enclosing input required');
 const streams=retainedExecutionStreams(bound.source),interpreted=interpretPriorAssessment(bound,assessment,source.publication,streams.map(streamEvidence));
 need(interpreted.disposition==='unsatisfied'&&interpreted.diagnostics.length===0,'authentic unsatisfied prior assessment without structural diagnostics required');
 const request=bound.entry.reacquisitionRequest,execution=bound.source,author=request.sourceNativeWork;
 return freeze({job:bound.entry.job,priorSource:stableTerminal(terminal),
  priorAssessment:{...observationCoordinate(assessment),assessment:assessment.assessment},
  priorExecution:{...observationCoordinate(execution),streams},priorAuthor:observationCoordinate(author),
  executionPlan:{selectedSources:request.selectedSources,commands:request.commands,outcomePredicates:request.outcomePredicates,allowedWriteTerritories:request.allowedWriteTerritories}});
}

/** Structural ingress is not historical admission. No earlier tasks, contexts,
 * catalogs or verified source bodies belong to this successor semantic input. */
export function isNativeCorrectionInput(input) {try {
 if(!exact(input,['kind','schemaVersion',...priorFields,'workspaceAuthorityBasis','workspaceBinding','capabilityGrant','currentContext','writeCandidates'])||
  input.kind!=='native_correction_input'||input.schemaVersion!==VERSION||
  !exact(input.executionPlan,['selectedSources','commands','outcomePredicates','allowedWriteTerritories'])||
  !['selectedSources','commands','outcomePredicates','allowedWriteTerritories'].every(key=>Array.isArray(input.executionPlan[key]))||
  !exact(input.priorSource,['kind','schemaVersion','result','contract','valueKind','valueDigest','producer'])||
  !exact(input.priorAssessment,['observationRef','observationDigest','provenance','assessment'])||!coordinateShape(input.priorAssessment)||
  !exact(input.priorExecution,['observationRef','observationDigest','provenance','streams'])||!coordinateShape(input.priorExecution)||
  !exact(input.priorAuthor,['observationRef','observationDigest','provenance'])||!coordinateShape(input.priorAuthor)||
  !Array.isArray(input.priorExecution.streams)||!input.priorExecution.streams.every(e=>exact(e,['label','payload','commandId','digest','byteLength'])&&
   text(e.label)&&typeof e.payload==='string'&&text(e.commandId)&&Number.isSafeInteger(e.byteLength)&&
   Buffer.from(e.payload,'base64').toString('base64')===e.payload&&e.byteLength===Buffer.from(e.payload,'base64').length&&product.sha256Bytes(Buffer.from(e.payload,'base64'))===e.digest)||
  !record(input.priorAssessment.assessment)||!Array.isArray(input.priorAssessment.assessment.criteria)||!Array.isArray(input.priorAssessment.assessment.residuals)||
  !product.isWorksiteContextObservation(input.currentContext)||!isContinuationJob(input.job,input.currentContext,input.executionPlan.selectedSources)||
  !unique(input.writeCandidates)||input.writeCandidates.some(p=>!input.job.candidatePaths.includes(p)||input.job.planBasis.some(b=>b.path===p)))return false;
 product.constructNativeWorkspaceWorkTask({...currentAuthority(input),context:input.currentContext,outcome:'Validate current correction authority',instructions:[],
  readFirst:input.currentContext.entries.filter(e=>e.state==='file').map(e=>e.relativePath),writeRoots:input.writeCandidates,checks:[]});
 return true;
 }catch{return false;} }
const currentAuthority=input=>({workspaceAuthorityBasis:input.workspaceAuthorityBasis,workspaceBinding:input.workspaceBinding,capabilityGrant:input.capabilityGrant});
export function constructNativeCorrectionInput(input){const value={kind:'native_correction_input',schemaVersion:VERSION,...input};need(isNativeCorrectionInput(value),'complete compact prior facts, current subject and bounded authority required');return freeze(value);}
const correctionBound=(value,predicate)=>exact(value,['kind','schemaVersion','entry','source'])&&value.kind===boundContract.valueKind&&value.schemaVersion===VERSION&&isNativeCorrectionInput(value.entry)&&predicate(value.source);
export function correctionCauses(input){
 need(isNativeCorrectionInput(input),'correction input required');
 const rows=input.priorAssessment.assessment,criteria=rubric(input).criteria;
 return [...rows.criteria.filter(row=>criteria.some(c=>c.criterionRef===row.criterionRef&&c.mandatory)&&row.disposition!=='satisfied')
  .map(row=>({causeRef:'criterion:'+row.criterionRef,criterionRef:row.criterionRef,description:row.rationale})),
  ...rows.residuals.flatMap((row,index)=>row.scope==='selected-assessment'?[{causeRef:'residual:'+index,criterionRef:row.criterionRef,description:row.description}]:[])];
}
/** One owner read at first J; subsequent transforms use only compact facts. */
export function correctionCauseCurrent(input,currentOwnerPrefix,nativeProof){try{
 if(!isNativeCorrectionInput(input)||currentOwnerPrefix===undefined)return false;
 const source=nativeProof?.historicalGraphCallSource?.();
 if(source===null||source===undefined)return false;
 const facts=projectNativeCorrectionPrior(source),assessment=source.terminalResult.value,context=input.currentContext;
 return priorFields.every(key=>same(input[key],facts[key]))&&same(input.workspaceAuthorityBasis,assessment.task.workspaceAuthorityBasis)&&
  same(context.entries,assessment.after.entries)&&same(context.readRoots,assessment.after.readRoots)&&
  context.maxFiles===assessment.after.maxFiles&&context.maxBytes===assessment.after.maxBytes;
 }catch{return false;} }
function correctionReadTask(input,{outcome,instructions,resultContract,schemaText,producer}){
 const job=input.job,context=input.currentContext,candidatePath=job.candidatePaths[0];
 return product.constructNativeWorkspaceWorkTask({...currentAuthority(input),context,outcome,instructions,
  readFirst:context.entries.filter(e=>e.state==='file').map(e=>e.relativePath),writeRoots:[],checks:[],assessment:{resultContract,
   schemaAsset:{productId:ids.productId,contractId:resultContract.contractRef,bytesBase64:Buffer.from(schemaText).toString('base64')},
   sources:context.entries.filter(e=>e.state==='file'&&e.relativePath!==candidatePath&&e.relativePath!==job.rubric.path).map(e=>({path:e.relativePath,digest:e.digest})),
   candidate:{path:candidatePath,digest:file(context,candidatePath).digest},rubric:job.rubric,producer}});
}
export function correctionSelectionTask(input){
 need(isNativeCorrectionInput(input),'exact correction input required');
 const prior=input.priorAssessment,job=input.job;
 return correctionReadTask(input,{outcome:'Independently select affected construction work or truthful owner re-entry from the admitted assessment.',
  resultContract:correctionSelectionContract,schemaText:CORRECTION_SELECTION_SCHEMA_TEXT,
  producer:{resultRef:prior.observationRef,resultDigest:prior.observationDigest,cCallRef:prior.provenance.cCallRef,actorInvocationRef:prior.provenance.actorInvocationRef},
  instructions:[
   'Read the complete selected source, candidate, plan and actual prior assessment. Determine semantic affectedness; filenames, author claims and caller write bounds are not certainty. Do not edit files or rerun commands.',
   'Select construction_repair only when requirements, design, source, rubric and oracle can remain unchanged. Otherwise return stage_revision_required or blocked with the reason. Unknown dependencies or inadequate territory require a stop.',
   'For construction repair cover every cause exactly once, with the smallest necessary existing candidate writePaths and actual quoted evidence. dependencyPaths must identify the complete read dependencies of the selected change; unaffected files remain exact. Empty or unsupported repair scope must block.',
   'Evidence labels are observed worksite paths or prior-assessment; quotes must be actual short substrings. Keep outside-assessment obligations explicit and do not relabel them satisfied. One correction attempt is permitted by this callable.',
   `Unchanged job: ${product.canonicalJson(job)}\nOwner write bounds: ${JSON.stringify(input.writeCandidates)}\nRequired causes: ${product.canonicalJson(correctionCauses(input))}`,
   `Actual prior-assessment:\n${product.canonicalJson(prior.assessment)}`,
   ...input.priorExecution.streams.map(streamEvidence).map(e=>`Prior admitted execution (${e.label}):\n${e.text}`),
  ]});
}
function isSelectionObservation(input,observation){try{
 return product.isNativeWorkspaceWorkObservation(observation)&&same(observation.task,correctionSelectionTask(input))&&
  product.nativeWorkspaceAssessmentMatchesContext(observation,input.currentContext)&&
  observation.provenance.actorInvocationRef!==input.priorAssessment.provenance.actorInvocationRef&&
  observation.provenance.actorInvocationRef!==input.priorAuthor.provenance.actorInvocationRef;
 }catch{return false;} }
export function correctionDecision(bound){
 need(correctionBound(bound,product.isNativeWorkspaceWorkObservation)&&isSelectionObservation(bound.entry,bound.source),'exact independent affectedness observation required');
 const input=bound.entry,selection=bound.source.assessment,causes=correctionCauses(input),context=input.currentContext;
 const diagnostics=[];
 if(!exact(selection,['kind','disposition','issues','dependencyPaths','reason'])||selection.kind!=='native_correction_selection'||
  !['construction_repair','stage_revision_required','blocked'].includes(selection.disposition)||!text(selection.reason)||
  !Array.isArray(selection.issues)||!Array.isArray(selection.dependencyPaths))diagnostics.push('malformed_selection');
 const bytes=new Map(context.entries.filter(e=>e.state==='file').map(e=>[e.relativePath,decode(e)]));
 bytes.set('prior-assessment',product.canonicalJson(input.priorAssessment.assessment));
 const issues=Array.isArray(selection?.issues)?selection.issues:[],paths=[];
 for(const issue of issues){
  if(!exact(issue,['causeRef','writePaths','reason','evidence'])||!text(issue.causeRef)||!text(issue.reason)||!unique(issue.writePaths)||
   !Array.isArray(issue.evidence)||issue.evidence.length===0||!issue.evidence.every(e=>exact(e,['path','quote'])&&text(e.quote)&&bytes.get(e.path)?.includes(e.quote))){diagnostics.push('unsupported_issue');continue;}
  paths.push(...issue.writePaths);
 }
 const writePaths=[...new Set(paths)].sort();
 if(selection?.disposition==='construction_repair'){
  if(issues.length!==causes.length||new Set(issues.map(i=>i.causeRef)).size!==causes.length||!causes.every(c=>issues.some(i=>i.causeRef===c.causeRef)))diagnostics.push('cause_coverage_mismatch');
  if(writePaths.length===0||writePaths.some(path=>!input.writeCandidates.includes(path)))diagnostics.push('write_scope_mismatch');
  if(!unique(selection.dependencyPaths)||selection.dependencyPaths.some(path=>!bytes.has(path)||path==='prior-assessment')||
   !writePaths.every(path=>selection.dependencyPaths.includes(path)))diagnostics.push('dependency_scope_mismatch');
 }
 return freeze({kind:'native_correction_decision',schemaVersion:VERSION,entry:input,selection:bound.source,
  disposition:diagnostics.length?'blocked':selection.disposition,writePaths:diagnostics.length?[]:writePaths,
  reason:diagnostics.length?diagnostics.join(','):selection.reason});
}
function isCorrectionDecision(value){try{return exact(value,['kind','schemaVersion','entry','selection','disposition','writePaths','reason'])&&
 same(value,correctionDecision(product.constructRetainedGraphInput(value.entry,value.selection)));}catch{return false;}}
export function correctionAuthorTask(decision){
 need(isCorrectionDecision(decision)&&decision.disposition==='construction_repair','admitted construction-only selection required');
 const input=decision.entry,job=input.job;
 return product.constructNativeWorkspaceWorkTask({...currentAuthority(input),context:input.currentContext,
  outcome:'Correct the selected construction defects while preserving governing meaning and unaffected work.',
  instructions:['Read the complete selected source, retained plan and actual candidate. Apply only this independent affectedness selection within the exact write scope. Preserve source, requirements/design, rubric, oracle and outside obligations.',
   'This is one bounded construction attempt. Do not execute the declared C2 commands; the next native owner runs them. Do not inspect evaluator-only oracle material, install dependencies or change runtime resources. Keep useful partial changes and report gaps if the correction cannot finish.',
   `Job: ${job.jobRef}\nClaim: ${job.claim}\nSelected sources: ${JSON.stringify(job.sourcePaths)}\nPlan basis: ${product.canonicalJson(job.planBasis)}`,
   `Actual selected causes: ${product.canonicalJson(correctionCauses(input))}\nIndependent affectedness: ${product.canonicalJson(decision.selection.assessment)}`],
  readFirst:[...new Set([...job.sourcePaths,...job.planBasis.map(b=>b.path),...job.candidatePaths])],writeRoots:decision.writePaths,checks:[]});
}
function isCorrectedAuthor(input,source){try{
 if(!product.isNativeWorkspaceWorkObservation(source)||source.task.assessment!==undefined||!same(source.before,input.currentContext)||
  !same(source.task.workspaceAuthorityBasis,input.workspaceAuthorityBasis)||!same(source.task.workspaceBinding,input.workspaceBinding)||
  !same(source.task.capabilityGrant,input.capabilityGrant)||!unique(source.task.writeRoots)||source.task.writeRoots.some(p=>!input.writeCandidates.includes(p)))return false;
 const preserved=input.currentContext.entries.filter(e=>!source.task.writeRoots.includes(e.relativePath));
 return preserved.every(e=>same(e,source.after.entries.find(a=>a.relativePath===e.relativePath)))&&
  source.provenance.actorInvocationRef!==input.priorAssessment.provenance.actorInvocationRef;
 }catch{return false;} }
export function correctionExecutionTask(bound){
 need(correctionBound(bound,product.isNativeWorkspaceWorkObservation)&&isCorrectedAuthor(bound.entry,bound.source),'new exact current native author observation required');
 const input=bound.entry,request=input.executionPlan;
 return product.constructNativeWorksiteCommandExecutionTask({...currentAuthority(input),sourceNativeWork:bound.source,
  selectedSources:request.selectedSources,commands:request.commands,outcomePredicates:request.outcomePredicates,allowedWriteTerritories:request.allowedWriteTerritories});
}
function isCorrectionExecution(bound){try{
 return correctionBound(bound,product.isNativeWorksiteCommandExecutionObservation)&&
  same(bound.source.task,correctionExecutionTask(product.constructRetainedGraphInput(bound.entry,bound.source.task.sourceNativeWork)));
 }catch{return false;} }
export function correctionAssessmentTask(bound){
 need(isCorrectionExecution(bound),'same corrected native source and new C2 observation required');
 const execution=bound.source,source=execution.task.sourceNativeWork;
 const task=buildAssessmentTask(bound.entry.job,execution.task,source.after,source,execution);
 return product.constructNativeWorkspaceWorkTask({...task,instructions:[...task.instructions,
  'Reassess every original mandatory criterion using the new candidate and new execution evidence. Resolve each prior selected residual with actual evidence or retain it as selected; the prior assessment is history, not new proof. Preserve every outside-assessment residual below verbatim; this construction-only correction grants no disposition of those obligations.',
  `Prior assessment and conserved outside obligations:\n${product.canonicalJson(bound.entry.priorAssessment.assessment)}`]});
}
export function interpretCorrectionAssessment(bound,observation){
 need(isCorrectionExecution(bound)&&product.isNativeWorkspaceWorkObservation(observation)&&same(observation.task,correctionAssessmentTask(bound)),
  'exact new C2/current assessment required');
 const result=interpretAssessment(bound.entry,bound.source,observation);
 return preservesOutside(bound.entry,observation)?result:freeze({...result,disposition:'unsatisfied',diagnostics:[...result.diagnostics,'outside_obligation_loss']});
}
const preservesOutside=(input,output)=>input.priorAssessment.assessment.residuals.filter(r=>r.scope==='outside-assessment').every(r=>output.assessment?.residuals?.some(row=>same(row,r)));
function correctionCompleted(input,output){try{
 if(!isNativeCorrectionInput(input)||!product.isNativeWorkspaceWorkObservation(output)||!output.task.assessment||
  !same(currentAuthority(input),currentAuthority(output.task))||!product.nativeWorkspaceAssessmentMatchesContext(output,output.after)||
  output.task.assessment.rubric.path!==input.job.rubric.path||output.task.assessment.rubric.digest!==input.job.rubric.digest||
  !preservesOutside(input,output))return false;
 const protectedPaths=new Set([...input.job.sourcePaths,...input.job.planBasis.map(p=>p.path),input.job.rubric.path,
  ...(input.job.oracle?.path?[input.job.oracle.path]:[])]);
 return [...protectedPaths].every(path=>same(file(input.currentContext,path),file(output.after,path)))&&
  rubric(input).criteria.filter(c=>c.mandatory).every(c=>output.assessment.criteria.filter(r=>r.criterionRef===c.criterionRef&&r.disposition==='satisfied').length===1)&&
  !output.assessment.residuals.some(r=>r.scope==='selected-assessment');
 }catch{return false;} }

const transforms=[input=>{need(isNativeContinuationInput(input),'exact continuation input required');return input.reacquisitionRequest;},assessmentTask];
const correctionTransforms=[correctionSelectionTask,correctionDecision,correctionAuthorTask,correctionExecutionTask,correctionAssessmentTask];
const descriptor=stage=>{const {kind,bindingRef,...value}=bindingFor(stage);return Object.freeze({kind:'packaged_leaf_implementation_descriptor',schemaVersion:VERSION,...value,descriptorDigest:product.sha256Canonical(value)});};
export const SELECT_DESCRIPTOR=descriptor(stages[0]), ASSESSMENT_DESCRIPTOR=descriptor(stages[1]);
const realize=(i,input)=>{const resultCandidate=transforms[i](input);return Object.freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,disposition:'success',resultCandidate,
 evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,implementationRef:stages[i].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const selectRequest=input=>realize(0,input);
export const prepareAssessment=input=>realize(1,input);
const realizeCorrection=(index,input)=>{const resultCandidate=correctionTransforms[index](input);return freeze({kind:'leaf_realization_candidate',schemaVersion:VERSION,disposition:'success',resultCandidate,
 evidenceCandidates:[{kind:'deterministic_evidence_candidate',schemaVersion:VERSION,implementationRef:correctionStages[index].implementationRef,inputDigest:product.sha256Canonical(input),outputDigest:product.sha256Canonical(resultCandidate)}]});};
export const CORRECTION_SELECTION_DESCRIPTOR=descriptor(correctionStages[0]);
export const CORRECTION_DECISION_DESCRIPTOR=descriptor(correctionStages[1]);
export const CORRECTION_AUTHOR_DESCRIPTOR=descriptor(correctionStages[2]);
export const CORRECTION_EXECUTION_DESCRIPTOR=descriptor(correctionStages[3]);
export const CORRECTION_ASSESSMENT_DESCRIPTOR=descriptor(correctionStages[4]);
export const prepareCorrectionSelection=input=>realizeCorrection(0,input);
export const selectCorrection=input=>realizeCorrection(1,input);
export const prepareCorrectionAuthor=input=>realizeCorrection(2,input);
export const prepareCorrectionExecution=input=>realizeCorrection(3,input);
export const prepareCorrectionAssessment=input=>realizeCorrection(4,input);
export function contractValuePredicate(kind) {
 return ({native_continuation_input:isNativeContinuationInput,native_correction_input:isNativeCorrectionInput,native_correction_decision:isCorrectionDecision,
  retained_graph_input:value=>isNativeContinuationBoundInput(value)||correctionBound(value,product.isNativeWorkspaceWorkObservation)||isCorrectionExecution(value),
  native_worksite_command_reacquisition_request:product.isNativeWorksiteCommandReacquisitionRequest,native_workspace_work_task:product.isNativeWorkspaceWorkTask,
  native_workspace_work_observation:product.isNativeWorkspaceWorkObservation,worksite_command_execution_task:product.isNativeWorksiteCommandExecutionTask,
  worksite_command_execution_observation:product.isNativeWorksiteCommandExecutionObservation})[kind]??null;
}
const relation=(predicateRef,evaluate)=>Object.freeze({predicateRef,advanceReasonRef:predicateRef+'/satisfied',rejectionReasonRef:predicateRef+'/refused',evaluate(input,output,currentOwnerPrefix,nativeProof){try{return evaluate(input,output,currentOwnerPrefix,nativeProof);}catch{return false;}}});
export const NATIVE_CONTINUATION_SEMANTICS=Object.freeze({kind:'product_semantics_provider',schemaVersion:VERSION,bindingRef:ids.semanticsBindingRef,packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,
 admitInput(contractRef,value){return (contractRef===ids.inputContractRef&&isNativeContinuationInput(value)||contractRef===correction.inputContractRef&&isNativeCorrectionInput(value))?freeze(value):null;},evaluateInteractionResponse(){return null;},
 validateContractValue(kind,value){return contractValuePredicate(kind)?.(value)??false;},
 resolveJudgmentRelation(predicateRef){
  const ci=correctionStages.findIndex(s=>s.predicateRef===predicateRef);
  if(ci>=0)return relation(predicateRef,(input,output,prefix,nativeProof)=>same(output,correctionTransforms[ci](input))&&
   (ci!==0||correctionCauseCurrent(input,prefix,nativeProof))&&(ci!==1||output.disposition==='construction_repair'));
  if(predicateRef===correction.wrapperPredicateRef)return relation(predicateRef,(input,output)=>interpretCorrectionAssessment(input,output).disposition==='satisfied');
  if(predicateRef===correction.stepPredicateRef)return relation(predicateRef,(input,output)=>
   product.isNativeWorkspaceWorkTask(input)&&product.isNativeWorkspaceWorkObservation(output)&&same(input,output.task)&&
    (input.assessment!==undefined||input.readFirst.every(path=>output.after.entries.some(e=>e.relativePath===path&&e.state==='file')))||
   product.isNativeWorksiteCommandExecutionTask(input)&&product.isNativeWorksiteCommandExecutionObservation(output)&&same(input,output.task)||
   isCorrectionExecution(input)&&interpretCorrectionAssessment(input,output).disposition==='satisfied');
  const index=stages.findIndex(s=>s.predicateRef===predicateRef);if(index>=0)return relation(predicateRef,(input,output)=>same(output,transforms[index](input)));
  if(predicateRef===ids.wrapperPredicateRef)return relation(predicateRef,(input,output)=>interpretExecutionAssessment(input,output).disposition==='satisfied');
  if(predicateRef===ids.wrapperStepPredicateRef)return relation(predicateRef,(input,output)=>product.isNativeWorkspaceWorkTask(input)&&product.isNativeWorkspaceWorkObservation(output)&&same(input,output.task));
  if(predicateRef===ids.stepPredicateRef)return relation(predicateRef,(input,output)=>
   product.isNativeWorksiteCommandReacquisitionRequest(input)&&product.isNativeWorksiteCommandExecutionTask(output)&&same(input,output.sourceReacquisition?.request)||
   product.isNativeWorksiteCommandExecutionTask(input)&&product.isNativeWorksiteCommandExecutionObservation(output)&&same(input,output.task)||
   isNativeContinuationBoundInput(input)&&interpretExecutionAssessment(input,output).disposition==='satisfied');
  if(predicateRef===ids.completionPredicateRef)return relation(predicateRef,(input,output)=>correctionCompleted(input,output)||isNativeContinuationInput(input)&&product.isNativeWorkspaceWorkObservation(output)&&output.task.assessment!==undefined&&
   same(input.reacquisitionRequest.workspaceAuthorityBasis,output.task.workspaceAuthorityBasis)&&same(input.reacquisitionRequest.workspaceBinding,output.task.workspaceBinding)&&
   same(input.reacquisitionRequest.capabilityGrant,output.task.capabilityGrant)&&same(input.reacquisitionRequest.currentContext,output.task.context)&&
   output.task.assessment.rubric.path===input.job.rubric.path&&output.task.assessment.rubric.digest===input.job.rubric.digest&&
   product.nativeWorkspaceAssessmentMatchesContext(output,output.after)&&
   rubric(input).criteria.filter(c=>c.mandatory).every(c=>output.assessment.criteria.filter(r=>r.criterionRef===c.criterionRef&&r.disposition==='satisfied').length===1)&&
   !output.assessment.residuals.some(r=>r.scope==='selected-assessment'));
  return null;
 }});
