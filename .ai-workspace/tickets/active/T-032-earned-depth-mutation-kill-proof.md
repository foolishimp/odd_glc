---
id: T-032
title: Earned depth — declared depth classes adjudicated from delivered proof, with mutation-kill adversarial verification
type: feature
ticket_category: ordinary
status: active
change_intent: >-
  Make depth an earned, replay-derived fact of the data-mapper lifecycle
  instead of a self-satisfied declaration, delivered through intermediate
  typed node types and adjudicated by the substrate.
intake_source: user depth review of the T-031 closure run (2026-07-08) +
  design dialogue ratifications (2026-07-08/09)
triaged_at: 2026-07-09
updated_at: 2026-07-09
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
  - "CONSTITUTIONAL REPRICING (triage outcome 3c, owed before this ticket
    claims closure): the kernel law, execution-default law, and
    topology-discovery law must be ratified into their constitutional
    homes — abiogenesis PRODUCT.md (reflective boundary /
    probabilistic-compute sections) and/or the requirement families, and
    odd_glc PRODUCT.md where it sharpens Non-Owned Surfaces — via their
    own product_reprice/requirement_reprice intake. Ticket prose does not
    outrank live specification; normalization by repetition is the named
    STDO failure mode."
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - cd build_tenants/odd_glc/typescript && CODEX_LIVE_FP=1 ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal ABG_TS_LIVE_TIMEOUT_MS=1200000 ODD_GLC_LIVE_SCENARIO=data-mapper-full node --test test/glc-software-build-overlay-live.test.mjs --test-name-pattern "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT"
  - git diff --check
closure_evidence: []
campaign_ledger: []
---

# T-032: Earned Depth — Mutation-Kill Proof

## Intake Triage (the entry — performed, not asserted)

1. SUBSTANTIVE? Yes: closure semantics of the data-mapper lifecycle
   change (depth moves from declaration to derivation); new typed
   delivery assets enter the product graph.
