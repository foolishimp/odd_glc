import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  GENERIC_LIVE_WORKFLOW_ARTIFACT,
  GENERIC_LIVE_WORKFLOW_ARTIFACT_SHA256,
  GENERIC_LIVE_WORKFLOW_ABSOLUTE_TIMEOUT_MS,
  GENERIC_LIVE_WORKFLOW_GATE,
  GENERIC_LIVE_WORKFLOW_INACTIVITY_TIMEOUT_MS,
  GENERIC_LIVE_WORKFLOW_SCENARIOS,
  GENERIC_INSTALLED_NO_LIVE_GATE,
  constructGenericWorkflowTask,
  evaluateGenericScenarioOutcome,
  genericLiveWorkflowSkip,
  qualifyGenericWorkflowInstalledNoLive,
  renderGenericWorkflowAction,
  runGenericLiveWorkflowScenario,
  scenarioTargetPaths,
  scenarioHasConstructionFanIn,
  selectGenericWorkflowScenarios,
} from "./generic-live-workflow-support.mjs";

const testRoot = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(await readFile(
  path.join(testRoot, "fixtures", "generic-workflow-scenarios.json"),
  "utf8",
));
const enabledNoUltraEnvironment = Object.freeze({
  [GENERIC_LIVE_WORKFLOW_GATE]: "1",
  ABG_TS_FP_TIMEOUT_MS: String(GENERIC_LIVE_WORKFLOW_INACTIVITY_TIMEOUT_MS),
  ABG_TS_FP_ABSOLUTE_TIMEOUT_MS:
    String(GENERIC_LIVE_WORKFLOW_ABSOLUTE_TIMEOUT_MS),
});
const FAKE_ARTIFACT_DIGEST = `sha256:${"0".repeat(64)}`;

test("generic branch binding preserves authored dependencies and disjoint target attribution", () => {
  // Projection witness only; installed Product admission is checked separately.
  const product = {
    constructWorksiteConstructionTask: (input) => ({ ...input,
      targets: input.targets.map((target) => ({ ...target,
        targetRef: `target://${target.subject.relativePath}` })) }),
    constructWorksiteBranchConstructionTask: (input) => input,
  };
  for (const scenario of fixture.scenarios) {
    const inputs = scenarioTargetPaths(scenario).map((relativePath) => ({
      subject: { relativePath }, predecessorObservation: { state: "absent" },
    }));
    const result = constructGenericWorkflowTask({ product, scenario, targetInputs: inputs });
    assert.deepEqual(result.targets.map((target) => target.subject.relativePath), scenarioTargetPaths(scenario));
    const branched = scenarioHasConstructionFanIn(scenario);
    assert.equal(Boolean(result.task.branches), branched);
    assert.equal(scenarioHasConstructionFanIn({ ...scenario, key: "renamed-subject" }), branched);
    if (!branched) continue;
    assert.deepEqual(result.task.branches.map(({ branchRef, dependsOn, constructionTask }) => ({
      id: branchRef, dependsOn, paths: constructionTask.targets.map((target) => target.subject.relativePath),
    })), scenario.territories);
    for (const branch of result.task.branches) {
      for (const constraint of scenario.constructionConstraints ?? []) {
        assert.equal(branch.constructionTask.prompt.includes(constraint), true);
      }
      const targetRefs = [...branch.constructionTask.prompt.matchAll(/^- targetRef: (.+)$/gmu)]
        .map((match) => match[1]);
      assert.deepEqual(targetRefs, branch.constructionTask.targets.map((target) => target.targetRef));
    }
    assert.throws(() => constructGenericWorkflowTask({ product, scenario,
      targetInputs: [...inputs].reverse() }), /preserve fixture target order/u);
  }
});

