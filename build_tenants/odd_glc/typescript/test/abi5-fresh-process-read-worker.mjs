import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PACKAGE_NAME = "@abiogenesis/typescript-tenant";
const EXPECTED_DEFINITION_KEYS = Object.freeze([
  Object.freeze({ operationId: "abg.operation.project.read", memberKey: "run_status" }),
  Object.freeze({ operationId: "abg.operation.project.read", memberKey: "run_result" }),
  Object.freeze({ operationId: "abg.operation.project.read", memberKey: "run_replay" }),
]);

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function rawBytesEvidence(bytes) {
  return Object.freeze({
    encoding: "base64",
    bytes: bytes.toString("base64"),
    byteLength: bytes.length,
    sha256: `sha256:${sha256Hex(bytes)}`,
  });
}

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
    [
      `export * as installedPublic from "${PACKAGE_NAME}/public";`,
      `export const publicURL = import.meta.resolve("${PACKAGE_NAME}/public");`,
      "",
    ].join("\n"),
  );
  try {
    const { installedPublic, publicURL } = await import(pathToFileURL(bridgePath).href);
    const canonicalInstalledRoot = await realpath(installedRoot);
    const publicModulePath = await realpath(fileURLToPath(publicURL));
    const relative = path.relative(canonicalInstalledRoot, publicModulePath);
    assert.equal(path.isAbsolute(relative), false);
    assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`), false);
    assert.equal(
      pathToFileURL(publicModulePath).href,
      pathToFileURL(await realpath(path.join(installedRoot, publicTarget))).href,
    );
    return {
      installedPublic,
      publicModuleRef: publicURL,
      publicRealModuleRef: pathToFileURL(publicModulePath).href,
    };
  } finally {
    await rm(bridgeRoot, { recursive: true, force: true });
  }
}

async function main() {
  assert.equal(process.argv.length, 3);
  const request = JSON.parse(await readFile(process.argv[2], "utf8"));
  assert.deepEqual(Object.keys(request).sort(), [
    "calls",
    "consumerRoot",
    "installedRoot",
  ]);
  assert.equal(path.isAbsolute(request.consumerRoot), true);
  assert.equal(path.isAbsolute(request.installedRoot), true);
  const consumerRoot = await realpath(request.consumerRoot);
  const installedRoot = await realpath(request.installedRoot);
  const installedRelative = path.relative(consumerRoot, installedRoot);
  assert.equal(path.isAbsolute(installedRelative), false);
  assert.equal(
    installedRelative === ".." || installedRelative.startsWith(`..${path.sep}`),
    false,
  );
  assert.equal(request.calls.length, 3);
  assert.deepEqual(
    request.calls.map(({ invocation }) => invocation.definitionKey),
    EXPECTED_DEFINITION_KEYS,
  );
  const { installedPublic, publicModuleRef, publicRealModuleRef } =
    await loadInstalledPublic(consumerRoot, installedRoot);
  const eventLogRefs = new Set(request.calls.map(
    (call) => call.resources.eventResource.closeHandoff.prefix.eventLogRef,
  ));
  assert.equal(eventLogRefs.size, 1);
  const [eventLogRef] = eventLogRefs;
  const eventLogPath = fileURLToPath(eventLogRef);
  const beforeBytes = await readFile(eventLogPath);
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
  const afterBytes = await readFile(eventLogPath);
  assert.deepEqual(afterBytes, beforeBytes);
  return {
    kind: "odd_glc_abi5_fresh_process_read_result",
    schemaVersion: "5.0.0",
    processId: process.pid,
    publicModuleRef,
    publicRealModuleRef,
    eventLogObservation: Object.freeze({
      eventLogRef,
      before: rawBytesEvidence(beforeBytes),
      after: rawBytesEvidence(afterBytes),
      appendedByteLength: afterBytes.length - beforeBytes.length,
    }),
    receipts,
  };
}

process.stdout.write(JSON.stringify(await main()));
