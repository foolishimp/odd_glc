// Pure declaration-only continuation witness. No I/O or runtime orchestration.
// The original witness publication and historical envelope remain unchanged.
import { D1_WITNESS_IDS } from "./d1-lifecycle-declarations.mjs";

export const D1_TAIL_IDS = Object.freeze({
  packageName: "@odd-glc/d1-lifecycle-tail-declaration-witness",
  packageVersion: "0.0.0-d1.1",
  productId: "product://odd-glc/d1-lifecycle-tail-declaration-witness@0.0.0-d1.1",
  moduleRef: "module://odd-glc/generic-lifecycle-tail@5",
  programRef: "program://odd-glc/generic-lifecycle-tail@5",
  graphFunctionRef: "graph-function://odd-glc/generic-lifecycle-tail@5",
  graphRef: "graph://odd-glc/generic-lifecycle-tail@5",
  startRef: "start://odd-glc/generic-lifecycle-tail@5",
  closureContractRef: "contract://odd-glc/generic-lifecycle-tail/closure@5",
  descriptorRef: "descriptor://odd-glc/generic-lifecycle-tail@5",
  contributionManifestRef: "contribution-manifest://odd-glc/generic-lifecycle-tail@5",
  catalogRef: "catalog://odd-glc/generic-lifecycle-tail@5",
  provenanceRef: "provenance://odd-glc/generic-lifecycle-tail@5",
});

export const D1_TAIL_CHAIN = Object.freeze([
  "graph-function://odd-glc/generic-lifecycle/design-worksite@5",
  "graph-function://odd-glc/generic-lifecycle/worksite@5",
  "graph-function://odd-glc/generic-lifecycle/evidence-input@5",
  "graph-function://odd-glc/generic-lifecycle/evidence@5",
  "graph-function://odd-glc/generic-lifecycle/envelope-output@5",
]);

export const D1_TAIL_START_SELECTION = Object.freeze({
  kind: "start", scope: "program", target: "next", until: "converged", rootMode: "direct",
});

const exactlyOne = (rows, label) => {
  if (rows.length !== 1) throw new TypeError(`requires one exact ${label}`);
  return rows[0];
};
const placeholder = `sha256:${"0".repeat(64)}`;

