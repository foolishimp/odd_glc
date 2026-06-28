# T-002 odd_sdlc Feature Readiness Comparison

**Status**: Posted
**Date**: 2026-06-28
**Ticket**: [T-002](../../tickets/active/T-002-discover-gtl-abg-substrate-gap-for-odd-glc-build.md)
**Scope**: Supplemental read model comparing the odd_glc GTL/ABG substrate
readiness map with features that existed in `odd_sdlc`.

This report is commentary. It does not modify `odd_sdlc`, `odd_glc`
requirements, or ABIogenesis.

## Audited Source Identity

- Audited `odd_sdlc` source: `/Users/jim/src/apps/odd_sdlc`, git `52d1962`.
- The audited `odd_sdlc` worktree was clean at inspection.
- This report audits the live `odd_sdlc` source project, not a frozen
  `odd_sdlc` fixture embedded inside ABIogenesis test data.
- ABIogenesis substrate referenced by the audited `odd_sdlc` source:
  `@abiogenesis/typescript-tenant@4.1.0-rc.11`.

## Summary

`odd_sdlc` did not consume the T-162 requirements-algebra substrate. A direct
search of `odd_sdlc` specification, design, and TypeScript source found no
uses of `RequirementEvidenceBinding`, `RequirementFoldProjection`,
`RequirementResidualProjection`, `EdgeRequirementEnvironment`,
`DestinationTopology`, `routeContextConstraint`,
`buildEdgeRequirementEnvironment`, `bindRequirementEvidence`,
`foldRequirementEvidence`, `residualizeRequirementFolds`,
`classifyRequirementAttenuation`, or related requirements-algebra names.

`odd_sdlc` did consume adjacent GTL/ABG contract-law and runtime features:
GTL program conformance, selected `abg.fn_composition`, public start intent,
ABG process actor execution, runtime/replay truth, consequence traversal
actions, graph re-entry point validation, and ABG-owned result-envelope /
continuation surfaces.

The important distinction is therefore:

- ABG runtime endpoints existed and were used by `odd_sdlc`.
- The requirements-algebra middle was not used by `odd_sdlc`.
- `odd_sdlc` filled that middle with local SDLC carriers and functions:
  `SdlcRequirementClosureRegister`, `SdlcEdgeEvidenceAdmission`,
  `SdlcEdgeResidualPressure`, `SdlcEdgeAssuranceCloseDecision`,
  `SdlcEdgeFulfillmentLedger`, `SdlcEdgeClosureDecision`, and
  `SdlcNextActionProjection`.

This matches the Claude review refinement: execution/admission endpoints are
not the same problem as requirement evidence binding, requirement fold,
requirement residual, and requirement re-entry. The endpoints can be consumed
from ABG; the middle must be upstreamed or deferred, not copied from
`odd_sdlc`.

All rows inherit a pinning caveat: `odd_sdlc` consumes
`@abiogenesis/typescript-tenant@4.1.0-rc.11` from a release-snapshot tarball,
not a stable pinned product release.

## Status Vocabulary

- `gtl_abg_used`: `odd_sdlc` consumed a GTL/ABG feature directly.
- `local_sdlc`: `odd_sdlc` had an equivalent, but it was product-local.
- `mixed`: `odd_sdlc` used GTL/ABG at one boundary and local SDLC carriers in
  the middle.
- `missing`: no equivalent feature was found.

## Comparison Map