2. AFFECTED BOUNDARY: three layers, split by the kernel law —
   (a) ABIogenesis substrate (derivation, admission, gates);
   (b) odd_glc declarations (node types, vectors, contracts, scenario
   data); (c) constitutional surfaces (three ratified laws currently
   living only in this ticket's prose).
3. UPWARD-PROPAGATION WALK (first missing layer per boundary):
   (a) SUBSTRATE: live requirements EXIST
   (REQ-R-ABG3-REQUIREMENT-PROOF-CARRY-THROUGH-032/-033/-034/-035/-036:
   depth completeness shall be DERIVED, adversarial verification is
   admitted evidence). No design decision realizes them — depth truth is
   plan-declared today. First missing layer = DESIGN =>
   change_class design_reframe, re-entry at the ABI design surface.
   That work is NOT this ticket: it is abiogenesis T-210 (opened with
   its own triage).
   (b) odd_glc: PRODUCT.md already grants node-type/overlay/policy
   declaration authority; declaring two new lifecycle node types and
   vectors is realization under existing product truth =>
   change_class design_reframe scoped to the tenant proof surface —
   THIS ticket.
   (c) CONSTITUTIONAL: the kernel law ("odd_* owns no systems
   functionality"), the execution-default law (typed F_P generics
   first; F_D by T-206 annealing with equivalence contracts), and the
   topology-discovery law (obligations derive from admitted
   intermediate assets) are SHARED LAW stated in ticket prose. Ticket
   prose is commentary, not constitution. First missing layer =
   PRODUCT/REQUIREMENTS => a named repricing obligation, ticketed
   upstream (see required_work), not silently normalized here.
4. CHANGE CLASS (this ticket): design_reframe; re_entry_point:
   build_tenant_proof. Downstream span that must stay consistent:
   scenario declarations -> generated binding -> live proof suite ->
   T-031-class closure evidence.
5. RELEASE SCOPE: depends on ABI T-210 landing in an rc cut
   (artifact-verified) before the campaign resumes; this ticket shall
   not compensate downstream for substrate gaps (campaign law).

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

## The kernel law (user ratification, 2026-07-09)

The governing statement for this ticket and all successor allocation:
GTL provides declarative syntax; ABG interprets and provides the
bulletproof OS kernel; odd_* provides domain knowledge — types,
decomposition, vocabulary, policy. **odd_* products do NOT own systems
functionality.** If it executes, admits, derives, or gates, it is
kernel space (ABG). If it names domain meaning, it is userland
declaration (odd_*). The allocation test is instant: syscall or config
file?

Consequence already ticketed: the live binding's residual mechanism
(the plan executor that runs sbt inside the plugin, prompt-plan
compilation, the evaluator invocation loop) is unlawful residency under
this law — T-209 (standard-path adoption) deletes it by migrating those
interiors onto the T-205 kernel handlers; T-210 builds the earned-depth
and mutation-kill mechanism IN the kernel from day one.

## Execution-default law (user ratification, 2026-07-09): typed F_P generics first, F_D by annealing

The composed-program F_D execution interior is an OPTIMISATION traversal,
not the default. The default is the GENERIC TYPED F_P TRAVERSAL: agentic
workers are incredibly capable when their boundary APIs are strong types
— an edge DECLARES (typed input contract: built unit refs + plan; typed
output contract: execution result surface) that the F_P worker runs the
built unit / UAT tests / data generation / whatever the prior stages
delivered, and returns the TYPED execution result, which then flows
through evaluation and consequence as normal. Worker capability does the
work; strong types make it safe; admission makes it true (results remain
candidate material until F_D mechanical checks — report presence,
digests — evaluation, and carry-through admit them).

F_D-specific traversals are built LATER through OPTIMISATION INSPECTION:
the T-206 abg shell tuner (backlog; the consciousness loop) consumes
replay + per-configuration cost and PROPOSES annealing stable mechanical
traversals to F_D interiors as declaration drafts, ratified under §13.1
with admitted equivalence contracts. Anneal from evidence, never design
F_D preemptively — premature F_D interiors are the drift the boundary
law forbids, approached from the other side.

Consequences:
- The CURRENT graph shape (execution-result vectors) is already right;
  the defect is only WHO executes: today the odd_glc binding's plan
  executor runs sbt (userland systems code — kernel-law violation).
  It deletes toward the TYPED F_P WORKER (scenario data change: the
  stage declares the worker executes and returns the typed result),
  not toward premature kernel handlers. T-209's migration target is
  corrected accordingly.
- The mutation-kill loop likewise defaults to a typed F_P traversal
  (worker applies mutants, runs suite per mutant, restores, returns the
  typed kill matrix), with restore verified by F_D digest checks and
  the matrix admitted as adversarial evidence. Kernel F_D kill-loop
  handlers become a T-206-proposed annealing when replay shows the
  traversal is stable.
- T-210's kernel scope narrows to what only the kernel may own:
  depth-map carrier admission, -034 earned-depth derivation, map-derived
  kill obligations (the Godel projection), adversarial ledger
  resolution, and the gates. No new kernel execution machinery in this
  wave.

## Execution Plan (ratified 2026-07-09; stages gated by independent self review)

REVIEW PROTOCOL (applies after EVERY stage, before its gate passes):
an INDEPENDENT adversarial review in fresh context — a reviewer agent
(or external codex review) that receives only the stage's claims and
the repos, never this session's reasoning. Method is probe-based, not
diff-reading: forge the inputs the stage claims to reject, run them,
verify the artifact/tarball content where a release is claimed. Every
finding is fixed at its owner and the reviewer's probe is pinned as a
differential BEFORE the stage gate passes. Precedent: seven review
waves on the T-210/T-197/T-209 work each found real HIGHs (kind-tag
admission, rows admission, surrogate ingress, evidence scoping, -036
list presence, provider spoofing, split pin) — the review is part of
the stage, not an afterthought.

- STAGE A (abiogenesis): T-212 RIDES HERE (user reprice 2026-07-09:
  the installer-driven repin is the delivery AND test vehicle for the
  new bootstrap): the compressed constitutional bootstrap (three-layer
  ownership, execution-default, earned depth, evidence provenance —
  agent-addressed, compression-reviewed) lands in the installer source
  with rc.15; the repin runs the INSTALLER against the odd_glc
  WORKSPACE (refresh mode) so .abiogenesis/ and the injected
  AGENTS.md/CLAUDE.md blocks are stamped by their owner (correcting the
  rc.5-stale-provenance drift found 2026-07-09); hand edits confined to
  non-installer surfaces (substrate.provenance.json, test pins, spec
  refs, root dep). Stage D then IS the live test of the new context:
  workers operate under the boundary-bearing bootstrap and the campaign
  observes whether gate zero steers delivery shapes. Plus the kernel
  gap: typed mutationOutcomes payload — admitted at
  the artifact ingress (depth-map pattern); KERNEL mints kill/survived
  evidence refs from admitted rows (killed = suite red AND
  restoreDigest == baselineDigest; mismatch rejects); worker-attached
  raw kill/survived refs no longer resolve. rc.15 cut,
  artifact-verified, repin.
  REVIEW A: probes — forged outcome rows (digest mismatch, missing
  suite exit, surrogate strings); raw worker-attached kill refs must
  not resolve; spoofed provider attribution; tarball grep for the
  admission + minting surfaces; residual (worker-reported digests until
  kernel-witnessed) stated in the note, not silently claimed.
  BOOTSTRAP probes: the STAMPED workspace AGENTS.md/CLAUDE.md contain
  the four boundary blocks (content verification, not version-line);
  workspace install-provenance packageVersion equals the pin; the
  compression removal list is recorded; a hand-bumped version over
  stale content is the named failure this check exists to catch.
- STAGE B (odd_glc): D3 deletion — red conformance test first (no
  subject-toolchain execution outside worker turns), then delete plan
  executor / runForEvidence / sbt compile gate / framework evidence
  assembly; execution stages become typed F_P worker turns returning
  typed execution results. Gate: conformance green, suite green, 11.5B
  walk.
  REVIEW B: probes — grep-level and require-level scan for surviving
  spawn capability (including wrappers — proxy prohibition); a
  harness-assembled execution result must fail admission; the deleted
  paths must not be reachable via any exported seam; binding generates
  and node --checks.
- STAGE C (odd_glc): declarations — derive_depth_proof_map_surface +
  derive_mutation_kill_surface stages; adversarialDepthClassRefs per
  concern; canary depth rows. Gate: harnessed differentials (hollow map
  residual, survived mutant blocked, earned path eligible).
  REVIEW C: probes — declaration-only check (no code in scenario data
  beyond declared instructions/contracts); a scenario missing the map
  stage folds residual not eligible; canary rows derive from replay
  only (read-only law); instruction text does not leak tool mechanics
  into F_D surfaces.
- STAGE D: the live proving campaign — monitor events.jsonl,
  root-cause builder bugs at their owner, ledger each with its fix,
  rc cut + repin per kernel fix, until the closure law holds (8/8
  folds, every required class earned with test identities mechanically
  present in reports, zero survived mutants, provenance-gated evidence,
  canary clean). Mutation stage gets its own timeout budget.
  REVIEW D (per citable run AND at campaign end): replay-derived audit
  in fresh context — recompute the canary + coverage projections from
  events.jsonl independently; verify no scenario compensation for
  substrate gaps (non-closure condition); verify each ledgered bug's
  differential exists upstream; verify the depth map's test identities
  against the actual report XML files.
- STAGE E: closure + record — T-032 closure evidence + campaign ledger
  from replay; T-209 closes with the 11.5B audit; Phase 4 marked done.
  REVIEW E: closure-claims audit — every closure_law clause cited to
  replay evidence; non_closure_conditions each checked and negated;
  ticket wording vs proof claims reconciled (migration checklist law).

## Campaign Entry (2026-07-09, autonomous run)

Stages A-C complete with independent reviews closed at their gates:
- A (abiogenesis rc.15): mutationOutcomes carrier + kernel evidence
  mint; T-212 constitutional bootstrap stamped into this workspace by
  the INSTALLER (provenance == pin). Review A: 5/5 claims confirmed;
  hostile-object totality fixed+pinned; replay-log-auth residual on
  T-211.
- B (odd_glc): framework executes nothing — verify-only executor over
  worker-written test-execution-result.json + on-disk XML reports; sbt
  compile gate retired; signature-pinned conformance test. Review B
  REFUTED two claims (never-executed rewrite ReferenceError; evadable
  count-based conformance) — both fixed, 4-case unit pin drives the
  generated binding, scenario contract overrides worker claims.
- C (odd_glc): depth_proof_map + mutation_kill_outcomes node types +
  stages in the GTL plan; spans extend to the mutation proving edge;
  payload lift with EXACT-testcase-name corroboration (review C HIGH:
  substring matching earned fake depth end to end — fixed+pinned);
  map-or-residual law (CDME templates declare NO depth classes — the
  -038 escape is dead per entry); hardened mutation contract; canary
  depth rows with dedupe. Review C also verified the kernel flow end to
  end against installed rc.15 (eligible/residual/blocked/raw-refs-dead).

STAGE D RUN 1 LAUNCHED: CODEX_LIVE_FP=1 pty-terminal, timeout 3600000,
scenario data-mapper-full, monitor on events.jsonl. Campaign law:
root-cause at the owner, ledger every bug with its fix, rc cut + repin
per kernel fix, Review D replay audit per citable run.

### Campaign ledger — BUG #1 (run 1, 2026-07-09)

- RUN: 20260708T201347425Z_pid69405; blocked at vector 15
  (prepare_test_execution_surface), retry budget exhausted after 11
  attempts; terminal_reached blocked.
- OBSERVED: the worker REFUSED honestly every attempt: "the required
  sbt test run was not performed under the explicit no-tool/no-command
  instruction; fabricated status... would violate the stage truth
  requirement."
- ROOT CAUSE (owner: odd_glc binding declaration): the prompt shell's
  blanket preamble "Do not request or use any external helper, tool,
  shell, command, or subagent" predates the execution-default law and
  contradicted the stage's "YOU run sbt test yourself." The worker
  obeyed the stricter rule — CORRECT behavior; the contract was
  impossible. (Transport verified sound: codex exec --full-auto,
  cwd=workspace.)
- FIX: execution-bearing stage overrides carry workerExecutes: true;
  the preamble is conditional — execution-bearing stages get the
  execution-default preamble (run exactly the declared commands, record
  truthfully), all others keep the no-tool law.
- NOTE: the refusal itself is a positive gate-zero datum — the T-212
  boundary context produced truthful refusal over fabrication, exactly
  the anti-self-report behavior the constitution wants; the defect was
  ours (contradictory law), not the worker's.
