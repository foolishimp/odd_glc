---
id: T-025
title: Replay scenario ladder as typed GLC declarations
type: proof
ticket_category: implementation
status: active
goal: >-
  Re-express the Hello World ladder as typed odd_glc GTL declarations and
  ABG-started runs for JavaScript test, Rust CLI, Rust service/client, and
  parallel JavaScript witnesses.
change_class: realization_refactor
re_entry_point: build_tenant_proof
owner: odd_glc
priority: medium
created_at: 2026-07-01
governance_scope: STDO Method, ODD Method, generic lifecycle scenario coverage
source_documents:
  - .ai-workspace/tickets/completed/T-024-prove-glc-hello-world-over-abg-4-2-startup.md
  - .ai-workspace/tickets/completed/T-008-govern-hello-world-scenario-ladder.md
  - .ai-workspace/tickets/completed/T-010-prove-js-tenant-test-hello-world-ladder-rung.md
  - .ai-workspace/tickets/completed/T-011-prove-rust-cli-hello-world-ladder-rung.md
  - .ai-workspace/tickets/completed/T-012-prove-rust-service-hello-world-ladder-rung.md
  - .ai-workspace/tickets/completed/T-013-track-parallel-js-hello-world-ladder-rung.md
closure_law: >-
  Close only when the ladder is proven as generic typed odd_glc declarations
  over ABG startup/traversal truth, while preserving all software-domain
  semantics as plugin or proof bindings rather than odd_glc law. Each
  scenario-rung proof must also run in an isolated sandbox workspace, mirroring
  the odd_sdlc witness standard without importing odd_sdlc code, phase flow,
  carriers, or local runtime authority.
non_closure_conditions:
  - A ladder rung imports odd_sdlc code or phase flow.
  - Rust, service, test, HTTP, or JavaScript policy becomes generic odd_glc
    product law.
  - odd_glc product or runtime surfaces supervise processes, execute commands,
    admit evidence, or schedule parallel branches locally.
  - A historical rc17 ladder replay proof input is relabeled as typed ABG 4.2
    startup proof without ABG-emitted startup, registry, selection, graph-call,
    traversal, and evidence truth for that rung.
  - A rung claims parity from startup declaration, sandbox execution, or replay
    interpretation alone without an ABG bootstrap traversal that consumes the
    startup config, selects a callable graph function, opens the graph call,
    traverses the scenario vectors, and emits the scenario proof truth.
  - A scenario sandbox writes or mutates ABI replay truth, route facts,
    registry entries, admitted refs, evidence admission, fold, residual,
    disposition, or selection facts instead of treating ABI proof inputs as
    read-only summary truth.
  - Two scenario rungs share a mutable workspace, output directory, process
    state, or proof summary.
  - A ladder rung mints a scenario-specific odd_glc overlay instead of binding
    through the reusable software-build overlay or an explicitly repriced
    downstream plugin specialization.
  - A parity witness creates local odd_glc or copied odd_sdlc truth surfaces
    for artifacts that must be GTL declarations, ABG-emitted runtime truth, or
    sandbox/product outputs.
  - A parity witness omits explicit GTL node-type definitions for the typed
    lifecycle/software-build graph it claims to exercise.
  - A parity witness mints or ratifies an `odd_glc` graph-function entry for
    generic construction that is already available, or should be made available,
    through the GTL/ABG system catalog.
  - `ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS` is treated as the final
    product-owned function surface before each entry passes an ABG-catalog reuse
    audit.
  - A proof adapter uses an `odd_glc` graph-function ref and the ticket records
    it as product law instead of a temporary binding pending system-catalog
    reconciliation.
