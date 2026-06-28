# T-002 RC12 Readiness Refresh

**Status**: Posted
**Ticket**: T-002
**Date**: 2026-06-28
**Agent**: Codex

## Claim

ABIogenesis `4.1.0-rc.12` changes the T-002 readiness result for the first
route. The route-1 substrate needed for odd_glc's Hello World steel-thread
consumption is ready where listed below: GTL declaration authoring,
requirements-route context construction, ABG edge-close route emission,
evidence binding, assurance fold, residual/disposition projection, and
read-only lifecycle state query are present in the installed package and tied
to the runtime event path.

This does not make all odd_glc coverage waves ready. Requirement graph
derivation, goal refinement, multi-requirement decomposition, recursive
any-scale lifecycle composition, release interpretation, and downstream
software-delivery specialization remain odd_glc design work and, where marked,
future ABIogenesis upstream work. odd_sdlc remains a coverage witness, not the
source model.

## Consumed Identity

| Surface | Value |
| --- | --- |
| ABIogenesis product | `@abiogenesis/typescript-tenant@4.1.0-rc.12` |
| Release tag | `v4.1.0-rc.12` |
| Snapshot commit | `b4d4d9803ded88aff125c6ef8881e97989959fdf` |
| Installed package root | `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/lib/node_modules/@abiogenesis/typescript-tenant` |
| odd_glc install reference | `.ai-workspace/comments/codex/20260628T152507Z_ABG_RC12_install_reference.md` |
| Tarball SHA256 | `8212f394366337c373556f445068dd2728c2f9761e3f64d801b04124d40e7de5` |

The rc.12 release note records `npm run test:t164` and
`npm run test:t165:hello-world-live` as required and passed release evidence,
and states that odd_glc may consume `gtl.requirements` declarations plus
`abg.requirements` read/query surfaces for route-1 lifecycle proof while
requirement graph derivation and goal refinement remain deferred.

## Verification Anchors

- Public GTL surface:
  `build/semantic/code/src/gtl/requirements/index.d.ts:1-2` exports
  `declareRequirement`, `declareBundle`, `declareTraversalSpan`, and
  `declareLifecycleComposition`.
- Public ABG downstream query surface:
  `build/semantic/code/src/abg/requirements/index.d.ts:1-4` exports
  context/environment/projection/query functions and
  `projectLifecycleState`; it exports route types but not emitter functions.
- Runtime route context:
  `build/semantic/code/src/abg/m03/runner/engine_runner.js:1784-1809`
  constructs the requirement route context from
  `requirementRouteDeclarationBundle`.
- Runtime event gate:
  `build/semantic/code/src/abg/m03/runner/engine_runner.js:1749-1755`
  calls `emit(input.runtimeEvents, input.sink)` and appends to both
  `emittedEvents` and `replayEvents`.
- Edge-close bridge:
  `build/semantic/code/src/abg/m03/runner/engine_runner.js:1814-1844`
  emits requirement route facts for edge close from admitted evidence events,
  the real closure decision, and continuation transitions.
- Continuation join:
  `build/semantic/code/src/abg/m03/runner/engine_runner.js:4198-4210`
  passes the real continuation transition into
  `emitRequirementRouteForEdgeClose`.
- Release proof record:
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.12/release-note.md:78-107`
  names the build, route, live proof, lint, semantic test, diff, and pack gates.

## Public Facade Probe

The installed package was imported directly from the installed product root.
The public keys observed were:

```text
gtl.requirements:
  GTL_REQUIREMENTS_ALGEBRA_DECLARATION_KEY
  declareBundle
  declareLifecycleComposition
  declareRequirement
  declareTraversalSpan

abg.requirements:
  classifyAttenuation
  compileEdgeRequirementEnvironment
  projectAssuranceCase
  projectEdgeObligations
  projectExecutionSchedules
  projectLifecycleState
  projectMaterializationTargets
  queryActiveRequirements
  queryCurrentEvidenceBindings
  queryRequirementCompleteness
  queryRequirementReadModel
  queryRequirementStructuralState
  routeContextConstraint
