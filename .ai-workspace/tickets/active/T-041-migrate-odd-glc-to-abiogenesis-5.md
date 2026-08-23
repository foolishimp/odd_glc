# T-041 Migrate odd_glc To ABIogenesis 5.0

- id: T-041
- title: deliver one data-only odd_glc Hello sentinel over exact ABIogenesis v5.0.0-dev.286
- type: feature
- ticket_category: implementation_migration
- status: active
- execution_state: evidence_driven_design_reframe_awaiting_exact_tree_review
- goal: W2-ODD-GLC-PROGRAM-ONLY-HELLO
- priority: critical
- owner: odd_glc
- build_tenant: typescript
- change_intent: >-
    Publish one immutable odd_glc Program publication, including its
    odd_glc-owned GraphFunction topology and required declarative dependencies,
    then prove exact ABIogenesis v5.0.0-dev.286 executes its ABI-owned Hello
    leaf binding from real installed odd_glc Product bytes.
- change_class: goal_reprice
- re_entry_point: specification/GOALS.md#current-goal
- current_change_class: design_reframe
- current_re_entry_point: build_tenants/common/design/ODD_GLC_ABI5_MIGRATION.md#proposed-t-041-evidence-reframe
- migration_strategy: inside_out_hard_break
- library_usage: consume
- governing_library: >-
    installed @abiogenesis/typescript-tenant@5.0.0-dev.286 public
    Product/GTL/Validator/HoG/ABG/Public exports
- affected_boundary: >-
    one immutable Program publication data package, its exact installed
    ABIogenesis consumer map, one separate-version differential runner, and
    package/runtime negative census
- predecessor_product: '@odd-glc/route-one-typescript@0.1.0'
- predecessor_release_tag: v0.1.0
- predecessor_substrate: '@abiogenesis/typescript-tenant@4.6.0-rc.3'
- target_release_line: 0.2
- target_substrate: >-
    ABIogenesis tag v5.0.0-dev.286, commit
    3014f12571c12f97f85dfe54ca4da28e7dfee3ea, tree
    a399045de5d752b92c084b5b38b358aa2d1c63aa, package tarball SHA-256
    4fc3130cef9fda3171bb28aafffa71775328745721e305172fce9d04c9fdfe41
- target_candidate_identity: >-
    @odd-glc/route-one-typescript@0.2.0-dev.1,
    product://odd_glc/route-one-typescript@0.2.0-dev.1; development candidate
    only, with no RC or final version assigned
- intake_source: direct F_H request after ABIogenesis 5.0 Product-definition
  stabilization
- triaged_at: 2026-08-17
- created_at: 2026-08-04
- updated_at: 2026-08-24
- selected_execution_basis:
  - specification/GOVERNANCE.md (immutable STDO v2.3.0 selection)
  - >-
    specification/GOVERNANCE.md (direct-F_H-adopted
    authority-conserving, entity-centric, event-sourced functional reactive
    domain modeling method; source
    20260802T032426Z_MANIFESTO_driving_ai_authored_coding_from_programming_basics.md;
    source commit 1f6a86074bf995763b4caff286422b5b1501374b; source SHA-256
    dff495762dfacaaa20b095d146d6afa4a969e29d4f385b5884272d50ad17e153)
  - specification/PRODUCT.md
  - >-
    build_tenants/common/design/ODD_GLC_ABI5_MIGRATION.md (accepted predecessor
    design admitted from exact proposal commit
    22824d04c0ff8fce42425fa9649686cf616e635a, tree
    b4e7cce91862dd2054fbb5bcd8fc80d1e10c3335, full-index binary patch SHA-256
    86e8bf2b02e23e1752ed54c821db6c1e39643228fe4eeb5240d0494f32324751;
    two proof assumptions now re-entered by evidence and pending replacement)
  - exact ABIogenesis v5.0.0-dev.286 public Product boundary
- delegated_authority: >-
    Realize and prove the bounded Program-only sentinel from the named clean
    predecessor; no provider, implementation, lifecycle interpretation, ABI
    mechanism, Product expansion, release publication, or compatibility
    authority is delegated.
- re_entry_conditions: >-
    Re-enter Product or requirements for changed lifecycle meaning; accepted
    design for a changed semantic or authority relation; and F_H for any need
    to introduce a compatibility path, second branch line, or release action.
- acceptance_roles:
    product_authority: direct_F_H
    adjudicator: Executive_F_H
    independent_review: pending_on_design_reframe_proposal_tree
    checkpoint_administration: after_design_reframe_acceptance_only
- predecessor_tickets:
  - T-033
  - T-038
- non_authorized_release_routes:
  - T-039
  - T-037
- predecessor_design_admission_gates:
  - independent exact-tree review disposition ACCEPT
  - Executive/F_H accepted the exact proposal tree on 2026-08-24
- design_reframe_admission_gates:
  - independent exact-tree review of the frozen direct-child proposal commit
  - explicit Executive/F_H acceptance of that exact proposal tree
- realization_dependencies:
  - accepted exact-tree admission of the evidence-driven design reframe before candidate freeze
  - exact ABI tarball bytes matching the pinned v5.0.0-dev.286 digest
  - clean realization from commit 96b5a9c2e109cb584f943f79997ac213d069f411
  - immutable v0.1.0 predecessor receipt for the bounded differential

## Proposed Evidence-Reframe Routing

The accepted implementation authority is the design admitted at status commit
`7a8f0898538b87b0a2975015d05a2fdcd0c9b805`. End-to-end construction
falsified its twelve-DefinitionCall and whole-56 callable-closure assumptions.
This ticket therefore routes a direct-child `design_reframe` proposal at
`build_tenants/common/design/ODD_GLC_ABI5_MIGRATION.md#proposed-t-041-evidence-reframe`.
The proposal keeps the ABI and odd_glc identities, exact five-member zero-code
archive, cross-owner declaration/Implementation relation, Hello semantics,
installed execution DAG, and predecessor conservation unchanged.

