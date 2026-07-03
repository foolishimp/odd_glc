# odd_glc ABIogenesis 4.2 Typed Startup Binding

**Status**: Active
**Scope**: Common design
**Derives from**:
[PRODUCT.md](../../../specification/PRODUCT.md),
[GOALS.md](../../../specification/GOALS.md),
`.ai-workspace/tickets/completed/T-022-define-typed-lifecycle-node-model.md`,
`.ai-workspace/tickets/completed/T-023-bind-overlays-and-library-entries-to-abg-startup.md`,
`.ai-workspace/tickets/completed/T-024-prove-glc-hello-world-over-abg-4-2-startup.md`

## Position

ABIogenesis 4.2 changes the odd_glc parity path from proof-input replay
consumption to canonical startup consumption.

This design is also an ABIogenesis 4.2 substrate acceptance probe. If the
selected odd_sdlc witness traversal cannot be expressed and run through GTL/ABG
startup, registry, graph-call, traversal, evidence, and replay truth, the
substrate is incomplete for that parity target. odd_glc may record and
interpret the gap, but it shall not fill it with a product-local shell,
selector, event emitter, or traversal controller.

`odd_glc` supplies GTL declaration data:

- lifecycle node types;
- composed lifecycle node types;
- product-library graph-function entries;
- reusable software-build GTL overlay graph refs;
- reusable software-build graph-function bindings, preferring ABG catalog
  entries whenever generic equivalents exist;
- lifecycle program overlay graph refs;
- data-only `F_P` and `F_H` policy refs;
- plugin refs;
- readiness and proof refs;
- startup config.

ABG owns:

- startup admission;
- runtime registry projection;
- lookup;
- selection;
- graph-call opening;
- invocation gating;
- traversal;
- event emission;
- evidence admission;
- requirement fold and residual;
- continuation, correction, and re-entry.

No odd_glc startup shell is lawful. The canonical startup path is ABG reading
GTL declarations and product startup config.

## Lifecycle Node Types

The TypeScript tenant publishes `ODD_GLC_LIFECYCLE_NODE_TYPES` as declaration
data. The generic set covers every surface in
`REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS` / `REQUIRED_ROUTE_ONE_SURFACES`; any
supplemental type, such as release-readiness interpretation, is additional and
does not replace the minimum surface set. Each entry has:

| Field | Meaning |
| --- | --- |
| `typeRef` | Stable GTL node type ref. |
| `nodeName` | Human-readable node name. |
| `surface` | odd_glc lifecycle surface the type labels. |
| `schemaRef` | odd_glc semantic schema identity. |
| `assetKind` | Lifecycle asset role. |
| `markov` | Required state markers. |
| `tags` | Discovery and grouping tags. |

The implementation materializes those entries through ABIogenesis 4.2 public
GTL constructors:

- `constructNode`;
- `constructNodeTypeGraphFunction`;
- `composeNodeTypes`.

The materialized GTL node uses one generic lifecycle asset carrier shape with
per-type contracts. This is deliberate: ABI 4.2 type composition requires
compatible schema and asset-surface kind, while odd_glc lifecycle meaning lives
in `typeRef`, contracts, overlays, and read-model interpretation.

Node-type library declarations bind to the appropriate GTL overlay graph and
role refs for the same lifecycle surface. They shall not collapse into local
`surface.*` or `view.*` mapping refs.

## Software-Build And Data-Mapping Node Types

`ODD_GLC_SOFTWARE_BUILD_NODE_TYPES` extends the generic lifecycle type library
with SDLC-like software-build roles needed by the reusable overlay graph:

| Type | Meaning |
| --- | --- |
| `odd_glc.type.lifecycle.scenario_surface` | Scenario/proof-intent surface. |
| `odd_glc.type.lifecycle.design_surface` | Design authority surface. |
| `odd_glc.type.lifecycle.implementation_design` | Buildable implementation design. |
| `odd_glc.type.software.source_surface` | Product source artifact surface. |
| `odd_glc.type.software.test_design_surface` | Product test design surface. |
| `odd_glc.type.software.test_source_surface` | Product test source surface. |
| `odd_glc.type.software.component_test_source_surface` | Specialized component test source surface. |
| `odd_glc.type.software.uat_test_source_surface` | Specialized UAT or validation test source surface. |
| `odd_glc.type.software.build_config_surface` | Build/package configuration surface. |
| `odd_glc.type.software.test_execution_plan` | Test execution preparation surface. |
| `odd_glc.type.software.test_execution_result` | Test execution evidence result surface. |

`ODD_GLC_DATA_MAPPING_NODE_TYPES` adds data_mapper witness specializations:

| Type | Base role |
| --- | --- |
| `odd_glc.type.software.mapping_spec` | Requirement/design pressure for mapping. |
| `odd_glc.type.software.schema_source` | Specialized software source artifact. |
| `odd_glc.type.software.mapper_source` | Specialized software source artifact. |
| `odd_glc.type.software.mapper_validation_test` | Specialized software test source artifact. |
| `odd_glc.type.software.mapper_build_config` | Specialized build config artifact. |

`ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES` composes those specialized types
into `odd_glc.type.software.data_mapping_implementation_bundle`.

These are GTL node-type declarations. They are not callable graph functions,
not odd_glc-native carriers, and not local type-checking authority. ABG owns
node-type admission, registry projection, type satisfaction, and
traversal-close validation.

## Composed Node Types

`ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES` defines reusable bundles:

| Type | Constituents | Meaning |
| --- | --- | --- |
| `odd_glc.type.lifecycle_definition_bundle` | worksite, intent, product definition, requirement set | Minimum lifecycle definition pressure. |
| `odd_glc.type.lifecycle_assurance_bundle` | evidence binding, assurance state, residual pressure, disposition | Read-only assurance and residual interpretation bundle. |
| `odd_glc.type.lifecycle_release_bundle` | artifact, capability, release readiness | Release-readiness interpretation bundle without release authority. |

Composed types are still node types. They are not callable graph functions and
shall not be selected for traversal.

## Product Graph-Function Bindings

`ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS` declares four product startup
bindings:

| Entry | Role | Boundary |
| --- | --- | --- |
| `observe-lifecycle-context` | Bootstrap context-to-definition binding. | Declaration only; ABG selects/runs. |
| `bind-requirement-pressure` | Bootstrap definition-to-requirement binding. | Declaration only; ABG admits requirement truth. |
| `project-release-readiness` | Deployment assurance-to-readiness interpretation. | No release authority claimed. |
| `observe-operational-feedback` | Deployment feedback-to-pressure interpretation. | Operational feedback remains read/interpret until a later proof. |

These entries are GTL library-entry declarations and current startup bindings.
They are not a local runtime catalog and do not grant selection authority. Each
entry remains subject to the ABG-catalog reuse gate: if an equivalent generic
GTL/ABG system-library graph function exists, the product binding shall reuse
that catalog entry instead of ratifying a duplicate `odd_glc` function.

## Reusable Software-Build Overlay

`ODD_GLC_SOFTWARE_BUILD_OVERLAY` is the reusable SDLC-like GTL overlay graph
for odd_glc software-build lifecycle work. It is not a Hello World scenario
artifact and is not a local lifecycle map.

It declares:

| Field | Meaning |
| --- | --- |
| `overlayRef` | GTL overlay identity consumed by ABG startup and registry selection. |
| `graphRef` | GTL graph identity for the reusable software-build lifecycle graph. |
| `graphFunctionRefs` | Callable graph-function refs bound by the overlay. These are ABG catalog bindings first; product-owned refs require an explicit reuse audit before use. |
| `graphVectorRefs` | GTL graph-vector identities used by the overlay graph. |
| `publicStartTargets` | Callable graph-function refs that ABG may start through public startup. |
| `defaultStartTarget` | Default callable graph-function ref for bootstrap traversal. |
| `roleRefs` | Software-build proof roles supplied as specialization data. |

The overlay graph names software-build roles that downstream products and
plugins can bind to GTL/ABG truth:

| Role group | Role refs |
| --- | --- |
| Artifacts | `software-build.role.source_artifact`, `software-build.role.generated_artifact`, `software-build.role.release_candidate` |
| Execution | `software-build.role.build_command`, `software-build.role.test_execution_plan`, `software-build.role.test_execution`, `software-build.role.service_process`, `software-build.role.client_request` |
| Design and scenario | `software-build.role.scenario_surface`, `software-build.role.design_surface`, `software-build.role.implementation_design` |
| Tests | `software-build.role.test_design`, `software-build.role.test_source`, `software-build.role.mapper_validation_test` |
| Data mapping | `software-build.role.mapping_spec`, `software-build.role.schema_source`, `software-build.role.mapper_source`, `software-build.role.mapper_build_config` |
| Parallel work | `software-build.role.parallel_branch`, `software-build.role.branch_fan_in` |

The overlay graph forbids product-local runtime shells, graph-function selection,
graph-call opening, event emission, evidence admission, requirement fold or
residual projection, and continuation or re-entry routing.

`ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS` currently declares five
software-build startup bindings. The ABI 4.2 reuse audit found no matching
published ABI system-library entry for these refs. They remain candidate system
functions: a later ABI publication of an equivalent generic carrier shall
replace the product ref instead of preserving a duplicate `odd_glc` function.

Audit basis: ABIogenesis 4.2.0-rc.4 source, GTL runtime-registry declarations,
and installed proof surfaces were searched for equivalent published entries for
bootstrap-worksite, materialize-artifact, prove-artifact, fan-in-branches, and
sdlc-software-build.
Only sandbox/proof-local odd_glc refs were found; no ABI system-library entry
was available to bind.

