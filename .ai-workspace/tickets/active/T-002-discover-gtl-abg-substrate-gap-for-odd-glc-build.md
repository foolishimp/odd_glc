---
id: T-002
title: Discover GTL/ABG substrate gap for odd_glc lifecycle build readiness
type: discovery
ticket_category: upstream_gap_analysis
status: completed
goal: >-
  Discover the gap between the GTL/ABG functionality required by odd_glc and
  the current ABIogenesis build. The result shall classify every required
  upstream capability as ready, missing, placeholder, test_only, unwired, or
  unpinned, with evidence references and downstream closure impact.
change_class: requirement_reprice
re_entry_point: requirements
downstream_reentry_sequence:
  - design_reframe
owner: odd_glc
priority: critical
created_at: 2026-06-28
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, GTL/ABG consumption, ABIogenesis build readiness, odd_glc non-closure gate
source_documents:
  - specification/PRODUCT.md
  - specification/requirements/REQ-GLC-BOUNDARY-AUTHORITY.md
  - specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md
  - specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-MINIMAL.md
  - .ai-workspace/tickets/active/T-001-govern-minimal-odd-glc-requirements-and-graph-design.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-REQUIREMENTS-ALGEBRA.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENTS-ALGEBRA.md
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/m01/contracts/requirements_algebra.ts
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/requirements_algebra.ts
  - .ai-workspace/comments/codex/20260628T152507Z_ABG_RC12_install_reference.md
affected_boundary:
  odd_glc_requirements:
    - specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md
  odd_glc_design:
    - build_tenants/common/design/
  abiogenesis_build_read_model:
    - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/
    - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/
    - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/
  installed_substrate_reference:
    - /Users/jim/src/apps/odd_glc/.abiogenesis/toolchain-binding.json
    - /Users/jim/src/apps/odd_glc/.abiogenesis/typescript-installer-manifest.json
output_artifacts:
  - .ai-workspace/comments/codex/T-002_gtl_abg_substrate_gap_report.md
  - .ai-workspace/comments/codex/T-002_odd_sdlc_feature_readiness_comparison.md
  - .ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md
  - optional upstream-ticket recommendations for ABIogenesis when a missing or
    unwired capability is confirmed
target_truth: >-
  odd_glc has a sourced, reviewable readiness map for the GTL/ABG substrate it
  must consume. The map distinguishes specification claims, exported carriers,
  callable implementation, test-only exercise, live runtime use, admission
  path, non-forgeable evidence, and pinned source identity. T-001 graph design
  can then consume the readiness map without guessing or filling upstream gaps
  inside odd_glc.
superseded_truth: >-
  odd_glc can proceed to ratified graph design by seeing similarly named
  functions in ABIogenesis code or tests, without proving those functions are
  public, wired, admitted, non-forgeable, and callable from the required
  runtime/query path.
closure_law: >-
  Close only when the discovery report lists every GTL/ABG capability required
  by odd_glc, cites the current ABIogenesis specification and build evidence
  for each one, assigns a readiness state, explains the downstream odd_glc
  closure impact, and identifies whether the gap belongs in GTL, ABG, odd_glc
  design deferral, or downstream specialization. No implementation change,
  odd_glc compatibility wrapper, local ledger, or graph-design ratification can
  count as closure for this ticket.
evaluation_criteria:
  - Discovery uses odd_glc requirement authority, not comments alone, as the
    list of required upstream capabilities.
  - Discovery inspects ABIogenesis live specification, TypeScript build code,
    exported public surfaces, synthetic tests, live tests, and runtime callers.
  - Every required capability receives one of the readiness states from
    `REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION`: ready, missing,
    placeholder, test_only, unwired, or unpinned.
  - A capability is marked ready only when it has admitted carrier truth,
    pinned source or release identity, callable runtime/query path where
    applicable, and non-forgeable evidence.
  - The report distinguishes carrier existence from system-function readiness.
  - The report distinguishes unit-test exercise from live/runtime path wiring.
  - The report distinguishes evidence binding from ABG-owned side-effecting
    execution and admission.
  - The report names every odd_glc lifecycle slot blocked by each upstream gap.
  - The report recommends whether the next action is an ABIogenesis upstream
    ticket, odd_glc design deferral, or downstream specialization work.
