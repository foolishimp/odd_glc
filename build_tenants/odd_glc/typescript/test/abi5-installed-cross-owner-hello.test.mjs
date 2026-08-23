import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const TEST_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_ROOT = path.resolve(TEST_ROOT, "../product");
const FRESH_READ_WORKER = path.join(
  TEST_ROOT,
  "abi5-fresh-process-read-worker.mjs",
);
const SCHEMA_VERSION = "5.0.0";
const ABI_TARBALL_SHA256 =
  "4fc3130cef9fda3171bb28aafffa71775328745721e305172fce9d04c9fdfe41";
const ODD_TARBALL_SHA256 =
  "deb2e92f9944caca76cb5f7b8f4d2df99a6bddd41c8eb103c731ba7f50076f4c";
const ABI = Object.freeze({
  packageName: "@abiogenesis/typescript-tenant",
  packageVersion: "5.0.0-dev.286",
  productId: "product://abiogenesis/typescript-tenant@5.0.0-dev.286",
});
const ODD = Object.freeze({
  packageName: "@odd-glc/route-one-typescript",
  packageVersion: "0.2.0-dev.1",
  productId: "product://odd_glc/route-one-typescript@0.2.0-dev.1",
  programRef: "program://odd_glc/conformance/program-only-hello@5",
  graphFunctionRef:
    "graph-function://odd_glc/conformance/program-only-hello@5",
});
const EXPECTED_NATIVE_OWNER_METHODS = Object.freeze([
  "./product::WorkspaceOperationPort.create",
  "./product::WorkspaceOperationPort.open",
  "./product::verifyProduct",
  "./product::constructResolvedProductLock",
  "./product::installProduct",
  "./abg::admitWorkspaceBinding",
  "./product::admitGraphFunctionCatalog",
  "./product::narrowGraphFunctionCatalog",
]);
const EXPECTED_TRANSPORTED_DEFINITION_KEYS = Object.freeze([
  { operationId: "abg.operation.run.invoke", memberKey: "start" },
  { operationId: "abg.operation.project.read", memberKey: "run_status" },
  { operationId: "abg.operation.project.read", memberKey: "run_result" },
  { operationId: "abg.operation.project.read", memberKey: "run_replay" },
]);
const CONSUMED_DEFINITION_KEYS = Object.freeze([
  ["abg.operation.workspace.create", "clean"],
  ["abg.operation.workspace.open", "open"],
  ["abg.operation.product.verify", "verify"],
  ["abg.operation.product.resolve", "resolve"],
  ["abg.operation.product.install", "install"],
  ["abg.operation.workspace.bind", "bind"],
  ["abg.operation.catalog.admit", "admit"],
  ["abg.operation.catalog.view", "allowlist"],
  ["abg.operation.run.invoke", "start"],
  ["abg.operation.project.read", "run_status"],
  ["abg.operation.project.read", "run_result"],
  ["abg.operation.project.read", "run_replay"],
]);

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function verificationIdentity(manifest, artifactDigest, product) {
  return {
    expectedArtifactDigest: artifactDigest,
    expectedProductContentDigest: manifest.productContentDigest,
    expectedManifestDigest: product.sha256Canonical(manifest),
    expectedProductId: manifest.productId,
    expectedPackageName: manifest.packageName,
    expectedPackageVersion: manifest.packageVersion,
  };
}

async function loadAbiPublic(packageRoot) {
  const packageJson = JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8"),
  );
  assert.equal(packageJson.name, ABI.packageName);
  assert.equal(packageJson.version, ABI.packageVersion);
  const namespaces = ["product", "abg", "gtl", "public", "validator"];
  for (const namespace of namespaces) {
    assert.equal(typeof packageJson.exports?.[`./${namespace}`]?.import, "string");
  }
  const nodeModulesRoot = path.resolve(packageRoot, "../..");
  assert.equal(path.basename(nodeModulesRoot), "node_modules");
  const consumerRoot = path.dirname(nodeModulesRoot);
  const bridgeRoot = await mkdtemp(
    path.join(consumerRoot, ".odd-glc-t041-abi-public-bridge-"),
  );
  const bridgePath = path.join(bridgeRoot, "bridge.mjs");
  await writeFile(
    bridgePath,
    `${namespaces.map((namespace) =>
      `export * as ${namespace} from "${ABI.packageName}/${namespace}";`
    ).join("\n")}\n`,
  );
  try {
    const loaded = await import(
      `${pathToFileURL(bridgePath).href}?public=${Date.now()}`
    );
    const publicModuleRefs = Object.fromEntries(await Promise.all(
      namespaces.map(async (namespace) => [
        namespace,
        pathToFileURL(await realpath(path.join(
          packageRoot,
          packageJson.exports[`./${namespace}`].import,
        ))).href,
      ]),
    ));
    return {
      ...loaded,
      consumerRoot,
      packageJson,
      publicModuleRefs,
    };
  } finally {
    await rm(bridgeRoot, { recursive: true, force: true });
  }
}

async function assertPublicModuleRefsWithinPackage(loaded, packageRoot) {
  const installedRoot = await realpath(packageRoot);
  const evidence = [];
  for (const [namespace, moduleRef] of Object.entries(loaded.publicModuleRefs)) {
    const modulePath = fileURLToPath(moduleRef);
    const relative = path.relative(installedRoot, modulePath);
    assert.equal(path.isAbsolute(relative), false, namespace);
    assert.equal(
      relative === ".." || relative.startsWith(`..${path.sep}`),
      false,
      namespace,
    );
    assert.equal(
      moduleRef,
      pathToFileURL(await realpath(path.join(
        packageRoot,
        loaded.packageJson.exports[`./${namespace}`].import,
      ))).href,
      namespace,
    );
    evidence.push(Object.freeze({
      namespace,
      packageExportPath: `./${namespace}`,
      packageRelativeTarget: relative.split(path.sep).join(path.posix.sep),
      moduleRef,
      containedInInstalledPackage: true,
    }));
  }
  return Object.freeze(evidence);
}

async function loadOddPublicationData(installedRoot) {
  const packageJson = JSON.parse(
    await readFile(path.join(installedRoot, "package.json"), "utf8"),
  );
  assert.equal(packageJson.name, ODD.packageName);
  assert.equal(packageJson.version, ODD.packageVersion);
  assert.equal(
    packageJson.exports?.["./publication"],
    "./build/publication.json",
  );
  const nodeModulesRoot = path.resolve(installedRoot, "../..");
  const consumerRoot = path.dirname(nodeModulesRoot);
  const bridgeRoot = await mkdtemp(
    path.join(consumerRoot, ".odd-glc-t041-odd-public-bridge-"),
  );
  const bridgePath = path.join(bridgeRoot, "bridge.mjs");
  await writeFile(
    bridgePath,
    `export { default as publication } from "${ODD.packageName}/publication" with { type: "json" };\n`,
  );
  try {
    const loaded = await import(`${pathToFileURL(bridgePath).href}?odd=${Date.now()}`);
    return structuredClone(loaded.publication);
  } finally {
    await rm(bridgeRoot, { recursive: true, force: true });
  }
}

function publicOperationBasis(
  product,
  operationId,
  memberKey,
  scopeRef,
  scopeDigest,
  invocationRef,
  causationEventRefs = [],
) {
  const invocationPayloadDigest = product.sha256Canonical({});
  const definitionDigest = product.sha256Canonical({
    operationId,
    memberKey,
    schemaVersion: SCHEMA_VERSION,
  });
  return {
    operationId,
    memberKey,
    definitionDigest,
    authorityScopeRef: scopeRef,
    authorityScopeDigest: scopeDigest,
    invocationRef,
    invocationPayloadDigest,
    invocationDigest: product.sha256Canonical({
      definitionDigest,
      invocationRef,
      invocationPayloadDigest,
      memberKey,
      operationId,
    }),
    correlationId: "correlation://odd-glc/t041/root",
    eventTime: "2026-08-24T00:00:00.000Z",
    causationEventRefs,
  };
}

