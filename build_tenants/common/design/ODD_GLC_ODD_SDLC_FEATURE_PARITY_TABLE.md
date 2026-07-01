# odd_glc Dense odd_sdlc Feature Parity Table

**Status**: Active
**Scope**: Common design backlog
**Derives from**:
[PRODUCT.md](../../../specification/PRODUCT.md),
[GOALS.md](../../../specification/GOALS.md),
[REQ-GLC-DOWNSTREAM-SPECIALIZATION](../../../specification/requirements/REQ-GLC-DOWNSTREAM-SPECIALIZATION.md),
[ODD_GLC_GENERIC_PARITY_MATRIX](./ODD_GLC_GENERIC_PARITY_MATRIX.md),
`/Users/jim/src/apps/odd_sdlc/specification/INTENT.md`,
`/Users/jim/src/apps/odd_sdlc/specification/PRODUCT.md`

## Position

`odd_glc` should recover the user-visible lifecycle capability shape that
`odd_sdlc` was aiming at: outcome-driven development over specification,
requirements, graph-native construction, evidence, assurance, release,
operation, and renewal.

It must not recover the implementation shape that made `odd_sdlc` expensive:
product-local truth surfaces, `Sdlc*` ledgers, retry controllers, closure
registers, phase-flow controllers, product-local execution shells, or local
runtime facts.

Parity means:

`GTL/ABG truth -> odd_glc generic lifecycle interpretation -> downstream/plugin specialization`

No row below authorizes odd_glc to create truth that does not originate in
GTL/ABG.

## Dense Feature Table