| Entry | Role | Boundary |
| --- | --- | --- |
| `software-build/bootstrap-worksite` | Bind lifecycle context to requirement pressure. | Candidate ABG system function; bind to ABG catalog if equivalent exists. |
| `software-build/materialize-artifact` | Move requirement pressure toward a lifecycle artifact. | Candidate ABG system function; ABG owns materialization, execution, and artifact truth. |
| `software-build/prove-artifact` | Bind artifact proof/evidence. | Candidate ABG system function; ABG owns evidence admission and proof truth. |
| `software-build/fan-in-branches` | Interpret branch outputs into a lifecycle artifact. | Candidate ABG system function; ABG owns branch/frontier/fan-in truth. |
| `software-build/sdlc-software-build` | Traverse the reusable SDLC software-build stage plan through conformance, implementation design, source, test design, component test source, UAT test source, execution preparation, and execution result. | Candidate ABG system function; ABG owns graph selection, traversal, F_P dispatch, sandbox execution evidence, runtime events, and vector closure. |

Close rule: no software-build graph-function ref may be treated as permanent
`odd_glc` product law unless it remains classified as one of:

1. bound existing ABG system-library catalog entry;
2. upstream ABG system-library gap to open or track;
3. product-specific specialization with explicit refinement or override law.

`ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING` is the reusable startup binding for
this overlay graph. It is the pattern that the Hello World ladder should use
when it is replayed as fresh ABI 4.2 typed-startup proof.

The reusable software-build startup binding names both:

- software-build/data-mapping node-type library refs;
- software-build graph-function binding refs.

This lets ABG startup admit the callable graph functions and the typed-node
vocabulary through one canonical startup config. odd_glc still does not admit,
project, select, or invoke those entries. When ABG provides a generic catalog
entry for the same constructive carrier, the startup binding shall point at that
entry rather than preserving an `odd_glc` duplicate.

## Startup Shape

Startup data is represented by `ODD_GLC_STARTUP_BINDING`:

| Field | Use |
| --- | --- |
| `configRef` | Stable odd_glc startup config ref. |
| `productNamespace` | `odd_glc`. |
| `enabledLibraryRefs` | Product library groups to admit. |
| `overlayRefs` | GTL overlay graph refs consumed by ABG startup and registry truth. |
| `pluginRefs` | Downstream specialization seam refs. |
| `readinessRefs` | Source readiness claims. |
| `proofRefs` | Proof references. |
| `policyRefs` | Data-only policy refs. |

ABG consumes this config at startup. odd_glc does not open graph calls or
select candidates.

## Hello World Bootstrap Startup Binding

The current Hello World bootstrap proof uses explicit odd_glc startup
declaration bindings. The TypeScript tenant publishes this as:

- `ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS`;
- `ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS`;
- `ODD_GLC_HELLO_WORLD_BOOTSTRAP_STARTUP_BINDING`.

The committed proof is valid only when ABG emits `registry_entry_admitted`
events for those exact odd_glc declaration refs and later emits
`graph_function_selected` for the declared graph-function binding before opening
a graph call. A generic ABI GLC bootstrap artifact with different product refs
is not sufficient proof for this tenant.

The reusable software-build startup binding remains the current model for new
Hello World ladder proofs unless a ticket explicitly prices a different
specialization.

## Proof Surface

The TypeScript tenant proves this design by:

- constructing lifecycle node types through installed ABI 4.2 public GTL
  constructors;
- composing lifecycle node-type bundles through ABI 4.2 type composition;
- constructing product registry startup config through public GTL registry
  declarations;
- rejecting missing declaration facades;
- proving odd_glc exports no ABG startup/runtime authority.

Current SDLC Hello World proofs shall select
`graph-function://odd_glc/software-build/sdlc-software-build` through ABG
startup and registry truth. The SDLC graph function closes the JavaScript
full-live witness stage shape as eight ABG-emitted graph-call/vector stages:
conformance project, implementation design, source, test design, component test
source, UAT test source, test execution plan, and test execution result.

Earlier `framework-smoke-min-fp` and `sdlc-js-full-live` scenario-specific
graph-function refs are superseded and cannot close this design. They are stage
feasibility evidence only. A current proof must select the reusable SDLC graph
function above.

Current committed canonical proof input inherited from the RC3 release record:
`abiogenesis-canonical-hello-world-full-stack-live/20260702T191230832Z_pid95807`.
That artifact is ABG-owned startup, registry, graph-call, traversal, F_P
dispatch, event emission, and replay truth over `@abiogenesis/typescript-tenant`
`4.2.0-rc.3`, and is carried forward as an inherited proof in the
`4.2.0-rc.4` release record. It is consumed read-only by this tenant. Full
SDLC witness-shape closure remains governed by `T-025`; it shall not be closed
by relabeling an older software-build run or by replaying a local mapping
surface.

## Non-Closure

This design is not closeable if:

- odd_glc emits runtime events;
- odd_glc admits registry entries;
- odd_glc performs lookup or selection;
- odd_glc opens graph calls;
- odd_glc invokes actors or F_P workers;
- odd_glc claims node-type entries are callable traversal functions;
- odd_glc treats product plugin advice as selection truth;
- odd_glc imports odd_sdlc code, `Sdlc*` carriers, local phase-flow
  controllers, local ledgers, retry behavior, closure rules, or
  software-domain policy;
- a parity proof compresses a selected multi-stage odd_sdlc witness into a
  two-vector materialize/prove smoke and claims equivalent graph-traversal
  coverage;
- an ABI/GTL substrate gap is patched in odd_glc instead of being recorded as
  an upstream blocker.
