# odd_glc ABIogenesis 5 Migration Design

**Ticket**: T-041
**Status**: Active Program-only Wave 2 design; full lifecycle migration deferred
**Method Basis**: `specification/GOVERNANCE.md` (STDO 2.3.0)
**Construction Basis**: adopted authority-conserving, entity-centric,
event-sourced functional reactive domain modeling method
**Product Basis**: `specification/PRODUCT.md`
**Predecessor**: `@odd-glc/route-one-typescript@0.1.0` on
`@abiogenesis/typescript-tenant@4.6.0-rc.3`

## Superseding Wave 2 Decision

The current design subject is `W2-ODD-GLC-PROGRAM-ONLY-HELLO`. "Hello World"
is the minimal end-to-end scenario shorthand. A Hello World `GraphFunction`
is therefore lawful when it remains an ordinary `GraphFunction`, not a
special runtime category.

odd_glc publishes one immutable Program publication as data: its Program
record, odd_glc-owned declared `GraphFunction` topology, and only the
declarative contracts, policies, overlays, dependencies, and package metadata
that topology requires. It publishes no executable provider, Product-semantics
provider, contract evaluator, implementation binding, leaf Implementation,
runtime, controller, or lifecycle interpreter. This is a Program-only
sentinel. `MVP` remains reserved for `SCN-GLC-HELLO-WORLD-MINIMAL`, which this
design does not close.

```text
odd_glc Program data
  -> ABIogenesis 5.0p raw admission and validation
  -> Product verify -> resolve -> install -> workspace bind
  -> eventless catalog admit -> allowlist
  -> Program start selects the odd_glc-owned GraphFunction
  -> one HoG Effect fold traverses its declared topology
  -> exact catalogued ABI-owned Hello leaf Implementation
  -> ABG admission/events -> Event Calculus -> result -> fresh replay
```

### Entity and authority map

| Entity or relation | Owner | odd_glc disposition |
|---|---|---|
| Program, declared GraphFunction topology, and required publication data | odd_glc | immutable declarative data only |
| raw admission and whole-Program validation | ABIogenesis GTL/Validator | consume installed contract |
| Product verification, resolution, install, and workspace | ABIogenesis Product | consume installed contract |
| catalog readiness, view, and complete cross-publication closure | ABIogenesis Product/Validator | consume one eventless deterministic construction |
| base GraphFunctions, standard contracts/evaluators, and Hello leaf Implementation | ABIogenesis libraries and exact owner ports | resolve through the one Catalog; odd_glc supplies no executable leaf |
| traversal | HoG | consume one Effect fold |
| runtime admission, events, and currentness | ABG/Event Calculus | consume typed result only in proof |
| replay and result projection | ABIogenesis | consume through Public/SDK/CLI |
| cross-version normalization | test-only differential | compare observations; author no runtime truth |

The odd_glc 0.2 production package contains its declarative Program-owned
`GraphFunction` topology, but no contract evaluator, dispatcher, executable
provider, Product-semantics provider, implementation binding, leaf
Implementation, event name/writer, raw-event walker, evidence binder, fold,
residualizer, controller, ABI private import, source import, fallback, or
compatibility adapter. Its existing `abi5_program` provider, pure leaf, source
carrier, and `no_disposition` projection are superseded diagnostic evidence.
They are deleted or excluded rather than adapted.

### Generic GraphFunction-library resolution

The Catalog is the one deterministic registry of canonical GraphFunctions
published by installed Products and libraries:

```text
installed Product/library GraphFunction publications
  -> one deterministic Catalog
  -> exact GraphFunction identities, definitions, and dependency closure
  -> any admitted Program composition
```

The current same-publication validation and implementation lookup is the
implementation defect: it treats the Catalog as a publication-local table.
Product/Validator must resolve the complete Program closure through the exact
ReadyCatalog/View, installed ProductSet, resolved lock, dependencies,
compatibility, provenance, collision, and ambiguity law. Program,
GraphFunction, contract, evaluator, customization, fibre, binding, and
Implementation owners remain separate in one derived immutable execution
projection. That projection is not another catalog, registry, or authority.
Its closed refusals are `absent`, `ambiguous`, `missing_dependency`,
`incompatible_or_provenance`, and `owner_contract_or_binding_mismatch`.

The odd_glc publication may declare external Product-semantics, contract,
evaluator, binding, and Implementation references as immutable data, but it
supplies none of those providers. The one ABIogenesis
`ProductExecutionResolutionPort.resolve` resolves the odd_glc
Program/GraphFunction owner separately from every referenced semantic owner
through the exact Catalog/View, ProductSet, lock, compatibility, and
provenance basis, then loads each callable from that owner's exact admitted
install. `ModulePublication.productSemanticsBinding` becomes an external
owner/binding coordinate rather than evidence that the Program install
contains the provider. `loadInstalledProductSemantics` consumes the resolved
binding and exact owner install. `applyRunInvoke` no longer threads the odd_glc
Program publication/install into every loader. Public passes Program selection
to the Product port and neither selects owners nor special-cases an ABI.
Post-parse refusals distinguish absent, ambiguous, and wrong-owner semantic
bindings.

