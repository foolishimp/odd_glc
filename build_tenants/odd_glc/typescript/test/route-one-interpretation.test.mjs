import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES,
  REQUIRED_ROUTE_ONE_SURFACES,
  defineLifecycleSurfaceMap,
  definePolicyOverlay,
  interpretLifecycleState,
  validateAbgRequirementsFacade
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const defaultAbgRoot = path.join(
  appsRoot,
  ".abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/lib/node_modules/@abiogenesis/typescript-tenant"
);

async function importAbgRequirementsFacade() {
  const packageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgRoot;
  const facadePath = path.join(packageRoot, "build/semantic/code/src/abg/requirements/index.js");
  assert.equal(existsSync(facadePath), true, `Missing installed ABIogenesis facade at ${facadePath}`);
  return import(pathToFileURL(facadePath).href);
}

function surfaceMapFixture() {
  return Object.fromEntries(
    REQUIRED_ROUTE_ONE_SURFACES.map((surface) => [surface, `glc.route1.${surface}`])
  );
}

const queryFixture = Object.freeze({
  kind: "requirement_query_read_model",
  requirementIds: Object.freeze(["REQ-HELLO-WORLD-GREETING"])
});

const dispositionPayload = Object.freeze({
  kind: "requirement_lifecycle_disposition",
  dispositionRef: "disp:hello-world:closed",
  disposition: "closed",
  residualRefs: Object.freeze([]),
  continuationRefs: Object.freeze([]),
  reentryRefs: Object.freeze([]),
  policyRefs: Object.freeze(["policy:hello-world:release-readiness"]),
  reason: "all route-1 requirement pressure is closed"
});

const replayFactsFixture = Object.freeze([
  Object.freeze({
    kind: "requirement_lifecycle_disposition",
    ref: "disp:hello-world:closed",
    sourceEventRef: "event:requirement-route:disposition:closed",
    payload: dispositionPayload
  })
]);

test("validates the installed ABG requirements public query facade", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const result = validateAbgRequirementsFacade(abgRequirements);

  assert.equal(result.status, "accepted");
  assert.equal(result.value.kind, "abg_requirements_query_facade");
  assert.ok(result.value.availableFunctions.includes("projectLifecycleState"));
  for (const forbidden of FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES) {
    assert.equal(Object.hasOwn(abgRequirements, forbidden), false, `${forbidden} must not be public`);
  }
});

test("interprets ABG lifecycle state as odd_glc release/readiness vocabulary", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const surfaceMap = defineLifecycleSurfaceMap({ surfaces: surfaceMapFixture() });
  const policy = definePolicyOverlay({
    id: "policy:hello-world",
    fp: {
      greetingExpectation: "stdout contains the declared greeting"
    },
    fh: {
      readinessDecision: "release/readiness may be interpreted only from ABG closed disposition"
    }
  });

  assert.equal(surfaceMap.status, "accepted");
  assert.equal(policy.status, "accepted");

  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze(["disp:hello-world:closed"]),
    replayFacts: replayFactsFixture,
    surfaceMap: surfaceMap.value,
    policyOverlay: policy.value
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.kind, "odd_glc_lifecycle_state_view");
  assert.equal(result.value.lifecycleDisposition, "release_readiness_candidate");
  assert.deepEqual(result.value.requirementIds, ["REQ-HELLO-WORLD-GREETING"]);
  assert.deepEqual(result.value.dispositionRefs, ["disp:hello-world:closed"]);
  assert.deepEqual(result.value.sourceEventRefs, ["event:requirement-route:disposition:closed"]);
  assert.equal(result.value.policyOverlayId, "policy:hello-world");
  assert.equal(result.value.interpretedDispositions[0].disposition, "closed");
});

test("fails closed when ABG cannot resolve a disposition ref", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze(["disp:missing"]),
    replayFacts: Object.freeze([])
  });

  assert.equal(result.status, "rejected");
  assert.equal(result.reason, "abg_query_rejected");
  assert.match(result.diagnostics.join("\n"), /Unknown requirement lifecycle disposition ref/);
});

test("rejects ABG runtime-internal authority on the consumed facade", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const result = validateAbgRequirementsFacade({
    ...abgRequirements,
    emitRequirementRouteFactsForEdgeClose: () => undefined
  });

  assert.equal(result.status, "rejected");
  assert.equal(result.reason, "forbidden_authority");
});

test("keeps F_P and F_H policy surfaces as data declarations", () => {
  const acceptedPolicy = definePolicyOverlay({
    id: "policy:data-only",
    fp: {
      rubric: "semantic assessment text"
    },
    fh: {
      owner: "release steward"
    }
  });
  assert.equal(acceptedPolicy.status, "accepted");

  const rejectedPolicy = definePolicyOverlay({
    id: "policy:bad",
    fp: {
      invokeWorker: () => "not allowed"
    }
  });
  assert.equal(rejectedPolicy.status, "rejected");
  assert.equal(rejectedPolicy.reason, "forbidden_authority");
});

test("does not export local runtime authority", async () => {
  const module = await import("../src/index.mjs");
  for (const forbidden of FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES) {
    assert.equal(Object.hasOwn(module, forbidden), false, `${forbidden} must not be exported by odd_glc`);
  }
  assert.equal(Object.hasOwn(module, "runFpWorker"), false);
  assert.equal(Object.hasOwn(module, "emitRuntimeEvent"), false);
  assert.equal(Object.hasOwn(module, "foldRequirementEvidence"), false);
});
