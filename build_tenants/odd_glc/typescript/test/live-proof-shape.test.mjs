import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

test("live tests declare single-start ABG traversal shape", async () => {
  const liveTestFiles = (await readdir(TEST_DIR))
    .filter((file) =>
      file.endsWith(".test.mjs") &&
      file.includes("live") &&
      file !== "live-proof-shape.test.mjs"
    )
    .sort();

  assert.ok(liveTestFiles.length > 0, "expected at least one live test to guard");

  for (const file of liveTestFiles) {
    const source = await readFile(path.join(TEST_DIR, file), "utf8");
    assert.match(source, /genesisCommand|genesis-ts/u, `${file} must invoke installed ABG, not local vector code`);
    assert.match(source, /"start"/u, `${file} must start ABG`);
    assert.match(source, /"--until"/u, `${file} must use ABG convergence control`);
    assert.match(source, /"converged"/u, `${file} must run ABG until convergence`);
    assert.match(source, /externalAbgStartInvocationCount/u, `${file} must record one external ABG start invocation`);
    assert.match(source, /abgInvocationShape/u, `${file} must record ABG-owned internal traversal shape`);
    assert.doesNotMatch(
      source,
      /JSON\.parse\(\s*start\.stdout\.trim\(\)\s*\)/u,
      `${file} must not assume installed ABG start stdout is a pure JSON stream under PTY execution`
    );
    assert.match(
      source,
      /parseCliStartOutput/u,
      `${file} must extract ABG start summary from mixed terminal-safe output`
    );
    assert.match(
      source,
      /scenario_runner_only/u,
      `${file} must mark live sandbox tests as scenario runners, not content judges`
    );
    assert.doesNotMatch(
      source,
      /expectedExecutionPlan\s*:/u,
      `${file} must not pin scenario-owned execution-plan truth in the sandbox harness`
    );
    assert.doesNotMatch(
      source,
      /liveArtifacts:\s*result\.artifacts/u,
      `${file} must not feed generated artifact content into sandbox closure checks`
    );
    assert.doesNotMatch(
      source,
      /result\.artifacts/u,
      `${file} must not assert generated artifact content in the sandbox runner`
    );
    assert.match(
      source,
      /requirementLineageCanary/u,
      `${file} must derive the T-030 read-only requirement lineage canary from replay truth`
    );
    assert.match(
      source,
      /droppedRequirementIds/u,
      `${file} must fail the run when the lineage canary reports dropped required obligations`
    );
    assert.match(
      source,
      /unlocks, but does not substitute for, the full data-mapper run/u,
      `${file} must state the data-mapper gate in the run summary`
    );
  }
});
