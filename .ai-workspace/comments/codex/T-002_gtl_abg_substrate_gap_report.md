# T-002 GTL/ABG Substrate Gap Report

**Status**: Posted
**Date**: 2026-06-28
**Ticket**: [T-002](../../tickets/active/T-002-discover-gtl-abg-substrate-gap-for-odd-glc-build.md)
**Scope**: Discovery read model for odd_glc consumption of the current
ABIogenesis GTL/ABG build.

This report is commentary. It does not change odd_glc requirement law and does
not modify ABIogenesis.

## Summary

The current ABIogenesis build has substantial requirements-algebra carriers and
pure projection functions. The synthetic T-162 proof passes. The live T-162
harness exists and was invoked, but it skipped because the live env was not
enabled.

The substrate is not ready for odd_glc lifecycle closure. The blocking gap is
not absence of names. The gap is wiring and admission: the requirement-algebra
functions are exported and tested, but they are not generally called from the
ABG runtime/query path, and the evidence/fold/residual/re-entry chain is not
published as an end-to-end, non-forgeable system-function substrate for
downstream products.

T-001 graph design can use this report to mark affected lifecycle slots as
deferred or blocked. It shall not close the Hello World steel thread against
the current substrate.

## Audited Source Identity

- odd_glc source: `/Users/jim/src/apps/odd_glc`, git `b12bc3e`.
- ABIogenesis source: `/Users/jim/src/apps/abiogenesis`, git `271a6d4`.
- ABIogenesis TypeScript tenant: `@abiogenesis/typescript-tenant 4.1.0-rc.11`.
- ABIogenesis worktree had one unrelated modified file:
  `build_tenants/abiogenesis/python/design/abiogenesis.code-workspace`.
- odd_glc worktree is already dirty from the active T-001/T-002 specification
  work.

## Commands Run

```sh
rg -n "routeContextConstraint|buildEdgeRequirementEnvironment|projectRequirements|projectMaterializationTargets|projectExecutionSchedules|bindRequirementEvidence|foldRequirementEvidence|residualizeRequirementFolds|classifyRequirementAttenuation|projectAssuranceCase|constructDestinationTopology" /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
rg -n "routeContextConstraint\\(|buildEdgeRequirementEnvironment\\(|projectRequirements\\(|projectMaterializationTargets\\(|projectExecutionSchedules\\(|bindRequirementEvidence\\(|foldRequirementEvidence\\(|residualizeRequirementFolds\\(|classifyRequirementAttenuation\\(|projectAssuranceCase\\(|constructDestinationTopology\\(" build_tenants/abiogenesis/typescript/code/src
rg -n "routeContextConstraint\\(|buildEdgeRequirementEnvironment\\(|projectRequirements\\(|projectMaterializationTargets\\(|projectExecutionSchedules\\(|bindRequirementEvidence\\(|foldRequirementEvidence\\(|residualizeRequirementFolds\\(|classifyRequirementAttenuation\\(|projectAssuranceCase\\(|constructDestinationTopology\\(" build_tenants/abiogenesis/typescript/test_env
npm run test:t162
node --test test_env/live/test_t162_requirements_algebra_live.test.mjs
git diff --check
```

Observed verification:

- `npm run test:t162` passed: 21 tests, 21 pass.
- `node --test test_env/live/test_t162_requirements_algebra_live.test.mjs`
  skipped one live test because `ABG_TS_T162_LIVE=1` or `CODEX_LIVE_FP=1` was
  not set.
- No non-test caller was found for the T-162 requirement-algebra projection
  functions outside their own module definitions.

## Readiness Map