required_work:
  - Create typed declaration bindings for each rung.
  - Consume ABG 4.2 startup/traversal truth for each rung.
  - Preserve old ABI proof-input provenance as historical witness evidence only.
  - Bind the ladder through `ODD_GLC_SOFTWARE_BUILD_OVERLAY` and
    `ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING`; the T-180 Hello World bootstrap
    binding remains a historical proof witness, not the reusable
    software-build model.
  - Add sandbox parity proofs for the basic CLI, JavaScript tenant/test, Rust
    CLI, Rust service/client, and parallel JavaScript Hello World rungs. Each
    proof shall create a fresh run root, execute only the scenario subject or
    verifier inside that workspace, copy pinned ABI proof inputs as read-only
    proof inputs, and write a local sandbox summary.
  - Add a startup sandbox proof that consumes the pinned ABG 4.2 T-180 startup
    proof input and records its registry, selection, graph-call, traversal, and
    live-artifact truth without re-emitting any of it.
  - Promote bootstrap traversal to a first-class ladder proof for each rung:
    ABG must consume the odd_glc startup config, admit registry entries, select
    a callable graph function, open the graph call, traverse the scenario
    vectors, emit runtime/proof truth, and expose replay/query truth that
    odd_glc interprets.
  - Add a data_mapper parity witness matrix that names each old odd_sdlc
    scenario as coverage evidence only, identifies the generic odd_glc/ABG
    capability, and assigns artifact ownership to GTL, ABG, odd_glc, or the
    sandbox/product.
  - Add a node-type checklist for the opinionated lifecycle/software-build graph
    so SDLC-like node typing is expressed as GTL node-type declarations and ABG
    type-satisfaction truth, not odd_glc-local convention.
  - Add an ABG catalog reuse audit before closing any software-build or
    data-mapping graph-function proof. The audit shall classify each graph
    function named by the reusable overlay as one of: bound existing ABG system
    function, required upstream ABG system-library gap, or product-specific
    specialization with explicit refinement/override law.
  - Keep node types, overlay graph declarations, role refs, policy refs, and
    plugin seams as `odd_glc` declaration data; bind constructive graph-function
    behavior to ABG catalog entries wherever generic equivalents exist.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 npm run test:live
  - git diff --check
closure_evidence: []
---

# T-025: Typed Scenario Ladder

The ladder is coverage evidence. It is not an odd_sdlc port.

Current state: the reusable software-build overlay has live ABG 4.2 summary
proof inputs for basic CLI, JavaScript test, Rust CLI, Rust service/client,
parallel JavaScript, and data_mapper-lite. Existing rc17 proof inputs remain
historical witness evidence only.

Sandbox parity is an additional proof layer. It verifies that each Hello World
rung can run in its own test-run workspace like the odd_sdlc witness runs did,
while the lifecycle truth interpreted by odd_glc remains the pinned ABI/GTL
proof-input truth. The sandbox harness may execute subject programs as
test evidence; it is not an odd_glc product runtime and shall not be exported
or used as an ABI event/admission/selection/fold path.

The ladder shall bind through the reusable software-build overlay:

- `ODD_GLC_SOFTWARE_BUILD_OVERLAY`
- `ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS`
- `ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING`

The scenario-specific T-180 GLC Hello World bootstrap binding is retained as
historical ABI 4.2 proof evidence of the startup path. It is not the pattern for
new ladder rungs.

Bootstrap traversal is the load-bearing parity step between declaration and
proof. A rung is not parity-complete merely because its startup declarations
exist, its subject runs in a sandbox, or odd_glc can interpret an older replay
proof input. It must show the ABG-owned chain:

`startup config -> registry admission -> lookup/selection -> graph_call_opened -> traversal vectors -> emitted runtime/proof truth -> replay/query -> odd_glc interpretation`.

The startup config and GTL declarations must come from the reusable odd_glc
software-build overlay graph:

- `ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef`;
- `ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef`;
- `ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget`;
- `ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS`;
- `ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING`.

The sandbox harness may generate the runtime binding needed by ABIogenesis
inside the isolated workspace, but it shall not export that binding as an
odd_glc product runtime. The binding is a proof adapter that hands odd_glc GTL
declaration data to ABG startup.

## ABG Catalog Reuse Gate

The reusable software-build overlay is a GTL overlay graph, not a license for
`odd_glc` to own every graph function named by that graph. A graph function is
ABG/GTL system-library work when the same constructive carrier is needed across
multiple ODD products. In that case `odd_glc` shall bind to the admitted ABG
catalog entry instead of publishing a duplicate product function.

Current software-build graph-function refs are provisional startup bindings.
The installed ABIogenesis 4.2 public registry/catalog surface does not publish
equivalent reusable system-library entries for these refs yet, so the current
disposition is `abg_4_2_no_equivalent_published`. Future closure shall bind an
equivalent ABG entry if one is published.

