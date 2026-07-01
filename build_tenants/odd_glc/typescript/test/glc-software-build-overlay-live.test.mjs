import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
  ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING,
  interpretStartupRegistryState
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const defaultAbgInstallRoot = path.join(
  appsRoot,
  `.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}`
);
const defaultAbgPackageRoot = path.join(
  defaultAbgInstallRoot,
  "lib",
  "node_modules",
  "@abiogenesis",
  "typescript-tenant"
);
const liveRoot = path.join(tenantRoot, "test_runs", "glc_software_build_overlay_live");

const SCENARIOS = Object.freeze([
  {
    key: "basic-cli",
    scenarioId: "SCN-GLC-HELLO-WORLD-CLI-BASIC",
    kind: "node_cli",
    files: [
      ["generated/hello-world.mjs", "console.log(\"Hello, world!\");\n"]
    ]
  },
  {
    key: "js-tenant-test",
    scenarioId: "SCN-GLC-HELLO-WORLD-JS-TENANT-TEST",
    kind: "node_test",
    files: [
      ["package.json", "{\n  \"private\": true,\n  \"type\": \"module\"\n}\n"],
      ["src/hello.mjs", "export function helloWorld() {\n  return \"Hello, world!\";\n}\n"],
      [
        "test/hello.test.mjs",
        "import assert from \"node:assert/strict\";\nimport { test } from \"node:test\";\nimport { helloWorld } from \"../src/hello.mjs\";\n\ntest(\"hello world subject returns the greeting\", () => {\n  assert.equal(helloWorld(), \"Hello, world!\");\n});\n"
      ]
    ]
  },
  {
    key: "rust-cli",
    scenarioId: "SCN-GLC-HELLO-WORLD-RUST-CLI",
    kind: "rust_cli",
    files: [
      ["Cargo.toml", "[package]\nname = \"glc_hello_world_rust\"\nversion = \"0.0.0\"\nedition = \"2021\"\n\n[dependencies]\n"],
      ["src/main.rs", "fn main() {\n    println!(\"Hello, world!\");\n}\n"]
    ]
  },
  {
    key: "rust-service",
    scenarioId: "SCN-GLC-HELLO-WORLD-RUST-SERVICE",
    kind: "rust_service",
    files: [
      [
        "src/service.rs",
        "use std::env;\nuse std::fs;\nuse std::io::{Read, Write};\nuse std::net::TcpListener;\n\nfn main() {\n    let port_file = env::args().nth(1).expect(\"port file path\");\n    let listener = TcpListener::bind(\"127.0.0.1:0\").expect(\"bind service\");\n    let port = listener.local_addr().expect(\"local addr\").port();\n    fs::write(&port_file, port.to_string()).expect(\"write port\");\n    if let Ok((mut stream, _addr)) = listener.accept() {\n        let mut buffer = [0_u8; 1024];\n        let _ = stream.read(&mut buffer);\n        let body = \"Hello, world!\\n\";\n        let response = format!(\n            \"HTTP/1.1 200 OK\\r\\nContent-Length: {}\\r\\nContent-Type: text/plain\\r\\nConnection: close\\r\\n\\r\\n{}\",\n            body.len(),\n            body\n        );\n        stream.write_all(response.as_bytes()).expect(\"write response\");\n    }\n}\n"
      ]
    ]
  },
  {
    key: "parallel-js",
    scenarioId: "SCN-GLC-HELLO-WORLD-PARALLEL-JS",
    kind: "parallel_js",
    files: [
      [
        "parallel/hello-branch.mjs",
        "import { mkdir, writeFile } from \"node:fs/promises\";\nawait mkdir(new URL(\"./output/\", import.meta.url), { recursive: true });\nawait writeFile(new URL(\"./output/hello.txt\", import.meta.url), \"Hello\", \"utf8\");\nprocess.stdout.write(\"Hello\");\n"
      ],
      [
        "parallel/world-branch.mjs",
        "import { mkdir, writeFile } from \"node:fs/promises\";\nawait mkdir(new URL(\"./output/\", import.meta.url), { recursive: true });\nawait writeFile(new URL(\"./output/world.txt\", import.meta.url), \"world\", \"utf8\");\nprocess.stdout.write(\"world\");\n"
      ],
      [
        "parallel/fan-in.mjs",
        "import { readFile, writeFile } from \"node:fs/promises\";\nconst hello = await readFile(new URL(\"./output/hello.txt\", import.meta.url), \"utf8\");\nconst world = await readFile(new URL(\"./output/world.txt\", import.meta.url), \"utf8\");\nconst greeting = `${hello}, ${world}!\\n`;\nawait writeFile(new URL(\"./output/fan-in.txt\", import.meta.url), greeting, \"utf8\");\nprocess.stdout.write(greeting);\n"
      ]
    ]
  },
  {
    key: "data-mapper-lite",
    scenarioId: "SCN-GLC-DATA-MAPPER-LITE-JS",
    kind: "data_mapper_lite_node_test",
    expectedStdout: "data_mapper_lite ok\n",
    artifactTypeRef: "odd_glc.type.software.data_mapping_implementation_bundle",
    materializeNodeTypes: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.mapping_spec",
      "odd_glc.type.software.schema_source",
      "odd_glc.type.software.mapper_source",
      "odd_glc.type.software.mapper_validation_test",
      "odd_glc.type.software.mapper_build_config",
      "odd_glc.type.software.data_mapping_implementation_bundle"
    ],
    proveNodeTypes: [
      "odd_glc.type.software.data_mapping_implementation_bundle",
      "odd_glc.type.software.test_execution_result",
      "odd_glc.type.evidence_binding_view"
    ],
    files: [
      ["package.json", "{\n  \"private\": true,\n  \"type\": \"module\"\n}\n"],
      [
        "specification/REQUIREMENTS.md",
        "# Data Mapper Lite Requirements\n\n- REQ-LDM-01: model is a directed multigraph of objects and morphisms.\n- REQ-LDM-02: every morphism declares one of 1:1, N:1, or 1:N cardinality.\n- REQ-LDM-03: dot paths compose only when each morphism exists and codomain/domain match.\n"
      ],
      [
        "src/logical-data-model.mjs",
        "const CARDINALITIES = new Set([\"1:1\", \"N:1\", \"1:N\"]);\n\nexport class LogicalDataModel {\n  constructor() {\n    this.entities = new Map();\n    this.morphisms = new Map();\n  }\n\n  addEntity(name) {\n    if (typeof name !== \"string\" || name.length === 0) {\n      throw new Error(\"entity name is required\");\n    }\n    this.entities.set(name, { name, identity: `${name}.id` });\n    return this.entities.get(name);\n  }\n\n  addMorphism(id, source, target, cardinality) {\n    if (!this.entities.has(source)) {\n      throw new Error(`unknown source entity: ${source}`);\n    }\n    if (!this.entities.has(target)) {\n      throw new Error(`unknown target entity: ${target}`);\n    }\n    if (!CARDINALITIES.has(cardinality)) {\n      throw new Error(`unknown cardinality: ${cardinality}`);\n    }\n    const row = { id, source, target, cardinality };\n    this.morphisms.set(id, row);\n    return row;\n  }\n\n  identityFor(entity) {\n    const row = this.entities.get(entity);\n    if (row === undefined) {\n      throw new Error(`unknown entity: ${entity}`);\n    }\n    return { id: row.identity, source: entity, target: entity, cardinality: \"1:1\" };\n  }\n\n  morphism(id) {\n    const row = this.morphisms.get(id);\n    if (row === undefined) {\n      throw new Error(`missing morphism: ${id}`);\n    }\n    return row;\n  }\n\n  dotPath(ids) {\n    if (!Array.isArray(ids) || ids.length === 0) {\n      throw new Error(\"path requires morphisms\");\n    }\n    const rows = ids.map((id) => this.morphism(id));\n    for (let index = 1; index < rows.length; index += 1) {\n      if (rows[index - 1].target !== rows[index].source) {\n        throw new Error(`composition mismatch: ${rows[index - 1].id} -> ${rows[index].id}`);\n      }\n    }\n    return rows;\n  }\n}\n"
      ],
      [
        "test/logical-data-model.test.mjs",
        "import assert from \"node:assert/strict\";\nimport { test } from \"node:test\";\nimport { LogicalDataModel } from \"../src/logical-data-model.mjs\";\n\nfunction model() {\n  const graph = new LogicalDataModel();\n  graph.addEntity(\"Customer\");\n  graph.addEntity(\"Order\");\n  graph.addEntity(\"Country\");\n  graph.addMorphism(\"customer.orders\", \"Customer\", \"Order\", \"1:N\");\n  graph.addMorphism(\"customer.primaryOrder\", \"Customer\", \"Order\", \"1:1\");\n  graph.addMorphism(\"order.country\", \"Order\", \"Country\", \"N:1\");\n  return graph;\n}\n\ntest(\"REQ-LDM-01 directed multigraph structure is explicit and queryable\", () => {\n  const graph = model();\n  assert.equal(graph.identityFor(\"Customer\").target, \"Customer\");\n  assert.equal(graph.morphism(\"customer.orders\").source, \"Customer\");\n  assert.equal(graph.morphism(\"customer.primaryOrder\").target, \"Order\");\n});\n\ntest(\"REQ-LDM-02 cardinality is required and constrained\", () => {\n  const graph = model();\n  assert.equal(graph.morphism(\"customer.orders\").cardinality, \"1:N\");\n  assert.throws(() => graph.addMorphism(\"bad\", \"Customer\", \"Order\", \"many\"), /unknown cardinality/u);\n});\n\ntest(\"REQ-LDM-03 dot paths compose only across matching codomain/domain\", () => {\n  const graph = model();\n  assert.deepEqual(graph.dotPath([\"customer.orders\", \"order.country\"]).map((row) => row.id), [\"customer.orders\", \"order.country\"]);\n  assert.throws(() => graph.dotPath([\"order.country\", \"customer.orders\"]), /composition mismatch/u);\n});\n"
      ]
    ]
  }
]);