The proposed reframe is not self-accepted. Diagnostic Hello execution may
continue because it tests the selected end-to-end outcome, but its result does
not admit this design. The implementation candidate cannot freeze until an
independent reviewer evaluates the exact proposal tree and Executive/F_H
accepts those same bytes. The ticket, synthetic ABI fixture, dirty checkout,
rejected `abi5_program` source, diagnostic result, and prior candidate tests
cannot fill or revise any frozen field or waive those gates.

## Operative Wave 2 Target

This section supersedes the broader migration targets and Increment 01-05
candidates below for execution. Those sections remain historical and
later-wave evidence only.
This is a Program-only sentinel. The odd_glc Product term `MVP` remains
reserved for `SCN-GLC-HELLO-WORLD-MINIMAL`, which this ticket does not close.
"Hello World" is the minimal end-to-end steel-thread shorthand. A Hello World
GraphFunction remains an ordinary GraphFunction; its name creates no special
runtime category.

```text
one immutable odd_glc Program publication as declarative data
  -> installed ABIogenesis v5.0.0-dev.286 Product/workspace/catalog
  -> start selects the odd_glc-owned GraphFunction
  -> HoG traverses its topology through one Effect fold
  -> ABI-owned deterministic Hello leaf Implementation
  -> ABG events and Event Calculus
  -> typed result and fresh-process replay
```

odd_glc authors only one Program publication as data: its Program record,
odd_glc-owned GraphFunction definition/topology, and only the declarative
contracts, policies, overlays, and package metadata that Program requires. It
authors no executable TypeScript Product-semantics provider, evaluator,
implementation binding, leaf Implementation, semantic implementation,
lifecycle interpreter, dispatcher, event writer, raw-event walker, evidence
binder, fold, residualizer, controller, compatibility facade, or ABI
mechanism. The existing
`abi5_program` provider/leaf/`no_disposition` candidate is superseded
diagnostic evidence and is deleted or excluded, never adapted.

ABIogenesis owns admission, validation, verification, resolution, install,
workspace, catalog, standard contracts/evaluators/Hello leaf Implementation,
dependency-closure resolution, HoG traversal, ABG admission/events/Event
Calculus, replay, result projection, SDK, and CLI.

### Generic GraphFunction-library resolution

The Catalog is the one deterministic registry of canonical GraphFunctions
published by installed Products/libraries. In exact ABIogenesis
`v5.0.0-dev.286`, Product/Validator resolves an admitted Program composition
through the ready Catalog/View, installed ProductSet, resolved lock,
dependency, compatibility, provenance, collision, and ambiguity law without a
same-publication shortcut.

The derived immutable execution projection carries Program, GraphFunction,
contract, evaluator, customization, fibre, and Implementation owners
separately. It is neither another catalog nor an authored authority. The
Program and composed GraphFunction owner is odd_glc; referenced base
GraphFunction, contract, evaluator, and Implementation owners may be ABI
dependencies.

Typed refusals distinguish `absent`, `ambiguous`, `missing_dependency`,
`incompatible_or_provenance`, and `owner_contract_or_binding_mismatch`. Public
structurally admits the run request, selects `run.invoke#start`, calls the
concrete Product resolution port and selected concrete owner ports, then
projects. Product/Validator resolves and validates the Catalog closure; each
GraphFunction owner supplies declarative topology; each contract/evaluator/
customization owner supplies its declared relation; primitive base
GraphFunctions resolve to owner-local Implementations/ports; ABG
revalidates/admits the tuple and prefix; and HoG traverses the resolved
GraphFunction closure. Executable leaves are Implementations/owner ports, not
another GraphFunction kind. Public contains no semantic switch or
owner-selection algorithm. No second catalog, runtime, execution-basis
registry, or downstream adapter is introduced.

The odd_glc publication may declare external Product-semantics, contract,
evaluator, binding, and Implementation references as data, but supplies no
provider for them. ABIogenesis
`ProductExecutionResolutionPort.resolve` resolves the odd_glc
Program/GraphFunction owner independently from every referenced semantic owner
through the exact Catalog/View, ProductSet, lock, compatibility, and
provenance basis. It loads each callable from that owner's exact admitted
install. `ModulePublication.productSemanticsBinding` becomes an external
owner/binding coordinate, `loadInstalledProductSemantics` consumes that
resolved binding and owner install, and `applyRunInvoke` stops threading the
odd_glc Program install into every loader. Public passes Program selection but
does not select owners or special-case an ABI. Post-parse refusals distinguish
an absent, ambiguous, or wrong-owner semantic binding.

The Catalog supports immutable ABIogenesis/ABG-bundled base GraphFunctions,
downstream GraphFunction compositions, compatible owner-local
Implementations/fibres at declared extension points, and explicit
customization overlays/policies. Downstream Products cannot mutate or silently
override base definitions. This sentinel publishes an odd_glc GraphFunction
composition over the catalogued base Hello capability and no custom executable
Implementation.

Consensus constrains this shared architecture without entering the sentinel:
Consensus is a GraphFunction whose rounds, fan-out, aggregation, dispute
recursion, stop, and escalation are declared composition. Removing the
published GraphFunction must remove Consensus behavior; no consensus-specific
ABG, HoG, or Public production branch is lawful.

### Exact consumer map

The first eight labels name installed-public owner stages:

