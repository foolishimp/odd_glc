---
id: T-031
title: Close the data-mapper by delivered requirements proven by exhaustive typed UAT
type: implementation
ticket_category: realization
status: completed
goal: >-
  Iterate and debug the full data-mapper live campaign until it closes BY
  actual delivery of requirements — requirements met by code delivery,
  proven by tests — with UAT tests as exhaustive proofs that functionality
  is met.
change_class: design_reframe
re_entry_point: build_tenant_proof
owner: odd_glc
priority: highest
created_at: 2026-07-08
depends: T-030 (RE-CLOSED — pressure-in-manifest law live at ABI 4.5.0-rc.8)
governance_scope: STDO Method, ODD Method, ABG/GTL installed-context law,
  F_D/F_P boundary law (user constitutional adjudication 2026-07-08)
source_documents:
  - .ai-workspace/tickets/completed/T-030-migrate-live-traversals-to-abg-instruction-depth.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH.md
closure_law: >-
  The data-mapper closes only when a live run over the installed substrate
  converges with EVERY declared CDME requirement satisfied through the full
  replay-derived chain: typed requirement pressure entering the prompt for
  each spanned vector (presence law), worker-delivered code AND tests
  admitted through response contracts and carry-through envelopes, subject
  test execution evidence admitted with report-derived pass truth, eligible
  proof coverage over a DEEP declared obligation set (positive, negative,
  boundary, invariant, and integration depth classes — coverage over a
  shallow obligation set is non-closure per -032), proof strength admitted,
  and every requirement fold satisfied. Convergence alone is not closure;
  green worker-authored tests alone are not closure (code and tests
  agreeing on a weaker contract is the exact -011 failure class).
non_closure_conditions:
  - A run cited for closure predates the typed-UAT requirement declarations
    or the T-030 presence law.
  - The declared requirement set remains one generic execution-evidence
    requirement (shallow obligation set) instead of per-CDME-concern typed
    requirements.
  - A proof obligation lacks positive AND negative expected evidence shape
    refs where the requirement names an invariant, rejection case, or
    forbidden behavior (-012/-022).
  - Requirement satisfaction is decided by F_D reading artifact content
    semantically (test names, file paths, source text) — semantic adequacy
    is F_P evaluator judgment over declared calibration, admitted as
    evidence, folded by F_D over admitted refs only (F_D/F_P boundary law).
  - The evaluator prompt for a test-bearing vector omits the requirement's
    declared UAT proof shapes or golden-instance calibration.
  - A builder bug is compensated in the data-mapper scenario instead of
    root-caused in ABI/GTL/binding (campaign law).
  - The canary reports dropped or pressure-missing requirements and the run
    is still cited.
required_work:
  - "DESIGN (the user insight, ratification-grade: process pressure from
    the artifact being created is a feature of a STRONGLY TYPED UAT
    requirement): replace the data-mapper's single generic requirement with
    a typed requirement per CDME concern — core contracts, topology
    compilation, DataFrame execution, adjoint lineage, accounting
    invariants, assurance, fidelity, engine integration — each declared as
    scenario data with: a traversal span over its delivering vectors
    (test-design, test-source, execution-result); a carry-through contract
    whose proof obligations carry positive AND negative expected evidence
    shape refs (e.g. accounting: balanced-partitions positive +
    unbalanced-rejection negative); required depth classes (positive,
    negative, boundary, invariant, integration); golden-instance
    calibration rows for the F_P evaluator; evidence-role refs binding
    subject test execution reports."
  - The declarations ride the existing ABI carriers ONLY (route bundle
    terms/spans/projections, carry contracts, proof-depth truth, golden
    instances, latitude) — no new odd_glc carrier, ledger, or gate (DMM
    Prime; T-030 R(m) still governs).
  - Extend the lineage canary REPORT (read-only) to per-requirement rows so
    the run summary shows each CDME requirement's chain: pressure-in,
    admitted, covered, fold state. No new authority.
  - Launch the campaign on the current installed substrate (4.5.0-rc.8+);
    monitor replay live; root-cause every failure in the BUILDER
    (ABI/GTL/binding); patch; resume (ODD_GLC_LIVE_RESUME) or relaunch;
    ledger every bug with its fix commit.
  - Each substrate fix rides a fresh ABI rc cut with artifact-content
    verification before repin (release-state law from the rc.6/rc.7
    correction).
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal ABG_TS_LIVE_TIMEOUT_MS=1200000 ODD_GLC_LIVE_SCENARIO=data-mapper-full node --test test/glc-software-build-overlay-live.test.mjs --test-name-pattern "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT"
  - git diff --check
