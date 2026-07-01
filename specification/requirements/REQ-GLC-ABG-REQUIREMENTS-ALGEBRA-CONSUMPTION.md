# REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION - Upstream Readiness Gate

**Status**: Active
**Category**: Product Requirement / Consumption Contract
**Date**: 2026-06-28
**Derives from**: [GOALS.md](../GOALS.md), [INTENT.md](../INTENT.md),
[PRODUCT.md](../PRODUCT.md),
[T-001](../../.ai-workspace/tickets/completed/T-001-govern-minimal-odd-glc-requirements-and-graph-design.md),
[REQ-GLC-BOUNDARY-AUTHORITY](REQ-GLC-BOUNDARY-AUTHORITY.md),
`/Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENTS-ALGEBRA.md`,
`/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260626T011328Z_STRATEGY_requirements_algebra_edge_spans.md`
**Related families**:
[REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS](REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md)

---

## Purpose

Define the ABG/GTL consumption contract and upstream readiness gate for
`odd_glc` lifecycle bindings and queries that interpret admitted
requirements-algebra truth.

This family turns the bootstrap rule into requirement law: when ABG/GTL cannot
answer a lifecycle question from real admitted carriers and wired runtime
paths, `odd_glc` shall mark the dependency missing or defer the affected
function. It shall not compensate with a product-local peer ledger, compiler,
fold, residual, retry, or re-entry controller.

## Upstream Readiness States

`odd_glc` classifies each consumed upstream capability before ratifying a
dependent lifecycle binding or GTL composition declaration.

| State | Meaning | Closure effect |
| --- | --- | --- |
| `ready` | Capability is present, release-pinned or otherwise explicitly admitted, callable from the expected runtime path, and proven by non-forgeable evidence. | Dependent binding may ratify if its local requirements are satisfied. |
| `missing` | Capability is not present in the consumed GTL/ABG substrate. | Dependent binding shall defer or block. |
| `placeholder` | Capability exists as a stub, partial carrier, compatibility alias, or prose claim without real runtime behavior. | Dependent binding shall not ratify or close. |
| `test_only` | Capability is exercised only by tests or test-only proof inputs and has no non-test runtime caller or public path. | Dependent binding shall not ratify or close. |
| `unwired` | Capability exists but is not connected to the required runtime, replay, admission, fold, residual, continuation, or query path. | Dependent binding shall not ratify or close. |
| `unpinned` | Capability source or release snapshot is not identified enough for repeatable consumption. | Dependent binding shall not ratify or close. |

## Genericity Rule

A constructive function is a GTL/ABG system function when the same function is
needed by multiple ODD domains, such as software delivery, world modeling, and
trading evaluation. Generic ODD construction belongs upstream. `odd_glc` shall
not republish a generic GTL/ABG system function under a `glc.*` name.

`odd_glc` may define lifecycle vocabulary, labels, policy overlays, F_P/F_H
surfaces, read/query interpretation, specialization contracts, and GTL
composition declarations over GTL/ABG system functions. It shall not define a
native graph-function catalog for generic lifecycle construction.

## Bound System Functions And Carriers

The first review target binds lifecycle slots to GTL/ABG system functions and
carriers. These bindings are consumption declarations, not native odd_glc
graph functions.

| Lifecycle slot | GTL/ABG system function or carrier | Existing or expected ABI surface | Non-closure examples |
| --- | --- | --- | --- |
| context observation and gap routing | `abg.requirements.ingest_context_fragments` / `abg.requirements.route_context_constraint` | `routeContextConstraint` | odd_glc admits or routes staged context locally. |
| requirement authoring | GTL requirement-declaration carrier or wrapper preserving requirement identity, relations, spans, context refs, evidence-policy refs, and projection refs for ABG admission | GTL declaration and ABG admission surfaces | `RequirementSetAsset` holds an odd_glc-native structure that must later be translated into ABG terms. |
| requirement environment projection | `abg.requirements.compile_edge_environment` | `buildEdgeRequirementEnvironment` | Span matching is substring-based, narrowing-only, test-only, or not wired to runtime query. |
| requirement graph/refinement | `abg.requirements.derive_requirement_graph` / `abg.requirements.refine_goal` | T-162 requirement carriers | odd_glc decomposes WHAT through a native constructive function. |
| edge obligations and work pressure | `abg.requirements.project_edge_obligations` | `projectRequirements`, `projectMaterializationTargets`, `projectExecutionSchedules` | odd_glc constructs local obligation, materialization, or schedule ledgers. |
| destination topology | ABG `DestinationTopology` carrier | ABG destination-topology carrier | Destination topology silently rewrites active requirement meaning or becomes an odd_glc carrier. |
| side-effecting capability and execution | GTL/ABG capability carrier plus ABG-owned actor/operator invocation | ABG actor/operator and payload admission surfaces | odd_glc shells out, supervises, retries, or treats a local command contract as runtime truth. |
| evidence binding | `abg.requirements.bind_evidence` | `bindRequirementEvidence` | Evidence is inferred from local files, stdout text, path shape, or test harness assertions without ABG admission. |
| assurance fold and assurance case | `abg.requirements.fold_requirement_state` / `abg.requirements.project_assurance_case` | `foldRequirementEvidence`, `projectAssuranceCase` | Fold state is forgeable, substring-derived, test-only, or not callable from a runtime path. |
| residual and attenuation | residual output of `abg.requirements.fold_requirement_state` plus attenuation classification | `residualizeRequirementFolds`, `classifyRequirementAttenuation` | Residuals are represented by local compatibility wrappers or narrowing-only placeholders. |
| re-entry disposition | ABG continuation, correction, re-entry, release, or block facts tied to runtime/replay truth | ABG continuation and re-entry truth | odd_glc decides retry, continuation, or re-entry through a local controller or checklist. |

