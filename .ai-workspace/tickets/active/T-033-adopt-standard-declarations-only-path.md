---
id: T-033
title: Adopt the ABG standard declarations-only path and re-prove the data-mapper campaign
type: migration
ticket_category: implementation_migration
status: active
execution_state: blocked_on_upstream_candidate_admission_and_design
goal: >-
  Replace the data-mapper live binding's remaining worker-loop, response,
  materialization, archive, consequence, and re-entry mechanisms with odd_glc
  declarations consumed by the standard GTL/ABG path, then re-prove the
  campaign from exact immutable ABG and odd_glc candidate identities.
change_class: design_reframe
re_entry_point: build_tenant_design
owner: odd_glc
priority: critical
created_at: 2026-07-11
governance_scope: STDO Method, ODD Method, declarations-only law, typed GTL C algebra
implementation_authority: >-
  Not admitted at ticket creation. Implementation begins only after the named
  ABG candidates have requirement and ratified design authority and this
  downstream migration design has passed review.
dependencies:
  - completed abiogenesis T-220 typed GTL C algebra and semantic admission
  - T-218 CR-GF-09 complete seven-term C runtime, including workflow.C
  - T-218 CR-GF-10 declared result contract and materialization over REQ-R-ABG3-PAYLOAD-028
  - T-218 CR-GF-11 standard F_D result assessment
  - T-218 CR-GF-12 ABG-owned consequence and re-entry projection
  - exact P4/I4 prior product identity from abiogenesis T-221/T-218
  - exact C1/I1 candidate identity from T-218 PH-09 for the G_next campaign
source_documents:
  - specification/PRODUCT.md
  - .ai-workspace/tickets/completed/T-031-close-data-mapper-by-delivered-requirements-proven-by-tests.md
  - .ai-workspace/tickets/completed/T-032-earned-depth-mutation-kill-proof.md
  - .ai-workspace/tickets/completed/T-029-install-odd-glc-into-scenario-sandboxes.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-217-consciousness-wave-higher-order-regulation.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-220-close-typed-gtl-c-algebra-authoring-loop.md
---

# T-033: Adopt The Standard Declarations-Only Data-Mapper Path

## Intake

This ticket owns the downstream adoption and fresh campaign formerly carried
as a cross-repo tail of abiogenesis T-217. It does not move ABG mechanism into
odd_glc and does not reopen T-220's completed algebra/compiler work.

## Current Reality

The current live data-mapper binding is not declarations-only. Its generated
template still contains:

- `fpDispatch` and `fpEvaluator` bodies;
- prompt/manifest construction, response schemas, and response parsing;
- worker-result materialization and local attempt/latest archive writes;
- deterministic execution-result assessment; and
- a consequence plugin that reads/writes local re-entry state, decides budget,
  and constructs `reenter_graph_span` actions.

The binding already delegates traversal to ABG and consumes the ABG report
verification surface. Those facts reduce the migration size; they do not close
the remaining authority violation. The committed rc.2 campaign is historical
predecessor evidence because it used this local binding.

Current intake identities:

| Surface | Identity |
|---|---|
| T-220 implementation baseline | `014448f` |
| current ABG package version | `@abiogenesis/typescript-tenant@4.6.0-rc.3` |
| rc.3 snapshot source commit | `5213301cdbfd35952badf19c27519caa9e7e6968` |
| rc.3 snapshot publication commit | `f4f081f66ef8d3ce0c737ddb9d7530176711279a` |
| pre-T-033 odd_glc baseline | `5564c1caa12518a2602e856c27e2abe07a7effe0` |
| current odd_glc released package | `@odd-glc/route-one-typescript@0.1.0` |
| odd_glc release tag | `v0.1.0` |
| odd_glc release commit | `a878475e4609e2d74d3260eb36ee05c4657b1879` |
| odd_glc tarball SHA-256 | `7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578` |

These are current predecessor and compatibility-binding facts, not the future
closure install. rc.3 is a published release candidate, not a final ABG
release. odd_glc `0.1.0` is the tapped rc.3 predecessor product, not the
future G_next product used to close this ticket.

## rc.3 Compatibility Checkpoint (2026-07-11)

