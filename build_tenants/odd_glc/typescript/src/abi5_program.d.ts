import type {
  ProductInvocationSourceResultBasis,
  ProductSemanticsProvider
} from "@abiogenesis/typescript-tenant/product";
import type {
  ModulePublication,
  RootModuleArtifactBasis
} from "@abiogenesis/typescript-tenant/gtl";

export interface OddGlcAbi5PackageIdentity {
  readonly productId: "product://odd_glc/route-one-typescript@0.2.0-candidate";
  readonly packageName: "@odd-glc/route-one-typescript";
  readonly packageVersion: "0.2.0-candidate";
  readonly modulePath: "build/code/src/abi5_program.mjs";
}

export interface OddGlcAbi5ProgramIds {
  readonly programRef: "program://odd_glc/general-lifecycle@5";
  readonly sourceProgramRef: "program://odd_glc/general-lifecycle/fresh-source@5";
  readonly moduleRef: "module://odd_glc/general-lifecycle@5";
  readonly closureContractRef: "contract://odd_glc/general-lifecycle/closure@5";
  readonly childClosureContractRef: "contract://odd_glc/general-lifecycle/interpret-closure@5";
  readonly sourceClosureContractRef: "contract://odd_glc/general-lifecycle/fresh-source-closure@5";
  readonly inputContractRef: "contract://odd_glc/general-lifecycle/context@5";
  readonly outputContractRef: "contract://odd_glc/general-lifecycle/state@5";
  readonly sourceInputContractRef: "contract://odd_glc/general-lifecycle/fresh-source-request@5";
  readonly sourceOutputContractRef: "contract://odd_glc/general-lifecycle/fresh-source-result@5";
  readonly transitionContractRef: "contract://odd_glc/general-lifecycle/transition@5";
  readonly evidenceContractRef: "contract://odd_glc/general-lifecycle/evidence@5";
  readonly leafEvidenceContractRef: "contract://odd_glc/general-lifecycle/leaf-evidence@5";
  readonly failureContractRef: "contract://odd_glc/general-lifecycle/failure@5";
  readonly refusalContractRef: "contract://odd_glc/general-lifecycle/refusal@5";
  readonly judgmentContractRef: "contract://odd_glc/general-lifecycle/judgment@5";
  readonly judgmentPredicateRef: "predicate://odd_glc/general-lifecycle/projection-is-readable@5";
  readonly sourceJudgmentPredicateRef: "predicate://odd_glc/general-lifecycle/fresh-source-identities-preserved@5";
  readonly productSemanticsBindingRef: "product-semantics://odd_glc/general-lifecycle@5";
  readonly implementationBindingRef: "implementation-binding://odd_glc/general-lifecycle/interpret@5";
  readonly implementationRef: "implementation://odd_glc/general-lifecycle/interpret@5";
  readonly sourceImplementationBindingRef: "implementation-binding://odd_glc/general-lifecycle/fresh-source@5";
  readonly sourceImplementationRef: "implementation://odd_glc/general-lifecycle/fresh-source@5";
  readonly locusRef: "locus://odd_glc/general-lifecycle/interpret@5";
  readonly armId: "arm://odd_glc/general-lifecycle/interpret/fd@5";
  readonly startRef: "start://odd_glc/general-lifecycle@5";
  readonly sourceStartRef: "start://odd_glc/general-lifecycle/fresh-source@5";
  readonly graphFunctionRef: "graph-function://odd_glc/general-lifecycle@5";
  readonly sourceGraphFunctionRef: "graph-function://odd_glc/general-lifecycle/fresh-source@5";
  readonly interpretationGraphFunctionRef: "graph-function://odd_glc/general-lifecycle/interpret@5";
  readonly graphRef: "graph://odd_glc/general-lifecycle@5";
  readonly nodeRef: "node://odd_glc/general-lifecycle/interpret@5";
  readonly interpretationGraphRef: "graph://odd_glc/general-lifecycle/interpret@5";
  readonly interpretationNodeRef: "node://odd_glc/general-lifecycle/interpret-leaf@5";
  readonly sourceGraphRef: "graph://odd_glc/general-lifecycle/fresh-source@5";
  readonly sourceNodeRef: "node://odd_glc/general-lifecycle/fresh-source@5";
  readonly sourceLocusRef: "locus://odd_glc/general-lifecycle/fresh-source@5";
  readonly sourceArmId: "arm://odd_glc/general-lifecycle/fresh-source/fd@5";
}

