# odd_glc Project Bootstrap

**Status**: Initial context capture
**Date**: 2026-06-27
**Project Slug**: `odd_glc`
**Expansion**: ODD General Life Cycle
**Source Strategy**:
`/Users/jim/src/apps/abiogenesis/.ai-workspace/comments/codex/20260626T011328Z_STRATEGY_requirements_algebra_edge_spans.md`

This document is the initial capture of the project context. It is the starting
context for the source project, not a release cut and not an installed product.
When a claim here becomes durable product law, ratify it in `specification/`.

## Origin

`odd_glc` is created from the ABIogenesis requirements-algebra strategy
`20260626T011328Z_STRATEGY_requirements_algebra_edge_spans.md`, which
identified a missing downstream framework layer between ABG/GTL core and
domain-specific ODD products such as `odd_sdlc`.

The strategy's core split is:

```text
ABG/GTL preserves and executes the algebra.
odd_glc interprets it as a general life-cycle framework.
Domain products specialize odd_glc for concrete product families.
```

The project exists because lifecycle mechanics observed in `odd_sdlc` are not
all software-development-specific. Materialization policy, test-source role
projection, evidence admissibility, partial closure, residual pressure,
replay, re-entry, and release pressure are lifecycle concerns. They need a
general ODD framework over admitted ABG/GTL truth instead of product-local
ledgers or hardcoded downstream rules.

## Product Identity

`odd_glc` is a source project for a downstream ODD product.

It is:

- an ODD General Life Cycle framework;
- a consumer of GTL/ABG graph, requirements, projection, fold, residual, and
  replay primitives;
- a general lifecycle substrate for domain products;
- a place to define lifecycle vocabulary, graph functions, policy overlays,
  query projections, and proof interpretation;
- a bridge from general ODD method to specialized products such as software
  development, world-model construction, trading evaluation, service operation,
  or other governed domains.

It is not:

- ABG core;
- a GTL language replacement;
- `odd_sdlc`;
- a product-local requirement compiler;
- a second runtime, retry controller, closure ledger, or replay authority;
- a UI-first project;
- an installed product in this mutable source workspace.

## Problem

ABG/GTL can own the generic algebraic substrate:

- graph identity;
- traversal spans;
- staged context;
- requirement terms and relations;
- projections;
- evidence bindings;
- assurance folds;
- residual pressure;
- replay and attenuation;
- continuation and re-entry truth;
- typecheck and admission gates.

Domain products still need a framework that says what those facts mean across a
whole lifecycle. Without that layer, each product tends to rebuild local
workflow ledgers, local closure rules, local retry logic, and local query
surfaces. That creates authority drift.

`odd_glc` exists to absorb the reusable lifecycle interpretation without
polluting ABG core and without forcing each domain product to reinvent it.

## Layering

The intended stack is:

```text
SPEC_METHOD
  defines constitutional authority flow

ODD_METHOD
  defines graph-native ODD product shape

GTL
  declares graph-native product programs and wrapper surfaces

ABG
  owns traversal, runtime truth, admission, replay, folds, residuals,
  continuation, re-entry, and projection mechanics

odd_glc
  interprets admitted ABG/GTL truth as a general life-cycle framework

domain products
  specialize odd_glc for concrete product families
```

The boundary is strict. `odd_glc` may define lifecycle meaning and domain
policy overlays. It may not emit runtime truth, decide closure by local ledger,
or control ABG traversal.

## ABG/GTL Ownership

ABG/GTL owns the generic substrate:

- staged context carriers;
- requirement algebra carriers and relation law;
- requirement-as-carrier preservation laws;
- traversal spans and edge environments;
- projection APIs;
- evidence binding APIs;
- assurance fold and residual APIs;
- replay and attenuation law;
- continuation and re-entry truth;
- destination-topology declarations as introduced HOW constraints;
- GTL wrappers and typecheck/admission support.

`odd_glc` consumes those facts as admitted truth. It does not reimplement them.

## odd_glc Ownership

`odd_glc` owns general life-cycle interpretation:

- lifecycle vocabulary and typed lifecycle assets;
- graph functions for gap observation, problem framing, solution-space
  selection, WHAT decomposition, HOW topology selection, instruction-set
  construction, assurance, release, and operational feedback;
