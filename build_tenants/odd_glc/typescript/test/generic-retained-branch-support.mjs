import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  constructGenericWorkflowTask, importInstalledSurface, scenarioTargetPaths,
} from "./generic-live-workflow-support.mjs";
import { retainedCurrentReadPlan } from "./generic-retained-workflow-support.mjs";

const digest = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;

async function exactJson(coordinate) {
  const bytes = await readFile(coordinate.path);
  assert.equal(digest(bytes), coordinate.sha256, `retained evidence changed: ${coordinate.path}`);
  return JSON.parse(bytes.toString("utf8"));
}

/** Contract contiguous authored branches into an explicitly selected repair DAG. */
export function regroupRetainedBranchScenario(original, groups) {
  const originalRefs = original.territories.map((row) => row.id);
  assert.ok(groups.length > 1, "repair retains actual branch fan-in");
  assert.equal(new Set(groups.map((row) => row.id)).size, groups.length);
  assert.ok(groups.every((row) => typeof row.id === "string" && row.id.length > 0 && row.sourceBranchRefs.length > 0));
  assert.deepEqual(groups.flatMap((row) => row.sourceBranchRefs), originalRefs,
    "repair groups must conserve every original branch exactly once and in order");
  const owner = new Map(groups.flatMap((group, ordinal) => group.sourceBranchRefs.map((ref) => [ref, ordinal])));
  const territories = groups.map((group, ordinal) => {
    const sources = group.sourceBranchRefs.map((ref) => original.territories.find((row) => row.id === ref));
    const dependencies = [...new Set(sources.flatMap((row) => row.dependsOn).map((ref) => {
      assert.ok(owner.has(ref), "original branch dependency is undeclared");
      return owner.get(ref);
    }))].filter((index) => index !== ordinal).sort((a, b) => a - b);
    assert.ok(dependencies.every((index) => index < ordinal), "repair dependency must precede its consumer");
    return { id: group.id, paths: sources.flatMap((row) => row.paths),
      dependsOn: dependencies.map((index) => groups[index].id) };
  });
  const scenario = { ...structuredClone(original), territories };
  assert.deepEqual(scenarioTargetPaths(scenario), scenarioTargetPaths(original));
  assert.ok(territories.some((row) => row.dependsOn.length > 1), "repair must retain admitted-result fan-in");
  return scenario;
}

/** Old bytes are input provenance; current target identities come only from the selected epoch. */
export function validateRetainedBranchTargets(targetInputs, retainedFiles) {
  const paths = targetInputs.map((target) => target.subject.relativePath);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(new Set(retainedFiles.map((file) => file.relativePath)).size, retainedFiles.length);
  for (const file of retainedFiles) {
    assert.ok(paths.includes(file.relativePath), "retained input must be a declared repair target");
    const bytes = Buffer.from(file.contents, "utf8");
    assert.equal(digest(bytes), file.sha256, "retained UTF-8 bytes differ from authenticated input");
    assert.equal(bytes.length, file.byteLength);
  }
  for (const target of targetInputs) {
    const file = retainedFiles.find((row) => row.relativePath === target.subject.relativePath);
    const observation = target.predecessorObservation;
    if (file === undefined) {
      assert.equal(observation.state, "absent", "unfinished target must have fresh native absent O0");
    } else {
      assert.equal(observation.state, "file");
      assert.equal(observation.fileDigest, file.sha256, "current epoch target differs from retained bytes");
      assert.equal(observation.byteLength, file.byteLength);
    }
  }
}

