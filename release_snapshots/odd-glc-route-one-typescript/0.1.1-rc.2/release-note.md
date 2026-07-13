# odd_glc 0.1.1-rc.2

`odd_glc 0.1.1-rc.2` is the downstream-consumable support-line candidate
paired exactly with `abiogenesis 4.6.0-rc.5`. It supersedes the rc.1 pairing
for Claude execution-stage workers. It is an RC publication, not a final tap,
and makes no API-stability or registry-publication claim.

## Downstream correction

The corporate downstream report was correct: rc.4 declared a
`worker_executes` capability lane, but odd_glc did not pass that lane into the
real ABG dispatch call. Codex qualification had not exposed the defect because
its transport granted tools independently of the lane.

The paired cuts close both real seams:

- ABG rc.5 carries `AgentTransportRequest.lane` through the one argv-composition
  seam used by `runAgentTransport`.
- ABG result classification applies the no-tool contract only to
  `closed_prompt_proof`; honest tool use in `worker_executes` is execution
  evidence, not a contract failure.
- odd_glc derives the worker lane from the declared stage contract. Its
  evaluator stays `closed_prompt_proof` because it judges evidence rather than
  executing the subject toolchain.

This is a transport and binding correction only. It adds no GTL term, graph
semantics, scheduler, retry controller, closure rule, or operator verb.

## Retained B-001 corrections

The rc.1 plan/result convergence fixes remain present: satisfiable
execution-stage contracts, captured-stream normalization, observed-field
normalization, runner-environment sanitization, declared sandbox posture, and
the parallel-JS named-import correction. Rc.2 also carries:

- the exact greeting conformance pin derived from each scenario's declared
  expected value; and
- a Rust-service UAT clarification that tests only the declared `GET /hello`
  route, with wrong-case and missing-newline body checks providing negative
  depth. No undefined-route or 404 product behavior was added.

## Exact products

ABG substrate:

- package: `@abiogenesis/typescript-tenant@4.6.0-rc.5`
- tag: `v4.6.0-rc.5`
- source commit: `bab609ab353304324b939a4528371603eef0a05d`
- snapshot commit: `8d43dc8968e3df16029e6201680a0301eda035f1`
- tarball SHA-256:
  `d9c99382f2c5b787ebe48ce72c320616baeac9187863078332df18c0036853ea`

odd_glc product:

- package: `@odd-glc/route-one-typescript@0.1.1-rc.2`
- tag: `v0.1.1-rc.2`
- source candidate: `d32672077d25cb3302bf073ccaceabc66aeea692`
- tarball SHA-256:
  `a06673be3e9a8e26fa9159fbc4dd33efee906a112345075a537854ecde4b2f19`

The odd_glc tarball remains the same six-file declaration/read-model product:
`README.md`, `package.json`, `src/index.d.ts`, `src/index.mjs`,
`src/substrate_provenance.mjs`, and `substrate.provenance.json`. ABG remains
the runtime. The odd_glc live harness is source-tag proof infrastructure, not a
second packaged runtime.

## Qualification

The final gate used the frozen packed pair in one process and one environment:

- worker: Claude Sonnet, selected through the existing governed argv binding
- sandbox posture: externally provided trusted-desktop confinement
- deterministic suite: 96 tests, 88 passed, 0 failed, 8 expected live skips
- live matrix: 6 scenarios, 6 passed, 0 failed, total 2,388 seconds

| Scenario | Duration | Worker evidence | Evaluator evidence | Typed retries |
|---|---:|---|---|---:|
| CLI Basic | 385s | open lane, 9 tools, status 0 | closed lane, 0 tools, status 0 | 1 |
| JS Tenant Test | 380s | open lane, 3 tools, status 0 | closed lane, 0 tools, status 0 | 1 |
| JS SDLC Bootstrap | 283s | open lane, 8 tools, status 0 | closed lane, 0 tools, status 0 | 0 |
| Rust CLI | 397s | open lane, 6 tools, status 0 | closed lane, 0 tools, status 0 | 1 |
| Rust Service | 560s | open lane, 5 tools, status 0 | closed lane, 0 tools, status 0 | 1 |
| Parallel JS | 367s | open lane, 7 tools, status 0 | closed lane, 0 tools, status 0 | 0 |

Every scenario reached the replay terminal, invoked ABG start exactly once,
recorded an observed test status of 0 with `fail 0`, and had no transport
failure classification. The proof records four bounded
`payload_rejected`/`retry_attempt_opened` sequences; no execution vector repair
loop remained.

Each of the six proof bundles preserves the traversal proof plus a normalized,
source-digest-backed record of the worker lane, evaluator lane, and observed
subject result. Raw agent transcripts and session metadata are deliberately
excluded. All published files are digest-pinned by `checksums.sha256` and the
release snapshot manifest.

## Operating boundary and exclusions

- This pair targets one trusted developer desktop, or an install whose external
  sandbox provides the declared confinement.
- Defensive scope is malformed authored GTL and likely malformed, incomplete,
  or contradictory F_P output. Hostile local tamper resistance is not claimed.
- The ABG package-only installer used an explicitly supplied standards/docs
  source while constructing the exact install; a self-contained installer is
  not claimed by this support cut.
- Account spend-limit and rate-limit failures remain external conditions. This
  cut does not reprice their transport-failure classification.
- T-033's declarations-only migration and the full data-mapper rerun remain
  open work. They are not release claims of this support cut.
- No npm-registry publication is claimed.