```

No downstream-public emitter is present on the public facades. That preserves
the T-164 rule that admission and projection commands are ABG-runtime-internal.

## Readiness Map

| Generic lifecycle capability | GTL/ABG capability consumed | rc.12 evidence | Readiness | odd_glc impact | Next action |
| --- | --- | --- | --- | --- | --- |
| GTL requirement authoring | `gtl.requirements.declareRequirement`, `declareBundle`, traversal span declarations | Public facade exports in `gtl/requirements/index.d.ts:1-2`; rc.12 release note route-1 readiness lines 91-94 | ready for route-1 | odd_glc may bind RequirementSet surfaces to GTL declarations. | Use in route-1 design; do not create odd_glc-native requirement representation. |
| GTL lifecycle composition declaration | `gtl.requirements.declareLifecycleComposition` | Public facade export in `gtl/requirements/index.d.ts:1-2` | ready as a ref declaration surface | odd_glc may design a composition binding if it remains ref-only. | Ratified design must prove whether a composition is needed. |
| Context routing | `abg.requirements.routeContextConstraint` | Public facade export in `abg/requirements/index.d.ts:1`; route context built from declarations in runner lines 1784-1809 | ready for route-1 | Lifecycle context can be interpreted as ABG/GTL truth. | Consume as query/binding, not local context ledger. |
| Requirement environment projection | `abg.requirements.compileEdgeRequirementEnvironment` | Public facade export in `abg/requirements/index.d.ts:1`; release note route-1 readiness lines 91-94 | ready for route-1 | RequirementEnvironmentView can be a query/label over ABG projection. | Use in Hello World design. |
| Requirement graph derivation | derive/refine multi-requirement graph from goal pressure | No installed public function found for derive/refine search; release note says graph derivation remains deferred lines 91-94 | missing for parity waves beyond route-1 | odd_glc shall not synthesize a requirement compiler. | Open/retain upstream ABIogenesis work when multi-requirement decomposition is required. |
| Goal refinement | refinement from coarse lifecycle goal to requirement graph | No installed public function found for derive/refine search; release note says goal refinement remains deferred lines 91-94 | missing for parity waves beyond route-1 | Future any-scale decomposition remains upstream-blocked. | Upstream ABIogenesis ticket before closing broader decomposition coverage. |
| Obligation/materialization/schedule projection | `projectEdgeObligations`, `projectMaterializationTargets`, `projectExecutionSchedules` | Public facade exports in `abg/requirements/index.d.ts:1` | ready as public read/query projection for route-1 | odd_glc may interpret instruction sets from ABG projections. | Prove through route-1 design before implementation. |
| Destination topology | ABG `DestinationTopology` type and declaration binding | Public type export in `abg/requirements/index.d.ts:3`; GTL destination topology declaration type in `gtl/requirements/index.d.ts:2` | ready for route-1 declaration/query | DestinationTopologyAsset remains a label/query over ABG/GTL carrier. | Bind in design; do not mint native topology carrier. |
| Side-effecting execution | ABG actor/operator invocation and admitted runtime events | T-165 live proof is release evidence in release note lines 78-107; runner consumes `evidence_admitted` events in lines 1811-1833 | ready for route-1 proof | odd_glc can require execution-grounded proof without shelling out itself. | odd_glc supplies F_P/F_H policy declarations only. |
| Evidence admission and binding | admitted runtime evidence event to requirement binding | Runner filters admitted evidence events at lines 1811-1833; route emits via ABG event path at lines 1749-1755 | ready for route-1 | EvidenceBindingAsset is a query/label over admitted ABG binding truth. | Consume public query state; no boolean/path evidence in odd_glc. |
| Assurance fold | real closure decision to requirement fold | Edge close passes `assuranceFold.closureDecision` at lines 4198-4207; route emission appends to replay at lines 1749-1755 | ready for route-1 | AssuranceFoldView can interpret non-forgeable ABG fold truth. | Prove odd_glc query interpretation; do not expose emitter. |
| Residual and attenuation | requirement residual projection and attenuation query | Public `classifyAttenuation` export in `abg/requirements/index.d.ts:1`; route lifecycle state query available in line 2 | ready for route-1 | ResidualPressureView can read ABG projection truth. | Multi-cycle residual behavior still needs odd_glc design. |
| Continuation/re-entry disposition | ABG continuation transition joined into requirement lifecycle disposition | Continuation transition passed to edge-close route at lines 4198-4210; `projectLifecycleState` public in `abg/requirements/index.d.ts:2` | ready for route-1 | ReentryDecisionAsset can label ABG disposition truth. | Cyclic general-case routing remains design work; no local controller. |
| Lifecycle read model | `abg.requirements.projectLifecycleState` | Public facade export in `abg/requirements/index.d.ts:2`; route facts replayed into public query path | ready for route-1 | odd_glc can build read/query interpretation over ABG replay truth. | First odd_glc implementation should consume this, not recompute. |
| Public/private visibility guard | downstream-public queries only; emitters internal | Public facade probe omits emitters; `abg/requirements/index.d.ts` exports queries/types only | ready for route-1 | Prevents downstream construction of fold/residual/disposition truth. | Keep negative import/export proof in odd_glc design. |
| Non-forgeable admitted refs | nominal admitted refs resolved by ABG route | Route types exported; emitter/minting not downstream-public; T-164 proof recorded in rc.12 release gates | ready for route-1 | odd_glc receives refs from ABG queries and never mints them. | Ratified design must make no native AdmittedRef constructor or shim. |
| Recursive any-scale lifecycle composition | nested lifecycle over ABG zoom/foldback truth | Not proven by rc.12 route-1 release note; no odd_glc graph design exists yet | unwired for broader coverage | Cannot close full generic lifecycle scale claims yet. | Design odd_glc recursion over existing ABG truth; open upstream gap if ABG route lacks needed projection. |
| Release/readiness interpretation | lifecycle release proof over admitted route/evidence truth | No odd_glc release design yet; ABG route proof exists only as substrate | unwired in odd_glc | Release/proof coverage remains later wave. | Author requirements/design before code. |
| Future odd_sdlc specialization | software-delivery policy over odd_glc contracts | No downstream odd_sdlc specialization yet | unwired by scope | Parity cannot close inside odd_glc core work. | Treat as future downstream specialization after generic contracts are ratified. |

## Wave Classification

| Wave | Current state | Reason |
| --- | --- | --- |
| Hello World route-1 steel thread | ready substrate, odd_glc design pending | rc.12 contains public GTL/ABG surfaces, runtime route emission, replay path, and T-165 live proof evidence. |
| Minimal odd_glc consumption/read model | design pending | The ABG route is ready; odd_glc still needs ratified design and a build tenant before code. |
| Artifact construction and execution/evidence | partially ready | ABG route can carry route-1 live proof; broader artifact policy belongs to odd_glc/downstream specialization. |
| Fold/residual/disposition | ready substrate for route-1, design pending for general cycles | rc.12 emits and replays route facts; odd_glc must only interpret them. |
| Multi-requirement decomposition | upstream-blocked | Requirement graph derivation and goal refinement are deferred by rc.12 release note. |
| Recursive any-scale lifecycle | design/upstream-blocked | odd_glc product scope requires recursion, but route-1 does not prove any-scale nesting. |
| Ticket/gap/reprice | odd_glc design pending | STDO re-entry interpretation must be authored without a local controller. |
| Release/proof | odd_glc design pending | ABG route proof is substrate evidence, not an odd_glc release model. |
| Future odd_sdlc specialization | downstream pending | odd_sdlc is witness/deletion target; specialization is not built in odd_glc core. |

## Decision

T-002's original no-ready-slot finding is superseded for route-1 by the
installed rc.12 substrate. The correct current state is:

- route-1 GTL/ABG declaration, event-sourced requirements route, evidence,
  fold, residual, disposition, and lifecycle-state query are ready for odd_glc
  design consumption;
- requirement graph derivation and goal refinement are still missing/deferred
  for broader coverage;
- recursive any-scale lifecycle composition, release interpretation, and
  future odd_sdlc specialization are not closed by rc.12 and must remain later
  odd_glc/downstream work;
- odd_glc may proceed to route-1 graph/composition design, then tenant
  ratification, without creating local wrappers, carriers, event streams,
  admitted-ref minting, evidence admission, folds, residual stores, or re-entry
  controllers.
