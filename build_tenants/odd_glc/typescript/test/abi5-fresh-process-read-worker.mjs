import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
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
  "  const suffix = parsed.search + parsed.hash; parsed.search = ''; parsed.hash = '';",
  "  return pathToFileURL(await realpath(fileURLToPath(parsed))).href + suffix;",
  "}",
  "const requestedSeeds = JSON.parse(process.argv[2]); const seeds = [];",
  "for (const seed of requestedSeeds) seeds.push({ kind: seed.kind, moduleURL: await canonical(seed.moduleURL) });",
  "const pending = seeds.map(({ moduleURL }) => moduleURL); const nodeMap = new Map(); const edges = [];",
  "while (pending.length > 0) {",
  "  const moduleURL = pending.shift(); if (nodeMap.has(moduleURL)) continue;",
  "  if (moduleURL.startsWith('node:')) { nodeMap.set(moduleURL, { moduleURL, mediaType: 'runtime_builtin', source: null, staticRequestCount: 0 }); continue; }",
  "  const sourceURL = new URL(moduleURL); sourceURL.search = ''; sourceURL.hash = '';",
  "  const bytes = await readFile(sourceURL); const extension = path.extname(fileURLToPath(sourceURL));",
  "  let requests = []; let mediaType;",
  "  if (extension === '.json') mediaType = 'json_module';",
  "  else if (extension === '.js' || extension === '.mjs') { mediaType = 'javascript_module'; requests = new vm.SourceTextModule(bytes.toString('utf8'), { identifier: moduleURL }).moduleRequests; }",
  "  else throw new TypeError('unparsed module media type ' + moduleURL);",
  "  nodeMap.set(moduleURL, { moduleURL, mediaType, source: raw(bytes), staticRequestCount: requests.length });",
  "  for (const request of requests) { const toModuleURL = await canonical(import.meta.resolve(request.specifier, moduleURL)); edges.push({ fromModuleURL: moduleURL, specifier: request.specifier, attributes: request.attributes, phase: request.phase, toModuleURL }); pending.push(toModuleURL); }",
  "}",
  "const nodes = [...nodeMap.values()].sort((a, b) => a.moduleURL.localeCompare(b.moduleURL)); edges.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));",
  "process.stdout.write(JSON.stringify({ kind: 'closed_static_module_graph', schemaVersion: '1', parser: 'node:vm.SourceTextModule+import.meta.resolve', seeds, nodes, edges, unresolvedEdges: [] }));",
].join("\n");

function assertRawBytesEvidence(evidence) {
  const bytes = Buffer.from(evidence.bytes, evidence.encoding);
  assert.equal(evidence.encoding, "base64");
  assert.equal(bytes.length, evidence.byteLength);
  assert.equal(`sha256:${sha256Hex(bytes)}`, evidence.sha256);
  return bytes;
}

