import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const TEST_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_ROOT = path.resolve(TEST_ROOT, "../product");
const REQUIRED_ABI_TARBALL_SHA256 =
  "4fc3130cef9fda3171bb28aafffa71775328745721e305172fce9d04c9fdfe41";
const ZERO_DIGEST = `sha256:${"0".repeat(64)}`;
const PRODUCT = Object.freeze({
  packageName: "@odd-glc/route-one-typescript",
  packageVersion: "0.2.0-dev.1",
  productId: "product://odd_glc/route-one-typescript@0.2.0-dev.1",
  publisherNamespace: "odd_glc",
  moduleRef: "module://odd_glc/conformance/program-only-hello@5",
  programRef: "program://odd_glc/conformance/program-only-hello@5",
  startRef: "start://odd_glc/conformance/program-only-hello@5",
  graphFunctionRef:
    "graph-function://odd_glc/conformance/program-only-hello@5",
  graphRef: "graph://odd_glc/conformance/program-only-hello@5",
  nodeRef: "node://odd_glc/conformance/program-only-hello/abi-hello@5",
  armId: "arm://odd_glc/conformance/program-only-hello/abi-f-d@5",
  descriptorRef: "descriptor://odd_glc/route-one-typescript@0.2.0-dev.1",
  contributionManifestRef:
    "contribution-manifest://odd_glc/route-one-typescript@0.2.0-dev.1",
  provenanceRef: "provenance://odd_glc/route-one-typescript@0.2.0-dev.1",
  catalogId: "catalog://odd_glc/public-contracts@0.2.0-dev.1",
  compatibilityRef: "compatibility://abiogenesis/major/5",
});
const ABI = Object.freeze({
  productId: "product://abiogenesis/typescript-tenant@5.0.0-dev.286",
  packageName: "@abiogenesis/typescript-tenant",
  packageVersion: "5.0.0-dev.286",
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
const PRODUCT_RELATIVE_LOCATORS = Object.freeze([
  "contracts/public-contract-catalog.schema.json",
  "build/publication.json",
  "package.json",
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

function requireSuccessful(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });
  assert.equal(result.error, undefined, `${command}: ${result.error?.message}`);
  assert.equal(result.status, 0, `${command}: ${result.stderr}`);
  return result.stdout;
}

async function extractExactAbiTarball(tarballPath, scratchRoot) {
  assert.equal(path.isAbsolute(tarballPath), true, "ABI tarball path must be absolute");
  const bytes = await readFile(tarballPath);
  assert.equal(sha256Hex(bytes), REQUIRED_ABI_TARBALL_SHA256);
  const consumerRoot = path.join(scratchRoot, "abi-bootstrap-consumer");
  const packageRoot = path.join(
    consumerRoot,
    "node_modules",
    "@abiogenesis",
    "typescript-tenant",
  );
  await mkdir(packageRoot, { recursive: true });
  requireSuccessful(
    "tar",
    ["-xzf", tarballPath, "--strip-components=1", "-C", packageRoot],
  );
  const canonicalRoot = await realpath(packageRoot);
  const gitProbe = spawnSync(
    "git",
    ["-C", canonicalRoot, "rev-parse", "--show-toplevel"],
    { encoding: "utf8" },
  );
  assert.notEqual(
    gitProbe.status,
    0,
    "tarball bootstrap must be outside every source checkout",
  );
  return canonicalRoot;
}

async function loadInstalledAbiPublic(packageRoot) {
  const packageJson = JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8"),
  );
  assert.equal(packageJson.name, ABI.packageName);
  assert.equal(packageJson.version, ABI.packageVersion);
  for (const { packageExportPath } of ABI_PUBLIC_SUBPATHS) {
    assert.equal(
      typeof packageJson.exports[packageExportPath]?.import,
      "string",
      `installed ABI does not publicly export ${packageExportPath}`,
    );
  }
  const nodeModulesRoot = path.resolve(packageRoot, "../..");
  assert.equal(path.basename(nodeModulesRoot), "node_modules");
  const bridgeRoot = await mkdtemp(
    path.join(path.dirname(nodeModulesRoot), ".odd-glc-t041-public-bridge-"),
  );
  const bridgePath = path.join(bridgeRoot, "bridge.mjs");
  await writeFile(
    bridgePath,
    [
      ...ABI_PUBLIC_SUBPATHS.map(({ key, specifier }) =>
        `export * as ${key} from ${JSON.stringify(specifier)};`),
      `export const resolvedPublicSubpathURLs = Object.freeze({${ABI_PUBLIC_SUBPATHS.map(
        ({ packageExportPath, specifier }) =>
          `${JSON.stringify(packageExportPath)}: import.meta.resolve(${JSON.stringify(specifier)})`,
      ).join(",")}});`,
      "",
    ].join("\n"),
  );
  const publicModules = await import(
    `${pathToFileURL(bridgePath).href}?basis=${Date.now()}`
  );
  await rm(bridgeRoot, { recursive: true, force: true });
  const installedRoot = await realpath(packageRoot);
  const publicModuleEvidence = [];
  for (const { packageExportPath } of ABI_PUBLIC_SUBPATHS) {
    const resolvedURL = publicModules.resolvedPublicSubpathURLs[packageExportPath];
    assert.equal(typeof resolvedURL, "string", packageExportPath);
    const resolvedPath = await realpath(fileURLToPath(resolvedURL));
    const relative = path.relative(installedRoot, resolvedPath);
    assert.equal(path.isAbsolute(relative), false, packageExportPath);
    assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`), false);
    assert.equal(
      pathToFileURL(resolvedPath).href,
      pathToFileURL(await realpath(path.join(
        installedRoot,
        packageJson.exports[packageExportPath].import,
      ))).href,
      packageExportPath,
    );
    publicModuleEvidence.push(Object.freeze({
      packageExportPath,
      resolvedURL,
      realModuleURL: pathToFileURL(resolvedPath).href,
      packageRelativeTarget: relative.split(path.sep).join(path.posix.sep),
    }));
  }
  return {
    packageJson,
    manifest: JSON.parse(
      await readFile(path.join(packageRoot, "product-toolchain-manifest.json"), "utf8"),
    ),
    product: publicModules.product,
    gtl: publicModules.gtl,
    validator: publicModules.validator,
    publicModuleEvidence: Object.freeze(publicModuleEvidence),
  };
}

async function requireExactAbiBasis(scratchRoot) {
  const tarballPath = process.env.ODD_GLC_T041_ABI_TARBALL;
  assert.ok(tarballPath, "ODD_GLC_T041_ABI_TARBALL is required");
  const packageRoot = await extractExactAbiTarball(tarballPath, scratchRoot);
  return {
    artifactDigest: `sha256:${REQUIRED_ABI_TARBALL_SHA256}`,
    packageRoot,
    tarballPath,
    ...(await loadInstalledAbiPublic(packageRoot)),
  };
}

function exactPublicationData(gtl, abiPublication) {
  const ids = gtl.HELLO_WORLD_IDS;
  const abiGraphFunction = abiPublication.graphFunctions.find(
    (candidate) => candidate.name === ids.graphFunctionRef,
  );
  assert.ok(abiGraphFunction, "installed ABI publication omitted the Hello GraphFunction");
  assert.equal(abiGraphFunction.template.nodes.length, 1);
  assert.deepEqual(abiPublication.productSemanticsBinding, {
    bindingRef: "product-semantics://abiogenesis/conformance@5",
    kind: "product_semantics_binding",
    modulePath: "build/code/src/product/builtin_semantics.js",
    namedSymbol: "ABI5_PRODUCT_SEMANTICS",
    packageName: ABI.packageName,
    packageVersion: ABI.packageVersion,
  });

  const graphFunction = {
    kind: "graph_function",
    name: PRODUCT.graphFunctionRef,
    version: "5.0.0",
    environment: {
      requires: [ids.inputContractRef],
      provides: [ids.outputContractRef],
      carries: [ids.inputContractRef, ids.outputContractRef],
    },
    inputs: [ids.inputContractRef],
    outputs: [ids.outputContractRef],
    template: {
      kind: "inline_graph",
      graphRef: PRODUCT.graphRef,
      startNodeRef: PRODUCT.nodeRef,
      terminalNodeRefs: [PRODUCT.nodeRef],
      nodes: [{
        nodeRef: PRODUCT.nodeRef,
        nodeKind: "c_locus",
        term: gtl.C.of({
          input: gtl.cCarrier(ids.inputContractRef),
          output: gtl.cCarrier(ids.outputContractRef),
          programLocusRef: PRODUCT.nodeRef,
          stageRole: "result",
          fibre: "F_D",
          armId: PRODUCT.armId,
          compositionRef: null,
          vectorIndex: 0,
          judgmentPredicateRef: ids.judgmentPredicateRef,
          resultBearing: true,
          requirement: {
            kind: "executable_leaf_requirement",
            implementationBindingRef: ids.implementationBindingRef,
            inputContractRef: ids.inputContractRef,
            outputContractRef: ids.outputContractRef,
            evidenceContractRef: ids.evidenceContractRef,
            failureContractRef: ids.failureContractRef,
            refusalContractRef: ids.refusalContractRef,
            judgmentContractRef: ids.judgmentContractRef,
          },
        }),
      }],
      edges: [],
      applications: [],
    },
    effects: ["effect://abiogenesis/conformance/emit-hello-output@5"],
    declarations: {
      "abg.compute_regime": "F_D",
      "abg.closure_contract": ids.closureContractRef,
      "abg.child_closure_contract": ids.childClosureContractRef,
      "abg.evidence_contract": ids.evidenceContractRef,
      "abg.judgment_contract": ids.judgmentContractRef,
      "abg.judgment_predicate": ids.judgmentPredicateRef,
      "abg.transition_contract": ids.transitionContractRef,
    },
    tags: ["odd_glc", "program-only", "abi-owned-f-d-hello"],
  };
  const program = {
    kind: "gtl_program",
    version: "5.0.0",
    programRef: PRODUCT.programRef,
    moduleRef: PRODUCT.moduleRef,
    starts: [{
      startRef: PRODUCT.startRef,
      graphFunctionRef: PRODUCT.graphFunctionRef,
    }],
    callableMembership: [PRODUCT.graphFunctionRef],
    closureContractRef: ids.closureContractRef,
    policies: {
      "abg.root_mode": "direct",
      "abg.compute_regime": "F_D",
      "abg.default_start_ref": PRODUCT.startRef,
    },
  };
  return {
    moduleRef: PRODUCT.moduleRef,
    owningProductId: PRODUCT.productId,
    descriptorRef: PRODUCT.descriptorRef,
    contributionManifestRef: PRODUCT.contributionManifestRef,
    productSemanticsBinding: structuredClone(abiPublication.productSemanticsBinding),
    contracts: [],
    evaluators: [],
    rules: [],
    implementationBindings: [],
    closureContracts: [],
    programs: [program],
    graphFunctions: [graphFunction],
    contributions: [{
      handle: PRODUCT.graphFunctionRef,
      kind: "graph_function",
      declarationOrContractRef: PRODUCT.graphFunctionRef,
      owningProductId: PRODUCT.productId,
      programMembershipRefs: [PRODUCT.programRef],
      compatibilityRefs: [PRODUCT.compatibilityRef],
      readinessPrerequisiteRefs: [PRODUCT.programRef],
    }],
  };
}

function materializePublication(gtl, data, identity) {
  return gtl.modulePublication({
    kind: "module_publication",
    moduleVersion: "5.0.0",
    ...structuredClone(data),
    artifactDigest: identity.artifactDigest,
    productContentDigest: identity.productContentDigest,
    productManifestDigest: identity.manifestDigest,
    contributions: data.contributions.map((contribution) => ({
      ...structuredClone(contribution),
      provenanceRefs: [identity.artifactDigest, identity.manifestDigest],
    })),
  });
}

async function deriveProduct(abi) {
  const { product, gtl, manifest: abiManifest, artifactDigest } = abi;
  assert.equal(abiManifest.productId, ABI.productId);
  assert.equal(abiManifest.packageName, ABI.packageName);
  assert.equal(abiManifest.packageVersion, ABI.packageVersion);
  const abiPublication = gtl.constructHelloWorldModulePublication({
    productId: abiManifest.productId,
    artifactDigest,
    productContentDigest: abiManifest.productContentDigest,
    productManifestDigest: product.sha256Canonical(abiManifest),
    packageName: abiManifest.packageName,
    packageVersion: abiManifest.packageVersion,
  });
  const publicationData = exactPublicationData(gtl, abiPublication);
  const catalogSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
  };
  const capabilityGraph = product.constructCapabilityDefinitionGraph([]);
  const capabilityBytes = Buffer.from(
    product.capabilityDefinitionGraphAssetBytes(capabilityGraph),
  );
  const packageBytes = Buffer.from(`${JSON.stringify({
    name: PRODUCT.packageName,
    version: PRODUCT.packageVersion,
    type: "module",
    exports: { "./publication": "./build/publication.json" },
    files: ["build", "contracts", "product-toolchain-manifest.json"],
  }, null, 2)}\n`);
  const publicationBytes = Buffer.from(`${product.canonicalJson(publicationData)}\n`);
  const catalogSchemaBytes = Buffer.from(`${product.canonicalJson(catalogSchema)}\n`);
  const payloadBytes = new Map([
    ["contracts/public-contract-catalog.schema.json", catalogSchemaBytes],
    ["build/publication.json", publicationBytes],
    ["package.json", packageBytes],
  ]);
  const payloadInventory = PRODUCT_RELATIVE_LOCATORS.map((relativePath) => ({
    path: relativePath,
    sha256: product.sha256Bytes(payloadBytes.get(relativePath)),
  }));
  const productContentDigest = product.payloadInventoryDigest(payloadInventory);
  const draftPublication = materializePublication(gtl, publicationData, {
    artifactDigest: ZERO_DIGEST,
    productContentDigest,
    manifestDigest: ZERO_DIGEST,
  });
  const catalogSchemaPath = "contracts/public-contract-catalog.schema.json";
  const catalogWithoutDigest = {
    schemaVersion: "5.0.0",
    catalogId: PRODUCT.catalogId,
    catalogVersion: "5.0.0",
    catalogSchemaPath,
    catalogSchemaDigest: product.sha256Bytes(catalogSchemaBytes),
    rows: [],
  };
  const publicContractCatalog = {
    ...catalogWithoutDigest,
    catalogDigest: product.sha256Canonical(catalogWithoutDigest),
  };
  const capabilityCoordinate = product.capabilityDefinitionGraphCoordinate(
    capabilityGraph,
  );
  const contributionManifest = {
    kind: "product_contribution_manifest",
    schemaVersion: "5.0.0",
    contributionManifestRef: PRODUCT.contributionManifestRef,
    productId: PRODUCT.productId,
    productVersion: PRODUCT.packageVersion,
    descriptorRef: PRODUCT.descriptorRef,
    productContentDigest,
    publicContractCatalogId: publicContractCatalog.catalogId,
    publicContractCatalogDigest: publicContractCatalog.catalogDigest,
    capabilityDefinitionGraph: capabilityCoordinate,
    publicationBindings: [{
      moduleRef: PRODUCT.moduleRef,
      publicationDigest: product.modulePublicationSemanticDigest(draftPublication),
    }],
    rows: publicationData.contributions.map((contribution) => ({
      moduleRef: PRODUCT.moduleRef,
      handle: contribution.handle,
      kind: contribution.kind,
      declarationOrContractRef: contribution.declarationOrContractRef,
      owningProductId: contribution.owningProductId,
      programMembershipRefs: [...contribution.programMembershipRefs],
      compatibilityRefs: [...contribution.compatibilityRefs],
      provenanceRef: PRODUCT.provenanceRef,
      readinessPrerequisiteRefs: [...contribution.readinessPrerequisiteRefs],
    })),
  };
  const productManifest = {
    kind: "abg_product_toolchain_manifest",
    schemaVersion: "5.0.0",
    productId: PRODUCT.productId,
    packageName: PRODUCT.packageName,
    packageVersion: PRODUCT.packageVersion,
    productContentDigest,
    productRelativeLocators: [...PRODUCT_RELATIVE_LOCATORS],
    descriptorRef: PRODUCT.descriptorRef,
    publisherNamespace: PRODUCT.publisherNamespace,
    contributionManifestRef: PRODUCT.contributionManifestRef,
    contributionManifestDigest: product.sha256Canonical(contributionManifest),
    contributionManifest,
    compatibilityRefs: [PRODUCT.compatibilityRef],
    declaredDependencies: [{
      kind: "requires",
      productId: ABI.productId,
      packageVersion: ABI.packageVersion,
      compatibilityRef: PRODUCT.compatibilityRef,
      requiredContractRefs: [
        "abg.contract.gtl.root-declaration",
        "abg.schema.public-operation-invocation",
      ],
      requiredCapabilityRefs: [
        "abg.capability.catalog.invoke-graph-function@5",
        "abg.capability.gtl.declare@5",
      ],
    }],
    provenanceRef: PRODUCT.provenanceRef,
    declaredCapabilityRefs: [],
    capabilityDefinitionGraph: {
      ...capabilityCoordinate,
      assetLocator: {
        path: product.CAPABILITY_DEFINITION_GRAPH_ASSET_PATH,
        mediaType: "application/json",
        schemaVersion: "5.0.0",
        contentDigest: product.sha256Bytes(capabilityBytes),
      },
    },
    publicContractCatalog,
  };
  const files = new Map([
    ["build/publication.json", publicationBytes],
    [
      "contracts/capabilities/capability-definition-graph.json",
      capabilityBytes,
    ],
    ["contracts/public-contract-catalog.schema.json", catalogSchemaBytes],
    ["package.json", packageBytes],
    [
      "product-toolchain-manifest.json",
      Buffer.from(`${product.canonicalJson(productManifest)}\n`),
    ],
  ]);
  return { files, productManifest };
}

async function relativeFiles(root, prefix = "") {
  const rows = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) rows.push(...await relativeFiles(root, relativePath));
    else rows.push(relativePath);
  }
  return rows.sort();
}

async function productSnapshot() {
  return new Map(await Promise.all(EXACT_PRODUCT_FILES.map(async (relativePath) => [
    relativePath,
    await readFile(path.join(PRODUCT_ROOT, relativePath)),
  ])));
}

function packProduct(destination) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const packed = spawnSync(
    npmCommand,
    ["pack", "--ignore-scripts", "--json", "--pack-destination", destination],
    { cwd: PRODUCT_ROOT, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  );
  assert.equal(packed.status, 0, packed.stderr);
  const [summary] = JSON.parse(packed.stdout);
  return { summary, tarballPath: path.join(destination, summary.filename) };
}

async function inspectExactProduct(abi, derived) {
  const { product, gtl } = abi;
  assert.deepEqual(await relativeFiles(PRODUCT_ROOT), EXACT_PRODUCT_FILES);
  for (const [relativePath, expectedBytes] of derived.files) {
    assert.deepEqual(
      await readFile(path.join(PRODUCT_ROOT, relativePath)),
      expectedBytes,
      `${relativePath} differs from its installed-public-ABI derivation`,
    );
  }
  const packageJson = JSON.parse(await readFile(path.join(PRODUCT_ROOT, "package.json")));
  assert.deepEqual(packageJson, {
    name: PRODUCT.packageName,
    version: PRODUCT.packageVersion,
    type: "module",
    exports: { "./publication": "./build/publication.json" },
    files: ["build", "contracts", "product-toolchain-manifest.json"],
  });
  const publicationData = JSON.parse(
    await readFile(path.join(PRODUCT_ROOT, "build/publication.json"), "utf8"),
  );
  assert.equal(Object.hasOwn(publicationData, "kind"), false);
  assert.equal(Object.hasOwn(publicationData, "moduleVersion"), false);
  assert.equal(Object.hasOwn(publicationData, "artifactDigest"), false);
  assert.equal(Object.hasOwn(publicationData, "productContentDigest"), false);
  assert.equal(Object.hasOwn(publicationData, "productManifestDigest"), false);
  assert.equal(publicationData.owningProductId, PRODUCT.productId);
  assert.equal(publicationData.programs.length, 1);
  assert.equal(publicationData.graphFunctions.length, 1);
  assert.equal(publicationData.contributions.length, 1);
  for (const empty of [
    "contracts",
    "evaluators",
    "rules",
    "implementationBindings",
    "closureContracts",
  ]) assert.deepEqual(publicationData[empty], []);
  assert.equal(publicationData.programs[0].programRef, PRODUCT.programRef);
  assert.equal(publicationData.graphFunctions[0].name, PRODUCT.graphFunctionRef);
  assert.equal(publicationData.graphFunctions[0].template.nodes[0].nodeRef, PRODUCT.nodeRef);
  assert.equal(
    publicationData.graphFunctions[0].template.nodes[0].term.requirement.implementationBindingRef,
    gtl.HELLO_WORLD_IDS.implementationBindingRef,
  );
  assert.deepEqual(publicationData.productSemanticsBinding, {
    bindingRef: "product-semantics://abiogenesis/conformance@5",
    kind: "product_semantics_binding",
    modulePath: "build/code/src/product/builtin_semantics.js",
    namedSymbol: "ABI5_PRODUCT_SEMANTICS",
    packageName: ABI.packageName,
    packageVersion: ABI.packageVersion,
  });

  const capabilityGraphPath = path.join(
    PRODUCT_ROOT,
    "contracts/capabilities/capability-definition-graph.json",
  );
  const capabilityGraph = product.constructCapabilityDefinitionGraph([]);
  assert.deepEqual(
    await readFile(capabilityGraphPath),
    Buffer.from(product.capabilityDefinitionGraphAssetBytes(capabilityGraph)),
  );
  const catalogSchemaPath = path.join(
    PRODUCT_ROOT,
    "contracts/public-contract-catalog.schema.json",
  );
  assert.deepEqual(JSON.parse(await readFile(catalogSchemaPath, "utf8")), {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
  });
  const manifest = JSON.parse(
    await readFile(path.join(PRODUCT_ROOT, "product-toolchain-manifest.json"), "utf8"),
  );
  const payloadInventory = await Promise.all(
    PRODUCT_RELATIVE_LOCATORS.map(async (relativePath) => ({
      path: relativePath,
      sha256: await product.sha256File(path.join(PRODUCT_ROOT, relativePath)),
    })),
  );
  assert.deepEqual(manifest.productRelativeLocators, PRODUCT_RELATIVE_LOCATORS);
  assert.equal(manifest.productContentDigest, product.payloadInventoryDigest(payloadInventory));
  assert.equal(
    manifest.contributionManifestDigest,
    product.sha256Canonical(manifest.contributionManifest),
  );
  const catalogWithoutDigest = { ...manifest.publicContractCatalog };
  delete catalogWithoutDigest.catalogDigest;
  assert.equal(
    manifest.publicContractCatalog.catalogDigest,
    product.sha256Canonical(catalogWithoutDigest),
  );
  assert.deepEqual(manifest.publicContractCatalog.rows, []);
  assert.deepEqual(manifest.declaredCapabilityRefs, []);
  assert.deepEqual(manifest.declaredDependencies, [{
    kind: "requires",
    productId: ABI.productId,
    packageVersion: ABI.packageVersion,
    compatibilityRef: PRODUCT.compatibilityRef,
    requiredContractRefs: [
      "abg.contract.gtl.root-declaration",
      "abg.schema.public-operation-invocation",
    ],
    requiredCapabilityRefs: [
      "abg.capability.catalog.invoke-graph-function@5",
      "abg.capability.gtl.declare@5",
    ],
  }]);
  assert.equal(manifest.contributionManifest.rows.length, 1);
  assert.equal(manifest.contributionManifest.rows[0].owningProductId, PRODUCT.productId);
  const draft = materializePublication(gtl, publicationData, {
    artifactDigest: ZERO_DIGEST,
    productContentDigest: manifest.productContentDigest,
    manifestDigest: ZERO_DIGEST,
  });
  assert.equal(
    manifest.contributionManifest.publicationBindings[0].publicationDigest,
    product.modulePublicationSemanticDigest(draft),
  );
  return manifest;
}

test("ABI5 Product inventory is exact, data-only, and double-pack deterministic", async (t) => {
    const root = await mkdtemp(path.join(os.tmpdir(), "odd-glc-t041-pack-"));
    t.after(async () => rm(root, { recursive: true, force: true }));
    const abi = await requireExactAbiBasis(root);
    assert.equal(abi.publicModuleEvidence.length, ABI_PUBLIC_SUBPATHS.length);
    const derived = await deriveProduct(abi);
    const initialSnapshot = await productSnapshot();
    const manifest = await inspectExactProduct(abi, derived);
    const firstRoot = path.join(root, "first");
    const secondRoot = path.join(root, "second");
    await mkdir(firstRoot);
    await mkdir(secondRoot);
    const first = packProduct(firstRoot);
    const second = packProduct(secondRoot);
    assert.deepEqual(
      first.summary.files.map((entry) => entry.path).sort(),
      EXACT_PRODUCT_FILES,
    );
    assert.equal(first.summary.files.length, 5);
    assert.equal(first.summary.name, PRODUCT.packageName);
    assert.equal(first.summary.version, PRODUCT.packageVersion);
    const firstBytes = await readFile(first.tarballPath);
    const secondBytes = await readFile(second.tarballPath);
    const archiveHeaders = requireSuccessful("tar", ["-tzf", first.tarballPath])
      .trim().split(/\r?\n/u).sort();
    assert.deepEqual(
      archiveHeaders,
      EXACT_PRODUCT_FILES.map((member) => `package/${member}`).sort(),
      "actual npm tar headers must contain exactly the five Product members",
    );
    assert.deepEqual(firstBytes, secondBytes);
    assert.equal(
      await abi.product.sha256File(first.tarballPath),
      `sha256:${sha256Hex(firstBytes)}`,
    );
    assert.match(manifest.productContentDigest, /^sha256:[0-9a-f]{64}$/u);
    for (const file of first.summary.files) {
      assert.equal(/\.(?:[cm]?js|d\.[cm]?ts)$/u.test(file.path), false);
    }
    assert.deepEqual(
      await productSnapshot(),
      initialSnapshot,
      "inventory and double-pack proof mutated the tracked Product bytes",
    );
});