```text
workspace.create#clean
workspace.open#open
product.verify#verify
product.resolve#resolve
product.install#install
workspace.bind#bind
catalog.admit#admit
catalog.view#allowlist
```

Their proof comes from the native results of exact installed `./product` and
`./abg` owner relations, including identities, dependencies, resources,
effects, admissions, and owner separation. The labels preserve stage order;
they are not DefinitionCall receipt identities.

The actual installed Public DefinitionCall trace is:

```text
run.invoke#start
project.read#run_status
project.read#run_result
project.read#run_replay
```

Each key derives from `DefinitionHostReceipt.definitionKey`. A literal label or
expected array is not trace evidence. The four calls form one episode chain
with exactly one semantic start. SDK, schema, Catalog, and CLI/transport
projections may prove equality without executing a second semantic path.

Exact ABIogenesis `v5.0.0-dev.286` publishes one structural
18-operation/56-definition Public family. T-041 proves that family identity
and mechanically resolves the twelve selected callable locators. It makes no
whole-family callable-closure or behavioral claim. The activated
`capsule://odd_glc/t041/abiogenesis-5.0.0-dev.286-substrate` records 17
unselected missing installed callable locators: five `interaction.respond`,
two `product.materialize`, `project.read#release_evidence`, one
`result.assess`, two `run.continue`, and six `witness.admit`. None is selected
by this sentinel.

Full twelve-stage DefinitionCall traversal depends on a future ABI T-287 S2
bootstrap successor. That successor must be re-admitted by exact tag, commit,
tree, package, and tarball identity before the stronger claim can re-enter
design. It is not selected by or required to close this T-041 candidate.

Transport is one installed CLI episode chain with exactly one
`run.invoke#start`. SDK, schema, catalog, and CLI projections are mechanically
proved exact-set/equal against the same contracts and do not execute a second
semantic path or issue another start.

### Installed differential

Run immutable odd_glc 0.1/ABIogenesis 4.6.0-rc.3 and the Program-only odd_glc
`0.2.0-dev.1`/ABIogenesis `v5.0.0-dev.286` candidate independently in clean processes and
workspaces. No carrier translation or shared runtime is permitted. Both raw
observations are persisted unchanged. The 4.6 run retains its genuine
subject-execution stdout `Hello, world!\n`; the 5.0 run retains the existing
typed `hello_world_output` with `message: "Hello World"` inside its canonical
JSON CLI receipt. The comparator reduces them only to source-independent
installed execution, one top-level start, minimal Hello operation succeeded,
one terminal result, expected version-local greeting, fresh-process replay
agreement, no source/private import, and no legacy fallback. It may not
rewrite either raw observation. ABIogenesis 4.6 `converged` versus 5.0
`closed_success` are authenticated version-local evidence. The 5.0 run proves
selection of the odd_glc-owned GraphFunction plus the exact ABI-owned Hello
leaf binding. Raw IDs, digests, events, Programs, GraphFunctions, leaf
bindings, punctuation, and transport forms are not compared across versions.
This is a steel-thread comparison, not Product parity.

The existing native ABI Hello Program, GraphFunction, leaf/judgment
(`subject: "World"` to typed `message: "Hello World"`), and canonical JSON CLI
receipt remain unchanged. No formatter, new base operator, or alternate CLI
mode is introduced.

### Exact ABI substrate boundary consumed by this ticket

ABIogenesis tag `v5.0.0-dev.286` contains the installed-public owner-stage
cross-publication setup plus Public `run.invoke#start`, HoG traversal,
ABG/Event Calculus, and project-read replay needed by the narrowed sentinel.
T-041 changes no ABI source and imports no private ABI module.

The tag's synthetic ST-1 test proves that the Program/GraphFunction owner can be
an additional installed Product while semantics and Hello Implementation owner
remain the ABI Product. Its setup uses direct owner relations for the first
eight stages; it does not prove their DefinitionCall traversal. That is
substrate evidence only. T-041 still must pack the frozen real odd_glc identity
and reproduce the installed owner-stage plus Public start/read relation from
source-blind installed bytes.

### Closure and exclusions

The odd_glc 0.2 production package contains declarative Program publication
data only. Its structural negative census rejects an executable evaluator,
dispatcher, Product-semantics provider, implementation binding, leaf
Implementation, event name/writer, raw-event walker, evidence binder, fold,
residualizer, controller, or ABI private/source import.

This sentinel does not close `SCN-GLC-HELLO-WORLD-MINIMAL`. Requirements,
instruction assembly, F_P, evidence binding, assurance fold, residuals,
lifecycle disposition, retry, continuation, fan-out, service, data mapper, One
Surface, Consensus, and all Public behavior outside the four-call receipt trace
are excluded. The other selected definition locators receive mechanical
existence proof only. Broader tests become later-wave gap discovery and cannot
expand this ticket retroactively.

Closure proof is one installed sunny path, one fresh-process replay, the
package/source/private negative census, and seam negatives only for
absent/ambiguous catalogued GraphFunction/dependency, missing/wrong dependency or owner,
absent/ambiguous/wrong-owner executable binding, and replay divergence. One
installed owner-load probe proves each selected semantic callable came from
its resolved owner install. No exhaustive matrix or broader odd_glc scenario
is a Wave 2 gate.

### Execution order

1. Diagnostic Hello execution may continue, but hold candidate freeze until
   this exact design-reframe proposal is independently reviewed and
   Executive/F_H accepted; reject construction unless the ABI tarball matches
   the pinned `v5.0.0-dev.286` SHA-256.
2. Freeze one clean installed 0.1/4.6.0-rc.3 baseline receipt.
3. Prove structural equality to the exact 18/56 family, mechanically
   load/resolve the twelve selected callable locators, and retain the activated
   substrate capsule as the bounded nonclaim for the 17 unselected missing
   locators.
