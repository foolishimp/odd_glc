---
id: T-005
title: Prove odd_glc consumes a real T-165 requirements-route replay
type: proof
ticket_category: route_consumption_proof
status: active
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
governance_scope: STDO Method, ODD Method, route-1 real-run consumption proof, ABIogenesis T-165 replay artifact
source_documents:
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - build_tenants/odd_glc/typescript/src/index.mjs
  - build_tenants/odd_glc/typescript/test/route-one-interpretation.test.mjs
  - .ai-workspace/comments/codex/20260628T170821Z_T002_rc12_readiness_refresh.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.12/release-note.md
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
  Inspection of the existing T-165 Hello World live run directories found
  prompt, output, and transport artifacts, but no serialized
  `requirement_route_fact_projected`, `requirement_lifecycle_disposition`,
  `requirement_fold_projected`, or `evidence_admitted` route replay artifacts.
  That means Phase 5 needs a new ABIogenesis proof artifact or a rerun that
  writes the replay/runtime event stream.
required_work:
  - Confirm whether ABIogenesis can emit a serialized T-165 route replay
    artifact without adding odd_glc runtime authority.
  - If missing, open or update upstream ABIogenesis work to publish the
    route replay proof artifact.
  - Add an odd_glc fixture-loader test only after the real artifact exists.
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

- [ ] A real T-165 or successor ABG route replay/runtime-event artifact exists.
- [ ] Artifact identity is pinned to ABIogenesis substrate identity.
- [ ] odd_glc test consumes the artifact through `interpretLifecycleState`.
- [ ] Test proves lifecycle interpretation from real ABG route truth.
- [ ] No local odd_glc runtime authority is introduced.
- [ ] Proof commands pass.
