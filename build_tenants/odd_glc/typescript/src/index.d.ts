export type OddGlcResult<T> =
  | {
      readonly status: "accepted";
      readonly value: T;
      readonly diagnostics: readonly string[];
      readonly sourceRefs: readonly string[];
    }
  | {
      readonly status: "rejected";
      readonly reason:
        | "malformed_input"
        | "missing_public_query"
        | "forbidden_authority"
        | "abg_query_rejected";
      readonly diagnostics: readonly string[];
      readonly sourceRefs: readonly string[];
    };

export interface AbgRequirementsQueryFacade {
  readonly projectLifecycleState: (input: unknown) => unknown;
  readonly compileEdgeRequirementEnvironment?: unknown;
  readonly routeContextConstraint?: unknown;
  readonly projectEdgeObligations?: unknown;
  readonly projectMaterializationTargets?: unknown;
  readonly projectExecutionSchedules?: unknown;
  readonly projectAssuranceCase?: unknown;
  readonly classifyAttenuation?: unknown;
}

export interface AbiogenesisSubstrateProvenance {
  readonly kind: "odd_glc_consumed_substrate_provenance";
  readonly schemaVersion: "1";
  readonly consumerTenant: "build_tenants/odd_glc/typescript";
  readonly substrate: {
    readonly productId: "abiogenesis";
    readonly packageName: "@abiogenesis/typescript-tenant";
    readonly packageVersion: string;
    readonly releaseTag: string;
    readonly sourceCommit: string;
    readonly snapshotCommit: string;
    readonly tarballSha256: string;
    readonly productToolchainManifestDigest: string;
    readonly releaseSnapshotManifestSha256?: string;
  };
  readonly publicSurfaces: {
    readonly gtlRequirements: "./gtl/requirements";
    readonly abgRequirements: "./abg/requirements";
    readonly abgExecutive?: string;
  };
  readonly proofArtifacts: Readonly<Record<string, {
    readonly sourceProduct: "abiogenesis";
    readonly sourceCapability?: string;
    readonly sourceRunId: string;
    readonly proofArtifactPath: string;
    readonly proofManifestPath: string;
    readonly artifactSha256: string;
    readonly sourceRunKind?: string;
    readonly proofClass?: string;
    readonly closureReadiness?: string;
    readonly replacedByCapability?: string;
    readonly supersedesCapability?: string;
    readonly routeEventCount?: number;
    readonly pressureEventCount?: number;
    readonly replayEventCount: number;
  }>>;
  readonly proofScope: {
    readonly phase: string;
    readonly claim: string;
  };
  readonly sourceDocuments: readonly string[];
}

export interface PolicyOverlay {
  readonly kind: "odd_glc_policy_overlay";
  readonly id: string;
  readonly fp: Readonly<Record<string, unknown>>;
  readonly fh: Readonly<Record<string, unknown>>;
}

export interface OddGlcLifecycleNodeTypeEntry {
  readonly typeRef: string;
  readonly nodeName: string;
  readonly surface: string;
  readonly schemaRef: string;
  readonly assetKind: string;
  readonly baseTypeRefs?: readonly string[];
  readonly overlayRefs?: readonly string[];
  readonly markov: readonly string[];
  readonly tags: readonly string[];
}

export interface OddGlcComposedLifecycleNodeTypeEntry {
  readonly typeRef: string;
  readonly nodeName: string;
  readonly constituentTypeRefs: readonly string[];
  readonly surface: string;
  readonly overlayRefs?: readonly string[];
  readonly overlayMeaning: string;
}

export interface OddGlcGraphFunctionBindingEntry {
  readonly entryRef: string;
  readonly graphFunctionRef: string;
  readonly interfaceRef: string;
  readonly sourceContractRef: string;
  readonly targetContractRef: string;
  readonly overlayRefs: readonly string[];
  readonly policyRefs: readonly string[];
  readonly readinessRefs: readonly string[];
  readonly proofRefs: readonly string[];
  readonly catalogReuseStatus?: "abg_4_2_no_equivalent_published";
  readonly genericity?: "candidate_abg_system_function" | "product_specific_specialization";
  readonly reuseGate?: "bind_existing_abg_catalog_entry_when_equivalent_exists";
}

