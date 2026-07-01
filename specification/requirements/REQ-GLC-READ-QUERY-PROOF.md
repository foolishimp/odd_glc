# REQ-GLC-READ-QUERY-PROOF - Lifecycle Read, Query, And Proof Surfaces

**Status**: Active
**Category**: Product Requirement / Read-Query-Proof Contract
**Date**: 2026-06-29
**Derives from**: [GOALS.md](../GOALS.md), [PRODUCT.md](../PRODUCT.md),
[REQ-GLC-BOUNDARY-AUTHORITY](REQ-GLC-BOUNDARY-AUTHORITY.md),
[REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS](REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md),
[REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION](REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md),
[T-001](../../.ai-workspace/tickets/completed/T-001-govern-minimal-odd-glc-requirements-and-graph-design.md)
**Related families**:
[REQ-GLC-DOWNSTREAM-SPECIALIZATION](REQ-GLC-DOWNSTREAM-SPECIALIZATION.md),
[REQ-GLC-RELEASE-OPERATIONAL-FEEDBACK](REQ-GLC-RELEASE-OPERATIONAL-FEEDBACK.md)

---

## Purpose

Define how `odd_glc` may read, query, and interpret lifecycle proof over
admitted GTL/ABG truth.

This family prevents lifecycle views from becoming a second event stream,
requirement ledger, evidence admission path, fold, residual store, evaluator,
or controller. `odd_glc` proof surfaces are interpretation and policy
surfaces. ABG owns runtime truth and GTL owns declaration truth.

## Scope

This requirement governs:

- the first Hello World steel-thread proof;
- future generic lifecycle read models;
- downstream program proof interpretation;
- F_D finite checks, F_P semantic policy surfaces, and F_H decision surfaces.

It does not define a native runtime, evaluator process, proof engine, event
store, admitted-ref minting path, or release artifact.

## Acceptance Criteria

**REQ-GLC-READ-QUERY-PROOF-001**: `odd_glc` read and query surfaces shall consume admitted GTL declarations, ABG `replayEvents`, or ABG public query projections. They shall not invent lifecycle truth from side arrays, local files, comments, generated reports, or query-lazy construction.

**REQ-GLC-READ-QUERY-PROOF-002**: `odd_glc` shall not emit runtime events, maintain replay authority, admit payloads or evidence, mint `AdmittedRef` values, fold requirement state, project residuals, or construct continuation/re-entry truth.

**REQ-GLC-READ-QUERY-PROOF-003**: A lifecycle read model shall preserve source GTL declaration refs, ABG carrier refs, event refs, digests, provenance, upstream readiness state, and lifecycle surface identity needed for audit and replay.

**REQ-GLC-READ-QUERY-PROOF-004**: Lifecycle closure labels shall be interpretations over ABG assurance fold, residual, and disposition truth. They shall not define a second writable closure enum or make ABG `no_evidence`, blocked, failed, partial, residual, or closed states product-local authority.

**REQ-GLC-READ-QUERY-PROOF-005**: F_D checks may validate finite structure: required refs exist, kinds match, readiness states permit consumption, public surfaces are used, forbidden local emitters are absent, and admitted evidence refs resolve. F_D shall not infer semantic satisfaction, product acceptability, owner risk, or next action.

**REQ-GLC-READ-QUERY-PROOF-006**: F_P surfaces may define semantic judgment prompts, rubrics, evidence expectations, and interpretation policy as declarations consumed by GTL/ABG or downstream specialization. `odd_glc` shall not invoke an F_P worker, shell a process, or treat F_P text output as admitted proof outside ABG admission.

**REQ-GLC-READ-QUERY-PROOF-007**: F_H surfaces may define owner, risk, escalation, release/readiness, reprice, or block policy. F_H decisions shall enter lifecycle proof through admitted GTL/ABG refs or lawful STDO re-entry surfaces, not through a hidden odd_glc controller.

**REQ-GLC-READ-QUERY-PROOF-008**: A proof claim shall be execution-grounded when it concerns side effects. Command success, stdout/stderr, artifacts, digests, and capability use shall count only when produced or admitted by ABG-owned actor/operator and evidence paths.

**REQ-GLC-READ-QUERY-PROOF-009**: A proof claim shall be event-sourced and replay-derived. The same lifecycle proof state shall be recoverable from admitted ABG replay/query truth without relying on mutable process memory, local test-only data, or odd_glc side state.

**REQ-GLC-READ-QUERY-PROOF-010**: A proof claim shall be non-tautological. The prompt, declaration, expected output, or test input shall not carry the answer being proved as the proof result.

**REQ-GLC-READ-QUERY-PROOF-011**: Ratified design and implementation tests shall include negative proof where applicable: no native graph-function catalog, no shadow carriers, no local event stream, no local admitted-ref minting, no boolean evidence, no local fold/residual store, and no downstream-public projection emitter.

**REQ-GLC-READ-QUERY-PROOF-012**: The first steel-thread proof shall consume the ABIogenesis route-1 public surfaces recorded in T-002's readiness refresh and the current pinned ABIogenesis substrate provenance. It shall not re-prove ABG route emission inside odd_glc; it shall prove odd_glc interpretation of ABG-owned route truth.

**REQ-GLC-READ-QUERY-PROOF-013**: A lifecycle query shall fail closed when required upstream truth is `missing`, `placeholder`, `test_only`, `unwired`, `unpinned`, forgeable, or absent from the required runtime/query path.

**REQ-GLC-READ-QUERY-PROOF-014**: Downstream specializations may add domain proof policy and query overlays, but those overlays shall remain bound to GTL/ABG carriers and ABG replay truth.