non_closure_conditions:
  - The ticket only names the suspected gap.
  - The report relies on function names without inspecting exports, callers,
    tests, and runtime/admission paths.
  - A function is marked ready because it appears in a synthetic or live test
    but has no non-test runtime/query caller.
  - A fold, residual, evidence, continuation, or re-entry capability is marked
    ready while forgeable, placeholder, narrowing-only, unwired, or unpinned.
  - odd_glc creates a local wrapper, local carrier, local fold, local residual
    store, execution shell, retry controller, or compatibility ledger to close
    the gap.
  - T-001 graph design is ratified before this ticket reports the upstream
    readiness states consumed by that design.
required_capability_audit:
  - GTL requirement declaration carriers or wrappers preserving requirement
    identity, relations, spans, context refs, evidence-policy refs, and
    projection refs.
  - GTL composition or binding declaration over GTL/ABG system functions.
  - ABG context ingestion and context-constraint routing.
  - ABG edge requirement environment projection.
  - ABG requirement graph derivation and goal refinement.
  - ABG edge obligation, materialization-target, and execution-schedule
    projection.
  - ABG `DestinationTopology` carrier and admitted topology path.
  - ABG actor/operator invocation for side-effecting proof.
  - ABG payload and evidence admission for command, exit status, stdout/stderr,
    artifact refs, digests, and provenance.
  - ABG evidence binding to active requirement projections.
  - ABG non-forgeable assurance fold and assurance-case projection.
  - ABG residual projection preserving span, pressure class, owner surface,
    evidence refs, source fold refs, and attenuation class.
  - ABG continuation, correction, re-entry, release, and block disposition
    facts tied to runtime/replay truth.
known_inspection_targets:
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/m01/contracts/requirements_algebra.ts
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/requirements_algebra.ts
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/graph_span_reentry.ts
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/contracts/continuation_transition.ts
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/transport/
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03/runner/
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/tests/test_t162_requirements_algebra.test.mjs
  - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/live/test_t162_requirements_algebra_live.test.mjs
proof_commands:
  - rg -n "routeContextConstraint|buildEdgeRequirementEnvironment|projectRequirements|projectMaterializationTargets|projectExecutionSchedules|bindRequirementEvidence|foldRequirementEvidence|residualizeRequirementFolds|classifyRequirementAttenuation|projectAssuranceCase|constructDestinationTopology" /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
  - rg -n "foldRequirementEvidence\\(|bindRequirementEvidence\\(|residualizeRequirementFolds\\(|classifyRequirementAttenuation\\(" /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env
  - rg -n "process_actor|actor/operator|payload admission|RequirementEvidenceBinding|DestinationTopology|continuation|re-entry|reentry|release|block" /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/m03
  - rg -n "ready|missing|placeholder|test_only|unwired|unpinned" specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md .ai-workspace/tickets/active/T-002-discover-gtl-abg-substrate-gap-for-odd-glc-build.md
  - test -f .ai-workspace/comments/codex/T-002_gtl_abg_substrate_gap_report.md
  - test -f .ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md
  - git diff --check
---

# T-002: Discover GTL/ABG Substrate Gap For odd_glc Build Readiness

## STDO Triage

### First Missing Layer

Gap analysis.

`odd_glc` has product and requirement authority that says it must consume
GTL/ABG truth rather than implement generic construction locally. The next
missing layer is a sourced discovery report comparing that required substrate
to the current ABIogenesis build.

### Lawful Re-Entry

`requirement_reprice`, then `design_reframe`.

The discovery may refine odd_glc consumption requirements if a required
upstream capability is misclassified or unnamed. It may also block or defer
later graph design. It does not authorize odd_glc runtime implementation.

