import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  applyDeclaredRun, constructCommandExecutionTask, evaluateGenericScenarioOutcome,
  importInstalledSurface, inventoryPackage, renderGenericWorkflowAction,
  runDefinition, runFreshPublicRead, scenarioTargetPaths, sourceResultFromRead,
  selectConstructionExecutionSource, validateClaudeConfiguration,
} from "./generic-live-workflow-support.mjs";

const ACTOR = "actor://abiogenesis/worksite/construction-worker@5";
const digest = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;

async function exactJsonFile(coordinate) {
  const bytes = await readFile(coordinate.path);
  assert.equal(digest(bytes), coordinate.sha256, `retained evidence changed: ${coordinate.path}`);
  return JSON.parse(bytes.toString("utf8"));
}

async function retain(root, name, value) {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + "\n");
  const file = path.join(root, name);
  await writeFile(file, bytes, { flag: "wx" });
  return { path: file, sha256: digest(bytes) };
}

export function retainedRepairTargetChange(originalPaths, requestedPaths, repair) {
  const addedPaths = requestedPaths.filter((item) => !originalPaths.includes(item));
  const preservedPaths = originalPaths.filter((item) => !requestedPaths.includes(item));
  if (repair.targetChange === undefined) {
    assert.deepEqual(requestedPaths, originalPaths);
  } else {
    assert.deepEqual(repair.targetChange.previousPaths, originalPaths);
    assert.deepEqual(repair.targetChange.addedPaths, addedPaths);
    assert.deepEqual(repair.targetChange.preservedPaths, preservedPaths);
    assert.ok(addedPaths.every((item) => repair.changePaths.includes(item)));
  }
  return { addedPaths, preservedPaths };
}

export function retainedCurrentReadPlan(receipt, call, declaredFrontier) {
  assert.equal(receipt.invocationRef, call.invocation.invocationRef);
  const value = receipt.ownerOutput.value;
  if (declaredFrontier === undefined) {
    assert.equal(value.disposition, "completed");
    assert.notEqual(value.result, null);
    return { needsResult: true };
  }
  assert.equal(declaredFrontier.disposition, "runtime_failed");
  assert.equal(value.disposition, "runtime_failed");
  assert.equal(value.result, null);
  assert.equal(value.run.ref, declaredFrontier.runRef);
  assert.equal(receipt.resources.eventResource.closeHandoff.prefix.prefixDigest, declaredFrontier.prefixDigest);
  return { needsResult: false };
}

export function validateRetainedRepairCandidates(currentFiles, repair) {
  if (repair.exactCandidates === undefined) return [];
  assert.deepEqual(repair.exactCandidates.map((row) => row.relativePath), currentFiles.map((row) => row.relativePath));
  for (const [ordinal, candidate] of repair.exactCandidates.entries()) {
    const bytes = Buffer.from(candidate.replacementBase64, "base64");
    assert.equal(bytes.toString("base64"), candidate.replacementBase64);
    assert.equal(bytes.byteLength, candidate.byteLength);
    assert.equal(digest(bytes), candidate.sha256);
    const expected = repair.changePaths.includes(candidate.relativePath)
      ? repair.expectedAfterDigests?.[candidate.relativePath] : currentFiles[ordinal].sha256;
    assert.equal(candidate.sha256, expected, "encoded candidate must match its selected after-digest or unchanged current bytes");
  }
  return repair.exactCandidates;
}

