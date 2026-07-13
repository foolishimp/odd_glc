# odd_glc Goals

**Status**: Active
**Date**: 2026-07-07
**Derived From**: `.ai-workspace/context/project_bootstrap.md`,
`/Users/jim/src/apps/abiogenesis-4.6-support/release_snapshots/abiogenesis-typescript-tenant/4.6.0-rc.5/release-snapshot-manifest.json`

Goals define the current bounded work-wave for `odd_glc`.

## Current Goal

Bring `odd_glc` to user-visible `odd_sdlc` lifecycle parity by proving a full
data-mapper lifecycle over GTL/ABG 4.6 startup, registry, typed-node,
traversal, evidence, fold, residual, and replay truth.

Parity means:

`GTL/ABG substrate truth -> odd_glc generic lifecycle interpretation -> downstream/plugin specialization`

It does not mean porting or reproducing `odd_sdlc` source code, `Sdlc*`
carriers, local phase-flow controllers, local ledgers, retry loops, closure
registers, process shells, or controllers. It may require reproducing a
selected `odd_sdlc` witness graph traversal shape as GTL graph vectors consumed
by ABG.

ABIogenesis `4.6.0-rc.5` is the substrate under test for this wave. If the
selected `odd_sdlc` witness traversal cannot be expressed and run as GTL/ABG
startup, registry, graph-call, vector traversal, evidence, and replay truth,
then the substrate is incomplete for `odd_glc` parity. `odd_glc` shall record
the gap and block or reprice upstream; it shall not compensate with local
truth, local shells, or a product-owned traversal controller.

Current migration gate: T-030 is the live traversal migration and proof lane.
The next closure-grade data-mapper run must start from installed ABIogenesis
`4.6.0-rc.5`, consume ABG instruction assembly, requirement-proof
carry-through, HoG handler/program truth, and consequence re-entry through the
real startup traversal path, then produce a live upstream
`graph_reentry_applied` witness before convergence. Any run that bypasses
those capabilities, starts from an older installed substrate, or completes
without the re-entry witness is diagnostic only and shall not close
data-mapper parity.

## Active Plan

1. Keep the active software-build overlay generic.
   - Use `ODD_GLC_SOFTWARE_BUILD_OVERLAY` as the reusable GTL overlay graph.
   - Add data-mapping roles and node-type declarations as specialization data.
   - Treat graph-function refs in that overlay as ABG catalog bindings first;
     current refs are audited against the installed ABI substrate with no equivalent published
     GTL/ABG system entry found, and remain gated to bind upstream if an
     equivalent appears.
   - Do not create scenario-specific overlay models for each Hello World or
     data_mapper witness.

2. Define typed node declarations for the opinionated lifecycle graph.
   - Lifecycle and software-build nodes are GTL node-type declarations.
   - Data-mapping specializations are GTL subtype/specialization declarations.
   - ABG owns node-type admission, registry entry kind `node_type`,
     type-satisfaction projection, and traversal-close validation.

3. Use `odd_sdlc` data_mapper tests as witnesses only.
   - Lite, full, deep, resume, acceptance, restart, and migration data-mapper
     witnesses name coverage pressure and deletion targets.
   - Each witness row must identify artifact ownership: GTL declaration, ABG
     runtime truth, odd_glc read interpretation, or product/subject output.
   - No row may close by constructing local glc truth or copied SDLC truth.

4. Prove bootstrap traversal before claiming parity.
   - ABG must consume odd_glc startup config.
   - ABG must admit registry entries, reuse or select callable graph functions
     from the canonical registry/catalog, open the graph call, traverse vectors,
     emit runtime/proof truth, and expose replay/query truth.
   - odd_glc may interpret that truth; it may not select, call, emit, admit,
     fold, residualize, route, or invoke F_P.

5. Migrate live traversal sandboxes to ABG instruction and proof-depth truth.
   - The current live software-build runner still contains local prompt and
     evaluator prompt construction; that is pre-T-183/T-188 behavior.
   - Closure-grade live proofs must provide `instructionAssemblyStartup` to
     installed ABG startup, emit `instruction_prompt_manifest_projected`
     before required F_P dispatch, bind worker prompts from ABG instruction
     manifests, and carry requirement/proof/dependency/depth truth through
     ABG admission.
   - The unit of closure-grade compute is the ABG traversal monad. odd_glc may
     supply startup configuration and read replay truth; it shall not compute
     lifecycle edge outcomes through local helpers, prompt shells, trackers, or
     proof gates.
   - Requirement-lineage monitoring in this wave is a read-only canary over
     ABG replay truth. If obligations are dropped, the fix belongs in
     ABI/GTL, not in an odd_glc tracker.
   - A full data-mapper run may be cited as parity or depth evidence only
     when it runs on the current installed ABI substrate through the T-030
     lane and carries the required instruction, proof-depth, and re-entry
     witnesses in ABG replay truth.

6. Reproduce the full data_mapper witness as the controlling glc
   graph-traversal proof.
   - The full target is the `odd_sdlc`
     `t164_data_mapper_full_capability_live` witness family, whose current
     summaries now drive 26 required lifecycle edges from intent/product/goal/
     requirement pressure through UAT/test authority, feature decomposition,
     design, implementation, component/code qualification, execution result,
     repair schedule, repair application, repaired execution plan, repaired
     execution result, repaired qualification, archive, release-depth parity,
     and release preparation.
   - The already-earned data-mapper-lite rung remains scout/debug evidence. It
     does not close parity.
   - Closure requires those full data-mapper edges to be represented as GTL
     graph vectors, typed node declarations, ABG startup/registry selection,
     ABG traversal events, ABG evidence/proof truth, and odd_glc read
     interpretation.
