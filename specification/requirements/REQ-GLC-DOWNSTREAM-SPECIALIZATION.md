# REQ-GLC-DOWNSTREAM-SPECIALIZATION - Downstream Program Contract

**Status**: Active
**Category**: Product Requirement / Downstream Specialization
**Date**: 2026-06-28
**Derives from**: [GOALS.md](../GOALS.md), [INTENT.md](../INTENT.md),
[PRODUCT.md](../PRODUCT.md),
[T-001](../../.ai-workspace/tickets/active/T-001-govern-minimal-odd-glc-requirements-and-graph-design.md),
[REQ-GLC-BOUNDARY-AUTHORITY](REQ-GLC-BOUNDARY-AUTHORITY.md),
[REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION](REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md),
`/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260626T011328Z_STRATEGY_requirements_algebra_edge_spans.md`

---

## Purpose

Define how downstream programs and products specialize `odd_glc`.

The rule is direct: downstream programs must use GTL/ABG. `odd_glc` supplies
general lifecycle meaning, asset vocabulary, policy interpretation, proof
interpretation, read/query overlays, and specialization constraints. It does
not become a replacement graph catalog, runtime, admission path, evidence
store, fold, residual system, continuation controller, or re-entry substrate.

## Scope

This requirement applies to:

- the first Hello World program slice;
- future `odd_sdlc` clean-start work;
- any domain program that claims to specialize `odd_glc`.

Downstream programs may add domain-specific assets, policies, proof
expectations, and semantic interpretation. Those additions remain downstream
specialization. They do not move GTL/ABG system assets or runtime truth into
`odd_glc`.

## Acceptance Criteria

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-001**: A downstream program that uses `odd_glc` shall express graph structure, graph-vector traversal, graph-function boundaries, interfaces, modules, jobs, and asset-surface bindings through GTL/ABG carriers.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-002**: A downstream program shall consume ABG runtime, admission, evidence, fold, residual, continuation, replay, and re-entry truth for lifecycle proof. It shall not treat `odd_glc` as a runtime or admission substitute.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-003**: A downstream program may specialize `odd_glc` lifecycle assets by adding domain-specific asset roles, schemas, evidence policies, and semantic proof interpretation. Those specializations shall remain bound to GTL nodes, interfaces, graph vectors, graph functions, and ABG admitted facts.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-004**: `odd_glc` shall not own a graph-function catalog as a system asset. Graph-function catalogs and publication surfaces belong to GTL/ABG. `odd_glc` may define lifecycle binding requirements over GTL/ABG-published graph functions and catalog entries.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-005**: A downstream program shall not close lifecycle work by calling local scripts, local service methods, or local controllers as substitute graph functions. Side-effecting execution shall enter through ABG-owned actor/operator invocation and admitted result carriers.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-006**: A downstream program shall not create product-local requirement compilers, closure ledgers, residual ledgers, retry loops, continuation controllers, replay stores, or re-entry routers to compensate for missing GTL/ABG capability.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-007**: When required GTL/ABG capability is missing, placeholder, test-only, unwired, unpinned, forgeable, or disconnected from the required runtime/query path, the downstream program shall block, defer, or reprice. It shall not claim lifecycle closure through `odd_glc`.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-008**: Future `odd_sdlc` clean-start work shall specialize `odd_glc` through GTL/ABG carriers and admitted ABG runtime truth. Existing odd_sdlc phase names, local ledgers, retry loops, closure rules, and software-domain policies shall not become generic `odd_glc` law.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-009**: The Hello World slice shall demonstrate the downstream-program rule by treating the program artifact as a downstream binding over `TargetArtifactAsset`, while graph structure, execution, admission, evidence, fold, residual, and re-entry remain GTL/ABG-owned substrate concerns.

**REQ-GLC-DOWNSTREAM-SPECIALIZATION-010**: Ratified graph design shall identify which lifecycle bindings are generic `odd_glc` meaning and which graph-function, graph-vector, actor/operator, admission, evidence, fold, residual, and re-entry surfaces are GTL/ABG system assets.
