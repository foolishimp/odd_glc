---
id: T-007
title: Interpret assurance fold and residual pressure from ABG replay
type: implementation
ticket_category: assurance_residual_interpretation
status: completed
goal: >-
  Add read-only assurance fold and residual-pressure interpretation over ABG
  requirement-route replay events. The first proof shall consume the real
  T-166 closed Hello World replay artifact for satisfied fold coverage and a
  bounded event-shaped residual unit for residual classification. Full cyclic
  re-entry proof remains outside this ticket until an ABIogenesis proof
  artifact carries residual/re-entry pressure from a non-closed route.
change_class: realization_refactor
re_entry_point: realization
owner: odd_glc
priority: high
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, route-1 assurance/residual interpretation, ABIogenesis replay consumption
source_documents:
  - specification/GOALS.md
  - specification/requirements/REQ-GLC-BOUNDARY-AUTHORITY.md
  - specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md
  - specification/requirements/REQ-GLC-READ-QUERY-PROOF.md
  - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-166-publish-requirements-route-replay-proof-artifact.md
affected_boundary:
  realization:
    - build_tenants/odd_glc/typescript/src/index.mjs
    - build_tenants/odd_glc/typescript/src/index.d.ts
  proof:
    - build_tenants/odd_glc/typescript/test/route-one-interpretation.test.mjs
target_truth: >-
  odd_glc can interpret AssuranceFoldViewAsset and ResidualPressureViewAsset
  meaning from ABG route replay events. It preserves fold refs, fold states,
  evidence refs, source ABG truth refs, residual refs, disposition refs, and
  source event refs while leaving fold/residual creation and re-entry routing
  in ABG.
superseded_truth: >-
  odd_glc lifecycle state interpretation is enough to claim assurance and
  residual coverage, even when no fold/residual view preserves the ABG proof
  sources needed for audit.
closure_law: >-
  Close only when `interpretAssuranceState` consumes ABG route replay events,
  proves the real T-166 satisfied fold path, and proves residual-pressure
  classification from replay-shaped events without introducing local fold,
  residual, retry, continuation, or re-entry authority. Full cyclic re-entry
  closure requires a later ticket and a non-closed ABG replay artifact.
non_closure_conditions:
  - odd_glc computes a fold or residual from evidence directly.
  - odd_glc creates a writable closure enum, fold ledger, residual store, retry
    route, continuation, or re-entry controller.
  - The proof relies on local files, stdout logs, or prompt text instead of ABG
    route replay events.
  - The ticket claims full cyclic re-entry proof from a closed-path replay with
    no residual events.
required_work:
  - Add a read-only `interpretAssuranceState` library surface.
  - Preserve fold, residual, disposition, evidence, and source truth refs from
    route replay events.
  - Prove satisfied assurance over the real ABIogenesis T-166 artifact.
  - Prove residual-pressure classification from event-shaped route facts.
proof_commands:
  - npm --prefix build_tenants/odd_glc/typescript test
  - git diff --check
---

# T-007: Assurance Fold And Residual Pressure Interpretation

## STDO Triage

### First Missing Layer

Realization.

T-005 and T-006 proved disposition and artifact/evidence consumption. The next
smallest local build slice is assurance fold and residual-pressure
interpretation over replay events.

### Lawful Re-Entry

`realization_refactor`.

The requirements already authorize read-only fold/residual interpretation.
This ticket does not authorize local fold/residual construction or cyclic
re-entry control.

## Acceptance Checklist

- [x] `interpretAssuranceState` exists as a read-only library interface.
- [x] The view consumes ABG route replay events, not local files or logs.
- [x] The view preserves fold refs, fold states, evidence refs, and source ABG
      truth refs.
- [x] The view preserves residual refs and residual payloads when present.
- [x] The real T-166 artifact proves the closed satisfied-fold path.
- [x] A residual event-shaped unit proves residual-pressure classification
      without claiming cyclic re-entry proof.
- [x] `npm --prefix build_tenants/odd_glc/typescript test` passes.
- [x] `git diff --check` passes.

## Closure Evidence

Closed on 2026-06-29.

Proof:

```bash
npm --prefix build_tenants/odd_glc/typescript test
git diff --check
```

The proof passed 17 tests. The real ABIogenesis T-166 artifact proves the
closed-path `assurance_satisfied` interpretation. A bounded event-shaped
residual unit proves `residual_pressure` classification. This ticket does not
claim full cyclic re-entry proof; that remains dependent on a future ABG replay
artifact with residual/re-entry pressure.
