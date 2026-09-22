// One-time dependency preparation. Native ABI owns verification, resolution and
// installation. This host supplies paths and records outputs; it admits no run,
// workspace or event and invokes no subject command or model.
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const projectRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const pinPath = new URL("../abi5.development-pin.json", import.meta.url);
const pin = JSON.parse(await readFile(pinPath, "utf8"));
const [sourceArtifact, ...extra] = process.argv.slice(2);
assert(sourceArtifact && extra.length === 0,
  "usage: node materialize-abi5-development-dependency.mjs <exact-approved-tarball>");
const digest = bytes => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const artifactPath = resolve(projectRoot, pin.artifactPath);
const installRoot = resolve(projectRoot, pin.materializationRoot);
const bootstrapRoot = resolve(projectRoot, ".genesis/development-products/abiogenesis-5-dev/bootstrap-package");
const evidenceRoot = resolve(projectRoot, pin.evidenceRoot);
const record = async (name, value) => {
  await writeFile(resolve(evidenceRoot, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const sourceBytes = await readFile(resolve(sourceArtifact));
assert.equal(digest(sourceBytes), pin.artifactDigest, "approved artifact digest mismatch");
await mkdir(dirname(artifactPath), { recursive: true });
await copyFile(resolve(sourceArtifact), artifactPath, constants.COPYFILE_EXCL);
assert.equal(digest(await readFile(artifactPath)), pin.artifactDigest);

// Bootstrap from those exact package bytes and select only its declared public
// export. No mutable ABI source or test helper supplies installation behavior.
await mkdir(bootstrapRoot, { recursive: false });
await run("tar", ["-xzf", artifactPath, "--strip-components=1", "-C", bootstrapRoot]);
const bootstrapPackage = JSON.parse(await readFile(resolve(bootstrapRoot, "package.json"), "utf8"));
assert.equal(bootstrapPackage.name, pin.packageName);
assert.equal(bootstrapPackage.version, pin.packageVersion);
const productExport = bootstrapPackage.exports["./product"].import;
assert.equal(typeof productExport, "string");
const product = await import(pathToFileURL(resolve(bootstrapRoot, productExport)).href);
const verification = await product.ProductVerificationPort.verify({
  kind: "product_verification_packet", schemaVersion: "5.0.0", memberKey: "verify",
  targetKind: "packed_artifact",
  request: {
    artifactPath,
    artifactRef: `artifact://odd-glc/development-dependency/${pin.artifactDigest.slice(7)}`,
    expectedArtifactDigest: pin.artifactDigest,
    expectedProductContentDigest: pin.productContentDigest,
    expectedManifestDigest: pin.manifestDigest,
    expectedProductId: pin.productId,
    expectedPackageName: pin.packageName,
    expectedPackageVersion: pin.packageVersion,
  },
});
await record("native-verification.json", verification);
assert.equal(verification.kind, "product_verification_success", JSON.stringify(verification));
const resolvedLock = product.ProductEnvironmentPort.resolve({
  kind: "product_resolution_packet", schemaVersion: "5.0.0", memberKey: "resolve",
  verifiedArtifacts: [verification.verifiedArtifact],
});
await record("native-resolved-lock.json", resolvedLock);
assert.equal(resolvedLock.kind, "resolved_product_lock", JSON.stringify(resolvedLock));
const install = await product.ProductInstallPort.install({
  kind: "product_install_packet", schemaVersion: "5.0.0", memberKey: "install",
  request: { artifactPath, targetRoot: installRoot,
    verifiedArtifact: verification.verifiedArtifact, resolvedLock },
});
await record("native-install-candidate.json", install);
assert.equal(install.kind, "product_install_candidate", JSON.stringify(install));
assert.equal(await product.installedProductContentMatches(install), true);
const installedPackage = JSON.parse(await readFile(resolve(install.installedRoot, "package.json"), "utf8"));
assert.equal(installedPackage.version, pin.packageVersion);
const result = {
  kind: "odd_glc_development_dependency_materialization_receipt",
  createdAt: new Date().toISOString(),
  sourceArtifact: resolve(sourceArtifact), artifactPath,
  artifactDigest: pin.artifactDigest,
  productContentDigest: install.productContentDigest,
  manifestDigest: install.manifestDigest,
  bootstrapProductExport: pathToFileURL(resolve(bootstrapRoot, productExport)).href,
  installId: install.installId, installedRoot: install.installedRoot,
  resolvedLockId: resolvedLock.lockId, resolvedLockDigest: resolvedLock.lockDigest,
  nativeInstalledContentMatches: true,
  nativeCalls: ["ProductVerificationPort.verify", "ProductEnvironmentPort.resolve", "ProductInstallPort.install", "installedProductContentMatches"],
  admissionStatus: "materialized_only_not_event_admitted",
  workspaceBinding: null, runtimeInvocations: 0, modelCalls: 0, subjectCommands: 0,
  note: "Root npm/default bootstrap migration is separately recorded. Full sandbox admission and execution require another activation.",
};
await record("dependency-materialization.json", result);
console.log(JSON.stringify(result, null, 2));
