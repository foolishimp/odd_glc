# T-003 GTL/ABG Gap Work Backlog

**Status**: Posted
**Date**: 2026-06-28
**Ticket**: [T-003](../../tickets/active/T-003-define-gtl-abg-gap-work-and-upstream-design.md)
**Scope**: Exhaustive upstream GTL/ABG work list required for odd_glc
functional lifecycle readiness.

This is commentary and upstream work definition. It does not modify
ABIogenesis and does not authorize odd_glc to implement local substitutes.

## Functional Readiness Target

GTL/ABG is functionally sufficient for odd_glc when odd_glc can declare a GTL
composition or binding over upstream system functions and every required slot
is `ready` under
`REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION`:

- real admitted carrier truth;
- callable runtime or query path where applicable;
- non-forgeable evidence;
- replay/query reconstruction rather than fixture-only calls;
- pinned consumed source or release identity.

The target does not require odd_glc to own runtime, requirement compilation,
evidence admission, folds, residuals, continuation, re-entry, or graph-function
catalogs. Those remain GTL/ABG work.

## Exhaustive Work Items

| ID | Layer | Gap work | Current state | Required behavior | Blocks odd_glc slot | Dependencies | Closure proof |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GLC-GTL-001 | GTL declarations | Publish stable GTL requirement declaration package. | Carriers and constructors exist in GTL M01 but are only exported constructors, not an admitted authoring route. | GTL declarations preserve requirement id, term kind, relations, spans, context refs, evidence-policy refs, destination refs, and projection refs as authoring carriers. | `RequirementSetAsset` | Existing GTL requirement declarations. | Public import path, conformance proof, and admitted declaration bundle fixture using only GTL carriers. |
| GLC-GTL-002 | GTL declarations | Publish requirement declaration admission binding. | No runtime caller found beyond constructors/exports. | ABG can admit GTL requirement declarations into requirement ledger truth without a downstream compiler. | Requirement authoring | GLC-GTL-001, GLC-ABG-003. | Non-test caller admits declaration bundle and replay reconstructs terms/relations/spans. |
| GLC-GTL-003 | GTL composition | Define a public requirements-lifecycle composition declaration. | No lifecycle composition route found. | GTL publishes a composition or binding route over ABG requirements system functions without `glc.*` republishing. | Named lifecycle route | GLC-ABG-002 through GLC-ABG-019. | `typecheckGtlProgram` or equivalent accepts the composition and exposes stable refs/digests. |
| GLC-GTL-004 | GTL exports | Create stable public export paths for requirements declarations/composition. | Requirements algebra is transitively public and RC-pinned. | Downstream products import from stable GTL/ABG paths, not deep internal module paths. | All binding slots | GLC-GTL-001, GLC-GTL-003. | Package API test fails if export path moves without versioned replacement. |
| GLC-ABG-001 | Release/pinning | Publish pinned consumable ABIogenesis substrate release. | odd_glc and odd_sdlc research consume source or `4.1.0-rc.11`. | A stable release or digest-pinned snapshot names the substrate identity consumed by odd_glc. | All slots | All ready candidates. | Release manifest includes tarball digest, source git rev, spec refs, and passing proof commands. |
| GLC-ABG-002 | Public API | Publish `abg.requirements` public system-function route. | Pure functions exist in `requirements_algebra.ts`; no non-test runtime/query caller found. | ABG exposes callable query/runtime path for requirements-algebra functions. | All requirements-algebra slots | Existing T-162 functions. | Non-test caller under ABG runtime/query path invokes the route and returns admitted refs. |
| GLC-ABG-003 | Admission/replay | Admit requirement declaration events into replay-derived requirement ledger. | `projectRequirementLedger` exists; authoring route unwired. | Write-side admitted requirement declarations become replay-derived ledger terms, relations, spans, context fragments, destination topology, and evidence policies. | Requirement authoring, requirement environment | GLC-GTL-002, GLC-ABG-002. | Replay test proves ledger reconstructs declarations and rejects dangling/duplicate refs. |
| GLC-ABG-004 | Context | Wire context fragment ingestion and `routeContextConstraint`. | Carrier/function tested only; no non-test caller. | ABG admits staged context fragments and exposes routing query for active edge/span. | `LifecycleContextAsset` | GLC-ABG-002, GLC-ABG-003. | Runtime/query caller routes context without test harness construction. |
| GLC-ABG-005 | Environment | Wire `buildEdgeRequirementEnvironment` as public query. | Function exists and is test-only. | ABG projects `EdgeRequirementEnvironment` from active terms, spans, context, topology, prior folds, and residuals. | `RequirementEnvironmentViewAsset` | GLC-ABG-003, GLC-ABG-004, GLC-ABG-007, GLC-ABG-016. | Query returns environment for a real run/frame and carries prior residual pressure. |
| GLC-ABG-006 | Requirement graph | Publish requirement graph derivation and goal refinement functions. | No `derive_requirement_graph` or `refine_goal` found. | ABG/GTL derives/refines requirement graph structure from requirement terms without downstream compilers. | Decomposition/refinement lifecycle slots | GLC-GTL-001, GLC-ABG-003. | Function emits traceable derived graph/projection refs and rejects ungrounded generated terms. |
| GLC-ABG-007 | Destination topology | Wire `DestinationTopology` admission and query path. | Carrier and constructor exist; no runtime caller. | ABG admits destination topology and makes it available to environment and obligation projection. | `DestinationTopologyAsset` | GLC-ABG-003. | Non-test route admits topology, replay carries it, environment query includes it. |
| GLC-ABG-008 | Obligations | Wire requirement obligation projection. | `projectRequirements` exists and is test-only. | ABG projects active edge obligations from requirement environment. | `InstructionSetAsset` | GLC-ABG-005, GLC-ABG-006. | Query returns obligations with requirement refs, roles, and active span. |
| GLC-ABG-009 | Materialization | Wire materialization-target projection. | `projectMaterializationTargets` exists and is test-only. | ABG projects materialization targets from obligations and destination topology. | Target artifact and work planning labels | GLC-ABG-007, GLC-ABG-008. | Query returns materialization targets and rejects targets outside admitted topology. |
| GLC-ABG-010 | Execution schedule | Wire execution schedule and evidence expectation projection. | `projectExecutionSchedules` exists and is test-only. | ABG projects execution schedule rows and expected evidence roles for active requirements. | `InstructionSetAsset`, `CapabilityAsset` | GLC-ABG-008, GLC-ABG-009. | Query returns schedule commands and expected evidence kinds from admitted inputs. |
| GLC-ABG-011 | Runtime bridge | Correlate ABG actor/operator invocation with requirement execution schedule. | `invokeSupervisedProcessActor` is a real ABG endpoint; no requirements-algebra bridge found. | Actor invocation result refs can be tied to schedule rows and active requirement projections. | `CapabilityAsset`, execution proof | GLC-ABG-010, generic ABG process actor. | Live/non-test run links actor invocation refs to schedule/projection refs without odd_glc executing commands. |
| GLC-ABG-012 | Evidence admission bridge | Bridge runtime `EvidenceAdmittedRuntimeEvent` to requirement evidence input. | Runtime evidence admission exists; `bindRequirementEvidence` takes manual `admitted: boolean`. | ABG consumes admitted runtime evidence events and active requirement projections to produce binding inputs. | `EvidenceBindingAsset` | GLC-ABG-011, generic evidence admission. | Test fails if caller passes only a boolean without an admitted evidence event ref. |
| GLC-ABG-013 | Evidence binding | Wire `bindRequirementEvidence` as a system function. | Function exists and is test-only. | ABG emits `RequirementEvidenceBinding` events with role, requirement refs, projection refs, evidence refs, and provenance. | `EvidenceBindingAsset` | GLC-ABG-005, GLC-ABG-012. | Non-test caller binds source/execution/output/semantic evidence and rejects path-shape inference. |
| GLC-ABG-014 | Evidence currency | Define current/predecessor evidence selection in replay/query. | Synthetic tests cover current admitted evidence; no runtime path. | Requirement evidence binding distinguishes current evidence from predecessor evidence and does not close by stale proof. | Evidence binding, assurance fold | GLC-ABG-013. | Replay test with predecessor and current evidence proves current evidence governs fold input. |
| GLC-ABG-015 | Assurance bridge | Bridge ABG assurance closure decisions to requirement folds. | `foldRequirementEvidence` manually receives truth refs in tests/live harness. | ABG runtime/query path supplies non-forgeable assurance closure truth refs to requirement fold. | `AssuranceFoldViewAsset` | GLC-ABG-013, generic ABG assurance closure. | Non-test caller folds from real assurance closure decision refs; forged refs fail. |
| GLC-ABG-016 | Requirement fold | Wire `foldRequirementEvidence` as replay/query system function. | Function exists and is test-only. | ABG emits `RequirementFoldProjection` from requirement evidence bindings and assurance truth. | Assurance fold, residual | GLC-ABG-015. | Fold projection is replay-visible, scoped per requirement, and cannot be constructed from local strings. |
| GLC-ABG-017 | Assurance case | Wire `projectAssuranceCase` and fix empty-fold semantics. | Function exists; Claude review notes empty fold returns `blocked`. | ABG projects assurance case rows over folds; empty fold is explicit no-evidence / not-evaluable state, not vacuous block. | `AssuranceFoldViewAsset` | GLC-ABG-016. | Unit and query tests prove empty, satisfied, partial, and blocked cases distinctly. |
| GLC-ABG-018 | Residual projection | Wire `residualizeRequirementFolds` into replay/query path. | Function exists and is test-only. | ABG persists/query-projects residual pressure preserving span, pressure class, owner surface, evidence refs, source fold refs. | `ResidualPressureViewAsset` | GLC-ABG-016. | Residual query after runtime fold includes source fold refs and remaining span. |
| GLC-ABG-019 | Attenuation | Wire attenuation classification to residual query. | `classifyRequirementAttenuation` exists and is test-only. | ABG classifies residual attenuation by residual identity and lifecycle disposition pressure. | Residual interpretation | GLC-ABG-018. | Multi-residual test proves classification is not row-position dependent. |
| GLC-ABG-020 | Requirement disposition | Bridge requirement residual/fold outcomes to continuation/re-entry disposition. | Generic continuation/re-entry exists; requirement residual bridge unwired. | ABG exposes requirement-specific disposition for release, repair, reprice, block, yield, continuation, or graph-span re-entry. | `ReentryDecisionAsset` | GLC-ABG-018, GLC-ABG-019, generic continuation/re-entry. | Query joins residual/fold truth to continuation transition without product-local next-action router. |
| GLC-ABG-021 | Lifecycle read model | Publish joined requirements lifecycle projection query. | Consumers must call scattered pure functions or local ledgers. | ABG provides read model over environment, obligations, evidence binding, fold, residual, attenuation, and disposition for an active edge/frame. | All odd_glc view assets | GLC-ABG-005 through GLC-ABG-020. | Public query is read-only, replay-derived, and includes source event/projection refs. |
| GLC-ABG-022 | Non-forgeability | Extend negative tests to every bridge and read model. | Fold forgeability fixed; bridges not wired. | Evidence/fold/residual/disposition refs are digest-checked and cannot be forged by local strings or compatibility aliases. | All close-capable slots | GLC-ABG-012 through GLC-ABG-021. | Negative tests reject forged evidence event, fold, residual, disposition, and release refs. |
| GLC-ABG-023 | Runtime callers | Add non-test callers for requirements route. | T-002 found definitions and tests only. | ABG runner, query service, or public control surface invokes requirements-algebra route during real or live execution. | All `test_only` rows | GLC-ABG-002 through GLC-ABG-021. | `rg` shows callers outside tests and function definitions; integration proof covers them. |
| GLC-ABG-024 | Live proof | Make live requirements-algebra proof executable and closing. | Live T-162 harness skipped without env flags and manually wires middle. | A live or installed proof runs actor execution, admits evidence, binds evidence, folds, residualizes, and projects disposition end-to-end. | T-001 close-capable steel thread | GLC-ABG-011 through GLC-ABG-023. | Live proof passes without manual truth-ref injection and archives evidence refs. |
| GLC-ABG-025 | Downstream migration | Publish odd_sdlc local-carrier replacement guidance. | odd_sdlc implements peer ledgers locally. | ABIogenesis documents mapping from SDLC local carriers to upstream requirement capabilities. | Future odd_sdlc rebuild | GLC-ABG-021. | Migration guide names replacements for `SdlcRequirementClosureRegister`, `SdlcEdgeEvidenceAdmission`, residuals, closure decisions, and next-action projection. |
| GLC-ABG-026 | Public documentation | Document ownership boundaries and non-owned downstream behavior. | Boundary exists across odd_glc commentary/spec but not upstream route docs. | GTL/ABG docs state what downstream products may label/interpret and what they must not republish. | Downstream adoption | GLC-ABG-002 through GLC-ABG-025. | Docs include genericity test, no peer-ledger rule, and public API examples. |

