---
id: T-038
title: Realize the ABG standard declarations-only path and re-prove data mapper
type: feature
ticket_category: implementation_migration
status: superseded
execution_state: superseded_by_T041
goal: Deliver the declarations-only G5 source candidate for ABIogenesis GOAL-035
change_intent: >-
  Replace the live data-mapper binding's executable product-local dispatch,
  prompt/response, materialization/archive, assessment, consequence, and
  re-entry paths with the declarations-only T-033 design, then freeze and prove
  exact G5 candidate bytes through the fresh full campaign.
change_class: realization_refactor
re_entry_point: build_tenants/odd_glc/typescript
owner: odd_glc
priority: critical
triaged_at: 2026-07-11
created_at: 2026-07-11
updated_at: 2026-07-11
superseded_at: 2026-08-04
superseded_by: T-041
source_ticket: T-033
build_tenant: typescript
admission_condition: superseded; T-041 owns the current ABIogenesis 5.0 migration
migration_strategy: inside_out_hard_break
library_usage: consume
governing_library: ABIogenesis T-227/T-228 declared C, result, materialization, assessment, consequence, catalog, and replay surfaces
old_truth_path: odd_glc generated plugin bodies, prompt/response parser, materializer/archive writer, deterministic assessor, and consequence/re-entry state
new_truth_path: odd_glc declarations and policy consumed by exact installed ABIogenesis public catalog and runtime contracts
old_producer_set: generated odd_glc live binding and its product-local helpers
new_producer_set: odd_glc GTL declarations plus ABIogenesis-owned instruction, response-admission, materialization, assessment, consequence, event, and replay producers
old_consumer_set: local live runner, local archives/state, campaign assertions, and read models consuming product-local truth
new_consumer_set: ABIogenesis traversal/closure and odd_glc read-only lifecycle interpretation over admitted replay truth
projection_surfaces: result, materialization, assessment, evidence, depth, consequence, fold, residual, continuation, archive, and campaign summaries
dependencies:
  - completed T-033 declarations-only migration design
  - completed abiogenesis T-223 installed product/catalog/public steel thread
  - completed abiogenesis T-227 seven-term C and declared result runtime
  - completed abiogenesis T-228 node_type and overlay application
  - exact self-hosted R5/I1 candidate from completed abiogenesis T-234
authority_refs:
  - specification/PRODUCT.md
  - .ai-workspace/tickets/active/T-033-adopt-standard-declarations-only-path.md
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/product/REQ-P-CATALOG.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-PAYLOAD.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/gtl/REQ-L-GTL3-C-ALGEBRA.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/backlog/T-227-realize-complete-declared-c-runtime.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/backlog/T-228-realize-noncallable-catalog-kind-semantics.md
release_successor: .ai-workspace/tickets/backlog/T-039-publish-and-qualify-g5-0-2-rc.md
target_candidate_identity: digest-bound G5 source candidate; release version remains unassigned
target_release_line: 0.2
---

# T-038: Realize The Standard Declarations-Only Data-Mapper Path

## Target Truth

The frozen digest-bound G5 source candidate contains lifecycle declarations,
schemas, calibration, immutable policy, install inputs, and read-only replay
interpretation. It contains no product-owned mechanism that invokes workers or
evaluators, renders or parses authoritative worker responses, materializes or
archives execution results, executes subject plans, folds proof, or chooses
consequence, continuation, or re-entry.

The full data-mapper program is GraphFunctions plus `workflow.C` and declared
`(program, role, fibre, arm)` stage identities consumed by exact installed
R5/I1. One fresh unmodified public-start campaign converges at the retained
T-031/T-032 proof bar and replay reconciles every closure-bearing effect.

## Required Work

1. Implement the ratified T-033 declaration/IACS/carrier design without adding
   a compatibility wrapper or product-local runtime helper.
2. Delete local dispatch/evaluator bodies and local prompt/response authority.
3. Delete local materialization/archive, deterministic assessment execution,
   consequence/re-entry state, and action construction.
4. Bind the compiled C program, declared response/artifact schemas, standard
   materialization, F_D assessment, consequence, and replay contracts.
5. Compile/lint the complete GTL program and run malformed declaration and F_P
   response differentials.
6. Prove the PAYLOAD-028 one-schema/three-duties path and ODD 11.5B authority census.
7. Freeze the exact source commit, package-content census, descriptor,
   contribution manifest, dependency intent, install inputs, and digests. Record
   any development package version as non-release metadata; do not assign an RC
   or final product version.
8. Bind those bytes through exact R5/I1 and launch one fresh unmodified
   single-start full data-mapper campaign.
9. Preserve and reconcile worker calls, admitted responses, materialized
   artifacts, assessments, consequence/fold/residual/re-entry, depth/mutation,
   archives, and terminal truth through replay.
10. Perform the phase-end authority-first code/campaign review before closure.

## Migration Declaration

