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
  };
  readonly proofScope: {
    readonly phase: "phase_4_route_one_interpretation";
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

export declare const REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS: readonly string[];
export declare const FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES: readonly string[];
export declare const REQUIRED_ROUTE_ONE_SURFACES: readonly string[];
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
