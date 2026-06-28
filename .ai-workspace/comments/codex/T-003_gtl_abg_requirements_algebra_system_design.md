# T-003 GTL/ABG Requirements-Algebra System Design

**Status**: Posted
**Date**: 2026-06-28
**Ticket**: [T-003](../../tickets/active/T-003-define-gtl-abg-gap-work-and-upstream-design.md)
**Companion backlog**: [T-003 GTL/ABG Gap Work Backlog](./T-003_gtl_abg_gap_work_backlog.md)

This is a disambiguated upstream design proposal. It is not odd_glc
requirement law, not ABIogenesis implementation, and not authority for odd_glc
to build local substitutes.

## Design Intent

Provide a GTL/ABG system substrate that lets downstream ODD products interpret
lifecycle state without owning generic construction, runtime truth, evidence
admission, assurance fold, residuals, continuation, or re-entry.

The design turns the current T-162 requirements-algebra pure functions into a
public, wired, replay/query-visible system route.

## Non-Goals

- No `glc.*` native graph-function catalog.
- No odd_glc runtime, executor, compiler, ledger, fold, residual store, retry
  loop, or next-action controller.
- No port of odd_sdlc local carriers into odd_glc.
- No product-local requirement representation that later translates into ABG
  terms.
- No closure claim from synthetic tests, fixture-only calls, or manually passed
  truth refs.

## Ownership Model

| Surface | Owner | Rule |
| --- | --- | --- |
| Requirement declaration syntax and composition declarations | GTL | Declarations are authoring carriers. They do not decide runtime truth. |
| Requirement admission, replay, projection, evidence binding, fold, residual, continuation, re-entry | ABG | Runtime/query truth is admitted, replay-derived, and non-forgeable. |
| Side-effecting process execution and evidence admission | ABG | Existing generic runtime endpoints remain ABG-owned. |
| Lifecycle stage names, policy overlays, proof interpretation, downstream specialization | odd_glc and downstream products | Product surfaces are labels and queries over GTL/ABG truth. |
| Software-domain phase names and policies | future odd_sdlc | Downstream specialization only; not generic lifecycle law. |

## Two-Layer Runtime Split

The research requires a two-layer design.

### Layer A: Existing Generic ABG Endpoints

These are not the main gap. They exist but still need stable pinning and clean
requirements-algebra bridge integration:

- process actor invocation;
- runtime payload/evidence admission;
- assurance closure decision truth;
- continuation transition and graph-span re-entry truth;
- public start/runtime traversal selection;
- result-envelope ingress.

odd_glc may consume these through ABG once pinned and exposed. It shall not
defer program execution merely because requirement binding is unwired.

### Layer B: Requirements-Algebra Middle

This is the main gap:

```text
GTL requirement declarations
-> ABG requirement ledger
-> context route
-> edge requirement environment
-> obligations / materialization / execution schedule
-> ABG runtime execution and evidence admission
-> requirement evidence binding
-> assurance closure to requirement fold
-> residual and attenuation
-> requirement-specific continuation/re-entry disposition
-> read model for downstream lifecycle interpretation
```

Layer B must be upstream GTL/ABG system capability. It is the layer odd_sdlc
implemented locally and odd_glc must not recreate.

## Public Module Shape

The final release should expose stable public paths. Exact package names can be
ratified upstream, but the design needs these logical namespaces:

| Namespace | Purpose |
| --- | --- |
| `gtl.requirements` | Requirement declaration carriers and GTL composition declarations. |
| `abg.requirements` | Runtime/query system functions and read models over requirement truth. |
| `abg.requirements.events` | Admitted requirement event payloads and event constructors. |
| `abg.requirements.queries` | Read-only query entry points for environment, evidence, fold, residual, and disposition. |
| `abg.requirements.proof` | Proof helpers and negative guards for non-forgeability and readiness. |

Downstream products should import only stable public paths, not
`contracts/requirements_algebra.ts` internals.

## Carrier Contracts

### GTL Carriers

| Carrier | Required fields | Notes |
| --- | --- | --- |
| `GtlRequirementDeclaration` | requirement id, term kind, statement/intent refs, evidence policy refs, destination refs, source authority refs | Authoring carrier only. |
| `GtlRequirementRelationDeclaration` | source requirement id, target requirement id, relation kind, reason refs | Preserves graph identity without compiling locally. |
| `GtlRequirementTraversalSpanDeclaration` | requirement id, graph vector/span refs, vector index range, source/target node refs | Prevents substring span matching. |
| `GtlRequirementContextDeclaration` | context fragment refs, stage, scope, promotion policy, applies-to refs | Feeds ABG context routing. |
| `GtlRequirementsLifecycleComposition` | ordered bindings to `abg.requirements.*` system functions | A composition declaration, not a native product graph function. |