export type OddGlcAbi5LifecycleContext = ProductInvocationSourceResultBasis;

export interface OddGlcAbi5FreshSourceRequest {
  readonly kind: "odd_glc_fresh_source_request";
  readonly schemaVersion: "5.0.0";
  readonly workspaceId: string;
  readonly workspaceBindingId: string;
  readonly workspaceBindingDigest: `sha256:${string}`;
}

export interface OddGlcAbi5FreshSourceResult {
  readonly kind: "odd_glc_fresh_source_result";
  readonly schemaVersion: "5.0.0";
  readonly workspaceId: string;
  readonly workspaceBindingId: string;
  readonly workspaceBindingDigest: `sha256:${string}`;
}

export type OddGlcAbi5LifecycleInputRefusalCode =
  | "basis_identity_mismatch"
  | "empty_ref"
  | "malformed_carrier"
  | "malformed_digest"
  | "malformed_source_value"
  | "source_value_digest_mismatch"
  | "wrong_contract"
  | "wrong_kind"
  | "wrong_version";

export interface OddGlcAbi5LifecycleInputRefusal {
  readonly kind: "odd_glc_lifecycle_interpretation_refusal";
  readonly schemaVersion: "5.0.0";
  readonly disposition: "refused";
  readonly code: OddGlcAbi5LifecycleInputRefusalCode;
  readonly message: string;
}

export interface OddGlcAbi5LifecycleInputEvaluation {
  readonly kind: "odd_glc_lifecycle_input_evaluation";
  readonly schemaVersion: "5.0.0";
  readonly disposition: "accepted";
  readonly input: Readonly<OddGlcAbi5LifecycleContext | OddGlcAbi5FreshSourceRequest>;
}

export interface OddGlcAbi5LifecycleState {
  readonly kind: "odd_glc_lifecycle_state";
  readonly schemaVersion: "5.0.0";
  readonly lifecycleDisposition: "no_disposition";
  readonly sourceBasisRef: string;
  readonly sourceBasisDigest: `sha256:${string}`;
  readonly publicAuthorityDigest: `sha256:${string}`;
  readonly sourceRunId: string;
  readonly sourceGraphCallId: string;
  readonly sourceGraphFunctionRef: string;
  readonly sourceCCallRef: string;
  readonly sourceInvocationAdmissionRef: string;
  readonly sourceInvocationRef: string;
  readonly sourceResultAdmissionEventRef: string;
  readonly sourceResultJudgmentEventRef: string;
  readonly sourceResultRef: string;
  readonly sourceResultDigest: `sha256:${string}`;
  readonly sourceResultValueDigest: `sha256:${string}`;
  readonly sourceResultContractRef: string;
  readonly sourceReplayRef: string;
  readonly sourceReplayDigest: `sha256:${string}`;
  readonly sourceWorkspaceId: string;
  readonly workspaceBindingId: string;
  readonly workspaceBindingDigest: `sha256:${string}`;
}

export interface OddGlcAbi5DeterministicEvidenceCandidate {
  readonly kind: "deterministic_evidence_candidate";
  readonly schemaVersion: "5.0.0";
  readonly implementationRef:
    | OddGlcAbi5ProgramIds["implementationRef"]
    | OddGlcAbi5ProgramIds["sourceImplementationRef"];
  readonly inputDigest: `sha256:${string}`;
  readonly outputDigest: `sha256:${string}`;
}

export interface OddGlcAbi5LeafRealizationCandidate {
  readonly kind: "leaf_realization_candidate";
  readonly schemaVersion: "5.0.0";
  readonly disposition: "success";
  readonly evidenceCandidates: readonly [Readonly<OddGlcAbi5DeterministicEvidenceCandidate>];
  readonly resultCandidate: Readonly<OddGlcAbi5LifecycleState>;
}

