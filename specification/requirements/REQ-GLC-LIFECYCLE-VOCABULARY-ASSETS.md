# REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS - Generic Lifecycle Surface Model

**Status**: Active
**Category**: Product Requirement / Asset Model
**Date**: 2026-06-28
**Re-entry**: [T-043 D1-D3](../../.ai-workspace/tickets/active/T-043-deliver-generic-live-llm-scenario-mvp.md#current-delivery-plan)
**Derives from**: [GOALS.md](../GOALS.md), [INTENT.md](../INTENT.md),
[PRODUCT.md](../PRODUCT.md),
[T-001](../../.ai-workspace/tickets/completed/T-001-govern-minimal-odd-glc-requirements-and-graph-design.md),
`/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260626T011328Z_STRATEGY_requirements_algebra_edge_spans.md`
**Boundary reference**:
`/Users/jim/src/apps/odd_sdlc/specification/PRODUCT.md`
**Related families**:
[REQ-GLC-BOUNDARY-AUTHORITY](REQ-GLC-BOUNDARY-AUTHORITY.md),
[REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION](REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md)

---

## Purpose

Define the generic lifecycle surface vocabulary required for `odd_glc` to
interpret governed work at any scale.

The Hello World binding below illustrates the minimum surface roles. A selected
full-input lifecycle also derives Intent/Product, Requirements and Design
before construction, and preserves its obligations through evidence and
revision. The scenario is a proof vehicle, not the generic Product scope.

This family keeps `odd_glc` minimal. It imports the useful asset distinction
from the current `odd_sdlc` product surface, but it does not import SDLC phase
flow, software-domain policy, local ledgers, retry loops, release/deployment
law, or product-local runtime truth.

## Scope

This requirement covers generic lifecycle surfaces and their minimum closure
meaning. The same surface model shall apply to a task, project, program,
multi-product portfolio, or operating domain. Some surfaces are native
odd_glc vocabulary or policy labels. Others are query labels over admitted
GTL/ABG carriers. A `ViewAsset` name is not a license to mint a native carrier.

- GTL owns graph, node, graph-vector, graph-function, module, job, interface,
  and asset-surface declaration law.
- ABG owns traversal, runtime facts, event replay, payload admission,
  requirement projection, evidence admission, assurance fold, continuation,
  residual, and re-entry truth.
- `odd_glc` owns lifecycle meaning, vocabulary, read-model interpretation,
  proof interpretation, and downstream specialization contracts.

This requirement does not define a build tenant, CLI, worker, second runtime,
requirement compiler, writable ledger, retry controller, full SDLC route,
release snapshot, deployment lane, or operational-return loop.

## Generic Lifecycle Surface Set

The generic `odd_glc` lifecycle model starts with these surfaces:

| Surface | Classification | GTL/ABG binding | Illustrative Hello World binding |
| --- | --- | --- | --- |
| `LifeCycleWorksiteAsset` | odd_glc lifecycle scope label. | ABG run/worksite refs and GTL module/job refs where present. | One worksite label for the first steel-thread trace. |
| `LifecycleContextAsset` | Query/label over staged context. | ABG `AuthorityContextFragment` and `routeContextConstraint`. | Request to produce an inspectable greeting program with executable proof. |
| `IntentAsset` | Product-authored lifecycle meaning. | GTL/ABG refs used by requirement declaration and staged context. | A program exists and emits the declared greeting when run. |
| `ProductDefinitionAsset` | Product-authored lifecycle meaning. | GTL/ABG refs used by requirement declaration and proof policy. | Observable behavior and accepted evidence shape for the target program. |
| `RequirementSetAsset` | GTL declaration binding, not odd_glc-native requirements. | GTL requirement declarations or wrappers consumed through ABG requirements algebra. | Requirements for declared greeting output, executable target, and evidence binding. |
| `RequirementEnvironmentViewAsset` | Query/label over ABG carrier. | ABG `EdgeRequirementEnvironment` from `buildEdgeRequirementEnvironment`. | Active requirement environment for the construction edge. |
| `DestinationTopologyAsset` | Query/label over ABG carrier. | ABG `DestinationTopology`. | Minimal source/artifact topology and one execution path. |
| `InstructionSetAsset` | Query/label over ABG projections plus lifecycle policy. | ABG requirement obligation, materialization-target, and execution-schedule projections. | Instructions to materialize the target artifact under active requirements. |
| `TargetArtifactAsset` | Downstream artifact binding. | GTL asset surface and ABG admitted artifact refs. | Greeting program source or runnable artifact as a domain specialization binding. |
| `CapabilityAsset` | Capability declaration label. | GTL/ABG capability carrier plus ABG actor/operator invocation. | Runtime or command contract used by ABG to run the target artifact. |
| `EvidenceBindingAsset` | Query/label over ABG carrier. | ABG `RequirementEvidenceBinding` from `bindRequirementEvidence`. | ABG-admitted command, exit status, stdout/stderr, artifact ref, and digest sufficient for fold interpretation. |
| `AssuranceFoldViewAsset` | Query/label over ABG carrier. | ABG `RequirementFoldProjection` and assurance-case projection. | Pass, partial, failed, or blocked closure view for the steel-thread requirements. |
| `ResidualPressureViewAsset` | Query/label over ABG carrier. | ABG `RequirementResidualProjection` and attenuation classification. | Remaining pressure if output, executable proof, or evidence binding is incomplete. |
| `ReentryDecisionAsset` | Lifecycle disposition label over ABG truth plus F_H policy. | ABG continuation, correction, re-entry, release, or block facts. | Route to release/readiness, repair, reprice, or block for the trace. |

The generic minimum surface model does not make separate test-suite, backlog,
release snapshot, deployment, runtime-return, incident, maintenance, or SDLC
phase assets mandatory. Later requirements or downstream products may add those
assets by specialization when the lifecycle scope requires them.

The Design stage binds `DestinationTopologyAsset` and admitted design-choice
and evidence-policy references. The stage names identify lifecycle meaning,
not new native carriers or functions. The application `ProductDefinitionAsset`
and imported specification describe the governed subject; neither replaces the
builder Product Definition or registers a scenario as another odd_glc Product.

## Acceptance Criteria

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-001**: `odd_glc` shall define lifecycle assets as typed product-meaning surfaces over GTL/ABG carriers, not as an imperative phase flow or controller state machine.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-002**: Every lifecycle asset type shall preserve stable identity, semantic type, provenance, and current convergence context.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-003**: The first steel-thread scenario shall instantiate only the surfaces listed in the Generic Lifecycle Surface Set unless a later requirement explicitly reprices that steel thread.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-004**: `LifecycleContextAsset` shall be a lifecycle query or label over ABG staged context fragments. Those fragments shall not become closeable requirements unless admitted as requirement pressure.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-005**: `RequirementSetAsset` shall contain product-authored WHAT pressure by binding GTL requirement-declaration carriers or wrappers consumed through ABG requirements algebra. It shall not become a product-local requirement representation, ledger, translator, or compiler.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-006**: `RequirementEnvironmentViewAsset` shall be a query or label over ABG `EdgeRequirementEnvironment` and admitted active requirements, spans, staged context, prior fold projections, and residual pressure. It shall not write requirement truth or become a native odd_glc carrier.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-007**: `DestinationTopologyAsset` shall label or reference ABG `DestinationTopology` for the selected traversal without silently rewriting the active WHAT pressure or minting a parallel topology carrier.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-008**: `InstructionSetAsset` shall carry a bounded construction handoff for one GTL/ABG graph-function traversal. It shall not become a hidden operator checklist or product-local execution loop.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-009**: `TargetArtifactAsset` shall be generic lifecycle vocabulary. The fact that the first binding is a Hello World program shall remain domain specialization data, not generic odd_glc software policy.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-010**: A side-effecting proof edge shall require a `CapabilityAsset` before executable evidence may close the target requirement pressure, and the side effect shall be invoked and admitted by ABG rather than by `odd_glc`.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-011**: `EvidenceBindingAsset` shall be a query or label over ABG `RequirementEvidenceBinding` and ABG-admitted evidence refs to active requirement projections. Path shape, local files, command success, or stdout alone shall not close the requirement outside ABG admission and fold truth.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-012**: `AssuranceFoldViewAsset` shall be a query or label over ABG assurance fold projection for lifecycle meaning. It shall not introduce a second closure enum, writable fold ledger, or native fold carrier.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-013**: `ResidualPressureViewAsset` shall be a query or label over ABG residual truth and shall not route retries, continuations, or re-entry as product-local runtime authority.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-014**: `ReentryDecisionAsset` shall interpret ABG-owned continuation, correction, re-entry, release, or block facts as lifecycle disposition. It shall not create a second controller.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-015**: A steel-thread trace shall be closeable only when ABG-admitted evidence proves the declared target behavior for the admitted target artifact under the active requirement projection and capability contract.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-016**: Future downstream specialization may add domain-specific asset roles, evidence expectations, and policy bindings, but those additions shall not replace or duplicate the minimum `odd_glc` lifecycle asset truth. `odd_glc` shall not author software-domain requirement, design, source, test, build, release, deployment, or runtime-return semantics as generic lifecycle law.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-017**: `odd_glc` shall not mint a native carrier when the same role is already carried by GTL/ABG. A proposed native carrier requires requirement evidence that no GTL/ABG carrier exists and that the surface is not a generic ODD system asset.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-018**: A full-input lifecycle shall bind
the complete owner-selected source set, member identities and digests, source
roles and governing authority. It shall preserve normative, supporting,
speculative and conflicting material as such. A file inventory is source
integrity evidence, not proof that all semantic obligations were derived.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-019**: The lifecycle declaration shall
carry admitted predecessor and source references through Intent/Product,
Requirements, Design, construction and evidence. Each derivation shall retain
applicable obligations and expose new, unresolved or conflicting pressure.
Selection of a bounded target shall not erase unimplemented obligations or
silently substitute a weaker fixture, summary or module contract.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-020**: Realization and proof shall bind
the same admitted source obligation and its current requirement/design basis.
Realization evidence, verifier artifacts, verifier execution and semantic
assessment shall retain distinct roles. A passing verifier for a weaker
contract shall not close the stronger source obligation.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-021**: Lifecycle interpretation shall
distinguish computations over admitted identities, roles, freshness and declared
coverage (C), admitted agent judgments of faithfulness and sufficiency (J), and
owner scope and acceptance rulings (O). These are evaluation roles, not a new
carrier catalog. No C check shall infer semantic completeness from counts; no
J result shall mint admission or scope authority; no proposed scope change
shall take effect without its permitted owner ruling.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-022**: A failed verifier or changed
requirement shall preserve the prior result and route affected work to its
owning lifecycle stage through admitted ABG re-entry. Interpretation shall
distinguish stale affected evidence from reusable unaffected evidence, retain
pending obligations, and support reconstruction of that distinction from
persisted truth. Resetting an instance shall not stand in for this revision.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-023**: A bounded lifecycle result shall
name its exact completed claims and remaining source obligations. Full
application completion shall require all mandatory selected-source outcomes
and constraints to be satisfied, or explicitly repriced by their permitted
owner. Test counts, file counts, module names and prior bounded acceptance
shall not close remaining application or release claims.

**REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS-024**: Full-input lifecycle order,
dependencies, evidence gates and re-entry shall be declared as one reusable
GTL composition consumed by ABG. A host caller that invokes construction and
execution alone shall not establish the upstream lifecycle stages; adding
host-side stage invocation or a local requirement/proof ledger is prohibited.
