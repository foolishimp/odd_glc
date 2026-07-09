// T-214 (absorbed by abiogenesis T-217 Phase 1) — the export pin rule,
// standing conformance from T-032 Review B: a rewritten executor with a
// fatal ReferenceError shipped to a live run because "suite green" was
// vacuous for it. The rule: EVERY export of the odd_glc binding must be
// driven by at least one unit-lane test. Importing the binding here
// catches module-level reference errors; the reference scan catches the
// unpinned-export class (a new export with no test exercising it fails
// this gate the moment it appears).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as binding from "../src/index.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const THIS_FILE = "export-pin-conformance.test.mjs";
// the live overlay lane is env-gated and not part of the approving unit
// suite; pins must live in the always-on lane
const EXCLUDED = new Set([THIS_FILE, "glc-software-build-overlay-live.test.mjs"]);

test("T-214 export pin rule: every binding export is referenced by the unit lane", () => {
  const exportNames = Object.keys(binding);
  assert.ok(exportNames.length > 0, "the binding must export its surface");

  const unitSources = readdirSync(testDir)
    .filter(
      (name) =>
        (name.endsWith(".test.mjs") || name.endsWith(".mjs")) &&
        !EXCLUDED.has(name)
    )
    .map((name) => readFileSync(path.join(testDir, name), "utf8"))
    .join("\n");
  const canarySource = readFileSync(
    path.join(testDir, "..", "src", "lineage_canary.mjs"),
    "utf8"
  );
  const referenced = `${unitSources}\n${canarySource}`;

  const unpinned = exportNames.filter((name) => !referenced.includes(name));
  assert.deepEqual(
    unpinned,
    [],
    `binding exports without a unit-lane pin (add a test that drives each): ${unpinned.join(", ")}`
  );
});
