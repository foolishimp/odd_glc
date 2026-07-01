import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  FORBIDDEN_ABG_STARTUP_AUTHORITIES,
  ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
  ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES,
  ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS,
  ODD_GLC_HELLO_WORLD_BOOTSTRAP_STARTUP_BINDING,
  ODD_GLC_LIFECYCLE_SLOT_MAP,
  ODD_GLC_LIFECYCLE_NODE_TYPES,
  ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS,
  ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING,
  ODD_GLC_STARTUP_BINDING,
  REQUIRED_ROUTE_ONE_SURFACES,
  defineLifecycleNodeTypeDeclarations,
  defineOddGlcStartupBinding,
  interpretStartupRegistryState,
  validateGtlAbg42DeclarationFacades
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const defaultAbgRoot = path.join(
  appsRoot,
  `.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}/lib/node_modules/@abiogenesis/typescript-tenant`
);

async function importInstalledModule(relativePath) {
  const packageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgRoot;
  const modulePath = path.join(packageRoot, relativePath);
  assert.equal(existsSync(modulePath), true, `Missing installed ABIogenesis module at ${modulePath}`);
  return import(pathToFileURL(modulePath).href);
}

async function importGtlFacades() {
  const [gtlM01Contracts, gtlM01Algebra, gtlM02Contracts] = await Promise.all([
    importInstalledModule("build/semantic/code/src/gtl/m01/contracts/index.js"),
    importInstalledModule("build/semantic/code/src/gtl/m01/algebra/index.js"),
    importInstalledModule("build/semantic/code/src/gtl/m02/contracts/index.js")
  ]);
  return Object.freeze({
    gtlM01Contracts,
    gtlM01Algebra,
    gtlM02Contracts
  });
}

async function readPinnedGlcStartupFixture() {
  const proof = ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.glcHelloWorldBootstrapLive;
  assert.ok(proof, "Missing ABG 4.2 GLC startup proof provenance");
  const proofRoot = path.join(
    tenantRoot,
    proof.proofArtifactPath.replace(/^build_tenants\/odd_glc\/typescript\/test\/proof_inputs\//u, "test/proof_inputs/")
  );
  const manifestPath = path.join(path.dirname(proofRoot), "glc-hello-world-bootstrap-live-manifest.json");
  const eventsPath = path.join(path.dirname(proofRoot), "events.jsonl");
  const vector0Path = path.join(path.dirname(proofRoot), "glc-bootstrap-vector-0-artifact.json");
  const vector1Path = path.join(path.dirname(proofRoot), "glc-bootstrap-vector-1-artifact.json");
  for (const filePath of [proofRoot, manifestPath, eventsPath, vector0Path, vector1Path]) {
    assert.equal(existsSync(filePath), true, `Missing pinned ABG 4.2 startup proof input at ${filePath}`);
  }
  const rawProof = await readFile(proofRoot, "utf8");
  const rawEvents = await readFile(eventsPath, "utf8");
  const rawVector0 = await readFile(vector0Path, "utf8");
  const rawVector1 = await readFile(vector1Path, "utf8");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const eventDigest = `sha256:${createHash("sha256").update(rawEvents, "utf8").digest("hex")}`;
  assert.equal(`sha256:${createHash("sha256").update(rawProof, "utf8").digest("hex")}`, manifest.proof.sha256);
  assert.equal(eventDigest, manifest.events.sha256);
  assert.equal(eventDigest, proof.eventLogSha256);
  assert.equal(`sha256:${createHash("sha256").update(rawVector0, "utf8").digest("hex")}`, manifest.liveArtifacts[0].sha256);
  assert.equal(`sha256:${createHash("sha256").update(rawVector1, "utf8").digest("hex")}`, manifest.liveArtifacts[1].sha256);
  return Object.freeze({
    proof: JSON.parse(rawProof),
    events: rawEvents.trim().split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line)),
    liveArtifacts: [JSON.parse(rawVector0), JSON.parse(rawVector1)],
    manifest
  });
}

