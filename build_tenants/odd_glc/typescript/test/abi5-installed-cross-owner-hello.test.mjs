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
const SOURCE_ROOT = path.resolve(TEST_ROOT, "../../../..");
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
const ABI_PUBLIC_SUBPATHS = Object.freeze([
  Object.freeze({ key: "root", packageExportPath: ".", specifier: ABI.packageName }),
  ...["abg", "gtl", "hog", "product", "public", "validator"].map(
    (key) => Object.freeze({
      key,
      packageExportPath: `./${key}`,
      specifier: `${ABI.packageName}/${key}`,
    }),
  ),
]);
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
const ABSENT_PUBLIC_CALLABLE_KEYS = Object.freeze([
  "abg.operation.interaction.respond#answer_escalation",
  "abg.operation.interaction.respond#approve",
  "abg.operation.interaction.respond#assess",
  "abg.operation.interaction.respond#reject",
  "abg.operation.interaction.respond#select",
  "abg.operation.product.materialize#configuration",
  "abg.operation.product.materialize#context_bootstrap",
  "abg.operation.project.read#release_evidence",
  "abg.operation.result.assess#assess",
  "abg.operation.run.continue#current_intent",
  "abg.operation.run.continue#selected_action",
  "abg.operation.witness.admit#attest",
  "abg.operation.witness.admit#hygiene-stamp",
  "abg.operation.witness.admit#intake",
  "abg.operation.witness.admit#reprice",
  "abg.operation.witness.admit#run-resumed",
  "abg.operation.witness.admit#run-stopped",
]);
const EXACT_PRODUCT_FILES = Object.freeze([
  "build/publication.json",
  "contracts/capabilities/capability-definition-graph.json",
  "contracts/public-contract-catalog.schema.json",
  "package.json",
  "product-toolchain-manifest.json",
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

function parseExactJsonlRecord(bytes, label) {
  assert.equal(Buffer.isBuffer(bytes), true, `${label} bytes`);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.equal(text.endsWith("\n"), true, `${label} newline terminator`);
  const line = text.slice(0, -1);
  assert.notEqual(line.length, 0, `${label} nonempty record`);
  assert.equal(/[\r\n]/u.test(line), false, `${label} single record`);
  const value = JSON.parse(line);
  assert.equal(text, `${JSON.stringify(value)}\n`, `${label} exact JSONL`);
  return Object.freeze({ line, value });
}

const MODULE_GRAPH_PARSER_SOURCE = [
  "import { createHash } from 'node:crypto';",
  "import { readFile, realpath } from 'node:fs/promises';",
  "import path from 'node:path';",
  "import vm from 'node:vm';",
  "import { fileURLToPath, pathToFileURL } from 'node:url';",
  "const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');",
  "const raw = (bytes) => ({ encoding: 'base64', bytes: bytes.toString('base64'), byteLength: bytes.length, sha256: 'sha256:' + sha256(bytes) });",
  "async function canonical(input) {",
  "  if (input.startsWith('node:')) return input;",
  "  const parsed = new URL(input);",
  "  if (parsed.protocol !== 'file:') throw new TypeError('unresolved non-file module URL ' + input);",
  "  const suffix = parsed.search + parsed.hash;",
  "  parsed.search = ''; parsed.hash = '';",
  "  return pathToFileURL(await realpath(fileURLToPath(parsed))).href + suffix;",
  "}",
  "const requestedSeeds = JSON.parse(process.argv[2]);",
  "const seeds = [];",
  "for (const seed of requestedSeeds) seeds.push({ kind: seed.kind, moduleURL: await canonical(seed.moduleURL) });",
  "const pending = seeds.map(({ moduleURL }) => moduleURL);",
  "const nodeMap = new Map(); const edges = [];",
  "while (pending.length > 0) {",
  "  const moduleURL = pending.shift();",
  "  if (nodeMap.has(moduleURL)) continue;",
  "  if (moduleURL.startsWith('node:')) { nodeMap.set(moduleURL, { moduleURL, mediaType: 'runtime_builtin', source: null, staticRequestCount: 0 }); continue; }",
  "  const sourceURL = new URL(moduleURL); sourceURL.search = ''; sourceURL.hash = '';",
  "  const bytes = await readFile(sourceURL);",
  "  const extension = path.extname(fileURLToPath(sourceURL));",
  "  let requests = []; let mediaType;",
  "  if (extension === '.json') mediaType = 'json_module';",
  "  else if (extension === '.js' || extension === '.mjs') {",
  "    mediaType = 'javascript_module';",
  "    requests = new vm.SourceTextModule(bytes.toString('utf8'), { identifier: moduleURL }).moduleRequests;",
  "  } else throw new TypeError('unparsed module media type ' + moduleURL);",
  "  nodeMap.set(moduleURL, { moduleURL, mediaType, source: raw(bytes), staticRequestCount: requests.length });",
  "  for (const request of requests) {",
  "    const toModuleURL = await canonical(import.meta.resolve(request.specifier, moduleURL));",
  "    edges.push({ fromModuleURL: moduleURL, specifier: request.specifier, attributes: request.attributes, phase: request.phase, toModuleURL });",
  "    pending.push(toModuleURL);",
  "  }",
  "}",
  "const nodes = [...nodeMap.values()].sort((a, b) => a.moduleURL.localeCompare(b.moduleURL));",
  "edges.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));",
  "process.stdout.write(JSON.stringify({ kind: 'closed_static_module_graph', schemaVersion: '1', parser: 'node:vm.SourceTextModule+import.meta.resolve', seeds, nodes, edges, unresolvedEdges: [] }));",
].join("\n");

function assertRawBytesEvidence(evidence) {
  assert.deepEqual(Object.keys(evidence).sort(), [
    "byteLength", "bytes", "encoding", "sha256",
  ]);
  assert.equal(evidence.encoding, "base64");
  const bytes = Buffer.from(evidence.bytes, evidence.encoding);
  assert.equal(bytes.length, evidence.byteLength);
  assert.equal(`sha256:${sha256Hex(bytes)}`, evidence.sha256);
  return bytes;
}

async function closedModuleGraphEvidence({
  seeds,
  generatedModuleURLs,
  installedRoots,
  parserSeedKind,
}) {
  assert.equal(typeof parserSeedKind, "string");
  const parserRoot = await mkdtemp(
    path.join(os.tmpdir(), "odd-glc-t041-module-graph-parser-"),
  );
  const parserPath = path.join(parserRoot, "parser.mjs");
  const parserSourceBytes = Buffer.from(MODULE_GRAPH_PARSER_SOURCE);
  await writeFile(parserPath, parserSourceBytes);
  const parserModuleURL = pathToFileURL(await realpath(parserPath)).href;
  const evidenceSeeds = [
    Object.freeze({
      kind: parserSeedKind,
      moduleURL: parserModuleURL,
    }),
    ...seeds,
  ];
  const evidenceGeneratedModuleURLs = [
    parserModuleURL,
    ...generatedModuleURLs,
  ];
  try {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [
        "--experimental-vm-modules",
        "--experimental-import-meta-resolve",
        "--no-warnings",
        parserPath,
        JSON.stringify(evidenceSeeds),
      ],
      { maxBuffer: 100 * 1024 * 1024 },
    );
    assert.equal(stderr, "");
    const parsed = JSON.parse(stdout);
    assert.deepEqual(Object.keys(parsed).sort(), [
      "edges", "kind", "nodes", "parser", "schemaVersion", "seeds",
      "unresolvedEdges",
    ]);
    assert.equal(parsed.kind, "closed_static_module_graph");
    assert.equal(parsed.schemaVersion, "1");
    assert.equal(parsed.parser, "node:vm.SourceTextModule+import.meta.resolve");
    assert.deepEqual(parsed.unresolvedEdges, []);
    assert.deepEqual(
      parsed.seeds.map(({ kind }) => kind),
      evidenceSeeds.map(({ kind }) => kind),
    );
    const canonicalInstalledRoots = await Promise.all(
      installedRoots.map((installedRoot) => realpath(installedRoot)),
    );
    const canonicalSourceRoot = await realpath(SOURCE_ROOT);
    for (const installedRoot of canonicalInstalledRoots) {
      const relativeToSource = path.relative(canonicalSourceRoot, installedRoot);
      assert.equal(
        relativeToSource === ".." ||
          relativeToSource.startsWith(`..${path.sep}`),
        true,
        `${installedRoot} must be outside the odd_glc source checkout`,
      );
    }
    const canonicalGeneratedPaths = await Promise.all(
      evidenceGeneratedModuleURLs.map(
        async (moduleURL) => realpath(fileURLToPath(moduleURL)),
      ),
    );
    const nodeURLs = new Set(parsed.nodes.map(({ moduleURL }) => moduleURL));
    assert.equal(nodeURLs.size, parsed.nodes.length);
    for (const seed of parsed.seeds) {
      assert.equal(nodeURLs.has(seed.moduleURL), true);
    }
    const parserNode = parsed.nodes.find(
      ({ moduleURL }) => moduleURL === parserModuleURL,
    );
    assert.ok(parserNode, "generated module graph parser node");
    assert.equal(parserNode.mediaType, "javascript_module");
    assert.equal(parserNode.staticRequestCount, 5);
    assert.deepEqual(assertRawBytesEvidence(parserNode.source), parserSourceBytes);
    const parserEdges = parsed.edges
      .filter(({ fromModuleURL }) => fromModuleURL === parserModuleURL)
      .map(({ specifier, toModuleURL }) => [specifier, toModuleURL])
      .sort((left, right) => left[0].localeCompare(right[0]));
    assert.deepEqual(parserEdges, [
      ["node:crypto", "node:crypto"],
      ["node:fs/promises", "node:fs/promises"],
      ["node:path", "node:path"],
      ["node:url", "node:url"],
      ["node:vm", "node:vm"],
    ]);
    const forbiddenSegments = Object.freeze([
      ["test", "env"].join("_"),
      "private",
    ]);
    for (const node of parsed.nodes) {
      if (node.mediaType === "runtime_builtin") {
        assert.equal(node.moduleURL.startsWith("node:"), true);
        assert.equal(node.source, null);
        continue;
      }
      assert.equal(node.moduleURL.startsWith("file:"), true);
      assertRawBytesEvidence(node.source);
      const modulePath = await realpath(fileURLToPath(node.moduleURL));
      if (canonicalGeneratedPaths.includes(modulePath)) continue;
      const containingRoot = canonicalInstalledRoots.find((installedRoot) => {
        const relative = path.relative(installedRoot, modulePath);
        return !path.isAbsolute(relative) &&
          relative !== ".." && !relative.startsWith(`..${path.sep}`);
      });
      assert.ok(
        containingRoot,
        `module escaped installed roots: ${node.moduleURL}`,
      );
      const relativeSegments = path.relative(containingRoot, modulePath)
        .split(path.sep);
      assert.equal(
        forbiddenSegments.some((segment) => relativeSegments.includes(segment)),
        false,
        node.moduleURL,
      );
    }
    for (const edge of parsed.edges) {
      assert.equal(nodeURLs.has(edge.fromModuleURL), true);
      assert.equal(nodeURLs.has(edge.toModuleURL), true);
      assert.equal(typeof edge.specifier, "string");
      assert.equal(typeof edge.attributes, "object");
      assert.equal(edge.phase, "evaluation");
    }
    return Object.freeze({
      ...parsed,
      boundaries: Object.freeze({
        generatedModuleURLs: Object.freeze(parsed.seeds
          .filter(({ moduleURL }) => canonicalGeneratedPaths.includes(
            fileURLToPath(moduleURL),
          )).map(({ moduleURL }) => moduleURL)),
        installedRootURLs: Object.freeze(canonicalInstalledRoots.map(
          (installedRoot) => pathToFileURL(installedRoot).href,
        )),
      }),
    });
  } finally {
    await rm(parserRoot, { recursive: true, force: true });
  }
}

async function exactProductGitBasis() {
  const relativeRoot = path.relative(SOURCE_ROOT, PRODUCT_ROOT)
    .split(path.sep).join(path.posix.sep);
  const { stdout: headStdout } = await execFileAsync(
    "git",
    ["-C", SOURCE_ROOT, "rev-parse", "HEAD"],
  );
  const headCommit = headStdout.trim();
  const admittedImplementationDonor =
    "6af27f0eae673cd1fbdb97c861f97803dbe920bf";
  await execFileAsync(
    "git",
    ["-C", SOURCE_ROOT, "merge-base", "--is-ancestor", admittedImplementationDonor, headCommit],
  );
  const productBlobs = [];
  for (const relativeProductPath of EXACT_PRODUCT_FILES) {
    const repositoryPath = `${relativeRoot}/${relativeProductPath}`;
    const [{ stdout: committed }, { stdout: working }] = await Promise.all([
      execFileAsync("git", ["-C", SOURCE_ROOT, "rev-parse", `HEAD:${repositoryPath}`]),
      execFileAsync("git", ["-C", SOURCE_ROOT, "hash-object", repositoryPath]),
    ]);
    assert.equal(working.trim(), committed.trim(), repositoryPath);
    productBlobs.push(Object.freeze({
      repositoryPath,
      blobId: committed.trim(),
      sha256: sha256Hex(await readFile(path.join(SOURCE_ROOT, repositoryPath))),
    }));
  }
  return Object.freeze({
    headCommit,
    admittedImplementationDonor,
    productBlobs: Object.freeze(productBlobs),
  });
}

async function extractExactAbiTarball(tarballPath, scratch) {
  assert.ok(tarballPath, "ODD_GLC_T041_ABI_TARBALL is required");
  assert.equal(path.isAbsolute(tarballPath), true, "ABI tarball path must be absolute");
  assert.equal(sha256Hex(await readFile(tarballPath)), ABI_TARBALL_SHA256);
  const consumerRoot = path.join(scratch, "abi-bootstrap-consumer");
  const packageRoot = path.join(
    consumerRoot,
    "node_modules",
    "@abiogenesis",
    "typescript-tenant",
  );
  await mkdir(packageRoot, { recursive: true });
  const { stderr } = await execFileAsync(
    "tar",
    ["-xzf", tarballPath, "--strip-components=1", "-C", packageRoot],
    { maxBuffer: 20 * 1024 * 1024 },
  );
  assert.equal(stderr, "");
  const canonicalRoot = await realpath(packageRoot);
  try {
    await execFileAsync("git", ["-C", canonicalRoot, "rev-parse", "--show-toplevel"]);
    assert.fail("tarball bootstrap must be outside every source checkout");
  } catch (error) {
    assert.notEqual(error.code, undefined);
  }
  return canonicalRoot;
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

function resolvePublicCallsite(loaded, packageExportPath, namedExport, memberPath = []) {
  const subpath = ABI_PUBLIC_SUBPATHS.find(
    (candidate) => candidate.packageExportPath === packageExportPath,
  );
  assert.ok(subpath, packageExportPath);
  let callable = loaded[subpath.key];
  assert.equal(Object.hasOwn(callable, namedExport), true, namedExport);
  callable = callable[namedExport];
  for (const member of memberPath) {
    assert.ok(callable !== null && ["object", "function"].includes(typeof callable));
    assert.equal(Object.hasOwn(callable, member), true, member);
    callable = callable[member];
  }
  assert.equal(typeof callable, "function");
  return Object.freeze({
    callable,
    evidence: Object.freeze({
      packageName: ABI.packageName,
      packageVersion: ABI.packageVersion,
      packageExportPath,
      resolvedModuleURL: loaded.publicModuleRefs[subpath.key],
      namedExport,
      memberPath: Object.freeze([...memberPath]),
    }),
  });
}

function nativeChildEvidence(product, {
  callsite,
  request,
  output,
  dependencyCoordinates = [],
  resourceCoordinates = [],
  effectCoordinates = [],
  admissionCoordinate = null,
  predecessorPrefix = null,
  successorPrefix = null,
}) {
  return Object.freeze({
    callsite: structuredClone(callsite.evidence),
    canonicalRequestDigest: product.sha256Canonical(request),
    canonicalOutputDigest: product.sha256Canonical(output),
    dependencyCoordinates: structuredClone(dependencyCoordinates),
    resourceCoordinates: structuredClone(resourceCoordinates),
    effectCoordinates: structuredClone(effectCoordinates),
    admissionCoordinate: structuredClone(admissionCoordinate),
    predecessorPrefix: structuredClone(predecessorPrefix),
    successorPrefix: structuredClone(successorPrefix),
  });
}

async function loadAbiPublic(packageRoot, { identity, includeCliRoot }) {
  const packageJson = JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8"),
  );
  assert.equal(packageJson.name, ABI.packageName);
  assert.equal(packageJson.version, ABI.packageVersion);
  for (const { packageExportPath } of ABI_PUBLIC_SUBPATHS) {
    assert.equal(
      typeof packageJson.exports?.[packageExportPath]?.import,
      "string",
      packageExportPath,
    );
  }
  const nodeModulesRoot = path.resolve(packageRoot, "../..");
  assert.equal(path.basename(nodeModulesRoot), "node_modules");
  const consumerRoot = path.dirname(nodeModulesRoot);
  const bridgeRoot = await mkdtemp(
    path.join(consumerRoot, ".odd-glc-t041-abi-public-bridge-"),
  );
  const bridgePath = path.join(bridgeRoot, "bridge.mjs");
  const bridgeSource = [
    ...ABI_PUBLIC_SUBPATHS.map(({ key, specifier }) =>
      `export * as ${key} from ${JSON.stringify(specifier)};`),
    `export const resolvedPublicSubpathURLs = Object.freeze({${ABI_PUBLIC_SUBPATHS.map(
      ({ packageExportPath, specifier }) =>
        `${JSON.stringify(packageExportPath)}: import.meta.resolve(${JSON.stringify(specifier)})`,
    ).join(",")}});`,
    "",
  ].join("\n");
  await writeFile(
    bridgePath,
    bridgeSource,
  );
  try {
    const bridgeImportURL = `${pathToFileURL(bridgePath).href}?public=${Date.now()}`;
    const loaded = await import(
      bridgeImportURL
    );
    const publicModuleRefs = Object.fromEntries(
      ABI_PUBLIC_SUBPATHS.map(({ key, packageExportPath }) => [
        key,
        loaded.resolvedPublicSubpathURLs[packageExportPath],
      ]),
    );
    const graphSeeds = [
      Object.freeze({
        kind: `${identity}_generated_abi_bridge`,
        moduleURL: bridgeImportURL,
      }),
      ...ABI_PUBLIC_SUBPATHS.map(({ key }) => Object.freeze({
        kind: `${identity}_abi_public_export_${key}`,
        moduleURL: publicModuleRefs[key],
      })),
    ];
    if (includeCliRoot) {
      const cliModulePath = await realpath(path.join(
        packageRoot,
        packageJson.bin["abg.cli"],
      ));
      graphSeeds.push(Object.freeze({
        kind: "execution_abi_cli_transport_root",
        moduleURL: pathToFileURL(cliModulePath).href,
      }));
    }
    const moduleGraphEvidence = await closedModuleGraphEvidence({
      seeds: graphSeeds,
      generatedModuleURLs: [bridgeImportURL],
      installedRoots: [packageRoot],
      parserSeedKind: `${identity}_generated_module_graph_parser`,
    });
    return {
      ...loaded,
      consumerRoot,
      packageJson,
      publicModuleRefs,
      moduleGraphEvidence,
    };
  } finally {
    await rm(bridgeRoot, { recursive: true, force: true });
  }
}

async function assertPublicModuleRefsWithinPackage(loaded, packageRoot) {
  const installedRoot = await realpath(packageRoot);
  const sourceRoot = await realpath(SOURCE_ROOT);
  const relativeToOddSource = path.relative(sourceRoot, installedRoot);
  assert.equal(
    relativeToOddSource === ".." || relativeToOddSource.startsWith(`..${path.sep}`),
    true,
  );
  try {
    await execFileAsync("git", ["-C", installedRoot, "rev-parse", "--show-toplevel"]);
    assert.fail("installed ABI root must be outside every source checkout");
  } catch (error) {
    assert.notEqual(error.code, undefined);
  }
  const evidence = [];
  for (const { key, packageExportPath } of ABI_PUBLIC_SUBPATHS) {
    const resolvedURL = loaded.publicModuleRefs[key];
    const modulePath = await realpath(fileURLToPath(resolvedURL));
    const relative = path.relative(installedRoot, modulePath);
    assert.equal(path.isAbsolute(relative), false, packageExportPath);
    assert.equal(
      relative === ".." || relative.startsWith(`..${path.sep}`),
      false,
      packageExportPath,
    );
    const relativeSegments = relative.split(path.sep);
    assert.equal(relativeSegments.includes(["test", "env"].join("_")), false);
    assert.equal(relativeSegments.includes("private"), false);
    assert.equal(
      pathToFileURL(modulePath).href,
      pathToFileURL(await realpath(path.join(
        packageRoot,
        loaded.packageJson.exports[packageExportPath].import,
      ))).href,
      packageExportPath,
    );
    evidence.push(Object.freeze({
      namespace: key,
      packageExportPath,
      packageRelativeTarget: relative.split(path.sep).join(path.posix.sep),
      resolvedURL,
      realModuleURL: pathToFileURL(modulePath).href,
      containedInInstalledPackage: true,
      outsideEverySourceCheckout: true,
    }));
  }
  return Object.freeze(evidence);
}

async function loadReturnedInstalledOwnerExport({ install, binding, graphIdentity }) {
  assert.equal(binding.packageName, install.packageName);
  assert.equal(binding.packageVersion, install.packageVersion);
  assert.equal(path.isAbsolute(binding.modulePath), false);
  const installedRoot = await realpath(install.installedRoot);
  const modulePath = await realpath(path.join(installedRoot, binding.modulePath));
  const relative = path.relative(installedRoot, modulePath);
  assert.equal(path.isAbsolute(relative), false);
  assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`), false);
  assert.equal(relative.split(path.sep).join(path.posix.sep), binding.modulePath);
  const moduleURL = pathToFileURL(modulePath).href;
  const namespace = await import(moduleURL);
  assert.equal(Object.hasOwn(namespace, binding.namedSymbol), true);
  const moduleGraphEvidence = await closedModuleGraphEvidence({
    seeds: [Object.freeze({
      kind: `returned_${graphIdentity}_dynamic_owner`,
      moduleURL,
    })],
    generatedModuleURLs: [],
    installedRoots: [installedRoot],
    parserSeedKind: `returned_${graphIdentity}_generated_module_graph_parser`,
  });
  return Object.freeze({
    value: namespace[binding.namedSymbol],
    evidence: Object.freeze({
      productId: install.productId,
      installId: install.installId,
      installedRoot,
      packageName: binding.packageName,
      packageVersion: binding.packageVersion,
      modulePath: binding.modulePath,
      moduleURL,
      namedSymbol: binding.namedSymbol,
      moduleGraphEvidence,
      containedInReturnedInstalledRoot: true,
      returnedExportPresent: true,
    }),
  });
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
  const bridgeSource = [
    `export { default as publication } from "${ODD.packageName}/publication" with { type: "json" };`,
    `export const publicationURL = import.meta.resolve("${ODD.packageName}/publication");`,
    "",
  ].join("\n");
  await writeFile(
    bridgePath,
    bridgeSource,
  );
  try {
    const bridgeImportURL = `${pathToFileURL(bridgePath).href}?odd=${Date.now()}`;
    const loaded = await import(bridgeImportURL);
    const installedPackageRoot = await realpath(installedRoot);
    try {
      await execFileAsync(
        "git",
        ["-C", installedPackageRoot, "rev-parse", "--show-toplevel"],
      );
      assert.fail("installed odd Product must be outside every source checkout");
    } catch (error) {
      assert.notEqual(error.code, undefined);
    }
    const publicationPath = await realpath(fileURLToPath(loaded.publicationURL));
    const relative = path.relative(installedPackageRoot, publicationPath);
    assert.equal(path.isAbsolute(relative), false);
    assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`), false);
    assert.equal(relative.split(path.sep).join(path.posix.sep), "build/publication.json");
    const moduleGraphEvidence = await closedModuleGraphEvidence({
      seeds: [
        Object.freeze({
          kind: "execution_generated_odd_publication_bridge",
          moduleURL: bridgeImportURL,
        }),
        Object.freeze({
          kind: "execution_odd_json_publication_terminal",
          moduleURL: loaded.publicationURL,
        }),
      ],
      generatedModuleURLs: [bridgeImportURL],
      installedRoots: [installedRoot],
      parserSeedKind:
        "execution_generated_odd_publication_module_graph_parser",
    });
    return Object.freeze({
      publication: structuredClone(loaded.publication),
      moduleGraphEvidence,
      moduleEvidence: Object.freeze({
        packageExportPath: "./publication",
        resolvedURL: loaded.publicationURL,
        realModuleURL: pathToFileURL(publicationPath).href,
        packageRelativeTarget: "build/publication.json",
        containedInInstalledPackage: true,
        outsideEverySourceCheckout: true,
      }),
    });
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