export interface OddGlcAbi5FreshSourceRealizationCandidate {
  readonly kind: "leaf_realization_candidate";
  readonly schemaVersion: "5.0.0";
  readonly disposition: "success";
  readonly evidenceCandidates: readonly [Readonly<OddGlcAbi5DeterministicEvidenceCandidate>];
  readonly resultCandidate: Readonly<OddGlcAbi5FreshSourceResult>;
}

export interface OddGlcAbi5ProgramDeclaration {
  readonly kind: "gtl_program";
  readonly programRef: OddGlcAbi5ProgramIds["programRef"];
  readonly version: "5.0.0";
  readonly moduleRef: OddGlcAbi5ProgramIds["moduleRef"];
  readonly starts: readonly [{
    readonly startRef: OddGlcAbi5ProgramIds["startRef"];
    readonly graphFunctionRef: OddGlcAbi5ProgramIds["graphFunctionRef"];
  }];
  readonly callableMembership: readonly [
    OddGlcAbi5ProgramIds["graphFunctionRef"],
    OddGlcAbi5ProgramIds["interpretationGraphFunctionRef"]
  ];
  readonly closureContractRef: OddGlcAbi5ProgramIds["closureContractRef"];
  readonly policies: Readonly<Record<string, string>>;
}

export interface OddGlcAbi5SourceProgramDeclaration {
  readonly kind: "gtl_program";
  readonly programRef: OddGlcAbi5ProgramIds["sourceProgramRef"];
  readonly version: "5.0.0";
  readonly moduleRef: OddGlcAbi5ProgramIds["moduleRef"];
  readonly starts: readonly [{
    readonly startRef: OddGlcAbi5ProgramIds["sourceStartRef"];
    readonly graphFunctionRef: OddGlcAbi5ProgramIds["sourceGraphFunctionRef"];
  }];
  readonly callableMembership: readonly [OddGlcAbi5ProgramIds["sourceGraphFunctionRef"]];
  readonly closureContractRef: OddGlcAbi5ProgramIds["sourceClosureContractRef"];
  readonly policies: Readonly<Record<string, string>>;
}

export interface OddGlcAbi5AuthorityBoundary {
  readonly kind: "odd_glc_abi5_authority_boundary";
  readonly schemaVersion: "1";
  readonly declares: readonly string[];
  readonly consumes: readonly string[];
  readonly prohibits: readonly string[];
}

export interface OddGlcAbi5ContractDeclaration {
  readonly contractRef: string;
  readonly contractVersion: "5.0.0";
  readonly contractKind:
    | "closure"
    | "evidence"
    | "failure"
    | "input"
    | "judgment"
    | "output"
    | "refusal"
    | "transition";
  readonly valueKind: string;
}

interface OddGlcAbi5ClosureContractBasis {
  readonly kind: "closure_contract";
  readonly predicateRef: string;
  readonly evidenceContractRef:
    | OddGlcAbi5ProgramIds["evidenceContractRef"]
    | OddGlcAbi5ProgramIds["leafEvidenceContractRef"];
  readonly resultContractRef:
    | OddGlcAbi5ProgramIds["outputContractRef"]
    | OddGlcAbi5ProgramIds["sourceOutputContractRef"];
  readonly refusalContractRef: OddGlcAbi5ProgramIds["refusalContractRef"];
  readonly refusalValueKind: "odd_glc_lifecycle_interpretation_refusal";
  readonly judgmentContractRef: OddGlcAbi5ProgramIds["judgmentContractRef"];
  readonly rejectionContractRef: OddGlcAbi5ProgramIds["refusalContractRef"];
  readonly transitionContractRef: OddGlcAbi5ProgramIds["transitionContractRef"];
  readonly replayProjectionRef: string;
  readonly terminalKind: "completed";
}

export interface OddGlcAbi5ClosureContract extends OddGlcAbi5ClosureContractBasis {
  readonly closureContractRef: OddGlcAbi5ProgramIds["closureContractRef"];
  readonly closureScope: "run";
  readonly eventKindRefs: readonly [
    "terminal_reached",
    "frame_closed",
    "graph_call_closed",
    "run_closed"
  ];
}