test("defines lifecycle node types through ABI 4.2 GTL node-type surfaces", async () => {
  const facades = await importGtlFacades();
  const validation = validateGtlAbg42DeclarationFacades(facades);

  assert.equal(validation.status, "accepted");
  const nodeTypeSurfaces = new Set(ODD_GLC_LIFECYCLE_NODE_TYPES.map((entry) => entry.surface));
  for (const surface of REQUIRED_ROUTE_ONE_SURFACES) {
    assert.equal(nodeTypeSurfaces.has(surface), true, `Missing lifecycle node type for ${surface}`);
  }
  assert.equal(ODD_GLC_LIFECYCLE_NODE_TYPES.length, REQUIRED_ROUTE_ONE_SURFACES.length + 1);
  assert.equal(nodeTypeSurfaces.has("ReleaseReadinessView"), true);
  assert.equal(ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES.length, 3);
  assert.deepEqual(
    ODD_GLC_SOFTWARE_BUILD_NODE_TYPES.map((entry) => entry.typeRef),
    [
      "odd_glc.type.lifecycle.scenario_surface",
      "odd_glc.type.lifecycle.design_surface",
      "odd_glc.type.lifecycle.implementation_design",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.test_source_surface",
      "odd_glc.type.software.build_config_surface",
      "odd_glc.type.software.test_execution_result"
    ]
  );
  assert.deepEqual(
    ODD_GLC_DATA_MAPPING_NODE_TYPES.map((entry) => entry.typeRef),
    [
      "odd_glc.type.software.mapping_spec",
      "odd_glc.type.software.schema_source",
      "odd_glc.type.software.mapper_source",
      "odd_glc.type.software.mapper_validation_test",
      "odd_glc.type.software.mapper_build_config"
    ]
  );
  assert.equal(ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES.length, 1);
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS.length,
    ODD_GLC_SOFTWARE_BUILD_NODE_TYPES.length +
      ODD_GLC_DATA_MAPPING_NODE_TYPES.length +
      ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES.length
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS.includes(
      "gtl-library-entry://odd_glc/node-type/odd_glc.type.software.mapper_source"
    ),
    true
  );

  const declarations = defineLifecycleNodeTypeDeclarations(facades);
  const expectedPrimitiveCount =
    ODD_GLC_LIFECYCLE_NODE_TYPES.length +
    ODD_GLC_SOFTWARE_BUILD_NODE_TYPES.length +
    ODD_GLC_DATA_MAPPING_NODE_TYPES.length;
  const expectedComposedCount =
    ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES.length +
    ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES.length;

  assert.equal(declarations.status, "accepted");
  assert.equal(declarations.value.nodes.length, expectedPrimitiveCount);
  assert.equal(
    declarations.value.graphFunctions.length,
    expectedPrimitiveCount + expectedComposedCount
  );
  assert.equal(declarations.value.libraryEntries.length, declarations.value.graphFunctions.length);
  assert.equal(declarations.value.allNodeTypeEntries.length, expectedPrimitiveCount);
  assert.equal(declarations.value.allComposedNodeTypeEntries.length, expectedComposedCount);
  assert.equal(declarations.value.compositionResults.every((row) => row.satisfied === true), true);
  assert.equal(declarations.value.libraryEntries.every((entry) => entry.entryKind === "node_type"), true);
  assert.equal(declarations.value.libraryEntries.every((entry) => entry.libraryScope === "product"), true);
  assert.equal(
    declarations.value.libraryEntries.every((entry) => entry.declarationSourceRefs.length >= 2),
    true
  );

  for (const entry of ODD_GLC_LIFECYCLE_NODE_TYPES) {
    const graphFunction = declarations.value.graphFunctions.find((row) => row.name === entry.typeRef);
    assert.ok(graphFunction, `Missing identity graph function for ${entry.typeRef}`);
    assert.equal(graphFunction.effects.length, 0);
    assert.equal(graphFunction.tags.includes("gtl:node_type"), true);
    const overlayEntry = ODD_GLC_LIFECYCLE_SLOT_MAP.entries.find((row) => row.surface === entry.surface);
    if (overlayEntry) {
      const libraryEntry = declarations.value.libraryEntries.find((row) => row.graphFunctionRef === graphFunction.id);
      assert.ok(libraryEntry, `Missing GTL binding entry for ${entry.typeRef}`);
      assert.equal(
        libraryEntry.overlayRefs.includes(overlayEntry.entryId),
        true,
        `Missing ${overlayEntry.entryId} binding for ${entry.typeRef}`
      );
    }
  }
  for (const entry of [...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES, ...ODD_GLC_DATA_MAPPING_NODE_TYPES]) {
    const graphFunction = declarations.value.graphFunctions.find((row) => row.name === entry.typeRef);
    assert.ok(graphFunction, `Missing identity graph function for ${entry.typeRef}`);
    assert.equal(graphFunction.effects.length, 0);
    const libraryEntry = declarations.value.libraryEntries.find((row) => row.graphFunctionRef === graphFunction.id);
    assert.ok(libraryEntry, `Missing GTL binding entry for ${entry.typeRef}`);
    assert.equal(
      libraryEntry.overlayRefs.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef) ||
        libraryEntry.overlayRefs.some((ref) => ref.startsWith("software-build.role.")),
      true,
      `Missing software-build overlay or role binding for ${entry.typeRef}`
    );
  }
  const dataMappingBundleGraphFunction = declarations.value.graphFunctions.find(
    (entry) => entry.name === "odd_glc.type.software.data_mapping_implementation_bundle"
  );
  assert.ok(dataMappingBundleGraphFunction, "Missing data-mapping composed node-type graph function");
  const dataMappingBundle = declarations.value.libraryEntries.find(
    (entry) => entry.graphFunctionRef === dataMappingBundleGraphFunction.id
  );
  assert.ok(dataMappingBundle, "Missing data-mapping composed node-type GTL binding entry");
  assert.equal(dataMappingBundle.overlayRefs.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef), true);
  assert.equal(dataMappingBundle.overlayRefs.includes("software-build.role.mapping_spec"), true);
});

