import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  inventoryPackage, prepareInstalledScenario, runDefinition, validateRetainedWorksiteSetup,
} from "./generic-live-workflow-support.mjs";
import { constructRetainedBranchTask, prepareRetainedBranchInputs } from "./generic-retained-branch-support.mjs";

const digest = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;

export function successorEpochPaths({ runRoot, epochId, artifactPath, expectedArtifactDigest }) {
  assert.ok(typeof runRoot === "string" && path.isAbsolute(runRoot) && path.resolve(runRoot) === runRoot);
  assert.match(epochId, /^[A-Za-z0-9][A-Za-z0-9_-]*$/u);
  assert.ok(typeof artifactPath === "string" && path.isAbsolute(artifactPath), "explicit successor artifact path is required");
  assert.match(expectedArtifactDigest, /^sha256:[a-f0-9]{64}$/u, "explicit successor artifact SHA-256 is required");
  const epochRoot = path.join(runRoot, "epochs", epochId);
  return { scenarioRunRoot: runRoot, epochRoot, worksiteRoot: path.join(runRoot, "worksite"),
    bootstrapRoot: path.join(epochRoot, "abi-bootstrap"), consumerRoot: path.join(epochRoot, "abi-consumer"),
    authorityRoot: path.join(epochRoot, "abi-authority") };
}

export function retainedWorkspaceOpenSelection(worksiteRoot, manifest, manifestSha256, previousWorkspaceId) {
  assert.equal(manifest.workspaceRef, previousWorkspaceId, "workspace manifest must belong to the retained scenario");
  assert.equal(manifest.canonicalRoot, worksiteRoot);
  return { openPacket: { kind: "workspace_open_packet", schemaVersion: "5.0.0", memberKey: "open",
    targetRoot: worksiteRoot, expectedWorkspaceAuthorityRef: manifest.authorityBasis.authorityRef,
    expectedWorkspaceAuthorityDigest: manifest.authorityBasis.authorityDigest },
    manifest: { path: path.join(worksiteRoot, ".abiogenesis", "workspace-manifest.json"), sha256: manifestSha256 } };
}

async function exactJson(coordinate) {
  const bytes = await readFile(coordinate.path);
  assert.equal(digest(bytes), coordinate.sha256, `frozen epoch input changed: ${coordinate.path}`);
  return JSON.parse(bytes.toString("utf8"));
}

