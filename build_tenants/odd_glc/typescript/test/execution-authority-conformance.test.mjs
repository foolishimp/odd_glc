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

const SPAWN_CAPABLE = /\b(execSync|execFileSync|spawnSync|spawn|execFile|exec|fork|runSync|runAsync|runForEvidence|run)\s*\(\s*("(?:[^"\\]|\\.)*"|'[^']*'|[A-Za-z_$][\w.$]*)?/gu;

function observedSignatures(source) {
  const rows = [];
  for (const match of source.matchAll(SPAWN_CAPABLE)) {
    rows.push(`${match[1]}(${match[2] ?? ""}`);
  }
  return rows.sort();
}

// THE PINNED SITE LIST (exact, shrinking-by-reprice only).
// Framework self-invocation: run/runForEvidence(genesisCommand) launches
// the SUBSTRATE CLI. The remaining command-variable sites are harness
// helper definitions; the generated binding has no process-execution
// capability. No scenario-specific subject executor remains.
const PINNED = [
  "exec(",                       // JSDoc/word match inside comments only — kept pinned to detect real calls appearing
  "run(command",                 // harness helper definition body
  "run(genesisCommand",          // substrate CLI launch (lawful: running the kernel)
  "runForEvidence(command",      // harness helper definition body
  "runForEvidence(genesisCommand", // substrate CLI launch
  "spawnSync(command",           // helper definition internals (run/runForEvidence)
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
    assert.equal(match, null, `framework spawn of ${tool} found: ${match?.[0] ?? ""}`);
  }
});

test("child_process reachability is pinned (any quote style, createRequire, dynamic import)", () => {
  const refs = [...liveSource.matchAll(/child_process/gu)].length;
  assert.equal(refs, 6, `child_process references changed (${refs} != 6) — new process capability requires repricing this pin`);
  assert.equal(/createRequire\s*\([^)]*\)\s*\(\s*["']\s*(node:)?child_process/u.test(liveSource), false);
});

test("the execution-result path is verify-only and producer validation is shape-only", () => {
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
  assert.match(gate, /admitExecutionResultShape/u);
  assert.equal(/verifyJUnitReportContents/u.test(gate), false);
  assert.equal(/\b(?:runSync|spawnSync|spawn|execSync)\s*\(/u.test(gate), false);
});

test("the data-mapper scenario declares worker execution, never framework execution", () => {
  assert.equal(/test-execution-plan\.json must set command to sbt/u.test(liveSource), false);
  assert.match(liveSource, /YOU run the test suite inside this turn/u);
  assert.match(liveSource, /Run sbt Test\/compile YOURSELF/u);
});