test("defines startup binding as GTL declarations for ABG startup consumption", async () => {
  const facades = await importGtlFacades();
  const startup = defineOddGlcStartupBinding(facades);
  const expectedGraphFunctionBindings = [
    ...ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS,
    ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS
  ];

  assert.equal(startup.status, "accepted");
  assert.equal(startup.value.startupConfig.kind, "product_registry_startup_config");
  assert.equal(startup.value.startupConfig.configRef, ODD_GLC_STARTUP_BINDING.configRef);
  assert.equal(startup.value.startupConfig.productNamespace, "odd_glc");
  assert.equal(startup.value.libraryEntries.length, expectedGraphFunctionBindings.length);
  assert.equal(startup.value.libraryEntries.every((entry) => entry.entryKind === "graph_function"), true);
  assert.equal(startup.value.libraryEntries.every((entry) => entry.libraryScope === "product"), true);
  assert.deepEqual(
    startup.value.libraryEntries.map((entry) => entry.entryRef),
    expectedGraphFunctionBindings.map((entry) => entry.entryRef)
  );
  assert.equal(startup.value.pluginAdvice.kind, "product_plugin_selection_advice");
  assert.equal(startup.value.pluginAdvice.preferredCandidateRef, null);
  assert.equal(startup.value.pluginAdvice.forbiddenAuthorityRefs.length, FORBIDDEN_ABG_STARTUP_AUTHORITIES.length);
  assert.equal(startup.value.overlayRefs.includes("surface.lifecycle_worksite"), true);
  assert.equal(startup.value.overlayRefs.includes("view.release_readiness_state"), true);
  assert.equal(startup.value.overlayRefs.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef), true);
  assert.equal(
    ODD_GLC_STARTUP_BINDING.readinessRefs.includes("readiness://odd_glc/abg-4.2/catalog-reuse-audited-no-equivalent"),
    true
  );
  assert.equal(
    expectedGraphFunctionBindings.every((entry) =>
      entry.catalogReuseStatus === "abg_4_2_no_equivalent_published" &&
      entry.genericity === "candidate_abg_system_function" &&
      entry.reuseGate === "bind_existing_abg_catalog_entry_when_equivalent_exists"
    ),
    true
  );
});

