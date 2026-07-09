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
  ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY,
  REQUIRED_ROUTE_ONE_SURFACES,
  definePolicyOverlay,
  interpretAssuranceState,
  interpretEvidenceState,
  interpretLifecycleState,
  interpretParallelFrontierState,
  validateAbgRequirementsFacade
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const BASIC_CLI_SCENARIO_ID = "SCN-GLC-HELLO-WORLD-CLI-BASIC";
const RUST_CLI_SCENARIO_ID = "SCN-GLC-HELLO-WORLD-RUST-CLI";
const RUST_SERVICE_SCENARIO_ID = "SCN-GLC-HELLO-WORLD-RUST-SERVICE";
const JS_TENANT_TEST_SCENARIO_ID = "SCN-GLC-HELLO-WORLD-JS-TENANT-TEST";
const PARALLEL_JS_SCENARIO_ID = "SCN-GLC-HELLO-WORLD-PARALLEL-JS";
const defaultAbgRoot = path.join(
  appsRoot,
  `.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}/lib/node_modules/@abiogenesis/typescript-tenant`
);
const defaultBasicCliArtifactPath = path.join(
  tenantRoot,
  "test/proof_inputs/abiogenesis-basic-cli-route-replay/20260628T175945864Z_pid34852/requirements-route-replay-artifact.json"
);
const defaultRustCliArtifactPath = path.join(
  tenantRoot,
  "test/proof_inputs/abiogenesis-rust-cli-toolchain-execution/20260629T134455708Z_pid97032/non-js-toolchain-replay-artifact.json"
);
const defaultRustServiceArtifactPath = path.join(
  tenantRoot,
  "test/proof_inputs/abiogenesis-rust-service-process-request/20260629T140453156Z_pid14978/service-process-request-replay-artifact.json"
);
const defaultJsTenantTestArtifactPath = path.join(
  tenantRoot,
  "test/proof_inputs/abiogenesis-js-tenant-test-proof-evidence/20260629T131855445Z_pid76289/generic-proof-evidence-replay-artifact.json"
);
const defaultParallelJsArtifactPath = path.join(
  tenantRoot,
  "test/proof_inputs/abiogenesis-parallel-js-hello-world/20260629T174248134Z_pid74140/parallel-hello-world-replay-artifact.json"
);

function containsFunction(value) {
  if (typeof value === "function") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(containsFunction);
  }
  if (value === null || typeof value !== "object") {
    return false;
  }
  return Object.values(value).some(containsFunction);
}

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

function basicCliProofArtifactPath() {
  if (process.env.ODD_GLC_BASIC_CLI_PROOF_ARTIFACT !== undefined) {
    return process.env.ODD_GLC_BASIC_CLI_PROOF_ARTIFACT;
  }
  assert.equal(
    existsSync(defaultBasicCliArtifactPath),
    true,
    `Missing committed ABIogenesis basic CLI proof input at ${defaultBasicCliArtifactPath}`
  );
  return defaultBasicCliArtifactPath;
}

async function readBasicCliProofArtifact() {
  const artifactPath = basicCliProofArtifactPath();
  const manifestPath = path.join(
    path.dirname(artifactPath),
    "requirements-route-replay-manifest.json"
  );
  assert.equal(existsSync(manifestPath), true, `Missing ABIogenesis basic CLI manifest at ${manifestPath}`);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(
    manifest.artifact.sha256,
    `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`
  );
  assert.equal(
    manifest.artifact.sha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.basicCliRouteReplay.artifactSha256
  );
  return Object.freeze({
    artifactPath,
    manifestPath,
    artifact,
    manifest
  });
}

function rustCliProofArtifactPath() {
  if (process.env.ODD_GLC_RUST_CLI_PROOF_ARTIFACT !== undefined) {
    return process.env.ODD_GLC_RUST_CLI_PROOF_ARTIFACT;
  }
  assert.equal(
    existsSync(defaultRustCliArtifactPath),
    true,
    `Missing committed ABIogenesis Rust CLI proof input at ${defaultRustCliArtifactPath}`
  );
  return defaultRustCliArtifactPath;
}

async function readRustCliProofArtifact() {
  const artifactPath = rustCliProofArtifactPath();
  const manifestPath = path.join(
    path.dirname(artifactPath),
    "non-js-toolchain-replay-manifest.json"
  );
  assert.equal(existsSync(manifestPath), true, `Missing ABIogenesis Rust CLI manifest at ${manifestPath}`);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(
    manifest.artifact.sha256,
    `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`
  );
  assert.equal(
    manifest.artifact.sha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.rustCliToolchainExecution.artifactSha256
  );
  return Object.freeze({
    artifactPath,
    manifestPath,
    artifact,
    manifest
  });
}

