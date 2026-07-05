import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
  ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING
} from "../src/index.mjs";
import {
  ODD_GLC_INSTALL_PACKAGE_NAME,
  ODD_GLC_INSTALL_VERSION,
  installOddGlcProductForSandbox
} from "./sandbox-install-helpers.mjs";

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
const sandboxRoot = path.join(tenantRoot, "test_runs", "glc_hello_world_sandbox_port");

const BASE_FIXTURE_FILES = Object.freeze({
  "bootstrap.md": [
    "# odd_glc Hello World Sandbox Port",
    "",
    "This fixture is source pressure for an odd_glc scenario sandbox.",
    "It shall be consumed through GTL declarations and ABIogenesis startup.",
    ""
  ].join("\n"),
  ".ai-workspace/context/project_constraints.yml": [
    "project:",
    "  source: odd_glc",
    "  proof_class: scenario_sandbox_port",
    "  substrate: abiogenesis-4.2.0-rc.6",
    ""
  ].join("\n")
});

const PORTED_HELLO_WORLD_SANDBOXES = Object.freeze([
  {
    portId: "odd_sdlc.hello_world_rust_minimum_induction",
    oldScenarioId: "scenario_hello_world_rust_minimum_induction",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-RUST-CLI",
    subjectKind: "rust_cli",
    description: "Minimum loose-input Rust Hello World induction.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.build_config_surface",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "specification/requirements/01-hello-world-rust.md": [
        "# Rust Hello World",
        "",
        "- REQ-HWRUSTMIN-001: Generate a Rust command-line program.",
        "- REQ-HWRUSTMIN-002: Running the program prints exactly Hello, world!.",
        ""
      ].join("\n"),
      "build_tenants/hello_world_rust/spec/TECH_STACK.json": JSON.stringify(
        { language: "rust", command: "cargo run --quiet" },
        null,
        2
      ) + "\n"
    }
  },
  {
    portId: "odd_sdlc.t132_javascript_hello_world",
    oldScenarioId: "scenario_t132_hello_world_js",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-JS-TENANT-TEST",
    subjectKind: "node_test",
    description: "JavaScript tenant source plus node:test proof.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.test_source_surface",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "build_tenants/hello_world_javascript/spec/TECH_STACK.json": JSON.stringify(
        { language: "javascript", test: "node --test test/hello.test.js" },
        null,
        2
      ) + "\n",
      "specification/requirements/01-hello-world.md": [
        "# JavaScript Hello World",
        "",
        "- REQ-T132-001: Generate JavaScript source and a passing test for Hello, world!.",
        ""
      ].join("\n")
    }
  },
  {
    portId: "odd_sdlc.t133_rust_hello_world",
    oldScenarioId: "scenario_t133_hello_world_rust",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-RUST-CLI",
    subjectKind: "rust_cli",
    description: "Rust CLI Hello World product proof.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.build_config_surface",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "specification/requirements/01-hello-world-rust.md": [
        "# Rust Hello World",
        "",
        "- REQ-T133-001: Generate Cargo.toml.",
        "- REQ-T133-002: Generate src/main.rs.",
        "- REQ-T133-003: cargo run --quiet prints exactly Hello, world!.",
        ""
      ].join("\n")
    }
  },
  {
    portId: "odd_sdlc.t160_javascript_lite_traversal",
    oldScenarioId: "scenario_t160_hello_world_js_lite",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-JS-SDLC-BOOTSTRAP",
    subjectKind: "sdlc_js_full_node_test",
    description: "SDLC software-build sequence over the reusable graph: conformance, implementation design, source, test design, component test source, UAT test source, execution plan, execution result.",
    graphFunctionRef: ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF,
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.lifecycle.scenario_surface",
      "odd_glc.type.lifecycle.implementation_design",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.test_design_surface",
      "odd_glc.type.software.component_test_source_surface",
      "odd_glc.type.software.uat_test_source_surface",
      "odd_glc.type.software.test_execution_plan",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "specification/requirements/01-hello-world.md": [
        "# JavaScript Lite Hello World",
        "",
        "- REQ-T160-JS-001: Traverse the lite lifecycle to produce source and test evidence.",
        ""
      ].join("\n")
    }
  },
  {
    portId: "odd_sdlc.t160_rust_lite_traversal",
    oldScenarioId: "scenario_t160_hello_world_rust_lite",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-RUST-CLI",
    subjectKind: "rust_cli",
    description: "Rust lite traversal witness over the reusable software-build overlay.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle.implementation_design",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.build_config_surface",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "specification/requirements/01-hello-world-rust.md": [
        "# Rust Lite Hello World",
        "",
        "- REQ-T160-RUST-001: Traverse lifecycle pressure into Rust source and execution evidence.",
        ""
      ].join("\n")
    }
  },
  {
    portId: "odd_sdlc.t164_rust_hello_service",
    oldScenarioId: "scenario_t164_rust_hello_service_lite",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-RUST-SERVICE",
    subjectKind: "rust_service",
    description: "Rust service plus client request proof.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.test_execution_result",
      "odd_glc.type.evidence_binding_view"
    ],
    fixtureFiles: {
      "build_tenants/hello_world_rust_service/spec/TECH_STACK.json": JSON.stringify(
        { language: "rust", service: "tcp-http", proof: "HTTP 200 Hello, world!" },
        null,
        2
      ) + "\n",
      "specification/requirements/01-hello-world-rust-service.md": [
        "# Rust Service Hello World",
        "",
        "- REQ-T164-RUST-SVC-001: Build a Rust service.",
        "- REQ-T164-RUST-SVC-002: GET /hello returns Hello, world!.",
        ""
      ].join("\n")
    }
  },
  {
    portId: "odd_sdlc.t174_parallel_hello_world_js",
    oldScenarioId: "scenario_t174_parallel_hello_world_js",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-PARALLEL-JS",
    subjectKind: "parallel_js",
    description: "Parallel JavaScript branch plus fan-in proof.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "specification/requirements/01-parallel-hello-world.md": [
        "# Parallel Hello World",
        "",
        "- REQ-T174-PARALLEL-HELLO-001: Produce hello and world branches.",
        "- REQ-T174-PARALLEL-HELLO-002: Fan in the branch outputs as Hello, world!.",
        ""
      ].join("\n")
    }
  },
  {
    portId: "odd_sdlc.t174_four_lane_frontier",
    oldScenarioId: "scenario_t174_parallel_hello_world_js_four_lane_frontier",
    oddGlcScenarioId: "SCN-GLC-HELLO-WORLD-PARALLEL-JS",
    subjectKind: "parallel_js_four_lane_frontier",
    description: "Four-lane dev/test frontier witness with fan-in pressure.",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    expectedNodeTypeRefs: [
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.software.source_surface",
      "odd_glc.type.software.test_source_surface",
      "odd_glc.type.software.test_execution_result"
    ],
    fixtureFiles: {
      "tools/run_four_lane_frontier.mjs": [
        "const result = {",
        "  scenario: 'odd_glc_t174_four_lane_frontier_port',",
        "  executionAuthority: 'abg_registry_and_traversal_required',",
        "  selectedMethod: 'parallel',",
        "  laneCount: 4,",
        "  fanInCount: 1,",
        "  completedCount: 5,",
        "  failedCount: 0",
        "};",
        "console.log(JSON.stringify(result));",
        ""
      ].join("\n")
    }
  }
]);

