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
  ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_GRAPH_FUNCTION_REF,
  ODD_GLC_SOFTWARE_BUILD_FULL_LIFECYCLE_STAGE_PLAN,
  ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF,
  ODD_GLC_SOFTWARE_BUILD_SDLC_STAGE_PLAN,
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
    materializedSurfaceCount: input.materializedSurfaceCount ?? 21,
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
          "expectedTestPassCount must be 2.",
          "expectedStdoutMatch must include stable substrings pass 2 and fail 0.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if the execution plan command exited 0, observedTestPassCount is 2, and planSatisfied is true."
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
          "Import helloWorld from ../../src/hello.mjs.",
          "Assert helloWorld() returns exactly \"Hello, world!\"."
        ]
      },
      {
        stage: "uat_test_source",
        filesToProduce: ["test/uat/hello.uat.test.mjs"],
        instructions: [
          "Write only test/uat/hello.uat.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import helloWorld from ../../src/hello.mjs.",
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
          "expectedTestPassCount must be 2.",
          "expectedStdoutMatch must include stable substrings pass 2 and fail 0.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if both component and UAT tests passed, observedTestPassCount is 2, and planSatisfied is true."
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
          "Import helloWorld from ../../src/hello.mjs.",
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
          "Import helloWorld from ../../src/hello.mjs.",
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
          "expectedTestPassCount must be 2.",
          "expectedStdoutMatch must include stable substrings pass 2 and fail 0.",
          "assertedReturnValue must be \"Hello, world!\".",
          "Do not execute the test in this vector."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Judge the observed executionStatus, planSatisfied flag, observedTestPassCount, and stdout digest against the prior test_execution_plan.",
          "Accept only if both component and UAT tests passed, planSatisfied is true, and observedTestPassCount is 2.",
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
          "expectedTestPassCount must be 2.",
          "expectedStdoutMatch must include stable substrings pass 2 and fail 0.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if the planned node:test command exited 0, observedTestPassCount is 2, and planSatisfied is true."
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
          "expectedTestPassCount must be 2.",
          "expectedStdoutMatch must include stable substrings pass 2 and fail 0.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if both service tests passed, observedTestPassCount is 2, and planSatisfied is true."
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
          "Import helloWorld from ../../src/index.mjs.",
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
          "expectedTestPassCount must be 3.",
          "expectedStdoutMatch must include stable substrings pass 3 and fail 0.",
          "assertedReturnValue must be \"Hello, world!\"."
        ]
      },
      {
        stage: "test_execution_result",
        instructions: [
          "Produce no files.",
          "Accept only if the branch and fan-in tests passed, observedTestPassCount is 3, and planSatisfied is true."
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
          "expectedTestPassCount must equal the exact number of test() blocks in the admitted component and UAT test source files.",
          "expectedStdoutMatch must include stable substrings pass N and fail 0, where N is the same expectedTestPassCount value.",
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
          "Accept only if the mapper test plan passed, observedTestPassCount equals the prior test_execution_plan expectedTestPassCount, and planSatisfied is true."
        ]
      }
    ]
  }),
  fullLifecycleComplianceScenario({
    key: "data-mapper-full",
    scenarioId: "SCN-GLC-DATA-MAPPER-FULL-JS",
    kind: "data_mapper_full_node_test",
    expectedStdout: null,
    expectedReturnValue: "data_mapper_full ok",
    artifactTypeRef: "odd_glc.type.software.data_mapping_implementation_bundle",
    stagePlan: [
      {
        stage: "derive_intent_surface",
        filesToProduce: ["specification/intent.md"],
        instructions: [
          "Write only specification/intent.md.",
          "Declare the intent for a generic logical data-mapper lifecycle build.",
          "The mapper must model typed entities, directed morphisms, identity morphisms, and lawful dot-path composition.",
          "State that GTL/ABG owns startup, registry selection, graph-call opening, vector traversal, F_P dispatch, evidence admission, event emission, fold, residual, and replay truth.",
          "Do not write product, requirements, design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_product_surface",
        filesToProduce: ["specification/product.md"],
        instructions: [
          "Write only specification/product.md.",
          "Use the prior intent artifact as authority.",
          "Define the product as a JavaScript LogicalDataModel module plus tests that prove entity and morphism behavior.",
          "Name the public source API: addEntity, addMorphism, identityFor, morphism, dotPath, and projectRecord.",
          "Do not write requirements, design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_goal_surface",
        filesToProduce: ["specification/goals.md"],
        instructions: [
          "Write only specification/goals.md.",
          "Use the prior intent and product artifacts as authority.",
          "List the build goals: create the LogicalDataModel source, prove directed graph structure, prove cardinality validation, prove dot-path composition, and prove record projection.",
          "Do not write requirements, design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_requirement_surface",
        filesToProduce: ["specification/requirements.md"],
        instructions: [
          "Write only specification/requirements.md.",
          "Use the prior goal artifact as authority.",
          "Define requirements for entities, morphisms with cardinality 1:1, N:1, or 1:N, identity morphisms, dotPath(...morphismNames), and projectRecord(sourceRecord, path, targetField).",
          "projectRecord must project a source record value through a lawful path into an object keyed by targetField.",
          "Do not write design, source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_uat_testcases_surface",
        filesToProduce: ["specification/uat-testcases.md"],
        instructions: [
          "Write only specification/uat-testcases.md.",
          "Use the prior requirements artifact as authority.",
          "Define user acceptance testcases for Customer -> Order -> Country mapping, invalid cardinality rejection, invalid dot-path rejection, and projectRecord output.",
          "Do not write executable test source in this vector."
        ]
      },
      {
        stage: "derive_testcase_authority_surface",
        filesToProduce: ["specification/testcase-authority.md"],
        instructions: [
          "Write only specification/testcase-authority.md.",
          "Use the prior UAT testcase artifact as authority.",
          "Declare that generated component and UAT tests must bind to the public API named in product and requirements.",
          "Forbid tests from calling unimplemented helper names such as compose, defineMorphism, validateCardinality, or mapRecord."
        ]
      },
      {
        stage: "derive_feature_decomp_surface",
        filesToProduce: ["design/feature-decomposition.md"],
        instructions: [
          "Write only design/feature-decomposition.md.",
          "Use the prior requirements and testcase-authority artifacts as authority.",
          "Decompose the implementation into entity registry, morphism registry, identity morphism lookup, dot-path validation, and record projection.",
          "Do not write source, tests, package files, or execution plans in this vector."
        ]
      },
      {
        stage: "derive_design_surface",
        filesToProduce: ["design/module-design.md"],
        instructions: [
          "Write only design/module-design.md.",
          "Use the prior feature-decomposition artifact as authority.",
          "Design a single JavaScript class LogicalDataModel with private Maps for entities and morphisms.",
          "Specify failure behavior for unknown entities, unsupported cardinality, unknown morphisms, and codomain/domain mismatch.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_scenario_surface",
        filesToProduce: ["specification/scenario.md"],
        instructions: [
          "Write only specification/scenario.md.",
          "Use prior UAT and design artifacts as authority.",
          "Describe the scenario: define Customer, Order, Country; add places Customer->Order and shipsTo Order->Country; dotPath(\"places\", \"shipsTo\") is lawful; dotPath(\"shipsTo\", \"places\") is rejected; projectRecord projects country.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_implementation_design_surface",
        filesToProduce: ["design/implementation-design.md"],
        instructions: [
          "Write only design/implementation-design.md.",
          "Use all prior specification and design artifacts as authority.",
          "Specify exact source files package.json and src/logical-data-model.mjs.",
          "Specify LogicalDataModel methods addEntity, addMorphism, identityFor, morphism, dotPath, and projectRecord.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_component_code_surface",
        filesToProduce: ["design/component-code-surface.md"],
        instructions: [
          "Write only design/component-code-surface.md.",
          "Use implementation_design as authority.",
          "Describe the component code surface and list the exact public methods and expected thrown error cases.",
          "Do not write package.json, source files, tests, or execution plans in this vector."
        ]
      },
      {
        stage: "qualify_component_realization_surface",
        filesToProduce: ["proof/component-realization-qualification.md"],
        instructions: [
          "Write only proof/component-realization-qualification.md.",
          "Use the component-code-surface and implementation-design artifacts as authority.",
          "State the criteria the later source artifact must satisfy: exact public API, no compose alias, cardinality validation, dot-path validation, and record projection.",
          "Do not write source or tests in this vector."
        ]
      },
      {
        stage: "derive_code_surface",
        filesToProduce: ["package.json", "src/logical-data-model.mjs"],
        instructions: [
          "Write only package.json and src/logical-data-model.mjs.",
          "Use the prior implementation_design and component_realization_qualification artifacts as authority.",
          "package.json must be private:true and type:module.",
          "src/logical-data-model.mjs must export default class LogicalDataModel and named export LogicalDataModel.",
          "Implement addEntity(name), addMorphism(name, domain, codomain, cardinality), identityFor(entityName), morphism(name), dotPath(...morphismNames), and projectRecord(sourceRecord, path, targetField).",
          "Allowed cardinalities are exactly 1:1, N:1, and 1:N; reject all others.",
          "dotPath must accept separate morphism-name arguments and reject codomain/domain mismatch.",
          "projectRecord must accept a dotPath result and project the final codomain value from sourceRecord using the path's morphism names into an object keyed by targetField.",
          "Do not export or rely on a compose method."
        ]
      },
      {
        stage: "derive_test_design_surface",
        filesToProduce: ["design/test-design.md"],
        instructions: [
          "Write only design/test-design.md.",
          "Use the code surface and testcase authority artifacts as evidence.",
          "Specify component tests for entity/morphism registration, cardinality rejection, and dot-path mismatch rejection.",
          "Specify UAT tests for Customer -> Order -> Country lawful composition and projectRecord output.",
          "Do not write executable test source in this vector."
        ]
      },
      {
        stage: "derive_component_test_surface",
        filesToProduce: ["test/component/logical-data-model.test.mjs"],
        instructions: [
          "Write only test/component/logical-data-model.test.mjs.",
          "Use node:test and node:assert/strict.",
          "Import LogicalDataModel from ../../src/logical-data-model.mjs.",
          "Create exactly three test() blocks: registers entities and morphisms, rejects unsupported cardinality, and rejects invalid dot-path composition.",
          "Use dotPath(...morphismNames) for composition checks; do not call compose."
        ]
      },
      {
        stage: "prepare_test_execution_surface",
        filesToProduce: ["test/uat/logical-data-model.uat.test.mjs", "test-execution-plan.json"],
        instructions: [
          "Write only test/uat/logical-data-model.uat.test.mjs and test-execution-plan.json.",
          "The UAT test must use node:test and node:assert/strict and import LogicalDataModel from ../../src/logical-data-model.mjs.",
          "Create exactly two UAT test() blocks: one proves Customer -> Order -> Country dotPath lawfully composes, and one proves projectRecord returns { country: \"AU\" } for a source record with nested order.country value.",
          "test-execution-plan.json must set command to node.",
          "The args must be [\"--test\", \"test/component/logical-data-model.test.mjs\", \"test/uat/logical-data-model.uat.test.mjs\"].",
          "expectedTestPassCount must be 5.",
          "expectedStdoutMatch must include stable substrings pass 5 and fail 0.",
          "assertedReturnValue must be \"data_mapper_full ok\"."
        ]
      },
      {
        stage: "derive_test_execution_result_surface",
        instructions: [
          "Produce no files.",
          "Accept only if the data-mapper test plan command exited 0, observedTestPassCount is 5, planSatisfied is true, and assertedReturnValue is \"data_mapper_full ok\"."
        ]
      },
      {
        stage: "qualify_component_test_execution_surface",
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
        filesToProduce: ["repair/component-repair-schedule.md"],
        instructions: [
          "Write only repair/component-repair-schedule.md.",
          "Use the test execution qualification as authority.",
          "If the test execution result passed, state that no repair is scheduled and preserve residual pressure as none for this scenario.",
          "If it did not pass, identify the failing surface without inventing local closure truth."
        ]
      },
      {
        stage: "derive_test_run_archive_surface",
        filesToProduce: ["archive/test-run-archive.md"],
        instructions: [
          "Write only archive/test-run-archive.md.",
          "Use the test execution qualification and repair schedule artifacts as authority.",
          "Archive the command, observed pass count, asserted return value, and generated artifact list.",
          "Do not claim release approval."
        ]
      },
      {
        stage: "derive_release_depth_parity_surface",
        filesToProduce: ["release/release-depth-parity.md"],
        instructions: [
          "Write only release/release-depth-parity.md.",
          "Use the test run archive and repair schedule artifacts as authority.",
          "Compare the generated lifecycle coverage against the 22 full data-mapper stages and state whether release-depth parity evidence is present.",
          "Do not claim production release authority."
        ]
      },
      {
        stage: "prepare_release_surface",
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

function selectedScenarios() {
  const requested = process.env.ODD_GLC_LIVE_SCENARIO;
  if (requested === undefined || requested.length === 0 || requested === "all") {
    return SCENARIOS;
  }
  if (requested === "compliance") {
    return Object.freeze(SCENARIOS.filter(isComplianceScenario));
  }
  if (requested === "diagnostic") {
    return Object.freeze(SCENARIOS.filter((scenario) =>
      scenario.proofClass === "diagnostic_smoke_not_compliance"
    ));
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

function eventUnixMs(event, fieldName) {
  assert.equal(Number.isSafeInteger(event.eventTimeUnixMs), true, `${fieldName}.eventTimeUnixMs missing`);
  assert.equal(typeof event.eventTime, "string", `${fieldName}.eventTime missing`);
  return event.eventTimeUnixMs;
}

function traversalTimingReport(events, artifacts) {
  return Object.freeze(artifacts.map((artifact) => {
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
    return Object.freeze({
      vectorIndex,
      stage: artifact.stage,
      vectorId: artifact.stagePlan.vectorId,
      edge: artifact.edge,
      traversalPlannedAt: planned.eventTime,
      vectorClosedAt: closed.eventTime,
      traversalDurationMs: closedMs - plannedMs,
      dispatchDurationMs: artifact.timing.dispatch.durationMs,
      workerTraceDurationMs: artifact.timing.workerTrace?.timing?.durationMs ?? null,
      subjectExecutionDurationMs: artifact.timing.subjectExecution?.durationMs ?? null,
      deterministicMaterializeDurationMs: artifact.timing.deterministicMaterialize?.durationMs ?? null,
      assessmentMaterializeDurationMs: artifact.timing.assessmentMaterialize?.durationMs ?? null,
      executorProfile: artifact.transport.executorProfile,
      terminalSessionId: artifact.transport.terminalSessionId,
      traceResultPath: artifact.transport.traceResultPath
    });
  }));
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

test("classifies every current live scenario as GTL/ABG traversal compliance", () => {
  const compliantScenarios = SCENARIOS.filter(isComplianceScenario);
  const diagnosticScenarios = SCENARIOS.filter((scenario) =>
    scenario.proofClass === "diagnostic_smoke_not_compliance"
  );

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

  for (const scenario of diagnosticScenarios) {
    assert.notEqual(
      scenario.graphFunctionRef ?? ODD_GLC_SOFTWARE_BUILD_OVERLAY.defaultStartTarget,
      ODD_GLC_SOFTWARE_BUILD_SDLC_GRAPH_FUNCTION_REF,
      `${scenario.scenarioId} is diagnostic only and must not claim the SDLC compliance graph`
    );
    assert.equal(
      Array.isArray(scenario.stagePlan),
      false,
      `${scenario.scenarioId} is diagnostic only and must not carry a parity stage plan`
    );
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
  return \`sha256:\${createHash("sha256").update(text, "utf8").digest("hex")}\`;
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
  return text
    .split(/\\r?\\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
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
  const eventsPath = transport.tracePaths?.events;
  if (typeof eventsPath !== "string") {
    return null;
  }
  const events = parseTraceEvents(await readFile(eventsPath, "utf8"));
  return Object.freeze({
    source: "abg_traced_process_events",
    eventsPath,
    eventCount: events.length,
    eventKinds: Object.freeze(events.map((event) => event.kind)),
    timing: traceTiming(events)
  });
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
        kind: "lifecycle_asset",
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

function admittedNodeForStage(typeRef, name, tags) {
  const shape = shapeForTypeRef(typeRef);
  return admittedNode({
    name,
    schemaRef: shape.schemaRef,
    typeRef,
    markov: shape.markov,
    assetSurface: shape.assetSurface,
    tags
  });
}

const stageRows = Object.freeze(STAGE_PLAN.map((stage, index) => {
  const source = admittedNodeForStage(stage.sourceTypeRef, stage.sourceName, ["stage-source", stage.stage]);
  const target = admittedNodeForStage(stage.targetTypeRef, stage.targetName, ["stage-target", stage.stage]);
  return Object.freeze({ ...stage, index, source, target });
}));

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

function extractJsonObject(text) {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  if (start < 0) {
    throw new Error(\`GLC live worker did not return JSON: \${text}\`);
  }
  let depth = 0;
  let inString = false;
  let escaping = false;
  for (let index = start; index < trimmed.length; index += 1) {
    const char = trimmed[index];
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
        return JSON.parse(trimmed.slice(start, index + 1));
      }
    }
  }
  throw new Error(\`GLC live worker returned unterminated JSON: \${text}\`);
}

async function writeText(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

function truncateForPrompt(text, maxChars = 2400) {
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
      byteLength: Buffer.byteLength(content, "utf8"),
      lineCount: content.length === 0 ? 0 : content.split("\\n").length,
      contentPreview: truncateForPrompt(content)
    }));
  }
  return Object.freeze(summaries);
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

function nodeTestPassCount(stdout) {
  const match = stdout.match(/(?:^|\\n)\\u2139 pass (\\d+)(?:\\n|$)/u);
  if (match === null) {
    return null;
  }
  return Number.parseInt(match[1], 10);
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

async function executePlannedScenario(workspaceRoot) {
  const plan = await executionPlanFor(workspaceRoot);
  if (plan === null || typeof plan !== "object") {
    throw new Error("Missing test-execution-plan.json for planned scenario execution");
  }
  if (typeof plan.command !== "string" || !Array.isArray(plan.args)) {
    throw new Error("Malformed execution plan command: " + JSON.stringify(plan));
  }
  const cwd = typeof plan.cwd === "string" && plan.cwd.length > 0
    ? path.resolve(workspaceRoot, plan.cwd)
    : workspaceRoot;
  if (cwd !== workspaceRoot && !cwd.startsWith(workspaceRoot + path.sep)) {
    throw new Error("Execution plan cwd escapes workspace: " + plan.cwd);
  }
  const result = runSync(commandFromPlan(plan.command), plan.args, cwd);
  const observedPassCount = nodeTestPassCount(result.stdout);
  if (!Number.isInteger(plan.expectedTestPassCount) || plan.expectedTestPassCount < 0) {
    throw new Error("Execution plan must declare a non-negative integer expectedTestPassCount: " + JSON.stringify(plan));
  }
  const expectedPassCount = plan.expectedTestPassCount;
  const expectedStdout = typeof plan.expectedStdout === "string"
    ? plan.expectedStdout
    : null;
  const expectedStdoutMatch = Array.isArray(plan.expectedStdoutMatch)
    ? plan.expectedStdoutMatch
    : [];
  const passCountSatisfied = observedPassCount === expectedPassCount;
  const stdoutSatisfied = expectedStdout === null || result.stdout === expectedStdout;
  const stdoutMatchSatisfied = expectedStdoutMatch.every((fragment) =>
    typeof fragment === "string" && result.stdout.includes(fragment)
  );
  if (result.status !== 0 || !passCountSatisfied || !stdoutSatisfied || !stdoutMatchSatisfied) {
    throw new Error("planned scenario execution failed: " + JSON.stringify({
      plan,
      result,
      observedPassCount,
      passCountSatisfied,
      stdoutSatisfied,
      stdoutMatchSatisfied
    }));
  }
  return Object.freeze({
    kind: SCENARIO.kind,
    stdout: expectedStdout ?? result.stdout,
    commands: [result],
    planSatisfied: true,
    expectedTestPassCount: expectedPassCount,
    observedTestPassCount: observedPassCount,
    expectedStdoutMatch: Object.freeze(expectedStdoutMatch),
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
  if (!Array.isArray(stageSpec.filesToProduce) || stageSpec.filesToProduce.length === 0) {
    return Object.freeze([]);
  }
  if (!Array.isArray(assessment.files)) {
    throw new Error(\`GLC live worker did not return files for stage \${stageSpec.stage}\`);
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
      throw new Error(\`Malformed file payload for stage \${stageSpec.stage}: \${JSON.stringify(file)}\`);
    }
    if (!allowed.has(file.path)) {
      throw new Error(\`Unexpected file path for stage \${stageSpec.stage}: \${file.path}\`);
    }
    seen.add(file.path);
    const absolutePath = path.resolve(workspaceRoot, file.path);
    if (absolutePath !== workspaceRoot && !absolutePath.startsWith(\`\${workspaceRoot}\${path.sep}\`)) {
      throw new Error(\`Refusing to write outside workspace: \${file.path}\`);
    }
    await writeText(absolutePath, content);
    written.push(absolutePath);
  }
  for (const required of allowed) {
    if (!seen.has(required)) {
      throw new Error(\`Missing required file for stage \${stageSpec.stage}: \${required}\`);
    }
  }
  return Object.freeze(written);
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
      expectedStdoutMatch: Object.freeze(plan?.expectedStdoutMatch ?? []),
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
    observedStdoutPreview: input.execution === null ? null : input.execution.stdout.slice(0, 120),
    clientStatus: input.execution?.clientRequest?.status ?? null,
    observedTestPassCount: input.execution?.observedTestPassCount ?? null,
    assertedReturnValue: input.execution?.assertedReturnValue ?? null
  });
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
    "Assert helloWorld() returns exactly \\"Hello, world!\\"."
  ]),
  test_execution_plan: Object.freeze([
    "Write only test-execution-plan.json.",
    "Use the prior test_source artifact summary as the evidence source.",
    "Include command, args, cwd, expectedStdout or expectedStdoutMatch, expectedTestPassCount, and assertedReturnValue.",
    "expectedTestPassCount must equal the number of test() blocks in the admitted test source.",
    "For node:test output, expectedStdoutMatch must use stable substrings such as pass N and fail 0, not TAP prefix symbols.",
    "Do not execute the test in this vector."
  ]),
  test_execution_result: Object.freeze([
    "Produce no files.",
    "Judge the observed executionStatus, planSatisfied flag, observedTestPassCount, and stdout digest against the prior test_execution_plan.",
    "Accept only if the command exited successfully, planSatisfied is true, and observedTestPassCount equals expectedTestPassCount.",
    "Do not reject solely because node:test uses a different TAP prefix glyph when the F_D pass-count check is satisfied."
  ])
});

function promptFor(input, evidenceSummary, priorStageArtifacts) {
  const stageSpec = STAGE_PLAN[input.vectorIndex];
  const expectedNodeTypes = stageSpec.requiredNodeTypes;
  const allowedPaths = Object.freeze(stageSpec.filesToProduce ?? []);
  const stageInstructions = Array.isArray(stageSpec.instructions)
    ? Object.freeze(stageSpec.instructions)
    : STAGE_FILE_INSTRUCTIONS[stageSpec.stage] ?? Object.freeze([]);
  const fileInstructions = Array.isArray(stageSpec.filesToProduce) && stageSpec.filesToProduce.length > 0
    ? [
        "",
        "This stage must produce files. Return them in files as path/contentLines objects.",
        \`Allowed paths: \${allowedPaths.join(", ")}.\`,
        "Do not write outside those paths.",
        "Do not put raw multi-line text in a JSON string. Use contentLines: string[] for every file.",
        "Do not include markdown code fences inside contentLines."
      ]
    : [
        "",
        "This stage must not produce files. Omit files or return an empty files array."
      ];
  const priorStageText = priorStageArtifacts.length === 0
    ? "[]"
    : JSON.stringify(priorStageArtifacts, null, 2);
  return [
    "Return only one JSON object. Do not include markdown or commentary.",
    "You are the F_P worker for an odd_glc software-build lifecycle traversal.",
    "ABG owns registry startup, graph-function selection, graph-call opening, traversal events, and closure.",
    "odd_glc supplies GTL declaration data: the reusable software-build overlay graph and startup binding.",
    "",
    \`Scenario: \${SCENARIO.scenarioId}\`,
    \`Scenario kind: \${SCENARIO.kind}\`,
    \`Stage: \${stageSpec.stage}\`,
    \`Overlay ref: \${OVERLAY_REF}\`,
    \`Graph ref: \${GRAPH_REF}\`,
    \`Selected graph function ref: \${GRAPH_FUNCTION_REF}\`,
    \`Current edge: \${input.edge}\`,
    \`Vector index: \${input.vectorIndex}\`,
    \`Expected runtime stdout: \${JSON.stringify(EXPECTED_STDOUT)}\`,
    "",
    "Typed edge contract:",
    \`- sourceTypeRef: \${stageSpec.sourceTypeRef}\`,
    \`- targetTypeRef: \${stageSpec.targetTypeRef}\`,
    \`- vectorId: \${stageSpec.vectorId}\`,
    \`- requiredNodeTypes: \${expectedNodeTypes.join(", ")}\`,
    "",
    "Observed current-edge evidence generated before this judgment:",
    JSON.stringify(evidenceSummary),
    "",
    "Prior stage artifacts admitted by earlier vectors:",
    priorStageText,
    "",
    "Stage-specific instructions:",
    ...stageInstructions.map((line) => \`- \${line}\`),
    "",
    typeof EXPECTED_STDOUT === "string"
      ? \`Expected command stdout: \${JSON.stringify(EXPECTED_STDOUT)}\`
      : \`Expected asserted return value: \${JSON.stringify(EXPECTED_ASSERTED_RETURN_VALUE)}\`,
    "",
    "Required JSON:",
    "{",
    "  \\"accepted\\": true,",
    \`  \\"stage\\": \${JSON.stringify(stageSpec.stage)},\`,
    "  \\"evidenceAccepted\\": true,",
    "  \\"nodeTypesUsed\\": string[],",
    "  \\"files\\": [{ \\"path\\": string, \\"contentLines\\": string[] }],",
    "  \\"reason\\": string",
    "}",
    "",
    \`nodeTypesUsed must include at least: \${expectedNodeTypes.join(", ")}.\`,
    ...fileInstructions,
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
    const priorStageArtifacts = [];
    const fpDispatch = Object.freeze({
      contract: defaultFpDispatchPlugin.contract,
      dispatch: async (pluginInput) => {
        const dispatchStarted = timestampNow();
        const runRoot = path.join(workspaceRoot, ".ai-workspace", "glc-software-build-live", SCENARIO.key);
        await mkdir(runRoot, { recursive: true });
        const label = \`\${SCENARIO.key}-vector-\${pluginInput.vectorIndex}\`;
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
        const executorProfile = process.env.ABG_TS_AGENT_EXECUTOR_PROFILE ?? "local-spawn";
        const transport = await runAgentTransport({
          contract: contractForKnownAgent(process.env.ABG_TS_LIVE_AGENT ?? "claude"),
          prompt: promptFor(pluginInput, evidenceSummary, Object.freeze([...priorStageArtifacts])),
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
        if (transport.status !== 0) {
          throw new Error(\`GLC software-build live worker failed: \${transport.stderr}\`);
        }
        if (executorProfile === "pty-terminal" && transport.terminalSessionId === null) {
          throw new Error("pty-terminal live proof must record a terminalSessionId");
        }
        const assessment = extractJsonObject(transport.text);
        if (
          assessment.accepted !== true ||
          assessment.stage !== expectedStage ||
          assessment.evidenceAccepted !== true ||
          !Array.isArray(assessment.nodeTypesUsed) ||
          !expectedNodeTypes.every((typeRef) => assessment.nodeTypesUsed.includes(typeRef))
        ) {
          throw new Error(\`GLC software-build live worker returned invalid assessment: \${JSON.stringify(assessment)}\`);
        }
        if (stageSpec.deterministicMaterialize !== true) {
          const measured = await measuredStep("assessment_materialize", () =>
            materializeAssessmentFiles(workspaceRoot, stageSpec, assessment)
          );
          materializedFiles = measured.value;
          assessmentMaterializeTiming = measured.timing;
        }
        const summaryMeasured = await measuredStep("summarize_materialized_files", () =>
          summarizeMaterializedFiles(workspaceRoot, materializedFiles)
        );
        const materializedFileSummaries = summaryMeasured.value;
        const assessmentIds = pluginInput.expectedAssessmentIds.length > 0
          ? pluginInput.expectedAssessmentIds
          : [\`software_build_\${SCENARIO.key}_vector_\${pluginInput.vectorIndex}_fulfilled\`];
        const traceTiming = await workerTraceTiming(transport);
        const dispatchTiming = timingRecord(dispatchStarted);
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
          stagePlan: Object.freeze({
            sourceTypeRef: stageSpec.sourceTypeRef,
            targetTypeRef: stageSpec.targetTypeRef,
            vectorId: stageSpec.vectorId,
            filesToProduce: Object.freeze(stageSpec.filesToProduce ?? []),
            executeBeforeAssessment: stageSpec.executeBeforeAssessment === true
          }),
          assessment,
          evidenceSummary,
          materializedFiles,
          materializedFileSummaries,
          execution,
          timing: Object.freeze({
            timingAuthority: "abg_called_fp_dispatch_plugin_result_artifact",
            timingScope: "ABG selected this vector and invoked the F_P dispatch plugin. These timings describe the ABG-called dispatch side effects and worker trace, not odd_glc-owned traversal control.",
            vectorIndex: pluginInput.vectorIndex,
            stage: expectedStage,
            dispatch: dispatchTiming,
            deterministicMaterialize: deterministicMaterializeTiming,
            subjectExecution: subjectExecutionTiming,
            workerTrace: traceTiming,
            assessmentMaterialize: assessmentMaterializeTiming,
            materializedFileSummary: summaryMeasured.timing
          }),
          stdout: execution?.stdout ?? null,
          fulfillment_assessments: assessmentIds.map((assessmentId) =>
            Object.freeze({
              id: assessmentId,
              evaluator: assessmentId,
              fulfillment_status: "fulfilled",
              fulfillment_detail: \`Live F_P worker accepted \${expectedStage} for the software-build Hello World traversal under the reusable odd_glc overlay graph.\`,
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
            executorProfile: transport.executorProfile,
            terminalSessionId: transport.terminalSessionId,
            traceResultPath: transport.traceResultPath,
            outputPath: transport.outputPath,
            structuredEventCount: transport.structuredEventCount,
            apiRetryCount: transport.apiRetryCount
          })
        });
        const artifactSha256 = sha256Text(JSON.stringify(artifact));
        priorStageArtifacts.push(Object.freeze({
          vectorIndex: pluginInput.vectorIndex,
          stage: expectedStage,
          edge: pluginInput.edge,
          vectorId: stageSpec.vectorId,
          targetTypeRef: stageSpec.targetTypeRef,
          artifactSha256,
          files: materializedFileSummaries,
          execution: execution === null
            ? null
            : Object.freeze({
                commandStatuses: execution.commands.map((command) => command.status),
                stdoutSha256: sha256Text(execution.stdout),
                stdoutPreview: execution.stdout.slice(0, 240),
                clientStatus: execution.clientRequest?.status ?? null,
                observedTestPassCount: execution.observedTestPassCount ?? null
              }),
          assessment: Object.freeze({
            accepted: assessment.accepted,
            evidenceAccepted: assessment.evidenceAccepted,
            nodeTypesUsed: assessment.nodeTypesUsed,
            reasonPreview: typeof assessment.reason === "string" ? truncateForPrompt(assessment.reason, 600) : null
          })
        }));
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
    subjectWriteRoot: workspaceRoot,
    requestedExecutorProfile,
    terminalProofRequired: requestedExecutorProfile === "pty-terminal",
    authorityRule: "ABG owns install, startup admission, registry projection, selection, graph-call opening, traversal, F_P invocation, event emission, and replay truth. odd_glc supplies declaration data and read interpretation only."
  });
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
  const stageCount = Array.isArray(scenario.stagePlan) ? scenario.stagePlan.length : 2;
  const artifacts = [];
  for (let index = 0; index < stageCount; index += 1) {
    artifacts.push(await readJson(path.join(artifactRoot, `${scenario.key}-vector-${index}-artifact.json`)));
  }
  const vectorTimingReport = traversalTimingReport(events, artifacts);
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
    runtimeBindingPath,
    workspaceRoot,
    startOutput,
    externalAbgStartInvocationCount: 1,
    abgInvocationShape: "single installed genesis-ts start --until converged per scenario; ABG owns internal graph-call opening, vector traversal, F_P dispatch, event emission, closure, and convergence",
    eventLogSha256: sha256Text(await readFile(startOutput.events_path, "utf8")),
    eventSequence: events.map((event, index) => Object.freeze({
      index,
      kind: event.kind,
      edge: event.edge ?? null,
      vectorIndex: event.vectorIndex ?? null,
      graphFunctionRef: event.graphFunctionRef ?? null,
      eventTime: event.eventTime ?? null,
      eventTimeUnixMs: event.eventTimeUnixMs ?? null,
      eventAdmissionOrdinal: event.eventAdmissionOrdinal ?? null
    })),
    vectorTimingAuthority: "ABG canonical runtime events provide traversal sequence, closure truth, eventTime, eventTimeUnixMs, and eventAdmissionOrdinal. Per-vector traversalDurationMs is computed from vector_traversal_planned.eventTimeUnixMs to vector_closed.eventTimeUnixMs. Dispatch and worker timings remain secondary ABG-called plugin trace details.",
    vectorTimingReport,
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
      runtimeEvents: result.events,
      liveArtifacts: result.artifacts
    });
    const expectedStdout = Object.hasOwn(scenario, "expectedStdout") ? scenario.expectedStdout : "Hello, world!\n";
    const finalArtifact = result.artifacts[result.artifacts.length - 1];
    const executionArtifact = typeof scenario.executionStage === "string"
      ? result.artifacts.find((artifact) => artifact.stage === scenario.executionStage)
      : finalArtifact;
    const vectorClosedCount = result.events.filter((event) => event.kind === "vector_closed").length;
    assert.ok(executionArtifact, `Missing execution artifact for ${scenario.executionStage ?? "final stage"}`);

    assert.equal(result.proof.sandboxIdentity.kind, "odd_glc_abg42_software_build_live_sandbox");
    assert.equal(result.proof.sandboxIdentity.workspaceRoot, result.workspaceRoot);
    assert.equal(existsSync(path.join(result.runRoot, "sandbox-identity.json")), true);
    assert.equal(existsSync(path.join(result.workspaceRoot, ".ai-workspace", "sandbox-identity.json")), true);
    assert.equal(result.startOutput.command, "start");
    assert.equal(result.startOutput.stopped_by, "converged");
    assert.equal(result.proof.externalAbgStartInvocationCount, 1);
    assert.match(result.proof.abgInvocationShape, /single installed genesis-ts start --until converged/u);
    assert.equal(result.startOutput.event_kinds.includes("registry_entry_admitted"), true);
    assert.equal(result.startOutput.event_kinds.includes("graph_function_selected"), true);
    assert.equal(result.startOutput.event_kinds.includes("graph_call_opened"), true);
    assert.match(result.proof.vectorTimingAuthority, /ABG canonical runtime events provide traversal sequence/u);
    assert.equal(result.proof.vectorTimingReport.length, result.artifacts.length);
    assert.equal(
      result.proof.vectorTimingReport.every((row) =>
        Number.isInteger(row.traversalDurationMs) &&
          row.traversalDurationMs >= 0 &&
        Number.isInteger(row.dispatchDurationMs) &&
          row.dispatchDurationMs >= 0 &&
          typeof row.workerTraceDurationMs === "number" &&
          row.workerTraceDurationMs >= 0 &&
          row.executorProfile === result.proof.sandboxIdentity.requestedExecutorProfile
      ),
      true
    );
    assert.equal(
      result.artifacts.every((artifact) =>
        artifact.timing.timingAuthority === "abg_called_fp_dispatch_plugin_result_artifact" &&
          /not odd_glc-owned traversal control/u.test(artifact.timing.timingScope)
      ),
      true
    );
    assert.equal(view.status, "accepted");
    assert.equal(view.value.readiness, "traversal_converged");
    assert.equal(view.value.graphFunctionEntryRefs.includes(graphFunctionEntry.entryRef), true);
    assert.equal(view.value.selectedGraphFunctionRefs.includes(selectedGraphFunctionRef), true);
    assert.equal(view.value.selectedEntryKinds.includes("graph_function"), true);
    assert.equal(view.value.selectedEntryKinds.includes("node_type"), false);
    if (scenario.executeFromPlan !== true && typeof expectedStdout === "string") {
      assert.equal(view.value.stdoutValues.includes(expectedStdout), true);
      assert.equal(finalArtifact.execution.stdout, expectedStdout);
    }
    if (scenario.executeFromPlan === true) {
      assert.equal(executionArtifact.execution.planSatisfied, true);
      assert.equal(executionArtifact.execution.observedTestPassCount > 0, true);
      assert.equal(view.value.stdoutValues.includes(executionArtifact.execution.stdout), true);
    }
    if (typeof scenario.expectedReturnValue === "string") {
      assert.equal(executionArtifact.execution.assertedReturnValue, scenario.expectedReturnValue);
      assert.equal(executionArtifact.execution.observedTestPassCount > 0, true);
    }
    assert.equal(finalArtifact.assessment.evidenceAccepted, true);
    assert.equal(result.artifacts.every((artifact) => artifact.overlayRef === ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef), true);
    assert.equal(result.artifacts.every((artifact) => artifact.graphFunctionRef === selectedGraphFunctionRef), true);
    assert.equal(vectorClosedCount, result.artifacts.length);
    if (Array.isArray(scenario.requiredStageNames)) {
      assert.deepEqual(result.artifacts.map((artifact) => artifact.stage), scenario.requiredStageNames);
    }
    if (typeof scenario.materializedSurfaceCount === "number") {
      assert.equal(
        result.artifacts.filter((artifact) => artifact.materializedFiles.length > 0).length,
        scenario.materializedSurfaceCount
      );
    }
    assert.equal(
      result.events.findIndex((event) => event.kind === "graph_function_selected") <
        result.events.findIndex((event) => event.kind === "graph_call_opened"),
      true
    );
  });
}
