// T-209 D2 (governance-failure ruling 2026-07-09): the STANDING
// execution-authority conformance differential, downstream half —
// review-B-hardened (signature-pinned, whole-file laws; the first
// version was count-based and 8/9 evasion mutations passed it).
//
// LAW: the framework executes nothing of the subject's toolchain.
// Every spawn-capable call site is pinned by EXACT SIGNATURE below; a
// new site, a changed first argument, or a deletion is red until this
// pin is consciously repriced. Deleting a legacy site does NOT free a
// slot — the list is exact, not a count.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const liveSource = await readFile(
  path.join(here, "glc-software-build-overlay-live.test.mjs"),
  "utf8"
);
const genericSupportSource = await readFile(
  path.join(here, "generic-live-workflow-support.mjs"),
  "utf8"
);

const SPAWN_CAPABLE = /\b(execSync|execFileSync|spawnSync|spawn|execFile|exec|fork|runSync|runAsync|runForEvidence|run)\s*\(\s*("(?:[^"\\]|\\.)*"|'[^']*'|[A-Za-z_$][\w.$]*)?/gu;

function observedSignatures(source) {
  const rows = [];
  for (const match of source.matchAll(SPAWN_CAPABLE)) {
    rows.push(`${match[1]}(${match[2] ?? ""}`);
  }
  return rows.sort();
}

// THE PINNED SITE LIST (exact, shrinking-by-reprice only).
// Framework self-invocation: run/runForEvidence(genesisCommand) launch
// the SUBSTRATE CLI; process.execPath sites are node --check / node
// subject runs in PRE-LAW legacy scenario executors (named below);
// command-variable sites are the helper definitions' internal spawns
// and the legacy planned executor helpers.
const PINNED = [
  "exec(",                       // JSDoc/word match inside comments only — kept pinned to detect real calls appearing
  "run(command",                 // harness helper definition body
  "run(genesisCommand",          // substrate CLI launch (lawful: running the kernel)
  "runAsync(command",            // binding helper definition body
  "runAsync(process.execPath",   // LEGACY parallel fan-in branches (pre-law, shrinking)
  "runAsync(process.execPath",
  "runForEvidence(command",      // harness helper definition body
  "runForEvidence(genesisCommand", // substrate CLI launch
  "runSync(\"cargo\"",           // LEGACY rust_cli executor (pre-law, shrinking)
  "runSync(\"rustc\"",           // LEGACY rust_service compile (pre-law, shrinking)
  "runSync(command",             // binding helper definition body
  "runSync(process.execPath",    // LEGACY node_cli/parallel/logical lanes + node --check (pre-law, shrinking)
  "runSync(process.execPath",
  "runSync(process.execPath",
  "runSync(process.execPath",
  "runSync(process.execPath",
  "spawn(binaryPath",            // LEGACY rust_service launch (pre-law, shrinking)
  "spawn(command",               // binding runAsync definition internal
  "spawnSync(command",           // helper definition internals (run/runForEvidence/runSync)
  "spawnSync(command",
  "spawnSync(command",
  "spawnSync(process.execPath"   // node --check of the generated binding (framework self-check)
].sort();

test("every spawn-capable call site matches the pinned signature list exactly", () => {
  const observed = observedSignatures(liveSource).filter((sig) => sig !== "exec(");
  const pinned = PINNED.filter((sig) => sig !== "exec(");
  assert.deepEqual(
    observed,
    pinned,
    "spawn-capable call sites changed — execution belongs to the worker turn; reprice this pin only with a lawful reason"
  );
});

test("the subject toolchain is never a spawn argument anywhere", () => {
  for (const tool of ["sbt", "cargo", "rustc", "mvn", "gradle", "make"]) {
    const pattern = new RegExp(
      String.raw`\b(?:execSync|execFileSync|spawnSync|spawn|execFile|exec|fork|runSync|runAsync)\s*\(\s*["']` + tool + String.raw`["']`,
      "u"
    );
    const match = liveSource.match(pattern);
    if (tool === "cargo" || tool === "rustc") {
      continue; // pre-law legacy sites pinned above by exact signature
    }
    assert.equal(match, null, `framework spawn of ${tool} found: ${match?.[0] ?? ""}`);
  }
});