/** Uses the existing native task constructors; it does not select an artifact or output schema. */
export function constructRetainedBranchTask({ originalScenario, scenario, retainedFiles, ...basis }) {
  assert.deepEqual({ ...scenario, territories: originalScenario.territories }, originalScenario,
    "repair declaration may regroup branches, not change the requested outcome");
  assert.deepEqual(scenarioTargetPaths(scenario), scenarioTargetPaths(originalScenario));
  validateRetainedBranchTargets(basis.targetInputs, retainedFiles);
  const constructionConstraints = [
    ...(scenario.constructionConstraints ?? []),
    "This is a fresh construction invocation in the retained scenario instance. Prior failed invocation evidence remains separate; no failed-run resumption or inherited aggregate is asserted.",
    "The exact retained source below is authenticated prior-epoch input. Current target authority and O0 belong only to this invocation's selected workspace binding.",
    "For each retained file that is one of your targets, return exactly these UTF-8 bytes, including whitespace and final newline. Do not redesign or regenerate it. A retained file outside your targets is reference input only; never return or modify it.",
    "Author the missing target implementations and tests through your actual native Worker result. Preserve all declared outcome checks and use the supplied retained interfaces.",
    "Use replacementText for newly authored source. For retained no-op targets, copy the supplied canonical replacementBase64 verbatim. Return exactly one content field per file, as required by the selected native output contract.",
    ...retainedFiles.map((file) => `RETAINED SOURCE INPUT ${file.relativePath}; ${file.sha256}; ${file.byteLength} bytes; UTF-8 JSON STRING: ${JSON.stringify(file.contents)}`),
    ...retainedFiles.map((file) => `KNOWN NO-OP INPUT ${file.relativePath}; replacementBase64: ${Buffer.from(file.contents, "utf8").toString("base64")}`),
  ];
  return constructGenericWorkflowTask({ ...basis, scenario: { ...scenario, constructionConstraints } });
}

/** Apply after native construction admission and before any C2 call is prepared. */
export function assertRetainedBranchResult(product, result, targets, retainedFiles) {
  assert.equal(product.isWorksiteConstructionResult(result), true);
  assert.deepEqual(result.members.map((member) => member.inputMemberRef), targets.map((target) => target.targetRef));
  for (const [ordinal, target] of targets.entries()) {
    const member = result.members[ordinal];
    assert.equal(member.successorObservation.subjectRef, target.subject.subjectRef);
    assert.equal(member.successorObservation.subjectDigest, target.subject.subjectDigest);
    const file = retainedFiles.find((row) => row.relativePath === target.subject.relativePath);
    if (file === undefined) continue;
    assert.equal(member.successorObservation.fileDigest, file.sha256,
      "admitted construction changed retained bytes; withhold C2 and return the first cause");
    assert.equal(member.successorObservation.byteLength, file.byteLength);
  }
}