test("defines reusable software-build overlay as a GTL overlay graph declaration", () => {
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.kind, "odd_glc_software_build_overlay_graph");
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef, "overlay://odd_glc/software-build-lifecycle");
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef, "graph://odd_glc/software-build-lifecycle");
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.scope, "reusable_software_build_lifecycle");
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.rule, "gtl_overlay_graph_declaration_over_gtl_abg_truth");
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef.includes("hello-world"), false);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphFunctionRefs.length, 4);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphVectorRefs.length, 4);
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphFunctionRefs.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget),
    true
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.publicStartTargets.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget),
    true
  );
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.test_source"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.scenario_surface"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.implementation_design"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.mapping_spec"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.mapper_source"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.mapper_validation_test"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.mapper_build_config"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.service_process"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.roleRefs.includes("software-build.role.parallel_branch"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.forbiddenAuthority.includes("product_local_runtime_shell"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.forbiddenAuthority.includes("graph_function_selection"), true);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.length, 4);
  assert.deepEqual(
    ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.graphFunctionRef),
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphFunctionRefs
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.every((entry) =>
      entry.overlayRefs.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef)
    ),
    true
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.every((entry) => !entry.entryRef.includes("hello-world")),
    true
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.every((entry) =>
      entry.catalogReuseStatus === "abg_4_2_no_equivalent_published" &&
      entry.genericity === "candidate_abg_system_function"
    ),
    true
  );
  assert.deepEqual(ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.overlayRefs, [
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef
  ]);
  for (const entryRef of [
    ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS,
    ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef)
  ]) {
    assert.equal(
      ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.entryRefs.includes(entryRef),
      true,
      `Missing software-build startup entry ${entryRef}`
    );
  }
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.entryRefs.length,
    ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS.length +
      ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.length
  );
  assert.deepEqual(
    ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.enabledLibraryRefs,
    [
      ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS,
      ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef)
    ].flatMap((entryRef) => [
      entryRef,
      entryRef.replace("gtl-library-entry://odd_glc/", "gtl-declaration://odd_glc/")
    ])
  );
  assert.equal(
    ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.readinessRefs.includes(
      "readiness://odd_glc/software-build-bootstrap-traversal-required"
    ),
    true
  );
});

test("rejects missing GTL declaration facades and exports no ABG startup authority", async () => {
  const missing = validateGtlAbg42DeclarationFacades({
    gtlM01Contracts: {},
    gtlM01Algebra: {},
    gtlM02Contracts: {}
  });
  const oddGlcModule = await import("../src/index.mjs");

  assert.equal(missing.status, "rejected");
  assert.equal(missing.reason, "missing_public_query");
  assert.equal(missing.sourceRefs.includes("constructNode"), true);

  const facades = await importGtlFacades();
  const misplaced = validateGtlAbg42DeclarationFacades({
    gtlM01Contracts: {
      constructNodeTypeGraphFunction: facades.gtlM01Algebra.constructNodeTypeGraphFunction
    },
    gtlM01Algebra: {
      constructNode: facades.gtlM01Contracts.constructNode,
      composeNodeTypes: facades.gtlM01Algebra.composeNodeTypes
    },
    gtlM02Contracts: facades.gtlM02Contracts
  });

  assert.equal(misplaced.status, "rejected");
  assert.equal(misplaced.reason, "missing_public_query");
  assert.equal(
    misplaced.diagnostics.includes("Missing public GTL declaration function gtlM01Contracts.constructNode"),
    true
  );
  assert.equal(
    misplaced.diagnostics.includes("Missing public GTL declaration function gtlM01Algebra.constructNodeTypeGraphFunction"),
    true
  );

  for (const authorityName of FORBIDDEN_ABG_STARTUP_AUTHORITIES) {
    assert.equal(
      Object.hasOwn(oddGlcModule, authorityName),
      false,
      `odd_glc must not export ABG startup authority ${authorityName}`
    );
  }
});

