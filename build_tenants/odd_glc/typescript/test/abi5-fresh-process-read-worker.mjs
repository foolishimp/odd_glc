import { readFile, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const PACKAGE_NAME = "@abiogenesis/typescript-tenant";

async function loadInstalledPublic(consumerRoot, installedRoot) {
  const packageJson = JSON.parse(
    await readFile(path.join(installedRoot, "package.json"), "utf8"),
  );
  const publicTarget = packageJson.exports?.["./public"]?.import;
  if (packageJson.name !== PACKAGE_NAME || typeof publicTarget !== "string") {
    throw new TypeError("fresh reader requires the installed ABI public export");
  }
  const bridgeRoot = await mkdtemp(
    path.join(consumerRoot, ".odd-glc-t041-read-bridge-"),
  );
  const bridgePath = path.join(bridgeRoot, "bridge.mjs");
  await writeFile(
    bridgePath,
    `export * as installedPublic from "${PACKAGE_NAME}/public";\n`,
  );
  try {
    const { installedPublic } = await import(pathToFileURL(bridgePath).href);
    return {
      installedPublic,
      publicModuleRef: pathToFileURL(await realpath(
        path.join(installedRoot, publicTarget),
      )).href,
    };
  } finally {
    await rm(bridgeRoot, { recursive: true, force: true });
  }
}

async function main() {
  const request = JSON.parse(await readFile(process.argv[2], "utf8"));
  const { installedPublic, publicModuleRef } = await loadInstalledPublic(
    request.consumerRoot,
    request.installedRoot,
  );
  const receipts = [];
  for (const call of request.calls) {
    const outcome = await installedPublic.runInstalledDefinitionCallTransport(
      {
        kind: "reopen",
        closeHandoff: call.resources.eventResource.closeHandoff,
      },
      call,
    );
    if (outcome.kind !== "installed_definition_call_transport_result") {
      throw new TypeError(JSON.stringify(outcome));
    }
    receipts.push(outcome.receipt);
  }
  return {
    kind: "odd_glc_abi5_fresh_process_read_result",
    schemaVersion: "5.0.0",
    processId: process.pid,
    publicModuleRef,
    receipts,
  };
}

process.stdout.write(JSON.stringify(await main()));
