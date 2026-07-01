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
  const artifactPath = path.join(tenantRoot, proof.proofArtifactPath.replace(/^build_tenants\/odd_glc\/typescript\//u, ""));
  const manifestPath = path.join(tenantRoot, proof.proofManifestPath.replace(/^build_tenants\/odd_glc\/typescript\//u, ""));
  assert.equal(existsSync(artifactPath), true, `Missing committed ABI proof input at ${artifactPath}`);
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

test("interprets synthetic non-closed route mechanics without claiming closure", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest, proof } = await readPinnedArtifact("syntheticNonClosedRouteMechanics");

  assert.equal(proof.proofClass, "synthetic_engine_mechanics");
  assert.equal(proof.closureReadiness, "blocked_live_proof_missing");
  assert.equal(proof.replacedByCapability, "abg_live_non_closed_route");
  assert.equal(manifest.source.sourceRunKind, "installed_non_closed_requirements_route");
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
  assert.equal(assurance.value.residualRefs.length, 1);
  assert.equal(assurance.value.residualRefs[0].startsWith("requirement-residual:"), true);
  assert.equal(assurance.value.residualRefs[0].endsWith(":partial"), true);
  assert.equal(assurance.value.dispositions.length, 4);
  assert.equal(assurance.value.dispositions.every((row) => row.disposition === "continuation_available"), true);
});

test("interprets live non-closed route proof from ABI replay truth", async () => {
  const abgRequirements = await importAbgRequirementsFacade();
  const { artifact, manifest, proof } = await readPinnedArtifact("liveNonClosedRoute");

  assert.equal(proof.proofClass, "live_execution_grounded");
  assert.equal(proof.supersedesCapability, "abg_non_closed_route_engine_mechanics_regression");
  assert.equal(proof.controlCloseDisposition, "close");
  assert.equal(proof.nonClosedDisposition, "continuation_available");
  assert.equal(manifest.source.sourceRunKind, "live_fp_non_closed_requirements_route");
  assert.equal(manifest.source.controlCloseDisposition, "close");
  assert.equal(manifest.source.nonClosedDisposition, "continuation_available");
  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true);
  assert.deepEqual(manifest.artifact.requiredPayloadKinds, [
    "requirement_term_admitted",
    "requirement_projection_admitted",
    "requirement_evidence_bound",
    "requirement_fold_projected",
    "requirement_residual_projected",
    "requirement_lifecycle_disposition"
  ]);
  assert.equal(artifact.routeEvents.length, proof.routeEventCount);
  assert.equal(artifact.replayEvents.length, proof.replayEventCount);
  assert.equal(artifact.source.controlCloseDisposition, "close");
  assert.equal(artifact.source.nonClosedDisposition, "continuation_available");

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
  assert.equal(lifecycle.value.requirementIds.length, 1);
  assert.equal(lifecycle.value.lifecycleDisposition, "continuation_available");
  assert.equal(lifecycle.value.dispositionRefs.length, 1);
  assert.equal(lifecycle.value.dispositionRefs[0].startsWith("requirement-lifecycle-disposition:"), true);
  assert.equal(assurance.value.assuranceDisposition, "residual_pressure");
  assert.deepEqual(assurance.value.foldStates, ["partial"]);
  assert.equal(assurance.value.residualRefs.length, 1);
  assert.equal(assurance.value.residualRefs[0].startsWith("requirement-residual:"), true);
  assert.equal(assurance.value.residualRefs[0].endsWith(":partial"), true);
  assert.deepEqual(assurance.value.dispositionRefs, lifecycle.value.dispositionRefs);
  assert.equal(assurance.value.dispositions.length, 1);
  assert.equal(assurance.value.dispositions[0].disposition, "continuation_available");
  assert.equal(assurance.value.foldRefs.length, 1);
  assert.equal(assurance.value.foldRefs[0].startsWith("requirement-fold:"), true);
  assert.equal(assurance.value.foldRefs[0].includes(":partial:"), true);
  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed");
  assert.equal(release.value.readiness, "not_ready_residual");
  assert.equal(release.value.releaseAuthority, "not_claimed");
  assert.deepEqual(release.value.residualRefs, assurance.value.residualRefs);
});

test("interprets requirement graph and aggregate residual truth", async () => {
  const { artifact, manifest, proof } = await readPinnedArtifact("requirementGraphRefinement");

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
  assert.equal(graph.value.rootRequirementIds.length, 1);
  assert.equal(graph.value.leafRequirementIds.length, 2);
  assert.equal(graph.value.parentChildPairs.length, 2);
  assert.equal(graph.value.terms.length, 3);
  assert.equal(graph.value.relations.length, 2);
  assert.equal(graph.value.residualRefs.length, 2);
  assert.equal(graph.value.residualRefs.every((ref) => ref.startsWith("requirement-residual:")), true);
  assert.equal(graph.value.residualRefs.every((ref) => ref.endsWith(":partial")), true);
});

test("interprets recursive span lineage and foldback truth", async () => {
  const { artifact, manifest, proof } = await readPinnedArtifact("recursiveSpanIdentity");

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
  assert.equal(span.value.frameRefs.length, 2);
  assert.equal(span.value.zoomRefs.length, 1);
  assert.equal(span.value.foldbackRefs.length, 1);
  assert.deepEqual(span.value.runtimeSpanEventKinds, [
    "frame_opened",
    "zoom_frame_opened",
    "graph_span_foldback_evaluated",
    "graph_reentry_planned",
    "graph_reentry_applied"
  ]);
  assert.deepEqual(span.value.graphSpanEventKinds, [
    "graph_span_evaluation_scheduled",
    "graph_span_assessed",
    "graph_span_foldback_evaluated"
  ]);
  assert.deepEqual(span.value.graphVectorRefs, [
    "graph-capture_requirements",
    "graph-synthesize_design",
    "graph-implement_code"
  ]);
  assert.equal(span.value.spanIds.length, 1);
  assert.equal(span.value.spanIds[0].startsWith("span://"), true);
});

test("interprets executive pressure as lawful reprice pressure", async () => {
  const { artifact, manifest, proof } = await readPinnedArtifact("executiveObserverPressure");

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
  assert.equal(pressure.value.requirementIds.length, 1);
  assert.equal(pressure.value.residualPressureRefs.length, 1);
  assert.equal(pressure.value.residualPressureRefs[0].startsWith("pressure://"), true);
  assert.equal(pressure.value.continuationRefs.length, 1);
  assert.equal(pressure.value.continuationRefs[0].startsWith("continuation://"), true);
  assert.equal(pressure.value.pressureFactRefs.length, 1);
});
