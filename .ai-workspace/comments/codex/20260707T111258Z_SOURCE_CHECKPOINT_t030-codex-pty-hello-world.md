# Source Checkpoint: T-030 Codex PTY Hello World

**Date**: 2026-07-07
**Status**: source checkpoint evidence
**Scope**: odd_glc T-030 live traversal migration lane

This checkpoint records the first clean Codex PTY live-terminal run of the
`SCN-GLC-HELLO-WORLD-JS-TENANT-TEST` software-build overlay traversal on the
installed ABIogenesis `4.5.0-rc.5` substrate.

This is not a product release cut, install release, deployment, data-mapper
parity closure, or T-030 closure. T-030 remains active until the full migration
audit and data-mapper gate close.

## Live Proof

- Run root:
  `build_tenants/odd_glc/typescript/test_runs/glc_software_build_overlay_live/js-tenant-test/20260707T091626840Z_pid62441`
- Proof file:
  `build_tenants/odd_glc/typescript/test_runs/glc_software_build_overlay_live/js-tenant-test/20260707T091626840Z_pid62441/odd-glc-software-build-overlay-live-proof.json`
- Command:
  `CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=js-tenant-test ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal ABG_TS_LIVE_AGENT=codex ABG_TS_LIVE_TIMEOUT_MS=900000 npm run test:live`
- Result:
  `10/10` tests passed.

## Replay Metrics

- Total run duration: `330052ms`
- ABG events: `600`
- `registry_entry_admitted`: `45`
- `graph_function_selected`: `8`
- `graph_call_opened`: `8`
- `fp_dispatch_requested`: `8`
- `actor_invocation_started`: `8`
- `actor_invocation_closed`: `8`
- `vector_closed`: `8`
- `terminal_reached`: `1`
- `payload_rejected`: `0`
- `retry_repair_planned`: `0`

## Vector Timing

| # | Stage | Traversal | Worker F_P | Evaluator F_P | Executor |
| - | - | -: | -: | -: | - |
| 0 | `conformance_project` | `56871ms` | `27674ms` | `28885ms` | `pty-terminal` |
| 1 | `implementation_design` | `47913ms` | `30819ms` | `17059ms` | `pty-terminal` |
| 2 | `source` | `36597ms` | `18073ms` | `18485ms` | `pty-terminal` |
| 3 | `test_design` | `42215ms` | `24803ms` | `17364ms` | `pty-terminal` |
| 4 | `component_test_source` | `40905ms` | `23176ms` | `17665ms` | `pty-terminal` |
| 5 | `uat_test_source` | `45092ms` | `21239ms` | `23785ms` | `pty-terminal` |
| 6 | `test_execution_plan` | `42957ms` | `23480ms` | `19399ms` | `pty-terminal` |
| 7 | `test_execution_result` | `17206ms` | `n/a` | `17056ms` | `deterministic-fd` |

## Defects Fixed In This Checkpoint

- The live harness defaulted to `claude`; it now defaults to `codex`.
- The live prompt did not carry the declared scenario stage/file plan; it now
  renders the plan so the worker does not substitute legacy witness paths.
- JavaScript test-source instructions allowed default imports against named
  source exports; they now require named imports.
- The PTY proof harness assumed pure JSON or Claude stream-json timing; it now
  parses mixed terminal-safe output and derives worker/evaluator timing from
  preserved PTY `events.ndjson` archives.

## Verification

- `cd build_tenants/odd_glc/typescript && node --test test/live-proof-shape.test.mjs test/glc-software-build-overlay-live.test.mjs`
- `cd build_tenants/odd_glc/typescript && npm test`
- `git diff --check`

