# SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT — rc.2 clean-run evidence

Committed audit evidence for the full data-mapper campaign executed over the
installed `@abiogenesis/typescript-tenant` **4.6.0-rc.2** substrate
(sourceCommit `5c312df71aecab0b388e6222879eed90e9e84c40`).

## What is committed here

- `odd-glc-software-build-overlay-live-proof.json` — the proof artifact
  written by `test/glc-software-build-overlay-live.test.mjs` for this run
  root: substrate provenance, install file digests, the ordered event
  sequence (kind/ordinal/timing projection), event counts, the
  requirement-lineage canary, `eventLogSha256` pinning the full event log,
  and the split timing surface (codex P1, 2026-07-10):
  - `campaignDurationMs: 4869063` (~81.2 min) — REPLAY-derived: first
    admitted event → first converged terminal (decisive by admission
    ordinal). Survives degenerate resumes.
  - `startInvocationDurationMs` — the writing process's own start
    invocation only (seconds on a resume; never the campaign claim).
- `evidence-ledger.jsonl` — the substantive truth rows extracted VERBATIM
  from the full event log, in log order, so the depth/mutation/closure
  proof is independently checkable from the repo (codex P1/P2,
  2026-07-10): all rows of kind `depth_proof_map_admitted`,
  `mutation_outcomes_admitted`, `vector_closed`, `retry_repair_planned`,
  `terminal_reached`, `c_call_judged`. 129 rows:
  - 240 accepted depth-proof rows (5 admission events)
  - 64 mutation-outcome rows — 64/64 killed (`mutantCompiled` AND
    `suiteExit != 0` AND `restoreDigest == baselineDigest`)
  - 28 `vector_closed`; 2 allowlisted `retry_repair_planned`
    (`transport_failure`: the 900000 ms operator turn budget expiring
    mid-mutation-grind; each attempt continued the persisted matrix);
    86 `c_call_judged`; converged terminals (first is the campaign
    close; later ones are resume re-attestations)
  - ledger sha256:
    `d296bcfb14675d297b01c476a00135dd14162ad40065f78a0fdd915830d3a19d`

**Extraction rule (byte-reproducible):** take every line of the full
`events.jsonl` whose `kind` is in the six-kind list above, preserving log
order and line content verbatim, joined with `\n` and a trailing newline.
Anyone holding the full log can re-derive `evidence-ledger.jsonl` and
byte-compare.

**Load-bearing pin:** `test/data-mapper-campaign-evidence.test.mjs`
(default suite, no live env) re-derives all of the above from these
committed files on every run — the evidence cannot silently drift from
the claims.

## What is NOT committed, and why

The raw event log (`instance/.ai-workspace/events/events.jsonl`, ~127 MB —
worker transport payloads carry full sbt suite output) exceeds git hosting
limits. It stays under the local run root:

```
test_runs/glc_software_build_overlay_live/data-mapper-full/20260710T012832676Z_pid27696/
```

Any copy of that log self-certifies against this evidence set:

```
shasum -a 256 instance/.ai-workspace/events/events.jsonl
# must equal the proof's eventLogSha256 (strip the sha256: prefix):
# becd3a15ab3cbac0ba9649927197895cafe2ce9e9a645d60fd3748dc4ca5bd4b
```

## Run shape (replay-derived)

- terminal: `converged` — all graph-function vectors closed by replay
- vectors closed: 28; worker invocations: 30; retries: 2 (allowlisted)
- depth-proof rows admitted: 240; mutation outcomes: 64 rows, 64/64 killed
- c_call spines: 86 opened / 86 judged; lineage canary: zero dropped
  requirement ids, zero pressure-missing ids
- campaign wall span: 4,869,063 ms (~81.2 min), replay-derived as above

The run root additionally carries three degenerate `ODD_GLC_LIVE_RESUME`
re-entries (T-030 run-18 boundary) appended after convergence: harness
repairs (`dataMapperGate` exact-literal pin; replay-derived event kinds;
the split timing surface) were each verified against the SAME closed
frontier — no new worker turns, no scenario change.