function liveEnabled() {
  return process.env.ODD_GLC_GTL_ABG_HELLO_WORLDS_LIVE === "1" || process.env.CODEX_LIVE_FP === "1";
}

function selectedScenarios() {
  const requested = process.env.ODD_GLC_LIVE_SCENARIO;
  if (requested === undefined || requested.length === 0 || requested === "all") {
    return SCENARIOS;
  }
  const selected = SCENARIOS.filter((scenario) => scenario.key === requested || scenario.scenarioId === requested);
  assert.notEqual(selected.length, 0, `Unknown ODD_GLC_LIVE_SCENARIO ${requested}`);
  return Object.freeze(selected);
}

function timestampId() {
  return `${new Date().toISOString().replace(/[-:.]/gu, "").replace("Z", "Z")}_pid${process.pid}`;
}

function sha256Text(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function parseJsonLines(text) {
  return text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function run(command, args, options) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env
  });
  if (result.status !== 0) {
    throw new Error(
      `${options.label ?? command} failed with ${result.status ?? "null"}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
  }
  return result;
}

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("records the aggregate software-build overlay live manifest without product runtime authority", async () => {
  const manifest = await readJson(path.join(dirname, "proof_inputs", "glc-software-build-overlay-live-manifest.json"));

  assert.equal(manifest.kind, "odd_glc_software_build_overlay_live_manifest");
  assert.equal(manifest.substrate.packageVersion, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion);
  assert.equal(manifest.overlayRef, ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef);
  assert.equal(manifest.graphRef, ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef);
  assert.equal(manifest.graphFunctionRef, ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget);
  assert.equal(manifest.startupConfigRef, ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef);
  const scenariosById = new Map(SCENARIOS.map((scenario) => [scenario.scenarioId, scenario]));
  for (const run of manifest.runs) {
    const scenario = scenariosById.get(run.scenarioId);
    assert.ok(scenario, `Manifest contains unknown scenario ${run.scenarioId}`);
    assert.equal(run.subjectKind, scenario.kind);
    assert.match(run.eventLogSha256, /^sha256:[0-9a-f]{64}$/u);
    assert.deepEqual(run.requiredRuntimeTruth, [
      "registry_entry_admitted",
      "graph_function_selected",
      "graph_call_opened",
      "vector_closed"
    ]);
  }
  assert.deepEqual(
    SCENARIOS
      .filter((scenario) => !manifest.runs.some((run) => run.scenarioId === scenario.scenarioId))
      .map((scenario) => scenario.scenarioId),
    ["SCN-GLC-DATA-MAPPER-LITE-JS"]
  );
});

function runtimeBindingSource(input) {
  const packageImport = pathToFileURL(
    path.join(input.abgPackageRoot, "build", "semantic", "code", "src", "index.js")
  ).href;
  const oddGlcImport = pathToFileURL(path.join(tenantRoot, "src", "index.mjs")).href;
  return `import {
  admitModule,
  admitNode,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  composeNodeTypes,
  composeWithTypeWiring,
  constructDefaultAbgFnCompositionDeclarations,
  constructFpDispatchOutcome,
  constructGraphFunction,
  constructGtlLibraryEntryDeclaration,
  constructNode,
  constructNodeTypeGraphFunction,
  constructProductRegistryStartupConfig,
  contractForKnownAgent,
  defaultFpDispatchPlugin,
  defaultFpEvaluatorPlugin,
  edge,
  graphFunctionForVector,
  runAgentTransport,
  satisfiesNodeType
} from ${JSON.stringify(packageImport)};
import {
  ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
  ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ODD_GLC_LIFECYCLE_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING
} from ${JSON.stringify(oddGlcImport)};
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";

const SCENARIO = Object.freeze(${JSON.stringify(input.scenario, null, 2)});
const PRODUCT_NAMESPACE = ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.productNamespace;
const OWNER_REF = ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.ownerRef;
const PRODUCT_VERSION = ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.version;
const OVERLAY_REF = ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef;
const GRAPH_REF = ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef;
const GRAPH_FUNCTION_REF = ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget;
const TYPE_REFS = Object.freeze({
  context: "odd_glc.type.lifecycle_context",
  lifecycleArtifact: "odd_glc.type.lifecycle_artifact",
  artifact: SCENARIO.artifactTypeRef ?? "odd_glc.type.lifecycle_artifact",
  evidence: "odd_glc.type.evidence_binding_view",
  testExecutionResult: "odd_glc.type.software.test_execution_result"
});
const EXPECTED_STDOUT = SCENARIO.expectedStdout ?? "Hello, world!\\n";
const EXPECTED_MATERIALIZE_NODE_TYPES = Object.freeze(
  SCENARIO.materializeNodeTypes ?? [TYPE_REFS.context, TYPE_REFS.artifact]
);
const EXPECTED_PROVE_NODE_TYPES = Object.freeze(
  SCENARIO.proveNodeTypes ?? [TYPE_REFS.artifact, TYPE_REFS.evidence]
);

function uniq(values) {
  return Object.freeze([...new Set(values)].sort());
}

function assetSurface(input) {
  return Object.freeze({
    kind: input.kind,
    requiredContexts: uniq(input.requiredContexts ?? []),
    standardsRefs: uniq(input.standardsRefs ?? []),
    outputContractRefs: uniq(input.outputContractRefs ?? []),
    constructorRefs: uniq(input.constructorRefs ?? []),
    constructorInputAssetKinds: Object.freeze([]),
    rendererRefs: Object.freeze([]),
    renderedViewDigestPolicyRef: null,
    sectionKindRefs: Object.freeze([]),
    clauseKindRefs: Object.freeze([]),
    authoritySlots: Object.freeze([]),
    proofObligationRefs: uniq(input.proofObligationRefs ?? [])
  });
}

function typedNode(input) {
  return constructNode({
    name: input.name,
    schema: { kind: "symbolic", ref: input.schemaRef },
    typeRef: input.typeRef,
    markov: input.markov,
    assetSurface: assetSurface(input.assetSurface),
    tags: uniq(["odd_glc", "software-build", SCENARIO.key, ...(input.tags ?? [])])
  });
}

function admittedNode(input) {
  return admitNode(typedNode(input));
}

function nodeType(input) {
  return constructNodeTypeGraphFunction(typedNode(input), {
    typeRef: input.typeRef,
    tags: ["odd_glc", "software-build", "node_type", "non_callable"]
  });
}

const contextType = nodeType({
  name: "SoftwareBuildLifecycleContextType",
  schemaRef: "schema://odd_glc/software-build/lifecycle-context",
  typeRef: TYPE_REFS.context,
  markov: ["contextualized"],
  assetSurface: {
    kind: "lifecycle_context",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/lifecycle-context"],
    proofObligationRefs: ["proof://odd_glc/software-build/context"]
  }
});

const lifecycleArtifactType = nodeType({
  name: "SoftwareBuildLifecycleArtifactType",
  schemaRef: "schema://odd_glc/software-build/lifecycle-artifact",
  typeRef: TYPE_REFS.lifecycleArtifact,
  markov: ["materialized"],
  assetSurface: {
    kind: "target_artifact",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/lifecycle-artifact"],
    proofObligationRefs: ["proof://odd_glc/software-build/artifact"]
  }
});

function nodeTypeFromEntry(entry) {
  return nodeType({
    name: entry.nodeName,
    schemaRef: entry.schemaRef,
    typeRef: entry.typeRef,
    markov: entry.markov,
    assetSurface: {
      kind: entry.assetKind,
      requiredContexts: ["context://odd_glc/software-build"],
      outputContractRefs: [
        \`contract://\${entry.typeRef}\`,
        \`contract://odd_glc/\${entry.assetKind}\`
      ],
      proofObligationRefs: ["proof://odd_glc/software-build/node-type"]
    },
    tags: entry.tags
  });
}

const softwareBuildSpecializedTypes = Object.freeze(
  [...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES, ...ODD_GLC_DATA_MAPPING_NODE_TYPES].map(nodeTypeFromEntry)
);

const dataMappingBundleComposition = composeNodeTypes({
  typeRef: "odd_glc.type.software.data_mapping_implementation_bundle",
  constituentTypeRefs: ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES[0].constituentTypeRefs,
  graphFunctions: softwareBuildSpecializedTypes,
  name: "DataMappingImplementationBundle",
  tags: ["odd_glc", "software-build", "data_mapping", "node_type", "composed", "non_callable"]
});
if (dataMappingBundleComposition.satisfied !== true) {
  throw new Error(\`data_mapping_implementation_bundle composition rejected: \${dataMappingBundleComposition.rejectionReason}\`);
}

const artifactType = TYPE_REFS.artifact === "odd_glc.type.software.data_mapping_implementation_bundle"
  ? dataMappingBundleComposition.graphFunction
  : lifecycleArtifactType;

const evidenceType = nodeType({
  name: "SoftwareBuildEvidenceBindingViewType",
  schemaRef: "schema://odd_glc/software-build/evidence-binding",
  typeRef: TYPE_REFS.evidence,
  markov: ["projected"],
  assetSurface: {
    kind: "evidence_binding_view",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/evidence-binding"],
    proofObligationRefs: ["proof://odd_glc/software-build/evidence"]
  }
});

const lifecycleContext = admittedNode({
  name: "GlcSoftwareBuildContext",
  schemaRef: "schema://odd_glc/software-build/lifecycle-context",
  typeRef: TYPE_REFS.context,
  markov: ["contextualized"],
  assetSurface: {
    kind: "lifecycle_context",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/lifecycle-context"],
    proofObligationRefs: ["proof://odd_glc/software-build/context"]
  },
  tags: ["source"]
});

const generatedArtifact = admittedNode({
  name: "GeneratedSoftwareBuildArtifact",
  schemaRef: "schema://odd_glc/software-build/lifecycle-artifact",
  typeRef: TYPE_REFS.artifact,
  markov: ["materialized"],
  assetSurface: {
    kind: "target_artifact",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/lifecycle-artifact"],
    proofObligationRefs: ["proof://odd_glc/software-build/artifact"]
  },
  tags: ["artifact-output", SCENARIO.kind]
});

const runnableArtifact = admittedNode({
  name: "RunnableSoftwareBuildArtifact",
  schemaRef: "schema://odd_glc/software-build/lifecycle-artifact",
  typeRef: TYPE_REFS.artifact,
  markov: ["materialized"],
  assetSurface: {
    kind: "target_artifact",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/lifecycle-artifact"],
    proofObligationRefs: ["proof://odd_glc/software-build/artifact"]
  },
  tags: ["artifact-input", SCENARIO.kind]
});

const evidenceView = admittedNode({
  name: "SoftwareBuildExecutionEvidenceView",
  schemaRef: "schema://odd_glc/software-build/evidence-binding",
  typeRef: TYPE_REFS.evidence,
  markov: ["projected"],
  assetSurface: {
    kind: "evidence_binding_view",
    requiredContexts: ["context://odd_glc/software-build"],
    outputContractRefs: ["contract://odd_glc/evidence-binding"],
    proofObligationRefs: ["proof://odd_glc/software-build/evidence"]
  },
  tags: ["evidence-output", SCENARIO.kind]
});

const nodeTypeGraphFunctions = Object.freeze([
  ...new Map([
    contextType,
    lifecycleArtifactType,
    artifactType,
    evidenceType,
    ...softwareBuildSpecializedTypes
  ].filter(Boolean).map((graphFunction) => [graphFunction.id, graphFunction])).values()
]);

for (const [node, typeRef] of [
  [lifecycleContext, TYPE_REFS.context],
  [generatedArtifact, TYPE_REFS.artifact],
  [runnableArtifact, TYPE_REFS.artifact],
  [evidenceView, TYPE_REFS.evidence]
]) {
  const satisfaction = satisfiesNodeType({
    node,
    typeRef,
    graphFunctions: nodeTypeGraphFunctions
  });
  if (!satisfaction.satisfied) {
    throw new Error(\`GLC software-build node \${node.name} does not satisfy \${typeRef}: \${satisfaction.rejectionReason}\`);
  }
}

function vector(source, target, id, name) {
  return edge([source], target, {
    id,
    name,
    evaluators: [
      {
        name: \`\${name}_accepted\`,
        regime: "F_P",
        description: \`\${name} accepted by live worker plus ABG admission\`,
        binding: \`binding://odd_glc/software-build/\${SCENARIO.key}/\${name}\`,
        tags: ["odd_glc", "software-build", SCENARIO.key]
      }
    ],
    declarations: constructDefaultAbgFnCompositionDeclarations({
      scopeRef: \`odd-glc/software-build/\${SCENARIO.key}\`
    }),
    tags: ["odd_glc", "software-build", SCENARIO.key, OVERLAY_REF]
  }).vectors[0];
}

const materializeArtifact = graphFunctionForVector(
  vector(
    lifecycleContext,
    generatedArtifact,
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphVectorRefs[0],
    "software_build_bootstrap_to_artifact"
  ),
  {
    id: "graph-function://odd_glc/software-build/internal/materialize-artifact",
    name: "odd_glc.software_build.materialize_artifact",
    tags: ["odd_glc", "software-build", SCENARIO.key]
  }
);

const proveArtifact = graphFunctionForVector(
  vector(
    runnableArtifact,
    evidenceView,
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphVectorRefs[2],
    "software_build_artifact_to_evidence"
  ),
  {
    id: "graph-function://odd_glc/software-build/internal/prove-artifact",
    name: "odd_glc.software_build.prove_artifact",
    tags: ["odd_glc", "software-build", SCENARIO.key]
  }
);

const composedSoftwareBuild = composeWithTypeWiring(
  materializeArtifact,
  proveArtifact,
  {
    nodeTypeGraphFunctions,
    wiring: [
      {
        providedNodeName: "GeneratedSoftwareBuildArtifact",
        requiredNodeName: "RunnableSoftwareBuildArtifact",
        typeRef: TYPE_REFS.artifact
      }
    ]
  }
);

const softwareBuildBootstrap = constructGraphFunction({
  name: "odd_glc.software_build.bootstrap_worksite",
  environment: composedSoftwareBuild.environment,
  inputs: composedSoftwareBuild.inputs,
  outputs: composedSoftwareBuild.outputs,
  template: composedSoftwareBuild.template,
  effects: composedSoftwareBuild.effects,
  declarations: composedSoftwareBuild.declarations,
  tags: uniq([...composedSoftwareBuild.tags, "odd_glc", "software-build", SCENARIO.key, OVERLAY_REF]),
  id: GRAPH_FUNCTION_REF
});

const module = admitModule({
  name: \`odd_glc_software_build_\${SCENARIO.key}\`,
  graphs: [softwareBuildBootstrap.template.graph],
  graphFunctions: [softwareBuildBootstrap, ...nodeTypeGraphFunctions],
  refinementBoundaries: [],
  candidateFamilies: [],
  jobs: [
    {
      id: \`job://odd_glc/software-build/\${SCENARIO.key}\`,
      name: \`odd_glc_software_build_\${SCENARIO.key}\`,
      contracts: [{ kind: "graph_function", targetId: softwareBuildBootstrap.id }],
      roles: [],
      tags: ["odd_glc", "software-build", SCENARIO.key]
    }
  ],
  roles: [],
  operators: [],
  evaluators: [],
  rules: [],
  imports: [],
  metadata: { entries: [] }
});

function nodeTypeDeclaration(input) {
  return constructGtlLibraryEntryDeclaration({
    declarationRef: \`gtl-declaration://odd_glc/software-build/\${SCENARIO.key}/node-type/\${input.slug}\`,
    entryRef: \`gtl-library-entry://odd_glc/software-build/\${SCENARIO.key}/node-type/\${input.slug}\`,
    libraryScope: "product",
    entryKind: "node_type",
    namespace: PRODUCT_NAMESPACE,
    ownerRef: OWNER_REF,
    version: PRODUCT_VERSION,
    graphFunctionRef: input.graphFunctionRef,
    interfaceRef: \`interface://odd_glc/software-build/\${input.slug}\`,
    sourceContractRef: input.contractRef,
    targetContractRef: input.contractRef,
    contextRefs: ["context://odd_glc/software-build"],
    authorityRefs: ["authority://gtl/typecheck"],
    overlayRefs: uniq([OVERLAY_REF, ...(input.overlayRefs ?? [input.slotRef])]),
    provenanceRefs: ["provenance://abiogenesis/4.2.0-rc.1"],
    readinessRefs: ["readiness://odd_glc/software-build/node-type-declared"],
    proofRefs: ["proof.negative_boundary"],
    policyRefs: ["policy://odd_glc/typecheck-only"],
    declarationSourceRefs: [GRAPH_REF]
  });
}

function slugForTypeRef(typeRef) {
  return typeRef.replace(/^odd_glc\\.type\\./u, "").replace(/[^a-z0-9]+/giu, "-").replace(/^-|-$/gu, "");
}

const declaredNodeTypeMetadata = Object.freeze([
  ...ODD_GLC_LIFECYCLE_NODE_TYPES,
  ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ...ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ...ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES
]);

function metadataForNodeType(graphFunction) {
  const typeRef = graphFunction.name;
  const declared = declaredNodeTypeMetadata.find((entry) => entry.typeRef === typeRef);
  const overlayRefs = Array.isArray(declared?.overlayRefs) && declared.overlayRefs.length > 0
    ? declared.overlayRefs
    : typeRef === TYPE_REFS.context
      ? ["surface.lifecycle_context"]
      : typeRef === TYPE_REFS.evidence
        ? ["surface.evidence_binding"]
        : ["surface.target_artifact"];
  const assetKind = typeof declared?.assetKind === "string"
    ? declared.assetKind
    : typeRef === TYPE_REFS.evidence
      ? "evidence_binding_view"
      : "target_artifact";
  return Object.freeze({
    slug: slugForTypeRef(typeRef),
    graphFunctionRef: graphFunction.id,
    contractRef: \`contract://\${typeRef}\`,
    overlayRefs,
    assetKind
  });
}

const bootstrapBinding = ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.find((entry) =>
  entry.graphFunctionRef === GRAPH_FUNCTION_REF
);
if (bootstrapBinding === undefined) {
  throw new Error("Missing odd_glc software-build bootstrap graph-function binding");
}

const nodeTypeProductDeclarations = nodeTypeGraphFunctions.map((graphFunction) =>
  nodeTypeDeclaration(metadataForNodeType(graphFunction))
);

const productDeclarations = Object.freeze([
  ...nodeTypeProductDeclarations,
  constructGtlLibraryEntryDeclaration({
    declarationRef: bootstrapBinding.entryRef.replace("gtl-library-entry://odd_glc/", "gtl-declaration://odd_glc/"),
    entryRef: bootstrapBinding.entryRef,
    libraryScope: "product",
    entryKind: "graph_function",
    namespace: PRODUCT_NAMESPACE,
    ownerRef: OWNER_REF,
    version: PRODUCT_VERSION,
    graphFunctionRef: softwareBuildBootstrap.id,
    interfaceRef: bootstrapBinding.interfaceRef,
    sourceContractRef: bootstrapBinding.sourceContractRef,
    targetContractRef: bootstrapBinding.targetContractRef,
    contextRefs: ["context://odd_glc/software-build"],
    authorityRefs: ["authority://abg/runtime"],
    overlayRefs: bootstrapBinding.overlayRefs,
    provenanceRefs: ["provenance://abiogenesis/4.2.0-rc.1"],
    readinessRefs: bootstrapBinding.readinessRefs,
    proofRefs: bootstrapBinding.proofRefs,
    policyRefs: bootstrapBinding.policyRefs,
    declarationSourceRefs: [GRAPH_REF, softwareBuildBootstrap.id]
  })
]);

const runtimeRegistryStartup = Object.freeze({
  systemDeclarations: Object.freeze([]),
  productStartupConfig: constructProductRegistryStartupConfig({
    configRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    productNamespace: PRODUCT_NAMESPACE,
    ownerRef: OWNER_REF,
    version: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.version,
    enabledLibraryRefs: productDeclarations.flatMap((entry) => [entry.entryRef, entry.declarationRef]),
    overlayRefs: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.overlayRefs,
    pluginRefs: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.pluginRefs,
    readinessRefs: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.readinessRefs,
    proofRefs: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.proofRefs,
    policyRefs: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.policyRefs,
    configSourceRefs: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configSourceRefs
  }),
  productDeclarations,
  causationEventRefs: [\`bootstrap://odd_glc/software-build/\${SCENARIO.key}\`],
  correlationId: \`correlation://odd_glc/software-build/\${SCENARIO.key}/startup\`
});

function extractJsonObject(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(new RegExp("\`\`\`(?:json)?\\\\s*([\\\\s\\\\S]*?)\\\\s*\`\`\`", "iu"));
  const candidate = fenced?.[1] ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error(\`GLC live worker did not return JSON: \${text}\`);
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

async function writeText(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

function runSync(command, args, cwd) {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(command, args, { cwd, encoding: "utf8", env });
  return Object.freeze({
    command,
    args,
    cwd,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  });
}

function runAsync(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const child = spawn(command, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", reject);
    child.on("close", (status, signal) => {
      resolve(Object.freeze({ command, args, cwd, pid: child.pid, status, signal, stdout, stderr }));
    });
  });
}

async function materializeScenario(workspaceRoot) {
  for (const [relativePath, contents] of SCENARIO.files) {
    await writeText(path.join(workspaceRoot, relativePath), contents);
  }
  return Object.freeze(SCENARIO.files.map(([relativePath]) => path.join(workspaceRoot, relativePath)));
}

async function waitForPortFile(portPath, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const value = Number.parseInt(await readFile(portPath, "utf8"), 10);
      if (Number.isInteger(value) && value > 0) {
        return value;
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(\`Timed out waiting for service port file at \${portPath}\`);
}

async function executeScenario(workspaceRoot) {
  if (SCENARIO.kind === "node_cli") {
    const result = runSync(process.execPath, ["generated/hello-world.mjs"], workspaceRoot);
    if (result.status !== 0 || result.stdout !== "Hello, world!\\n") {
      throw new Error(\`node_cli failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({ kind: SCENARIO.kind, stdout: result.stdout, commands: [result] });
  }
  if (SCENARIO.kind === "node_test") {
    const result = runSync(process.execPath, ["--test", "test/hello.test.mjs"], workspaceRoot);
    if (result.status !== 0 || !result.stdout.includes("pass 1")) {
      throw new Error(\`node_test failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({ kind: SCENARIO.kind, stdout: "Hello, world!\\n", commands: [result] });
  }
  if (SCENARIO.kind === "rust_cli") {
    const result = runSync("cargo", ["run", "--quiet"], workspaceRoot);
    if (result.status !== 0 || result.stdout !== "Hello, world!\\n") {
      throw new Error(\`rust_cli failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({ kind: SCENARIO.kind, stdout: result.stdout, commands: [result] });
  }
  if (SCENARIO.kind === "rust_service") {
    const serviceRoot = workspaceRoot;
    const sourcePath = path.join(serviceRoot, "src", "service.rs");
    const binaryPath = path.join(serviceRoot, "hello_service");
    const portPath = path.join(serviceRoot, "service.port");
    const compile = runSync("rustc", [sourcePath, "-o", binaryPath], serviceRoot);
    if (compile.status !== 0) {
      throw new Error(\`rust_service compile failed: \${JSON.stringify(compile)}\`);
    }
    const service = spawn(binaryPath, [portPath], { cwd: serviceRoot, stdio: ["ignore", "pipe", "pipe"] });
    let serviceStdout = "";
    let serviceStderr = "";
    service.stdout.on("data", (chunk) => { serviceStdout += chunk.toString("utf8"); });
    service.stderr.on("data", (chunk) => { serviceStderr += chunk.toString("utf8"); });
    const serviceExit = new Promise((resolve) => {
      service.on("close", (status, signal) => resolve({ status, signal }));
    });
    const port = await waitForPortFile(portPath, 10000);
    const response = await fetch(\`http://127.0.0.1:\${port}/hello\`);
    const body = await response.text();
    const exit = await Promise.race([
      serviceExit,
      new Promise((resolve) => setTimeout(() => {
        service.kill("SIGKILL");
        resolve({ status: null, signal: "SIGKILL" });
      }, 10000))
    ]);
    if (response.status !== 200 || body !== "Hello, world!\\n" || exit.status !== 0) {
      throw new Error(\`rust_service failed: \${JSON.stringify({ status: response.status, body, exit, serviceStdout, serviceStderr })}\`);
    }
    return Object.freeze({
      kind: SCENARIO.kind,
      stdout: body,
      commands: [compile, Object.freeze({ command: binaryPath, args: [portPath], cwd: serviceRoot, pid: service.pid, status: exit.status, signal: exit.signal, stdout: serviceStdout, stderr: serviceStderr })],
      clientRequest: { status: response.status, body, url: \`http://127.0.0.1:\${port}/hello\` }
    });
  }
  if (SCENARIO.kind === "parallel_js") {
    const scriptRoot = path.join(workspaceRoot, "parallel");
    const [hello, world] = await Promise.all([
      runAsync(process.execPath, ["hello-branch.mjs"], scriptRoot),
      runAsync(process.execPath, ["world-branch.mjs"], scriptRoot)
    ]);
    const fanIn = runSync(process.execPath, ["fan-in.mjs"], scriptRoot);
    if (hello.status !== 0 || world.status !== 0 || fanIn.status !== 0 || fanIn.stdout !== "Hello, world!\\n") {
      throw new Error(\`parallel_js failed: \${JSON.stringify({ hello, world, fanIn })}\`);
    }
    return Object.freeze({ kind: SCENARIO.kind, stdout: fanIn.stdout, commands: [hello, world, fanIn] });
  }
  throw new Error(\`Unknown scenario kind \${SCENARIO.kind}\`);
}

function promptFor(input) {
  const stage = input.vectorIndex === 0 ? "materialize" : "prove";
  return [
    "Return only one JSON object. Do not include markdown or commentary.",
    "You are the live F_P worker for an odd_glc software-build lifecycle traversal.",
    "ABG owns registry startup, graph-function selection, graph-call opening, traversal events, and closure.",
    "odd_glc supplies GTL declaration data: the reusable software-build overlay graph and startup binding.",
    "",
    \`Scenario: \${SCENARIO.scenarioId}\`,
    \`Scenario kind: \${SCENARIO.kind}\`,
    \`Stage: \${stage}\`,
    \`Overlay ref: \${OVERLAY_REF}\`,
    \`Graph ref: \${GRAPH_REF}\`,
    \`Selected graph function ref: \${GRAPH_FUNCTION_REF}\`,
    \`Current edge: \${input.edge}\`,
    \`Vector index: \${input.vectorIndex}\`,
    "",
    "Declared generic odd_glc node type refs:",
    \`- lifecycle context: \${TYPE_REFS.context}\`,
    \`- lifecycle artifact: \${TYPE_REFS.artifact}\`,
    \`- evidence binding view: \${TYPE_REFS.evidence}\`,
    "",
    "Required JSON:",
    "{",
    "  \\"accepted\\": true,",
    \`  \\"stage\\": \${JSON.stringify(stage)},\`,
    \`  \\"expectedStdout\\": \${JSON.stringify(EXPECTED_STDOUT)},\`,
    "  \\"nodeTypesUsed\\": string[],",
    "  \\"reason\\": string",
    "}",
    "",
    input.vectorIndex === 0
      ? \`nodeTypesUsed must include at least: \${EXPECTED_MATERIALIZE_NODE_TYPES.join(", ")}.\`
      : \`nodeTypesUsed must include at least: \${EXPECTED_PROVE_NODE_TYPES.join(", ")}.\`,
    "Do not claim to emit ABG events, select graph functions, open graph calls, or close traversal."
  ].join("\\n");
}

export const runtimeBinding = {
  module,
  runtimeIdentity: admitResolvedRuntimeIdentity({
    workerId: \`worker://odd_glc/software-build/\${SCENARIO.key}\`,
    backendId: "backend://node",
    buildId: \`build://odd_glc/software-build/\${SCENARIO.key}\`,
    resolvedRuntimeRef: \`runtime://odd_glc/software-build/\${SCENARIO.key}\`
  }),
  resolvedPolicy: admitResolvedPolicyIdentity({
    resolvedPolicyBundleRef: \`policy://odd_glc/software-build/\${SCENARIO.key}\`,
    defaultRegime: "F_P",
    dispatchRef: \`dispatch://odd_glc/software-build/\${SCENARIO.key}\`,
    approvalSubjectRef: null
  }),
  runtimeRegistryStartup,
  runId: \`run://odd_glc/software-build/\${SCENARIO.key}\`,
  workKey: \`wk://odd_glc/software-build/\${SCENARIO.key}\`,
  createPlugins: ({ workspaceRoot }) => {
    const fpDispatch = Object.freeze({
      contract: defaultFpDispatchPlugin.contract,
      dispatch: async (pluginInput) => {
        const runRoot = path.join(workspaceRoot, ".ai-workspace", "glc-software-build-live", SCENARIO.key);
        await mkdir(runRoot, { recursive: true });
        const label = \`\${SCENARIO.key}-vector-\${pluginInput.vectorIndex}\`;
        const transport = await runAgentTransport({
          contract: contractForKnownAgent(process.env.ABG_TS_LIVE_AGENT ?? "claude"),
          prompt: promptFor(pluginInput),
          cwd: workspaceRoot,
          archiveRoot: runRoot,
          label,
          timeoutMs: Number.parseInt(process.env.ABG_TS_LIVE_TIMEOUT_MS ?? "240000", 10),
          outputPath: path.join(runRoot, \`\${label}-output.txt\`),
          promptPath: path.join(runRoot, \`\${label}-prompt.txt\`),
          stdoutPath: path.join(runRoot, \`\${label}-stdout.log\`),
          stderrPath: path.join(runRoot, \`\${label}-stderr.log\`)
        });
        if (transport.status !== 0) {
          throw new Error(\`GLC software-build live worker failed: \${transport.stderr}\`);
        }
        const assessment = extractJsonObject(transport.text);
        const expectedStage = pluginInput.vectorIndex === 0 ? "materialize" : "prove";
        const expectedNodeTypes = pluginInput.vectorIndex === 0
          ? EXPECTED_MATERIALIZE_NODE_TYPES
          : EXPECTED_PROVE_NODE_TYPES;
        if (
          assessment.accepted !== true ||
          assessment.stage !== expectedStage ||
          assessment.expectedStdout !== EXPECTED_STDOUT ||
          !Array.isArray(assessment.nodeTypesUsed) ||
          !expectedNodeTypes.every((typeRef) => assessment.nodeTypesUsed.includes(typeRef))
        ) {
          throw new Error(\`GLC software-build live worker returned invalid assessment: \${JSON.stringify(assessment)}\`);
        }
        const materializedFiles = pluginInput.vectorIndex === 0
          ? await materializeScenario(workspaceRoot)
          : Object.freeze(SCENARIO.files.map(([relativePath]) => path.join(workspaceRoot, relativePath)));
        const execution = pluginInput.vectorIndex === 0
          ? null
          : await executeScenario(workspaceRoot);
        const assessmentIds = pluginInput.expectedAssessmentIds.length > 0
          ? pluginInput.expectedAssessmentIds
          : [\`software_build_\${SCENARIO.key}_vector_\${pluginInput.vectorIndex}_fulfilled\`];
        const artifact = Object.freeze({
          artifactKind: "odd_glc_software_build_overlay_live_artifact",
          scenarioId: SCENARIO.scenarioId,
          scenarioKind: SCENARIO.kind,
          overlayRef: OVERLAY_REF,
          graphRef: GRAPH_REF,
          graphFunctionRef: GRAPH_FUNCTION_REF,
          edge: pluginInput.edge,
          actor: process.env.ABG_TS_LIVE_AGENT ?? "claude",
          vectorIndex: pluginInput.vectorIndex,
          stage: expectedStage,
          assessment,
          materializedFiles,
          execution,
          stdout: execution?.stdout ?? null,
          fulfillment_assessments: assessmentIds.map((assessmentId) =>
            Object.freeze({
              id: assessmentId,
              evaluator: assessmentId,
              fulfillment_status: "fulfilled",
              fulfillment_detail:
                pluginInput.vectorIndex === 0
                  ? "Live F_P worker accepted materialization of the software-build Hello World artifact under the reusable odd_glc overlay graph."
                  : "Live F_P worker accepted execution proof for the software-build Hello World artifact under the reusable odd_glc overlay graph.",
              blocking_reasons: [],
              evidence_refs: [
                OVERLAY_REF,
                GRAPH_REF,
                GRAPH_FUNCTION_REF,
                ...expectedNodeTypes
              ]
            })
          ),
          selected_worker_id: \`worker://odd_glc/software-build/\${SCENARIO.key}\`,
          selected_backend: \`backend://\${process.env.ABG_TS_LIVE_AGENT ?? "claude"}\`,
          role_id: "role://odd_glc/software-build/live-fp",
          assignment_source: \`policy://odd_glc/software-build/\${SCENARIO.key}\`,
          resolved_runtime_ref: \`runtime://odd_glc/software-build/\${SCENARIO.key}\`,
          transport: Object.freeze({
            status: transport.status,
            command: transport.command,
            traceResultPath: transport.traceResultPath,
            outputPath: transport.outputPath,
            structuredEventCount: transport.structuredEventCount,
            apiRetryCount: transport.apiRetryCount
          })
        });
        await writeText(path.join(runRoot, \`\${label}-artifact.json\`), \`\${JSON.stringify(artifact, null, 2)}\\n\`);
        return constructFpDispatchOutcome({
          status: "dispatched",
          resultRef: \`result://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}\`,
          attachedResultArtifact: artifact,
          evidenceRefs: [
            OVERLAY_REF,
            GRAPH_REF,
            GRAPH_FUNCTION_REF,
            ...expectedNodeTypes
          ]
        });
      }
    });
    return Object.freeze({
      fpDispatch,
      fpEvaluator: defaultFpEvaluatorPlugin
    });
  }
};
`;
}

async function writeRuntimeBinding(input) {
  const runtimeBindingPath = path.join(input.workspaceRoot, ".abiogenesis", "typescript-runtime.mjs");
  await writeText(runtimeBindingPath, runtimeBindingSource(input));
  return runtimeBindingPath;
}

async function runScenarioLive(scenario) {
  const abgInstallRoot = process.env.ABG_TYPESCRIPT_TENANT_INSTALL_ROOT ?? defaultAbgInstallRoot;
  const abgPackageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgPackageRoot;
  const genesisCommand = path.join(abgInstallRoot, "bin", "genesis-ts");
  assert.equal(existsSync(genesisCommand), true, `Missing installed genesis-ts at ${genesisCommand}`);
  assert.equal(existsSync(path.join(abgPackageRoot, "build", "semantic", "code", "src", "index.js")), true);

  const runRoot = path.join(liveRoot, scenario.key, timestampId());
  const workspaceRoot = path.join(runRoot, "instance");
  const toolchainRoot = path.join(runRoot, "toolchain");
  await mkdir(workspaceRoot, { recursive: true });
  run(
    genesisCommand,
    [
      "install",
      "--target",
      workspaceRoot,
      "--package-source",
      abgPackageRoot,
      "--toolchain-root",
      toolchainRoot
    ],
    {
      cwd: runRoot,
      label: `installed genesis-ts install for ${scenario.key}`,
      env: process.env
    }
  );
  const runtimeBindingPath = await writeRuntimeBinding({ abgPackageRoot, scenario, workspaceRoot });
  const startedAt = Date.now();
  const start = run(
    genesisCommand,
    [
      "start",
      "--workspace",
      workspaceRoot,
      "--scope",
      "workspace",
      "--target",
      "next",
      "--until",
      "converged"
    ],
    {
      cwd: workspaceRoot,
      label: `installed genesis-ts start for ${scenario.key}`,
      env: {
        ...process.env,
        CODEX_LIVE_FP: "1",
        ABG_TS_LIVE_AGENT: process.env.ABG_TS_LIVE_AGENT ?? "claude",
        ABG_TS_LIVE_TIMEOUT_MS: process.env.ABG_TS_LIVE_TIMEOUT_MS ?? "240000"
      }
    }
  );
  const durationMs = Date.now() - startedAt;
  const startOutput = JSON.parse(start.stdout.trim());
  const events = parseJsonLines(await readFile(startOutput.events_path, "utf8"));
  const artifactRoot = path.join(workspaceRoot, ".ai-workspace", "glc-software-build-live", scenario.key);
  const artifacts = [
    await readJson(path.join(artifactRoot, `${scenario.key}-vector-0-artifact.json`)),
    await readJson(path.join(artifactRoot, `${scenario.key}-vector-1-artifact.json`))
  ];
  const proof = {
    kind: "odd_glc_software_build_overlay_live_proof",
    scenarioId: scenario.scenarioId,
    scenarioKind: scenario.kind,
    durationMs,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    graphRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef,
    graphFunctionRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget,
    runtimeBindingPath,
    workspaceRoot,
    startOutput,
    eventLogSha256: sha256Text(await readFile(startOutput.events_path, "utf8")),
    artifactSha256s: artifacts.map((artifact) => sha256Text(JSON.stringify(artifact)))
  };
  await writeText(
    path.join(runRoot, "odd-glc-software-build-overlay-live-proof.json"),
    `${JSON.stringify(proof, null, 2)}\n`
  );
  return Object.freeze({ artifacts, durationMs, events, proof, runRoot, startOutput, workspaceRoot });
}

for (const scenario of selectedScenarios()) {
  test(`runs ${scenario.scenarioId} through the odd_glc software-build GTL overlay graph`, async (t) => {
    if (!liveEnabled()) {
      t.skip("set CODEX_LIVE_FP=1 or ODD_GLC_GTL_ABG_HELLO_WORLDS_LIVE=1 to run live LLM-backed GLC Hello Worlds");
      return;
    }
    const result = await runScenarioLive(scenario);
    const graphFunctionEntry = ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.find((entry) =>
      entry.graphFunctionRef === ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget
    );
    assert.ok(graphFunctionEntry);
    const view = interpretStartupRegistryState({
      proof: { startOutput: result.startOutput },
      runtimeEvents: result.events,
      liveArtifacts: result.artifacts
    });

    assert.equal(result.startOutput.command, "start");
    assert.equal(result.startOutput.stopped_by, "converged");
    assert.equal(result.startOutput.event_kinds.includes("registry_entry_admitted"), true);
    assert.equal(result.startOutput.event_kinds.includes("graph_function_selected"), true);
    assert.equal(result.startOutput.event_kinds.includes("graph_call_opened"), true);
    assert.equal(view.status, "accepted");
    assert.equal(view.value.readiness, "traversal_converged");
    assert.equal(view.value.graphFunctionEntryRefs.includes(graphFunctionEntry.entryRef), true);
    assert.equal(view.value.selectedGraphFunctionRefs.includes(ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget), true);
    assert.equal(view.value.selectedEntryKinds.includes("graph_function"), true);
    assert.equal(view.value.selectedEntryKinds.includes("node_type"), false);
    assert.equal(view.value.stdoutValues.includes("Hello, world!\n"), true);
    assert.equal(result.artifacts[1].execution.stdout, "Hello, world!\n");
    assert.equal(result.artifacts.every((artifact) => artifact.overlayRef === ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef), true);
    assert.equal(result.artifacts.every((artifact) => artifact.graphFunctionRef === ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget), true);
    assert.equal(
      result.events.findIndex((event) => event.kind === "graph_function_selected") <
        result.events.findIndex((event) => event.kind === "graph_call_opened"),
      true
    );
  });
}