| Lifecycle slot | Required GTL/ABG capability | ABIogenesis spec authority | ABIogenesis build evidence | Runtime/query caller evidence | Readiness state | odd_glc closure impact | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Requirement authoring | GTL requirement declaration carriers or wrappers preserving identity, relations, spans, context refs, evidence-policy refs, and projection refs. | GTL requirement wrappers are required by `REQ-L-GTL3-REQUIREMENTS-ALGEBRA` lines 12-18 and AC-001..009 lines 22-38. | `gtl/m01/contracts/requirements_algebra.ts` defines `GtlRequirementDeclaration`, relation, traversal span, authority context, destination topology, test relation, and bundle carriers at lines 6-100; constructors at lines 124-181. `gtl/m01/contracts/index.ts` exports requirement-algebra declarations and constructors at lines 49-63. | Exported from GTL M01. No runtime caller was found in `code/src` beyond constructors and exports. | `unwired` | `RequirementSetAsset` may be specified as GTL-bound, but odd_glc cannot claim end-to-end admitted requirement authoring through a runtime/query path. | ABIogenesis should expose/admit GTL requirement declarations through the public program/admission path, or T-001 must mark requirement authoring as a deferred upstream dependency. |
| GTL composition or binding declaration | A GTL composition/binding surface over GTL/ABG system functions. | GTL compose/graph-function requirements exist outside T-002; odd_glc consumption law allows at most a GTL composition over system functions. | Package exports GTL M01/M02 and ABG M03 modules from `package.json` lines 16-31, but no odd_glc lifecycle composition declaration exists. | No composition was found that wires the requirements-algebra functions into a reusable public lifecycle route. | `missing` | odd_glc cannot ratify a named lifecycle route as a real GTL composition today. | Create upstream GTL/ABG ticket for a public requirements-algebra composition/binding route, or defer the route in odd_glc graph design. |
| Context observation and gap routing | ABG context ingestion and context-constraint routing. | ABG requires staged authority context fragments and routing at `REQ-R-ABG3-REQUIREMENTS-ALGEBRA` lines 54-55 and environment projection at lines 62-63. | `AuthorityContextFragment` carrier exists at `abg/m03/contracts/requirements_algebra.ts` lines 214-223. `routeContextConstraint` exists at lines 1806-1826. Synthetic test covers routing at `test_t162_requirements_algebra.test.mjs` lines 424-431 and live harness uses it at lines 563-568. | `rg` found no non-test caller for `routeContextConstraint(` outside `requirements_algebra.ts`. | `test_only` | `LifecycleContextAsset` can be a query label in design, but no closeable lifecycle slot may depend on context routing as runtime-ready truth. | Wire context routing into ABG runtime/query service or mark context routing as deferred in T-001 graph design. |
| Requirement environment projection | ABG edge requirement environment projection. | ABG AC-009 requires edge environments from staged context, active spans, prior folds, and residuals at lines 62-63. | `EdgeRequirementEnvironment` carrier exists at lines 412-423. `buildEdgeRequirementEnvironment` exists at lines 1724-1797 and carries active terms, spans, context, destination topologies, prior folds, and residuals. Synthetic tests cover active projection, span coverage, carried residuals, and multi-span projection. | `rg` found no non-test caller outside definitions. The function is used in tests and the live harness at lines 555-558. | `test_only` | `RequirementEnvironmentViewAsset` cannot close as runtime-ready; design must list it as test-only/unwired until a query path exists. | Publish a callable ABG query path for edge requirement environments. |
| Requirement graph derivation and goal refinement | ABG/GTL derivation/refinement from requirement terms. | ABG first slice covers stable requirement identity, typed relations, spans, and query/read models at lines 24-38; relation law at lines 50-52. | Carriers for terms, relations, and projections exist at lines 175-260. `projectRequirements` derives active obligation projections at lines 1828-1866. No function named `derive_requirement_graph` or `refine_goal` was found in the inspected build. | Only projection functions and tests were found. No public derivation/refinement runtime path was found. | `missing` | odd_glc cannot claim generic decomposition/refinement capability. | Upstream should either publish the derivation/refinement system functions or odd_glc design must omit/defer those slots. |
| Edge obligations and work pressure | ABG obligation, materialization-target, execution-schedule, and evidence-expectation projection. | ABG AC-011..013 require obligation/materialization/execution projections at lines 66-70. | `projectRequirements` lines 1828-1866, `projectMaterializationTargets` lines 1868-1887, and `projectExecutionSchedules` lines 1889-1910 exist. Synthetic tests cover projection precedence and admitted schedule command at `test_t162_requirements_algebra.test.mjs` lines 472-479. | No non-test callers were found outside definitions. | `test_only` | `InstructionSetAsset` cannot close as a runtime-ready lifecycle handoff. | Wire these projections into a public ABG query/runtime path. |
| Destination topology | ABG `DestinationTopology` carrier and admitted topology path. | ABG AC-006 requires destination topology as HOW constraint at lines 56-57. | `DestinationTopology` carrier exists at lines 225-231; admitted payload exists at lines 335-339; constructor exists at lines 765-777; ledger includes destination topologies at lines 1562 and 1585-1587. | Constructor used in tests and live harness, but no runtime caller was found. | `test_only` | `DestinationTopologyAsset` must remain a query/label over test-only upstream capability for now. | Wire destination topology admission/query into ABG runtime path. |
| Side-effecting capability and execution | ABG actor/operator invocation for proof execution. | odd_glc boundary requires proof execution to be ABG-owned; ABG runtime/transport requirements cover actor invocation outside requirements algebra. | `invokeSupervisedProcessActor` exists at `abg/m03/transport/process_actor.ts` lines 243-460 and emits process lifecycle, stream, and probe events. | ABG tests and frozen downstream harnesses call the actor. No ABIogenesis `code/src` caller was found that connects actor results to the requirements-algebra path. | `unwired` | `CapabilityAsset` cannot close a requirements-algebra lifecycle slot until execution/admission output is bound into requirements evidence. | Upstream should bridge actor invocation result refs into requirement evidence admission/binding. |
| Payload and evidence admission | ABG payload/evidence admission for command, exit status, stdout/stderr, artifact refs, digests, and provenance. | ABG requirements algebra AC-014..018 requires evidence distinction and non-closing behavior at lines 72-80. Runtime evidence carriers exist outside the requirement family. | `EvidenceAdmittedRuntimeEvent` exists at `carriers.ts` lines 1208-1226; constructor exists at `event_factories.ts` lines 762-790. `engine_runner.ts` emits evidence-admitted events for plugin result envelopes at lines 1264-1280 and FP findings at lines 2360-2378. | Runtime evidence admission exists. No code path was found that converts those runtime evidence events into `RequirementEvidenceBinding` automatically. | `unwired` | Evidence can be admitted by ABG, but odd_glc cannot close requirement evidence binding from runtime truth without a bridge. | Upstream should add a requirements-evidence bridge from ABG evidence events to `bindRequirementEvidence` inputs. |
| Evidence binding | ABG evidence binding to active requirement projections. | ABG AC-014..018 require evidence role separation and current evidence behavior at lines 72-80. | `RequirementEvidenceBinding` exists at lines 261-273; admitted payload exists at lines 353-357; `bindRequirementEvidence` exists at lines 1927-1978. Synthetic tests cover admitted source/execution/byproduct distinction at lines 481-524 and path forgery rejection at lines 526-542. Live harness manually binds semantic evidence at lines 580-591. | No non-test caller was found. Binding currently takes an `admitted: boolean` input rather than consuming `EvidenceAdmittedRuntimeEvent` directly. | `test_only` | `EvidenceBindingAsset` cannot close a lifecycle proof slot. | Wire `bindRequirementEvidence` to ABG evidence-admitted runtime events and active requirement projections. |
| Assurance fold and assurance case | ABG non-forgeable assurance fold and assurance-case projection. | ABG AC-019 and AC-022 require folds over existing assurance/continuation truth and assurance-case read models at lines 82-88. | `RequirementFoldProjection` exists at lines 275-285; `foldRequirementEvidence` exists at lines 2104-2136; `projectAssuranceCase` exists at lines 2245-2270. `requirementAbgTruthRefFromAssuranceClosureDecision` exists at lines 2010-2028 and validates encoded projection digest at lines 2030-2058. Synthetic tests reject synthetic/forged refs at lines 1087-1101. Live harness derives an assurance decision at lines 430-454 and manually feeds its truth ref into the fold at lines 597-605. | No non-test runtime caller was found. The fold function is not called by ABG runner/assurance code; live proof manually invokes it in the test harness. | `test_only` | `AssuranceFoldViewAsset` blocks lifecycle closure. This is the main non-closure gate. | Upstream should wire requirement folds to ABG assurance closure decisions in the runtime/query path and publish non-forgeable fold projection as a system function. |
| Residual and attenuation | ABG residual projection preserving span, pressure class, owner surface, evidence refs, source fold refs, and attenuation class. | ABG AC-020..021 require residual projection and attenuation at lines 84-86. | `RequirementResidualProjection` exists at lines 287-298; `residualizeRequirementFolds` exists at lines 2154-2182; `classifyRequirementAttenuation` exists at lines 2184-2243. Synthetic tests cover residualization and attenuation; T-162 passed. | No non-test caller was found. Residuals are derived after test-driven fold calls, not runtime fold events. | `test_only` | `ResidualPressureViewAsset` cannot close or route re-entry. | Upstream should wire residual projection after runtime requirement folds and preserve residuals in replay/query. |
| Re-entry disposition | ABG continuation, correction, re-entry, release, or block facts tied to runtime/replay truth. | ABG requirements algebra AC-019..020 says requirement folds/residuals map over existing assurance, continuation, and evaluate-next truth at lines 82-84. | Runtime continuation projection exists in `continuation_transition.ts`: dispositions include close, retry, yield, reprice, block at lines 30-38; assurance rows map to iteration satisfaction at lines 378-444; transition derivation exists at lines 737-760. Graph-span re-entry carriers and projections exist in `graph_span_reentry.ts` lines 53-206, and engine/runtime authoring code calls re-entry functions. | Runtime continuation/re-entry exists, but no code path was found mapping requirement residuals into those runtime re-entry facts or exposing a requirement-specific disposition. | `unwired` | `ReentryDecisionAsset` must defer; odd_glc cannot choose release/repair/reprice/block from requirement residual truth yet. | Upstream should bridge requirement residual/fold outcomes into ABG continuation/re-entry disposition or publish a query joining both. |