export function constructD1TailPublication({ gtl, semanticPublication, lifecyclePublication }) {
  const ids = D1_TAIL_IDS, native = gtl.SEMANTIC_STAGE_IDS;
  const priorProgram = exactlyOne(lifecyclePublication.programs.filter(p => p.programRef === D1_WITNESS_IDS.programRef), "historical lifecycle Program");
  const lifecycle = lifecyclePublication.semanticLifecycle;
  if (lifecycle?.declarationRef !== D1_WITNESS_IDS.lifecycleDeclarationRef) throw new TypeError("requires unchanged lifecycle declaration owner");
  const chain = D1_TAIL_CHAIN.map(ref => exactlyOne(lifecyclePublication.graphFunctions.filter(g => g.name === ref), ref));
  const nodes = chain.map((graph, ordinal) => ({
    nodeRef: `node://odd-glc/generic-lifecycle-tail/step-${ordinal}@5`, nodeKind: "c_locus",
    term: gtl.workflow.C(gtl.cGraphFunctionRef({ graphFunctionRef: graph.name,
      input: gtl.cCarrier(graph.inputs[0]), output: gtl.cCarrier(graph.outputs[0]) })),
  }));
  const closure = gtl.constructSemanticClosureContract({ closureContractRef: ids.closureContractRef,
    predicateRef: native.lifecyclePredicateRef, resultContractRef: native.outputContractRef, closureScope: "run" });
  const carriers = [...new Set(chain.flatMap(g => [...g.inputs, ...g.outputs]))];
  const root = {
    kind: "graph_function", name: ids.graphFunctionRef, version: "5.0.0",
    environment: { requires: [native.envelopeContractRef], provides: carriers, carries: carriers },
    inputs: [native.envelopeContractRef], outputs: [native.outputContractRef],
    template: { kind: "inline_graph", graphRef: ids.graphRef, startNodeRef: nodes[0].nodeRef,
      terminalNodeRefs: [nodes.at(-1).nodeRef], nodes,
      edges: nodes.slice(1).map((node, index) => gtl.graphEdge({ fromNodeRef: nodes[index].nodeRef, toNodeRef: node.nodeRef })), applications: [] },
    effects: [...new Set(chain.flatMap(g => g.effects))],
    declarations: { "abg.compute_regime": "mixed", "abg.closure_contract": ids.closureContractRef,
      "abg.evidence_contract": native.evidenceContractRef, "abg.judgment_contract": native.judgmentContractRef,
      "abg.judgment_predicate": native.lifecycleStepPredicateRef, "abg.transition_contract": native.transitionContractRef },
    tags: ["odd-glc", "generic-lifecycle-tail", "non-closing-application-coverage"],
  };
  // Preserve the existing worksite callable cone; historical semantic stages
  // are owner-resolved dependencies, never unused callable-membership entries.
  const historicalOnly = new Set([D1_WITNESS_IDS.graphFunctionRef,
    ...lifecycle.stages.filter(s => !D1_TAIL_CHAIN.includes(s.graphFunctionRef)).map(s => s.graphFunctionRef)]);
  const program = {
    kind: "gtl_program", programRef: ids.programRef, version: "5.0.0", moduleRef: ids.moduleRef,
    starts: [{ startRef: ids.startRef, graphFunctionRef: ids.graphFunctionRef }],
    callableMembership: [ids.graphFunctionRef, ...priorProgram.callableMembership.filter(ref => !historicalOnly.has(ref))],
    closureContractRef: ids.closureContractRef,
    policies: { "abg.root_mode": "direct", "abg.compute_regime": "mixed", "abg.default_start_ref": ids.startRef,
      "abg.semantic_lifecycle": lifecycle.declarationRef },
  };
  const nativeContract = exactlyOne(semanticPublication.contracts.filter(c => c.contractRef === native.closureContractRef), "native closure carrier");
  return gtl.modulePublication({
    kind: "module_publication", moduleVersion: "5.0.0", moduleRef: ids.moduleRef, owningProductId: ids.productId,
    descriptorRef: ids.descriptorRef, contributionManifestRef: ids.contributionManifestRef,
    artifactDigest: placeholder, productContentDigest: placeholder, productManifestDigest: placeholder,
    productSemanticsBinding: structuredClone(semanticPublication.productSemanticsBinding),
    contracts: [{ ...structuredClone(nativeContract), contractRef: ids.closureContractRef }],
    closureContracts: [closure], graphFunctions: [root], programs: [program],
    implementationBindings: [], evaluators: [], rules: [],
    contributions: [{ handle: root.name, kind: "graph_function", declarationOrContractRef: root.name,
      owningProductId: ids.productId, programMembershipRefs: [ids.programRef], readinessPrerequisiteRefs: [ids.programRef],
      compatibilityRefs: ["compatibility://abiogenesis/major/5"], provenanceRefs: [placeholder, placeholder] }],
  });
}

export function materializeD1TailPublication({ gtl, identity, publicationData }) {
  return gtl.modulePublication({ kind: "module_publication", moduleVersion: "5.0.0", ...structuredClone(publicationData),
    artifactDigest: identity.artifactDigest, productContentDigest: identity.productContentDigest,
    productManifestDigest: identity.manifestDigest,
    contributions: publicationData.contributions.map(row => ({ ...structuredClone(row),
      provenanceRefs: [identity.artifactDigest, identity.manifestDigest] })),
  });
}

