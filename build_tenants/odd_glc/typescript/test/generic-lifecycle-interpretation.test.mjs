import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  interpretAssuranceState,
  interpretEvidenceState,
  interpretExecutivePressureState,
  interpretLifecycleState,
  interpretRecursiveSpanState,
  interpretReleaseReadinessState,
  interpretRequirementGraphState
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const defaultAbgRoot = path.join(
  appsRoot,
  `.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}/lib/node_modules/@abiogenesis/typescript-tenant`
);

async function importAbgRequirementsFacade() {
  const packageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgRoot;
  const facadePath = path.join(packageRoot, "build/semantic/code/src/abg/requirements/index.js");
  assert.equal(existsSync(facadePath), true, `Missing installed ABIogenesis facade at ${facadePath}`);
  return import(pathToFileURL(facadePath).href);
}

async function readPinnedArtifact(provenanceKey) {
  const proof = ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts[provenanceKey];
  assert.ok(proof, `Missing substrate provenance entry ${provenanceKey}`);
  const artifactPath = path.join(tenantRoot, proof.fixturePath.replace(/^build_tenants\/odd_glc\/typescript\//u, ""));
  const manifestPath = path.join(tenantRoot, proof.fixtureManifestPath.replace(/^build_tenants\/odd_glc\/typescript\//u, ""));
  assert.equal(existsSync(artifactPath), true, `Missing committed ABI artifact fixture at ${artifactPath}`);
  assert.equal(existsSync(manifestPath), true, `Missing committed ABI artifact manifest at ${manifestPath}`);

  const rawArtifact = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const digest = `sha256:${createHash("sha256").update(rawArtifact, "utf8").digest("hex")}`;
  assert.equal(digest, proof.artifactSha256);
  assert.equal(manifest.artifact.sha256, proof.artifactSha256);

  return Object.freeze({
    artifact,
    manifest,
    proof
  });
}

test("interprets T-167 non-closed lifecycle truth without claiming release", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest, proof } = await readPinnedArtifact("t167NonClosedRoute");

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true);
  assert.equal(artifact.routeEvents.length, proof.routeEventCount);
  assert.equal(artifact.replayEvents.length, proof.replayEventCount);

  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({ runtimeEvents: artifact.replayEvents });
  const evidence = interpretEvidenceState({ runtimeEvents: artifact.replayEvents });
  const release = interpretReleaseReadinessState({
    lifecycleStateView: lifecycle.value,
    assuranceStateView: assurance.value,
    evidenceStateView: evidence.value
  });

  assert.equal(lifecycle.status, "accepted");
  assert.equal(assurance.status, "accepted");
  assert.equal(evidence.status, "accepted");
  assert.equal(release.status, "accepted");
  assert.equal(lifecycle.value.lifecycleDisposition, "continuation_available");
  assert.equal(assurance.value.assuranceDisposition, "residual_pressure");
  assert.equal(release.value.readiness, "not_ready_residual");
  assert.equal(release.value.releaseAuthority, "not_claimed");
  assert.deepEqual(assurance.value.foldStates, ["partial"]);
  assert.deepEqual(assurance.value.residualRefs, ["requirement-residual:REQ-T167-NON-CLOSED-ROUTE:partial"]);
  assert.equal(assurance.value.dispositions.length, 4);
  assert.equal(assurance.value.dispositions.every((row) => row.disposition === "continuation_available"), true);
});

test("interprets T-168 requirement graph and aggregate residual truth", async () => {
  const { artifact, manifest, proof } = await readPinnedArtifact("t168RequirementGraphRefinement");

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true);
  assert.equal(artifact.routeEvents.length, proof.routeEventCount);
  assert.equal(artifact.replayEvents.length, proof.replayEventCount);

  const graph = interpretRequirementGraphState({
    lifecycleState: artifact.lifecycleState,
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(graph.status, "accepted");
  assert.equal(graph.value.kind, "odd_glc_requirement_graph_state_view");
  assert.equal(graph.value.graphDisposition, "aggregate_residual_pressure");
  assert.deepEqual(graph.value.rootRequirementIds, ["REQ-T168-LIVE-PARENT"]);
  assert.deepEqual(graph.value.leafRequirementIds, [
    "REQ-T168-LIVE-CHILD-PROGRAM",
    "REQ-T168-LIVE-CHILD-PROOF"
  ]);
  assert.equal(graph.value.parentChildPairs.length, 2);
  assert.equal(graph.value.terms.length, 3);
  assert.equal(graph.value.relations.length, 2);
  assert.deepEqual(graph.value.residualRefs, [
    "requirement-residual:REQ-T168-LIVE-CHILD-PROGRAM:partial",
    "requirement-residual:REQ-T168-LIVE-CHILD-PROOF:partial"
  ]);
});

test("interprets T-169 recursive span lineage and foldback truth", async () => {
  const { artifact, manifest, proof } = await readPinnedArtifact("t169SpanIdentityRecursion");

  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true);
  assert.equal(artifact.routeEvents.length, proof.routeEventCount);
  assert.equal(artifact.replayEvents.length, proof.replayEventCount);

  const span = interpretRecursiveSpanState({
    lifecycleState: artifact.lifecycleState,
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(span.status, "accepted");
  assert.equal(span.value.kind, "odd_glc_recursive_span_state_view");
  assert.equal(span.value.readiness, "recursive_span_ready");
  assert.equal(span.value.frameRefs.length >= 2, true);
  assert.equal(span.value.zoomRefs.length >= 1, true);
  assert.equal(span.value.foldbackRefs.length >= 1, true);
  assert.ok(span.value.runtimeSpanEventKinds.includes("frame_opened"));
  assert.ok(span.value.runtimeSpanEventKinds.includes("zoom_frame_opened"));
  assert.ok(span.value.runtimeSpanEventKinds.includes("graph_span_foldback_evaluated"));
  assert.ok(span.value.runtimeSpanEventKinds.includes("graph_reentry_planned"));
  assert.ok(span.value.runtimeSpanEventKinds.includes("graph_reentry_applied"));
});

test("interprets T-160 executive pressure as lawful reprice pressure", async () => {
  const { artifact, manifest, proof } = await readPinnedArtifact("t160ExecutiveObserver");

  assert.equal(manifest.artifact.disposition, "nonlocal_reentry");
  assert.equal(artifact.pressureEvents.length, proof.pressureEventCount);
  assert.equal(artifact.replayEvents.length, proof.replayEventCount);

  const pressure = interpretExecutivePressureState({
    runtimeEvents: artifact.replayEvents,
    pressureEvents: artifact.pressureEvents
  });

  assert.equal(pressure.status, "accepted");
  assert.equal(pressure.value.kind, "odd_glc_executive_pressure_state_view");
  assert.equal(pressure.value.pressureDisposition, "reprice_required");
  assert.deepEqual(pressure.value.dispositions, ["nonlocal_reentry"]);
  assert.deepEqual(pressure.value.closeDispositions, ["no_close"]);
  assert.deepEqual(pressure.value.requirementIds, ["REQ-T160-LIVE-PRESSURE"]);
  assert.deepEqual(pressure.value.residualPressureRefs, ["pressure://t160/live/original-gap"]);
  assert.deepEqual(pressure.value.continuationRefs, ["continuation://t160/live/original-gap"]);
  assert.equal(pressure.value.pressureFactRefs.length, 1);
});
