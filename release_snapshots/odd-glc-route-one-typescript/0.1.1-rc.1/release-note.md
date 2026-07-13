# odd_glc 0.1.1-rc.1

`odd_glc 0.1.1-rc.1` is the first RC cut of the `0.1.1` support cycle over the
tapped `0.1.0` release. It is a bug-fix cut for downstream consumers of the
`abiogenesis 4.6` + `odd_glc 0.1` stack. It is an RC publication, not a tap,
and does not promise API stability.

## Issues addressed

This cut, paired with `abiogenesis 4.6.0-rc.4`, addresses a corporate
downstream consumer's bug report of 2026-07-13. Numbering follows that report.

### Report #2 — software-build overlay: `test_execution_plan → test_execution_result` handoff does not converge (this cut)

Upstream-owned, reproduced on pristine `0.1.0`. Six convergence defects on the
plan→result boundary, each independently reproduced and fixed:

1. **Stage-plan contradiction.** Five hello-world scenarios instructed
   "Write only test-execution-plan.json" while the execution vector requires a
   worker-produced `test-execution-result.json` — closure was structurally
   impossible. All scenarios now carry the execution-default stage shape
   (`workerExecutes`, both files in allowed paths, run-the-suite-yourself and
   exact-field record instructions), previously present only on basic-cli and
   the data-mapper scenarios.
2. **Captured-stream shape family.** Workers lawfully record `stdout`/`stderr`
   as one string or an array of lines; the F_D verifier consumed only the
   string form and coerced arrays to `""`, so F_P-accepted honest evidence
   repair-looped to retry exhaustion. The family `string | string[]` now
   normalizes once at ingress.
3. **Observed-field family.** `observedCommand`/`observedArgs`/
   `observedStatus`/`observedStdout`/`observedStderr` map onto the bare
   contract names; record instructions pin exact top-level field names.
4. **Runner-context leak.** The harness runs under `node --test` and leaked
   node's recursion guard (`NODE_TEST_CONTEXT`) into worker environments,
   making worker-run `node --test` executions skip every file. The `NODE_TEST`
   prefix is stripped at the worker transport seam.
5. **parallel-js instruction trap.** The component-test instruction's literal
   reading produced a default import against named exports; the instruction
   now pins the exact named-import syntax used by the sibling scenarios.
6. **rust-service socket binding.** Socket-binding subjects cannot run under
   the codex default sandbox (`--full-auto` denies binds). The requirement is
   satisfied by a declared environment binding: `ABG_TS_CODEX_SANDBOX`, codex
   `sandbox_workspace_write.network_access = true`, or (on `4.6.0-rc.4`)
   `ABG_TS_WORKER_SANDBOX=external` for installs whose sandboxing is provided
   by external layers.

### Report #1 — live claude worker cannot execute and narrates expected results (paired `abiogenesis 4.6.0-rc.4`)

Root cause upstream in ABG's claude stream-json transport: `--tools ""` was
hardwired, contradicting execution-default stages. Fixed in
`abiogenesis 4.6.0-rc.4`: the transport carries a declared capability lane —
closed-prompt proofs stay tool-less; worker-executes dispatches drop both
execution-gating flags (`--tools`, `--safe-mode`).

### Report #4 — release-snapshot gate rejects lawful downstream argv localization (paired `abiogenesis 4.6.0-rc.4`)

Fixed upstream: all agent transports admit bounded downstream command-line
localization via `ABG_TS_<AGENT>_APPEND_ARGS` (protocol-owned flags rejected
fail-closed), and the m03 protocol proof is invariant-shaped rather than
exact-argv, so localizations such as `--append-system-prompt` no longer
diverge from the gate.

### Report #3 — empty committed release tarballs (no upstream defect)

Downstream monorepo `.gitignore` interaction; fixed on the consumer side.
Upstream snapshots carry real tarballs with checksums, unchanged.

## Published Product

Unchanged from `0.1.0`: lifecycle vocabulary and typed node declarations;
lifecycle and software-build graph overlays and startup bindings; policy and
exact substrate-provenance data; read-only interpretation of ABG replay and
lifecycle state. ABIogenesis remains the runtime. The repository snapshot
contains a private npm-format tarball for direct downstream installation; no
npm-registry publication is claimed.

## Exact Substrate

This release remains pinned to `@abiogenesis/typescript-tenant@4.6.0-rc.3`
(tag `v4.6.0-rc.3`, tarball SHA-256
`9cffb372c0dfc00983a5d0e882efbc3d0c3ac937a56f313000f35a4473358113`), the
substrate all qualification in this cut ran against. `abiogenesis 4.6.0-rc.4`
changes worker transport composition only — no public query facade change —
and is the recommended paired cut for consumers dispatching claude workers or
localizing worker argv; an exact re-pin of this package to rc.4 is deferred
until a re-qualification ladder runs against an rc.4 install. No broader ABG
compatibility range is claimed.

## Qualification

- Source candidate: `6a66dfa` (`rc/0.1.1`, clean tree).
- Deterministic suite: 95 tests, 87 passed, 0 failed, 8 live-gated (includes
  new binding-unit proofs for the stream and observed-field families).
- Live hello-world ladder, six scenarios green against the installed
  `4.6.0-rc.3` substrate (gpt-5.5, medium reasoning): basic-cli 190s,
  js-tenant-test 234s, js-sdlc-bootstrap 175s, rust-cli 205s, rust-service
  259s (socket-capable sandbox binding), parallel-js 190s. Per-scenario
  evidence is recorded in this line's committed ticket
  `.ai-workspace/tickets/active/B-001-software-build-overlay-plan-result-convergence.md`.
- Cut gate: fresh `SCN-GLC-HELLO-WORLD-CLI-BASIC` live run at the source
  candidate, run `20260713T100445398Z_pid15974`, 233s, converged; the
  preserved proof rides in `qualification/` with its SHA-256 in
  `checksums.sha256`.
- Live-lane environment bindings used: `ABG_TS_CODEX_MODEL=gpt-5.5`; worker
  reasoning effort medium via the desktop codex configuration; socket
  scenarios additionally used a socket-capable sandbox binding.

## Exclusions

- The six-scenario ladder evidence is composed from scenario-scoped runs on
  identical convergence code; a single-process 6/6 witness run was not
  executed for this cut.
- The sdlc hello-world graph does not carry the execution→authoring re-entry
  stage the full-lifecycle (data-mapper) graph has; an upstream-vector code
  defect discovered at the execution vector blocks rather than re-entering.
  Named follow-up work, not a claim of this cut.
- Typed environment-capability-denial classification with ledger-admitted
  sandbox-posture escalation is named follow-up work on the ABG 5.0 line.
- T-033's declarations-only migration remains open; the rc.2 data-mapper
  campaign remains predecessor evidence only; no standalone manager-callable
  build carrier is included.

The qualified operating boundary is a trusted single-developer desktop, or an
externally sandboxed install using the declared worker-sandbox bindings. The
release relies on GTL type/admission/compiler checks and defensive admission
of likely malformed F_P output; it does not claim hostile local-tamper
resistance.
