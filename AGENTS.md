# odd_glc Agent Bootstrap

This repo is the source project for `odd_glc`, the ODD General Life Cycle
framework.

`odd_glc` is not ABIogenesis core. It is not `odd_sdlc`. It is a downstream ODD
product that consumes GTL/ABG substrate truth and gives it general life-cycle
meaning.

## Read First

Read these surfaces before substantive work:

1. `README.md`
2. `.ai-workspace/context/project_bootstrap.md`
3. `specification/GOALS.md`
4. `specification/INTENT.md`
5. `specification/PRODUCT.md`
6. `specification/requirements/`
7. ratified design surfaces under `build_tenants/`

Use the upstream shared methodology source at:

- `/Users/jim/src/apps/specification_methodology/specification/standards/SPEC_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/ODD_METHOD.md`
- `/Users/jim/src/apps/specification_methodology/specification/standards/WRITING_GUIDE.md`

## Authority Rules

- `specification/` defines `WHAT`.
- `build_tenants/` and ratified design define `HOW`.
- `.ai-workspace/context/project_bootstrap.md` is the initial context capture and
  current seed for specification work. When its claims become product law,
  ratify them in `specification/`.
- Comments, generated views, local precedent, and sibling project behavior are
  read models. They do not outrank live specification or ratified design.
- ABG owns traversal, runtime facts, frames, continuations, lineage,
  provenance, correction, event replay, and closure folds.
- GTL owns the graph-native language and wrapper surfaces.
- `odd_glc` owns general life-cycle vocabulary, lifecycle meaning over
  GTL/ABG system-function carriers, policy overlays, query projections, and
  domain proof interpretation over admitted GTL/ABG truth.

## Boundary Rules

- Do not implement a product-local requirement compiler.
- Do not implement a second traversal runtime, retry loop, closure ledger, or
  continuation controller.
- Do not copy, port, or reproduce `odd_sdlc` code, carriers, local phase-flow
  controllers, local ledgers, retry behavior, closure rules, or
  software-domain policy into `odd_glc`. Current `odd_sdlc` may be used only
  as workflow-witness and deletion-target evidence. When a parity ticket
  requires the same `odd_sdlc` graph traversal shape, express it as GTL graph
  and node-type declarations consumed by ABG, not as copied SDLC runtime flow.
- Do not move `odd_glc` policy into ABG core.
- Do not claim implementation closure before the relevant requirement and
  design surfaces exist.

## Proof Vocabulary Rules

These terms are proof claims in this repo. Do not use them loosely in ticket
titles, test names, run directories, summaries, or closure records.

- `live` means a real F_P/LLM worker was called. A synthetic fixture,
  replay-only check, or local subject execution is not live.
- `live-worker` means ABG invoked a real F_P/LLM worker, but the executor may
  be non-terminal, such as `executorProfile: "local-spawn"`.
- `live-terminal` is stricter than `live-worker`. It requires
  `executorProfile: "pty-terminal"`, a non-null `terminalSessionId`, and a
  preserved terminal transcript. A `local-spawn` run must never be cited as
  live-terminal proof.
- `sandbox` means a governed isolated run/install fixture with recorded
  sandbox identity, bootstrap, subject-write boundaries, and preserved evidence
  for that sandbox. A scratch workspace, run root, or copied proof-input check
  is not sandbox evidence unless those sandbox conditions are met.
- `parity` means user-visible `odd_sdlc` capability has been reproduced through
  GTL/ABG truth and `odd_glc` interpretation without copied `Sdlc*` carriers,
  local ledgers, retry loops, closure registers, or product-local runtime
  authority. A subject smoke test or replay interpretation alone is not parity.
- `ABG traversal proof` means ABG consumed startup config, admitted registry
  entries, selected a callable graph function, opened the graph call, traversed
  vectors, emitted runtime/proof truth, and exposed replay/query truth for
  `odd_glc` to interpret.
