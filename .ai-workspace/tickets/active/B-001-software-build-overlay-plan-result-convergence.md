# B-001 Software-Build Overlay: test_execution_plan → test_execution_result Convergence

- id: B-001 (support-line-local series; line: `support/0.1.x`)
- title: plan→result stage handoff does not converge — correct observed-execution results trigger repair loops; four hello-world stagePlans forbid producing the result the executor requires
- type: bug
- ticket_category: ordinary
- status: active
- goal: glc-0.1-support
- release_line: `support/0.1.x` (cut from `v0.1.0`); release scope: new RC cycle toward `0.1.1` (RELEASE_METHOD default post-tap path)
- governance_scope: STDO Method
- governance_scope_expansion: [S, T, D, O]
- intake_source: corporate downstream consumer bug report 2026-07-13 (bug #2 — "residual, upstream odd_glc 0.1.0, unmodified by us... Not ours to author (upstream-owned)"), independently reproduced locally 2026-07-13 in the live hello-world lane on `support/0.1.x` before the report arrived
- affected_boundary: `ODD_GLC_SOFTWARE_BUILD_OVERLAY` plan→result edge (node-type + closure contract) and the live-lane scenario stagePlans (proof surface)
- change_intent: make a correct worker-executed observed result converge the plan→result edge, and make every hello-world scenario contract satisfiable under the execution-default law
- change_class: design_reframe
- re_entry_point: design surface (overlay stage node-type + closure contract), flowing to overlay declaration data, live-lane stagePlans, proof lanes
- triaged_at: 2026-07-13
- created_at: 2026-07-13
- updated_at: 2026-07-14
- links: sibling ticket `abiogenesis-4.6-support/.ai-workspace/tickets/active/B-001-transport-contract-lane-tools-and-downstream-cli-configuration.md`

## Intake Triage (performed)

1. **Substantive?** Yes. Two corroborating defect expressions on one stage boundary; blocks live acceptance of 4/6 hello-world scenarios locally and blocks a corporate consumer on pristine 0.1.0 with a tool-enabled worker.
2. **Boundary:** odd_glc-owned. ABG behaved lawfully in every trace (contract failure observed → bounded retry → replay-visible `gap_stop`); the defect is in odd_glc's overlay edge contract and its live-lane scenario contracts.
3. **Upward propagation walk:**
   - Requirement layer: execution-default law exists and is realized for the reference scenarios (basic-cli, data-mapper) — T-030/T-035 campaign law. Not missing.
   - Design layer: **first missing/defective layer.** (a) The plan→result edge's node-type + closure contract does not converge on a correct observed result (consumer evidence: `nodeTypesUsed` mixes `uat_test_source_surface` + `test_execution_plan`; repair loop instead of close). (b) No declared stage signal states which stages the worker executes (the consumer had to invent `stageSpec.workerExecutes` locally — a missing upstream interface).
   - Realization layer: four hello-world stagePlans deviate from the realized T-035 shape (never upgraded during the campaign).
   - ⇒ `design_reframe` at the overlay stage contract; the stagePlan propagation rides the same ticket as realization repair under that design.
4. **Affected span:** `build_tenants/odd_glc/typescript/src/index.mjs` (`ODD_GLC_SOFTWARE_BUILD_OVERLAY` — plan/result stage node types, vector contract, closure obligations), `test/glc-software-build-overlay-live.test.mjs` (stagePlans for JS-TENANT-TEST, JS-SDLC-BOOTSTRAP, RUST-CLI, RUST-SERVICE, PARALLEL-JS; `executePlannedScenario`/`executeScenario` seam), substrate compatibility pin if the sibling ABG ticket cuts `rc.4`.
5. **Release scope:** contained in `support/0.1.x` → `0.1.1` RC cycle. Propagation to `main` (1.0 line under the ABG 5.0 ladder) is a separate follow-up after ruling.

## Evidence

**Corporate (their rev-2, pristine 0.1.0 overlay logic, tool-enabled claude worker):**
- 0 `payload_rejected` (fabrication path closed by their transport fix), but `retry_repair_planned` loop on the execution vector, climbing attempt 6+.
- Worker output `accepted:true`, `evidenceAccepted:true`, yet `nodeTypesUsed` mixes `uat_test_source_surface` + `test_execution_plan`; "repair loops on the plan/result boundary"; "the stage keeps re-repairing rather than converging". Reproduces on an external checkout.

**Local (2026-07-13, `support/0.1.x` live lane, codex gpt-5.5 medium, ABG 4.6.0-rc.3 substrate):**
- SCN-GLC-HELLO-WORLD-CLI-BASIC: full pass (349s) — its stagePlan carries the T-035 execution-default shape (`filesToProduce: ["test-execution-plan.json", "test-execution-result.json"]`, "EXECUTION-DEFAULT LAW: run node --test ... yourself inside this turn").
- JS-TENANT-TEST, JS-SDLC-BOOTSTRAP, RUST-CLI: all authored vectors 0–6 cleanly (every vector `accepted`, every c_call `advance`), then blocked at vector 7 (`test_execution_result`): instant `retry` ×10, `gap_stop`, `gateReason: retry_budget_exhausted`. No worker dispatch at v7: `executePlannedScenario` throws `Missing test-execution-result.json: the worker must RUN the declared command in its turn...` — but those stagePlans instruct "Write only test-execution-plan.json" (producing the result file is forbidden by the stage contract; not producing it fails execution). Contradiction is deterministic; no worker at any capability can pass.
- Authored artifacts are good: running the planned command by hand in the failed sandbox gives 2/2 pass, `fail 0`.
- Run dirs: `build_tenants/odd_glc/typescript/test_runs/glc_software_build_overlay_live/{js-tenant-test/20260713T060446576Z_pid23068, js-sdlc-bootstrap/20260713T060722328Z_pid23068, rust-cli/20260713T060957965Z_pid23068, basic-cli/20260713T055856882Z_pid23068}` (events.jsonl replay-complete).

## Execution Findings (2026-07-13, during fix)

Live reproduction on `support/0.1.x` isolated a SECOND convergence defect — the corporate signature in its pure form. CLI-BASIC (previously green, stage plan untouched) blocked at the plan stage: the worker executed honestly (after self-repairing a leaked `NODE_TEST_CONTEXT` recursion guard), the F_P evaluator ACCEPTED with `close` — and the F_D verifier still rejected every attempt to retry exhaustion. Root cause: the worker recorded `stdout` as a string array (the ecosystem's own `contentLines` convention); `executePlannedScenario` consumed only the string form (`typeof plan.stdout === "string" ? plan.stdout : ""`), silently coercing arrays to `""`, failing pass-count extraction, and repair-looping. F_P accepts, F_D rejects — "accepted:true, evidenceAccepted:true yet repair loops on the plan/result boundary", exactly the consumer's rev-2 evidence. Convergence was worker-formatting-nondeterministic: string-recorders passed, array-recorders never could.

Fix applied (both fronts):
1. Stage plans: T-035 execution-default shape propagated to all five lagging scenarios (`workerExecutes: true`, result surface in allowed paths, run-yourself + truthful-record instructions); dead `executeFromPlan: false` removed (the scenario helper always overrode it).
2. Ingress-collapse in `normalizeExecutionPlanShape`: captured-stream shape family `stdout|stderr : string | string[]` normalized once at ingress (the ratified envelope-family lesson applied to streams); non-string arrays stay untouched and fail closed. Deterministic proof added against the materialized binding (`captured-stream shape family` binding-unit case). Suite: 95 tests, 87 pass, 0 fail.

Third defect, promoted from follow-up candidate to in-ticket fix after it proved closure-blocking (js-tenant-test, run 5: worker never guessed the `unset NODE_TEST_CONTEXT` repair within budget; rejections: "stdout is empty ... stderr reports node:test recursive run skipping files"): the harness runs under `node --test` and leaks node's recursive-test-context guard into spawned workers, so the worker's own `node --test` run skips every test file — honest execution evidence becomes structurally unobtainable and convergence degrades to worker luck. Fixed boundary-locally at the harness's transport seam: `subjectExecutionTransportContract` extends the agent contract's declared `sanitizedEnvironmentPolicy.prefixes` with `NODE_TEST` (pure installed-rc.3 sanitization mechanics; both dispatch sites wired). The broader question — whether ABG's default agent contracts should strip runner contexts for all consumers — remains a candidate for the sibling ABG line, not absorbed here.

## Target Truth

- target_truth: (1) the plan→result edge contract accepts and converges a correct worker-executed observed result on first attempt — target node type is unmixed `test_execution_result`, closure predicate is over the typed observed-execution result; repair fires only on defective evidence; (2) worker-executes stages are a declared overlay/stage signal (upstream-owned; supersedes the consumer's local `stageSpec.workerExecutes`), consumed by the ABG-side transport lane selection (sibling ticket); (3) all six hello-world stagePlans carry the execution-default stage shape (basic-cli is the reference).
- superseded_truth: current plan/result stage contract that admits mixed node types and re-repairs accepted evidence; the four "Write only test-execution-plan.json" execution-stage contracts.

## Closure

- closure_law: closes only when a correct observed-execution result converges the plan→result edge without a repair loop, and all six hello-world scenarios pass the live lane end-to-end on `support/0.1.x` against the pinned ABG substrate.
- evaluation_criteria: live lane green for all 6 scenarios (deterministic suite stays green); consumer reproduction shape (tool-enabled worker, correct result, pristine overlay) converges — no `retry_repair_planned` climb on the execution vector; negative proof retained: a fabricated/report-only result still fails closed.
- proof_surface: `npm --prefix build_tenants/odd_glc/typescript test` (deterministic) + live lane `ODD_GLC_GTL_ABG_HELLO_WORLDS_LIVE=1` for the six scenarios; events.jsonl replay for the execution vector showing close (not repair) on first correct attempt.
- non_closure_conditions: repair loop still triggerable by accepted correct evidence; any stagePlan still contradicts the executor's result-file requirement; `nodeTypesUsed` mixing admitted silently; fix lands by weakening the fabrication/negative gates; live green achieved only by editing the framework gates rather than the overlay/scenario contracts (live-gate precedence: fix framework/overlay law, never patch the scenario to pass).

## Closure Evidence (2026-07-13)

Live ladder green — all six scenarios, gpt-5.5 medium workers, installed abg 4.6.0-rc.3 substrate, final harness state:

| Scenario | Run | Duration | Notes |
|---|---|---|---|
| CLI-BASIC | 7 | 190s | first-attempt convergence |
| JS-TENANT-TEST | 7 | 234s | first-attempt convergence |
| JS-SDLC-BOOTSTRAP | 7 | 175s | first-attempt convergence |
| RUST-CLI | 7 | 205s | first-attempt convergence (cargo in worker turn) |
| RUST-SERVICE | 8 | 259s | requires socket-capable worker sandbox (below) |
| PARALLEL-JS | 9 | 190s | after fifth defect fix (instruction trap, below) |

Two further scenario-contract defects found and fixed during closure:
5. **PARALLEL-JS instruction trap**: component-test stage said "Import helloPart from ../../src/hello.mjs" without the named-export syntax phrasing the sibling scenarios carry — the literal reading is a default import against named exports (SyntaxError), reproduced identically in two independent runs; the evaluator, judging against the same text, accepted it. Fixed by pinning the exact named-import syntax.
6. **RUST-SERVICE environment binding**: the codex `--full-auto` sandbox denies socket binds (documented campaign BUG #6 class); the service never publishes its port file and every honest attempt fails. Resolved by the declared install binding — either `ABG_TS_CODEX_SANDBOX` or codex `[sandbox_workspace_write] network_access = true` (empirically proven; keeps workspace-write protections). Socket-binding scenarios REQUIRE this binding in the run environment; the qualification-bundle doc must name it.

Run composition note (objective status, per closure law): runs 7/8/9 executed on identical convergence-law code; the two later amendments are scenario-local data (parallel-js instructions) and run-environment binding (rust-service). No single 6/6 process run was executed — rule whether one is required as the final witness before the 0.1.1 RC cut.

**Witness record (2026-07-14, F_H-ordered).** Witness run 1 (single process at `v0.1.1-rc.1`): 5/6 — surfaced defect #7 (vector-0 casing slip `Hello, World!` admitted by the authoring evaluator, locked in by instruction-authority precedence, workspace split, no upstream re-entry, retry burn to block; 919s). Fixes: `b8a1fe0` (per-scenario pins — superseded), `b3c20f3` (canonicality audit: pin DERIVED at one site from the scenario's declared `expectedReturnValue`; hand literals removed). **Witness run 3 at `b3c20f3`: 6/6 green in one process, one environment** — CLI-BASIC 292s, JS-TENANT-TEST 317s, JS-SDLC-BOOTSTRAP 263s, RUST-CLI 308s, RUST-SERVICE 355s, PARALLEL-JS 311s; total ~31 min; env: `ODD_GLC_GTL_ABG_HELLO_WORLDS_LIVE=1 ABG_TS_CODEX_MODEL=gpt-5.5`, codex medium effort, `[sandbox_workspace_write] network_access = true`. The composed-evidence exclusion is retired; `0.1.1-rc.2` should carry this witness.

**Witness run 4 (2026-07-14, exact packed rc.5/rc.2 pair, Claude Sonnet): stopped after 4/6 green.** RUST-SERVICE generated a lawful source implementation for the declared positive `/hello` contract, then its later UAT turn invented an undefined-route requirement absent from conformance, design, and source. The worker honestly executed that test and recorded status 1; ABG blocked and planned a same-vector retry, which cannot repair earlier source. This is scenario-contract ambiguity, not a transport or subject-source defect. The repair makes the existing contract explicit at conformance, design, test-design, and UAT surfaces: only `GET /hello` is declared; required negative depth rejects near-miss `/hello` bodies such as a missing newline or wrong case; tests must not invent other route semantics. No runtime, retry, closure, graph, or published-package behavior changes.

**Witness run 5 (2026-07-14, exact packed rc.5/rc.2 pair, Claude Sonnet): 6/6 green in one process.** PID 49318 ran the frozen `abiogenesis 4.6.0-rc.5` snapshot (`bab609ab` source, `8d43dc89` snapshot, tarball `d9c99382...`) and frozen `odd_glc 0.1.1-rc.2` tarball (`a06673be...`). CLI-BASIC 385s, JS-TENANT-TEST 380s, JS-SDLC-BOOTSTRAP 283s, RUST-CLI 397s, RUST-SERVICE 560s, PARALLEL-JS 367s; test runner: 6 pass, 0 fail, 2,388s. Every execution vector used `worker_executes`, observed tools (9/3/8/6/5/7), returned status 0 and `failureClass:null`; every evaluator remained `closed_prompt_proof`, tool-less, status 0 and `failureClass:null`. Every observed subject result was status 0 with `fail 0`; each scenario invoked ABG start once and reached `terminal_reached`. Four bounded `payload_rejected`/`retry_attempt_opened` sequences were recorded (CLI-BASIC, JS-TENANT-TEST, RUST-CLI, RUST-SERVICE); no execution retry loop remained. The correctly bound deterministic suite is 96 total, 88 pass, 0 fail, 8 live skips. Six traversal proofs plus six normalized execution-evidence records are preserved in the `0.1.1-rc.2` release snapshot.

Remaining open condition: corporate consumer reproduction converges on their external checkout (their claude-side rev-2 shape) — pending their refresh of `support/0.1.x` + `support/4.6.x`.

Discovered, explicitly NOT absorbed (route per F_H ruling):
- sdlc hello-world graph lacks the execution→authoring re-entry stage the full-lifecycle (data-mapper) graph has: an upstream-vector code defect discovered at the execution vector is same-vector-unrepairable by contract (allowed paths) and burns the retry budget. Candidate: add the consequence/re-entry stage to the sdlc overlay, or accept block-and-restart for hello-worlds.
- Capability-denial classification for core (ABG): typed `environment_capability_denied` disposition + install-level posture ladder + ledger-admitted self-escalation + discovered-capability caching, replacing burn-to-discover. Belongs to the core-absorption follow-up with the worker-evidence admission carrier.

## Notes

- ABG's runtime behaved correctly in all traces; this ticket must not move odd_glc policy into ABG core nor build a local traversal controller (AGENTS.md boundary rules).
- Coordination: `substrate.provenance.json` + `oddGlcCompatibility` pin abg `4.6.0-rc.5` exactly (source, snapshot, tag, tarball, manifest, and installed-product digest). The paired `0.1.1-rc.2` cut must qualify this exact install before either successor tag is published.