### ABG Carriers

| Carrier | Required fields | Notes |
| --- | --- | --- |
| `RequirementLedger` | terms, relations, spans, context fragments, destination topologies, admitted event refs | Replay-derived write-side truth. |
| `EdgeRequirementEnvironment` | active terms, relations, spans, context, topologies, prior folds, residuals | Query basis for lifecycle state. |
| `RequirementProjection` | requirement refs, role, active span, obligation/materialization/execution refs | Output of obligation and schedule projection. |
| `RequirementEvidenceBinding` | requirement refs, projection refs, evidence event refs, role, provenance, current/predecessor status | Must consume admitted evidence events. |
| `RequirementFoldProjection` | requirement ref, evidence binding refs, assurance truth refs, fold state, digest | Must be non-forgeable and replay/query visible. |
| `RequirementResidualProjection` | requirement ref, remaining span, pressure class, owner surface, evidence refs, source fold refs | Central re-entry input. |
| `RequirementAssuranceClaim` | fold refs, residual refs, assurance status, reason refs | Query/read model only. |
| `RequirementLifecycleDisposition` | residual refs, continuation/re-entry refs, disposition, target refs, policy refs | New or explicit joined projection needed for odd_glc. |

## Event Contracts

ABG should admit or project these event kinds. Names are logical; upstream may
ratify exact spellings.

| Event kind | Source | Payload | Replay role |
| --- | --- | --- | --- |
| `requirement_declaration_admitted` | GTL declaration admission | declaration bundle ref, term/relation/span refs, digest | Builds requirement ledger. |
| `requirement_context_fragment_admitted` | GTL/ABG context admission | context fragment ref, stage, scope, applies-to refs | Feeds context routing. |
| `destination_topology_admitted` | GTL/ABG topology admission | topology ref, graph/vector refs, digest | Feeds environment and materialization. |
| `edge_requirement_environment_projected` | ABG query projection | environment ref, active terms, spans, residual refs | Query audit trail. |
| `requirement_obligation_projected` | ABG projection | obligation/materialization/schedule refs | Work pressure basis. |
| `requirement_evidence_bound` | ABG evidence bridge | evidence binding refs, runtime evidence event refs | Evidence truth for fold. |
| `requirement_fold_projected` | ABG assurance bridge | fold projection ref, assurance truth refs, digest | Fold truth. |
| `requirement_residual_projected` | ABG residual projection | residual ref, source fold refs, attenuation | Residual truth. |
| `requirement_disposition_projected` | ABG continuation bridge | residual refs, continuation/re-entry refs, disposition | Next lawful lifecycle interpretation. |

## System Function Contracts