export function renderRetainedRepairAction(scenario, targets, currentFiles, repair, referenceFiles = []) {
  assert.deepEqual(currentFiles.map((file) => file.relativePath),
    targets.map((target) => target.subject.relativePath));
  assert.ok(repair.changePaths.length > 0);
  assert.equal(new Set(repair.changePaths).size, repair.changePaths.length);
  assert.ok(repair.changePaths.every((relativePath) =>
    currentFiles.some((file) => file.relativePath === relativePath)));
  const candidates = validateRetainedRepairCandidates(currentFiles, repair);
  return renderGenericWorkflowAction({ ...scenario,
    constructionConstraints: [
      ...(scenario.constructionConstraints ?? []),
      `This is one repair of the existing subject. Only these paths may change bytes: ${JSON.stringify(repair.changePaths)}.`,
      "Return every other target with exactly its current UTF-8 bytes, including whitespace and final newline. No redesign, regeneration, test weakening, or extra edit is permitted.",
      "The current file contents below are hash-checked against admitted O1 and supplied as exact repair input.",
      ...currentFiles.map((file) => file.state === "absent"
        ? `CURRENT ABSENT TARGET ${file.relativePath}; native O0 confirms no predecessor file bytes.`
        : `CURRENT FILE ${file.relativePath}; ${file.sha256}; UTF-8 JSON STRING: ${JSON.stringify(file.contents)}`),
      ...referenceFiles.map((file) => `PRESERVED REFERENCE INPUT ONLY ${file.relativePath}; ${file.sha256}; never return or modify this non-target. UTF-8 JSON STRING: ${JSON.stringify(file.contents)}`),
      ...(candidates.length === 0 ? [] : [
        "The exact after-candidate encodings below are mechanically derived repair INPUT from the selected literal change and unchanged current files. They are not an admitted result. Judge the requested correction against the supplied current text, then copy these encodings verbatim into your actual Worker result; do not re-encode them mentally. Native C1/C0 still owns validation and publication.",
        ...candidates.map((candidate, ordinal) => `EXACT SELECTED AFTER CANDIDATE ${candidate.relativePath}; targetRef: ${targets[ordinal].targetRef}; ${candidate.sha256}; byteLength: ${candidate.byteLength}; replacementBase64: ${candidate.replacementBase64}`),
      ]),
    ], action: { ...scenario.action, text: repair.instruction },
  }, targets);
}

