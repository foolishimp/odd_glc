---
id: T-031
title: Close the data-mapper by delivered requirements proven by exhaustive typed UAT
type: implementation
ticket_category: realization
status: active
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
closure_evidence: []
campaign_ledger: []
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