| Function | Inputs | Output | Runtime/query path | Ready gate |
| --- | --- | --- | --- | --- |
| `gtl.requirements.declare` | authored GTL requirement declarations | declaration bundle | authoring/admission | Declarations are conformance-checked and admitted without local translation. |
| `abg.requirements.admit_declarations` | GTL declaration bundle | admitted requirement events and ledger refs | ABG admission/replay | Replay reconstructs terms/relations/spans. |
| `abg.requirements.ingest_context_fragments` | context declarations/events | admitted context fragments | ABG admission | Fragments carry stage, scope, policy, and applies-to refs. |
| `abg.requirements.route_context_constraint` | context fragments, active refs, frame/span | route projection | ABG query | Non-test caller returns route for real frame/span. |
| `abg.requirements.compile_edge_environment` | ledger, active graph vector/span, prior folds/residuals | `EdgeRequirementEnvironment` | ABG query | Environment includes active requirements, context, topology, prior fold, residual. |
| `abg.requirements.derive_requirement_graph` | requirement terms/relations | derived requirement graph projection | ABG query/system function | Derivation is traceable and rejects ungrounded terms. |
| `abg.requirements.refine_goal` | goal/requirement terms, refinement policy | refined requirement terms/relations | ABG query/system function | Refinement emits admitted derivation refs. |
| `abg.requirements.project_edge_obligations` | environment | obligation projections | ABG query | Obligations are scoped to active span and requirement refs. |
| `abg.requirements.project_materialization_targets` | obligations, topology | materialization target projections | ABG query | Targets cannot escape admitted topology. |
| `abg.requirements.project_execution_schedules` | obligations, targets, capability policy | execution schedule and evidence expectations | ABG query | Schedule rows carry command/capability refs and expected evidence roles. |
| `abg.requirements.bind_execution_evidence` | schedule refs, actor invocation refs, evidence admitted events | requirement evidence binding input | ABG runtime bridge | No boolean-only admission path. |
| `abg.requirements.bind_evidence` | active projections, admitted evidence event refs | `RequirementEvidenceBinding` | ABG runtime/query | Role separation and path-forgery rejection pass outside tests. |
| `abg.requirements.fold_requirement_state` | evidence bindings, assurance closure truth refs | `RequirementFoldProjection` | ABG runtime/query | Fold refs validate digest and source truth; no manual truth-ref injection. |
| `abg.requirements.project_assurance_case` | folds, residuals, policy | assurance claim/read model | ABG query | Empty fold set is explicit no-evidence state. |
| `abg.requirements.project_residuals` | folds, active spans, prior residuals | `RequirementResidualProjection` | ABG runtime/query | Residual preserves span, pressure class, owner, evidence, source fold refs. |
| `abg.requirements.classify_attenuation` | residuals, prior residuals, policy | attenuation rows | ABG query | Classification is keyed by residual identity. |
| `abg.requirements.resolve_reentry_disposition` | residuals, attenuation, continuation/re-entry truth | requirement lifecycle disposition | ABG query | Disposition joins residual truth to ABG continuation/re-entry without product router. |
| `abg.requirements.project_lifecycle_state` | frame/span/run refs | joined lifecycle read model | ABG query | Returns environment, obligations, evidence, fold, residual, disposition, and source refs. |

## Runtime Flow

1. Author writes GTL requirement declarations.
2. ABG admits the declaration bundle and records requirement events.
3. Replay derives `RequirementLedger`.
4. ABG admits/renders staged context fragments and destination topology.
5. ABG compiles `EdgeRequirementEnvironment` for a graph vector/frame/span.
6. ABG projects obligations, materialization targets, execution schedules, and
   evidence expectations.
7. Generic ABG actor/operator invocation runs scheduled side-effecting work
   when a schedule requires it.
8. Generic ABG evidence admission emits runtime evidence events.
9. Requirements bridge binds admitted evidence events to active requirement
   projections.
10. ABG assurance closure truth feeds requirement fold.
11. Fold output produces residual projection and attenuation.
12. Residual output joins with ABG continuation/re-entry truth.
13. Downstream products query lifecycle state and add product labels/policy
   interpretation.

## Non-Forgeability Design

Every projected requirements-algebra truth ref must be verifiable from admitted
source refs and stable digest input.

Rules:

- A requirement fold cannot accept arbitrary `sourceAbgTruthRefs`; it must
  consume ABG assurance closure decision refs produced by runtime/query path.
- Evidence binding cannot accept `admitted: true` without an admitted evidence
  event ref.
- Residual projection must include source fold refs.
- Disposition projection must include source residual refs and continuation or
  re-entry refs.
- Read models must carry source event/projection refs.
- Negative tests must reject forged refs, stale predecessor-only evidence,
  role-by-path-shape inference, and compatibility aliases.

## Disambiguation Decisions

| Ambiguity | Decision | Reason |
| --- | --- | --- |
| Is program execution unwired? | Generic ABG execution exists; requirement binding to execution evidence is unwired. | Prevents over-deferring ready-ish runtime endpoints while keeping the middle blocked. |
| Is evidence admission the same as requirement evidence binding? | No. Evidence admission is generic ABG runtime truth; requirement binding maps admitted evidence to active requirements. | odd_sdlc blurred this with local edge evidence admission. |
| Is destination topology just GTL graph topology? | No. Destination topology is a requirement HOW constraint over active requirement environment. It may reference GTL graph/vector truth but remains ABG requirement carrier/query truth. | Avoids local topology rewrite. |
| Is requirement graph derivation proven by odd_sdlc depth decomposition? | No. odd_sdlc depth decomposition is adjacent evidence only. T-162 requirement graph derivation remains missing. | Prevents overclaiming. |
| Can a ViewAsset be a native carrier? | No, unless a requirement proves no GTL/ABG carrier exists. | View surfaces are labels/queries over admitted carriers. |
| Can downstream products rank next action? | Yes, as policy/read-model interpretation. They cannot own the continuation/re-entry controller or second closure enum. | Preserves ABG runtime authority. |
| Can synthetic tests close readiness? | No. Synthetic tests are evidence, not runtime/query wiring. | T-002 readiness law requires non-test caller and pinned source. |
| Can an RC tarball satisfy pinning? | Only if explicitly accepted as the consumed source identity for the dependent design; stable release is the target. | Keeps reproducibility explicit. |