/** Rehydrates one retained, closed construction frontier. No setup or subject effect. */
export async function prepareRetainedWorkflowRepair(request) {
  const { scenario, repair, references } = request;
  const runRoot = await realpath(request.runRoot);
  assert.match(request.attemptId, /^[A-Za-z0-9_-]+$/u);
  const [constructionCall, constructionReceipt, constructionReadReceipt, currentReceipt] =
    await Promise.all([references.constructionCall, references.constructionReceipt,
      references.constructionReadReceipt, references.currentReceipt].map(exactJsonFile));
  const oldTask = constructionCall.invocation.request.input;
  const workspaceBinding = oldTask.workspaceBinding;
  const originalTargets = oldTask.targets ?? oldTask.branches.flatMap((branch) => branch.constructionTask.targets);
  const workspaceAuthorityBasis = oldTask.workspaceAuthorityBasis ?? oldTask.branches[0].constructionTask.workspaceAuthorityBasis;
  assert.equal(await realpath(workspaceAuthorityBasis.canonicalRoot), path.join(runRoot, "worksite"));
  const installedRoot = workspaceBinding.roots.productRoot;
  const [product, abg, installedPublic] = await Promise.all(["product", "abg", "public"].map(
    (surface) => importInstalledSurface(installedRoot, `build/code/src/${surface}/index.js`, Date.now())));
  const closeHandoff = currentReceipt.resources.eventResource.closeHandoff;
  const environmentTruth = abg.projectExactPrefixWorkspaceEnvironment(closeHandoff.prefix,
    { ref: workspaceBinding.bindingId, digest: workspaceBinding.bindingDigest });
  assert.equal(environmentTruth.kind, "exact_prefix_workspace_environment");
  assert.deepEqual(environmentTruth.workspaceBinding, workspaceBinding);
  assert.deepEqual(environmentTruth.workspaceAuthorityBasis, workspaceAuthorityBasis);
  const sourceBasis = sourceResultFromRead(abg, constructionCall, constructionReceipt, constructionReadReceipt);
  const originalResult = sourceBasis.sourceResultValue;
  assert.equal(product.isWorksiteConstructionResult(originalResult), true);
  const targetChange = retainedRepairTargetChange(originalTargets.map((target) => target.subject.relativePath),
    scenarioTargetPaths(scenario), repair);
  const artifactBytes = await readFile(request.artifactPath);
  assert.equal(digest(artifactBytes), request.expectedArtifactDigest);
  const manifest = JSON.parse(await readFile(path.join(installedRoot, "product-toolchain-manifest.json"), "utf8"));
  const verification = await product.ProductVerificationPort.verify({
    kind: "product_verification_packet", schemaVersion: "5.0.0", memberKey: "verify", targetKind: "packed_artifact",
    request: { artifactPath: request.artifactPath, artifactRef: path.basename(request.artifactPath),
      expectedArtifactDigest: request.expectedArtifactDigest,
      expectedProductContentDigest: manifest.productContentDigest,
      expectedManifestDigest: product.sha256Canonical(manifest), expectedProductId: manifest.productId,
      expectedPackageName: manifest.packageName, expectedPackageVersion: manifest.packageVersion },
  });
  assert.equal(verification.kind, "product_verification_success", JSON.stringify(verification));
  const scratch = path.join(runRoot, "reentry", request.attemptId);
  await mkdir(path.dirname(scratch), { recursive: true });
  await mkdir(scratch);
  const prepared = {
    scenario, scratch, scenarioRunRoot: runRoot, product, abg, installedPublic,
    workspaceBinding, workspaceAuthorityBasis, artifactTruth: environmentTruth.artifactTruth,
    admittedInstalls: environmentTruth.productInstalls,
    catalog: constructionCall.resources.catalog, catalogView: constructionCall.resources.catalogView,
    applications: constructionCall.resources.applications,
    install: { artifactPath: request.artifactPath, artifactDigest: request.expectedArtifactDigest,
      installedRoot, verified: verification.verifiedArtifact },
    setupHandoff: closeHandoff, worksiteRoot: workspaceAuthorityBasis.canonicalRoot,
  };
  // These public reads authenticate the selected current close pair before any new Worker.
  const currentRun = { call: references.currentIsConstruction ? constructionCall : await exactJsonFile(references.currentCall),
    receipt: currentReceipt, closeHandoff };
  const currentReadPlan = retainedCurrentReadPlan(currentReceipt, currentRun.call, request.currentFrontier);
  const currentPrefix = abg.selectValidatedRuntimeEventPrefix(abg.readRuntimeEventsAtDurablePrefix(closeHandoff.prefix));
  const currentAdmission = abg.rehydrateInvocationAdmissionAtPrefix(currentPrefix, currentReceipt.resources.invocationAdmission.ref);
  assert.equal(currentAdmission?.publicRequestInvocationRef, currentRun.call.invocation.invocationRef);
  if (!currentReadPlan.needsResult) {
    const replay = abg.replayValidatedRuntimeEventPrefix(abg.selectValidatedRuntimeEventPrefix(currentPrefix.events,
      { runId: currentReceipt.ownerOutput.value.run.ref }), currentPrefix);
    assert.equal(replay.runtimeStatus, "failed");
    assert.equal(replay.runStoppedEventRef, currentReceipt.ownerOutput.value.stop.ref);
  }
  const currentResult = currentReadPlan.needsResult ? await runFreshPublicRead(prepared, currentRun, "run_result") : null;
  const currentReplay = await runFreshPublicRead(prepared, currentRun, "run_replay");
  assert.deepEqual(currentReplay.receipt.resources.eventResource.closeHandoff, closeHandoff);
  const originalFiles = [];
  const originalInputs = [];
  for (const [ordinal, target] of originalTargets.entries()) {
    const observation = await product.observeWorksiteSubject(workspaceAuthorityBasis, workspaceBinding, target.subject);
    assert.deepEqual(observation, originalResult.members[ordinal].successorObservation,
      `retained target drifted from admitted O1: ${target.subject.relativePath}`);
    const bytes = await readFile(path.join(workspaceAuthorityBasis.canonicalRoot, target.subject.relativePath));
    assert.equal(digest(bytes), observation.fileDigest);
    assert.equal(bytes.byteLength, observation.byteLength);
    const contents = bytes.toString("utf8");
    assert.equal(Buffer.compare(Buffer.from(contents, "utf8"), bytes), 0, "repair input requires exact UTF-8");
    originalFiles.push({ relativePath: target.subject.relativePath, sha256: observation.fileDigest, contents });
    originalInputs.push({ subject: target.subject, territory: target.territory, predecessorObservation: observation });
  }
  const directoryDelta = [];
  const currentFiles = [];
  const targetInputs = [];
  for (const relativePath of scenarioTargetPaths(scenario)) {
    const originalIndex = originalFiles.findIndex((file) => file.relativePath === relativePath);
    if (originalIndex !== -1) {
      currentFiles.push(originalFiles[originalIndex]);
      targetInputs.push(originalInputs[originalIndex]);
      continue;
    }
    assert.ok(targetChange.addedPaths.includes(relativePath));
    const absolutePath = path.join(prepared.worksiteRoot, relativePath);
    const relativeRoot = path.posix.dirname(relativePath);
    const parent = path.dirname(absolutePath);
    const segments = relativeRoot.split("/");
    let cursor = prepared.worksiteRoot;
    for (const segment of segments) {
      cursor = path.join(cursor, segment);
      try {
        const stat = await lstat(cursor);
        assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        assert.equal(repair.targetChange.provisionMissingParents, true);
        await mkdir(cursor);
        directoryDelta.push(path.relative(prepared.worksiteRoot, cursor));
      }
    }
    const subject = product.constructWorksiteSubject({ workspaceAuthorityBasis, workspaceBinding,
      subjectUri: pathToFileURL(absolutePath).href, relativePath });
    const territory = product.constructWorksiteTerritory({ workspaceAuthorityBasis, workspaceBinding,
      territoryUri: pathToFileURL(parent).href, relativeRoot });
    const observation = await product.observeWorksiteSubject(workspaceAuthorityBasis, workspaceBinding, subject);
    assert.equal(observation.state, "absent", "new declared target must have native absent O0");
    currentFiles.push({ relativePath, state: "absent", sha256: null, contents: null });
    targetInputs.push({ subject, territory, predecessorObservation: observation });
  }
  const referenceFiles = originalFiles.filter((file) => targetChange.preservedPaths.includes(file.relativePath));
  const preservedInputs = originalInputs.filter((input) => targetChange.preservedPaths.includes(input.subject.relativePath));
  const ids = product.WORKSITE_CONSTRUCTION_IDS;
  const resolution = await product.ProductExecutionResolutionPort.resolve({
    catalog: prepared.catalog, catalogView: prepared.catalogView, admittedInstalls: prepared.admittedInstalls,
    verifyInstallAdmission: (candidate) => abg.hasAdmittedProductInstall(prepared.artifactTruth, candidate),
    programRef: ids.programRef, selection: { kind: "direct", catalogHandle: ids.graphFunctionRef },
  });
  assert.equal(resolution.kind, "loaded_product_execution_resolution", JSON.stringify(resolution));
  const regimes = new Set([...resolution.programValidation.executableLeafRows.map((row) => row.fibre),
    ...resolution.programValidation.interactionLeafRows.map((row) => row.fibre)]);
  const policy = product.constructRootInvocationPolicy(workspaceBinding, resolution.program,
    resolution.programValidation.interactionLeafRows.map((row) => ({ requirementKey: row.requirementKey,
      requirementKeyDigest: row.requirementKeyDigest, actorCapabilityRef: row.requirement.actorCapabilityRef })),
    ["F_D", "F_P", "F_H"].filter((regime) => regimes.has(regime)), prepared.applications);
  const capabilityGrant = product.constructCapabilityGrant(policy, ACTOR, "abg.operation.run.invoke",
    product.DIRECT_INVOKE_CAPABILITY, { admittedInstalls: prepared.admittedInstalls, workspaceBinding,
      fixedPacket: product.RUN_OPERATION_CONTRACTS.invoke.invoke });
  const basis = { workspaceAuthorityBasis, workspaceBinding, capabilityGrant, targets: targetInputs };
  const provisional = product.constructWorksiteConstructionTask({ ...basis, prompt: "Prepare the exact retained repair target vector." });
  const prompt = renderRetainedRepairAction(scenario, provisional.targets, currentFiles, repair, referenceFiles);
  const task = product.constructWorksiteConstructionTask({ ...basis, prompt });
  assert.equal(product.isWorksiteConstructionTask(task), true);
  Object.assign(prepared, { resolution, policy, task, constructionTargets: task.targets, prompt });
  const constructionCallCandidate = await runDefinition(prepared, task, resolution, policy, closeHandoff);
  prepared.installedBefore = await inventoryPackage(installedRoot);
  const protocol = { kind: "retained_workflow_repair_protocol", authority: "diagnostic_only",
    request, sourceBasis, currentReadPlan, currentResult, currentReplay, currentFiles, originalFiles, targetChange,
    directoryDelta, preservedInputs, task,
    constructionCall: constructionCallCandidate, installedBefore: prepared.installedBefore,
    nativeContract: "C2 requires exactly one protected observation per member of its sole admitted construction result",
    liveWorkerInvoked: false };
  const protocolEvidence = await retain(scratch, "repair-protocol.json", protocol);
  return { prepared, repair, currentFiles, preservedInputs, constructionCall: constructionCallCandidate, protocolEvidence };
}