4. Pack the exact five-member data-only odd_glc `0.2.0-dev.1` Program candidate.
5. Execute the eight installed-public owner stages, then one installed Public
   episode chain with exactly one start and receipt-derived status/result/replay
   keys; replay it from another process and prove SDK/schema/catalog equality
   mechanically.
6. Freeze both receipts, package censuses, and the normalized differential for
   cold review and Executive disposition.

Stop if implementation requires an odd_glc executable, a second Catalog or
roster, a Public semantic switch, a compatibility adapter, source/private
imports, process-local truth, a missing selected-stage callable locator, a
forged grant or DefinitionCall receipt, an unresolved or wrong-owner semantic
callable, or test-side rewriting of either raw observation. A missing
unselected locator stays in the activated ABI substrate capsule and does not
block this bounded Hello outcome. Missing exact selected owner meaning stops
T-041 and requires upstream re-entry; it does not authorize odd_glc to fill the
gap.

## Deferred Full-Migration Record

All remaining sections preserve the prior declarations-only migration plan and
its rejected or incomplete candidates. They do not select current work,
authorize a provider or interpreter, or enlarge the Program-only sentinel.

## Authority And Relationship To Prior Tickets

`specification/PRODUCT.md` is accepted and remains the Product-definition
authority. This migration changes realization structure, not odd_glc Product
meaning.

T-033 and T-038 are superseded predecessor design and migration evidence. Their
declarations-only direction is retained, but their old ABIogenesis ticket and
interface identities do not govern this migration. T-041 is the sole active
migration authority.

T-039 and T-037 remain the RC and final-release successors. They must be
repriced to the exact T-041 candidate and released ABIogenesis 5.0 identities
before execution.

The `support/0.1.x` line is excluded. It remains the immutable compatibility
and bug-fix line for the released 4.6.0-rc.3-based Product.

## Target Truth

The migrated odd_glc source candidate contains only Product-owned lifecycle
meaning:

- lifecycle vocabulary, identities, ordering, and decomposition;
- GTL.TypeScript Program, GraphFunction-composition, node, role, fibre, arm,
  schema, and policy declarations;
- immutable F_P/F_H policy and calibration inputs;
- downstream specialization contracts; and
- read-only lifecycle interpretation over typed ABIogenesis replay and Public
  projections.

The candidate contains no product-local mechanism that:

- selects or advances traversal;
- renders authoritative worker instructions;
- invokes or supervises workers;
- parses or admits authoritative worker output;
- materializes or archives execution results;
- executes deterministic assessment or subject commands;
- authors runtime events or currentness;
- owns retry, consequence, fold, residual, continuation, closure, or re-entry;
  or
- reconstructs current truth from raw arrays, latest files, local state, or
  process-local identity.

The installed Product path is:

```text
odd_glc lifecycle declarations and immutable policy
  -> admitted GTL.TypeScript Program
  -> whole-Program validation and canonical Program identity
  -> exact installed ABIogenesis catalog and implementation basis
  -> direct HoG traversal through F_D | F_P | F_H
  -> ABG-admitted events
  -> Event Calculus currentness and deterministic replay
  -> typed Public projections
  -> odd_glc read-only lifecycle interpretation
```

## Preserved Product Surface

The migration preserves:

- general lifecycle meaning at task, project, program, portfolio, and domain
  frames;
- downstream domain specialization without odd_sdlc coupling;
- the retained T-031/T-032 data-mapper depth, evidence, mutation, fold,
  residual, and consequence proof obligations;
- installed Hello World and full data-mapper Product scenarios, re-proved on
  the new path; and
- exact source-independent package and install behavior.

No prior implementation mechanism is preserved merely because it contributed
to a successful 0.1 scenario.

## Superseded Truth

The following 0.1 realization shapes are superseded:

- executable `fpDispatch` or `fpEvaluator` bodies published by odd_glc;
- odd_glc prompt or manifest rendering and authoritative response parsing;
- local materialization, attempt/latest archive, and execution-result writers;
- local deterministic assessment execution;
- local consequence state, retry budget, continuation selection, or
  `reenter_graph_span` construction;
- product-local graph-function implementations for generic ABIogenesis
  operations;
- direct plugin, vector, worker, or helper invocation used as traversal proof;
- mutable-source or private ABIogenesis imports; and
- fixtures that accept mixed 0.1 and 5.0 authority.

These paths are deleted or reduced to inert historical fixtures. They are not
retained behind wrappers, aliases, adapters, fallbacks, or compatibility
facades.

## Authority Mapping

| Existing responsibility | Owner after migration | odd_glc disposition |
|---|---|---|
| lifecycle vocabulary and stage meaning | odd_glc | retain as declarations |
| domain schemas and policy | odd_glc | retain as immutable inputs |
| GTL Program composition | GTL declaration consumed by ABIogenesis | publish declarations only |
| instruction and prompt assembly | ABG | delete local renderer |
| F_P/F_H invocation and supervision | HoG/ABG | delete local dispatcher |
| response parsing and admission | ABG | retain schema declaration only |
| artifact/result materialization | ABG | retain target/schema declaration only |
| mechanical F_D assessment | ABIogenesis F_D relation | retain assessment law/data only |
| runtime events and currentness | ABG Event Calculus | consume typed projection only |
| fold, residual, retry, continuation, closure, re-entry | ABG | retain policy/interpretation only |
| lifecycle query and reporting | odd_glc over ABIogenesis replay | retain read-only interpretation |
| installed operation lookup | exact ABIogenesis Public/catalog family | bind exact operation identities |

## Required Design Gate

Before retained implementation changes, publish one accepted T-041 design
delta that:

1. Re-baselines the complete producer, consumer, projection, install, and proof
   census against the current 0.1 tree.
2. Maps every retained behavior to either an odd_glc-owned declaration or an
   exact accepted ABIogenesis 5.0 Public/carrier relation.
3. Defines the complete GTL.TypeScript Program and its role, fibre, arm,
   response, artifact, assessment, consequence, and replay declarations.
4. Defines the odd_glc read-only interpretation boundary and rejects any path
   that can author ABG truth.
5. Records the exact ABIogenesis operation, schema, event, Event Calculus,
   replay, and install identities used by the migration without depending on
   internal source functions or obsolete upstream ticket numbers.
6. Defines the inside-out break order and negative proof for every old seam.
7. Includes domain, sequence, state, authority, and computational projections
   showing that declarations and interpretations are one design while runtime
   mechanism remains ABIogenesis-owned.

An unavailable or unaccepted ABIogenesis interface remains a named dependency.
odd_glc does not fill it with a local helper.

## Required Break Order

1. Freeze the current 0.1 producer/consumer/projection census and exact
   predecessor identities.
2. Publish the complete replacement declarations, schemas, policy, and
   specialization contracts.
3. Prove the declarations compile and admit through the selected ABIogenesis
   5.0 Program boundary.
4. Sever local dispatch, evaluator, instruction, and response authority; pin
   their absence with negative proof.
5. Rebind admitted response, materialization, artifact, and F_D assessment
   consumers to typed ABIogenesis projections.
6. Sever local archive, consequence, retry, continuation, closure, and re-entry
   authority; pin their absence with negative proof.
7. Rebind lifecycle queries and reports to scoped Event Calculus/replay/Public
   truth.
8. Remove or reprice mixed-state and direct-plugin fixtures.
9. Bind exact installed ABIogenesis and odd_glc candidate identities with no
   source fallback.
10. Freeze one digest-bound source candidate and run the deterministic,
    installed, fresh-process, and live campaign proof.

Old producers are severed before their consumers count as migrated. A green
mixed old/new path is not progress or closure evidence.

## Impacted Interface Checklist

- [ ] generated odd_glc publication contains declarations and immutable policy
      only
- [x] first isolated `src/abi5_program` source-candidate surface contains an
      immutable GTL 5 Program candidate and authority boundary with no runtime
      import or executable mechanism; it remains excluded from the immutable
      0.1.0 package census until the 0.2 candidate identity is assigned
- [ ] one complete GTL.TypeScript Program validates before effects and has
      canonical order-independent identity
- [ ] declarations bind roles and regimes explicitly rather than inferring them
      from vector name, stage name, ordinal, or local routing
- [ ] worker instructions originate only from ABIogenesis instruction assembly
- [ ] malformed, incomplete, contradictory, or schema-unbound worker output is
      rejected by ABIogenesis before materialization or closure
- [ ] artifact materialization and archives derive only from admitted ABG truth
- [ ] F_D consumes admitted facts and never executes subject work
- [ ] consequence, retry, fold, residual, continuation, closure, and re-entry
      consume ABIogenesis projections without local state or action constructors
- [ ] lifecycle queries are read-only and cannot close independently
- [ ] every consumed ABIogenesis operation belongs to the exact installed
      Public/catalog family
- [ ] package and tests import no mutable or private ABIogenesis source
- [ ] restoring any removed local authority path makes a required negative
      proof fail

## Proof Contract

### Deterministic and mutation proof

- complete Program compile/admission before effects;
- order-independent Program identity;
- exact Public operation and schema binding;
- malformed declaration and response differentials;
- process-restart equality for every retained lifecycle projection;
- unrelated-event interleaving invariance;
- consumed, stale, terminal, cross-scope, and duplicate-path negatives;
- ODD execution-authority audit proving no product-local runtime mechanism;
- source-independence and exact install-identity negatives;
- restored-old-helper mutation kills; and
- retained T-031/T-032 depth and mutation obligations.

### Installed scenario proof

Run at least:

1. the minimal installed odd_glc Hello World path; and
2. one fresh, unmodified, single-start full data-mapper campaign.

Both enter through the public installed ABIogenesis start surface. Direct
vector, plugin, worker, source-module, or test-harness execution cannot
substitute. Replay must reconcile every closure-bearing worker call, admitted
response, artifact, assessment, consequence, fold, residual, continuation,
re-entry, and terminal result.

### Candidate identity

Freeze and record:

- source commit and tree;
- package file census and content digest;
- declaration/program identity;
- exact ABIogenesis Product, package, catalog, and operation identities;
- lockfile and dependency intent;
- install inputs and installed paths;
- proof artifact identities; and
- absence of mutable-source fallback.

This ticket creates a source candidate. It does not assign an RC or final
odd_glc version and does not claim ABIogenesis 5.0 release authority.

## Closure Law

T-041 closes only when:

- the design gate is accepted against exact ABIogenesis 5.0 public contracts;
- all producer, consumer, projection, install, and proof census rows have one
  disposition;
- every superseded local authority path is deleted and its restoration is
  rejected;
- the frozen odd_glc candidate is declarations-only under ODD execution-
  authority audit;
- deterministic, mutation, fresh-process, installed Hello World, and full
  data-mapper campaign proof pass on one exact candidate;
- replay reconciles every closure-bearing effect;
- exact installed ABIogenesis and odd_glc identities are source-independent;
  and
- an authority-first review finds no rival execution, event, currentness,
  catalog, continuation, closure, or release subject.

## Non-Closure Conditions

- T-033 or T-038 wording, old upstream ticket identities, or 0.1 fixtures
  substitute for current accepted ABIogenesis contracts.