The Catalog permits immutable base GraphFunctions and Implementations bundled
by ABIogenesis/ABG, downstream GraphFunction compositions, compatible
owner-local Implementations/fibres at declared extension points, and explicit
customization overlays/policies. A downstream Product never mutates or
silently overrides a base definition. This sentinel publishes one odd_glc
GraphFunction composition over the catalogued ABI Hello capability and no
custom executable Implementation.

Public structurally admits the exact run request, selects
`run.invoke#start`, calls the concrete Product resolution port, calls the
selected concrete owner ports, and projects their outcomes. Product/Validator
resolves and validates the Catalog closure; GraphFunction owners supply
declarative topology; contract/evaluator/customization owners supply their
declared relations; primitive base GraphFunctions resolve to exact owner-local
Implementations/ports; ABG revalidates and admits the exact tuple and
predecessor prefix; and HoG traverses the resolved GraphFunction closure.
Executable leaves are Implementations/owner ports, not another GraphFunction
kind. Public contains no owner-selection algorithm or semantic switch. No
second catalog, runtime, execution-basis registry, or adapter exists.

Consensus is the architectural falsifier, not part of this sentinel. Consensus
is one published GraphFunction whose rounds, fan-out, aggregation, dispute
recursion, stop, and escalation are declared composition. Removing that
GraphFunction must remove Consensus behavior; no consensus-specific ABG, HoG,
or Public production branch may remain reachable.

### Exact installed boundary

The Wave 2 consumer path traverses these definitions in the one packaged 18/56
family:

```text
workspace.create#clean
workspace.open#open
product.verify#verify
product.resolve#resolve
product.install#install
workspace.bind#bind
catalog.admit#admit
catalog.view#allowlist
run.invoke#start
project.read#run_status
project.read#run_result
project.read#run_replay
```

The path trace is authoritative; its twelve-key count is only a projection.
ABIogenesis 5.0p packages the one exact 18-operation/56-key Public family.
Wave 2 qualifies only these consumed rows. Unused rows are outside this
evidence claim, not absent, stubbed, translated, or represented by a second
partial roster/catalog/API. The packed path contains no `RootPublicInvocation`,
`legacyRequest`, compatibility facade, second Public family, source-tree
dependency, or process-local run/read truth.

Package constructability remains whole-family: all 56 definitions have
concrete runtime-callable owner closures; the installed tarball contains the
entire 18/56 family plus every owner module, runtime dependency, schema, and
static catalog row required to resolve it; and one installed exact-set probe
loads/resolves all 56 closures from packed bytes. This is mechanical
constructability only. Behavioral and scenario qualification remains the
twelve-key sentinel above.

Execution uses one installed CLI episode chain with exactly one
`run.invoke#start`. SDK, schema, catalog, and CLI projections are mechanically
proved exact-set/equal against the same contracts. They do not execute a
second semantic path or issue another start.

### Differential proof

Two independent installations execute the same narrow observation:

1. immutable odd_glc 0.1 with ABIogenesis 4.6.0-rc.3; and
2. the Program-only odd_glc 0.2 candidate with exact ABIogenesis 5.0p.

They use separate clean processes and workspaces and share no runtime or
translation. Both unmodified raw observations are persisted. The 4.6
observation retains its genuine subject-execution stdout `Hello, world!\n`.
The 5.0 observation retains the existing typed `hello_world_output` with
`message: "Hello World"` inside the canonical JSON CLI receipt. The shared
semantic reduction is limited to:

```text
sourceIndependentInstalledExecution = true
topLevelStartCount                 = 1
minimalHelloOperationSucceeded     = true
terminalResultCount                = 1
versionLocalGreetingExpected       = true
freshProcessReplayAgreement        = true
sourceOrPrivateImport              = false
legacyFallback                     = false
```

Each installation independently authenticates its raw identifiers, digests,
events, provenance, Program, and GraphFunction selection. ABIogenesis 4.6
`converged` versus 5.0 `closed_success` remain version-local evidence and are
not compared. The 5.0 evidence separately authenticates the odd_glc-owned
GraphFunction and its exact ABI-owned Hello leaf binding. The comparator may
reduce the two raw observations to the fields above; it may not rewrite
either. Greeting punctuation and transport form are not parity fields. Hello
World is steel-thread shorthand, not Product parity.