/** Installs only when explicitly called with the setup gate; it never dispatches a Worker. */
export async function prepareSuccessorEpoch(request, environment = process.env) {
  assert.equal(environment.ODD_GLC_RUN_SUCCESSOR_SETUP, "1", "successor setup requires its explicit activation gate");
  const locations = successorEpochPaths(request);
  assert.equal(await realpath(locations.scenarioRunRoot), locations.scenarioRunRoot);
  assert.equal(await realpath(locations.worksiteRoot), locations.worksiteRoot);
  const artifactBytes = await readFile(request.artifactPath);
  assert.equal(digest(artifactBytes), request.expectedArtifactDigest);
  const frozenInput = await exactJson(request.inputPreparation);
  assert.equal(frozenInput.kind, "retained_branch_input_preparation");
  assert.equal(frozenInput.nextEpoch, null);
  assert.equal(frozenInput.request.runRoot, locations.scenarioRunRoot);
  // Authenticate original admissions again before native setup may begin. This
  // returns old provenance only; it is never offered as a new invocation basis.
  const currentInput = await prepareRetainedBranchInputs(frozenInput.request);
  assert.deepEqual(currentInput.previousEpoch, frozenInput.previousEpoch);
  assert.deepEqual(currentInput.retainedFiles, frozenInput.retainedFiles);
  assert.deepEqual(currentInput.scenario, frozenInput.scenario);
  const manifestPath = path.join(locations.worksiteRoot, ".abiogenesis", "workspace-manifest.json");
  const manifestBytes = await readFile(manifestPath);
  const retainedWorksite = retainedWorkspaceOpenSelection(locations.worksiteRoot,
    JSON.parse(manifestBytes.toString("utf8")), digest(manifestBytes), currentInput.previousEpoch.workspaceBinding.workspaceId);
  validateRetainedWorksiteSetup(locations.epochRoot, retainedWorksite);
  const epochsRoot = path.dirname(locations.epochRoot);
  try {
    assert.ok((await lstat(epochsRoot)).isDirectory());
    assert.equal(await realpath(epochsRoot), epochsRoot, "epoch resources must not follow an alias");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await assert.rejects(lstat(locations.epochRoot), { code: "ENOENT" });
  const oldRoots = { worksite: locations.worksiteRoot,
    install: currentInput.previousEpoch.workspaceBinding.roots.toolchainRoot,
    authority: path.dirname(currentInput.previousEpoch.workspaceBinding.roots.eventLogRoot) };
  const protectedBefore = Object.fromEntries(await Promise.all(Object.entries(oldRoots).map(async ([name, root]) =>
    [name, { root, ...await inventoryPackage(root) }])));
  const prepared = await prepareInstalledScenario({ scenario: currentInput.scenario,
    artifactPath: request.artifactPath, expectedArtifactDigest: request.expectedArtifactDigest,
    runRoot: locations.epochRoot, retainedWorksite });
  assert.equal(prepared.worksiteRoot, locations.worksiteRoot);
  assert.equal(prepared.install.consumerRoot, locations.consumerRoot);
  assert.notEqual(prepared.workspaceBinding.bindingId, currentInput.previousEpoch.workspaceBinding.bindingId);
  assert.equal(prepared.workspaceBinding.roots.eventLogRoot, path.join(locations.authorityRoot, "events"));
  const targetInputs = prepared.constructionTargets.map(({ subject, territory, predecessorObservation }) =>
    ({ subject, territory, predecessorObservation }));
  const constructed = constructRetainedBranchTask({ product: prepared.product,
    workspaceAuthorityBasis: prepared.workspaceAuthorityBasis, workspaceBinding: prepared.workspaceBinding,
    capabilityGrant: prepared.task.capabilityGrant, targetInputs,
    originalScenario: currentInput.originalScenario, scenario: currentInput.scenario, retainedFiles: currentInput.retainedFiles });
  Object.assign(prepared, { task: constructed.task, constructionTargets: constructed.targets, prompt: constructed.prompt,
    scenarioRunRoot: locations.scenarioRunRoot });
  const constructionCall = await runDefinition(prepared, prepared.task, prepared.resolution, prepared.policy, prepared.setupHandoff);
  const admitted = prepared.product.admitInstalledProductInput(prepared.resolution.productSemantics,
    prepared.resolution.resolution.inputContract.contractRef, prepared.task);
  assert.notEqual(admitted, null);
  for (const [name, root] of Object.entries(oldRoots)) {
    assert.equal((await inventoryPackage(root)).digest, protectedBefore[name].digest,
      `successor setup changed prior ${name} bytes`);
  }
  assert.deepEqual(await readFile(manifestPath), manifestBytes);
  const protocol = { kind: "successor_epoch_setup_protocol", authority: "diagnostic_only", request, locations,
    inputPreparation: request.inputPreparation, retainedWorksite,
    previousEpoch: { workspaceBinding: currentInput.previousEpoch.workspaceBinding,
      closeHandoff: currentInput.previousEpoch.closeHandoff, replayRef: currentInput.previousEpoch.replayRef,
      replayDigest: currentInput.previousEpoch.replayDigest, protectedBefore },
    successorEpoch: { artifactPath: prepared.install.artifactPath, artifactDigest: prepared.install.artifactDigest,
      installedRoot: prepared.install.installedRoot, workspaceAuthorityBasis: prepared.workspaceAuthorityBasis,
      workspaceBinding: prepared.workspaceBinding, setupHandoff: prepared.setupHandoff,
      freshObservations: targetInputs, constructionTask: prepared.task, constructionCall },
    retainedFiles: currentInput.retainedFiles, liveWorkerInvoked: false,
    relation: "same physical scenario worksite; separate install and event epoch; historical bytes are input, not successor admission",
    disposition: "setup_complete_construction_unexecuted" };
  const bytes = Buffer.from(JSON.stringify(protocol, null, 2) + "\n");
  const protocolPath = path.join(locations.epochRoot, "successor-epoch-setup-protocol.json");
  await writeFile(protocolPath, bytes, { flag: "wx" });
  return { prepared, constructionCall, retainedFiles: currentInput.retainedFiles,
    protocolEvidence: { path: protocolPath, sha256: digest(bytes) } };
}