function runId() {
  return `${new Date().toISOString().replace(/[-:.]/gu, "").replace("Z", "Z")}_pid${process.pid}_${randomUUID().slice(0, 8)}`;
}

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

async function writeJson(filePath, value) {
  await writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function run(command, args, options) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env,
    maxBuffer: 1024 * 1024 * 20
  });
  if (result.status !== 0) {
    throw new Error(
      `${options.label ?? command} failed with ${result.status ?? "null"}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
  }
  return result;
}

function abgPaths() {
  const abgInstallRoot = process.env.ABG_TYPESCRIPT_TENANT_INSTALL_ROOT ?? defaultAbgInstallRoot;
  const abgPackageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgPackageRoot;
  const genesisCommand = path.join(abgInstallRoot, "bin", "genesis-ts");
  assert.equal(existsSync(genesisCommand), true, `Missing installed genesis-ts at ${genesisCommand}`);
  assert.equal(
    existsSync(path.join(abgPackageRoot, "build", "semantic", "code", "src", "index.js")),
    true,
    `Missing ABIogenesis package source at ${abgPackageRoot}`
  );
  return Object.freeze({ abgInstallRoot, abgPackageRoot, genesisCommand });
}

async function createSandbox(port) {
  const { abgPackageRoot, genesisCommand } = abgPaths();
  const portKey = port.portId.replace(/^odd_sdlc\./u, "").replace(/[^a-z0-9]+/giu, "-");
  const root = path.join(sandboxRoot, portKey, runId());
  const workspace = path.join(root, "workspace");
  const toolchainRoot = path.join(root, "toolchain");
  const oddGlcProductRoot = path.join(root, "products", "odd_glc", ODD_GLC_INSTALL_VERSION);
  const oddGlcPackageRoot = path.join(oddGlcProductRoot, "lib", "node_modules", "@odd-glc", "route-one-typescript");
  await mkdir(workspace, { recursive: true });

  const sandboxIdentity = Object.freeze({
    kind: "odd_glc_abg42_hello_world_scenario_sandbox",
    schemaVersion: "1",
    proofClass: "sandbox_setup_no_traversal",
    oldSdlcWitness: port.oldScenarioId,
    portId: port.portId,
    oddGlcScenarioId: port.oddGlcScenarioId,
    subjectKind: port.subjectKind,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    graphRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef,
    graphFunctionRef: port.graphFunctionRef,
    runRoot: root,
    workspace,
    toolchainRoot,
    oddGlcProductRoot,
    oddGlcPackageRoot,
    oddGlcPackageName: ODD_GLC_INSTALL_PACKAGE_NAME,
    oddGlcPackageVersion: ODD_GLC_INSTALL_VERSION,
    subjectWriteRoot: workspace,
    notClosureEvidenceFor: [
      "live_worker",
      "live_terminal",
      "abg_traversal",
      "odd_sdlc_parity"
    ],
    authorityRule: "ABG owns install, startup admission, registry, graph-call, traversal, F_P invocation, event emission, and replay truth. odd_glc supplies declaration data and read interpretation only."
  });
  await writeJson(path.join(root, "sandbox-identity.json"), sandboxIdentity);
  await writeJson(path.join(workspace, ".ai-workspace", "sandbox-identity.json"), sandboxIdentity);

  run(
    genesisCommand,
    [
      "install",
      "--target",
      workspace,
      "--package-source",
      abgPackageRoot,
      "--toolchain-root",
      toolchainRoot
    ],
    {
      cwd: root,
      label: `ABIogenesis RC6 install for ${port.portId}`
    }
  );
  const oddGlcInstall = await installOddGlcProductForSandbox({
    runRoot: root,
    workspaceRoot: workspace,
    tenantRoot,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate
  });
  assert.equal(oddGlcInstall.packageRoot, oddGlcPackageRoot);

  for (const [relativePath, contents] of Object.entries({
    ...BASE_FIXTURE_FILES,
    ...port.fixtureFiles
  })) {
    await writeText(path.join(workspace, relativePath), contents);
  }

  const startupBinding = Object.freeze({
    kind: "odd_glc_scenario_sandbox_startup_binding",
    oldSdlcWitness: port.oldScenarioId,
    oddGlcScenarioId: port.oddGlcScenarioId,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    graphRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef,
    graphFunctionRef: port.graphFunctionRef,
    graphFunctionBinding: ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.find((entry) =>
      entry.graphFunctionRef === port.graphFunctionRef
    ) ?? null,
    oddGlcInstallManifestPath: oddGlcInstall.manifestPath,
    oddGlcWorkspaceInstallManifestPath: oddGlcInstall.workspaceManifestPath,
    oddGlcPackageRoot: oddGlcInstall.packageRoot,
    nodeTypeRefs: port.expectedNodeTypeRefs,
    nodeTypeLibraryRefs: [
      ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
      ...ODD_GLC_DATA_MAPPING_NODE_TYPES,
      ...ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES
    ].map((entry) => entry.typeRef),
    rule: "This binding is declaration data for ABG startup. It is not a local odd_glc runtime or traversal substitute."
  });
  await writeJson(path.join(workspace, ".ai-workspace", "odd_glc-startup-binding.json"), startupBinding);

  const installManifest = JSON.parse(
    await readFile(path.join(workspace, ".abiogenesis", "install-manifest.json"), "utf8")
  );
  const proofSummary = Object.freeze({
    kind: "odd_glc_hello_world_sandbox_port_summary",
    proofClass: "sandbox_setup_no_traversal",
    oldSdlcWitness: port.oldScenarioId,
    oddGlcScenarioId: port.oddGlcScenarioId,
    subjectKind: port.subjectKind,
    installedPackageVersion: installManifest.runtimePackage?.packageVersion ?? null,
    requiredExportCount: Array.isArray(installManifest.runtimePackage?.requiredExports)
      ? installManifest.runtimePackage.requiredExports.length
      : null,
    oddGlcPackageName: oddGlcInstall.manifest.packageName,
    oddGlcPackageVersion: oddGlcInstall.manifest.packageVersion,
    oddGlcPackageRoot: oddGlcInstall.packageRoot,
    oddGlcInstallManifestPath: oddGlcInstall.manifestPath,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    graphFunctionRef: port.graphFunctionRef,
    notClosureEvidenceFor: sandboxIdentity.notClosureEvidenceFor
  });
  await writeJson(path.join(root, "sandbox-port-summary.json"), proofSummary);

  return Object.freeze({
    installManifest,
    oddGlcInstall,
    port,
    proofSummary,
    root,
    sandboxIdentity,
    startupBinding,
    workspace
  });
}

test("maps old odd_sdlc Hello World scenario sandboxes to current odd_glc/ABG RC6 setup ports", () => {
  assert.deepEqual(
    PORTED_HELLO_WORLD_SANDBOXES.map((port) => port.oldScenarioId),
    [
      "scenario_hello_world_rust_minimum_induction",
      "scenario_t132_hello_world_js",
      "scenario_t133_hello_world_rust",
      "scenario_t160_hello_world_js_lite",
      "scenario_t160_hello_world_rust_lite",
      "scenario_t164_rust_hello_service_lite",
      "scenario_t174_parallel_hello_world_js",
      "scenario_t174_parallel_hello_world_js_four_lane_frontier"
    ]
  );
  assert.equal(new Set(PORTED_HELLO_WORLD_SANDBOXES.map((port) => port.portId)).size, PORTED_HELLO_WORLD_SANDBOXES.length);
  assert.equal(ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef, "overlay://odd_glc/software-build-lifecycle");
});

for (const port of PORTED_HELLO_WORLD_SANDBOXES) {
  test(`scenario sandbox port: ${port.oldScenarioId} -> ${port.oddGlcScenarioId}`, async () => {
    const result = await createSandbox(port);

    assert.equal(result.sandboxIdentity.kind, "odd_glc_abg42_hello_world_scenario_sandbox");
    assert.equal(result.sandboxIdentity.proofClass, "sandbox_setup_no_traversal");
    assert.equal(result.sandboxIdentity.workspace, result.workspace);
    assert.equal(result.installManifest.runtimePackage.packageVersion, ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion);
    assert.equal(existsSync(path.join(result.workspace, ".abiogenesis", "install-manifest.json")), true);
    assert.equal(existsSync(path.join(result.workspace, ".abiogenesis", "install-provenance.json")), true);
    assert.equal(existsSync(path.join(result.workspace, ".odd_glc", "install-manifest.json")), true);
    assert.equal(existsSync(path.join(result.workspace, ".ai-workspace", "odd-glc-install-manifest.json")), true);
    assert.equal(existsSync(path.join(result.oddGlcInstall.packageRoot, "src", "index.mjs")), true);
    assert.equal(result.sandboxIdentity.oddGlcPackageRoot, result.oddGlcInstall.packageRoot);
    assert.equal(result.sandboxIdentity.oddGlcPackageName, ODD_GLC_INSTALL_PACKAGE_NAME);
    assert.equal(result.sandboxIdentity.oddGlcPackageVersion, ODD_GLC_INSTALL_VERSION);
    assert.equal(existsSync(path.join(result.workspace, ".ai-workspace", "sandbox-identity.json")), true);
    assert.equal(existsSync(path.join(result.workspace, ".ai-workspace", "odd_glc-startup-binding.json")), true);
    assert.equal(result.startupBinding.oddGlcPackageRoot, result.oddGlcInstall.packageRoot);
    assert.equal(result.startupBinding.graphFunctionRef, port.graphFunctionRef);
    assert.equal(result.startupBinding.graphFunctionBinding?.graphFunctionRef, port.graphFunctionRef);
    assert.equal(result.proofSummary.oddGlcPackageName, ODD_GLC_INSTALL_PACKAGE_NAME);
    assert.equal(result.proofSummary.oddGlcPackageVersion, ODD_GLC_INSTALL_VERSION);
    assert.deepEqual(
      port.expectedNodeTypeRefs.filter((typeRef) => !result.startupBinding.nodeTypeRefs.includes(typeRef)),
      []
    );
    assert.deepEqual(result.proofSummary.notClosureEvidenceFor, [
      "live_worker",
      "live_terminal",
      "abg_traversal",
      "odd_sdlc_parity"
    ]);
  });
}