## Capability Classification Notes

`ready` was not assigned to any odd_glc-consuming lifecycle slot in this
discovery. Several capabilities are implemented and tested, but T-002 requires
readiness to mean public, pinned, callable from the expected runtime/query
path, and proven by non-forgeable evidence. Exported pure functions plus tests
do not meet that bar.

`test_only` means the function is exercised in T-162 tests or the live harness,
but no non-test runtime/query caller was found. This applies to environment
projection, context routing, obligation projection, destination topology,
evidence binding, fold, assurance-case projection, residual, and attenuation.

`unwired` means a related ABG runtime capability exists, but the requirement
algebra does not consume or publish it through the needed lifecycle path. This
applies to actor/operator execution, runtime evidence admission, and
continuation/re-entry.

`missing` means the expected named upstream function or route was not found in
the inspected build. This applies to a public GTL lifecycle composition route
and to explicit requirement graph derivation / goal refinement functions.

## Direct Answer: What GTL/ABG Needs

GTL/ABG needs a public requirements-algebra system-function route that is more
than exported pure helpers. At minimum:

1. GTL must publish requirement declarations and a composition/binding surface
   for the requirements-algebra route.
2. ABG must expose a query/runtime path for edge requirement environments,
   context routes, obligations, materialization targets, execution schedules,
   destination topology, evidence bindings, folds, residuals, attenuation,
   assurance claims, and re-entry disposition.