test("generic live workflow keeps one data-driven activation shape for all seven scenarios", () => {
  const rows = selectGenericWorkflowScenarios(fixture, "all");
  assert.equal(rows.length, 7);
  for (const scenario of rows) {
    const paths = scenarioTargetPaths(scenario);
    const targets = paths.map((relativePath, ordinal) => ({
      targetRef: `worksite-construction-target://example/${scenario.key}-${ordinal}`,
      subject: { relativePath },
      predecessorObservation: { state: "absent" },
    }));
    const prompt = renderGenericWorkflowAction(scenario, targets);
    assert.match(prompt, /^ROLE\n/u, scenario.key);
    assert.equal(prompt.includes(scenario.subject.id), true, scenario.key);
    assert.equal(
      targets.every((target) => prompt.includes(target.targetRef)),
      true,
      scenario.key,
    );
    assert.equal(
      scenario.validationCommands.every((command) => prompt.includes(command.id)),
      true,
      scenario.key,
    );
    assert.equal(
      scenario.outcomePredicates.every((predicate) =>
        prompt.includes(predicate.id) && prompt.includes(JSON.stringify(predicate))
      ),
      true,
      `${scenario.key} exact outcome predicates`,
    );
    assert.equal(
      prompt.endsWith(`ACTION\n${scenario.action.text}`),
      true,
      `${scenario.key} action must be last`,
    );
    assert.equal(
      scenario.allowedEvidenceWrites.every((territory) =>
        prompt.includes(`${territory.pathKind}: ${territory.relativePath}`)
      ),
      true,
      `${scenario.key} execution-evidence authority`,
    );
    assert.equal(/prompt engine|scenario-specific runtime/iu.test(scenario.action.text), false);
  }
});

test("generic live workflow requires an explicit gate and returns one typed skip", async () => {
  const environment = {};
  const skip = genericLiveWorkflowSkip(environment);
  assert.deepEqual(skip, {
    kind: "generic_live_workflow_skip",
    schemaVersion: "1",
    disposition: "skipped",
    gate: GENERIC_LIVE_WORKFLOW_GATE,
    requiredValue: "1",
    liveWorkerInvoked: false,
  });
  const result = await runGenericLiveWorkflowScenario({
    scenario: fixture.scenarios[0],
    artifactPath: "/not/read/without/the/gate.tgz",
    environment,
  });
  assert.deepEqual(result, skip);
});