- Any local dispatcher, evaluator, renderer, parser, materializer, archive
  writer, assessment executor, consequence state, retry selector,
  continuation controller, closure fold, or re-entry constructor remains
  reachable.
- A wrapper calls ABIogenesis 5.0 while preserving an odd_glc-owned mechanism
  or authority identity.
- A direct plugin/vector/worker test substitutes for installed traversal.
- Historical 0.1 or 4.6.0-rc.3 evidence substitutes for post-migration proof.
- Mixed 0.1/5.0 execution or proof is accepted.
- A mutable source checkout, private ABIogenesis module, incomplete install
  identity, or undeclared compatibility path participates.
- A new odd_glc Product capability, including T-040 project-topology truth, is
  silently absorbed without separate admission.
- The migration is called complete before an exact released ABIogenesis 5.0
  cut exists and the release-successor tickets are reconciled to it.

## Exclusions

- No changes to the `support/0.1.x` line.
- No ABIogenesis core implementation under this ticket.
- No odd_sdlc carriers, controllers, ledgers, phase flow, retry, closure, or
  software-domain policy copied into odd_glc.
- No compatibility façade or dual-authority transition period.
- No T-040 project-topology Product expansion unless separately admitted.
- No RC publication or final release under this ticket.

## Progression Log

### 2026-08-04 — Increment 01: isolated GTL 5 Program declaration

Selected entity: the installed odd_glc general-lifecycle Program candidate.
The slice adds `src/abi5_program.mjs` and its declaration types as immutable
odd_glc-owned data. It declares one GTL `5.0.0` Program identity, start,
callable membership, closure-contract reference, lifecycle policies, and the
explicit odd_glc/ABIogenesis authority split.

The source contains no ABIogenesis import, validator, dispatcher, evaluator,
materializer, event/currentness author, retry, continuation, or closure
mechanism. It does not self-admit. ABIogenesis retains validation, canonical
identity, catalog admission, HoG traversal, event admission, Event Calculus,
replay, continuation, and closure authority.

The first package attempt correctly failed the immutable 0.1.0 package-census
proof because the new files had been added to the released package manifest.
The bounded repair removed them from `files` and `exports`; they remain a 0.2
source candidate until candidate version/identity is assigned. This preserves
the released 0.1 package while permitting main-branch migration work.

Evidence:

- focused ABI5 declaration and 0.1 release-contract proof: 5/5 pass;
- complete deterministic suite: 89 pass, 0 fail, 8 intentionally skipped live
  lanes;
- `npm pack --dry-run`: unchanged six-file 0.1.0 package census;
- `git diff --check`: pass.

Next authorized increment: define the complete odd_glc-owned GTL 5
GraphFunction, contract, and closure declarations consumed by this Program,
then validate them through an exact installed ABIogenesis 5 boundary when that
package identity is available. No 4.x producer is removed before that
replacement producer is executable.

### 2026-08-04 — Increment 02 candidate: root workflow and pure interpretation leaf

Selected entity: the complete declarations required to make the isolated
general-lifecycle Program statically valid before effects. The implementation
worker first recorded the entity/function construction map in the migration
design, then corrected four inconsistencies in the inherited Increment 02
draft:

- the Program declared the subordinate interpretation GraphFunction as a
  callable member while the focused proof and declaration types still required
  root-only membership;
- the root ClosureContract referenced ABIogenesis evidence, refusal, judgment,
  and rejection contracts that were absent from the published contract set;
- the subordinate callable had no GraphCall-scope child closure; and
- the bound interpretation symbol returned a domain value directly rather
  than the typed deterministic leaf-realization candidate required at the HoG
  implementation seam.

The repaired cone contains one direct root GraphFunction whose only term is a
typed `workflow.C` reference, one subordinate effect-free `F_D` GraphFunction
with the odd_glc read-only interpretation leaf, nine local contract
declarations, distinct run- and GraphCall-scope closure contracts, one exact
implementation binding, and one packaged implementation descriptor. The pure
leaf maps an already typed ABIogenesis Public projection basis to an immutable
odd_glc lifecycle state and returns only candidate result/evidence values. It
does not admit those candidates, write an event, select traversal, close a
scope, or receive an ABG effect port.

Test-only validation uses the public `./validator` export target from the
current built ABIogenesis 5 candidate at
`/Users/jim/src/apps/abiogenesis-5-root-build`, package
`@abiogenesis/typescript-tenant@5.0.0-dev.286`. The pinned built files are:

- `validator/index.js` SHA-256
  `e5bb4aeaf14670f17808e0385d64529eb25ad67a15e89beefbb4bfd0e641263c`;
- `validator/raw_admission.js` SHA-256
  `fdb3e1257b55ea8ae262742a621b91a7c565d982970bb7d8e67cbec64252ade6`;
  and
- `validator/validation.js` SHA-256
  `1020ac3c6c23af0520e463696d19787da6f8bdec4e54d90aeaed811042098337`.

This is a diagnostic static-boundary proof, not an installed/released
ABIogenesis identity or a source fallback in the odd_glc runtime. The product
module imports only Node `crypto`; the ABIogenesis validator import exists only
in the focused test.

Evidence:

- focused Increment 02 proof: 8 pass, 0 fail;
- declaration type syntax check through TypeScript: pass;
- complete deterministic suite: 94 pass, 0 fail, 8 intentionally skipped live
  lanes;
- `npm pack --dry-run --json`: unchanged six-file 0.1.0 package census,
  shasum `42c9a788e6094b5c2b5f0ac33e4b3b86410f830d`;
- `git diff --check` plus untracked-subject whitespace checks: pass.

This increment remains a source candidate for independent review. It does not
accept the design, Program, ticket, package, or migration; remove any 0.1
producer; assign an RC/final release; or claim installed traversal.

