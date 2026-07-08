---
id: T-032
title: Earned depth — declared depth classes adjudicated from delivered proof, with mutation-kill adversarial verification
type: implementation
ticket_category: realization
status: active
goal: >-
  Depth stops being a self-satisfied declaration. Every declared depth class
  per CDME requirement is EARNED from delivered evidence — a worker-declared
  test-to-depth-class mapping verified mechanically against executed
  reports, and mutation-kill adversarial runs proving the negative and
  invariant classes discriminate.
change_class: design_reframe
re_entry_point: build_tenant_proof
owner: odd_glc
priority: highest
created_at: 2026-07-08
depends: T-031 (CLOSED — coverage chain proven; depth identified as
  declaration-satisfied, not evidence-earned)
governance_scope: STDO Method, ODD Method, F_D/F_P boundary law
source_documents:
  - .ai-workspace/tickets/completed/T-031-close-data-mapper-by-delivered-requirements-proven-by-tests.md
  - /Users/jim/src/apps/abiogenesis/specification/requirements/abg/REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH.md
closure_law: >-
  Close only when a live data-mapper run satisfies all eight requirement
  folds (the T-031 bar preserved) AND depth is earned per requirement:
  (1) a worker-declared depth map (test -> depth class -> requirement)
  admitted as evidence, with every required depth class carrying at least
  one declared test whose identity is mechanically present in the executed
  reports; (2) mutation-kill adversarial verification per declared negative
  and invariant shape - each worker-authored mutant applied, the suite
  executed, the mutant KILLED (suite red), the subject restored, and the
  kill evidence admitted as adversarialAttemptRefs; (3) a SURVIVED mutant
  is a counterexample (counterexampleRefs) and blocks closure through the
  existing adversarial_counterexample_found gate; (4) depth truth
  (declaredDepthClassRefs, typedDepthGapRefs, depthComplete) derives from
  the delivered map and reports, never from declaration equality.
non_closure_conditions:
  - depthComplete remains derived from declaredDepthClassRefs equaling
    requiredDepthClassRefs (self-satisfaction by construction).
  - F_D reads test source or subject semantics to adjudicate depth —
    depth adjudication consumes only the worker-DECLARED map (admitted
    data), report XML identities (mechanical string presence), and
    mutation run outcomes (suite exit truth). Semantic adequacy of the
    mapping stays F_P evaluator judgment.
  - A mutation is applied without restore verification, or kill evidence
    is asserted by the worker instead of derived from an executed red run.
  - Mutation specs name tools in binding mechanics (tool knowledge stays
    emergent — the mutant is a patch artifact; the runner is the generic
    apply-execute-restore-capture loop).
  - A run closes with a survived mutant, a missing depth class, or a
    declared test absent from the executed reports.
  - The scenario compensates for a substrate gap (campaign law: builder
    bugs are fixed at their owner).
required_work:
  - "SCENARIO DATA: two new data-mapper stages — derive_depth_proof_map_surface
    (after component tests: the worker declares depth-map.json binding every
    required depth class per requirement to named tests) and
    derive_mutation_kill_surface (after the proving edge: the worker authors
    one mutant patch per declared negative/invariant shape; the plugin
    applies, executes the declared plan, records red/green, restores)."
  - "BINDING (odd_glc): earned-depth derivation — depth truth per requirement
    computed from the admitted depth map + report XML test identities
    (missing class -> typedDepthGapRefs; unknown test name -> typed gap);
    generic mutation runner (patch, execute plan, capture report, restore,
    verify restore digest); adversarial evidence refs attached to the
    result artifacts so the producer resolves them against the admitted
    ledger (the strength-ref pattern)."
  - "ABI (expected small): producer resolves adversarialAttemptRefs /
    counterexampleRefs against the admitted evidence ledger (extend the
    deriveAdmittedStrengthRefSet pattern) so envelope adversarial truth is
    ledger-resolved, not template-static; requiredAdversarialCheckRefs
    populated per concern flows through existing admission. The coverage
    projector already flags proof_strength_not_adversarially_verified and
    blocks on adversarial_counterexample_found — no new gate law."
  - "CANARY (read-only): per-requirement depth rows — declared classes,
    earned classes, gap refs, mutants killed/survived — in the run summary."
  - Campaign: iterate live runs, root-cause builder bugs at their owners,
    ledger each with its fix, until closure per the law above.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal ABG_TS_LIVE_TIMEOUT_MS=1200000 ODD_GLC_LIVE_SCENARIO=data-mapper-full node --test test/glc-software-build-overlay-live.test.mjs --test-name-pattern "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT"
  - git diff --check
closure_evidence: []
campaign_ledger: []
---

# T-032: Earned Depth — Mutation-Kill Proof

## The gap (found by user depth review of the T-031 closure run)

The closure run delivered a real Spark-backed steel thread (632 main /
345 test lines, 18 tests, both polarities per concern) — but the five
declared depth classes were satisfied BY CONSTRUCTION: the binding set
declaredDepthClassRefs equal to requiredDepthClassRefs, so depthComplete
was true regardless of what the workers delivered. 2-3 tests per concern
cannot instantiate five distinct depth classes. Coverage is earned;
depth is currently declared. REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-
THROUGH-032/-034 name this exactly: coverage over a shallow obligation
set is not closure truth, and depth-policy completeness must be derived,
not asserted.

## The measure (user adjudication: focus on depth)

"Tests pass" is agreement; "tests kill the mutant named by the declared
negative shape" is discrimination. The mutation kill is the strongest
mechanical completeness signal available without F_D reading semantics:
it observes that the proof surface DISCRIMINATES, not what it means.
Survived mutants are counterexamples in the existing -036 vocabulary and
block closure through the existing adversarial gate.

## Boundary discipline

F_P authors: the depth map, the mutant patches, the semantic judgment
that a mapping is adequate. F_D adjudicates mechanically: map present,
classes covered, test identities present in reports, mutants applied/
executed/restored, kill outcomes from suite exit truth. The substrate
never parses Scala. Tool knowledge stays emergent: mutants are patch
artifacts; the runner is generic apply-execute-restore-capture.
