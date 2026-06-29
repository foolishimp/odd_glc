---
Status: active
Implements:
  - REQ-GLC-BOUNDARY-AUTHORITY-001
  - REQ-GLC-BOUNDARY-AUTHORITY-004
  - REQ-GLC-BOUNDARY-AUTHORITY-005
  - REQ-GLC-BOUNDARY-AUTHORITY-009
  - REQ-GLC-BOUNDARY-AUTHORITY-011
  - REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-001
  - REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-013
  - REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-014
  - REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-015
  - REQ-GLC-READ-QUERY-PROOF-001
  - REQ-GLC-READ-QUERY-PROOF-002
  - REQ-GLC-READ-QUERY-PROOF-005
  - REQ-GLC-READ-QUERY-PROOF-006
  - REQ-GLC-READ-QUERY-PROOF-007
  - REQ-GLC-RELEASE-OPERATIONAL-FEEDBACK-002
Derives from:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-MINIMAL.md
  - .ai-workspace/comments/codex/20260629T030909Z_ABG_RC13_install_reference.md
  - .ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md
Supersedes: none
Superseded by: none
Retained special case: none
---

# ADR-001: Route-1 GTL/ABG Lifecycle Consumption

## Decision

`odd_glc` route-1 shall be a lifecycle binding and read-model design over
ABIogenesis `4.1.0-rc.13` public GTL/ABG surfaces.

It shall not create a fixed odd_glc graph, a native `glc.*` graph-function
catalog, a local runtime, an event stream, admitted-ref minting, evidence
admission, assurance folding, residual projection, or a re-entry controller.

The route-1 graph shape is supplied by GTL/ABG. `odd_glc` supplies lifecycle
surface labels, policy declarations, downstream specialization constraints,
and read/query interpretation over ABG replay/query truth.

## Consumed Substrate

| Substrate | Identity |
| --- | --- |
| Product | `@abiogenesis/typescript-tenant@4.1.0-rc.13` |
| Tag | `v4.1.0-rc.13` |
| Source commit | `cc34cf53ceee8d22fba723f47946523eb4d405f8` |
| Snapshot commit | `d7e044f` |
| Tarball SHA256 | `3794567f58ee690e78f4538379198e4c0957f7e69e4f2b95a91885462f2a697a` |
| Install source | `.ai-workspace/comments/codex/20260629T030909Z_ABG_RC13_install_reference.md` |

## No Fixed Graph Rule

Route-1 is not a hard-coded lifecycle graph.

The first implementation shall treat the Hello World trace as a binding of the
generic lifecycle surface model to:

- GTL requirement declarations;
- an ABG traversal request carrying a `requirementRouteDeclarationBundle`;
- ABG-owned actor/operator execution and evidence admission;
- ABG edge-close requirement-route emission;
- ABG public lifecycle-state query projection;
- `odd_glc` lifecycle interpretation.

A downstream product may supply a different GTL graph, module, job, or artifact
domain while preserving the same lifecycle binding rules.

## Interface Families

| Family | Visibility | Owner | Responsibility | Forbidden behavior |
| --- | --- | --- | --- | --- |
| GTL declaration inputs | downstream public via GTL | GTL | Requirement declarations, bundles, traversal spans, optional lifecycle composition refs. | odd_glc-native requirement representation or compiler. |
| ABG route emitters | ABG-runtime-internal | ABG | Admit declarations, bind evidence, fold assurance, project residuals, emit disposition. | downstream-public emitter calls or local truth construction. |
| ABG query facade | downstream public via ABG | ABG | `compileEdgeRequirementEnvironment`, projections, `projectLifecycleState`, assurance/readiness queries. | query-lazy invention or side-array proof. |
| Lifecycle surface map | odd_glc source/design | odd_glc | Map lifecycle labels to admitted GTL/ABG refs and readiness states. | mint native carriers that shadow GTL/ABG carriers. |
| F_P policy declarations | odd_glc/downstream policy | odd_glc or downstream | Semantic judgment prompts, rubrics, evidence expectations. | invoke an evaluator or treat text output as admitted proof. |
| F_H policy declarations | odd_glc/downstream policy | odd_glc or downstream | Owner, risk, release/readiness, reprice, block, and escalation policy. | hidden retry, release, or re-entry controller. |
| Lifecycle read model | odd_glc public surface after tenant activation | odd_glc | Interpret ABG public query output as lifecycle vocabulary. | emit events, admit evidence, mint refs, fold, residualize, or route re-entry. |