test("consumes the ABG 4.2 live GLC startup proof as emitted registry and traversal truth", async () => {
  const { proof, events, liveArtifacts, manifest } = await readPinnedGlcStartupFixture();
  const view = interpretStartupRegistryState({
    proof,
    runtimeEvents: events,
    liveArtifacts
  });

  assert.equal(view.status, "accepted");
  assert.equal(view.value.kind, "odd_glc_startup_registry_state_view");
  assert.equal(view.value.readiness, "traversal_converged");
  assert.equal(proof.sourceDirty, false);
  assert.equal(proof.snapshotTarballSha256, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.tarballSha256);
  assert.equal(proof.durationMs, manifest.durationMs);
  assert.equal(proof.startOutput.status, "converged");
  assert.equal(proof.startOutput.stopped_by, "converged");
  assert.equal(proof.startOutput.event_kinds.includes("registry_entry_admitted"), true);
  assert.equal(proof.startOutput.event_kinds.includes("graph_function_selected"), true);
  assert.equal(proof.startOutput.event_kinds.includes("graph_call_opened"), true);
  assert.equal(view.value.registryEntryCount, 6);
  assert.equal(view.value.nodeTypeEntryRefs.length, 5);
  assert.equal(view.value.graphFunctionEntryRefs.length, 1);
  assert.deepEqual(
    [...view.value.nodeTypeEntryRefs].sort(),
    ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS.map((entry) => entry.entryRef).sort()
  );
  assert.deepEqual(
    [...view.value.graphFunctionEntryRefs].sort(),
    ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef).sort()
  );
  assert.deepEqual(
    [...view.value.nodeTypeEntryRefs, ...view.value.graphFunctionEntryRefs].sort(),
    [...ODD_GLC_HELLO_WORLD_BOOTSTRAP_STARTUP_BINDING.entryRefs].sort()
  );
  for (const declared of ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS) {
    const event = events.find((row) => row.kind === "registry_entry_admitted" && row.entryRef === declared.entryRef);
    assert.ok(event, `Missing ABG registry admission for ${declared.entryRef}`);
    assert.equal(event.entryKind, "node_type");
    assert.equal(event.declarationRef, declared.declarationRef);
    assert.equal(event.graphFunctionRef, declared.typeRef);
    assert.deepEqual(event.overlayRefs, declared.overlayRefs);
  }
  for (const declared of ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS) {
    const event = events.find((row) => row.kind === "registry_entry_admitted" && row.entryRef === declared.entryRef);
    assert.ok(event, `Missing ABG registry admission for ${declared.entryRef}`);
    assert.equal(event.entryKind, "graph_function");
    assert.equal(event.declarationRef, declared.declarationRef);
    assert.deepEqual(event.overlayRefs, declared.overlayRefs);
  }
  assert.deepEqual(view.value.selectedEntryKinds, ["graph_function"]);
  assert.equal(
    events.some((event) =>
      event.kind === "graph_function_selected" &&
      event.selectedEntryRef === ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS[0].entryRef
    ),
    true
  );
  assert.equal(view.value.selectedGraphFunctionRefs.length, 1);
  assert.equal(events.filter((event) => event.kind === "graph_call_opened").length, 2);
  assert.equal(view.value.graphCallIds.length, 1);
  assert.equal(view.value.vectorClosedRefs.length, 2);
  assert.deepEqual(view.value.stdoutValues, ["Hello, world!\n"]);
  assert.equal(
    events.findIndex((event) => event.kind === "graph_function_selected") <
      events.findIndex((event) => event.kind === "graph_call_opened"),
    true
  );
  assert.equal(events.some((event) => event.kind === "graph_function_selected" && event.selectedEntryKind === "node_type"), false);
});
