import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(
  await readFile(path.join(dirname, "fixtures", "generic-workflow-scenarios.json"), "utf8")
);

const HELLO_KEYS = Object.freeze([
  "basic-cli",
  "js-tenant-test",
  "js-sdlc-bootstrap",
  "rust-cli",
  "rust-service",
  "parallel-js"
]);
const ALL_KEYS = Object.freeze([...HELLO_KEYS, "data-mapper-full"]);
const ALL_SCENARIO_IDS = Object.freeze([
  "SCN-GLC-HELLO-WORLD-CLI-BASIC",
  "SCN-GLC-HELLO-WORLD-JS-TENANT-TEST",
  "SCN-GLC-HELLO-WORLD-JS-SDLC-BOOTSTRAP",
  "SCN-GLC-HELLO-WORLD-RUST-CLI",
  "SCN-GLC-HELLO-WORLD-RUST-SERVICE",
  "SCN-GLC-HELLO-WORLD-PARALLEL-JS",
  "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT"
]);
const ALL_PREDICATE_KINDS = Object.freeze([
  "file_count",
  "http_response_exact",
  "module_export_return_exact",
  "module_set_exact",
  "process_exit",
  "stdout_exact",
  "test_pass_count",
  "test_report_error_count",
  "test_report_failure_count",
  "test_report_set_exact"
]);

function scenario(key) {
  const selected = fixture.scenarios.find((row) => row.key === key);
  assert.ok(selected, `missing scenario ${key}`);
  return selected;
}

function predicate(row, id) {
  const selected = row.outcomePredicates.find((candidate) => candidate.id === id);
  assert.ok(selected, `missing predicate ${id}`);
  return selected;
}

function territoryPaths(row) {
  return row.territories.flatMap((territory) => territory.paths);
}

function assertRelativePath(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.notEqual(value.length, 0, `${label} must not be empty`);
  assert.equal(path.isAbsolute(value), false, `${label} must be relative`);
  assert.equal(value.split("/").includes(".."), false, `${label} escapes its worksite`);
  assert.equal(value.includes("\\"), false, `${label} must use portable separators`);
}

test("fixture pins the retained historical scenario and selection sources", () => {
  assert.deepEqual(fixture.provenance.historicalScenarioSource, {
    repository: "odd_glc",
    commit: "70580b93166b1f9e33b7622512c2d5bd442469e2",
    path: "build_tenants/odd_glc/typescript/test/glc-software-build-overlay-live.test.mjs",
    gitBlob: "c0a565d798470f81e8542a2845cdd7d451e9fbdb"
  });
  assert.deepEqual(fixture.provenance.historicalSelectionSource, {
    repository: "odd_glc",
    commit: "22824d04c0ff8fce42425fa9649686cf616e635a",
    path: ".ai-workspace/tickets/active/T-025-replay-scenario-ladder-as-typed-glc-declarations.md",
    gitBlob: "7e3abd7ef96874556261c7f68c19f28862f73841"
  });
});

test("fixture closes the T-043 population and carries stable scenario, subject, and action identities", () => {
  assert.equal(fixture.fixtureVersion, "1.0.0");
  assert.equal(fixture.ticket, "T-043");
  assert.deepEqual(fixture.population.scenarioKeys, ALL_KEYS);
  assert.deepEqual(fixture.population.helloWorldKeys, HELLO_KEYS);
  assert.equal(fixture.population.controllingScenarioKey, "data-mapper-full");
  assert.deepEqual(fixture.scenarios.map((row) => row.key), ALL_KEYS);
  assert.deepEqual(fixture.scenarios.map((row) => row.scenarioId), ALL_SCENARIO_IDS);
  assert.deepEqual(
    [...new Set(fixture.scenarios.flatMap((row) =>
      row.outcomePredicates.map((outcome) => outcome.kind)
    ))].sort(),
    ALL_PREDICATE_KINDS,
    "the seven-scenario population must exercise every ABI C2 predicate kind"
  );

  const stableIds = [];
  for (const row of fixture.scenarios) {
    assert.match(row.scenarioId, /^SCN-GLC-[A-Z0-9-]+$/u);
    assert.equal(typeof row.subject.text, "string");
    assert.equal(row.subject.text.trim().length > 0, true);
    assert.equal(typeof row.action.text, "string");
    assert.equal(row.action.text.trim().length > 0, true);
    assert.equal(row.subject.id, `subject://odd-glc/${row.key}`);
    assert.equal(row.action.id, `action://odd-glc/${row.key}/construct-and-prove`);
    stableIds.push(row.subject.id, row.action.id);
    stableIds.push(...row.territories.map((territory) => territory.id));
    stableIds.push(...row.validationCommands.map((command) => command.id));
    stableIds.push(...row.outcomePredicates.map((outcome) => outcome.id));
  }
  assert.equal(new Set(stableIds).size, stableIds.length, "all fixture identities must be unique");
});