| Current ref | Genericity reading | Required disposition before close |
| --- | --- | --- |
| `graph-function://odd_glc/software-build/bootstrap-worksite` | Candidate ABG system function for binding worksite/context pressure to requirement pressure. | Reuse an ABG catalog entry if present; otherwise open/track upstream ABG system-library gap before ratifying an `odd_glc` specialization. |
| `graph-function://odd_glc/software-build/materialize-artifact` | Candidate ABG system function for materializing an artifact from admitted requirement pressure and selected capability. | Reuse ABG materialization/execution catalog behavior when available; do not encode build policy in `odd_glc`. |
| `graph-function://odd_glc/software-build/prove-artifact` | Candidate ABG system function for evidence/proof binding over an artifact. | Reuse ABG evidence-binding/proof catalog behavior; `odd_glc` may only interpret proof meaning. |
| `graph-function://odd_glc/software-build/fan-in-branches` | Candidate ABG system function for branch fan-in/frontier closure. | Reuse ABG parallel/frontier/fan-in behavior; no local branch controller. |

The same audit applies to the older bootstrap/deployment product graph-function
entries. Their current `odd_glc` refs are declaration placeholders, not proof
that the product owns generic construction. Only lifecycle labels, node-type
declarations, role bindings, policy overlays, plugin seams, and read-model
interpretation remain `odd_glc` owned without further proof.

## data_mapper Parity Witness Ownership Matrix

The `odd_sdlc` data_mapper scenarios are parity witnesses and deletion-target
evidence. They do not authorize copying `Sdlc*` carriers, phase flow, ledgers,
retry controllers, closure rules, or software-domain policy into `odd_glc`.

Each row below must close by using GTL declarations and ABG services. If an
artifact changes runtime truth, ABG owns it. If it declares allowed structure,
GTL owns it. If it is generated product work, the sandbox/product owns it. If
it is lifecycle meaning over admitted truth, `odd_glc` owns only the read
interpretation.

| odd_sdlc witness | What it proves | glc equivalent | Artifacts to create and owner |
| --- | --- | --- | --- |
| T-031 reference fixture | Imports project authority, requirements, and lineage. | GTL requirement declarations plus ABG requirement graph/read model. | **Sandbox/product** owns source docs. **GTL** owns requirement declarations. **ABG** owns admitted requirement terms, lineage, ledger, and projections. **odd_glc** owns read labels only. |
| T-152 transformation-set partition | A local edge can close while downstream mapper obligations remain pressure. | ABG residual/re-entry truth with odd_glc residual interpretation. | **ABG** owns fold, residual, downstream pressure, disposition, and re-entry events. **GTL** owns target/type declarations. **odd_glc** owns residual-pressure view mapping. No odd_glc closure ledger. |
| T-154 no harness target | Next action is selected from source/spec pressure plus target binding, without broad fallback. | ABG registry/selection over the reusable glc software-build overlay. | **GTL** owns overlay graph, node types, library entries, and startup declarations. **ABG** owns registry admission, lookup, `graph_function_selected`, `graph_call_opened`, and traversal transition. **Sandbox/F_P** owns generated mapper source, test, and build files. |
| T-188 lite lifecycle | Full ordered lifecycle through generated test execution and release preparation in a sandbox. | First glc data_mapper steel thread. | **GTL** owns reusable software-build/data-mapping overlay declarations. **ABG** owns traversal events, process execution evidence, test evidence admission, fold, residual, and disposition. **odd_glc** owns lifecycle/readiness interpretation. **Sandbox** owns produced app artifacts. |
| T-164/T-171/T-200 full/deep lifecycle | Larger overlay traversal, detail zoom, and closure from evidence. | Later glc full traversal proof. | **GTL** owns composed graph/type declarations. **ABG** owns zoom, frame, span, foldback, executive observer, registry selection, evidence, and closure truth. **odd_glc** owns nested lifecycle views. No local traversal controller. |
| T-199 code-depth resume | Resume from prior event graph, preserve pressure, and prune build noise. | ABG resume/recursion proof with odd_glc interpretation. | **ABG** owns replay, continuation, resume, frame lineage, and residual pressure. **GTL** owns resume-capable graph declarations. **Sandbox** owns copied prior workspace and generated outputs. **odd_glc** owns resumed-lifecycle interpretation only. |
| T-109/T-115 live/repair | Process supervision and repair flow. | ABG process/F_P/reprice truth with odd_glc read-only repair view. | **ABG** owns process supervision, F_P invocation, telemetry, repair/reprice events, and continuation routing. **GTL** owns repair/retry policy declarations. **odd_glc** owns repair/reprice view labels. No odd_glc retry loop. |

## Typed Node Checklist

The SDLC-like opinionated graph shape belongs in reusable GTL node-type
definitions and typed graph declarations. `odd_glc` may own the lifecycle and
software-build type library as declaration data. It shall not infer node types
from local code conventions, and it shall not validate traversal closure
locally. ABG validates type satisfaction and close-time output obligations.