export interface OddGlcSoftwareBuildStagePlanEntry {
  readonly stage: string;
  readonly vectorId: string;
  readonly sourceTypeRef: string;
  readonly sourceName: string;
  readonly targetTypeRef: string;
  readonly targetName: string;
  readonly requiredNodeTypes: readonly string[];
  readonly executeBeforeAssessment?: boolean;
}

export interface OddGlcSoftwareBuildOverlay {
  readonly kind: "odd_glc_software_build_overlay_graph";
  readonly schemaVersion: "1";
  readonly overlayRef: string;
  readonly graphRef: string;
  readonly ownerRef: "product://odd_glc";
  readonly scope: "reusable_software_build_lifecycle";
  readonly rule: "gtl_overlay_graph_declaration_over_gtl_abg_truth";
  readonly graphFunctionRefs: readonly string[];
  readonly graphVectorRefs: readonly string[];
  readonly publicStartTargets: readonly string[];
  readonly defaultStartTarget: string;
  readonly roleRefs: readonly string[];
  readonly policyRefs: readonly string[];
  readonly pluginRefs: readonly string[];
  readonly forbiddenAuthority: readonly string[];
}

export interface OddGlcLifecycleProgramOverlay {
  readonly kind: "odd_glc_lifecycle_program_overlay_graph";
  readonly schemaVersion: "1";
  readonly overlayRef: string;
  readonly graphRef: string;
  readonly ownerRef: "product://odd_glc";
  readonly scope: "generic_lifecycle_interpretation";
  readonly rule: "gtl_overlay_graph_declaration_over_gtl_abg_truth";
  readonly graphFunctionRefs: readonly string[];
  readonly roleRefs: readonly string[];
  readonly policyRefs: readonly string[];
  readonly pluginRefs: readonly string[];
  readonly forbiddenAuthority: readonly string[];
}

export interface OddGlcSoftwareBuildStartupBinding {
  readonly kind: "odd_glc_software_build_startup_binding";
  readonly schemaVersion: "1";
  readonly configRef: string;
  readonly productNamespace: "odd_glc";
  readonly ownerRef: "product://odd_glc";
  readonly version: string;
  readonly overlayRefs: readonly string[];
  readonly pluginRefs: readonly string[];
  readonly readinessRefs: readonly string[];
  readonly proofRefs: readonly string[];
  readonly policyRefs: readonly string[];
  readonly configSourceRefs: readonly string[];
  readonly entryRefs: readonly string[];
  readonly declarationRefs: readonly string[];
  readonly enabledLibraryRefs: readonly string[];
}

export interface OddGlcHelloWorldBootstrapNodeTypeBindingEntry {
  readonly entryRef: string;
  readonly declarationRef: string;
  readonly typeRef: string;
  readonly interfaceRef: string;
  readonly sourceContractRef: string;
  readonly targetContractRef: string;
  readonly overlayRefs: readonly string[];
}

export interface OddGlcHelloWorldBootstrapGraphFunctionBindingEntry {
  readonly entryRef: string;
  readonly declarationRef: string;
  readonly graphFunctionName: string;
  readonly interfaceRef: string;
  readonly sourceContractRef: string;
  readonly targetContractRef: string;
  readonly overlayRefs: readonly string[];
}

export interface OddGlcHelloWorldBootstrapStartupBinding {
  readonly kind: "odd_glc_hello_world_bootstrap_startup_binding";
  readonly schemaVersion: "1";
  readonly configRef: string;
  readonly productNamespace: "odd_glc";
  readonly ownerRef: string;
  readonly overlayRefs: readonly string[];
  readonly pluginRefs: readonly string[];
  readonly readinessRefs: readonly string[];
  readonly proofRefs: readonly string[];
  readonly policyRefs: readonly string[];
  readonly configSourceRefs: readonly string[];
  readonly entryRefs: readonly string[];
  readonly declarationRefs: readonly string[];
}

