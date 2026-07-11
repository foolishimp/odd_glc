import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING,
  ODD_GLC_STARTUP_BINDING
} from "../src/index.mjs";
import { installOddGlcProductForSandbox } from "./sandbox-install-helpers.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  await readFile(path.resolve(dirname, "../package.json"), "utf8")
);

test("0.1.0 package identity and public declarations bind the exact rc.3 substrate", () => {
  assert.equal(packageJson.name, "@odd-glc/route-one-typescript");
  assert.equal(packageJson.version, "0.1.0");
  assert.equal(packageJson.private, true);
  assert.equal(ODD_GLC_STARTUP_BINDING.version, packageJson.version);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.version, packageJson.version);
  assert.equal(
    packageJson.peerDependencies["@abiogenesis/typescript-tenant"],
    "4.6.0-rc.3"
  );
  assert.equal(
    packageJson.oddGlcCompatibility.abiogenesisVersion,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion
  );
  assert.equal(
    packageJson.oddGlcCompatibility.abiogenesisTarballSha256,
    ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.tarballSha256
  );
  assert.deepEqual(packageJson.files, [
    "README.md",
    "src/index.d.ts",
    "src/index.mjs",
    "src/substrate_provenance.mjs",
    "substrate.provenance.json"
  ]);
});

test("0.1.0 packed artifact installs and imports as the exact public product", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "odd-glc-0.1.0-pack-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const packed = spawnSync(
    npmCommand,
    ["pack", "--pack-destination", root, "--json"],
    { cwd: path.resolve(dirname, ".."), encoding: "utf8", maxBuffer: 1024 * 1024 * 20 }
  );
  assert.equal(packed.status, 0, packed.stderr);
  const [packSummary] = JSON.parse(packed.stdout);
  assert.equal(packSummary.name, packageJson.name);
  assert.equal(packSummary.version, packageJson.version);
  assert.deepEqual(
    packSummary.files.map((file) => file.path).sort(),
    [
      "README.md",
      "package.json",
      "src/index.d.ts",
      "src/index.mjs",
      "src/substrate_provenance.mjs",
      "substrate.provenance.json"
    ]
  );

  const packageTarballPath = path.join(root, packSummary.filename);
  const packageTarballSha256 = `sha256:${createHash("sha256")
    .update(await readFile(packageTarballPath))
    .digest("hex")}`;
  const installed = await installOddGlcProductForSandbox({
    runRoot: root,
    workspaceRoot: path.join(root, "workspace"),
    packageTarballPath,
    packageTarballSha256,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate
  });
  assert.equal(installed.manifest.installMode, "packed_artifact");
  assert.equal(installed.manifest.packageTarballSha256, packageTarballSha256);
  assert.equal(installed.manifest.sourceTenantRoot, null);

  const installedPackageJson = JSON.parse(
    await readFile(path.join(installed.packageRoot, "package.json"), "utf8")
  );
  assert.equal(installedPackageJson.version, "0.1.0");
  const publicPackage = await import(
    pathToFileURL(path.join(installed.packageRoot, "src/index.mjs")).href
  );
  assert.equal(publicPackage.ODD_GLC_STARTUP_BINDING.version, "0.1.0");
  assert.equal(
    publicPackage.ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion,
    "4.6.0-rc.3"
  );
});