export function constructD1TailPackageFiles({ product, gtl, abiArtifact, priorWitnessArtifact, publication }) {
  const ids = D1_TAIL_IDS;
  const { kind: _kind, moduleVersion: _version, artifactDigest: _artifact,
    productContentDigest: _content, productManifestDigest: _manifest, ...publicationData } = structuredClone(publication);
  const schemaPath = "contracts/public-contract-catalog.schema.json";
  const values = {
    "package.json": { name: ids.packageName, version: ids.packageVersion, type: "module",
      exports: { "./publication": "./build/publication.json" }, files: ["build", "contracts", "product-toolchain-manifest.json"] },
    "build/publication.json": publicationData,
    [schemaPath]: { $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://odd-glc.example/contracts/d1-tail-declaration-witness-catalog@5", type: "object" },
  };
  const files = Object.fromEntries(Object.entries(values).map(([path, value]) => [path, `${product.canonicalJson(value)}\n`]));
  const graph = product.constructCapabilityDefinitionGraph([]), graphBytes = product.capabilityDefinitionGraphAssetBytes(graph);
  const graphCoordinate = product.capabilityDefinitionGraphCoordinate(graph);
  files[product.CAPABILITY_DEFINITION_GRAPH_ASSET_PATH] = graphBytes;
  const productRelativeLocators = Object.keys(values).sort();
  const payloadInventory = productRelativeLocators.map(path => ({ path, sha256: product.sha256Bytes(files[path]) }));
  const productContentDigest = product.payloadInventoryDigest(payloadInventory);
  const catalogBody = { schemaVersion: "5.0.0", catalogId: ids.catalogRef, catalogVersion: "5.0.0",
    catalogSchemaPath: schemaPath, catalogSchemaDigest: product.sha256Bytes(files[schemaPath]), rows: [] };
  const catalog = { ...catalogBody, catalogDigest: product.sha256Canonical(catalogBody) };
  const draft = materializeD1TailPublication({ gtl, publicationData,
    identity: { artifactDigest: placeholder, productContentDigest, manifestDigest: placeholder } });
  const contributionManifest = {
    kind: "product_contribution_manifest", schemaVersion: "5.0.0", contributionManifestRef: ids.contributionManifestRef,
    productId: ids.productId, productVersion: ids.packageVersion, descriptorRef: ids.descriptorRef, productContentDigest,
    publicContractCatalogId: catalog.catalogId, publicContractCatalogDigest: catalog.catalogDigest,
    capabilityDefinitionGraph: graphCoordinate,
    publicationBindings: [{ moduleRef: draft.moduleRef, publicationDigest: product.modulePublicationSemanticDigest(draft) }],
    rows: draft.contributions.map(({ provenanceRefs: _refs, ...row }) => ({ moduleRef: draft.moduleRef,
      ...structuredClone(row), provenanceRef: ids.provenanceRef })),
  };
  const compatibilityRef = "compatibility://abiogenesis/major/5";
  const manifest = {
    kind: "abg_product_toolchain_manifest", schemaVersion: "5.0.0", productId: ids.productId,
    packageName: ids.packageName, packageVersion: ids.packageVersion, productContentDigest, productRelativeLocators,
    descriptorRef: ids.descriptorRef, publisherNamespace: "odd-glc", contributionManifestRef: ids.contributionManifestRef,
    contributionManifestDigest: product.sha256Canonical(contributionManifest), contributionManifest,
    compatibilityRefs: [compatibilityRef],
    declaredDependencies: [
      { kind: "requires", productId: abiArtifact.productId, packageVersion: abiArtifact.packageVersion, compatibilityRef,
        requiredContractRefs: ["abg.contract.gtl.root-declaration", "abg.schema.public-operation-invocation"],
        requiredCapabilityRefs: ["abg.capability.catalog.invoke-graph-function@5", "abg.capability.gtl.declare@5"] },
      { kind: "requires", productId: priorWitnessArtifact.productId, packageVersion: priorWitnessArtifact.packageVersion,
        compatibilityRef, requiredContractRefs: [], requiredCapabilityRefs: [] },
    ],
    provenanceRef: ids.provenanceRef, declaredCapabilityRefs: [],
    capabilityDefinitionGraph: { ...graphCoordinate, assetLocator: { path: product.CAPABILITY_DEFINITION_GRAPH_ASSET_PATH,
      mediaType: "application/json", schemaVersion: "5.0.0", contentDigest: product.sha256Bytes(graphBytes) } },
    publicContractCatalog: catalog,
  };
  files["product-toolchain-manifest.json"] = `${product.canonicalJson(manifest)}\n`;
  return { files, manifest, publicationData, payloadInventory, productContentDigest };
}