F_H subsequently rejected the Increment 02 checkpoint. Its local
`odd_glc_lifecycle_context` trusted caller-authored run/projection/disposition
strings, and its static publication named the F_D interpretation function as a
Product-semantics provider even though that symbol did not implement
`ProductSemanticsProvider`. The 8/8 and 94/0/8 results above remain historical
diagnostic evidence only; they are not checkpoint acceptance.

Remaining dependencies are an exact released ABIogenesis 5 identity, the
digest-bound 0.2 Product publication and Product-semantics provider, installed
implementation descriptor resolution against that package, order-independent
Program identity proof, catalog admission, direct HoG traversal, Event
Calculus/Public replay binding, and the later producer/consumer cuts and
campaign proofs required by this ticket.

### 2026-08-04 — Increment 03 candidate: exact source-result authority and provider relation

F_H authorized a bounded design re-entry over the rejected carrier/provider
cone with no Product/requirements reprice, reset, compatibility, release, or
branch expansion. The revised source candidate:

- imports canonical JSON/digest functions only from the accepted ABI package
  `./product` export and types its input as ABI's exact
  `ProductInvocationSourceResultBasis`;
- treats structural input evaluation as provisional and exposes typed refusals
  for empty/malformed carrier, wrong contract/kind/version, malformed digest,
  empty identity, source-value digest mismatch, and basis identity mismatch;
- exports a real `ODD_GLC_ABI5_PRODUCT_SEMANTICS` provider distinct from
  `interpretAbi5LifecycleProjection`, plus a publication constructor whose
  semantics binding names the provider and whose implementation binding names
  the leaf;
- requires canonical equality with Public's independently derived source
  result basis and exact current workspace/binding before ABI may admit the
  invocation input; and
- projects only source ABG refs/digests and `no_disposition`. It does not infer
  lifecycle disposition merely because a generic source result is closed.

The migration design now makes the domain, sequence, state, authority,
readiness, and cross-view decisions explicit. Exact 0.2 installed provider
loading, catalog/Program admission, traversal, ABG result/judgment events,
GraphCall/Run closure, replay/Public projection, and a lifecycle-specific ABI
result/query contract remain downstream acceptance boundaries.

Static proof is narrowed. The selected ABI validator accepts the declaration
shape but does not prove provider resolution or semantic/runtime readiness.
Focused tests pin current ABI-owned gaps: duplicate ContractDeclaration
identity and empty `valueKind` are accepted, and declaration reordering changes
the validation source identity. No odd_glc validator or normalizer is added.

The exact diagnostic ABI authority files newly exercised by Increment 03 are:

- `product/index.js` SHA-256
  `19b2cab5afc3b39b3b9b25d2d91668be32b3c55efc3b8a12d0920417a9051482`;
- `product/semantics.js` SHA-256
  `a66349f8b18c3296b56831e68938b99b58e10277d9c010fefcfa38f03ee20a49`;
- `abg/invocation_admission.js` SHA-256
  `0bb589155b36fceecdad236aa2aab77c3cb05a8168896194edd6b7882e6c0c81`;
  and
- `public/operations.js` SHA-256
  `cc76169698835fd200027e18e3575c5426f91a5c80ac575dd6cdab3084676e17`.

Evidence for the frozen Increment 03 subject:

- focused Increment 03 proof: 12 pass, 0 fail;
- declaration type syntax check through the exact ABI 5 Product/GTL types:
  pass;
- complete deterministic suite: 98 pass, 0 fail, 8 intentionally skipped live
  lanes;
- `npm pack --dry-run --json`: unchanged six-file 0.1.0 package census,
  shasum `42c9a788e6094b5c2b5f0ac33e4b3b86410f830d`;
- tracked and intended-untracked whitespace checks: pass.

Increment 03 remains an unaccepted source candidate for independent review. It
does not accept the design, Program, ticket, package, or migration; remove any
0.1 producer; assign an RC/final release; or claim installed traversal.

F_H subsequently rejected that Increment 03 / Consensus Subject 02 candidate.
Although its derived-input equality relation was lawful, the candidate had no
lawful first Run capable of producing the required source result, used an
over-broad contribution provenance tuple, reused deterministic evidence for a
workflow fold, and did not retain every direct source identity needed by its
declared lifecycle consumer. The 12/12 and 98/0/8 results above remain
historical diagnostic evidence only.

### 2026-08-04 — Increment 04 / Consensus Subject 03: lawful workspace bootstrap

The bounded re-entry adds one separate fresh-source Program over ABI's exported
`WorkspaceBinding` carrier. A fresh Public `run.invoke` already supplies that
admitted binding independently of any source result. The installed Product
semantics provider therefore accepts the source Program only when
`sourceResultBasis` is null, the binding has ABI's exact canonical identity,
and its workspace/binding identities equal the current invocation basis. Its
single direct `F_D` leaf preserves the binding as a result candidate. After ABG
admits and closes that result, Public can derive its ordinary
`ProductInvocationSourceResultBasis` for the separate lifecycle Program. The
lifecycle Program's canonical equality with that independently derived basis
is unchanged.

The source Program does not invent a bootstrap carrier, mint an admitted
binding, or bypass Public. It consumes the existing ABI `workspace_binding`
value kind and the exact Product hook relation that ABI already invokes for a
fresh Run. The publication contains both Programs, three GraphFunctions, three
closure contracts, and two packaged leaf bindings. Only the source
GraphFunction belongs to the source Program; the workflow root and
interpretation leaf belong to the derived lifecycle Program.

