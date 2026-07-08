import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
  ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_GRAPH_FUNCTION_REF,
  ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF,
  ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING,
  interpretStartupRegistryState
} from "../src/index.mjs";
import { deriveRequirementLineageCanary } from "../src/lineage_canary.mjs";
import {
  ODD_GLC_INSTALL_FILES,
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
const liveRoot = path.join(tenantRoot, "test_runs", "glc_software_build_overlay_live");

function withStageBootstrap(stagePlan, overrides) {
  const byStage = Array.isArray(overrides)
    ? new Map(overrides.map((override) => [override.stage, override]))
    : new Map(Object.entries(overrides));
  return Object.freeze(stagePlan.map((stage) => Object.freeze({
    ...stage,
    ...(byStage.get(stage.stage) ?? {})
  })));
}

const SDLC_REQUIRED_STAGE_NAMES = Object.freeze(
  ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN.map((stage) => stage.stage)
);

const FULL_LIFECYCLE_REQUIRED_STAGE_NAMES = Object.freeze(
  ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN.map((stage) => stage.stage)
);

const DATA_MAPPER_SCALA_MODULES = Object.freeze([
  "cdme-core",
  "cdme-compiler",
  "cdme-executor",
  "cdme-adjoint",
  "cdme-accounting",
  "cdme-assurance",
  "cdme-fidelity",
  "cdme-engine"
]);

const DATA_MAPPER_SCALA_MAIN_FILES = Object.freeze([
  "build_tenants/scala_spark/cdme-core/src/main/scala/com/cdme/core/package.scala",
  "build_tenants/scala_spark/cdme-compiler/src/main/scala/com/cdme/compiler/TopologyCompiler.scala",
  "build_tenants/scala_spark/cdme-compiler/src/main/scala/com/cdme/compiler/package.scala",
  "build_tenants/scala_spark/cdme-executor/src/main/scala/com/cdme/executor/DataFrameExecutor.scala",
  "build_tenants/scala_spark/cdme-executor/src/main/scala/com/cdme/executor/ErrorSink.scala",
  "build_tenants/scala_spark/cdme-adjoint/src/main/scala/com/cdme/adjoint/AdjointRegistry.scala",
  "build_tenants/scala_spark/cdme-accounting/src/main/scala/com/cdme/accounting/AccountingVerifier.scala",
  "build_tenants/scala_spark/cdme-assurance/src/main/scala/com/cdme/assurance/AssuranceService.scala",
  "build_tenants/scala_spark/cdme-fidelity/src/main/scala/com/cdme/fidelity/FidelityService.scala",
  "build_tenants/scala_spark/cdme-engine/src/main/scala/com/cdme/engine/CdmeEngineImpl.scala",
  "build_tenants/scala_spark/cdme-engine/src/main/scala/com/cdme/engine/CdmeEngineRunner.scala"
]);

const DATA_MAPPER_SCALA_TEST_FILES = Object.freeze([
  "build_tenants/scala_spark/cdme-core/src/test/scala/com/cdme/core/CoreContractsSpec.scala",
  "build_tenants/scala_spark/cdme-compiler/src/test/scala/com/cdme/compiler/TopologyCompilerSpec.scala",
  "build_tenants/scala_spark/cdme-executor/src/test/scala/com/cdme/executor/DataFrameExecutorSpec.scala",
  "build_tenants/scala_spark/cdme-adjoint/src/test/scala/com/cdme/adjoint/AdjointRegistrySpec.scala",
  "build_tenants/scala_spark/cdme-accounting/src/test/scala/com/cdme/accounting/AccountingVerifierSpec.scala",
  "build_tenants/scala_spark/cdme-assurance/src/test/scala/com/cdme/assurance/AssuranceServiceSpec.scala",
  "build_tenants/scala_spark/cdme-fidelity/src/test/scala/com/cdme/fidelity/FidelityServiceSpec.scala",
  "build_tenants/scala_spark/cdme-engine/src/test/scala/com/cdme/engine/CdmeEngineIntegrationSpec.scala"
]);

const DATA_MAPPER_SCALA_TEST_REPORTS = Object.freeze([
  "cdme-core/target/test-reports/TEST-com.cdme.core.CoreContractsSpec.xml",
  "cdme-compiler/target/test-reports/TEST-com.cdme.compiler.TopologyCompilerSpec.xml",
  "cdme-executor/target/test-reports/TEST-com.cdme.executor.DataFrameExecutorSpec.xml",
  "cdme-adjoint/target/test-reports/TEST-com.cdme.adjoint.AdjointRegistrySpec.xml",
  "cdme-accounting/target/test-reports/TEST-com.cdme.accounting.AccountingVerifierSpec.xml",
  "cdme-assurance/target/test-reports/TEST-com.cdme.assurance.AssuranceServiceSpec.xml",
  "cdme-fidelity/target/test-reports/TEST-com.cdme.fidelity.FidelityServiceSpec.xml",
  "cdme-engine/target/test-reports/TEST-com.cdme.engine.CdmeEngineIntegrationSpec.xml"
]);

const DATA_MAPPER_SCALA_JAVA11_HOME = "/opt/homebrew/opt/openjdk@11";
// campaign #12: the sbt binary home is an ENVIRONMENTAL BINDING
// (HANDLERS-015 class) — declared here as scenario env data so the
// deterministic gate finds the toolchain regardless of the CLI
// process env it inherits.
const DATA_MAPPER_TOOLCHAIN_BIN = "/opt/homebrew/bin";
const DATA_MAPPER_SCALA_JAVA11_ENV = Object.freeze({
  JAVA_HOME: DATA_MAPPER_SCALA_JAVA11_HOME,
  PATH: `${DATA_MAPPER_SCALA_JAVA11_HOME}/bin:${DATA_MAPPER_TOOLCHAIN_BIN}:${process.env.PATH ?? ""}`
});

const DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES = Object.freeze([
  "CompiledTopology",
  "ExecutionResult",
  "StageResult",
  "AccountingLedger",
  "LedgerEntry",
  "DataFrameRef"
]);

function sdlcStagePlan(overrides) {
  return withStageBootstrap(ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN, overrides);
}

function fullLifecycleStagePlan(overrides) {
  return withStageBootstrap(ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN, overrides);
}

function sdlcComplianceScenario(input) {
  return Object.freeze({
    ...input,
    proofClass: "sdlc_graph_traversal_compliance",
    graphFunctionRef: ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF,
    materializedSurfaceCount: 7,
    manifestRequired: false,
    executeFromPlan: true,
    expectedReturnValue: input.expectedReturnValue ?? "Hello, world!",
    requiredStageNames: SDLC_REQUIRED_STAGE_NAMES,
    stagePlan: sdlcStagePlan(input.stagePlan)
  });
}

function fullLifecycleComplianceScenario(input) {
  return Object.freeze({
    ...input,
    proofClass: "full_lifecycle_graph_traversal_compliance",
    graphFunctionRef: ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_GRAPH_FUNCTION_REF,
    materializedSurfaceCount: input.materializedSurfaceCount ?? 24,
    manifestRequired: false,
    executeFromPlan: true,
    executionStage: "derive_test_execution_result_surface",
    expectedReturnValue: input.expectedReturnValue ?? "data_mapper_full ok",
    requiredStageNames: FULL_LIFECYCLE_REQUIRED_STAGE_NAMES,
    stagePlan: fullLifecycleStagePlan(input.stagePlan)
  });
}

const SCENARIOS = Object.freeze([
  sdlcComplianceScenario({
    key: "basic-cli",
    scenarioId: "SCN-GLC-HELLO-WORLD-CLI-BASIC",
    kind: "node_cli",
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare a minimal CLI Hello World software-build traversal.",
          "The source surface must be generated/hello-world.mjs.",
          "The execution proof must run the CLI and observe stdout exactly \"Hello, world!\\n\".",
          "Do not write source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Use the prior conformance_project artifact as authority.",
          "Define a minimal Node CLI script at generated/hello-world.mjs.",
          "The script must print exactly \"Hello, world!\" followed by one newline.",
          "Name component and UAT test source surfaces that execute the CLI and assert stdout."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["generated/hello-world.mjs"],
        instructions: [
          "Write only generated/hello-world.mjs.",
          "The script must execute under node without package installation.",
          "It must write exactly \"Hello, world!\\n\" to stdout."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Specify component and UAT validation of the CLI stdout contract.",
          "Both tests must spawn node generated/hello-world.mjs and assert status 0 and stdout exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/hello-cli.test.mjs"],
        instructions: [
          "Write only test/component/hello-cli.test.mjs.",
          "Use node:test, node:assert/strict, and node:child_process spawnSync.",
          "Run process.execPath with [\"generated/hello-world.mjs\"] from the project root.",
          "Assert status 0 and stdout exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/hello-cli.uat.test.mjs"],
        instructions: [
          "Write only test/uat/hello-cli.uat.test.mjs.",
          "Use node:test, node:assert/strict, and node:child_process spawnSync.",
          "Run process.execPath with [\"generated/hello-world.mjs\"] from the project root.",
          "Assert the user-visible CLI output is exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        instructions: [
          "Write only test-execution-plan.json.",
          "The JSON command must be node.",
          "The args must be [\"--test\", \"test/component/hello-cli.test.mjs\", \"test/uat/hello-cli.uat.test.mjs\"].",
          "expectedTestPassCount must be at least 2, matching the admitted component and UAT coverage floor.",
          "expectedStdoutMatch must include stable zero-failure evidence such as fail 0; do not pin an exact pass-count fragment when the generated tests add depth coverage.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if the execution plan command exited 0, observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  sdlcComplianceScenario({
    key: "js-tenant-test",
    scenarioId: "SCN-GLC-HELLO-WORLD-JS-TENANT-TEST",
    kind: "node_test",
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare a JavaScript module plus node:test Hello World traversal.",
          "Name implementation design, source, test design, component test source, UAT test source, test execution plan, and test execution result as separate lifecycle surfaces."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Define a private type:module package with src/hello.mjs exporting helloWorld().",
          "helloWorld() must return exactly \"Hello, world!\".",
          "The component and UAT tests must import helloWorld and assert the exact return value."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["package.json", "src/hello.mjs"],
        instructions: [
          "Write only package.json and src/hello.mjs.",
          "package.json must be private:true and type:module.",
          "src/hello.mjs must export helloWorld() returning exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Specify component and UAT validation obligations over the exported helloWorld function.",
          "Both validations must assert the exact return value \"Hello, world!\"."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/hello.test.mjs"],
        instructions: [
          "Write only test/component/hello.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import the named export exactly as: import { helloWorld } from \"../../src/hello.mjs\".",
          "Assert helloWorld() returns exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/hello.uat.test.mjs"],
        instructions: [
          "Write only test/uat/hello.uat.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import the named export exactly as: import { helloWorld } from \"../../src/hello.mjs\".",
          "Assert the user-visible greeting contract is exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        instructions: [
          "Write only test-execution-plan.json.",
          "The JSON command must be node.",
          "The args must be [\"--test\", \"test/component/hello.test.mjs\", \"test/uat/hello.uat.test.mjs\"].",
          "expectedTestPassCount must be at least 2, matching the admitted component and UAT coverage floor.",
          "expectedStdoutMatch must include stable zero-failure evidence such as fail 0; do not pin an exact pass-count fragment when the generated tests add depth coverage.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if both component and UAT tests passed, observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  sdlcComplianceScenario({
    key: "js-sdlc-bootstrap",
    scenarioId: "SCN-GLC-HELLO-WORLD-JS-SDLC-BOOTSTRAP",
    kind: "sdlc_js_full_node_test",
    expectedStdout: null,
    expectedReturnValue: "Hello, world!",
    executeFromPlan: false,
    witness: {
      sourceProject: "odd_sdlc",
      runPath: "/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/test_runs/scenario_t132_hello_world_js_live/20260624T185624005Z_pid20893",
      durationMinutes: 41.64,
      traversalShape: [
        "Fg_conform_project",
        "derive_lite_design_adr_surface",
        "derive_lite_component_code_surface",
        "derive_lite_test_design_surface",
        "derive_lite_component_test_surface",
        "derive_lite_uat_test_source_surface",
        "prepare_test_execution_surface",
        "derive_test_execution_result_surface"
      ],
      parityRule: "reproduce traversal shape as typed GTL vectors consumed by ABG startup; do not copy odd_sdlc runtime code, ledgers, phase-flow controller, or local truth surfaces"
    },
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare the project pressure for a JavaScript Hello World software build traversal.",
          "Name the required downstream lifecycle surfaces: implementation design, source, test design, component test source, UAT test source, test execution plan, and test execution result.",
          "State that ABG owns startup admission, registry selection, graph-call opening, vector traversal, F_P dispatch, evidence admission, event emission, closure, and convergence.",
          "Do not write source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Use the prior conformance_project artifact as the authority.",
          "Define a minimal JavaScript module that exports helloWorld() returning exactly \"Hello, world!\".",
          "Name package.json, src/hello.mjs, design/test-design.md, test/component/hello.test.mjs, test/uat/hello.uat.test.mjs, test-execution-plan.json, and execution result as separate lifecycle surfaces.",
          "Do not materialize source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["package.json", "src/hello.mjs"],
        instructions: [
          "Write only package.json and src/hello.mjs.",
          "Use the prior implementation_design artifact as the authority.",
          "package.json must be private:true and type:module.",
          "src/hello.mjs must export helloWorld() returning exactly \"Hello, world!\".",
          "Do not write test source or execution plans in this vector."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Use the prior source artifact summaries as the evidence source.",
          "Specify both component and UAT validation obligations.",
          "The component test must import helloWorld and assert the exact return value \"Hello, world!\".",
          "The UAT test must validate the user-visible greeting contract through the same exported function.",
          "Do not write test source in this vector."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/hello.test.mjs"],
        instructions: [
          "Write only test/component/hello.test.mjs.",
          "Use the prior test_design and source artifact summaries as the evidence source.",
          "Use node:test and node:assert/strict.",
          "Import the named export exactly as: import { helloWorld } from \"../../src/hello.mjs\".",
          "Assert helloWorld() returns exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/hello.uat.test.mjs"],
        instructions: [
          "Write only test/uat/hello.uat.test.mjs.",
          "Use the prior component_test_source, test_design, and source artifact summaries as the evidence source.",
          "Use node:test and node:assert/strict.",
          "Import the named export exactly as: import { helloWorld } from \"../../src/hello.mjs\".",
          "Assert the user-visible greeting contract is exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        instructions: [
          "Write only test-execution-plan.json.",
          "Use the prior component_test_source and uat_test_source artifact summaries as the evidence source.",
          "The command must be node with args [\"--test\", \"test/component/hello.test.mjs\", \"test/uat/hello.uat.test.mjs\"].",
          "expectedTestPassCount must be at least 2, matching the admitted component and UAT coverage floor.",
          "expectedStdoutMatch must include stable zero-failure evidence such as fail 0; do not pin an exact pass-count fragment when the generated tests add depth coverage.",
          "assertedReturnValue must be \"Hello, world!\".",
          "Do not execute the test in this vector."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Judge the observed executionStatus, planSatisfied flag, observedTestPassCount, and stdout digest against the prior test_execution_plan.",
          "Accept only if both component and UAT tests passed, planSatisfied is true, and observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount.",
          "Do not reject solely because node:test uses a different TAP prefix glyph when the F_D pass-count check is satisfied."
        ]
      }
    ]
  }),
  sdlcComplianceScenario({
    key: "rust-cli",
    scenarioId: "SCN-GLC-HELLO-WORLD-RUST-CLI",
    kind: "rust_cli",
    expectedStdout: "Hello, world!\n",
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare a Rust CLI Hello World software-build traversal.",
          "The source surface must include Cargo.toml and src/main.rs.",
          "The execution proof must run cargo run --quiet and observe stdout exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Define a minimal Rust binary crate named glc_hello_world_rust.",
          "The binary must print exactly \"Hello, world!\" followed by one newline.",
          "Name component and UAT test source surfaces that execute cargo run --quiet and assert stdout."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["Cargo.toml", "src/main.rs"],
        instructions: [
          "Write only Cargo.toml and src/main.rs.",
          "Cargo.toml must define package name glc_hello_world_rust, version 0.0.0, edition 2021, and no dependencies.",
          "src/main.rs must define main() and print exactly \"Hello, world!\" followed by one newline."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Specify component and UAT validation of the Rust CLI stdout contract.",
          "Both tests must spawn cargo run --quiet from the project root and assert status 0 and stdout exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/rust-cli.test.mjs"],
        instructions: [
          "Write only test/component/rust-cli.test.mjs.",
          "Use node:test, node:assert/strict, and node:child_process spawnSync.",
          "Run cargo with [\"run\", \"--quiet\"] from the project root.",
          "Assert status 0 and stdout exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/rust-cli.uat.test.mjs"],
        instructions: [
          "Write only test/uat/rust-cli.uat.test.mjs.",
          "Use node:test, node:assert/strict, and node:child_process spawnSync.",
          "Run cargo with [\"run\", \"--quiet\"] from the project root.",
          "Assert the user-visible Rust CLI output is exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        instructions: [
          "Write only test-execution-plan.json.",
          "The JSON command must be node.",
          "The args must be [\"--test\", \"test/component/rust-cli.test.mjs\", \"test/uat/rust-cli.uat.test.mjs\"].",
          "expectedTestPassCount must be at least 2, matching the admitted component and UAT coverage floor.",
          "expectedStdoutMatch must include stable zero-failure evidence such as fail 0; do not pin an exact pass-count fragment when the generated tests add depth coverage.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if the planned node:test command exited 0, observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  sdlcComplianceScenario({
    key: "rust-service",
    scenarioId: "SCN-GLC-HELLO-WORLD-RUST-SERVICE",
    kind: "rust_service",
    expectedStdout: null,
    expectedReturnValue: "Hello, world!",
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare a Rust service Hello World software-build traversal.",
          "The source surface must include src/service.rs.",
          "The test source must compile the service with rustc, start it on 127.0.0.1 using a system-assigned port, send one HTTP request, and observe response body exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Define a single-file Rust TCP HTTP service in src/service.rs.",
          "The service must accept one command-line argument: a port-file path.",
          "It must bind 127.0.0.1:0, write the selected port to the port file, handle one HTTP request, return 200 OK with body \"Hello, world!\\n\", then exit cleanly."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["src/service.rs"],
        instructions: [
          "Write only src/service.rs.",
          "Use only Rust standard library modules.",
          "Implement the service described by the implementation_design artifact.",
          "The response body must be exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Specify a component test and UAT test for compiling the Rust service, starting it, making a real HTTP request, and asserting status 200 and body exactly \"Hello, world!\\n\".",
          "The tests must use a temporary port file and terminate only after the service exits."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/rust-service.test.mjs"],
        instructions: [
          "Write only test/component/rust-service.test.mjs.",
          "Use node:test, node:assert/strict, node:child_process spawn/spawnSync, node:fs/promises, node:os, and node:path.",
          "Compile src/service.rs with rustc to a temporary binary.",
          "Start the binary with a temporary port-file path, wait for the port file, fetch http://127.0.0.1:${port}/hello, and assert response status 200 and body exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/rust-service.uat.test.mjs"],
        instructions: [
          "Write only test/uat/rust-service.uat.test.mjs.",
          "Use node:test and the same service-start/request pattern as the component test.",
          "Assert the user-visible service contract: an HTTP GET to /hello returns 200 and body exactly \"Hello, world!\\n\"."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        instructions: [
          "Write only test-execution-plan.json.",
          "The JSON command must be node.",
          "The args must be [\"--test\", \"test/component/rust-service.test.mjs\", \"test/uat/rust-service.uat.test.mjs\"].",
          "expectedTestPassCount must be at least 2, matching the admitted component and UAT coverage floor.",
          "expectedStdoutMatch must include stable zero-failure evidence such as fail 0; do not pin an exact pass-count fragment when the generated tests add depth coverage.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if both service tests passed, observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  sdlcComplianceScenario({
    key: "parallel-js",
    scenarioId: "SCN-GLC-HELLO-WORLD-PARALLEL-JS",
    kind: "parallel_js",
    expectedStdout: null,
    expectedReturnValue: "Hello, world!",
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare a JavaScript Hello World product with parallel branch implementation pressure.",
          "The source surface must have a hello branch, a world branch, and a fan-in module that composes the greeting.",
          "The execution proof must prove branch behavior and composed behavior."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Define a type:module package with src/hello.mjs exporting helloPart(), src/world.mjs exporting worldPart(), and src/index.mjs exporting helloWorld().",
          "helloWorld() must compose the branch functions and return exactly \"Hello, world!\".",
          "State that this scenario proves product-level parallel branch shape inside the reusable SDLC graph; it does not claim ABG branch-frontier traversal."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["package.json", "src/hello.mjs", "src/world.mjs", "src/index.mjs"],
        instructions: [
          "Write only package.json, src/hello.mjs, src/world.mjs, and src/index.mjs.",
          "package.json must be private:true and type:module.",
          "src/hello.mjs must export helloPart() returning \"Hello\".",
          "src/world.mjs must export worldPart() returning \"world\".",
          "src/index.mjs must export helloWorld() returning exactly \"Hello, world!\" by composing helloPart and worldPart."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Specify separate component checks for helloPart and worldPart plus a UAT check for helloWorld.",
          "The UAT check must prove the composed exported behavior returns exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/parallel-branches.test.mjs"],
        instructions: [
          "Write only test/component/parallel-branches.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import helloPart from ../../src/hello.mjs and worldPart from ../../src/world.mjs.",
          "Assert helloPart() returns \"Hello\" and worldPart() returns \"world\" in separate test() blocks."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/parallel-fanin.uat.test.mjs"],
        instructions: [
          "Write only test/uat/parallel-fanin.uat.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import the named export exactly as: import { helloWorld } from \"../../src/index.mjs\".",
          "Assert helloWorld() returns exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        instructions: [
          "Write only test-execution-plan.json.",
          "The JSON command must be node.",
          "The args must be [\"--test\", \"test/component/parallel-branches.test.mjs\", \"test/uat/parallel-fanin.uat.test.mjs\"].",
          "expectedTestPassCount must be at least 3, matching the admitted branch and fan-in coverage floor.",
          "expectedStdoutMatch must include stable zero-failure evidence such as fail 0; do not pin an exact pass-count fragment when the generated tests add depth coverage.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if the branch and fan-in tests passed, observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  sdlcComplianceScenario({
    key: "data-mapper-lite",
    scenarioId: "SCN-GLC-DATA-MAPPER-LITE-JS",
    kind: "data_mapper_lite_node_test",
    expectedStdout: null,
    expectedReturnValue: "data_mapper_lite ok",
    artifactTypeRef: "odd_glc.type.software.data_mapping_implementation_bundle",
    stagePlan: [
      {
        stage: "conformance_project",
        filesToProduce: ["specification/project-conformance.md"],
        requiredNodeTypes: [
          "odd_glc.type.lifecycle_context",
          "odd_glc.type.software.mapping_spec"
        ],
        instructions: [
          "Write only specification/project-conformance.md.",
          "Declare a lite data-mapper software-build traversal.",
          "The mapper must model entities and morphisms, constrain cardinality to 1:1, N:1, or 1:N, and validate dot-path composition across matching codomain/domain.",
          "The public composition API for later source and tests is dotPath(...morphismNames); do not introduce a separate compose API.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "implementation_design",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Define a JavaScript LogicalDataModel module with the exact public methods addEntity, addMorphism, identityFor, morphism, and dotPath.",
          "dotPath must be the only public composition API and must accept separate morphism-name arguments, for example dotPath(\"places\", \"shipsTo\").",
          "Do not name or require an unimplemented compose API.",
          "Name component and UAT tests that cover all three requirements."
        ]
      },
      {
        stage: "source",
        filesToProduce: ["package.json", "src/logical-data-model.mjs"],
        requiredNodeTypes: [
          "odd_glc.type.lifecycle.implementation_design",
          "odd_glc.type.software.mapper_source",
          "odd_glc.type.software.schema_source"
        ],
        instructions: [
          "Write only package.json and src/logical-data-model.mjs.",
          "package.json must be private:true and type:module.",
          "src/logical-data-model.mjs must export class LogicalDataModel.",
          "LogicalDataModel must support addEntity, addMorphism, identityFor, morphism, and dotPath.",
          "dotPath must accept separate morphism-name arguments and throw on codomain/domain mismatch.",
          "Do not export or rely on a compose method."
        ]
      },
      {
        stage: "test_design",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Specify component and UAT tests for directed multigraph structure, cardinality constraints, and lawful dot-path composition.",
          "The tests must bind to the actual public source API: addEntity, addMorphism, identityFor, morphism, and dotPath(...morphismNames).",
          "Do not specify tests that call compose, defineMorphism, validateCardinality, or other helper names unless those names are explicitly present in the source artifact."
        ]
      },
      {
        stage: "component_test_source",
        filesToProduce: ["test/component/logical-data-model.test.mjs"],
        requiredNodeTypes: [
          "odd_glc.type.software.test_design_surface",
          "odd_glc.type.software.mapper_validation_test"
        ],
        instructions: [
          "Write only test/component/logical-data-model.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import LogicalDataModel from ../../src/logical-data-model.mjs.",
          "Create separate tests for graph structure, cardinality rejection, and dot-path composition rejection.",
          "Use dotPath(...morphismNames) for composition checks; do not call compose."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/logical-data-model.uat.test.mjs"],
        requiredNodeTypes: [
          "odd_glc.type.software.mapper_validation_test",
          "odd_glc.type.software.uat_test_source_surface"
        ],
        instructions: [
          "Write only test/uat/logical-data-model.uat.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import LogicalDataModel from ../../src/logical-data-model.mjs.",
          "Assert the user-visible mapper behavior composes Customer -> Order -> Country via dotPath(...morphismNames) and rejects Order -> Country -> Customer.",
          "Do not call compose; dotPath is the public composition API for this scenario."
        ]
      },
      {
        stage: "test_execution_plan",
        filesToProduce: ["test-execution-plan.json"],
        requiredNodeTypes: [
          "odd_glc.type.software.uat_test_source_surface",
          "odd_glc.type.software.mapper_build_config",
          "odd_glc.type.software.test_execution_plan"
        ],
        instructions: [
          "Write only test-execution-plan.json.",
          "The JSON command must be node.",
          "The args must be [\"--test\", \"test/component/logical-data-model.test.mjs\", \"test/uat/logical-data-model.uat.test.mjs\"].",
          "expectedTestPassCount is the minimum admitted test count expected from the component and UAT test source files.",
          "expectedStdoutMatch must include stable pass/fail substrings proving zero failures.",
          "assertedReturnValue must be \"data_mapper_lite ok\"."
        ]
      },
      {
        stage: "test_execution_result",
        requiredNodeTypes: [
          "odd_glc.type.software.data_mapping_implementation_bundle",
          "odd_glc.type.software.test_execution_result",
          "odd_glc.type.evidence_binding_view"
        ],
        instructions: [
          "Produce no files.",
          "Accept only if the mapper test plan passed, observedTestPassCount is at least the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  fullLifecycleComplianceScenario({
    key: "data-mapper-full",
    scenarioId: "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT",
    kind: "data_mapper_full_scala_sbt_test",
    expectedStdout: null,
    expectedReturnValue: "data_mapper_full_sbt ok",
    // review B MEDIUM-1: F_D verification pins THESE, not worker claims
    expectedTestPassCount: 20,
    expectedTestReportPaths: DATA_MAPPER_SCALA_TEST_REPORTS,
    executionStage: "derive_repaired_test_execution_result_surface",
    artifactTypeRef: "odd_glc.type.software.data_mapping_implementation_bundle",
    requiredOutputPaths: [
      "build_tenants/scala_spark/build.sbt",
      "build_tenants/scala_spark/project/plugins.sbt",
      "build_tenants/scala_spark/project/build.properties",
      ...DATA_MAPPER_SCALA_MAIN_FILES,
      ...DATA_MAPPER_SCALA_TEST_FILES
    ],
    forbiddenOutputPaths: [
      "src/logical-data-model.mjs",
      "test/component/logical-data-model.test.mjs",
      "test/uat/logical-data-model.uat.test.mjs"
    ],
    // T-031 STRONGLY TYPED UAT REQUIREMENTS (user closure law: requirements
    // met by code delivery proven by tests). Each concern is a typed
    // requirement: spans cover the CREATING vectors (pressure enters the
    // prompts that author tests) and the PROVING vector (execution);
    // positive AND negative expected evidence shapes make weaker-contract
    // proof rejectable (-011/-012/-022); five depth classes make shallow
    // coverage non-closing (-032). Folds carry residual pressure until the
    // production edge proves them — conservation, not defect.
    cdmeRequirements: [
      {
        requirementId: "REQ-CDME-CORE",
        module: "cdme-core",
        concern: "typed logical/physical mapping contract DTOs construct and validate",
        positiveShapeRef: "evidence-shape://cdme/core/contract-construction-positive",
        negativeShapeRef: "evidence-shape://cdme/core/invalid-contract-rejected-negative"
      },
      {
        requirementId: "REQ-CDME-TOPOLOGY",
        module: "cdme-compiler",
        concern: "source-to-target mapping topology compiles with type checking",
        positiveShapeRef: "evidence-shape://cdme/topology/compiles-positive",
        negativeShapeRef: "evidence-shape://cdme/topology/type-mismatch-rejected-negative"
      },
      {
        requirementId: "REQ-CDME-EXECUTOR",
        module: "cdme-executor",
        concern: "DataFrame transformation executes with error-sink capture",
        positiveShapeRef: "evidence-shape://cdme/executor/transform-positive",
        negativeShapeRef: "evidence-shape://cdme/executor/bad-row-to-error-sink-negative"
      },
      {
        requirementId: "REQ-CDME-ADJOINT",
        module: "cdme-adjoint",
        concern: "adjoint lineage registers and inverts mapping metadata",
        positiveShapeRef: "evidence-shape://cdme/adjoint/lineage-roundtrip-positive",
        negativeShapeRef: "evidence-shape://cdme/adjoint/unregistered-lookup-rejected-negative"
      },
      {
        requirementId: "REQ-CDME-ACCOUNTING",
        module: "cdme-accounting",
        concern: "accounting partitions balance and imbalances are detected",
        positiveShapeRef: "evidence-shape://cdme/accounting/balanced-partitions-positive",
        negativeShapeRef: "evidence-shape://cdme/accounting/unbalanced-detected-negative"
      },
      {
        requirementId: "REQ-CDME-ASSURANCE",
        module: "cdme-assurance",
        concern: "data-quality assurance checks apply thresholds",
        positiveShapeRef: "evidence-shape://cdme/assurance/threshold-pass-positive",
        negativeShapeRef: "evidence-shape://cdme/assurance/threshold-breach-flagged-negative"
      },
      {
        requirementId: "REQ-CDME-FIDELITY",
        module: "cdme-fidelity",
        concern: "fidelity reconciliation scores computed against source truth",
        positiveShapeRef: "evidence-shape://cdme/fidelity/score-computed-positive",
        negativeShapeRef: "evidence-shape://cdme/fidelity/divergence-scored-below-negative"
      },
      {
        requirementId: "REQ-CDME-ENGINE",
        module: "cdme-engine",
        concern: "engine orchestrates compile-execute-account-assure end to end",
        positiveShapeRef: "evidence-shape://cdme/engine/integration-run-positive",
        negativeShapeRef: "evidence-shape://cdme/engine/failing-stage-halts-negative"
      }
    ],
    cdmeRequirementSpanStages: [
      "derive_uat_testcases_surface",
      "derive_component_test_surface",
      "derive_test_execution_result_surface",
      "derive_repaired_test_execution_result_surface"
    ],
    cdmeRequirementDepthClassRefs: [
      "depth-class://positive",
      "depth-class://negative",
      "depth-class://boundary",
      "depth-class://invariant",
      "depth-class://integration"
    ],
    stagePlan: [
      {
        stage: "derive_intent_surface",
        filesToProduce: ["specification/intent.md"],
        instructions: [
          "Write only specification/intent.md.",
          "Declare the intent for the Scala/Spark CDME data-mapper lifecycle build.",
          "The mapper must model typed logical and physical data mapping, topology compilation, DataFrame execution, adjoint lineage, accounting, assurance, fidelity, and engine orchestration.",
          "The active tenant is scala_spark. The build output root is build_tenants/scala_spark.",
          "State that GTL/ABG owns startup, registry selection, graph-call opening, vector traversal, F_P dispatch, evidence admission, event emission, fold, residual, and replay truth.",
          "Do not write product, requirements, design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_product_surface",
        requiredPriorStages: ["derive_intent_surface"],
        filesToProduce: ["specification/product.md"],
        instructions: [
          "Write only specification/product.md.",
          "Use the prior intent artifact as authority.",
          "Define the product as a Scala/SBT multi-module CDME data-mapper tenant, not as JavaScript.",
          `The module set is exactly ${DATA_MAPPER_SCALA_MODULES.join(", ")}.`,
          "The build command is sbt clean assembly and the test execution contract is sbt test under build_tenants/scala_spark.",
          "The product must include Scala source and ScalaTest test source for topology compilation, DataFrame execution, adjoint lineage, accounting verification, assurance, fidelity, and engine integration.",
          "Do not write requirements, design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_goal_surface",
        requiredPriorStages: ["derive_intent_surface", "derive_product_surface"],
        filesToProduce: ["specification/goals.md"],
        instructions: [
          "Write only specification/goals.md.",
          "Use the prior intent and product artifacts as authority.",
          "List the build goals: create the scala_spark SBT tenant, implement shared cdme-core plus the seven CDME concern modules, prove topology compilation, prove DataFrame execution, prove adjoint lineage, prove accounting invariants, prove assurance/fidelity services, and prove engine integration.",
          "Do not write requirements, design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_requirement_surface",
        requiredPriorStages: ["derive_goal_surface"],
        filesToProduce: ["specification/requirements.md"],
        instructions: [
          "Write only specification/requirements.md.",
          "Use the prior goal artifact as authority.",
          "Define requirements for the scala_spark tenant: SBT build, shared cdme-core plus seven CDME concern modules, typed topology compiler, DataFrame executor, adjoint lineage registry, accounting invariant verifier, assurance service, fidelity service, and engine integration.",
          `Require the shared cross-module contract DTOs ${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")} to live in cdme-core when concern modules depend on cdme-core only; concern modules own behavior, traits, implementations, and module-local evidence types.`,
          "Require at least one ScalaTest spec for every CDME module, including cdme-core, and a test execution result from sbt test.",
          "Require the generated implementation to avoid JavaScript/Node source and avoid package.json as the subject build surface.",
          "Do not write design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_uat_testcases_surface",
        requiredPriorStages: ["derive_requirement_surface"],
        filesToProduce: ["specification/uat-testcases.md"],
        instructions: [
          "Write only specification/uat-testcases.md.",
          "Use the prior requirements artifact as authority.",
          "Define user acceptance testcases for compiling a mapping topology, executing a DataFrame transformation, preserving adjoint lineage, balancing accounting partitions, applying assurance checks, calculating fidelity, and running the CDME engine integration path.",
          "Do not write executable test source in this vector."
        ]
      },
      {
        stage: "derive_testcase_authority_surface",
        requiredPriorStages: ["derive_uat_testcases_surface"],
        filesToProduce: ["specification/testcase-authority.md"],
        instructions: [
          "Write only specification/testcase-authority.md.",
          "Use the prior UAT testcase artifact as authority.",
          "Declare that generated ScalaTest sources must bind to the module responsibilities named in product and requirements.",
          "Require SBT test reports for every CDME module.",
          "Forbid replacing the scala_spark tenant with JavaScript, Node test wrappers, or a single LogicalDataModel class."
        ]
      },
      {
        stage: "derive_feature_decomp_surface",
        requiredPriorStages: ["derive_requirement_surface", "derive_testcase_authority_surface"],
        filesToProduce: ["design/feature-decomposition.md"],
        instructions: [
          "Write only design/feature-decomposition.md.",
          "Use the prior requirements and testcase-authority artifacts as authority.",
          `Decompose the implementation into exactly these SBT modules: ${DATA_MAPPER_SCALA_MODULES.join(", ")}.`,
          "Map cdme-core to shared typed vocabulary, cdme-compiler to topology/type compilation, cdme-executor to DataFrame execution and error sink, cdme-adjoint to lineage/adjoint metadata, cdme-accounting to invariant verification and ledger proof, cdme-assurance to data-quality checks, cdme-fidelity to reconciliation metrics, and cdme-engine to orchestration.",
          `Because every concern module depends on cdme-core only, cdme-core owns the shared cross-module contract DTOs ${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")}; concern modules may re-export or consume them but must not become their sole defining module if another concern module must use the type.`,
          "Do not write source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_design_surface",
        requiredPriorStages: ["derive_requirement_surface", "derive_feature_decomp_surface"],
        filesToProduce: ["design/module-design.md"],
        instructions: [
          "Write only design/module-design.md.",
          "Use the prior feature-decomposition artifact as authority.",
          "Design a Scala/SBT multi-module tenant rooted at build_tenants/scala_spark.",
          "Use Scala 2.13, ScalaTest, and module dependencies matching the CDME decomposition.",
          "Specify typed topology rows, mapping edges, execution results, adjoint metadata, ledgers, assurance outcomes, fidelity reports, and engine run results as Scala domain types.",
          `When the design assigns any shared contract DTO used across concern modules, assign ${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")} to cdme-core so the core-only dependency graph remains compilable. Do not assign one of these shared DTOs only to cdme-compiler, cdme-executor, cdme-accounting, or any other concern module when another concern module's public signature consumes it.`,
          "Do not design a JavaScript class, Node package, or single-file LogicalDataModel replacement.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_scenario_surface",
        requiredPriorStages: ["derive_uat_testcases_surface", "derive_design_surface"],
        filesToProduce: ["specification/scenario.md"],
        instructions: [
          "Write only specification/scenario.md.",
          "Use prior UAT and design artifacts as authority.",
          "Describe the scenario as a Scala/Spark data-mapper build: compile a source-to-target topology, execute a small in-memory dataset, capture lineage, verify accounting, run assurance/fidelity checks, and prove engine integration through sbt test.",
          "Name the module-level tests as the acceptance proof surface.",
          "Do not describe the scenario as a JavaScript object-graph or Node test.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_implementation_design_surface",
        requiredPriorStages: [
          "derive_requirement_surface",
          "derive_testcase_authority_surface",
          "derive_feature_decomp_surface",
          "derive_design_surface",
          "derive_scenario_surface"
        ],
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Use all prior specification and design artifacts as authority.",
          "Specify exact SBT files: build_tenants/scala_spark/build.sbt, build_tenants/scala_spark/project/plugins.sbt, and build_tenants/scala_spark/project/build.properties.",
          `Specify exact Scala source files: ${DATA_MAPPER_SCALA_MAIN_FILES.join(", ")}.`,
          `Specify exact ScalaTest files: ${DATA_MAPPER_SCALA_TEST_FILES.join(", ")}.`,
          `The implementation design must keep the module dependency graph and public type placement jointly satisfiable: if concern modules depend on cdme-core only, shared inter-module contract DTOs (${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")}) are defined in cdme-core and concern modules own behavior over those DTOs.`,
          "The implementation must be sufficient for sbt test to produce one passing test report per CDME module.",
          "Do not specify package.json, src/logical-data-model.mjs, Node test files, or any JavaScript subject build.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_component_code_surface",
        requiredPriorStages: ["derive_implementation_design_surface"],
        filesToProduce: ["design/component-code-surface.md"],
        instructions: [
          "Write only design/component-code-surface.md.",
          "Use implementation_design as authority.",
          "Describe the component code surface as the Scala/SBT CDME module set.",
          "List each module source file and its responsibility.",
          `Keep the code surface internally compilable: ${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")} are shared cdme-core contract DTOs under the core-only concern-module dependency rule; module-local files may define traits/services and local proof/result wrappers around those DTOs.`,
          "The code surface must explicitly require build_tenants/scala_spark build output, not a root JavaScript package.",
          "Do not write package.json, source files, tests, or execution plans in this vector."
        ]
      },
      {
        stage: "qualify_component_realization_surface",
        requiredPriorStages: ["derive_implementation_design_surface", "derive_component_code_surface"],
        filesToProduce: ["proof/component-realization-qualification.md"],
        instructions: [
          "Write only proof/component-realization-qualification.md.",
          "Use the component-code-surface and implementation-design artifacts as authority.",
          "State the criteria the later source artifact must satisfy: Scala/SBT tenant shape, Apache Spark/Spark SQL dependency where DataFrames are executed, shared cdme-core plus seven CDME concern modules, all required Scala source files, and no JavaScript substitute.",
          `State that the admitted dependency graph and type-placement contract must compile together: under core-only concern-module dependencies, shared cross-module DTOs (${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")}) belong in cdme-core, not exclusively inside a sibling concern module whose types other concern modules cannot import.`,
          "State that modeling Spark/DataFrame execution with a hand-rolled in-memory substitute is not a valid realization of the admitted Spark/SBT tenant requirement.",
          "State that component realization cannot close without the required Scala source paths.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_code_surface",
        requiredPriorStages: [
          "derive_implementation_design_surface",
          "derive_component_code_surface",
          "qualify_component_realization_surface"
        ],
        filesToProduce: [
          "build_tenants/scala_spark/build.sbt",
          "build_tenants/scala_spark/project/plugins.sbt",
          "build_tenants/scala_spark/project/build.properties",
          ...DATA_MAPPER_SCALA_MAIN_FILES
        ],
        instructions: [
          "Write only the Scala/SBT build files and Scala main source files listed for this stage.",
          "Use the prior implementation_design and component_realization_qualification artifacts as authority.",
          "build.sbt must define shared cdme-core plus the seven concern modules cdme-compiler, cdme-executor, cdme-adjoint, cdme-accounting, cdme-assurance, cdme-fidelity, and cdme-engine.",
          `Do not create an impossible type/dependency contract: if build.sbt keeps concern modules depending on cdme-core only, define shared cross-module DTOs (${DATA_MAPPER_SHARED_CORE_CONTRACT_TYPES.join(", ")}) in cdme-core and implement concern-module behavior against those cdme-core DTOs.`,
          "Use Scala 2.13, ScalaTest, and Apache Spark SQL where the admitted prior artifacts require DataFrame execution. Do not replace Spark/DataFrame execution with a hand-rolled in-memory substitute.",
          "Implement enough typed Scala domain logic for every required ScalaTest spec to exercise real code paths.",
          "Do not write package.json, src/logical-data-model.mjs, Node tests, or JavaScript source."
        ]
      },
      {
        stage: "derive_test_design_surface",
        requiredPriorStages: [
          "derive_code_surface",
          "derive_testcase_authority_surface",
          "derive_scenario_surface"
        ],
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Use the code surface and testcase authority artifacts as evidence.",
          // Bug #8 (T-030 campaign): the primary spec paths are FIXED
          // product contract data; design consumes them — one authority
          // direction (product policy -> design -> tests -> evaluator),
          // never emergent names that collide with the materialize allowlist.
          "The per-module primary ScalaTest spec file paths are a FIXED product contract and MUST be adopted verbatim as each module's primary spec in the test design: " + DATA_MAPPER_SCALA_TEST_FILES.join(", ") + ".",
          "Do not rename, move, or substitute these primary spec paths; additional helper specs are not allowed at this stage.",
          "Specify one ScalaTest spec for every CDME module, including cdme-core.",
          "The tests must exercise core contract DTO construction, topology compilation, executor transformation, adjoint lineage registration, accounting balance, assurance threshold behavior, fidelity scoring, and engine integration.",
          "The test design must use sbt test and SBT XML test reports as execution evidence.",
          "Do not write executable test source in this vector."
        ]
      },
      {
        stage: "derive_component_test_surface",
        requiredPriorStages: [
          "derive_code_surface",
          "derive_test_design_surface",
          "derive_testcase_authority_surface"
        ],
        filesToProduce: DATA_MAPPER_SCALA_TEST_FILES,
        instructions: [
          "Write only the eight ScalaTest source files listed for this stage.",
          "Use the prior source artifact as the API authority. Tests must call only symbols, owners, return shapes, and method signatures that are visibly declared in the admitted Scala source excerpts.",
          "Do not invent convenience facades. For example, do not call CdmeEngine.run unless the source artifact declares object CdmeEngine with run; bind to the generated engine API that actually exists.",
          "If a source API returns Either[CompileError, X], tests must pattern-match or project that Either; do not treat a single CompileError as a collection.",
          "Run sbt Test/compile YOURSELF after writing the files and fix any test-surface mismatch before returning (execution-default law: the framework runs nothing). Report the compile outcome truthfully in your assessment. A source/test API mismatch is a vector failure.",
          "Each file must be a ScalaTest AnyFunSuite or AnyFlatSpec-style test compatible with ScalaTest 3.2.x.",
          "Each CDME module, including cdme-core, must have at least one nontrivial assertion against the module implementation or declared contract DTOs.",
          "COMPLETENESS OVER COVERAGE: every emitted file must be syntactically complete (all braces closed, compilable on its own). If the full response would be large, write SHORTER test bodies (two or three focused assertions per module) rather than long ones — a truncated file fails the compile gate; a short complete file passes.",
          "If a main-source API defect prevents a clean test compile, still emit complete, correct tests against the DECLARED API; the compile gate attributes main-source errors upstream and the repair stages own them.",
          "Do not write Node tests or JavaScript files."
        ]
      },
      {
        stage: "prepare_test_execution_surface",
        requiredPriorStages: ["derive_code_surface", "derive_component_test_surface"],
        filesToProduce: ["test-execution-result.json"],
        instructions: [
          "EXECUTION-DEFAULT LAW: YOU run the test suite inside this turn; the framework executes nothing.",
          `Run sbt test yourself from cwd \"build_tenants/scala_spark\". If ${DATA_MAPPER_SCALA_JAVA11_HOME} exists, export JAVA_HOME=${DATA_MAPPER_SCALA_JAVA11_HOME} and prefix PATH with ${DATA_MAPPER_SCALA_JAVA11_HOME}/bin:${DATA_MAPPER_TOOLCHAIN_BIN} so Spark/Hadoop test execution uses a compatible JDK and the build toolchain resolves.`,
          "Then write only test-execution-result.json recording the TRUTHFUL observed result: command \"sbt\", args [\"test\"], cwd \"build_tenants/scala_spark\", the integer exit status you observed, the env you set, and a stdout tail.",
          "expectedTestPassCount must be 20, matching the admitted ScalaTest test-case count across the eight expected suites; record observedTestPassCount from the XML reports your run produced.",
          `expectedTestReportPaths must equal ${JSON.stringify(DATA_MAPPER_SCALA_TEST_REPORTS)}.`,
          "assertedReturnValue must be \"data_mapper_full_sbt ok\".",
          "A FAILING run is lawful evidence — record it truthfully; never fabricate status, counts, or reports (the reports on disk are verified mechanically against your claims).",
          "Do not use node, node:test, package.json, or JavaScript test files."
        ]
      },
      {
        stage: "derive_test_execution_result_surface",
        requiredPriorStages: [
          "derive_code_surface",
          "derive_component_test_surface",
          "prepare_test_execution_surface"
        ],
        instructions: [
          "Produce no files.",
          "Accept the execution-result surface if the WORKER-EXECUTED sbt test run recorded command status, planSatisfied, observedTestPassCount, expectedTestPassCount, expected report paths, and assertedReturnValue — the worker ran the suite in its own turn (execution-default law) and the reports on disk corroborate the claims.",
          "Do not require planSatisfied=true to close this vector; a failed test run is valid execution-result evidence and must carry forward to qualification and repair instead of triggering same-vector retry.",
          "A passing result still requires sbt test exited 0, all eight expected SBT XML test reports exist with zero failures/errors, observedTestPassCount is at least 20, planSatisfied is true, and assertedReturnValue is \"data_mapper_full_sbt ok\"."
        ]
      },
      {
        stage: "qualify_component_test_execution_surface",
        requiredPriorStages: ["derive_test_execution_result_surface"],
        filesToProduce: ["proof/component-test-execution-qualification.md"],
        instructions: [
          "Write only proof/component-test-execution-qualification.md.",
          "Use the prior test_execution_result artifact as authority.",
          "Summarize the observed command, pass count, planSatisfied flag, stdout digest, and asserted return value.",
          "Do not rerun tests in this vector."
        ]
      },
      {
        stage: "derive_component_repair_schedule_surface",
        requiredPriorStages: ["qualify_component_test_execution_surface"],
        filesToProduce: ["repair/component-repair-schedule.md"],
        instructions: [
          "Write only repair/component-repair-schedule.md.",
          "Use the test execution qualification as authority.",
          "If the test execution result passed, state that no repair is scheduled and preserve residual pressure as none for this scenario.",
          "If it did not pass, identify the failing surface without inventing local closure truth."
        ]
      },
      {
        stage: "apply_component_repair_surface",
        requiredPriorStages: [
          "derive_component_repair_schedule_surface",
          "derive_code_surface",
          "derive_component_test_surface",
          "prepare_test_execution_surface"
        ],
        filesToProduce: ["repair/component-repair-application.md"],
        instructions: [
          "Write only repair/component-repair-application.md.",
          "Use the repair schedule, code artifact, test artifact, and execution plan as authority.",
          "If the schedule reports no repair needed, state that the prior implementation and test plan are preserved and ready for rerun.",
          `If the schedule reports the Spark/Hadoop Java runtime failure involving Subject.getSubject or Java 25, declare the repair as a test-execution-plan toolchain binding to ${DATA_MAPPER_SCALA_JAVA11_HOME}; do not weaken tests and do not replace Spark/DataFrame behavior with an in-memory substitute.`,
          "If source or tests are repaired, name the exact admitted source or test files that must be rewritten by a future code/test repair vector; do not claim those files changed unless this stage is permitted to write them."
        ]
      },
      {
        stage: "prepare_repaired_test_execution_surface",
        requiredPriorStages: [
          "apply_component_repair_surface",
          "derive_component_repair_schedule_surface",
          "derive_code_surface",
          "derive_component_test_surface"
        ],
        filesToProduce: ["test-execution-result.json"],
        instructions: [
          "EXECUTION-DEFAULT LAW: YOU re-run the suite after the repair; the framework executes nothing.",
          `Run sbt test yourself from cwd \"build_tenants/scala_spark\" (JAVA_HOME=${DATA_MAPPER_SCALA_JAVA11_HOME} and PATH prefixed with ${DATA_MAPPER_SCALA_JAVA11_HOME}/bin when that path exists; toolchain binding, not test weakening).`,
          "Then rewrite test-execution-result.json with the TRUTHFUL repaired result: command \"sbt\", args [\"test\"], the exit status you observed, expectedTestPassCount 20, observedTestPassCount from the reports, expectedTestReportPaths, and assertedReturnValue \"data_mapper_full_sbt ok\".",
          `expectedTestReportPaths must equal ${JSON.stringify(DATA_MAPPER_SCALA_TEST_REPORTS)}.`,
          "A failing repaired run is lawful evidence and routes another repair pass; never fabricate.",
          "Do not use node, node:test, package.json, JavaScript test files, or a command wrapper script."
        ]
      },
      {
        stage: "derive_repaired_test_execution_result_surface",
        requiredPriorStages: [
          "prepare_repaired_test_execution_surface",
          "apply_component_repair_surface",
          "derive_code_surface",
          "derive_component_test_surface"
        ],
        instructions: [
          "Produce no files.",
          "Accept when the repaired WORKER-EXECUTED sbt test run recorded full evidence: command status, planSatisfied, observedTestPassCount, expectedTestPassCount, expected report paths, assertedReturnValue, and env evidence. TRUTHFUL FAILING evidence is an acceptable result-surface derivation: the consequence stage routes a failing repaired execution back to the code vector for another repair pass (re-entry law); do not reject solely because tests fail.",
          "Reject only when the evidence itself is malformed or incomplete: the command did not actually run, statuses/counts are missing or non-numeric, report paths are undeclared, or env evidence is absent.",
          "A PASSING repaired result (exit 0, all eight SBT XML reports, zero failures/errors, observedTestPassCount >= 20, planSatisfied true, assertedReturnValue \"data_mapper_full_sbt ok\") advances toward qualification; state pass/fail plainly in the review."
        ]
      },
      {
        stage: "qualify_repaired_component_test_execution_surface",
        requiredPriorStages: ["derive_repaired_test_execution_result_surface", "apply_component_repair_surface"],
        filesToProduce: ["proof/repaired-component-test-execution-qualification.md"],
        instructions: [
          "Write only proof/repaired-component-test-execution-qualification.md.",
          "Use the repaired test execution result and repair application as authority.",
          "Summarize the repaired command, env binding, pass count, planSatisfied flag, stdout digest, and asserted return value.",
          "Accept only if the repaired result passed; do not claim release readiness from the earlier failed execution result."
        ]
      },
      {
        stage: "derive_test_run_archive_surface",
        requiredPriorStages: [
          "derive_test_execution_result_surface",
          "qualify_component_test_execution_surface",
          "derive_component_repair_schedule_surface",
          "derive_repaired_test_execution_result_surface",
          "qualify_repaired_component_test_execution_surface"
        ],
        filesToProduce: ["archive/test-run-archive.md"],
        instructions: [
          "Write only archive/test-run-archive.md.",
          "Use the original test execution qualification, repair schedule, repaired execution qualification, and repaired execution result as authority.",
          "Archive both the original failed command evidence when present and the repaired passing command evidence.",
          "Archive the repaired command, env binding, observed pass count, asserted return value, and generated artifact list.",
          "Do not claim release approval."
        ]
      },
      {
        stage: "derive_release_depth_parity_surface",
        requiredPriorStages: [
          "derive_test_run_archive_surface",
          "derive_component_repair_schedule_surface",
          "qualify_repaired_component_test_execution_surface"
        ],
        filesToProduce: ["release/release-depth-parity.md"],
        instructions: [
          "Write only release/release-depth-parity.md.",
          "Use the test run archive, repair schedule, and repaired execution qualification artifacts as authority.",
          "Compare the generated lifecycle coverage against the 26 full data-mapper stages and state whether release-depth parity evidence is present.",
          "Treat a non-passing original execution as acceptable only when the repaired execution result passed and is archived.",
          "Do not claim production release authority."
        ]
      },
      {
        stage: "prepare_release_surface",
        requiredPriorStages: ["derive_release_depth_parity_surface", "derive_test_run_archive_surface"],
        filesToProduce: ["release/release-preparation.md"],
        instructions: [
          "Write only release/release-preparation.md.",
          "Use release-depth-parity and the test run archive as authority.",
          "Prepare a release-readiness summary that preserves ABG as owner of proof truth and states odd_glc only interprets the replayed lifecycle.",
          "State that production release authority is not claimed by odd_glc."
        ]
      }
    ]
  })
]);

function liveEnabled() {
  return process.env.ODD_GLC_GTL_ABG_HELLO_WORLDS_LIVE === "1" || process.env.CODEX_LIVE_FP === "1";
}

function isComplianceScenario(scenario) {
  return scenario.proofClass === "sdlc_graph_traversal_compliance" ||
    scenario.proofClass === "full_lifecycle_graph_traversal_compliance";
}

function isDiagnosticScenario(scenario) {
  return scenario.proofClass === "diagnostic_smoke_not_compliance";
}

function selectedScenarios() {
  const requested = process.env.ODD_GLC_LIVE_SCENARIO;
  if (requested === undefined || requested.length === 0 || requested === "all") {
    return SCENARIOS;
  }
  if (requested === "compliance") {
    return Object.freeze(SCENARIOS.filter(isComplianceScenario));
  }
  if (requested === "diagnostic") {
    return Object.freeze(SCENARIOS.filter(isDiagnosticScenario));
  }
  const selected = SCENARIOS.filter((scenario) => scenario.key === requested || scenario.scenarioId === requested);
  assert.notEqual(selected.length, 0, `Unknown ODD_GLC_LIVE_SCENARIO ${requested}`);
  return Object.freeze(selected);
}

function timestampId() {
  return `${new Date().toISOString().replace(/[-:.]/gu, "").replace("Z", "Z")}_pid${process.pid}`;
}

function sha256Text(text) {
  return `sha256:${createHash("sha256").update(text ?? "", "utf8").digest("hex")}`;
}

function parseJsonLines(text) {
  return text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function balancedJsonObjectSliceAt(text, start) {
  let depth = 0;
  let inString = false;
  let escaping = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (char === "\\") {
        escaping = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }
  return null;
}

function parseJsonObjectCandidate(candidate) {
  try {
    const parsed = JSON.parse(candidate);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function parseJsonObjectsFromMixedStream(text) {
  const values = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "{") {
      continue;
    }
    const candidate = balancedJsonObjectSliceAt(text, index);
    if (candidate === null) {
      continue;
    }
    const parsed = parseJsonObjectCandidate(candidate);
    if (parsed !== null) {
      values.push(parsed);
      index += candidate.length - 1;
    }
  }
  return Object.freeze(values);
}

function parseFirstJsonObjectFromMixedStream(text, predicate, label) {
  const parsed = parseJsonObjectsFromMixedStream(text).find(predicate);
  if (parsed !== undefined) {
    return parsed;
  }
  throw new Error(`${label}: ${text.slice(0, 500)}`);
}

function parseCliStartOutput(text) {
  return parseFirstJsonObjectFromMixedStream(
    text,
    (value) =>
      value.command === "start" &&
      typeof value.events_path === "string" &&
      Array.isArray(value.event_kinds),
    "installed genesis-ts start did not emit a parseable start summary"
  );
}

function parseTraceEventsFromMixedStream(text) {
  return parseJsonObjectsFromMixedStream(text).filter((value) =>
    typeof value.type === "string"
  );
}

function parseTraceArchiveEvents(text) {
  return parseJsonLines(text).filter((value) =>
    value !== null &&
      typeof value === "object" &&
      (typeof value.kind === "string" || typeof value.type === "string")
  );
}

function traceArchiveTiming(events) {
  if (events.length === 0) {
    return null;
  }
  const first = events[0];
  const last = events[events.length - 1];
  const firstMs = Date.parse(first.createdAt);
  const lastMs = Date.parse(last.createdAt);
  if (!Number.isFinite(firstMs) || !Number.isFinite(lastMs)) {
    return null;
  }
  return Object.freeze({
    startedAtEpochMs: firstMs,
    startedAt: first.createdAt,
    endedAtEpochMs: lastMs,
    endedAt: last.createdAt,
    durationMs: Math.max(0, lastMs - firstMs)
  });
}

function eventUnixMs(event, fieldName) {
  assert.equal(Number.isSafeInteger(event.eventTimeUnixMs), true, `${fieldName}.eventTimeUnixMs missing`);
  assert.equal(typeof event.eventTime, "string", `${fieldName}.eventTime missing`);
  return event.eventTimeUnixMs;
}

async function traceTimingFromResultPath(traceResultPath) {
  const traceEventsPath = path.join(path.dirname(traceResultPath), "events.ndjson");
  try {
    const events = parseTraceArchiveEvents(await readFile(traceEventsPath, "utf8"));
    const timing = traceArchiveTiming(events);
    if (timing !== null) {
      return Object.freeze({
        durationMs: timing.durationMs,
        apiDurationMs: null,
        turns: null
      });
    }
  } catch {
    // Older or non-PTY traces may not carry an events.ndjson archive.
  }
  const traceResult = await readJson(traceResultPath);
  const resultEvent = typeof traceResult.stdout === "string"
    ? parseTraceEventsFromMixedStream(traceResult.stdout).find((event) => event.type === "result")
    : null;
  return Object.freeze({
    durationMs: Number.isFinite(resultEvent?.duration_ms)
      ? resultEvent.duration_ms
      : null,
    apiDurationMs: Number.isFinite(resultEvent?.duration_api_ms)
      ? resultEvent.duration_api_ms
      : null,
    turns: Number.isInteger(resultEvent?.num_turns)
      ? resultEvent.num_turns
      : null
  });
}

async function workerTraceDurationFromArtifact(artifact) {
  const embeddedDuration = artifact.timing.workerTrace?.timing?.durationMs;
  if (typeof embeddedDuration === "number" && embeddedDuration >= 0) {
    return embeddedDuration;
  }
  const traceResultPath = artifact.transport?.traceResultPath;
  if (typeof traceResultPath !== "string") {
    return null;
  }
  return (await traceTimingFromResultPath(traceResultPath)).durationMs;
}

async function traversalTimingReport(events, artifacts) {
  const rows = [];
  for (const artifact of artifacts) {
    const vectorIndex = artifact.vectorIndex;
    const planned = events.find((event) =>
      event.kind === "vector_traversal_planned" && event.vectorIndex === vectorIndex
    );
    const closed = events.find((event) =>
      event.kind === "vector_closed" && event.vectorIndex === vectorIndex
    );
    assert.ok(planned, `missing vector_traversal_planned for vector ${vectorIndex}`);
    assert.ok(closed, `missing vector_closed for vector ${vectorIndex}`);
    const plannedMs = eventUnixMs(planned, `vector ${vectorIndex} planned`);
    const closedMs = eventUnixMs(closed, `vector ${vectorIndex} closed`);
    rows.push(Object.freeze({
      vectorIndex,
      stage: artifact.stage,
      vectorId: artifact.stagePlan.vectorId,
      edge: artifact.edge,
      traversalPlannedAt: planned.eventTime,
      vectorClosedAt: closed.eventTime,
      traversalDurationMs: closedMs - plannedMs,
      dispatchDurationMs: artifact.timing.dispatch.durationMs,
      workerTraceDurationMs: await workerTraceDurationFromArtifact(artifact),
      subjectExecutionDurationMs: artifact.timing.subjectExecution?.durationMs ?? null,
      deterministicMaterializeDurationMs: artifact.timing.deterministicMaterialize?.durationMs ?? null,
      assessmentMaterializeDurationMs: artifact.timing.assessmentMaterialize?.durationMs ?? null,
      executorProfile: artifact.transport.executorProfile,
      terminalSessionId: artifact.transport.terminalSessionId,
      traceResultPath: artifact.transport.traceResultPath
    }));
  }
  return Object.freeze(rows);
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

function runForEvidence(command, args, options) {
  return spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env,
    maxBuffer: options.maxBuffer ?? 64 * 1024 * 1024
  });
}

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents ?? "", "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("live harness parses structured records from mixed PTY streams", () => {
  const startOutput = parseCliStartOutput([
    "\u001b[2Kterminal prelude",
    JSON.stringify({
      command: "start",
      events_path: "/tmp/events.jsonl",
      event_kinds: ["basis_admitted"],
      stopped_by: "converged"
    }),
    "terminal epilogue"
  ].join("\n"));
  assert.equal(startOutput.events_path, "/tmp/events.jsonl");
  assert.deepEqual(
    parseTraceEventsFromMixedStream([
      "pty banner",
      JSON.stringify({ type: "turn", createdAt: "2026-07-07T00:00:00.000Z" }),
      "non-json status line",
      JSON.stringify({ type: "result", duration_ms: 12, num_turns: 1 })
    ].join("\n")).map((event) => event.type),
    ["turn", "result"]
  );
});

test("live binding falls back to PTY result stream when event trace has no timing", () => {
  const source = readFileSync(fileURLToPath(import.meta.url), "utf8");
  assert.match(source, /const timing = traceTiming\(events\);[\s\S]+if \(timing !== null\)/u);
  assert.match(source, /abg_traced_process_terminal_events/u);
  assert.match(source, /\? parseTraceEvents\(traceResult\.stdout\)/u);
  assert.match(source, /abg_traced_process_result_stdout/u);
});

test("classifies every current live scenario as GTL/ABG traversal compliance", () => {
  const compliantScenarios = SCENARIOS.filter(isComplianceScenario);
  const diagnosticScenarios = SCENARIOS.filter(isDiagnosticScenario);

  assert.deepEqual(
    compliantScenarios.map((scenario) => scenario.scenarioId),
    SCENARIOS.map((scenario) => scenario.scenarioId)
  );
  assert.equal(diagnosticScenarios.length, 0);

  for (const scenario of compliantScenarios) {
    if (scenario.proofClass === "sdlc_graph_traversal_compliance") {
      assert.equal(scenario.graphFunctionRef, ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF);
      assert.deepEqual(
        scenario.stagePlan.map((stage) => stage.vectorId),
        ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN.map((stage) => stage.vectorId)
      );
      assert.deepEqual(
        scenario.requiredStageNames,
        ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN.map((stage) => stage.stage)
      );
    } else if (scenario.proofClass === "full_lifecycle_graph_traversal_compliance") {
      assert.equal(scenario.graphFunctionRef, ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_GRAPH_FUNCTION_REF);
      assert.deepEqual(
        scenario.stagePlan.map((stage) => stage.vectorId),
        ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN.map((stage) => stage.vectorId)
      );
      assert.deepEqual(
        scenario.requiredStageNames,
        ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN.map((stage) => stage.stage)
      );
    } else {
      assert.fail(`Unexpected compliance proof class ${scenario.proofClass}`);
    }
  }
});

test("selects traversal compliance separately from diagnostic scenarios", () => {
  const previous = process.env.ODD_GLC_LIVE_SCENARIO;
  try {
    process.env.ODD_GLC_LIVE_SCENARIO = "compliance";
    assert.deepEqual(
      selectedScenarios().map((scenario) => scenario.scenarioId),
      SCENARIOS.map((scenario) => scenario.scenarioId)
    );

    process.env.ODD_GLC_LIVE_SCENARIO = "diagnostic";
    assert.deepEqual(
      selectedScenarios().map((scenario) => scenario.proofClass),
      []
    );
  } finally {
    if (previous === undefined) {
      delete process.env.ODD_GLC_LIVE_SCENARIO;
    } else {
      process.env.ODD_GLC_LIVE_SCENARIO = previous;
    }
  }
});

test("data-mapper full parity scenario targets Scala/SBT tenant depth, not JavaScript smoke", () => {
  const scenario = SCENARIOS.find((row) => row.key === "data-mapper-full");
  assert.ok(scenario);
  assert.equal(scenario.scenarioId, "SCN-GLC-DATA-MAPPER-FULL-SCALA-SBT");
  assert.equal(scenario.kind, "data_mapper_full_scala_sbt_test");
  assert.equal(scenario.expectedReturnValue, "data_mapper_full_sbt ok");
  assert.equal(scenario.requiredOutputPaths.includes("build_tenants/scala_spark/build.sbt"), true);
  assert.equal(scenario.requiredOutputPaths.includes("src/logical-data-model.mjs"), false);
  assert.equal(scenario.forbiddenOutputPaths.includes("src/logical-data-model.mjs"), true);
  assert.equal(Object.hasOwn(scenario, "expectedExecutionPlan"), false);
  assert.deepEqual(
    DATA_MAPPER_SCALA_MAIN_FILES.filter((relativePath) => !scenario.requiredOutputPaths.includes(relativePath)),
    []
  );
  assert.deepEqual(
    DATA_MAPPER_SCALA_TEST_FILES.filter((relativePath) => !scenario.requiredOutputPaths.includes(relativePath)),
    []
  );
  const executionStage = scenario.stagePlan.find((stage) => stage.stage === "prepare_test_execution_surface");
  assert.ok(executionStage);
  // T-209 D3: the execution stage produces the worker-executed RESULT,
  // never a plan for the framework to run
  assert.equal(executionStage.filesToProduce.includes("test-execution-result.json"), true);
  assert.equal(executionStage.filesToProduce.includes("test-execution-plan.json"), false);
  assert.equal(
    executionStage.instructions.some((instruction) => /YOU run the test suite inside this turn/u.test(instruction)),
    true
  );
  assert.equal(
    executionStage.instructions.some((instruction) => /expectedTestReportPaths/u.test(instruction)),
    true
  );
});

test("installs odd_glc into sandbox before generating ABG runtime binding", async () => {
  const scenario = SCENARIOS.find((row) => row.key === "basic-cli");
  assert.ok(scenario);
  const runRoot = path.join(liveRoot, "install-shape", timestampId());
  const workspaceRoot = path.join(runRoot, "instance");
  await mkdir(workspaceRoot, { recursive: true });

  const oddGlcInstall = await installOddGlcProductForSandbox({
    runRoot,
    workspaceRoot,
    tenantRoot,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate
  });
  const runtimeBindingPath = await writeRuntimeBinding({
    abgPackageRoot: defaultAbgPackageRoot,
    oddGlcPackageRoot: oddGlcInstall.packageRoot,
    scenario,
    workspaceRoot
  });
  const runtimeBindingText = await readFile(runtimeBindingPath, "utf8");
  const sourceImportPath = path.join(tenantRoot, "src", "index.mjs");

  assert.equal(existsSync(path.join(oddGlcInstall.packageRoot, "src", "index.mjs")), true);
  assert.equal(existsSync(path.join(workspaceRoot, ".odd_glc", "install-manifest.json")), true);
  assert.equal(existsSync(path.join(workspaceRoot, ".ai-workspace", "odd-glc-install-manifest.json")), true);
  assert.equal(runtimeBindingText.includes(sourceImportPath), false);
  assert.equal(runtimeBindingText.includes(oddGlcInstall.packageRoot), true);
  assert.equal(oddGlcInstall.manifest.packageName, ODD_GLC_INSTALL_PACKAGE_NAME);
  assert.equal(oddGlcInstall.manifest.packageVersion, ODD_GLC_INSTALL_VERSION);
  assert.deepEqual(
    oddGlcInstall.manifest.copiedFiles.map((file) => file.relativePath),
    ODD_GLC_INSTALL_FILES
  );
  assert.equal(
    oddGlcInstall.manifest.copiedFiles.every((file) => file.sha256.startsWith("sha256:")),
    true
  );
});

function runtimeBindingSource(input) {
  const packageImport = pathToFileURL(
    path.join(input.abgPackageRoot, "build", "semantic", "code", "src", "index.js")
  ).href;
  const m03ContractsImport = pathToFileURL(
    path.join(input.abgPackageRoot, "build", "semantic", "code", "src", "abg", "m03", "contracts", "index.js")
  ).href;
  const gtlRequirementsImport = pathToFileURL(
    path.join(input.abgPackageRoot, "build", "semantic", "code", "src", "gtl", "requirements", "index.js")
  ).href;
  const oddGlcIndexPath = path.join(input.oddGlcPackageRoot, "src", "index.mjs");
  assert.equal(existsSync(oddGlcIndexPath), true, `Missing installed odd_glc package at ${oddGlcIndexPath}`);
  const oddGlcImport = pathToFileURL(oddGlcIndexPath).href;
  return `import {
  admitModule,
  admitNode,
  STANDING_GATE_TEMPORAL_PROPERTY_RULES,
  constructGtlContractFulfillmentBinding,
  constructRequirementProofCandidateClassificationTable,
  constructRequirementProofCarryThroughContract,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  composeNodeTypes,
  composeWithTypeWiring,
  constructDefaultAbgFnCompositionDeclarations,
  constructFpDispatchOutcome,
  constructFpEvaluationFinding,
  constructFpEvaluationOutcome,
  constructGraphFunction,
  constructGtlLibraryEntryDeclaration,
  constructNode,
  constructNodeTypeGraphFunction,
  constructProductRegistryStartupConfig,
  constructEnginePluginContract,
  contractForKnownAgent,
  defaultFpDispatchPlugin,
  defaultFpEvaluatorPlugin,
  edge,
  graphFunctionForVector,
  runAgentTransport,
  satisfiesNodeType
} from ${JSON.stringify(packageImport)};
import {
  declareBundle,
  declareRequirement,
  declareTraversalSpan
} from ${JSON.stringify(gtlRequirementsImport)};
import {
  compileInstructionAssemblyPlan,
  constructDerivedDependencyInstructionTruth,
  constructDerivedProofDepthInstructionTruth,
  constructInstructionAssemblyRule,
  constructInstructionSectionDecision,
  constructRuntimeBindingSlot,
  INSTRUCTION_ASSEMBLY_KNOWN_ALGEBRAS
} from ${JSON.stringify(m03ContractsImport)};
import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
  ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ODD_GLC_LIFECYCLE_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING
} from ${JSON.stringify(oddGlcImport)};
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";

const SCENARIO = Object.freeze(${JSON.stringify(input.scenario, null, 2)});
const PRODUCT_NAMESPACE = ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.productNamespace;
const OWNER_REF = ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.ownerRef;
const PRODUCT_VERSION = ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.version;
const OVERLAY_REF = ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef;
const GRAPH_REF = ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef;
const GRAPH_FUNCTION_REF = SCENARIO.graphFunctionRef ?? ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget;
const ABI_PROVENANCE_REF = \`provenance://abiogenesis/\${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}\`;
const TYPE_REFS = Object.freeze({
  context: "odd_glc.type.lifecycle_context",
  lifecycleArtifact: "odd_glc.type.lifecycle_artifact",
  artifact: SCENARIO.artifactTypeRef ?? "odd_glc.type.lifecycle_artifact",
  evidence: "odd_glc.type.evidence_binding_view",
  implementationDesign: "odd_glc.type.lifecycle.implementation_design",
  sourceSurface: "odd_glc.type.software.source_surface",
  testDesignSurface: "odd_glc.type.software.test_design_surface",
  testSourceSurface: "odd_glc.type.software.test_source_surface",
  testExecutionPlan: "odd_glc.type.software.test_execution_plan",
  testExecutionResult: "odd_glc.type.software.test_execution_result"
});
const EXPECTED_STDOUT = Object.hasOwn(SCENARIO, "expectedStdout") ? SCENARIO.expectedStdout : "Hello, world!\\n";
const EXPECTED_ASSERTED_RETURN_VALUE = SCENARIO.expectedReturnValue ?? "Hello, world!";
const EXPECTED_MATERIALIZE_NODE_TYPES = Object.freeze(
  SCENARIO.materializeNodeTypes ?? [TYPE_REFS.context, TYPE_REFS.artifact]
);
const EXPECTED_PROVE_NODE_TYPES = Object.freeze(
  SCENARIO.proveNodeTypes ?? [TYPE_REFS.artifact, TYPE_REFS.evidence]
);
const STAGE_PLAN = Object.freeze(
  SCENARIO.stagePlan ?? [
    {
      stage: "materialize",
      vectorId: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphVectorRefs[0],
      sourceTypeRef: TYPE_REFS.context,
      sourceName: "GlcSoftwareBuildContext",
      targetTypeRef: TYPE_REFS.artifact,
      targetName: "GeneratedSoftwareBuildArtifact",
      requiredNodeTypes: EXPECTED_MATERIALIZE_NODE_TYPES,
      deterministicMaterialize: true
    },
    {
      stage: "prove",
      vectorId: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphVectorRefs[2],
      sourceTypeRef: TYPE_REFS.artifact,
      sourceName: "RunnableSoftwareBuildArtifact",
      targetTypeRef: TYPE_REFS.evidence,
      targetName: "SoftwareBuildExecutionEvidenceView",
      requiredNodeTypes: EXPECTED_PROVE_NODE_TYPES,
      executeBeforeAssessment: true
    }
  ]
);

function uniq(values) {
  return Object.freeze([...new Set(values)].sort());
}

function sha256Text(text) {
  return \`sha256:\${createHash("sha256").update(text ?? "", "utf8").digest("hex")}\`;
}

function timestampNow() {
  const epochMs = Date.now();
  return Object.freeze({
    epochMs,
    iso: new Date(epochMs).toISOString()
  });
}

function timingRecord(started) {
  const ended = timestampNow();
  return Object.freeze({
    startedAtEpochMs: started.epochMs,
    startedAt: started.iso,
    endedAtEpochMs: ended.epochMs,
    endedAt: ended.iso,
    durationMs: ended.epochMs - started.epochMs
  });
}

async function measuredStep(label, operation) {
  const started = timestampNow();
  const value = await operation();
  return Object.freeze({
    label,
    timing: timingRecord(started),
    value
  });
}

function parseTraceEvents(text) {
  const events = [];
  for (const line of text.split(/\\r?\\n/u)) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start < 0 || end < start) {
      continue;
    }
    try {
      const parsed = JSON.parse(trimmed.slice(start, end + 1));
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        (typeof parsed.type === "string" || typeof parsed.kind === "string")
      ) {
        events.push(parsed);
      }
    } catch {
      // PTY transcripts may include status lines; only structured trace rows matter here.
    }
  }
  return Object.freeze(events);
}

function traceTiming(events) {
  if (events.length === 0) {
    return null;
  }
  const first = events[0];
  const last = events[events.length - 1];
  const firstMs = Date.parse(first.createdAt);
  const lastMs = Date.parse(last.createdAt);
  if (!Number.isFinite(firstMs) || !Number.isFinite(lastMs)) {
    return null;
  }
  return Object.freeze({
    startedAtEpochMs: firstMs,
    startedAt: first.createdAt,
    endedAtEpochMs: lastMs,
    endedAt: last.createdAt,
    durationMs: Math.max(0, lastMs - firstMs)
  });
}

async function workerTraceTiming(transport) {
  const eventsPaths = [];
  if (typeof transport.tracePaths?.events === "string") {
    eventsPaths.push(Object.freeze({
      source: "abg_traced_process_events",
      eventsPath: transport.tracePaths.events
    }));
  }
  if (typeof transport.traceResultPath === "string") {
    eventsPaths.push(Object.freeze({
      source: "abg_traced_process_terminal_events",
      eventsPath: path.join(path.dirname(transport.traceResultPath), "events.ndjson")
    }));
  }
  const seenEventsPaths = new Set();
  for (const candidate of eventsPaths) {
    if (seenEventsPaths.has(candidate.eventsPath)) {
      continue;
    }
    seenEventsPaths.add(candidate.eventsPath);
    try {
      const events = parseTraceEvents(await readFile(candidate.eventsPath, "utf8"));
      const timing = traceTiming(events);
      if (timing !== null) {
        return Object.freeze({
          source: candidate.source,
          eventsPath: candidate.eventsPath,
          eventCount: events.length,
          eventKinds: Object.freeze(events.map((event) => event.kind ?? event.type)),
          timing
        });
      }
    } catch {
      // Fall through to the result stream for non-PTY or older trace archives.
    }
  }
  if (typeof transport.traceResultPath !== "string") {
    return null;
  }
  const traceResult = JSON.parse(await readFile(transport.traceResultPath, "utf8"));
  const streamEvents = typeof traceResult.stdout === "string"
    ? parseTraceEvents(traceResult.stdout)
    : [];
  const resultEvent = streamEvents.find((event) => event.type === "result") ?? null;
  const durationMs = Number.isFinite(resultEvent?.duration_ms)
    ? resultEvent.duration_ms
    : null;
  return Object.freeze({
    source: "abg_traced_process_result_stdout",
    resultPath: transport.traceResultPath,
    eventCount: streamEvents.length,
    eventKinds: Object.freeze(streamEvents.map((event) => event.type)),
    timing: durationMs === null
      ? null
      : Object.freeze({
          startedAtEpochMs: null,
          startedAt: null,
          endedAtEpochMs: null,
          endedAt: null,
          durationMs
        }),
    apiDurationMs: Number.isFinite(resultEvent?.duration_api_ms)
      ? resultEvent.duration_api_ms
      : null,
    turns: Number.isInteger(resultEvent?.num_turns)
      ? resultEvent.num_turns
      : null
  });
}

function assetSurface(input) {
  return Object.freeze({
    kind: input.kind,
    requiredContexts: uniq(input.requiredContexts ?? []),
    standardsRefs: uniq(input.standardsRefs ?? []),
    outputContractRefs: uniq(input.outputContractRefs ?? []),
    constructorRefs: uniq(input.constructorRefs ?? []),
    constructorInputAssetKinds: uniq(input.constructorInputAssetKinds ?? []),
    rendererRefs: Object.freeze([]),
    renderedViewDigestPolicyRef: input.renderedViewDigestPolicyRef ?? null,
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
    schemaRef: "schema://odd_glc/software-build/lifecycle-asset",
    typeRef: entry.typeRef,
    markov: entry.markov,
    assetSurface: {
      kind: "lifecycle_asset",
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

const locallyDeclaredTypeRefs = new Set([
  TYPE_REFS.context,
  TYPE_REFS.lifecycleArtifact,
  TYPE_REFS.evidence
]);

const softwareBuildSpecializedTypes = Object.freeze(
  [
    ...ODD_GLC_LIFECYCLE_NODE_TYPES,
    ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
    ...ODD_GLC_DATA_MAPPING_NODE_TYPES
  ]
    .filter((entry) => !locallyDeclaredTypeRefs.has(entry.typeRef))
    .map(nodeTypeFromEntry)
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

const dataMappingBundleNodeContracts = Object.freeze(
  ODD_GLC_DATA_MAPPING_NODE_TYPES.flatMap((entry) => [
    \`contract://\${entry.typeRef}\`,
    \`contract://odd_glc/\${entry.assetKind}\`
  ])
);

function artifactNodeShape() {
  if (TYPE_REFS.artifact === "odd_glc.type.software.data_mapping_implementation_bundle") {
    return Object.freeze({
      schemaRef: "schema://odd_glc/software-build/lifecycle-asset",
      markov: ["declared", "materialized"],
      assetSurface: {
        kind: declared.assetKind,
        requiredContexts: ["context://odd_glc/software-build"],
        outputContractRefs: dataMappingBundleNodeContracts,
        proofObligationRefs: ["proof://odd_glc/software-build/node-type"]
      }
    });
  }
  return Object.freeze({
    schemaRef: "schema://odd_glc/software-build/lifecycle-artifact",
    markov: ["materialized"],
    assetSurface: {
      kind: "target_artifact",
      requiredContexts: ["context://odd_glc/software-build"],
      outputContractRefs: ["contract://odd_glc/lifecycle-artifact"],
      proofObligationRefs: ["proof://odd_glc/software-build/artifact"]
    }
  });
}

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

const nodeTypeGraphFunctions = Object.freeze([
  ...new Map([
    contextType,
    lifecycleArtifactType,
    artifactType,
    evidenceType,
    ...softwareBuildSpecializedTypes
  ].filter(Boolean).map((graphFunction) => [graphFunction.id, graphFunction])).values()
]);

const declaredStageNodeTypes = Object.freeze([
  ...ODD_GLC_LIFECYCLE_NODE_TYPES,
  ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ...ODD_GLC_DATA_MAPPING_NODE_TYPES
]);

function shapeForTypeRef(typeRef) {
  if (typeRef === TYPE_REFS.context) {
    return Object.freeze({
      schemaRef: "schema://odd_glc/software-build/lifecycle-context",
      markov: ["contextualized"],
      assetSurface: {
        kind: "lifecycle_context",
        requiredContexts: ["context://odd_glc/software-build"],
        outputContractRefs: ["contract://odd_glc/lifecycle-context"],
        proofObligationRefs: ["proof://odd_glc/software-build/context"]
      }
    });
  }
  if (typeRef === TYPE_REFS.lifecycleArtifact) {
    return Object.freeze({
      schemaRef: "schema://odd_glc/software-build/lifecycle-artifact",
      markov: ["materialized"],
      assetSurface: {
        kind: "target_artifact",
        requiredContexts: ["context://odd_glc/software-build"],
        outputContractRefs: ["contract://odd_glc/lifecycle-artifact"],
        proofObligationRefs: ["proof://odd_glc/software-build/artifact"]
      }
    });
  }
  if (typeRef === TYPE_REFS.evidence) {
    return Object.freeze({
      schemaRef: "schema://odd_glc/software-build/evidence-binding",
      markov: ["projected"],
      assetSurface: {
        kind: "evidence_binding_view",
        requiredContexts: ["context://odd_glc/software-build"],
        outputContractRefs: ["contract://odd_glc/evidence-binding"],
        proofObligationRefs: ["proof://odd_glc/software-build/evidence"]
      }
    });
  }
  if (typeRef === "odd_glc.type.software.data_mapping_implementation_bundle") {
    return artifactNodeShape();
  }
  const declared = declaredStageNodeTypes.find((entry) => entry.typeRef === typeRef);
  if (declared !== undefined) {
    return Object.freeze({
      schemaRef: "schema://odd_glc/software-build/lifecycle-asset",
      markov: declared.markov,
      assetSurface: {
        kind: "lifecycle_asset",
        requiredContexts: ["context://odd_glc/software-build"],
        outputContractRefs: [
          \`contract://\${typeRef}\`,
          \`contract://odd_glc/\${declared.assetKind ?? "lifecycle_asset"}\`
        ],
        proofObligationRefs: ["proof://odd_glc/software-build/node-type"]
      }
    });
  }
  throw new Error(\`No odd_glc node shape declared for \${typeRef}\`);
}

function admittedNodeForStage(typeRef, name, tags, overrides = {}) {
  const shape = shapeForTypeRef(typeRef);
  const surface = Object.freeze({
    ...shape.assetSurface,
    ...overrides.assetSurface,
    requiredContexts: uniq([
      ...(shape.assetSurface.requiredContexts ?? []),
      ...(overrides.assetSurface?.requiredContexts ?? [])
    ]),
    outputContractRefs: uniq([
      ...(shape.assetSurface.outputContractRefs ?? []),
      ...(overrides.assetSurface?.outputContractRefs ?? [])
    ]),
    constructorInputAssetKinds: uniq([
      ...(shape.assetSurface.constructorInputAssetKinds ?? []),
      ...(overrides.assetSurface?.constructorInputAssetKinds ?? [])
    ]),
    proofObligationRefs: uniq([
      ...(shape.assetSurface.proofObligationRefs ?? []),
      ...(overrides.assetSurface?.proofObligationRefs ?? [])
    ])
  });
  return admittedNode({
    name,
    schemaRef: shape.schemaRef,
    typeRef,
    markov: shape.markov,
    assetSurface: surface,
    tags
  });
}

const stageRows = Object.freeze(STAGE_PLAN.map((stage, index) => {
  const source = admittedNodeForStage(stage.sourceTypeRef, stage.sourceName, ["stage-source", stage.stage]);
  const prerequisiteStageNames = Array.isArray(stage.requiredPriorStages)
    ? stage.requiredPriorStages
    : index === 0
      ? []
      : [STAGE_PLAN[index - 1].stage];
  const constructorInputAssetKinds = prerequisiteStageNames.map((stageName) => {
    const prerequisite = STAGE_PLAN.find((candidate) => candidate.stage === stageName);
    if (prerequisite === undefined) {
      throw new Error("Unknown requiredPriorStages entry for " + stage.stage + ": " + stageName);
    }
    return shapeForTypeRef(prerequisite.targetTypeRef).assetSurface.kind;
  });
  const target = admittedNodeForStage(
    stage.targetTypeRef,
    stage.targetName,
    ["stage-target", stage.stage],
    {
      assetSurface: {
        constructorInputAssetKinds,
        renderedViewDigestPolicyRef: constructorInputAssetKinds.length === 0
          ? null
          : "policy://abg/instruction-causal/excerpt"
      }
    }
  );
  return Object.freeze({ ...stage, index, source, target });
}));

function requiredPriorStageRowsFor(stage) {
  const stageNames = Array.isArray(stage.requiredPriorStages)
    ? stage.requiredPriorStages
    : stage.index === 0
      ? []
      : [STAGE_PLAN[stage.index - 1].stage];
  return Object.freeze(stageNames.map((stageName) => {
    const row = stageRows.find((candidate) => candidate.stage === stageName);
    if (row === undefined) {
      throw new Error("Unknown requiredPriorStages entry for " + stage.stage + ": " + stageName);
    }
    return row;
  }));
}

function requiredInputRefsForStage(stage) {
  return Object.freeze(
    requiredPriorStageRowsFor(stage).map((row) => "prior-stage://" + SCENARIO.key + "/" + row.stage)
  );
}

for (const [node, typeRef] of stageRows.flatMap((stage) => [
  [stage.source, stage.sourceTypeRef],
  [stage.target, stage.targetTypeRef]
])) {
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

const stageGraphFunctions = Object.freeze(stageRows.map((stage) =>
  graphFunctionForVector(
    vector(
      stage.source,
      stage.target,
      stage.vectorId,
      \`software_build_\${stage.stage}\`
    ),
    {
      id: \`graph-function://odd_glc/software-build/internal/\${SCENARIO.key}/\${stage.stage}\`,
      name: \`odd_glc.software_build.\${stage.stage}\`,
      tags: ["odd_glc", "software-build", SCENARIO.key, stage.stage]
    }
  )
));

const composedSoftwareBuild = stageGraphFunctions.slice(1).reduce((composed, graphFunction, index) =>
  composeWithTypeWiring(
    composed,
    graphFunction,
    {
      nodeTypeGraphFunctions,
      wiring: [
        {
          providedNodeName: stageRows[index].targetName,
          requiredNodeName: stageRows[index + 1].sourceName,
          typeRef: stageRows[index + 1].sourceTypeRef
        }
      ]
    }
  ),
  stageGraphFunctions[0]
);

const softwareBuildBootstrap = constructGraphFunction({
  name: "odd_glc.software_build.bootstrap_worksite",
  environment: composedSoftwareBuild.environment,
  inputs: composedSoftwareBuild.inputs,
  outputs: composedSoftwareBuild.outputs,
  template: composedSoftwareBuild.template,
  effects: composedSoftwareBuild.effects,
  declarations: Object.freeze({
    entries: Object.freeze([
      ...composedSoftwareBuild.declarations.entries,
      // 4.5 migration: labelled HoG catalog + ladder as typed GTL —
      // every C call on this run carries a declared programRef; retry
      // escalates lean -> deep (compression descent, CCALL-017).
      Object.freeze({
        key: "abg.hog_program_catalog",
        value: Object.freeze({ kind: "json_blob", value: {
          kind: "array",
          items: [
            { kind: "object", entries: [
              { key: "syntaxVersion", value: "hog-syntax/1" },
              { key: "programRef", value: "gtl://odd_glc/software-build/hog/lean" },
              { key: "proportionalityClass", value: "P1" },
              { key: "stages", value: { kind: "array", items: [
                { kind: "object", entries: [
                  { key: "stageRole", value: "transform" },
                  { key: "defaultRegime", value: "F_P" },
                  { key: "armId", value: "arm://odd_glc/software-build/lean/transform" },
                  { key: "resultBearing", value: true }
                ] },
                { kind: "object", entries: [
                  { key: "stageRole", value: "evaluate" },
                  { key: "defaultRegime", value: "F_P" },
                  { key: "armId", value: "arm://odd_glc/software-build/lean/evaluate" },
                  { key: "resultBearing", value: false }
                ] },
                { kind: "object", entries: [
                  { key: "stageRole", value: "consequence" },
                  { key: "defaultRegime", value: "F_D" },
                  { key: "armId", value: "arm://odd_glc/software-build/lean/consequence" },
                  { key: "resultBearing", value: false }
                ] }
              ] } }
            ] },
            { kind: "object", entries: [
              { key: "syntaxVersion", value: "hog-syntax/1" },
              { key: "programRef", value: "gtl://odd_glc/software-build/hog/deep" },
              { key: "proportionalityClass", value: "P2" },
              { key: "stages", value: { kind: "array", items: [
                { kind: "object", entries: [
                  { key: "stageRole", value: "transform" },
                  { key: "defaultRegime", value: "F_P" },
                  { key: "armId", value: "arm://odd_glc/software-build/deep/transform" },
                  { key: "resultBearing", value: true }
                ] },
                { kind: "object", entries: [
                  { key: "stageRole", value: "evaluate" },
                  { key: "defaultRegime", value: "F_P" },
                  { key: "armId", value: "arm://odd_glc/software-build/deep/evaluate" },
                  { key: "resultBearing", value: false }
                ] },
                { kind: "object", entries: [
                  { key: "stageRole", value: "consequence" },
                  { key: "defaultRegime", value: "F_D" },
                  { key: "armId", value: "arm://odd_glc/software-build/deep/consequence" },
                  { key: "resultBearing", value: false }
                ] }
              ] } }
            ] }
          ]
        } })
      }),
      Object.freeze({
        key: "abg.consequence.allowed_traversal_families",
        value: Object.freeze({
          kind: "string_list",
          value: Object.freeze(["depth_traversal"])
        })
      }),
      Object.freeze({
        key: "abg.hog_program_ladder",
        value: Object.freeze({ kind: "json_blob", value: {
          kind: "array",
          items: [
            { kind: "object", entries: [
              { key: "programRef", value: "gtl://odd_glc/software-build/hog/lean" },
              { key: "fromAttempt", value: 1 }
            ] },
            { kind: "object", entries: [
              { key: "programRef", value: "gtl://odd_glc/software-build/hog/deep" },
              { key: "fromAttempt", value: 2 }
            ] }
          ]
        } })
      })
    ])
  }),
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
    provenanceRefs: [ABI_PROVENANCE_REF],
    readinessRefs: ["readiness://odd_glc/software-build/node-type-declared"],
    proofRefs: ["proof://odd_glc/negative-boundary"],
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
      ? [OVERLAY_REF, "software-build.role.scenario_surface"]
      : typeRef === TYPE_REFS.evidence
        ? [OVERLAY_REF, "software-build.role.test_execution"]
        : [OVERLAY_REF, "software-build.role.generated_artifact"];
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
    provenanceRefs: [ABI_PROVENANCE_REF],
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

function isAssessmentObject(value) {
  return value !== null &&
    typeof value === "object" &&
    typeof value.accepted === "boolean" &&
    typeof value.stage === "string" &&
    typeof value.evidenceAccepted === "boolean" &&
    Array.isArray(value.nodeTypesUsed) &&
    Array.isArray(value.files) &&
    typeof value.reason === "string";
}

function parseAssessmentJson(candidate) {
  try {
    const parsed = JSON.parse(candidate.trim());
    return isAssessmentObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isReviewObject(value) {
  return value !== null &&
    typeof value === "object" &&
    typeof value.reviewAccepted === "boolean" &&
    typeof value.closeDisposition === "string" &&
    typeof value.evidenceAccepted === "boolean" &&
    typeof value.reason === "string";
}

function parseReviewJson(candidate) {
  try {
    const parsed = JSON.parse(candidate.trim());
    return isReviewObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function balancedObjectSliceAt(text, start) {
  let depth = 0;
  let inString = false;
  let escaping = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (char === "\\\\") {
        escaping = true;
      } else if (char === "\\\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\\\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }
  return null;
}

function extractJsonObject(text, parseCandidate = parseAssessmentJson, failureLabel = "GLC live worker did not return parseable assessment JSON") {
  const trimmed = text.trim();
  const fence = String.fromCharCode(96, 96, 96);
  let searchIndex = 0;
  while (searchIndex < trimmed.length) {
    const fenceStart = trimmed.indexOf(fence, searchIndex);
    if (fenceStart < 0) {
      break;
    }
    const lineEnd = trimmed.indexOf("\\n", fenceStart + fence.length);
    const bodyStart = lineEnd < 0 ? fenceStart + fence.length : lineEnd + 1;
    const fenceEnd = trimmed.indexOf(fence, bodyStart);
    if (fenceEnd < 0) {
      break;
    }
    const parsed = parseCandidate(trimmed.slice(bodyStart, fenceEnd));
    if (parsed !== null) {
      return parsed;
    }
    searchIndex = fenceEnd + fence.length;
  }

  for (let index = 0; index < trimmed.length; index += 1) {
    if (trimmed[index] !== "{") {
      continue;
    }
    const candidate = balancedObjectSliceAt(trimmed, index);
    if (candidate === null) {
      continue;
    }
    const parsed = parseCandidate(candidate);
    if (parsed !== null) {
      return parsed;
    }
  }

  throw new Error(\`\${failureLabel}: \${trimmed.slice(0, 240)}\`);
}

async function writeText(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content ?? "", "utf8");
}

const MATERIALIZED_FILE_SUMMARY_MAX_CHARS = 12000;

function truncateForPrompt(text, maxChars = MATERIALIZED_FILE_SUMMARY_MAX_CHARS) {
  return text.length <= maxChars
    ? text
    : text.slice(0, maxChars) + "\\n...[truncated]";
}

async function summarizeMaterializedFiles(workspaceRoot, filePaths) {
  const summaries = [];
  for (const filePath of filePaths) {
    const content = await readFile(filePath, "utf8");
    summaries.push(Object.freeze({
      path: path.relative(workspaceRoot, filePath),
      sha256: sha256Text(content),
      byteLength: Buffer.byteLength(content ?? "", "utf8"),
      lineCount: content.length === 0 ? 0 : content.split("\\n").length,
      contentPreview: truncateForPrompt(content)
    }));
  }
  return Object.freeze(summaries);
}

function validatedPlanEnv(plan) {
  if (plan.env === undefined) {
    return Object.freeze({});
  }
  if (plan.env === null || typeof plan.env !== "object" || Array.isArray(plan.env)) {
    throw new Error("Execution plan env must be an object when present: " + JSON.stringify(plan.env));
  }
  const entries = Object.entries(plan.env);
  for (const [key, value] of entries) {
    if (typeof key !== "string" || key.length === 0 || typeof value !== "string") {
      throw new Error("Execution plan env entries must be string:string: " + JSON.stringify(plan.env));
    }
  }
  return Object.freeze(Object.fromEntries(entries));
}

// PURE (unit lane): Campaign bug #10/#10b — plan env values are
// TEMPLATES; \${VAR} references expand against the provided base env
// (JSON carries no shell expansion; a literal "\${PATH}" made sbt
// unfindable and the SBT gate silent).
export function expandEnvTemplates(envOverrides, baseEnv) {
  const expanded = {};
  for (const [key, value] of Object.entries(envOverrides ?? {})) {
    expanded[key] = typeof value === "string"
      ? value.replace(/\\$\\{([A-Za-z_][A-Za-z0-9_]*)\\}/g, (m, name) => baseEnv[name] ?? "")
      : value;
  }
  return expanded;
}

function runSync(command, args, cwd, envOverrides = Object.freeze({})) {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  Object.assign(env, expandEnvTemplates(envOverrides, env));
  // Campaign bug #11: spawnSync's 1MB default maxBuffer truncates
  // long-running tool output (ENOBUFS -> status null, empty stdout);
  // execution evidence needs the WHOLE stream, and a spawn-level error
  // must be visible evidence, never a silent null.
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env,
    maxBuffer: 64 * 1024 * 1024
  });
  return Object.freeze({
    command,
    args,
    cwd,
    envOverrides,
    status: result.status,
    signal: result.signal ?? null,
    error: result.error === undefined ? null : String(result.error),
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

function nodeTestPassCount(stdout) {
  const match = stdout.match(/(?:^|\\n)\\u2139 pass (\\d+)(?:\\n|$)/u);
  if (match === null) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

async function xmlTestReportPassCount(cwd, reportPaths) {
  let observedPassCount = 0;
  const reports = [];
  for (const reportPath of reportPaths) {
    if (typeof reportPath !== "string" || reportPath.length === 0) {
      throw new Error("Malformed expectedTestReportPaths entry: " + JSON.stringify(reportPath));
    }
    const absolutePath = path.resolve(cwd, reportPath);
    if (absolutePath !== cwd && !absolutePath.startsWith(cwd + path.sep)) {
      throw new Error("Test report path escapes execution cwd: " + reportPath);
    }
    let contents;
    try {
      contents = await readFile(absolutePath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      reports.push(Object.freeze({
        reportPath,
        missing: true,
        tests: 0,
        failures: 0,
        errors: 0,
        skipped: 0
      }));
      continue;
    }
    // review B MEDIUM-2: SUM across every testsuite block in the file —
    // a failing second suite must not hide behind a clean first match
    const sumAttr = (name) =>
      [...contents.matchAll(new RegExp("\\\\s" + name + '="(\\\\d+)"', "gu"))]
        .reduce((total, match) => total + Number.parseInt(match[1], 10), 0);
    const tests = sumAttr("tests");
    const failures = sumAttr("failures");
    const errors = sumAttr("errors");
    const skipped = sumAttr("skipped");
    if (failures === 0 && errors === 0) {
      observedPassCount += Math.max(0, tests - skipped);
    }
    reports.push(Object.freeze({ reportPath, missing: false, tests, failures, errors, skipped }));
  }
  return Object.freeze({ observedPassCount, reports: Object.freeze(reports) });
}

async function expectedPassCountFromExecutionPlan(workspaceRoot, fallback) {
  const planPath = path.join(workspaceRoot, "test-execution-plan.json");
  try {
    const plan = JSON.parse(await readFile(planPath, "utf8"));
    if (Number.isInteger(plan.expectedTestPassCount) && plan.expectedTestPassCount >= 0) {
      return plan.expectedTestPassCount;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  return fallback;
}

async function executionPlanFor(workspaceRoot) {
  try {
    return JSON.parse(await readFile(path.join(workspaceRoot, "test-execution-plan.json"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function commandFromPlan(command) {
  if (command === "node") {
    return process.execPath;
  }
  return command;
}

// PURE (unit lane): the plan reader's shape family — nested
// testExecution envelope + argv-array normalization + typed rejection.
export function normalizeExecutionPlanShape(planInput) {
  let plan = planInput;
  if (plan === null || typeof plan !== "object") {
    return Object.freeze({ plan: null, issue: "missing_plan" });
  }
  // T-031 BUG #3 (#14 family): workers lawfully vary the envelope key —
  // run-3 nested the invocation under "execution" and every v21 retry
  // re-read the same durable artifact into the same rejection. The
  // envelope FAMILY is {testExecution|execution|plan}: one object whose
  // command/args spread over the outer plan.
  for (const envelopeKey of ["testExecution", "execution", "plan"]) {
    const envelope = plan[envelopeKey];
    if (envelope !== null && typeof envelope === "object" && !Array.isArray(envelope)) {
      plan = Object.freeze({ ...plan, ...envelope });
    }
  }
  if (
    Array.isArray(plan.command) &&
    plan.command.length > 0 &&
    plan.command.every((part) => typeof part === "string") &&
    plan.args === undefined
  ) {
    plan = Object.freeze({
      ...plan,
      command: plan.command[0],
      args: plan.command.slice(1)
    });
  }
  if (typeof plan.command !== "string" || !Array.isArray(plan.args)) {
    return Object.freeze({
      plan: null,
      issue:
        "Malformed execution plan: command must be a string and args an array of strings. " +
        "Re-emit test-execution-plan.json per the stage contract with " +
        '{"command":"sbt","args":["test"],...} shape. Got: ' +
        JSON.stringify({ command: plan.command, args: plan.args }).slice(0, 200)
    });
  }
  return Object.freeze({ plan, issue: null });
}

// T-209 D3 (execution-default law): the framework EXECUTES NOTHING.
// The worker runs the declared toolchain inside its own turn and writes
// test-execution-result.json — its typed execution claim. This function
// is F_D verification over materialized evidence only: it reads the
// worker's result file and cross-checks the XML test reports ON DISK
// (existence, failures, counts — mechanical file reads, no spawning).
// The worker-claimed exit status is a stated residual until the
// substrate's typed execution-result payload carries it (Stage C/D).
export async function executionResultFor(workspaceRoot) {
  try {
    return JSON.parse(await readFile(path.join(workspaceRoot, "test-execution-result.json"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function executePlannedScenario(workspaceRoot) {
  const normalized = normalizeExecutionPlanShape(await executionResultFor(workspaceRoot));
  if (normalized.issue === "missing_plan") {
    throw new Error("Missing test-execution-result.json: the worker must RUN the declared command in its turn and record the typed result (execution-default law; the framework does not execute)");
  }
  if (normalized.issue !== null) {
    throw new Error(normalized.issue);
  }
  const plan = normalized.plan;
  const cwd = typeof plan.cwd === "string" && plan.cwd.length > 0
    ? path.resolve(workspaceRoot, plan.cwd)
    : workspaceRoot;
  if (cwd !== workspaceRoot && !cwd.startsWith(workspaceRoot + path.sep)) {
    throw new Error("Execution result cwd escapes workspace: " + plan.cwd);
  }
  const claimedStatus = Number.isInteger(plan.status) ? plan.status : null;
  if (claimedStatus === null) {
    throw new Error("Execution result must record the integer exit status the worker observed");
  }
  // worker-reported env is evidence, not authority (review B HIGH-1 fix:
  // this binding was previously undeclared and the function could not run)
  const envOverrides = plan.env !== null && typeof plan.env === "object" && !Array.isArray(plan.env)
    ? Object.freeze({ ...plan.env })
    : Object.freeze({});
  const result = Object.freeze({
    command: plan.command,
    args: plan.args,
    cwd,
    status: claimedStatus,
    stdout: typeof plan.stdout === "string" ? plan.stdout : "",
    stderr: typeof plan.stderr === "string" ? plan.stderr : "",
    workerExecuted: true
  });
  // review B MEDIUM-1: expectations are SCENARIO CONTRACT data where the
  // scenario declares them — the worker cannot choose its own bar. The
  // worker's declared values are accepted only when the scenario is
  // silent (legacy planned lanes).
  const expectedTestReportPaths = Array.isArray(SCENARIO.expectedTestReportPaths)
    ? SCENARIO.expectedTestReportPaths
    : Array.isArray(plan.expectedTestReportPaths)
      ? plan.expectedTestReportPaths
      : [];
  const reportPassCounts = expectedTestReportPaths.length > 0
    ? await xmlTestReportPassCount(cwd, expectedTestReportPaths)
    : null;
  const observedPassCount = reportPassCounts === null
    ? nodeTestPassCount(result.stdout)
    : reportPassCounts.observedPassCount;
  const contractPassCount = Number.isInteger(SCENARIO.expectedTestPassCount)
    ? SCENARIO.expectedTestPassCount
    : null;
  if (contractPassCount === null && (!Number.isInteger(plan.expectedTestPassCount) || plan.expectedTestPassCount < 0)) {
    throw new Error("Execution result must declare a non-negative integer expectedTestPassCount: " + JSON.stringify(plan));
  }
  const expectedPassCount = contractPassCount ?? plan.expectedTestPassCount;
  const expectedStdout = typeof plan.expectedStdout === "string"
    ? plan.expectedStdout
    : null;
  const expectedStdoutMatch = Array.isArray(plan.expectedStdoutMatch)
    ? plan.expectedStdoutMatch
    : typeof plan.expectedStdoutMatch === "string"
      ? [plan.expectedStdoutMatch]
      : [];
  const passCountSatisfied =
    Number.isInteger(observedPassCount) && observedPassCount >= expectedPassCount;
  const stdoutSatisfied = expectedStdout === null || result.stdout === expectedStdout;
  const stdoutMatchSatisfied = expectedStdoutMatch.every((fragment) =>
    typeof fragment === "string" && result.stdout.includes(fragment)
  );
  const testReports = reportPassCounts?.reports ?? [];
  const missingReportPaths = testReports
    .filter((report) => report.missing === true)
    .map((report) => report.reportPath);
  const failingReportPaths = testReports
    .filter((report) => report.missing !== true && (report.failures !== 0 || report.errors !== 0))
    .map((report) => report.reportPath);
  const reportPathsSatisfied = missingReportPaths.length === 0 && failingReportPaths.length === 0;
  const planSatisfied =
    result.status === 0 &&
    passCountSatisfied &&
    stdoutSatisfied &&
    stdoutMatchSatisfied &&
    reportPathsSatisfied;
  return Object.freeze({
    kind: SCENARIO.kind,
    stdout: expectedStdout ?? result.stdout,
    commands: [result],
    planSatisfied,
    expectedTestPassCount: expectedPassCount,
    observedTestPassCount: observedPassCount,
    envOverrides,
    expectedStdoutMatch: Object.freeze(expectedStdoutMatch),
    expectedTestReportPaths: Object.freeze(expectedTestReportPaths),
    testReports: Object.freeze(testReports),
    missingReportPaths: Object.freeze(missingReportPaths),
    failingReportPaths: Object.freeze(failingReportPaths),
    executionIssues: Object.freeze([
      ...(result.status === 0 ? [] : ["command exited " + result.status]),
      ...(passCountSatisfied ? [] : ["observed pass count " + observedPassCount + " was below minimum expected " + expectedPassCount]),
      ...(stdoutSatisfied ? [] : ["stdout did not equal expected stdout"]),
      ...(stdoutMatchSatisfied ? [] : ["stdout did not contain every expected fragment"]),
      ...(reportPathsSatisfied ? [] : [
        ...missingReportPaths.map((reportPath) => "missing test report " + reportPath),
        ...failingReportPaths.map((reportPath) => "failing test report " + reportPath)
      ])
    ]),
    assertedReturnValue: plan.assertedReturnValue ?? EXPECTED_ASSERTED_RETURN_VALUE
  });
}

async function materializeScenario(workspaceRoot) {
  for (const [relativePath, contents] of SCENARIO.files) {
    await writeText(path.join(workspaceRoot, relativePath), contents);
  }
  return Object.freeze(SCENARIO.files.map(([relativePath]) => path.join(workspaceRoot, relativePath)));
}

async function materializeAssessmentFiles(workspaceRoot, stageSpec, assessment) {
  const issues = [];
  if (!Array.isArray(stageSpec.filesToProduce) || stageSpec.filesToProduce.length === 0) {
    return Object.freeze({ written: Object.freeze([]), issues: Object.freeze([]) });
  }
  if (!Array.isArray(assessment.files)) {
    return Object.freeze({
      written: Object.freeze([]),
      issues: Object.freeze([\`GLC live worker did not return files for stage \${stageSpec.stage}\`])
    });
  }
  const allowed = new Set(stageSpec.filesToProduce);
  const seen = new Set();
  const written = [];
  for (const file of assessment.files) {
    const content = Array.isArray(file?.contentLines)
      ? file.contentLines.join("\\n") + "\\n"
      : file?.content;
    if (
      file === null ||
      typeof file !== "object" ||
      typeof file.path !== "string" ||
      typeof content !== "string"
    ) {
      issues.push(\`Malformed file payload for stage \${stageSpec.stage}: \${JSON.stringify(file)}\`);
      continue;
    }
    if (!allowed.has(file.path)) {
      issues.push(\`Unexpected file path for stage \${stageSpec.stage}: \${file.path}\`);
      continue;
    }
    seen.add(file.path);
    const absolutePath = path.resolve(workspaceRoot, file.path);
    if (absolutePath !== workspaceRoot && !absolutePath.startsWith(\`\${workspaceRoot}\${path.sep}\`)) {
      issues.push(\`Refusing to write outside workspace: \${file.path}\`);
      continue;
    }
    await writeText(absolutePath, content);
    written.push(absolutePath);
  }
  for (const required of allowed) {
    if (!seen.has(required)) {
      issues.push(\`Missing required file for stage \${stageSpec.stage}: \${required}\`);
    }
  }
  return Object.freeze({
    written: Object.freeze(written),
    issues: Object.freeze(issues)
  });
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

// P1b (T-030 no-plugin-closure-state): re-entry pressure and budget are
// DURABLE WORKSPACE TRUTH (one observed-state file), not plugin closure
// state — a resume reads the same truth the crashed process wrote.
function repairReentryStatePath(workspaceRoot) {
  return path.join(workspaceRoot, ".ai-workspace", "glc-software-build-live", "repair-reentry-state.json");
}
export function readRepairReentryState(workspaceRoot) {
  const statePath = repairReentryStatePath(workspaceRoot);
  if (!existsSync(statePath)) {
    return Object.freeze({ pressure: null, reentryCount: 0 });
  }
  try {
    const raw = JSON.parse(readFileSync(statePath, "utf8"));
    return Object.freeze({
      pressure:
        raw.pressure !== null && typeof raw.pressure === "object" &&
        Number.isSafeInteger(raw.pressure.vectorIndex)
          ? Object.freeze({
              vectorIndex: raw.pressure.vectorIndex,
              reason: String(raw.pressure.reason ?? "")
            })
          : null,
      reentryCount: Number.isSafeInteger(raw.reentryCount) ? raw.reentryCount : 0
    });
  } catch {
    return Object.freeze({ pressure: null, reentryCount: 0 });
  }
}
export function writeRepairReentryState(workspaceRoot, state) {
  const statePath = repairReentryStatePath(workspaceRoot);
  mkdirSync(path.dirname(statePath), { recursive: true });
  writeFileSync(statePath, JSON.stringify(state, null, 2) + "\\n", "utf8");
}

async function executeScenario(workspaceRoot) {
  if (SCENARIO.executeFromPlan === true) {
    return executePlannedScenario(workspaceRoot);
  }
  if (SCENARIO.kind === "node_cli") {
    const result = runSync(process.execPath, ["generated/hello-world.mjs"], workspaceRoot);
    if (result.status !== 0 || result.stdout !== "Hello, world!\\n") {
      throw new Error(\`node_cli failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({ kind: SCENARIO.kind, stdout: result.stdout, commands: [result] });
  }
  if (SCENARIO.kind === "node_test") {
    const result = runSync(process.execPath, ["--test", "test/hello.test.mjs"], workspaceRoot);
    if (result.status !== 0 || nodeTestPassCount(result.stdout) !== 1) {
      throw new Error(\`node_test failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({ kind: SCENARIO.kind, stdout: "Hello, world!\\n", commands: [result] });
  }
  if (SCENARIO.kind === "framework_smoke_min_fp_node_test" || SCENARIO.kind === "sdlc_js_full_node_test") {
    const args = SCENARIO.kind === "sdlc_js_full_node_test"
      ? ["--test", "test/component/hello.test.mjs", "test/uat/hello.uat.test.mjs"]
      : ["--test", "test/hello.test.mjs"];
    const result = runSync(process.execPath, args, workspaceRoot);
    const plan = await executionPlanFor(workspaceRoot);
    const expectedPassCount = Number.isInteger(plan?.expectedTestPassCount)
      ? plan.expectedTestPassCount
      : await expectedPassCountFromExecutionPlan(workspaceRoot, SCENARIO.kind === "sdlc_js_full_node_test" ? 2 : 1);
    const observedPassCount = nodeTestPassCount(result.stdout);
    if (result.status !== 0 || observedPassCount !== expectedPassCount) {
      throw new Error(\`\${SCENARIO.kind} failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({
      kind: SCENARIO.kind,
      stdout: result.stdout,
      commands: [result],
      planSatisfied: true,
      expectedTestPassCount: expectedPassCount,
      observedTestPassCount: observedPassCount,
      expectedStdoutMatch: Object.freeze(
        Array.isArray(plan?.expectedStdoutMatch)
          ? plan.expectedStdoutMatch
          : typeof plan?.expectedStdoutMatch === "string"
            ? [plan.expectedStdoutMatch]
            : []
      ),
      assertedReturnValue: plan?.assertedReturnValue ?? EXPECTED_ASSERTED_RETURN_VALUE
    });
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
  if (SCENARIO.kind === "data_mapper_lite_node_test") {
    const result = runSync(process.execPath, ["--test", "test/logical-data-model.test.mjs"], workspaceRoot);
    const observedPassCount = nodeTestPassCount(result.stdout);
    if (result.status !== 0 || observedPassCount !== 3) {
      throw new Error(\`data_mapper_lite_node_test failed: \${JSON.stringify(result)}\`);
    }
    return Object.freeze({
      kind: SCENARIO.kind,
      stdout: EXPECTED_STDOUT,
      commands: [result],
      observedTestPassCount: observedPassCount
    });
  }
  throw new Error(\`Unknown scenario kind \${SCENARIO.kind}\`);
}

function evidenceSummaryFor(input) {
  return Object.freeze({
    stage: input.expectedStage,
    materializedFileCount: input.materializedFiles.length,
    materializedFiles: input.materializedFiles.map((filePath) => path.relative(input.workspaceRoot, filePath)),
    executionStatus: input.execution === null ? null : input.execution.commands.map((command) => command.status),
    planSatisfied: input.execution?.planSatisfied ?? null,
    expectedTestPassCount: input.execution?.expectedTestPassCount ?? null,
    observedStdoutSha256: input.execution === null ? null : sha256Text(input.execution.stdout),
    observedStdoutPreview: input.execution === null ? null : (input.execution.stdout ?? "").slice(0, 120),
    clientStatus: input.execution?.clientRequest?.status ?? null,
    observedTestPassCount: input.execution?.observedTestPassCount ?? null,
    envOverrides: input.execution?.envOverrides ?? null,
    assertedReturnValue: input.execution?.assertedReturnValue ?? null
  });
}

function deterministicExecutionAssessmentFor(input) {
  const execution = input.execution;
  if (execution === null) {
    throw new Error("deterministic execution assessment requires observed execution evidence");
  }
  const commandStatuses = execution.commands.map((command) => command.status);
  const issues = Array.isArray(execution.executionIssues)
    ? execution.executionIssues
      : [];
  const repairedExecutionStage = input.expectedStage === "derive_repaired_test_execution_result_surface";
  const repairedEnvSatisfied = repairedExecutionStage !== true ||
    execution.envOverrides?.JAVA_HOME === ${JSON.stringify(DATA_MAPPER_SCALA_JAVA11_HOME)};
  const accepted =
    commandStatuses.length > 0 &&
    commandStatuses.every((status) => Number.isInteger(status) || status === null) &&
    typeof execution.planSatisfied === "boolean" &&
    Number.isInteger(execution.observedTestPassCount) &&
    Number.isInteger(execution.expectedTestPassCount) &&
    Array.isArray(execution.expectedTestReportPaths) &&
    repairedEnvSatisfied;
  return Object.freeze({
    accepted,
    stage: input.expectedStage,
    evidenceAccepted: accepted,
    nodeTypesUsed: Object.freeze(input.expectedNodeTypes),
    files: Object.freeze([]),
    reason: accepted
      ? [
          execution.planSatisfied === true
            ? "F_D execution assessment accepted passing subject execution evidence."
            : "F_D execution assessment accepted failing subject execution evidence for downstream qualification and repair.",
          "Command statuses: " + JSON.stringify(commandStatuses) + ".",
          "observedTestPassCount=" + String(execution.observedTestPassCount) + ".",
	          "expectedTestPassCount=" + String(execution.expectedTestPassCount) + ".",
	          "planSatisfied=" + String(execution.planSatisfied) + ".",
	          "envOverrides=" + JSON.stringify(execution.envOverrides ?? {}) + ".",
	          "issues=" + JSON.stringify(issues) + "."
	        ].join(" ")
	      : [
	          "F_D execution assessment blocked malformed subject execution evidence.",
	          "Command statuses: " + JSON.stringify(commandStatuses) + ".",
	          "observedTestPassCount=" + String(execution.observedTestPassCount) + ".",
	          "expectedTestPassCount=" + String(execution.expectedTestPassCount) + ".",
	          "planSatisfied=" + String(execution.planSatisfied) + ".",
	          "envOverrides=" + JSON.stringify(execution.envOverrides ?? {}) + ".",
	          repairedEnvSatisfied !== true
	            ? "repaired execution result requires JAVA_HOME=" + ${JSON.stringify(DATA_MAPPER_SCALA_JAVA11_HOME)} + "."
	            : "",
	          "issues=" + JSON.stringify(issues) + "."
	        ].filter((part) => typeof part === "string" && part.length > 0).join(" ")
  });
}

function deterministicExecutionTransportFor(input) {
  return Object.freeze({
    status: input.accepted ? 0 : 1,
    command: "abg-fd-execution-assessment",
    executorProfile: "deterministic-fd",
    terminalSessionId: null,
    traceResultPath: null,
    outputPath: null,
    structuredEventCount: 0,
    apiRetryCount: 0,
    toolCallCount: 0,
    failureClass: input.accepted ? null : "execution_evidence_rejected"
  });
}

function runtimeFailureArtifactForTransport(transport, label, failureClassOverride) {
  return Object.freeze({
    kind: "runtime_failure",
    failureClass: failureClassOverride ?? transport.failureClass ?? "runtime_failure",
    detail: [
      "ABG-called live F_P transport failed",
      "label=" + label,
      "status=" + String(transport.status),
      "failureClass=" + (transport.failureClass ?? "none"),
      "toolCallCount=" + String(transport.toolCallCount),
      "outputPath=" + transport.outputPath,
      "traceResultPath=" + (transport.traceResultPath ?? "none")
    ].join(" ")
  });
}

function evaluatorTransportFailureOutcome(pluginInput, transport, label) {
  const reason = [
    "live fp evaluator transport failed",
    "label=" + label,
    "status=" + String(transport.status),
    "failureClass=" + (transport.failureClass ?? "none"),
    "toolCallCount=" + String(transport.toolCallCount)
  ].join(" ");
  const evidenceRefs = [
    pluginInput.sourceProjectionRef,
    "evidence://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator-transport-failure"
  ];
  return constructFpEvaluationOutcome({
    status: "evaluated",
    ambiguityStatus: "partial",
    findings: [
      constructFpEvaluationFinding({
        findingRef: "finding://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator-transport/" + sha256Text(reason),
        evaluatorRef: "plugin://odd_glc/software-build/live-fp-evaluator",
        gainReportRef: "gain://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator-transport",
        metricRefs: [
          "metric://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator/transport-failure"
        ],
        closeDisposition: "retry",
        residualPressureRefs: [
          "residual://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator-transport"
        ],
        continuationRefs: [
          "continuation://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/retry"
        ],
        evidenceRefs,
        authorityRefs: [
          "authority://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator",
          ...pluginInput.expectedAssessmentIds
        ],
        compositionContributionRef: pluginInput.selectedRegimeBindingRef ?? pluginInput.selectedCompositionRef,
        compositionRef: pluginInput.selectedCompositionRef,
        compositionDigest: pluginInput.selectedCompositionDigest,
        diagnosticRefs: [
          "diagnostic://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator-transport"
        ],
        executiveDisposition: "local_repair"
      })
    ],
    evidenceRefs,
    diagnosticRefs: [
      "diagnostic://odd_glc/software-build/" + SCENARIO.key + "/" + String(pluginInput.vectorIndex) + "/live-evaluator-transport"
    ],
    reason
  });
}

function attemptSuffixFor(pluginInput) {
  const attemptIndex = pluginInput.actorInvocationRef?.attemptIndex ?? 1;
  return attemptIndex > 1 ? "-attempt-" + String(attemptIndex) : "";
}

async function writeAttemptAndLatestJson(runRoot, baseLabel, attemptLabel, suffix, value) {
  const serialized = JSON.stringify(value ?? { absent: true }, null, 2) + "\\n";
  const attemptPath = path.join(runRoot, attemptLabel + "-" + suffix + ".json");
  await writeText(attemptPath, serialized);
  if (attemptLabel !== baseLabel) {
    await writeText(path.join(runRoot, baseLabel + "-" + suffix + ".json"), serialized);
  }
}

async function writeAttemptAndLatestText(runRoot, baseLabel, attemptLabel, suffix, value) {
  const safeValue = value ?? "";
  const attemptPath = path.join(runRoot, attemptLabel + "-" + suffix);
  await writeText(attemptPath, safeValue);
  if (attemptLabel !== baseLabel) {
    await writeText(path.join(runRoot, baseLabel + "-" + suffix), safeValue);
  }
}

// PURE (unit lane): BLOCK-level compile-error attribution — scalac
// emits one file-bearing line then pathless continuation lines;
// continuations inherit the current block's attribution (#18/#18b).
export function attributeCompileErrorLines(errorLines) {
  let currentAttribution = "unattributed";
  const mainSourceErrors = [];
  const testSurfaceErrors = [];
  for (const line of errorLines) {
    if (line.includes("/src/main/")) currentAttribution = "main";
    else if (line.includes("/src/test/")) currentAttribution = "test";
    if (currentAttribution === "main") mainSourceErrors.push(line);
    else testSurfaceErrors.push(line);
  }
  return Object.freeze({
    mainSourceErrors: Object.freeze(mainSourceErrors),
    testSurfaceErrors: Object.freeze(testSurfaceErrors)
  });
}

// PURE (unit lane): the re-entry target row, name-derived (F1).
export function resolveRepairReentryTargetRow() {
  const index = stageRows.findIndex((row) => row.stage === "derive_code_surface");
  const row = stageRows[index];
  if (
    index < 0 ||
    row === undefined ||
    typeof row.sourceName !== "string" ||
    typeof row.targetName !== "string" ||
    typeof row.vectorId !== "string"
  ) {
    return null;
  }
  return Object.freeze({ index, row });
}

function deterministicPostMaterializationValidationForStage(input) {
  // T-209 D3 (governance ruling 2026-07-09): the framework compile gate
  // is RETIRED — it spawned sbt Test/compile from the binding, which is
  // execution wearing an F_D badge. The compile obligation moved into
  // the WORKER'S turn (the test-surface stage instructions require the
  // worker to run sbt Test/compile itself and report truthfully); the
  // pure attribution surfaces (compileErrorLines,
  // attributeCompileErrorLines) remain exported for evaluator use over
  // worker-reported output.
  void input;
  return null;
}

function scalaTestClassSummariesFromAssessment(assessment) {
  if (!Array.isArray(assessment?.files)) {
    return Object.freeze([]);
  }
  return Object.freeze(assessment.files
    .map((file) => {
      const content = Array.isArray(file?.contentLines)
        ? file.contentLines.join("\\n")
        : "";
      const classNames = [...content.matchAll(/\b(?:final\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)\b/gu)]
        .map((match) => match[1]);
      return Object.freeze({
        path: file?.path,
        classNames: Object.freeze(classNames)
      });
    })
    .filter((entry) => typeof entry.path === "string" && entry.classNames.length > 0));
}

function candidateEvidenceSummaryFor(input) {
  const post = input.postMaterializationValidation;
  return Object.freeze({
    kind: "candidate_evidence_summary",
    authority: "ABG-called plugin candidate evidence summary; ABG remains the only traversal, event, closure, and replay authority.",
    stage: input.expectedStage,
    vectorIndex: input.vectorIndex,
    materializedFileCount: input.materializedFileSummaries.length,
    materializedFiles: Object.freeze(input.materializedFileSummaries.map((file) => Object.freeze({
      path: file.path,
      sha256: file.sha256,
      byteLength: file.byteLength,
      lineCount: file.lineCount
    }))),
    scalaTestClasses: scalaTestClassSummariesFromAssessment(input.assessment),
    materializationIssues: Object.freeze(input.materializationIssues),
    postMaterializationValidation: post === null
      ? null
      : Object.freeze({
          kind: post.kind,
          stage: post.stage,
          authority: post.authority,
          command: post.command,
          args: Object.freeze(post.args),
          cwd: path.relative(input.workspaceRoot, post.cwd),
          status: post.status,
          accepted: post.accepted,
          stdoutSha256: sha256Text(post.stdout ?? ""),
          stderrSha256: sha256Text(post.stderr ?? ""),
          stdoutExcerpt: truncateForPrompt(post.stdout ?? "", 2400),
          stderrExcerpt: truncateForPrompt(post.stderr ?? "", 1200),
          issues: Object.freeze([
            ...(post.stdout === undefined || post.stdout === null
              ? ["post-materialization stdout was not captured (spawn error path)"]
              : []),
            ...(post.error === undefined ? [] : [\`spawn error: \${String(post.error)}\`]),
            ...post.issues
          ])
        })
  });
}

function compileErrorLines(stdout) {
  // P2a (codex): NO cap here — the attribution DECISION must see every
  // error line (a test-source error after line 16 must still block);
  // excerpt caps apply only where issue text is assembled.
  return stdout
    .split(String.fromCharCode(10))
    .map((line) => line.endsWith(String.fromCharCode(13)) ? line.slice(0, -1) : line)
    .filter((line) => line.includes("[error]"));
}

const STAGE_FILE_INSTRUCTIONS = Object.freeze({
  implementation_design: Object.freeze([
    "Write only design/implementation-design.md.",
    "Define the minimal implementation decision without placeholders or illustrative substitutes.",
    "The source surface path is exactly src/hello.mjs.",
    "The source must export helloWorld() returning exactly \\"Hello, world!\\".",
    "The test design surface path is exactly design/test-design.md.",
    "The test source surface path is exactly test/hello.test.mjs.",
    "The execution plan surface path is exactly test-execution-plan.json.",
    "The execution result must prove stdout exactly \\"Hello, world!\\\\n\\" and zero failing tests.",
    "Name those exact downstream source, test design, test source, execution plan, and execution result surfaces.",
    "Do not materialize source, tests, package files, or execution plans in this vector."
  ]),
  source: Object.freeze([
    "Write only package.json and src/hello.mjs.",
    "Use the prior implementation_design artifact as the authority for what source to emit.",
    "Do not substitute another module path, function name, or return constant.",
    "package.json must be private:true and type:module.",
    "src/hello.mjs must export helloWorld() returning exactly \\"Hello, world!\\"."
  ]),
  test_design: Object.freeze([
    "Write only design/test-design.md.",
    "Use the prior source artifact summaries as the evidence source.",
    "Specify the exact observable contract the test source must check.",
    "The observable contract must include the named export helloWorld and exact return value \\"Hello, world!\\".",
    "Do not write test source in this vector."
  ]),
  test_source: Object.freeze([
    "Write only test/hello.test.mjs.",
    "Use the prior test_design and source artifact summaries as the evidence source.",
    "Use node:test and node:assert/strict.",
    "Import named exports with braces when the source artifact declares named exports.",
    "Assert helloWorld() returns exactly \\"Hello, world!\\"."
  ]),
  test_execution_plan: Object.freeze([
    "Write only test-execution-plan.json.",
    "Use the prior test_source artifact summary as the evidence source.",
    "Include command, args, cwd, expectedStdout or expectedStdoutMatch, expectedTestPassCount, and assertedReturnValue.",
    "expectedTestPassCount is the minimum admitted test count expected from the admitted test source.",
    "For node:test output, expectedStdoutMatch must use stable substrings such as pass N and fail 0, not TAP prefix symbols.",
    "Do not execute the test in this vector."
  ]),
  test_execution_result: Object.freeze([
    "Produce no files.",
    "Judge the observed executionStatus, planSatisfied flag, observedTestPassCount, and stdout digest against the prior test_execution_plan.",
    "Accept this vector when the execution-result evidence is complete and replay-bound, even when the observed command failed.",
    "Do not require planSatisfied=true to close the execution-result vector; a failed plan is valid execution evidence that must flow to qualification and repair.",
    "Treat command success, planSatisfied=true, and observedTestPassCount >= expectedTestPassCount as the passing-result condition, not as the existence condition for the execution-result surface.",
    "Do not reject solely because node:test uses a different TAP prefix glyph when the F_D pass-count check is satisfied."
  ])
});

function edgeNameForStage(stage) {
  return "software_build_" + stage.stage;
}

function stageInstructionsFor(stageSpec) {
  return Array.isArray(stageSpec.instructions)
    ? Object.freeze(stageSpec.instructions)
    : STAGE_FILE_INSTRUCTIONS[stageSpec.stage] ?? Object.freeze([]);
}

function transformInstructionText(stageSpec) {
  const allowedPaths = Object.freeze(stageSpec.filesToProduce ?? []);
  const declaredStagePlan = SCENARIO.stagePlan.map((stage) =>
    "- " + stage.stage + ": " + (
      Array.isArray(stage.filesToProduce) && stage.filesToProduce.length > 0
        ? stage.filesToProduce.join(", ")
        : "no materialized file"
    )
  );
  const fileInstructions = allowedPaths.length > 0
    ? [
        "",
        "This stage must produce files. Return them in files as path/contentLines objects.",
        "Allowed paths: " + allowedPaths.join(", ") + ".",
        "Do not write outside those paths.",
        "Do not put raw multi-line text in a JSON string. Use contentLines: string[] for every file.",
        "Do not include markdown code fences inside contentLines."
      ]
    : [
        "",
        "This stage must not produce files. Omit files or return an empty files array."
      ];
  return [
    "Return only one JSON object. Do not include markdown or commentary.",
    "Do not request or use any external helper, tool, shell, command, or subagent.",
    "Resolve this vector from the ABG-rendered instruction envelope, runtime bindings, admitted prior artifacts, typed node contract, and stage policy data.",
    "ABG owns registry startup, graph-function selection, graph-call opening, traversal events, prompt rendering, closure, and replay truth.",
    "odd_glc supplies GTL declaration data: the reusable software-build graph overlay, node types, and startup binding.",
    "",
    "Scenario: " + SCENARIO.scenarioId,
    "Scenario kind: " + SCENARIO.kind,
    "Stage: " + stageSpec.stage,
    "Overlay ref: " + OVERLAY_REF,
    "Graph ref: " + GRAPH_REF,
    "Selected graph function ref: " + GRAPH_FUNCTION_REF,
    "Expected runtime stdout: " + JSON.stringify(EXPECTED_STDOUT),
    "",
    "Typed edge contract:",
    "- sourceTypeRef: " + stageSpec.sourceTypeRef,
    "- targetTypeRef: " + stageSpec.targetTypeRef,
    "- vectorId: " + stageSpec.vectorId,
    "- requiredNodeTypes: " + stageSpec.requiredNodeTypes.join(", "),
    "",
    "Declared scenario stage plan:",
    ...declaredStagePlan,
    "Use these declared stage/file paths exactly when naming lifecycle surfaces.",
    "Do not substitute alternate witness paths, legacy odd_sdlc paths, or illustrative filenames.",
    "",
    "Stage-specific instructions:",
    ...stageInstructionsFor(stageSpec).map((line) => "- " + line),
    "",
    "Required JSON:",
    "{",
    "  \\"accepted\\": true,",
    "  \\"stage\\": " + JSON.stringify(stageSpec.stage) + ",",
    "  \\"evidenceAccepted\\": true,",
    "  \\"nodeTypesUsed\\": string[],",
    "  \\"files\\": [{ \\"path\\": string, \\"contentLines\\": string[] }],",
    "  \\"reason\\": string",
    "}",
    "",
    "nodeTypesUsed must include at least: " + stageSpec.requiredNodeTypes.join(", ") + ".",
    ...fileInstructions,
    "Do not claim to emit ABG events, select graph functions, open graph calls, or close traversal."
  ].join("\\n");
}

function stageCarriesExecution(stageSpec) {
  return (
    stageSpec.deterministicExecution === true ||
    stageSpec.deterministicMaterialize === true ||
    stageSpec.postMaterializationValidation != null ||
    /test_execution|execution_result/.test(stageSpec.stage)
  );
}

function evaluateInstructionText(stageSpec) {
  return [
    "Return only one JSON object. Do not include markdown or commentary.",
    "Do not request or use any external helper, tool, shell, command, or subagent.",
    "Evaluate the ABG-bound candidate payload for the current vector against admitted runtime bindings, typed node contracts, stage policy data, and evidence refs.",
    "The worker output is candidate material. Do not accept because the worker says accepted.",
    "ABG owns event emission, closure, retry, re-entry, and next-vector selection.",
    "",
    "Scenario: " + SCENARIO.scenarioId,
    "Scenario kind: " + SCENARIO.kind,
    "Stage: " + stageSpec.stage,
    "Expected node types: " + stageSpec.requiredNodeTypes.join(", "),
    "",
    "Stage-specific instructions:",
    ...stageInstructionsFor(stageSpec).map((line) => "- " + line),
    "",
    "Review criteria:",
    ...(stageCarriesExecution(stageSpec)
      ? ["- reviewAccepted is true only if the candidate stage, vector index, node types, generated file paths, and execution evidence satisfy the typed vector contract."]
      : [
          "- reviewAccepted is true only if the candidate stage, vector index, node types, generated file paths, and file content satisfy the typed vector contract.",
          "- This stage carries NO execution evidence by design: do not require postMaterializationValidation, executionStatus, compile results, or test results here; that evidence belongs to the later test-execution stages."
        ]),
    "- closeDisposition must be close for accepted vectors, retry for repairable same-vector defects, reprice for upstream-contract defects, or block for unrecoverable execution/proof failure.",
    "- The ABG prompt manifest must include a runtime payload binding for the candidate worker artifact.",
    "- If the bound candidate payload includes candidateEvidence.the worker-reported compile outcome in its assessment, treat that as ABG-called F_D post-materialization validation evidence for this candidate; do not require a second shell run or a separate evidence slot for the same compile gate.",
    "",
    "Return exactly one JSON object with these fields:",
    "- reviewAccepted: boolean",
    "- closeDisposition: one of close, retry, reprice, block, qualified_defer",
    "- evidenceAccepted: boolean",
    "- reason: string"
  ].join("\\n");
}

function transformResponseJsonSchema(stageSpec) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["accepted", "stage", "evidenceAccepted", "nodeTypesUsed", "files", "reason"],
    properties: {
      accepted: { const: true },
      stage: { const: stageSpec.stage },
      evidenceAccepted: { const: true },
      nodeTypesUsed: {
        type: "array",
        minItems: stageSpec.requiredNodeTypes.length,
        items: { type: "string" }
      },
      files: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["path", "contentLines"],
          properties: {
            path: { type: "string" },
            contentLines: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      },
      reason: { type: "string" }
    }
  };
}

function evaluateResponseJsonSchema(stageSpec) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["reviewAccepted", "closeDisposition", "evidenceAccepted", "reason"],
    properties: {
      reviewAccepted: { type: "boolean" },
      closeDisposition: {
        enum: ["close", "retry", "reprice", "block", "qualified_defer"]
      },
      evidenceAccepted: { type: "boolean" },
      reason: { type: "string" }
    }
  };
}

function instructionRuleForStage(stage, computeStageRole) {
  const slotClasses = [
    "graph_call",
    "frame",
    "vector",
    "selected_graph_function",
    "event_log",
    "worker_invocation",
    "source_node",
    "target_node"
  ];
  if (stage.index > 0) {
    slotClasses.push("prior_artifact");
    slotClasses.push("evidence");
  }
  if (computeStageRole === "evaluate") {
    slotClasses.push("payload");
  }
  const requiredInputRefs = requiredInputRefsForStage(stage);
  return constructInstructionAssemblyRule({
    ruleRef: "instruction-rule://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage + "/" + computeStageRole,
    appliesToGraphFunctionRefs: [softwareBuildBootstrap.id],
    appliesToVectorRefs: [edgeNameForStage(stage)],
    sectionRules: [
      {
        sectionRef: "section://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage + "/" + computeStageRole,
        required: true,
        policyRefs: ["policy://odd_glc/software-build/" + computeStageRole]
      }
    ],
    relevanceRules: [
      {
        ruleRef: "relevance://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage + "/" + computeStageRole,
        requiredInputRefs,
        allowFutureStageRefs: []
      }
    ],
    compressionPolicyRef: "compression://abg/ref-digest-excerpt",
    proportionalityPolicyRef: "proportionality://odd_glc/software-build/live-fp",
    runtimeBindingSlotClasses: uniq(slotClasses),
    policyRefs: ["policy://odd_glc/software-build/" + SCENARIO.key],
    evidenceRefs: ["evidence://odd_glc/software-build/instruction-rule"]
  });
}

function instructionSectionForStage(stage, computeStageRole) {
  return constructInstructionSectionDecision({
    sectionRef: "section://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage + "/" + computeStageRole,
    disposition: "include",
    dependencyRefs: [
      edgeNameForStage(stage),
      stage.source.id,
      stage.target.id
    ],
    carrierRefs: [
      stage.source.id,
      stage.target.id,
      stage.sourceTypeRef,
      stage.targetTypeRef
    ],
    compressionMode: "digest",
    text: computeStageRole === "evaluate"
      ? evaluateInstructionText(stage)
      : transformInstructionText(stage),
    digestRef: "sha256:odd-glc-software-build-" + SCENARIO.key + "-" + stage.stage + "-" + computeStageRole,
    excerptDigest: null,
    fullContentAdmitted: false,
    stageRef: "stage://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage,
    gapRefs: []
  });
}

function runtimeBindingSlotsForStage(stage, computeStageRole) {
  return instructionRuleForStage(stage, computeStageRole).runtimeBindingSlotClasses.map((slotClass) =>
    constructRuntimeBindingSlot({
      slotRef: "slot://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage + "/" + computeStageRole + "/" + slotClass,
      slotClass,
      required: true,
      sourceTruthKind: slotClass === "prior_artifact" || slotClass === "payload"
        ? "admitted_ref"
        : slotClass === "selected_graph_function" || slotClass === "graph_call" || slotClass === "frame" || slotClass === "worker_invocation"
          ? "replay_event"
          : "projection",
      evidenceRefs: ["evidence://odd_glc/software-build/runtime-binding/" + slotClass]
    })
  );
}

function derivedInstructionCarrierTruthForStage(stage) {
  const sourceShape = shapeForTypeRef(stage.sourceTypeRef);
  const targetShape = shapeForTypeRef(stage.targetTypeRef);
  return Object.freeze({
    kind: "derived_instruction_carrier_truth",
    sourceTypeRefs: [stage.sourceTypeRef],
    targetTypeRefs: [stage.targetTypeRef],
    outputContractRefs: uniq(targetShape.assetSurface.outputContractRefs ?? []),
    proofRefs: uniq([
      ...(sourceShape.assetSurface.proofObligationRefs ?? []),
      ...(targetShape.assetSurface.proofObligationRefs ?? []),
      "proof://odd_glc/software-build/" + stage.stage
    ]),
    authorityRefs: ["authority://abg/traversal", "authority://odd_glc/gtl-declaration-data"],
    rendererRefs: ["renderer://abg/instruction-envelope/default"],
    activeRegime: "F_P",
    carrierClassRefs: uniq([
      sourceShape.assetSurface.kind,
      targetShape.assetSurface.kind,
      stage.sourceTypeRef,
      stage.targetTypeRef
    ])
  });
}

function dependencyInstructionTruthForStage(stage) {
  const prerequisiteRows = requiredPriorStageRowsFor(stage);
  const graphDigest = sha256Text(JSON.stringify({
    graphRef: GRAPH_REF,
    vectors: stageRows.map((row) => Object.freeze({
      edge: edgeNameForStage(row),
      sourceTypeRef: row.sourceTypeRef,
      targetTypeRef: row.targetTypeRef
    }))
  }));
  return constructDerivedDependencyInstructionTruth({
    truthRef: "dependency-instruction-truth://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage,
    workKind: "target_work",
    dependencyGraphRef: prerequisiteRows.length === 0 ? null : GRAPH_REF,
    dependencyGraphDigest: prerequisiteRows.length === 0 ? null : graphDigest,
    targetRefs: [stage.target.id, stage.targetTypeRef],
    prerequisiteNodeRefs: prerequisiteRows.map((row) => row.target.id),
    prerequisiteEdgeRefs: prerequisiteRows.map((row) => edgeNameForStage(row)),
    dependencyClosed: true,
    typedPrerequisiteGapRefs: [],
    noDependencyPolicyRef: prerequisiteRows.length === 0
      ? "policy://odd_glc/software-build/bootstrap-has-no-prior-stage"
      : null,
    sourceProjectionRefs: [GRAPH_REF, OVERLAY_REF]
  });
}

function depthClassRefsForStage(stage) {
  const base = ["depth-class://positive", "depth-class://negative", "depth-class://semantic-adequacy"];
  // T-031: stages spanned by typed CDME requirements declare the union of
  // the concern depth classes — a shallow declared set is -032 non-closure.
  const spanned = (SCENARIO.cdmeRequirements ?? null) !== null &&
    (SCENARIO.cdmeRequirementSpanStages ?? []).includes(stage.stage);
  return spanned
    ? [...new Set([...base, ...SCENARIO.cdmeRequirementDepthClassRefs])]
    : base;
}
function proofDepthInstructionTruthForStage(stage) {
  const depthClassRefs = depthClassRefsForStage(stage);
  return constructDerivedProofDepthInstructionTruth({
    truthRef: "proof-depth-instruction-truth://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage,
    depthPolicyRef: "proof-depth-policy://odd_glc/software-build/" + SCENARIO.key,
    depthPolicyDigest: sha256Text(JSON.stringify({
      scenarioId: SCENARIO.scenarioId,
      stage: stage.stage,
      requiredDepthClassRefs: depthClassRefs
    })),
    targetRefs: [stage.target.id, stage.targetTypeRef],
    requiredDepthClassRefs: depthClassRefs,
    declaredDepthClassRefs: depthClassRefs,
    declaredDepthObligationRefs: depthClassRefs.map((depthClassRef) =>
      "proof-obligation://odd_glc/software-build/" + stage.stage + "/" + depthClassRef.split("://")[1]
    ),
    notApplicableDepthClassRefs: [],
    typedDepthGapRefs: [],
    proofStrengthAdmissionRefs: ["proof-strength-admission://odd_glc/software-build/" + stage.stage],
    fdStrengthCriterionRefs: ["fd-strength-criterion://odd_glc/software-build/" + stage.stage + "/typed-contract"],
    adversarialVerificationRefs: [],
    adversarialCounterexampleRefs: [],
    sourceProjectionRefs: [GRAPH_REF, OVERLAY_REF],
    depthComplete: true,
    proofStrengthAdmitted: true
  });
}

function compiledPromptPlanForStage(stage, computeStageRole) {
  const rule = instructionRuleForStage(stage, computeStageRole);
  const requiredInputRefs = requiredInputRefsForStage(stage);
  const result = compileInstructionAssemblyPlan({
    planRef: "compiled-prompt-plan://odd_glc/software-build/" + SCENARIO.key + "/" + stage.stage + "/" + computeStageRole,
    rule,
    computeStageRole,
    graphFunctionRef: softwareBuildBootstrap.id,
    vectorRef: edgeNameForStage(stage),
    registryEntryRefs: [bootstrapBinding.entryRef],
    sourceNodeRefs: [stage.source.id],
    targetNodeRef: stage.target.id,
    derivedTruth: derivedInstructionCarrierTruthForStage(stage),
    knownAlgebraRefs: [...INSTRUCTION_ASSEMBLY_KNOWN_ALGEBRAS],
    requiredInputRefs,
    availableInputRefs: requiredInputRefs,
    sectionDecisions: [instructionSectionForStage(stage, computeStageRole)],
    bindingSlots: runtimeBindingSlotsForStage(stage, computeStageRole),
    proportionalityClass: "P2",
    // rc.9 plan policy (T-030 bug #3a): multi-module admitted source
    // surfaces must carry whole into downstream prompts.
    causalExcerptMaxChars: 96000,
    instructionWorkKind: "target_work",
    dependencyInstructionTruth: dependencyInstructionTruthForStage(stage),
    proofDepthInstructionTruth: proofDepthInstructionTruthForStage(stage),
    expectedAnswerMarkers: ["release_readiness_candidate", "preapproved_close_marker"],
    fpValidationEvidenceRefs: ["semantic-review-gate://odd_glc/software-build/" + stage.stage + "/" + computeStageRole],
    compilerEvidenceRefs: ["evidence://odd_glc/software-build/instruction-compiler/" + stage.stage + "/" + computeStageRole]
  });
  if (!result.accepted) {
    throw new Error("Instruction assembly plan failed for " + stage.stage + "/" + computeStageRole + ": " + JSON.stringify(result.issues));
  }
  return result.plan;
}

const instructionAssemblyStartup = Object.freeze({
  compiledPromptPlans: Object.freeze(stageRows.flatMap((stage) => [
    compiledPromptPlanForStage(stage, "transform"),
    compiledPromptPlanForStage(stage, "evaluate")
  ])),
  rendererRef: "renderer://abg/instruction-envelope/default"
});

function closeDispositionFromReview(review) {
  const value = review.closeDisposition;
  if (value === "close" || value === "retry" || value === "reprice" || value === "block" || value === "qualified_defer") {
    return value;
  }
  return review.reviewAccepted === true ? "close" : "retry";
}

function acceptedReviewFor(input, review) {
  const artifact = input.attachedResultArtifact;
  const stageSpec = STAGE_PLAN[input.vectorIndex];
  if (artifact === null || artifact === undefined || stageSpec === undefined) {
    return false;
  }
  const nodeTypesUsed = artifact.assessment?.nodeTypesUsed;
  if (
    artifact.assessment?.accepted !== true ||
    artifact.assessment?.evidenceAccepted !== true
  ) {
    return false;
  }
  if (
    stageSpec.executeBeforeAssessment === true &&
    typeof artifact.evidenceSummary?.planSatisfied !== "boolean"
  ) {
    return false;
  }
  if (
    artifact.postMaterializationValidation !== null &&
    artifact.postMaterializationValidation !== undefined &&
    artifact.postMaterializationValidation.accepted !== true
  ) {
    return false;
  }
  return review.reviewAccepted === true &&
    review.evidenceAccepted === true &&
    artifact.stage === stageSpec.stage &&
    artifact.vectorIndex === input.vectorIndex &&
    Array.isArray(nodeTypesUsed) &&
    stageSpec.requiredNodeTypes.every((typeRef) => nodeTypesUsed.includes(typeRef));
}

// T-030 P4 + T-031: requirement route + carry-through + standing temporal
// gates as PRODUCT DATA consumed by ABG startup. T-031 (user closure law:
// requirements met by code delivery proven by tests): when the scenario
// declares cdmeRequirements, the bundle is built data-driven — one TYPED
// requirement per concern, spans over the CREATING and PROVING vectors so
// engine-derived pressure enters the authoring prompts (-007) and folds
// carry residual pressure until the production edge proves coverage.
// Scenarios without cdmeRequirements keep the single generic requirement.
const T030_REQUIREMENT_ID = "REQ-GLC-SB-001";
const T030_STRENGTH_REF = "evidence-role://odd_glc/software-build/execution-evidence";
const t030FinalStageIndex = STAGE_PLAN.length - 1;
const t030FinalStage = STAGE_PLAN[t030FinalStageIndex];
// span identity from the ADMITTED graph (row shapes vary per scenario)
const t030FinalVector =
  softwareBuildBootstrap.template.graph.vectors[t030FinalStageIndex];
const t030SpanId = \`span://odd_glc/software-build/\${SCENARIO.key}/final-prove\`;
const CDME_REQUIREMENTS = SCENARIO.cdmeRequirements ?? null;
function cdmeSpanVectorIndexes() {
  const stageKeys = SCENARIO.cdmeRequirementSpanStages ?? [];
  const indexes = STAGE_PLAN
    .map((stage, index) => (stageKeys.includes(stage.stage) ? index : null))
    .filter((index) => index !== null);
  if (indexes.length !== stageKeys.length) {
    throw new Error("cdmeRequirementSpanStages name unknown stages: " + JSON.stringify(stageKeys));
  }
  return indexes;
}
function cdmeSpanIdFor(row) {
  return \`span://odd_glc/cdme/\${SCENARIO.key}/\${row.module}\`;
}
const t030Bundle = CDME_REQUIREMENTS === null
  ? declareBundle({
      requirements: [
        declareRequirement({
          requirementId: T030_REQUIREMENT_ID,
          termKind: "atom",
          stableId: T030_REQUIREMENT_ID,
          sourceRef: "specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md#software-build",
          sourceDigest: "sha256:odd-glc-software-build-r1",
          relationRefs: [],
          spanRefs: [t030SpanId],
          contextRefs: [],
          evidencePolicyRefs: ["policy://odd_glc/software-build/evidence"]
        })
      ],
      spans: [
        declareTraversalSpan({
          spanId: t030SpanId,
          graphFunctionRef: softwareBuildBootstrap.id,
          graphVectorRefs: [t030FinalVector.id],
          vectorIndexes: [t030FinalStageIndex],
          sourceNodeRef: t030FinalVector.source[0].id,
          targetNodeRef: t030FinalVector.target.id
        })
      ]
    })
  : declareBundle({
      requirements: CDME_REQUIREMENTS.map((row) =>
        declareRequirement({
          requirementId: row.requirementId,
          termKind: "atom",
          stableId: row.requirementId,
          sourceRef: "specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md#cdme-" + row.module,
          sourceDigest: sha256Text("odd-glc-cdme-" + row.module + "-" + row.concern),
          relationRefs: [],
          spanRefs: [cdmeSpanIdFor(row)],
          contextRefs: [],
          evidencePolicyRefs: ["policy://odd_glc/software-build/evidence"]
        })
      ),
      spans: CDME_REQUIREMENTS.map((row) => {
        const vectorIndexes = cdmeSpanVectorIndexes();
        const vectors = vectorIndexes.map((index) => softwareBuildBootstrap.template.graph.vectors[index]);
        return declareTraversalSpan({
          spanId: cdmeSpanIdFor(row),
          graphFunctionRef: softwareBuildBootstrap.id,
          graphVectorRefs: vectors.map((vector) => vector.id),
          vectorIndexes,
          sourceNodeRef: vectors[0].source[0].id,
          targetNodeRef: vectors[vectors.length - 1].target.id
        });
      })
    });
const t030Table = constructRequirementProofCandidateClassificationTable({
  tableRef: "classification-table://odd_glc/software-build/live",
  sourceRef: "gtl-overlay://odd_glc/software-build",
  rules: [
    {
      kind: "requirement_proof_candidate_classification_rule",
      ruleRef: "classification-rule://odd_glc/software-build/artifact",
      stageRole: "transform",
      outputCandidateKind: "candidate-kind://odd_glc/software-build/artifact",
      admissionTargetKind: "admission-target://abg/payload",
      evidenceRoleRefs: ["evidence-role://odd_glc/software-build/realization"]
    }
  ]
});
const t030Contract = constructRequirementProofCarryThroughContract({
  contractRef: "plugin-proof-contract://odd_glc/software-build/live",
  pluginRef: "plugin://odd_glc/software-build/live",
  stageRole: "transform",
  resultInterfaceRef: "result-interface://odd_glc/software-build/live",
  responseContractRefs: ["response-contract://odd_glc/software-build/live"],
  selectedCompositionRef: "composition://odd_glc/software-build/live",
  selectedCompositionDigest: "sha256:odd-glc-software-build-composition",
  fulfillmentBindings: [
    constructGtlContractFulfillmentBinding({
      bindingRef: "gtl-contract-fulfillment-binding://odd_glc/software-build/r1",
      obligationRef: "requirement-obligation://odd_glc/software-build/r1",
      requirementRef: T030_REQUIREMENT_ID,
      productRequirementRef: "product-requirement://odd_glc/software-build/r1",
      designObligationRef: "design-obligation://odd_glc/software-build/live",
      componentRef: "component://odd_glc/software-build/live",
      productTargetRef: "target://odd_glc/software-build/live",
      outputSurfaceRef: "output-surface://odd_glc/software-build/live",
      functionOrEntrypointRef: "function://odd_glc/software-build/live",
      realizationEvidenceRefs: [OVERLAY_REF],
      testOrExecutionEvidenceRefs: ["proof-obligation://odd_glc/software-build/execution"],
      evaluatorFindingRef: "evaluator-finding://odd_glc/software-build/execution",
      authorityRefs: ["authority://odd_glc/software-build/live-fp"],
      evidenceRefs: [OVERLAY_REF]
    })
  ],
  proofPolicyRefs: ["proof-policy://odd_glc/software-build/positive-negative"],
  expectedEvidenceShapeRefs: [
    "evidence-shape://odd_glc/software-build/positive",
    "evidence-shape://odd_glc/software-build/negative"
  ],
  proofStrengthRefs: ["proof-strength://odd_glc/software-build/execution"],
  depthPolicyRefs: ["proof-depth-policy://odd_glc/software-build/live"],
  requiredDepthClassRefs: ["depth-class://positive", "depth-class://negative"],
  fdStrengthCriterionRefs: [T030_STRENGTH_REF],
  requiredAdversarialCheckRefs: [],
  evidenceRoleRefs: ["evidence-role://odd_glc/software-build/realization"],
  outputCandidateKinds: ["candidate-kind://odd_glc/software-build/artifact"],
  admissionTargetKinds: ["admission-target://abg/payload"],
  classificationTableRef: t030Table.tableRef,
  classificationTableDigest: t030Table.tableDigest
});
const t030EnvelopeTemplate = {
  contractRef: "plugin-proof-contract://odd_glc/software-build/live",
  stageRole: "transform",
  taskRole: "task-role://odd_glc/software-build/prove",
  outputCandidateKind: "candidate-kind://odd_glc/software-build/artifact",
  admissionTargetKind: "admission-target://abg/payload",
  sourceRequirementObligationRefs: ["requirement-obligation://odd_glc/software-build/r1"],
  evidenceRoleRefs: ["evidence-role://odd_glc/software-build/realization"],
  proofObligationRefs: ["proof-obligation://odd_glc/software-build/execution"],
  proofPolicyRefs: ["proof-policy://odd_glc/software-build/positive-negative"],
  expectedEvidenceShapeRefs: [
    "evidence-shape://odd_glc/software-build/positive",
    "evidence-shape://odd_glc/software-build/negative"
  ],
  positiveEvidenceShapeRefs: ["evidence-shape://odd_glc/software-build/positive"],
  negativeEvidenceShapeRefs: ["evidence-shape://odd_glc/software-build/negative"],
  proofStrengthRefs: ["proof-strength://odd_glc/software-build/execution"],
  depthPolicyRefs: ["proof-depth-policy://odd_glc/software-build/live"],
  depthClassRefs: ["depth-class://positive", "depth-class://negative"],
  proofStrengthAdmissionRefs: [T030_STRENGTH_REF],
  fdStrengthCriterionRefs: [T030_STRENGTH_REF],
  adversarialAttemptRefs: [],
  counterexampleRefs: [],
  responseContractRef: "response-contract://odd_glc/software-build/live",
  resultInterfaceRef: "result-interface://odd_glc/software-build/live",
  selectedCompositionRef: "composition://odd_glc/software-build/live",
  selectedCompositionDigest: "sha256:odd-glc-software-build-composition"
};

// T-031 per-concern carry entries: each typed requirement owes coverage
// with its OWN positive/negative shapes and five depth classes; coverage
// is produced on the PROVING edge (last span stage). Strength stays the
// shared execution-evidence criterion (mechanical F_D class); semantic
// adequacy is the F_P evaluator's judgment over the declared shapes.
function cdmeCarryEntryFor(row) {
  const depthClassRefs = SCENARIO.cdmeRequirementDepthClassRefs;
  const obligationRef = "requirement-obligation://cdme/" + row.module;
  const proofObligationRefs = [
    "proof-obligation://cdme/" + row.module + "/execution",
    "proof-obligation://cdme/" + row.module + "/positive-shape",
    "proof-obligation://cdme/" + row.module + "/negative-shape"
  ];
  const shapeRefs = [row.positiveShapeRef, row.negativeShapeRef];
  const spanStageKeys = SCENARIO.cdmeRequirementSpanStages;
  const provingStageKey = spanStageKeys[spanStageKeys.length - 1];
  const provingStage = STAGE_PLAN.find((stage) => stage.stage === provingStageKey);
  const contract = constructRequirementProofCarryThroughContract({
    contractRef: "plugin-proof-contract://cdme/" + row.module,
    pluginRef: "plugin://odd_glc/software-build/live",
    stageRole: "transform",
    resultInterfaceRef: "result-interface://odd_glc/software-build/live",
    responseContractRefs: ["response-contract://odd_glc/software-build/live"],
    selectedCompositionRef: "composition://odd_glc/software-build/live",
    selectedCompositionDigest: "sha256:odd-glc-software-build-composition",
    fulfillmentBindings: [
      constructGtlContractFulfillmentBinding({
        bindingRef: "gtl-contract-fulfillment-binding://cdme/" + row.module,
        obligationRef,
        requirementRef: row.requirementId,
        productRequirementRef: "product-requirement://cdme/" + row.module,
        designObligationRef: "design-obligation://cdme/" + row.module,
        componentRef: "component://cdme/" + row.module,
        productTargetRef: "target://cdme/" + row.module,
        outputSurfaceRef: "output-surface://cdme/" + row.module,
        functionOrEntrypointRef: "function://cdme/" + row.module,
        realizationEvidenceRefs: [OVERLAY_REF],
        testOrExecutionEvidenceRefs: proofObligationRefs,
        evaluatorFindingRef: "evaluator-finding://cdme/" + row.module,
        authorityRefs: ["authority://odd_glc/software-build/live-fp"],
        evidenceRefs: [OVERLAY_REF]
      })
    ],
    proofPolicyRefs: ["proof-policy://cdme/typed-uat"],
    expectedEvidenceShapeRefs: shapeRefs,
    proofStrengthRefs: ["proof-strength://odd_glc/software-build/execution"],
    depthPolicyRefs: ["proof-depth-policy://cdme/typed-uat"],
    requiredDepthClassRefs: depthClassRefs,
    fdStrengthCriterionRefs: [T030_STRENGTH_REF],
    requiredAdversarialCheckRefs: [],
    evidenceRoleRefs: ["evidence-role://odd_glc/software-build/realization"],
    outputCandidateKinds: ["candidate-kind://odd_glc/software-build/artifact"],
    admissionTargetKinds: ["admission-target://abg/payload"],
    classificationTableRef: t030Table.tableRef,
    classificationTableDigest: t030Table.tableDigest
  });
  return {
    contract,
    classificationTable: t030Table,
    requirementIds: [row.requirementId],
    envelopeTemplate: {
      contractRef: contract.contractRef,
      stageRole: "transform",
      taskRole: "task-role://cdme/" + row.module + "/prove",
      outputCandidateKind: "candidate-kind://odd_glc/software-build/artifact",
      admissionTargetKind: "admission-target://abg/payload",
      sourceRequirementObligationRefs: [obligationRef],
      evidenceRoleRefs: ["evidence-role://odd_glc/software-build/realization"],
      proofObligationRefs,
      proofPolicyRefs: ["proof-policy://cdme/typed-uat"],
      expectedEvidenceShapeRefs: shapeRefs,
      positiveEvidenceShapeRefs: [row.positiveShapeRef],
      negativeEvidenceShapeRefs: [row.negativeShapeRef],
      proofStrengthRefs: ["proof-strength://odd_glc/software-build/execution"],
      depthPolicyRefs: ["proof-depth-policy://cdme/typed-uat"],
      depthClassRefs,
      proofStrengthAdmissionRefs: [T030_STRENGTH_REF],
      fdStrengthCriterionRefs: [T030_STRENGTH_REF],
      adversarialAttemptRefs: [],
      counterexampleRefs: [],
      responseContractRef: "response-contract://odd_glc/software-build/live",
      resultInterfaceRef: "result-interface://odd_glc/software-build/live",
      selectedCompositionRef: "composition://odd_glc/software-build/live",
      selectedCompositionDigest: "sha256:odd-glc-software-build-composition"
    },
    edge: edgeNameForStage(provingStage)
  };
}

process.on("uncaughtException", (error) => {
  try {
    fsSyncAppend(\`uncaughtException: \${error?.stack ?? error}\`);
  } catch {}
  throw error;
});
process.on("unhandledRejection", (error) => {
  try {
    fsSyncAppend(\`unhandledRejection: \${error?.stack ?? error}\`);
  } catch {}
});
function fsSyncAppend(text) {
  const target = path.join(process.cwd(), ".ai-workspace", "binding-crash.log");
  fsSync.mkdirSync(path.dirname(target), { recursive: true });
  fsSync.appendFileSync(target, text + "\\n---\\n", "utf8");
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
  instructionAssemblyStartup,
  requirementRouteDeclarationBundle: t030Bundle,
  requirementProofCarryThroughStartup: {
    entries: CDME_REQUIREMENTS === null
      ? [
          {
            contract: t030Contract,
            classificationTable: t030Table,
            requirementIds: [T030_REQUIREMENT_ID],
            envelopeTemplate: t030EnvelopeTemplate,
            edge: edgeNameForStage(t030FinalStage)
          }
        ]
      : CDME_REQUIREMENTS.map((row) => cdmeCarryEntryFor(row)),
  },
  temporalPropertyStartup: { rules: STANDING_GATE_TEMPORAL_PROPERTY_RULES },
  runId: \`run://odd_glc/software-build/\${SCENARIO.key}\`,
  workKey: \`wk://odd_glc/software-build/\${SCENARIO.key}\`,
  createPlugins: ({ workspaceRoot }) => {
    const fpDispatch = Object.freeze({
      contract: defaultFpDispatchPlugin.contract,
      dispatch: async (pluginInput) => {
        const dispatchStarted = timestampNow();
        const runRoot = path.join(workspaceRoot, ".ai-workspace", "glc-software-build-live", SCENARIO.key);
        await mkdir(runRoot, { recursive: true });
        const baseLabel = \`\${SCENARIO.key}-vector-\${pluginInput.vectorIndex}\`;
        const label = \`\${baseLabel}\${attemptSuffixFor(pluginInput)}\`;
        const stageSpec = STAGE_PLAN[pluginInput.vectorIndex];
        if (stageSpec === undefined) {
          throw new Error(\`No stage plan entry for vector index \${pluginInput.vectorIndex}\`);
        }
        const expectedStage = stageSpec.stage;
        const expectedNodeTypes = stageSpec.requiredNodeTypes;
        let materializedFiles = Object.freeze([]);
        let execution = null;
        let deterministicMaterializeTiming = null;
        let subjectExecutionTiming = null;
        let assessmentMaterializeTiming = null;
        if (stageSpec.deterministicMaterialize === true) {
          const measured = await measuredStep("deterministic_materialize", () => materializeScenario(workspaceRoot));
          materializedFiles = measured.value;
          deterministicMaterializeTiming = measured.timing;
        }
        if (stageSpec.executeBeforeAssessment === true) {
          materializedFiles = Object.freeze((SCENARIO.files ?? []).map(([relativePath]) => path.join(workspaceRoot, relativePath)));
          const measured = await measuredStep("subject_execution", () => executeScenario(workspaceRoot));
          execution = measured.value;
          subjectExecutionTiming = measured.timing;
        }
        const evidenceSummary = evidenceSummaryFor({
          expectedStage,
          execution,
          materializedFiles,
          workspaceRoot
        });
        if (pluginInput.instructionPromptManifest === null) {
          throw new Error("ABG instruction prompt manifest is required for live F_P dispatch");
        }
        const executorProfile = process.env.ABG_TS_AGENT_EXECUTOR_PROFILE ?? "local-spawn";
        await writeAttemptAndLatestJson(
          runRoot,
          baseLabel,
          label,
          "instruction-manifest",
          pluginInput.instructionPromptManifest
        );
        let transport;
        let assessment;
        let postMaterializationValidation = null;
        let materializationIssues = Object.freeze([]);
        const deterministicExecutionStage = stageSpec.executeBeforeAssessment === true;
        if (deterministicExecutionStage) {
          assessment = deterministicExecutionAssessmentFor({
            expectedStage,
            expectedNodeTypes,
            execution
          });
          // 4.5 re-entry law: a failing REPAIRED execution surfaces as
          // consequence pressure — the consequence stage lands the
          // traversal back at the code vector (declared family:
          // depth_traversal), bounded by repairReentryBudget.
          if (
            expectedStage === "derive_repaired_test_execution_result_surface" &&
            execution !== null &&
            execution.planSatisfied === false
          ) {
            const priorReentryState = readRepairReentryState(workspaceRoot);
            writeRepairReentryState(workspaceRoot, {
              pressure: {
                vectorIndex: pluginInput.vectorIndex,
                reason: ("repaired execution still failing: " + String(assessment.reason ?? "")).slice(0, 300)
              },
              reentryCount: priorReentryState.reentryCount
            });
          }
          transport = deterministicExecutionTransportFor({ accepted: assessment.accepted === true });
        } else {
          transport = await runAgentTransport({
            contract: contractForKnownAgent(process.env.ABG_TS_LIVE_AGENT ?? "codex"),
            prompt: pluginInput.instructionPromptManifest.renderedPrompt,
            responseJsonSchema: transformResponseJsonSchema(stageSpec),
            cwd: workspaceRoot,
            archiveRoot: runRoot,
            label,
            executorProfile,
            ...(executorProfile === "pty-terminal" ? { terminalSessionKey: label } : {}),
            timeoutMs: Number.parseInt(process.env.ABG_TS_LIVE_TIMEOUT_MS ?? "240000", 10),
            outputPath: path.join(runRoot, \`\${label}-output.txt\`),
            promptPath: path.join(runRoot, \`\${label}-prompt.txt\`),
            stdoutPath: path.join(runRoot, \`\${label}-stdout.log\`),
            stderrPath: path.join(runRoot, \`\${label}-stderr.log\`)
          });
          if (transport.status !== 0 || transport.failureClass !== null) {
            return constructFpDispatchOutcome({
              status: "blocked",
              reason: [
                "GLC software-build live worker transport failed",
                \`status=\${String(transport.status)}\`,
                \`failureClass=\${transport.failureClass ?? "none"}\`,
                \`toolCallCount=\${String(transport.toolCallCount)}\`
              ].join(" "),
              attachedResultArtifact: runtimeFailureArtifactForTransport(
                transport,
                label
              ),
              evidenceRefs: [pluginInput.sourceProjectionRef]
            });
          }
          if (executorProfile === "pty-terminal" && transport.terminalSessionId === null) {
            throw new Error("pty-terminal live proof must record a terminalSessionId");
          }
          try {
            assessment = extractJsonObject(transport.text);
          } catch (parseError) {
            // Builder bug #5 (T-030 campaign): worker-side output corruption
            // (observed: byte-level chunk fault in codex -o emission) is a
            // CONTRACT FAILURE for the ABG retry allowlist — blocked truth,
            // not a crash.
            return constructFpDispatchOutcome({
              status: "blocked",
              reason: \`GLC software-build live worker output unparseable (contract_failure): \${String(parseError.message).slice(0, 200)}\`,
              attachedResultArtifact: runtimeFailureArtifactForTransport(
                transport,
                label,
                "contract_failure"
              ),
              evidenceRefs: [pluginInput.sourceProjectionRef]
            });
          }
        }
        // Builder bug #3b (T-030 campaign): an honest, well-formed worker
        // REFUSAL (accepted:false with a non-empty reason and the right
        // stage) is VALID BLOCKED truth for ABG retry/residual routing —
        // never a process error. Only malformed shapes are invalid.
        const wellFormedRefusal =
          assessment.stage === expectedStage &&
          assessment.accepted === false &&
          typeof assessment.reason === "string" &&
          assessment.reason.trim().length > 0;
        if (
          !wellFormedRefusal &&
          (
            assessment.stage !== expectedStage ||
            !Array.isArray(assessment.nodeTypesUsed) ||
            !expectedNodeTypes.every((typeRef) => assessment.nodeTypesUsed.includes(typeRef)) ||
            (deterministicExecutionStage !== true && (
              assessment.accepted !== true ||
              assessment.evidenceAccepted !== true
            ))
          )
        ) {
          throw new Error(\`GLC software-build live worker returned invalid assessment: \${JSON.stringify(assessment)}\`);
        }
        if (stageSpec.deterministicMaterialize !== true) {
          const measured = await measuredStep("assessment_materialize", () =>
            materializeAssessmentFiles(workspaceRoot, stageSpec, assessment)
          );
          materializedFiles = measured.value.written;
          materializationIssues = measured.value.issues;
          assessmentMaterializeTiming = measured.timing;
          postMaterializationValidation = deterministicPostMaterializationValidationForStage({
            workspaceRoot,
            stageSpec,
            materializedFiles
          });
          if (
            materializationIssues.length > 0 ||
            postMaterializationValidation !== null &&
            postMaterializationValidation.accepted !== true
          ) {
            assessment = Object.freeze({
              ...assessment,
              accepted: false,
              evidenceAccepted: false,
              reason: [
                assessment.reason,
                "Post-materialization F_D validation rejected candidate files.",
                ...materializationIssues,
                ...(postMaterializationValidation?.issues ?? [])
              ].filter((part) => typeof part === "string" && part.length > 0).join(" ")
            });
          }
        }
        const summaryMeasured = await measuredStep("summarize_materialized_files", () =>
          summarizeMaterializedFiles(workspaceRoot, materializedFiles)
        );
        const materializedFileSummaries = summaryMeasured.value;
        const assessmentIds = pluginInput.expectedAssessmentIds.length > 0
          ? pluginInput.expectedAssessmentIds
          : [\`software_build_\${SCENARIO.key}_vector_\${pluginInput.vectorIndex}_fulfilled\`];
        let traceTiming = null;
        if (transport.traceResultPath !== null) {
          try {
            traceTiming = await workerTraceTiming(transport);
          } catch (traceError) {
            traceTiming = Object.freeze({
              source: "trace_timing_unavailable",
              error: String(traceError?.message ?? traceError).slice(0, 300),
              timing: null
            });
          }
        }
        const dispatchTiming = timingRecord(dispatchStarted);
        const dispatchAccepted = assessment.accepted === true && assessment.evidenceAccepted === true;
        const artifact = Object.freeze({
          artifactKind: "odd_glc_software_build_overlay_live_artifact",
          scenarioId: SCENARIO.scenarioId,
          scenarioKind: SCENARIO.kind,
          overlayRef: OVERLAY_REF,
          graphRef: GRAPH_REF,
          graphFunctionRef: GRAPH_FUNCTION_REF,
          edge: pluginInput.edge,
          actor: process.env.ABG_TS_LIVE_AGENT ?? "codex",
          vectorIndex: pluginInput.vectorIndex,
          stage: expectedStage,
          stagePlan: Object.freeze({
            sourceTypeRef: stageSpec.sourceTypeRef,
            targetTypeRef: stageSpec.targetTypeRef,
            vectorId: stageSpec.vectorId,
            filesToProduce: Object.freeze(stageSpec.filesToProduce ?? []),
            executeBeforeAssessment: stageSpec.executeBeforeAssessment === true
          }),
          candidateEvidence: candidateEvidenceSummaryFor({
            expectedStage,
            vectorIndex: pluginInput.vectorIndex,
            assessment,
            materializedFileSummaries,
            materializationIssues,
            postMaterializationValidation,
            workspaceRoot
          }),
          assessment,
          evidenceSummary,
          materializedFiles,
          materializedFileSummaries,
          execution,
          timing: Object.freeze({
            timingAuthority: "abg_called_fp_dispatch_plugin_result_artifact",
            timingScope: deterministicExecutionStage
              ? "ABG selected this vector and invoked the dispatch plugin. The plugin executed the declared subject command and applied a deterministic F_D execution predicate; no F_P prompt was dispatched for this vector."
              : "ABG selected this vector and invoked the F_P dispatch plugin. These timings describe the ABG-called dispatch side effects and worker trace, not odd_glc-owned traversal control.",
            vectorIndex: pluginInput.vectorIndex,
            stage: expectedStage,
            dispatch: dispatchTiming,
            deterministicMaterialize: deterministicMaterializeTiming,
            subjectExecution: subjectExecutionTiming,
            workerTrace: traceTiming,
            assessmentMaterialize: assessmentMaterializeTiming,
            postMaterializationValidation: postMaterializationValidation === null
              ? null
              : Object.freeze({
                  status: postMaterializationValidation.status,
                  accepted: postMaterializationValidation.accepted,
                  issueCount: postMaterializationValidation.issues.length
                }),
            materializedFileSummary: summaryMeasured.timing
          }),
          stdout: execution?.stdout ?? null,
          fulfillment_assessments: assessmentIds.map((assessmentId) =>
            Object.freeze({
              id: assessmentId,
              evaluator: assessmentId,
              fulfillment_status: dispatchAccepted ? "fulfilled" : "blocked",
              fulfillment_detail: dispatchAccepted
                ? \`ABG-called dispatch accepted \${expectedStage} for the software-build traversal under the reusable odd_glc overlay graph.\`
                : \`ABG-called dispatch blocked \${expectedStage} because observed execution evidence did not satisfy the declared plan.\`,
              blocking_reasons: dispatchAccepted ? [] : (execution?.executionIssues ?? [assessment.reason]),
              evidence_refs: [
                OVERLAY_REF,
                GRAPH_REF,
                GRAPH_FUNCTION_REF,
                T030_STRENGTH_REF,
                ...expectedNodeTypes
              ]
            })
          ),
          selected_worker_id: \`worker://odd_glc/software-build/\${SCENARIO.key}\`,
          selected_backend: \`backend://\${process.env.ABG_TS_LIVE_AGENT ?? "codex"}\`,
          role_id: "role://odd_glc/software-build/live-fp",
          assignment_source: \`policy://odd_glc/software-build/\${SCENARIO.key}\`,
          resolved_runtime_ref: \`runtime://odd_glc/software-build/\${SCENARIO.key}\`,
          transport: Object.freeze({
            status: transport.status,
            command: transport.command,
            executorProfile: transport.executorProfile,
            terminalSessionId: transport.terminalSessionId,
            traceResultPath: transport.traceResultPath,
            outputPath: transport.outputPath,
            instructionPromptManifestRef: pluginInput.instructionPromptManifest.manifestRef,
            instructionPromptDigest: pluginInput.instructionPromptManifest.promptDigest,
            structuredEventCount: transport.structuredEventCount,
            apiRetryCount: transport.apiRetryCount,
            toolCallCount: transport.toolCallCount,
            failureClass: transport.failureClass
          }),
          postMaterializationValidation
        });
        await writeAttemptAndLatestJson(runRoot, baseLabel, label, "artifact", artifact);
        return constructFpDispatchOutcome({
          status: dispatchAccepted ? "dispatched" : "blocked",
          resultRef: dispatchAccepted ? \`result://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}\` : null,
          attachedResultArtifact: artifact,
          reason: dispatchAccepted ? null : assessment.reason,
          evidenceRefs: [
            OVERLAY_REF,
            GRAPH_REF,
            GRAPH_FUNCTION_REF,
            ...expectedNodeTypes
          ]
        });
      }
    });
    const fpEvaluator = Object.freeze({
      contract: {
        ...defaultFpEvaluatorPlugin.contract,
        ref: "plugin://odd_glc/software-build/live-fp-evaluator"
      },
      evaluate: async (pluginInput) => {
        const runRoot = path.join(workspaceRoot, ".ai-workspace", "glc-software-build-live", SCENARIO.key);
        await mkdir(runRoot, { recursive: true });
        const baseLabel = \`\${SCENARIO.key}-vector-\${pluginInput.vectorIndex}-evaluator\`;
        const label = \`\${baseLabel}\${attemptSuffixFor(pluginInput)}\`;
        const executorProfile = process.env.ABG_TS_AGENT_EXECUTOR_PROFILE ?? "local-spawn";
        if (pluginInput.instructionPromptManifest === null) {
          return constructFpEvaluationOutcome({
            status: "blocked",
            reason: "ABG instruction prompt manifest is required for live F_P evaluation",
            evidenceRefs: [pluginInput.sourceProjectionRef]
          });
        }
        await writeAttemptAndLatestJson(
          runRoot,
          baseLabel,
          label,
          "instruction-manifest",
          pluginInput.instructionPromptManifest
        );
        const transport = await runAgentTransport({
          contract: contractForKnownAgent(process.env.ABG_TS_LIVE_AGENT ?? "codex"),
          prompt: pluginInput.instructionPromptManifest.renderedPrompt,
          responseJsonSchema: evaluateResponseJsonSchema(STAGE_PLAN[pluginInput.vectorIndex]),
          cwd: workspaceRoot,
          archiveRoot: runRoot,
          label,
          executorProfile,
          ...(executorProfile === "pty-terminal" ? { terminalSessionKey: label } : {}),
          timeoutMs: Number.parseInt(process.env.ABG_TS_LIVE_TIMEOUT_MS ?? "240000", 10),
          outputPath: path.join(runRoot, \`\${label}-output.txt\`),
          promptPath: path.join(runRoot, \`\${label}-prompt.txt\`),
          stdoutPath: path.join(runRoot, \`\${label}-stdout.log\`),
          stderrPath: path.join(runRoot, \`\${label}-stderr.log\`)
        });
        if (transport.status !== 0 || transport.failureClass !== null) {
          return evaluatorTransportFailureOutcome(pluginInput, transport, label);
        }
        if (executorProfile === "pty-terminal" && transport.terminalSessionId === null) {
          return constructFpEvaluationOutcome({
            status: "blocked",
            reason: "pty-terminal evaluator proof must record a terminalSessionId",
            evidenceRefs: [pluginInput.sourceProjectionRef]
          });
        }
        const review = extractJsonObject(
          transport.text,
          parseReviewJson,
          "GLC live evaluator did not return parseable review JSON"
        );
        const accepted = acceptedReviewFor(pluginInput, review);
        const closeDisposition = accepted ? closeDispositionFromReview(review) : "retry";
        const evidenceRefs = [
          pluginInput.sourceProjectionRef,
          \`evidence://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator\`
        ];
        await writeAttemptAndLatestJson(runRoot, baseLabel, label, "review", {
          review,
          accepted,
          transport: {
            status: transport.status,
            command: transport.command,
            executorProfile: transport.executorProfile,
            terminalSessionId: transport.terminalSessionId,
            traceResultPath: transport.traceResultPath,
            outputPath: transport.outputPath,
            structuredEventCount: transport.structuredEventCount,
            apiRetryCount: transport.apiRetryCount,
            toolCallCount: transport.toolCallCount,
            failureClass: transport.failureClass
          }
        });
        return constructFpEvaluationOutcome({
          status: "evaluated",
          ambiguityStatus: accepted ? "fulfilled" : "partial",
          findings: [
            constructFpEvaluationFinding({
              findingRef: \`finding://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator/\${sha256Text(JSON.stringify(review))}\`,
              evaluatorRef: "plugin://odd_glc/software-build/live-fp-evaluator",
              gainReportRef: \`gain://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator\`,
              metricRefs: [
                \`metric://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator/accepted-\${accepted ? "true" : "false"}\`
              ],
              closeDisposition,
              residualPressureRefs: accepted ? [] : [
                \`residual://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator\`
              ],
              continuationRefs: accepted ? [] : [
                \`continuation://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/retry\`
              ],
              evidenceRefs,
              authorityRefs: [
                \`authority://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator\`,
                ...pluginInput.expectedAssessmentIds
              ],
              compositionContributionRef: pluginInput.selectedRegimeBindingRef ?? pluginInput.selectedCompositionRef,
              compositionRef: pluginInput.selectedCompositionRef,
              compositionDigest: pluginInput.selectedCompositionDigest,
              diagnosticRefs: [
                \`diagnostic://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator\`
              ],
              executiveDisposition: accepted ? "close_candidate" : "local_repair"
            })
          ],
          evidenceRefs,
          diagnosticRefs: [
            \`diagnostic://odd_glc/software-build/\${SCENARIO.key}/\${pluginInput.vectorIndex}/live-evaluator\`
          ],
          reason: typeof review.reason === "string"
            ? review.reason
            : "live fp evaluator reviewed worker candidate material"
        });
      }
    });
    // 4.5 CONSEQUENCE RE-ENTRY (declared family depth_traversal):
    // when the repaired execution keeps failing, the consequence stage
    // emits a traversal action landing at the CODE vector — the engine
    // admits it through the declared catalog and re-enters upstream
    // (GOALS 4.5 bar: convergence THROUGH upstream re-entry).
    const repairReentryTarget = resolveRepairReentryTargetRow();
    const REPAIR_REENTRY_BUDGET = 2;
    const consequenceProjection = Object.freeze({
      contract: constructEnginePluginContract({
        ref: "plugin://odd_glc/software-build/consequence-reentry",
        pluginKind: "consequence_projection",
        authority: "effect_plugin",
        inputCarrier: "EnginePluginInput",
        outputCarrier: "ConsequenceProjectionOutcome"
      }),
      project(input) {
        const reentryState = readRepairReentryState(workspaceRoot);
        const pressure = reentryState.pressure;
        if (
          pressure !== null &&
          input.vectorIndex === pressure.vectorIndex &&
          reentryState.reentryCount < REPAIR_REENTRY_BUDGET
        ) {
          // refs come from the declared stage plan at template-runtime;
          // the engine's landing validates reentryTargetRef against the
          // basis graph (parseConsequenceReentryTarget). A ROUTING
          // PLUGIN MUST NEVER KILL THE RUN (F1): any resolution failure
          // falls through to the no-action projection below.
          const reentryRow = repairReentryTarget?.row;
          if (repairReentryTarget === null || reentryRow === undefined) {
            return {
              kind: "consequence_projection",
              status: "projected",
              consequenceRef: "consequence://odd_glc/software-build/reentry-unavailable",
              domainReadModelRefs: [],
              traversalAction: null,
              evidenceRefs: ["evidence://odd_glc/software-build/reentry-target-unresolved"],
              reason: "re-entry target row unresolved; advancing without re-entry"
            };
          }
          const consumedCount = reentryState.reentryCount + 1;
          writeRepairReentryState(workspaceRoot, { pressure: null, reentryCount: consumedCount });
          return {
            kind: "consequence_projection",
            status: "projected",
            consequenceRef: "consequence://odd_glc/software-build/repaired-execution-failure",
            domainReadModelRefs: ["read-model://odd_glc/software-build/repaired-execution-failure"],
            traversalAction: {
              kind: "consequence_traversal_action",
              actionRef: "action://odd_glc/software-build/repair-reentry-" + String(consumedCount),
              consequenceRef: "consequence://odd_glc/software-build/repaired-execution-failure",
              strategyDecisionRef: "strategy-decision://odd_glc/software-build/repair-to-code",
              parentObligationRef: "obligation://odd_glc/software-build/tests-pass",
              actionKind: "reenter_graph_span",
              selectedTraversalFamily: "depth_traversal",
              selectedGraphFunctionRef: softwareBuildBootstrap.id,
              selectedOverlayRef: "overlay://odd_glc/software-build-lifecycle",
              selectedRefinementBoundaryRef: "refinement-boundary://odd_glc/software-build/repair-to-code",
              sourceNodeRef: "node://odd_glc/software-build/" + reentryRow.sourceName,
              targetNodeRef: "node://odd_glc/software-build/" + reentryRow.targetName,
              graphVectorRef: reentryRow.vectorId,
              graphSpanRef: "graph-span://odd_glc/software-build/code-to-repaired-execution",
              reentryTargetRef: "graph-reentry-point://realization/" + String(repairReentryTarget.index),
              targetOutcomeRef: "outcome://odd_glc/software-build/repaired-execution-passing",
              inputAssetRefs: ["asset://odd_glc/software-build/failing-execution-evidence"],
              expectedOutputAssetRefs: ["asset://odd_glc/software-build/passing-test-execution"],
              requiredAuthorityRefs: ["REQ-R-ABG3-ITERATION-009"],
              proportionalityBasisRefs: ["proportionality://odd_glc/software-build/repair-reentry"],
              evidencePolicyRef: "evidence-policy://odd_glc/software-build/execution-evidence",
              foldbackPolicyRef: "foldback-policy://odd_glc/software-build/repaired-execution",
              nonAdmissionReasonRefs: []
            },
            evidenceRefs: ["evidence://odd_glc/software-build/repaired-execution-failure"],
            reason: pressure.reason
          };
        }
        return {
          kind: "consequence_projection",
          status: "projected",
          consequenceRef: "consequence://odd_glc/software-build/pass/" + String(input.vectorIndex),
          domainReadModelRefs: [],
          traversalAction: null,
          evidenceRefs: ["evidence://odd_glc/software-build/pass/" + String(input.vectorIndex)],
          reason: null
        };
      }
    });
    // T-200 P4 upstream: the substrate converts plugin throws into typed
    // blocked outcomes (contract_failure) at the executor — the local
    // guards are retired; failures are events by engine law now.
    return Object.freeze({
      fpDispatch,
      fpEvaluator,
      consequenceProjection
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

  // T-030 run-18 spec: ODD_GLC_LIVE_RESUME=<runRoot> reuses the existing
  // workspace — engine re-entry continues from the replay frontier
  // (closed C calls stay closed; a fixed defect costs one stage, not a
  // full re-proof). Install/binding are skipped; start re-invokes.
  const resumeRoot = process.env.ODD_GLC_LIVE_RESUME ?? null;
  const resuming = resumeRoot !== null && resumeRoot.length > 0;
  const runRoot = resuming ? resumeRoot : path.join(liveRoot, scenario.key, timestampId());
  const workspaceRoot = path.join(runRoot, "instance");
  if (resuming) {
    const identityPath = path.join(runRoot, "sandbox-identity.json");
    assert.equal(
      existsSync(identityPath),
      true,
      `ODD_GLC_LIVE_RESUME target is not a sandbox run root: ${runRoot}`
    );
    // F3: a resume must never regenerate the binding for a DIFFERENT
    // scenario into a reused workspace.
    const priorIdentity = JSON.parse(readFileSync(identityPath, "utf8"));
    assert.equal(
      priorIdentity.scenarioId,
      scenario.scenarioId,
      `ODD_GLC_LIVE_RESUME scenario mismatch: workspace is ${priorIdentity.scenarioId}, selected ${scenario.scenarioId}`
    );
  }
  const toolchainRoot = path.join(runRoot, "toolchain");
  const oddGlcProductRoot = path.join(runRoot, "products", "odd_glc", ODD_GLC_INSTALL_VERSION);
  const oddGlcPackageRoot = path.join(oddGlcProductRoot, "lib", "node_modules", "@odd-glc", "route-one-typescript");
  await mkdir(workspaceRoot, { recursive: true });
  const requestedExecutorProfile = process.env.ABG_TS_AGENT_EXECUTOR_PROFILE ?? "local-spawn";
  const sandboxIdentity = Object.freeze({
    kind: "odd_glc_abg42_software_build_live_sandbox",
    schemaVersion: "1",
    proofClass: requestedExecutorProfile === "pty-terminal"
      ? "live_terminal_abg_traversal_sandbox"
      : "live_worker_local_spawn_abg_traversal_sandbox",
    scenarioProofClass: scenario.proofClass,
    scenarioId: scenario.scenarioId,
    scenarioKind: scenario.kind,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    graphRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef,
    graphFunctionRef: scenario.graphFunctionRef ?? ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget,
    runRoot,
    workspaceRoot,
    toolchainRoot,
    oddGlcProductRoot,
    oddGlcPackageRoot,
    oddGlcPackageName: ODD_GLC_INSTALL_PACKAGE_NAME,
    oddGlcPackageVersion: ODD_GLC_INSTALL_VERSION,
    subjectWriteRoot: workspaceRoot,
    requestedExecutorProfile,
    terminalProofRequired: requestedExecutorProfile === "pty-terminal",
    authorityRule: "ABG owns install, startup admission, registry projection, selection, graph-call opening, traversal, F_P invocation, event emission, and replay truth. odd_glc supplies declaration data and read interpretation only."
  });
  let oddGlcInstall;
  if (!resuming) {
    await writeText(path.join(runRoot, "sandbox-identity.json"), `${JSON.stringify(sandboxIdentity, null, 2)}\n`);
    await writeText(
      path.join(workspaceRoot, ".ai-workspace", "sandbox-identity.json"),
      `${JSON.stringify(sandboxIdentity, null, 2)}\n`
    );
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
    oddGlcInstall = await installOddGlcProductForSandbox({
      runRoot,
      workspaceRoot,
      tenantRoot,
      substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate
    });
    assert.equal(oddGlcInstall.packageRoot, oddGlcPackageRoot);
  } else {
    // P0 (codex): the resume path reconstructs the install record from
    // the durable manifests written at install time — proof assembly
    // uses the SAME shape on both paths.
    const manifestPath = path.join(oddGlcProductRoot, "odd-glc-install-manifest.json");
    const workspaceManifestPath = path.join(workspaceRoot, ".odd_glc", "install-manifest.json");
    assert.equal(existsSync(manifestPath), true, `resume requires ${manifestPath}`);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    oddGlcInstall = Object.freeze({
      manifest,
      manifestPath,
      workspaceManifestPath,
      aiWorkspaceManifestPath: path.join(workspaceRoot, ".ai-workspace", "odd-glc-install-manifest.json"),
      productRoot: oddGlcProductRoot,
      packageRoot: oddGlcPackageRoot
    });
  }
  // the binding regenerates on RESUME too (idempotent; carries current
  // framework-side binding fixes into the reused workspace)
  await writeRuntimeBinding({
    abgPackageRoot,
    oddGlcPackageRoot,
    scenario,
    workspaceRoot
  });
  const runtimeBindingPath = path.join(workspaceRoot, ".abiogenesis", "typescript-runtime.mjs");
  assert.equal(existsSync(runtimeBindingPath), true, `missing runtime binding at ${runtimeBindingPath}`);
  const startedAt = Date.now();
  const start = runForEvidence(
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
        ABG_TS_LIVE_AGENT: process.env.ABG_TS_LIVE_AGENT ?? "codex",
        ABG_TS_LIVE_TIMEOUT_MS: process.env.ABG_TS_LIVE_TIMEOUT_MS ?? "240000"
      }
    }
  );
  const durationMs = Date.now() - startedAt;
  const startStdoutPath = path.join(runRoot, "genesis-start-stdout.log");
  const startStderrPath = path.join(runRoot, "genesis-start-stderr.log");
  await writeText(startStdoutPath, start.stdout ?? "");
  await writeText(startStderrPath, start.stderr ?? "");
  const startOutput = parseCliStartOutput(start.stdout);
  const events = parseJsonLines(await readFile(startOutput.events_path, "utf8"));
  const eventCounts = Object.freeze(events.reduce((counts, event) => {
    const kind = typeof event.kind === "string" ? event.kind : "unknown";
    counts[kind] = (counts[kind] ?? 0) + 1;
    return counts;
  }, {}));
  const terminalEvents = Object.freeze(events.filter((event) =>
    event.kind === "terminal_reached" ||
      event.kind === "converged" ||
      event.kind === "gap_stop" ||
      event.kind === "blocked" ||
      event.kind === "graph_call_closed"
  ).map((event, index) => Object.freeze({
    index,
    kind: event.kind,
    detail: event.detail ?? event.reason ?? event.status ?? null,
    vectorIndex: event.vectorIndex ?? null,
    eventTime: event.eventTime ?? null,
    eventTimeUnixMs: event.eventTimeUnixMs ?? null,
    eventAdmissionOrdinal: event.eventAdmissionOrdinal ?? null
  })));
  const proof = {
    kind: "odd_glc_software_build_overlay_live_proof",
    scenarioId: scenario.scenarioId,
    scenarioKind: scenario.kind,
    proofClass: scenario.proofClass,
    durationMs,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    graphRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.graphRef,
    graphFunctionRef: scenario.graphFunctionRef ?? ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget,
    sandboxIdentity,
    oddGlcInstallManifestPath: oddGlcInstall.manifestPath,
    oddGlcWorkspaceInstallManifestPath: oddGlcInstall.workspaceManifestPath,
    oddGlcPackageRoot: oddGlcInstall.packageRoot,
    oddGlcInstallFileSha256s: oddGlcInstall.manifest.copiedFiles.map((file) => file.sha256),
    runtimeBindingPath,
    workspaceRoot,
    startOutput,
    startProcess: Object.freeze({
      status: start.status,
      signal: start.signal,
      error: start.error?.message ?? null,
      stdoutPath: startStdoutPath,
      stderrPath: startStderrPath
    }),
    externalAbgStartInvocationCount: 1,
    abgInvocationShape: "single installed genesis-ts start --until converged per scenario; ABG owns internal graph-call opening, vector traversal, F_P dispatch, event emission, closure, and convergence",
    eventLogSha256: sha256Text(await readFile(startOutput.events_path, "utf8")),
    eventCounts,
    terminalEvents,
    // T-030 read-only lineage canary: replay-derived per-requirement /
    // per-vector lineage rows. Dropped required obligations fail the run
    // and route to ABI/GTL root-cause repair; the canary is diagnostic
    // proof instrumentation, never an odd_glc responsibility surface.
    requirementLineageCanary: deriveRequirementLineageCanary({ events }),
    dataMapperGate:
      "this run unlocks, but does not substitute for, the full data-mapper run",
    sandboxRole: "scenario_runner_only",
    postProcessRule: "Sandbox live tests start the installed scenario and preserve ABG replay/process evidence only. Content depth, artifact adequacy, shallowness, and root-cause judgement are post-process review or active monitoring over replay truth, not sandbox-owned closure.",
    eventSequence: events.map((event, index) => Object.freeze({
      index,
      kind: event.kind,
      edge: event.edge ?? null,
      vectorIndex: event.vectorIndex ?? null,
      graphFunctionRef: event.graphFunctionRef ?? null,
      eventTime: event.eventTime ?? null,
      eventTimeUnixMs: event.eventTimeUnixMs ?? null,
      eventAdmissionOrdinal: event.eventAdmissionOrdinal ?? null
    }))
  };
  await writeText(
    path.join(runRoot, "odd-glc-software-build-overlay-live-proof.json"),
    `${JSON.stringify(proof, null, 2)}\n`
  );
  return Object.freeze({ durationMs, events, proof, runRoot, startOutput, workspaceRoot });
}

for (const scenario of selectedScenarios()) {
  test(`runs ${scenario.scenarioId} through the odd_glc software-build GTL overlay graph`, async (t) => {
    if (!liveEnabled()) {
      t.skip("set CODEX_LIVE_FP=1 or ODD_GLC_GTL_ABG_HELLO_WORLDS_LIVE=1 to run live-worker GLC Hello Worlds; add ABG_TS_AGENT_EXECUTOR_PROFILE=pty-terminal for live-terminal proof");
      return;
    }
    const result = await runScenarioLive(scenario);
    const selectedGraphFunctionRef = scenario.graphFunctionRef ?? ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget;
    const graphFunctionEntry = ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.find((entry) =>
      entry.graphFunctionRef === selectedGraphFunctionRef
    );
    assert.ok(graphFunctionEntry);
    const view = interpretStartupRegistryState({
      proof: { startOutput: result.startOutput },
      runtimeEvents: result.events
    });

    assert.equal(result.proof.sandboxIdentity.kind, "odd_glc_abg42_software_build_live_sandbox");
    assert.equal(result.proof.sandboxIdentity.workspaceRoot, result.workspaceRoot);
    assert.equal(existsSync(path.join(result.runRoot, "sandbox-identity.json")), true);
    assert.equal(existsSync(path.join(result.workspaceRoot, ".ai-workspace", "sandbox-identity.json")), true);
    assert.equal(existsSync(result.proof.oddGlcInstallManifestPath), true);
    assert.equal(existsSync(result.proof.oddGlcWorkspaceInstallManifestPath), true);
    assert.equal(existsSync(path.join(result.proof.oddGlcPackageRoot, "src", "index.mjs")), true);
    assert.equal(result.proof.sandboxIdentity.oddGlcPackageRoot, result.proof.oddGlcPackageRoot);
    assert.equal(result.proof.sandboxIdentity.oddGlcPackageName, ODD_GLC_INSTALL_PACKAGE_NAME);
    assert.equal(result.proof.sandboxIdentity.oddGlcPackageVersion, ODD_GLC_INSTALL_VERSION);
    assert.equal(
      (await readFile(result.proof.runtimeBindingPath, "utf8")).includes(path.join(tenantRoot, "src", "index.mjs")),
      false
    );
    assert.equal(result.startOutput.command, "start");
    assert.equal(result.startOutput.stopped_by, "converged");
    assert.equal(result.proof.startProcess.status, 0);
    assert.equal(existsSync(result.proof.startProcess.stdoutPath), true);
    assert.equal(existsSync(result.proof.startProcess.stderrPath), true);
    assert.equal(result.proof.externalAbgStartInvocationCount, 1);
    assert.match(result.proof.abgInvocationShape, /single installed genesis-ts start --until converged/u);
    assert.equal(result.proof.sandboxRole, "scenario_runner_only");
    // T-030 lineage canary law: dropped required obligations are zero, or
    // the run fails here and the fix belongs in ABI/GTL root-cause repair.
    const canary = result.proof.requirementLineageCanary;
    assert.equal(canary.role, "diagnostic_proof_instrumentation_read_only");
    assert.deepEqual([...canary.droppedRequirementIds], []);
    // T-030 reopen (codex HIGH): requirement pressure must ENTER the
    // prompt for reached requirement-bearing vectors — mechanical
    // presence on the typed requirementPressureRefs manifest field.
    // Whether the worker honoured it is F_P evaluator judgment.
    assert.deepEqual([...canary.pressureMissingRequirementIds], []);
    if ((result.proof.eventCounts.requirement_route_fact_projected ?? 0) > 0) {
      assert.notEqual(canary.requirements.length, 0);
    }
    assert.match(
      result.proof.dataMapperGate,
      /unlocks, but does not substitute for, the full data-mapper run/u
    );
    assert.match(result.proof.postProcessRule, /preserve ABG replay\/process evidence only/u);
    assert.equal(result.startOutput.event_kinds.includes("registry_entry_admitted"), true);
    assert.equal(result.startOutput.event_kinds.includes("graph_function_selected"), true);
    assert.equal(result.startOutput.event_kinds.includes("graph_call_opened"), true);
    assert.equal(Number.isInteger(result.proof.eventCounts.registry_entry_admitted), true);
    assert.equal(Number.isInteger(result.proof.eventCounts.graph_function_selected), true);
    assert.equal(Number.isInteger(result.proof.eventCounts.graph_call_opened), true);
    assert.equal(Array.isArray(result.proof.terminalEvents), true);
    assert.equal(result.proof.eventSequence.length, result.events.length);
    assert.equal(view.status, "accepted");
    assert.equal(view.value.readiness, "traversal_converged");
    assert.equal(view.value.graphFunctionEntryRefs.includes(graphFunctionEntry.entryRef), true);
    assert.equal(view.value.selectedGraphFunctionRefs.includes(selectedGraphFunctionRef), true);
    assert.equal(view.value.selectedEntryKinds.includes("graph_function"), true);
    assert.equal(view.value.selectedEntryKinds.includes("node_type"), false);
    assert.equal(
      result.events.findIndex((event) => event.kind === "graph_function_selected") <
        result.events.findIndex((event) => event.kind === "graph_call_opened"),
      true
    );
  });
}

// ─── F2: THE BINDING UNIT LANE (default suite, no live env) ───
// Generates the data-mapper binding, verifies GENERATION FIDELITY
// (parses; no template-mangling signatures), imports it in-process, and
// drives the pure surfaces with the campaign's own failure shapes.

test("binding unit lane: generation fidelity — parses, no mangled templates, declarations present", async () => {
  const scenario = SCENARIOS.find((row) => row.key === "data-mapper-full");
  assert.ok(scenario);
  const unitRoot = path.join(liveRoot, "binding-unit", timestampId());
  const workspaceRoot = path.join(unitRoot, "instance");
  await mkdir(path.join(workspaceRoot, ".abiogenesis"), { recursive: true });
  const bindingPath = await writeRuntimeBinding({
    abgPackageRoot: defaultAbgPackageRoot,
    oddGlcPackageRoot: tenantRoot,
    scenario,
    workspaceRoot
  });
  const source = readFileSync(bindingPath, "utf8");
  // parses as a module
  const check = spawnSync(process.execPath, ["--check", bindingPath], { encoding: "utf8" });
  assert.equal(check.status, 0, check.stderr);
  // the escape-discipline class, pinned forever (#10b, #15 signatures)
  assert.equal(source.includes("value.replace(/${("), false, "#10b mangled-regex signature");
  assert.doesNotMatch(source, /[^"'`\w.]DATA_MAPPER_SCALA_JAVA11_HOME\b/, "#15 bare test-scope identifier");
  // the 4.5 declarations are data in the binding
  for (const key of ["abg.hog_program_catalog", "abg.hog_program_ladder", "abg.consequence.allowed_traversal_families"]) {
    assert.equal(source.includes(key), true, `missing declaration key ${key}`);
  }
  globalThis.__bindingUnitPath = bindingPath;
});

test("binding unit lane: pure surfaces — plan shape family (#14), compile attribution (#18b), re-entry target (F1)", async (t) => {
  const bindingPath = globalThis.__bindingUnitPath;
  if (!bindingPath) return t.skip("generation test did not run");
  const binding = await import(pathToFileURL(bindingPath).href);
  const { normalizeExecutionPlanShape, attributeCompileErrorLines, resolveRepairReentryTargetRow } = binding;
  assert.equal(typeof normalizeExecutionPlanShape, "function");
  // T-031 BUG #3 pin: run-3's live artifact — invocation nested under
  // "execution" — must normalize, not dead-end the retry lane.
  const run3Shape = normalizeExecutionPlanShape({
    stage: "prepare_repaired_test_execution_surface",
    execution: {
      command: "sbt",
      cwd: "build_tenants/scala_spark",
      args: ["test"],
      env: { JAVA_HOME: "/opt/java" }
    },
    expectedTestPassCount: 20
  });
  assert.equal(run3Shape.issue, null);
  assert.equal(run3Shape.plan.command, "sbt");
  assert.deepEqual([...run3Shape.plan.args], ["test"]);
  assert.equal(run3Shape.plan.cwd, "build_tenants/scala_spark");
  // #14 shapes: flat, nested envelope, argv array, malformed, missing
  const flat = normalizeExecutionPlanShape({ command: "sbt", args: ["test"], env: {} });
  assert.equal(flat.issue, null);
  assert.equal(flat.plan.command, "sbt");
  const nested = normalizeExecutionPlanShape({
    scenario: "x", testExecution: { command: "sbt", args: ["test"], cwd: "w" }
  });
  assert.equal(nested.issue, null);
  assert.equal(nested.plan.cwd, "w");
  const argv = normalizeExecutionPlanShape({ command: ["sbt", "test"] });
  assert.equal(argv.issue, null);
  assert.deepEqual([argv.plan.command, argv.plan.args], ["sbt", ["test"]]);
  const malformed = normalizeExecutionPlanShape({ command: { scenario: "oops" } });
  assert.match(malformed.issue, /Malformed execution plan/);
  assert.equal(normalizeExecutionPlanShape(null).issue, "missing_plan");
  // #18b: block-level attribution with continuation + trailing summary lines
  const scalac = [
    "[error] /w/build_tenants/scala_spark/cdme-engine/src/main/scala/com/cdme/engine/CdmeEngineRunner.scala:40:25: overloaded method",
    "[error]   [A <: Product](data: Seq[A])...",
    "[error]  cannot be applied to (Seq[String])",
    "[error] one error found"
  ];
  const mainOnly = attributeCompileErrorLines(scalac);
  assert.equal(mainOnly.testSurfaceErrors.length, 0, "continuations inherit main attribution");
  assert.equal(mainOnly.mainSourceErrors.length, 4);
  const mixed = attributeCompileErrorLines([
    ...scalac,
    "[error] /w/build_tenants/scala_spark/cdme-core/src/test/scala/com/cdme/core/CoreContractsSpec.scala:69:1: Missing closing brace",
    "[error] two errors found"
  ]);
  assert.equal(mixed.testSurfaceErrors.length, 2, "test block owns its continuation/summary");
  const unattributed = attributeCompileErrorLines(["[error] stack trace suppressed"]);
  assert.equal(unattributed.testSurfaceErrors.length, 1, "unattributable fails closed to blocking");
  // F1: the re-entry target resolves by NAME with full row fields
  const target = resolveRepairReentryTargetRow();
  assert.notEqual(target, null);
  assert.equal(target.index >= 0, true);
  assert.equal(typeof target.row.vectorId, "string");
});

test("binding unit lane: the verify-only execution path runs — honest results verify, fabrications fail, absence throws the law (review B HIGH-1 pin)", async (t) => {
  const bindingPath = globalThis.__bindingUnitPath;
  if (!bindingPath) return t.skip("generation test did not run");
  const binding = await import(pathToFileURL(bindingPath).href);
  assert.equal(typeof binding.executePlannedScenario, "function");
  const caseRoot = path.join(path.dirname(bindingPath), "..", "verify-only", timestampId());
  // (a) missing result file: throws the execution-default law message
  const missingRoot = path.join(caseRoot, "missing");
  await mkdir(missingRoot, { recursive: true });
  await assert.rejects(
    () => binding.executePlannedScenario(missingRoot),
    /worker must RUN the declared command in its turn/u
  );
  // the SCENARIO pins the eight report paths and the pass count — the
  // worker-declared expectations are ignored where the contract speaks
  const reportBase = "build_tenants/scala_spark";
  const writeReports = async (root, failuresInFirst) => {
    for (const [index, rel] of DATA_MAPPER_SCALA_TEST_REPORTS.entries()) {
      const full = path.join(root, reportBase, rel);
      await mkdir(path.dirname(full), { recursive: true });
      const failures = index === 0 ? failuresInFirst : 0;
      await writeFile(full, `<testsuite tests="3" failures="${failures}" errors="0" skipped="0"></testsuite>`, "utf8");
    }
  };
  const resultJson = (status) => JSON.stringify({
    command: "sbt", args: ["test"], cwd: reportBase, status,
    // the worker LIES about its own bar here — the scenario contract wins
    expectedTestPassCount: 1,
    expectedTestReportPaths: [DATA_MAPPER_SCALA_TEST_REPORTS[0]],
    assertedReturnValue: "data_mapper_full_sbt ok",
    stdout: ""
  });
  // (b) honest run: all eight reports on disk, 24 >= 20 passes: verifies
  const honestRoot = path.join(caseRoot, "honest");
  await writeReports(honestRoot, 0);
  await writeFile(path.join(honestRoot, "test-execution-result.json"), resultJson(0), "utf8");
  const honest = await binding.executePlannedScenario(honestRoot);
  assert.equal(honest.planSatisfied, true);
  assert.equal(honest.observedTestPassCount >= 20, true);
  assert.equal(honest.commands[0].workerExecuted, true);
  // (c) fabricated claims with NO reports on disk: fails closed even
  // though the worker declared a one-report bar for itself
  const forgedRoot = path.join(caseRoot, "forged");
  await mkdir(forgedRoot, { recursive: true });
  await writeFile(path.join(forgedRoot, "test-execution-result.json"), resultJson(0), "utf8");
  const forged = await binding.executePlannedScenario(forgedRoot);
  assert.equal(forged.planSatisfied, false);
  assert.equal(forged.missingReportPaths.length, DATA_MAPPER_SCALA_TEST_REPORTS.length);
  // (d) a failing report on disk defeats a green claim
  const redRoot = path.join(caseRoot, "red");
  await writeReports(redRoot, 2);
  await writeFile(path.join(redRoot, "test-execution-result.json"), resultJson(0), "utf8");
  const red = await binding.executePlannedScenario(redRoot);
  assert.equal(red.planSatisfied, false);
  assert.equal(red.failingReportPaths.length > 0, true);
});

test("binding unit lane: #10b expansion behavior, P1b durable re-entry state, P2a uncapped attribution", async (t) => {
  const bindingPath = globalThis.__bindingUnitPath;
  if (!bindingPath) return t.skip("generation test did not run");
  const binding = await import(pathToFileURL(bindingPath).href);
  const {
    expandEnvTemplates,
    attributeCompileErrorLines,
    readRepairReentryState,
    writeRepairReentryState,
    resolveRepairReentryTargetRow
  } = binding;
  // #10b BEHAVIOR: templates expand against the BASE env, unknown -> ""
  const expanded = expandEnvTemplates(
    { PATH: "/opt/j11/bin:${PATH}", JAVA_HOME: "/opt/j11", RAW: 7, MISSING: "${NOT_A_VAR}" },
    { PATH: "/usr/bin" }
  );
  assert.equal(expanded.PATH, "/opt/j11/bin:/usr/bin");
  assert.equal(expanded.JAVA_HOME, "/opt/j11");
  assert.equal(expanded.RAW, 7);
  assert.equal(expanded.MISSING, "");
  // P2a: a test-source error BEYOND the old 16-line cap still blocks
  const manyMain = Array.from({ length: 20 }, (unused, index) =>
    `[error] /w/build_tenants/scala_spark/m${index}/src/main/scala/M${index}.scala:1:1: bad`);
  const lateTest = attributeCompileErrorLines([
    ...manyMain,
    "[error] /w/build_tenants/scala_spark/core/src/test/scala/Spec.scala:9:1: Missing closing brace"
  ]);
  assert.equal(lateTest.testSurfaceErrors.length, 1, "late test-source error must remain visible");
  // P1b: durable state round-trip in an isolated workspace
  const stateRoot = path.join(liveRoot, "binding-unit", `state-${timestampId()}`);
  await mkdir(stateRoot, { recursive: true });
  assert.deepEqual(readRepairReentryState(stateRoot), { pressure: null, reentryCount: 0 });
  writeRepairReentryState(stateRoot, { pressure: { vectorIndex: 21, reason: "failing" }, reentryCount: 1 });
  const readBack = readRepairReentryState(stateRoot);
  assert.equal(readBack.pressure.vectorIndex, 21);
  assert.equal(readBack.reentryCount, 1);
  writeRepairReentryState(stateRoot, { pressure: null, reentryCount: 2 });
  assert.deepEqual(readRepairReentryState(stateRoot), { pressure: null, reentryCount: 2 });
  // and the re-entry ref format the engine's landing parses
  const target = resolveRepairReentryTargetRow();
  assert.match(`graph-reentry-point://realization/${target.index}`, /^graph-reentry-point:\/\/[^/]+\/[0-9]+$/);
});

test("binding unit lane T-031: typed CDME requirements declared — 8 concerns, creating+proving spans, per-concern shapes, 5 depth classes", async () => {
  const scenario = SCENARIOS.find((row) => row.key === "data-mapper-full");
  const unitRoot = path.join(liveRoot, "binding-unit", timestampId());
  const workspaceRoot = path.join(unitRoot, "instance");
  await mkdir(path.join(workspaceRoot, ".abiogenesis"), { recursive: true });
  const bindingPath = await writeRuntimeBinding({
    abgPackageRoot: defaultAbgPackageRoot,
    oddGlcPackageRoot: tenantRoot,
    scenario,
    workspaceRoot
  });
  const { runtimeBinding } = await import(pathToFileURL(bindingPath).href);
  const bundle = runtimeBinding.requirementRouteDeclarationBundle;
  assert.equal(bundle.requirements.length, 8);
  assert.equal(bundle.spans.length, 8);
  const requirementIds = bundle.requirements.map((row) => row.requirementId).sort();
  assert.deepEqual(requirementIds, [
    "REQ-CDME-ACCOUNTING", "REQ-CDME-ADJOINT", "REQ-CDME-ASSURANCE",
    "REQ-CDME-CORE", "REQ-CDME-ENGINE", "REQ-CDME-EXECUTOR",
    "REQ-CDME-FIDELITY", "REQ-CDME-TOPOLOGY"
  ]);
  // spans cover the CREATING vectors (uat testcases, component tests) and
  // the PROVING vectors (execution + repaired execution) — 4 each
  for (const span of bundle.spans) {
    assert.equal(span.vectorIndexes.length, 4);
  }
  const entries = runtimeBinding.requirementProofCarryThroughStartup.entries;
  assert.equal(entries.length, 8);
  const accounting = entries.find((entry) => entry.requirementIds[0] === "REQ-CDME-ACCOUNTING");
  assert.ok(accounting);
  assert.deepEqual([...accounting.envelopeTemplate.positiveEvidenceShapeRefs],
    ["evidence-shape://cdme/accounting/balanced-partitions-positive"]);
  assert.deepEqual([...accounting.envelopeTemplate.negativeEvidenceShapeRefs],
    ["evidence-shape://cdme/accounting/unbalanced-detected-negative"]);
  assert.equal(accounting.contract.requiredDepthClassRefs.length, 5);
  assert.equal(accounting.contract.requiredDepthClassRefs.includes("depth-class://invariant"), true);
  // every entry produces coverage on the repaired-execution proving edge
  for (const entry of entries) {
    assert.match(entry.edge, /repaired_test_execution_result/u);
  }
  // hello-world scenarios keep the single generic requirement (fallback)
  const basic = SCENARIOS.find((row) => row.key === "basic-cli");
  assert.equal(basic.cdmeRequirements, undefined);
});