Minimum lifecycle node types:

| Node type | Purpose | Owner and validation |
| --- | --- | --- |
| `odd_glc.type.lifecycle.worksite` | Lifecycle worksite/root context. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.lifecycle.intent_surface` | Intent definition surface. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.lifecycle.product_surface` | Product definition surface. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.lifecycle.goal_surface` | Goal/work-wave surface. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.lifecycle.requirement_set` | Authored requirement input. | **GTL** requirement declaration binding; **ABG** admitted requirement truth. |
| `odd_glc.type.lifecycle.requirement_graph` | Admitted/projected requirement graph. | **ABG** projection truth; **odd_glc** read label. |
| `odd_glc.type.lifecycle.scenario_surface` | Scenario/proof intent. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.lifecycle.design_surface` | Design authority surface. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.lifecycle.implementation_design` | Buildable module design. | **odd_glc/GTL** declaration; **ABG** admission/type satisfaction. |
| `odd_glc.type.software.source_surface` | Product source artifact. | **GTL** type declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |
| `odd_glc.type.software.test_source_surface` | Product test artifact. | **GTL** type declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |
| `odd_glc.type.software.build_config_surface` | Build/package config artifact. | **GTL** type declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |
| `odd_glc.type.software.test_execution_result` | Execution evidence result. | **ABG** process/evidence truth; **odd_glc** read label. |
| `odd_glc.type.lifecycle.evidence_binding_view` | View over ABG evidence binding. | **ABG** binding truth; **odd_glc** read label. |
| `odd_glc.type.lifecycle.assurance_fold_view` | View over ABG fold truth. | **ABG** fold truth; **odd_glc** read label. |
| `odd_glc.type.lifecycle.residual_pressure_view` | View over ABG residual truth. | **ABG** residual truth; **odd_glc** read label. |
| `odd_glc.type.lifecycle.reentry_disposition_view` | View over ABG continuation/re-entry truth. | **ABG** disposition truth; **odd_glc** read label. |
| `odd_glc.type.lifecycle.release_readiness_view` | Interpreted readiness view. | **odd_glc** interpretation over admitted ABG proof truth. |

Minimum data-mapping specializations:

| Specialized node type | Generic base | Owner and validation |
| --- | --- | --- |
| `odd_glc.type.software.mapping_spec` | `odd_glc.type.lifecycle.requirement_set` or `odd_glc.type.lifecycle.design_surface` | **GTL** specialization declaration; **ABG** type satisfaction. |
| `odd_glc.type.software.schema_source` | `odd_glc.type.software.source_surface` | **GTL** specialization declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |
| `odd_glc.type.software.mapper_source` | `odd_glc.type.software.source_surface` | **GTL** specialization declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |
| `odd_glc.type.software.mapper_validation_test` | `odd_glc.type.software.test_source_surface` | **GTL** specialization declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |
| `odd_glc.type.software.mapper_build_config` | `odd_glc.type.software.build_config_surface` | **GTL** specialization declaration; **sandbox/product** artifact; **ABG** evidence/type truth. |

Close gate: every data_mapper parity proof must list the node types it uses,
the GTL declaration refs that publish those types, and the ABG-emitted
type-satisfaction or traversal-close proof that admits the output node types.

## Data-Mapping Node-Type Implementation Record

2026-07-01: Started the data_mapper parity slice by adding reusable
software-build and data-mapping node-type declaration data to the TypeScript
tenant.

Added declaration data:

- `ODD_GLC_SOFTWARE_BUILD_NODE_TYPES`;
- `ODD_GLC_DATA_MAPPING_NODE_TYPES`;
- `ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES`.

The declaration builder now materializes lifecycle, software-build, and
data-mapping node types through the installed ABIogenesis 4.2 public GTL
facades:

- `constructNode`;
- `constructNodeTypeGraphFunction`;
- `composeNodeTypes`;
- `constructGtlLibraryEntryDeclaration`.

The reusable software-build overlay now includes data-mapping role refs for
mapping specs, schema source, mapper source, mapper validation tests, and
mapper build config. This is declaration data only. No odd_glc runtime,
selector, graph-call opener, evidence admission, fold, residual, continuation,
or F_P invocation authority was added.

`ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING` now names both the software-build/
data-mapping node-type library refs and the software-build graph-function
library refs. This prepares the ABG startup path to consume one canonical
startup config for typed software-build/data-mapping work.