Evidence is split by actual ABG role. The two direct `F_D` leaves require
`deterministic_evidence_candidate`; the lifecycle workflow root and its
Run-scope closure require `sub_traversal_evidence_candidate`. Publication
contribution provenance is the exact catalog-admission tuple
`[artifactDigest, productManifestDigest]`; `productContentDigest` remains a
publication identity field but is not contribution provenance. Focused proof
validates the unmodified object returned by the real publication constructor;
mutation-only tests clone that object explicitly.

The lifecycle projection now retains `publicAuthorityDigest`, source
invocation admission/invocation refs, source GraphFunction and C-call refs, in
addition to the already retained basis, Run, GraphCall, result/judgment,
replay, and workspace identities/digests. A downstream lifecycle consumer can
therefore reconstruct the ABG/Public source relation without guessing omitted
direct provenance or trusting the embedded source value.

This remains a declaration/source candidate. The current immutable 0.1 package
census deliberately excludes `abi5_program`; consequently no exact installed
0.2 artifact, ProductInstall, CatalogView, or Public end-to-end invocation is
available locally. The real built ABI validator can prove both Program shapes
and the real publication constructor, but installed catalog admission and
Public traversal stop at that named package/install boundary rather than using
a test resolver, source checkout, or compatibility path.

Evidence for the frozen Increment 04 / Consensus Subject 03 candidate:

- focused Subject 03 proof: 14 pass, 0 fail;
- declaration type check through the exact ABI 5 Product/GTL types: pass;
- complete deterministic suite: 100 pass, 0 fail, 8 intentionally skipped
  live lanes;
- real constructor publication validation and both Program validations: pass;
- canonical Program digests: source
  `sha256:8a2006b8626c134c236dd919208c9afa4464a2849cc7a289671aeefad67c2017`,
  derived lifecycle
  `sha256:8d6d132a3ead96f2a74ea9c93d2995adbe76b9da4f3d52a688d8ec35bae1c89c`;
- exact contribution provenance assertion
  `[artifactDigest, productManifestDigest]`: pass;
- `npm pack --dry-run --json`: unchanged six-file 0.1.0 package census,
  shasum `42c9a788e6094b5c2b5f0ac33e4b3b86410f830d`; and
- tracked and intended-untracked whitespace checks: pass.

Subject 03 is frozen only for independent F_H review. This worker does not
accept the design, Program, ticket, package, or migration and does not claim an
installed 0.2 traversal.

F_H subsequently rejected Consensus Subject 03 after two blind reviewers
independently reproduced a forged `WorkspaceBinding.admissionEventRef` accepted
by the Product leaf. The candidate reconstructed the binding's canonical body,
but ABI's digest deliberately excludes the admission event; a caller could
therefore attach an invented admission identity. Subject 03's 14/14 and
100/0/8 results are historical diagnostics, not acceptance evidence.

### 2026-08-04 — Increment 05 / Consensus Subject 04: authenticated fresh-source identities

Subject 04 removes `WorkspaceBinding` from the Product contract entirely. The
fresh Program input is now an `odd_glc_fresh_source_request` and its leaf output
is an `odd_glc_fresh_source_result`. Each carrier has exactly five fields:
`kind`, `schemaVersion`, `workspaceId`, `workspaceBindingId`, and
`workspaceBindingDigest`. These are the complete current-workspace identities
that Public independently supplies to `ProductSemanticsProvider`; neither
carrier contains or claims an admission event, binding body, admitted status,
lifecycle disposition, replay fact, or local brand.

Structural request evaluation remains provisional. For the fresh Program the
installed provider requires `sourceResultBasis === null`, no action catalog or
applications, and exact equality of all three request identities with Public's
current invocation basis. The pure `F_D` leaf then maps the authenticated
request to the distinct result kind while preserving only those identities.
ABG, not odd_glc, may admit that result and judgment and close the source Run.
Only after that ABI-owned admission may Public derive the exact
`ProductInvocationSourceResultBasis` used by the unchanged derived lifecycle
Program equality relation.

Exact-key contract checks reject any extra `admissionEventRef`, any disposition
claim, malformed digest, empty identity, or wrong request/result kind. Focused
proof also rejects current-workspace identity substitution in the installed
provider, altered request/result correspondence in the judgment predicate,
and forged admission/disposition fields on the result. No ledger, event lookup,
WeakSet/brand, registry, replay scan, compatibility carrier, or ABI edit is
introduced.

Subject 04 preserves Subject 03's coherent publication provenance, distinct
workflow/leaf evidence contracts, complete lifecycle projection provenance,
real publication-constructor proof, two-Program topology, and named absent-0.2
install boundary.

Evidence for the frozen Increment 05 / Consensus Subject 04 candidate:

- focused Subject 04 proof: 14 pass, 0 fail, including forged extra
  `admissionEventRef` and disposition negatives;
- declaration type check through the exact ABI 5 Product/GTL types: pass;
- complete deterministic suite: 100 pass, 0 fail, 8 intentionally skipped
  live lanes;
- real constructor publication validation and both Program validations: pass;
- canonical Program digests: fresh source
  `sha256:4dc4ac7693e71fe45992ae38691b181c24cdd7d2c2b5cd5848cad7901cff08c0`,
  derived lifecycle
  `sha256:8d6d132a3ead96f2a74ea9c93d2995adbe76b9da4f3d52a688d8ec35bae1c89c`;
- `npm pack --dry-run --json`: unchanged six-file 0.1.0 package census,
  shasum `42c9a788e6094b5c2b5f0ac33e4b3b86410f830d`; and
- tracked and intended-untracked whitespace checks: pass.

Subject 04 is frozen only for independent F_H review. This worker does not
accept the design, Programs, ticket, package, or migration and does not claim
installed 0.2 traversal.
