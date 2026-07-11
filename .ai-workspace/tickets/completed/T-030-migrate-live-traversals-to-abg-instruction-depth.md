---
id: T-030
title: Migrate odd_glc live traversals to ABG instruction and depth proof
type: implementation
ticket_category: realization
status: completed
goal: >-
  Migrate odd_glc live traversal sandboxes from local prompt/proof shells to
  the latest installed ABIogenesis release's instruction assembly and
  requirement-proof carry-through capabilities before any further full
  data-mapper run.
change_class: design_reframe
re_entry_point: build_tenant_proof
owner: odd_glc
priority: highest
created_at: 2026-07-04
governance_scope: STDO Method, ODD Method, ABG/GTL installed-context law
source_documents:
  - AGENTS.md
  - specification/GOALS.md
  - specification/PRODUCT.md
  - .ai-workspace/tickets/active/T-025-replay-scenario-ladder-as-typed-glc-declarations.md
  - .ai-workspace/tickets/completed/T-029-install-odd-glc-into-scenario-sandboxes.md
  - specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENTS-ALGEBRA.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-INSTRUCTION-ASSEMBLY.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-182-realize-causal-carry-in-abg-instruction-rendering.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-183-realize-instruction-assembly-semantic-compiler.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/active/T-188-realize-requirement-proof-carry-through.md
closure_law: >-
  Close only when odd_glc live traversal sandboxes use the current installed
  ABG startup path to admit compiled instruction plans, bind runtime
  instruction envelopes, emit replay-visible instruction manifests, and carry
  requirement proof/depth/dependency truth through ABG-owned admission before
  any F_P worker dispatch is accepted. Active requirement-obligation lineage
  shall be delivered downstream as instruction pressure in ABG-rendered
  manifests and then preserved through response admission, proof coverage, fold,
  residual, and replay. This lineage proof is expected to be redundant if
  ABIogenesis T-183/T-188 and the requirements algebra are wired correctly; if
  it fails, the defect belongs in ABI/GTL root-cause repair, not in odd_glc
  local tracking. The unit of closure-grade compute is the ABG traversal monad:
  configured by GTL/ABG startup truth, stepped by ABG traversal, and observed
  through replay. The test framework may kick off the scenario once through
  installed ABG; it shall not build prompt text, invoke vectors, classify proof
  depth, track obligations, run closure-grade compute outside traversal, or
  compensate for missing ABG instruction/proof truth locally. Full data-mapper
  live traversal shall remain blocked until this migration audit and proof
  suite is complete.
