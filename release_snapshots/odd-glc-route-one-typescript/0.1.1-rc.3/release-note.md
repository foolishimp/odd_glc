# odd_glc 0.1.1-rc.3

`odd_glc 0.1.1-rc.3` is the downstream-consumable support-line candidate
paired exactly with `abiogenesis 4.6.0-rc.5`. It supersedes rc.2 by removing
the duplicated Hello World subject executor and stdout-derived closure logic,
and by rejecting malformed worker results at the shared producer boundary.

This is an RC publication, not a final tap. It makes no npm-registry or API
stability claim.

## Shared graph-overlay correction

All six Hello World scenarios now apply one reusable odd_glc software-build
graph function and one execution-result contract. The concurrent JavaScript
scenario is another application of that overlay; it does not own a special
executor or closure path.

The correction removes the duplicated imperative subject executor and the
stdout pass-count regex from the odd_glc live binding. The graph path is now:

1. The F_P execution producer writes the declared execution plan and typed
   execution result.
2. A shared producer hook admits the native result shape before the same graph
   edge can close. A malformed `status`, missing report path, or invalid count
   blocks that producer edge and uses the existing ABG retry law.
3. The following F_D result vector reads the structured JUnit report, derives
   observed counts, corroborates them against the typed result, and decides
   closure as a total function over constrained inputs.

Worker stdout remains provenance only. It is not a closure input. This closes
the downstream defect where one worker rendered a correct test result without
the expected TAP glyph and the old regex incorrectly blocked the run.

No GTL term, graph semantic, scheduler, retry controller, operator verb, or
product-local runtime was added. ABG remains the traversal, admission, retry,
event, replay, and closure authority.

## Exact products

ABG substrate:

- package: `@abiogenesis/typescript-tenant@4.6.0-rc.5`
- tag: `v4.6.0-rc.5`
- source commit: `bab609ab353304324b939a4528371603eef0a05d`
- snapshot commit: `8d43dc8968e3df16029e6201680a0301eda035f1`
- tarball SHA-256:
  `d9c99382f2c5b787ebe48ce72c320616baeac9187863078332df18c0036853ea`

odd_glc product:

- package: `@odd-glc/route-one-typescript@0.1.1-rc.3`
- tag: `v0.1.1-rc.3`
- source candidate: `06c593ec53a2378a48beda4e788502128f16276e`
- tarball SHA-256:
  `579e11e336af044f549a9ac20a37db68499595f306a49edc0e2cb07bb0c4f583`

The tarball remains the same six-file declaration/read-model product:
`README.md`, `package.json`, `src/index.d.ts`, `src/index.mjs`,
`src/substrate_provenance.mjs`, and `substrate.provenance.json`. The live
qualification harness is source-tag proof infrastructure, not a packaged
runtime.

## Qualification

The final gate used that exact packed pair in one process and one environment:

- worker: Claude through the governed local-spawn transport
- sandbox posture: externally provided trusted-desktop confinement
- deterministic suite: 98 tests, 90 passed, 0 failed, 8 expected live skips
- live matrix: 6 scenarios, 6 passed, 0 failed, 3,448 seconds

| Scenario | Duration | Worker tools | Typed result | Structured report | Typed retries |
|---|---:|---:|---|---|---:|
| CLI Basic | 487s | 6 | status 0, observed 4 | 4 tests, 0 failures | 0 |
| JS Tenant Test | 638s | 6 | status 0, observed 6 | 6 tests, 0 failures | 1 |
| JS SDLC Bootstrap | 487s | 4 | status 0, observed 8 | 8 tests, 0 failures | 0 |
| Rust CLI | 559s | 7 | status 0, observed 7 | 7 tests, 0 failures | 0 |
| Rust Service | 769s | 6 | status 0, observed 2 | 2 tests, 0 failures | 0 |
| Parallel JS | 498s | 6 | status 0, observed 3 | 3 tests, 0 failures | 0 |

The one JS Tenant retry was a typed earlier-vector conformance repair, not an
execution-result retry. Every scenario invoked installed ABG start exactly
once, reached the replay-derived converged terminal, admitted integer
`status: 0`, corroborated a structured report with zero failures and errors,
and recorded no transport failure classification.

Each proof bundle preserves the traversal proof plus a normalized,
source-digest-backed record of the worker lane, evaluator lane, authored
result, closure-bearing F_D assessment, and structured test report. Raw agent
transcripts and session metadata are excluded. Every published file is pinned
by `checksums.sha256` and the release snapshot manifest.

## Operating boundary and exclusions

- This pair targets one trusted developer desktop, or an install whose
  external sandbox provides the declared confinement.
- Defensive scope is malformed authored GTL and likely malformed,
  incomplete, or contradictory F_P output. Hostile local tamper resistance is
  not claimed.
- The six Hello Worlds qualify the shared graph-overlay execution contract.
  They do not substitute for the full data-mapper campaign.
- T-033's remaining declarations-only migration and full data-mapper release
  evidence remain outside this support cut.
- No npm-registry publication is claimed.
