import assert from "node:assert/strict";
import test from "node:test";
import { validateRetainedWorksiteSetup } from "./generic-live-workflow-support.mjs";
import { successorEpochPaths, retainedWorkspaceOpenSelection, prepareSuccessorEpoch } from "./generic-successor-epoch-support.mjs";

const hash = `sha256:${"1".repeat(64)}`;
const request = { runRoot: "/scenario/retained", epochId: "text-output-01", artifactPath: "/selected/candidate.tgz", expectedArtifactDigest: hash };
const manifest = { workspaceRef: "workspace://original", canonicalRoot: "/scenario/retained/worksite",
  authorityBasis: { authorityRef: "authority://original", authorityDigest: hash } };
const selection = retainedWorkspaceOpenSelection(manifest.canonicalRoot, manifest, hash, manifest.workspaceRef);

test("successor layout separates new install and event resources while preserving the physical worksite", () => {
  const paths = successorEpochPaths(request);
  assert.equal(paths.worksiteRoot, manifest.canonicalRoot);
  assert.equal(paths.epochRoot, "/scenario/retained/epochs/text-output-01");
  assert.equal(paths.consumerRoot, "/scenario/retained/epochs/text-output-01/abi-consumer");
  assert.equal(paths.authorityRoot, "/scenario/retained/epochs/text-output-01/abi-authority");
  assert.equal(validateRetainedWorksiteSetup(paths.epochRoot, selection), paths.worksiteRoot);
});

test("successor request requires an explicit artifact and rejects path escape", () => {
  for (const delta of [{ artifactPath: undefined }, { artifactPath: "relative.tgz" },
    { expectedArtifactDigest: undefined }, { expectedArtifactDigest: "latest" },
    { epochId: "../old" }, { epochId: "a/b" }, { runRoot: "/scenario/../retained" }]) {
    assert.throws(() => successorEpochPaths({ ...request, ...delta }));
  }
});

test("retained workspace setup refuses clean creation, overlapping roots, inferred authority and setup retry", () => {
  const epoch = successorEpochPaths(request).epochRoot;
  for (const memberKey of ["clean", "imported"]) {
    assert.throws(() => validateRetainedWorksiteSetup(epoch, { ...selection,
      openPacket: { ...selection.openPacket, memberKey } }));
  }
  for (const root of [manifest.canonicalRoot, `${manifest.canonicalRoot}/nested`, "/scenario/retained"]) {
    assert.throws(() => validateRetainedWorksiteSetup(root, selection));
  }
  assert.throws(() => validateRetainedWorksiteSetup(epoch, { ...selection,
    openPacket: { ...selection.openPacket, expectedWorkspaceAuthorityDigest: null } }));
  assert.throws(() => validateRetainedWorksiteSetup(epoch, selection, "old-setup-retry"));
  assert.throws(() => retainedWorkspaceOpenSelection(manifest.canonicalRoot, manifest, hash, "workspace://other"));
  assert.throws(() => retainedWorkspaceOpenSelection("/other/worksite", manifest, hash, manifest.workspaceRef));
});

test("successor setup cannot perform any effect without its explicit gate", async () => {
  await assert.rejects(prepareSuccessorEpoch({}, {}));
});