- read models over admitted ABG requirement/fold/residual truth;
- default `F_P` prompts and `F_H` decision surfaces for lifecycle meaning;
- policy overlays for workflow, escalation, risk appetite, and operator
  affordances;
- domain plugin boundaries where generic projection is insufficient;
- query surfaces that expose current lifecycle state without replacing ABG
  runtime truth.

## Domain Product Ownership

Domain products specialize `odd_glc`.

They own:

- domain-specific terms;
- domain-specific assets and graph functions;
- domain evidence interpretation;
- domain policy overlays;
- domain proof surfaces;
- product-specific UI or operator workflows;
- release criteria for their product family.

For example, `odd_sdlc` should specialize general lifecycle functions for
software-development work. It should not keep a separate closure ledger for
requirements, tests, materialization, replay, or residuals when ABG/GTL and
`odd_glc` can project those facts.

## Lifecycle Vocabulary

The initial vocabulary is provisional until ratified in `specification/`.

Core lifecycle nouns:

- `LifeCycleWorksite`
- `LifeCycleStage`
- `LifeCycleGap`
- `ProblemFrame`
- `SolutionSpace`
- `IntentFrame`
- `ProductFrame`
- `RequirementEnvironmentView`
- `RequirementProjectionView`
- `DestinationTopologyView`
- `InstructionSet`
- `WorkOrder`
- `EvidenceBindingView`
- `AssuranceFoldView`
- `ResidualPressureView`
- `ReleaseCandidate`
- `OperationalObservation`
- `ReentryDecision`

Core lifecycle relations:

- observes;
- frames;
- constrains;
- decomposes;
- projects;
- schedules;
- admits;
- folds;
- residualizes;
- attenuates;
- releases;
- observes-return;
- reprices;
- re-enters.

## System-Function Binding Correction

The initial idea of a native `glc.*` graph-function catalog is superseded.
Generic ODD construction belongs to GTL/ABG. `odd_glc` binds lifecycle meaning,
policy, query interpretation, proof interpretation, and specialization
constraints over GTL/ABG system functions and carriers.

First system-function bindings to review:

| Lifecycle slot | GTL/ABG system function or carrier |
| --- | --- |
| context observation and gap routing | `abg.requirements.ingest_context_fragments` / `abg.requirements.route_context_constraint` |
| requirement environment projection | `abg.requirements.compile_edge_environment` |
| requirement graph/refinement | `abg.requirements.derive_requirement_graph` / `abg.requirements.refine_goal` |
| edge obligations and work pressure | `abg.requirements.project_edge_obligations` |
| destination topology | ABG `DestinationTopology` |
| evidence binding | `abg.requirements.bind_evidence` |
| assurance fold and assurance case | `abg.requirements.fold_requirement_state` / `abg.requirements.project_assurance_case` |
| residual and attenuation | residual output of `abg.requirements.fold_requirement_state` plus attenuation classification |
| re-entry disposition | ABG continuation, correction, re-entry, release, or block facts |

Any named lifecycle route in `odd_glc` must be a GTL composition declaration or
binding map over those system functions. It must not republish generic
functions under `glc.*`.

## Lifecycle Shape

The first complete lifecycle shape is:

```text
observe current state
-> classify gap
-> frame problem
-> select solution space
-> derive or update intent
-> derive or update product definition
-> project requirement environment
-> decompose WHAT
-> select HOW topology
-> construct instruction set
-> plan work order
-> execute bounded graph-function work through ABG
-> bind evidence
-> fold assurance
-> project residual pressure
-> route re-entry, reprice, continuation, release, or block
-> prepare release candidate when closure supports it
-> ingest operational feedback
```

This is not a hidden imperative loop. It is a target lifecycle interpretation
over a GTL composition and ABG runtime truth, projections, and proof surfaces.
It is not a native odd_glc graph-function catalog.

## Requirements-Algebra Consumption

`odd_glc` depends on GTL/ABG requirements algebra being present enough to answer
these lifecycle questions from admitted carriers and replay truth:

- Which requirements are active for this edge or lifecycle stage?
- Which spans make them active?
- Which context fragments constrain this edge?
- Which projections create obligations?
- Which evidence can bind to each projection?
- Which evidence is current, superseded, rejected, partial, or non-closing?
- Which folds are satisfied, partial, deferred, or no-close?
- Which residuals carry forward?
- Which residual pressure narrows, transforms, moves, escalates, or clears?
- Which re-entry point is lawful?
- Which release or continuation state follows?

If ABG/GTL cannot answer those questions, `odd_glc` must not compensate by
creating a product-local peer ledger. It must mark the dependency as missing or
defer the affected lifecycle slot.

## F_D, F_P, And F_H Boundary

`F_D` owns deterministic lifecycle checks:

- stable ids and references;
- graph-function and vector refs;
- span and edge coverage;
- projection shape;
- context routing shape;
- evidence envelope shape;
- policy compatibility;
- completeness gates;
- read-model derivation from admitted truth;
- replay and attenuation classification;
- proof-package integrity.

`F_P` owns semantic lifecycle judgment:

- whether a problem frame is correct;
- whether a solution space is viable;
- whether a requirement decomposition preserves intent;
- whether a HOW topology fits the WHAT pressure;
- whether produced artifacts actually satisfy the intended meaning;
- whether evidence proves the claim it is offered for;
- whether residual ambiguity remains.

`F_H` owns human-governed decisions:

- risk acceptance;
- product-owner tradeoffs;
- strategic repricing;
- authority changes;
- unresolved ambiguity disposition;
- release acceptance where policy requires human approval.

`odd_glc` may define prompts, evaluators, and decision surfaces for these
boundaries. ABG still owns runtime control and event truth.

## Read Models

Initial read models should expose:

- current lifecycle worksite state;
- current active stage;
- active requirement projections;
- active context constraints;
- admitted evidence by projection;
- assurance fold summary;
- residual pressure summary;
- lawful next graph functions;
- release readiness;
- open repricing pressure;
- operational feedback requiring re-entry.

Read models are projections. They are not writable ledgers.

## First Slice

The first slice is specification-first:

1. Keep this bootstrap as the complete source capture.
2. Ratify intent and product definition in `specification/`.
3. Define requirement families for boundary, lifecycle graph, requirements
   algebra consumption, proof, query, and downstream specialization.
4. Ratify an initial design that binds typed lifecycle assets to graph
   functions.
5. Choose the first build tenant only after the graph-function shape is
   ratified.
6. Prove one generic lifecycle trace that does not require `odd_sdlc`.

The first slice must not implement `odd_sdlc` migration, ABG core changes, UI,
or a local runtime loop.

## Non-Goals

- Do not implement ABG/GTL requirements algebra here.
- Do not create a second runtime truth surface.
- Do not create a writable requirement ledger.
- Do not implement `odd_sdlc` policy as generic lifecycle law without
  ratification.
- Do not start with UI screens before graph functions and proof surfaces exist.
- Do not treat reports, generated files, test success, or release artifacts as
  closure by themselves.
- Do not hide lifecycle construction inside scripts or service methods.

## Open Questions

- Which ABG/GTL release or source line is the first lawful builder substrate?
- Which build tenant should realize the first `odd_glc` slice?
- Which lifecycle graph functions are mandatory for the first release cut?
- What is the smallest generic lifecycle trace that proves the framework
  without importing `odd_sdlc` as the domain?
- How should lifecycle stages bind to ABG requirement spans without becoming a
  parallel span model?
- Which `F_H` decisions must be explicit in slice 1, and which can be deferred?
- How should domain products publish specialization contracts back to
  `odd_glc`?

## Initial Project Layout

```text
odd_glc/
  README.md
  AGENTS.md
  .ai-workspace/
    context/project_bootstrap.md
    comments/
    tickets/
  specification/
    GOALS.md
    INTENT.md
    PRODUCT.md
    requirements/
    scenarios/
  build_tenants/
    README.md
    TENANT_REGISTRY.md
    common/design/
  docs/
```

## Current Work-Wave

The current work-wave is project creation and bootstrap capture.

Current closure means:

- the project directory exists;
- the bootstrap context is present;
- intent and product definition derive from the bootstrap;
- the requirements folder declares the initial requirement-authoring rules;
- no build tenant claims implementation authority yet.