## Query Surface

The main downstream query should be a single read-only projection:

```text
abg.requirements.project_lifecycle_state({
  runRef,
  frameRef,
  graphVectorRef,
  graphSpanRef,
  requirementScopeRefs
})
```

Expected output:

- source release/spec identity;
- active requirement environment ref;
- context route refs;
- active obligation refs;
- materialization target refs;
- execution schedule refs;
- requirement evidence binding refs;
- fold projection refs;
- assurance case refs;
- residual projection refs;
- attenuation rows;
- lifecycle disposition refs;
- all source event/projection refs needed for replay verification.

This query is not a controller. It returns current truth for lifecycle
interpretation.

## Proof Plan

### Synthetic Proof

Extend T-162 synthetic tests to cover:

- declaration admission into replay ledger;
- public query callers for every requirements-algebra function;
- evidence event to evidence binding bridge;
- assurance closure to requirement fold bridge;
- fold to residual to attenuation;
- residual to requirement disposition;
- negative forged refs for evidence, fold, residual, and disposition;
- empty assurance-case state distinct from blocked state.

### Live Proof

The live proof must:

1. author/admit a minimal GTL requirement declaration;
2. compile environment for a real graph vector/frame;
3. project execution schedule;
4. run side-effecting proof through ABG actor/operator invocation;
5. admit runtime evidence event;
6. bind evidence to requirement;
7. fold from ABG assurance closure decision;
8. project residual and attenuation;
9. project requirement disposition;
10. show odd_glc can read the lifecycle state without local shims.

It must not manually pass fold truth refs, fabricate evidence admission with a
boolean, or close from local output files.

### Downstream Regression Proof

Add a fixture based on the odd_sdlc migration map:

- `SdlcRequirementClosureRegister` replaced by ABG requirement read model;
- `SdlcEdgeEvidenceAdmission` replaced by `RequirementEvidenceBinding`;
- `SdlcEdgeResidualPressure` replaced by `RequirementResidualProjection`;
- `SdlcEdgeClosureDecision` replaced by ABG assurance/continuation transition
  plus requirement fold disposition;
- `SdlcNextActionProjection` replaced by requirement lifecycle disposition
  query.

This proves the design retires the peer-ledger anti-pattern.

## Implementation Order

1. Pin/public-export the current requirements algebra.
2. Wire declaration admission and replay-derived ledger.
3. Publish environment/context/topology queries.
4. Publish obligation/materialization/schedule queries.
5. Bridge runtime evidence admission to requirement evidence binding.
6. Bridge assurance closure to requirement fold.
7. Persist/query residual and attenuation.
8. Bridge residual to continuation/re-entry disposition.
9. Publish joined lifecycle-state read model.
10. Add live end-to-end proof and release manifest.

## Acceptance Gates For odd_glc Consumption

odd_glc may classify a slot `ready` only when the upstream release provides:

- stable public import path;
- pinned release/source identity;
- admitted carrier truth;
- runtime/query caller outside tests;
- replay/query source refs;
- non-forgeability tests;
- live or installed proof where side effects are involved.

Until then T-001 may only produce a deferred design over that slot.

## Open Questions For ABIogenesis

- Should `RequirementLifecycleDisposition` be a new carrier or a named query
  projection over existing continuation/re-entry carriers?
- Should `derive_requirement_graph` and `refine_goal` be first-class system
  functions or should the composition declare they are out of scope for the
  first route?
- What exact public module names and export paths should replace current deep
  imports?
- What release status satisfies downstream pinning: stable semver, release
  cut, or digest-pinned RC?
- Should empty assurance-case state be `not_evaluable`, `no_evidence`, or
  another upstream enum value?

## odd_glc Design Constraint

T-001 graph/composition design shall consume this upstream design as a
readiness target. It shall not implement any function, carrier, bridge, or
controller named here inside odd_glc.