/** One selected C1 repair and C2 proof. No automatic retry or worksite reset. */
export async function executeRetainedWorkflowRepair(plan, environment = process.env) {
  assert.equal(environment.ODD_GLC_RUN_GENERIC_LIVE_WORKFLOW, "1");
  const workerArgs = validateClaudeConfiguration(environment);
  const { prepared, repair, currentFiles } = plan;
  const construction = await applyDeclaredRun(prepared, plan.constructionCall, "repair-c1",
    prepared.product.isWorksiteConstructionResult);
  for (const [ordinal, file] of currentFiles.entries()) {
    if (!repair.changePaths.includes(file.relativePath)) {
      assert.equal(construction.result.members[ordinal].successorObservation.fileDigest, file.sha256,
        `repair changed a preserved target: ${file.relativePath}`);
    }
    if (repair.expectedAfterDigests?.[file.relativePath] !== undefined) {
      assert.equal(construction.result.members[ordinal].successorObservation.fileDigest,
        repair.expectedAfterDigests[file.relativePath], `repair differs from the selected exact change: ${file.relativePath}`);
    }
  }
  for (const input of plan.preservedInputs ?? []) {
    assert.deepEqual(await prepared.product.observeWorksiteSubject(prepared.workspaceAuthorityBasis,
      prepared.workspaceBinding, input.subject), input.predecessorObservation);
  }
  const execution = await constructCommandExecutionTask(prepared, construction);
  assert.equal(execution.executionTask.protectedObservations.length, currentFiles.length);
  const executionCall = await runDefinition(prepared, execution.executionTask, execution.resolution,
    execution.policy, construction.closeHandoff, construction);
  const outcome = await applyDeclaredRun(prepared, executionCall, "repair-c2",
    prepared.product.isWorksiteCommandExecutionObservation);
  await mkdir(path.join(prepared.scratch, "final-reads"));
  const freshResult = await runFreshPublicRead({ ...prepared, scratch: path.join(prepared.scratch, "final-reads") }, outcome, "run_result");
  const freshReplay = await runFreshPublicRead({ ...prepared, scratch: path.join(prepared.scratch, "final-reads") }, outcome, "run_replay");
  const installedAfter = await inventoryPackage(prepared.install.installedRoot);
  assert.equal(installedAfter.digest, prepared.installedBefore.digest);
  for (const input of plan.preservedInputs ?? []) {
    assert.deepEqual(await prepared.product.observeWorksiteSubject(prepared.workspaceAuthorityBasis,
      prepared.workspaceBinding, input.subject), input.predecessorObservation);
  }
  const validation = evaluateGenericScenarioOutcome(prepared.scenario, outcome.result);
  const result = { kind: "retained_workflow_repair_result", authority: "diagnostic_only",
    disposition: validation.disposition === "satisfied" ? "awaiting_review" : "validation_failed",
    runRoot: prepared.scenarioRunRoot, worksiteRoot: prepared.worksiteRoot, protocolEvidence: plan.protocolEvidence,
    abiArtifactSha256: prepared.install.artifactDigest, workerArgs, construction, execution: outcome,
    freshResult, freshReplay, installedAfter, validation };
  const evidence = await retain(prepared.scratch, "repair-result.json", result);
  return { ...result, retainedEvidence: evidence };
}