The existing native ABI Hello Program, GraphFunction, leaf/judgment
(`subject: "World"` to typed `message: "Hello World"`), and canonical JSON CLI
receipt remain unchanged. No formatter, new base operator, or alternate CLI
mode is introduced.

### Function-boundary realization

The ABIogenesis implementation is confined to the existing owner chain:

1. `product/catalog.ts::admitGraphFunctionCatalog`,
   `buildGraphFunctionCatalog`, `lookupGraphFunctionDefinition`, and
   `narrowGraphFunctionCatalog` construct and select one ReadyCatalog/View
   across all installed publications.
2. `validator/validation.ts::validateProgram` validates the transitive
   GraphFunction and declaration closure against that Catalog rather than the
   Program publication alone.
3. `product/implementation_resolution.ts::resolveImplementationSet` resolves
   every reachable executable leaf through its exact owner publication,
   binding, descriptor, dependency, compatibility, and provenance.
4. The planned
   `product/execution_resolution.ts::ProductExecutionResolutionPort.resolve`
   composes those pure results into the immutable owner-separated execution
   projection. It resolves `ModulePublication.productSemanticsBinding` and
   every other external executable reference to an exact owner install before
   calling `product/semantics.ts::loadInstalledProductSemantics`.
5. `public/operations.ts::applyRunInvoke` only admits, selects
   `run.invoke#start`, calls that Product port and exact owner ports, then
   projects. It removes the current same-install threading of the Program
   publication/install into semantic loaders.

The deletion boundary is every same-publication lookup and Public-local owner
join superseded by the Product port, the diagnostic odd_glc provider/evaluator/
binding/leaf candidate, and every packed legacy/fallback path. The native ABI
Hello chain, Catalog, HoG fold, ABG/Event Calculus/replay, and singular 18/56
family remain.

This design does not close `SCN-GLC-HELLO-WORLD-MINIMAL` or any lifecycle
interpretation. Requirement algebra, instruction assembly, F_P, evidence
binding, assurance fold, residuals, lifecycle disposition, retry,
continuation, fan-out, service, data mapper, One Surface, Consensus, and the
remaining Public family are outside the causal set.

### Construction and acceptance

1. Checkpoint the reviewed ABIogenesis D17/D18 candidate without changing its
   accepted function chain; neither action reopens Wave 1.
2. Freeze the installed 0.1/4.6.0-rc.3 baseline observation.
3. Prove the ABIogenesis tarball contains every owner closure, dependency,
   schema, and static row and mechanically load/resolve the exact 56.
4. Package the odd_glc declarative Program and prove its negative census.
5. Execute one installed CLI episode chain with one start and reconstruct its
   result through fresh replay; prove SDK/schema/catalog equality mechanically.
6. Freeze both receipts and their normalized semantic equality for cold review.

Closure proof is one installed sunny path, one fresh-process replay, the
package/source/private negative census, and seam negatives only for
absent/ambiguous catalogued GraphFunction/dependency, missing/wrong dependency or owner,
absent/ambiguous/wrong-owner executable binding, and replay divergence. One
installed owner-load probe proves each selected semantic callable came from
its resolved owner install. Lifecycle, F_P, exhaustive matrices, and broader
odd_glc scenarios remain outside this design.

Later odd_glc tests may discover missing ABIogenesis capabilities for later
waves. They cannot enlarge this accepted causal set retroactively.

Stop if implementation requires an odd_glc executable, a second Catalog or
roster, a Public semantic switch, a compatibility adapter, source/private
imports, process-local truth, stubbed 18/56 bindings, an unresolved or
wrong-owner semantic callable, or test-side rewriting of either raw
observation. Missing exact owner meaning returns to T-287/F_H.

## Deferred Full-Migration Design

The remaining design records the broader declarations-only lifecycle migration
and its prior candidate iterations. It is retained as later-wave and diagnostic
evidence only and supplies no current implementation authority.

## Prior Decision

Migrate by a hard authority cut on the single `main` branch. Preserve
odd_glc-owned lifecycle declarations, immutable policy, specialization, and
read-only interpretation. Replace every product-local systems mechanism with
consumption of an admitted ABIogenesis 5 public relation. Do not create a
compatibility facade while the ABIogenesis implementation settles.

ABIogenesis 5 internals may change without repricing this design when the
accepted public roles remain: validate and canonically identify a complete GTL
Program, admit it through the installed catalog, traverse through HoG, record
ABG events, derive current truth through Event Calculus/replay, and expose typed
Public outcomes. A change to one of those roles or its authority relation is a
design re-entry, not an adapter task.

## Governing Frames And Affected Set

The governing frames are the STDO 2.3.0 method frame, odd_glc Product frame,
GTL declaration/language frame, ABIogenesis admission/runtime frame, installed
package frame, and release-candidate proof frame.

The causally affected relation set is:

1. odd_glc lifecycle vocabulary, node/type/role/policy declarations;
2. GTL Program composition, validation, identity, and catalog admission;
3. HoG selection and traversal;
4. instruction, worker response, materialization, assessment, and consequence;
5. ABG event admission, Event Calculus, replay, currentness, continuation,
   retry, closure, and result projection;
6. odd_glc read-only lifecycle interpretation;
7. package exports, installed binding, scenarios, and release proof.

The GTL-to-ABG, ABG-to-Public, Public-to-odd_glc, package-to-install, and
candidate-to-release seams cross the set. Their far-side relations are included
above. ABIogenesis internal module decomposition is outside the set because
odd_glc neither imports nor governs it; an exact installed Public/catalog
binding proves that it cannot participate as downstream authority.

## Admission Relation

The consequential entity is an installed odd_glc lifecycle Program candidate.
Its predecessor basis is the accepted odd_glc declarations and Product
requirements. Its candidate family is the complete package declaration set.
ABIogenesis owns whole-Program validation, canonical identity, catalog
admission, and the durable admitted Program result. Admission is singular at
that complete relation, may reject before effects, and supersedes no odd_glc
Product law. Package exports, local validators, fixtures, replay projections,
and odd_glc interpretations cannot authenticate admission.

There is one intended admission path. The 0.1 startup facade and generated
plugin path are replacements to be removed, not replicas. Direct plugin,
vector, worker, source-module, or fixture execution is deliberately excluded
from admission and traversal proof.

## Current Producer And Consumer Census

| Current surface | Current role | 5.0 disposition |
|---|---|---|
| `src/index.mjs` lifecycle/node/stage constants | odd_glc declarations mixed with 4.x facade identities | preserve meaning; project into 5.0 Program declarations |
| `src/index.mjs` `defineLifecycleNodeTypeDeclarations` | declaration construction | adapt to accepted GTL 5 declaration relation |
| `src/index.mjs` `defineOddGlcStartupBinding` and facade validators | 4.x startup/admission binding | replace with installed Program/catalog admission |
| `src/index.mjs` `interpret*State` family | read-only interpretation | preserve and type against Public replay projections |
| `test/glc-software-build-overlay-live.test.mjs` `fpDispatch` | worker invocation, response parsing, materialization, assessment | delete; ABIogenesis/HoG owns the relations |
| same file `fpEvaluator` | evaluator invocation and response parsing | delete; ABIogenesis/HoG owns the relations |
| same file `consequenceProjection` | local consequence and `reenter_graph_span` construction | delete; consume ABIogenesis continuation/re-entry truth |
| same file `materializeScenario` / `materializeAssessmentFiles` | local result materialization | delete; consume admitted materialization/result projections |
| same file deterministic execution assessment | product-local F_D mechanism | retain law/data only; consume accepted ABIogenesis F_D result |
| `test/abg42-startup-binding.test.mjs` and 4.x proof fixtures | old installed consumers/proof | replace with exact 5.0 installed/Public proof |
| `src/substrate_provenance.mjs`, package dependency and lock | 4.6.0-rc.3 identity | bind one exact released 5.0 package and install identity |

No row is lawful in a mixed old/new state. A consumer becomes migrated only
after its old producer is unreachable and its replacement producer is proven.

## Computational Projection

| Component | Semantic role | Operational role | Realization disposition |
|---|---|---|---|
| lifecycle Program declarations | express odd_glc meaning | immutable package data | adapt locally to GTL 5 syntax |
| Program validation/identity/admission | establish admitted Program truth | ABIogenesis public operation | consume |
| worker and evaluator execution | realize declared probabilistic work | HoG/ABG effect | consume; delete local implementation |
| materialization and F_D assessment | derive admitted result/evidence | ABIogenesis effect and pure relation | consume; retain odd_glc policy inputs only |
| events, currentness, continuation, closure | runtime truth | ABG Event Calculus/replay | consume; delete local state/action ownership |
| lifecycle interpretation | assign odd_glc meaning to admitted truth | pure read-only projection | implement locally |

Similarity between the removed 0.1 mechanisms and ABIogenesis code does not
make them shared implementations. They govern the same semantic relations and
are therefore replacements; keeping both would be an undisposed duplicate.

## Code-Building Contract

Each implementation slice must map every edited function to its lifecycle
entity, transition or projection, functional owner, common algorithm,
technology role, input authority, output carrier, prohibited calls/state, and
direct consumers before editing. The slice must first search the affected
dependency cone and classify each required algorithm as:

- consume an existing ABIogenesis 5 or odd_glc common relation;
- extend one cohesive authority-neutral relation; or
- propose a new authority-neutral relation with an explicit gap and competing-
  helper disposition.