2026-07-01: Added the ABG catalog reuse gate after review found that many
software-build graph functions may be reusable GTL/ABG system functions rather
than legitimate `odd_glc` product functions.

Implementation state:

- `ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS` and
  `ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS` now mark each graph-function
  entry with `catalogReuseStatus:
  "abg_4_2_no_equivalent_published"`, `genericity:
  "candidate_abg_system_function"`, and `reuseGate:
  "bind_existing_abg_catalog_entry_when_equivalent_exists"`.
- `ODD_GLC_STARTUP_BINDING` and
  `ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING` now carry
  `readiness://odd_glc/abg-4.2/catalog-reuse-audited-no-equivalent`.
- The current graph-function refs remain startup proof bindings only. They are
  not ratified as final `odd_glc` product-owned functions. They are current
  bindings with no equivalent ABI 4.2 published system-library entry found.
  Future ABG catalog publication can supersede them by binding an equivalent
  entry through the startup config.
- The data_mapper-lite live rung is recorded in the committed aggregate
  manifest as a summary proof input.

2026-07-01 cleanup: Renamed the active product/software-build
graph-function surfaces from `*_GRAPH_FUNCTION_LIBRARY` to
`*_GRAPH_FUNCTION_BINDINGS` in the TypeScript tenant, tests, and design text.
The only remaining `*_GRAPH_FUNCTION_LIBRARY` name is the historical T-180
Hello World bootstrap fixture surface. Active parity work now uses binding
vocabulary so downstream code does not mistake provisional refs for a local
`odd_glc` graph-function catalog.

Verification:

- `cd build_tenants/odd_glc/typescript && npm test` passed: 41/41 non-live
  checks, 6/6 live checks skipped by default.
- `git diff --check` passed.
- Forbidden-authority grep across `build_tenants/odd_glc/typescript/src`
  returned only the existing negative-list constants.

## Sandbox Parity Implementation Record

2026-07-01: Added `hello-world-sandbox-parity.test.mjs`.

The test creates a fresh `test_runs/hello_world_sandbox_parity/<scenario>/<run>`
workspace for each rung:

- `SCN-GLC-HELLO-WORLD-CLI-BASIC`
- `SCN-GLC-HELLO-WORLD-JS-TENANT-TEST`
- `SCN-GLC-HELLO-WORLD-RUST-CLI`
- `SCN-GLC-HELLO-WORLD-RUST-SERVICE`
- `SCN-GLC-HELLO-WORLD-PARALLEL-JS`
- `SCN-GLC-HELLO-WORLD-ABG42-STARTUP`

Each sandbox copies the pinned ABI proof artifact into `.ai-workspace/proofs/`
as read-only input, executes only the scenario subject/verifier needed for the
workspace witness, and writes `sandbox-summary.json`. The startup rung copies
the pinned ABI 4.2 T-180 startup event/log/vector artifacts and interprets
them without re-emitting registry, selection, graph-call, traversal, or
artifact truth.

Each sandbox bootstrap now records
`ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef` and
`ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef`. The T-180 bootstrap proof input
remains copied evidence; it is not the reusable overlay model.

Verification:

- `cd build_tenants/odd_glc/typescript && npm test` passed: 40/40.
- `git diff --check` passed.
- Strict call-shape grep for ABG admission, emission, selection, fold,
  residual, and F_P invocation APIs in `src/` and the sandbox test returned no
  matches.

This records sandbox parity only. Fresh ABG 4.2 typed-startup summary proof
inputs are recorded by the software-build overlay live manifest.

## GLC Software-Build Overlay Live Implementation Record

2026-07-01: Added `glc-software-build-overlay-live.test.mjs`.

The live harness creates a fresh sandbox instance for each rung, runs the
installed ABIogenesis `4.2.0-rc.1` installer into that instance, writes an ABG
runtime binding under `.abiogenesis/typescript-runtime.mjs`, and then invokes
the installed `genesis-ts start` command. The runtime binding imports
`odd_glc` declaration data:

- `ODD_GLC_SOFTWARE_BUILD_OVERLAY`;
- `ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS`;
- `ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING`.

The generated runtime binding is a proof adapter inside the sandbox instance.
It is not exported by odd_glc and is not an odd_glc runtime surface. ABG owns
startup admission, registry projection, lookup/selection, graph-call opening,
traversal, event emission, and vector closure.

