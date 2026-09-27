// Pure successor declaration. The saved selection is checked by R10 at ingress;
// it never substitutes for the owning historical/currentness judgments.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {caseBasis as predecessorBasis} from '../pc05-02/candidate.mjs';
import {evaluatorPublication} from '../../../../../build_tenants/odd_glc/typescript/test/fixtures/program-construction/native-records-evaluator.mjs';
import {constructProgramConstructionLibrary,constructLifecycleProgram,selectLifecycleWork} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction.mjs';
import {constructPreservedConstructionInput} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-runtime.mjs';
import {ids} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-contracts.mjs';
const D=import.meta.dirname,read=async p=>JSON.parse(await readFile(p,'utf8'));
export async function caseBasis() {
  const base=await predecessorBasis(),prior=await read(join(D,'../pc05-04/source-freeze.json'));
  const roles=base.configuration.runEnvironment.roles.filter(r=>r.role==='assessor');assert.equal(roles.length,1);
  const core=await read(join(resolve(D,'../../../../../..'),'abiogenesis/.ai-workspace/comments/codex/20260928_DECLARATION_RESOURCE/core-05/selected-core.json'));
  return {...base,core,configuration:{...base.configuration,transport:prior.transport,
    runEnvironment:{...base.configuration.runEnvironment,declarationRef:'environment://odd-glc/T-043/pc05-preserved-construction@5',roles}}};
}
export async function constructCase({product,gtl,artifact,runEnvironment,authority,currentContext}) {
  const selected=await read(join(D,'preserved-source.json'));
  const {originalInput,constructionState,historicalSelection,sourceSelection}=selected;
  const evaluator=evaluatorPublication({gtl,artifact}),graph=evaluator.graphFunctions[0];
  const fitJudgment={ref:'interpretation://odd-glc/T-043/pc05-preserved-construction/residual-aware-evaluation',
    digest:product.sha256Canonical({originalFit:originalInput.evaluator.fitJudgment,
      sourceRefs:originalInput.model.sourceRefs,evaluator:graph.name,
      rule:'Evaluate the original declared dependency relations; preserve author reports as judgment evidence. An author-reported residual does not mechanically falsify every structural edge. Preserve all source-required checks and independent assessment.'})};
  const input=constructPreservedConstructionInput({originalInput,constructionState,historicalSelection,sourceSelection,
    authority:authority??originalInput.authority,currentContext:currentContext??constructionState.currentContext,
    evaluator:{...originalInput.evaluator,graphFunction:{ref:graph.name,digest:product.sha256Canonical(graph)},fitJudgment}});
  const {model,selectedDutyRefs,constructionGroups}=originalInput;
  const basis={executionObservation:originalInput.origin.observation,construction:originalInput.origin.construction,
    execution:originalInput.origin.execution,sourceRefs:originalInput.origin.sourceRefs,
    currentContext:input.currentContext,evaluations:[]};
  const selection=selectLifecycleWork({product,model,basis,selectedDutyRefs});
  assert.equal(selection.disposition,'candidate',JSON.stringify(selection.gaps));
  const library=constructProgramConstructionLibrary({gtl,product,artifact,includeNativeConstruction:true,
    evaluationGraph:graph,includeAssessment:true,includePreservedConstruction:true});
  const route={roles:[...new Set(selection.work.map(d=>d.role))],fitJudgment,
    obligationRefs:[...new Set(selection.work.map(d=>d.obligationRef))],permittedEffects:[product.NATIVE_WORKSPACE_WORK_IDS.effectUri],
    publications:[library,gtl.constructWorksiteCommandExecutionModulePublication(artifact),
      gtl.constructNativeWorkspaceWorkModulePublication(artifact),evaluator],
    graphFunctionRefs:[ids.preservedAuthenticateGraphFunctionRef,product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,
      ids.prepareConstructedEvaluationGraphFunctionRef,ids.evaluationChildGraphFunctionRef,
      ids.prepareAssessmentInputGraphFunctionRef,ids.assessmentChildGraphFunctionRef],retainEntryAfter:[1,3]};
  const candidate=constructLifecycleProgram({gtl,product,artifact,runEnvironment,model,basis,selectedDutyRefs,
    constructionGroups,preservedConstruction:true,routes:[route]});
  assert.equal(candidate.kind,'candidate',JSON.stringify(candidate.gaps));
  const members=candidate.publication.programs[0].callableMembership;
  assert(members.includes(product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
  assert(!members.includes(product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef),'no new constructor');
  assert(!members.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef),'no command execution');
  assert.deepEqual(input.originalInput,originalInput);assert.deepEqual(input.constructionState,constructionState);
  return {fixture:{input},candidate,evaluatorPublication:evaluator,originalGrant:constructionGroups[0].writeRoots};
}
