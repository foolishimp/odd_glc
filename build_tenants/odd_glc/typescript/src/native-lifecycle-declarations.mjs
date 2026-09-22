// Generic declaration data only. No fixture imports, I/O, prompts or runtime.
// Opt-in bounded asset-work policy; the existing lifecycle route is unchanged.
export { NATIVE_INTENT_ASSET_POLICY, constructNativeIntentWorkDeclaration,
  constructNativeIntentReviewDeclaration } from "./native-intent-declarations.mjs";
const exactlyOne = (rows, label) => {
  if (rows.length !== 1) throw new TypeError(`requires one ${label}`);
  return rows[0];
};
const stageRef = name => `stage://odd-glc/generic-lifecycle/${name}@5`;
const graphRef = name => `graph-function://odd-glc/generic-lifecycle/${name}@5`;
const commonRubric = [
  ["source-faithfulness", "Compare every material statement with the complete source and admitted predecessors. Cite exact source quotations; expose lost or weakened meaning."],
  ["modality-and-conflicts", "Preserve normative, supporting, speculative and conflicting meanings, unresolved pressure and owner rulings."],
  ["obligation-conservation", "Conserve source-grounded requirements and paired realization/proof obligations. A name, count or model assertion is not evidence."],
  ["bounded-claim", "Assess this stage only. Distinguish construction readiness, observed behavior and remaining application obligations; do not infer release or full application closure."],
];

export function constructNativeLifecycleDeclaration({ gtl, product, ids }) {
  const native = gtl.SEMANTIC_STAGE_IDS;
  const rows = [
    { name: "intent", kind: "IntentAsset", predecessors: [], capabilities: [], content: [
      "Derive the requested outcome, users, constraints, ambiguities and source roles from the entire ordinary job. Do not invent solved requirements or implementation facts." ] },
    { name: "product", kind: "ProductDefinitionAsset", predecessors: ["intent"], capabilities: [], content: [
      "Define the application-subject behavior and boundary from the source and assessed Intent. This is not a new builder Product, Program or runtime." ] },
    { name: "requirements", kind: "RequirementSetAsset", predecessors: ["intent", "product"], capabilities: ["requirement_refinement"], content: [
      "Derive all material requirements with exact source quotations and meaningful requirement candidates. Instantiate the allowed proof templates as paired realization/proof binding candidates; do not assume receipt of input makes requirements ready.",
      "Preserve unresolved and unimplemented obligations. Every selected behavior needs meaningful realization, verifier-artifact, verifier-execution and independent semantic-assessment pressure." ] },
    { name: "design", kind: "DestinationTopologyAsset", predecessors: ["intent", "product", "requirements"], capabilities: ["worksite_design"], content: [
      "Design from the admitted actual context, active assessed bindings and complete prior assets. Choose necessary relative artifact paths, roles, dependencies, commands and outcome predicates within the explicit owner bounds.",
      "Preserve existing valid work; create no assumed layout or fabricated observations. Distinguish missing dependencies from future execution proof. Bind every target to active obligation and binding-version coordinates.",
      "Include governing, design, verifier and execution-plan artifacts when the source requires them. Tests must exercise the actual constructed application. Native execution supplies results; no prewritten success report is evidence." ] },
    { name: "evidence", kind: "EvidenceBindingAsset", predecessors: ["intent", "product", "requirements", "design"], capabilities: ["application_assessment"], content: [
      "Compare exact admitted construction artifacts and native command/predicate observations with the independent evaluation criteria and complete governing source. Do not run tools or invent missing evidence.",
      "Keep realization, verifier artifact, verifier execution and semantic assessment distinct. Report supported behavior and residual obligations; application coverage remains non-closing." ] },
  ];
  return gtl.constructSemanticJobLifecycleDeclaration({
    kind: "semantic_job_lifecycle_declaration", schemaVersion: "5.0.0", declarationRef: ids.lifecycleDeclarationRef,
    intakeGraphFunctionRef: graphRef("intake"), sourceRoleRef: native.jobSourceContextRoleRef,
    bounds: { maxSourceMembers: 32, maxSourceBytes: 1048576, maxContextFiles: 1024, maxContextBytes: 4194304, maxTargets: 64, maxCommands: 32 },
    proofTemplates: [{ templateRef: "proof-template://odd-glc/generic-lifecycle/behavior@5",
      realizationContractRef: product.WORKSITE_CONSTRUCTION_IDS.resultContractRef,
      proofContractRef: product.WORKSITE_COMMAND_EXECUTION_IDS.observationContractRef,
      requiredEvidenceRoles: ["realization", "verifier_artifact", "verifier_execution", "semantic_assessment"],
      sharedBasis: ["complete_source", "requirement_and_obligation", "current_worksite", "admitted_result"],
      requiredContent: ["Actual source-grounded artifacts and observed behavior for the same current obligation; unsupported, stale or missing evidence remains an explicit gap."] }],
    stages: rows.map(row => ({ declarationRef: stageRef(row.name), graphFunctionRef: graphRef(row.name),
      authorLocusRef: `locus://odd-glc/generic-lifecycle/${row.name}/author@5`, assessorLocusRef: `locus://odd-glc/generic-lifecycle/${row.name}/assessor@5`,
      predecessorStageRefs: row.predecessors.map(stageRef),
      assetSurface: { kind: row.kind, requiredContexts: [native.jobSourceContextRoleRef],
        standardsRefs: ["specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md", "specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md"],
        outputContractRefs: [native.workerContractRef], constructorRef: native.constructorRef, rendererRef: native.rendererRef,
        proofObligationRefs: [], authoritySlots: [{ authorityKindRef: "authority://odd-glc/owner-scope-ruling", disposition: "normal", fallbackPreconditionRefs: [] }] },
      purpose: `Derive and independently assess ${row.kind} from full source and admitted predecessor meaning.`, requiredContent: row.content,
      rubric: [...commonRubric, ...(row.name === "design" ? [["executable-proof", "Check necessary artifact and actual-command coverage against source and active bindings, with complete known context and explicit authority. No caller-authored target plan is supplied."]] : []),
        ...(row.name === "evidence" ? [["independent-oracle", "Compare all evaluation cases against actual same-job admitted observations and artifact bodies; disclose absent probes and wrong identities rather than accepting counts."]] : [])]
        .map(([name, instruction]) => ({ criterionRef: `criterion://odd-glc/generic-lifecycle/${row.name}/${name}@5`, instruction })),
      bodyCapabilities: row.capabilities,
      assembly: { ruleRef: `assembly://odd-glc/generic-lifecycle/${row.name}@5`, graphFunctionRef: graphRef(row.name),
        sectionOrder: ["role", "source", "obligations", "predecessors", "worksite", "evidence", "task", "response"],
        contentPolicy: "role_scoped_worksite", worksiteContentByRole: { author: row.name === "design" ? "current_inventory" : "not_required", assessor: row.name === "design" ? "current_inventory" : "not_required" },
        proportionalityPolicy: "declared_semantic_assessment", maxPromptBytes: 1048576 },
    })),
  });
}

