// Load-bearing pin over the COMMITTED rc.2 data-mapper campaign evidence
// (codex P1/P2 findings, 2026-07-10). The committed proof + evidence
// ledger under test/proof_inputs/ are audit artifacts; this default-suite
// test re-derives every claim from them on every run, so the evidence
// cannot silently drift from the claims and a degenerate-resume rewrite
// can never re-introduce a seconds-long "campaign duration".
//
// Fixture discipline: these pins are EXACT for this committed run root.
// If the campaign is ever re-run and re-committed, regenerate the
// fixture and update the expectations together.

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const tenantRoot = path.dirname(fileURLToPath(new URL("./", import.meta.url)));
const evidenceRoot = path.join(
  tenantRoot,
  "test",
  "proof_inputs",
  "odd-glc-data-mapper-full-scala-sbt-live",
  "20260710T012832676Z_pid27696"
);

const TRUTH_KINDS = Object.freeze([
  "depth_proof_map_admitted",
  "mutation_outcomes_admitted",
  "vector_closed",
  "retry_repair_planned",
  "terminal_reached",
  "c_call_judged"
]);

async function loadEvidence() {
  const proof = JSON.parse(
    await readFile(path.join(evidenceRoot, "odd-glc-software-build-overlay-live-proof.json"), "utf8")
  );
  const ledger = (await readFile(path.join(evidenceRoot, "evidence-ledger.jsonl"), "utf8"))
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line));
  return { proof, ledger };
}

test("rc.2 campaign proof: identity, gate, and split timing surface", async () => {
  const { proof } = await loadEvidence();
  assert.equal(proof.scenarioId, "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT");
  assert.equal(proof.substrate.packageVersion, "4.6.0-rc.2");
  assert.equal(proof.substrate.sourceCommit, "5c312df71aecab0b388e6222879eed90e9e84c40");
  assert.equal(
    proof.dataMapperGate,
    "this run IS the full data-mapper campaign: SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT executed end to end"
  );
  assert.match(proof.eventLogSha256, /^sha256:[0-9a-f]{64}$/u);
  // The codex-P1 regression pin: the operational timing surface is the
  // replay-derived campaign span. A real campaign is minutes-to-hours;
  // a degenerate resume's invocation is seconds. If a future rewrite
  // puts invocation time back on the campaign surface, this fails.
  assert.equal(Number.isFinite(proof.campaignDurationMs), true);
  assert.equal(proof.campaignDurationMs > 600_000, true);
  assert.equal(proof.campaignDurationMs, 4_869_063);
  assert.equal(Number.isFinite(proof.startInvocationDurationMs), true);
  assert.equal(proof.startInvocationDurationMs >= 0, true);
});

test("rc.2 campaign evidence ledger: kinds are closed and counts cross-pin the proof", async () => {
  const { proof, ledger } = await loadEvidence();
  assert.equal(ledger.length, 129);
  for (const row of ledger) {
    assert.equal(TRUTH_KINDS.includes(row.kind), true, `undeclared ledger kind ${row.kind}`);
  }
  // Ledger row counts must equal the proof's replay-derived eventCounts
  // for every truth kind — the two committed artifacts certify each
  // other; neither can be regenerated alone.
  for (const kind of TRUTH_KINDS) {
    const inLedger = ledger.filter((row) => row.kind === kind).length;
    assert.equal(
      inLedger,
      proof.eventCounts[kind] ?? 0,
      `ledger/proof count mismatch for ${kind}`
    );
  }
});

test("rc.2 campaign substance: 240 depth rows, 64/64 verified-restore kills, 28 vectors, converged", async () => {
  const { ledger } = await loadEvidence();
  const depthRows = ledger
    .filter((row) => row.kind === "depth_proof_map_admitted" && row.accepted === true)
    .reduce((total, row) => total + row.rows.length, 0);
  assert.equal(depthRows, 240);

  const mutationRows = ledger
    .filter((row) => row.kind === "mutation_outcomes_admitted" && row.accepted === true)
    .flatMap((row) => row.rows);
  assert.equal(mutationRows.length, 64);
  for (const row of mutationRows) {
    // the kernel's kill law: suite red on the compiled mutant AND the
    // restore digest-verified back to baseline.
    assert.equal(row.mutantCompiled, true, `${row.mutantIdentity} did not compile`);
    assert.notEqual(row.suiteExit, 0, `${row.mutantIdentity} survived (suite green)`);
    assert.equal(
      row.restoreDigest,
      row.baselineDigest,
      `${row.mutantIdentity} restore not digest-verified`
    );
  }

  assert.equal(ledger.filter((row) => row.kind === "vector_closed").length, 28);
  assert.equal(ledger.filter((row) => row.kind === "retry_repair_planned").length, 2);

  const convergedTerminals = ledger.filter(
    (row) => row.kind === "terminal_reached" && row.terminalKind === "converged"
  );
  assert.notEqual(convergedTerminals.length, 0);
  // decisive-by-admission-ordinal first converged terminal closes the
  // campaign; its span from the proof is already pinned above.
  const decisive = convergedTerminals.reduce((first, row) =>
    first === null || row.eventAdmissionOrdinal < first.eventAdmissionOrdinal ? row : first,
  null);
  assert.equal(decisive.eventAdmissionOrdinal, 3159);
});
