// T-209 D2 (governance-failure ruling 2026-07-09): the STANDING
// execution-authority conformance differential, downstream half. The
// product binding and its proof harness contain no subject-toolchain
// execution outside declared worker turns. This test is the migration
// pressure: any NEW process-execution site is red the day it appears,
// not an audit finding later.
//
// Frozen legacy allowlist: the pre-law scenario executors (hello-world
// node/cargo/rustc/parallel lanes — historical proofs, live-gated, not
// the campaign path). The list SHRINKS as those scenarios reprice to
// worker execution; additions are forbidden.
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

function functionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  let depth = 0;
  let index = source.indexOf("{", start);
  const bodyStart = index;
  do {
    const ch = source[index];
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    index += 1;
  } while (depth > 0 && index < source.length);
  return source.slice(bodyStart, index);
}

test("the execution-result path spawns nothing: executePlannedScenario is verify-only", () => {
  const body = functionBody(liveSource, "executePlannedScenario");
  assert.equal(/runSync\(|spawnSync\(|spawn\(|execFile|runAsync\(/u.test(body), false,
    "the framework must not execute the subject toolchain — the worker runs it in its turn");
  assert.match(body, /test-execution-result\.json|executionResultFor/u);
});

test("the framework compile gate is retired: no sbt spawn anywhere in the binding or harness", () => {
  const gate = functionBody(liveSource, "deterministicPostMaterializationValidationForStage");
  assert.equal(/runSync\(|spawnSync\(|spawn\(|execFile\(/u.test(gate), false, "the compile gate must not execute");
  assert.equal(/runSync\(\s*["']sbt["']/u.test(liveSource), false, "no sbt spawn may exist");
  assert.equal(/spawnSync\(\s*["']sbt["']/u.test(liveSource), false);
});

test("process-execution sites are the frozen shrinking legacy allowlist — additions are red", () => {
  const runSyncCalls = [...liveSource.matchAll(/runSync\(/gu)].length;
  // 1 definition-adjacent usage doc + 7 legacy scenario executors:
  // node_cli x3, cargo, rustc, parallel fan-in, logical-data-model.
  // The definition itself does not match runSync( (it is "function runSync(").
  const legacyAllowance = 8; // 7 call sites + the function definition line
  assert.equal(
    runSyncCalls <= legacyAllowance,
    true,
    `runSync sites grew to ${runSyncCalls} (allowlist ${legacyAllowance}) — a new framework execution site is unlawful; execution belongs to the worker turn`
  );
  // child_process must not gain new import sites (harness top + binding template)
  const importSites = [...liveSource.matchAll(/from "node:child_process"/gu)].length;
  assert.equal(importSites <= 2, true, `child_process import sites grew to ${importSites}`);
});

test("the data-mapper scenario declares worker execution, never framework execution", () => {
  assert.equal(/test-execution-plan\.json must set command to sbt/u.test(liveSource), false,
    "the plan-for-the-framework contract is dead for the data-mapper scenario");
  assert.match(liveSource, /YOU run the test suite inside this turn/u);
  assert.match(liveSource, /Run sbt Test\/compile YOURSELF/u);
});