/** Re-enters C2 from one completed construction; no C1, setup, or install replay. */
export async function prepareRetainedWorkflowExecution(request) {
  const { scenario, references } = request;
  const runRoot = await realpath(request.runRoot);
  assert.match(request.attemptId, /^[A-Za-z0-9_-]+$/u);
  const [constructionCall, constructionReceipt, constructionReadReceipt, originalExecutionCall] =
    await Promise.all([references.constructionCall, references.constructionReceipt,
      references.constructionReadReceipt, references.executionCall].map(exactJsonFile));
  const oldTask = constructionCall.invocation.request.input;
  const workspaceBinding = oldTask.workspaceBinding;
  const constructionTargets = oldTask.targets ?? oldTask.branches.flatMap((branch) => branch.constructionTask.targets);
  const workspaceAuthorityBasis = oldTask.workspaceAuthorityBasis ?? oldTask.branches[0].constructionTask.workspaceAuthorityBasis;
  assert.equal(await realpath(workspaceAuthorityBasis.canonicalRoot), path.join(runRoot, "worksite"));
  assert.deepEqual(constructionTargets.map((target) => target.subject.relativePath), scenarioTargetPaths(scenario));
  const installedRoot = workspaceBinding.roots.productRoot;
  const [product, abg, installedPublic] = await Promise.all(["product", "abg", "public"].map(
    (surface) => importInstalledSurface(installedRoot, `build/code/src/${surface}/index.js`, Date.now())));
  const closeHandoff = constructionReadReceipt.resources.eventResource.closeHandoff;
  assert.deepEqual(constructionReceipt.resources.eventResource.closeHandoff, closeHandoff);
  assert.deepEqual(originalExecutionCall.resources.eventResource.closeHandoff, closeHandoff);
  assert.equal(closeHandoff.prefix.prefixDigest, request.expectedPrefixDigest);
  const environmentTruth = abg.projectExactPrefixWorkspaceEnvironment(closeHandoff.prefix,
    { ref: workspaceBinding.bindingId, digest: workspaceBinding.bindingDigest });
  assert.equal(environmentTruth.kind, "exact_prefix_workspace_environment");
  assert.deepEqual(environmentTruth.workspaceBinding, workspaceBinding);
  assert.deepEqual(environmentTruth.workspaceAuthorityBasis, workspaceAuthorityBasis);
  assert.equal(digest(await readFile(request.artifactPath)), request.expectedArtifactDigest);
  const manifest = JSON.parse(await readFile(path.join(installedRoot, "product-toolchain-manifest.json"), "utf8"));
  const verification = await product.ProductVerificationPort.verify({
    kind: "product_verification_packet", schemaVersion: "5.0.0", memberKey: "verify", targetKind: "packed_artifact",
    request: { artifactPath: request.artifactPath, artifactRef: path.basename(request.artifactPath),
      expectedArtifactDigest: request.expectedArtifactDigest,
      expectedProductContentDigest: manifest.productContentDigest,
      expectedManifestDigest: product.sha256Canonical(manifest), expectedProductId: manifest.productId,
      expectedPackageName: manifest.packageName, expectedPackageVersion: manifest.packageVersion },
  });
  assert.equal(verification.kind, "product_verification_success", JSON.stringify(verification));
  const scratch = path.join(runRoot, "reentry", request.attemptId);
  await mkdir(path.dirname(scratch), { recursive: true });
  await mkdir(scratch);
  const prepared = {
    scenario, scratch, scenarioRunRoot: runRoot, product, abg, installedPublic,
    workspaceBinding, workspaceAuthorityBasis, artifactTruth: environmentTruth.artifactTruth,
    admittedInstalls: environmentTruth.productInstalls, constructionTargets,
    catalog: constructionCall.resources.catalog, catalogView: constructionCall.resources.catalogView,
    applications: constructionCall.resources.applications,
    install: { artifactPath: request.artifactPath, artifactDigest: request.expectedArtifactDigest,
      installedRoot, verified: verification.verifiedArtifact },
    setupHandoff: closeHandoff, worksiteRoot: workspaceAuthorityBasis.canonicalRoot,
  };
  const sourceBasis = sourceResultFromRead(abg, constructionCall, constructionReceipt, constructionReadReceipt);
  const construction = { call: constructionCall, receipt: constructionReceipt, closeHandoff,
    sourceBasis, result: sourceBasis.sourceResultValue, resultRef: sourceBasis.sourceResultRef,
    runId: constructionReceipt.ownerOutput.value.run.ref,
    resultRead: { receipt: constructionReadReceipt } };
  assert.equal(product.isWorksiteConstructionResult(construction.result), true);
  const freshConstructionResult = await runFreshPublicRead(prepared, construction, "run_result");
  const freshConstructionReplay = await runFreshPublicRead(prepared, construction, "run_replay");
  for (const [ordinal, target] of constructionTargets.entries()) {
    const current = await product.observeWorksiteSubject(workspaceAuthorityBasis, workspaceBinding, target.subject);
    assert.deepEqual(current, construction.result.members[ordinal].successorObservation,
      `retained construction target drifted: ${target.subject.relativePath}`);
  }
  const selectedConstruction = await selectConstructionExecutionSource(prepared, construction);
  const execution = await constructCommandExecutionTask(prepared, selectedConstruction);
  assert.deepEqual(execution.executionTask, originalExecutionCall.invocation.request.input,
    "C2 continuation must conserve the exact previously refused execution task");
  const { ABI5_PRODUCT_SEMANTICS } = await importInstalledSurface(installedRoot,
    "build/code/src/product/builtin_semantics.js", Date.now());
  assert.equal(ABI5_PRODUCT_SEMANTICS.validateInvocationBasis({
    input: execution.executionTask, workspaceId: workspaceBinding.workspaceId,
    workspaceBindingId: workspaceBinding.bindingId, workspaceBindingDigest: workspaceBinding.bindingDigest,
    sourceResultBasis: selectedConstruction.sourceBasis,
  }), true);
  const executionCall = await runDefinition(prepared, execution.executionTask, execution.resolution,
    execution.policy, closeHandoff, selectedConstruction);
  assert.deepEqual(executionCall.invocation.request.catalogView, originalExecutionCall.invocation.request.catalogView);
  prepared.installedBefore = await inventoryPackage(installedRoot);
  const protocol = { kind: "retained_workflow_execution_protocol", authority: "diagnostic_only", request,
    originalExecutionCall, construction: selectedConstruction, freshConstructionResult, freshConstructionReplay,
    executionCall, installedBefore: prepared.installedBefore, nativeInputBasisAccepted: true,
    constructionRepeated: false, liveWorkerInvoked: false };
  const protocolEvidence = await retain(scratch, "execution-protocol.json", protocol);
  return { prepared, construction: selectedConstruction, executionCall, protocolEvidence };
}