test("every scenario declares closed C1 territories and bounded C2 commands and writes", () => {
  assert.deepEqual(fixture.executionPolicy, {
    inactivityTimeoutMs: 900000,
    absoluteTimeoutMs: 3600000,
    helperOverheadMs: 30000
  });
  assert.equal(
    fixture.executionPolicy.absoluteTimeoutMs > fixture.executionPolicy.inactivityTimeoutMs,
    true
  );
  for (const row of fixture.scenarios) {
    assert.equal(row.territories.length > 0, true, `${row.key} needs a territory`);
    const territoryIds = new Set(row.territories.map((territory) => territory.id));
    assert.equal(territoryIds.size, row.territories.length, `${row.key} territory ids collide`);
    const paths = territoryPaths(row);
    assert.equal(paths.length > 0, true, `${row.key} needs target paths`);
    assert.equal(new Set(paths).size, paths.length, `${row.key} territories overlap`);
    for (const targetPath of paths) {
      assertRelativePath(targetPath, `${row.key} target path`);
    }
    for (const territory of row.territories) {
      assert.match(territory.id, new RegExp(`^territory://odd-glc/${row.key}/`, "u"));
      assert.equal(territory.paths.length > 0, true);
      for (const dependency of territory.dependsOn) {
        assert.equal(territoryIds.has(dependency), true, `${territory.id} has unknown dependency`);
        assert.notEqual(dependency, territory.id, `${territory.id} depends on itself`);
      }
    }

    const commandIds = new Set();
    const reportIds = new Set();
    const reportPaths = new Set();
    for (const command of row.validationCommands) {
      assert.match(command.id, new RegExp(`^validation://odd-glc/${row.key}/`, "u"));
      assert.equal(commandIds.has(command.id), false, `${row.key} validation id collides`);
      commandIds.add(command.id);
      assertRelativePath(command.cwd, `${row.key} validation cwd`);
      assert.match(command.command, /^[a-z][a-z0-9_-]*$/u);
      assert.equal(Array.isArray(command.args), true);
      assert.equal(command.args.every((arg) => typeof arg === "string"), true);
      assert.equal(Number.isSafeInteger(command.timeoutMs), true);
      assert.equal(command.timeoutMs > 0, true);
      assert.equal(Number.isSafeInteger(command.terminationGraceMs), true);
      assert.equal(command.terminationGraceMs > 0, true);
      assert.equal(command.terminationGraceMs < command.timeoutMs, true);
      assert.equal(Array.isArray(command.expectedReports), true);
      for (const report of command.expectedReports) {
        assert.match(report.reportIdentity, /^report:\/\/odd-glc\//u);
        assertRelativePath(report.relativePath, `${command.id} report path`);
        assert.equal(reportIds.has(report.reportIdentity), false);
        assert.equal(reportPaths.has(report.relativePath), false);
        reportIds.add(report.reportIdentity);
        reportPaths.add(report.relativePath);
      }
      if (command.env !== undefined) {
        assert.equal(typeof command.env, "object");
        assert.equal(Array.isArray(command.env), false);
        assert.equal(
          Object.values(command.env).every((value) => typeof value === "string"),
          true
        );
      }
    }
    for (const outcome of row.outcomePredicates) {
      assert.match(outcome.id, new RegExp(`^predicate://odd-glc/${row.key}/`, "u"));
      assert.equal(typeof outcome.kind, "string");
      assert.equal(outcome.kind.length > 0, true);
      if (outcome.validationCommandId !== undefined) {
        assert.equal(
          commandIds.has(outcome.validationCommandId),
          true,
          `${outcome.id} names an unknown validation command`
        );
      }
      if (outcome.kind === "http_response_exact") {
        assert.equal(
          outcome.launch.args.filter((arg) => arg === "{ABI_HTTP_PORT_FILE}").length,
          1
        );
        assertRelativePath(outcome.launch.relativeCwd, `${outcome.id} launch cwd`);
        assertRelativePath(
          outcome.launch.portFile.relativePath,
          `${outcome.id} port file`
        );
        assert.equal(outcome.request.hostname, "127.0.0.1");
        assert.equal(outcome.request.method, "GET");
        assert.equal(outcome.request.path.startsWith("/"), true);
        assert.equal(outcome.launch.terminationGraceMs < outcome.launch.timeoutMs, true);
      }
    }
    assert.equal(Array.isArray(row.allowedEvidenceWrites), true);
    assert.equal(row.allowedEvidenceWrites.length > 0, true);
    const writePaths = row.allowedEvidenceWrites.map((territory) => {
      assert.equal(["file", "subtree"].includes(territory.pathKind), true);
      assertRelativePath(territory.relativePath, `${row.key} evidence write`);
      return territory.relativePath;
    });
    assert.equal(new Set(writePaths).size, writePaths.length);
    for (const [leftOrdinal, left] of row.allowedEvidenceWrites.entries()) {
      for (const [rightOrdinal, right] of row.allowedEvidenceWrites.entries()) {
        if (leftOrdinal >= rightOrdinal) continue;
        const overlaps = left.relativePath === right.relativePath ||
          (left.pathKind === "subtree" &&
            right.relativePath.startsWith(`${left.relativePath}/`)) ||
          (right.pathKind === "subtree" &&
            left.relativePath.startsWith(`${right.relativePath}/`));
        assert.equal(overlaps, false, `${row.key} C2 write territories overlap`);
      }
    }
    for (const targetPath of paths) {
      assert.equal(
        row.allowedEvidenceWrites.some((territory) =>
          targetPath === territory.relativePath ||
          (territory.pathKind === "subtree" && targetPath.startsWith(`${territory.relativePath}/`))
        ),
        false,
        `${row.key} protected C1 path overlaps C2 evidence-write authority`
      );
    }
    for (const report of row.validationCommands.flatMap((command) => command.expectedReports)) {
      assert.equal(
        row.allowedEvidenceWrites.some((territory) =>
          report.relativePath === territory.relativePath ||
          (territory.pathKind === "subtree" && report.relativePath.startsWith(`${territory.relativePath}/`))
        ),
        true,
        `${report.reportIdentity} is outside declared C2 evidence-write authority`
      );
    }
    for (const outcome of row.outcomePredicates.filter(
      (candidate) => candidate.kind === "http_response_exact"
    )) {
      assert.equal(
        row.allowedEvidenceWrites.some((territory) =>
          outcome.launch.portFile.relativePath === territory.relativePath ||
          (territory.pathKind === "subtree" &&
            outcome.launch.portFile.relativePath.startsWith(`${territory.relativePath}/`))
        ),
        true,
        `${outcome.id} port file is outside C2 evidence-write authority`
      );
    }
    const helperBudgetMs = row.validationCommands.reduce(
      (sum, command) => sum + command.timeoutMs + command.terminationGraceMs,
      fixture.executionPolicy.helperOverheadMs
    ) + row.outcomePredicates
      .filter((outcome) => outcome.kind === "http_response_exact")
      .reduce((sum, outcome) =>
        sum + outcome.launch.timeoutMs + outcome.launch.terminationGraceMs +
          outcome.request.timeoutMs,
      0);
    assert.equal(
      helperBudgetMs < fixture.executionPolicy.inactivityTimeoutMs,
      true,
      `${row.key} helper budget ${helperBudgetMs} must fit inside the inactivity lease`
    );
  }
});

test("the six Hello World contracts preserve exact observable behavior", () => {
  assert.deepEqual(territoryPaths(scenario("basic-cli")), [
    "generated/hello-world.mjs",
    "test/component/hello-cli.test.mjs",
    "test/uat/hello-cli.uat.test.mjs"
  ]);
  assert.equal(
    predicate(scenario("basic-cli"), "predicate://odd-glc/basic-cli/stdout").equals,
    "Hello, world!\n"
  );
  assert.equal(
    predicate(scenario("basic-cli"), "predicate://odd-glc/basic-cli/test-count").greaterThanOrEqual,
    2
  );

  for (const key of ["js-tenant-test", "js-sdlc-bootstrap"]) {
    const row = scenario(key);
    assert.deepEqual(territoryPaths(row), [
      "package.json",
      "src/hello.mjs",
      "test/component/hello.test.mjs",
      "test/uat/hello.uat.test.mjs"
    ]);
    assert.equal(
      predicate(row, `predicate://odd-glc/${key}/export`).equals,
      "Hello, world!"
    );
    assert.equal(
      predicate(row, `predicate://odd-glc/${key}/test-count`).greaterThanOrEqual,
      2
    );
  }

  const rustCli = scenario("rust-cli");
  assert.deepEqual(territoryPaths(rustCli), [
    "Cargo.toml",
    "src/main.rs",
    "test/component/rust-cli.test.mjs",
    "test/uat/rust-cli.uat.test.mjs"
  ]);
  assert.deepEqual(rustCli.validationCommands[0], {
    id: "validation://odd-glc/rust-cli/cli",
    cwd: ".",
    command: "cargo",
    args: ["run", "--quiet"],
    timeoutMs: 180000,
    terminationGraceMs: 10000,
    expectedReports: []
  });
  assert.equal(
    predicate(rustCli, "predicate://odd-glc/rust-cli/stdout").equals,
    "Hello, world!\n"
  );

  const rustService = scenario("rust-service");
  assert.deepEqual(territoryPaths(rustService), [
    "build_tenants/hello_world_rust_service/Cargo.toml",
    "build_tenants/hello_world_rust_service/src/main.rs",
    "test/component/rust-service.test.mjs",
    "test/uat/rust-service.uat.test.mjs"
  ]);
  assert.deepEqual(
    predicate(rustService, "predicate://odd-glc/rust-service/http"),
    {
      id: "predicate://odd-glc/rust-service/http",
      kind: "http_response_exact",
      validationCommandId: "validation://odd-glc/rust-service/compile",
      status: 200,
      body: "Hello, world!\n",
      launch: {
        executable: "./.odd-glc-execution/crate-target/debug/hello_world_rust_service",
        args: ["{ABI_HTTP_PORT_FILE}"],
        relativeCwd: ".",
        environment: { HELLO_SERVICE_PORT: "0" },
        timeoutMs: 120000,
        terminationGraceMs: 10000,
        portFile: { relativePath: ".odd-glc-execution/http-crate.port" }
      },
      request: {
        hostname: "127.0.0.1",
        method: "GET",
        path: "/hello",
        timeoutMs: 10000
      }
    }
  );
  assert.deepEqual(
    rustService.validationCommands.map((command) => command.id),
    [
      "validation://odd-glc/rust-service/evidence-dir",
      "validation://odd-glc/rust-service/compile",
      "validation://odd-glc/rust-service/tests"
    ]
  );

  const parallel = scenario("parallel-js");
  assert.equal(
    predicate(parallel, "predicate://odd-glc/parallel-js/hello-branch").equals,
    "Hello"
  );
  assert.equal(
    predicate(parallel, "predicate://odd-glc/parallel-js/world-branch").equals,
    "world"
  );
  assert.equal(
    predicate(parallel, "predicate://odd-glc/parallel-js/fan-in").equals,
    "Hello, world!"
  );
  assert.equal(
    predicate(parallel, "predicate://odd-glc/parallel-js/test-count").greaterThanOrEqual,
    3
  );
  const fanIn = parallel.territories.find((territory) => territory.id.endsWith("/fan-in"));
  assert.deepEqual(fanIn.dependsOn, [
    "territory://odd-glc/parallel-js/hello-branch",
    "territory://odd-glc/parallel-js/world-branch"
  ]);
});

test("Data Mapper Full preserves the compact Scala/SBT acceptance contract", () => {
  const row = scenario("data-mapper-full");
  const paths = territoryPaths(row);
  const configPaths = paths.filter((targetPath) =>
    targetPath === "build_tenants/scala_spark/build.sbt" || targetPath.startsWith("build_tenants/scala_spark/project/")
  );
  const mainPaths = paths.filter((targetPath) => targetPath.includes("/src/main/scala/"));
  const testPaths = paths.filter((targetPath) => targetPath.includes("/src/test/scala/"));

  assert.equal(row.territories.length, 9, "config plus eight module territories");
  assert.equal(configPaths.length, 3);
  assert.equal(mainPaths.length, 11);
  assert.equal(testPaths.length, 8);
  assert.deepEqual(row.validationCommands, [
    {
      id: "validation://odd-glc/data-mapper-full/tests",
      cwd: "build_tenants/scala_spark",
      command: "sbt",
      args: ["test"],
      env: {
        JAVA_HOME: "/opt/homebrew/opt/openjdk@11",
        PATH_PREFIX: "/opt/homebrew/opt/openjdk@11/bin:/opt/homebrew/bin"
      },
      timeoutMs: 780000,
      terminationGraceMs: 10000,
      expectedReports: row.validationCommands[0].expectedReports
    }
  ]);
  assert.equal(row.validationCommands[0].expectedReports.length, 8);
  assert.deepEqual(
    predicate(row, "predicate://odd-glc/data-mapper-full/module-set").equals,
    [
      "cdme-core",
      "cdme-compiler",
      "cdme-executor",
      "cdme-adjoint",
      "cdme-accounting",
      "cdme-assurance",
      "cdme-fidelity",
      "cdme-engine"
    ]
  );
  const reports = predicate(row, "predicate://odd-glc/data-mapper-full/test-reports");
  assert.equal(reports.base, "build_tenants/scala_spark");
  assert.equal(reports.equals.length, 8);
  assert.equal(new Set(reports.equals).size, 8);
  assert.deepEqual(
    row.validationCommands[0].expectedReports.map((report) => report.relativePath),
    reports.equals.map((relativePath) => `${reports.base}/${relativePath}`)
  );
  assert.equal(
    predicate(row, "predicate://odd-glc/data-mapper-full/test-count").greaterThanOrEqual,
    20
  );
  assert.equal(
    row.outcomePredicates.some((candidate) => candidate.kind === "closed_return_exact"),
    false,
    "scenario data must not invent a construction return outside ABI replay"
  );
  assert.deepEqual(row.forbiddenPaths, [
    "package.json",
    "src/logical-data-model.mjs",
    "test/component/logical-data-model.test.mjs",
    "test/uat/logical-data-model.uat.test.mjs"
  ]);
  assert.equal(
    paths.some((targetPath) => row.forbiddenPaths.includes(targetPath)),
    false,
    "a JavaScript substitute entered the Scala/SBT territory"
  );
});

test("fixture remains data-only and does not retain the historical execution mechanism", () => {
  const text = JSON.stringify(fixture);
  for (const forbiddenKey of [
    "stagePlan",
    "requiredStageNames",
    "graphFunctionRef",
    "programId",
    "promptTemplate",
    "workerLoop",
    "runtimeAdapter"
  ]) {
    assert.equal(text.includes(`\"${forbiddenKey}\"`), false, `${forbiddenKey} leaked into fixture`);
  }
});
