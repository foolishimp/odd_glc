# odd_glc Product

**Status**: Active
**Date**: 2026-06-27
**Derived From**: [GOALS.md](./GOALS.md), [INTENT.md](./INTENT.md),
`.ai-workspace/context/project_bootstrap.md`

## Product Position

`odd_glc` is the source project for ODD General Life Cycle.

It defines a downstream ODD framework over GTL/ABG. The framework interprets
admitted graph, requirement, projection, evidence, fold, residual, replay, and
re-entry truth as a general lifecycle model that domain products can
specialize.

This mutable workspace is the source project. It is not the released product,
not a release cut, and not an install.

## Product Terms

`LifeCycleWorksite` is the bounded context where one lifecycle traversal is
being interpreted.

`LifeCycleStage` is a named lifecycle state or responsibility layer, such as
gap, problem, solution space, intent, product definition, requirements, HOW
topology, instruction set, assurance, release, or operational feedback.

`LifeCycleGraphFunction` is a product-owned graph function that gives lifecycle
meaning to one admissible transition while ABG owns traversal control.

`RequirementEnvironmentView` is an `odd_glc` read model over ABG/GTL active
requirements, spans, contexts, projections, evidence, folds, and residuals.

`ResidualPressureView` is an `odd_glc` read model over admitted ABG residual
truth and lifecycle interpretation.

`ReentryDecision` is a lifecycle interpretation of an ABG-owned continuation,
correction, re-entry, repricing, release, or block outcome.

`DomainSpecialization` is a product-specific binding over `odd_glc` lifecycle
functions for a concrete product family.

## Goal Model

Goals focus the current body of work. They do not replace product definition.

For the first wave, the goal is to establish the source project and bootstrap
context without claiming implementation closure. Later goals will price the
first requirement families, ratified design, build tenant, and release cut.

## Product End State

The intended product is a releaseable ODD framework that provides:

- a lifecycle asset model;
- a graph-function catalog for general lifecycle construction;
- GTL declarations or wrappers for those graph functions;
- ABG-compatible projection/query surfaces;
- proof surfaces for lifecycle closure and residual pressure;
- downstream specialization contracts;
- release and operational-feedback interpretation over admitted runtime truth.

## Current Product Definition

The current product definition is the initial source project and constitutional
capture for `odd_glc`.

The current project has no build tenant and no runtime implementation. It
defines the initial bootstrap, goals, intent, product position, and
requirement-authoring boundary required before realization work begins.
