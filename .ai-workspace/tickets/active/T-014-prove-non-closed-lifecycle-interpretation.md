---
id: T-014
title: Prove non-closed lifecycle interpretation
type: implementation
ticket_category: realization_refactor
status: active
goal: >-
  Prove that odd_glc interprets execution-grounded ABI non-closed
  requirements-route replay truth as lifecycle residual, continuation,
  re-entry, or blocked state without owning runtime, retry, residual, fold, or
  re-entry authority.
change_class: realization_refactor
re_entry_point: code
owner: odd_glc
priority: critical
created_at: 2026-06-30
reopened_at: 2026-06-30
reopen_reason: >-
  The consumed ABI T-167 fixture is an installed engine-mechanics artifact, not
  a live execution-grounded proof. Its producer uses an in-test evaluator stub
  that defaults closeDisposition to no_close, and its requirement source carries
  the non-closure answer. It cannot serve as the fixture-of-record for
  downstream non-closed lifecycle parity.
governance_scope: STDO Method, ODD Method, GTL/ABG consumption, non-closed lifecycle interpretation
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/REQ-GLC-READ-QUERY-PROOF.md
  - specification/requirements/REQ-GLC-BOUNDARY-AUTHORITY.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-167-publish-non-closed-requirements-route-replay-artifact.md
closure_law: >-
  Close only when odd_glc consumes a digest-pinned ABI live non-closed replay
  artifact and proves non-closed lifecycle interpretation from ABG replay/query
  truth. The proof shall not use hand-built route events, in-test evaluator
  close-disposition stubs, prompt- or requirement-carried answers, local
  residual stores, retry controllers, local disposition selection, or ABG
  runtime-internal emitters.
non_closure_conditions:
  - The proof invents residual or disposition truth outside ABI replay/query.
  - odd_glc emits, admits, folds, residualizes, retries, or routes re-entry.
  - The consumed artifact is not digest-pinned in substrate provenance.
  - The consumed artifact source run kind is not live execution-grounded.
  - The ABI producer uses a stubbed `closeDisposition`, result marker, or
    answer-carrying requirement/prompt to force non-closure.
  - The ABI run directory lacks live worker or process-capture evidence.
  - The test accepts route-event count greater than zero instead of specific
    residual, fold, disposition, and continuation/re-entry assertions.
required_work:
  - Classify the existing ABI T-167 fixture as synthetic engine-mechanics
    regression input, not a closure fixture-of-record.
  - Open or consume the upstream ABI ticket that publishes a live non-closed
    route artifact.
  - Replace the current non-closed fixture-of-record with the live ABI artifact
    once published.
  - Preserve read-only non-closed lifecycle interpretation over ABI replay
    truth.
  - Add tests proving residual and non-closed disposition interpretation from
    the live artifact, including exact oracles and at least one discriminating
    positive/negative fixture where the interpreted result changes causally.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
current_state:
  - Existing odd_glc read/query interpretation code remains boundary-clean.
  - Existing ABI T-167 fixture remains useful as an engine-mechanics regression.
  - Existing ABI T-167 fixture is not accepted as execution-grounded closure
    evidence for this ticket.
---

# T-014: Non-Closed Lifecycle Interpretation

This is odd_glc read/query work only. ABI owns the emitted residual,
continuation, re-entry, and block truth.

The prior 2026-06-30 closure is reopened. The defect is not that odd_glc wrote
runtime truth; it did not. The defect is that the upstream artifact being
interpreted was authored by a test stub rather than discovered through a live
F_P or executable subject. odd_glc must wait for ABI to publish a live
non-closed replay artifact, then consume that artifact read-only.