- The substrate repin landed at `c39c711`; the installed package, release
  snapshot, locally installed tarball, product-toolchain manifest, and tracked
  provenance all resolve `4.6.0-rc.3` with the published tarball SHA-256
  `9cffb372c0dfc00983a5d0e882efbc3d0c3ac937a56f313000f35a4473358113`.
- rc.3 requires every plugin contract to declare its driver requirement. The
  current binding now declares its async dispatch/evaluator and synchronous
  consequence implementations accurately at `d055a15`, with a focused pin.
  The full deterministic suite passed `83/83`; eight live cases remained
  env-gated.
- A real Codex run of the current basic CLI software-build overlay at
  `build_tenants/odd_glc/typescript/test_runs/glc_software_build_overlay_live/basic-cli/20260711T032605253Z_pid4402`
  admitted 735 events and closed all seven construction vectors. It then
  stopped lawfully at the execution-result vector after the retry budget: the
  binding requires worker-produced `test-execution-result.json`, while its
  worker instruction still forbids command execution. No local executor or
  compatibility wrapper was added.
- The smaller canonical snapshot-installed GLC Hello World release gate did
  converge on the same rc.3 tarball in abiogenesis run
  `20260711T033113388Z_pid15724`, with two real worker dispatches, two response
  admissions, causal carry, two closed vectors, and stdout `Hello, world!\n`.

This checkpoint proves the rc.3 substrate and basic GLC live path. It also
confirms that T-033 remains blocked on its named standard execution/result
dependencies; it is not declarations-only migration or campaign closure.

## 0.1.0 Predecessor Ruling (2026-07-11)

odd_glc `0.1.0` is the immutable P4/rc.3 predecessor and G_boot input for this
migration. Its release branch and annotated tag point to
`a878475e4609e2d74d3260eb36ee05c4657b1879`; its tarball is pinned by SHA-256
`7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578`.

The fresh installed-product Basic CLI run `20260711T042644380Z_pid39224`
converged over that tarball and exact ABG rc.3. It closes the 0.1 compatibility
and install gate only. It is not G_next, satisfies none of T-033's five
delivery phases, and does not substitute for the post-adoption full
data-mapper campaign.

## Algebra Ruling

T-220's seven-term C algebra and host-indexed stage declarations are the
governing structure. This migration shall not introduce a vector router.

```text
odd_glc graph overlay, GraphFunctions, node types, and policy
  + workflow.C stage program
  + declared role, fibre, arm, schemas, calibration, and consequence policy
  -> ABG admission and runtime
  -> admitted response, assessment, materialization, consequence, replay
  -> odd_glc read-only lifecycle interpretation
```

Graph topology names lifecycle construction. Each C stage names its execution
role and fibre. ABG selects the declared interior. Whether an interior is F_P
or F_D does not mutate a GraphVector or create a second traversal authority.

## Upstream Entry Gate

Implementation remains blocked until accepted upstream leaves provide:

| Capability | Required behavior |
|---|---|
| complete C runtime | Execute the admitted seven-term program, including `workflow.C`, through the normal GraphCall/traversal path. |
| response admission | Consume declared per-stage F_P response contracts; malformed output becomes typed blocked/retry truth. |
| materialization | Materialize admitted worker output from declared target/schema data without an odd_glc materializer. |
| F_D assessment | Apply declared mechanical assessment over admitted outputs/evidence; odd_glc supplies domain schema/policy data only. |
| consequence projection | Derive fold, residual, continuation, and re-entry proposals from admitted facts; odd_glc owns no local continuation state. |

If a capability is absent, T-033 stays blocked. odd_glc shall not bridge the gap
with a wrapper, local parser, or vector-local dispatch branch.

## Delivery Sequence

### Phase 1 - Upstream Capability Closure

- disposition CR-GF-09 through CR-GF-12 in T-218;
- split accepted work into singular authority/design/realization leaves;
- realize and prove the public standard catalogs and compiled declarations;
- keep malformed GTL at type/admission/compiler boundaries and malformed F_P
  output at response admission.

Exit: odd_glc can describe the campaign without an executable plugin body or
runtime helper.

### Phase 2 - Downstream Migration Design

- map every local mechanism to an admitted declaration or ABG surface;
- express the route as GraphFunctions plus `workflow.C`;
- declare response/artifact schemas, materialization contracts, F_D
  assessments, calibration, and consequence policy;
- ratify the design and its inside-out break order before code changes.