The live harness materializes one reusable software-build overlay graph per
scenario using the same odd_glc overlay ref:

- `overlay://odd_glc/software-build-lifecycle`;
- `graph://odd_glc/software-build-lifecycle`;
- `graph-function://odd_glc/software-build/bootstrap-worksite`.

The graph is a minimal two-vector typed traversal:

1. lifecycle context -> lifecycle artifact;
2. lifecycle artifact -> evidence binding view.

Each vector invokes the live F_P worker through ABG plugin dispatch. The
scenario subject executes only inside the sandbox instance. The odd_glc source
package still exports no ABG admission, selection, graph-call, event, runtime,
process, or F_P invocation authority.

Committed live summary evidence:

| Scenario | Subject kind | Duration ms | Event log digest | Summary |
| --- | --- | ---: | --- | --- |
| `SCN-GLC-HELLO-WORLD-CLI-BASIC` | `node_cli` | 53393 | `sha256:c8ee056b1dc0374da7d4ff2cb90dee98e264ca085f47b49b000280b80a58206f` | ABG admitted registry entries, selected the reusable software-build graph function, opened graph calls, traversed both vectors, invoked live F_P, and executed the Node CLI sandbox subject to `Hello, world!`. |
| `SCN-GLC-HELLO-WORLD-JS-TENANT-TEST` | `node_test` | 54933 | `sha256:8bce9357b776db50481da2e94e1d34012e46bb907800102e00eee1b1bfa3a3fa` | ABG admitted registry entries, selected the reusable software-build graph function, opened graph calls, traversed both vectors, invoked live F_P, and executed the Node test sandbox subject with a passing Hello World test. |
| `SCN-GLC-HELLO-WORLD-RUST-CLI` | `rust_cli` | 22068 | `sha256:5babaf0dc9c58224aafa4931985ec29b240a5f71b7cf78433743417250d95950` | ABG admitted registry entries, selected the reusable software-build graph function, opened graph calls, traversed both vectors, invoked live F_P, and executed the Rust CLI sandbox subject to `Hello, world!`. |
| `SCN-GLC-HELLO-WORLD-RUST-SERVICE` | `rust_service` | 30168 | `sha256:387db377d2bddbba89472259aebc75176915fa5db21e64f2305e0c46bdab877e` | ABG admitted registry entries, selected the reusable software-build graph function, opened graph calls, traversed both vectors, invoked live F_P, compiled and ran a Rust TCP service, and proved an HTTP 200 `Hello, world!` response. |
| `SCN-GLC-HELLO-WORLD-PARALLEL-JS` | `parallel_js` | 77716 | `sha256:502ac0d941a555f5031acc362e54d35b8687c1a091e5b0c5e01e01ffec56beb0` | ABG admitted registry entries, selected the reusable software-build graph function, opened graph calls, traversed both vectors, invoked live F_P, executed parallel Node branch scripts, and proved fan-in `Hello, world!`. |
| `SCN-GLC-DATA-MAPPER-LITE-JS` | `data_mapper_lite_node_test` | 108373 | `sha256:6fc1e0dbbee5c426f47e7aa69e581e1bd7a8b2da6ef0c7e4d07e865e6901e4fc` | ABG admitted software-build/data-mapping node-type registry entries, selected the reusable software-build graph function, opened graph calls, traversed both vectors, invoked live F_P, and executed the data-mapper-lite Node test sandbox with three passing logical-data-model tests. |

Verification:

- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=basic-cli npm run test:live` passed.
- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=js-tenant-test npm run test:live` passed after clearing inherited `NODE_TEST_CONTEXT` in subject process spawns.
- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=rust-cli npm run test:live` passed.
- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=rust-service npm run test:live` passed.
- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=parallel-js npm run test:live` passed.
- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 npm run test:live` passed: 5/5 original live overlay Hello Worlds, duration 241922ms.
- `cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ODD_GLC_LIVE_SCENARIO=data-mapper-lite npm run test:live` reported the data-mapper live traversal as passed in 108373ms; the command still failed at that point on the stale manifest assertion, which was then fixed by committing summary evidence for all six rungs.
- `cd build_tenants/odd_glc/typescript && npm test` passed: 41/41 non-live checks, 6/6 live overlay checks skipped by default.
- `git diff --check` passed.
- Forbidden-authority grep across `build_tenants/odd_glc/typescript/src` returned no matches for ABG admission, registry projection, lookup, selection, graph-call opening, event emission, process spawn, or F_P transport calls.