export async function executeRetainedWorkflowExecution(plan, environment = process.env) {
  assert.equal(environment.ODD_GLC_RUN_GENERIC_LIVE_WORKFLOW, "1");
  const workerArgs = validateClaudeConfiguration(environment);
  const { prepared } = plan;
  const outcome = await applyDeclaredRun(prepared, plan.executionCall, "continued-c2",
    prepared.product.isWorksiteCommandExecutionObservation);
  await mkdir(path.join(prepared.scratch, "final-reads"));
  const finalEnvironment = { ...prepared, scratch: path.join(prepared.scratch, "final-reads") };
  const freshResult = await runFreshPublicRead(finalEnvironment, outcome, "run_result");
  const freshReplay = await runFreshPublicRead(finalEnvironment, outcome, "run_replay");
  const installedAfter = await inventoryPackage(prepared.install.installedRoot);
  assert.equal(installedAfter.digest, prepared.installedBefore.digest);
  const validation = evaluateGenericScenarioOutcome(prepared.scenario, outcome.result);
  const result = { kind: "retained_workflow_execution_result", authority: "diagnostic_only",
    disposition: validation.disposition === "satisfied" ? "awaiting_review" : "validation_failed",
    runRoot: prepared.scenarioRunRoot, worksiteRoot: prepared.worksiteRoot, protocolEvidence: plan.protocolEvidence,
    abiArtifactSha256: prepared.install.artifactDigest, workerArgs, construction: plan.construction,
    execution: outcome, freshResult, freshReplay, installedAfter, validation, constructionRepeated: false };
  const evidence = await retain(prepared.scratch, "execution-result.json", result);
  return { ...result, retainedEvidence: evidence };
}