## Discovery Question

What functionality must GTL/ABG provide before odd_glc can lawfully ratify a
lifecycle graph/composition design, and what is the current readiness state of
each required capability in the ABIogenesis build?

## Required Output Shape

The discovery report shall include a table with these columns:

| Lifecycle slot | Required GTL/ABG capability | ABIogenesis spec authority | ABIogenesis build evidence | Runtime/query caller evidence | Readiness state | odd_glc closure impact | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- |

Every row shall cite concrete files and, where possible, line references.
Unknown readiness is not ready.

## Boundary

This ticket may read ABIogenesis source, tests, design notes, and specification.
It shall not modify ABIogenesis code or specification. It shall not create
odd_glc implementation shims. If upstream implementation work is required, the
output is an upstream ticket recommendation, not a local workaround.

## Initial Suspected Gap

The currently suspected gap is that several requirements-algebra carriers and
functions exist in ABIogenesis build code or tests, but odd_glc still needs to
prove whether they are public, pinned, callable from the required runtime/query
path, tied to ABG-owned execution/admission, and non-forgeable.

Known high-risk areas include assurance fold, residual projection, evidence
binding, side-effecting execution/admission, and continuation/re-entry
disposition.

## Discovery Result

Posted report:
`.ai-workspace/comments/codex/T-002_gtl_abg_substrate_gap_report.md`.

Supplemental odd_sdlc comparison:
`.ai-workspace/comments/codex/T-002_odd_sdlc_feature_readiness_comparison.md`.
The comparison pins the audited live `odd_sdlc` checkout and maps local SDLC
carriers to the upstream GTL/ABG capabilities that should replace them.

Installed substrate reference:
`.ai-workspace/comments/codex/20260628T152507Z_ABG_RC12_install_reference.md`.
This pins the local ABIogenesis `4.1.0-rc.12` install used by later
requirements-route design and proof review.

Initial finding: no odd_glc-consuming lifecycle slot was classified `ready`.
The ABIogenesis build contains useful GTL/ABG carriers, exported pure
functions, synthetic tests, and a skipped live harness, but the inspected
requirements-algebra path is not yet public, pinned, runtime/query-wired, and
non-forgeable enough for odd_glc to close T-001 proof or ratify a lifecycle
composition design.

Post-`4.1.0-rc.12` refresh:
`.ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md`.
The installed rc.12 package carries the T-164 requirements route and T-165
Hello World live-proof surfaces. Route-1 GTL/ABG declaration, event-sourced
requirements route emission, evidence binding, assurance fold, residual,
disposition, and public lifecycle-state query are now classified ready for
odd_glc route-1 design consumption.

The refresh does not close every coverage wave. Requirement graph derivation,
goal refinement, multi-requirement decomposition, recursive any-scale lifecycle
composition, release interpretation, and future odd_sdlc specialization remain
deferred, unwired, or design-pending as recorded in the refresh. odd_glc shall
not fill those gaps with local requirement compilers, event streams, admitted
ref minting, evidence admission, folds, residual ledgers, re-entry controllers,
or odd_sdlc compatibility ledgers.

## Acceptance Checklist

- [x] Discovery report exists under `.ai-workspace/comments/codex/`.
- [x] Report lists every required GTL/ABG capability from the odd_glc
      consumption requirement.
- [x] Report cites ABIogenesis specification and build evidence for each
      capability.
- [x] Report distinguishes carriers, functions, exports, tests, runtime
      callers, admission paths, and non-forgeability.
- [x] Report assigns readiness state for every capability.
- [x] Report names the odd_glc lifecycle slots blocked or deferred by each gap.
- [x] Report recommends upstream ABIogenesis tickets or odd_glc deferrals
      without creating local substitutes.
- [x] Post-rc.12 refresh verifies the installed ABIogenesis route and
      classifies route-1 readiness separately from upstream-blocked broader
      coverage waves.
- [x] `git diff --check` passes.
