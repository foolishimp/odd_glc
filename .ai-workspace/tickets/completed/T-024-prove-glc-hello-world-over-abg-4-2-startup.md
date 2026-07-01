---
id: T-024
title: Prove GLC Hello World over ABG 4.2 startup
type: proof
ticket_category: implementation
status: completed
goal: >-
  Prove the first odd_glc-owned Hello World scenario as GTL declarations and
  ABG 4.2 startup/traversal truth, rather than only consuming a historical ABI
  fixture-of-record artifact.
change_class: realization_refactor
re_entry_point: build_tenant_proof
owner: odd_glc
priority: high
created_at: 2026-07-01
completed_at: 2026-07-01
governance_scope: STDO Method, ODD Method, ABIogenesis 4.2 startup proof, live F_P proof when closing
source_documents:
  - specification/scenarios/SCN-GLC-HELLO-WORLD-MINIMAL.md
  - .ai-workspace/tickets/completed/T-022-define-typed-lifecycle-node-model.md
  - .ai-workspace/tickets/completed/T-023-bind-overlays-and-library-entries-to-abg-startup.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-180-ratify-reusable-gtl-node-types-and-type-composition.md
closure_law: >-
  Close only when an odd_glc Hello World declaration set is consumed through
  ABG startup, ABG emits startup/selection/traversal/replay truth, odd_glc
  interprets only read/query truth, and the final proof includes a live F_P
  worker run unless explicitly repriced under STDO.
non_closure_conditions:
  - The proof uses hand-built replay events instead of ABG-emitted startup and
    traversal truth.
  - The proof bypasses ABG startup with an odd_glc local shell.
  - The proof calls an F_P worker directly from odd_glc.
  - The proof treats a historical ABI fixture as sufficient closure for the
    odd_glc-owned startup scenario.
required_work:
  - Ratify or reference the minimal odd_glc Hello World GTL declaration set.
  - Use ABG 4.2 startup config and registry declarations from T-023.
  - Run the scenario through the sandbox fixture from bootstrap.
  - Commit a digest-pinned fixture-of-record if the live run output is required
    for stable downstream testing.
  - Interpret the result through existing odd_glc read models.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - cd /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript && npm run test:t180:live
  - git diff --check
closure_evidence:
  - ABIogenesis T-180 live sandbox proof was run with `npm run test:t180:live`
    and passed in 101114 ms, with the test body reporting duration
    100648 ms.
  - The fresh proof artifact
    `20260630T172837931Z_pid12638/t180-glc-hello-world-bootstrap-live-proof.json`
    records source commit `96532521c5a6cb93495bd615749f0b630b4a7e52`,
    `sourceDirty: false`, installed package version `4.2.0-rc.1`, tarball
    sha256 `a29b0ae40185759034e45eccfab0f2c032b5ddea5cb8cd765472516a647603b4`,
    and converged startup/traversal status.
  - odd_glc pins the proof, event log, manifest, and two live vector artifacts
    under `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t180-glc-hello-world-bootstrap-live/20260630T172837931Z_pid12638/`.
  - `ODD_GLC_HELLO_WORLD_BOOTSTRAP_STARTUP_BINDING`,
    `ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_LIBRARY`, and
    `ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_LIBRARY` define the
    odd_glc-owned T-180 startup declaration refs expected in the pinned ABG
    startup stream.
  - Tenant tests assert every declared T-180 node-type entry ref and the T-180
    graph-function entry ref appear as ABG-emitted `registry_entry_admitted`
    events, with matching declaration refs, node type refs, and overlay refs.
  - Tenant tests assert ABG selected the declared T-180 graph-function entry
    before graph-call opening; the fixture is no longer accepted merely because
    some unrelated ABI GLC bootstrap registry entries exist.
  - `interpretStartupRegistryState` consumes only ABG-emitted events and live
    proof artifacts and reports `traversal_converged`.
  - Tenant tests assert registry entry admission, graph-function selection
    before graph-call opening, no node_type selection, two vector closures, and
    `Hello, world!\n` stdout.
  - `cd build_tenants/odd_glc/typescript && npm test` passed after the
    fixture/declaration-set alignment checks were added.
---

# T-024: GLC Hello World Over ABG 4.2 Startup

This is the first scenario proof for the new wave. It is not the whole product
scope.