export interface OddGlcStartupBinding {
  readonly kind: "odd_glc_startup_binding";
  readonly schemaVersion: "1";
  readonly configRef: string;
  readonly productNamespace: "odd_glc";
  readonly ownerRef: "product://odd_glc";
  readonly version: string;
  readonly enabledLibraryRefs: readonly string[];
  readonly overlayRefs: readonly string[];
  readonly pluginRefs: readonly string[];
  readonly readinessRefs: readonly string[];
  readonly proofRefs: readonly string[];
  readonly policyRefs: readonly string[];
  readonly configSourceRefs: readonly string[];
}

export interface OddGlcLifecycleStateView {
  readonly kind: "odd_glc_lifecycle_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly lifecycleDisposition:
    | "no_disposition"
    | "release_readiness_candidate"
    | "continuation_available"
    | "reentry_available"
    | "blocked";
  readonly requirementIds: readonly string[];
  readonly dispositionRefs: readonly string[];
  readonly sourceEventRefs: readonly string[];
  readonly sourceProjectionRefs: readonly string[];
  readonly interpretedDispositions: readonly unknown[];
  readonly policyOverlayId: string | null;
  readonly abgReadModel: unknown;
}

export interface OddGlcEvidenceStateView {
  readonly kind: "odd_glc_evidence_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly evidenceDisposition:
    | "no_evidence"
    | "bound_without_runtime_evidence"
    | "admitted_unbound"
    | "admitted_and_bound"
    | "admitted_bound_and_executed";
  readonly targetArtifactRefs: readonly string[];
  readonly capabilityRefs: readonly string[];
  readonly actorInvocations: readonly unknown[];
  readonly admittedEvidence: readonly unknown[];
  readonly requirementEvidenceBindings: readonly unknown[];
  readonly sourceEventRefs: readonly string[];
  readonly runtimeEventCount: number;
}

export interface OddGlcAssuranceStateView {
  readonly kind: "odd_glc_assurance_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly assuranceDisposition:
    | "no_assurance"
    | "assurance_satisfied"
    | "assurance_partial"
    | "assurance_failed"
    | "assurance_blocked"
    | "residual_pressure";
  readonly foldRefs: readonly string[];
  readonly foldStates: readonly string[];
  readonly residualRefs: readonly string[];
  readonly dispositionRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly sourceAbgTruthRefs: readonly string[];
  readonly folds: readonly unknown[];
  readonly residuals: readonly unknown[];
  readonly dispositions: readonly unknown[];
  readonly sourceEventRefs: readonly string[];
  readonly runtimeEventCount: number;
}

export interface OddGlcParallelFrontierStateView {
  readonly kind: "odd_glc_parallel_frontier_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly readiness:
    | "no_frontier_truth"
    | "frontier_started"
    | "branch_payloads_admitted"
    | "fan_in_ready";
  readonly branchRefs: readonly string[];
  readonly acquiredBranchRefs: readonly string[];
  readonly releasedBranchRefs: readonly string[];
  readonly branchPayloads: readonly unknown[];
  readonly fanIns: readonly unknown[];
  readonly fanInRefs: readonly string[];
  readonly payloadDigests: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly aggregateStates: readonly unknown[];
  readonly requirementGraph: unknown;
  readonly sourceEventRefs: readonly string[];
}

