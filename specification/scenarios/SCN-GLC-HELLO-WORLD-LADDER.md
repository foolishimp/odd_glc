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
| Single artifact execution proof | [SCN-GLC-HELLO-WORLD-CLI-BASIC](SCN-GLC-HELLO-WORLD-CLI-BASIC.md) | T-160 JavaScript lite / T-165 ABI route proof | Local script execution and local evidence admission. | Any lifecycle may need one produced artifact proven by one command. | GTL requirement declarations; ABG actor/operator execution, payload admission, evidence binding, fold, residual, disposition. | TargetArtifactAsset, CapabilityAsset, EvidenceBindingAsset, AssuranceFoldViewAsset. | Software CLI command policy. | Replay/query shows admitted command evidence and closed requirement fold. | Ready in ABI rc16; odd_glc-only proof ticket T-009. |
| Artifact plus test evidence | [SCN-GLC-HELLO-WORLD-JS-TENANT-TEST](SCN-GLC-HELLO-WORLD-JS-TENANT-TEST.md) | T-132 JavaScript single tenant | SDLC-local tenant materialization ledger and test proof record. | Any lifecycle may need product artifact plus independent proof artifact. | GTL asset/test declarations; ABG materialization, execution, evidence admission, requirement evidence binding. | InstructionSetAsset and EvidenceBindingAsset distinguish product evidence from proof evidence. | Software test-file policy. | Replay/query binds both source artifact and test execution evidence to active requirements. | Ready in ABI rc17 through T-173 generic proof-evidence artifact; odd_glc proof ticket T-010. |
| Non-JS toolchain execution proof | [SCN-GLC-HELLO-WORLD-RUST-CLI](SCN-GLC-HELLO-WORLD-RUST-CLI.md) | T-133 Rust minimum / T-160 Rust lite | Product-local runtime/toolchain assumptions and command proof logs. | Any lifecycle may need a domain-specific capability with cwd/env/toolchain contract. | GTL capability declaration; ABG actor/operator command invocation and evidence admission. | CapabilityAsset labels the command contract; EvidenceBindingAsset interprets admitted execution proof. | Rust/Cargo software policy. | Toolchain execution evidence is admitted and folded without odd_glc shelling out. | Ready in ABI rc17 through T-171 non-default command execution artifact; odd_glc proof ticket T-011. |
| Client/server process proof | [SCN-GLC-HELLO-WORLD-RUST-SERVICE](SCN-GLC-HELLO-WORLD-RUST-SERVICE.md) | T-164 Rust hello service lite | Local service supervisor, port lifecycle, and HTTP proof admission. | Any lifecycle may need long-running capability proof plus client observation. | GTL service capability declaration; ABG actor/operator process start, env binding, client request, evidence admission, continuation/block truth. | CapabilityAsset labels process and client contracts; ResidualPressureViewAsset interprets start/probe failures. | Service runtime policy. | Replay/query shows server start, client request, response evidence, and disposition. | Ready in ABI rc17 through T-172 process/request execution artifact; odd_glc proof ticket T-012. |
| Parallel branch/fan-in proof | [SCN-GLC-HELLO-WORLD-PARALLEL-JS](SCN-GLC-HELLO-WORLD-PARALLEL-JS.md) | T-174 parallel JavaScript Hello World | SDLC-local parallel materialization frontier, branch leases, and fan-in controller. | Any lifecycle at scale may decompose work into independent branches and fan-in. | GTL requirement graph/refinement declarations; ABG saga/frontier, branch execution policy, runtime events, fold/residual, span identity. | Lifecycle views interpret branch readiness, fan-in, proof, and residual without owning parallel control. | Software module/test branch policy. | Replay/query proves independent branch evidence, fan-in, and final composed behavior. | Ready through ABI T-174 parallel Hello World replay artifact; odd_glc proof ticket T-013. |

## Execution Order

The ladder is not a single linear odd_glc-only work stream. A rung may start in
odd_glc only when the required GTL/ABG runtime proof already exists as admitted
or digest-pinned replay truth.

Current execution order:

1. Prove [SCN-GLC-HELLO-WORLD-CLI-BASIC](SCN-GLC-HELLO-WORLD-CLI-BASIC.md)
   through T-009 as an odd_glc read/query proof over the committed ABI rc16
   route replay artifact.
2. Prove
   [SCN-GLC-HELLO-WORLD-JS-TENANT-TEST](SCN-GLC-HELLO-WORLD-JS-TENANT-TEST.md)
   through T-010 over the digest-pinned ABI rc17 T-173 proof artifact carrying
   product evidence, independent test-source evidence, and test-execution
   evidence.
3. Prove [SCN-GLC-HELLO-WORLD-RUST-CLI](SCN-GLC-HELLO-WORLD-RUST-CLI.md)
   after the JavaScript tenant/test rung, over the digest-pinned ABI rc17 T-171
   proof artifact.
4. Prove
   [SCN-GLC-HELLO-WORLD-RUST-SERVICE](SCN-GLC-HELLO-WORLD-RUST-SERVICE.md)
   after the Rust CLI rung, over the digest-pinned ABI rc17 T-172 proof
   artifact.
5. Prove
   [SCN-GLC-HELLO-WORLD-PARALLEL-JS](SCN-GLC-HELLO-WORLD-PARALLEL-JS.md)
   over the digest-pinned ABI T-174 replay artifact with emitted frontier,
   branch, execution-evidence, and fan-in truth.

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
