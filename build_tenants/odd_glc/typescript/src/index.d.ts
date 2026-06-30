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
    readonly snapshotCommit: string;
    readonly tarballSha256: string;
  };
  readonly publicSurfaces: {
    readonly gtlRequirements: "./gtl/requirements";
    readonly abgRequirements: "./abg/requirements";
    readonly abgExecutive?: string;
  };
  readonly proofArtifacts: Readonly<Record<string, {
    readonly sourceProduct: "abiogenesis";
    readonly sourceTicket: string;
    readonly sourceRunId: string;
    readonly fixturePath: string;
    readonly fixtureManifestPath: string;
	    readonly artifactSha256: string;
	    readonly sourceRunKind?: string;
	    readonly proofClass?: string;
	    readonly closureReadiness?: string;
	    readonly replacedByTicket?: string;
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

export interface LifecycleSurfaceMap {
  readonly kind: "odd_glc_lifecycle_surface_map";
  readonly surfaces: Readonly<Record<string, string>>;
}

export interface PolicyOverlay {
  readonly kind: "odd_glc_policy_overlay";
  readonly id: string;
  readonly fp: Readonly<Record<string, unknown>>;
  readonly fh: Readonly<Record<string, unknown>>;
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
  readonly surfaceMap: LifecycleSurfaceMap | null;
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

export declare const REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS: readonly string[];
export declare const FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES: readonly string[];
export declare const REQUIRED_ROUTE_ONE_SURFACES: readonly string[];
export declare const REQUIRED_EVIDENCE_EVENT_KINDS: readonly string[];
export declare const ABIOGENESIS_SUBSTRATE_PROVENANCE: AbiogenesisSubstrateProvenance;

export declare function validateAbgRequirementsFacade(
  facade: unknown
): OddGlcResult<{
  readonly kind: "abg_requirements_query_facade";
  readonly availableFunctions: readonly string[];
}>;

export declare function defineLifecycleSurfaceMap(input: {
  readonly surfaces: Readonly<Record<string, string>>;
}): OddGlcResult<LifecycleSurfaceMap>;

export declare function definePolicyOverlay(input: {
  readonly id: string;
  readonly fp?: Readonly<Record<string, unknown>>;
  readonly fh?: Readonly<Record<string, unknown>>;
}): OddGlcResult<PolicyOverlay>;

export declare function interpretLifecycleState(input: {
  readonly abgRequirements: AbgRequirementsQueryFacade;
  readonly query: unknown;
  readonly dispositionRefs: readonly unknown[];
  readonly replayFacts?: readonly unknown[];
  readonly runtimeEvents?: readonly unknown[];
  readonly surfaceMap?: LifecycleSurfaceMap;
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

export declare function interpretAssuranceState(input: {
  readonly runtimeEvents?: readonly unknown[];
}): OddGlcResult<OddGlcAssuranceStateView>;
