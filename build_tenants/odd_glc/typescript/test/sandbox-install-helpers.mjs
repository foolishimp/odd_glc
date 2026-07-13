import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const ODD_GLC_INSTALL_PACKAGE_NAME = "@odd-glc/route-one-typescript";
export const ODD_GLC_INSTALL_VERSION = "0.1.1-rc.1";
export const ODD_GLC_INSTALL_FILES = Object.freeze([
  "package.json",
  "README.md",
  "src/index.mjs",
  "src/index.d.ts",
  "src/substrate_provenance.mjs",
  "substrate.provenance.json"
]);

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function sha256File(filePath) {
  return `sha256:${createHash("sha256").update(await readFile(filePath)).digest("hex")}`;
}

function installPackedArtifact(packageTarballPath, installRoot) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(
    npmCommand,
    [
      "install",
      "--prefix",
      installRoot,
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      packageTarballPath
    ],
    { encoding: "utf8", maxBuffer: 1024 * 1024 * 20 }
  );
  if (result.status !== 0) {
    throw new Error(
      `odd_glc packed install failed with ${String(result.status)}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
  }
}

export async function installOddGlcProductForSandbox(input) {
  const productRoot = path.join(input.runRoot, "products", "odd_glc", ODD_GLC_INSTALL_VERSION);
  const installRoot = path.join(productRoot, "lib");
  const packageRoot = path.join(installRoot, "node_modules", "@odd-glc", "route-one-typescript");
  const packageTarballPath = typeof input.packageTarballPath === "string"
    ? path.resolve(input.packageTarballPath)
    : null;
  const installMode = packageTarballPath === null ? "source_snapshot" : "packed_artifact";
  const copiedFiles = [];
  if (installMode === "packed_artifact") {
    installPackedArtifact(packageTarballPath, installRoot);
  } else if (typeof input.tenantRoot !== "string") {
    throw new TypeError("source_snapshot odd_glc install requires tenantRoot");
  }
  const packageJsonRoot = installMode === "packed_artifact" ? packageRoot : input.tenantRoot;
  const packageJson = await readJson(path.join(packageJsonRoot, "package.json"));
  if (packageJson.name !== ODD_GLC_INSTALL_PACKAGE_NAME) {
    throw new Error(`unexpected odd_glc package name ${JSON.stringify(packageJson.name)}`);
  }
  if (packageJson.version !== ODD_GLC_INSTALL_VERSION) {
    throw new Error(`unexpected odd_glc package source version ${JSON.stringify(packageJson.version)}`);
  }
  const packageTarballSha256 = packageTarballPath === null
    ? null
    : await sha256File(packageTarballPath);
  if (
    typeof input.packageTarballSha256 === "string" &&
    packageTarballSha256 !== (input.packageTarballSha256.startsWith("sha256:")
      ? input.packageTarballSha256
      : `sha256:${input.packageTarballSha256}`)
  ) {
    throw new Error(
      `odd_glc package tarball digest mismatch: expected ${input.packageTarballSha256}, got ${packageTarballSha256}`
    );
  }

  for (const relativePath of ODD_GLC_INSTALL_FILES) {
    const sourcePath = installMode === "packed_artifact"
      ? `${packageTarballPath}#package/${relativePath}`
      : path.join(input.tenantRoot, relativePath);
    const targetPath = path.join(packageRoot, relativePath);
    if (installMode === "source_snapshot") {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
    }
    copiedFiles.push(Object.freeze({
      relativePath,
      sourcePath,
      targetPath,
      sha256: await sha256File(targetPath)
    }));
  }

  const manifest = Object.freeze({
    kind: "odd_glc_typescript_sandbox_install_manifest",
    schemaVersion: "1",
    packageName: ODD_GLC_INSTALL_PACKAGE_NAME,
    packageVersion: ODD_GLC_INSTALL_VERSION,
    installMode,
    sourcePackageVersion: packageJson.version,
    sourceTenantRoot: installMode === "source_snapshot" ? input.tenantRoot : null,
    packageTarballPath,
    packageTarballSha256,
    productRoot,
    packageRoot,
    workspaceRoot: input.workspaceRoot,
    substrate: input.substrate,
    copiedFiles,
    authorityRule: "Installed odd_glc provides declaration data and read interpretation only. ABG owns startup, registry, traversal, event emission, evidence, fold, residual, and replay truth."
  });
  const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
  const manifestPath = path.join(productRoot, "odd-glc-install-manifest.json");
  const workspaceManifestPath = path.join(input.workspaceRoot, ".odd_glc", "install-manifest.json");
  const aiWorkspaceManifestPath = path.join(input.workspaceRoot, ".ai-workspace", "odd-glc-install-manifest.json");
  await writeText(manifestPath, manifestText);
  await writeText(workspaceManifestPath, manifestText);
  await writeText(aiWorkspaceManifestPath, manifestText);

  return Object.freeze({
    manifest,
    manifestPath,
    workspaceManifestPath,
    aiWorkspaceManifestPath,
    productRoot,
    packageRoot
  });
}
