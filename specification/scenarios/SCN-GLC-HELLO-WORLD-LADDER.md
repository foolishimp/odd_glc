# SCN-GLC-HELLO-WORLD-LADDER - Hello World Scenario Ladder

**Status**: Active
**Date**: 2026-06-29
**Derives from**: [GOALS.md](../GOALS.md), [PRODUCT.md](../PRODUCT.md),
[T-008](../../.ai-workspace/tickets/completed/T-008-govern-hello-world-scenario-ladder.md)

---

## Purpose

Define the first odd_glc scenario ladder for generic lifecycle coverage.

Hello World remains a steel-thread proof vehicle. It is not the product scope.
The ladder expands the proof vehicle across increasingly demanding lifecycle
shapes: one artifact, artifact plus test, non-JS toolchain, client/server
process proof, and parallel branch/fan-in proof.

`odd_sdlc` appears only as a witness for existing user-visible workflows and as
a deletion map for local mechanisms that odd_glc shall not recreate.

## Coverage Matrix

| Generic lifecycle capability | Scenario | odd_sdlc witness | Old mechanism to retire | Genericity test | GTL/ABG substrate | odd_glc interpretation | Downstream specialization surface | Proof gate | Upstream state |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Single artifact execution proof | [SCN-GLC-HELLO-WORLD-CLI-BASIC](SCN-GLC-HELLO-WORLD-CLI-BASIC.md) | JavaScript-lite CLI behavior plus ABG route proof | Local script execution and local evidence admission. | Any lifecycle may need one produced artifact proven by one command. | GTL requirement declarations; ABG actor/operator execution, payload admission, evidence binding, fold, residual, disposition. | TargetArtifactAsset, CapabilityAsset, EvidenceBindingAsset, AssuranceFoldViewAsset. | Software CLI command policy. | ABG 4.2 startup consumes odd_glc bindings, selects the reusable overlay graph function, runs the subject in a sandbox, and emits replay/query truth. | Current ABG 4.2 software-build overlay proof. |
| Artifact plus test evidence | [SCN-GLC-HELLO-WORLD-JS-TENANT-TEST](SCN-GLC-HELLO-WORLD-JS-TENANT-TEST.md) | T-132 JavaScript single tenant | SDLC-local tenant materialization ledger and test proof record. | Any lifecycle may need product artifact plus independent proof artifact. | GTL asset/test declarations; ABG materialization, execution, evidence admission, requirement evidence binding. | InstructionSetAsset and EvidenceBindingAsset distinguish product evidence from proof evidence. | Software test-file policy. | ABG 4.2 startup consumes odd_glc bindings, runs product and test evidence in a sandbox, and emits replay/query truth. | Current ABG 4.2 software-build overlay proof. |
| Non-JS toolchain execution proof | [SCN-GLC-HELLO-WORLD-RUST-CLI](SCN-GLC-HELLO-WORLD-RUST-CLI.md) | Rust minimum and Rust-lite CLI behavior | Product-local runtime/toolchain assumptions and command proof logs. | Any lifecycle may need a domain-specific capability with cwd/env/toolchain contract. | GTL capability declaration; ABG actor/operator command invocation and evidence admission. | CapabilityAsset labels the command contract; EvidenceBindingAsset interprets admitted execution proof. | Rust/Cargo software policy. | ABG 4.2 startup consumes odd_glc bindings, compiles/runs Rust in a sandbox, and emits replay/query truth. | Current ABG 4.2 software-build overlay proof. |
| Client/server process proof | [SCN-GLC-HELLO-WORLD-RUST-SERVICE](SCN-GLC-HELLO-WORLD-RUST-SERVICE.md) | T-164 Rust hello service lite | Local service supervisor, port lifecycle, and HTTP proof admission. | Any lifecycle may need long-running capability proof plus client observation. | GTL service capability declaration; ABG actor/operator process start, env binding, client request, evidence admission, continuation/block truth. | CapabilityAsset labels process and client contracts; ResidualPressureViewAsset interprets start/probe failures. | Service runtime policy. | ABG 4.2 startup consumes odd_glc bindings, starts the service/probe in a sandbox, and emits replay/query truth. | Current ABG 4.2 software-build overlay proof. |
| Parallel branch/fan-in proof | [SCN-GLC-HELLO-WORLD-PARALLEL-JS](SCN-GLC-HELLO-WORLD-PARALLEL-JS.md) | Parallel JavaScript Hello World behavior | SDLC-local parallel materialization frontier, branch leases, and fan-in controller. | Any lifecycle at scale may decompose work into independent branches and fan-in. | GTL requirement graph/refinement declarations; ABG saga/frontier, branch execution policy, runtime events, fold/residual, span identity. | Lifecycle views interpret branch readiness, fan-in, proof, and residual without owning parallel control. | Software module/test branch policy. | ABG 4.2 startup consumes odd_glc bindings, executes independent sandbox branches, and emits replay/query truth. | Current ABG 4.2 software-build overlay proof. |

## Execution Order

The ladder is not a single linear odd_glc-only work stream. A rung may start in
odd_glc only when the required GTL/ABG runtime proof already exists as admitted
or digest-pinned replay truth.

Current execution order:

1. Bind the rung to `ODD_GLC_SOFTWARE_BUILD_OVERLAY`.
2. Publish GTL node-type and graph-function bindings for ABG startup.
3. Let ABG admit registry entries, select the callable graph function, open the
   graph call, traverse vectors, and emit proof truth.
4. Interpret ABG replay/query truth through odd_glc lifecycle views.

The current completed Hello World rungs follow this order over ABIogenesis
`4.2.0-rc.1`. New rungs follow the same order unless a ticket explicitly
prices a different specialization.

## Standing Boundary

The ladder does not authorize odd_glc to:

- publish native `glc.*` graph functions;
- execute commands or supervise services;
- admit payloads, evidence, folds, residuals, dispositions, or replay facts;
- own parallel scheduling, leases, fan-in, retry, continuation, or re-entry;
- treat odd_sdlc local carriers as generic lifecycle law.

odd_glc may define lifecycle labels, read/query interpretation, F_P prompt
templates, F_H policy declarations, and downstream specialization contracts
over GTL/ABG truth.
