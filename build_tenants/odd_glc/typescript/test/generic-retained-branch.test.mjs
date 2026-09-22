import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { regroupRetainedBranchScenario, validateRetainedBranchTargets } from "./generic-retained-branch-support.mjs";

const fixture = JSON.parse(await readFile(new URL("./fixtures/generic-workflow-scenarios.json", import.meta.url), "utf8"));
const original = fixture.scenarios.find((row) => row.key === "data-mapper-full");
const groups = [{ id: "branch://repair/retained-and-next", sourceBranchRefs: original.territories.slice(0, 4).map((row) => row.id) },
  ...original.territories.slice(4).map((row) => ({ id: row.id, sourceBranchRefs: [row.id] }))];

test("repair grouping conserves subject outcome, target order and dependency reachability", () => {
  const repair = regroupRetainedBranchScenario(original, groups);
  assert.deepEqual(repair.territories.map((row) => row.paths.length), [11, 2, 2, 2, 2, 3]);
  assert.deepEqual(repair.territories.flatMap((row) => row.paths), original.territories.flatMap((row) => row.paths));
  assert.deepEqual({ ...repair, territories: original.territories }, original);
  assert.deepEqual(repair.territories.map((row) => row.dependsOn), [[],
    [groups[0].id], [groups[0].id], [groups[0].id], [groups[0].id], groups.slice(0, 5).map((row) => row.id)]);
});

test("repair grouping refuses dropped, repeated, reordered and unknown dependency branches", () => {
  assert.throws(() => regroupRetainedBranchScenario(original, groups.slice(1)));
  assert.throws(() => regroupRetainedBranchScenario(original, [...groups, groups[0]]));
  assert.throws(() => regroupRetainedBranchScenario(original, [...groups].reverse()));
  const unknown = structuredClone(original);
  unknown.territories[4].dependsOn.push("branch://unknown");
  assert.throws(() => regroupRetainedBranchScenario(unknown, groups));
});

test("retained bytes must equal fresh observations without copying old binding identity", () => {
  const contents = "known λ\n";
  const sha256 = `sha256:${createHash("sha256").update(contents).digest("hex")}`;
  const files = [{ relativePath: "known.scala", contents, sha256, byteLength: Buffer.byteLength(contents),
    originalObservation: { workspaceBindingIdentity: "binding://old" } }];
  const inputs = [{ subject: { relativePath: "known.scala" }, predecessorObservation: {
    state: "file", fileDigest: sha256, byteLength: Buffer.byteLength(contents), workspaceBindingIdentity: "binding://new" } },
  { subject: { relativePath: "missing.scala" }, predecessorObservation: { state: "absent" } }];
  validateRetainedBranchTargets(inputs, files);
  assert.throws(() => validateRetainedBranchTargets(inputs, [{ ...files[0], contents: "changed" }]));
  assert.throws(() => validateRetainedBranchTargets(inputs, [{ ...files[0], relativePath: "other.scala" }]));
  assert.throws(() => validateRetainedBranchTargets(inputs, [...files, files[0]]));
  assert.throws(() => validateRetainedBranchTargets([{ ...inputs[0], predecessorObservation: {
    ...inputs[0].predecessorObservation, fileDigest: "sha256:drift" } }, inputs[1]], files));
  assert.throws(() => validateRetainedBranchTargets([inputs[0], { ...inputs[1], predecessorObservation: { state: "file" } }], files));
});
