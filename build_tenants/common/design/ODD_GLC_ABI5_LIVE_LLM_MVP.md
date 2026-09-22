<a id="odd-glc-abi5-live-llm-mvp"></a>

# odd_glc ABI5 Full-Input Lifecycle

**Ticket**: [T-043](../../../.ai-workspace/tickets/active/T-043-deliver-generic-live-llm-scenario-mvp.md)

**Authority**: [Product lifecycle meaning](../../../specification/PRODUCT.md#full-input-lifecycle-meaning),
[lifecycle assets](../../../specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md)
and [upstream consumption](../../../specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md)

**Route**: `product_reprice -> requirement_reprice -> design_reframe -> realization_refactor`

## Decision

Keep one generic odd_glc Product and one reusable GTL workflow declaration.
The full selected source is carried through Intent/Product, Requirements,
Design, construction, evidence and targeted revision. ABIogenesis supplies
the admitted carriers and runtime relations; odd_glc supplies lifecycle meaning,
policy, scenario inputs and proof interpretation. Selection, delivered evidence
and candidate acceptance are recorded in T-043, not inferred from this design.

There is no odd_glc prompt engine, stage runner, worker loop, event writer,
replay engine, Hello World Product, Data Mapper Product, scenario Program, or
scenario-specific runtime adapter.

## Generic Workflow

The following slots are lifecycle meanings over owner contracts, not newly
invented GraphFunction or carrier identifiers. The published GTL composition
must bind their exact inputs, outputs, dependencies and gates before execution.

| Slot and order | Required admitted input and result | Handoff condition |
|---|---|---|
| Bind complete input | Selected source members/digests, input role, user authority, worksite and existing evidence -> source basis and unresolved source relations. | Every selected member is available; unresolved references and conflicts stay visible. |
| Derive Intent | Source basis and prior intent if any -> intended outcomes, constraints and source-linked judgment. | Semantic assessment preserves the selected input meaning. |
| Define Product | Admitted Intent and complete source -> subject boundary, observable outcomes and obligation basis. | No new builder/scenario Product identity; excluded meaning requires owner authority. |
| Derive Requirements | Source and Product results -> admitted requirements/refinements with realization and proof obligations and residuals. | C checks identities/relations; J evaluates completeness against the full input. |
| Select Design | Admitted requirements, prior worksite/design and capabilities -> topology, bounded targets, territories and verifier plan. | Realization and verifier claims share the source obligation; remaining work stays pending. |
| Construct | Admitted Design and current O0 -> live Worker candidate, owner C0 effects and admitted O1. | Targets derive from Design; accepted results and replay establish the next input. |
| Execute evidence | Current constructed subject and same proof obligations -> typed Worker command/probe observations. | Observe actual behavior, identities and required negative cases. |
| Evaluate | Admitted realization, verifier and semantic evidence -> ABG coverage/fold/residual truth with GLC interpretation and applicable owner ruling. | A bounded claim closes only its supported obligations; full-source obligations remain visible. |
| Revise and resume | Failed verification or admitted changed requirement plus dependency truth -> affected re-entry, stale evidence and retained unaffected basis. | ABG owns correction and persisted-state resume; new evidence precedes renewed closure. |

After setup, the host invokes the declared lifecycle composition through its
public ABG entry. ABG owns stage selection, invocation, readiness, folds and
continuation. The host may provision the test worksite and read public results;
it must not implement this table as sequential calls, a switch, retry loop or
local stage/obligation ledger. It does not execute subject commands, import
subject modules, probe HTTP outcomes or manufacture observations.

Each stage's result and activation retain the admitted source/predecessor
references, source obligation, evidence role, authority, current basis and
remaining pressure. C checks declared identity, reference/role congruence,
freshness and coverage. J assesses faithful derivation and sufficient evidence
and remains candidate judgment until admitted. O is the permitted owner's
ruling on scope or acceptance. These roles introduce no new runtime catalog.

The current C1/C2 caller at
[`generic-live-workflow-support.mjs`](../../odd_glc/typescript/test/generic-live-workflow-support.mjs)
constructs a fixed target vector and invokes construction then execution. It is
the predecessor realization of those two slots, not this complete composition.
Its module contracts or successful results cannot supply the omitted stages.

## Scenario Data

Every scenario supplies declaration data:

- stable scenario identity, complete selected source and its user/input role;
- the retained worksite and prior admitted evidence to reuse where applicable;
- source-linked outcomes and unresolved or speculative source material;
- environment/tool prerequisites and initial authorized territory;
- requirement/design-derived target and proof declarations for each bounded step; and
- evidence retention policy.

The [full Data Mapper source directory](../../../../odd_sdlc/build_tenants/typescript/test_env/fixtures/data_mapper_induction/specification/)
is application input, not builder authority or an imported odd_sdlc runtime.
Its five members include `INTENT.md`, `REQUIREMENTS.md`,
`mapper_requirements.md`, the imported-source list and the Frobenius appendix.
Their exact inventory is frozen in the
[D1 basis](../../../.ai-workspace/comments/codex/20260909_D1_LIFECYCLE/basis.json).

`REQUIREMENTS.md` includes adjoint, cross-domain fidelity and data-quality
obligations beyond the mapper document. The appendix and INT-006 explicitly
mark Frobenius exploration speculative. Preserve these modalities and any
cross-source differences; do not silently union conflicting meanings, discard
obligations by choosing one document, or promote speculation to mandatory law.
External source locators such as `workspace://README.md` remain provenance or
unresolved dependencies until materiality and authority are resolved. Inventory
verification does not claim a complete semantic read or requirements admission.

Hello World fixtures remain reusable bounded witnesses. Data Mapper receives
its full source while retaining the existing instance and banked evidence.

## First Useful Application Thread

Use the retained Data Mapper instance and physical worksite identified by the
[accepted native closure index](../../../.ai-workspace/comments/codex/20260909_FULL_LIVE_SUITE/data-mapper-compact-ack-repair-01/closed-proof-01/index.json):
`data-mapper-full/20260908T154515Z_full-suite-01/worksite`. Re-observe it under
the exact admitted execution basis before effects; do not reset or rebuild a
replacement instance. Its earlier artifact/evidence epochs retain their scope.

The first derived Design must implement a small real keyed-accounting and
backward-lookup path from `mapper_requirements.md` REQ-ACC-01..05 and the
applicable source adjoint/lineage requirements. For example, three identified
records produce one processed output, one intentional filter and one error.
Persist the ledger and backward metadata; a later query retrieves each source
identity's disposition and the required reason/output relation without rerunning
the transform. Check actual values, key coverage, partition disjointness and
lookup results. An equal-count replacement of one key by an unrelated key, or
a key appearing in two partitions, must fail verification and prevent completion.

These are acceptance observations, not fixed module APIs or supplied results.
The admitted Design chooses the smallest affected modules and territories in
the retained Scala/Spark application. It reuses valid existing behavior and
adds its executable verifier over the same source obligations. File and test
counts are supporting evidence only. Aggregation, richer graph/grain/epoch
semantics and every other mandatory source obligation remain explicit pending
work until their own application evidence is admitted.

A failed verifier or changed source-key binding then exercises revision:
preserve the failure and changed-source basis, identify affected requirement,
design, artifact and evidence relations, mark their former proof stale, and
resume affected work through ABG. A fresh process must reconstruct the current
decision and retained unaffected evidence from persisted truth. Repair cannot
reuse stale proof or close the outstanding full-source obligation set.

Full application acceptance expands this same instance to every mandatory
original outcome and constraint, or a permitted owner's explicit reprice. It
does not follow from this thread, historical 58 passes or nine predicates.

## Semantic Stage Contracts

The [separately bound declaration witness](../../../.ai-workspace/comments/codex/20260909_D1_LIFECYCLE/stage-contract/derived-declarations.json)
contains the five exact source-linked GTL requirement terms, five non-null
fulfillment bindings, ten output-contract declarations and their GLC proof
policy/shape meanings. It references the unchanged complete input witness;
its packaging is test input, not a new native type or authority. This HOW and
the owning GLC requirements define lifecycle meaning; the original application
source defines the scenario obligations. T-043 records candidate acceptance.

Each stage receives all five original source members through the admitted
native source basis, all applicable predecessor assets and assessments, and
the carried native requirements/paired obligations. Source and predecessor
content must be accessible to both author and assessor; citations or a summary
alone are insufficient. ABG assembles the stage objective, admitted declaration
data and role-scoped assets through native instruction assembly and its ordinary
C/F_P transport. GLC supplies no renderer or stage controller.

| Stage | Required predecessor | Required semantic result |
|---|---|---|
| Intent | Accepted full-source handoff | `IntentAsset`: intended outcomes, constraints and uncertainties, supported by exact source spans; source modality, conflicts and pending pressure remain visible. |
| Product | Admitted Intent and assessment, plus full source | `ProductDefinitionAsset`: application boundary, observable outcomes and constraints, with derivation from Intent/source and unresolved scope. This is application-subject meaning, not a new builder Product. |
| Requirements | Admitted Intent/Product and assessments, plus full source | `RequirementSetAsset`: native GTL requirement/refinement candidates and fulfillment bindings, preserving the five original terms and adding source-linked discovered pressure. No GLC requirement model or translation is introduced. |
| Design | Admitted requirements and predecessors, full source and current retained-worksite observation | `DestinationTopologyAsset` and a typed construction/evidence handoff: exact implementation and executable verifier targets, source-obligation/role joins, required capabilities and ordered native dependencies, with remaining work explicit. |

The common semantic asset may contain ordered statements with stable identity,
source spans, modality, native requirement/obligation references,
predecessor-statement references, conflicts and pending pressure. Requirements
also needs native requirement/refinement rows; Design also needs machine-usable
target and verification declarations. These additions use the corresponding
native GTL, C1 construction and C2 execution contracts, not prose parsing or
a GLC carrier. ABG owns their exact envelope, validation and admission schemas.
One generic native author-to-assessor stage composition serves all four stage
meanings; the accepted assessor envelope feeds the next stage through native
`C.compose`. The native AssetSurface owns contract, renderer, proof and authority.
Domain asset-role labels do not request distinct runtime implementations.

Design must supply current worksite/observation and target preimage identities,
exact paths for both realization and executable verifier artifacts, their
source obligations and evidence roles, and the validation commands/probes that
will exercise the implementation. It must identify affected dependencies and
unchanged/pending work. The retained `cdme-core`, `cdme-accounting`,
`cdme-adjoint`, `cdme-executor` and `cdme-engine` modules are inspection subjects,
not a predetermined replacement target list. Actual targets follow the admitted
Design and current observation. A Design containing only prose or implementation
paths cannot supply the next C1/C2 handoff.
The native Design bridge joins proposed targets to fixed permitted target
observations and authority, assembles the complete source and admitted Design
into the existing C1 task, and returns the existing command-preparation input.
No caller assembles a substitute prompt or translates Design prose into effects.

An author produces a candidate; a separate assessor receives the complete
source, predecessor assets and exact candidate and judges faithful derivation.
ABG must admit the author/assessor results and preserve their distinct lineage
before the next stage consumes them. C checks identities, declared role/ref
conservation and currentness; J evaluates meaning and sufficiency; O rules on
scope conflicts. A schema-valid result, positive model opinion or completed
Run does not fulfill the application obligations.

For each `REQ-ACC-01` through `REQ-ACC-05`, the derived witness binds:
`contract://odd-glc/data-mapper/<REQ>/realization@1`,
`contract://odd-glc/data-mapper/<REQ>/proof@1`,
`policy://odd-glc/data-mapper/<REQ>/source-faithfulness@1`, and
`proof-shape://odd-glc/data-mapper/<REQ>/role-evidence@1`.
The exact declaration rows name those coordinates. The application role
contracts use existing native `worksite_construction_result` and
`worksite_command_execution_observation` structural value kinds. Their names
are not executable validators or implicit native aliases: ABG must resolve the
contract/policy/shape and evidence-role bindings before application-proof
admission. Non-null declaration preservation alone does not prove that admission.
Their refs/digests and
same source obligation must survive the installed non-null handoff and every
dependent stage; count equality, null substitution or weaker policy cannot
pass the conservation gate. Policy/shape meanings require distinct realization,
verifier-artifact, verifier-execution and semantic-assessment evidence over one
current basis. Semantic-stage assessment cannot substitute for application proof.

The full source remains accessible after each refinement. All known carried
and newly discovered obligations remain explicit; unassessed source areas
stay unassessed rather than receiving a fabricated complete inventory. In
particular, `INT-006` and the Frobenius appendix retain their speculative
modality. Conflicts and unresolved external references require judgment or an
owner ruling, not silent precedence. Five selected terms are never a complete
semantic decomposition of the five source documents.

## D1 Outcome And Evidence Oracle

The [frozen oracle input](../../../.ai-workspace/comments/codex/20260909_D1_LIFECYCLE/stage-contract/oracle.json)
is an evaluation-role asset, separate from generation instructions. It supplies
concrete three-record observations and negative cases; it does not supply an
Intent, Product, Requirements or Design answer. A judging agent compares the
complete source and actual candidate, including omitted constraints and source
modality. C never classifies prose faithfulness by substrings or counts.

| Source requirement | Bounded D1 application evidence | Mandatory remainder |
|---|---|---|
| ACC-01 | Exact input-key set equals the disjoint persisted processed/filter/error source-key partitions, each input exactly once, verified before completion. Equal counts with a missing/extra or duplicated key fail. | Other transforms and aggregate accounting remain unproved. |
| ACC-02 | Atomic durable `ledger.json` records input count, source-key field, partition breakdown, metadata/error locations, balance and actual discrepancy details on pass/fail. | Other job configurations and application-wide ledger behavior remain unproved. |
| ACC-03 | Persist output-to-source association, filtered keys with condition ID, and error records with original `source_key` and reason; register their locations in the ledger. | Aggregate contributors, explode parent/child mappings and all-morphism coverage remain pending. |
| ACC-04 | Automatic verification gates application completion: balanced ledger precedes OpenLineage COMPLETE with ledger reference; imbalance produces FAILED/FAIL with discrepancies and a persisted ledger. Partial-output policy never permits COMPLETE after imbalance. | Other completion paths and job configurations remain unproved. |
| ACC-05 | A fresh process repeatedly recovers exact source IDs, filter condition and original error/reason from persisted ledger/metadata, with no transform recomputation. | Aggregate and multi-morphism traversal and arbitrary-output coverage remain pending. |

The verifier checks actual values and metadata, not only report totals. A
positive application witness invokes the retained application's supported entry
in the existing CdmeEngine/Scala-Spark stack or its lawfully derived extension.
Actual input transformation produces the partitions, ledger and lookup data.
Manually supplying expected partitions to an isolated verifier, or writing
oracle-shaped ledger files, is module evidence and cannot prove this application
path. Preserve the exact initial and derived subject/observation identities,
application invocation and admitted C2 observation refs alongside verifier
artifact identity; the persisted ledger must belong to that application run.

A same-count substituted source key and a cross-partition duplicate must fail
the same automatic accounting gate as ordinary imbalance. Observe ledger
publication and completion ordering: a torn ledger cannot count as persisted
proof, and no COMPLETE may precede balanced durable accounting. A failure must
retain its ledger and diagnostic event. For backward lookup, run a fresh process
with only the required durable query inputs and no permitted transform
execution; the verifier must detect any attempted recomputation.

Implementation artifacts, verifier artifacts, executed observations and
semantic sufficiency judgments retain separate native evidence identities.
Subject execution occurs in the declared ABG Worker and returns typed admitted
observations. The oracle is neither an executed verifier nor application proof.
Full ACC01..05 meaning and all other mandatory original-source outcomes remain
open beyond the bounded demonstrated claims; D3 still owns full application
closure. The same retained instance supplies later repair and expansion.

## Upstream Readiness And First Implementation Boundary

The owning sources are
[ABG proof carry-through](../../../../abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH.md),
[C1 construction](../../../../abiogenesis/build_tenants/abiogenesis/typescript/design/T287_W2_R3_C1_LIVE_LLM_WORKSITE_CONSTRUCTION_DESIGN.md),
[C2 execution](../../../../abiogenesis/build_tenants/abiogenesis/typescript/design/T287_W2_R3_C2_WORKSITE_COMMAND_EXECUTION_DESIGN.md),
[C3 branch composition](../../../../abiogenesis/build_tenants/abiogenesis/typescript/design/T287_W2_R3_C3_BRANCH_CONSTRUCTION_AGGREGATE_DESIGN.md)
and [T-287's selected delivery plan](../../../../abiogenesis/.ai-workspace/tickets/active/T-287-deliver-abiogenesis-5-feature-waves.md#current-delivery-plan).
The [native lifecycle HOW](../../../../abiogenesis/build_tenants/abiogenesis/typescript/design/T287_D1_REQUIREMENT_LIFECYCLE_DESIGN.md)
owns the next source/semantic-stage envelope, instruction assembly and admission
contracts. GLC policy data cannot substitute for those native interfaces.
The table classifies the dependent D1/D2 binding, not every ABG implementation.

| Required seam | State and evidence boundary | Required owner resolution before the dependent claim |
|---|---|---|
| Full source and paired open-obligation transfer | `ready` only for the exact bounded native checkpoint selected by T-287; full semantic requirement coverage is not established. | Consume that pinned owner source basis; preserve source role, all members and selected native terms. |
| Non-null realization/proof contract, policy and shape conservation | `unwired` for the new stage composition; the predecessor witness used null bindings. | Resolve and preserve the derived non-null rows by native declarations and prove positive/negative conservation before semantic-stage acceptance. |
| Native semantic-stage instruction assembly, result and assessment admission | `missing` from the consumed checkpoint; stage HOW is a design dependency, not callable evidence. | Native full-source/predecessor envelope, role-scoped author/assessor assembly and admitted result/assessment lineage; Requirements/Design retain typed native handoffs. |
| Whole lifecycle declaration and source-derived stage handoff | `unwired` in the selected caller; C3 declares construction-branch readiness, not the full lifecycle. | An admitted generic composition with callable stage contracts and dependency/result binding. |
| C1/C0 effects and C2 executable observations | `unpinned` for the new D1 composition; accepted campaign evidence supports only its exact earlier contracts/artifacts. | Select and qualify the exact consumed candidate and source/result joins for the derived Design. |
| Semantic assessment, proof coverage and fold | `unwired` in this scenario path; proof carry-through -005..014 and -022..027 declare the required distinctions. | Admitted judgments and realization/verifier roles; replay-derived coverage and residuals, not a generic JSON carrier or downstream table. |
| Selective invalidation, re-entry and persisted resume | `unwired` in this scenario path; proof carry-through -028..030 and the selected D2 obligation require preserved lineage. | Exact owner continuation/correction and currentness projections with failure and fresh-process witnesses. |

The earliest implementation gap is native full-source semantic-stage assembly
and result/assessment binding, including non-null obligation conservation.
C1's declared construction-task/result contracts
accept file replacement work; they do not themselves provide that requirement
coverage relation. Resolve the smallest missing contract at its ABG owner and
bind the corresponding GLC declarations. Repeat this only at the next missing
seam. Do not require a new general framework, resurrect historical symbol names
as runtime APIs, or use local stage calls to make unavailable semantics appear
ready. No slot is promoted to ready by this authority/design alignment alone.

The concrete source/term boundary is
[`gtl/requirement_handoff.ts`](../../../../abiogenesis/build_tenants/abiogenesis/typescript/code/src/gtl/requirement_handoff.ts)
and its [ABG admission relation](../../../../abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/requirement_handoff.ts).
That non-closing transfer does not supply semantic-stage assessment or general
requirement fulfillment. Native
[`EdgeFulfillmentLedgerRow`](../../../../abiogenesis/build_tenants/abiogenesis/typescript/code/src/abg/traversal_route.ts)
holds an obligation reference, evidence references, evidence-asset references
and `fulfilled`; it does not encode the paired realization, verifier-artifact,
verifier-execution and semantic roles or discovered/depth residual coverage.
Those owner relations must represent the required source/refinement identities,
role pairing and typed non-closing gaps before the first lifecycle claim closes.

Preserve the native `C.compose` and `retain_graph_input` basis demonstrated by
[`select -> C1 -> prepare -> C2`](../../../../abiogenesis/build_tenants/abiogenesis/typescript/test_env/support/single-start-worksite-program.mjs).
The existing
[`worksiteRetentionBinding`](../../../../abiogenesis/build_tenants/abiogenesis/typescript/code/src/product/worksite_preparation_contracts.ts)
has a closed worksite contract relation. The missing extension is an admitted
stage-bound source-plus-predecessor handoff over that native composition, not a
GLC dispatcher. Also,
[`WorksiteConstructionTask`](../../../../abiogenesis/build_tenants/abiogenesis/typescript/code/src/product/worksite_construction.ts)
and its [implementation](../../../../abiogenesis/build_tenants/abiogenesis/typescript/code/src/implementation/worksite_construction.ts)
retain caller prompt bytes; adding prose to that prompt cannot establish
source/obligation instruction assembly or requirement coverage admission.

## Mutable-Worksite Binding

Each accepted mutation follows the exact ABI C0 relation:

```text
stable WorkspaceBinding W + current observation O0
  -> pre-basis WorksiteFileReplaceRequest
  -> ExecutionBasis B and current O0
  -> closed LeafExecutionAuthority
  -> owner authorization and atomic replacement or refusal
  -> receipt and successor observation O1
  -> specialized evidence + ordinary c_call_result_admitted
  -> Event Calculus current(O0 -> O1)
  -> fresh replay projects O1
```

Worker output never writes the governed target directly. It may author a
candidate in an isolated worker territory or return exact replacement content.
Only the ABI owner applies an accepted target mutation. A physical commit that
fails ABG admission remains visible `unadmitted_physical_commit` residue and
requires fresh observation.

## Worksite Execution Binding

Construction and execution are distinct calls. After C0 admission and fresh
replay establish current `O1`, one ABI-owned `worker_executes` GraphFunction
receives the exact construction-result identity, ordered validation commands,
and ordered outcome-predicate declarations. Its typed return binds each command
result and exactly one observation for each predicate. ABI admits the carrier;
odd_glc applies deterministic Product-owned proof interpretation to the
admitted rows.

The execution Worker owns all subject tool use. Framework-side execution,
module import, HTTP probing, or report manufacture is a falsifier even if the
result is correct. A nonzero command result is admitted observation truth and
may make the scenario unsatisfied; it is not automatically a transport
failure.

## Parallel Data Mapper

Parallel branches declare disjoint target territories before invocation. Each
branch returns a closed result and crosses its own C0 admission. Fan-in consumes
admitted branch results and exact replay projections, never ambient file
visibility. A crossed territory, stale O0, missing branch result, or unadmitted
physical commit refuses fan-in.

## Engagement Topology

The Executive keeps the dependency frontier and activates one coherent subject
at a time. A Writer is a mutation-capable STDO Worker. A Reviewer is independent
of the frozen candidate's authorship and repair. Requests use the project frame
basis, retain open solution space, and put `ACTION` last.

```text
Executive -> Writer activation -> closed candidate/evidence return
Executive -> Reviewer activation -> closed result and technical triage
Executive -> priority/boundary disposition -> next scenario or bounded repair
```

Reviewer severity does not automatically block. Executive applies the Product
priority scale and P2 MVP cutoff while preserving non-waivable hard stops.

## Iteration And Deployment

Continue the selected application thread in the retained instance. If a required
relation exposes an ABG defect, freeze the exact failure and evidence, return
the issue to its ABG owner, and consume the smallest lawful repair under an
explicit successor basis. Re-observe current state and repeat only affected
steps; do not rerun the accepted seven-case campaign or discard prior epochs.

Workflow tuning may change declaration data, graph composition, or selected
atomic ABI capabilities. It may not move execution authority into odd_glc or
overfit a branch with scenario-specific imperative code.

## Successor Proof And Deletion

For each legacy path, record the successor workflow/scenario/result that covers
its Product behavior. Delete only after the replacement proof exists. Expected
deletion targets include the historical imperative live harness, generated
stage-plan/snapshot plumbing, scenario-specific worker orchestration, and
string-count proof tests. Retain authoritative scenario inputs, outcome
predicates, and immutable historical evidence.

## Falsifiers

- a scenario needs a new Product, Program, lifecycle catalogue, or controller;
- a source obligation disappears between stages or realization and proof bind
  different obligations, evidence roles or freshness bases;
- a hand-authored replacement contract or count closes a stronger source claim;
- generic carrier admission is represented as requirement coverage or semantic
  acceptance without the owning ABG relation;
- a source change reuses stale proof, or a reset replaces affected re-entry;
- the target worksite is mutated outside the ABI owner;
- a model response, process exit, or filesystem state is treated as admitted
  runtime truth;
- the host harness executes or probes the subject outside the typed execution
  Worker turn;
- a parallel branch crosses territory or fan-in reads ambient state;
- a Reviewer edits, assigns Executive priority, or chooses continuation;
- a prompt format becomes the workflow authority; or
- a green scenario cannot be reconstructed from fresh ABG replay.