function rustServiceProofArtifactPath() {
  if (process.env.ODD_GLC_RUST_SERVICE_PROOF_ARTIFACT !== undefined) {
    return process.env.ODD_GLC_RUST_SERVICE_PROOF_ARTIFACT;
  }
  assert.equal(
    existsSync(defaultRustServiceArtifactPath),
    true,
    `Missing committed ABIogenesis Rust service proof input at ${defaultRustServiceArtifactPath}`
  );
  return defaultRustServiceArtifactPath;
}

async function readRustServiceProofArtifact() {
  const artifactPath = rustServiceProofArtifactPath();
  const manifestPath = path.join(
    path.dirname(artifactPath),
    "service-process-request-replay-manifest.json"
  );
  assert.equal(existsSync(manifestPath), true, `Missing ABIogenesis Rust service manifest at ${manifestPath}`);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(
    manifest.artifact.sha256,
    `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`
  );
  assert.equal(
    manifest.artifact.sha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.rustServiceProcessRequest.artifactSha256
  );
  return Object.freeze({
    artifactPath,
    manifestPath,
    artifact,
    manifest
  });
}

function jsTenantTestProofArtifactPath() {
  if (process.env.ODD_GLC_JS_TENANT_TEST_PROOF_ARTIFACT !== undefined) {
    return process.env.ODD_GLC_JS_TENANT_TEST_PROOF_ARTIFACT;
  }
  assert.equal(
    existsSync(defaultJsTenantTestArtifactPath),
    true,
    `Missing committed ABIogenesis JS tenant/test proof input at ${defaultJsTenantTestArtifactPath}`
  );
  return defaultJsTenantTestArtifactPath;
}

async function readJsTenantTestProofArtifact() {
  const artifactPath = jsTenantTestProofArtifactPath();
  const manifestPath = path.join(
    path.dirname(artifactPath),
    "generic-proof-evidence-replay-manifest.json"
  );
  assert.equal(existsSync(manifestPath), true, `Missing ABIogenesis JS tenant/test manifest at ${manifestPath}`);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(
    manifest.artifact.sha256,
    `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`
  );
  assert.equal(
    manifest.artifact.sha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.jsTenantTestProofEvidence.artifactSha256
  );
  return Object.freeze({
    artifactPath,
    manifestPath,
    artifact,
    manifest
  });
}

function parallelJsProofArtifactPath() {
  if (process.env.ODD_GLC_PARALLEL_JS_PROOF_ARTIFACT !== undefined) {
    return process.env.ODD_GLC_PARALLEL_JS_PROOF_ARTIFACT;
  }
  assert.equal(
    existsSync(defaultParallelJsArtifactPath),
    true,
    `Missing committed ABIogenesis parallel JS proof input at ${defaultParallelJsArtifactPath}`
  );
  return defaultParallelJsArtifactPath;
}

async function readParallelJsProofArtifact() {
  const artifactPath = parallelJsProofArtifactPath();
  const manifestPath = path.join(
    path.dirname(artifactPath),
    "parallel-hello-world-replay-manifest.json"
  );
  assert.equal(existsSync(manifestPath), true, `Missing ABIogenesis parallel JS manifest at ${manifestPath}`);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(
    manifest.artifact.sha256,
    `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`
  );
  assert.equal(
    manifest.artifact.sha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.parallelJsHelloWorld.artifactSha256
  );
  return Object.freeze({
    artifactPath,
    manifestPath,
    artifact,
    manifest
  });
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

function sortedUniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]
    .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
}

function assertSameMembers(actual, expected, message) {
  assert.deepEqual(sortedUniqueStrings(actual), sortedUniqueStrings(expected), message);
}

