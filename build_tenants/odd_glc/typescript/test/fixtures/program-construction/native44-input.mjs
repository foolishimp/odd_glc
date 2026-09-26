import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,join} from 'node:path';
import * as product from '@abiogenesis/typescript-tenant/product';
import {projectNativeSource,constructProgramConstructionLibrary,constructLifecycleProgram} from '../../../src/program-construction.mjs';
import {ids} from '../../../src/program-construction-contracts.mjs';
import {fixtureIds,evaluatorPublication} from './native-records-evaluator.mjs';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'../../../../../..');
const abi=resolve(repo,'../abiogenesis');
export const retainedPaths={
  coordinates:join(repo,'.ai-workspace/comments/codex/20260926_SCENARIO_CLOSURE/consumer-continuation-01/retained-coordinates.json'),
  terminal:join(abi,'.ai-workspace/comments/codex/20260926_CALCULUS_CROSSCUT/native44/suffix-01/suffix-terminal-value.json'),
  readback:join(abi,'.ai-workspace/comments/codex/20260926_CALCULUS_CROSSCUT/native44/suffix-01/read-run_result.json'),
};
/** Fixture source selection, never a special runtime entry or dispatch route. */
export async function constructNative44Candidate({gtl,artifact,runEnvironment,...bindings}) {
 const evaluator=evaluatorPublication({gtl,artifact}),fixture=await loadNative44Fixture({...bindings,evaluatorGraph:evaluator.graphFunctions[0]});
 const input=fixture.input,library=constructProgramConstructionLibrary({gtl,product,artifact});
 const route={roles:['evaluate'],fitJudgment:input.evaluator.fitJudgment,
  obligationRefs:input.model.duties.filter(d=>d.role==='evaluate').map(d=>d.obligationRef),permittedEffects:[],
  publications:[library,gtl.constructWorksiteCommandExecutionModulePublication(artifact),evaluator],
  graphFunctionRefs:[ids.authenticateGraphFunctionRef,product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,ids.prepareGraphFunctionRef,fixtureIds.graphFunctionRef],retainEntryAfter:[1]};
 const candidate=constructLifecycleProgram({gtl,product,artifact,runEnvironment,model:input.model,selectedDutyRefs:input.selectedDutyRefs,routes:[route],
  basis:{executionObservation:input.origin.observation,construction:input.origin.construction,execution:input.origin.execution,
   sourceRefs:input.origin.sourceRefs,currentContext:input.currentContext,evaluations:[]}});
 return {candidate,fixture,evaluatorPublication:evaluator};
}
export async function loadNative44Fixture({evaluatorGraph,sourceSelection,authority,currentContext}={}) {
  const bytes=await fs.readFile(retainedPaths.terminal);
  if(product.sha256Bytes(bytes)!=='sha256:c60f7662f4ed6371e55289dbbb4efd951afe722d15e80f9280741e710e7cf348')throw Error('retained terminal bytes changed');
  const terminalValue=JSON.parse(bytes),read=JSON.parse(await fs.readFile(retainedPaths.readback,'utf8')),
    coordinates=JSON.parse(await fs.readFile(retainedPaths.coordinates,'utf8'));
  const terminal=read.receipt.ownerOutput.value.projection.terminalResult;
  const {value,projectionBasis,...historicalSelection}=terminal;
  if(product.sha256Canonical(terminalValue)!==terminal.valueDigest)throw Error('retained public value digest mismatch');
  const origin=projectNativeSource(product,terminalValue), context=currentContext??terminalValue.current.context;
  const bindings=terminalValue.current.bindingVersions, dependencies=origin.observation.snapshotMembers.map(m=>({path:m.relativePath,digest:m.digest}));
  const authorityBasis=authority??{workspaceAuthorityBasis:terminalValue.revisionBasis.request.nativeWorksite.workspaceAuthorityBasis,
    workspaceBinding:terminalValue.revisionBasis.request.nativeWorksite.workspaceBinding,
    capabilityGrant:terminalValue.revisionBasis.request.nativeWorksite.capabilityGrant};
  // The fallback selectors below are structural component premises, never launch resources.
  const selectedSource=sourceSelection??{prefix:coordinates.native44.prefix,graphCallRef:'graph-call://component/unadmitted-native44-constructor',
    declarationProof:{kind:'abg_historical_declaration_proof',schemaVersion:'5.0.0',catalog:{},catalogView:{}}};
  const contractBytes=await fs.readFile(new URL('./evaluator-contract.md',import.meta.url));
  const interpretation={ref:'interpretation://odd-glc/qualification/native44-bindings10-11',digest:product.sha256Bytes(contractBytes)};
  const scope=bindings.filter((_,i)=>i===10||i===11);
  const common=(ref,role,binding,requires)=>({ref,role,obligationRef:binding.binding.obligationRef,bindingRef:binding.versionRef,
    requires,scopeRefs:[binding.binding.proofPolicyRef,binding.binding.proofShapeRef],applicability:{value:'true',basisRefs:[binding.binding.proofPolicyRef]},dependencies});
  const artifactDuty=scope[0].binding.obligationRef+'/retained-artifact',executionDuty=scope[0].binding.obligationRef+'/retained-execution';
  const duties=[common(artifactDuty,'construct',scope[0],[]),common(executionDuty,'execute',scope[0],[artifactDuty]),
    ...scope.map(b=>common(b.binding.obligationRef+'/computed-records','evaluate',b,[executionDuty]))];
  const observed=path=>{const file=context.entries.find(e=>e.relativePath===path&&e.state==='file');if(!file)throw Error('fixture file missing: '+path);return {path,digest:file.digest};};
  const parameters={plan:observed('test-execution-plan.json'),plannedCommandId:'planned-verifier-run',relativeCwd:'.',
    commandResolution:{planCommand:'node',executable:coordinates.plannedCommand.executable},
    suites:[{...observed('test/component/hello.test.mjs'),role:'component',title:"component: helloWorld() returns exactly 'Hello, world!'"},
      {...observed('test/uat/hello.uat.test.mjs'),role:'uat',title:"uat: the user-visible greeting contract is exactly 'Hello, world!'"}]};
  const model={taskRef:origin.taskRef,sourceRefs:origin.sourceRefs,bindingRefs:origin.bindingRefs,interpretation,duties};
  return {terminalValue,terminal,coordinates,componentPremises:sourceSelection===undefined,
    input:{kind:'lifecycle_construction_input',schemaVersion:'5.0.0',model,origin,historicalSelection,
      sourceSelection:selectedSource,authority:authorityBasis,currentContext:context,
      selectedDutyRefs:duties.filter(d=>d.role==='evaluate').map(d=>d.ref),evaluator:{
        graphFunction:{ref:fixtureIds.graphFunctionRef,digest:product.sha256Canonical(evaluatorGraph??{})},
        resultContractRef:fixtureIds.outputContractRef,fitJudgment:interpretation,parameters}}};
}
