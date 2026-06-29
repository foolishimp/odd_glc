---
id: T-010
title: Prove JavaScript tenant/test Hello World ladder rung
type: implementation
ticket_category: scenario_ladder_proof
status: completed
goal: >-
  Prove SCN-GLC-HELLO-WORLD-JS-TENANT-TEST by consuming the committed
  digest-pinned ABI rc17 T-173 generic proof-evidence replay fixture and
  interpreting distinct product-artifact, verifier-artifact, verifier-execution,
  admitted evidence, evidence-binding, assurance fold, residual, and
  disposition truth without local odd_glc runtime, admission, fold, residual,
  execution, or re-entry authority.
change_class: realization_refactor
re_entry_point: build_tenant_proof
owner: odd_glc
priority: high
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, scenario ladder, ABI rc17 replay consumption
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-LADDER.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-JS-TENANT-TEST.md
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t173-generic-proof-evidence/README.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-173-publish-generic-proof-evidence-replay-proof.md
affected_boundary:
  goals:
    - specification/GOALS.md
  scenarios:
    - specification/scenarios/SCN-GLC-HELLO-WORLD-LADDER.md
    - specification/scenarios/SCN-GLC-HELLO-WORLD-JS-TENANT-TEST.md
  design:
    - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  realization:
    - build_tenants/odd_glc/typescript/src/index.mjs
    - build_tenants/odd_glc/typescript/src/index.d.ts
    - build_tenants/odd_glc/typescript/substrate.provenance.json
  proof:
    - build_tenants/odd_glc/typescript/test/route-one-interpretation.test.mjs
    - build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t173-generic-proof-evidence/
target_truth: >-
  odd_glc proves the JavaScript tenant/test ladder rung by reading real ABI
  replay/query truth and preserving ABG refs for subject artifact,
  verifier/test artifact, verifier execution, admitted evidence, evidence
  bindings, assurance fold, residual, and lifecycle disposition.
superseded_truth: >-
  A local JavaScript test run, local stdout assertion, hand-built route event
  array, or odd_glc-local test-evidence carrier is enough to close the rung.
closure_law: >-
  Close only when an installed test consumes the committed digest-pinned ABI
  T-173 replay artifact of record, not a hand-built event array, and asserts
  that odd_glc preserves ABG refs while keeping all execution, admission,
  evidence binding, fold, residual, disposition, replay, and re-entry authority
  in ABI.
non_closure_conditions:
  - The proof constructs route events by hand instead of reading the committed
    ABI T-173 fixture of record.
  - The proof relies on JavaScript source text, expected stdout, or local file
    assertions without admitted ABG evidence refs.
  - odd_glc executes JavaScript, invokes a test runner, admits evidence, binds
    evidence, folds requirements, residualizes, resolves disposition, emits
    events, or mints admitted refs.
  - Subject artifact, verifier artifact, verifier execution, evidence-binding,
    fold, residual, or disposition refs from the ABI artifact are lost,
    rewritten, or replaced by odd_glc-native refs.
  - The proof treats JavaScript/test semantics as ABI or odd_glc policy instead
    of downstream/plugin policy over generic evidence roles.
required_work:
  - Retarget the tenant substrate provenance from ABI rc16 to rc17.
  - Commit the ABI T-173 replay artifact and manifest as the fixture of record.
  - Add proof assertions for distinct subject-artifact, verifier-artifact,
    verifier-execution, semantic-interpretation, evidence-binding, fold, and
    disposition refs.
  - Preserve negative authority tests for odd_glc and the consumed ABI public
    facade.
proof_commands:
  - npm --prefix build_tenants/odd_glc/typescript test
  - rg -n "4.1.0-rc.17|T-010|SCN-GLC-HELLO-WORLD-JS-TENANT-TEST" specification build_tenants .ai-workspace/tickets/active
  - git diff --check
---

# T-010: JavaScript Tenant/Test Hello World Ladder Proof

## STDO Triage

### First Missing Layer

Build-tenant proof.

ABI rc17 now publishes the generic proof-evidence substrate that this rung was
waiting for. The missing odd_glc work is to consume the replay artifact as
read-only truth and interpret it as lifecycle evidence coverage.

### Lawful Re-Entry

`realization_refactor`.

This ticket does not change product scope, requirement law, graph authority, or
ABI runtime authority. It proves read-only odd_glc interpretation over
already-published ABI rc17 route truth.

## Boundary

odd_glc may:

- read the ABI T-173 replay artifact of record;
- verify its digest through the committed fixture manifest;
- call ABI public query/read facade functions;
- map ABI read models into lifecycle vocabulary;
- preserve ABG refs in returned lifecycle, evidence, and assurance views.

odd_glc shall not:

- execute JavaScript or a test runner;
- admit payloads or evidence;
- mint admitted refs;
- emit runtime events;
- bind evidence;
- fold requirements;
- project residuals;
- resolve disposition or re-entry;
- own replay truth.

## Acceptance Checklist

- [x] Tenant substrate provenance points at ABI rc17.
- [x] ABI T-173 replay artifact and manifest are committed as the fixture of
      record.
- [x] Fixture digest verification is asserted before interpretation.
- [x] Subject artifact, verifier artifact, verifier execution, semantic
      interpretation, evidence-binding, fold, residual, and disposition refs
      are preserved from ABI truth.
- [x] Negative authority tests still reject emit/admit/fold/residual/re-entry
      surfaces.
- [x] Proof commands pass.

## Closure Evidence

Closed on 2026-06-29.

Proof:

```bash
npm --prefix build_tenants/odd_glc/typescript test
rg -n "4.1.0-rc.17|T-010|SCN-GLC-HELLO-WORLD-JS-TENANT-TEST" specification build_tenants .ai-workspace/tickets/active
git diff --check
```

The installed test
`proves SCN-GLC-HELLO-WORLD-JS-TENANT-TEST over the committed ABI T-173 replay artifact`
consumes the digest-pinned T-173 fixture of record, verifies the manifest
digest, preserves ABI refs for `asset`, `test_source`, `test_execution`, and
`semantic_interpretation` evidence roles, and keeps all execution, admission,
evidence binding, fold, residual, disposition, replay, and re-entry authority
in ABI.
