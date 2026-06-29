import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES,
  REQUIRED_ROUTE_ONE_SURFACES,
  defineLifecycleSurfaceMap,
  definePolicyOverlay,
  interpretAssuranceState,
  interpretEvidenceState,
  interpretLifecycleState,
  validateAbgRequirementsFacade
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const T165_REQUIREMENT_ID = "REQ-T165-HELLO-WORLD-LIVE";
const defaultAbgRoot = path.join(
  appsRoot,
  `.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}/lib/node_modules/@abiogenesis/typescript-tenant`
);
const defaultT166ArtifactPath = path.join(
  tenantRoot,
  "test/fixtures/abiogenesis-t166-route-replay/20260628T175945864Z_pid34852/requirements-route-replay-artifact.json"
);

async function importAbgRequirementsFacade() {
  const packageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgRoot;
  const facadePath = path.join(packageRoot, "build/semantic/code/src/abg/requirements/index.js");
  assert.equal(existsSync(facadePath), true, `Missing installed ABIogenesis facade at ${facadePath}`);
  return import(pathToFileURL(facadePath).href);
}

async function readInstalledPackageJson() {
  const packageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgRoot;
  const packageJsonPath = path.join(packageRoot, "package.json");
  assert.equal(existsSync(packageJsonPath), true, `Missing installed ABIogenesis package.json at ${packageJsonPath}`);
  return JSON.parse(await import("node:fs/promises").then((fs) => fs.readFile(packageJsonPath, "utf8")));
}

function t166RouteReplayArtifactPath() {
  if (process.env.ODD_GLC_T166_ROUTE_REPLAY_ARTIFACT !== undefined) {
    return process.env.ODD_GLC_T166_ROUTE_REPLAY_ARTIFACT;
  }
  assert.equal(
    existsSync(defaultT166ArtifactPath),
    true,
    `Missing committed ABIogenesis T-166 route replay fixture at ${defaultT166ArtifactPath}`
  );
  return defaultT166ArtifactPath;
}

