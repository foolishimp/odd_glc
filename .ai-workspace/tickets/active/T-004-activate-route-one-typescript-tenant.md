---
id: T-004
title: Activate route-1 TypeScript tenant and implement lifecycle interpretation
type: implementation
ticket_category: realization_refactor
status: active
goal: >-
  Activate the first odd_glc realization tenant as a TypeScript-compatible
  read/query and policy-interpretation library over ABIogenesis 4.1.0-rc.12
  public GTL/ABG surfaces. Implement only route-1 lifecycle interpretation:
  F_D validation, F_P/F_H policy declarations, and read-only lifecycle-state
  interpretation over ABG public query output. Do not implement local graph
  functions, runtime, event replay, admitted-ref minting, evidence admission,
  fold, residual, or re-entry authority.
change_class: design_reframe
re_entry_point: build_tenant
downstream_reentry_sequence:
  - realization_refactor
owner: odd_glc
priority: critical
created_at: 2026-06-29
updated_at: 2026-06-29
governance_scope: STDO Method, ODD Method, Design Module Method, route-1 tenant activation, GTL/ABG consumption
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/REQ-GLC-BOUNDARY-AUTHORITY.md
  - specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md
  - specification/requirements/REQ-GLC-READ-QUERY-PROOF.md
  - specification/requirements/REQ-GLC-RELEASE-OPERATIONAL-FEEDBACK.md
  - specification/requirements/REQ-GLC-DOWNSTREAM-SPECIALIZATION.md
  - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  - .ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md
affected_boundary:
  build_tenant:
    - build_tenants/odd_glc/typescript/
  tenant_registry:
    - build_tenants/TENANT_REGISTRY.md
target_truth: >-
  The first tenant is active and contains a minimal library interface that
  consumes ABG public query facades by dependency injection, validates lifecycle
  surface bindings, declares F_P/F_H policy overlays as data, and interprets
  ABG lifecycle-state read models as odd_glc lifecycle vocabulary.
superseded_truth: >-
  odd_glc has only design authority and no source realization line for route-1
  read/query interpretation.
closure_law: >-
  Close only when the tenant registry activates one tenant path, the tenant
  implements the route-1 read/query interpretation interface, tests exercise
  the implementation against the installed ABIogenesis public ABG facade, and
  negative tests prove forbidden local runtime authority is not exposed. No
  local graph-function catalog, event stream, admitted-ref minting, evidence
  admission, fold, residual store, evaluator invocation, retry loop, or
  re-entry controller can count as closure.
evaluation_criteria:
  - Tenant source lives under `build_tenants/odd_glc/typescript/`.
  - Public API is library-shaped and deterministic.
  - ABG public query facade is consumed by dependency injection.
  - The tenant does not import or expose ABG runtime-internal emitters.
  - F_D checks validate finite structure only.
  - F_P/F_H surfaces are declarations, not worker or controller invocations.
  - Lifecycle interpretation is derived from ABG public query/read-model
    output and replay facts.
  - Negative tests reject forbidden facade functions and unknown disposition
    refs.
non_closure_conditions:
  - The tenant shells out, calls an F_P worker, or runs side effects.
  - The tenant constructs `AdmittedRef` values or calls ABG projection emitters.
  - The tenant creates a native event stream, replay store, closure enum,
    residual ledger, retry loop, or re-entry controller.
  - The tenant interprets local files, command status, or fixture text as proof
    without ABG public query/replay truth.
required_work:
  - Activate the tenant in `build_tenants/TENANT_REGISTRY.md`.
  - Add the route-1 library package under `build_tenants/odd_glc/typescript/`.
  - Implement lifecycle surface binding validation.
  - Implement F_P/F_H policy declaration helpers as data-only surfaces.
  - Implement lifecycle-state interpretation over ABG `projectLifecycleState`.
  - Add route-1 and negative-regression tests.
proof_commands:
  - npm --prefix build_tenants/odd_glc/typescript test
  - node --input-type=module -e 'const m = await import("./build_tenants/odd_glc/typescript/src/index.mjs"); for (const name of m.FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES) { if (Object.hasOwn(m, name)) throw new Error(`forbidden export ${name}`); }'
  - git diff --check
---

# T-004: Activate Route-1 TypeScript Tenant

## STDO Triage

### First Missing Layer

Realization tenant.

T-001 ratified the route-1 design and kept the tenant inactive. The next
smallest lawful step is to activate one tenant and implement the minimal
read/query interpretation interface.

### Lawful Re-Entry

`design_reframe`, then `realization_refactor`.

The tenant path is a design decision recorded in the registry. The code change
is local realization beneath that tenant.

## Acceptance Checklist

- [x] Tenant registry activates `build_tenants/odd_glc/typescript/`.
- [x] Tenant package exists with source and tests.
- [x] Public API validates ABG public query facades without importing internal
      emitters.
- [x] Public API interprets ABG lifecycle-state read models into odd_glc
      lifecycle vocabulary.
- [x] F_P/F_H policy surfaces are data declarations only.
- [x] Negative tests cover forbidden emitters, unknown disposition refs, and
      absence of local runtime authority exports.
- [x] Proof commands pass.
