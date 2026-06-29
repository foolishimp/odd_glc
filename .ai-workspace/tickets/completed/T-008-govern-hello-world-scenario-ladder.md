---
id: T-008
title: Govern odd_glc Hello World scenario ladder
type: design
ticket_category: scenario_ladder_governance
status: completed
goal: >-
  Define the odd_glc Hello World scenario ladder as a set of steel-thread
  witnesses for generic lifecycle capabilities. The ladder shall derive
  scenario coverage from odd_sdlc only as witness evidence and deletion
  targets. It
  shall not import odd_sdlc phase flow, local ledgers, local runners, local
  evidence admission, local retry control, or software-domain policy as
  generic odd_glc law.
change_class: requirement_reprice
re_entry_point: scenarios
owner: odd_glc
priority: high
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
governance_scope: STDO Method, ODD Method, scenario coverage, GTL/ABG consumption, downstream specialization
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-MINIMAL.md
  - /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t160_hello_world_js_lite/specification/requirements/01-hello-world.md
  - /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t132_hello_world_single_tenant/bootstrap.md
  - /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t133_rust_hello_world_minimal/bootstrap.md
  - /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t164_rust_hello_service_lite/bootstrap.md
  - /Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t174_parallel_hello_world_js/bootstrap.md
affected_boundary:
  goals:
    - specification/GOALS.md
  scenarios:
    - specification/scenarios/
target_truth: >-
  odd_glc has a documented Hello World scenario ladder that starts with one
  executable artifact and expands through test evidence, non-JS toolchain
  evidence, client/server process evidence, and parallel branch/fan-in
  evidence. Each scenario row names the generic lifecycle capability it proves,
  the odd_sdlc witness, the old local mechanism to retire, the GTL/ABG
  substrate that owns construction/runtime truth, the odd_glc interpretation,
  the downstream specialization surface, and the proof gate.
superseded_truth: >-
  The first Hello World proof is the whole MVP scenario set, or odd_glc should
  copy odd_sdlc Hello World internals to reach parity.
closure_law: >-
  Close only when the scenario ladder exists as specification scenario truth,
  every ladder row is expressed as a generic lifecycle capability first and an
  odd_sdlc witness second, and no scenario authorizes odd_glc to execute,
  admit, bind, fold, residualize, schedule, parallelize, or route re-entry as
  local authority.
non_closure_conditions:
  - A scenario uses odd_sdlc as the domain authority rather than as a witness.
  - A scenario defines a native glc graph-function catalog, local runtime,
    local evidence store, local fold, local residual store, local retry loop,
    local service supervisor, or local parallel controller.
  - A scenario treats Hello World as product scope instead of steel-thread
    coverage evidence.
  - The client/server scenario lets odd_glc own process supervision or HTTP
    proof admission instead of interpreting ABG evidence.
  - The parallel scenario lets odd_glc own ready-frontier selection,
    concurrency, leases, branch execution, or fan-in projection instead of
    interpreting ABG/GTL truth.
required_work:
  - Add a Hello World scenario ladder index and coverage matrix.
  - Add a scenario for basic CLI Hello World.
  - Add a scenario for JavaScript tenant plus test proof.
  - Add a scenario for Rust CLI Hello World.
  - Add a scenario for Rust client/server Hello World.
  - Add a scenario for parallel JavaScript Hello World.
  - Update the scenario README and GOALS active-ticket surface.
proof_commands:
  - rg -n "SCN-GLC-HELLO-WORLD" specification/scenarios
  - rg -n "odd_sdlc witness|Old mechanism to retire|GTL/ABG substrate|odd_glc interpretation" specification/scenarios
  - rg -n "shall not.*local|ABG-owned|GTL/ABG-owned|does not authorize" specification/scenarios .ai-workspace/tickets/completed/T-008-govern-hello-world-scenario-ladder.md
  - git diff --check
---

# T-008: Hello World Scenario Ladder

## STDO Triage

### First Missing Layer

Scenarios.

The product and requirement boundaries are already stable. The new need is a
bounded set of steel-thread scenario witnesses that exercise those boundaries
before odd_glc parity work expands.

### Lawful Re-Entry

`requirement_reprice -> scenarios`.

This does not change the product definition. Hello World remains a proof
vehicle, not the product scope.

## Scenario Ladder

The initial ladder is:

1. Basic CLI Hello World.
2. JavaScript tenant with test proof.
3. Rust CLI Hello World.
4. Rust client/server Hello World.
5. Parallel JavaScript Hello World.

Each scenario is a different generic lifecycle capability witness. The witness
source is current odd_sdlc behavior, but the capability identity is generic
odd_glc lifecycle coverage.

## Acceptance Checklist

- [x] Scenario ladder index exists.
- [x] Basic CLI scenario exists.
- [x] JavaScript tenant/test scenario exists.
- [x] Rust CLI scenario exists.
- [x] Rust client/server scenario exists.
- [x] Parallel JavaScript scenario exists.
- [x] Scenario README links the ladder.
- [x] GOALS names T-008 as the scenario-ladder ticket.
- [x] Proof commands pass.

## Closure Evidence

Closed on 2026-06-29.

Proof:

```bash
rg -n "SCN-GLC-HELLO-WORLD" specification/scenarios
rg -n "odd_sdlc witness|Old mechanism to retire|GTL/ABG substrate|odd_glc interpretation" specification/scenarios
rg -n "shall not.*local|ABG-owned|GTL/ABG-owned|does not authorize" specification/scenarios .ai-workspace/tickets/completed/T-008-govern-hello-world-scenario-ladder.md
git diff --check
```

The ladder is specification-only. Scenario execution and live proof are later
implementation tickets.
