---
id: T-009
title: Prove basic CLI Hello World ladder rung
type: implementation
ticket_category: scenario_ladder_proof
status: completed
goal: >-
  Prove SCN-GLC-HELLO-WORLD-CLI-BASIC as the first Hello World ladder rung by
  consuming the committed digest-pinned ABI rc16 route replay fixture and
  interpreting artifact, capability, admitted evidence, evidence binding,
  assurance fold, residual, and disposition without local odd_glc runtime,
  admission, fold, residual, or re-entry authority.
change_class: realization_refactor
re_entry_point: build_tenant_proof
owner: odd_glc
priority: high
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, scenario ladder, ABI rc16 replay consumption
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-LADDER.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-CLI-BASIC.md
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t166-route-replay/README.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-166-publish-requirements-route-replay-proof-artifact.md
affected_boundary:
  goals:
    - specification/GOALS.md
  scenarios:
    - specification/scenarios/SCN-GLC-HELLO-WORLD-LADDER.md
    - specification/scenarios/SCN-GLC-HELLO-WORLD-CLI-BASIC.md
  realization:
    - build_tenants/odd_glc/typescript/src/index.mjs
    - build_tenants/odd_glc/typescript/src/index.d.ts
  proof:
    - build_tenants/odd_glc/typescript/test/route-one-interpretation.test.mjs
target_truth: >-
  odd_glc proves the basic CLI Hello World lifecycle rung by reading real ABI
  replay/query truth and preserving ABG refs for target artifact, capability,
  admitted evidence, evidence binding, assurance fold, residual, and lifecycle
  disposition.
superseded_truth: >-
  A hand-built event array, local stdout assertion, or fixture-shaped route
  context is enough to close the first ladder rung.
closure_law: >-
  Close only when an installed test consumes the committed digest-pinned ABI
  T-166/T-165 replay artifact of record, not a hand-built event array, and
  asserts that odd_glc preserves ABG refs while keeping all execution,
  admission, evidence binding, fold, residual, disposition, replay, and
  re-entry authority in ABI.
non_closure_conditions:
  - The proof constructs requirement route events by hand instead of reading the
    committed fixture of record.
  - The proof relies on stdout logs, local files, prompt text, or expected-output
    literals without admitted ABG evidence refs.
  - odd_glc emits runtime events, mints admitted refs, executes the program,
    admits evidence, binds evidence, folds requirements, residualizes,
    resolves disposition, or routes retry/re-entry.
  - Artifact, capability, evidence, fold, residual, or disposition refs from the
    ABI artifact are lost, rewritten, or replaced by odd_glc-native refs.
  - The proof treats Hello World as product scope instead of a steel-thread
    ladder witness.
required_work:
  - Refresh the ladder readiness state so Rust CLI and Rust service/client
    rungs are explicitly upstream-blocked.
  - Add or tighten the basic CLI proof over the committed ABI route replay
    fixture of record.
  - Assert fixture digest before interpretation.
  - Assert ABG refs are preserved for artifact, admitted evidence, evidence
    binding, assurance fold, residual, and disposition.
  - Keep negative authority tests passing for odd_glc and the consumed ABI
    public facade.
proof_commands:
  - npm --prefix build_tenants/odd_glc/typescript test
  - rg -n "upstream-blocked|T-009|SCN-GLC-HELLO-WORLD-CLI-BASIC" specification .ai-workspace/tickets/active
  - git diff --check
---

# T-009: Basic CLI Hello World Ladder Proof

## STDO Triage

### First Missing Layer

Build-tenant proof.

The product boundary and scenario ladder are stable. The missing work is the
first executable proof that a ladder rung can be interpreted by odd_glc over
real ABI replay truth.

### Lawful Re-Entry

`realization_refactor`.

This ticket does not change product scope, requirement law, or ABI runtime
authority. It proves a read-only odd_glc interpretation over already-published
ABI rc16 route truth.

## Boundary

odd_glc may:

- read the ABI replay artifact of record;
- verify its digest through the existing fixture manifest path;
- call ABI public query/read facade functions;
- map ABI read models into lifecycle vocabulary;
- preserve ABG refs in the returned lifecycle view.

odd_glc shall not:

- execute the Hello World program;
- admit payloads or evidence;
- mint admitted refs;
- emit runtime events;
- bind evidence;
- fold requirements;
- project residuals;
- resolve disposition or re-entry;
- own replay truth.

## Acceptance Checklist

- [x] Ladder readiness state marks only ABI-proven rungs as odd_glc-startable.
- [x] Basic CLI proof consumes the committed ABI replay fixture of record.
- [x] Fixture digest verification is asserted before lifecycle interpretation.
- [x] Artifact, evidence, evidence-binding, fold, residual, and disposition refs
      are preserved from ABI truth.
- [x] Negative authority tests still reject emit/admit/fold/residual/re-entry
      surfaces.
- [x] Proof commands pass.

## Closure Evidence

Closed on 2026-06-29.

Proof:

```bash
npm --prefix build_tenants/odd_glc/typescript test
```

The new installed test
`proves SCN-GLC-HELLO-WORLD-CLI-BASIC over the committed ABI replay artifact`
consumes the digest-pinned T-166/T-165 fixture of record, derives artifact,
admitted evidence, evidence-binding, fold, residual, and disposition refs from
ABI truth, and asserts odd_glc preserves those refs through read-only lifecycle,
evidence, and assurance views.