| Feature | T-002 substrate state | Did it exist in `odd_sdlc`? | Used by `odd_sdlc` from GTL/ABG? | odd_sdlc status | Evidence | odd_glc implication |
| --- | --- | --- | --- | --- | --- | --- |
| Requirement authoring | `unwired` | Yes, as local imported authority, proof claims, and closure register. | No T-162 GTL requirement declarations were found in `odd_sdlc`. | `local_sdlc` | `projection/requirement_closure.ts` defines proof claims at lines 16-44 and `SdlcRequirementClosureRegister` at lines 105-133. | `odd_glc` should bind requirement authoring to GTL declarations, not copy the SDLC closure register. |
| GTL composition / binding declaration | `missing` for a requirements-algebra lifecycle route | Yes, for graph-program conformance and compute-stage binding. | Yes for GTL contract law and ABG conformance; no for requirements-algebra lifecycle composition. | `gtl_abg_used` / partial | `PRODUCT.md` lines 137-176 declares the GTL/ABG contract-law gate. `gtl_conformance/program.ts` imports `admitGtlProgramConformanceInput` and `typecheckGtlProgram` at lines 18-29 and calls them at lines 3375-3400. | Use this pattern for a future GTL composition declaration, but do not claim the requirements-algebra route exists yet. |
| Context observation / gap routing | `test_only` upstream | Yes, as local gap observation, triage, and route surfaces. | No `routeContextConstraint` consumption was found. | `local_sdlc` | `graph/catalog.ts` declares `observe_gap_pressure`, `classify_gap_triage`, and `bind_gap_route` at lines 493-512. | Lifecycle gap routing must be ABG-provided or marked deferred; odd_glc should keep only query labels/policy overlays. |
| Requirement environment projection | `test_only` upstream | Yes, as local requirement fulfillment and query-domain projections. | No `EdgeRequirementEnvironment` consumption was found. | `local_sdlc` | `query_domain.ts` projects `SdlcRequirementFulfillmentPublicProjection` from local closure registers and edge ledgers at lines 952-1133. | `RequirementEnvironmentViewAsset` must remain a view over ABG when available, not an odd_glc carrier. |
| Requirement graph derivation / goal refinement | `missing` upstream | Weak adjacent equivalent only: SDLC graph catalog, overlays, and depth decomposition. | Yes for generic GTL graph conformance; no for T-162 requirement-graph derivation. | `mixed` / weak partial | `graph/catalog.ts` declares `decompose_residual_feature_depth` at lines 120-145. That is depth decomposition, not a T-162 requirement graph derivation function. `PRODUCT.md` lines 157-168 lists GTL graph and composition law consumed by SDLC. | Treat odd_sdlc as evidence that decomposition behavior is needed, not as ownership precedent. Upstream should publish generic derivation/refinement if odd_glc needs it. |
| Edge obligations and work pressure | `test_only` upstream | Yes, as local edge obligations, schedules, ledgers, and pressure refs. | No ABG `projectRequirements` / materialization / execution schedule path was consumed. | `local_sdlc` | `edge_gain_closure.ts` derives SDLC edge obligations at lines 247-267. `graph/catalog.ts` carries test/release/operational work surfaces at lines 350-438 and 441-490. | This is one of the main odd_sdlc-local ledgers that odd_glc must not recreate. |
| Destination topology | `test_only` upstream | Adjacent graph topology existed through graph catalogs, overlays, start targets, and traversal selections. | Yes for GTL graph/vector/public-start carriers; no `DestinationTopology` requirements-algebra carrier was found. | `mixed` | `public_start.ts` imports ABG `StartIntent` and runtime traversal selections at lines 8-21 and admits start intent at lines 1298-1322. | odd_glc may consume GTL graph/public-start topology, but a requirements `DestinationTopology` binding remains upstream/deferred. |
| Side-effecting capability and execution | ABG generic endpoint ready-ish/unpinned; requirements binding `unwired` | Yes. | Yes, directly through ABG `invokeSupervisedProcessActor`. | `gtl_abg_used` | `installed_operator.ts` imports `invokeSupervisedProcessActor` at lines 23-57 and calls it at lines 3499, 4095, and 4974. | Do not defer ABG-owned program execution itself; defer the requirement binding middle. |
| Payload and evidence admission | ABG generic endpoint ready-ish/unpinned; requirements binding `unwired` | Yes, but split. | Mixed: ABG result-envelope and runtime admission were consumed; SDLC edge evidence admission was local. | `mixed` | `PRODUCT.md` lines 79-89 describes ABG result-envelope ingress. `edge_gain_closure.ts` defines `SdlcEdgeEvidenceAdmission` and `admitSdlcEdgeEvidence` at lines 50-76 and 270-348. | odd_glc should consume ABG runtime evidence admission, then wait for an upstream bridge into `RequirementEvidenceBinding`. |
| Evidence binding to requirements | `test_only` upstream | Yes, as local binding of evidence to SDLC edge obligations. | No `RequirementEvidenceBinding` consumption was found. | `local_sdlc` | `edge_gain_closure.ts` admits SDLC evidence by obligation refs at lines 270-348. Tests exercise this path, for example `test_t164_edge_gain_closure_contract.test.mjs` calls `admitSdlcEdgeEvidence`. | Do not copy `SdlcEdgeEvidenceAdmission`; require ABG requirement evidence binding. |
| Assurance fold and assurance case | `test_only` upstream for requirement fold; generic ABG assurance endpoint ready-ish/unpinned | Yes, as local SDLC edge assurance close decision and closure decision. | Mixed: SDLC product claims ABG assurance/continuation truth, but requirement fold was not consumed. | `mixed` | `edge_gain_closure.ts` derives local residual and close decision at lines 497-560. `traversal_consequence.ts` defines `SdlcEdgeClosureDecision` at lines 207-235 and derives closure at lines 1159-1443. | Use ABG assurance endpoints where they exist, but do not treat SDLC edge closure as a generic lifecycle fold. |
| Residual and attenuation | `test_only` upstream | Yes, as SDLC residual pressure refs. | No `RequirementResidualProjection` / attenuation path was consumed. | `local_sdlc` | `edge_gain_closure.ts` defines `SdlcEdgeResidualPressure` at lines 121-133 and derives it at lines 497-516. `traversal_consequence.ts` carries residual refs in ledgers and next-action projections at lines 175, 229, and 288. | odd_glc must wait for ABG requirement residuals or classify the slot deferred. |
| Re-entry disposition | Generic ABG continuation/re-entry endpoint ready-ish/unpinned; requirement residual bridge `unwired` | Yes, with local next-action projection over ABG graph re-entry constraints. | Mixed: ABG graph re-entry point and consequence traversal action are consumed, but SDLC selects the decision locally. | `mixed` | `traversal_consequence.ts` imports ABG re-entry/action types at lines 4-16, validates ABG `GraphReentryPoint` at lines 430-473, constructs consequence traversal action at lines 2138-2200, and admits it against the ABG allowed catalog at lines 2201-2205. | odd_glc can consume ABG re-entry endpoints, but requirement residual-to-disposition remains upstream work. |
| Release and operational feedback | Outside the T-002 requirements-algebra middle | Yes, as SDLC release, build, deployment, runtime observation, and retrofit surfaces. | Mostly local SDLC graph functions over ABG runtime substrate. | `local_sdlc` | `graph/catalog.ts` declares release readiness at lines 421-438 and operational/runtime-return surfaces at lines 441-490. | This is downstream specialization evidence, not generic lifecycle substrate readiness. |