For this migration, ABIogenesis 5 admission, event, Event Calculus, replay,
selection, traversal, materialization, and continuation algorithms are
`consume`. odd_glc lifecycle declarations are typed domain-owner adapters.
Read-only lifecycle interpretations are local pure projections. No runtime
truth algorithm is `implement locally`.

## Increment 03 Adjudicated Source-Result Cone

F_H rejected the Increment 02 checkpoint because its local
`odd_glc_lifecycle_context` trusted caller-authored run, projection, digest, and
disposition strings and its publication named the interpretation leaf as the
Product-semantics provider. Those are authority errors, not paperwork gaps.
Increment 03 removes both claims without repricing Product or requirements.

The smallest coherent declaration cone remains one direct Program start, one
root GraphFunction whose sole term is a workflow reference, and one subordinate
`F_D` GraphFunction containing the Product-owned read-only projection leaf. The
subordinate GraphFunction is callable Program membership because `workflow.C`
invokes it; it is not another public start. The accepted input carrier is now
ABIogenesis' exact exported `ProductInvocationSourceResultBasis`. ABI Public
derives that carrier only for a closed Run, an advanced admitted result and
judgment, the exact admitted source invocation/workspace, and the same admitted
Product publication and semantics basis.

Structural input evaluation is deliberately provisional. A caller can
serialize the carrier fields, so shape and digest checks alone do not authorize
execution. ABI Public independently derives `sourceResultBasis`; the exact
installed `product_semantics_provider` then requires canonical equality between
the admitted input and that independent basis, plus exact workspace and
workspace-binding equality. Only after that check may ABG admit the invocation
input. No odd_glc WeakSet, ledger, replay scan, or source-result minting helper
is introduced.

### Domain decisions

| Entity | Identity and lifecycle | Owner | Decision |
|---|---|---|---|
| source result basis | ABI `basisRef`/`basisDigest` over Public authority, source invocation/Run/GraphCall/C-call, result/judgment events, replay, and workspace binding | ABI Public/ABG | immutable input authority; odd_glc may structurally evaluate and read it but cannot construct authoritative instances |
| input evaluation | typed accepted value or `odd_glc_lifecycle_interpretation_refusal` | odd_glc Product semantics | rejects empty/wrong contract/kind/version, malformed digest/value, empty ref, and canonical identity mismatch; never claims ABG admission |
| Product semantics provider | binding ref + exact 0.2 package version + installed module path + named symbol | odd_glc declaration; ABI installed loader authenticates | distinct from the F_D implementation symbol and loadable from the declared module |
| lifecycle projection candidate | `odd_glc_lifecycle_state` bound to source basis, Run, result/judgment event, replay, and workspace identities | odd_glc | immutable read-only interpretation; current disposition is only `no_disposition` |
| deterministic evidence candidate | ABI canonical input/output digests plus declared implementation ref | odd_glc leaf candidate; ABG admits or rejects | candidate only; never local evidence truth |
| result and judgment | ABG-admitted result then declared judgment relation | ABG/HoG | provider validates output shape and resolves the declared predicate; ABG owns admission |
| child and root closure | GraphCall-scope then Run-scope event families | ABG | preserved declaration shapes; odd_glc does not emit, replay, or close either scope |

The generic source-result carrier proves closed admitted source truth, but it
does not by itself prove a Product-specific lifecycle disposition. Until an
exact ABI lifecycle query/result contract is selected and installed, the pure
projection preserves the authoritative refs and digests and returns
`no_disposition`. Mapping a generic closed result to `blocked`,
`continuation_available`, `reentry_available`, or
`release_readiness_candidate` would invent Product truth and is stopped as the
named unavailable lifecycle-semantic boundary.

### Sequence decision

1. A Public `run.invoke` request supplies the candidate input and a source
   result ref under a durable run-projection authority.
2. Public loads the Product semantics provider from the exact admitted install
   and publication binding; wrong path, symbol, binding, package, version, or
   installed content is a Public refusal.
3. The provider structurally evaluates the input contract. A typed local
   refusal maps to ABI's `null` Product-admission hook result and Public refuses
   before traversal.
4. Public independently derives `ProductInvocationSourceResultBasis` from ABG
   history. Derivation requires a closed source Run and advanced admitted
   result/judgment under the same Product semantics basis.
5. The installed provider compares the input to that basis and the current
   workspace/binding. Cross-Run, cross-workspace, missing-source, action-catalog,
   or applied-catalog substitution is refused before ABG input admission.
6. ABG admits the exact input and invocation; HoG selects the declared
   implementation through the admitted install and opens the root then child
   GraphCall scopes.
7. The pure leaf preserves source identities, emits one deterministic evidence
   candidate, and proposes an `odd_glc_lifecycle_state` with
   `no_disposition`. It performs no effects and reads no mutable state.
8. ABI's installed leaf-semantics projection validates the output and resolves
   the declared judgment relation. ABG admits result and advance judgment.
