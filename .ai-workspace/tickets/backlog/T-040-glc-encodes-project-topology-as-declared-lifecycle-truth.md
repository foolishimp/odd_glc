# T-040 GLC Encodes Project Topology As Declared Lifecycle Truth

- id: T-040
- title: software-build subjects must realize the constitutional topology; GLC encodes the structure as typed overlay declarations and every downstream surface derives paths from it
- type: feature
- ticket_category: implementation_migration
- migration_strategy: inside_out_hard_break
- library_usage: extend
- governing_library: `ODD_GLC_SOFTWARE_BUILD_OVERLAY` node-type and typed-asset declarations
- status: backlog
- goal: glc-1-0
- governance_scope: STDO Method
- governance_scope_expansion: [S, T, D, O]
- intake_source: F_H observation 2026-07-13 while inspecting the 0.1.1-rc.1 hello-world runs through odd_manager ("i expect the structure of specification/ build_tenants/"; ruling: "glc needs to encode the structure"); corroborated by the six-defect convergence family on the 0.1 support line, whose root class was path/shape literals smeared across surfaces
- affected_boundary: odd_glc software-build overlay (node types, stage/vector declarations, scenario stage plans), scaffold/bootstrap surfaces, execution verifier and evaluator prompt path derivation; ABG consumed but unchanged (existing OutputInstanceAllocation write-root confinement is the enforcement seam)
- change_intent: subjects produced by the software-build lifecycle are lawful ODD projects — topology is declared, admitted lifecycle truth authored at the WHAT stage, and all downstream stage paths derive from that admitted declaration
- change_class: product_reprice (subject topology is product truth of the overlay), with design_reframe flowing through the overlay design and harness realization
- re_entry_point: product (odd_glc PRODUCT/overlay declaration surface) → design → realization → proof
- triaged_at: 2026-07-13
- created_at: 2026-07-13
- updated_at: 2026-07-13
- release_line: main (GLC 1.0 direction; composes with T-034 manager-callable software-build carrier)
- dependencies: T-034 (shared carrier surface), abg OutputInstanceAllocation law (consumed, not changed)
- links: support-line evidence `odd_glc-0.1-support/.ai-workspace/tickets/active/B-001-software-build-overlay-plan-result-convergence.md`; explicit non-goal for `support/0.1.x` (frozen flat shape, bugfix boundary only)

## Problem

The software-build lifecycle graph produces projects that violate the
constitutional topology of the method that built them. ODD_METHOD's
software-development topology is load-bearing law — `specification/` owns the
WHAT (GOALS, INTENT, PRODUCT, `requirements/`), `build_tenants/<family>/<variant>/`
owns the HOW (design, code, tests, proof surfaces) — but scaffolded subjects
are flat: one `project-conformance.md` stands in for the whole specification
surface, and `design/`, `src|generated/`, `test/` sit at the workspace root
with no realization root, no tenant identity, no registry, no requirement
decomposition.

The shape is declared, not accidental: stage plans and node contracts pin
literal flat paths and instruct workers to "use these declared stage/file
paths exactly." Consequences:

1. The dogfooding recursion breaks — the method cannot re-enter its own
   output; a generated project cannot grow without a fundamental migration.
2. Subjects are born with process drift — no requirement surface to reprice,
   no design surface to reframe, no lawful re-entry point for change.
3. The scale cliff is hidden at hello-world scale and inherited by real
   downstream projects (corporate consumers scaffold from this lifecycle).
4. Path literals are a smeared semantic center across stage plans, node
   contracts, prompts, the execution verifier, evaluator instructions, and
   proof fixtures — the same seam-multiplication class that produced the
   0.1 support line's six-defect convergence family.

Operator-experience witness: F_H browsed a green run in odd_manager, looked
for the code under `build_tenants/`, and it was not there.

## Target Truth

- target_truth: GLC encodes project structure as typed overlay declarations.
  (1) A `project topology declaration` is a typed lifecycle asset authored at
  the WHAT stage (`conformance_project` vector): the specification surfaces
  the subject carries and its realization root
  (`build_tenants/<family>/<variant>/` + registry entry). (2) Every
  downstream stage derives target paths from the admitted topology carrier —
  stage plans, node contracts, prompt rendering, execution verification,
  evaluators; no literal path strings remain in stage plans. (3) The
  canonical profile realizes the full bootstrap ladder
  (`specification/{GOALS,INTENT,PRODUCT,requirements/}` +
  `build_tenants/<t>/{design,code,test_env}`); witness-scale subjects declare
  an explicit reduced profile — reduced by declaration, never by drift.
  (4) Enforcement is F_D at admission through the existing ABG write-root
  confinement: the declared topology supplies the allowed roots; an
  out-of-topology stage output fails closed with a governed diagnostic.
- superseded_truth: flat-path literals in scenario stage plans and node
  contracts; root-level `design/`, `src|generated/`, `test/` as the scaffold
  shape; per-surface copies of path knowledge.

## Migration Declaration

- old_truth_path: literal stage-plan/contract paths; flat subject scaffold
- new_truth_path: admitted topology declaration as the single path authority
- producers: `conformance_project` vector (topology authoring), overlay
  node-type declarations
- consumers: all downstream stage vectors, prompt assembly, execution
  verifier (`executePlannedScenario` family), evaluator instructions,
  scaffold/bootstrap writer, proof fixtures, odd_manager browse expectations
- derived_surfaces: run-instance workspaces, committed proof inputs,
  qualification records
- closure_law: closes only when no stage plan or node contract carries a
  literal subject path; all six hello-world scenarios plus the data-mapper
  scenarios scaffold and converge under declared topology; the canonical
  profile yields a subject that the method can re-enter (walkthrough proof:
  run a lawful change-class re-entry on a generated subject); negative proof:
  an out-of-topology write is rejected at admission, and a scenario declaring
  no topology fails the WHAT stage rather than defaulting to flat.

## Migration Checklist

- [ ] old truth path named explicitly (flat literals; root-level realization)
- [ ] new truth path named explicitly (admitted topology declaration)
- [ ] producer and consumer sets listed and migrated
- [ ] projection/proof surfaces listed and repriced (fixtures re-scaffolded)
- [ ] old flat-path literals removed, not bridged; mixed-state not accepted
- [ ] reduced witness profile is declared data with its own admission rule
- [ ] ABG boundary respected: GLC declares structure; ABG confines writes;
      no odd_glc-local enforcement controller
- [ ] re-entry walkthrough proof on a generated subject recorded
- [ ] ticket/product/proof wording reconciled before closure

## Non-Goals

- No change to `support/0.1.x` (frozen flat shape; corporate patch line).
- No ABG core change; the write-root confinement law is consumed as-is.
- No claim about the capability-denial classification follow-up (separate
  ABG-line ticket).

## Notes

One-line articulation (F_H-approved framing): today the graph writes files
into a shape; after this ticket the graph admits a shape and then writes
files into what it admitted.
