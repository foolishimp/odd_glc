---
id: T-005
title: Prove odd_glc consumes a real T-165 requirements-route replay
type: proof
ticket_category: route_consumption_proof
status: completed
goal: >-
  Prove Phase 5 by feeding odd_glc route-1 interpretation with a real
  ABIogenesis T-165 Hello World requirements-route replay or runtime-event
  artifact, not a hand-built fixture. The proof shall show odd_glc consumes
  ABG-owned route truth from the run and produces the same lifecycle view
  without emitting, minting, admitting, folding, residualizing, or routing
  anything locally.
change_class: realization_refactor
re_entry_point: proof
downstream_reentry_sequence:
  - upstream_gap_analysis
owner: odd_glc
priority: high
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, route-1 real-run consumption proof, ABIogenesis T-165 replay artifact
source_documents:
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - build_tenants/odd_glc/typescript/src/index.mjs
  - build_tenants/odd_glc/typescript/test/route-one-interpretation.test.mjs
  - .ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.12/release-note.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-166-publish-requirements-route-replay-proof-artifact.md
affected_boundary:
  proof:
    - build_tenants/odd_glc/typescript/test/
  upstream_artifact:
    - /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/test_runs/t165_hello_world_requirements_route_live/
target_truth: >-
  A route-1 proof test consumes serialized ABG requirement-route runtime events
  or replay facts from a real T-165 Hello World run and passes them to
  `interpretLifecycleState`, proving odd_glc interprets actual ABIogenesis
  route truth rather than a fixture.
superseded_truth: >-
  Phase 4 route-shaped fixtures are enough to claim odd_glc consumes the actual
  T-165 Hello World route replay.
closure_law: >-
  Close only when a real T-165 or successor ABIogenesis proof artifact exposes
  serialized requirement-route replay facts or `requirement_route_fact_projected`
  runtime events and an odd_glc test consumes that artifact through the public
  route-1 interpretation API. A hand-built query/disposition fixture, prompt
  output file, stdout log, transport log, or synthetic event cannot close this
  ticket.
evaluation_criteria:
  - Proof artifact is identified by path and ABIogenesis substrate identity.
  - Artifact contains serialized ABG requirement-route replay facts or
    `requirement_route_fact_projected` runtime events.
  - odd_glc test imports the artifact and calls `interpretLifecycleState`.
  - odd_glc produces release/readiness, continuation, re-entry, blocked, or
    residual interpretation from that ABG truth.
  - Test continues to prove no forbidden local runtime authority is exposed.
non_closure_conditions:
  - The proof uses hand-built disposition fixtures as the source of truth.
  - The proof consumes only prompt/output/transport logs without ABG route
    replay facts or route runtime events.
  - odd_glc calls ABIogenesis runtime-internal emitters to create the proof
    artifact.
  - Existing T-165 run directories do not contain serialized route replay facts
    or `requirement_route_fact_projected` runtime events.
current_blocker: >-
  Resolved by ABIogenesis T-166. The latest local T-166 live proof artifact
  was copied into odd_glc as a committed digest-pinned fixture-of-record
  containing serialized `requirement_route_fact_projected` events and
  replay-derived lifecycle state.
required_work:
  - Consume the ABIogenesis T-166 artifact through `interpretLifecycleState`.
  - Keep the test as read-only consumption of artifact replay truth.
proof_commands:
  - rg -n "requirement_route_fact_projected|requirement_lifecycle_disposition|requirement_fold_projected|evidence_admitted" /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/test_runs/t165_hello_world_requirements_route_live
  - npm --prefix build_tenants/odd_glc/typescript test
  - git diff --check
---

# T-005: Real T-165 Route Replay Consumption

## STDO Triage

### First Missing Layer

Proof artifact.

T-004 proves odd_glc interpretation against ABIogenesis public facades and
route-shaped replay/runtime-event fixtures. The next missing layer is a real
ABIogenesis route replay artifact from T-165 or a successor live proof.

### Lawful Re-Entry

`realization_refactor`, with `upstream_gap_analysis` if ABIogenesis does not
publish the needed artifact.

odd_glc shall not create the artifact by calling ABG internals. The artifact
must come from ABIogenesis runtime/proof output.

## Acceptance Checklist

- [x] A real T-165 or successor ABG route replay/runtime-event artifact exists.
- [x] Artifact identity is pinned to ABIogenesis substrate identity.
- [x] odd_glc test consumes the artifact through `interpretLifecycleState`.
- [x] Test proves lifecycle interpretation from real ABG route truth.
- [x] No local odd_glc runtime authority is introduced.
- [x] Proof commands pass.

## Closure Evidence

Closed on 2026-06-29.

Consumed ABIogenesis artifact:

- committed fixture:
  `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t166-route-replay/20260628T175945864Z_pid34852/requirements-route-replay-artifact.json`
- committed fixture manifest:
  `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t166-route-replay/20260628T175945864Z_pid34852/requirements-route-replay-manifest.json`
- original ABI artifact:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/test_runs/t165_hello_world_requirements_route_live/20260628T175945864Z_pid34852/requirements-route-replay-artifact.json`
- original ABI manifest:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/test_runs/t165_hello_world_requirements_route_live/20260628T175945864Z_pid34852/requirements-route-replay-manifest.json`
- artifact digest:
  `sha256:4ba42598bbf309b4568d5d167dc395f31799d32bd5b8fd7b78f76131494fd10e`
- ABIogenesis upstream ticket:
  `/Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-166-publish-requirements-route-replay-proof-artifact.md`

odd_glc proof:

```bash
npm --prefix build_tenants/odd_glc/typescript test
git diff --check
```

The route-one tenant test now consumes the committed fixture unless
`ODD_GLC_T166_ROUTE_REPLAY_ARTIFACT` supplies an explicit fresh artifact path.
It verifies the manifest digest against tenant provenance, passes the artifact's
replay events and lifecycle query into `interpretLifecycleState`, and observes
`release_readiness_candidate` from the real ABI `closed` disposition. odd_glc
does not call ABG internal emitters, admitted-ref minting, evidence admission,
fold, residual, or disposition-resolution APIs.