export interface OddGlcRequirementGraphStateView {
  readonly kind: "odd_glc_requirement_graph_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly graphDisposition:
    | "no_requirement_graph"
    | "requirement_graph_projected"
    | "aggregate_residual_pressure"
    | "aggregate_satisfied";
  readonly graphRef: string | null;
  readonly requirementIds: readonly string[];
  readonly rootRequirementIds: readonly string[];
  readonly leafRequirementIds: readonly string[];
  readonly relationRefs: readonly string[];
  readonly parentChildPairs: readonly unknown[];
  readonly aggregateStates: readonly unknown[];
  readonly residualRefs: readonly string[];
  readonly terms: readonly unknown[];
  readonly relations: readonly unknown[];
  readonly sourceRefs: readonly string[];
  readonly sourceEventRefs: readonly string[];
  readonly abgRequirementGraph: unknown;
}

export interface OddGlcRecursiveSpanStateView {
  readonly kind: "odd_glc_recursive_span_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly readiness:
    | "no_span_lineage_truth"
    | "single_frame_span_projected"
    | "span_lineage_projected"
    | "recursive_span_ready";
  readonly spanLineageRefs: readonly string[];
  readonly spanIds: readonly string[];
  readonly frameRefs: readonly string[];
  readonly zoomRefs: readonly string[];
  readonly foldbackRefs: readonly string[];
  readonly aliasRefs: readonly string[];
  readonly graphVectorRefs: readonly string[];
  readonly graphSpanEventKinds: readonly string[];
  readonly runtimeSpanEventKinds: readonly string[];
  readonly lineage: readonly unknown[];
  readonly graphSpanReplay: readonly unknown[];
  readonly runtimeSpanEvents: readonly unknown[];
  readonly sourceEventRefs: readonly string[];
}

export interface OddGlcExecutivePressureStateView {
  readonly kind: "odd_glc_executive_pressure_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly pressureDisposition:
    | "no_pressure"
    | "pressure_observed"
    | "local_repair_available"
    | "reprice_required"
    | "blocked"
    | "close_candidate";
  readonly pressureFactRefs: readonly string[];
  readonly observationRefs: readonly string[];
  readonly requirementIds: readonly string[];
  readonly residualPressureRefs: readonly string[];
  readonly continuationRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly diagnosticRefs: readonly string[];
  readonly spanRefs: readonly string[];
  readonly dispositions: readonly string[];
  readonly closeDispositions: readonly string[];
  readonly attenuation: readonly string[];
  readonly pressureFacts: readonly unknown[];
  readonly sourceEventRefs: readonly string[];
}

export interface OddGlcReleaseReadinessStateView {
  readonly kind: "odd_glc_release_readiness_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly readiness:
    | "ready_candidate"
    | "not_ready_residual"
    | "blocked"
    | "not_ready";
  readonly lifecycleDisposition: string;
  readonly assuranceDisposition: string;
  readonly evidenceDisposition: string;
  readonly residualRefs: readonly string[];
  readonly dispositionRefs: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly releaseAuthority: "not_claimed";
  readonly sourceEventRefs: readonly string[];
}

export interface OddGlcStartupRegistryStateView {
  readonly kind: "odd_glc_startup_registry_state_view";
  readonly tenant: "build_tenants/odd_glc/typescript";
  readonly readiness:
    | "no_startup_truth"
    | "registry_admitted"
    | "graph_function_selected"
    | "traversal_converged";
  readonly registryEntryCount: number;
  readonly nodeTypeEntryRefs: readonly string[];
  readonly graphFunctionEntryRefs: readonly string[];
  readonly selectionRefs: readonly string[];
  readonly selectedEntryKinds: readonly string[];
  readonly selectedGraphFunctionRefs: readonly string[];
  readonly graphCallIds: readonly string[];
  readonly vectorClosedRefs: readonly string[];
  readonly stdoutValues: readonly string[];
  readonly eventKinds: readonly string[];
  readonly sourceEventRefs: readonly string[];
  readonly abgStartOutput: unknown;
}