function assertHasRequirements(artifact, expectedCount, scenarioId) {
  const requirementIds = artifact.lifecycleState.requirementQuery.requirementIds;
  assert.equal(
    Array.isArray(requirementIds) && requirementIds.length >= expectedCount,
    true,
    `${scenarioId} must preserve admitted ABI requirement ids`
  );
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

test("substrate provenance is never hollow: commits and digests carry well-formed values", () => {
  // T-031 campaign lesson: a repin once committed EMPTY commit/digest
  // fields and the literal pin test passed because both sides agreed on
  // emptiness. Format law makes hollow agreement impossible.
  const s = ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate;
  assert.match(s.sourceCommit, /^[0-9a-f]{40}$/u);
  assert.match(s.snapshotCommit, /^[0-9a-f]{40}$/u);
  assert.match(s.tarballSha256, /^[0-9a-f]{64}$/u);
  assert.match(s.productToolchainManifestDigest, /^[0-9a-f]{64}$/u);
  assert.match(s.releaseSnapshotManifestSha256, /^[0-9a-f]{64}$/u);
  assert.match(s.packageVersion, /^\d+\.\d+\.\d+(-rc\.\d+)?$/u);
});

test("declares and verifies the consumed ABIogenesis substrate identity", async () => {
  const packageJson = await readInstalledPackageJson();

  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.kind, "odd_glc_consumed_substrate_provenance");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.consumerTenant, "build_tenants/odd_glc/typescript");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.productId, "abiogenesis");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageName, "@abiogenesis/typescript-tenant");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion, "4.5.1");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.releaseTag, "v4.5.1");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.sourceCommit, "9d626942e609cfbfb87d75c25971dbb93fc019db");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.snapshotCommit, "d8ec1a36bfe3581f385bca517a6844284f68fc3c");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.tarballSha256, "2f4ad32df23a33f1220ca5781e63f412411acb301a92eebb7f20d0a25dc06f06");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.productToolchainManifestDigest, "939d31da4e5a9fdeee4f93e394e06736fec1f82d810c9bff78110e3f117d6c89");
  assert.equal(ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.releaseSnapshotManifestSha256, "ea02af9b1e02b036c92932cb04db32a8e0107f44c608d839f63421aa1af4fd59");
  assert.equal(packageJson.name, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageName);
  assert.equal(packageJson.version, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion);
  assert.equal(
    ABIOGENESIS_SUBSTRATE_PROVENANCE.proofScope.phase,
    "phase_12_generic_lifecycle_interpretation"
  );
});

test("interprets ABG lifecycle state as odd_glc release/readiness vocabulary", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const policy = definePolicyOverlay({
    id: "policy:hello-world",
    fp: {
      greetingExpectation: "stdout contains the declared greeting"
    },
    fh: {
      readinessDecision: "release/readiness may be interpreted only from ABG closed disposition"
    }
  });

  assert.equal(policy.status, "accepted");

  const result = interpretLifecycleState({
    abgRequirements,
    query: queryFixture,
    dispositionRefs: Object.freeze(["disp:hello-world:closed"]),
    replayFacts: replayFactsFixture,
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

test("consumes real ABIogenesis basic CLI route replay artifact", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, artifactPath, manifest } = await readBasicCliProofArtifact();

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
  assertHasRequirements(artifact, 1, BASIC_CLI_SCENARIO_ID);
});

test("proves SCN-GLC-HELLO-WORLD-CLI-BASIC over the committed ABI replay artifact", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest } = await readBasicCliProofArtifact();

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true, BASIC_CLI_SCENARIO_ID);
  assertHasRequirements(artifact, 1, BASIC_CLI_SCENARIO_ID);

  const routeBindings = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_evidence_bound"
  );
  const routeFolds = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_fold_projected"
  );
  const routeDispositions = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_lifecycle_disposition"
  );
  const admittedEvidenceEvents = artifact.replayEvents.filter((event) =>
    event.kind === "evidence_admitted"
  );
  const artifactObservationEvents = artifact.replayEvents.filter((event) =>
    event.kind === "actor_result_artifact_observed"
  );

  assert.equal(routeBindings.length > 0, true, `${BASIC_CLI_SCENARIO_ID} requires ABI evidence bindings`);
  assert.equal(routeFolds.length, 1, `${BASIC_CLI_SCENARIO_ID} requires one ABI fold projection`);
  assert.equal(routeDispositions.length, 1, `${BASIC_CLI_SCENARIO_ID} requires one ABI disposition`);
  assert.equal(admittedEvidenceEvents.length > 0, true, `${BASIC_CLI_SCENARIO_ID} requires admitted ABI evidence`);
  assert.equal(artifactObservationEvents.length, 1, `${BASIC_CLI_SCENARIO_ID} requires one target artifact observation`);

  const expectedTargetArtifactRefs = artifactObservationEvents.map((event) => event.artifactRef);
  const expectedAdmittedEvidenceRefs = admittedEvidenceEvents.map((event) => event.evidenceRef);
  const expectedBindingRefs = routeBindings.map((event) => event.routePayloadRef);
  const expectedFoldRefs = routeFolds.map((event) => event.requirementPayload.fold.foldRef);
  const expectedDispositionRefs = routeDispositions.map((event) => event.requirementPayload.dispositionRef);
  const expectedResidualRefs = artifact.lifecycleState.requirementQuery.residualRefs ?? [];

  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const evidence = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(lifecycle.status, "accepted", BASIC_CLI_SCENARIO_ID);
  assert.equal(evidence.status, "accepted", BASIC_CLI_SCENARIO_ID);
  assert.equal(assurance.status, "accepted", BASIC_CLI_SCENARIO_ID);

  assert.equal(lifecycle.value.lifecycleDisposition, "release_readiness_candidate");
  assert.deepEqual(lifecycle.value.dispositionRefs, artifact.lifecycleState.dispositionRefs);
  assertSameMembers(lifecycle.value.dispositionRefs, expectedDispositionRefs, "ABI disposition refs must be preserved");
  assertSameMembers(evidence.value.targetArtifactRefs, expectedTargetArtifactRefs, "ABI target artifact refs must be preserved");
  assertSameMembers(
    evidence.value.admittedEvidence.map((item) => item.evidenceRef),
    expectedAdmittedEvidenceRefs,
    "ABI admitted evidence refs must be preserved"
  );
  assertSameMembers(
    evidence.value.requirementEvidenceBindings.map((item) => item.routePayloadRef),
    expectedBindingRefs,
    "ABI evidence binding route refs must be preserved"
  );
  assertSameMembers(assurance.value.foldRefs, expectedFoldRefs, "ABI assurance fold refs must be preserved");
  assertSameMembers(assurance.value.residualRefs, expectedResidualRefs, "ABI residual refs must be preserved");
  assertSameMembers(assurance.value.dispositionRefs, expectedDispositionRefs, "ABI assurance disposition refs must be preserved");

  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(assurance.value.assuranceDisposition, "assurance_satisfied");
});