9. ABG closes the child GraphCall and root Run using the declared closure
   contracts, records events, replays truth, and Public projects the result.

Steps 2, 4, 5, 6, 8, and 9 are ABI-owned mechanisms. The source candidate
implements only the declaration, Product contract semantics, and pure step 7.

### State decision

| State | Entry fact | Allowed next state | Refusal/stop |
|---|---|---|---|
| candidate input | untrusted serialized value | structurally accepted | typed Product refusal |
| structurally accepted | exact shape, refs, canonical digests | authority matched | not executable and not ABG truth by itself |
| authority matched | canonical equality with Public-derived basis and workspace | ABG input/invocation admitted | missing source, cross-Run, cross-scope, or catalog substitution refuses |
| admitted invocation | ABG admission exists | child projection call open | ABI resolution/traversal refusal |
| projection proposed | pure result/evidence candidates exist | result admitted and judged | malformed output/evidence or predicate rejection |
| child closed | ABG GraphCall closure events exist | root closure | no odd_glc transition action |
| root closed | ABG Run closure and replay agree | Public result projection | terminal; odd_glc remains read-only |

There is no transition from structural acceptance directly to projection, no
transition from a local result candidate directly to closure, and no local
retry or re-entry transition.

### Authority decision

| Relation | odd_glc authority | ABI authority | Forbidden duplicate |
|---|---|---|---|
| carrier structure and lifecycle meaning | declare accepted Product contract and read-only meaning | derive/authenticate exact source basis | local authoritative context or source-result mint |
| canonical JSON/digest algorithm | consume `@abiogenesis/typescript-tenant/product` | define canonical/digest semantics | Product-local hashing variant |
| provider contents | implement Product input/output/judgment semantics | authenticate exact installed module/content/binding | leaf symbol masquerading as provider or test resolver as runtime authority |
| Program/publication | assemble digest-bound declaration from supplied artifact basis | validate/admit installed publication and Program | source digest presented as install admission |
| result/evidence/judgment | propose typed candidates and predicate semantics | validate and admit events/current truth | local admitted-ref, evidence, or judgment ledger |
| GraphCall/Run closure | declare contract refs/shapes | execute, event, replay, and project closure | local close/retry/continuation controller |

### Code-building map

| Function/value | Entity or relation | Algorithm disposition | Input authority | Output and consumers | Prohibited state/calls |
|---|---|---|---|---|---|
| `evaluateOddGlcAbi5LifecycleInput` | Product contract evaluation | Product-owned typed adapter consuming ABI canonical/digest functions | untrusted candidate only | accepted immutable carrier or typed refusal; provider `admitInput` | no ABG admission claim, event/store access, or source mint |
| `ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis` | installed source-result/workspace relation | Product-owned equality policy over ABI-provided authority | Public-derived basis plus admitted input/current workspace | boolean consumed only by ABI installed wrapper | no replay reconstruction, latest-value lookup, or local scope ledger |
| `interpretAbi5LifecycleProjection` | read-only lifecycle projection | local pure F_D Product relation | carrier already admitted by ABI after provider match | result/evidence candidates consumed by HoG/ABG | no filesystem, clock, dispatch, materialization, event, retry, continuation, or closure call |
| `constructOddGlcAbi5ModulePublication` | digest-bound declaration assembly | Product-owned declaration constructor following ABI GTL public shape | externally supplied exact artifact basis | immutable publication consumed by ABI validation/install/catalog | no artifact digest mint, package install, admission, or source-checkout fallback |

The existing 0.1 `interpretLifecycleState` family is not a donor: it consumes
the predecessor 4.x facade/read-model shape and remains census evidence until
its authorized consumer cut. Canonical JSON and SHA-256 are consumed from the
ABI Product export rather than reimplemented. Root and child closure shapes are
consumed as public declaration law; ABI remains sole owner of their events.

### Readiness and cross-view decision

| Relation | Current state | What current proof establishes | Remaining acceptance boundary |
|---|---|---|---|
| ABI source-result carrier and provider interfaces | diagnostic-ready in built `5.0.0-dev.286` Product export | exact types/functions and Public derivation code exist | pin accepted released ABI 5 identity |
| odd_glc provider/publication relation | source-loadable | declared module resolves the named provider; substituted identities differ | package exact 0.2 build, manifest, install admission, and fresh-process ABI loader proof |
| Program/closure declarations | statically accepted | current validator accepts topology, membership, binding, and closure shapes | catalog/Program admission and installed traversal proof |
| lifecycle semantic mapping | unavailable beyond identity-preserving `no_disposition` | no caller disposition is trusted or inferred | select an exact ABI lifecycle-specific admitted result/query contract |
| runtime result/judgment/closure | unavailable in odd_glc candidate proof | declaration shapes and pure candidates only | ABG event/replay/Public end-to-end proof under exact installs |
| canonical Program identity | blocked on ABI validator gaps | current validation output is recorded diagnostically | ABI-owned duplicate declaration rejection, order-independent identity, and non-empty `valueKind` enforcement |