function requireRawAdmission(validator, value, subjectKind, contractRef) {
  const admitted = validator.rawAdmitValue(value, subjectKind, contractRef);
  assert.equal(admitted.kind, "raw_admitted_value", JSON.stringify(admitted));
  return admitted;
}

function rawProgramInput(validator, publicationAdmission, program) {
  const publication = publicationAdmission.value;
  return {
    declarationBasisDigest: publicationAdmission.subjectDigest,
    programPublication: publicationAdmission,
    program: requireRawAdmission(
      validator,
      program,
      "gtl_program",
      "contract://abiogenesis/gtl/program@5",
    ),
    graphFunctions: publication.graphFunctions
      .filter((value) => program.callableMembership.includes(value.name))
      .map((value) => requireRawAdmission(
        validator,
        value,
        "graph_function",
        "contract://abiogenesis/gtl/graph-function@5",
      )),
    contracts: publication.contracts.map((value) => requireRawAdmission(
      validator,
      value,
      "contract_declaration",
      "contract://abiogenesis/gtl/contract-declaration@5",
    )),
    evaluators: publication.evaluators,
    rules: publication.rules,
    implementationBindings: publication.implementationBindings.map((value) =>
      requireRawAdmission(
        validator,
        value,
        "implementation_binding",
        "contract://abiogenesis/gtl/implementation-binding@5",
      )
    ),
    closureContracts: publication.closureContracts.map((value) =>
      requireRawAdmission(
        validator,
        value,
        "closure_contract",
        "contract://abiogenesis/gtl/closure-contract@5",
      )
    ),
  };
}

function exact(values, predicate, label) {
  const matches = values.filter(predicate);
  assert.equal(matches.length, 1, `${label} must select exactly one value`);
  return matches[0];
}

function definitionFor(installedPublic, operationId, memberKey) {
  return exact(
    installedPublic.PUBLIC_FUNCTION_DEFINITION_FAMILY.definitions,
    (candidate) =>
      candidate.definitionKey.operationId === operationId &&
      candidate.definitionKey.memberKey === memberKey,
    `${operationId}#${memberKey}`,
  );
}

function ownerPacketProjection(definition) {
  const source = definition.requestContract.source;
  return Object.freeze({
    definitionKey: structuredClone(definition.definitionKey),
    requestSchema: definition.requestContract.schema,
    resultSchema: definition.resultContract.schema,
    refusalSchema: definition.refusalContract.schema,
    nonTerminalSchema: definition.nonTerminalContract?.schema ?? null,
    owner: Object.freeze({
      abstractModule: source.abstractModule,
      exportName: source.exportName,
      memberPath: Object.freeze([...source.memberPath]),
      authorityRef: definition.semanticAuthorityRef,
      authorityDigest: definition.semanticAuthorityDigest,
    }),
    contractIds: Object.freeze({
      request: definition.requestContract.contractId,
      result: definition.resultContract.contractId,
      refusal: definition.refusalContract.contractId,
      nonTerminal: definition.nonTerminalContract?.contractId ?? null,
    }),
    metadata: Object.freeze({
      authorityClass: definition.authorityClass,
      effectClass: definition.effectClass,
      eventAdmission: definition.eventAdmission,
      actorRequirement: definition.actorRequirement,
      workspaceBindingRequirement: definition.workspaceBindingRequirement,
      authoritySlotRequirements: Object.freeze([
        ...definition.authoritySlotRequirements,
      ]),
      capabilityRefs: Object.freeze([...definition.capabilityRefs]),
      defaults: definition.defaults,
      closedDomains: definition.closedDomains,
      sdkCoordinate: definition.sdkCoordinate,
      cliCoordinate: definition.cliCoordinate,
      adapterExitMap: definition.adapterExitMap,
    }),
  });
}

function definitionCall({
  product,
  installedPublic,
  coordinates,
  contractCatalog,
  operationId,
  memberKey,
  request,
  slots,
  resources,
  requestRef,
}) {
  const definition = definitionFor(installedPublic, operationId, memberKey);
  const operationCoordinates = exact(
    coordinates.operations,
    (candidate) => candidate.operationId === operationId,
    `${operationId} verified coordinates`,
  );
  const memberCoordinates = exact(
    operationCoordinates.members,
    (candidate) => candidate.memberKey === memberKey,
    `${operationId}#${memberKey} verified coordinates`,
  );
  const operationProjection = exact(
    installedPublic.PUBLIC_OPERATION_CONTRACT_PROJECTIONS,
    (candidate) => candidate.operationId === operationId,
    `${operationId} installed projection`,
  );
  const memberProjection = exact(
    operationProjection.definitions,
    (candidate) => candidate.definitionKey.memberKey === memberKey,
    `${operationId}#${memberKey} installed projection`,
  );
  const coordinate = (slot, projectionKey, coordinateKey) => {
    const projected = memberProjection[projectionKey];
    const selected = memberCoordinates.slots[coordinateKey];
    if (projected === null) {
      assert.equal(selected, null);
      return null;
    }
    assert.deepEqual(selected.contractCatalog, contractCatalog);
    assert.deepEqual(selected.nestedSelector.definitionKey, definition.definitionKey);
    assert.equal(selected.nestedSelector.slot, slot);
    assert.equal(selected.nestedSelector.definitionRef, projected.definitionRef);
    return selected;
  };
  const invocationAuthorityBody = Object.freeze({
    kind: "invocation_authority",
    definitionKey: definition.definitionKey,
    slots,
  });
  const invocationAuthority = Object.freeze({
    ...invocationAuthorityBody,
    authorityDigest: product.sha256Canonical(invocationAuthorityBody),
  });
  const requestDigest = product.sha256Canonical(request);
  const invocationBody = Object.freeze({
    kind: "public_invocation",
    schemaVersion: SCHEMA_VERSION,
    invocationContract: Object.freeze({
      contractCatalog,
      flatRow: Object.freeze({
        contractId: "abg.schema.public-operation-invocation",
        contractVersion: SCHEMA_VERSION,
        contractDigest:
          installedPublic.PUBLIC_PROJECTION_PAYLOADS.commonSchemaAsset
            .contentDigest,
      }),
      nestedSelector: Object.freeze({
        selectorKind: "schema_definition",
        definitionKey: null,
        slot: null,
        definitionRef: "#/$defs/PublicInvocation",
      }),
    }),
    definitionRef: definition.definitionRef,
    definitionVersion: SCHEMA_VERSION,
    definitionDigest: definition.definitionDigest,
    definitionKey: definition.definitionKey,
    contractCatalog,
    invocationAuthority,
    requestContract: coordinate("request", "requestContract", "request"),
    requestRef,
    requestDigest,
    request,
    expectedResultContract: coordinate("result", "resultContract", "result"),
    expectedRefusalContract: coordinate(
      "refusal",
      "refusalContract",
      "refusal",
    ),
    expectedNonTerminalContract: coordinate(
      "non_terminal",
      "nonTerminalContract",
      "nonTerminal",
    ),
    correlationRef: "correlation://odd-glc/t041/installed",
    eventTime: "2026-08-24T00:00:01.000Z",
    provenanceRefs: Object.freeze(["provenance://odd-glc/t041-proof"]),
  });
  const invocationDigest = product.sha256Canonical(invocationBody);
  return Object.freeze({
    invocation: Object.freeze({
      ...invocationBody,
      invocationRef:
        `invocation://abiogenesis/${invocationDigest.slice("sha256:".length)}`,
      invocationDigest,
    }),
    resources,
  });
}