export declare const REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS: readonly string[];
export declare const FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES: readonly string[];
export declare const REQUIRED_GTL_NODE_TYPE_FACADE_FUNCTIONS: readonly string[];
export declare const REQUIRED_GTL_REGISTRY_DECLARATION_FUNCTIONS: readonly string[];
export declare const REQUIRED_GTL_DECLARATION_FACADE_SLOTS: Readonly<Record<string, readonly string[]>>;
export declare const FORBIDDEN_ABG_STARTUP_AUTHORITIES: readonly string[];
export declare const ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY_REF: string;
export declare const ODD_GLC_SOFTWARE_BUILD_OVERLAY_REF: string;
export declare const ODD_GLC_FP_SEMANTIC_POLICY_REF: string;
export declare const ODD_GLC_FH_HUMAN_DECISION_POLICY_REF: string;
export declare const REQUIRED_ROUTE_ONE_SURFACES: readonly string[];
export declare const ODD_GLC_LIFECYCLE_NODE_TYPES: readonly OddGlcLifecycleNodeTypeEntry[];
export declare const ODD_GLC_SOFTWARE_BUILD_NODE_TYPES: readonly OddGlcLifecycleNodeTypeEntry[];
export declare const ODD_GLC_DATA_MAPPING_NODE_TYPES: readonly OddGlcLifecycleNodeTypeEntry[];
export declare const ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES: readonly OddGlcComposedLifecycleNodeTypeEntry[];
export declare const ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES: readonly OddGlcComposedLifecycleNodeTypeEntry[];
export declare const ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS: readonly string[];
export declare const ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF: string;
export declare const ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_GRAPH_FUNCTION_REF: string;
export declare const ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN: readonly OddGlcSoftwareBuildStagePlanEntry[];
export declare const ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN: readonly OddGlcSoftwareBuildStagePlanEntry[];
export declare const ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS: readonly OddGlcHelloWorldBootstrapNodeTypeBindingEntry[];
export declare const ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS: readonly OddGlcHelloWorldBootstrapGraphFunctionBindingEntry[];
export declare const ODD_GLC_HELLO_WORLD_BOOTSTRAP_STARTUP_BINDING: OddGlcHelloWorldBootstrapStartupBinding;
export declare const ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS: readonly OddGlcGraphFunctionBindingEntry[];
export declare const ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY: OddGlcLifecycleProgramOverlay;
export declare const ODD_GLC_SOFTWARE_BUILD_OVERLAY: OddGlcSoftwareBuildOverlay;
export declare const ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS: readonly OddGlcGraphFunctionBindingEntry[];
export declare const ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING: OddGlcSoftwareBuildStartupBinding;
export declare const ODD_GLC_STARTUP_BINDING: OddGlcStartupBinding;
export declare const REQUIRED_EVIDENCE_EVENT_KINDS: readonly string[];
export declare const ABIOGENESIS_SUBSTRATE_PROVENANCE: AbiogenesisSubstrateProvenance;

export declare function validateAbgRequirementsFacade(
  facade: unknown
): OddGlcResult<{
  readonly kind: "abg_requirements_query_facade";
  readonly availableFunctions: readonly string[];
}>;

export declare function definePolicyOverlay(input: {
  readonly id: string;
  readonly fp?: Readonly<Record<string, unknown>>;
  readonly fh?: Readonly<Record<string, unknown>>;
}): OddGlcResult<PolicyOverlay>;

export declare function validateGtlAbg42DeclarationFacades(input: {
  readonly gtlM01Contracts?: Readonly<Record<string, unknown>>;
  readonly gtlM01Algebra?: Readonly<Record<string, unknown>>;
  readonly gtlM02Contracts?: Readonly<Record<string, unknown>>;
}): OddGlcResult<{
  readonly kind: "gtl_abg42_declaration_facades";
  readonly availableFunctions: readonly string[];
}>;