| Layer | odd_sdlc intent/product feature | odd_sdlc witness surface | odd_glc parity target | GTL/ABG source truth required | odd_glc-owned surface | Forbidden local truth | Current state | Next gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Intent | Outcome-driven development as graph-native product | INTENT: outcome-driven development through GTL/ABG | Generic lifecycle framework for governed construction at any scale | GTL graph/module declarations; ABG traversal/replay truth | Lifecycle vocabulary and interpretation | Product-local runtime or hidden service loop | Product boundary ratified | Keep product identity generic; no odd_sdlc port rows. |
| Intent | Specification authority over build work | Spec stack drives SDLC work | Lifecycle pressure starts from governed intent/product/requirements | GTL declarations and ABG admitted requirement terms | Labels for intent/product/requirement pressure | Local requirement compiler or ledger | Route-1 interpretation exists | Bootstrap traversal must consume real startup declarations. |
| Intent | WHAT/HOW separation | Spec defines WHAT; tenants realize HOW | WHAT remains spec; HOW lives in GTL declarations, plugins, and build tenant design | GTL conformance and ABG runtime facts | Read-model overlays and policy data | Encoding HOW as product truth in odd_glc spec | Boundary law exists | Dense backlog rows must keep witness separate from spec. |
| Intent | Graph-function-first construction | Graph function catalog as constructive carrier | Product may publish GTL declarations for reusable lifecycle/software-build functions | GTL library declarations; ABG registry admission, lookup, selection, graph-call opening | Product library declaration data and overlay refs | Local function catalog used for selection or invocation | Software-build overlay/library declared | Prove ABG startup selects callable entries from these declarations. |
| Intent | Iterative closure by repricing | Unresolved requirements remain pressure | Residual/reentry/reprice interpreted as lifecycle state | ABG residual, continuation, re-entry, executive pressure facts | Residual/reprice views | Retry loop, next-action controller, closure ledger | T-026 active | Fresh ABG 4.2 non-closed typed-startup fixture required. |
| Intent | Homeostatic renewal | Observation/gap analysis re-enters constitution | Telemetry/feedback returns as lifecycle pressure | ABG telemetry/pressure/continuation facts | Feedback-to-pressure interpretation | Product-local operational feedback loop | Open | Needs operational feedback substrate and proof. |
| Product | Installed ODD product over GTL/ABG | odd_sdlc.TS product line over ABIogenesis | odd_glc TypeScript tenant is declaration/read-model line over ABI 4.2 | Installed ABI 4.2 public GTL/ABG surfaces | Facade validation and provenance pin | Importing ABG runtime internals | ABI 4.2 pin exists | Keep pin current as releases advance. |
| Product | Standard realization topology | Standard product/build tenant/test/proof layout | Minimal tenant with declarations, overlays, read-models, tests, fixtures | GTL/ABG installed package and replay artifacts | Tenant structure and tests | Hidden local runtime scaffolding | Tenant active | Move from fixture consumption to typed startup traversal. |
| Product | Multiple HOW realizations under singleton WHAT | TypeScript line, Python discovery line | odd_glc can support multiple tenants under one lifecycle spec | GTL declarations plus tenant-specific design/proofs | Tenant-neutral common design | Tenant-specific behavior in product law | Common design active | Future tenants must prove same boundary. |
| Product | Lightweight runtime model | No inherited shadow runtime target | odd_glc has no runtime; it reads GTL/ABG truth | ABG runtime/event/replay/query surfaces | Pure functions over admitted data | Product-local run loop or actor invocation | Greps/tests guard boundary | Continue negative authority tests. |
| Product | Domain meaning over ABG facts | SDLC edge meanings and overlays | Generic lifecycle meaning plus software-build overlay seam | ABG facts and GTL refs | Overlay maps, role refs, policy refs | ABG carrier shadowing | Reusable software-build overlay added | Prove overlay consumed by ABG startup. |
| Product | SDLC worksite lifecycle | Request -> spec -> design -> implementation -> qualification -> release -> deployment -> runtime return | Generic lifecycle phases over any worksite; software-build overlay is one specialization | GTL node types, graph spans, ABG traversal, evidence, fold, telemetry | Lifecycle phase labels and read models | Hard-coded software phase controller | Partial | Add lifecycle views for release/deploy/telemetry/retirement as GTL/ABG truth appears. |
| Product | Typed assets and graph overlays | Request/spec/design/code/test/evidence assets | Lifecycle node types and composed lifecycle bundles | GTL node-type graph functions and type composition | Node-type declaration data | Local asset carrier set not backed by GTL | T-022 completed with fixes | Maintain full 14-surface node-type coverage. |
| Product | Source/project/release/install distinction | Dedicated release model and install normalization | odd_glc records source/provenance/release readiness without claiming release authority | ABG/release proof facts where present | Release-readiness interpretation | Local release closure register | Release authority not claimed | Add release proof surfaces only when upstream exists. |
| Product | On-demand application lane | Start requested app work from product worksite | Generic bootstrap traversal starts lifecycle work | ABG startup config, registry admission, selection, graph call | Startup-state interpretation | App-local shell selects/runs work | T-024/T-025 partial | Bootstrap traversal proof is first-class gate. |
| Product | Orchestration plane | Sessions/workers/async/browser observation subordinate to ABG | External orchestration remains plugin/ABG-owned, not odd_glc runtime | ABG worker/session/event/provenance facts | Policy and plugin refs only | Reconnectable session controller in odd_glc | Mostly open | Only add read views over ABG truth. |
| Requirements | Requirement pressure and closure | Requirement closure register and edge ledgers | Requirement set/environment views over ABG route | GTL requirement declarations; ABG requirement ledger/environment/fold/residual | Requirement pressure labels | `SdlcRequirementClosureRegister` equivalent | Route read exists | Multi-requirement typed-startup proof still needed. |
| Requirements | Decomposition and dependency | Feature depth/dependency maps | Requirement graph view | ABG requirement graph/refinement projections | Read-only graph interpretation | Local decomposition compiler | Recursive/requirement-graph substrate available | Prove fresh typed GLC requirement graph proof. |
| Design | Design/topology/instruction handoff | Design surfaces, topology, work order | Destination topology and instruction-set views | GTL topology; ABG obligation/target/schedule projections | Handoff labels and read models | Product-local planner/scheduler | Open/partial | Use ABG projections or upstream ticket gaps. |
| Build | Code/artifact materialization | Code generation and artifact work | Target artifact view over admitted artifact refs | ABG actor/operator execution and admitted artifact/evidence refs | Artifact label and proof interpretation | odd_glc code-generation runtime | Sandbox tests only | ABG bootstrap traversal must own materialization proof. |
| Test | Test source and execution proof | Testcase authority and scenario proof | Test/proof roles as plugin-bound software-build roles | GTL/ABG proof role declarations; ABG evidence admission | Role labels and read views | Local evidence admission | Sandbox parity added | Convert each rung to fresh ABG 4.2 typed-startup proof. |
| Execution | Command/process/service proof | CLI, JS test, Rust CLI, service/client | Software-build overlay names executable proof roles; ABG performs execution | ABG actor/operator/service/client evidence events | Evidence/capability views | Local process supervisor as product mechanism | Sandbox parity present | Product proof must be ABG-started, not sandbox-only. |
| Assurance | Evaluation and closure | Assurance decisions, close/partial/block | Assurance fold and residual views | ABG assurance closure, fold, residual, disposition | Lifecycle assurance vocabulary | Local close decision or fold projection | Closed path read exists | Non-closed ABG 4.2 typed proof remains. |
| Re-entry | Rework/retry/next action | Retry frontier and next-action projection | Re-entry disposition view | ABG continuation/correction/re-entry/executive pressure | Re-entry/reprice labels | Retry controller or next-action ledger | Open/partial | T-026 fresh typed proof. |
| Parallel | Branch/fan-in work | Saga/frontier async execution | Parallel frontier lifecycle view | ABG frontier, branch lease, fan-in, aggregate fold | Branch/fan-in interpretation | Product-local branch scheduler | Sandbox and old fixture read exist | Fresh typed ABG 4.2 parallel startup proof. |
| Recursive | Program/project/task nesting | Local phase hierarchy and graph re-entry | Recursive span lifecycle view | ABG frame, span, zoom, foldback, re-entry | Span/foldback labels | Local hierarchy controller | T-027 active | Fresh typed recursive GLC fixture. |
| Policy | F_P/F_H use | Prompt/evaluator/human decision policy | Data-only policy overlays consumed by GTL/ABG/plugins | F_P/F_H refs admitted or resolved by ABG | Prompt/rubric/risk/escalation data | F_P worker invocation or F_H decision controller | Policy overlay rejects functions | Prove plugin-owned policy use through ABG. |
| Plugins | Specialization and result contracts | Plugin interfaces, result envelopes, allowed traversal catalog | Downstream plugins supply software-build roles and policy data; ABG selects/invokes | ABG registry, plugin advice, selection, result envelopes | Seam refs and interpretation | Plugin shell bypassing ABG startup/selection | ABG 4.2 registry and node-type substrate available | Use canonical ABG startup/registry path. |
| Sandbox | Isolated scenario workspaces | odd_sdlc live runs in sandbox/test_runs | Every scenario proof runs in isolated workspace | Test harness may execute subject only; truth remains ABG-emitted or committed ABI proof truth | Test-only sandbox summaries | Treating sandbox output as ABG truth | Sandbox parity tests added | Keep sandbox as proof subject, not product runtime. |
| Adoption | Carried truth and provenance | Adoption rules for carried truth | Committed ABI proof artifacts are read-only truth inputs | Digest-pinned ABI proof artifacts and event logs | Provenance manifests and proof validation | Mutable cross-repo latest output | Provenance pins exist | Maintain digest-pinned proof discipline. |
| Retirement | Delete old mechanism | Retire local SDLC ledgers/controllers | Downstream can retire odd_sdlc mechanisms after generic rows are proven | GTL/ABG + odd_glc surfaces must cover user-visible capability | Deletion-target witness column only | Rebuilding odd_sdlc inside odd_glc | Out of odd_glc scope | Track downstream repo work separately. |

## Reading Rules

- The row identity is the `odd_glc` generic lifecycle capability, even when
  the first two columns cite `odd_sdlc`.
- `odd_sdlc` is a witness and deletion target, not the implementation source.
- If a row needs local truth construction, the row is not ready for odd_glc;
  it must be repriced upstream to GTL/ABG or downstream to a product/plugin
  specialization.
- Software-build meaning belongs in the reusable software-build overlay and
  plugin seam. It is not scenario-specific Hello World law.
