import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { isDeepStrictEqual, promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const TEST_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(TEST_ROOT, "../../../..");
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
  "package/build/publication.json",
  "package/contracts/capabilities/capability-definition-graph.json",
  "package/contracts/public-contract-catalog.schema.json",
  "package/package.json",
  "package/product-toolchain-manifest.json",
]);
const ABI_PUBLIC_EXPORT_PATHS = Object.freeze([
  ".",
  "./abg",
  "./gtl",
  "./hog",
  "./product",
  "./public",
  "./validator",
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
const PRODUCT_BLOBS = Object.freeze({
  "build_tenants/odd_glc/typescript/product/build/publication.json":
    "3669af8fcf038b5648a814fa213f563f62ccd592",
  "build_tenants/odd_glc/typescript/product/contracts/capabilities/capability-definition-graph.json":
    "c26a33f123bc4eca4ef4032c9c1658f4305477ba",
  "build_tenants/odd_glc/typescript/product/contracts/public-contract-catalog.schema.json":
    "72d93bd0f09152af6955a9f618ae89bc31b7bacb",
  "build_tenants/odd_glc/typescript/product/package.json":
    "c3ee1c472c2f6aa42cf112e202fb0311b73e7a15",
  "build_tenants/odd_glc/typescript/product/product-toolchain-manifest.json":
    "ba2e02ce56f92a3e2524537b30b239b4a9e00df5",
});
const PRODUCT_SHA256 = Object.freeze({
  "build_tenants/odd_glc/typescript/product/build/publication.json":
    "1803fed3bd31e39642107afd1209ff2349ae402ed7125ffcaeafd4d78578b42c",
  "build_tenants/odd_glc/typescript/product/contracts/capabilities/capability-definition-graph.json":
    "f664ed939704a5573a2f5151eccb86532c777eda6d5b927454f65ca839363bd0",
  "build_tenants/odd_glc/typescript/product/contracts/public-contract-catalog.schema.json":
    "61e568843e73d95da3e018d7fb42c3dc4524ac1ed199efff6e84b902ad277deb",
  "build_tenants/odd_glc/typescript/product/package.json":
    "73d038fccebbf19ab12639b9d93b8555996efe7468111ca8b45eb8b611c4d919",
  "build_tenants/odd_glc/typescript/product/product-toolchain-manifest.json":
    "c09897a8e7dd9d8ac8214464e825ea9ff4e7fefd73b6430a3af96693a1ce9cd5",
});
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
const MODULE_GRAPH_PARSER_SOURCES = Object.freeze({
  crossOwner: Object.freeze({
    byteLength: 2685,
    sha256:
      "sha256:7f66a6fca4940d116eef9f365754e40fefd704dd49d17d248a1e193631ad94db",
  }),
  freshReader: Object.freeze({
    byteLength: 2657,
    sha256:
      "sha256:cda4561e1cc5322feb5149099a77bac7d8d0929e877161be877cdead109a994c",
  }),
});
const SOURCE_CENSUS_PARSER_SOURCE = Object.freeze({
  byteLength: 374,
  sha256:
    "sha256:59275156d59852755dffb5a5b31480794b150f4149f28bfeaf119390c6d65e25",
});
const PREDECESSOR_GIT_OBJECTS = Object.freeze([
  Object.freeze({
    evidenceKey: "oddProductTarball",
    repository: "odd_glc",
    tag: "v0.1.0",
    tagCommit: "a878475e4609e2d74d3260eb36ee05c4657b1879",
    repositoryPath:
      "release_snapshots/odd-glc-route-one-typescript/0.1.0/odd-glc-route-one-typescript-0.1.0.tgz",
    blobId: "6be7a24b19327db73de9b1e2293c31c326bc308d",
  }),
  Object.freeze({
    evidenceKey: "oddReleaseManifest",
    repository: "odd_glc",
    tag: "v0.1.0",
    tagCommit: "a878475e4609e2d74d3260eb36ee05c4657b1879",
    repositoryPath:
      "release_snapshots/odd-glc-route-one-typescript/0.1.0/release-snapshot-manifest.json",
    blobId: "69c25985b3fc1fbfb14505ad2cda0d213694eae8",
  }),
  Object.freeze({
    evidenceKey: "installedLiveProof",
    repository: "odd_glc",
    tag: "v0.1.0",
    tagCommit: "a878475e4609e2d74d3260eb36ee05c4657b1879",
    repositoryPath:
      "release_snapshots/odd-glc-route-one-typescript/0.1.0/qualification/odd-glc-basic-cli-live-proof.json",
    blobId: "8385ce95de21148706a37301bae530ebbb5c3f9a",
  }),
  Object.freeze({
    evidenceKey: "abiTarball",
    repository: "abiogenesis",
    tag: "v4.6.0-rc.3",
    tagCommit: "f4f081f66ef8d3ce0c737ddb9d7530176711279a",
    repositoryPath:
      "release_snapshots/abiogenesis-typescript-tenant/4.6.0-rc.3/abiogenesis-typescript-tenant-4.6.0-rc.3.tgz",
    blobId: "22bb1ce593f9fed533cec50afbf7af4fe30a0fe8",
  }),
  Object.freeze({
    evidenceKey: "abiReleaseManifest",
    repository: "abiogenesis",
    tag: "v4.6.0-rc.3",
    tagCommit: "f4f081f66ef8d3ce0c737ddb9d7530176711279a",
    repositoryPath:
      "release_snapshots/abiogenesis-typescript-tenant/4.6.0-rc.3/release-snapshot-manifest.json",
    blobId: "6b99656573b5082d14fadfeb42dbe6e61d3617f8",
  }),
]);

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function gitBlobId(bytes) {
  return createHash("sha1")
    .update(Buffer.from(`blob ${bytes.length}\0`))
    .update(bytes)
    .digest("hex");
}

async function readExactJson(root, relativePath, expectedDigest) {
  const bytes = await readFile(path.join(root, relativePath));
  assert.equal(sha256Hex(bytes), expectedDigest, relativePath);
  return Object.freeze({
    bytes,
    raw: rawBytesEvidence(bytes),
    value: JSON.parse(bytes),
  });
}

function rawBytesEvidence(bytes) {
  return Object.freeze({
    encoding: "base64",
    bytes: bytes.toString("base64"),
    byteLength: bytes.length,
    sha256: `sha256:${sha256Hex(bytes)}`,
  });
}

function assertRawBytesEvidence(evidence, expectedBytes = null) {
  assert.deepEqual(Object.keys(evidence).sort(), [
    "byteLength",
    "bytes",
    "encoding",
    "sha256",
  ]);
  assert.equal(evidence.encoding, "base64");
  const bytes = Buffer.from(evidence.bytes, evidence.encoding);
  assert.equal(bytes.length, evidence.byteLength);
  assert.equal(`sha256:${sha256Hex(bytes)}`, evidence.sha256);
  if (expectedBytes !== null) assert.deepEqual(bytes, expectedBytes);
  return bytes;
}

function parseExactRawJsonlEvidence(evidence, label) {
  const bytes = assertRawBytesEvidence(evidence);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.equal(text.endsWith("\n"), true, `${label} newline terminator`);
  const line = text.slice(0, -1);
  assert.notEqual(line.length, 0, `${label} nonempty record`);
  assert.equal(/[\r\n]/u.test(line), false, `${label} single record`);
  const value = JSON.parse(line);
  assert.equal(text, `${JSON.stringify(value)}\n`, `${label} exact JSONL`);
  return Object.freeze({ bytes, line, value });
}

function modulePathFromURL(moduleURL) {
  const parsed = new URL(moduleURL);
  parsed.search = "";
  parsed.hash = "";
  return path.normalize(fileURLToPath(parsed));
}

function assertClosedModuleGraphEvidence(
  graph,
  expectedSeedKinds,
  expectedGeneratedSeedKinds,
  expectedParserSource,
  label,
) {
  assertExactKeys(graph, [
    "boundaries", "edges", "kind", "nodes", "parser", "schemaVersion",
    "seeds", "unresolvedEdges",
  ], `${label} graph keyset`);
  assert.equal(graph.kind, "closed_static_module_graph");
  assert.equal(graph.schemaVersion, "1");
  assert.equal(graph.parser, "node:vm.SourceTextModule+import.meta.resolve");
  assert.deepEqual(graph.unresolvedEdges, []);
  assert.deepEqual(graph.seeds.map(({ kind }) => kind), expectedSeedKinds);
  assertExactKeys(graph.boundaries, [
    "generatedModuleURLs", "installedRootURLs",
  ], `${label} graph boundaries`);
  const generatedPaths = graph.boundaries.generatedModuleURLs.map(modulePathFromURL);
  const installedRootPaths = graph.boundaries.installedRootURLs.map(modulePathFromURL);
  for (const installedRootPath of installedRootPaths) {
    const relativeToSource = path.relative(SOURCE_ROOT, installedRootPath);
    assert.equal(
      relativeToSource === ".." ||
        relativeToSource.startsWith(`..${path.sep}`),
      true,
      `${label} installed root escaped into source checkout`,
    );
  }
  const nodeURLs = new Set(graph.nodes.map(({ moduleURL }) => moduleURL));
  assert.equal(nodeURLs.size, graph.nodes.length, `${label} unique nodes`);
  for (const seed of graph.seeds) assert.equal(nodeURLs.has(seed.moduleURL), true);
  assert.deepEqual(
    graph.boundaries.generatedModuleURLs,
    expectedGeneratedSeedKinds.map((kind) => {
      const seed = graph.seeds.find((candidate) => candidate.kind === kind);
      assert.ok(seed, `${label} generated boundary seed ${kind}`);
      assert.equal(nodeURLs.has(seed.moduleURL), true);
      return seed.moduleURL;
    }),
    `${label} exact generated boundary roster`,
  );
  const parserSeeds = graph.seeds.filter(
    ({ kind }) => kind.endsWith("_generated_module_graph_parser"),
  );
  assert.equal(parserSeeds.length, 1, `${label} parser seed`);
  const [parserSeed] = parserSeeds;
  assert.equal(
    graph.boundaries.generatedModuleURLs.includes(parserSeed.moduleURL),
    true,
    `${label} generated parser boundary`,
  );
  const forbiddenSegments = [["test", "env"].join("_"), "private"];
  const outgoingCounts = new Map();
  for (const edge of graph.edges) {
    assertExactKeys(edge, [
      "attributes", "fromModuleURL", "phase", "specifier", "toModuleURL",
    ], `${label} static edge`);
    assert.equal(nodeURLs.has(edge.fromModuleURL), true);
    assert.equal(nodeURLs.has(edge.toModuleURL), true);
    assert.equal(typeof edge.specifier, "string");
    assert.equal(typeof edge.attributes, "object");
    assert.equal(edge.phase, "evaluation");
    outgoingCounts.set(
      edge.fromModuleURL,
      (outgoingCounts.get(edge.fromModuleURL) ?? 0) + 1,
    );
  }
  for (const node of graph.nodes) {
    assertExactKeys(node, [
      "mediaType", "moduleURL", "source", "staticRequestCount",
    ], `${label} module node`);
    assert.equal(
      node.staticRequestCount,
      outgoingCounts.get(node.moduleURL) ?? 0,
      `${label} unresolved static request at ${node.moduleURL}`,
    );
    if (node.mediaType === "runtime_builtin") {
      assert.equal(node.moduleURL.startsWith("node:"), true);
      assert.equal(node.source, null);
      continue;
    }
    assert.equal(
      node.mediaType === "javascript_module" || node.mediaType === "json_module",
      true,
    );
    assertRawBytesEvidence(node.source);
    const modulePath = modulePathFromURL(node.moduleURL);
    if (generatedPaths.includes(modulePath)) continue;
    const containingRoot = installedRootPaths.find((installedRootPath) => {
      const relative = path.relative(installedRootPath, modulePath);
      return !path.isAbsolute(relative) &&
        relative !== ".." && !relative.startsWith(`..${path.sep}`);
    });
    assert.ok(containingRoot, `${label} module escaped admitted roots: ${node.moduleURL}`);
    const relativeSegments = path.relative(containingRoot, modulePath).split(path.sep);
    assert.equal(
      forbiddenSegments.some((segment) => relativeSegments.includes(segment)),
      false,
      `${label} forbidden installed module path`,
    );
  }
  const parserNode = graph.nodes.find(
    ({ moduleURL }) => moduleURL === parserSeed.moduleURL,
  );
  assert.ok(parserNode, `${label} parser node`);
  assert.equal(parserNode.mediaType, "javascript_module");
  assert.equal(parserNode.staticRequestCount, 5);
  assert.equal(parserNode.source.byteLength, expectedParserSource.byteLength);
  assert.equal(parserNode.source.sha256, expectedParserSource.sha256);
  assert.equal(
    assertRawBytesEvidence(parserNode.source).length,
    expectedParserSource.byteLength,
  );
  assert.deepEqual(
    graph.edges
      .filter(({ fromModuleURL }) => fromModuleURL === parserSeed.moduleURL)
      .map(({ specifier, toModuleURL }) => [specifier, toModuleURL])
      .sort((left, right) => left[0].localeCompare(right[0])),
    [
      ["node:crypto", "node:crypto"],
      ["node:fs/promises", "node:fs/promises"],
      ["node:path", "node:path"],
      ["node:url", "node:url"],
      ["node:vm", "node:vm"],
    ],
    `${label} parser static edges`,
  );
  return graph;
}

function assertExactKeys(value, expected, label) {
  assert.deepEqual(Object.keys(value).sort(), [...expected].sort(), label);
}

async function parseStaticModuleGraph(filePaths) {
  const parserSource = [
    `import { readFile } from "node:fs/promises";`,
    `import vm from "node:vm";`,
    `const rows = [];`,
    `for (const filePath of process.argv.slice(2)) {`,
    `  const source = await readFile(filePath, "utf8");`,
    `  const module = new vm.SourceTextModule(source, { identifier: filePath });`,
    `  rows.push({ filePath, moduleRequests: module.moduleRequests });`,
    `}`,
    `process.stdout.write(JSON.stringify(rows));`,
  ].join("\n");
  const parserRoot = await mkdtemp(
    path.join(os.tmpdir(), "odd-glc-t041-source-census-parser-"),
  );
  const parserPath = path.join(parserRoot, "parser.mjs");
  const parserSourceBytes = Buffer.from(parserSource);
  await writeFile(parserPath, parserSourceBytes);
  const parserModuleURL = pathToFileURL(await realpath(parserPath)).href;
  const parsedFilePaths = [parserPath, ...filePaths];
  try {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [
        "--experimental-vm-modules",
        "--no-warnings",
        parserPath,
        ...parsedFilePaths,
      ],
      { maxBuffer: 20 * 1024 * 1024 },
    );
    assert.equal(stderr, "");
    const rows = JSON.parse(stdout);
    assert.deepEqual(rows.map(({ filePath }) => filePath), parsedFilePaths);
    assert.deepEqual(await readFile(parserPath), parserSourceBytes);
    const [parserRow, ...proofRows] = rows;
    assert.deepEqual(
      parserRow.moduleRequests.map(({ specifier }) => specifier).sort(),
      ["node:fs/promises", "node:vm"],
    );
    assert.equal(
      parserRow.moduleRequests.every((request) =>
        request.phase === "evaluation" &&
        typeof request.attributes === "object"),
      true,
    );
    return Object.freeze({
      parser: Object.freeze({
        moduleURL: parserModuleURL,
        source: rawBytesEvidence(parserSourceBytes),
        parsedStaticModuleRequests: Object.freeze(parserRow.moduleRequests),
      }),
      proofRows: Object.freeze(proofRows),
    });
  } finally {
    await rm(parserRoot, { recursive: true, force: true });
  }
}

async function sourceBlindCensus() {
  const prohibitedTokens = Object.freeze([
    ["developer", "mini", "product"].join("-"),
    ["test", "env"].join("_"),
    ["abi5", "program"].join("_"),
    ["Root", "Public", "Invocation"].join(""),
    ["legacy", "Request"].join(""),
  ]);
  const filePaths = PROOF_FILES.map((relativePath) =>
    path.join(TEST_ROOT, relativePath));
  const parsedGraph = await parseStaticModuleGraph(filePaths);
  const parsedModules = parsedGraph.proofRows;
  const files = [];
  const parserSourceBytes = assertRawBytesEvidence(parsedGraph.parser.source);
  assert.equal(parserSourceBytes.length, SOURCE_CENSUS_PARSER_SOURCE.byteLength);
  assert.equal(
    parsedGraph.parser.source.sha256,
    SOURCE_CENSUS_PARSER_SOURCE.sha256,
  );
  const parserEdges = parsedGraph.parser.parsedStaticModuleRequests.map(
    (request) => Object.freeze({
      fromModuleURL: parsedGraph.parser.moduleURL,
      specifier: request.specifier,
      attributes: Object.freeze(request.attributes),
      phase: request.phase,
      toModuleURL: request.specifier,
      kind: "static_import",
    }),
  );
  assert.deepEqual(
    parserEdges.map(({ specifier, toModuleURL }) => [specifier, toModuleURL])
      .sort((left, right) => left[0].localeCompare(right[0])),
    [
      ["node:fs/promises", "node:fs/promises"],
      ["node:vm", "node:vm"],
    ],
  );
  const edges = [...parserEdges];
  for (const [index, relativePath] of PROOF_FILES.entries()) {
    const bytes = await readFile(filePaths[index]);
    const source = bytes.toString("utf8");
    const moduleRequests = parsedModules[index].moduleRequests;
    const specifiers = moduleRequests.map(({ specifier }) => specifier);
    assert.equal(moduleRequests.length > 0, true, relativePath);
    assert.equal(
      specifiers.every((specifier) => specifier.startsWith("node:")),
      true,
      `${relativePath}: ${JSON.stringify(specifiers)}`,
    );
    const prohibitedTokenHits = prohibitedTokens.filter((token) =>
      source.includes(token));
    assert.deepEqual(prohibitedTokenHits, [], relativePath);
    edges.push(...moduleRequests.map((request) => Object.freeze({
      fromModuleURL: relativePath,
      specifier: request.specifier,
      attributes: Object.freeze(request.attributes),
      phase: request.phase,
      toModuleURL: request.specifier,
      kind: "static_import",
    })));
    files.push(Object.freeze({
      relativePath,
      source: rawBytesEvidence(bytes),
      parsedStaticModuleRequests: Object.freeze(moduleRequests),
      prohibitedTokenHits: Object.freeze(prohibitedTokenHits),
    }));
  }
  const builtins = [...new Set(edges.map(({ toModuleURL }) => toModuleURL))].sort();
  assert.equal(edges.every((edge) =>
    edge.toModuleURL.startsWith("node:") &&
    edge.phase === "evaluation" &&
    typeof edge.attributes === "object"), true);
  const staticModuleGraph = Object.freeze({
    parser: "node:vm.SourceTextModule",
    parserEntrypoint: parsedGraph.parser,
    seeds: Object.freeze([
      Object.freeze({
        kind: "source_census_generated_module_graph_parser",
        moduleURL: parsedGraph.parser.moduleURL,
      }),
      ...PROOF_FILES.map((relativePath) => Object.freeze({
        kind: "checked_in_proof_entrypoint",
        moduleURL: relativePath,
      })),
    ]),
    sourceNodes: Object.freeze([
      parsedGraph.parser.moduleURL,
      ...PROOF_FILES,
    ]),
    terminalBuiltinNodes: Object.freeze(builtins),
    edges: Object.freeze(edges),
    unresolvedEdges: Object.freeze([]),
    boundaries: Object.freeze({
      generatedModuleURLs: Object.freeze([parsedGraph.parser.moduleURL]),
      checkedInProofRootURL: pathToFileURL(TEST_ROOT).href,
    }),
    closed: true,
  });
  assert.equal(staticModuleGraph.seeds.length, 5);
  assert.equal(staticModuleGraph.sourceNodes.length, 5);
  assert.deepEqual(
    staticModuleGraph.boundaries.generatedModuleURLs,
    [staticModuleGraph.parserEntrypoint.moduleURL],
  );
  assert.equal(
    staticModuleGraph.seeds[0].moduleURL,
    staticModuleGraph.parserEntrypoint.moduleURL,
  );
  assert.equal(
    staticModuleGraph.edges.filter(({ fromModuleURL }) =>
      fromModuleURL === staticModuleGraph.parserEntrypoint.moduleURL).length,
    2,
  );
  assert.deepEqual(
    staticModuleGraph.parserEntrypoint.parsedStaticModuleRequests.map(
      ({ specifier }) => specifier).sort(),
    ["node:fs/promises", "node:vm"],
  );
  return Object.freeze({
    files: Object.freeze(files),
    staticModuleGraph,
    sourceOrPrivateImport: false,
    prohibitedCompatibilitySurface: false,
  });
}

let sourceCensusPromise = null;

function qualifiedSourceBlindCensus() {
  sourceCensusPromise ??= sourceBlindCensus();
  return sourceCensusPromise;
}

async function assertCreateOnlyDestination(destination, label) {
  assert.ok(destination, `${label} is required`);
  assert.equal(path.isAbsolute(destination), true, `${label} must be absolute`);
  try {
    await readFile(destination);
    assert.fail(`${label} must not already exist`);
  } catch (error) {
    assert.equal(error.code, "ENOENT", `${label} must be create-only`);
  }
}

function projectPredecessor({ receipt, releaseManifest, abiReleaseManifest, liveProof }) {
  assertExactKeys(receipt, [
    "kind", "schemaVersion", "basis", "rawEvidence", "observation", "nonclaims",
  ], "predecessor receipt keyset");
  assertExactKeys(receipt.basis, [
    "oddGlcTag", "oddGlcCommit", "oddGlcPackage", "oddGlcTarballSha256",
    "abiTag", "abiPackage", "abiTarballSha256",
  ], "predecessor basis keyset");
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
  assert.equal(releaseManifest.releaseTag, "v0.1.0");
  assert.equal(releaseManifest.sourceCommit, "70580b93166b1f9e33b7622512c2d5bd442469e2");
  assert.equal(releaseManifest.sourceRef, "main");
  assert.equal(releaseManifest.sourceDirty, false);
  assert.equal(releaseManifest.tarball.sha256, DIGESTS.odd01Tarball);
  assert.equal(releaseManifest.tarball.bytes, 24972);
  assert.equal(abiReleaseManifest.releaseIdentity, "4.6.0-rc.3");
  assert.equal(Object.hasOwn(abiReleaseManifest, "releaseTag"), false);
  assert.equal(abiReleaseManifest.rcBranch, "rc/4.6.0");
  assert.equal(abiReleaseManifest.sourceRef, "rc/4.6.0");
  assert.equal(
    abiReleaseManifest.sourceCommit,
    "5213301cdbfd35952badf19c27519caa9e7e6968",
  );
  assert.equal(abiReleaseManifest.sourceDirty, false);
  assert.equal(abiReleaseManifest.tarball.sha256, DIGESTS.abi46Tarball);
  assert.equal(abiReleaseManifest.tarball.bytes, 1196854);
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
  assertExactKeys(rawObservation, [
    "kind", "schemaVersion", "basis", "archive",
    "installedPublicModuleRefs", "installedPublicModuleEvidence",
    "moduleGraphEvidence", "publicFamily",
    "ownership", "nativeOwnerStageObservations", "transportedDefinitionKeys",
    "transportedJsonLines", "transportedRawExchanges",
    "resolutionBoundaryObservations", "transportBoundaryObservations",
    "freshProcessStdout", "runtimeEventLog", "authenticatedRuntimeObservation",
  ], "candidate raw observation keyset");
  assert.equal(rawObservation.kind, "odd_glc_abi5_installed_raw_observation");
  assert.equal(rawObservation.schemaVersion, "1");
  assertExactKeys(rawObservation.basis, [
    "abiPackage", "abiProductId", "abiTarballSha256", "oddPackage",
    "oddProductId", "oddTarballSha256", "productGit",
  ], "candidate basis keyset");
  const { productGit, ...candidatePackageBasis } = rawObservation.basis;
  assert.deepEqual(candidatePackageBasis, {
    abiPackage: "@abiogenesis/typescript-tenant@5.0.0-dev.286",
    abiProductId: "product://abiogenesis/typescript-tenant@5.0.0-dev.286",
    abiTarballSha256: DIGESTS.abi5Tarball,
    oddPackage: "@odd-glc/route-one-typescript@0.2.0-dev.1",
    oddProductId: "product://odd_glc/route-one-typescript@0.2.0-dev.1",
    oddTarballSha256:
      "deb2e92f9944caca76cb5f7b8f4d2df99a6bddd41c8eb103c731ba7f50076f4c",
  });
  assert.match(productGit.headCommit, /^[0-9a-f]{40}$/u);
  assert.equal(
    productGit.admittedImplementationDonor,
    "6af27f0eae673cd1fbdb97c861f97803dbe920bf",
  );
  assert.equal(productGit.productBlobs.length, 5);
  assert.deepEqual(
    Object.fromEntries(productGit.productBlobs.map(
      ({ repositoryPath, blobId }) => [repositoryPath, blobId])),
    PRODUCT_BLOBS,
  );
  assert.deepEqual(
    Object.fromEntries(productGit.productBlobs.map(
      ({ repositoryPath, sha256 }) => [repositoryPath, sha256])),
    PRODUCT_SHA256,
  );
  assertExactKeys(rawObservation.archive, [
    "executableOrDeclarationMemberCount", "members", "tarball", "typedHeaders",
  ], "candidate archive evidence keyset");
  assert.deepEqual(rawObservation.archive.members, ARCHIVE_MEMBERS);
  assert.deepEqual(
    rawObservation.archive.typedHeaders,
    ARCHIVE_MEMBERS.map((archivePath) => ({
      path: archivePath,
      type: "regular_file",
    })),
  );
  assert.equal(
    assertRawBytesEvidence(rawObservation.archive.tarball).length,
    2230,
  );
  assert.equal(
    rawObservation.archive.tarball.sha256,
    "sha256:deb2e92f9944caca76cb5f7b8f4d2df99a6bddd41c8eb103c731ba7f50076f4c",
  );
  assert.equal(rawObservation.archive.executableOrDeclarationMemberCount, 0);
  const moduleEvidence = [
    ...rawObservation.installedPublicModuleEvidence.bootstrap,
    ...rawObservation.installedPublicModuleEvidence.execution,
    rawObservation.installedPublicModuleEvidence.oddPublication,
  ];
  assert.equal(moduleEvidence.length, 15);
  assert.deepEqual(
    rawObservation.installedPublicModuleEvidence.bootstrap.map(
      ({ packageExportPath }) => packageExportPath),
    ABI_PUBLIC_EXPORT_PATHS,
  );
  assert.deepEqual(
    rawObservation.installedPublicModuleEvidence.execution.map(
      ({ packageExportPath }) => packageExportPath),
    ABI_PUBLIC_EXPORT_PATHS,
  );
  assert.equal(
    moduleEvidence.every((row) =>
      row.containedInInstalledPackage === true &&
      row.outsideEverySourceCheckout === true &&
      typeof row.resolvedURL === "string" &&
      typeof row.realModuleURL === "string" &&
      !path.posix.isAbsolute(row.packageRelativeTarget) &&
      row.packageRelativeTarget !== ".." &&
      !row.packageRelativeTarget.startsWith("../")),
    true,
  );
  assertExactKeys(rawObservation.moduleGraphEvidence, [
    "bootstrap", "execution", "oddPublication",
  ], "runtime module graph roster");
  const publicKeys = ["root", "abg", "gtl", "hog", "product", "public", "validator"];
  const bootstrapGraph = assertClosedModuleGraphEvidence(
    rawObservation.moduleGraphEvidence.bootstrap,
    [
      "bootstrap_generated_module_graph_parser",
      "bootstrap_generated_abi_bridge",
      ...publicKeys.map((key) => `bootstrap_abi_public_export_${key}`),
    ],
    [
      "bootstrap_generated_module_graph_parser",
      "bootstrap_generated_abi_bridge",
    ],
    MODULE_GRAPH_PARSER_SOURCES.crossOwner,
    "bootstrap ABI",
  );
  const executionGraph = assertClosedModuleGraphEvidence(
    rawObservation.moduleGraphEvidence.execution,
    [
      "execution_generated_module_graph_parser",
      "execution_generated_abi_bridge",
      ...publicKeys.map((key) => `execution_abi_public_export_${key}`),
      "execution_abi_cli_transport_root",
    ],
    [
      "execution_generated_module_graph_parser",
      "execution_generated_abi_bridge",
    ],
    MODULE_GRAPH_PARSER_SOURCES.crossOwner,
    "execution ABI",
  );
  const oddPublicationGraph = assertClosedModuleGraphEvidence(
    rawObservation.moduleGraphEvidence.oddPublication,
    [
      "execution_generated_odd_publication_module_graph_parser",
      "execution_generated_odd_publication_bridge",
      "execution_odd_json_publication_terminal",
    ],
    [
      "execution_generated_odd_publication_module_graph_parser",
      "execution_generated_odd_publication_bridge",
    ],
    MODULE_GRAPH_PARSER_SOURCES.crossOwner,
    "installed odd publication",
  );
  for (const [identity, graph, rows] of [
    ["bootstrap", bootstrapGraph, rawObservation.installedPublicModuleEvidence.bootstrap],
    ["execution", executionGraph, rawObservation.installedPublicModuleEvidence.execution],
  ]) {
    for (const key of publicKeys) {
      const graphSeed = graph.seeds.find(
        ({ kind }) => kind === `${identity}_abi_public_export_${key}`,
      );
      const moduleRow = rows.find(({ namespace }) => namespace === key);
      assert.equal(graphSeed.moduleURL, moduleRow.realModuleURL);
    }
  }
  assert.equal(
    oddPublicationGraph.seeds.find(
      ({ kind }) => kind === "execution_odd_json_publication_terminal",
    ).moduleURL,
    rawObservation.installedPublicModuleEvidence.oddPublication.realModuleURL,
  );
  assert.equal(rawObservation.publicFamily.operationCount, 18);
  assert.equal(rawObservation.publicFamily.definitionCount, 56);
  assert.equal(rawObservation.publicFamily.callableCount, 39);
  assert.equal(rawObservation.publicFamily.absentCount, 17);
  assert.deepEqual(
    rawObservation.publicFamily.absentDefinitionKeys,
    [...ABSENT_PUBLIC_CALLABLE_KEYS].sort(),
  );
  assert.equal(rawObservation.publicFamily.selectedDefinitionKeys.length, 12);
  assert.equal(rawObservation.publicFamily.rows.length, 56);
  assert.equal(
    rawObservation.publicFamily.rows.every((row) =>
      row.schemaIdentityExact === true &&
      row.projectionIdentityExact === true &&
      row.verifiedCatalogIdentityExact === true &&
      typeof row.sdkCoordinate === "string"),
    true,
  );
  assert.deepEqual(
    rawObservation.nativeOwnerStageObservations.map(({ ownerMethod }) =>
      ownerMethod),
    NATIVE_OWNER_METHODS,
  );
  assert.deepEqual(
    rawObservation.nativeOwnerStageObservations.map(({ childCalls }) =>
      childCalls.length),
    [1, 1, 2, 1, 4, 2, 1, 1],
  );
  for (const stage of rawObservation.nativeOwnerStageObservations) {
    assert.equal(stage.evidenceKind, "native_owner_stage_observation");
    assert.equal(stage.receipt, false);
    for (const child of stage.childCalls) {
      assert.match(child.canonicalRequestDigest, /^sha256:[0-9a-f]{64}$/u);
      assert.match(child.canonicalOutputDigest, /^sha256:[0-9a-f]{64}$/u);
      assert.equal(typeof child.callsite.resolvedModuleURL, "string");
      assert.equal(
        Object.values(rawObservation.installedPublicModuleRefs.bootstrap)
          .concat(Object.values(rawObservation.installedPublicModuleRefs.execution))
          .includes(child.callsite.resolvedModuleURL),
        true,
      );
      assert.equal(Array.isArray(child.dependencyCoordinates), true);
      assert.equal(Array.isArray(child.resourceCoordinates), true);
      assert.equal(Array.isArray(child.effectCoordinates), true);
      assert.equal(
        child.callsite.packageExportPath === "./product" ||
          child.callsite.packageExportPath === "./abg",
        true,
      );
    }
  }
  assert.equal(
    rawObservation.nativeOwnerStageObservations[4].childCalls.slice(2)
      .every((child) =>
        child.callsite.namedExport === "admitProductInstall" &&
        child.admissionCoordinate !== null &&
        child.predecessorPrefix !== null &&
        child.successorPrefix !== null),
    true,
  );
  assert.deepEqual(
    rawObservation.nativeOwnerStageObservations[5].childCalls.map(
      ({ callsite }) => callsite.namedExport),
    ["constructWorkspaceBinding", "admitWorkspaceBinding"],
  );
  assert.deepEqual(
    rawObservation.transportedDefinitionKeys,
    TRANSPORTED_DEFINITION_KEYS,
  );
  assert.deepEqual(rawObservation.resolutionBoundaryObservations, [
    {
      identity: "absent_selected_graph_function",
      selectedCatalogHandle:
        "graph-function://odd_glc/conformance/program-only-hello@5",
      removedCatalogHandles: [
        "graph-function://odd_glc/conformance/program-only-hello@5",
      ],
      resultingAllowlist: [],
      code: "absent",
      stage: "catalog",
    },
    {
      identity: "install_unproved_at_authentic_earlier_abg_truth",
      code: "incompatible_or_unproven",
      stage: "dependency",
    },
  ]);
  const expectedTransportBoundaryObservations = [
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
  ];
  const negativeRequestRefs = [
    "public-request://odd-glc/t041/run_status",
    "public-request://odd-glc/t041/run_status",
    "public-request://odd-glc/t041/run_status",
    "public-request://odd-glc/t041/stale-projection-basis",
  ];
  assert.equal(rawObservation.transportBoundaryObservations.length, 4);
  const authenticatedTransportBoundaryObservations =
    rawObservation.transportBoundaryObservations.map((observation, index) => {
      const expected = expectedTransportBoundaryObservations[index];
      assertExactKeys(observation, [
        ...Object.keys(expected), "input", "output",
      ], `negative CLI exchange ${index}`);
      const { input, output, ...summary } = observation;
      assert.deepEqual(summary, expected);
      const inputRecord = parseExactRawJsonlEvidence(
        input,
        `negative CLI input ${index}`,
      );
      const outputRecord = parseExactRawJsonlEvidence(
        output,
        `negative CLI output ${index}`,
      );
      assertExactKeys(inputRecord.value, [
        "acquisition", "invocation", "kind", "schemaVersion",
      ], `negative CLI request ${index}`);
      assert.equal(inputRecord.value.kind, "abg_cli_transport_request");
      assert.equal(inputRecord.value.schemaVersion, "5.0.0");
      assert.equal(inputRecord.value.acquisition.kind, "reopen");
      assert.deepEqual(
        inputRecord.value.invocation.invocation.definitionKey,
        TRANSPORTED_DEFINITION_KEYS[1],
      );
      assert.equal(
        inputRecord.value.invocation.invocation.requestRef,
        negativeRequestRefs[index],
      );
      const outcome = outputRecord.value;
      let derived;
      if (index === 0) {
        assert.equal(
          outcome.kind,
          "installed_definition_call_transport_refusal",
        );
        derived = {
          identity: expected.identity,
          transportCode: outcome.code,
          receipt: Object.hasOwn(outcome, "receipt"),
        };
      } else if (index === 1 || index === 2) {
        assert.equal(
          outcome.kind,
          "installed_definition_call_transport_result",
        );
        derived = {
          identity: expected.identity,
          exitCode: outcome.receipt.exitCode,
          faultStage: outcome.receipt.failure.fault.stage,
          faultCode: outcome.receipt.failure.fault.code,
        };
      } else {
        assert.equal(
          outcome.kind,
          "installed_definition_call_transport_result",
        );
        derived = {
          identity: expected.identity,
          exitCode: outcome.receipt.exitCode,
          refusalCode: outcome.receipt.ownerOutput.value.code,
        };
      }
      assert.deepEqual(derived, expected);
      return summary;
    });
  assert.deepEqual(
    authenticatedTransportBoundaryObservations,
    expectedTransportBoundaryObservations,
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
  assert.equal(rawObservation.transportedRawExchanges.length, 4);
  const mainCallEventLogs = [];
  for (const [index, exchange] of
    rawObservation.transportedRawExchanges.entries()) {
    assertExactKeys(exchange, [
      "definitionKey", "eventLog", "input", "output", "ownerOutput", "resources",
      "transportModuleURL",
    ], `main Public call exchange ${index}`);
    assert.deepEqual(exchange.definitionKey, TRANSPORTED_DEFINITION_KEYS[index]);
    const inputRecord = parseExactRawJsonlEvidence(
      exchange.input,
      `main Public call input ${index}`,
    );
    const outputRecord = parseExactRawJsonlEvidence(
      exchange.output,
      `main Public call output ${index}`,
    );
    assertExactKeys(inputRecord.value, [
      "acquisition", "invocation", "kind", "schemaVersion",
    ], `main Public call request ${index}`);
    assert.equal(inputRecord.value.kind, "abg_cli_transport_request");
    assert.equal(inputRecord.value.schemaVersion, "5.0.0");
    assert.equal(inputRecord.value.acquisition.kind, "reopen");
    assert.deepEqual(
      inputRecord.value.invocation.invocation.definitionKey,
      TRANSPORTED_DEFINITION_KEYS[index],
    );
    assert.equal(outputRecord.line, rawObservation.transportedJsonLines[index]);
    assert.deepEqual(outputRecord.value, outcomes[index]);
    assert.deepEqual(exchange.ownerOutput, outcomes[index].receipt.ownerOutput);
    assert.deepEqual(exchange.resources, outcomes[index].receipt.resources);
    assertExactKeys(exchange.eventLog, [
      "after", "appendedByteLength", "before", "eventLogRef",
    ], `main Public call event log ${index}`);
    const before = assertRawBytesEvidence(exchange.eventLog.before);
    const after = assertRawBytesEvidence(exchange.eventLog.after);
    assert.equal(
      exchange.eventLog.appendedByteLength,
      after.length - before.length,
    );
    mainCallEventLogs.push({ before, after });
  }
  const transportCliSeed = executionGraph.seeds.find(
    ({ kind }) => kind === "execution_abi_cli_transport_root",
  );
  assert.equal(
    rawObservation.transportedRawExchanges.every(
      ({ transportModuleURL }) => transportModuleURL === transportCliSeed.moduleURL,
    ),
    true,
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
  const freshGraph = assertClosedModuleGraphEvidence(
    fresh.moduleGraphEvidence,
    [
      "fresh_reader_generated_module_graph_parser",
      "fresh_reader_generated_bridge",
      "fresh_reader_abi_public_root",
    ],
    [
      "fresh_reader_generated_module_graph_parser",
      "fresh_reader_generated_bridge",
    ],
    MODULE_GRAPH_PARSER_SOURCES.freshReader,
    "fresh reader",
  );
  assert.equal(
    freshGraph.seeds.find(
      ({ kind }) => kind === "fresh_reader_abi_public_root",
    ).moduleURL,
    fresh.publicRealModuleRef,
  );
  assert.equal(fresh.receipts.length, 3);
  assert.equal(fresh.readEventLogObservations.length, 3);
  const freshCallEventLogs = [];
  for (const [index, receipt] of fresh.receipts.entries()) {
    assert.deepEqual(receipt.ownerOutput, readOutcomes[index].receipt.ownerOutput);
    assert.deepEqual(receipt.resources, readOutcomes[index].receipt.resources);
    const observation = fresh.readEventLogObservations[index];
    assertExactKeys(observation, [
      "after", "appendedByteLength", "before", "definitionKey", "eventLogRef",
    ], `fresh Public read event log ${index}`);
    assert.deepEqual(
      observation.definitionKey,
      TRANSPORTED_DEFINITION_KEYS[index + 1],
    );
    const before = assertRawBytesEvidence(observation.before);
    const after = assertRawBytesEvidence(observation.after);
    assert.equal(observation.appendedByteLength, 0);
    assert.deepEqual(after, before);
    freshCallEventLogs.push({ before, after });
  }
  const preStartBytes = assertRawBytesEvidence(
    rawObservation.runtimeEventLog.preStart,
  );
  const postStartBytes = assertRawBytesEvidence(
    rawObservation.runtimeEventLog.postStart,
  );
  const postReadBytes = assertRawBytesEvidence(
    rawObservation.runtimeEventLog.postRead,
  );
  assert.equal(postStartBytes.length > preStartBytes.length, true);
  assert.deepEqual(postReadBytes, postStartBytes);
  assert.equal(
    rawObservation.transportedRawExchanges.every(
      ({ eventLog }) => eventLog.eventLogRef === rawObservation.runtimeEventLog.eventLogRef,
    ),
    true,
  );
  assert.equal(
    fresh.readEventLogObservations.every(
      ({ eventLogRef }) => eventLogRef === rawObservation.runtimeEventLog.eventLogRef,
    ),
    true,
  );
  assert.deepEqual(mainCallEventLogs[0].before, preStartBytes);
  assert.deepEqual(mainCallEventLogs[0].after, postStartBytes);
  assert.equal(
    rawObservation.transportedRawExchanges[0].eventLog.appendedByteLength,
    postStartBytes.length - preStartBytes.length,
  );
  for (const observation of mainCallEventLogs.slice(1)) {
    assert.deepEqual(observation.before, postStartBytes);
    assert.deepEqual(observation.after, postStartBytes);
  }
  for (const observation of freshCallEventLogs) {
    assert.deepEqual(observation.before, postStartBytes);
    assert.deepEqual(observation.after, postStartBytes);
  }
  assert.equal(fresh.eventLogObservation.appendedByteLength, 0);
  assert.deepEqual(
    assertRawBytesEvidence(fresh.eventLogObservation.before),
    postStartBytes,
  );
  assert.deepEqual(
    assertRawBytesEvidence(fresh.eventLogObservation.after),
    postStartBytes,
  );
  assert.deepEqual(rawObservation.authenticatedRuntimeObservation.admittedResult, {
    kind: "hello_world_output",
    schemaVersion: "5.0.0",
    message: "Hello World",
  });
  assert.equal(
    rawObservation.authenticatedRuntimeObservation.startDisposition,
    "completed",
  );
  assert.equal(
    rawObservation.authenticatedRuntimeObservation.runtimeStatus,
    "closed",
  );
  assert.equal(rawObservation.authenticatedRuntimeObservation.runClosedCount, 1);
  assert.equal(
    rawObservation.authenticatedRuntimeObservation.readTimeAppendedBytes,
    0,
  );
  const { returnedOwnerLoadEvidence, ...ownership } = rawObservation.ownership;
  assert.deepEqual(ownership, {
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
  for (const [kind, row] of Object.entries(returnedOwnerLoadEvidence)) {
    assert.equal(row.productId, "product://abiogenesis/typescript-tenant@5.0.0-dev.286");
    assert.equal(row.packageName, "@abiogenesis/typescript-tenant");
    assert.equal(row.packageVersion, "5.0.0-dev.286");
    assert.equal(row.containedInReturnedInstalledRoot, true);
    assert.equal(row.returnedExportPresent, true);
    assert.equal(typeof row.moduleURL, "string", kind);
    assert.equal(typeof row.namedSymbol, "string", kind);
    const ownerGraph = assertClosedModuleGraphEvidence(
      row.moduleGraphEvidence,
      [
        `returned_${kind}_generated_module_graph_parser`,
        `returned_${kind}_dynamic_owner`,
      ],
      [`returned_${kind}_generated_module_graph_parser`],
      MODULE_GRAPH_PARSER_SOURCES.crossOwner,
      `returned ${kind} owner`,
    );
    assert.equal(
      ownerGraph.seeds.find(
        ({ kind: seedKind }) => seedKind === `returned_${kind}_dynamic_owner`,
      ).moduleURL,
      row.moduleURL,
    );
  }
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
  await qualifiedSourceBlindCensus();
});

test("installed 0.1/ABI4.6 and real-packed 0.2/ABI5 reduce only to the frozen semantic projection", async (t) => {
  const abi5Tarball = process.env.ODD_GLC_T041_ABI_TARBALL;
  const baselineRoot = process.env.ODD_GLC_T041_BASELINE_ROOT;
  const candidateRawPath =
    process.env.ODD_GLC_T041_CANDIDATE_RAW_RECEIPT_PATH;
  const receiptPath = process.env.ODD_GLC_T041_DIFFERENTIAL_RECEIPT_PATH;
  assert.ok(abi5Tarball, "ODD_GLC_T041_ABI_TARBALL is required");
  assert.ok(baselineRoot, "ODD_GLC_T041_BASELINE_ROOT is required");
  assert.equal(path.isAbsolute(abi5Tarball), true);
  assert.equal(path.isAbsolute(baselineRoot), true);
  await assertCreateOnlyDestination(
    candidateRawPath,
    "ODD_GLC_T041_CANDIDATE_RAW_RECEIPT_PATH",
  );
  await assertCreateOnlyDestination(
    receiptPath,
    "ODD_GLC_T041_DIFFERENTIAL_RECEIPT_PATH",
  );
  assert.notEqual(candidateRawPath, receiptPath);
  const abi5TarballBytes = await readFile(abi5Tarball);
  assert.equal(sha256Hex(abi5TarballBytes), DIGESTS.abi5Tarball);
  const odd01TarballBytes = await readFile(path.join(
    baselineRoot,
    "odd-glc-route-one-typescript-0.1.0.tgz",
  ));
  assert.equal(sha256Hex(odd01TarballBytes), DIGESTS.odd01Tarball);
  const abi46TarballBytes = await readFile(path.join(
    baselineRoot,
    "abiogenesis-typescript-tenant-4.6.0-rc.3.tgz",
  ));
  assert.equal(sha256Hex(abi46TarballBytes), DIGESTS.abi46Tarball);
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
  assertExactKeys(odd01Release.value, [
    "abgSubstrate", "build", "checksumFile", "createdAt", "kind", "lint",
    "liveProof", "pack", "packSummary", "package", "packageSourceRoot",
    "packedInstall", "rcBranch", "releaseBranch", "releaseIdentity",
    "releaseNote", "releaseTag", "schemaVersion", "snapshotRoot",
    "sourceCommit", "sourceDirty", "sourceRef", "sourceStatusVerification",
    "tarball", "testSummary", "tests",
  ], "odd 0.1 release manifest keyset");
  assertExactKeys(abi46Release.value, [
    "build", "checksumFile", "createdAt", "kind", "lint", "pack",
    "packSummary", "package", "packageSourceRoot", "rcBranch",
    "releaseIdentity", "releaseNote", "snapshotRoot", "sourceCommit",
    "sourceDirty", "sourceRef", "tarball", "testSummary", "tests",
  ], "ABI 4.6 release manifest keyset");
  assertExactKeys(predecessorLiveProof.value, [
    "abgInvocationShape", "campaignDurationMs", "dataMapperGate", "eventCounts",
    "eventLogSha256", "eventSequence", "externalAbgStartInvocationCount",
    "graphFunctionRef", "graphRef", "kind", "oddGlcInstallFileSha256s",
    "oddGlcInstallManifestPath", "oddGlcInstallMode", "oddGlcPackageRoot",
    "oddGlcPackageTarball", "oddGlcPackageTarballSha256",
    "oddGlcWorkspaceInstallManifestPath", "overlayRef", "postProcessRule",
    "proofClass", "requirementLineageCanary", "runtimeBindingPath",
    "sandboxIdentity", "sandboxRole", "scenarioId", "scenarioKind",
    "startInvocationDurationMs", "startOutput", "startProcess", "startupConfigRef",
    "substrate", "terminalEvents", "workspaceRoot",
  ], "predecessor live proof keyset");
  assert.equal(abi46Release.value.releaseIdentity, "4.6.0-rc.3");
  assert.equal(abi46Release.value.tarball.sha256, DIGESTS.abi46Tarball);

  const scratch = await mkdtemp(path.join(os.tmpdir(), "odd-glc-t041-diff-"));
  t.after(async () => rm(scratch, { recursive: true, force: true }));
  const obsoleteBootstrapEnvironmentKey = [
    "ODD_GLC_T041_ABI",
    "PACKAGE_ROOT",
  ].join("_");
  const childEnvironment = {
    ...Object.fromEntries(Object.entries(process.env).filter(
      ([key]) => key !== obsoleteBootstrapEnvironmentKey,
    )),
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
  const sourceCensus = await qualifiedSourceBlindCensus();
  const predecessorProjection = projectPredecessor({
    receipt: predecessorReceipt.value,
    releaseManifest: odd01Release.value,
    abiReleaseManifest: abi46Release.value,
    liveProof: predecessorLiveProof.value,
  });
  const candidateProjection = projectCandidate(candidateRaw, sourceCensus);
  assert.deepEqual(predecessorProjection, SHARED_PROJECTION);
  assert.deepEqual(candidateProjection, SHARED_PROJECTION);

  const predecessorGitBytes = Object.freeze({
    oddProductTarball: odd01TarballBytes,
    oddReleaseManifest: odd01Release.bytes,
    installedLiveProof: predecessorLiveProof.bytes,
    abiTarball: abi46TarballBytes,
    abiReleaseManifest: abi46Release.bytes,
  });
  const immutablePredecessorGitBasis = Object.freeze(
    PREDECESSOR_GIT_OBJECTS.map((coordinate) => {
      const bytes = predecessorGitBytes[coordinate.evidenceKey];
      assert.ok(Buffer.isBuffer(bytes), coordinate.evidenceKey);
      assert.equal(gitBlobId(bytes), coordinate.blobId, coordinate.repositoryPath);
      return Object.freeze({
        ...coordinate,
        source: rawBytesEvidence(bytes),
      });
    }),
  );

  const rawByteLedger = Object.freeze({
    predecessor: Object.freeze({
      oddProductTarball: rawBytesEvidence(odd01TarballBytes),
      abiTarball: rawBytesEvidence(abi46TarballBytes),
      immutableReceipt: predecessorReceipt.raw,
      oddReleaseManifest: odd01Release.raw,
      abiReleaseManifest: abi46Release.raw,
      installedLiveProof: predecessorLiveProof.raw,
    }),
    candidate: Object.freeze({
      abiTarball: rawBytesEvidence(abi5TarballBytes),
      oddProductTarball: candidateRaw.archive.tarball,
      installedObservation: rawBytesEvidence(candidateRawBytes),
      testProcessStdout: rawBytesEvidence(Buffer.from(stdout)),
      testProcessStderr: rawBytesEvidence(Buffer.from(stderr)),
      freshProcessStdout: rawBytesEvidence(
        Buffer.from(candidateRaw.freshProcessStdout),
      ),
      transportExchanges: candidateRaw.transportedRawExchanges,
      eventLog: candidateRaw.runtimeEventLog,
    }),
  });
  assert.equal(
    assertRawBytesEvidence(rawByteLedger.predecessor.oddProductTarball).length,
    odd01TarballBytes.length,
  );
  assert.equal(
    assertRawBytesEvidence(rawByteLedger.predecessor.abiTarball).length,
    abi46TarballBytes.length,
  );
  assert.equal(
    assertRawBytesEvidence(rawByteLedger.candidate.abiTarball).length,
    abi5TarballBytes.length,
  );
  assertRawBytesEvidence(rawByteLedger.candidate.installedObservation, candidateRawBytes);
  const differentialReceipt = Object.freeze({
    kind: "odd_glc_t041_installed_differential_receipt",
    schemaVersion: "1",
    immutableBasisDigests: DIGESTS,
    immutablePredecessorGitBasis,
    predecessorRaw: Object.freeze({
      receipt: predecessorReceipt.value,
      releaseManifest: odd01Release.value,
      abiReleaseManifest: abi46Release.value,
      installedLiveProof: predecessorLiveProof.value,
    }),
    candidateRaw,
    rawByteLedger,
    sourceCensus,
    versionLocalObservations: Object.freeze({
      predecessor: Object.freeze({
        greetingStdout:
          predecessorReceipt.value.observation.versionLocalExpectedStdout,
        terminalStatus: predecessorReceipt.value.observation.terminalStatus,
      }),
      candidate: Object.freeze({
        greeting: candidateRaw.authenticatedRuntimeObservation.admittedResult,
        runtimeStatus:
          candidateRaw.authenticatedRuntimeObservation.runtimeStatus,
        startDisposition:
          candidateRaw.authenticatedRuntimeObservation.startDisposition,
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
      "all-56 ABI5 Public-family callable closure",
    ]),
  });
  const differentialBytes = Buffer.from(`${JSON.stringify(differentialReceipt)}\n`);
  await writeFile(receiptPath, differentialBytes, { flag: "wx" });
  assert.deepEqual(await readFile(receiptPath), differentialBytes);
  t.diagnostic(JSON.stringify({
    predecessorTarballSha256: DIGESTS.odd01Tarball,
    candidateTarballSha256: candidateRaw.basis.oddTarballSha256,
    predecessorVersionLocal:
      differentialReceipt.versionLocalObservations.predecessor,
    candidateVersionLocal: differentialReceipt.versionLocalObservations.candidate,
    semanticReduction: candidateProjection,
    candidateRawSha256: sha256Hex(candidateRawBytes),
    differentialByteLength: differentialBytes.length,
    differentialSha256: sha256Hex(differentialBytes),
  }));
});