export interface OddGlcAbi5ChildClosureContract extends OddGlcAbi5ClosureContractBasis {
  readonly closureContractRef: OddGlcAbi5ProgramIds["childClosureContractRef"];
  readonly closureScope: "graph_call";
  readonly eventKindRefs: readonly [
    "terminal_reached",
    "frame_closed",
    "graph_call_closed"
  ];
}

export interface OddGlcAbi5SourceClosureContract extends OddGlcAbi5ClosureContractBasis {
  readonly closureContractRef: OddGlcAbi5ProgramIds["sourceClosureContractRef"];
  readonly closureScope: "run";
  readonly eventKindRefs: readonly [
    "terminal_reached",
    "frame_closed",
    "graph_call_closed",
    "run_closed"
  ];
}

export interface OddGlcAbi5ImplementationBinding {
  readonly kind: "implementation_binding";
  readonly bindingRef: OddGlcAbi5ProgramIds["implementationBindingRef"];
  readonly implementationRef: OddGlcAbi5ProgramIds["implementationRef"];
  readonly packageName: "@odd-glc/route-one-typescript";
  readonly packageVersion: "0.2.0-candidate";
  readonly modulePath: "build/code/src/abi5_program.mjs";
  readonly namedSymbol: "interpretAbi5LifecycleProjection";
  readonly computeRegime: "F_D";
  readonly inputContractRef: OddGlcAbi5ProgramIds["inputContractRef"];
  readonly outputContractRef: OddGlcAbi5ProgramIds["outputContractRef"];
  readonly failureContractRef: OddGlcAbi5ProgramIds["failureContractRef"];
  readonly refusalContractRef: OddGlcAbi5ProgramIds["refusalContractRef"];
}

export interface OddGlcAbi5SourceImplementationBinding {
  readonly kind: "implementation_binding";
  readonly bindingRef: OddGlcAbi5ProgramIds["sourceImplementationBindingRef"];
  readonly implementationRef: OddGlcAbi5ProgramIds["sourceImplementationRef"];
  readonly packageName: "@odd-glc/route-one-typescript";
  readonly packageVersion: "0.2.0-candidate";
  readonly modulePath: "build/code/src/abi5_program.mjs";
  readonly namedSymbol: "realizeOddGlcAbi5FreshSource";
  readonly computeRegime: "F_D";
  readonly inputContractRef: OddGlcAbi5ProgramIds["sourceInputContractRef"];
  readonly outputContractRef: OddGlcAbi5ProgramIds["sourceOutputContractRef"];
  readonly failureContractRef: OddGlcAbi5ProgramIds["failureContractRef"];
  readonly refusalContractRef: OddGlcAbi5ProgramIds["refusalContractRef"];
}

export interface OddGlcAbi5ImplementationDescriptor
  extends Omit<OddGlcAbi5ImplementationBinding, "bindingRef" | "kind"> {
  readonly kind: "packaged_leaf_implementation_descriptor";
  readonly schemaVersion: "5.0.0";
  readonly descriptorDigest: `sha256:${string}`;
}

export interface OddGlcAbi5SourceImplementationDescriptor
  extends Omit<OddGlcAbi5SourceImplementationBinding, "bindingRef" | "kind"> {
  readonly kind: "packaged_leaf_implementation_descriptor";
  readonly schemaVersion: "5.0.0";
  readonly descriptorDigest: `sha256:${string}`;
}

export interface OddGlcAbi5GraphFunctionDeclaration {
  readonly kind: "graph_function";
  readonly name:
    | OddGlcAbi5ProgramIds["graphFunctionRef"]
    | OddGlcAbi5ProgramIds["sourceGraphFunctionRef"]
    | OddGlcAbi5ProgramIds["interpretationGraphFunctionRef"];
  readonly version: "5.0.0";
  readonly environment: {
    readonly requires: readonly string[];
    readonly provides: readonly string[];
    readonly carries: readonly string[];
  };
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly template: Readonly<{
    kind: "inline_graph";
    graphRef: string;
    startNodeRef: string;
    terminalNodeRefs: readonly string[];
    nodes: readonly Readonly<{
      nodeRef: string;
      nodeKind: "c_locus";
      term: Readonly<Record<string, unknown>>;
    }>[];
    edges: readonly [];
    applications: readonly [];
  }>;
  readonly effects: readonly [];
  readonly declarations: Readonly<Record<string, string>>;
  readonly tags: readonly string[];
}