/** Read-only preparation of prior-epoch input. No install, task dispatch, or subject effect. */
export async function prepareRetainedBranchInputs(request) {
  const [call, receipt, originalScenario] = await Promise.all([
    exactJson(request.references.constructionCall), exactJson(request.references.constructionReceipt),
    exactJson(request.references.originalScenario),
  ]);
  const scenario = regroupRetainedBranchScenario(originalScenario, request.groups);
  const task = call.invocation.request.input;
  const runRoot = await realpath(request.runRoot);
  const workspaceBinding = task.workspaceBinding;
  const workspaceAuthorityBasis = task.branches[0].constructionTask.workspaceAuthorityBasis;
  assert.equal(await realpath(workspaceAuthorityBasis.canonicalRoot), path.join(runRoot, "worksite"));
  assert.deepEqual(task.branches.map((branch) => branch.branchRef), originalScenario.territories.map((row) => row.id));
  const targets = task.branches.flatMap((branch) => branch.constructionTask.targets);
  assert.deepEqual(targets.map((target) => target.subject.relativePath), scenarioTargetPaths(originalScenario));
  const [product, abg] = await Promise.all(["product", "abg"].map((surface) =>
    importInstalledSurface(workspaceBinding.roots.productRoot, `build/code/src/${surface}/index.js`, Date.now())));
  assert.equal(product.isWorksiteBranchConstructionTask(task), true);
  assert.deepEqual(retainedCurrentReadPlan(receipt, call, request.currentFrontier), { needsResult: false });
  const closeHandoff = receipt.resources.eventResource.closeHandoff;
  const eventPath = fileURLToPath(closeHandoff.prefix.eventLogRef);
  const beforeBytes = await readFile(eventPath);
  assert.equal(beforeBytes.length, closeHandoff.prefix.prefixLength, "selected failed prefix must still be current");
  assert.equal(digest(beforeBytes), closeHandoff.prefix.prefixDigest);
  const prefix = abg.selectValidatedRuntimeEventPrefix(abg.readRuntimeEventsAtDurablePrefix(closeHandoff.prefix));
  const admission = abg.rehydrateInvocationAdmissionAtPrefix(prefix, receipt.resources.invocationAdmission.ref);
  assert.equal(admission?.publicRequestInvocationRef, call.invocation.invocationRef);
  assert.equal(admission.publicRequestDigest, call.invocation.requestDigest);
  const environment = abg.projectExactPrefixWorkspaceEnvironment(closeHandoff.prefix,
    { ref: workspaceBinding.bindingId, digest: workspaceBinding.bindingDigest });
  assert.equal(environment.kind, "exact_prefix_workspace_environment");
  assert.deepEqual(environment.workspaceBinding, workspaceBinding);
  assert.deepEqual(environment.workspaceAuthorityBasis, workspaceAuthorityBasis);
  const runRef = receipt.ownerOutput.value.run.ref;
  const runPrefix = abg.selectValidatedRuntimeEventPrefix(prefix.events, { runId: runRef });
  const replay = abg.replayValidatedRuntimeEventPrefix(runPrefix, prefix);
  assert.equal(replay.runtimeStatus, "failed");
  assert.equal(replay.runStoppedEventRef, receipt.ownerOutput.value.stop.ref);
  const successful = runPrefix.events.filter((event) => event.kind === "c_call_result_admitted" &&
    event.graphFunctionRef === product.WORKSITE_CONSTRUCTION_IDS.graphFunctionRef &&
    product.isWorksiteConstructionResult(event.payload.value));
  assert.deepEqual(successful.map((event) => event.eventId), request.admittedBranchResultEventRefs,
    "selected provenance must cover exactly the successful nested construction results");
  const retainedFiles = [];
  const retainedBranches = successful.map((event) => {
    const rows = replay.cCalls.filter((row) => row.cCallRef === event.payload.cCallRef);
    assert.equal(rows.length, 1);
    const row = rows[0];
    assert.equal(row.status, "judged");
    assert.equal(row.judgment, "advance");
    assert.equal(row.resultRef, event.payload.resultRef);
    assert.equal(row.resultDigest, event.payload.resultDigest);
    assert.deepEqual(row.resultValue, event.payload.value);
    const result = row.resultValue;
    const branches = task.branches.filter((branch) =>
      JSON.stringify(branch.constructionTask.targets.map((target) => target.targetRef)) ===
      JSON.stringify(result.members.map((member) => member.inputMemberRef)));
    assert.equal(branches.length, 1, "admitted result must cover one exact original branch");
    return { branchRef: branches[0].branchRef, graphCallId: event.graphCallId,
      resultAdmissionEventRef: event.eventId, cCall: row, result };
  });
  const observations = [];
  for (const target of targets) {
    const members = retainedBranches.flatMap((branch) => branch.result.members)
      .filter((member) => member.inputMemberRef === target.targetRef);
    assert.ok(members.length <= 1);
    const observation = await product.observeWorksiteSubject(workspaceAuthorityBasis, workspaceBinding, target.subject);
    observations.push({ subject: target.subject, territory: target.territory, predecessorObservation: observation });
    if (members.length === 0) {
      assert.equal(observation.state, "absent", "unfinished old-epoch target has unexpected content");
      continue;
    }
    const member = members[0];
    assert.deepEqual(observation, member.successorObservation, "retained file differs from original admitted O1");
    assert.equal(member.receipt.committed, true);
    assert.equal(member.receipt.afterObservationRef, observation.observationRef);
    assert.equal(member.receipt.afterObservationDigest, observation.observationDigest);
    const bytes = await readFile(path.join(workspaceAuthorityBasis.canonicalRoot, target.subject.relativePath));
    assert.equal(digest(bytes), member.receipt.writtenDigest);
    const contents = bytes.toString("utf8");
    assert.equal(Buffer.compare(Buffer.from(contents, "utf8"), bytes), 0);
    retainedFiles.push({ relativePath: target.subject.relativePath, contents, sha256: digest(bytes),
      byteLength: bytes.length, originalTargetRef: target.targetRef, originalReceipt: member.receipt,
      originalObservation: observation });
  }
  validateRetainedBranchTargets(observations, retainedFiles);
  assert.deepEqual(await readFile(eventPath), beforeBytes, "preparation must not change authority bytes");
  return { kind: "retained_branch_input_preparation", authority: "diagnostic_only", request,
    originalScenario, scenario, retainedFiles, retainedBranches,
    previousEpoch: { workspaceAuthorityBasis, workspaceBinding, closeHandoff,
      invocationAdmission: admission, replayRef: replay.replayRef, replayDigest: replay.replayDigest,
      runtimeStatus: replay.runtimeStatus, observations },
    nextEpoch: null, nativeConstructionTask: null, liveWorkerInvoked: false,
    disposition: "input_ready_pending_selected_artifact_and_fresh_epoch_observations" };
}
