# odd_glc Product

**Status**: Active
**Date**: 2026-06-28
**Derived From**: [GOALS.md](./GOALS.md), [INTENT.md](./INTENT.md),
`.ai-workspace/context/project_bootstrap.md`,
`/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260626T011328Z_STRATEGY_requirements_algebra_edge_spans.md`

This document is the product-definition authority for `odd_glc`. It descends
from goals and intent. Requirements, scenarios, ratified design, build tenants,
code, and proof surfaces descend from this product shape.

## Product Identity

`odd_glc` is the source project for ODD General Life Cycle.

The product is a downstream ODD framework over GTL/ABG. It gives general
lifecycle meaning to admitted GTL/ABG graph, requirement, projection, evidence,
fold, residual, replay, continuation, and re-entry truth.

The product governs generic lifecycle interpretation at any scale. The same
lifecycle vocabulary can apply to a task, project, program, multi-product
portfolio, or operating domain. Lifecycles may nest and recur over ABG-owned
zoom-frame, graph-span, and foldback truth; `odd_glc` owns the lifecycle
meaning at each frame, not the recursive runtime substrate.

The product is domain-agnostic. Software delivery, world-model construction,
trading evaluation, service operation, and other governed domains may
specialize it without changing its generic lifecycle law.

`odd_glc` is not ABIogenesis core, not GTL, not ABG, not a rebuild of
`odd_sdlc`, not a runtime, not a requirement compiler, not a release cut, and
not an install.

## Constitutional Position

`odd_glc` exists to let domain products interpret ODD work as lifecycle work
without moving graph construction or runtime authority out of GTL/ABG.

GTL owns graph-native declaration law: graphs, nodes, graph vectors, graph
functions, modules, jobs, interfaces, wrappers, and asset-surface declarations.

ABG owns runtime truth: traversal, facts, event replay, payload admission,
evidence admission, requirement projection, assurance folds, residuals,
correction, continuation, and re-entry.

`odd_glc` owns lifecycle meaning over that substrate: vocabulary, stage labels,
policy overlays, read/query interpretation, proof interpretation, residual
interpretation, and downstream specialization contracts.

## Product-Owned Surfaces

`odd_glc` may define these surfaces:

- lifecycle vocabulary and stage ordering;
- lifecycle labels over admitted GTL/ABG carriers;
- policy overlays, including `F_P` semantic judgment and `F_H` human decision
  boundaries;
- read/query surfaces over admitted ABG carriers;
- lifecycle proof and residual interpretation over ABG fold and residual truth;
- downstream specialization contracts;
- GTL composition or binding declarations over GTL/ABG system functions.

These surfaces express lifecycle meaning. They do not write graph, runtime,
admission, evidence, fold, residual, continuation, replay, or re-entry truth.

## Non-Owned Surfaces

`odd_glc` shall not own or republish:

- generic graph functions or graph-function catalogs;
- GTL graph, module, interface, job, wrapper, or carrier declaration law;
- ABG runtime, actor/operator invocation, replay, admission, fold, residual,
  continuation, correction, or re-entry authority;
- a product-local requirement representation, translator, compiler, ledger, or
  closure store;
- a retry loop, process executor, runtime controller, or replay controller;
- `odd_sdlc` phase names, local ledgers, retry behavior, closure rules, or
  software-domain policy as generic lifecycle law.

## GTL/ABG Consumption Rule

A constructive function belongs in GTL/ABG when the same function is needed by
multiple ODD domains. Generic ODD construction is platform substrate, not
`odd_glc` product law.

`odd_glc` shall not publish a native `glc.*` graph-function catalog for generic
lifecycle construction. A named lifecycle route may be a GTL composition or
binding map over GTL/ABG-published system functions.

The first consumed system-function set includes requirement context routing,
requirement environment projection, requirement graph/refinement, obligation
projection, destination topology, actor/operator invocation, evidence binding,
assurance fold, assurance-case projection, residual projection, attenuation,
continuation, and re-entry.