function authoritySlots({
  product,
  admittedInstalls,
  workspaceBinding,
  capabilityRefs,
  grants,
  rest = {},
}) {
  return Object.freeze({
    workspace_binding: Object.freeze({
      ref: workspaceBinding.bindingId,
      digest: workspaceBinding.bindingDigest,
    }),
    product_set: Object.freeze(admittedInstalls.map((install) => Object.freeze({
      ref: install.installId,
      digest: install.productContentDigest,
    }))),
    dependency_lock: Object.freeze({
      ref: workspaceBinding.lockId,
      digest: workspaceBinding.lockDigest,
    }),
    catalog_scope: null,
    execution_program: null,
    graph_function: null,
    input_contract: null,
    session_policy: null,
    capability_grants: Object.freeze({
      requiredCapabilityRefs: Object.freeze([...capabilityRefs]),
      grants: Object.freeze(grants.map((grant) => Object.freeze({
        ref: grant.grantRef,
        digest: grant.grantDigest,
      }))),
    }),
    actor: null,
    transport_steering: null,
    verification_references: null,
    execution_basis: null,
    ...rest,
  });
}

async function executeInstalledCli({
  scratch,
  installedRoot,
  packageJson,
  identity,
  call,
  acquisition,
  expectedExitCode,
}) {
  const requestPath = path.join(scratch, `${identity}.jsonl`);
  const cliPath = path.join(installedRoot, packageJson.bin["abg.cli"]);
  await writeFile(requestPath, `${JSON.stringify({
    kind: "abg_cli_transport_request",
    schemaVersion: SCHEMA_VERSION,
    acquisition,
    invocation: call,
  })}\n`);
  let execution;
  try {
    execution = await execFileAsync(
      process.execPath,
      [cliPath, "--jsonl", requestPath],
      { cwd: scratch, env: {}, maxBuffer: 20 * 1024 * 1024 },
    );
    assert.equal(expectedExitCode, 0, `${identity} CLI exit`);
  } catch (error) {
    assert.equal(error.code, expectedExitCode, `${identity} CLI exit`);
    execution = error;
  }
  assert.equal(execution.stderr, "");
  const lines = execution.stdout.trim().split(/\r?\n/u);
  assert.equal(lines.length, 1);
  return Object.freeze({
    outcome: JSON.parse(lines[0]),
    rawJsonLine: lines[0],
  });
}

async function runInstalledCli({
  scratch,
  installedRoot,
  packageJson,
  identity,
  call,
  rawJsonLines,
}) {
  const { outcome, rawJsonLine } = await executeInstalledCli({
    scratch,
    installedRoot,
    packageJson,
    identity,
    call,
    acquisition: Object.freeze({
      kind: "reopen",
      closeHandoff: call.resources.eventResource.closeHandoff,
    }),
    expectedExitCode: 0,
  });
  rawJsonLines.push(rawJsonLine);
  assert.equal(outcome.kind, "installed_definition_call_transport_result");
  assert.equal(outcome.receipt.kind, "definition_host_receipt");
  assert.equal(outcome.receipt.exitCode, 0, JSON.stringify(outcome.receipt));
  assert.equal(outcome.receipt.failure, null);
  return outcome.receipt;
}

async function packOddProduct(scratch) {
  const destination = path.join(scratch, "odd-artifact");
  await mkdir(destination);
  const { stdout, stderr } = await execFileAsync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", destination],
    { cwd: PRODUCT_ROOT, maxBuffer: 20 * 1024 * 1024 },
  );
  assert.equal(stderr, "");
  const [summary] = JSON.parse(stdout);
  assert.deepEqual(summary.files.map((entry) => entry.path).sort(), [
    "build/publication.json",
    "contracts/capabilities/capability-definition-graph.json",
    "contracts/public-contract-catalog.schema.json",
    "package.json",
    "product-toolchain-manifest.json",
  ]);
  const artifactPath = path.join(destination, summary.filename);
  assert.equal(sha256Hex(await readFile(artifactPath)), ODD_TARBALL_SHA256);
  return Object.freeze({
    artifactPath,
    archiveMembers: Object.freeze(summary.files.map((entry) => entry.path).sort()),
  });
}

