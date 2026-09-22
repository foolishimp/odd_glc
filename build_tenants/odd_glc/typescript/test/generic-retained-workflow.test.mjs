import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderRetainedRepairAction, retainedRepairTargetChange, retainedCurrentReadPlan, validateRetainedRepairCandidates, executeRetainedWorkflowRepair, executeRetainedWorkflowExecution } from "./generic-retained-workflow-support.mjs";
import { selectUniqueConstructionReducer } from "./generic-live-workflow-support.mjs";

const fixture = JSON.parse(await readFile(new URL("./fixtures/generic-workflow-scenarios.json", import.meta.url), "utf8"));
const scenario = fixture.scenarios.find((row) => row.key === "rust-cli");
const files = scenario.territories.flatMap((territory) => territory.paths).map((relativePath, ordinal) => ({
  relativePath, sha256: `sha256:${String(ordinal).repeat(64)}`,
  contents: `// Unicode λ, quotes \" and newline ${ordinal}\n`,
}));
const targets = files.map((file, ordinal) => ({ targetRef: `target://retained/${ordinal}`,
  subject: { relativePath: file.relativePath }, predecessorObservation: { state: "file",
    fileDigest: file.sha256, byteLength: Buffer.byteLength(file.contents) } }));
const repair = { changePaths: ["src/main.rs"], instruction: "Repair only the selected greeting typo." };

test("retained repair input conserves exact current UTF-8 content and ordered target authority", () => {
  const prompt = renderRetainedRepairAction(scenario, targets, files, repair);
  const suppliedContents = [...prompt.matchAll(/UTF-8 JSON STRING: (.+)$/gmu)].map((match) => JSON.parse(match[1]));
  assert.deepEqual(suppliedContents, files.map((file) => file.contents));
  assert.deepEqual([...prompt.matchAll(/^- targetRef: (.+)$/gmu)].map((match) => match[1]), targets.map((target) => target.targetRef));
  assert.equal(prompt.endsWith(`ACTION\n${repair.instruction}`), true);
  assert.throws(() => renderRetainedRepairAction(scenario, targets, [...files].reverse(), repair));
  assert.throws(() => renderRetainedRepairAction(scenario, targets, files,
    { ...repair, changePaths: ["undeclared/source.rs"] }));
  assert.throws(() => renderRetainedRepairAction(scenario, targets, files,
    { ...repair, changePaths: ["src/main.rs", "src/main.rs"] }));
});

test("retained repair cannot dispatch without the explicit live gate", async () => {
  await assert.rejects(executeRetainedWorkflowRepair({}, {}));
  await assert.rejects(executeRetainedWorkflowExecution({}, {}));
});

test("retained C3 source selection excludes other runs and refuses missing or ambiguous reducers", () => {
  const reducer = { kind: "graph_call_opened", runId: "run://selected", graphFunctionRef: "graph://reducer", graphCallId: "call://selected" };
  const events = [{ ...reducer, runId: "run://other" },
    { ...reducer, graphFunctionRef: "graph://outer" }, reducer];
  assert.equal(selectUniqueConstructionReducer(events, "run://selected", "graph://reducer"), reducer);
  assert.throws(() => selectUniqueConstructionReducer(events.slice(0, 2), "run://selected", "graph://reducer"));
  assert.throws(() => selectUniqueConstructionReducer([...events, { ...reducer, graphCallId: "call://second" }],
    "run://selected", "graph://reducer"));
});

test("retained target additions require the exact declared old, added and conserved path vectors", () => {
  const original = ["old.rs", "test.mjs"];
  const requested = ["crate/Cargo.toml", "crate/src/main.rs", "test.mjs"];
  const selected = { changePaths: requested, targetChange: { previousPaths: original,
    addedPaths: requested.slice(0, 2), preservedPaths: ["old.rs"] } };
  assert.deepEqual(retainedRepairTargetChange(original, requested, selected),
    { addedPaths: requested.slice(0, 2), preservedPaths: ["old.rs"] });
  assert.throws(() => retainedRepairTargetChange(original, requested, { changePaths: requested }));
  assert.throws(() => retainedRepairTargetChange(original, requested,
    { ...selected, targetChange: { ...selected.targetChange, preservedPaths: [] } }));
  assert.throws(() => retainedRepairTargetChange(original, requested,
    { ...selected, changePaths: ["test.mjs"] }));
});

test("failed retained frontier needs its own exact call, run and prefix, and never requests a nonexistent result", () => {
  const call = { invocation: { invocationRef: "invocation://failed" } };
  const receipt = { invocationRef: "invocation://failed", ownerOutput: { value: {
    disposition: "runtime_failed", result: null, run: { ref: "run://failed" } } },
    resources: { eventResource: { closeHandoff: { prefix: { prefixDigest: "sha256:current" } } } } };
  const frontier = { disposition: "runtime_failed", runRef: "run://failed", prefixDigest: "sha256:current" };
  assert.deepEqual(retainedCurrentReadPlan(receipt, call, frontier), { needsResult: false });
  assert.throws(() => retainedCurrentReadPlan(receipt, call));
  assert.throws(() => retainedCurrentReadPlan(receipt, call, { ...frontier, prefixDigest: "sha256:old" }));
  assert.throws(() => retainedCurrentReadPlan(receipt, { invocation: { invocationRef: "invocation://old" } }, frontier));
  assert.throws(() => retainedCurrentReadPlan(receipt, call, { ...frontier, runRef: "run://old" }));
});

test("pre-encoded repair input is exact selected candidate context and cannot substitute other bytes", () => {
  const bytes = Buffer.from("known unchanged λ\n");
  const candidate = { relativePath: "a.txt", replacementBase64: bytes.toString("base64"), byteLength: bytes.length,
    sha256: `sha256:${createHash("sha256").update(bytes).digest("hex")}` };
  const current = [{ relativePath: "a.txt", sha256: candidate.sha256 }];
  const selected = { changePaths: [], exactCandidates: [candidate] };
  assert.deepEqual(validateRetainedRepairCandidates(current, selected), [candidate]);
  assert.throws(() => validateRetainedRepairCandidates(current,
    { ...selected, exactCandidates: [{ ...candidate, replacementBase64: Buffer.from("wrong").toString("base64") }] }));
  assert.throws(() => validateRetainedRepairCandidates(current, { ...selected, changePaths: ["a.txt"] }));
  assert.throws(() => validateRetainedRepairCandidates(current,
    { ...selected, exactCandidates: [{ ...candidate, relativePath: "undeclared.txt" }] }));
});