non_closure_conditions:
  - A data-mapper live run is started before this ticket's audit and proof
    gates pass.
  - A live traversal sandbox dispatches an F_P worker from a locally built
    prompt string instead of an ABG-emitted `instruction_prompt_manifest_projected`
    event and bound instruction envelope.
  - `promptFor`, `evaluatorPromptFor`, or an equivalent odd_glc local prompt
    shell remains on a closure-grade live dispatch path.
  - A runtime binding omits `instructionAssemblyStartup` while claiming ABG
    T-183 instruction assembly coverage.
  - A runtime binding admits compiled prompt plans through a product-local file
    scan, local registry, prompt loader, or shell instead of ABG startup and
    admission.
  - A live F_P plugin accepts a dispatch without an `instructionPromptManifest`
    or without verifying that the manifest came from the current ABG traversal
    event stream.
  - A transform or evaluate F_P worker uses a server-side helper, advisor,
    tool, subagent, shell, slash command, product-local renderer, or external
    prompt shell and the transport does not reject the dispatch as a contract
    failure.
  - A live traversal closes while the number of `instruction_prompt_manifest_projected`
    events is lower than the number of F_P dispatches that require an F_P
    worker.
  - Runtime vector contracts, stage order, source/target node types, proof
    obligations, output contracts, or allowed artifact roles are hand-declared
    in the live runner instead of being derived from the admitted GTL graph
    overlay, node types, asset surfaces, and ABG instruction/proof projections.
  - Later vectors receive prior-stage artifacts through in-memory arrays,
    copied fixture summaries, or prompt prose instead of ABG T-182 causal
    context and admitted payload/evidence refs, digests, and bounded excerpts.
  - A live traversal resumes, restarts, or continues after a patch while losing
    causal/proof state because that state lived in a plugin closure instead of
    ABG replay-visible truth.
  - Requirement obligation coverage, proof depth, proof strength, dependency
    sufficiency, or carry-through identity is represented by odd_glc-local
    booleans, path checks, string markers, or summary text instead of admitted
    ABG/GTL truth.
  - Requirement lineage is tracked by odd_glc arrays, maps, counters, prompt
    prose, filenames, stage labels, or summary text instead of ABG requirement
    ledger/projection, instruction-manifest, carry-through, proof-coverage,
    fold, residual, and replay truth.
  - A lineage failure is fixed by adding an odd_glc obligation tracker,
    compatibility map, prompt patch, summary parser, or retry rule instead of
    repairing the ABI/GTL source of missing lineage truth.
  - An F_P worker prompt omits active requirement obligation refs, source
    requirement lineage refs, proof obligation refs, or residual pressure refs
    that ABG has admitted as relevant to the current vector.
  - A vector closes while any required obligation lineage present at dispatch
    is absent from the admitted response/carry-through/proof-coverage path or
    is replaced by an untraced worker summary.
  - A T-188 carry-through proof is based on co-presence of artifacts only and
    does not preserve requirement-obligation to proof-obligation pairing and
    evidence role identity.
  - A worker or evaluator response is accepted only because odd_glc parsed a
    JSON shape or path list locally, without ABG response-contract admission,
    output-envelope admission, and proof-coverage projection.
  - A separate evaluate.C/F_P prompt path remains outside ABG instruction
    assembly while affecting closure, retry, residual, continuation, or
    proof-depth outcome.
  - The evaluate stage reuses a transform manifest, loads an evaluate prompt
    through a separate registry or file path, post-processes
    `manifest.renderedPrompt`, or accepts a prompt that lacks edge-effective
    source/target obligations, causal carry, and proof obligations for the
    current vector.
  - The evaluate stage closes when a mutated manifest carries only generic
    lifecycle/node-type labels instead of the effective source/target
    obligations for that edge.
  - odd_glc asserts an evaluate verdict as closure truth. Evaluate output shall
    remain candidate material until ABG admits typed evidence, strength, role,
    adequacy, and requirement-proof carry-through truth on the replay path.
  - Deterministic subject execution or file materialization performed inside a
    plugin affects closure without ABG-emitted payload/evidence/carry-through
    truth for the effect and its proof role.
  - Product-specific data-mapper prompt wording, Scala/SBT checks, or artifact
    gates are used to compensate for missing generic instruction/proof-depth
    migration.
  - The migration proof calls plugins, vectors, graph functions, or workers
    directly from the test wrapper instead of invoking installed ABG once for
    the scenario and reading replay truth.
  - Closure-grade compute for graph-function selection, instruction assembly,
    causal carry, proof carry-through, effect execution, evaluation, evidence
    admission, fold, residual, continuation, or re-entry happens outside the
    ABG traversal monad.
  - A local helper function becomes an alternate compute unit for a lifecycle
    edge instead of configuration consumed by traversal or read-only proof
    observation over replay.
  - A proof cites a cancelled, partial, smoke, replay-only, or pre-migration
    data-mapper run as closure evidence.
