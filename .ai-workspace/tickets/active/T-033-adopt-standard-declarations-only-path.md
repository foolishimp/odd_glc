---
id: T-033
title: Design adoption of the ABG standard declarations-only data-mapper path
type: feature
ticket_category: ordinary
status: superseded
execution_state: superseded_by_T041
goal: >-
  Ratify the nothing-lost declarations-only migration design and exact proof
  contract that T-038 will realize over the accepted ABIogenesis interfaces.
change_intent: >-
  Design the replacement of product-local dispatch, prompt/response,
  materialization/archive, assessment, consequence, and re-entry authority
  with declarations consumed by the standard ABG runtime.
change_class: design_reframe
re_entry_point: build_tenant_design
owner: odd_glc
priority: critical
created_at: 2026-07-11
updated_at: 2026-07-11
superseded_at: 2026-08-04
superseded_by: T-041
triaged_at: 2026-07-11
build_tenant: typescript
source_ticket: abiogenesis T-218
target_candidate_identity: digest-bound G5 source candidate; release version remains unassigned
target_release_line: 0.2
governance_scope: STDO Method, ODD Method, declarations-only law, typed GTL C algebra
implementation_authority: >-
  None. T-041 supersedes this ticket as the sole ABIogenesis 5.0 migration
  authority. This ticket remains predecessor evidence only.
dependencies:
  - completed abiogenesis T-220 typed GTL C algebra and semantic admission
  - abiogenesis T-226 complete C/runtime design
  - abiogenesis T-179 node_type and overlay application design
source_documents:
  - specification/PRODUCT.md
  - .ai-workspace/tickets/completed/T-031-close-data-mapper-by-delivered-requirements-proven-by-tests.md
  - .ai-workspace/tickets/completed/T-032-earned-depth-mutation-kill-proof.md
  - .ai-workspace/tickets/completed/T-029-install-odd-glc-into-scenario-sandboxes.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-217-consciousness-wave-higher-order-regulation.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-220-close-typed-gtl-c-algebra-authoring-loop.md
realization_successor: .ai-workspace/tickets/backlog/T-038-realize-standard-declarations-only-path.md
---

# T-033: Design The Standard Declarations-Only Data-Mapper Path

## Intake

This ticket owns the downstream migration design formerly carried as a
cross-repo tail of abiogenesis T-217. T-038 owns adoption and the fresh
campaign. This ticket does not move ABG mechanism into odd_glc and does not
reopen T-220's completed algebra/compiler work.

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
future G5 candidate bytes used to close this ticket.

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

odd_glc `0.1.0` is the immutable P4/rc.3 predecessor and G0 input for this
migration. Its release branch and annotated tag point to
`a878475e4609e2d74d3260eb36ee05c4657b1879`; its tarball is pinned by SHA-256
`7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578`.

The fresh installed-product Basic CLI run `20260711T042644380Z_pid39224`
converged over that tarball and exact ABG rc.3. It closes the 0.1 compatibility
and install gate only. It is not G5, satisfies neither T-033 design closure nor
T-038 realization proof, and does not substitute for the post-adoption full
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

## Upstream Design Entry Gate

Design finalization remains queued until accepted upstream design leaves define:

| Capability | Required behavior |
|---|---|
| complete C runtime | Execute the admitted seven-term program, including `workflow.C`, through the normal GraphCall/traversal path. |
| response admission | Consume declared per-stage F_P response contracts; malformed output becomes typed blocked/retry truth. |
| materialization | Materialize admitted worker output from declared target/schema data without an odd_glc materializer. |
| F_D assessment | Apply declared mechanical assessment over admitted outputs/evidence; odd_glc supplies domain schema/policy data only. |
| consequence projection | Derive fold, residual, continuation, and re-entry proposals from admitted facts; odd_glc owns no local continuation state. |

If an interface remains undesigned, T-033 stays queued. odd_glc shall not fill
the gap with a wrapper, local parser, or vector-local dispatch branch.

## Delivery Sequence

### Phase 1 - Upstream Design Closure

- complete abiogenesis T-226 and T-179 over the admitted C/runtime, result,
  materialization, assessment, consequence, and retained catalog-kind contracts;
- bind the design to the public standard catalog and compiled-declaration contracts;
- keep malformed GTL at type/admission/compiler boundaries and malformed F_P
  output at response admission.

Exit: odd_glc can design the campaign without inventing an executable plugin
body or runtime helper.

### Phase 2 - Downstream Migration Design

- map every local mechanism to an admitted declaration or ABG surface;
- express the route as GraphFunctions plus `workflow.C`;
- declare response/artifact schemas, materialization contracts, F_D
  assessments, calibration, and consequence policy;
- ratify the design and its inside-out break order before code changes.

Exit: a reviewed nothing-lost map names one lawful owner for every current
behavior and no invented carrier.

## T-038 Realization Handoff

T-038 exclusively owns:

- declarations-only code migration and old-path retirement;
- deterministic compiler, malformed-response, three-duties, and 11.5B proof;
- exact R5/I1 installation and digest-bound G5 source-candidate freeze;
- the fresh full data-mapper live campaign and replay reconciliation; and
- the authority-first implementation/campaign self-review.

T-033 shall deliver a ratified nothing-lost map, exact interface/carrier
contract, inside-out break order, mixed-state rejection law, installed proof
plan, and campaign evidence contract sufficient for T-038 to execute without
inventing semantics.

## Required Design Deliverables

1. Map every current local producer, consumer, plugin body, prompt/response
   path, materializer/archive path, assessment path, consequence/re-entry state,
   projection, install binding, and proof fixture.
2. Bind each retained behavior to an odd_glc declaration/policy/read-only
   interpretation or the ratified ABIogenesis T-226/T-179 interface design;
   name T-227/T-228 only as the realization successors for those contracts.
3. Define the `(program, role, fibre, arm)` declaration, response/artifact
   schemas, three-duties contract, F_D assessment, consequence, and replay interfaces.
4. Define the inside-out sever/rebind order and a negative proof for every old seam.
5. Define exact R5/I1 plus digest-bound G5 source-candidate identity,
   source-isolation, 11.5B,
   full campaign, archive, and replay-reconciliation closure evidence.
6. Publish the design/IACS/carrier diagrams and T-038 execution contract.

## Closure Law

Close only when a ratified design gives every current behavior one lawful
owner, publishes the exact carriers/interfaces and inside-out break/proof order,
defines the installed digest-bound G5 candidate and campaign contract, and leaves T-038
executable without implementation inference. No code, candidate, deterministic
gate, live campaign, or release claim is required or credited to T-033 closure.

## Non-Closure Conditions

- A current mechanism lacks a design disposition or exact successor owner.
- The design adds a vector router, local parser/materializer, runtime helper,
  continuation state, or second truth surface as the target.
- F_P/F_D classification, schema authority, consequence ownership, installed
  identity, campaign entry, or evidence reconciliation remains implicit.
- T-033 claims implementation, candidate, campaign, or release closure.
- T-038 would need ticket history or implementation precedent to invent an interface.

## Proof Commands

```sh
git diff --check
```

Authority-to-design trace review, IACS/carrier review, nothing-lost map review,
and independent design self-review are required. Runtime tests are T-038 proof.

## Closure Evidence

None. T-033 is active and queued for the exact ABIogenesis designs. T-038 is
the only realization and campaign successor.