async function closedModuleGraphEvidence({ seeds, bridgeURL, installedRoot }) {
  const canonicalBridgePath = await realpath(fileURLToPath(bridgeURL));
  const parserRoot = await mkdtemp(
    path.join(path.dirname(canonicalBridgePath), ".module-graph-parser-"),
  );
  const parserPath = path.join(parserRoot, "parser.mjs");
  const parserSourceBytes = Buffer.from(MODULE_GRAPH_PARSER_SOURCE);
  await writeFile(parserPath, parserSourceBytes);
  const parserModuleURL = pathToFileURL(await realpath(parserPath)).href;
  const evidenceSeeds = [
    Object.freeze({
      kind: "fresh_reader_generated_module_graph_parser",
      moduleURL: parserModuleURL,
    }),
    ...seeds,
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
    const graph = JSON.parse(stdout);
    assert.deepEqual(graph.unresolvedEdges, []);
    assert.deepEqual(
      graph.seeds.map(({ kind }) => kind),
      evidenceSeeds.map(({ kind }) => kind),
    );
    const canonicalInstalledRoot = await realpath(installedRoot);
    const canonicalGeneratedPaths = [
      fileURLToPath(parserModuleURL),
      canonicalBridgePath,
    ];
    const nodeURLs = new Set(graph.nodes.map(({ moduleURL }) => moduleURL));
    assert.equal(nodeURLs.size, graph.nodes.length);
    for (const seed of graph.seeds) {
      assert.equal(nodeURLs.has(seed.moduleURL), true);
    }
    const parserNode = graph.nodes.find(
      ({ moduleURL }) => moduleURL === parserModuleURL,
    );
    assert.ok(parserNode, "generated module graph parser node");
    assert.equal(parserNode.mediaType, "javascript_module");
    assert.equal(parserNode.staticRequestCount, 5);
    assert.deepEqual(assertRawBytesEvidence(parserNode.source), parserSourceBytes);
    assert.deepEqual(
      graph.edges
        .filter(({ fromModuleURL }) => fromModuleURL === parserModuleURL)
        .map(({ specifier, toModuleURL }) => [specifier, toModuleURL])
        .sort((left, right) => left[0].localeCompare(right[0])),
      [
        ["node:crypto", "node:crypto"],
        ["node:fs/promises", "node:fs/promises"],
        ["node:path", "node:path"],
        ["node:url", "node:url"],
        ["node:vm", "node:vm"],
      ],
    );
    const forbiddenSegments = [["test", "env"].join("_"), "private"];
    for (const node of graph.nodes) {
      if (node.mediaType === "runtime_builtin") {
        assert.equal(node.source, null);
        continue;
      }
      assertRawBytesEvidence(node.source);
      const modulePath = await realpath(fileURLToPath(node.moduleURL));
      if (canonicalGeneratedPaths.includes(modulePath)) continue;
      const relative = path.relative(canonicalInstalledRoot, modulePath);
      assert.equal(path.isAbsolute(relative), false);
      assert.equal(
        relative === ".." || relative.startsWith(`..${path.sep}`),
        false,
      );
      assert.equal(
        forbiddenSegments.some((segment) =>
          relative.split(path.sep).includes(segment)),
        false,
      );
    }
    for (const edge of graph.edges) {
      assert.equal(nodeURLs.has(edge.fromModuleURL), true);
      assert.equal(nodeURLs.has(edge.toModuleURL), true);
      assert.equal(typeof edge.attributes, "object");
      assert.equal(edge.phase, "evaluation");
    }
    return Object.freeze({
      ...graph,
      boundaries: Object.freeze({
        generatedModuleURLs: Object.freeze([
          parserModuleURL,
          graph.seeds[1].moduleURL,
        ]),
        installedRootURLs: Object.freeze([
          pathToFileURL(canonicalInstalledRoot).href,
        ]),
      }),
    });
  } finally {
    await rm(parserRoot, { recursive: true, force: true });
  }
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
  const bridgeSource = [
    `export * as installedPublic from "${PACKAGE_NAME}/public";`,
    `export const publicURL = import.meta.resolve("${PACKAGE_NAME}/public");`,
    "",
  ].join("\n");
  await writeFile(
    bridgePath,
    bridgeSource,
  );
  try {
    const bridgeURL = pathToFileURL(bridgePath).href;
    const { installedPublic, publicURL } = await import(bridgeURL);
    const canonicalInstalledRoot = await realpath(installedRoot);
    const publicModulePath = await realpath(fileURLToPath(publicURL));
    const relative = path.relative(canonicalInstalledRoot, publicModulePath);
    assert.equal(path.isAbsolute(relative), false);
    assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`), false);
    assert.equal(
      pathToFileURL(publicModulePath).href,
      pathToFileURL(await realpath(path.join(installedRoot, publicTarget))).href,
    );
    const moduleGraphEvidence = await closedModuleGraphEvidence({
      seeds: [
        Object.freeze({
          kind: "fresh_reader_generated_bridge",
          moduleURL: bridgeURL,
        }),
        Object.freeze({
          kind: "fresh_reader_abi_public_root",
          moduleURL: publicURL,
        }),
      ],
      bridgeURL,
      installedRoot,
    });
    return {
      installedPublic,
      moduleGraphEvidence,
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
  const {
    installedPublic,
    moduleGraphEvidence,
    publicModuleRef,
    publicRealModuleRef,
  } =
    await loadInstalledPublic(consumerRoot, installedRoot);
  const eventLogRefs = new Set(request.calls.map(
    (call) => call.resources.eventResource.closeHandoff.prefix.eventLogRef,
  ));
  assert.equal(eventLogRefs.size, 1);
  const [eventLogRef] = eventLogRefs;
  const eventLogPath = fileURLToPath(eventLogRef);
  const beforeBytes = await readFile(eventLogPath);
  const receipts = [];
  const readEventLogObservations = [];
  for (const call of request.calls) {
    const beforeCallBytes = await readFile(eventLogPath);
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
    const afterCallBytes = await readFile(eventLogPath);
    assert.deepEqual(afterCallBytes, beforeCallBytes);
    readEventLogObservations.push(Object.freeze({
      definitionKey: structuredClone(outcome.receipt.definitionKey),
      eventLogRef,
      before: rawBytesEvidence(beforeCallBytes),
      after: rawBytesEvidence(afterCallBytes),
      appendedByteLength: afterCallBytes.length - beforeCallBytes.length,
    }));
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
    moduleGraphEvidence,
    eventLogObservation: Object.freeze({
      eventLogRef,
      before: rawBytesEvidence(beforeBytes),
      after: rawBytesEvidence(afterBytes),
      appendedByteLength: afterBytes.length - beforeBytes.length,
    }),
    readEventLogObservations: Object.freeze(readEventLogObservations),
    receipts,
  };
}

process.stdout.write(JSON.stringify(await main()));