/** The caller supplies the unchanged generic C1/C2 declaration, never a job. */
export function constructNativeLifecyclePublication({ gtl, product, ids, semanticPublication, c1Publication, c2Publication, worksite, runEnvironment }) {
  const environment = runEnvironment === undefined ? undefined : gtl.constructRunEnvironmentDeclaration(structuredClone(runEnvironment));
  const native = gtl.SEMANTIC_STAGE_IDS, parents = gtl.WORKSITE_FILE_PARENTS_IDS;
  const lifecycle = constructNativeLifecycleDeclaration({ gtl, product, ids });
  const closures = [];
  const close = (name, predicateRef, resultContractRef, closureScope = "graph_call") => {
    const closureContractRef = name === "root" ? ids.closureContractRef : `contract://odd-glc/generic-lifecycle/${name}/closure@5`;
    closures.push(gtl.constructSemanticClosureContract({ closureContractRef, predicateRef, resultContractRef, closureScope }));
    return closureContractRef;
  };
  const stages = lifecycle.stages.map(stage => gtl.constructSemanticStageGraphFunction(stage,
    close(stage.declarationRef.split("/").at(-1).replace("@5", ""), native.assessorPredicateRef, native.envelopeContractRef)));
  const jobGraph = (name, operation, predicate, output) => gtl.constructSemanticJobGraphFunction({ graphFunctionRef: graphRef(name),
    nodeRef: `node://odd-glc/generic-lifecycle/${name}@5`, lifecycleRef: lifecycle.declarationRef, operation,
    closureContractRef: close(name, predicate, output) });
  const intake = jobGraph("intake", "intake", native.jobIntakePredicateRef, native.envelopeContractRef);
  const context = jobGraph("context", "context", native.jobContextPredicateRef, native.envelopeContractRef);
  const plan = jobGraph("worksite-plan", "worksite_plan", native.jobPlanPredicateRef, parents.inputContractRef);
  const bridge = jobGraph("worksite-bridge", "worksite_bridge", native.jobBridgePredicateRef, product.WORKSITE_PREPARATION_IDS.inputContractRef);
  const parentGraph = exactlyOne(c1Publication.graphFunctions.filter(graph => graph.name === parents.graphFunctionRef), "native file-parent graph");
  const evidenceInput = gtl.constructSemanticBridgeGraphFunction({ graphFunctionRef: graphRef("evidence-input"),
    nodeRef: "node://odd-glc/generic-lifecycle/evidence-input@5", operation: "evidence_input",
    closureContractRef: close("evidence-input", native.evidenceInputPredicateRef, native.envelopeContractRef) });
  const terminal = gtl.constructSemanticBridgeGraphFunction({ graphFunctionRef: graphRef("envelope-output"),
    nodeRef: "node://odd-glc/generic-lifecycle/envelope-output@5", operation: "envelope_output",
    closureContractRef: close("envelope-output", native.terminalPredicateRef, native.outputContractRef) });
  const chain = [intake, stages[0], stages[1], stages[2], context, stages[3], plan, parentGraph, bridge, worksite.graphFunction, evidenceInput, stages[4], terminal];
  const nodes = chain.map((graph, ordinal) => ({ nodeRef: `node://odd-glc/generic-lifecycle/step-${ordinal}@5`, nodeKind: "c_locus",
    term: gtl.workflow.C(gtl.cGraphFunctionRef({ graphFunctionRef: graph.name, input: gtl.cCarrier(graph.inputs[0]), output: gtl.cCarrier(graph.outputs[0]) })) }));
  const rootClose = close("root", native.lifecyclePredicateRef, native.outputContractRef, "run");
  const carriers = [...new Set(chain.flatMap(graph => [...graph.inputs, ...graph.outputs]))];
  const root = { kind: "graph_function", name: ids.graphFunctionRef, version: "5.0.0",
    environment: { requires: [native.jobInputContractRef], provides: carriers, carries: carriers }, inputs: [native.jobInputContractRef], outputs: [native.outputContractRef],
    template: { kind: "inline_graph", graphRef: ids.graphRef, startNodeRef: nodes[0].nodeRef, terminalNodeRefs: [nodes.at(-1).nodeRef], nodes,
      edges: nodes.slice(1).map((node, index) => gtl.graphEdge({ fromNodeRef: nodes[index].nodeRef, toNodeRef: node.nodeRef })), applications: [] },
    effects: [...new Set(chain.flatMap(graph => graph.effects))],
    declarations: { "abg.compute_regime": "mixed", "abg.closure_contract": rootClose,
      "abg.evidence_contract": native.evidenceContractRef, "abg.judgment_contract": native.judgmentContractRef,
      "abg.judgment_predicate": native.lifecycleStepPredicateRef, "abg.transition_contract": native.transitionContractRef },
    tags: ["odd-glc", "generic-lifecycle", "non-closing-application-coverage"] };
  const graphFunctions = [...stages, intake, context, plan, bridge, worksite.graphFunction, evidenceInput, terminal, root];
  const program = { kind: "gtl_program", programRef: ids.programRef, version: "5.0.0", moduleRef: ids.moduleRef,
    starts: [{ startRef: ids.startRef, graphFunctionRef: ids.graphFunctionRef }],
    callableMembership: [...new Set([...graphFunctions.map(graph => graph.name), parents.graphFunctionRef, ...worksite.callableMembership])], closureContractRef: rootClose,
    policies: { "abg.root_mode": "direct", "abg.compute_regime": "mixed", "abg.default_start_ref": ids.startRef, "abg.semantic_lifecycle": lifecycle.declarationRef,
      ...(environment === undefined ? {} : { [gtl.RUN_ENVIRONMENT_POLICY]: environment.declarationRef }) } };
  const semanticContract = exactlyOne(semanticPublication.contracts.filter(row => row.contractRef === native.closureContractRef), "semantic closure contract");
  const worksiteContract = exactlyOne(c2Publication.contracts.filter(row => row.contractRef === product.WORKSITE_COMMAND_EXECUTION_IDS.closureContractRef), "C2 closure contract");
  const placeholder = `sha256:${"0".repeat(64)}`;
  return gtl.modulePublication({ kind: "module_publication", moduleVersion: "5.0.0", moduleRef: ids.moduleRef, owningProductId: ids.productId,
    descriptorRef: ids.descriptorRef, contributionManifestRef: ids.contributionManifestRef,
    artifactDigest: placeholder, productContentDigest: placeholder, productManifestDigest: placeholder,
    productSemanticsBinding: structuredClone(semanticPublication.productSemanticsBinding), semanticJobLifecycle: lifecycle,
    ...(environment === undefined ? {} : { runEnvironments: [environment] }),
    contracts: [...closures.map(closure => ({ ...semanticContract, contractRef: closure.closureContractRef })), { ...worksiteContract, contractRef: worksite.closure.closureContractRef }],
    closureContracts: [...closures, worksite.closure], implementationBindings: [], evaluators: [], rules: [], graphFunctions, programs: [program],
    contributions: graphFunctions.map(graph => ({ handle: graph.name, kind: "graph_function", declarationOrContractRef: graph.name, owningProductId: ids.productId,
      programMembershipRefs: [ids.programRef], readinessPrerequisiteRefs: [ids.programRef], compatibilityRefs: ["compatibility://abiogenesis/major/5"], provenanceRefs: [placeholder, placeholder] })) });
}