test("ABI5 executes the installed odd_glc Product through cross-owner Hello", async (t) => {
  const bootstrapRoot = process.env.ODD_GLC_T041_ABI_PACKAGE_ROOT;
  const abiArtifactPath = process.env.ODD_GLC_T041_ABI_TARBALL;
  if (!bootstrapRoot || !abiArtifactPath) {
    t.skip("exact installed ABI dev.286 package and tarball are required");
    return;
  }
  assert.equal(sha256Hex(await readFile(abiArtifactPath)), ABI_TARBALL_SHA256);
  const bootstrap = await loadAbiPublic(bootstrapRoot);
  const bootstrapModuleEvidence = await assertPublicModuleRefsWithinPackage(
    bootstrap,
    bootstrapRoot,
  );
  const scratch = await mkdtemp(path.join(os.tmpdir(), "odd-glc-t041-sunny-"));
  t.after(async () => rm(scratch, { recursive: true, force: true }));
  const nativeStageObservations = [];
  const observeNativeStage = (ownerMethod, evidence) => {
    nativeStageObservations.push(Object.freeze({
      ownerMethod,
      evidence: structuredClone(evidence),
    }));
  };

  const workspaceRoot = path.join(scratch, "workspace");
  const created = await bootstrap.product.WorkspaceOperationPort.create({
    kind: "workspace_create_packet",
    schemaVersion: SCHEMA_VERSION,
    memberKey: "clean",
    targetRoot: workspaceRoot,
    scaffoldPolicy: "none",
  });
  assert.equal(created.disposition, "created", JSON.stringify(created));
  observeNativeStage("./product::WorkspaceOperationPort.create", {
    disposition: created.disposition,
    creationManifestRef: created.creationManifestRef,
    creationManifestDigest: created.creationManifestDigest,
  });
  const opened = await bootstrap.product.WorkspaceOperationPort.open({
    kind: "workspace_open_packet",
    schemaVersion: SCHEMA_VERSION,
    memberKey: "open",
    targetRoot: workspaceRoot,
    expectedWorkspaceAuthorityRef: created.workspaceAuthorityRef,
    expectedWorkspaceAuthorityDigest: created.workspaceAuthorityDigest,
  });
  assert.equal(opened.disposition, "unbound", JSON.stringify(opened));
  observeNativeStage("./product::WorkspaceOperationPort.open", {
    disposition: opened.disposition,
    workspaceRef: opened.workspaceRef,
    workspaceDigest: opened.workspaceDigest,
  });

  const oddPack = await packOddProduct(scratch);
  const oddArtifactPath = oddPack.artifactPath;
  const abiManifest = JSON.parse(
    await readFile(path.join(bootstrapRoot, "product-toolchain-manifest.json"), "utf8"),
  );
  const oddManifest = JSON.parse(
    await readFile(path.join(PRODUCT_ROOT, "product-toolchain-manifest.json"), "utf8"),
  );
  const abiArtifactDigest = `sha256:${ABI_TARBALL_SHA256}`;
  const oddArtifactDigest = `sha256:${ODD_TARBALL_SHA256}`;
  const verifiedAbi = await bootstrap.product.verifyProduct({
    artifactPath: abiArtifactPath,
    artifactRef: path.basename(abiArtifactPath),
    ...verificationIdentity(
      abiManifest,
      abiArtifactDigest,
      bootstrap.product,
    ),
  });
  assert.equal(verifiedAbi.disposition, "verified", JSON.stringify(verifiedAbi));
  const verifiedOdd = await bootstrap.product.verifyProduct({
    artifactPath: oddArtifactPath,
    artifactRef: path.basename(oddArtifactPath),
    ...verificationIdentity(
      oddManifest,
      oddArtifactDigest,
      bootstrap.product,
    ),
  });
  assert.equal(verifiedOdd.disposition, "verified", JSON.stringify(verifiedOdd));
  assert.equal(verifiedAbi.productId, ABI.productId);
  assert.equal(verifiedOdd.productId, ODD.productId);
  observeNativeStage("./product::verifyProduct", {
    dispositions: [verifiedAbi.disposition, verifiedOdd.disposition],
    artifactDigests: [verifiedAbi.artifactDigest, verifiedOdd.artifactDigest],
    productIds: [verifiedAbi.productId, verifiedOdd.productId],
  });

  const verifiedProducts = Object.freeze([verifiedAbi, verifiedOdd]);
  const lock = bootstrap.product.constructResolvedProductLock(verifiedProducts);
  assert.equal(lock.kind, "resolved_product_lock", JSON.stringify(lock));
  assert.equal(lock.rows.length, 2);
  assert.equal(lock.dependencyEdges.length, 1);
  assert.equal(lock.dependencyEdges[0].fromProductId, ODD.productId);
  assert.equal(lock.dependencyEdges[0].toProductId, ABI.productId);
  observeNativeStage("./product::constructResolvedProductLock", {
    lockId: lock.lockId,
    lockDigest: lock.lockDigest,
    rowCount: lock.rows.length,
  });

  const abiConsumerRoot = path.join(scratch, "abi-consumer");
  const oddConsumerRoot = path.join(scratch, "odd-consumer");
  const abiInstall = await bootstrap.product.installProduct({
    artifactPath: abiArtifactPath,
    targetRoot: abiConsumerRoot,
    verifiedArtifact: verifiedAbi,
    resolvedLock: lock,
  });
  assert.equal(abiInstall.disposition, "materialized", JSON.stringify(abiInstall));
  const oddInstall = await bootstrap.product.installProduct({
    artifactPath: oddArtifactPath,
    targetRoot: oddConsumerRoot,
    verifiedArtifact: verifiedOdd,
    resolvedLock: lock,
  });
  assert.equal(oddInstall.disposition, "materialized", JSON.stringify(oddInstall));
  assert.notEqual(abiInstall.installedRoot, oddInstall.installedRoot);
  observeNativeStage("./product::installProduct", {
    installIds: [abiInstall.installId, oddInstall.installId],
    installedRoots: [abiInstall.installedRoot, oddInstall.installedRoot],
  });

  const installed = await loadAbiPublic(abiInstall.installedRoot);
  const { product, abg, gtl, validator, public: installedPublic } = installed;
  const executionModuleEvidence = await assertPublicModuleRefsWithinPackage(
    installed,
    abiInstall.installedRoot,
  );
  assert.equal(await product.installedProductContentMatches(abiInstall), true);
  assert.equal(await product.installedProductContentMatches(oddInstall), true);

  const family = installedPublic.PUBLIC_FUNCTION_DEFINITION_FAMILY.definitions;
  assert.equal(family.length, 56);
  assert.equal(new Set(family.map(({ definitionKey }) =>
    definitionKey.operationId)).size, 18);
  const ownerModules = Object.freeze({
    "./product": product,
    "./abg": abg,
    "./validator": validator,
  });
  for (const [operationId, memberKey] of CONSUMED_DEFINITION_KEYS) {
    const definition = definitionFor(installedPublic, operationId, memberKey);
    const locator = definition.executionBindingSpecification.callable;
    let callable = ownerModules[locator.packageExportPath]?.[locator.namedExport];
    for (const member of locator.memberPath) callable = callable?.[member];
    assert.equal(
      typeof callable,
      "function",
      `${operationId}#${memberKey}`,
    );
  }

  const acquired = abg.createNewEmptyAppendSink({
    kind: "new_empty_append_sink_request",
    schemaVersion: SCHEMA_VERSION,
    eventLogPath: path.join(scratch, "runtime", "events.jsonl"),
  });
  assert.ok(acquired.store);
  let openStore = acquired.store;
  t.after(() => openStore?.closeDurableLog());
  const installs = [abiInstall, oddInstall];
  let prefix = acquired.prefix;
  const admittedInstalls = [];
  let abiOnlyArtifactTruth = null;
  for (const [index, candidate] of installs.entries()) {
    const admission = abg.admitProductInstall(
      openStore,
      candidate,
      {
        ...publicOperationBasis(
          product,
          "abg.operation.product.install",
          "install",
          candidate.installId,
          candidate.productContentDigest,
          `invocation://odd-glc/t041/install-${index}`,
        ),
        predecessorPrefix: prefix,
      },
      lock,
    );
    assert.equal(admission.kind, "artifact_owner_result", JSON.stringify(admission));
    admittedInstalls.push(admission.value);
    if (index === 0) abiOnlyArtifactTruth = admission.artifactTruth;
    prefix = admission.successorPrefix;
  }
  assert.ok(abiOnlyArtifactTruth);
  const productSet = product.constructProductSet(admittedInstalls, lock);
  assert.equal(productSet.kind, "product_set", JSON.stringify(productSet));
  const canonicalWorkspaceRoot = await realpath(workspaceRoot);
  const authorityManifest = {
    workspaceId: "workspace://odd-glc/t041/sunny",
    canonicalRoot: canonicalWorkspaceRoot,
    authorityMode: "trusted_developer",
    authorizedActorRef: "actor://odd-glc/t041/trusted-developer",
  };
  const workspaceAuthority = product.constructWorkspaceAuthorityBasis({
    ...authorityManifest,
    authorityManifestRef: "manifest://odd-glc/t041/workspace-authority",
    authorityManifestDigest: product.sha256Canonical(authorityManifest),
  });
  assert.equal(workspaceAuthority.kind, "workspace_authority_basis");
  const bindingCandidate = product.constructWorkspaceBinding(
    workspaceAuthority,
    productSet,
    lock,
    {
      toolchainRoot: abiConsumerRoot,
      productRoot: oddInstall.installedRoot,
      eventLogRoot: path.join(workspaceRoot, ".ai-workspace/events"),
      runtimeStateRoot: path.join(workspaceRoot, ".ai-workspace/runtime"),
      projectionRoot: path.join(workspaceRoot, ".ai-workspace/projections"),
      archiveRoot: path.join(workspaceRoot, ".ai-workspace/archive"),
    },
  );
  assert.equal(bindingCandidate.kind, "workspace_binding_candidate");
  const bindingAdmission = abg.admitWorkspaceBinding(
    openStore,
    bindingCandidate,
    {
      ...publicOperationBasis(
        product,
        "abg.operation.workspace.bind",
        "bind",
        bindingCandidate.bindingId,
        bindingCandidate.bindingDigest,
        "invocation://odd-glc/t041/workspace-bind",
        admittedInstalls.map((install) => install.admissionEventRef),
      ),
      predecessorPrefix: prefix,
    },
    workspaceAuthority,
  );
  assert.equal(
    bindingAdmission.kind,
    "artifact_owner_result",
    JSON.stringify(bindingAdmission),
  );
  const workspaceBinding = bindingAdmission.value;
  const artifactTruth = bindingAdmission.artifactTruth;
  assert.equal(abg.hasAdmittedWorkspaceBinding(artifactTruth, workspaceBinding), true);
  assert.equal(
    admittedInstalls.every((install) =>
      abg.hasAdmittedProductInstall(artifactTruth, install)),
    true,
  );
  observeNativeStage("./abg::admitWorkspaceBinding", {
    bindingId: workspaceBinding.bindingId,
    bindingDigest: workspaceBinding.bindingDigest,
    admissionEventRef: workspaceBinding.admissionEventRef,
  });

  const abiPublication = gtl.constructHelloWorldModulePublication({
    productId: verifiedAbi.productId,
    artifactDigest: verifiedAbi.artifactDigest,
    productContentDigest: verifiedAbi.productContentDigest,
    productManifestDigest: verifiedAbi.manifestDigest,
    packageName: verifiedAbi.packageName,
    packageVersion: verifiedAbi.packageVersion,
  });
  const oddData = await loadOddPublicationData(oddInstall.installedRoot);
  const oddPublication = gtl.modulePublication({
    kind: "module_publication",
    moduleVersion: SCHEMA_VERSION,
    ...oddData,
    artifactDigest: verifiedOdd.artifactDigest,
    productContentDigest: verifiedOdd.productContentDigest,
    productManifestDigest: verifiedOdd.manifestDigest,
    contributions: oddData.contributions.map((contribution) => ({
      ...contribution,
      provenanceRefs: [verifiedOdd.artifactDigest, verifiedOdd.manifestDigest],
    })),
  });
  const publications = [abiPublication, oddPublication];
  for (const publication of publications) {
    const publicationAdmission = requireRawAdmission(
      validator,
      publication,
      "module_publication",
      "contract://abiogenesis/gtl/module-publication@5",
    );
    const contributionAdmissions = publication.contributions.map((value) =>
      requireRawAdmission(
        validator,
        value,
        "catalog_contribution",
        "contract://abiogenesis/gtl/catalog-contribution@5",
      )
    );
    assert.equal(
      validator.validatePublication(
        publicationAdmission,
        contributionAdmissions,
      ).kind,
      "publication_validation",
    );
  }
  const abiPublicationAdmission = requireRawAdmission(
    validator,
    abiPublication,
    "module_publication",
    "contract://abiogenesis/gtl/module-publication@5",
  );
  const abiProgramRefs = new Set([
    gtl.HELLO_WORLD_IDS.programRef,
    gtl.HELLO_WORLD_DIRECT_IDS.programRef,
  ]);
  const abiPrograms = abiPublication.programs.filter((program) =>
    abiProgramRefs.has(program.programRef));
  assert.equal(abiPrograms.length, 2);
  for (const program of abiPrograms) {
    assert.equal(
      validator.validateProgram(
        rawProgramInput(validator, abiPublicationAdmission, program),
      ).kind,
      "program_validation",
    );
  }
  const catalog = product.admitGraphFunctionCatalog({
    workspaceBinding: bindingCandidate,
    resolvedLock: lock,
    verifiedProducts,
    installedProducts: installs,
    publications,
  });
  assert.equal(catalog.kind, "graph_function_catalog", JSON.stringify(catalog));
  assert.equal(
    catalog.rowDispositions.find((row) => row.handle === ODD.graphFunctionRef)
      ?.disposition,
    "admitted",
  );
  observeNativeStage("./product::admitGraphFunctionCatalog", {
    basisDigest: catalog.basisDigest,
    oddDisposition: catalog.rowDispositions.find(
      (row) => row.handle === ODD.graphFunctionRef,
    ).disposition,
  });
  const catalogView = product.narrowGraphFunctionCatalog(
    catalog,
    [ODD.graphFunctionRef],
  );
  assert.equal(catalogView.kind, "graph_function_catalog_view");
  assert.deepEqual(catalogView.allowlist, [ODD.graphFunctionRef]);
  assert.equal(catalogView.entries.length, 1);
  observeNativeStage("./product::narrowGraphFunctionCatalog", {
    viewDigest: catalogView.viewDigest,
    allowlist: catalogView.allowlist,
  });

  const sunnySelection = Object.freeze({
    kind: "start",
    scope: "program",
    target: "next",
    until: "converged",
    rootMode: "direct",
  });
  const resolution = await product.ProductExecutionResolutionPort.resolve({
    catalog,
    catalogView,
    admittedInstalls,
    verifyInstallAdmission: (install) =>
      abg.hasAdmittedProductInstall(artifactTruth, install),
    programRef: ODD.programRef,
    selection: sunnySelection,
  });
  assert.equal(
    resolution.kind,
    "loaded_product_execution_resolution",
    JSON.stringify(resolution),
  );
  assert.equal(resolution.resolution.programOwner.productId, ODD.productId);
  assert.equal(resolution.resolution.graphFunctionOwner.productId, ODD.productId);
  assert.equal(resolution.declarationClosure.semanticsOwner.productId, ABI.productId);
  assert.equal(
    resolution.implementationSetCandidate.rows[0].implementationOwnerProductId,
    ABI.productId,
  );
  assert.equal(
    resolution.implementationSetCandidate.rows[0].graphFunctionOwnerProductId,
    ODD.productId,
  );
  assert.equal(resolution.implementationSetCandidate.rows[0].computeRegime, "F_D");
  const absentSelection = await product.ProductExecutionResolutionPort.resolve({
    catalog,
    catalogView,
    admittedInstalls,
    verifyInstallAdmission: (install) =>
      abg.hasAdmittedProductInstall(artifactTruth, install),
    programRef: ODD.programRef,
    selection: Object.freeze({
      kind: "direct",
      catalogHandle:
        "graph-function://odd_glc/conformance/absent-selection@5",
    }),
  });
  assert.equal(absentSelection.kind, "product_execution_resolution_refusal");
  assert.equal(absentSelection.code, "absent");
  assert.equal(absentSelection.stage, "catalog");
  const unprovedDependency =
    await product.ProductExecutionResolutionPort.resolve({
      catalog,
      catalogView,
      admittedInstalls,
      verifyInstallAdmission: (install) =>
        abg.hasAdmittedProductInstall(abiOnlyArtifactTruth, install),
      programRef: ODD.programRef,
      selection: sunnySelection,
    });
  assert.equal(
    unprovedDependency.kind,
    "product_execution_resolution_refusal",
  );
  assert.equal(unprovedDependency.code, "incompatible_or_unproven");
  assert.equal(unprovedDependency.stage, "dependency");
  const resolutionBoundaryObservations = Object.freeze([
    Object.freeze({
      identity: "absent_selected_graph_function",
      code: absentSelection.code,
      stage: absentSelection.stage,
    }),
    Object.freeze({
      identity: "install_unproved_at_authentic_earlier_abg_truth",
      code: unprovedDependency.code,
      stage: unprovedDependency.stage,
    }),
  ]);

  const input = gtl.constructHelloWorldInput("World");
  assert.deepEqual(input, {
    kind: "hello_world_input",
    schemaVersion: SCHEMA_VERSION,
    subject: "World",
  });
  assert.ok(product.admitInstalledProductInput(
    resolution.productSemantics,
    resolution.resolution.inputContract.contractRef,
    input,
  ));
  const contractBoundInput = Object.freeze({
    contract: Object.freeze({
      ref: resolution.resolution.inputContract.contractRef,
      digest: resolution.resolution.inputContractDigest,
    }),
    valueRef: "value://odd-glc/t041/hello-input",
    valueDigest: product.sha256Canonical(input),
    value: input,
  });
  const declaredRegimes = new Set([
    ...resolution.programValidation.executableLeafRows.map((row) => row.fibre),
    ...resolution.programValidation.interactionLeafRows.map((row) => row.fibre),
  ]);
  const policy = product.constructRootInvocationPolicy(
    workspaceBinding,
    resolution.program,
    resolution.programValidation.interactionLeafRows.map((row) => ({
      requirementKey: row.requirementKey,
      requirementKeyDigest: row.requirementKeyDigest,
      actorCapabilityRef: row.requirement.actorCapabilityRef,
    })),
    ["F_D", "F_P", "F_H"].filter((regime) => declaredRegimes.has(regime)),
    [],
  );
  const startPacket = product.RUN_OPERATION_CONTRACTS.invoke.start;
  const grantBasis = Object.freeze({
    admittedInstalls,
    workspaceBinding,
    fixedPacket: startPacket,
  });
  const startGrant = product.constructCapabilityGrant(
    policy,
    workspaceBinding.authorizedActorRef,
    "abg.operation.run.invoke",
    product.DIRECT_INVOKE_CAPABILITY,
    grantBasis,
  );
  const selectedEntry = resolution.selectedCatalogEntry;
  const invocationAuthority = product.constructInvocationAuthority(
    workspaceBinding.authorizedActorRef,
    workspaceBinding,
    catalogView,
    resolution.program.programRef,
    selectedEntry,
    policy,
    [startGrant],
    grantBasis,
  );
  const programCoordinate = Object.freeze({
    ref: resolution.resolution.programRef,
    digest: resolution.resolution.programDigest,
  });
  const viewCoordinate = Object.freeze({
    ref:
      `graph-function-catalog-view://abiogenesis/${catalogView.viewDigest.slice("sha256:".length)}`,
    digest: catalogView.viewDigest,
  });
  const startRequest = Object.freeze({
    program: programCoordinate,
    scope: "program",
    target: Object.freeze({ kind: "next" }),
    until: "converged",
    catalogView: viewCoordinate,
    allowlist: Object.freeze([...catalogView.allowlist]),
    input: contractBoundInput,
    fhMode: "direct",
    rootMode: "direct",
    sourceBasis: Object.freeze({ kind: "none" }),
  });
  const setupHandoff = openStore.projectReopenAuthorityAndClose();
  openStore = null;
  const startEventResource = Object.freeze({
    kind: "reopen_abg_event_resource",
    schemaVersion: SCHEMA_VERSION,
    closeHandoff: setupHandoff,
    handoffDigest: product.sha256Canonical(setupHandoff),
  });
  const startSlots = authoritySlots({
    product,
    admittedInstalls,
    workspaceBinding,
    capabilityRefs: startPacket.metadata.capabilityRefs,
    grants: [startGrant],
    rest: {
      catalog_scope: Object.freeze({
        catalog: Object.freeze({
          ref:
            `graph-function-catalog://abiogenesis/${catalog.basisDigest.slice("sha256:".length)}`,
          digest: catalog.basisDigest,
        }),
        view: viewCoordinate,
        allowlist: startRequest.allowlist,
      }),
      execution_program: programCoordinate,
      input_contract: contractBoundInput,
      session_policy: Object.freeze({
        ref: policy.policyRef,
        digest: policy.policyDigest,
      }),
      actor: Object.freeze({
        actor: Object.freeze({
          ref: workspaceBinding.authorizedActorRef,
          digest: product.sha256Canonical({
            actorRef: workspaceBinding.authorizedActorRef,
          }),
        }),
        attribution: Object.freeze({
          ref: invocationAuthority.authorityRef,
          digest: invocationAuthority.authorityDigest,
        }),
      }),
      transport_steering: Object.freeze({
        ref: `transport-steering://abiogenesis/${product.sha256Canonical(startEventResource).slice("sha256:".length)}`,
        digest: product.sha256Canonical(startEventResource),
      }),
    },
  });
  const startContractCatalog = exact(
    verifiedAbi.definitionContractCoordinates.operations,
    (candidate) => candidate.operationId === "abg.operation.run.invoke",
    "run.invoke coordinates",
  ).members.find((candidate) => candidate.memberKey === "start")
    .slots.request.contractCatalog;
  const startCall = definitionCall({
    product,
    installedPublic,
    coordinates: verifiedAbi.definitionContractCoordinates,
    contractCatalog: startContractCatalog,
    operationId: "abg.operation.run.invoke",
    memberKey: "start",
    request: startRequest,
    slots: startSlots,
    resources: Object.freeze({
      kind: "run_invocation_resource_assertion",
      schemaVersion: SCHEMA_VERSION,
      eventResource: startEventResource,
      catalog,
      catalogView,
      applications: Object.freeze([]),
      source: Object.freeze({ kind: "none" }),
    }),
    requestRef: "public-request://odd-glc/t041/run-start",
  });
  const transportJsonLines = [];
  const startReceipt = await runInstalledCli({
    scratch,
    installedRoot: abiInstall.installedRoot,
    packageJson: installed.packageJson,
    identity: "start",
    call: startCall,
    rawJsonLines: transportJsonLines,
  });
  assert.equal(startReceipt.ownerOutput.outcomeKind, "result");
  assert.equal(startReceipt.ownerOutput.value.disposition, "completed");
  assert.equal(
    startReceipt.resources.productExecutionResolution.ref,
    resolution.resolution.resolutionRef,
  );
  const terminalHandoff = startReceipt.resources.eventResource.closeHandoff;
  const terminalPrefix = terminalHandoff.prefix;
  const terminalRun = startReceipt.resources.run;
  const terminalReplay = startReceipt.resources.replay;
  const terminalBytes = await readFile(new URL(terminalPrefix.eventLogRef));
  const events = abg.readRuntimeEventsAtDurablePrefix(terminalPrefix);
  const invocationAdmissions = events.filter((event) =>
    event.kind === "invocation_admitted" &&
    event.payload.programRef === ODD.programRef
  );
  assert.equal(invocationAdmissions.length, 1);
  const implementationAdmission = exact(
    events,
    (event) => event.kind === "implementation_admitted",
    "implementation admission",
  );
  assert.equal(
    implementationAdmission.payload.implementationSet.rows[0]
      .implementationOwnerProductId,
    ABI.productId,
  );
  const resultAdmissions = events.filter(
    (event) => event.kind === "c_call_result_admitted",
  );
  assert.equal(resultAdmissions.length, 1);
  const [admittedResult] = resultAdmissions;
  assert.deepEqual(admittedResult.payload.value, {
    kind: "hello_world_output",
    schemaVersion: SCHEMA_VERSION,
    message: "Hello World",
  });
  const runClosedEvents = events.filter((event) => event.kind === "run_closed");
  assert.equal(runClosedEvents.length, 1);

  const readRows = Object.freeze([
    ["run_status", Object.freeze({ kind: "none" })],
    ["run_result", Object.freeze({ kind: "none" })],
    ["run_replay", Object.freeze({
      kind: "ordinal_page",
      fromOrdinal: 0,
      limit: 1024,
    })],
  ]);
  const readReceipts = [];
  const readCalls = [];
  let readHandoff = terminalHandoff;
  for (const [memberKey, selector] of readRows) {
    const definition = definitionFor(
      installedPublic,
      "abg.operation.project.read",
      memberKey,
    );
    const packet = ownerPacketProjection(definition);
    const grantBasis = Object.freeze({
      admittedInstalls,
      workspaceBinding,
      fixedPacket: packet,
    });
    const grants = packet.metadata.capabilityRefs.map((capabilityRef) =>
      product.constructCapabilityGrant(
        workspaceAuthority,
        workspaceBinding.authorizedActorRef,
        "abg.operation.project.read",
        capabilityRef,
        grantBasis,
      )
    );
    const eventResource = Object.freeze({
      kind: "reopen_abg_event_resource",
      schemaVersion: SCHEMA_VERSION,
      closeHandoff: readHandoff,
      handoffDigest: product.sha256Canonical(readHandoff),
    });
    const request = Object.freeze({
      caseKey: memberKey,
      source: Object.freeze({
        sourceKind: "run",
        sourceRef: terminalRun.ref,
        sourceDigest: terminalRun.digest,
      }),
      projectionBasis: Object.freeze({
        projectionBasisRef: terminalPrefix.eventLogRef,
        projectionBasisDigest: terminalPrefix.coordinateDigest,
      }),
      selector,
    });
    const contractCatalog = exact(
      verifiedAbi.definitionContractCoordinates.operations,
      (candidate) => candidate.operationId === "abg.operation.project.read",
      "project.read coordinates",
    ).members.find((candidate) => candidate.memberKey === memberKey)
      .slots.request.contractCatalog;
    const call = definitionCall({
      product,
      installedPublic,
      coordinates: verifiedAbi.definitionContractCoordinates,
      contractCatalog,
      operationId: "abg.operation.project.read",
      memberKey,
      request,
      slots: authoritySlots({
        product,
        admittedInstalls,
        workspaceBinding,
        capabilityRefs: packet.metadata.capabilityRefs,
        grants,
      }),
      resources: Object.freeze({
        kind: "abg_project_read_resource_assertion",
        schemaVersion: SCHEMA_VERSION,
        eventResource,
      }),
      requestRef: `public-request://odd-glc/t041/${memberKey}`,
    });
    readCalls.push(call);
    const receipt = await runInstalledCli({
      scratch,
      installedRoot: abiInstall.installedRoot,
      packageJson: installed.packageJson,
      identity: memberKey,
      call,
      rawJsonLines: transportJsonLines,
    });
    assert.equal(receipt.ownerOutput.outcomeKind, "result", memberKey);
    assert.equal(receipt.ownerOutput.value.caseKey, memberKey);
    assert.deepEqual(receipt.ownerOutput.value.source, terminalRun);
    assert.deepEqual(
      receipt.resources.eventResource.entryPrefix,
      terminalPrefix,
    );
    assert.deepEqual(
      receipt.resources.eventResource.closeHandoff.prefix,
      terminalPrefix,
    );
    assert.deepEqual(
      await readFile(new URL(terminalPrefix.eventLogRef)),
      terminalBytes,
    );
    readReceipts.push(receipt);
    readHandoff = receipt.resources.eventResource.closeHandoff;
  }
  const [statusReceipt, resultReceipt, replayReceipt] = readReceipts;
  assert.equal(statusReceipt.ownerOutput.value.projection.status, "closed");
  assert.deepEqual(
    resultReceipt.ownerOutput.value.projection.result,
    startReceipt.ownerOutput.value.result,
  );
  assert.deepEqual(
    replayReceipt.ownerOutput.value.projection.replay,
    terminalReplay,
  );
  const replayedTruth = abg.projectRunTruthAtDurablePrefix(
    terminalPrefix,
    terminalRun.ref,
  );
  assert.equal(replayedTruth.kind, "abg_run_truth_projection");
  assert.equal(replayedTruth.runtimeStatus, "closed");
  assert.deepEqual(replayedTruth.result, startReceipt.ownerOutput.value.result);
  assert.deepEqual(replayedTruth.replay, terminalReplay);

  const freshRequestPath = path.join(scratch, "fresh-read-request.json");
  await writeFile(freshRequestPath, JSON.stringify({
    consumerRoot: installed.consumerRoot,
    installedRoot: abiInstall.installedRoot,
    calls: readCalls,
  }));
  const { stdout: freshStdout, stderr: freshStderr } = await execFileAsync(
    process.execPath,
    [FRESH_READ_WORKER, freshRequestPath],
    { cwd: scratch, env: {}, maxBuffer: 20 * 1024 * 1024 },
  );
  assert.equal(freshStderr, "");
  const fresh = JSON.parse(freshStdout);
  assert.equal(fresh.kind, "odd_glc_abi5_fresh_process_read_result");
  assert.notEqual(fresh.processId, process.pid);
  assert.equal(fresh.publicModuleRef, installed.publicModuleRefs.public);
  assert.equal(fresh.receipts.length, 3);
  for (const [index, receipt] of fresh.receipts.entries()) {
    assert.deepEqual(receipt.ownerOutput, readReceipts[index].ownerOutput);
    assert.deepEqual(receipt.resources, readReceipts[index].resources);
  }
  assert.deepEqual(
    await readFile(new URL(terminalPrefix.eventLogRef)),
    terminalBytes,
  );
  const statusCall = readCalls[0];
  const withEventResource = (call, eventResource) => Object.freeze({
    invocation: call.invocation,
    resources: Object.freeze({
      ...call.resources,
      eventResource,
    }),
  });
  const crossedAcquisition = await executeInstalledCli({
    scratch,
    installedRoot: abiInstall.installedRoot,
    packageJson: installed.packageJson,
    identity: "negative-crossed-acquisition",
    call: statusCall,
    acquisition: Object.freeze({
      kind: "reopen",
      closeHandoff: setupHandoff,
    }),
    expectedExitCode: 2,
  });
  assert.equal(
    crossedAcquisition.outcome.kind,
    "installed_definition_call_transport_refusal",
  );
  assert.equal(crossedAcquisition.outcome.code, "acquisition_mismatch");
  assert.equal(Object.hasOwn(crossedAcquisition.outcome, "receipt"), false);

  const staleEventResource = Object.freeze({
    ...statusCall.resources.eventResource,
    closeHandoff: setupHandoff,
    handoffDigest: product.sha256Canonical(setupHandoff),
  });
  const staleResource = await executeInstalledCli({
    scratch,
    installedRoot: abiInstall.installedRoot,
    packageJson: installed.packageJson,
    identity: "negative-stale-owner-handoff",
    call: withEventResource(statusCall, staleEventResource),
    acquisition: Object.freeze({
      kind: "reopen",
      closeHandoff: setupHandoff,
    }),
    expectedExitCode: 70,
  });
  assert.equal(
    staleResource.outcome.kind,
    "installed_definition_call_transport_result",
  );
  assert.equal(staleResource.outcome.receipt.exitCode, 70);
  assert.equal(staleResource.outcome.receipt.ownerOutput, null);
  assert.equal(staleResource.outcome.receipt.resources, null);
  assert.equal(
    staleResource.outcome.receipt.failure.fault.stage,
    "resource_acquisition",
  );
  assert.equal(
    staleResource.outcome.receipt.failure.fault.code,
    "acquisition_refused",
  );

  const malformedEventResource = Object.freeze({
    ...statusCall.resources.eventResource,
    unadmittedAssertionMember: true,
  });
  const malformedResource = await executeInstalledCli({
    scratch,
    installedRoot: abiInstall.installedRoot,
    packageJson: installed.packageJson,
    identity: "negative-malformed-resource-assertion",
    call: withEventResource(statusCall, malformedEventResource),
    acquisition: Object.freeze({
      kind: "reopen",
      closeHandoff: terminalHandoff,
    }),
    expectedExitCode: 70,
  });
  assert.equal(
    malformedResource.outcome.kind,
    "installed_definition_call_transport_result",
  );
  assert.equal(malformedResource.outcome.receipt.exitCode, 70);
  assert.equal(
    malformedResource.outcome.receipt.failure.fault.stage,
    "resource_admission",
  );
  assert.equal(
    malformedResource.outcome.receipt.failure.fault.code,
    "invalid_resource_assertion",
  );

  const staleProjectionRequest = Object.freeze({
    ...statusCall.invocation.request,
    projectionBasis: Object.freeze({
      projectionBasisRef: setupHandoff.prefix.eventLogRef,
      projectionBasisDigest: setupHandoff.prefix.coordinateDigest,
    }),
  });
  const staleProjectionCall = definitionCall({
    product,
    installedPublic,
    coordinates: verifiedAbi.definitionContractCoordinates,
    contractCatalog: statusCall.invocation.contractCatalog,
    operationId: "abg.operation.project.read",
    memberKey: "run_status",
    request: staleProjectionRequest,
    slots: statusCall.invocation.invocationAuthority.slots,
    resources: statusCall.resources,
    requestRef: "public-request://odd-glc/t041/stale-projection-basis",
  });
  const staleProjection = await executeInstalledCli({
    scratch,
    installedRoot: abiInstall.installedRoot,
    packageJson: installed.packageJson,
    identity: "negative-stale-projection-basis",
    call: staleProjectionCall,
    acquisition: Object.freeze({
      kind: "reopen",
      closeHandoff: terminalHandoff,
    }),
    expectedExitCode: 1,
  });
  assert.equal(
    staleProjection.outcome.kind,
    "installed_definition_call_transport_result",
  );
  assert.equal(staleProjection.outcome.receipt.exitCode, 1);
  assert.equal(staleProjection.outcome.receipt.failure, null);
  assert.equal(
    staleProjection.outcome.receipt.ownerOutput.outcomeKind,
    "refusal",
  );
  assert.equal(
    staleProjection.outcome.receipt.ownerOutput.value.code,
    "projection_basis_mismatch",
  );
  assert.deepEqual(
    await readFile(new URL(terminalPrefix.eventLogRef)),
    terminalBytes,
  );
  const transportBoundaryObservations = Object.freeze([
    Object.freeze({
      identity: "crossed_top_level_and_embedded_handoff",
      transportCode: crossedAcquisition.outcome.code,
      receipt: false,
      rawJsonLine: crossedAcquisition.rawJsonLine,
    }),
    Object.freeze({
      identity: "matching_stale_owner_issued_handoff",
      exitCode: staleResource.outcome.receipt.exitCode,
      faultStage: staleResource.outcome.receipt.failure.fault.stage,
      faultCode: staleResource.outcome.receipt.failure.fault.code,
      rawJsonLine: staleResource.rawJsonLine,
    }),
    Object.freeze({
      identity: "malformed_resource_assertion",
      exitCode: malformedResource.outcome.receipt.exitCode,
      faultStage: malformedResource.outcome.receipt.failure.fault.stage,
      faultCode: malformedResource.outcome.receipt.failure.fault.code,
      rawJsonLine: malformedResource.rawJsonLine,
    }),
    Object.freeze({
      identity: "stale_projection_basis",
      exitCode: staleProjection.outcome.receipt.exitCode,
      refusalCode: staleProjection.outcome.receipt.ownerOutput.value.code,
      rawJsonLine: staleProjection.rawJsonLine,
    }),
  ]);
  const transportedDefinitionKeys = [startReceipt, ...readReceipts].map(
    (receipt) => structuredClone(receipt.definitionKey),
  );
  assert.equal(nativeStageObservations.length, 8);
  assert.equal(transportedDefinitionKeys.length, 4);
  assert.deepEqual(
    nativeStageObservations.map(({ ownerMethod }) => ownerMethod),
    EXPECTED_NATIVE_OWNER_METHODS,
  );
  assert.deepEqual(
    transportedDefinitionKeys,
    EXPECTED_TRANSPORTED_DEFINITION_KEYS,
  );
  assert.equal(transportJsonLines.length, 4);
  const rawObservation = Object.freeze({
    kind: "odd_glc_abi5_installed_raw_observation",
    schemaVersion: "1",
    basis: Object.freeze({
      abiPackage: `${ABI.packageName}@${ABI.packageVersion}`,
      abiProductId: ABI.productId,
      abiTarballSha256: ABI_TARBALL_SHA256,
      oddPackage: `${ODD.packageName}@${ODD.packageVersion}`,
      oddProductId: ODD.productId,
      oddTarballSha256: ODD_TARBALL_SHA256,
    }),
    archive: Object.freeze({
      members: oddPack.archiveMembers,
      executableOrDeclarationMemberCount: oddPack.archiveMembers.filter(
        (member) => /\.(?:[cm]?js|d\.[cm]?ts)$/u.test(member),
      ).length,
    }),
    installedPublicModuleRefs: Object.freeze({
      bootstrap: structuredClone(bootstrap.publicModuleRefs),
      execution: structuredClone(installed.publicModuleRefs),
    }),
    installedPublicModuleEvidence: Object.freeze({
      bootstrap: structuredClone(bootstrapModuleEvidence),
      execution: structuredClone(executionModuleEvidence),
    }),
    publicFamily: Object.freeze({
      operationCount: new Set(family.map(({ definitionKey }) =>
        definitionKey.operationId)).size,
      definitionCount: family.length,
      consumedDefinitionKeys: CONSUMED_DEFINITION_KEYS.map(
        ([operationId, memberKey]) => Object.freeze({ operationId, memberKey }),
      ),
      callableQualificationScope: "consumed_12_only",
      unconsumedCallableClosure: "not_claimed",
    }),
    ownership: Object.freeze({
      programRef: resolution.resolution.programRef,
      graphFunctionRef: resolution.resolution.graphFunctionRef,
      programOwnerProductId: resolution.resolution.programOwner.productId,
      graphFunctionOwnerProductId:
        resolution.resolution.graphFunctionOwner.productId,
      semanticsOwnerProductId:
        resolution.declarationClosure.semanticsOwner.productId,
      implementationOwnerProductId:
        resolution.implementationSetCandidate.rows[0].implementationOwnerProductId,
    }),
    nativeOwnerStageObservations: structuredClone(nativeStageObservations),
    transportedDefinitionKeys: structuredClone(transportedDefinitionKeys),
    transportedJsonLines: Object.freeze([...transportJsonLines]),
    resolutionBoundaryObservations:
      structuredClone(resolutionBoundaryObservations),
    transportBoundaryObservations:
      structuredClone(transportBoundaryObservations),
    freshProcessStdout: freshStdout,
    runtimeEventLog: Object.freeze({
      eventLogRef: terminalPrefix.eventLogRef,
      byteLength: terminalBytes.length,
      sha256: `sha256:${sha256Hex(terminalBytes)}`,
      jsonl: terminalBytes.toString("utf8"),
    }),
    authenticatedRuntimeObservation: Object.freeze({
      semanticStartCount: invocationAdmissions.length,
      terminalResultCount: resultAdmissions.length,
      runClosedCount: runClosedEvents.length,
      admittedResult: structuredClone(admittedResult.payload.value),
      terminalRun: structuredClone(terminalRun),
      terminalReplay: structuredClone(terminalReplay),
      terminalPrefix: structuredClone(terminalPrefix),
      readTimeAppendedBytes: 0,
    }),
  });
  const rawReceiptPath = process.env.ODD_GLC_T041_RAW_RECEIPT_PATH;
  if (rawReceiptPath) {
    assert.equal(path.isAbsolute(rawReceiptPath), true);
    await writeFile(rawReceiptPath, `${JSON.stringify(rawObservation)}\n`, {
      flag: "wx",
    });
  }
  t.diagnostic(JSON.stringify({
    abiArtifactDigest,
    oddArtifactDigest,
    program: resolution.resolution.programRef,
    graphFunction: resolution.resolution.graphFunctionRef,
    programOwner: resolution.resolution.programOwner.productId,
    graphFunctionOwner: resolution.resolution.graphFunctionOwner.productId,
    semanticsOwner: resolution.declarationClosure.semanticsOwner.productId,
    implementationOwner:
      resolution.implementationSetCandidate.rows[0].implementationOwnerProductId,
    run: terminalRun,
    replay: terminalReplay,
    result: admittedResult.payload.value,
    terminalPrefix,
    startCount: invocationAdmissions.length,
    freshReadCount: fresh.receipts.length,
    readTimeAppendedBytes: 0,
    nativeStageObservations,
    transportedDefinitionKeys,
    resolutionBoundaryObservations,
    transportBoundaryObservations: transportBoundaryObservations.map(
      ({ rawJsonLine: _rawJsonLine, ...observation }) => observation,
    ),
  }));
});