test("generic live workflow accepts explicit Claude efforts and prohibits Ultra", async () => {
  const enabled = enabledNoUltraEnvironment;
  const scratch = await mkdtemp(path.join(os.tmpdir(), "odd-glc-effort-test-"));
  try {
    for (const effort of ["low", "medium", "high", "xhigh", "max"]) {
      await assert.rejects(
        runGenericLiveWorkflowScenario({
          scenario: fixture.scenarios[0],
          artifactPath: "/not/read/after-worker-configuration.tgz",
          expectedArtifactDigest: FAKE_ARTIFACT_DIGEST,
          runRoot: path.join(scratch, effort),
          environment: {
            ...enabled,
            ABG_TS_CLAUDE_APPEND_ARGS: JSON.stringify(["--effort", effort]),
          },
        }),
        /after-worker-configuration\.tgz/u,
      );
    }
    for (const appendArgs of [
      [],
      ["--effort", "unknown"],
      ["--effort", "high", "--effort", "xhigh"],
    ]) {
      await assert.rejects(
        runGenericLiveWorkflowScenario({
          scenario: fixture.scenarios[0],
          artifactPath: "/not/read/before-worker-configuration.tgz",
          expectedArtifactDigest: FAKE_ARTIFACT_DIGEST,
          environment: {
            ...enabled,
            ABG_TS_CLAUDE_APPEND_ARGS: JSON.stringify(appendArgs),
          },
        }),
        /require exactly one supported --effort/u,
      );
    }
    await assert.rejects(
      runGenericLiveWorkflowScenario({
        scenario: fixture.scenarios[0],
        artifactPath: "/not/read/before/worker-configuration.tgz",
        expectedArtifactDigest: FAKE_ARTIFACT_DIGEST,
        environment: {
          ...enabled,
          ABG_TS_CLAUDE_APPEND_ARGS: JSON.stringify([
            "--effort",
            "xhigh",
            "--mode",
            "Ultra",
          ]),
        },
      }),
      /Ultra is prohibited/u,
    );
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("generic live workflow forwards and restores one valid absolute Worker lease", async () => {
  const priorTimeout = process.env.ABG_TS_FP_TIMEOUT_MS;
  const priorAbsoluteTimeout = process.env.ABG_TS_FP_ABSOLUTE_TIMEOUT_MS;
  const scratch = await mkdtemp(path.join(os.tmpdir(), "odd-glc-timeout-test-"));
  process.env.ABG_TS_FP_TIMEOUT_MS = "111111";
  process.env.ABG_TS_FP_ABSOLUTE_TIMEOUT_MS = "222222";
  try {
    const operation = runGenericLiveWorkflowScenario({
      scenario: fixture.scenarios[0],
      artifactPath: path.join(scratch, "missing-abi-artifact.tgz"),
      expectedArtifactDigest: FAKE_ARTIFACT_DIGEST,
      runRoot: path.join(scratch, "retained-run"),
      environment: {
        ...enabledNoUltraEnvironment,
        ABG_TS_CLAUDE_APPEND_ARGS: JSON.stringify(["--effort", "xhigh"]),
      },
    });
    assert.equal(
      process.env.ABG_TS_FP_TIMEOUT_MS,
      String(GENERIC_LIVE_WORKFLOW_INACTIVITY_TIMEOUT_MS),
    );
    assert.equal(
      process.env.ABG_TS_FP_ABSOLUTE_TIMEOUT_MS,
      String(GENERIC_LIVE_WORKFLOW_ABSOLUTE_TIMEOUT_MS),
    );
    await assert.rejects(operation, /missing-abi-artifact\.tgz/u);
    assert.equal(process.env.ABG_TS_FP_TIMEOUT_MS, "111111");
    assert.equal(process.env.ABG_TS_FP_ABSOLUTE_TIMEOUT_MS, "222222");
  } finally {
    if (priorTimeout === undefined) delete process.env.ABG_TS_FP_TIMEOUT_MS;
    else process.env.ABG_TS_FP_TIMEOUT_MS = priorTimeout;
    if (priorAbsoluteTimeout === undefined) {
      delete process.env.ABG_TS_FP_ABSOLUTE_TIMEOUT_MS;
    } else {
      process.env.ABG_TS_FP_ABSOLUTE_TIMEOUT_MS = priorAbsoluteTimeout;
    }
    await rm(scratch, { recursive: true, force: true });
  }
});

test("generic live workflow rejects any lease other than the bounded C2 campaign lease", async () => {
  const enabled = {
    ...enabledNoUltraEnvironment,
    ABG_TS_CLAUDE_APPEND_ARGS: JSON.stringify(["--effort", "xhigh"]),
  };
  for (const inactivityTimeout of [undefined, "0", "60000", "900001"]) {
    await assert.rejects(
      runGenericLiveWorkflowScenario({
        scenario: fixture.scenarios[0],
        artifactPath: "/not/read/before/inactivity-timeout-validation.tgz",
        expectedArtifactDigest: FAKE_ARTIFACT_DIGEST,
        environment: {
          ...enabled,
          ABG_TS_FP_TIMEOUT_MS: inactivityTimeout,
        },
      }),
      /ABG_TS_FP_TIMEOUT_MS must equal 900000/u,
    );
  }
  for (const absoluteTimeout of [undefined, "0", "900000", "3600001"]) {
    await assert.rejects(
      runGenericLiveWorkflowScenario({
        scenario: fixture.scenarios[0],
        artifactPath: "/not/read/before/absolute-timeout-validation.tgz",
        expectedArtifactDigest: FAKE_ARTIFACT_DIGEST,
        environment: {
          ...enabled,
          ABG_TS_FP_ABSOLUTE_TIMEOUT_MS: absoluteTimeout,
        },
      }),
      /ABG_TS_FP_ABSOLUTE_TIMEOUT_MS must equal 3600000/u,
    );
  }
});

test("generic live workflow requires a pinned C1+C2 artifact digest before setup", async () => {
  await assert.rejects(
    runGenericLiveWorkflowScenario({
      scenario: fixture.scenarios[0],
      artifactPath: "/not/read/without/a/digest.tgz",
      environment: {
        ...enabledNoUltraEnvironment,
        ABG_TS_CLAUDE_APPEND_ARGS: JSON.stringify(["--effort", "xhigh"]),
      },
    }),
    /expected ABI C1\+C2 artifact digest must be a non-empty string/u,
  );
});

function satisfyingObservedValue(predicate) {
  if (predicate.kind === "test_pass_count") return predicate.greaterThanOrEqual;
  if (predicate.kind === "http_response_exact") {
    return {
      request: {
        hostname: predicate.request.hostname,
        port: 43210,
        method: predicate.request.method,
        path: predicate.request.path,
        timeoutMs: predicate.request.timeoutMs,
      },
      portFile: {
        relativePath: predicate.launch.portFile.relativePath,
        port: 43210,
        state: "observed",
        issue: null,
      },
      response: { status: predicate.status, body: predicate.body },
      process: { terminationConfirmed: true },
    };
  }
  return structuredClone(predicate.equals);
}

function admittedExecutionObservation(scenario, replace = (value) => value) {
  return Object.freeze({
    kind: "worksite_command_execution_observation",
    schemaVersion: "5.0.0",
    observationRef: `worksite-command-execution-observation://example/${scenario.key}`,
    observationDigest: `sha256:${"a".repeat(64)}`,
    commandResults: Object.freeze([]),
    predicateObservations: Object.freeze(scenario.outcomePredicates.map(
      (predicate, ordinal) => Object.freeze({
        kind: "worksite_predicate_observation",
        schemaVersion: "5.0.0",
        ordinal,
        predicateId: predicate.id,
        predicateKind: predicate.kind,
        observedValue: replace(satisfyingObservedValue(predicate), predicate, ordinal),
        evidence: Object.freeze([{ kind: "admitted_c2_test_coordinate", ordinal }]),
        evidenceRefs: Object.freeze([`evidence://example/${scenario.key}/${ordinal}`]),
      }),
    )),
  });
}

test("generic outcome interpretation consumes only admitted C2 predicate rows for all ten kinds", () => {
  const observedKinds = new Set();
  for (const scenario of fixture.scenarios) {
    const observation = admittedExecutionObservation(scenario);
    const validation = evaluateGenericScenarioOutcome(scenario, observation);
    assert.equal(validation.disposition, "satisfied", scenario.key);
    assert.equal(validation.source.observationRef, observation.observationRef);
    assert.equal(validation.commands, observation.commandResults);
    assert.deepEqual(
      validation.predicates.map((row) => row.observed),
      observation.predicateObservations.map((row) => row.observedValue),
    );
    scenario.outcomePredicates.forEach((predicate) => observedKinds.add(predicate.kind));
  }
  assert.equal(observedKinds.size, 10);
});

test("generic outcome interpretation compares only set-valued kinds as exact unique string sets", () => {
  const mapper = fixture.scenarios.find((scenario) => scenario.key === "data-mapper-full");
  for (const kind of ["module_set_exact", "test_report_set_exact"]) {
    const predicate = mapper.outcomePredicates.find((row) => row.kind === kind);
    const scenario = { key: mapper.key, outcomePredicates: [predicate] };
    const evaluate = (value, selected = scenario) => evaluateGenericScenarioOutcome(
      selected, admittedExecutionObservation(selected, () => value),
    ).disposition;
    const before = structuredClone(predicate.equals);
    assert.equal(evaluate([...before].reverse()), "satisfied", `${kind}: permutation`);
    assert.deepEqual(predicate.equals, before, `${kind}: declaration remains unchanged`);
    for (const [label, value] of [
      ["missing", before.slice(1)],
      ["extra", [...before, "unexpected"]],
      ["wrong member", ["unexpected", ...before.slice(1)]],
      ["duplicate replaces member", [before[1], ...before.slice(1)]],
      ["duplicate added", [...before, before[0]]],
      ["non-string", [17, ...before.slice(1)]],
      ["not an array", before.join(",")],
    ]) {
      assert.equal(evaluate(value), "unsatisfied", `${kind}: ${label}`);
    }
    const duplicated = [...before, before[0]];
    assert.equal(evaluate(duplicated, {
      ...scenario, outcomePredicates: [{ ...predicate, equals: duplicated }],
    }), "unsatisfied", `${kind}: duplicate declaration cannot define a set`);
  }
  for (const [kind, equals, changed] of [
    ["module_export_return_exact", ["first", "second"], ["second", "first"]],
    ["stdout_exact", "Hello, world!\n", "Hello, world!"],
    ["process_exit", 0, "0"],
  ]) {
    const scenario = { key: "ordered-scalar-boundary", outcomePredicates: [{
      id: `predicate://example/${kind}`, kind, equals,
    }] };
    assert.equal(evaluateGenericScenarioOutcome(
      scenario, admittedExecutionObservation(scenario),
    ).disposition, "satisfied", `${kind}: exact value`);
    assert.equal(evaluateGenericScenarioOutcome(
      scenario, admittedExecutionObservation(scenario, () => changed),
    ).disposition, "unsatisfied", `${kind}: comparison remains unchanged`);
  }
});

test("generic outcome interpretation fails closed on an unsatisfied or crossed admitted row", () => {
  const scenario = fixture.scenarios[0];
  const unsatisfied = admittedExecutionObservation(
    scenario,
    (value, _predicate, ordinal) => ordinal === 0 ? 17 : value,
  );
  assert.equal(
    evaluateGenericScenarioOutcome(scenario, unsatisfied).disposition,
    "unsatisfied",
  );
  const crossed = structuredClone(admittedExecutionObservation(scenario));
  crossed.predicateObservations[0].predicateId = "predicate://crossed";
  assert.throws(
    () => evaluateGenericScenarioOutcome(scenario, crossed),
    /differs from its admitted C2 row/u,
  );
});

test("generic workflow qualifies the installed shared C1+C2 setup without entering a run", {
  timeout: 120_000,
}, async (context) => {
  if (process.env[GENERIC_INSTALLED_NO_LIVE_GATE] !== "1") {
    context.skip(`${GENERIC_INSTALLED_NO_LIVE_GATE}=1 was not requested`);
    return;
  }
  const artifactPath = process.env[GENERIC_LIVE_WORKFLOW_ARTIFACT];
  const expectedArtifactDigest =
    process.env[GENERIC_LIVE_WORKFLOW_ARTIFACT_SHA256];
  assert.equal(typeof artifactPath, "string");
  assert.equal(path.isAbsolute(artifactPath), true);
  assert.match(expectedArtifactDigest ?? "", /^(?:sha256:)?[a-f0-9]{64}$/u);
  const result = await qualifyGenericWorkflowInstalledNoLive({
    scenario: fixture.scenarios[0],
    artifactPath,
    expectedArtifactDigest,
  });
  try {
    assert.equal(result.kind, "generic_installed_no_live_proof");
    assert.equal(result.disposition, "qualified");
    assert.equal(result.liveWorkerInvoked, false);
    assert.equal(result.workspaceBinding.roots.productRoot, result.installedRoots.owner);
    assert.equal(result.worksiteRoot, result.workspaceAuthorityBasis.canonicalRoot);
    assert.notEqual(result.worksiteRoot, result.installedRoots.owner);
    assert.equal(result.abiArtifact.sha256, `sha256:${expectedArtifactDigest.replace(/^sha256:/u, "")}`);
    assert.deepEqual(result.catalogAllowlist, [
      "graph-function://abiogenesis/worksite/command-execution@5",
      "graph-function://abiogenesis/worksite/construction@5",
    ]);
    assert.equal(
      result.constructionProgramRef,
      "program://abiogenesis/worksite/construction@5",
    );
    assert.equal(
      result.commandExecutionProgramRef,
      "program://abiogenesis/worksite/command-execution@5",
    );
    context.diagnostic(JSON.stringify({
      ...result,
      cleanup: undefined,
    }));
  } finally {
    await result.cleanup();
  }
});

test("generic workflow runs selected fixtures through installed ABI C1 and C2 with fresh public reads", {
  timeout: 4 * 60 * 60 * 1000,
}, async (context) => {
  const skip = genericLiveWorkflowSkip(process.env);
  if (skip.disposition === "skipped") {
    const reason = JSON.stringify(skip);
    context.diagnostic(reason);
    context.skip(reason);
    return;
  }
  const artifactPath = process.env[GENERIC_LIVE_WORKFLOW_ARTIFACT];
  const expectedArtifactDigest =
    process.env[GENERIC_LIVE_WORKFLOW_ARTIFACT_SHA256];
  assert.equal(
    typeof artifactPath,
    "string",
    `${GENERIC_LIVE_WORKFLOW_ARTIFACT} is required when live execution is enabled`,
  );
  assert.equal(path.isAbsolute(artifactPath), true);
  assert.match(
    expectedArtifactDigest ?? "",
    /^(?:sha256:)?[a-f0-9]{64}$/u,
    `${GENERIC_LIVE_WORKFLOW_ARTIFACT_SHA256} is required when live execution is enabled`,
  );
  const rows = selectGenericWorkflowScenarios(
    fixture,
    process.env[GENERIC_LIVE_WORKFLOW_SCENARIOS] ?? "basic-cli",
  );
  for (const scenario of rows) {
    const runId = `${new Date().toISOString().replace(/[-:.]/gu, "")}_pid${process.pid}`;
    const runRoot = path.resolve(
      testRoot,
      "..",
      "test_runs",
      "generic-live-workflow",
      scenario.key,
      runId,
    );
    context.diagnostic(JSON.stringify({
      kind: "generic_live_workflow_retained_run",
      scenarioKey: scenario.key,
      runRoot,
    }));
    const result = await runGenericLiveWorkflowScenario({
      scenario,
      artifactPath,
      expectedArtifactDigest,
      runRoot,
    });
    assert.equal(result.kind, "generic_live_workflow_result", scenario.key);
    assert.equal(result.disposition, "awaiting_review", scenario.key);
    assert.equal(result.scenarioKey, scenario.key);
    assert.notEqual(result.replay.freshResultProcessId, process.pid);
    assert.notEqual(result.replay.freshReplayProcessId, process.pid);
    assert.equal(result.replay.resultProjection.kind, "run_result_projection");
    assert.equal(
      result.replay.resultProjection.result.ref,
      result.executionOutcome.resultRef,
    );
    assert.deepEqual(
      result.replay.resultValue,
      result.executionObservation,
    );
    assert.equal(result.replay.replayProjection.kind, "run_replay_projection");
    assert.equal(
      result.replay.replayProjection.replay.ref,
      result.executionOutcome.replayRef,
    );
    assert.equal(
      result.replay.replayProjection.replay.digest,
      result.executionOutcome.replayDigest,
    );
    assert.equal(
      result.constructionOutcome.definitionCall.invocation.request.catalogView.digest,
      result.executionOutcome.definitionCall.invocation.request.catalogView.digest,
    );
    assert.equal(
      result.executionObservation.predicateObservations.length,
      scenario.outcomePredicates.length,
    );
    assert.equal(
      result.files.length,
      scenarioTargetPaths(scenario).length,
      scenario.key,
    );
    assert.equal(result.validation.disposition, "satisfied", scenario.key);
    assert.equal(result.runRoot, runRoot);
    const retainedBytes = await readFile(result.retainedEvidence.path);
    assert.equal(
      `sha256:${createHash("sha256").update(retainedBytes).digest("hex")}`,
      result.retainedEvidence.sha256,
    );
    context.diagnostic(JSON.stringify({
      kind: "generic_live_workflow_test_evidence",
      scenarioKey: scenario.key,
      abiArtifactSha256: result.abiArtifact.sha256,
      taskRef: result.taskRef,
      executionTaskRef: result.executionTaskRef,
      constructionResultRef: result.constructionOutcome.resultRef,
      executionResultRef: result.executionOutcome.resultRef,
      executionReplayRef: result.executionOutcome.replayRef,
      validationDisposition: result.validation.disposition,
      retainedEvidence: result.retainedEvidence,
    }));
  }
});