3. ABG must bridge process actor execution and runtime `evidence_admitted`
   events into `RequirementEvidenceBinding`.
4. ABG must bridge assurance closure decisions into requirement folds without a
   test harness manually passing `sourceAbgTruthRefs`.
5. ABG must bridge requirement residuals into continuation/re-entry or publish
   a joined query that lets odd_glc interpret lawful disposition without
   becoming a controller.

## Impact On T-001

T-001 graph design may be authored as a deferred design, but it cannot ratify a
closeable Hello World steel thread against the current upstream state.

Required graph-design classifications:

- Requirement authoring: `unwired`
- GTL lifecycle composition route: `missing`
- Context routing: `test_only`
- Requirement environment projection: `test_only`
- Requirement graph/refinement: `missing`
- Obligation/work pressure projection: `test_only`
- Destination topology: `test_only`
- ABG execution/admission bridge: `unwired`
- Evidence binding: `test_only`
- Assurance fold: `test_only`
- Residual/attenuation: `test_only`
- Re-entry disposition: `unwired`

The lawful T-001 outcome is therefore design deferral or upstream dependency,
not closure.

## Recommended Upstream ABIogenesis Tickets

1. **Publish requirements-algebra system route**: expose a public GTL/ABG route
   over context routing, environment projection, obligations, execution
   schedules, evidence binding, fold, residual, attenuation, assurance case,
   and re-entry disposition.
2. **Wire runtime evidence to requirement evidence binding**: consume
   `EvidenceAdmittedRuntimeEvent` and active requirement projections to produce
   admitted `RequirementEvidenceBinding` events without manual `admitted:
   true` inputs.
3. **Wire assurance closure to requirement fold**: produce
   `RequirementFoldProjection` from real ABG assurance closure decisions in a
   runtime/query path.
4. **Wire requirement residuals to continuation/re-entry**: preserve residual
   pressure in ABG replay and expose a disposition query for release, repair,
   reprice, block, or continuation.
5. **Publish requirement graph/refinement functions**: provide explicit
   `derive_requirement_graph` / `refine_goal` or remove those names from
   downstream expectations.

## T-002 Closure Assessment

T-002 discovery output is now present and sourced. From Codex's side, the
requested discovery and posting work is complete. The ticket should remain
active until reviewed and accepted as the readiness map.
