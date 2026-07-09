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

test("T-214 export pin rule: every binding export is IMPORTED and USED by the unit lane", () => {
  const exportNames = Object.keys(binding);
  assert.ok(exportNames.length > 0, "the binding must export its surface");

  const unitSources = readdirSync(testDir)
    .filter(
      (name) =>
        (name.endsWith(".test.mjs") || name.endsWith(".mjs")) &&
        !EXCLUDED.has(name)
    )
    .map((name) => readFileSync(path.join(testDir, name), "utf8"));
  const canarySource = readFileSync(
    path.join(testDir, "..", "src", "lineage_canary.mjs"),
    "utf8"
  );
  const sources = [...unitSources, canarySource];

  // codex P2 strengthening: a bare text mention (comment, inert string)
  // is not a pin. An export is pinned when some unit-lane source IMPORTS
  // it from the binding (or the canary imports it) AND references it
  // again beyond the import — an imported-then-used symbol is
  // execution-bound the moment that test file runs.
  const unpinned = exportNames.filter((name) => {
    const namePattern = new RegExp(`\\b${name}\\b`, "gu");
    return !sources.some((source) => {
      const importBlocks = source.match(
        /import\s*\{[^}]*\}\s*from\s*["'][^"']*(?:src\/index\.mjs|\.\.\/index\.mjs)["']/gu
      ) ?? [];
      const importedHere = importBlocks.some((block) => namePattern.test(block));
      if (!importedHere) {
        return false;
      }
      const outsideImports = source.replace(
        /import\s*\{[^}]*\}\s*from\s*["'][^"']*["']/gu,
        ""
      );
      return new RegExp(`\\b${name}\\b`, "u").test(outsideImports);
    });
  });
  assert.deepEqual(
    unpinned,
    [],
    `binding exports without an imported-and-used unit-lane pin: ${unpinned.join(", ")}`
  );
});