export const ODD_GLC_ABI5_PROGRAM_IDS: Readonly<OddGlcAbi5ProgramIds>;
export const ODD_GLC_ABI5_PACKAGE_IDENTITY: Readonly<OddGlcAbi5PackageIdentity>;
export const ODD_GLC_ABI5_PROGRAM: Readonly<OddGlcAbi5ProgramDeclaration>;
export const ODD_GLC_ABI5_SOURCE_PROGRAM: Readonly<OddGlcAbi5SourceProgramDeclaration>;
export const ODD_GLC_ABI5_AUTHORITY_BOUNDARY: Readonly<OddGlcAbi5AuthorityBoundary>;
export const ODD_GLC_ABI5_CONTRACTS: readonly Readonly<OddGlcAbi5ContractDeclaration>[];
export const ODD_GLC_ABI5_CLOSURE_CONTRACT: Readonly<OddGlcAbi5ClosureContract>;
export const ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT: Readonly<OddGlcAbi5ChildClosureContract>;
export const ODD_GLC_ABI5_SOURCE_CLOSURE_CONTRACT: Readonly<OddGlcAbi5SourceClosureContract>;
export const ODD_GLC_ABI5_CLOSURE_CONTRACTS: readonly [
  Readonly<OddGlcAbi5ClosureContract>,
  Readonly<OddGlcAbi5ChildClosureContract>,
  Readonly<OddGlcAbi5SourceClosureContract>
];
export const ODD_GLC_ABI5_GRAPH_FUNCTION: Readonly<OddGlcAbi5GraphFunctionDeclaration>;
export const ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION: Readonly<OddGlcAbi5GraphFunctionDeclaration>;
export const ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION: Readonly<OddGlcAbi5GraphFunctionDeclaration>;
export const ODD_GLC_ABI5_IMPLEMENTATION_BINDING: Readonly<OddGlcAbi5ImplementationBinding>;
export const ODD_GLC_ABI5_IMPLEMENTATION_DESCRIPTOR: Readonly<OddGlcAbi5ImplementationDescriptor>;
export const ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING: Readonly<OddGlcAbi5SourceImplementationBinding>;
export const ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_DESCRIPTOR: Readonly<OddGlcAbi5SourceImplementationDescriptor>;
export const ODD_GLC_ABI5_PRODUCT_SEMANTICS: Readonly<ProductSemanticsProvider>;
export const ODD_GLC_ABI5_PRODUCT_SEMANTICS_BINDING: Readonly<{
  readonly kind: "product_semantics_binding";
  readonly bindingRef: OddGlcAbi5ProgramIds["productSemanticsBindingRef"];
  readonly packageName: OddGlcAbi5PackageIdentity["packageName"];
  readonly packageVersion: OddGlcAbi5PackageIdentity["packageVersion"];
  readonly modulePath: OddGlcAbi5PackageIdentity["modulePath"];
  readonly namedSymbol: "ODD_GLC_ABI5_PRODUCT_SEMANTICS";
}>;
export function evaluateOddGlcAbi5LifecycleInput(
  contractRef: string,
  value: unknown
): Readonly<OddGlcAbi5LifecycleInputEvaluation | OddGlcAbi5LifecycleInputRefusal>;
export function interpretAbi5LifecycleProjection(
  input: Readonly<OddGlcAbi5LifecycleContext>
): Readonly<OddGlcAbi5LeafRealizationCandidate>;
export function realizeOddGlcAbi5FreshSource(
  input: Readonly<OddGlcAbi5FreshSourceRequest>
): Readonly<OddGlcAbi5FreshSourceRealizationCandidate>;
export function constructOddGlcAbi5ModulePublication(
  artifact: Readonly<RootModuleArtifactBasis> & Readonly<{
    readonly productId: OddGlcAbi5PackageIdentity["productId"];
    readonly packageName: OddGlcAbi5PackageIdentity["packageName"];
    readonly packageVersion: OddGlcAbi5PackageIdentity["packageVersion"];
  }>
): Readonly<ModulePublication>;