## Route-1 Flow

```text
Lifecycle request
  -> GTL requirement declarations and traversal spans
  -> ABG request with requirementRouteDeclarationBundle
  -> ABG route context from declarations
  -> ABG traversal and actor/operator execution
  -> ABG evidence admission
  -> ABG edge-close requirement route emission
  -> ABG replay/query lifecycle state
  -> odd_glc lifecycle interpretation
```

`odd_glc` only participates before and after ABG runtime authority:

- before runtime: lifecycle labels, F_P/F_H policy declarations, downstream
  specialization constraints;
- after runtime: read/query interpretation of ABG public projections.

## Lifecycle Binding Matrix

| Lifecycle surface | GTL/ABG binding | Readiness | F_D boundary | F_P/F_H boundary | Proof implication |
| --- | --- | --- | --- | --- | --- |
| `LifeCycleWorksiteAsset` | ABG run/worksite refs and GTL module/job refs where present. | design pending over ready route-1 substrate | Validate stable labels and refs. | F_H may choose owner/escalation policy. | Worksite identity is a lifecycle label, not runtime truth. |
| `LifecycleContextAsset` | ABG `AuthorityContextFragment`, `routeContextConstraint`. | ready for route-1 | Validate context refs and readiness. | F_P may describe semantic context; F_H may classify risk. | Context does not close requirements until admitted as requirement pressure. |
| `IntentAsset` | GTL/ABG refs used by requirement declaration and proof policy. | ready for route-1 binding | Validate declaration links. | F_P rubric expresses intent semantics. | Intent is product meaning, not admitted evidence. |
| `ProductDefinitionAsset` | GTL/ABG refs used by requirement declaration and proof policy. | ready for route-1 binding | Validate expected evidence shape. | F_P/F_H policy may define acceptability and owner risk. | Product definition does not bypass ABG fold. |
| `RequirementSetAsset` | `gtl.requirements.declareRequirement`, `declareBundle`, `declareTraversalSpan`. | ready for route-1 | Validate GTL declaration refs and no local requirement carrier. | F_P rubric may define semantic requirement wording. | Active pressure is admitted through GTL/ABG, not compiled locally. |
| `RequirementEnvironmentViewAsset` | `abg.requirements.compileEdgeRequirementEnvironment`. | ready for route-1 | Validate environment query result and readiness. | none as authority. | Query labels ABG environment truth. |
| `DestinationTopologyAsset` | ABG `DestinationTopology` and GTL topology declarations. | ready for route-1 | Validate refs and no topology rewrite. | downstream policy may constrain artifact layout. | Topology remains ABG/GTL carrier truth. |
| `InstructionSetAsset` | `projectEdgeObligations`, `projectMaterializationTargets`, `projectExecutionSchedules`. | ready as public query projection | Validate projection refs. | F_P may shape handoff wording. | Instruction set is a bounded handoff label, not a work queue. |
| `TargetArtifactAsset` | GTL asset surface and ABG admitted artifact/payload refs. | ready for route-1 proof | Validate admitted refs and digest presence. | downstream policy defines artifact domain. | Artifact proof depends on ABG evidence admission. |
| `CapabilityAsset` | ABG actor/operator capability and runtime invocation. | ready for route-1 proof | Validate capability ref exists. | F_H may approve risk; F_P may describe expected behavior. | odd_glc never shells out. |
| `EvidenceBindingAsset` | ABG admitted evidence and requirement evidence binding. | ready for route-1 | Validate evidence binding refs resolve. | F_P may interpret evidence meaning only after admission. | Evidence is ABG-owned runtime truth. |
| `AssuranceFoldViewAsset` | ABG assurance fold and `projectAssuranceCase`. | ready for route-1 | Validate fold/disposition refs. | F_P may interpret semantic acceptability; F_H may block/reprice. | Fold truth remains ABG-owned. |
| `ResidualPressureViewAsset` | ABG residual projection and `classifyAttenuation`. | ready for route-1; multi-cycle behavior design pending | Validate residual refs and no local residual ledger. | F_H may choose reprice/block policy. | Residual pressure is read, not routed locally. |
| `ReentryDecisionAsset` | ABG continuation, correction, re-entry, release, or block facts. | ready for route-1 terminal disposition; cyclic general case pending | Validate disposition refs. | F_H policy selects lawful STDO path only through admitted refs. | No odd_glc retry or re-entry controller. |