## Acceptance Criteria

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-001**: `odd_glc` shall classify every consumed GTL/ABG requirements-algebra capability as `ready`, `missing`, `placeholder`, `test_only`, `unwired`, or `unpinned` before ratifying a dependent lifecycle binding, query, or GTL composition declaration.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-002**: A dependent lifecycle binding, query, or GTL composition declaration shall not ratify or close when any required upstream capability is classified as `missing`, `placeholder`, `test_only`, `unwired`, or `unpinned`.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-003**: `ready` status shall require real admitted carrier truth, a callable runtime or query path where applicable, non-forgeable evidence, and a pinned consumed source or release identity.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-004**: `RequirementSetAsset` shall bind to GTL requirement-declaration carriers or wrappers. `odd_glc` shall not author requirements in a local representation that later compiles, mirrors, or translates into ABG requirement terms.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-005**: `RequirementEnvironmentViewAsset` shall be a query or label over ABG `EdgeRequirementEnvironment` and admitted requirement, span, context, prior fold, and residual projections. It shall not be reconstructed from sibling product ledgers, local scans, comments, generated inventories, or an odd_glc-native carrier.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-006**: Requirement-environment interpretation shall defer when ABG cannot identify active requirements, traversal spans, staged context, prior fold projections, and carried residual pressure for the selected graph vector.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-007**: Capability and evidence interpretation shall consume ABG-owned actor/operator invocation and payload/evidence admission for side-effecting proof. `odd_glc` shall not execute, retry, supervise, admit, or fold the Hello World program run as local authority.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-008**: `EvidenceBindingAsset` shall distinguish artifact projection, execution projection, output projection, and semantic interpretation projection. One evidence kind shall not close another by path, command success, or pass status alone.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-009**: Assurance-fold interpretation shall defer when ABG fold truth is placeholder, forgeable, test-only, not tied to admitted evidence, or not wired to the consumed runtime/replay path.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-010**: Residual-pressure interpretation shall defer when ABG residual truth cannot preserve remaining span, pressure class, owner surface, evidence refs, source fold refs, and attenuation class.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-011**: Re-entry interpretation shall defer when ABG continuation, correction, re-entry, release, or block facts are missing, placeholder, test-only, unwired, or unpinned.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-012**: If an upstream capability is not ready, `odd_glc` shall record the affected lifecycle slot and missing substrate as deferred work or blocked pressure. It shall not add compatibility ledgers, alternate folds, local residual stores, retry controllers, or execution wrappers to make the slot appear closed.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-013**: Ratified graph design shall list the consumed upstream capability and readiness state for every lifecycle binding, query, or GTL composition slot that depends on GTL/ABG requirements algebra, evidence admission, assurance fold, residual, continuation, or re-entry truth.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-014**: The Hello World slice shall close only when the consumed upstream capabilities for requirement declaration, requirement environment projection, ABG-owned execution/admission, evidence binding, assurance fold, residual projection, and re-entry disposition are all `ready` or the graph design explicitly scopes a non-closeable deferred slot.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-015**: `odd_glc` shall not publish a native `glc.*` graph-function catalog for generic ODD lifecycle construction. Any named general lifecycle route shall be a GTL composition declaration over GTL/ABG system functions or a binding map to those functions.

**REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION-016**: A lifecycle view surface shall be a query, label, or policy interpretation over an admitted GTL/ABG carrier unless a requirement proves that no GTL/ABG carrier exists. Native odd_glc carriers shall be reserved for vocabulary, policy overlays, F_P/F_H decision surfaces, and specialization contracts that are not generic GTL/ABG system assets.