Static validation claims are correspondingly narrow. The built validator's
green `publication_validation`/`program_validation` proves only what its current
diagnostics enforce. Focused proof records that it currently accepts duplicate
ContractDeclaration identity and empty `valueKind`, changes validation source
identity when declaration arrays are reordered, and does not load the named
Product provider. These are ABI-owned gaps; odd_glc does not add a rival
validator or normalize declarations to hide them.

## Subject 03 Design Re-entry: Fresh Workspace Source

Consensus Subject 02 is rejected. Its derived lifecycle Program correctly
required Public's exact source-result basis, but no first Run could lawfully
produce such a basis. The repair does not weaken that equality and does not
invent another carrier. ABI already binds every fresh `run.invoke` to an
admitted `WorkspaceBinding`, exports that carrier from the Product surface, and
passes its exact workspace/binding identities to the installed Product
semantics provider while `sourceResultBasis` is null.

Subject 03 therefore declares a separate source Program with one direct `F_D`
leaf:

1. Public supplies the exact admitted ABI `WorkspaceBinding` as source Program
   input on a fresh invocation.
2. Product semantics checks the ABI canonical binding digest/id and equality
   with the current workspace/binding basis, requires a null source result, and
   refuses all action-catalog application.
3. The pure source leaf returns the same immutable binding as a result
   candidate with deterministic evidence.
4. ABI admits the source result and judgment, closes the source Run, and Public
   projects the result under a durable run-projection authority.
5. A later lifecycle invocation cites that source result. Public derives its
   exact `ProductInvocationSourceResultBasis` under the same admitted Product
   publication and semantics binding.
6. The existing lifecycle provider requires canonical equality between its
   input and Public's derived basis, then the existing workflow/leaf Program
   produces only the read-only `no_disposition` projection.

The source and lifecycle Programs share one publication and provider but have
distinct starts, callable membership, input/output contracts, source/root
closure contracts, judgment predicates, and implementation bindings. The
source Program is not callable membership of the lifecycle Program and is not
a compatibility start.

### Subject 03 evidence and closure topology

| Scope | Term | Evidence value kind | Closure |
|---|---|---|---|
| source Run | direct `c_of` / `F_D` | `deterministic_evidence_candidate` | source Run closure |
| lifecycle Run root | `c_workflow` | `sub_traversal_evidence_candidate` | lifecycle Run closure |
| lifecycle child GraphCall | direct `c_of` / `F_D` | `deterministic_evidence_candidate` | child GraphCall closure |

This prevents a workflow fold from claiming leaf evidence and prevents either
leaf from claiming sub-traversal evidence. ABG remains sole owner of evidence
admission and closure truth.

### Subject 03 provenance decision

Each catalog contribution carries exactly the lock-authorized provenance tuple
`[artifact.artifactDigest, artifact.productManifestDigest]`. The publication
still declares its `productContentDigest`, descriptor ref, and contribution
manifest ref, but content digest is not an extra contribution provenance
authority. Focused static proof consumes the exact object returned by
`constructOddGlcAbi5ModulePublication`; cloned publications exist only for
negative validator-gap probes.

The read-only lifecycle state retains the direct authority identities required
by its declared consumer: public authority digest; source invocation-admission,
invocation, Run, GraphFunction, GraphCall, and C-call refs; result admission,
judgment, result, contract and value digests; replay ref/digest; and workspace
and binding identities/digest. This is the selected resolution of the
reconstruction question: carry the direct identities instead of attempting a
Product-local replay scan from only `sourceBasisRef`/`sourceBasisDigest`.

### Subject 03 readiness boundary

The built ABI Product and validator surfaces are sufficient to type the exact
carrier, exercise both provider branches, validate the real publication, and
validate both Program declarations. They are not an installed odd_glc 0.2
artifact. Because the immutable 0.1 package census intentionally omits this
candidate module, exact ProductInstall/CatalogView admission and Public
end-to-end execution cannot be proved without first authorizing the 0.2 package
and install cut. Work stops at that named boundary; no test override, source
fallback, invented carrier, or compatibility publication substitutes for it.

## Subject 04 Design Re-entry: Product Fresh-Source Identities

Subject 03 is rejected. Treating an input as ABI's admitted
`WorkspaceBinding` was unsound because its canonical binding digest does not
cover `admissionEventRef`. Product-side digest reconstruction could validate
the binding body while accepting a caller-forged admission event. odd_glc has
no event-store or replay authority capable of authenticating that field, so the
whole binding carrier is removed rather than locally branded or looked up.