closure_evidence:
  - "CLOSURE RUN (run 4, citable): test_runs/glc_software_build_overlay_live/data-mapper-full/20260708T014201296Z_pid83336 - installed ABIogenesis 4.5.0-rc.10, single genesis-ts start --until converged, 26/26 vectors closed in 29.5 min, harness proof green with presence law asserted."
  - "REQUIREMENTS MET BY CODE DELIVERY PROVEN BY TESTS, per requirement from replay alone - for EVERY one of the 8 typed CDME requirements: pressure entered ALL FOUR span prompts (2 manifests each: transform + evaluate; 56 engine-derived refs per manifest); interim folds carried no_close_preserved with synthesized-residual sources (conservation) from the UAT-authoring close to the proving edge; the v21 worker delivered and executed; carry-through admitted ELIGIBLE coverage per concern; final folds ALL SATISFIED (replay Counter: satisfied x8)."
  - "SUBJECT TESTS: 8 ScalaTest report XMLs across the 8 CDME modules, 18 tests, 0 failures/errors, executed by sbt through the declared execution plan; the 8 modules built from specification under typed requirement pressure."
  - "CANARY: droppedRequirementIds [], pressureMissingRequirementIds [], enteringPromptRefCounts [2,2,2,2] per requirement."
  - "NEGATIVE CONTROLS ACROSS THE CAMPAIGN: run 1 (rc.8) proved silence at spanned closes (BUG #1); run 2 (rc.9) proved eligible coverage dropped by the fold seam (BUG #2); run 3 (rc.10) proved the retry dead-end on a durable malformed-envelope artifact (BUG #3); run 4 proves the repaired chain end to end. Soak run (rc.7) pinned the uncitable baseline (entering [0])."
