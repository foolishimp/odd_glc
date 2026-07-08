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
  - "ALLOCATION CORRECTION (user R(m) adjudication 2026-07-08): earned-depth
    derivation and mutation-kill execution are GTL/ABG substrate work, not
    odd_glc binding machinery. -034 already says ABG SHALL DERIVE depth
    completeness; the apply-execute-restore-capture loop is a generic F_D
    interior the T-205 handler family owns; adversarial admission is
    -035/-036 law. odd_glc ships DECLARATIONS ONLY. Upstream ticket:
    abiogenesis T-210 (inside-out: source carriers first)."
  - "ABI (T-210, the substance): (1) admitted depth-map carrier — worker-
    declared test->depth-class->requirement mapping admitted as evidence;
    (2) earned-depth derivation per -034 — depth truth (declared classes,
    typedDepthGapRefs, depthComplete) derived by ABG from the admitted map
    plus executed-report identities (mechanical string presence), replacing
    template self-declaration; (3) mutation-kill as declared F_D execution
    through the existing handler machinery — apply declared patch artifact,
    execute declared plan, capture report evidence, restore with digest
    verification; kill/survive outcomes admitted; (4) adversarial refs
    (adversarialAttemptRefs/counterexampleRefs) ledger-resolved in the
    carry-through producer (the deriveAdmittedStrengthRefSet pattern).
    Existing gates (-032/-034/-036, adversarial_counterexample_found,
    proof_strength_not_adversarially_verified) consume it — no new gate
    law."
  - "SCENARIO DATA (odd_glc): two new data-mapper stages as declarations —
    derive_depth_proof_map_surface (worker declares the depth map) and
    derive_mutation_kill_surface (worker authors mutant patch artifacts per
    declared negative/invariant shape); requiredAdversarialCheckRefs
    populated per concern; execution/mutation plans as declared data."
  - "CANARY (odd_glc, read-only): per-requirement depth rows — declared
    classes, earned classes, gap refs, mutants killed/survived."
  - Campaign: iterate live runs on the new substrate, root-cause builder
    bugs at their owners, ledger each with its fix, until closure per the
    law above.
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

## Allocation correction (user, 2026-07-08)

"Isn't this GTL/ABG work?" — yes. The first draft of this ticket put
earned-depth derivation and the mutation runner in the odd_glc binding;
R(m) routes both upstream: depth adjudication is -033/-034 ABG law
("ABG shall derive"), the apply-execute-restore loop is a generic F_D
interior under the T-205 handler factoring, and adversarial admission is
-035/-036. The binding self-declaring depth was the original defect;
the binding self-adjudicating depth would repeat it one layer up. The
odd_glc consumption rule decides the rest: a constructive function
needed by multiple ODD domains is platform substrate. odd_glc keeps
declarations, policy, and read-only interpretation.

## Ratified delivery design (user, 2026-07-08): intermediate delivery node types

Depth is derived through NEW INTERMEDIATE DELIVERY NODE TYPES — first-
class typed lifecycle assets on the graph, not side artifacts:

- `node-type://odd_glc/software-build/depth_proof_map` — the depth map is
  a DELIVERED ASSET: its vector (derive_depth_proof_map_surface, after
  component tests) cannot close without the worker materializing the
  typed map (test -> depth class -> requirement) against its declared
  output contract. The CDME requirement spans extend over this node, so
  the map is authored under the same engine-derived pressure as the tests
  themselves.
- `node-type://odd_glc/software-build/mutation_kill_evidence` — the kill
  evidence is a DELIVERED ASSET: its vector (after the proving edge)
  materializes worker-authored mutant patches, executes the declared plan
  per mutant through the EXISTING declared-plan F_D execution machinery
  (the same machinery v16/v21 already ride), and delivers the
  kill/survive report as the typed asset. Restore verified by digest.

Why this shape wins: every mechanism the session proved now applies to
depth for free — node-type admission gates the asset shape; vectors give
depth its own traversal visibility (timing, folds, evidence per close);
requirement spans put pressure on the depth artifacts' authoring
prompts; carry-through coverage and folds gate on their delivery; the
canary reports them like any other link. Nothing new is bolted onto the
producer; the graph delivers, and ABG derives.

The R(m) split stands: odd_glc declares the two node types, vectors,
output contracts, and mutation-plan data (declaration surfaces it
lawfully owns per PRODUCT.md); ABG owns the -034 earned-depth derivation
over the ADMITTED map asset + executed-report identities, the mutation
execution as declared F_D interiors, and adversarial admission
(-035/-036). Depth becomes a delivery obligation of the traversal and a
derivation obligation of the substrate — never a self-declaration of the
binding.

## Topology-discovery law (user, 2026-07-08): the Godel computation requirement

The intermediate computation DISCOVERS the topology. The proof surface's
shape is not knowable from the initial declarations: which mutants must
exist depends on the delivered tests; which tests must exist depends on
the delivered code; which depth rows are satisfiable depends on the
delivered map. Static enumeration of obligations at startup is an
attempt to prove completeness from inside the initial axiom set — the
exact defect that made depthComplete hollow. Each intermediate delivery
node EXTENDS the axiom set, and completeness is adjudicated against the
extended system, never the initial one.

Design consequence (binding on T-032/T-210 realization):
- The mutation-kill obligation SET is not scenario data. It is DERIVED
  by ABG from the ADMITTED depth-map asset: one kill obligation per
  mapped negative/invariant row. Cardinality unknown at startup,
  discovered at map admission — obligations mint from admitted
  intermediate truth exactly as requirement pressure does.
- The kill vector's contract is parameterized by the admitted map; its
  fold gates on the DISCOVERED obligation set, not a declared count.
- The recursion continues lawfully: a survived mutant is discovered
  topology too — it projects a repair/re-entry obligation through the
  existing foldback/re-entry machinery, not a static retry.
- The engine's existing unfolding-topology machinery (refinement
  boundaries, frame-local publication, zoom frames, graph-span foldback,
  Godel checkpoints per T-205 phase law) is the lawful home; no new
  ontology.