The replacement is a Product-owned request/result pair. Both carry only:

- the current `workspaceId`;
- the current `workspaceBindingId`; and
- the current `workspaceBindingDigest`.

Their kinds are respectively `odd_glc_fresh_source_request` and
`odd_glc_fresh_source_result`; both use schema version `5.0.0`. Exact-key
evaluation forbids admission-event, disposition, replay, binding-body, and
arbitrary extension fields. The request is not authoritative because a caller
can serialize it. Authority arises only when ABI Public invokes the exact
installed Product provider with its independently authenticated current
workspace identities.

### Subject 04 sequence and authority

1. A fresh Public `run.invoke` supplies the Product request as candidate input
   with no source-result relation.
2. The provider structurally evaluates the five-field request, requires
   `sourceResultBasis === null`, requires no action-catalog application, and
   compares all three identities with Public's `workspaceId`,
   `workspaceBindingId`, and `workspaceBindingDigest` basis.
3. Only after this match may ABI admit the invocation input. The direct `F_D`
   leaf proposes the distinct five-field result and deterministic evidence.
4. The Product judgment relation accepts only exact identity preservation from
   request to result. ABG owns result/evidence/judgment admission and Run
   closure.
5. Public may derive `ProductInvocationSourceResultBasis` only from that
   ABG-admitted closed result. A later lifecycle invocation must still equal
   that Public-derived basis canonically and match its current workspace.

The fresh result does not say `admitted`, `closed`, or any lifecycle
disposition. Its existence as a local value proves nothing. The later ABI
source-result carrier supplies the ABG admission, result/judgment event, replay,
Run, and Public authority identities; the lifecycle projection preserves those
direct identities as decided in Subject 03.

### Subject 04 state and stop boundary

| State | Authority | Allowed successor | Forbidden inference |
|---|---|---|---|
| serialized fresh request | caller candidate | provider identity match | admitted workspace or binding |
| authenticated invocation basis | Public plus installed provider | ABI input/invocation admission | local admission event |
| fresh result candidate | pure Product leaf | ABI result/evidence/judgment admission | admitted/closed/disposition |
| closed source Run | ABG events/replay | Public source-result derivation | Product-local replay reconstruction |
| derived lifecycle invocation | Public-derived exact basis | existing lifecycle Program | caller-authored source authority |

The narrower result is sufficient because the governing lifecycle Program
requires a closed ABG-admitted source result and its authenticated workspace
scope, not a Product copy of the WorkspaceBinding admission event. Exact 0.2
ProductInstall/CatalogView admission and Public traversal remain unavailable
until the package/install cut; this design stops there without synthesizing an
authority substitute.

The domain, sequence, state, authority, computational, and readiness views must
agree on these invariants:

- the fresh-source executable input is a Product request only after Public's
  current-workspace identity match, while the lifecycle executable input is
  ABI's exact source-result carrier after the independently derived-basis
  match;
- source candidate loadability is not installed-content admission;
- `no_disposition` is the strongest current semantic output;
- result/evidence/judgment values remain candidates until ABG admission;
- child closure precedes root closure and both remain ABI event truth; and
- the immutable 0.1 package census remains unchanged while 0.2 packaging and
  install identity are pending.

## Break Sequence

1. Pin this census and the released 0.1 predecessor.
2. Bind exact accepted ABIogenesis 5 public types and operation identities.
3. Introduce the complete odd_glc GTL Program declarations and prove
   validation/canonical identity before effects.
4. Delete dispatch, evaluator, prompt/response, materialization, and assessment
   mechanisms; rebind consumers to admitted result projections.
5. Delete consequence, retry, continuation, closure, and re-entry mechanisms;
   rebind interpretations to Event Calculus/replay/Public truth.
6. Replace 4.x startup/install fixtures and prove fresh-process installed use.
7. Freeze one exact candidate for T-039 RC qualification.

Each step is a main-branch checkpoint. A checkpoint may temporarily leave the
enclosing migration open, but it may not expose two authorities for the same
relation or claim release compatibility.

## Re-entry And Stop Conditions

Re-enter Product/requirements if lifecycle meaning changes. Re-enter this
design if the public Program, admission, runtime-truth, or replay relation
changes. Stop locally when an accepted ABIogenesis capability is absent; do not
fill the gap with an odd_glc helper. Compatibility, a second maintained branch,
Product expansion such as T-040, RC publication, and final release require
separate F_H authority.

## First Implementation Gate

No executable migration cut is accepted until the ABIogenesis 5 package
candidate exposes exact installed Program validation/admission and typed Public
projection identities. Before that boundary freezes, lawful progress is the
census, declaration design, negative-authority proof design, and removal plan;
binding to mutable internal callables would create the facade this migration is
required to avoid.