campaign_ledger:
  - 2026-07-08 TYPED-UAT DECLARATIONS LANDED - 8 per-CDME-concern
    requirements as scenario data (REQ-CDME-CORE..ENGINE), each with
    concern-specific positive AND negative expected evidence shapes,
    5 depth classes (positive/negative/boundary/invariant/integration),
    spans over the 4 creating+proving vectors; data-driven bundle +
    per-concern carry entries in the generated binding (hello-world
    fallback unchanged); spanned stages declare the depth-class union in
    proof-depth truth. Binding differential pins it. Suite 75/67/0.
  - 2026-07-08 BUG #3 (odd_glc binding, FIXED, no substrate change) -
    run 3 (rc.10, 20260708T011208293Z_pid91823) died gap_stop
    retry_exhausted at the v21 proving edge: the v20 worker nested the
    invocation under an "execution" envelope key in
    test-execution-plan.json; normalizeExecutionPlanShape (#14 family)
    unwrapped only "testExecution", so every retry re-read the same
    durable artifact into the same contract_failure BEFORE dispatch -
    retry cannot repair a durable input (repair/re-entry class, made
    moot here). Fix: the envelope family is {testExecution|execution|
    plan}; run-3's exact artifact shape pinned in the binding unit lane.
    Positive run-3 evidence: BUG #2 fix live (v4 residual folds carry
    non-empty sources: synthesized residual + scoped closure), pressure
    in span prompts, 21/26 clean closes. Suite 76/68/0.
  - 2026-07-08 BUG #2 (ABI requirements route, FIXED, rc.10) - the
    multi-requirement coverage drop seam (the review-escrowed T-208
    finding #3) went load-bearing at the proving edge: run 2 (rc.9,
    20260708T002028069Z_pid81350) delivered ALL EIGHT eligible carry
    admissions at v21, then all eight folds read no_close_preserved on
    EMPTY sources - sourceTruthRefsByRequirementId dropped coverage refs
    for requirements without per-requirement evidence bindings in
    multi-requirement scope (and had been eating the synthesized
    residuals at v4-v20 the same way). Fix: coverage-bearing requirements
    always emit fold sources. Differential pins both branches
    (eligible->satisfied; owed-missing->residual no-close) in
    multi-requirement zero-binding shape. ABI 1152/1152; rc.10 cut +
    artifact-verified; repinned. Run 2 otherwise proves the chain: span
    folds at every boundary+interior close (BUG #1 fix live), pressure in
    all four span prompts (v4/v14 verified 56 refs, 8/8 ids), 26/26
    converged.
  - 2026-07-08 REPIN-INTEGRITY CORRECTION - the rc.9 repin committed
    HOLLOW provenance (empty sourceCommit/snapshotCommit/digests) via
    silent shell interpolation, and the literal pin test passed because
    both sides agreed on emptiness; a later scripted repin corrupted
    seven files (empty-string replace) and was recovered from git + token
    stripping. Corrections: repin now computed in one validated process
    (format-asserted before write); NEW hollow-pin guard test enforces
    well-formed commits/digests on the provenance carrier permanently.
  - 2026-07-08 BUG #1 (ABI span algebra, FIXED, rc.9) - multi-vector
    spans failed to cover their own BOUNDARY vectors: spanCoversEdge
    corroborated the whole-span endpoint nodes against every member edge,
    so only interior vectors matched; the requirement route emitted ZERO
    fold truth at the creating and proving edges (gate-1 not_ready,
    silently swallowed by the runner). Found live on the first typed-UAT
    citable attempt (rc.8, run 20260708T000318273Z_pid76036) within five
    vector closes: pressure entered v4 manifests (56 CDME refs) but v4
    closed with no route facts. Reproduced deterministically (non-final
    spanned close differential); fixed with endpoint-scoped corroboration
    (source endpoint checked at the span's first vector, target at its
    last; single-vector spans check both - T-162 drift protection
    preserved exactly). ABI 1151/1151; rc.9 cut + artifact-verified;
    repinned. The rc.8 citable attempt was killed at v10 (structurally
    unable to fold at proving edges) - uncitable by its own law.
  - 2026-07-08 SOAK RUN CONVERGED (rc.7, diagnostic,
    20260707T231644565Z_pid33183) - FIRST FULL 26/26 convergence on the
    migrated T-030 path, 44.5 min, zero builder bugs; all 8 CDME modules
    built with 8 subject test reports; repair loop + both execution
    rounds live. Canary on its replay shows entering [0] - the rc.7
    pressure gap visible in evidence, confirming the run is structurally
    uncitable and the citable run must be rc.8 + typed-UAT.
---

# T-031: Close The Data-Mapper By Delivered Requirements Proven By Tests

## The Closure Law (user, 2026-07-08)

"Requirements met by code delivery proven by tests." Convergence is a
traversal fact; closure is a REQUIREMENT fact. The run that closes this
ticket must show, from replay alone, that every declared CDME requirement
was delivered as code and proven by tests whose declared shapes make the
proof exhaustive — the UAT test surface is the process-pressure artifact,
and its strength comes from the TYPE of the requirement declaration, not
from post-hoc inspection.

## Why the current declarations cannot close (the -032 gap)

The data-mapper scenario declares one generic execution-evidence
requirement. Coverage over that shallow obligation set is exactly what
REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH-032 names insufficient:
"coverage over a shallow proof policy shall not be sufficient closure
truth." Worker-authored tests passing sbt is necessary but proves only
that code and tests agree — the -011 weaker-contract class. The typed
per-concern declarations make the agreement point ABG-owned: the worker
must deliver INTO declared positive/negative shapes, the evaluator judges
adequacy against declared calibration, and the depth fold refuses closure
on missing declared classes.

## Boundary discipline

F_D asserts mechanical truth only: pressure present, shapes declared,
reports parsed, refs admitted, depth classes covered, folds satisfied.
F_P owns every semantic judgment: does this test actually prove the
invariant; is this negative case a real refutation. The substrate
harnesses the LLM — it never replaces it. Any fix that makes F_D read
Scala semantics is the #1 failure class and is non-closure here.

## T-031 CLOSED (2026-07-08)

The closure law is met in full, replay-derived, on run 4
(20260708T014201296Z_pid83336, ABIogenesis 4.5.0-rc.10):

requirements declared (8 typed CDME concerns, positive+negative shapes,
5 depth classes) -> engine-derived pressure in the authoring prompts ->
code + tests delivered by F_P workers -> sbt executed (18 subject tests
green across 8 modules) -> eligible coverage admitted per concern ->
ALL EIGHT requirement folds SATISFIED. Convergence was necessary but
never sufficient; the folds are the closure fact.

Campaign economics: 4 citable attempts + 1 soak; 3 builder bugs found
live, each root-caused at its lawful owner (ABI span algebra rc.9, ABI
route fold seam rc.10, odd_glc binding envelope family), each
differentially pinned, zero scenario compensation, zero F_D drift into
F_P judgment. The typed-UAT declarations (the user design: process
pressure from the artifact being created, as a feature of strongly
typed UAT requirements) were the instrument that exposed all three.

Residuals on their owning surfaces: T-208 escrow (ABI commonization;
finding #3 was consumed by BUG #2's fix), ABI installer valibot payload
gap (repaired per install, unticketed upstream), evidence-binding
attribution in multi-requirement scope (runtime evidence binds per-edge,
not per-requirement - lawful today, named for the requirements-algebra
board), 16x route-entry declaration re-emission (noise, not distortion).