7. Reproduce the Hello World witnesses as support/scout coverage.
   - Closure-grade proofs get their own ABG startup/run root.
   - Scenario-sandbox ports must create governed run roots, install
     the current ABIogenesis release candidate into fresh workspaces, write sandbox identities, and bind
     old witness pressure to the reusable `odd_glc` software-build overlay.
   - Subject programs may execute as product subjects inside that run root.
   - Runtime truth must be ABG-emitted or digest-pinned ABG proof truth.
   - The selected `odd_sdlc` witness graph traversal shape must be reproduced
     as GTL graph vectors consumed by ABG. Matching the subject output with a
     compressed materialize/prove diagnostic run is not compliance for a witness that
     historically traversed design, source, test design, test source,
     execution preparation, execution result, service/client, or fan-in stages.
   - Live-worker evidence means ABG invoked a real F_P/LLM worker.
   - Live-terminal evidence additionally requires `executorProfile:
     pty-terminal`, a non-null `terminalSessionId`, and a preserved terminal
     transcript. `local-spawn` live-worker runs are not live-terminal proofs.

## Active Tickets

- `T-025`: typed scenario ladder and data_mapper witness preparation over the
  reusable software-build overlay.
- `T-030`: migration of odd_glc live traversal sandboxes to ABG T-183
  instruction assembly and T-188 requirement-proof carry-through before any
  further full data-mapper run.
- `T-029`: install-shaped scenario sandboxes so ABG/GTL and odd_glc are both
  consumed as installed products before ABG traversal starts.
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

0. Close T-030 before the next full data-mapper live run.
   - Audit current live traversal code for local prompt shells, local proof
     gates, direct plugin/vector calls, and missing T-183/T-188 startup
     inputs.
   - Migrate the live software-build runtime binding to ABG
     `instructionAssemblyStartup`, instruction manifests, and
     requirement-proof carry-through.
   - Prove with a smaller software-build Hello World run before returning to
     the full data-mapper witness.
1. Add data-mapping node-type declarations to the TypeScript tenant.
2. Bind those declarations to the reusable software-build overlay and startup
   declaration model.
3. Add tests proving the declarations are GTL-owned data and ABG-validatable,
   not local runtime behavior.
4. Preserve the ABI graph-function reuse audit result.
   Current overlay refs have no equivalent published ABI system entry.
   Bind to future ABG entries where generic functions appear; record upstream
   ABG gaps where a function should become generic system law.
5. Rework the Hello World live rungs from diagnostic shortcuts into SDLC
   graph-traversal parity.
   - Current two-vector materialize/prove rungs are diagnostic only and not
     compliance.
   - The SDLC witness traversal is now represented by one reusable
     software-build GTL graph overlay, one reusable SDLC graph-function ref,
     and one reusable stage-plan declaration.
   - Hello World rungs are bootstrap inputs over that shared graph, not
     scenario-specific graph functions.
   - Closure requires an ABG startup run selecting
     `graph-function://odd_glc/software-build/sdlc-software-build` whose GTL
     graph vectors reproduce the selected odd_sdlc stage coverage and handoff
     order without copying SDLC runtime flow.
   - The live runner separates `sdlc_graph_traversal_compliance` from
     `diagnostic_smoke_not_compliance`. Diagnostic runs may find bugs but do
     not count as compliance.
   - The current compliance selector includes the JavaScript SDLC bootstrap and
     the Scala/SBT full data-mapper target. The full data-mapper lifecycle
     traversal remains open until it produces the Scala/SBT `scala_spark`
     tenant witness shape: CDME source, ScalaTest source, `sbt test`, and
     eight SBT XML reports: `cdme-core` plus the seven CDME concern modules.
     The previous RC4 data-mapper run produced a JavaScript/Node subject and is
     invalid as data-mapper parity evidence.
     The remaining CLI, JS tenant/test, Rust CLI, Rust service, parallel JS,
     and remaining data-mapper variants remain open until each has a traversal
     shape that matches its witness or exposes an ABI/GTL substrate gap.
7. For any missing stage, classify the failure as an ABI substrate gap before
   editing odd_glc code.
   - Missing GTL graph/vector expressiveness, registry startup binding,
     graph-function selection, F_P dispatch, event emission, evidence
     admission, continuation, or replay truth belongs upstream in ABI/GTL.
   - Missing domain content or policy data belongs in the downstream/plugin
     seam.
   - Missing read interpretation over admitted truth belongs in odd_glc.
8. Keep the old odd_sdlc Hello World sandbox witnesses as sandbox-port setup
   checks over current ABG install and odd_glc startup binding. These are not
   traversal closure, live-worker proof, live-terminal proof, or parity by
   themselves.
9. Treat deep/resume data_mapper witnesses as follow-on coverage after the
   full data-mapper traversal closes or exposes an upstream ABI/GTL gap.

## Boundary

`odd_glc` owns:

- lifecycle vocabulary and stage meaning;
- GTL declaration data for lifecycle/software-build overlays and node types;
- product-library graph-function declarations only where an ABG-catalog reuse
  audit proves no equivalent published system entry exists, with a standing
  gate to bind upstream when an equivalent generic function appears;
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

The subject/product owns generated source, test, build, service, data, and
execution-output artifacts. `odd_glc` may label and interpret those artifacts
only after GTL/ABG admits or projects the relevant truth.

## Completed Checkpoint

`T-001` through `T-024` and `T-028` are completed source work. They established
the product boundary, ABIogenesis substrate pin, lifecycle program overlay,
typed lifecycle node model, startup binding, first ABG startup
proof, and generic parity matrix.

Those completed tickets remain trace records for what has been earned. This
goals file names the current wave and is the active planning surface.