test("child_process reachability is pinned (any quote style, createRequire, dynamic import)", () => {
  const refs = [...liveSource.matchAll(/child_process/gu)].length;
  assert.equal(refs, 7, `child_process references changed (${refs} != 7) — new process capability requires repricing this pin`);
  assert.equal(/createRequire\s*\([^)]*\)\s*\(\s*["']\s*(node:)?child_process/u.test(liveSource), false);
});

test("the execution-result path is verify-only and the compile gate is retired", () => {
  const executor = liveSource.slice(
    liveSource.indexOf("export async function executePlannedScenario"),
    liveSource.indexOf("async function materializeScenario")
  );
  assert.notEqual(executor.length, 0);
  assert.equal(/\b(?:runSync|runAsync|spawnSync|spawn|execSync|execFileSync|execFile|exec|fork)\s*\(/u.test(executor), false,
    "the framework must not execute — the worker runs the toolchain in its turn");
  assert.match(executor, /test-execution-result\.json|executionResultFor/u);
  const gate = liveSource.slice(
    liveSource.indexOf("function deterministicPostMaterializationValidationForStage"),
    liveSource.indexOf("function scalaTestClassSummariesFromAssessment")
  );
  assert.match(gate, /return null;/u);
  assert.equal(/\b(?:runSync|spawnSync|spawn|execSync)\s*\(/u.test(gate), false);
});

test("the data-mapper scenario declares worker execution, never framework execution", () => {
  assert.equal(/test-execution-plan\.json must set command to sbt/u.test(liveSource), false);
  assert.match(liveSource, /YOU run the test suite inside this turn/u);
  assert.match(liveSource, /Run sbt Test\/compile YOURSELF/u);
});

test("the generic C1 to C2 workflow has only artifact-tar and fresh-public-read process authority", () => {
  const calls = [...genericSupportSource.matchAll(
    /\bexecFileAsync\s*\(\s*("(?:[^"\\]|\\.)*"|'[^']*'|[A-Za-z_$][\w.$]*)/gu
  )].map((match) => `execFileAsync(${match[1]}`);
  assert.deepEqual(calls.sort(), [
    "execFileAsync(\"tar\"",
    "execFileAsync(process.execPath"
  ]);
  assert.match(
    genericSupportSource,
    /execFileAsync\(\s*"tar",\s*\["-xzf", canonicalArtifactPath, "-C", bootstrapRoot\]/u
  );
  assert.match(
    genericSupportSource,
    /\[supportPath, "--fresh-public-read", requestPath\]/u
  );
  for (const subjectTool of ["node", "sbt", "cargo", "rustc", "mkdir"]) {
    assert.equal(
      new RegExp(String.raw`execFileAsync\s*\(\s*["']${subjectTool}["']`, "u")
        .test(genericSupportSource),
      false,
      `generic host process invoked subject tool ${subjectTool}`
    );
  }
});

test("the generic host contains no subject executor, module call, HTTP probe, or report synthesizer", () => {
  for (const forbidden of [
    "runValidationCommand",
    "testReportEvidence",
    "reportCounts",
    "nodeTestPassCount",
    "legacyHostEvaluateGenericScenarioOutcome",
    "?predicate=",
    "httpRequest(",
    "fetch("
  ]) {
    assert.equal(
      genericSupportSource.includes(forbidden),
      false,
      `${forbidden} restores host-side subject validation`
    );
  }
  assert.equal(/<testsuite\b|<testcase\b/u.test(genericSupportSource), false);
  assert.equal(/\b(?:spawnSync|spawn|execSync|execFileSync|fork)\s*\(/u.test(genericSupportSource), false);
});

test("generic outcome interpretation is a pure read over admitted C2 observations", () => {
  const evaluator = genericSupportSource.slice(
    genericSupportSource.indexOf("export function evaluateGenericScenarioOutcome"),
    genericSupportSource.indexOf("function validateClaudeConfiguration")
  );
  assert.notEqual(evaluator.length, 0);
  assert.match(evaluator, /worksite_command_execution_observation/u);
  assert.match(evaluator, /worksite_predicate_observation/u);
  assert.equal(
    /\b(?:execFileAsync|readFile|writeFile|import|fetch|spawn)\b/u.test(evaluator),
    false,
    "odd_glc interpretation must consume admitted rows without performing subject IO"
  );
});

test("generic execution uses the frozen public C1 result authority as C2 source", () => {
  assert.match(
    genericSupportSource,
    /constructWorksiteConstructionModulePublication\([\s\S]*constructWorksiteCommandExecutionModulePublication\(/u
  );
  assert.match(
    genericSupportSource,
    /const allowlist = \[\s*constructionIds\.graphFunctionRef,\s*executionIds\.graphFunctionRef,?\s*\]\.sort\(\)/u
  );
  assert.match(genericSupportSource, /constructWorksiteCommandExecutionTask\(/u);
  assert.match(genericSupportSource, /sourceConstructionResultRef: sourceResult\.resultRef/u);
  assert.match(genericSupportSource, /sourceConstructionResultDigest: sourceResult\.resultDigest/u);
  assert.match(genericSupportSource, /sourceConstructionResult: sourceResult/u);
  assert.match(genericSupportSource, /deriveInvocationSourceResultBasisAtPrefix\(/u);
  assert.match(genericSupportSource, /publicAuthorityDigest: call\.invocation\.invocationDigest/u);
  assert.match(genericSupportSource, /kind: "admitted_source_result", basis: sourceRun\.sourceBasis/u);
  assert.match(genericSupportSource, /run_result_projection/u);
  assert.match(genericSupportSource, /run_replay_projection/u);
  assert.equal(/RootPublicInvocation|RootOperationContext|sourceProjectionAuthority/u.test(genericSupportSource), false);
  assert.equal(/sourceTerminal|sourceArtifact/u.test(genericSupportSource), false);
});

test("generic fresh reads use declared reads and exported ABG source-result derivation", () => {
  const freshRead = genericSupportSource.slice(
    genericSupportSource.indexOf("async function freshPublicReadMain"),
    genericSupportSource.indexOf('process.argv[2] === "--fresh-public-read"')
  );
  assert.notEqual(freshRead.length, 0);
  assert.match(freshRead, /applyDefinitionCall\(installedPublic, request\.invocation/u);
  assert.match(freshRead, /sourceResultFromRead\(abg, request\.sourceRun\.call/u);
  assert.equal(/RunProjectionPort/u.test(genericSupportSource), false);
  assert.match(genericSupportSource, /abg\.ABG_PROJECT_READ_CONTRACTS\[memberKey\]/u);
  assert.match(genericSupportSource, /deriveInvocationSourceResultBasisAtPrefix\(/u);
  assert.match(genericSupportSource, /runInstalledDefinitionCallTransport\(acquisition, call\)/u);
  assert.match(genericSupportSource, /runFreshPublicRead\(prepared, executionOutcome, "run_result"\)/u);
  assert.match(genericSupportSource, /runFreshPublicRead\(prepared, executionOutcome, "run_replay"\)/u);
});

test("generic installed no-live qualification cannot enter either public run", () => {
  const qualifier = genericSupportSource.slice(
    genericSupportSource.indexOf("export async function qualifyGenericWorkflowInstalledNoLive"),
    genericSupportSource.indexOf("export async function runGenericLiveWorkflowScenario")
  );
  assert.notEqual(qualifier.length, 0);
  assert.match(qualifier, /prepareInstalledScenario\(/u);
  assert.match(qualifier, /WORKSITE_CONSTRUCTION_IDS/u);
  assert.match(qualifier, /WORKSITE_COMMAND_EXECUTION_IDS/u);
  assert.match(qualifier, /loaded_product_execution_resolution/u);
  assert.equal(/constructionRunInvocation|commandExecutionRunInvocation/u.test(qualifier), false);
  assert.equal(/applyDeclaredRun/u.test(qualifier), false);
  assert.equal(/ABG_TS_CLAUDE|liveWorkerInvoked:\s*true/u.test(qualifier), false);
});