function definitionKeyString({ operationId, memberKey }) {
  return `${operationId}#${memberKey}`;
}

function ownPropertyCallable(ownerModules, locator) {
  if (!Object.hasOwn(ownerModules, locator.packageExportPath)) return null;
  let current = ownerModules[locator.packageExportPath];
  if (
    (typeof current !== "object" && typeof current !== "function") ||
    current === null ||
    !Object.hasOwn(current, locator.namedExport)
  ) return null;
  current = current[locator.namedExport];
  for (const member of locator.memberPath) {
    if (
      (typeof current !== "object" && typeof current !== "function") ||
      current === null ||
      !Object.hasOwn(current, member)
    ) return null;
    current = current[member];
  }
  return typeof current === "function" ? current : null;
}

function assertFullPublicFamilyClosure({
  installedPublic,
  coordinates,
  ownerModules,
  product,
}) {
  const family = installedPublic.PUBLIC_FUNCTION_DEFINITION_FAMILY.definitions;
  assert.equal(family.length, 56);
  const definitionKeys = family.map(({ definitionKey }) =>
    definitionKeyString(definitionKey));
  assert.equal(new Set(definitionKeys).size, 56);
  const rows = [];
  let sharedCatalogDigest = null;
  for (const definition of family) {
    const { operationId, memberKey } = definition.definitionKey;
    const operationProjection = exact(
      installedPublic.PUBLIC_OPERATION_CONTRACT_PROJECTIONS,
      (candidate) => candidate.operationId === operationId,
      `${operationId} public projection`,
    );
    const memberProjection = exact(
      operationProjection.definitions,
      (candidate) => candidate.definitionKey.memberKey === memberKey,
      `${definitionKeyString(definition.definitionKey)} public projection`,
    );
    assert.deepEqual(
      memberProjection.executionBindingSpecification,
      definition.executionBindingSpecification,
    );
    const schemaSet = installedPublic.PUBLIC_OPERATION_SCHEMAS[operationId]?.[memberKey];
    assert.ok(schemaSet, `${definitionKeyString(definition.definitionKey)} schema set`);
    assert.equal(schemaSet.request, definition.requestContract.schema);
    assert.equal(schemaSet.result, definition.resultContract.schema);
    assert.equal(schemaSet.refusal, definition.refusalContract.schema);
    assert.equal(
      schemaSet.nonTerminal,
      definition.nonTerminalContract?.schema ?? null,
    );
    const operationCoordinates = exact(
      coordinates.operations,
      (candidate) => candidate.operationId === operationId,
      `${operationId} verified coordinate`,
    );
    const memberCoordinates = exact(
      operationCoordinates.members,
      (candidate) => candidate.memberKey === memberKey,
      `${definitionKeyString(definition.definitionKey)} verified coordinate`,
    );
    for (const [coordinateKey, selectorSlot, contract, projected] of [
      ["request", "request", definition.requestContract, memberProjection.requestContract],
      ["result", "result", definition.resultContract, memberProjection.resultContract],
      ["refusal", "refusal", definition.refusalContract, memberProjection.refusalContract],
      ["nonTerminal", "non_terminal", definition.nonTerminalContract, memberProjection.nonTerminalContract],
    ]) {
      const coordinate = memberCoordinates.slots[coordinateKey];
      if (contract === null) {
        assert.equal(projected, null);
        assert.equal(coordinate, null);
        continue;
      }
      assert.ok(projected);
      assert.ok(coordinate);
      assert.deepEqual(projected.identity.definitionKey, definition.definitionKey);
      assert.equal(projected.identity.contractId, contract.contractId);
      assert.equal(coordinate.flatRow.contractId, operationProjection.operationId);
      assert.deepEqual(coordinate.nestedSelector.definitionKey, definition.definitionKey);
      assert.equal(coordinate.nestedSelector.slot, selectorSlot);
      assert.equal(coordinate.nestedSelector.definitionRef, projected.definitionRef);
      const catalogDigest = product.sha256Canonical(coordinate.contractCatalog);
      sharedCatalogDigest ??= catalogDigest;
      assert.equal(catalogDigest, sharedCatalogDigest);
    }
    const locator = definition.executionBindingSpecification.callable;
    rows.push(Object.freeze({
      definitionKey: structuredClone(definition.definitionKey),
      sdkCoordinate: definition.sdkCoordinate,
      callableLocator: structuredClone(locator),
      callable: ownPropertyCallable(ownerModules, locator) !== null,
      schemaIdentityExact: true,
      projectionIdentityExact: true,
      verifiedCatalogIdentityExact: true,
    }));
  }
  const absent = rows
    .filter((row) => !row.callable)
    .map((row) => definitionKeyString(row.definitionKey))
    .sort();
  assert.equal(rows.filter((row) => row.callable).length, 39);
  assert.deepEqual(absent, [...ABSENT_PUBLIC_CALLABLE_KEYS].sort());
  const selectedKeys = new Set(CONSUMED_DEFINITION_KEYS.map(
    ([operationId, memberKey]) => `${operationId}#${memberKey}`,
  ));
  assert.equal(selectedKeys.size, 12);
  assert.equal(
    rows.filter((row) => selectedKeys.has(definitionKeyString(row.definitionKey)))
      .every((row) => row.callable),
    true,
  );
  return Object.freeze({
    familyRef: installedPublic.PUBLIC_FUNCTION_DEFINITION_FAMILY.familyRef,
    familyDigest: installedPublic.PUBLIC_FUNCTION_DEFINITION_FAMILY.familyDigest,
    keySetDigest: installedPublic.PUBLIC_FUNCTION_DEFINITION_FAMILY.keySetDigest,
    operationCount: new Set(family.map(({ definitionKey }) =>
      definitionKey.operationId)).size,
    definitionCount: family.length,
    callableCount: 39,
    absentCount: absent.length,
    absentDefinitionKeys: Object.freeze(absent),
    selectedDefinitionKeys: Object.freeze([...selectedKeys].sort()),
    sharedVerifiedContractCatalogDigest: sharedCatalogDigest,
    rows: Object.freeze(rows),
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
  const request = Object.freeze({
    kind: "abg_cli_transport_request",
    schemaVersion: SCHEMA_VERSION,
    acquisition,
    invocation: call,
  });
  const requestBytes = Buffer.from(`${JSON.stringify(request)}\n`);
  await writeFile(requestPath, requestBytes);
  let execution;
  try {
    execution = await execFileAsync(
      process.execPath,
      [cliPath, "--jsonl", requestPath],
      {
        cwd: scratch,
        encoding: "buffer",
        env: {},
        maxBuffer: 20 * 1024 * 1024,
      },
    );
    assert.equal(expectedExitCode, 0, `${identity} CLI exit`);
  } catch (error) {
    assert.equal(error.code, expectedExitCode, `${identity} CLI exit`);
    execution = error;
  }
  assert.equal(Buffer.isBuffer(execution.stderr), true, `${identity} stderr`);
  assert.equal(execution.stderr.length, 0, `${identity} empty stderr`);
  const outputBytes = execution.stdout;
  const outputRecord = parseExactJsonlRecord(
    outputBytes,
    `${identity} stdout`,
  );
  return Object.freeze({
    outcome: outputRecord.value,
    rawJsonLine: outputRecord.line,
    input: rawBytesEvidence(requestBytes),
    output: rawBytesEvidence(outputBytes),
    transportModuleURL: pathToFileURL(await realpath(cliPath)).href,
  });
}

async function runInstalledCli({
  scratch,
  installedRoot,
  packageJson,
  identity,
  call,
  rawJsonLines,
  rawExchanges,
}) {
  const eventLogRef =
    call.resources.eventResource.closeHandoff.prefix.eventLogRef;
  const eventLogPath = fileURLToPath(eventLogRef);
  const beforeEventLogBytes = await readFile(eventLogPath);
  const {
    outcome,
    rawJsonLine,
    input,
    output,
    transportModuleURL,
  } = await executeInstalledCli({
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
  const afterEventLogBytes = await readFile(eventLogPath);
  rawJsonLines.push(rawJsonLine);
  assert.equal(outcome.kind, "installed_definition_call_transport_result");
  assert.equal(outcome.receipt.kind, "definition_host_receipt");
  assert.equal(outcome.receipt.exitCode, 0, JSON.stringify(outcome.receipt));
  assert.equal(outcome.receipt.failure, null);
  rawExchanges.push(Object.freeze({
    definitionKey: structuredClone(outcome.receipt.definitionKey),
    input,
    output,
    ownerOutput: structuredClone(outcome.receipt.ownerOutput),
    resources: structuredClone(outcome.receipt.resources),
    transportModuleURL,
    eventLog: Object.freeze({
      eventLogRef,
      before: rawBytesEvidence(beforeEventLogBytes),
      after: rawBytesEvidence(afterEventLogBytes),
      appendedByteLength:
        afterEventLogBytes.length - beforeEventLogBytes.length,
    }),
  }));
  return outcome.receipt;
}

function parseTypedArchiveHeaders(verboseListing) {
  const expected = EXACT_PRODUCT_FILES
    .map((member) => Object.freeze({
      path: `package/${member}`,
      type: "regular_file",
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
  const lines = verboseListing.split(/\r?\n/u).filter((line) => line.length > 0);
  assert.equal(lines.length, expected.length, "tar verbose row count");
  const rows = lines.map((line) => {
    const fields = line.trim().split(/\s+/u);
    assert.ok(fields.length >= 6, `unparsed tar verbose row: ${line}`);
    const mode = fields[0];
    const archivePath = fields.at(-1);
    assert.match(mode, /^[-dlcbps][rwxStT-]{9}(?:[+@.]?)?$/u);
    assert.equal(mode[0], "-", `${archivePath} must be a regular-file tar header`);
    return Object.freeze({ path: archivePath, type: "regular_file" });
  }).sort((left, right) => left.path.localeCompare(right.path));
  assert.deepEqual(rows, expected, "npm tar headers must be exactly five regular files");
  return Object.freeze(rows);
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
  assert.deepEqual(summary.files.map((entry) => entry.path).sort(), EXACT_PRODUCT_FILES);
  const artifactPath = path.join(destination, summary.filename);
  assert.equal(sha256Hex(await readFile(artifactPath)), ODD_TARBALL_SHA256);
  const { stdout: tarHeaders, stderr: tarStderr } = await execFileAsync(
    "tar",
    ["-tvzf", artifactPath],
    { maxBuffer: 20 * 1024 * 1024 },
  );
  assert.equal(tarStderr, "");
  const typedArchiveHeaders = parseTypedArchiveHeaders(tarHeaders);
  return Object.freeze({
    artifactPath,
    archiveMembers: Object.freeze(typedArchiveHeaders.map(({ path: member }) => member)),
    typedArchiveHeaders,
  });
}

test("ABI5 executes the installed odd_glc Product through cross-owner Hello", async (t) => {
  const abiArtifactPath = process.env.ODD_GLC_T041_ABI_TARBALL;
  assert.ok(abiArtifactPath, "ODD_GLC_T041_ABI_TARBALL is required");
  const rawReceiptPath = process.env.ODD_GLC_T041_RAW_RECEIPT_PATH;
  assert.ok(rawReceiptPath, "ODD_GLC_T041_RAW_RECEIPT_PATH is required");
  assert.equal(path.isAbsolute(rawReceiptPath), true);
  const scratch = await mkdtemp(path.join(os.tmpdir(), "odd-glc-t041-sunny-"));
  t.after(async () => rm(scratch, { recursive: true, force: true }));
  const bootstrapRoot = await extractExactAbiTarball(abiArtifactPath, scratch);
  const bootstrap = await loadAbiPublic(bootstrapRoot, {
    identity: "bootstrap",
    includeCliRoot: false,
  });
  const bootstrapModuleEvidence = await assertPublicModuleRefsWithinPackage(
    bootstrap,
    bootstrapRoot,
  );
  const nativeStageObservations = [];
  const observeNativeStage = (ownerMethod, childCalls) => {
    assert.equal(Array.isArray(childCalls), true);
    assert.equal(childCalls.length > 0, true);
    nativeStageObservations.push(Object.freeze({
      ownerMethod,
      evidenceKind: "native_owner_stage_observation",
      receipt: false,
      childCalls: Object.freeze([...childCalls]),
    }));
  };

  const workspaceRoot = path.join(scratch, "workspace");
  const createCallsite = resolvePublicCallsite(
    bootstrap,
    "./product",
    "WorkspaceOperationPort",
    ["create"],
  );
  const createRequest = Object.freeze({
    kind: "workspace_create_packet",
    schemaVersion: SCHEMA_VERSION,
    memberKey: "clean",
    targetRoot: workspaceRoot,
    scaffoldPolicy: "none",
  });
  const created = await createCallsite.callable(createRequest);
  assert.equal(created.disposition, "created", JSON.stringify(created));
  observeNativeStage("./product::WorkspaceOperationPort.create", [
    nativeChildEvidence(bootstrap.product, {
      callsite: createCallsite,
      request: createRequest,
      output: created,
      resourceCoordinates: [created.creationManifestRef],
      effectCoordinates: [created.creationManifestDigest],
    }),
  ]);
  const openCallsite = resolvePublicCallsite(
    bootstrap,
    "./product",
    "WorkspaceOperationPort",
    ["open"],
  );
  const openRequest = Object.freeze({
    kind: "workspace_open_packet",
    schemaVersion: SCHEMA_VERSION,
    memberKey: "open",
    targetRoot: workspaceRoot,
    expectedWorkspaceAuthorityRef: created.workspaceAuthorityRef,
    expectedWorkspaceAuthorityDigest: created.workspaceAuthorityDigest,
  });
  const opened = await openCallsite.callable(openRequest);
  assert.equal(opened.disposition, "unbound", JSON.stringify(opened));
  observeNativeStage("./product::WorkspaceOperationPort.open", [
    nativeChildEvidence(bootstrap.product, {
      callsite: openCallsite,
      request: openRequest,
      output: opened,
      dependencyCoordinates: [
        created.workspaceAuthorityRef,
        created.workspaceAuthorityDigest,
      ],
      resourceCoordinates: [opened.workspaceRef],
      effectCoordinates: [opened.workspaceDigest],
    }),
  ]);

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
  const verifyCallsite = resolvePublicCallsite(
    bootstrap,
    "./product",
    "verifyProduct",
  );
  const verifyAbiRequest = Object.freeze({
    artifactPath: abiArtifactPath,
    artifactRef: path.basename(abiArtifactPath),
    ...verificationIdentity(
      abiManifest,
      abiArtifactDigest,
      bootstrap.product,
    ),
  });
  const verifiedAbi = await verifyCallsite.callable(verifyAbiRequest);
  assert.equal(verifiedAbi.disposition, "verified", JSON.stringify(verifiedAbi));
  const verifyOddRequest = Object.freeze({
    artifactPath: oddArtifactPath,
    artifactRef: path.basename(oddArtifactPath),
    ...verificationIdentity(
      oddManifest,
      oddArtifactDigest,
      bootstrap.product,
    ),
  });
  const verifiedOdd = await verifyCallsite.callable(verifyOddRequest);
  assert.equal(verifiedOdd.disposition, "verified", JSON.stringify(verifiedOdd));
  assert.equal(verifiedAbi.productId, ABI.productId);
  assert.equal(verifiedOdd.productId, ODD.productId);
  observeNativeStage("./product::verifyProduct", [
    nativeChildEvidence(bootstrap.product, {
      callsite: verifyCallsite,
      request: verifyAbiRequest,
      output: verifiedAbi,
      dependencyCoordinates: [abiArtifactDigest],
      resourceCoordinates: [abiArtifactPath],
      effectCoordinates: [verifiedAbi.verificationRef, verifiedAbi.verificationDigest],
    }),
    nativeChildEvidence(bootstrap.product, {
      callsite: verifyCallsite,
      request: verifyOddRequest,
      output: verifiedOdd,
      dependencyCoordinates: [oddArtifactDigest],
      resourceCoordinates: [oddArtifactPath],
      effectCoordinates: [verifiedOdd.verificationRef, verifiedOdd.verificationDigest],
    }),
  ]);

  const verifiedProducts = Object.freeze([verifiedAbi, verifiedOdd]);
  const resolveCallsite = resolvePublicCallsite(
    bootstrap,
    "./product",
    "constructResolvedProductLock",
  );
  const lock = resolveCallsite.callable(verifiedProducts);
  assert.equal(lock.kind, "resolved_product_lock", JSON.stringify(lock));
  assert.equal(lock.rows.length, 2);
  assert.equal(lock.dependencyEdges.length, 1);
  assert.equal(lock.dependencyEdges[0].fromProductId, ODD.productId);
  assert.equal(lock.dependencyEdges[0].toProductId, ABI.productId);
  observeNativeStage("./product::constructResolvedProductLock", [
    nativeChildEvidence(bootstrap.product, {
      callsite: resolveCallsite,
      request: verifiedProducts,
      output: lock,
      dependencyCoordinates: lock.dependencyEdges,
      effectCoordinates: [lock.lockId, lock.lockDigest],
    }),
  ]);

  const abiConsumerRoot = path.join(scratch, "abi-consumer");
  const oddConsumerRoot = path.join(scratch, "odd-consumer");
  const installCallsite = resolvePublicCallsite(
    bootstrap,
    "./product",
    "installProduct",
  );
  const installAbiRequest = Object.freeze({
    artifactPath: abiArtifactPath,
    targetRoot: abiConsumerRoot,
    verifiedArtifact: verifiedAbi,
    resolvedLock: lock,
  });
  const abiInstall = await installCallsite.callable(installAbiRequest);
  assert.equal(abiInstall.disposition, "materialized", JSON.stringify(abiInstall));
  const installOddRequest = Object.freeze({
    artifactPath: oddArtifactPath,
    targetRoot: oddConsumerRoot,
    verifiedArtifact: verifiedOdd,
    resolvedLock: lock,
  });
  const oddInstall = await installCallsite.callable(installOddRequest);
  assert.equal(oddInstall.disposition, "materialized", JSON.stringify(oddInstall));
  assert.notEqual(abiInstall.installedRoot, oddInstall.installedRoot);
  const installNativeChildren = [
    nativeChildEvidence(bootstrap.product, {
      callsite: installCallsite,
      request: installAbiRequest,
      output: abiInstall,
      dependencyCoordinates: [lock.lockId, lock.lockDigest],
      resourceCoordinates: [abiArtifactPath, abiInstall.installedRoot],
      effectCoordinates: [abiInstall.installId, abiInstall.productContentDigest],
    }),
    nativeChildEvidence(bootstrap.product, {
      callsite: installCallsite,
      request: installOddRequest,
      output: oddInstall,
      dependencyCoordinates: [lock.lockId, lock.lockDigest],
      resourceCoordinates: [oddArtifactPath, oddInstall.installedRoot],
      effectCoordinates: [oddInstall.installId, oddInstall.productContentDigest],
    }),
  ];

  const installed = await loadAbiPublic(abiInstall.installedRoot, {
    identity: "execution",
    includeCliRoot: true,
  });
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
  const publicFamilyEvidence = assertFullPublicFamilyClosure({
    installedPublic,
    coordinates: verifiedAbi.definitionContractCoordinates,
    ownerModules,
    product,
  });

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
  const admitInstallCallsite = resolvePublicCallsite(
    installed,
    "./abg",
    "admitProductInstall",
  );
  for (const [index, candidate] of installs.entries()) {
    const installAdmissionBasis = Object.freeze({
      ...publicOperationBasis(
        product,
        "abg.operation.product.install",
        "install",
        candidate.installId,
        candidate.productContentDigest,
        `invocation://odd-glc/t041/install-${index}`,
      ),
      predecessorPrefix: prefix,
    });
    const admission = admitInstallCallsite.callable(
      openStore,
      candidate,
      installAdmissionBasis,
      lock,
    );
    assert.equal(admission.kind, "artifact_owner_result", JSON.stringify(admission));
    installNativeChildren.push(nativeChildEvidence(product, {
      callsite: admitInstallCallsite,
      request: Object.freeze({
        install: candidate,
        operationBasis: installAdmissionBasis,
        resolvedLock: lock,
      }),
      output: admission,
      dependencyCoordinates: [lock.lockId, lock.lockDigest],
      resourceCoordinates: [candidate.installId, acquired.prefix.eventLogRef],
      effectCoordinates: [admission.value.admissionEventRef],
      admissionCoordinate: admission.value.admissionEventRef,
      predecessorPrefix: prefix,
      successorPrefix: admission.successorPrefix,
    }));
    admittedInstalls.push(admission.value);
    if (index === 0) abiOnlyArtifactTruth = admission.artifactTruth;
    prefix = admission.successorPrefix;
  }
  observeNativeStage("./product::installProduct", installNativeChildren);
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
  const constructBindingCallsite = resolvePublicCallsite(
    installed,
    "./product",
    "constructWorkspaceBinding",
  );
  const bindingPaths = Object.freeze({
    toolchainRoot: abiConsumerRoot,
    productRoot: oddInstall.installedRoot,
    eventLogRoot: path.join(workspaceRoot, ".ai-workspace/events"),
    runtimeStateRoot: path.join(workspaceRoot, ".ai-workspace/runtime"),
    projectionRoot: path.join(workspaceRoot, ".ai-workspace/projections"),
    archiveRoot: path.join(workspaceRoot, ".ai-workspace/archive"),
  });
  const bindingCandidate = constructBindingCallsite.callable(
    workspaceAuthority,
    productSet,
    lock,
    bindingPaths,
  );
  assert.equal(bindingCandidate.kind, "workspace_binding_candidate");
  const bindAdmissionCallsite = resolvePublicCallsite(
    installed,
    "./abg",
    "admitWorkspaceBinding",
  );
  const bindingOperationBasis = Object.freeze({
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
  });
  const bindingAdmission = bindAdmissionCallsite.callable(
    openStore,
    bindingCandidate,
    bindingOperationBasis,
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
  observeNativeStage("./abg::admitWorkspaceBinding", [
    nativeChildEvidence(product, {
      callsite: constructBindingCallsite,
      request: Object.freeze({
        workspaceAuthority,
        productSet,
        resolvedLock: lock,
        paths: bindingPaths,
      }),
      output: bindingCandidate,
      dependencyCoordinates: [productSet.productSetId, lock.lockId],
      resourceCoordinates: Object.values(bindingPaths),
      effectCoordinates: [bindingCandidate.bindingId, bindingCandidate.bindingDigest],
    }),
    nativeChildEvidence(product, {
      callsite: bindAdmissionCallsite,
      request: Object.freeze({
        bindingCandidate,
        operationBasis: bindingOperationBasis,
        workspaceAuthority,
      }),
      output: bindingAdmission,
      dependencyCoordinates: admittedInstalls.map((install) => install.installId),
      resourceCoordinates: [acquired.prefix.eventLogRef],
      effectCoordinates: [workspaceBinding.admissionEventRef],
      admissionCoordinate: workspaceBinding.admissionEventRef,
      predecessorPrefix: prefix,
      successorPrefix: bindingAdmission.successorPrefix,
    }),
  ]);

  const abiPublication = gtl.constructHelloWorldModulePublication({
    productId: verifiedAbi.productId,
    artifactDigest: verifiedAbi.artifactDigest,
    productContentDigest: verifiedAbi.productContentDigest,
    productManifestDigest: verifiedAbi.manifestDigest,
    packageName: verifiedAbi.packageName,
    packageVersion: verifiedAbi.packageVersion,
  });
  const oddPublicationLoad = await loadOddPublicationData(oddInstall.installedRoot);
  const oddData = oddPublicationLoad.publication;
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
  const catalogAdmitCallsite = resolvePublicCallsite(
    installed,
    "./product",
    "admitGraphFunctionCatalog",
  );
  const catalogAdmitRequest = Object.freeze({
    workspaceBinding: bindingCandidate,
    resolvedLock: lock,
    verifiedProducts,
    installedProducts: installs,
    publications,
  });
  const catalog = catalogAdmitCallsite.callable(catalogAdmitRequest);
  assert.equal(catalog.kind, "graph_function_catalog", JSON.stringify(catalog));
  assert.equal(
    catalog.rowDispositions.find((row) => row.handle === ODD.graphFunctionRef)
      ?.disposition,
    "admitted",
  );
  observeNativeStage("./product::admitGraphFunctionCatalog", [
    nativeChildEvidence(product, {
      callsite: catalogAdmitCallsite,
      request: catalogAdmitRequest,
      output: catalog,
      dependencyCoordinates: [lock.lockId, workspaceBinding.bindingId],
      resourceCoordinates: publications.map((publication) => publication.moduleRef),
      effectCoordinates: [catalog.basisDigest],
      admissionCoordinate: catalog.basisDigest,
    }),
  ]);
  const catalogViewCallsite = resolvePublicCallsite(
    installed,
    "./product",
    "narrowGraphFunctionCatalog",
  );
  const catalogViewRequest = Object.freeze({
    catalog,
    allowlist: Object.freeze([ODD.graphFunctionRef]),
  });
  const catalogView = catalogViewCallsite.callable(
    catalog,
    catalogViewRequest.allowlist,
  );
  assert.equal(catalogView.kind, "graph_function_catalog_view");
  assert.deepEqual(catalogView.allowlist, [ODD.graphFunctionRef]);
  assert.equal(catalogView.entries.length, 1);
  observeNativeStage("./product::narrowGraphFunctionCatalog", [
    nativeChildEvidence(product, {
      callsite: catalogViewCallsite,
      request: catalogViewRequest,
      output: catalogView,
      dependencyCoordinates: [catalog.basisDigest],
      effectCoordinates: [catalogView.viewDigest],
    }),
  ]);

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
  const semanticsBinding = resolution.programPublication.productSemanticsBinding;
  const semanticsOwnerInstall = exact(
    resolution.ownerInstalls,
    (install) =>
      install.installId === resolution.declarationClosure.semanticsOwner.installId &&
      install.productId === resolution.declarationClosure.semanticsOwner.productId,
    "returned semantics owner install",
  );
  const semanticsOwnerLoad = await loadReturnedInstalledOwnerExport({
    install: semanticsOwnerInstall,
    binding: semanticsBinding,
    graphIdentity: "semantics",
  });
  assert.equal(semanticsOwnerLoad.value, resolution.productSemantics);
  assert.equal(semanticsOwnerLoad.value.kind, "product_semantics_provider");
  const implementationRow = resolution.implementationSetCandidate.rows[0];
  const implementationDescriptor = exact(
    resolution.packagedImplementations,
    (descriptor) =>
      descriptor.implementationRef === implementationRow.implementationRef &&
      descriptor.descriptorDigest ===
        implementationRow.implementationDescriptorDigest,
    "returned selected Implementation descriptor",
  );
  assert.equal(implementationDescriptor.modulePath, implementationRow.modulePath);
  assert.equal(implementationDescriptor.namedSymbol, implementationRow.namedSymbol);
  const implementationOwnerInstall = exact(
    resolution.ownerInstalls,
    (install) =>
      install.productId === implementationRow.implementationOwnerProductId &&
      install.packageName === implementationDescriptor.packageName &&
      install.packageVersion === implementationDescriptor.packageVersion,
    "returned Implementation owner install",
  );
  const implementationOwnerLoad = await loadReturnedInstalledOwnerExport({
    install: implementationOwnerInstall,
    binding: implementationDescriptor,
    graphIdentity: "implementation",
  });
  assert.equal(typeof implementationOwnerLoad.value, "function");
  const returnedOwnerLoadEvidence = Object.freeze({
    semantics: semanticsOwnerLoad.evidence,
    implementation: implementationOwnerLoad.evidence,
  });
  const absentAllowlist = catalogView.allowlist.filter(
    (handle) => handle !== ODD.graphFunctionRef,
  );
  assert.deepEqual(catalogView.allowlist, [ODD.graphFunctionRef]);
  assert.deepEqual(absentAllowlist, []);
  const removedCatalogHandles = catalogView.allowlist.filter(
    (handle) => !absentAllowlist.includes(handle),
  );
  assert.deepEqual(removedCatalogHandles, [ODD.graphFunctionRef]);
  const absentCatalogView = catalogViewCallsite.callable(catalog, absentAllowlist);
  assert.equal(absentCatalogView.kind, "graph_function_catalog_view");
  assert.equal(absentCatalogView.catalogBasisDigest, catalog.basisDigest);
  assert.deepEqual(absentCatalogView.allowlist, []);
  assert.deepEqual(absentCatalogView.entries, []);
  const absentSelection = await product.ProductExecutionResolutionPort.resolve({
    catalog,
    catalogView: absentCatalogView,
    admittedInstalls,
    verifyInstallAdmission: (install) =>
      abg.hasAdmittedProductInstall(artifactTruth, install),
    programRef: ODD.programRef,
    selection: sunnySelection,
  });
  assert.equal(absentSelection.kind, "product_execution_resolution_refusal");
  assert.equal(absentSelection.code, "absent");
  assert.equal(absentSelection.stage, "catalog");
  const selectedCatalogHandle = resolution.resolution.graphFunctionRef;
  assert.equal(selectedCatalogHandle, ODD.graphFunctionRef);
  assert.equal(selectedCatalogHandle, removedCatalogHandles[0]);
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
      selectedCatalogHandle,
      removedCatalogHandles: Object.freeze([...removedCatalogHandles]),
      resultingAllowlist: Object.freeze([...absentCatalogView.allowlist]),
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
  const preStartEventBytes = await readFile(
    new URL(setupHandoff.prefix.eventLogRef),
  );
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
  const transportRawExchanges = [];
  const startReceipt = await runInstalledCli({
    scratch,
    installedRoot: abiInstall.installedRoot,
    packageJson: installed.packageJson,
    identity: "start",
    call: startCall,
    rawJsonLines: transportJsonLines,
    rawExchanges: transportRawExchanges,
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
      rawExchanges: transportRawExchanges,
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
  assert.equal(
    fresh.publicRealModuleRef,
    executionModuleEvidence.find(({ packageExportPath }) =>
      packageExportPath === "./public").realModuleURL,
  );
  assert.equal(fresh.receipts.length, 3);
  for (const [index, receipt] of fresh.receipts.entries()) {
    assert.deepEqual(receipt.ownerOutput, readReceipts[index].ownerOutput);
    assert.deepEqual(receipt.resources, readReceipts[index].resources);
  }
  assert.deepEqual(
    await readFile(new URL(terminalPrefix.eventLogRef)),
    terminalBytes,
  );
  assert.equal(fresh.eventLogObservation.eventLogRef, terminalPrefix.eventLogRef);
  assert.equal(fresh.eventLogObservation.appendedByteLength, 0);
  for (const phase of ["before", "after"]) {
    const evidence = fresh.eventLogObservation[phase];
    const bytes = Buffer.from(evidence.bytes, evidence.encoding);
    assert.deepEqual(bytes, terminalBytes);
    assert.equal(bytes.length, evidence.byteLength);
    assert.equal(`sha256:${sha256Hex(bytes)}`, evidence.sha256);
  }
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
      input: crossedAcquisition.input,
      output: crossedAcquisition.output,
    }),
    Object.freeze({
      identity: "matching_stale_owner_issued_handoff",
      exitCode: staleResource.outcome.receipt.exitCode,
      faultStage: staleResource.outcome.receipt.failure.fault.stage,
      faultCode: staleResource.outcome.receipt.failure.fault.code,
      input: staleResource.input,
      output: staleResource.output,
    }),
    Object.freeze({
      identity: "malformed_resource_assertion",
      exitCode: malformedResource.outcome.receipt.exitCode,
      faultStage: malformedResource.outcome.receipt.failure.fault.stage,
      faultCode: malformedResource.outcome.receipt.failure.fault.code,
      input: malformedResource.input,
      output: malformedResource.output,
    }),
    Object.freeze({
      identity: "stale_projection_basis",
      exitCode: staleProjection.outcome.receipt.exitCode,
      refusalCode: staleProjection.outcome.receipt.ownerOutput.value.code,
      input: staleProjection.input,
      output: staleProjection.output,
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
  assert.equal(transportRawExchanges.length, 4);
  const productGitBasis = await exactProductGitBasis();
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
      productGit: productGitBasis,
    }),
    archive: Object.freeze({
      members: oddPack.archiveMembers,
      typedHeaders: oddPack.typedArchiveHeaders,
      tarball: rawBytesEvidence(await readFile(oddPack.artifactPath)),
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
      oddPublication: structuredClone(oddPublicationLoad.moduleEvidence),
    }),
    moduleGraphEvidence: Object.freeze({
      bootstrap: structuredClone(bootstrap.moduleGraphEvidence),
      execution: structuredClone(installed.moduleGraphEvidence),
      oddPublication: structuredClone(oddPublicationLoad.moduleGraphEvidence),
    }),
    publicFamily: structuredClone(publicFamilyEvidence),
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
      returnedOwnerLoadEvidence: structuredClone(returnedOwnerLoadEvidence),
    }),
    nativeOwnerStageObservations: structuredClone(nativeStageObservations),
    transportedDefinitionKeys: structuredClone(transportedDefinitionKeys),
    transportedJsonLines: Object.freeze([...transportJsonLines]),
    transportedRawExchanges: structuredClone(transportRawExchanges),
    resolutionBoundaryObservations:
      structuredClone(resolutionBoundaryObservations),
    transportBoundaryObservations:
      structuredClone(transportBoundaryObservations),
    freshProcessStdout: freshStdout,
    runtimeEventLog: Object.freeze({
      eventLogRef: terminalPrefix.eventLogRef,
      preStart: rawBytesEvidence(preStartEventBytes),
      postStart: rawBytesEvidence(terminalBytes),
      postRead: rawBytesEvidence(
        await readFile(new URL(terminalPrefix.eventLogRef)),
      ),
    }),
    authenticatedRuntimeObservation: Object.freeze({
      startDisposition: startReceipt.ownerOutput.value.disposition,
      runtimeStatus: statusReceipt.ownerOutput.value.projection.status,
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
  await writeFile(rawReceiptPath, `${JSON.stringify(rawObservation)}\n`, {
    flag: "wx",
  });
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
      ({ input: _input, output: _output, ...observation }) => observation,
    ),
  }));
});