async function readT166RouteReplayArtifact() {
  const artifactPath = t166RouteReplayArtifactPath();
  const manifestPath = path.join(
    path.dirname(artifactPath),
    "requirements-route-replay-manifest.json"
  );
  assert.equal(existsSync(manifestPath), true, `Missing ABIogenesis T-166 manifest at ${manifestPath}`);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(
    manifest.artifact.sha256,
    `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`
  );
  assert.equal(
    manifest.artifact.sha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.t166RouteReplay.artifactSha256
  );
  return Object.freeze({
    artifactPath,
    manifestPath,
    artifact,
    manifest
  });
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

function stableJson(input) {
  if (input === null || typeof input !== "object") {
    return JSON.stringify(input);
  }
  if (Array.isArray(input)) {
    return `[${input.map((entry) => stableJson(entry)).join(",")}]`;
  }
  return `{${Object.entries(input)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${JSON.stringify(key)}:${stableJson(value)}`)
    .join(",")}}`;
}

function stableSha256Digest(input) {
  return `sha256:${createHash("sha256").update(stableJson(input)).digest("hex")}`;
}

function requirementRouteRuntimeEventFixture(payload = dispositionPayload) {
  return Object.freeze({
    kind: "requirement_route_fact_projected",
    basisId: "basis:hello-world",
    graphFunctionId: "graph-function:hello-world",
    runId: "basis:hello-world",
    workKey: null,
    graphCallId: "graph-call:hello-world",
    frameId: "frame:hello-world",
    vectorIndex: 0,
    edge: "edge:hello-world",
    routeEventRef: "event:requirement-route:runtime:closed",
    routePayloadKind: payload.kind,
    routePayloadRef: payload.dispositionRef,
    routePayloadDigest: stableSha256Digest(payload),
    requirementPayload: payload,
    sourceEventRefs: Object.freeze(["event:assurance-close:hello-world"]),
    sourceProjectionRefs: Object.freeze([payload.dispositionRef]),
    causationEventRefs: Object.freeze(["event:evidence-admitted:hello-world"]),
    correlationId: "correlation://requirement-route/basis%3Ahello-world/0/test"
  });
}

function replayFactsForDisposition(disposition, ref = `disp:hello-world:${disposition}`) {
  const payload = Object.freeze({
    ...dispositionPayload,
    dispositionRef: ref,
    disposition,
    reason: `route-1 disposition is ${disposition}`
  });
  return Object.freeze([
    Object.freeze({
      kind: "requirement_lifecycle_disposition",
      ref,
      sourceEventRef: `event:requirement-route:disposition:${disposition}`,
      payload
    })
  ]);
}

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

test("declares and verifies the consumed ABIogenesis substrate identity", async () => {
  const packageJson = await readInstalledPackageJson();

  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.kind, "odd_glc_consumed_substrate_provenance");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.consumerTenant, "build_tenants/odd_glc/typescript");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.productId, "abiogenesis");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageName, "@abiogenesis/typescript-tenant");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion, "4.1.0-rc.13");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.releaseTag, "v4.1.0-rc.13");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.sourceCommit, "cc34cf53ceee8d22fba723f47946523eb4d405f8");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.snapshotCommit, "d7e044f");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.tarballSha256, "3794567f58ee690e78f4538379198e4c0957f7e69e4f2b95a91885462f2a697a");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.productToolchainManifestDigest, "9576baeafc1000bd4eb29daec4eedf6193f3f53e045839417b036f7ec4d79b13");
  assert.equal(packageJson.name, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageName);
  assert.equal(packageJson.version, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion);
  assert.equal(
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofScope.phase,
    "phase_5_real_route_replay_consumption"
  );
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

test("consumes real ABIogenesis T-166 route replay artifact", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, artifactPath, manifest } = await readT166RouteReplayArtifact();

  assert.equal(artifact.kind, "abg_requirements_route_replay_artifact");
  assert.equal(manifest.kind, "abg_requirements_route_replay_artifact_manifest");
  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true);
  assert.equal(
    artifact.routeEvents.some((event) =>
      event.routePayloadKind === "requirement_fold_projected"
    ),
    true
  );
  assert.equal(
    artifact.routeEvents.some((event) =>
      event.routePayloadKind === "requirement_lifecycle_disposition"
    ),
    true
  );

  const result = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(result.status, "accepted", artifactPath);
  assert.equal(result.value.lifecycleDisposition, "release_readiness_candidate");
  assert.deepEqual(result.value.dispositionRefs, artifact.lifecycleState.dispositionRefs);
  assert.equal(result.value.interpretedDispositions[0].disposition, "closed");
  assert.equal(result.value.requirementIds.includes(T165_REQUIREMENT_ID), true);
});

test("interprets evidence and target artifact state from real ABIogenesis replay events", async () => {
  const { artifact } = await readT166RouteReplayArtifact();
  const result = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.kind, "odd_glc_evidence_state_view");
  assert.equal(result.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(result.value.runtimeEventCount, artifact.replayEvents.length);
  assert.equal(result.value.targetArtifactRefs.length, 1);
  assert.equal(
    result.value.targetArtifactRefs[0],
    "result://t165/hello-world-live/input_set%E2%86%92requirements"
  );
  assert.equal(result.value.capabilityRefs.includes("worker://m03-iteration"), true);
  assert.equal(result.value.capabilityRefs.includes("backend://node"), true);
  assert.equal(result.value.capabilityRefs.includes("dispatch://t165/hello-world-live"), true);
  assert.equal(result.value.admittedEvidence.length, 5);
  assert.equal(
    result.value.admittedEvidence.every((evidence) =>
      evidence.complete === true &&
      evidence.deferred === false &&
      evidence.contradictsAuthority === false
    ),
    true
  );
  assert.equal(
    result.value.requirementEvidenceBindings.some((binding) =>
      binding.requirementId === T165_REQUIREMENT_ID &&
      binding.bindingStatus === "admitted"
    ),
    true
  );
});

test("evidence interpretation does not treat route bindings alone as executed proof", () => {
  const result = interpretEvidenceState({
    runtimeEvents: Object.freeze([
      Object.freeze({
        kind: "requirement_route_fact_projected",
        routePayloadKind: "requirement_evidence_bound",
        routePayloadRef: "binding:fixture",
        routeEventRef: "event:route:binding",
        requirementPayload: Object.freeze({
          binding: Object.freeze({
            evidenceRef: "evidence:fixture",
            requirementId: "REQ-FIXTURE",
            projectionRef: "projection:fixture",
            evidenceRole: "asset",
            bindingStatus: "admitted",
            digest: "sha256:fixture"
          })
        })
      })
    ])
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.evidenceDisposition, "bound_without_runtime_evidence");
  assert.deepEqual(result.value.targetArtifactRefs, []);
});

test("interprets assurance fold state from real ABIogenesis replay events", async () => {
  const { artifact } = await readT166RouteReplayArtifact();
  const result = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.kind, "odd_glc_assurance_state_view");
  assert.equal(result.value.assuranceDisposition, "assurance_satisfied");
  assert.deepEqual(result.value.foldStates, ["satisfied"]);
  assert.equal(result.value.foldRefs.length, 1);
  assert.equal(result.value.residualRefs.length, 0);
  assert.equal(result.value.dispositionRefs.length, 1);
  assert.equal(result.value.evidenceRefs.length >= 1, true);
  assert.equal(result.value.sourceAbgTruthRefs.length, 1);
  assert.equal(result.value.runtimeEventCount, artifact.replayEvents.length);
});

test("interprets residual pressure from replay-shaped ABG route events", () => {
  const residualRef = "requirement-residual://fixture/needs-repair";
  const result = interpretAssuranceState({
    runtimeEvents: Object.freeze([
      Object.freeze({
        kind: "requirement_route_fact_projected",
        routePayloadKind: "requirement_fold_projected",
        routePayloadRef: "requirement-fold://fixture/partial",
        routeEventRef: "event:route:fold:partial",
        requirementPayload: Object.freeze({
          fold: Object.freeze({
            foldRef: "requirement-fold://fixture/partial",
            requirementId: "REQ-FIXTURE",
            requirementProjectionRef: "projection://fixture",
            state: "partial",
            evidenceRefs: Object.freeze(["evidence://fixture"]),
            evidenceBindingRefs: Object.freeze(["binding://fixture"]),
            sourceAbgTruthRefs: Object.freeze(["assurance://fixture"])
          })
        })
      }),
      Object.freeze({
        kind: "requirement_route_fact_projected",
        routePayloadKind: "requirement_residual_projected",
        routePayloadRef: residualRef,
        routeEventRef: "event:route:residual",
        requirementPayload: Object.freeze({
          residual: Object.freeze({
            residualRef,
            requirementId: "REQ-FIXTURE",
            requirementProjectionRef: "projection://fixture",
            foldRef: "requirement-fold://fixture/partial",
            pressureClass: "repair",
            ownerSurface: "F_P",
            evidenceRefs: Object.freeze(["evidence://fixture"]),
            sourceFoldRefs: Object.freeze(["requirement-fold://fixture/partial"])
          })
        })
      })
    ])
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.assuranceDisposition, "residual_pressure");
  assert.deepEqual(result.value.foldStates, ["partial"]);
  assert.deepEqual(result.value.residualRefs, [residualRef]);
  assert.equal(result.value.residuals[0].pressureClass, "repair");
});

test("interprets disposition payloads from ABG requirement-route runtime events", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze(["disp:hello-world:closed"]),
    runtimeEvents: Object.freeze([
      requirementRouteRuntimeEventFixture()
    ])
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.lifecycleDisposition, "release_readiness_candidate");
  assert.deepEqual(result.value.sourceEventRefs, ["event:requirement-route:runtime:closed"]);
  assert.equal(result.value.interpretedDispositions[0].dispositionRef, "disp:hello-world:closed");
});

test("maps every ABG route-1 disposition into odd_glc lifecycle vocabulary", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const cases = Object.freeze([
    ["closed", "release_readiness_candidate"],
    ["continuation_available", "continuation_available"],
    ["reentry_available", "reentry_available"],
    ["blocked", "blocked"]
  ]);

  for (const [abgDisposition, oddGlcDisposition] of cases) {
    const ref = `disp:hello-world:${abgDisposition}`;
    const result = interpretLifecycleState({
      abgRequirements,
      query: queryFixture,
      dispositionRefs: Object.freeze([ref]),
      replayFacts: replayFactsForDisposition(abgDisposition, ref)
    });

    assert.equal(result.status, "accepted");
    assert.equal(result.value.lifecycleDisposition, oddGlcDisposition);
  }
});

test("uses conservative disposition priority when multiple ABG dispositions are present", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const dispositions = Object.freeze([
    replayFactsForDisposition("closed", "disp:closed")[0],
    replayFactsForDisposition("continuation_available", "disp:continuation")[0],
    replayFactsForDisposition("reentry_available", "disp:reentry")[0],
    replayFactsForDisposition("blocked", "disp:blocked")[0]
  ]);
  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze(["disp:closed", "disp:continuation", "disp:reentry", "disp:blocked"]),
    replayFacts: dispositions
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.lifecycleDisposition, "blocked");
});

test("reports no disposition when ABG accepts an empty disposition query", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze([]),
    replayFacts: Object.freeze([])
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.lifecycleDisposition, "no_disposition");
  assert.deepEqual(result.value.interpretedDispositions, []);
});

test("ignores mismatched runtime-event disposition payloads", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const mismatchedPayload = Object.freeze({
    ...dispositionPayload,
    dispositionRef: "disp:mismatch"
  });
  const event = Object.freeze({
    ...requirementRouteRuntimeEventFixture(mismatchedPayload),
    routePayloadRef: "disp:hello-world:closed"
  });
  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze(["disp:hello-world:closed"]),
    runtimeEvents: Object.freeze([event])
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.lifecycleDisposition, "no_disposition");
  assert.deepEqual(result.value.interpretedDispositions, []);
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