required_work:
  - Pause further full data-mapper live runs until this ticket closes.
  - Write a migration audit identifying every odd_glc live traversal entry
    point, runtime binding, local prompt builder, local evaluator prompt,
    local proof gate, and direct plugin/vector call.
  - Apply the total responsibility function in this ticket to every audited
    local meta mechanism before implementation. If a mechanism is not an
    odd_glc consumer/config/read surface, remove it from odd_glc and either
    bind the existing GTL/ABG service or record an upstream GTL/ABG gap.
  - Re-express every closure-grade local compute step as GTL/ABG startup
    configuration consumed by the ABG traversal monad, or as an upstream
    GTL/ABG gap. Test harnesses may create sandboxes, start ABG, and read
    replay; they shall not compute lifecycle edge outcomes.
  - Classify each audited item as one of: GTL declaration data, ABG startup
    input, ABG instruction assembly input, ABG requirement-proof carry-through
    input, product policy data, odd_glc read interpretation, or illegal local
    truth surface.
  - Produce a DMM Prime review proving that migrated surfaces reuse ABG T-183
    and T-188 carriers instead of minting odd_glc instruction, prompt,
    requirement, proof-depth, dependency, admission, or closure carriers.
  - Add or update the odd_glc live runtime binding so it provides
    `instructionAssemblyStartup` to ABG startup.
  - Generate compiled prompt plans from admitted GTL/ABG declaration data and
    odd_glc policy data; product content may be template/config data but shall
    not execute rendering or own a prompt shell.
  - Replace runner-owned stage/vector contract authority with admitted GTL
    overlay and node-type truth. Any scenario constants may seed bootstrap
    workspace data, but closure-grade stage order, source/target type refs,
    proof obligations, output contracts, causal inputs, and allowed artifact
    roles shall be resolved from GTL/ABG truth.
  - Bind every F_P traversal vector that requires a worker to an ABG
    instruction envelope and replay-visible prompt manifest.
  - Make odd_glc F_P plugins fail closed when `instructionPromptManifest` is
    absent, mismatched to the current vector, digest-drifted, or not emitted by
    the current ABG traversal.
  - Remove closure-grade use of local `promptFor`, `evaluatorPromptFor`, or
    equivalent prompt construction. Any remaining helper must be diagnostic
    only and named as such.
  - Replace in-memory `priorStageArtifacts` causal carry with ABG T-182 causal
    context and the T-183 instruction manifest's admitted refs, digests, and
    bounded excerpts.
  - Route any closure-affecting evaluator/reviewer F_P prompt through the same
    ABG instruction assembly path as worker dispatch, or reclassify it as
    diagnostic-only so it cannot affect closure.
  - Prove transform and evaluate use the same canonical ABG startup,
    registry/admission, instruction plan, envelope binding, prompt manifest,
    and replay path, differentiated only by `computeStageRole`.
  - Add an evaluate-specific differential proof: the real evaluate manifest
    carries the edge-effective source/target obligations, causal carry, and
    proof obligations, and a mutated manifest that carries only generic
    lifecycle/node-type labels fails before closure.
  - Add a transport contract proof that a hidden server-side helper/tool event
    is rejected for both transform and evaluate, while a closed-tools live
    worker invocation reports an empty tool list.
  - Bind worker/evaluator responses to ABG response contracts and T-188
    output-envelope admission before their claims can affect proof coverage,
    fold, residual, or continuation.
  - Wire T-188 requirement-proof carry-through inputs for the software-build
    overlay: requirement obligation refs, proof obligation refs, evidence role
    refs, dependency instruction truth, proof-depth instruction truth,
    proof-strength admission truth, and replay/digest identity.
  - Wire requirement-lineage pressure into the ABG instruction path. The
    current-vector instruction envelope/manifest shall include active
    requirement obligation refs, source requirement lineage refs, proof
    obligation refs, and residual/typed-gap refs when ABG determines they are
    relevant to the vector. odd_glc may provide declaration and policy data,
    but ABG shall derive, bind, emit, and replay the lineage pressure.
  - Add a read-only lineage canary for live runs that reads only ABG replay
    truth and reports, per vector: requirement obligations entering the prompt,
    requirement obligations admitted from the worker/evaluator response,
    requirement obligations covered by proof carry-through, residual
    obligations, and dropped obligations. This canary is proof instrumentation,
    not an odd_glc responsibility surface. Dropped required obligations shall
    fail the run and trigger ABI/GTL root-cause bug fixing.
  - Add non-live regressions that prove missing compiled plan blocks dispatch,
    missing required causal/proof input blocks dispatch or closure, digest
    drift is rejected, and local prompt-shell dispatch is impossible.
  - Add non-live regressions proving that vector contracts come from admitted
    GTL/ABG graph truth, not local stage arrays; prior artifact carry survives
    replay/resume; evaluator F_P cannot bypass instruction assembly; and
    response-contract/carry-through admission is required before closure.
  - Add non-live regressions proving that removing an active requirement
    obligation ref from the instruction manifest, worker output envelope,
    carry-through admission, or proof-coverage projection causes a fail-closed
    lineage gap rather than silent closure.
  - Add a migration proof that a small software-build Hello World traversal
    enters through installed ABG once, emits instruction manifests before F_P
    dispatch, admits response/carry-through truth, and reaches replay-visible
    closure without odd_glc-local prompt/proof truth.
  - Only after the migration proof passes, re-enable the full data-mapper
    live traversal as the next debugging target.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - cd build_tenants/odd_glc/typescript && node --test test/glc-software-build-overlay-live.test.mjs --test-name-pattern "instruction assembly|proof carry-through|local prompt shell|software-build Hello World"
  - cd build_tenants/odd_glc/typescript && node --test test/lineage-canary.test.mjs test/live-proof-shape.test.mjs
  - cd build_tenants/odd_glc/typescript && rg -n "instructionAssemblyStartup|instruction_prompt_manifest_projected|instructionPromptManifest|instruction_causal_context_bound|dependencyInstructionTruth|proofDepthInstructionTruth|RequirementProofCarry|proofCoverage|responseContract|requirementObligation|sourceRequirement|lineage|residual" test src
  - cd build_tenants/odd_glc/typescript && rg -n "computeStageRole.*evaluate|instructionPromptManifest|server-tool|contract_failure|edge-effective|generic lifecycle/node-type labels|candidate material" test ../../../.ai-workspace/tickets/*/T-030-migrate-live-traversals-to-abg-instruction-depth.md
  - cd build_tenants/odd_glc/typescript && ! rg -n "promptFor\\(|evaluatorPromptFor\\(" test src
  - cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal ABG_TS_LIVE_TIMEOUT_MS=1200000 ODD_GLC_LIVE_SCENARIO=basic-cli node --test test/glc-software-build-overlay-live.test.mjs --test-name-pattern "SCN-GLC-HELLO-WORLD-CLI-BASIC"
  - git diff --check
closure_evidence:
  - Live migration proof (Phase 6, closure-grade): test_runs/glc_software_build_overlay_live/basic-cli/20260707T183821856Z_pid16122/odd-glc-software-build-overlay-live-proof.json — SCN-GLC-HELLO-WORLD-CLI-BASIC over installed ABIogenesis 4.5.0-rc.7, single genesis-ts start --until converged, stopped_by converged in 300.8s; 8/8 vectors closed with per-vector timings; two ABG manifests per vector before F_P dispatch; requirement REQ-GLC-SB-001 lineage replay-visible end to end (carry-through admitted at vector 7, eligible proof coverage, 11 evidence bindings, fold satisfied, lifecycle disposition); lineage canary droppedRequirementIds []; run summary carries the data-mapper gate statement.
  - Lineage canary (required_work item): src/lineage_canary.mjs — read-only derivation over replay events (R(m) = diagnostic proof harness only); wired into the live proof and asserted per scenario (dropped required obligations fail the run); test/lineage-canary.test.mjs pins the drop law (downstream silence after a reached requirement-bearing vector = dropped; unreached = not_reached; residual pressure reported, not dropped; total over empty/foreign replay).
  - Harness shape law: test/live-proof-shape.test.mjs requires every live sandbox test to derive the canary, fail on dropped obligations, and state the data-mapper gate.
  - Deterministic gates: npm test 72 tests / 64 pass / 0 fail (8 live-gated skips); no local prompt shell (rg gate clean); binding unit lane proves the generated binding parses and declares instructionAssemblyStartup, requirementRouteDeclarationBundle, requirementProofCarryThroughStartup, and temporalPropertyStartup.
  - Phase 5 fail-closed placement map (per R(m), ABG runtime law is pinned upstream, not rebuilt locally): missing compiled plan blocks dispatch, digest drift rejection, weaker-proof carry-through rejection, owed-but-missing coverage residuals, and manifest-before-dispatch standing gates are ABIogenesis substrate differentials (T-183/T-188/T-192/T-205 suites, semantic 1147/1147 at 4.5.0-rc.7); odd_glc pins its own side — declaration presence, startup-facade rejection, harness shape, canary drop law.
checkpoint_evidence:
  - .ai-workspace/comments/codex/20260707T111258Z_SOURCE_CHECKPOINT_t030-codex-pty-hello-world.md records the Codex PTY Hello World source checkpoint over ABIogenesis 4.5.0-rc.5. It is not T-030 closure or data-mapper parity closure.
  - 2026-07-07 sandbox-runner boundary correction: `test/glc-software-build-overlay-live.test.mjs` now treats live sandboxes as scenario runners only. The harness installs, writes sandbox identity, invokes installed `genesis-ts start --until converged` once, preserves stdout/stderr and ABG replay evidence, and no longer asserts generated artifact content, required output paths, evaluator review content, or scenario-owned execution-plan truth as sandbox closure. `test/live-proof-shape.test.mjs` guards this shape. This is a T-030 checkpoint, not closure.
---

# T-030: Migrate Live Traversals To ABG Instruction And Depth Proof

## Current Defect

The full data-mapper run exposed a platform migration defect, not a
data-mapper-specific prompt defect. The current odd_glc live software-build
runner invokes installed ABG once, but its runtime binding still constructs
worker and evaluator prompts locally and does not supply ABG
`instructionAssemblyStartup`. That means the ABG T-183 semantic compiler and
T-188 requirement-proof/depth carry-through capabilities are not active on the
live odd_glc software-build path.

This ticket blocks any further full data-mapper run until the live traversal
path is migrated and proven.

The ticket law is version-agnostic. Sandboxes install and run against the
latest released ABIogenesis product available to odd_glc at run time. Version
identity belongs in sandbox evidence, release notes, and run records; active
ticket law shall not pin behavior to a historical RC.

## Target Shape

The closure-grade live path is:

```text
odd_glc GTL declarations + policy data
  -> installed ABG startup
  -> admitted compiled prompt plans
  -> graph-function selection and graph-call opening
  -> ABG-bound instruction envelope per F_P vector
  -> replay-visible instruction_prompt_manifest_projected
  -> F_P worker consumes ABG manifest
  -> ABG admits response and requirement-proof carry-through truth
  -> ABG fold/residual/disposition/replay truth
  -> odd_glc read interpretation
```

The test framework's role is limited to creating the sandbox/install,
providing startup data, invoking ABG once, and reading replay/proof output.

## Compute Axiom

The unit of closure-grade compute is the ABG traversal monad.

```text
GTL/ABG startup config
  -> ABG traversal state
  -> vector transition
  -> admitted events
  -> replay projection
  -> next traversal state
```

Everything that changes lifecycle truth must pass through that chain. odd_glc
may supply declaration/configuration data into startup and may interpret replay
truth after ABG emits it. odd_glc shall not introduce another compute unit for
prompt construction, vector execution, proof acceptance, obligation tracking,
closure, retry, residual, continuation, or re-entry.

Diagnostic code may exercise subjects or inspect replay only when it is
explicitly non-closure or when ABG traversal emitted the evidence that makes it
closure-relevant.

## Total Responsibility Function

For every proposed local meta mechanism `m` in odd_glc, apply this total
function before code is written:

```text
R(m) =
  GTL language/declaration law
  | ABG runtime/service responsibility
  | odd_glc consumer/config/read responsibility
  | diagnostic proof harness only
  | upstream GTL/ABG gap
```

The function is decided by authority, not file location or convenience.

| Predicate | Result |
| --- | --- |
| `m` defines graph syntax, node type composition, overlay/program structure, asset-surface declaration, interface shape, plugin contract shape, wrapper shape, or requirement declaration language. | GTL language/declaration law. odd_glc may instantiate it as declaration data only after GTL/ABG provides the surface. |
| `m` admits, emits, mints, selects, opens graph calls, traverses, invokes F_P/effects, renders instruction envelopes, binds causal input, validates proof depth, carries requirement proof, tracks obligation lineage, folds, residualizes, routes continuation, retries, re-enters, or writes replay truth. | ABG runtime/service responsibility. odd_glc shall consume the emitted/query truth only. |
| `m` supplies lifecycle vocabulary, lifecycle labels, policy data, template/config data, downstream specialization data, or read/query interpretation over admitted ABG/GTL truth. | odd_glc consumer/config/read responsibility. It may not become runtime truth. |
| `m` exists only to assert that installed ABG/GTL truth is present in replay, with no write/control authority and no product closure authority. | Diagnostic proof harness only. It must be named and scoped as diagnostic/proof instrumentation. |
| no existing GTL/ABG surface can lawfully own `m`, and `m` would otherwise need to perform language or runtime authority. | upstream GTL/ABG gap. Stop the odd_glc implementation path and open or update ABI/GTL work. |

T-030 closes only when each current local meta surface in the live runner has a
recorded `R(m)` classification and the implementation follows the result. Any
uncategorized local meta code is non-closure.

## Reviewable Phases

### Phase 0: Audit

Deliverable: a comment post or ticket section that lists every live traversal
entry point and classifies every prompt/proof/control surface.

Checklist:

- live runner entry points are listed;
- local prompt/evaluator builders are listed;
- direct plugin/vector/worker calls are listed or proven absent;
- each local meta mechanism is classified by `R(m)`;
- existing ABG T-183/T-188 fixture inputs and event kinds are identified;
- illegal local truth surfaces are named before code changes.

### Phase 1: Design And Prime Review

Deliverable: design section mapping odd_glc software-build vectors to ABG
instruction assembly and proof carry-through carriers.

Checklist:

- no odd_glc instruction/prompt/proof-depth carrier is introduced;
- prompt plans are derived from existing GTL/ABG carriers plus odd_glc policy
  data;
- renderer execution remains ABG-owned or governed by ABG;
- requirement/proof/dependency/depth truth has one ABG/GTL source;
- DMM Prime review states why each surface is reused, derived, or deferred.

Root-cause gaps to close in the design:

- duplicate stage/vector truth: current live code derives closure behavior from
  `STAGE_PLAN` and stage-specific file instructions in the runner;
- duplicate causal truth: current live code passes prior artifacts through an
  in-memory `priorStageArtifacts` array;
- obligation-lineage loss canary: current live code does not prove that active
  requirement obligations enter each downstream prompt as ABG-bound pressure,
  survive worker/evaluator response admission, and remain visible in proof
  coverage, fold, residual, and replay. This is not a new odd_glc tracking
  surface; it is a direct failure detector for ABI/GTL wiring;
- duplicate evaluator prompt path: current live code renders a separate
  evaluator prompt outside ABG instruction assembly;
- duplicate response/proof gate: current live code accepts parsed JSON and
  path-level checks before ABG T-188 output-envelope and proof-coverage truth;
- effect/evidence split: subject execution and deterministic materialization
  occur inside plugins and must be represented as ABG payload/evidence truth
  before they can affect lifecycle closure.

### Phase 2: Startup Migration

Deliverable: runtime binding supplies ABG `instructionAssemblyStartup`.

Checklist:

- compiled plans are admitted through ABG startup;
- no parallel prompt-loader or local registry path exists;
- plan refs are stable and replay-addressable;
- missing matching plan blocks F_P dispatch.

### Phase 3: Worker Boundary

Deliverable: F_P plugin consumes ABG instruction manifests and fails closed
without them.

Checklist:

- plugin input includes current-vector instruction manifest;
- prompt text is read from the ABG manifest, not locally rendered;
- manifest digest and vector identity are checked;
- manifest carries ABG-derived active requirement pressure for the vector:
  requirement obligation refs, source requirement lineage refs, proof
  obligation refs, residual refs, or typed-gap refs as applicable;
- local prompt helpers are removed from closure-grade dispatch.

### Phase 4: Requirement-Proof Carry-Through

Deliverable: software-build overlay supplies T-188 proof/depth/dependency
inputs and ABG admits the resulting carry-through truth.

Checklist:

- requirement obligation refs are carried;
- source requirement lineage refs are carried from instruction manifest into
  response admission, carry-through, proof coverage, fold, residual, and
  replay-visible run summary;
- proof obligation refs and evidence role refs are carried;
- dependency sufficiency is ABG/GTL truth, not a local assertion;
- proof depth and strength are admitted truth, not local booleans;
- closure fails on missing required proof input.
- worker/evaluator response claims are admitted through T-188 output envelopes
  before they can satisfy proof coverage.
- subject execution effects are bound to evidence role refs and response
  contracts, not only local path/test summaries.

### Phase 5: Non-Live Proofs

Deliverable: deterministic regression tests for every close gate.

Checklist:

- missing compiled plan blocks dispatch;
- missing manifest blocks plugin execution;
- digest drift fails;
- local prompt-shell dispatch is impossible;
- manifest count equals required F_P dispatch count;
- carry-through rejects weaker/missing proof shape.
- deleting or mutating an active requirement lineage ref creates a replay
  visible lineage gap and prevents closure.

### Phase 6: Live Migration Proof

Deliverable: one closure-grade live-worker or live-terminal software-build
Hello World run over the migrated path.

Checklist:

- installed ABG and installed odd_glc are used;
- test invokes ABG once;
- ABG emits instruction manifests before F_P dispatch;
- worker transcript corresponds to ABG manifest content;
- response/carry-through truth is replay-visible;
- per-vector run summary lists requirement obligations entering the prompt,
  requirement obligations admitted from response/carry-through, residual
  obligations, and dropped obligations; dropped required obligations are zero,
  or the run is stopped and the root-cause fix is made in ABI/GTL;
- timing is recorded per vector;
- run summary explicitly says it unlocks, but does not substitute for, the
  full data-mapper run.

## Data-Mapper Gate

The full data-mapper run is the next debugging target after this ticket. It is
not a migration proof for this ticket. If the data-mapper run starts before
T-030 closes, the result is diagnostic only and shall not be cited as parity,
depth, or ABG T-183/T-188 migration evidence.

## Data-Mapper Sandbox Context

The full data-mapper sandbox is the controlling odd_sdlc parity witness for
odd_glc. It exists to prove that a real lifecycle build can be expressed as:

```text
GTL/ABG substrate truth
  -> odd_glc generic lifecycle interpretation
  -> downstream/plugin specialization
  -> subject product artifacts
```

It is not a data-mapper-specific feature implementation. The data mapper is the
stress case used to expose missing or broken GTL/ABG lifecycle capability:
startup, registry selection, graph traversal, instruction assembly, F_P worker
dispatch, response admission, requirement-proof carry-through, proof depth,
residual pressure, retry, re-entry, replay, and projection.

The sandbox test is a scenario runner only. It creates a fresh controlled run
root, installs the latest ABIogenesis release available to odd_glc, installs
odd_glc as a dependent product, writes sandbox identity, and invokes installed
ABG once with `genesis-ts start --until converged`. It shall not call vectors
directly, construct prompts, evaluate content, assert closure, patch proof
lineage, or perform lifecycle compute outside ABG traversal.

odd_glc owns lifecycle vocabulary, policy/config data, typed lifecycle
interpretation, and read/query views over admitted GTL/ABG truth. GTL owns graph
overlay, node type, asset surface, and graph-function declaration law. ABG owns
runtime truth: startup admission, graph-call opening, traversal, F_P invocation,
events, evidence admission, requirement folds, residuals, retry, re-entry,
continuation, and replay.

A closure-grade data-mapper run must prove, from replay and preserved process
evidence:

- installed ABG and installed odd_glc were used;
- the scenario was started through one installed ABG start invocation;
- every F_P dispatch has an ABG instruction manifest before dispatch;
- active requirement/proof/dependency pressure appears in the manifest;
- worker/evaluator outputs are admitted through ABG response and carry-through
  paths before affecting closure;
- requirement obligations are not dropped between dispatch, response, proof
  coverage, fold, residual, and replay;
- generated subject artifacts match the Scala/SBT data-mapper target;
- subject tests are produced and executed;
- vector timings and terminal/PTY transcripts are preserved where live-terminal
  proof is claimed.

Until T-030 closes, any full data-mapper run is diagnostic only. Failures are
root-cause evidence for ABI/GTL/odd_glc binding repair; they shall not be fixed
by adding local odd_glc ledgers, prompt shells, closure gates, retry
controllers, or data-mapper-specific runtime logic.

## Data-Mapper Debugging Campaign — Builder-Bug Ledger (2026-07-06)

User directive: the full data-mapper live scenario (codex xhigh workers)
runs as the TRUE depth test; failures are debugged in the BUILDER
(ABI/GTL/odd_glc binding), never compensated in the data-mapper scenario.
Runs are diagnostic for T-030 (per this ticket's Data-Mapper Gate) until
the migration proof suite closes.

BUG #1 (odd_glc binding, FIXED): the P4 requirement-span construction read
`.source.id/.target.id` off scenario stage rows; data-mapper rows carry a
different shape. Fixed to the lawful form — span identity from the
ADMITTED graph function's vectors (decoupled from declaration-row
internals). Run 1: failed at 983ms pre-worker; post-fix suite 54/0.

BUG #2 (ABI transport, SHIMMED here + upstream item): transport_contracts
hardcodes `--model gpt-5.3-codex`; ChatGPT-account codex rejects it (400
per attempt). Run 2: 11 fast retry attempts on vector 0, then a LAWFUL
frontier stop — retry allowlist, admission chain, and the five rc.8
temporal verdicts all behaved correctly around the broken transport
(machinery vindicated). Run-harness fix: PATH shim drops the model pin and
injects `-c model_reasoning_effort=xhigh` (diagnostic transport shaping,
not product truth). UPSTREAM ROOT-CAUSE ITEM (ABI rc.9): codex model must
be env-overridable (e.g. ABG_TS_CODEX_MODEL), not hardcoded.

Run 2 also demonstrated end-to-end rc.8 depth machinery live on the
data-mapper path: manifests before every dispatch, payload/response
admission per attempt, retry/continuation truth replay-visible, temporal
verdicts at terminal.

Campaign ledger additions (runs 5-7):
- BUG #4 (binding, FIXED): spawn-error post-validation evidence crashed
  the CLI (undefined stdout hash) — evidence now fail-safe, spawn errors
  are typed issues.
- BUG #5 (binding, FIXED in two steps): worker-side output corruption
  (intermittent byte fault at ~offset 6000 in codex -o emission under the
  pty profile; clean 3-of-4 attempts) crashed the run; now a typed
  blocked outcome — and #5b: classified contract_failure so the ABG retry
  allowlist owns it (the first classification defaulted to
  runtime_failure, which is NOT allowlisted, and blocked instantly).
- BUG #6 (product policy, FIXED): the generic evaluator criteria demanded
  execution evidence at EVERY stage, making non-execution stages
  structurally unclosable (vector-12 retry-forever with valid 14-file
  Scala candidates). Execution criteria now apply only to stages that
  carry execution by design.
- LEDGER #7 (upstream, OPEN): the ~6000-offset emission corruption —
  suspects: codex -o under GNU-screen pty profile vs codex CLI chunking;
  two corrupt artifacts captured for diffing. Root-cause pending; #5b
  makes it retry-absorbable meanwhile.
- Depth log: run 5 reached vector 10 (39.8m), run 6 vector 12 with three
  VALID full Scala code surfaces (32.3m), run 7 vector 12 (17.7m — the
  #6 fix visibly sped early-stage closure before dying on #5b).

Visibility law (user adjudication, 2026-07-06): failures are EVENTS, not
side files. Plugin-boundary throws now convert to typed blocked outcomes
that ABG admits into replay truth (projection/verdict/canary-visible;
lawful gap_stop with the stack in the reason detail). The
binding-crash.log shrinks to the pre-event sliver (outcome construction
itself failing) as harness diagnostics only. UPSTREAM LEDGER ITEM (ABI):
the genesis-ts CLI catch should emit a typed runtime-failure EVENT before
wrapping any error, so binding defects land in replay universally and no
downstream product needs boundary guards for visibility.

BOUNDARY LAW (user, 2026-07-06): tool knowledge is EMERGENT — the
substrate never knows about sbt (or cargo, node, scalac). Tool names
enter only as emergent data: worker-authored plans, scenario contract
rows, admitted artifacts. The substrate's obligation is the generic
triple {execute declared plan, capture evidence, admit truth}. Empirical
proof: the same substrate ran JS/Rust/Scala tenants unchanged. Any
vector-16 fix that mentions a tool by name in binding mechanics or ABI
is unlawful; host-environment facts (Java home, tool presence) are
scenario/provisioning data.

## RUN-18 SPEC: resume-mode (the wiring that closes the iteration loop)

WHAT EXISTS TODAY (engine, proven in suites all session):
- CLI `start` over an existing workspace reads events.jsonl, derives
  the frontier, and CONTINUES — closed vectors stay closed (T-072
  re-entry proof); retry state resumes from replay (T-084).
WHAT DOES NOT EXIST (the actual gap; I proposed it as "one flag" —
it is a small lane addition, not a shipped switch):
- the live lane has no resume mode: it always mints a fresh run dir,
  reinstalls the sandbox, regenerates the binding, and calls start
  once. ADD: ODD_GLC_LIVE_RESUME=<run-dir> — skip install/materialize,
  reuse the instance workspace, invoke installed start again (optionally
  loop until converged/blocked-with-new-reason).
ONE SEMANTIC TO VERIFY AT WIRING: retry-budget state after
gap_stop(retry_budget_exhausted) — re-entry after an F_H fix should
open a fresh attempt window (the human gate passed); if the replay-
derived frontier still reads exhausted, add a declared re-entry policy
(budget refresh on operator-ratified resume) rather than hand-editing
truth.
Expected economics: fixes cost one stage's wall-time (~2-4 min), not a
50-minute re-proof of vectors 0-15.

## T-030 CLOSED (2026-07-08)

Phase status at close: P0 audit + P1 Prime mapping (comments/claude/
20260706T090000Z + codex 20260704T031900Z); P2 startup migration (all
four startup families in the generated binding; substrate repinned to
4.5.0-rc.7); P3 worker boundary (plugins consume ABG manifests; prompt
shells absent — rg gate); P4 carry-through (route bundle + carry
contract + temporal standing gates in the binding; live carry-through
admission + eligible coverage + satisfied fold replay-proven); P5
fail-closed gates per the placement map in closure_evidence (ABG law
upstream, odd_glc declaration/harness/canary pins local); P6 live
migration proof green (closure-grade run cited in closure_evidence,
lineage canary zero dropped, per-vector timings, gate statement).

The first live run of this wave also exercised the 4.5.0-rc.7
carry-through applicability law end to end downstream: requirement
pressure declared at startup surfaced as carry-through admission and
eligible coverage in the fold — the pre-rc.7 silent-collapse class is
now structurally impossible (owed-but-missing would surface as residual
no-close, and the canary would report it).

The full data-mapper live traversal is UNBLOCKED as the next debugging
target (campaign mode per the builder-bug ledger; RUN-18 resume-mode
lane remains the named economics item). Per the Data-Mapper Gate, that
run is the next target, not retroactive proof for this ticket.

## REOPENED (2026-07-08, codex review HIGH)

The closure claimed requirement-obligation lineage was proven end to end.
FALSE on the preserved proof: `enteringPromptRefCounts: [0]` for
REQ-GLC-SB-001 — the canary MEASURED that no requirement pressure entered
the vector-7 instruction manifest, and the live assertion checked only
`droppedRequirementIds`. The ticket's closure law (manifest-carried
obligation pressure BEFORE dispatch) and the Phase 6 checklist row
("requirement obligations entering the prompt") were not satisfied; the
downstream half (carry-through admission, eligible coverage, satisfied
fold) was real but is not the same claim. Re-close requires: root-cause
of the manifest-pressure gap (expected home: ABI instruction assembly per
REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH-007), the fix landed at its
lawful owner, the canary's entering-prompt measurement corrected to match
obligation refs (not requirementId substring), the live assertion
strengthened to fail on zero entering-prompt pressure for reached
requirement-bearing vectors, and a fresh live proof. Data-mapper runs
revert to DIAGNOSTIC-ONLY under the Data-Mapper Gate until re-close.

## RE-CLOSED (2026-07-08)

The reopen's falsified claim is now TRUE on the tree and proven live:

- ROOT CAUSE FIXED UPSTREAM: ABIogenesis 4.5.0-rc.8 realizes
  REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH-007 — the engine derives
  per-vector requirement pressure from admitted route + carry-through
  startup truth and binds it at every F_P instruction-bind site; pressure
  renders into the prompt (abg.runtime.bound_refs) and surfaces
  replay-visibly as requirementPressureRefs on the manifest carrier and
  event under digest law. odd_glc repinned to rc.8.
- MEASUREMENT CORRECTED: the canary reads the TYPED
  requirementPressureRefs field (substring heuristic retired).
- ASSERTION STRENGTHENED (the missing check): PRESENCE LAW —
  pressureMissingRequirementIds must be empty; a reached span vector
  whose pressure-capable manifests carry zero pressure for the
  requirement FAILS the run. Mechanical presence only; worker adherence
  remains F_P evaluator judgment (F_D/F_P boundary law). Inert on
  pre-rc.8 replays and unreached vectors. Differentials pin all three.
- LIVE PROOF (Phase 6 rerun): basic-cli over installed 4.5.0-rc.8,
  converged; enteringPromptRefCounts [2] (was [0] at reopen);
  pressureMissingRequirementIds []; droppedRequirementIds []; coverage
  eligible; fold satisfied. Run:
  test_runs/glc_software_build_overlay_live/basic-cli/20260707T234708597Z_pid74177/odd-glc-software-build-overlay-live-proof.json

Data-mapper gate: UNBLOCKED again — successor T-031 owns the closure
campaign under the user closure law (requirements met by code delivery
proven by tests; exhaustive strongly-typed UAT proof).