When a required GTL/ABG capability is `missing`, `placeholder`, `test_only`,
`unwired`, `unpinned`, forgeable, or disconnected from the required runtime or
query path, the dependent lifecycle binding shall defer, block, or reprice.
`odd_glc` shall not compensate with a local compatibility ledger, wrapper,
fold, residual store, retry controller, or executor.

## Lifecycle Surface Classification

The product uses lifecycle surfaces as vocabulary, labels, queries, policies,
and downstream bindings over GTL/ABG truth.

| Surface | Product classification |
| --- | --- |
| `LifeCycleWorksiteAsset` | Lifecycle scope label over ABG run/worksite refs and GTL module/job refs where present. |
| `LifecycleContextAsset` | Query or label over ABG staged context, including `AuthorityContextFragment` and context routing. |
| `IntentAsset` | Product-authored lifecycle meaning bound to GTL/ABG refs. |
| `ProductDefinitionAsset` | Product-authored lifecycle meaning bound to requirement declaration and proof policy refs. |
| `RequirementSetAsset` | GTL requirement-declaration binding, not an odd_glc-native requirement representation. |
| `RequirementEnvironmentViewAsset` | Query or label over ABG `EdgeRequirementEnvironment`. |
| `DestinationTopologyAsset` | Query or label over ABG `DestinationTopology`. |
| `InstructionSetAsset` | Lifecycle handoff label over ABG obligation, materialization-target, and execution-schedule projections. |
| `TargetArtifactAsset` | Downstream artifact binding over GTL asset surfaces and ABG admitted artifact refs. |
| `CapabilityAsset` | Capability declaration label over GTL/ABG capability carriers and ABG actor/operator invocation. |
| `EvidenceBindingAsset` | Query or label over ABG `RequirementEvidenceBinding`. |
| `AssuranceFoldViewAsset` | Query or label over ABG `RequirementFoldProjection` and assurance-case projection. |
| `ResidualPressureViewAsset` | Query or label over ABG residual projection and attenuation classification. |
| `ReentryDecisionAsset` | Lifecycle disposition label over ABG continuation, correction, re-entry, release, or block truth plus `F_H` policy. |

A `ViewAsset` name is not authority to mint a native carrier. Native
`odd_glc` carriers are reserved for lifecycle vocabulary, policy overlays,
`F_P`/`F_H` decision surfaces, and specialization contracts that are not
generic GTL/ABG system assets.

## Downstream Program Contract

A downstream program may specialize `odd_glc` by adding domain-specific assets,
schemas, policies, evidence expectations, and semantic proof interpretation.

The downstream program must still use GTL/ABG for graph structure, graph-vector
traversal, graph functions, execution, admission, evidence, fold, residual,
continuation, replay, and re-entry truth.

A future software-delivery downstream product may use current `odd_sdlc`
workflows only as coverage-witness and deletion-target evidence. It shall not
copy or reproduce `odd_sdlc` source code, `Sdlc*` carriers, local ledgers,
phase flow, closure rules, retry behavior, or software-domain policy as
`odd_glc` law or as a required downstream implementation shape.

## Current Non-Closure

`T-001` is the active governance ticket for the first requirements and graph
design wave.

The current project has no active build tenant, runtime implementation, release
cut, install, or claimed lifecycle closure.

The first steel-thread scenario is
[SCN-GLC-HELLO-WORLD-MINIMAL](./scenarios/SCN-GLC-HELLO-WORLD-MINIMAL.md). It
forces the thread through the layers as an MVP proof vehicle. It is not the
product scope.

Ratified graph design under `build_tenants/common/design/` shall not be
accepted until boundary authority and GTL/ABG consumption requirements identify
the lawful substrate, upstream readiness state, `F_D`/`F_P`/`F_H` boundaries,
and non-closure gates for each lifecycle binding, query, or GTL composition
slot.