## Direct Answer

The features mostly existed in `odd_sdlc`, but not as GTL/ABG
requirements-algebra consumption.

`odd_sdlc` used GTL/ABG for:

- GTL graph/program conformance;
- selected `abg.fn_composition`;
- public start intent and runtime traversal selections;
- ABG-owned process execution;
- generic runtime/replay/continuation/re-entry endpoints;
- consequence traversal action admission against an ABG allowed catalog.

`odd_sdlc` implemented locally:

- requirement closure register;
- requirement fulfillment public view;
- edge evidence admission;
- edge gain measurement;
- edge residual pressure;
- edge assurance close decision;
- edge fulfillment ledger;
- edge closure decision;
- next-action projection;
- gap triage and routing surfaces.

Missing from `odd_sdlc` as GTL/ABG consumption:

- requirements-algebra lifecycle composition;
- ABG requirement environment consumption;
- ABG requirement evidence binding;
- ABG requirement fold consumption;
- ABG requirement residual/attenuation consumption;
- requirement residual to continuation/re-entry bridge.

## Carrier To Capability Migration Map

This comparison is also a migration map for a future clean `odd_sdlc` rebuild.
The local SDLC carriers prove the concern is real, but their replacement target
is upstream GTL/ABG capability, not an `odd_glc` copy. The mapping is not a
line-for-line port; it names the generic substrate slot that should absorb each
local carrier once wired.

| odd_sdlc local carrier or function | Generic upstream replacement target | Why it matters |
| --- | --- | --- |
| `SdlcRequirementClosureRegister` and `SdlcRequirementFulfillmentPublicProjection` | ABG requirement ledger, `EdgeRequirementEnvironment`, requirement fold/residual read models | Requirement closure is lifecycle-generic. A rebuild should project it from ABG requirement truth, not maintain a product-local closure register. |
| `SdlcEdgeEvidenceAdmission` / `admitSdlcEdgeEvidence` | `RequirementEvidenceBinding` over ABG-admitted evidence events | Evidence binding is generic. The product may interpret evidence meaning, but admission and binding authority belong upstream. |
| `SdlcEdgeGain`, `SdlcEdgeObligationGain`, and `deriveSdlcEdgeObligations` | ABG requirement obligation, materialization-target, execution-schedule, and evidence-expectation projections | Work pressure and obligation projection recur across ODD domains; they should be system-function outputs. |
| `SdlcEdgeResidualPressure` | `RequirementResidualProjection` plus attenuation classification | Residual pressure is the central re-entry input. It must be replay/query truth, not a product-local residual store. |
| `SdlcEdgeAssuranceCloseDecision` | ABG requirement fold and assurance-case projection over admitted assurance closure truth | Assurance fold is lifecycle-generic; the product should read the fold, not compute a parallel close state. |
| `SdlcEdgeFulfillmentLedger` | replay-derived ABG requirement ledger and requirement projection events | Fulfillment state should be reconstructed from admitted events and projections, not held in a peer ledger. |
| `SdlcEdgeClosureDecision` | ABG assurance/continuation transition plus requirement fold disposition | Close/retry/block semantics must be downstream interpretation over ABG transition truth, not a second closure enum. |
| `SdlcNextActionProjection` | ABG continuation/re-entry disposition joined with requirement residuals | The next action is a query over runtime/replay truth. Product policy may rank or label it, but should not own the controller. |
| `observe_gap_pressure`, `classify_gap_triage`, `bind_gap_route` | ABG context routing, residual classification, and lawful re-entry projection with product policy overlays | Gap routing is lifecycle-generic when it decides re-entry; downstream products should specialize labels and policy only. |

## Design Consequence

`odd_sdlc` is useful as a migration map and failure-mode warning. It is not a
source of generic lifecycle ownership.

For T-001, `odd_glc` should:

1. keep ABG execution/admission endpoints in scope where directly consumable;
2. classify the requirements-algebra middle as missing, test-only, or unwired;
3. avoid minting `odd_glc` equivalents of SDLC's local ledgers, closure
   decisions, residual stores, or next-action routers;
4. use `odd_sdlc` feature names only as downstream specialization examples
   after the generic GTL/ABG substrate is real and pinned.