## Slice Plan

### Slice 0: Pin And Export

Complete GLC-ABG-001, GLC-GTL-004, and public export checks. This does not make
the lifecycle route ready, but it removes the cross-cutting `unpinned` caveat.

### Slice 1: Authoring And Environment

Complete GLC-GTL-001, GLC-GTL-002, GLC-ABG-002, GLC-ABG-003,
GLC-ABG-004, GLC-ABG-005, GLC-ABG-006, and GLC-ABG-007. This lets odd_glc
query what requirements are active for a lifecycle frame.

### Slice 2: Work Projection And Execution Bridge

Complete GLC-ABG-008 through GLC-ABG-014. This lets odd_glc see ABG-owned
obligations, execution schedules, runtime evidence, and requirement evidence
bindings without executing or binding evidence locally.

### Slice 3: Fold, Residual, And Disposition

Complete GLC-ABG-015 through GLC-ABG-021. This is the critical odd_glc closure
slice: evidence becomes non-forgeable fold truth, residual pressure is
replay/query visible, and re-entry disposition is ABG-owned.

### Slice 4: Proof, Release, And Migration

Complete GLC-ABG-022 through GLC-ABG-026. This turns the route into a pinned,
documented, live-proven substrate that future odd_sdlc can consume instead of
recreating local ledgers.

## Minimum Ready Set For odd_glc T-001

T-001 can only claim a close-capable lifecycle steel thread when these are
ready or explicitly scoped out as non-closeable deferred slots:

- GLC-GTL-001 through GLC-GTL-004;
- GLC-ABG-001 through GLC-ABG-024.

GLC-ABG-025 and GLC-ABG-026 are not required for the first odd_glc steel-thread
proof, but they are required for a disciplined odd_sdlc rebuild and general
downstream adoption.

## Do-Not-Recreate List

odd_glc shall not create replacements for:

- requirement closure register;
- edge evidence admission;
- edge gain or obligation gain ledger;
- residual pressure store;
- assurance close decision;
- edge fulfillment ledger;
- closure decision enum;
- next-action router;
- gap route controller;
- process actor wrapper;
- requirement compiler or translator.

Those are either upstream GTL/ABG substrate responsibilities or downstream
domain labels over admitted substrate truth.