## Future Source Interfaces

The first tenant may expose a small library interface only after tenant
activation. The interface shall stay within these families:

| Interface family | Allowed shape | Disallowed shape |
| --- | --- | --- |
| lifecycle binding validation | Pure F_D validation that labels and refs match the surface map. | Requirement compilation, graph construction, or admitted-ref minting. |
| policy declaration assembly | Data declarations for F_P prompts/rubrics and F_H policies. | Direct LLM invocation, shell execution, or owner decision authority. |
| lifecycle state interpretation | Read-only projection from ABG public query output to odd_glc vocabulary labels. | Emitting events, folding evidence, residualizing pressure, or routing retries. |
| negative regression proof | Import/export and fixture checks that forbidden emitters/carriers do not exist. | Synthetic proof that bypasses ABG replay/query truth. |

## Downstream Specialization Seam

Future odd_sdlc work may specialize this design by adding software-delivery
assets, policies, and proof expectations at the downstream layer.

| Seam | odd_glc contract | Future odd_sdlc specialization may add | Must not add |
| --- | --- | --- | --- |
| lifecycle assets | Generic lifecycle surface labels and read/query interpretation. | Software requirement, design, source, test, release, deployment, and runtime-return asset roles. | Replacement lifecycle carriers that shadow GTL/ABG carriers. |
| policy declarations | F_P prompt/rubric surfaces and F_H owner/risk/reprice policies. | Software-delivery acceptance policy and release risk policy. | Direct evaluator invocation or hidden owner-decision controller. |
| proof interpretation | ABG replay/query truth interpreted as lifecycle closure, residual, or disposition. | Software-specific evidence expectations and query overlays. | SDLC-local evidence admission, closure ledger, residual ledger, retry loop, or release checklist as authority. |
| graph and runtime substrate | GTL declarations plus ABG traversal, actor/operator, admission, fold, residual, continuation, and re-entry truth. | Domain graph declarations and artifact-specific capabilities. | Native graph-function catalog or local runtime substrate. |

This seam is intentionally thin. It proves that future odd_sdlc parity is a
downstream specialization target, not the generic odd_glc product model.

## Proof Obligations

Route-1 tenant implementation shall prove:

- GTL/ABG public facades are consumed directly;
- ABG projection emitters are not exported or called by odd_glc;
- `AdmittedRef` values are received from ABG query/replay truth and never
  constructed by odd_glc;
- side-effecting execution enters through ABG actor/operator and evidence
  admission;
- lifecycle state is reproducible from ABG replay/query truth;
- F_D validation cannot infer F_P semantic satisfaction or F_H owner decisions;
- no native `glc.*` graph-function catalog, fixed graph, event stream, closure
  enum, residual ledger, retry loop, or re-entry controller exists.

## Deferred Work

This ADR does not close:

- requirement graph derivation;
- goal refinement;
- multi-requirement decomposition;
- recursive any-scale lifecycle nesting;
- full release cut, deployment, install, or operational-return loops;
- future odd_sdlc specialization.

Those require later requirement/design work or upstream ABIogenesis tickets
when the missing function is generic GTL/ABG substrate.

## Consequences

The first build tenant can be priced as a read/query and policy-interpretation
library over ABIogenesis `4.1.0-rc.13`. It cannot contain runtime authority or
compatibility ledgers.

Tenant activation is still a separate registry decision. Until that decision,
this ADR is design authority only.
