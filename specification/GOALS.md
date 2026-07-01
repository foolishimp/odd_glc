# odd_glc Goals

**Status**: Active
**Date**: 2026-07-01
**Derived From**: `.ai-workspace/context/project_bootstrap.md`,
`/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.2.0-rc.1/release-snapshot-manifest.json`

Goals define the current bounded work-wave for `odd_glc`.

## Current Goal

Bring `odd_glc` closer to user-visible `odd_sdlc` lifecycle parity by proving
an SDLC-like software-build/data-mapping lifecycle over GTL/ABG 4.2 startup,
registry, typed-node, traversal, evidence, fold, residual, and replay truth.

Parity means:

`GTL/ABG substrate truth -> odd_glc generic lifecycle interpretation -> downstream/plugin specialization`

It does not mean porting or reproducing `odd_sdlc` source code, `Sdlc*`
carriers, phase flow, local ledgers, retry loops, closure registers,
process shells, or controllers.

## Active Plan

1. Keep the active software-build overlay generic.
   - Use `ODD_GLC_SOFTWARE_BUILD_OVERLAY` as the reusable GTL overlay graph.
   - Add data-mapping roles and node-type declarations as specialization data.
   - Treat graph-function refs in that overlay as ABG catalog bindings first;
     ratify an `odd_glc` graph function only after a reuse audit proves no
     equivalent GTL/ABG system function exists.
   - Do not create scenario-specific overlay models for each Hello World or
     data_mapper witness.

2. Define typed node declarations for the opinionated lifecycle graph.
   - Lifecycle and software-build nodes are GTL node-type declarations.
   - Data-mapping specializations are GTL subtype/specialization declarations.
   - ABG owns node-type admission, registry entry kind `node_type`,
     type-satisfaction projection, and traversal-close validation.

3. Use `odd_sdlc` data_mapper tests as witnesses only.
   - T-031, T-152, T-154, T-188, T-164/T-171/T-200, T-199, and T-109/T-115
     name coverage pressure and deletion targets.
   - Each witness row must identify artifact ownership: GTL declaration, ABG
     runtime truth, odd_glc read interpretation, or sandbox/product output.
   - No row may close by constructing local glc truth or copied SDLC truth.

4. Prove bootstrap traversal before claiming parity.
   - ABG must consume odd_glc startup config.
   - ABG must admit registry entries, reuse or select callable graph functions
     from the canonical registry/catalog, open the graph call, traverse vectors,
     emit runtime/proof truth, and expose replay/query truth.
   - odd_glc may interpret that truth; it may not select, call, emit, admit,
     fold, residualize, route, or invoke F_P.

5. Reproduce the Hello World and data_mapper witnesses as glc proofs.
   - Each proof gets its own sandbox/run root.
   - Subject programs may execute in the sandbox as proof subjects.
   - Runtime truth must be ABG-emitted or digest-pinned ABG fixture truth.
   - Live tests mean a live F_P/LLM worker was called through ABG.

## Active Tickets

- `T-025`: typed scenario ladder and data_mapper witness preparation over the
  reusable software-build overlay.
- `T-026`: non-closed, re-entry, blocked, and reprice interpretation over
  typed glc startup.
- `T-027`: recursive any-scale lifecycle composition over ABG frame, span,
  foldback, re-entry, node-type, and registry truth.

## T-025 Working Plan

T-025 now carries the active data_mapper parity control surface:

- extended witness matrix with artifact ownership;
- node-type checklist for lifecycle and data-mapping nodes;
- close gates against local glc truth and copied SDLC truth;
- bootstrap traversal requirement for every rung.

Execution order:

1. Add data-mapping node-type declarations to the TypeScript tenant.
2. Bind those declarations to the reusable software-build overlay and startup
   declaration model.
3. Add tests proving the declarations are GTL-owned data and ABG-validatable,
   not local runtime behavior.
4. Audit reusable overlay graph-function refs against the ABG system catalog.
   Bind to ABG entries where generic functions exist; record upstream ABG gaps
   where they do not.
5. Add the first data_mapper-lite glc sandbox proof over ABG startup.
6. Expand to full/deep/resume data_mapper witnesses only after the lite proof
   closes without boundary drift.

## Boundary

`odd_glc` owns:

- lifecycle vocabulary and stage meaning;
- GTL declaration data for lifecycle/software-build overlays and node types;
- product-library graph-function declarations only where an ABG-catalog reuse
  audit proves product-specific specialization is required;
- data-only `F_P`/`F_H` policy overlays;
- read/query interpretation over admitted GTL/ABG truth;
- downstream specialization seams.

GTL/ABG owns:

- graph declaration law and public language constructors;
- startup admission;
- runtime registry projection, lookup, selection, and graph-call opening;
- traversal, frames, spans, foldback, continuations, and re-entry;
- actor/operator/F_P invocation;
- evidence admission;
- requirement fold, residual, disposition, and replay truth.

The sandbox/product owns generated source, test, build, service, data, and
execution-output artifacts. `odd_glc` may label and interpret those artifacts
only after GTL/ABG admits or projects the relevant truth.

## Completed Checkpoint

`T-001` through `T-024` and `T-028` are completed source work. They established
the product boundary, ABIogenesis 4.2 substrate pin, lifecycle slot map, typed
lifecycle node model, startup binding, first ABG 4.2 Hello World startup proof,
and generic parity matrix.

Those completed tickets remain historical authority for what has been earned.
This goals file names the current wave rather than restating their full
closure records.
