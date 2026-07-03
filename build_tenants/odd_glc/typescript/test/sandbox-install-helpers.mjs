import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const ODD_GLC_INSTALL_PACKAGE_NAME = "@odd-glc/route-one-typescript";
export const ODD_GLC_INSTALL_VERSION = "0.0.0-source";
export const ODD_GLC_INSTALL_FILES = Object.freeze([
  "package.json",
  "src/index.mjs",
  "src/index.d.ts",
  "src/substrate_provenance.mjs",
  "substrate.provenance.json"
]);

function sha256Text(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function sha256File(filePath) {
  return sha256Text(await readFile(filePath, "utf8"));
}

export async function installOddGlcProductForSandbox(input) {
  const productRoot = path.join(input.runRoot, "products", "odd_glc", ODD_GLC_INSTALL_VERSION);
  const packageRoot = path.join(productRoot, "lib", "node_modules", "@odd-glc", "route-one-typescript");
  const copiedFiles = [];
  const packageJson = await readJson(path.join(input.tenantRoot, "package.json"));
  if (packageJson.name !== ODD_GLC_INSTALL_PACKAGE_NAME) {
    throw new Error(`unexpected odd_glc package name ${JSON.stringify(packageJson.name)}`);
  }
  if (packageJson.version !== "0.0.0") {
    throw new Error(`unexpected odd_glc package source version ${JSON.stringify(packageJson.version)}`);
  }

  for (const relativePath of ODD_GLC_INSTALL_FILES) {
    const sourcePath = path.join(input.tenantRoot, relativePath);
    const targetPath = path.join(packageRoot, relativePath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
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
    sourcePackageVersion: packageJson.version,
    sourceTenantRoot: input.tenantRoot,
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
