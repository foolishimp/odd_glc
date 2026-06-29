---
id: T-006
title: Interpret artifact and evidence state from ABG route replay
type: implementation
ticket_category: route_evidence_interpretation
status: completed
goal: >-
  Add route-1 artifact and evidence interpretation over ABG-owned replay truth.
  The tenant shall read actor invocation, target artifact, admitted evidence,
  and requirement evidence-binding facts from a real ABIogenesis replay
  artifact, then produce odd_glc lifecycle vocabulary without executing,
  admitting, binding, folding, residualizing, minting refs, or invoking an F_P
  worker locally.
change_class: realization_refactor
re_entry_point: realization
owner: odd_glc
priority: high
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, route-1 artifact/evidence interpretation, ABIogenesis replay consumption
source_documents:
  - specification/GOALS.md
  - specification/requirements/REQ-GLC-BOUNDARY-AUTHORITY.md
  - specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md
  - specification/requirements/REQ-GLC-READ-QUERY-PROOF.md
  - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  - .ai-workspace/tickets/completed/T-005-prove-odd-glc-consumes-real-t165-route-replay.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-166-publish-requirements-route-replay-proof-artifact.md
affected_boundary:
  realization:
    - build_tenants/odd_glc/typescript/src/index.mjs
    - build_tenants/odd_glc/typescript/src/index.d.ts
  proof:
    - build_tenants/odd_glc/typescript/test/route-one-interpretation.test.mjs
target_truth: >-
  odd_glc can interpret TargetArtifactAsset, CapabilityAsset, and
  EvidenceBindingAsset meaning from ABIogenesis replay events. The view groups
  ABG actor invocation events, target artifact refs, admitted evidence events,
  and requirement evidence bindings. It classifies evidence as executed only
  when ABG replay contains completed actor invocation, complete non-deferred
  admitted evidence, and admitted requirement evidence binding.
superseded_truth: >-
  Route-1 proof consumption only interprets lifecycle disposition and cannot
  expose artifact/evidence lifecycle meaning without inspecting local files,
  stdout logs, or hand-built fixtures.
closure_law: >-
  Close only when `interpretEvidenceState` consumes ABIogenesis replay events
  from the T-166 artifact and proves target artifact refs, capability refs,
  admitted evidence, and requirement evidence bindings without introducing any
  odd_glc execution, admission, evidence binding, fold, residual, ref minting,
  or F_P invocation authority. Closure must include a negative test proving
  requirement evidence bindings alone are not treated as executed proof.
non_closure_conditions:
  - odd_glc reads local program files, stdout logs, prompt text, or transport
    files as proof truth.
  - odd_glc shells out, executes an artifact, or invokes an F_P worker.
  - odd_glc admits evidence, binds evidence to requirements, mints admitted
    refs, folds requirements, projects residuals, or resolves disposition.
  - A route evidence binding without ABG admitted evidence and completed actor
    invocation is classified as executed proof.
required_work:
  - Add a read-only `interpretEvidenceState` library surface.
  - Preserve source event refs, target artifact refs, capability refs, admitted
    evidence, and requirement evidence bindings.
  - Prove interpretation from the real ABIogenesis T-166 route replay artifact.
  - Add a negative route-binding-only proof.
proof_commands:
  - npm --prefix build_tenants/odd_glc/typescript test
  - git diff --check
---

# T-006: Artifact And Evidence Interpretation

## STDO Triage

### First Missing Layer

Realization.

T-005 proved odd_glc can consume real ABI route lifecycle disposition. The next
smallest build slice is artifact/evidence interpretation over the same replay
truth.

### Lawful Re-Entry

`realization_refactor`.

The requirements and route-1 design already authorize read/query
interpretation for TargetArtifactAsset, CapabilityAsset, and
EvidenceBindingAsset. This ticket implements that local read model without
changing GTL/ABG authority.

## Acceptance Checklist

- [x] `interpretEvidenceState` exists as a read-only library interface.
- [x] The view consumes ABG replay events, not local files or logs.
- [x] The view preserves target artifact refs from
      `actor_result_artifact_observed`.
- [x] The view preserves capability refs from ABG actor invocation events.
- [x] The view preserves admitted evidence refs from `evidence_admitted`.
- [x] The view preserves requirement bindings from
      `requirement_evidence_bound` route events.
- [x] The view classifies executed proof only when actor invocation, admitted
      evidence, and requirement binding are all present.
- [x] Negative proof shows route bindings alone remain
      `bound_without_runtime_evidence`.
- [x] `npm --prefix build_tenants/odd_glc/typescript test` passes.
- [x] `git diff --check` passes.

## Closure Evidence

Closed on 2026-06-29.

Consumed ABIogenesis artifact:

- committed fixture:
  `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t166-route-replay/20260628T175945864Z_pid34852/requirements-route-replay-artifact.json`
- committed fixture manifest:
  `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t166-route-replay/20260628T175945864Z_pid34852/requirements-route-replay-manifest.json`
- original ABI artifact:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/test_runs/t165_hello_world_requirements_route_live/20260628T175945864Z_pid34852/requirements-route-replay-artifact.json`
- artifact digest:
  `sha256:4ba42598bbf309b4568d5d167dc395f31799d32bd5b8fd7b78f76131494fd10e`

Proof:

```bash
npm --prefix build_tenants/odd_glc/typescript test
git diff --check
```

The proof passed 15 tests, including real ABI artifact/evidence
interpretation and the negative route-binding-only guard.