/** Native family discovery supplies identity; odd_glc supplies role policy data.
 * Exact source selections are configuration, never ordinary job/evaluation data.
 */
export function constructNativeLifecycleEnvironmentRoles({ gtl, product, publication, nativePublications,
  sourceSelections, accessRefs, sourceBasisRef }) {
  const program = exactlyOne(publication.programs, "generic lifecycle Program");
  const functions = [...publication.graphFunctions, ...nativePublications.flatMap(row => row.graphFunctions)]
    .filter(graph => program.callableMembership.includes(graph.name));
  const graphNames = functions.map(graph => graph.name);
  if (new Set(graphNames).size !== graphNames.length) throw new TypeError("ambiguous native graph closure");
  const actors = functions.flatMap(graph => graph.template.nodes.flatMap(node => gtl.cLeafTerms(node.term)
    .filter(leaf => leaf.fibre === "F_P").map(leaf => ({ graph, leaf, role: gtl.nativeContextLeafFamily(graph, leaf) }))));
  const rows = actors.map(({ graph, leaf, role }) => {
    if (role === null) throw new TypeError("unsupported native context leaf " + leaf.programLocusRef);
    const stage = publication.semanticJobLifecycle.stages.find(row => row.graphFunctionRef === graph.name);
    const task = stage === undefined ? role === "constructor" ? "construction" : role === "command_executor" ? "execution" : null
      : stage.declarationRef.split("/").at(-1).replace("@5", "");
    if (task === null || sourceSelections[task] === undefined) throw new TypeError("missing declared source selection for native task");
    const posture = role === "assessor" ? "reviewer" : "worker";
    const selectors = stage === undefined ? role === "constructor"
      ? ["full_source", "declared_predecessor_semantics", "active_binding_semantics", "current_worksite"]
      : ["current_worksite", "admitted_execution_evidence"]
      : ["full_source", "declared_predecessor_semantics", "active_binding_semantics",
        ...(role === "assessor" ? ["current_candidate"] : []),
        ...(task === "design" ? ["current_worksite"] : []),
        ...(task === "evidence" ? ["admitted_execution_evidence", ...(role === "assessor" ? ["assessor_evaluation_data"] : [])] : [])];
    const text = `Apply the supplied exact ${posture} frame and ${task} source spans to the native ${role} contract. ` +
      "The native task and field domains fix this bounded outcome. Context access is evidence, not authority; retain source roles and unresolved obligations. " +
      (role === "constructor" ? "Return replacement bytes only; the native C0 owner performs application writes."
        : role === "command_executor" ? "Execute only the admitted command task inside the native worker_executes turn and return actual observations."
          : "Return through the declared closed native response contract; use no actor-side filesystem fallback.");
    return { graphFunctionRef: graph.name, programLocusRef: leaf.programLocusRef, role,
      frameRefs: [sourceBasisRef + "standards/STDO_REFERENCE_FRAME_BASELINE.md#derived-" + posture + "-frame"],
      policy: { policyRef: `policy://odd-glc/generic-lifecycle/${task}/${role}/context@5`, text,
        digest: product.sha256Bytes(Buffer.from(text)) }, accessRefs: [...accessRefs],
      sourceBindings: [...sourceSelections.common, ...sourceSelections[posture], ...sourceSelections[task]],
      contextPolicy: { policyRef: `policy://odd-glc/generic-lifecycle/${task}/${role}/selection@5`, selectors } };
  });
  if (rows.length !== 12 || rows.filter(row => row.role === "author").length !== 5 ||
    rows.filter(row => row.role === "assessor").length !== 5 || rows.filter(row => row.role === "constructor").length !== 1 ||
    rows.filter(row => row.role === "command_executor").length !== 1) throw new TypeError("expected the existing twelve native F_P lifecycle loci");
  return rows;
}

// Bounded observed-source continuation; the historical lifecycle API remains separate.
export { constructNativeContinuationPublication, constructNativeContinuationEnvironmentRoles } from "./native-continuation-declarations.mjs";
