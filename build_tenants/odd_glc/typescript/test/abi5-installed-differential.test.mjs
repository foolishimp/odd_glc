import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { isDeepStrictEqual, promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const TEST_ROOT = path.dirname(fileURLToPath(import.meta.url));
const CROSS_OWNER_TEST = path.join(
  TEST_ROOT,
  "abi5-installed-cross-owner-hello.test.mjs",
);
const PROOF_FILES = Object.freeze([
  "abi5-product-inventory.test.mjs",
  "abi5-installed-cross-owner-hello.test.mjs",
  "abi5-fresh-process-read-worker.mjs",
  "abi5-installed-differential.test.mjs",
]);
const ARCHIVE_MEMBERS = Object.freeze([
  "build/publication.json",
  "contracts/capabilities/capability-definition-graph.json",
  "contracts/public-contract-catalog.schema.json",
  "package.json",
  "product-toolchain-manifest.json",
]);
const NATIVE_OWNER_METHODS = Object.freeze([
  "./product::WorkspaceOperationPort.create",
  "./product::WorkspaceOperationPort.open",
  "./product::verifyProduct",
  "./product::constructResolvedProductLock",
  "./product::installProduct",
  "./abg::admitWorkspaceBinding",
  "./product::admitGraphFunctionCatalog",
  "./product::narrowGraphFunctionCatalog",
]);
const TRANSPORTED_DEFINITION_KEYS = Object.freeze([
  { operationId: "abg.operation.run.invoke", memberKey: "start" },
  { operationId: "abg.operation.project.read", memberKey: "run_status" },
  { operationId: "abg.operation.project.read", memberKey: "run_result" },
  { operationId: "abg.operation.project.read", memberKey: "run_replay" },
]);
const SHARED_PROJECTION = Object.freeze({
  sourceIndependentInstalledExecution: true,
  topLevelStartCount: 1,
  minimalHelloOperationSucceeded: true,
  terminalResultCount: 1,
  versionLocalGreetingExpected: true,
  freshProcessReplayAgreement: true,
  sourceOrPrivateImport: false,
  legacyFallback: false,
});
const DIGESTS = Object.freeze({
  abi5Tarball:
    "4fc3130cef9fda3171bb28aafffa71775328745721e305172fce9d04c9fdfe41",
  odd01Tarball:
    "7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578",
  abi46Tarball:
    "9cffb372c0dfc00983a5d0e882efbc3d0c3ac937a56f313000f35a4473358113",
  predecessorReceipt:
    "b20e85a2eaa03431e2a4674e50d94ba3027455dd12b9f5d0f4f7ea2e57afe071",
  odd01ReleaseManifest:
    "d8bbbd172cd011f68ae569f6c64bafb0e44eea002be2d55181270ae8de634eb1",
  abi46ReleaseManifest:
    "941d9a00198914120db7d7a1f466f4b3e2efe0fbd9659a71540267ca0f899bf4",
  predecessorLiveProof:
    "9a8bbce08257db6a5b808e629ca7dce5a6f62a293d3f29309e169930228ddfe8",
});

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readExactJson(root, relativePath, expectedDigest) {
  const bytes = await readFile(path.join(root, relativePath));
  assert.equal(sha256Hex(bytes), expectedDigest, relativePath);
  return Object.freeze({
    bytes,
    value: JSON.parse(bytes),
  });
}

function importSpecifiers(source) {
  const specifiers = [];
  for (const declaration of source.match(/^import\b[\s\S]*?;$/gmu) ?? []) {
    const match = declaration.match(
      /(?:from\s+)?["']([^"']+)["']\s*;$/u,
    );
    assert.ok(match, declaration);
    specifiers.push(match[1]);
  }
  for (const match of source.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/gu)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

async function sourceBlindCensus() {
  const prohibitedTokens = Object.freeze([
    ["developer", "mini", "product"].join("-"),
    ["test", "env"].join("_"),
    ["abi5", "program"].join("_"),
    ["Root", "Public", "Invocation"].join(""),
    ["legacy", "Request"].join(""),
  ]);
  const files = [];
  for (const relativePath of PROOF_FILES) {
    const bytes = await readFile(path.join(TEST_ROOT, relativePath));
    const source = bytes.toString("utf8");
    const specifiers = importSpecifiers(source);
    assert.equal(specifiers.length > 0, true, relativePath);
    assert.equal(
      specifiers.every((specifier) => specifier.startsWith("node:")),
      true,
      `${relativePath}: ${JSON.stringify(specifiers)}`,
    );
    const prohibitedTokenHits = prohibitedTokens.filter((token) =>
      source.includes(token));
    assert.deepEqual(prohibitedTokenHits, [], relativePath);
    files.push(Object.freeze({
      relativePath,
      sha256: sha256Hex(bytes),
      importSpecifiers: Object.freeze(specifiers),
      prohibitedTokenHits: Object.freeze(prohibitedTokenHits),
    }));
  }
  return Object.freeze({
    files: Object.freeze(files),
    sourceOrPrivateImport: false,
    prohibitedCompatibilitySurface: false,
  });
}

function projectPredecessor({ receipt, releaseManifest, liveProof }) {
  assert.equal(receipt.kind, "t041_immutable_predecessor_receipt");
  assert.equal(receipt.schemaVersion, "1");
  assert.deepEqual(receipt.basis, {
    oddGlcTag: "v0.1.0",
    oddGlcCommit: "a878475e4609e2d74d3260eb36ee05c4657b1879",
    oddGlcPackage: "@odd-glc/route-one-typescript@0.1.0",
    oddGlcTarballSha256: DIGESTS.odd01Tarball,
    abiTag: "v4.6.0-rc.3",
    abiPackage: "@abiogenesis/typescript-tenant@4.6.0-rc.3",
    abiTarballSha256: DIGESTS.abi46Tarball,
  });
  assert.equal(releaseManifest.releaseIdentity, "0.1.0");
  assert.equal(releaseManifest.tarball.sha256, DIGESTS.odd01Tarball);
  assert.equal(releaseManifest.packedInstall.status, 0);
  assert.equal(releaseManifest.packedInstall.installMode, "packed_artifact");
  assert.equal(releaseManifest.packedInstall.packageVersion, "0.1.0");
  assert.equal(
    releaseManifest.packedInstall.peerDependency,
    "@abiogenesis/typescript-tenant@4.6.0-rc.3",
  );
  assert.equal(releaseManifest.liveProof.sourceTenantRoot, null);
  assert.equal(liveProof.oddGlcInstallMode, "packed_artifact");
  assert.equal(
    liveProof.oddGlcPackageTarballSha256,
    `sha256:${DIGESTS.odd01Tarball}`,
  );
  assert.equal(liveProof.externalAbgStartInvocationCount, 1);
  assert.equal(liveProof.startProcess.status, 0);
  assert.equal(liveProof.startProcess.signal, null);
  assert.equal(liveProof.startProcess.error, null);
  assert.equal(liveProof.startOutput.status, "converged");
  assert.equal(liveProof.startOutput.stopped_by, "converged");
  assert.equal(liveProof.terminalEvents.length, 1);
  assert.equal(liveProof.terminalEvents[0].kind, "terminal_reached");
  assert.equal(
    liveProof.terminalEvents[0].detail,
    "all graph-function vectors are closed by replay",
  );
  assert.equal(
    releaseManifest.liveProof.subjectTests.assertedReturnValue,
    "Hello, world!",
  );
  assert.equal(receipt.observation.versionLocalExpectedStdout, "Hello, world!\n");
  assert.equal(receipt.observation.terminalStatus, "converged");
  assert.equal(receipt.observation.terminalResultCount, 1);
  return Object.freeze({
    sourceIndependentInstalledExecution:
      releaseManifest.packedInstall.installMode === "packed_artifact" &&
      releaseManifest.liveProof.sourceTenantRoot === null,
    topLevelStartCount: liveProof.externalAbgStartInvocationCount,
    minimalHelloOperationSucceeded:
      liveProof.startProcess.status === 0 &&
      releaseManifest.liveProof.subjectTests.status === 0,
    terminalResultCount: receipt.observation.terminalResultCount,
    versionLocalGreetingExpected:
      releaseManifest.liveProof.subjectTests.assertedReturnValue ===
        "Hello, world!" &&
      receipt.observation.versionLocalExpectedStdout === "Hello, world!\n",
    freshProcessReplayAgreement:
      liveProof.startProcess.status === 0 &&
      liveProof.terminalEvents[0].detail ===
        "all graph-function vectors are closed by replay",
    sourceOrPrivateImport:
      !(releaseManifest.liveProof.sourceTenantRoot === null),
    legacyFallback: !(
      releaseManifest.packedInstall.packageVersion === "0.1.0" &&
      releaseManifest.packedInstall.substrateVersion === "4.6.0-rc.3"
    ),
  });
}

function projectCandidate(rawObservation, sourceCensus) {
  assert.equal(rawObservation.kind, "odd_glc_abi5_installed_raw_observation");
  assert.equal(rawObservation.schemaVersion, "1");
  assert.deepEqual(rawObservation.basis, {
    abiPackage: "@abiogenesis/typescript-tenant@5.0.0-dev.286",
    abiProductId: "product://abiogenesis/typescript-tenant@5.0.0-dev.286",
    abiTarballSha256: DIGESTS.abi5Tarball,
    oddPackage: "@odd-glc/route-one-typescript@0.2.0-dev.1",
    oddProductId: "product://odd_glc/route-one-typescript@0.2.0-dev.1",
    oddTarballSha256:
      "deb2e92f9944caca76cb5f7b8f4d2df99a6bddd41c8eb103c731ba7f50076f4c",
  });
  assert.deepEqual(rawObservation.archive.members, ARCHIVE_MEMBERS);
  assert.equal(rawObservation.archive.executableOrDeclarationMemberCount, 0);
  const moduleEvidence = [
    ...rawObservation.installedPublicModuleEvidence.bootstrap,
    ...rawObservation.installedPublicModuleEvidence.execution,
  ];
  assert.equal(moduleEvidence.length, 10);
  assert.equal(
    moduleEvidence.every((row) =>
      row.containedInInstalledPackage === true &&
      row.packageExportPath === `./${row.namespace}` &&
      !path.posix.isAbsolute(row.packageRelativeTarget) &&
      row.packageRelativeTarget !== ".." &&
      !row.packageRelativeTarget.startsWith("../")),
    true,
  );
  assert.equal(rawObservation.publicFamily.operationCount, 18);
  assert.equal(rawObservation.publicFamily.definitionCount, 56);
  assert.equal(rawObservation.publicFamily.consumedDefinitionKeys.length, 12);
  assert.equal(
    rawObservation.publicFamily.callableQualificationScope,
    "consumed_12_only",
  );
  assert.equal(rawObservation.publicFamily.unconsumedCallableClosure, "not_claimed");
  assert.deepEqual(
    rawObservation.nativeOwnerStageObservations.map(({ ownerMethod }) =>
      ownerMethod),
    NATIVE_OWNER_METHODS,
  );
  assert.deepEqual(
    rawObservation.transportedDefinitionKeys,
    TRANSPORTED_DEFINITION_KEYS,
  );
  assert.deepEqual(rawObservation.resolutionBoundaryObservations, [
    {
      identity: "absent_selected_graph_function",
      code: "absent",
      stage: "catalog",
    },
    {
      identity: "install_unproved_at_authentic_earlier_abg_truth",
      code: "incompatible_or_unproven",
      stage: "dependency",
    },
  ]);
  assert.deepEqual(
    rawObservation.transportBoundaryObservations.map(
      ({ rawJsonLine, ...observation }) => {
        assert.equal(typeof rawJsonLine, "string");
        assert.doesNotThrow(() => JSON.parse(rawJsonLine));
        return observation;
      },
    ),
    [
      {
        identity: "crossed_top_level_and_embedded_handoff",
        transportCode: "acquisition_mismatch",
        receipt: false,
      },
      {
        identity: "matching_stale_owner_issued_handoff",
        exitCode: 70,
        faultStage: "resource_acquisition",
        faultCode: "acquisition_refused",
      },
      {
        identity: "malformed_resource_assertion",
        exitCode: 70,
        faultStage: "resource_admission",
        faultCode: "invalid_resource_assertion",
      },
      {
        identity: "stale_projection_basis",
        exitCode: 1,
        refusalCode: "projection_basis_mismatch",
      },
    ],
  );
  assert.equal(rawObservation.transportedJsonLines.length, 4);
  const outcomes = rawObservation.transportedJsonLines.map((line) =>
    JSON.parse(line));
  assert.equal(
    outcomes.every((outcome) =>
      outcome.kind === "installed_definition_call_transport_result" &&
      outcome.receipt.kind === "definition_host_receipt" &&
      outcome.receipt.exitCode === 0 &&
      outcome.receipt.failure === null),
    true,
  );
  assert.deepEqual(
    outcomes.map(({ receipt }) => receipt.definitionKey),
    TRANSPORTED_DEFINITION_KEYS,
  );
  const [startOutcome, ...readOutcomes] = outcomes;
  assert.equal(startOutcome.receipt.ownerOutput.outcomeKind, "result");
  assert.equal(startOutcome.receipt.ownerOutput.value.disposition, "completed");
  assert.deepEqual(
    readOutcomes.map(({ receipt }) => receipt.ownerOutput.value.caseKey),
    ["run_status", "run_result", "run_replay"],
  );
  assert.equal(
    readOutcomes[0].receipt.ownerOutput.value.projection.status,
    "closed",
  );
  assert.deepEqual(
    readOutcomes[1].receipt.ownerOutput.value.projection.result,
    startOutcome.receipt.ownerOutput.value.result,
  );
  const fresh = JSON.parse(rawObservation.freshProcessStdout);
  assert.equal(fresh.kind, "odd_glc_abi5_fresh_process_read_result");
  assert.equal(fresh.receipts.length, 3);
  for (const [index, receipt] of fresh.receipts.entries()) {
    assert.deepEqual(receipt.ownerOutput, readOutcomes[index].receipt.ownerOutput);
    assert.deepEqual(receipt.resources, readOutcomes[index].receipt.resources);
  }
  const runtimeBytes = Buffer.from(rawObservation.runtimeEventLog.jsonl);
  assert.equal(runtimeBytes.length, rawObservation.runtimeEventLog.byteLength);
  assert.equal(
    `sha256:${sha256Hex(runtimeBytes)}`,
    rawObservation.runtimeEventLog.sha256,
  );
  assert.deepEqual(rawObservation.authenticatedRuntimeObservation.admittedResult, {
    kind: "hello_world_output",
    schemaVersion: "5.0.0",
    message: "Hello World",
  });
  assert.equal(rawObservation.authenticatedRuntimeObservation.runClosedCount, 1);
  assert.equal(
    rawObservation.authenticatedRuntimeObservation.readTimeAppendedBytes,
    0,
  );
  assert.deepEqual(rawObservation.ownership, {
    programRef: "program://odd_glc/conformance/program-only-hello@5",
    graphFunctionRef:
      "graph-function://odd_glc/conformance/program-only-hello@5",
    programOwnerProductId:
      "product://odd_glc/route-one-typescript@0.2.0-dev.1",
    graphFunctionOwnerProductId:
      "product://odd_glc/route-one-typescript@0.2.0-dev.1",
    semanticsOwnerProductId:
      "product://abiogenesis/typescript-tenant@5.0.0-dev.286",
    implementationOwnerProductId:
      "product://abiogenesis/typescript-tenant@5.0.0-dev.286",
  });
  const candidateRawText = JSON.stringify(rawObservation);
  const carriesPredecessorRuntime =
    candidateRawText.includes("@odd-glc/route-one-typescript@0.1.0") ||
    candidateRawText.includes("@abiogenesis/typescript-tenant@4.6.0-rc.3");
  return Object.freeze({
    sourceIndependentInstalledExecution:
      rawObservation.archive.executableOrDeclarationMemberCount === 0 &&
      moduleEvidence.every((row) => row.containedInInstalledPackage),
    topLevelStartCount:
      rawObservation.authenticatedRuntimeObservation.semanticStartCount,
    minimalHelloOperationSucceeded:
      startOutcome.receipt.ownerOutput.value.disposition === "completed" &&
      rawObservation.authenticatedRuntimeObservation.admittedResult.message ===
        "Hello World",
    terminalResultCount:
      rawObservation.authenticatedRuntimeObservation.terminalResultCount,
    versionLocalGreetingExpected:
      rawObservation.authenticatedRuntimeObservation.admittedResult.kind ===
        "hello_world_output" &&
      rawObservation.authenticatedRuntimeObservation.admittedResult.message ===
        "Hello World",
    freshProcessReplayAgreement: fresh.receipts.every((receipt, index) =>
      isDeepStrictEqual(
        receipt.ownerOutput,
        readOutcomes[index].receipt.ownerOutput,
      ) && isDeepStrictEqual(
        receipt.resources,
        readOutcomes[index].receipt.resources,
      )),
    sourceOrPrivateImport: sourceCensus.sourceOrPrivateImport,
    legacyFallback:
      sourceCensus.prohibitedCompatibilitySurface || carriesPredecessorRuntime,
  });
}

test("ABI5 proof paths are source-blind and private-import free", async () => {
  await sourceBlindCensus();
});

test("installed 0.1/ABI4.6 and real-packed 0.2/ABI5 reduce only to the frozen semantic projection", async (t) => {
  const bootstrapRoot = process.env.ODD_GLC_T041_ABI_PACKAGE_ROOT;
  const abi5Tarball = process.env.ODD_GLC_T041_ABI_TARBALL;
  const baselineRoot = process.env.ODD_GLC_T041_BASELINE_ROOT;
  if (!bootstrapRoot || !abi5Tarball || !baselineRoot) {
    t.skip("exact ABI5 install/tarball and immutable 0.1/ABI4.6 baseline are required");
    return;
  }
  assert.equal(sha256Hex(await readFile(abi5Tarball)), DIGESTS.abi5Tarball);
  assert.equal(
    sha256Hex(await readFile(path.join(
      baselineRoot,
      "odd-glc-route-one-typescript-0.1.0.tgz",
    ))),
    DIGESTS.odd01Tarball,
  );
  assert.equal(
    sha256Hex(await readFile(path.join(
      baselineRoot,
      "abiogenesis-typescript-tenant-4.6.0-rc.3.tgz",
    ))),
    DIGESTS.abi46Tarball,
  );
  const predecessorReceipt = await readExactJson(
    baselineRoot,
    "baseline-receipt.json",
    DIGESTS.predecessorReceipt,
  );
  const odd01Release = await readExactJson(
    baselineRoot,
    "odd-glc-0.1.0-release-snapshot-manifest.json",
    DIGESTS.odd01ReleaseManifest,
  );
  const abi46Release = await readExactJson(
    baselineRoot,
    "abiogenesis-4.6.0-rc.3-release-snapshot-manifest.json",
    DIGESTS.abi46ReleaseManifest,
  );
  const predecessorLiveProof = await readExactJson(
    baselineRoot,
    "odd-glc-basic-cli-live-proof.json",
    DIGESTS.predecessorLiveProof,
  );
  assert.equal(abi46Release.value.releaseIdentity, "4.6.0-rc.3");
  assert.equal(abi46Release.value.tarball.sha256, DIGESTS.abi46Tarball);

  const scratch = await mkdtemp(path.join(os.tmpdir(), "odd-glc-t041-diff-"));
  t.after(async () => rm(scratch, { recursive: true, force: true }));
  const candidateRawPath =
    process.env.ODD_GLC_T041_CANDIDATE_RAW_RECEIPT_PATH ??
      path.join(scratch, "abi5-raw-observation.json");
  assert.equal(path.isAbsolute(candidateRawPath), true);
  const childEnvironment = {
    ...process.env,
    ODD_GLC_T041_ABI_PACKAGE_ROOT: bootstrapRoot,
    ODD_GLC_T041_ABI_TARBALL: abi5Tarball,
    ODD_GLC_T041_RAW_RECEIPT_PATH: candidateRawPath,
  };
  delete childEnvironment.NODE_TEST_CONTEXT;
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    ["--test", CROSS_OWNER_TEST],
    {
      cwd: TEST_ROOT,
      env: childEnvironment,
      maxBuffer: 20 * 1024 * 1024,
      timeout: 20 * 60 * 1000,
    },
  );
  assert.equal(stderr, "");
  assert.match(
    stdout,
    /ABI5 executes the installed odd_glc Product through cross-owner Hello/u,
  );
  const candidateRawBytes = await readFile(candidateRawPath);
  const candidateRaw = JSON.parse(candidateRawBytes);
  const sourceCensus = await sourceBlindCensus();
  const predecessorProjection = projectPredecessor({
    receipt: predecessorReceipt.value,
    releaseManifest: odd01Release.value,
    liveProof: predecessorLiveProof.value,
  });
  const candidateProjection = projectCandidate(candidateRaw, sourceCensus);
  assert.deepEqual(predecessorProjection, SHARED_PROJECTION);
  assert.deepEqual(candidateProjection, SHARED_PROJECTION);

  const differentialReceipt = Object.freeze({
    kind: "odd_glc_t041_installed_differential_receipt",
    schemaVersion: "1",
    immutableBasisDigests: DIGESTS,
    predecessorRaw: Object.freeze({
      receipt: predecessorReceipt.value,
      releaseManifest: odd01Release.value,
      abiReleaseManifest: abi46Release.value,
      installedLiveProof: predecessorLiveProof.value,
    }),
    candidateRaw,
    sourceCensus,
    versionLocalObservations: Object.freeze({
      predecessor: Object.freeze({
        greetingStdout:
          predecessorReceipt.value.observation.versionLocalExpectedStdout,
        terminalStatus: predecessorReceipt.value.observation.terminalStatus,
      }),
      candidate: Object.freeze({
        greeting: candidateRaw.authenticatedRuntimeObservation.admittedResult,
        terminalStatus: "closed_success",
      }),
    }),
    semanticReduction: Object.freeze({
      predecessor: predecessorProjection,
      candidate: candidateProjection,
    }),
    nonclaims: Object.freeze([
      "carrier parity",
      "event parity",
      "Product parity",
      "ABI 4.6 to ABI 5 compatibility",
      "unconsumed ABI5 Public-family callable closure",
    ]),
  });
  const receiptPath = process.env.ODD_GLC_T041_DIFFERENTIAL_RECEIPT_PATH;
  if (receiptPath) {
    assert.equal(path.isAbsolute(receiptPath), true);
    await writeFile(receiptPath, `${JSON.stringify(differentialReceipt)}\n`, {
      flag: "wx",
    });
  }
  t.diagnostic(JSON.stringify({
    predecessorTarballSha256: DIGESTS.odd01Tarball,
    candidateTarballSha256: candidateRaw.basis.oddTarballSha256,
    predecessorVersionLocal:
      differentialReceipt.versionLocalObservations.predecessor,
    candidateVersionLocal: differentialReceipt.versionLocalObservations.candidate,
    semanticReduction: candidateProjection,
    candidateRawSha256: sha256Hex(candidateRawBytes),
  }));
});
