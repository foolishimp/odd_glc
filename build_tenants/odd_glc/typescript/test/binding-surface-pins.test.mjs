// T-214 companion — unit-lane pins for the binding-surface exports the
// export-pin conformance rule found undriven (they were exercised only
// by the env-gated live lane, which is exactly how the T-032 Review B
// ReferenceError shipped). Each pin drives the export and holds its
// contract shape.
import test from "node:test";
import assert from "node:assert/strict";

import {
  ABI_PROVENANCE_REF,
  ODD_GLC_FH_HUMAN_DECISION_POLICY_REF,
  ODD_GLC_FP_SEMANTIC_POLICY_REF,
  ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY_REF,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY_REF,
  OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS,
  REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS,
  REQUIRED_EVIDENCE_EVENT_KINDS,
  REQUIRED_GTL_DECLARATION_FACADE_SLOTS,
  REQUIRED_GTL_NODE_TYPE_FACADE_FUNCTIONS,
  REQUIRED_GTL_REGISTRY_DECLARATION_FUNCTIONS
} from "../src/index.mjs";

test("binding surface: substrate/policy/overlay refs are well-formed constants", () => {
  assert.match(ABI_PROVENANCE_REF, /^provenance:\/\/abiogenesis\/\d/u);
  assert.equal(
    ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY_REF,
    "overlay://odd_glc/general-lifecycle"
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_OVERLAY_REF,
    "overlay://odd_glc/software-build-lifecycle"
  );
  assert.match(ODD_GLC_FP_SEMANTIC_POLICY_REF, /^policy:\/\/odd_glc\//u);
  assert.match(ODD_GLC_FH_HUMAN_DECISION_POLICY_REF, /^policy:\/\/odd_glc\//u);
});

test("binding surface: substrate capability contracts are frozen, typed, non-empty", () => {
  for (const [label, values] of [
    ["REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS", REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS],
    ["OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS", OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS],
    ["REQUIRED_EVIDENCE_EVENT_KINDS", REQUIRED_EVIDENCE_EVENT_KINDS],
    ["REQUIRED_GTL_NODE_TYPE_FACADE_FUNCTIONS", REQUIRED_GTL_NODE_TYPE_FACADE_FUNCTIONS],
    ["REQUIRED_GTL_REGISTRY_DECLARATION_FUNCTIONS", REQUIRED_GTL_REGISTRY_DECLARATION_FUNCTIONS]
  ]) {
    assert.ok(Object.isFrozen(values), `${label} must be frozen`);
    assert.ok(Array.isArray(values), `${label} must be an array`);
    if (label.startsWith("REQUIRED_")) {
      assert.ok(values.length > 0, `${label} must be non-empty`);
    }
    for (const value of values) {
      assert.equal(typeof value, "string", `${label} rows are strings`);
      assert.ok(value.length > 0, `${label} rows are non-empty`);
    }
  }
  assert.ok(Object.isFrozen(REQUIRED_GTL_DECLARATION_FACADE_SLOTS));
  assert.ok(
    Object.keys(REQUIRED_GTL_DECLARATION_FACADE_SLOTS).length > 0,
    "facade slots must name at least one slot"
  );
});