- `single-start traversal` means the test framework invokes ABG once for a
  scenario, normally through installed `genesis-ts start --until converged`.
  ABG then owns graph-function selection, graph-call opening, vector traversal,
  F_P worker dispatch, event emission, closure, and convergence. A test wrapper
  that invokes individual vectors, opens graph calls itself, or calls plugins
  directly is not parity-shaped traversal proof.
- `SDLC graph-traversal parity` means the selected `odd_sdlc` witness traversal
  shape is reproduced as a GTL graph overlay with the same lifecycle stage
  coverage, handoff order, and proof obligations, then run by ABG from startup.
  It does not mean copying `odd_sdlc` code, phase-flow controllers, ledgers,
  closure rules, or local runtime authority. A compressed two-vector
  materialize/prove smoke is not SDLC graph-traversal parity for a witness that
  historically traversed design, source, test design, test source, execution
  preparation, and execution result stages.
- `subject smoke` is diagnostic local subject execution over pinned ABI/GTL
  truth. It is not sandbox proof, parity proof, live-terminal proof, or ABG
  traversal proof.

## Change Classes

Declare the smallest lawful re-entry point before substantive changes:

- `goal_reprice`
- `intent_reprice`
- `product_reprice`
- `requirement_reprice`
- `design_reframe`
- `realization_refactor`

For this initial source project, most early work is `intent_reprice`,
`product_reprice`, or `requirement_reprice` until the first ratified design
and build tenant exist.

<!-- ABG_GTL_CONTEXT_START -->
# Installed ABG/GTL Context Compression

Version: 4.5.0-rc.4
Package: @abiogenesis/typescript-tenant

This context is owned by the installed ABG/GTL product version. Refresh it with
the ABIogenesis installer; do not hand-maintain it as downstream source truth.

Authoritative source surfaces:
- specification/requirements/mapping/REQ-M-GTL3-PROGRAM-TRAVERSAL.md
- specification/requirements/abg/REQ-R-ABG3-INSTRUCTION-ASSEMBLY.md
- specification/requirements/gtl/REQ-L-GTL3-LANGUAGE-CAPABILITY-MODEL.md
- specification/requirements/product/REQ-P-INSTALL.md

Core chain:

```text
graph-function library -> graph overlay/program -> workspace binding -> ABG traversal -> replay interpretation
```

Installed axioms:
- A GraphFunction is a reusable workflow library function or callable work
  contract.
- A graph overlay or GTL program composition is the program surface. It binds
  graph functions, node types, starts, roles, security, policies, proof
  obligations, plugin contracts, result contracts, and allowed bindings.
- A workspace is the mutable program instance surface. It may provide bootstrap
  config, files, observed state, generated artifacts, run archives, and
  operator data. It does not select traversal, call vectors, own closure, or
  replace ABG startup/admission.
- ABG traversal owns startup, registry projection, selection, graph-call
  opening, vector progression, instruction assembly, worker/effect dispatch,
  admission, fold, residual, continuation, re-entry, block, terminal
  projection, and replay truth.
- Downstream products may publish specialized graph functions and overlays
  through GTL declarations consumed by ABG. They must not create local prompt
  shells, registries, ledgers, traversal loops, closure truth, or duplicate
  runtime state.
- F_D applies only over known algebra or total functions. F_P/F_H outputs may
  provide admitted evidence or policy judgment, but they do not become
  deterministic traversal law without F_D conformance over admitted truth.
- Instruction and prompt envelopes are ABG-rendered projections over admitted
  carriers. Product templates are data; product renderers are not authority to
  inject a separate prompt shell.
- Tests that claim traversal parity must enter through admitted GTL program and
  workspace startup, or through a documented ABG resume boundary, and must read
  replay truth for traversal-affecting results. Direct vector, plugin, worker,
  or script calls are not traversal parity.

<!-- ABG_GTL_CONTEXT_END -->
