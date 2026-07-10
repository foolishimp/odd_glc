# SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT — rc.2 clean-run evidence

Committed audit evidence for the full data-mapper campaign executed over the
installed `@abiogenesis/typescript-tenant` **4.6.0-rc.2** substrate
(sourceCommit `5c312df71aecab0b388e6222879eed90e9e84c40`).

## What is committed here

- `odd-glc-software-build-overlay-live-proof.json` — the proof artifact
  written by `test/glc-software-build-overlay-live.test.mjs` for this run
  root. It carries the substrate provenance, install file digests, the full
  ordered event sequence, event counts, the requirement-lineage canary, and
  `eventLogSha256` pinning the run's event log.

## What is NOT committed, and why

The raw event log (`instance/.ai-workspace/events/events.jsonl`, 127 MB —
worker transport payloads carry full sbt suite output) exceeds git hosting
limits. It stays under the local run root:

```
test_runs/glc_software_build_overlay_live/data-mapper-full/20260710T012832676Z_pid27696/
```

Any copy of that log self-certifies against this proof:

```
shasum -a 256 instance/.ai-workspace/events/events.jsonl
# must equal the proof's eventLogSha256 (strip the sha256: prefix):
# cc9d2ed43766993f57b9b6430be4fafda36822999f0cb8208f70152f64ee489c
```

## Run shape (replay-derived)

- terminal: `converged` — all graph-function vectors closed by replay
- vectors closed: 28; worker invocations: 30; retries: 2 (allowlisted
  `transport_failure`, both the 900000 ms operator turn budget expiring
  mid-mutation-grind; each attempt continued the persisted mutant matrix)
- depth-proof rows admitted: 240 (5 `depth_proof_map_admitted` events)
- mutation outcomes: 64 rows, 64/64 killed (suite red + verified restore)
- c_call spines: 86 opened / 86 judged; evidence rows admitted: 393
- lineage canary: zero dropped requirement ids, zero pressure-missing ids

The run root additionally carries two degenerate `ODD_GLC_LIVE_RESUME`
re-entries (T-030 run-18 boundary) appended after convergence: harness
assertion repairs (`dataMapperGate` exact-literal pin; replay-derived event
kinds) were verified against the SAME closed frontier — no new worker turns,
no scenario change.