Exit: a reviewed nothing-lost map names one lawful owner for every current
behavior and no invented carrier.

### Phase 3 - Declarations-Only Migration

- delete local dispatch/evaluator bodies;
- delete local prompt rendering, response parsing/admission, materialization,
  and execution-archive authority;
- delete local consequence/re-entry state and mechanism;
- retain lifecycle vocabulary, schemas, calibration, policy, graph data, and
  read-only replay interpretation;
- consume admitted standard ABG selections and the compiled C program.

Exit: deterministic tests traverse the standard path and no compatibility
wrapper remains.

### Phase 4 - Preflight And Exact Install

- compile/lint the complete GTL program and run declaration/admission negative
  tests;
- run malformed F_P response differentials;
- prove `REQ-R-ABG3-PAYLOAD-028` and CR-GF-10 one-schema/three-duties
  conformance;
- run the 11.5B execution-authority census;
- freeze one installable C1/I1 candidate and one immutable G_next candidate
  snapshot per T-029, recording versions, commits, manifests, and content
  digests without calling either a released product;

Exit: no odd_glc mechanism finding and no semantic/compiler diagnostic.

### Phase 5 - Fresh Campaign And Reconciliation

- bind the frozen G_next candidate through I1 and launch one fresh, unmodified,
  single-start full data-mapper campaign;
- preserve terminal, replay, response, materialization, report, mutation,
  depth, fold, residual, and archive evidence;
- reconcile every worker call, admitted response, materialized artifact,
  assessment, consequence, and archive ref through replay;
- rerun `REQ-R-ABG3-PAYLOAD-028`/CR-GF-10 and ODD 11.5B over the shipped
  binding and preserved run.

Exit: all retained T-031/T-032 proof predicates pass,
`REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH-012` is green, and independent
review finds no local runtime authority.

## PAYLOAD-028 / CR-GF-10 Gate

Each worker-produced artifact family has one declared schema serving three
duties:

1. render the worker-facing output contract;
2. admit the returned payload;
3. govern materialization into the target asset.

Separate prompt examples, parser schemas, and materializer schemas do not close
this gate even when their current shapes agree.

## 11.5B Exit Audit

The shipped odd_glc binding may contain declarations, immutable policy data,
install plumbing, test setup, and read-only interpretation. It contains no
product-owned mechanism that invokes workers/evaluators, executes a subject
plan, parses worker output as an authority boundary, materializes or archives
execution results, folds proof, or chooses consequence/continuation/re-entry.
A renamed helper or generated wrapper does not pass.

## Closure Law

Close only when the data-mapper graph is typed declarations plus a compiled C
program consumed by standard ABG runtime surfaces; the exact C1/I1 and G_next
candidate identities are digest-bound; a fresh unmodified live campaign converges
at the retained proof bar;
`REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH-012`,
`REQ-R-ABG3-PAYLOAD-028`/CR-GF-10, and ODD 11.5B are green; and replay
reconciles every closure-bearing effect.

## Non-Closure Conditions

- Historical rc.2 evidence is reused as post-adoption closure evidence.
- The live binding still defines dispatch/evaluator plugin bodies.
- Prompt construction, response parsing, materialization, archive,
  consequence state, or re-entry control remains executable odd_glc code.
- A wrapper calls standard plugins while retaining any local authority.
- F_P/F_D is inferred from vector identity, ordinal, stage name, or census.
- The `REQ-R-ABG3-PAYLOAD-028` schema is prompt-only or parser-only rather than
  the CR-GF-10 authority for instruction, admission, and materialization.
- Mutable source paths or incomplete install identity are used.
- Unit, synthetic, replay-only, or direct-plugin tests replace the fresh
  single-start live campaign.

## Proof Commands

```sh
cd build_tenants/odd_glc/typescript
npm test
```

```sh
cd build_tenants/odd_glc/typescript
CODEX_LIVE_FP=1 \
ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal \
ABG_TS_LIVE_TIMEOUT_MS=1200000 \
ODD_GLC_LIVE_SCENARIO=data-mapper-full \
node --test test/glc-software-build-overlay-live.test.mjs \
  --test-name-pattern "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT"
```

```sh
git diff --check
```

## Closure Evidence

None. T-033 is registered for dependency sequencing and design only.
