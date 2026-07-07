// T-030 lineage-canary differentials (non-live).
//
// The canary is diagnostic proof instrumentation: a read-only derivation
// over ABG replay events. These fixtures are condensed from the real
// converged basic-cli run (20260707T182313409Z_pid51926): requirement
// REQ-GLC-SB-001 spans vector 7; carry-through admits eligible coverage;
// the fold satisfies. The differentials pin the DROP LAW: downstream
// silence after a reached requirement-bearing vector is dropped; an
// unreached vector is not_reached, not dropped; residual pressure is
// reported, not dropped.
import test from "node:test";
import assert from "node:assert/strict";

import { deriveRequirementLineageCanary } from "../src/lineage_canary.mjs";

const REQ = "REQ-GLC-SB-001";
const SPAN = "span://odd_glc/software-build/basic-cli/final-prove";
const COVERAGE_REF =
  "abg://requirement-proof-coverage/eligible/sha256:x/result%3A%2F%2Fx/REQ-GLC-SB-001";
const RESIDUAL_COVERAGE_REF =
  "abg://requirement-proof-coverage/residual/sha256:y/carry-through-close%3A%2F%2Fx/REQ-GLC-SB-001";

function routeFact(payload) {
  return { kind: "requirement_route_fact_projected", requirementPayload: payload };
}

function declarationFacts() {
  return [
    routeFact({
      kind: "requirement_term_admitted",
      term: { requirementId: REQ, spanRefs: [SPAN] }
    }),
    routeFact({
      kind: "traversal_span_admitted",
      span: { spanId: SPAN, vectorIndexes: [7] }
    }),
    routeFact({
      kind: "requirement_projection_admitted",
      projection: { requirementId: REQ, spanId: SPAN, projectionRole: "obligation" }
    })
  ];
}

function vectorClose(vectorIndex, edge, closedAt) {
  return { kind: "vector_closed", vectorIndex, edge, eventTimeUnixMs: closedAt };
}

function vectorPlan(vectorIndex, plannedAt) {
  return { kind: "vector_traversal_planned", vectorIndex, eventTimeUnixMs: plannedAt };
}

function carryAdmitted() {
  return {
    kind: "requirement_proof_carry_through_admitted",
    vectorIndex: 7,
    accepted: true,
    coverageRequirementIds: [REQ],
    coverageStatuses: ["eligible"],
    coverageTruthRefs: [COVERAGE_REF]
  };
}

function foldProjected(state, sourceRefs, residualRefs = []) {
  return routeFact({
    kind: "requirement_fold_projected",
    fold: {
      requirementId: REQ,
      state,
      sourceAbgTruthRefs: sourceRefs,
      residualPressureRefs: residualRefs
    }
  });
}

test("T-030 canary: satisfied chain reports coverage and zero dropped", () => {
  const canary = deriveRequirementLineageCanary({
    events: [
      ...declarationFacts(),
      vectorPlan(7, 1000),
      { kind: "instruction_prompt_manifest_projected", vectorIndex: 7, includedCarrierRefs: ["node:{...}"] },
      carryAdmitted(),
      foldProjected("satisfied", [COVERAGE_REF]),
      vectorClose(7, "software_build_test_execution_result", 5000)
    ]
  });
  assert.equal(canary.kind, "odd_glc_requirement_lineage_canary");
  assert.equal(canary.role, "diagnostic_proof_instrumentation_read_only");
  assert.deepEqual([...canary.droppedRequirementIds], []);
  const row = canary.requirements.find((r) => r.requirementId === REQ);
  assert.ok(row);
  assert.deepEqual([...row.vectorIndexes], [7]);
  assert.deepEqual([...row.reachedVectorIndexes], [7]);
  assert.equal(row.carryThroughAdmittedCount, 1);
  assert.deepEqual([...row.coverageStatuses], ["eligible"]);
  assert.deepEqual([...row.foldStates], ["satisfied"]);
  assert.equal(row.dropped, false);
  const vector = canary.vectors.find((v) => v.vectorIndex === 7);
  assert.equal(vector.durationMs, 4000);
  assert.equal(vector.manifestCount, 1);
});

test("T-030 canary DROP LAW: reached vector with downstream silence is dropped", () => {
  const canary = deriveRequirementLineageCanary({
    events: [
      ...declarationFacts(),
      vectorPlan(7, 1000),
      vectorClose(7, "software_build_test_execution_result", 5000)
      // no carry-through, no coverage, no fold, no residual: SILENCE
    ]
  });
  assert.deepEqual([...canary.droppedRequirementIds], [REQ]);
  const row = canary.requirements.find((r) => r.requirementId === REQ);
  assert.equal(row.dropped, true);
});

test("T-030 canary: unreached span vector is not_reached, never dropped", () => {
  const canary = deriveRequirementLineageCanary({
    events: [
      ...declarationFacts(),
      vectorPlan(3, 1000),
      vectorClose(3, "software_build_test_design", 2000)
      // traversal stopped before vector 7
    ]
  });
  assert.deepEqual([...canary.droppedRequirementIds], []);
  const row = canary.requirements.find((r) => r.requirementId === REQ);
  assert.deepEqual([...row.notReachedVectorIndexes], [7]);
  assert.deepEqual([...row.reachedVectorIndexes], []);
  assert.equal(row.dropped, false);
});

test("T-030 canary: residual coverage pressure is reported, not dropped", () => {
  const canary = deriveRequirementLineageCanary({
    events: [
      ...declarationFacts(),
      vectorPlan(7, 1000),
      foldProjected("no_close_preserved", [RESIDUAL_COVERAGE_REF], [
        "requirement-residual:REQ-GLC-SB-001:no_close_preserved"
      ]),
      vectorClose(7, "software_build_test_execution_result", 5000)
    ]
  });
  assert.deepEqual([...canary.droppedRequirementIds], []);
  const row = canary.requirements.find((r) => r.requirementId === REQ);
  assert.deepEqual([...row.coverageStatuses], ["residual"]);
  assert.deepEqual([...row.foldStates], ["no_close_preserved"]);
  assert.equal(row.residualPressureRefs.length, 1);
  assert.equal(row.dropped, false);
});

test("T-030 canary is total over empty and foreign replay shapes", () => {
  assert.deepEqual([...deriveRequirementLineageCanary({ events: [] }).requirements], []);
  assert.deepEqual([...deriveRequirementLineageCanary({}).requirements], []);
  const foreign = deriveRequirementLineageCanary({
    events: [{ kind: "payload_observed" }, { kind: "requirement_route_fact_projected" }]
  });
  assert.deepEqual([...foreign.droppedRequirementIds], []);
});