test("proves SCN-GLC-HELLO-WORLD-RUST-CLI over the committed ABI proof input", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest } = await readRustCliProofArtifact();

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true, RUST_CLI_SCENARIO_ID);
  assert.equal(manifest.artifact.routeEventCount, 20, RUST_CLI_SCENARIO_ID);
  assertHasRequirements(artifact, 1, RUST_CLI_SCENARIO_ID);

  const routeBindings = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_evidence_bound"
  );
  const routeFolds = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_fold_projected"
  );
  const routeDispositions = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_lifecycle_disposition"
  );
  const admittedEvidenceEvents = artifact.replayEvents.filter((event) =>
    event.kind === "evidence_admitted"
  );

  const roleBindingCounts = Object.freeze({
    asset: 2,
    test_source: 2,
    test_execution: 3,
    semantic_interpretation: 2
  });

  assert.equal(routeBindings.length, 9, `${RUST_CLI_SCENARIO_ID} requires ABI evidence bindings`);
  for (const [role, expectedCount] of Object.entries(roleBindingCounts)) {
    const roleBindings = routeBindings.filter((event) =>
      event.requirementPayload.binding.evidenceRole === role
    );
    assert.equal(roleBindings.length, expectedCount, `${role} binding count must match ABI replay truth`);
    assert.equal(
      roleBindings.every((event) =>
        event.requirementPayload.binding.projectionRef.startsWith("projection://") &&
        event.requirementPayload.binding.bindingStatus === "admitted"
      ),
      true,
      `${role} bindings must preserve admitted ABI projection refs`
    );
  }
  assert.equal(
    routeBindings.some((event) => event.requirementPayload.binding.evidenceRef.startsWith("exit-status://0")),
    true,
    `${RUST_CLI_SCENARIO_ID} must preserve admitted command outcome evidence`
  );
  assert.equal(routeFolds.length, 1, `${RUST_CLI_SCENARIO_ID} requires one ABI fold projection`);
  assert.equal(routeDispositions.length, 1, `${RUST_CLI_SCENARIO_ID} requires one ABI disposition`);

  const expectedBindingRefs = routeBindings.map((event) => event.routePayloadRef);
  const expectedFoldRefs = routeFolds.map((event) => event.requirementPayload.fold.foldRef);
  const expectedDispositionRefs = routeDispositions.map((event) => event.requirementPayload.dispositionRef);
  const expectedEvidenceRefs = admittedEvidenceEvents.map((event) => event.evidenceRef);

  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const evidence = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(lifecycle.status, "accepted", RUST_CLI_SCENARIO_ID);
  assert.equal(evidence.status, "accepted", RUST_CLI_SCENARIO_ID);
  assert.equal(assurance.status, "accepted", RUST_CLI_SCENARIO_ID);

  assert.equal(lifecycle.value.lifecycleDisposition, "release_readiness_candidate");
  assert.equal(lifecycle.value.requirementIds.length >= 1, true);
  assertSameMembers(lifecycle.value.dispositionRefs, expectedDispositionRefs, "ABI disposition refs must be preserved");
  assertSameMembers(
    evidence.value.requirementEvidenceBindings.map((item) => item.routePayloadRef),
    expectedBindingRefs,
    "ABI evidence binding route refs must be preserved"
  );
  assertSameMembers(
    evidence.value.admittedEvidence.map((item) => item.evidenceRef),
    expectedEvidenceRefs,
    "ABI admitted evidence refs must be preserved"
  );
  assertSameMembers(assurance.value.foldRefs, expectedFoldRefs, "ABI assurance fold refs must be preserved");
  assertSameMembers(assurance.value.dispositionRefs, expectedDispositionRefs, "ABI assurance disposition refs must be preserved");
  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(assurance.value.assuranceDisposition, "assurance_satisfied");
});