The new authoritative path begins with typed odd_glc declarations and policy,
then crosses only installed ABIogenesis catalog, C, instruction, result,
materialization, assessment, consequence, event, and replay contracts. Local
producers are severed before consumers are rebound. No compatibility wrapper,
renamed helper, direct plugin call, or mixed old/new campaign is retained as
current truth or closure evidence.

## Impacted Interface Review Checklist

- [ ] generated GraphFunction/plugin publication contains declarations and
  immutable policy only; no dispatch or evaluator body remains.
- [ ] workflow.C declarations bind `(program, role, fibre, arm)` and do not
  infer F_P/F_D from vector identity, ordinal, or stage name.
- [ ] worker instructions and PromptManifest come only from ABG instruction
  assembly over the declared response/artifact contracts.
- [ ] response admission rejects malformed, incomplete, contradictory, or
  schema-unbound output through ABG; no odd_glc parser remains authoritative.
- [ ] materialization and execution archives derive only from ABG-admitted
  result/artifact truth; local latest/attempt writers are removed.
- [ ] standard F_D assessment consumes admitted mechanical facts and does not
  execute subject work or reinterpret semantic F_P judgment.
- [ ] consequence, fold, residual, continuation, and re-entry consume ABG
  projections; no local state file or action constructor remains.
- [ ] startup/install binding selects exact R5/I1 plus frozen G5 bytes and
  imports no mutable ABIogenesis or odd_glc source.
- [ ] lifecycle query/report surfaces remain read-only interpretation and
  cannot close independently of ABG replay.
- [ ] deterministic and live proof lanes enter through the public installed
  path and fail if any old helper is restored.

## Required Break Order

1. Reconfirm T-033's full producer/consumer/projection census on the current tree.
2. Publish the complete declarations, schemas, calibration, and policy.
3. Sever local dispatch/evaluator and prompt/response authority; pin rejection.
4. Rebind response admission, materialization, and F_D assessment to ABG.
5. Sever local archive/consequence/re-entry state; pin rejection.
6. Rebind replay consumers, install/start, and deterministic proofs.
7. Remove/reprice mixed-state fixtures and prove the new path source-blind.
8. Freeze candidate bytes, run the campaign, reconcile replay, and run 11.5B.

## Break-To-Closure Map

| Break | Old seam kept broken | Required negative proof | Closes |
|---|---|---|---|
| declaration publication | executable plugin bodies | generated binding contains no callable dispatch/evaluator implementation | declarations-only carrier |
| response path | local prompt/parser/defaults | malformed/schema-unbound result fails in ABG before write/close | PAYLOAD-028/T-227 |
| materialization/assessment | local writer/executor/checker | restoring local authority fails 11.5B | three duties and F_D ownership |
| consequence/re-entry | local state/action constructor | candidate advice cannot mutate continuation or replay | ABG consequence ownership |
| install/start | source/private binding | proof fails without exact installed R5/I1 and G5 identities | source independence |
| campaign/projection | mixed old/new summaries | restored helper or unreconciled effect prevents closure | fresh campaign and replay reconciliation |

## Migration Checklist

- [ ] old truth path is named explicitly
- [ ] new truth path is named explicitly
- [ ] producer set for the new truth is listed
- [ ] consumer set for the new truth is listed
- [ ] projection/read-model surfaces are listed
- [ ] old truth path is removed or explicitly demoted from authority
- [ ] mixed-state behavior is no longer accepted as closure evidence
- [ ] tests proving mixed old/new behavior are removed or repriced
- [ ] recurring realization patterns are checked against existing library/commonization surfaces
- [ ] ticket declares library usage and names the governing library or rationale
- [ ] this ticket carries only the TypeScript tenant lifecycle
- [ ] ticket wording, product wording, and proof claims are reconciled before closure

## Closure Law

Close only when exact R5/I1 and digest-bound G5 source-candidate identities are
digest-bound; the frozen source candidate is declarations-only under ODD 11.5B; all
T-033 interfaces and migration checklist rows are current; PAYLOAD-028/T-227
and requirement-proof carry-through pass; one fresh unmodified full data-mapper
campaign converges at the retained proof bar; and replay reconciles every
closure-bearing effect.

## Non-Closure Conditions

- Historical rc.2/rc.3 or odd_glc 0.1 evidence substitutes for post-migration proof.
- Any dispatch/evaluator body, prompt/response parser, materializer/archive
  writer, assessment executor, consequence state, or re-entry control remains.
- A wrapper calls standard plugins while retaining local authority.
- F_P/F_D is inferred from vector identity, ordinal, stage name, or census.
- An artifact schema is prompt-only or parser-only rather than the T-227
  instruction/admission/materialization authority.
- Mutable source, incomplete install identity, or mixed old/new tests enter closure.
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

## Self-Review Contract

After deterministic and campaign gates pass, review PRODUCT, T-033, exact
ABIogenesis authority/design, the current diff, package/install census, runtime
replay, and 11.5B results. Repair reachable authority or truth defects before
closure. Route low-probability hostile-desktop or unrelated future-product
findings to separate intake rather than widening this migration.

## Closure Evidence

None. This ticket is backlog and non-admissible until its named design/runtime
dependencies close.