export declare function defineLifecycleNodeTypeDeclarations(input: {
  readonly gtlM01Contracts: Readonly<Record<string, unknown>>;
  readonly gtlM01Algebra: Readonly<Record<string, unknown>>;
  readonly gtlM02Contracts: Readonly<Record<string, unknown>>;
}): OddGlcResult<{
  readonly kind: "odd_glc_lifecycle_node_type_declarations";
  readonly nodeTypeEntries: readonly OddGlcLifecycleNodeTypeEntry[];
  readonly softwareBuildNodeTypeEntries: readonly OddGlcLifecycleNodeTypeEntry[];
  readonly dataMappingNodeTypeEntries: readonly OddGlcLifecycleNodeTypeEntry[];
  readonly allNodeTypeEntries: readonly OddGlcLifecycleNodeTypeEntry[];
  readonly composedNodeTypeEntries: readonly OddGlcComposedLifecycleNodeTypeEntry[];
  readonly dataMappingComposedNodeTypeEntries: readonly OddGlcComposedLifecycleNodeTypeEntry[];
  readonly allComposedNodeTypeEntries: readonly OddGlcComposedLifecycleNodeTypeEntry[];
  readonly nodes: readonly unknown[];
  readonly graphFunctions: readonly unknown[];
  readonly compositionResults: readonly unknown[];
  readonly libraryEntries: readonly unknown[];
}>;

export declare function defineOddGlcStartupBinding(input: {
  readonly gtlM01Contracts: Readonly<Record<string, unknown>>;
  readonly gtlM01Algebra: Readonly<Record<string, unknown>>;
  readonly gtlM02Contracts: Readonly<Record<string, unknown>>;
}): OddGlcResult<{
  readonly kind: "odd_glc_startup_declaration_binding";
  readonly startupConfig: unknown;
  readonly libraryEntries: readonly unknown[];
  readonly pluginAdvice: unknown;
  readonly overlayRefs: readonly string[];
}>;

export declare function interpretLifecycleState(input: {
  readonly abgRequirements: AbgRequirementsQueryFacade;
  readonly query: unknown;
  readonly dispositionRefs: readonly unknown[];
  readonly replayFacts?: readonly unknown[];
  readonly runtimeEvents?: readonly unknown[];
  readonly policyOverlay?: PolicyOverlay;
}): OddGlcResult<OddGlcLifecycleStateView>;

export declare function interpretEvidenceState(input: {
  readonly runtimeEvents?: readonly unknown[];
}): OddGlcResult<OddGlcEvidenceStateView>;

export declare function interpretParallelFrontierState(input: {
  readonly runtimeEvents?: readonly unknown[];
  readonly lifecycleState?: unknown;
}): OddGlcResult<OddGlcParallelFrontierStateView>;

export declare function interpretRequirementGraphState(input: {
  readonly lifecycleState?: unknown;
  readonly runtimeEvents?: readonly unknown[];
}): OddGlcResult<OddGlcRequirementGraphStateView>;

export declare function interpretRecursiveSpanState(input: {
  readonly lifecycleState?: unknown;
  readonly runtimeEvents?: readonly unknown[];
}): OddGlcResult<OddGlcRecursiveSpanStateView>;

export declare function interpretExecutivePressureState(input: {
  readonly runtimeEvents?: readonly unknown[];
  readonly pressureEvents?: readonly unknown[];
}): OddGlcResult<OddGlcExecutivePressureStateView>;

export declare function interpretReleaseReadinessState(input: {
  readonly lifecycleStateView?: unknown;
  readonly assuranceStateView?: unknown;
  readonly evidenceStateView?: unknown;
}): OddGlcResult<OddGlcReleaseReadinessStateView>;

export declare function interpretStartupRegistryState(input: {
  readonly proof?: unknown;
  readonly runtimeEvents?: readonly unknown[];
  readonly liveArtifacts?: readonly unknown[];
}): OddGlcResult<OddGlcStartupRegistryStateView>;

export declare function interpretAssuranceState(input: {
  readonly runtimeEvents?: readonly unknown[];
}): OddGlcResult<OddGlcAssuranceStateView>;