test("proves SCN-GLC-HELLO-WORLD-RUST-SERVICE over the committed ABI proof input", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest } = await readRustServiceProofArtifact();

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true, RUST_SERVICE_SCENARIO_ID);
  assert.equal(manifest.artifact.routeEventCount, 26, RUST_SERVICE_SCENARIO_ID);
  assertHasRequirements(artifact, 1, RUST_SERVICE_SCENARIO_ID);

  const routeBindings = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_evidence_bound"
  );
  const routeFolds = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_fold_projected"
  );
  const routeDispositions = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_lifecycle_disposition"
  );
  const admittedEvidenceEvents = artifact.replayEvents.filter((event) =>
    event.kind === "evidence_admitted"
  );

  const roleBindingCounts = Object.freeze({
    asset: 2,
    test_source: 2,
    test_execution: 8,
    semantic_interpretation: 3
  });

  assert.equal(routeBindings.length, 15, `${RUST_SERVICE_SCENARIO_ID} requires ABI evidence bindings`);
  for (const [role, expectedCount] of Object.entries(roleBindingCounts)) {
    const roleBindings = routeBindings.filter((event) =>
      event.requirementPayload.binding.evidenceRole === role
    );
    assert.equal(roleBindings.length, expectedCount, `${role} binding count must match ABI replay truth`);
    assert.equal(
      roleBindings.every((event) =>
        event.requirementPayload.binding.projectionRef.startsWith("projection://") &&
        event.requirementPayload.binding.bindingStatus === "admitted"
      ),
      true,
      `${role} bindings must preserve admitted ABI projection refs`
    );
  }
  assert.equal(
    routeBindings.some((event) => event.requirementPayload.binding.evidenceRef.startsWith("exit-status://0")),
    true,
    `${RUST_SERVICE_SCENARIO_ID} must preserve admitted service outcome evidence`
  );
  assert.equal(
    routeBindings.some((event) => event.requirementPayload.binding.evidenceRef.startsWith("client-exit-status://0")),
    true,
    `${RUST_SERVICE_SCENARIO_ID} must preserve admitted client outcome evidence`
  );
  assert.equal(routeFolds.length, 1, `${RUST_SERVICE_SCENARIO_ID} requires one ABI fold projection`);
  assert.equal(routeDispositions.length, 1, `${RUST_SERVICE_SCENARIO_ID} requires one ABI disposition`);

  const expectedBindingRefs = routeBindings.map((event) => event.routePayloadRef);
  const expectedFoldRefs = routeFolds.map((event) => event.requirementPayload.fold.foldRef);
  const expectedDispositionRefs = routeDispositions.map((event) => event.requirementPayload.dispositionRef);
  const expectedEvidenceRefs = admittedEvidenceEvents.map((event) => event.evidenceRef);

  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const evidence = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(lifecycle.status, "accepted", RUST_SERVICE_SCENARIO_ID);
  assert.equal(evidence.status, "accepted", RUST_SERVICE_SCENARIO_ID);
  assert.equal(assurance.status, "accepted", RUST_SERVICE_SCENARIO_ID);

  assert.equal(lifecycle.value.lifecycleDisposition, "release_readiness_candidate");
  assert.equal(lifecycle.value.requirementIds.length >= 1, true);
  assertSameMembers(lifecycle.value.dispositionRefs, expectedDispositionRefs, "ABI disposition refs must be preserved");
  assertSameMembers(
    evidence.value.requirementEvidenceBindings.map((item) => item.routePayloadRef),
    expectedBindingRefs,
    "ABI evidence binding route refs must be preserved"
  );
  assertSameMembers(
    evidence.value.admittedEvidence.map((item) => item.evidenceRef),
    expectedEvidenceRefs,
    "ABI admitted evidence refs must be preserved"
  );
  assertSameMembers(assurance.value.foldRefs, expectedFoldRefs, "ABI assurance fold refs must be preserved");
  assertSameMembers(assurance.value.dispositionRefs, expectedDispositionRefs, "ABI assurance disposition refs must be preserved");
  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(assurance.value.assuranceDisposition, "assurance_satisfied");
});

test("proves SCN-GLC-HELLO-WORLD-JS-TENANT-TEST over the committed ABI proof input", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest } = await readJsTenantTestProofArtifact();

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true, JS_TENANT_TEST_SCENARIO_ID);
  assert.equal(manifest.artifact.routeEventCount, 19, JS_TENANT_TEST_SCENARIO_ID);
  assertHasRequirements(artifact, 1, JS_TENANT_TEST_SCENARIO_ID);

  const routeBindings = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_evidence_bound"
  );
  const routeFolds = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_fold_projected"
  );
  const routeDispositions = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_lifecycle_disposition"
  );
  const admittedEvidenceEvents = artifact.replayEvents.filter((event) =>
    event.kind === "evidence_admitted"
  );

  const expectedRoles = Object.freeze([
    "asset",
    "test_source",
    "test_execution",
    "semantic_interpretation"
  ]);

  assert.equal(routeBindings.length, 8, `${JS_TENANT_TEST_SCENARIO_ID} requires ABI evidence bindings`);
  for (const role of expectedRoles) {
    const roleBindings = routeBindings.filter((event) =>
      event.requirementPayload.binding.evidenceRole === role
    );
    assert.equal(roleBindings.length, 2, `${role} must have file/ref and digest/interpretation evidence`);
    assert.equal(
      roleBindings.every((event) =>
        event.requirementPayload.binding.projectionRef.startsWith("projection://") &&
        event.requirementPayload.binding.bindingStatus === "admitted"
      ),
      true,
      `${role} bindings must preserve admitted ABI projection refs`
    );
  }
  assert.equal(routeFolds.length, 1, `${JS_TENANT_TEST_SCENARIO_ID} requires one ABI fold projection`);
  assert.equal(routeDispositions.length, 1, `${JS_TENANT_TEST_SCENARIO_ID} requires one ABI disposition`);

  const expectedBindingRefs = routeBindings.map((event) => event.routePayloadRef);
  const expectedFoldRefs = routeFolds.map((event) => event.requirementPayload.fold.foldRef);
  const expectedDispositionRefs = routeDispositions.map((event) => event.requirementPayload.dispositionRef);
  const expectedEvidenceRefs = admittedEvidenceEvents.map((event) => event.evidenceRef);

  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const evidence = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(lifecycle.status, "accepted", JS_TENANT_TEST_SCENARIO_ID);
  assert.equal(evidence.status, "accepted", JS_TENANT_TEST_SCENARIO_ID);
  assert.equal(assurance.status, "accepted", JS_TENANT_TEST_SCENARIO_ID);

  assert.equal(lifecycle.value.lifecycleDisposition, "release_readiness_candidate");
  assert.equal(lifecycle.value.requirementIds.length >= 1, true);
  assertSameMembers(lifecycle.value.dispositionRefs, expectedDispositionRefs, "ABI disposition refs must be preserved");
  assertSameMembers(
    evidence.value.requirementEvidenceBindings.map((item) => item.routePayloadRef),
    expectedBindingRefs,
    "ABI evidence binding route refs must be preserved"
  );
  assertSameMembers(
    evidence.value.admittedEvidence.map((item) => item.evidenceRef),
    expectedEvidenceRefs,
    "ABI admitted evidence refs must be preserved"
  );
  assert.equal(
    evidence.value.admittedEvidence.some((item) => item.evidenceRef.startsWith("projection://")),
    true,
    "projection refs must remain visible as admitted ABI evidence"
  );
  assertSameMembers(assurance.value.foldRefs, expectedFoldRefs, "ABI assurance fold refs must be preserved");
  assertSameMembers(assurance.value.dispositionRefs, expectedDispositionRefs, "ABI assurance disposition refs must be preserved");
  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(assurance.value.assuranceDisposition, "assurance_satisfied");
});

test("proves SCN-GLC-HELLO-WORLD-PARALLEL-JS over the committed ABI proof input", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest } = await readParallelJsProofArtifact();

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true, PARALLEL_JS_SCENARIO_ID);
  assert.equal(manifest.artifact.routeEventCount, 55, PARALLEL_JS_SCENARIO_ID);
  assert.equal(artifact.replay.runtimeEventCount, 199, PARALLEL_JS_SCENARIO_ID);
  assert.equal(artifact.source.branchRecords.hello.executionStdout, "Hello");
  assert.equal(artifact.source.branchRecords.world.executionStdout, "world");
  assert.equal(artifact.source.branchRecords["fan-in"].executionStdout, "Hello, world!\n");

  assertHasRequirements(artifact, 4, PARALLEL_JS_SCENARIO_ID);

  const routeBindings = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_evidence_bound"
  );
  const routeFolds = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_fold_projected"
  );
  const routeDispositions = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_lifecycle_disposition"
  );
  const routeResiduals = artifact.routeEvents.filter((event) =>
    event.routePayloadKind === "requirement_residual_projected"
  );
  const branchPayloadEvents = artifact.replayEvents.filter((event) =>
    event.kind === "branch_payload_admitted"
  );
  const fanInEvents = artifact.replayEvents.filter((event) =>
    event.kind === "branch_fan_in_projected"
  );
  const branchLeaseEvents = artifact.replayEvents.filter((event) =>
    event.kind === "branch_lease_acquired" || event.kind === "branch_lease_released"
  );
  const admittedEvidenceEvents = artifact.replayEvents.filter((event) =>
    event.kind === "evidence_admitted"
  );

  assert.equal(routeBindings.length, 24, `${PARALLEL_JS_SCENARIO_ID} requires ABI evidence bindings`);
  assert.equal(routeFolds.length, 3, `${PARALLEL_JS_SCENARIO_ID} requires one fold per child requirement`);
  assert.equal(routeDispositions.length, 1, `${PARALLEL_JS_SCENARIO_ID} requires one ABI disposition`);
  assert.equal(routeResiduals.length, 0, `${PARALLEL_JS_SCENARIO_ID} is a closed proof with no residual events`);
  assert.equal(branchPayloadEvents.length, 3, `${PARALLEL_JS_SCENARIO_ID} requires three branch payload admissions`);
  assert.equal(fanInEvents.length, 2, `${PARALLEL_JS_SCENARIO_ID} requires branch fan-in and final fan-in projection`);
  assert.equal(branchLeaseEvents.length, 6, `${PARALLEL_JS_SCENARIO_ID} requires acquired/released branch leases`);

  const expectedRoles = Object.freeze([
    "asset",
    "test_source",
    "test_execution",
    "semantic_interpretation"
  ]);
  for (const role of expectedRoles) {
    const roleBindings = routeBindings.filter((event) =>
      event.requirementPayload.binding.evidenceRole === role
    );
    assert.equal(roleBindings.length, 6, `${role} binding count must match ABI replay truth`);
    assert.equal(
      sortedUniqueStrings(roleBindings.map((event) => event.requirementPayload.binding.projectionRef)).length,
      3,
      `${role} bindings must preserve one admitted ABI projection ref per branch`
    );
    assert.equal(
      roleBindings.every((event) =>
        event.requirementPayload.binding.projectionRef.startsWith("projection://") &&
        event.requirementPayload.binding.bindingStatus === "admitted"
      ),
      true,
      `${role} bindings must be admitted ABI bindings`
    );
  }

  const foldedRequirementIds = routeFolds.map((event) => event.requirementPayload.fold.requirementId);
  assert.equal(sortedUniqueStrings(foldedRequirementIds).length, 3, "ABI child fold requirement ids must be preserved");
  assert.equal(
    foldedRequirementIds.every((requirementId) =>
      artifact.lifecycleState.requirementQuery.requirementIds.includes(requirementId)
    ),
    true,
    "folded child requirements must be part of the ABI requirement query"
  );
  assert.equal(
    routeFolds.every((event) => event.requirementPayload.fold.state === "satisfied"),
    true,
    `${PARALLEL_JS_SCENARIO_ID} child folds must be satisfied`
  );
  assert.equal(artifact.lifecycleState.aggregateStates.length, 1);
  assert.equal(
    artifact.lifecycleState.requirementQuery.requirementIds.includes(
      artifact.lifecycleState.aggregateStates[0].requirementId
    ),
    true
  );
  assert.equal(artifact.lifecycleState.aggregateStates[0].state, "satisfied");
  assert.equal(artifact.lifecycleState.requirementGraph.parentChildPairs.length, 3);

  const expectedBindingRefs = routeBindings.map((event) => event.routePayloadRef);
  const expectedFoldRefs = routeFolds.map((event) => event.requirementPayload.fold.foldRef);
  const expectedDispositionRefs = routeDispositions.map((event) => event.requirementPayload.dispositionRef);
  const expectedEvidenceRefs = admittedEvidenceEvents.map((event) => event.evidenceRef);

  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const evidence = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });
  const frontier = interpretParallelFrontierState({
    runtimeEvents: artifact.replayEvents,
    lifecycleState: artifact.lifecycleState
  });

  assert.equal(lifecycle.status, "accepted", PARALLEL_JS_SCENARIO_ID);
  assert.equal(evidence.status, "accepted", PARALLEL_JS_SCENARIO_ID);
  assert.equal(assurance.status, "accepted", PARALLEL_JS_SCENARIO_ID);
  assert.equal(frontier.status, "accepted", PARALLEL_JS_SCENARIO_ID);

  assert.equal(lifecycle.value.lifecycleDisposition, "release_readiness_candidate");
  assert.equal(lifecycle.value.requirementIds.includes(artifact.lifecycleState.aggregateStates[0].requirementId), true);
  assertSameMembers(lifecycle.value.dispositionRefs, expectedDispositionRefs, "ABI disposition refs must be preserved");
  assertSameMembers(
    evidence.value.requirementEvidenceBindings.map((item) => item.routePayloadRef),
    expectedBindingRefs,
    "ABI evidence binding route refs must be preserved"
  );
  assertSameMembers(
    evidence.value.admittedEvidence.map((item) => item.evidenceRef),
    expectedEvidenceRefs,
    "ABI admitted evidence refs must be preserved"
  );
  assertSameMembers(assurance.value.foldRefs, expectedFoldRefs, "ABI assurance fold refs must be preserved");
  assert.deepEqual(assurance.value.residualRefs, []);
  assertSameMembers(assurance.value.dispositionRefs, expectedDispositionRefs, "ABI assurance disposition refs must be preserved");
  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(assurance.value.assuranceDisposition, "assurance_satisfied");

  assert.equal(frontier.value.readiness, "fan_in_ready");
  assert.equal(frontier.value.branchPayloads.length, 3);
  assert.equal(frontier.value.fanIns.length, 2);
  assert.equal(frontier.value.aggregateStates[0].state, "satisfied");
  assert.equal(frontier.value.requirementGraph.parentChildPairs.length, 3);
  assert.equal(
    frontier.value.evidenceRefs.some((ref) => ref.includes("fan-in-execution.trace/result.json")),
    true,
    "fan-in evidence ref must remain visible"
  );
});

test("interprets evidence and target artifact state from real ABIogenesis replay events", async () => {
  const { artifact } = await readBasicCliProofArtifact();
  const result = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.value.kind, "odd_glc_evidence_state_view");
  assert.equal(result.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(result.value.runtimeEventCount, artifact.replayEvents.length);
  assert.equal(result.value.targetArtifactRefs.length, 1);
  assert.equal(result.value.targetArtifactRefs[0].startsWith("result://"), true);
  assert.equal(result.value.capabilityRefs.includes("worker://m03-iteration"), true);
  assert.equal(result.value.capabilityRefs.includes("backend://node"), true);
  assert.equal(result.value.capabilityRefs.some((ref) => ref.startsWith("dispatch://")), true);
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
    result.value.requirementEvidenceBindings.some((binding) => binding.bindingStatus === "admitted"),
    true
  );
});

test("evidence interpretation does not treat route bindings alone as executed proof", () => {
  const result = interpretEvidenceState({
    runtimeEvents: Object.freeze([
      Object.freeze({
        kind: "requirement_route_fact_projected",
        routePayloadKind: "requirement_evidence_bound",
        routePayloadRef: "binding:synthetic",
        routeEventRef: "event:route:binding",
        requirementPayload: Object.freeze({
          binding: Object.freeze({
            evidenceRef: "evidence:synthetic",
            requirementId: "REQ-FIXTURE",
            projectionRef: "projection:synthetic",
            evidenceRole: "asset",
            bindingStatus: "admitted",
            digest: "sha256:synthetic"
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
  const { artifact } = await readBasicCliProofArtifact();
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
  const residualRef = "requirement-residual://synthetic/needs-repair";
  const result = interpretAssuranceState({
    runtimeEvents: Object.freeze([
      Object.freeze({
        kind: "requirement_route_fact_projected",
        routePayloadKind: "requirement_fold_projected",
        routePayloadRef: "requirement-fold://synthetic/partial",
        routeEventRef: "event:route:fold:partial",
        requirementPayload: Object.freeze({
          fold: Object.freeze({
            foldRef: "requirement-fold://synthetic/partial",
            requirementId: "REQ-FIXTURE",
            requirementProjectionRef: "projection://synthetic",
            state: "partial",
            evidenceRefs: Object.freeze(["evidence://synthetic"]),
            evidenceBindingRefs: Object.freeze(["binding://synthetic"]),
            sourceAbgTruthRefs: Object.freeze(["assurance://synthetic"])
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
            requirementProjectionRef: "projection://synthetic",
            foldRef: "requirement-fold://synthetic/partial",
            pressureClass: "repair",
            ownerSurface: "F_P",
            evidenceRefs: Object.freeze(["evidence://synthetic"]),
            sourceFoldRefs: Object.freeze(["requirement-fold://synthetic/partial"])
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

test("defines lifecycle meaning as a GTL program overlay rather than a local mapping export", async () => {
  const module = await import("../src/index.mjs");
  const exportNames = Object.keys(module);

  assert.equal(exportNames.some((name) => name.includes("SLOT_MAP")), false);
  assert.equal(exportNames.some((name) => name.includes("LifecycleSurfaceMap")), false);
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.kind, "odd_glc_lifecycle_program_overlay_graph");
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.overlayRef, "overlay://odd_glc/general-lifecycle");
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.rule, "gtl_overlay_graph_declaration_over_gtl_abg_truth");
  assert.equal(containsFunction(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY), false);
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.roleRefs.length >= REQUIRED_ROUTE_ONE_SURFACES.length, true);
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.forbiddenAuthority.includes("event_emission"), true);
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.forbiddenAuthority.includes("graph_function_selection"), true);
  assert.equal(ODD_GLC_LIFECYCLE_PROGRAM_OVERLAY.forbiddenAuthority.includes("odd_sdlc_phase_or_ledger_reproduction"), true);
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
