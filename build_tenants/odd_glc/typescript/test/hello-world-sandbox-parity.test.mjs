import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import {
  copyFile,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  ABIOGENESIS_SUBSTRATE_PROVENANCE,
  ODD_GLC_SOFTWARE_BUILD_OVERLAY,
  ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING,
  interpretAssuranceState,
  interpretEvidenceState,
  interpretLifecycleState,
  interpretParallelFrontierState,
  interpretStartupRegistryState
} from "../src/index.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tenantRoot = path.resolve(dirname, "..");
const repoRoot = path.resolve(tenantRoot, "../../..");
const appsRoot = path.resolve(repoRoot, "..");
const sandboxRoot = path.join(tenantRoot, "test_runs", "hello_world_sandbox_parity");
const defaultAbgRoot = path.join(
  appsRoot,
  `.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/${ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate.packageVersion}/lib/node_modules/@abiogenesis/typescript-tenant`
);

const ROUTE_PROOFS = Object.freeze({
  basicCli: "basicCliRouteReplay",
  rustCli: "rustCliToolchainExecution",
  rustService: "rustServiceProcessRequest",
  jsTenantTest: "jsTenantTestProofEvidence",
  parallelJs: "parallelJsHelloWorld"
});

async function importAbgRequirementsFacade() {
  const packageRoot = process.env.ABG_TYPESCRIPT_TENANT_ROOT ?? defaultAbgRoot;
  const facadePath = path.join(packageRoot, "build/semantic/code/src/abg/requirements/index.js");
  assert.equal(existsSync(facadePath), true, `Missing installed ABIogenesis facade at ${facadePath}`);
  return import(pathToFileURL(facadePath).href);
}

function sha256Text(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function proofArtifactPathFromProvenance(value) {
  return path.join(
    tenantRoot,
    value.replace(/^build_tenants\/odd_glc\/typescript\//u, "")
  );
}

async function readPinnedRouteProof(proofKey) {
  const proof = ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts[proofKey];
  assert.ok(proof, `Missing substrate provenance for ${proofKey}`);
  const artifactPath = proofArtifactPathFromProvenance(proof.proofArtifactPath);
  const manifestPath = proofArtifactPathFromProvenance(proof.proofManifestPath);
  const rawArtifact = await readFile(artifactPath, "utf8");
  const rawManifest = await readFile(manifestPath, "utf8");
  const artifactSha256 = sha256Text(rawArtifact);
  const artifact = JSON.parse(rawArtifact);
  const manifest = JSON.parse(rawManifest);

  assert.equal(artifactSha256, proof.artifactSha256, `${proofKey} artifact digest must match provenance`);
  assert.equal(manifest.artifact.sha256, artifactSha256, `${proofKey} manifest digest must match artifact`);
  assert.equal(manifest.artifact.requiredPayloadKindsSatisfied, true, `${proofKey} route payloads must be satisfied`);
  assert.equal(artifact.routeEvents.length, proof.routeEventCount, `${proofKey} route event count must match provenance`);
  assert.equal(artifact.replayEvents.length, proof.replayEventCount, `${proofKey} replay event count must match provenance`);

  return Object.freeze({
    artifact,
    artifactPath,
    artifactSha256,
    manifest,
    manifestPath,
    proof,
    proofKey
  });
}

async function readPinnedGlcStartupProof() {
  const proof = ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.glcHelloWorldBootstrapLive;
  assert.ok(proof, "Missing ABG 4.2 startup provenance");
  const proofPath = proofArtifactPathFromProvenance(proof.proofArtifactPath);
  const manifestPath = proofArtifactPathFromProvenance(proof.proofManifestPath);
  const proofDir = path.dirname(proofPath);
  const eventsPath = path.join(proofDir, "events.jsonl");
  const vector0Path = path.join(proofDir, "glc-bootstrap-vector-0-artifact.json");
  const vector1Path = path.join(proofDir, "glc-bootstrap-vector-1-artifact.json");
  const rawProof = await readFile(proofPath, "utf8");
  const rawManifest = await readFile(manifestPath, "utf8");
  const rawEvents = await readFile(eventsPath, "utf8");
  const rawVector0 = await readFile(vector0Path, "utf8");
  const rawVector1 = await readFile(vector1Path, "utf8");
  const manifest = JSON.parse(rawManifest);

  assert.equal(sha256Text(rawProof), proof.artifactSha256);
  assert.equal(sha256Text(rawProof), manifest.proof.sha256);
  assert.equal(sha256Text(rawEvents), proof.eventLogSha256);
  assert.equal(sha256Text(rawEvents), manifest.events.sha256);

  return Object.freeze({
    events: rawEvents.trim().split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line)),
    eventsPath,
    liveArtifacts: [JSON.parse(rawVector0), JSON.parse(rawVector1)],
    manifest,
    manifestPath,
    proof: JSON.parse(rawProof),
    proofPath,
    vector0Path,
    vector1Path
  });
}

function runIdFor(scenarioId) {
  const timestamp = new Date().toISOString().replace(/[-:.]/gu, "").replace("Z", "Z");
  return `${timestamp}_pid${process.pid}_${randomUUID().slice(0, 8)}`;
}

async function prepareSandbox(scenarioId) {
  const runRoot = path.join(sandboxRoot, scenarioId, runIdFor(scenarioId));
  const workspace = path.join(runRoot, "workspace");
  const proofRoot = path.join(workspace, ".ai-workspace", "proofs");
  const eventsRoot = path.join(workspace, ".ai-workspace", "events");
  await mkdir(proofRoot, { recursive: true });
  await mkdir(eventsRoot, { recursive: true });
  await writeJson(path.join(workspace, ".ai-workspace", "bootstrap.json"), {
    kind: "odd_glc_hello_world_sandbox_bootstrap",
    scenarioId,
    substrate: ABIOGENESIS_SUBSTRATE_PROVENANCE.substrate,
    startupConfigRef: ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING.configRef,
    overlayRef: ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
    rule: "sandbox_executes_subject_only_odd_glc_interprets_pinned_abi_truth"
  });
  return Object.freeze({
    eventsRoot,
    proofRoot,
    runRoot,
    scenarioId,
    workspace
  });
}

async function copyRouteProofInputs(sandbox, proof) {
  const targetRoot = path.join(sandbox.proofRoot, "abi", proof.proofKey);
  await mkdir(targetRoot, { recursive: true });
  const artifactTarget = path.join(targetRoot, path.basename(proof.artifactPath));
  const manifestTarget = path.join(targetRoot, path.basename(proof.manifestPath));
  await copyFile(proof.artifactPath, artifactTarget);
  await copyFile(proof.manifestPath, manifestTarget);
  await writeJson(path.join(targetRoot, "proof-input-summary.json"), {
    kind: "odd_glc_sandbox_readonly_abi_proof_input",
    proofKey: proof.proofKey,
    artifactSha256: proof.artifactSha256,
    copiedArtifactPath: artifactTarget,
    copiedManifestPath: manifestTarget,
    sourceCapability: proof.proof.sourceCapability,
    sourceRunId: proof.proof.sourceRunId
  });
  return Object.freeze({ artifactTarget, manifestTarget, targetRoot });
}

async function copyStartupProofInputs(sandbox, proof) {
  const targetRoot = path.join(sandbox.proofRoot, "abi", "glcHelloWorldBootstrapLive");
  await mkdir(targetRoot, { recursive: true });
  for (const sourcePath of [proof.proofPath, proof.manifestPath, proof.eventsPath, proof.vector0Path, proof.vector1Path]) {
    await copyFile(sourcePath, path.join(targetRoot, path.basename(sourcePath)));
  }
  return targetRoot;
}

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

async function writeJson(filePath, value) {
  await writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function commandSummary(command, args, cwd) {
  return `${command} ${args.join(" ")} @ ${cwd}`;
}

function assertInsideWorkspace(filePath, workspace) {
  const relative = path.relative(workspace, filePath);
  assert.equal(relative.startsWith(".."), false, `${filePath} must be inside ${workspace}`);
  assert.equal(path.isAbsolute(relative), false, `${filePath} must be inside ${workspace}`);
}

async function runCommand(command, args, options) {
  const cwd = options.cwd;
  assertInsideWorkspace(cwd, options.workspace);
  const startedAt = Date.now();
  const timeoutMs = options.timeoutMs ?? 30000;
  const childEnv = { ...process.env };
  delete childEnv.NODE_TEST_CONTEXT;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...childEnv,
        NO_COLOR: "1",
        ...(options.env ?? {})
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Timed out after ${timeoutMs}ms: ${commandSummary(command, args, cwd)}`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (status, signal) => {
      clearTimeout(timer);
      resolve(Object.freeze({
        args,
        command,
        cwd,
        durationMs: Date.now() - startedAt,
        pid: child.pid,
        signal,
        status,
        stderr,
        stdout
      }));
    });
  });
}

async function assertClosedInterpretation(artifact, scenarioId) {
  const abgRequirements = await importAbgRequirementsFacade();
  const lifecycle = interpretLifecycleState({
    abgRequirements,
    query: artifact.lifecycleState.requirementQuery,
    dispositionRefs: artifact.lifecycleState.dispositionRefs,
    runtimeEvents: artifact.replayEvents
  });
  const evidence = interpretEvidenceState({
    runtimeEvents: artifact.replayEvents
  });
  const assurance = interpretAssuranceState({
    runtimeEvents: artifact.replayEvents
  });

  assert.equal(lifecycle.status, "accepted", scenarioId);
  assert.equal(evidence.status, "accepted", scenarioId);
  assert.equal(assurance.status, "accepted", scenarioId);
  assert.equal(lifecycle.value.lifecycleDisposition, "release_readiness_candidate", scenarioId);
  assert.equal(evidence.value.evidenceDisposition, "admitted_bound_and_executed", scenarioId);
  assert.equal(assurance.value.assuranceDisposition, "assurance_satisfied", scenarioId);

  return Object.freeze({
    assurance: assurance.value,
    evidence: evidence.value,
    lifecycle: lifecycle.value
  });
}

async function writeSandboxSummary(sandbox, value) {
  const summaryPath = path.join(sandbox.runRoot, "sandbox-summary.json");
  await writeJson(summaryPath, {
    kind: "odd_glc_hello_world_sandbox_summary",
    scenarioId: sandbox.scenarioId,
    runRoot: sandbox.runRoot,
    workspace: sandbox.workspace,
    ...value
  });
  return summaryPath;
}

test("runs SCN-GLC-HELLO-WORLD-CLI-BASIC in an isolated sandbox", async () => {
  const scenarioId = "SCN-GLC-HELLO-WORLD-CLI-BASIC";
  const sandbox = await prepareSandbox(scenarioId);
  const proof = await readPinnedRouteProof(ROUTE_PROOFS.basicCli);
  await copyRouteProofInputs(sandbox, proof);
  const programPath = path.join(sandbox.workspace, "generated", "hello-world.mjs");
  await writeText(programPath, `console.log("Hello, world!");\n`);

  const execution = await runCommand(process.execPath, [programPath], {
    cwd: sandbox.workspace,
    timeoutMs: 10000,
    workspace: sandbox.workspace
  });
  const interpreted = await assertClosedInterpretation(proof.artifact, scenarioId);

  assert.equal(execution.status, 0);
  assert.equal(execution.stdout, "Hello, world!\n");
  assertInsideWorkspace(programPath, sandbox.workspace);

  const summaryPath = await writeSandboxSummary(sandbox, {
    artifactSha256: proof.artifactSha256,
    commandProofs: [execution],
    interpretedDisposition: interpreted.lifecycle.lifecycleDisposition,
    sourceRule: "basic cli subject executed in sandbox; ABI route truth copied read-only"
  });
  assert.equal(existsSync(summaryPath), true);
});

test("runs SCN-GLC-HELLO-WORLD-JS-TENANT-TEST in an isolated sandbox", async () => {
  const scenarioId = "SCN-GLC-HELLO-WORLD-JS-TENANT-TEST";
  const sandbox = await prepareSandbox(scenarioId);
  const proof = await readPinnedRouteProof(ROUTE_PROOFS.jsTenantTest);
  await copyRouteProofInputs(sandbox, proof);
  await writeJson(path.join(sandbox.workspace, "package.json"), {
    private: true,
    type: "module",
    scripts: {
      test: "node --test test/hello.test.mjs"
    }
  });
  await writeText(
    path.join(sandbox.workspace, "src", "hello.mjs"),
    `export function helloWorld() {\n  return "Hello, world!";\n}\n`
  );
  await writeText(
    path.join(sandbox.workspace, "test", "hello.test.mjs"),
    `import assert from "node:assert/strict";\nimport { test } from "node:test";\nimport { helloWorld } from "../src/hello.mjs";\n\ntest("hello world subject returns the greeting", () => {\n  assert.equal(helloWorld(), "Hello, world!");\n});\n`
  );

  const execution = await runCommand(process.execPath, ["--test", "test/hello.test.mjs"], {
    cwd: sandbox.workspace,
    timeoutMs: 15000,
    workspace: sandbox.workspace
  });
  const interpreted = await assertClosedInterpretation(proof.artifact, scenarioId);

  assert.equal(execution.status, 0);
  assert.equal(execution.stdout.includes("pass 1"), true);

  const summaryPath = await writeSandboxSummary(sandbox, {
    artifactSha256: proof.artifactSha256,
    commandProofs: [execution],
    interpretedDisposition: interpreted.lifecycle.lifecycleDisposition,
    sourceRule: "js subject and verifier executed in sandbox; ABI route truth copied read-only"
  });
  assert.equal(existsSync(summaryPath), true);
});

test("runs SCN-GLC-HELLO-WORLD-RUST-CLI in an isolated sandbox", async () => {
  const scenarioId = "SCN-GLC-HELLO-WORLD-RUST-CLI";
  const sandbox = await prepareSandbox(scenarioId);
  const proof = await readPinnedRouteProof(ROUTE_PROOFS.rustCli);
  await copyRouteProofInputs(sandbox, proof);
  const projectRoot = path.join(sandbox.workspace, "build_tenants", "hello_world_rust");
  await writeText(
    path.join(projectRoot, "Cargo.toml"),
    `[package]\nname = "hello_world_rust_sandbox"\nversion = "0.0.0"\nedition = "2021"\n\n[dependencies]\n`
  );
  await writeText(path.join(projectRoot, "src", "main.rs"), `fn main() {\n    println!("Hello, world!");\n}\n`);

  const execution = await runCommand("cargo", ["run", "--quiet"], {
    cwd: projectRoot,
    timeoutMs: 120000,
    workspace: sandbox.workspace
  });
  const interpreted = await assertClosedInterpretation(proof.artifact, scenarioId);

  assert.equal(execution.status, 0);
  assert.equal(execution.stdout, "Hello, world!\n");

  const summaryPath = await writeSandboxSummary(sandbox, {
    artifactSha256: proof.artifactSha256,
    commandProofs: [execution],
    interpretedDisposition: interpreted.lifecycle.lifecycleDisposition,
    sourceRule: "rust cargo subject executed in sandbox; ABI route truth copied read-only"
  });
  assert.equal(existsSync(summaryPath), true);
});

test("runs SCN-GLC-HELLO-WORLD-RUST-SERVICE in an isolated sandbox", async () => {
  const scenarioId = "SCN-GLC-HELLO-WORLD-RUST-SERVICE";
  const sandbox = await prepareSandbox(scenarioId);
  const proof = await readPinnedRouteProof(ROUTE_PROOFS.rustService);
  await copyRouteProofInputs(sandbox, proof);
  const serviceRoot = path.join(sandbox.workspace, "service-request-proof");
  const sourcePath = path.join(serviceRoot, "src", "service.rs");
  const binaryPath = path.join(serviceRoot, "hello_service");
  const portPath = path.join(serviceRoot, "service.port");
  await writeText(sourcePath, `use std::env;\nuse std::fs;\nuse std::io::{Read, Write};\nuse std::net::TcpListener;\n\nfn main() {\n    let port_file = env::args().nth(1).expect("port file path");\n    let listener = TcpListener::bind("127.0.0.1:0").expect("bind service");\n    let port = listener.local_addr().expect("local addr").port();\n    fs::write(&port_file, port.to_string()).expect("write port");\n    if let Ok((mut stream, _addr)) = listener.accept() {\n        let mut buffer = [0_u8; 1024];\n        let _ = stream.read(&mut buffer);\n        let body = "Hello, world!\\n";\n        let response = format!(\n            "HTTP/1.1 200 OK\\r\\nContent-Length: {}\\r\\nContent-Type: text/plain\\r\\nConnection: close\\r\\n\\r\\n{}",\n            body.len(),\n            body\n        );\n        stream.write_all(response.as_bytes()).expect("write response");\n    }\n}\n`);

  const compile = await runCommand("rustc", [sourcePath, "-o", binaryPath], {
    cwd: serviceRoot,
    timeoutMs: 120000,
    workspace: sandbox.workspace
  });
  assert.equal(compile.status, 0);

  const service = spawn(binaryPath, [portPath], {
    cwd: serviceRoot,
    stdio: ["ignore", "pipe", "pipe"]
  });
  let serviceStdout = "";
  let serviceStderr = "";
  service.stdout.on("data", (chunk) => {
    serviceStdout += chunk.toString("utf8");
  });
  service.stderr.on("data", (chunk) => {
    serviceStderr += chunk.toString("utf8");
  });
  const serviceExit = new Promise((resolve) => {
    service.on("close", (status, signal) => {
      resolve({ status, signal });
    });
  });

  const port = await waitForPortFile(portPath, 10000);
  const response = await fetch(`http://127.0.0.1:${port}/hello`);
  const body = await response.text();
  const exit = await Promise.race([
    serviceExit,
    delay(10000).then(() => {
      service.kill("SIGKILL");
      return { status: null, signal: "SIGKILL" };
    })
  ]);
  const interpreted = await assertClosedInterpretation(proof.artifact, scenarioId);

  assert.equal(response.status, 200);
  assert.equal(body, "Hello, world!\n");
  assert.equal(exit.status, 0);

  const serviceRun = Object.freeze({
    args: [portPath],
    command: binaryPath,
    cwd: serviceRoot,
    pid: service.pid,
    signal: exit.signal,
    status: exit.status,
    stderr: serviceStderr,
    stdout: serviceStdout
  });
  const clientRequest = Object.freeze({
    body,
    status: response.status,
    url: `http://127.0.0.1:${port}/hello`
  });
  const summaryPath = await writeSandboxSummary(sandbox, {
    artifactSha256: proof.artifactSha256,
    clientRequest,
    commandProofs: [compile, serviceRun],
    interpretedDisposition: interpreted.lifecycle.lifecycleDisposition,
    sourceRule: "rust service subject and client request executed in sandbox; ABI route truth copied read-only"
  });
  assert.equal(existsSync(summaryPath), true);
});

test("runs SCN-GLC-HELLO-WORLD-PARALLEL-JS in an isolated sandbox", async () => {
  const scenarioId = "SCN-GLC-HELLO-WORLD-PARALLEL-JS";
  const sandbox = await prepareSandbox(scenarioId);
  const proof = await readPinnedRouteProof(ROUTE_PROOFS.parallelJs);
  await copyRouteProofInputs(sandbox, proof);
  const scriptRoot = path.join(sandbox.workspace, "parallel");
  const outputRoot = path.join(scriptRoot, "output");
  await writeText(
    path.join(scriptRoot, "hello-branch.mjs"),
    `import { mkdir, writeFile } from "node:fs/promises";\nawait mkdir(new URL("./output/", import.meta.url), { recursive: true });\nawait writeFile(new URL("./output/hello.txt", import.meta.url), "Hello", "utf8");\nprocess.stdout.write("Hello");\n`
  );
  await writeText(
    path.join(scriptRoot, "world-branch.mjs"),
    `import { mkdir, writeFile } from "node:fs/promises";\nawait mkdir(new URL("./output/", import.meta.url), { recursive: true });\nawait writeFile(new URL("./output/world.txt", import.meta.url), "world", "utf8");\nprocess.stdout.write("world");\n`
  );
  await writeText(
    path.join(scriptRoot, "fan-in.mjs"),
    `import { readFile, writeFile } from "node:fs/promises";\nconst hello = await readFile(new URL("./output/hello.txt", import.meta.url), "utf8");\nconst world = await readFile(new URL("./output/world.txt", import.meta.url), "utf8");\nconst greeting = hello + ", " + world + "!\\n";\nawait writeFile(new URL("./output/fan-in.txt", import.meta.url), greeting, "utf8");\nprocess.stdout.write(greeting);\n`
  );

  const [hello, world] = await Promise.all([
    runCommand(process.execPath, ["hello-branch.mjs"], {
      cwd: scriptRoot,
      timeoutMs: 10000,
      workspace: sandbox.workspace
    }),
    runCommand(process.execPath, ["world-branch.mjs"], {
      cwd: scriptRoot,
      timeoutMs: 10000,
      workspace: sandbox.workspace
    })
  ]);
  const fanIn = await runCommand(process.execPath, ["fan-in.mjs"], {
    cwd: scriptRoot,
    timeoutMs: 10000,
    workspace: sandbox.workspace
  });
  const interpreted = await assertClosedInterpretation(proof.artifact, scenarioId);
  const frontier = interpretParallelFrontierState({
    runtimeEvents: proof.artifact.replayEvents,
    lifecycleState: proof.artifact.lifecycleState
  });

  assert.equal(hello.status, 0);
  assert.equal(world.status, 0);
  assert.equal(fanIn.status, 0);
  assert.equal(hello.stdout, "Hello");
  assert.equal(world.stdout, "world");
  assert.equal(fanIn.stdout, "Hello, world!\n");
  assert.equal(await readFile(path.join(outputRoot, "fan-in.txt"), "utf8"), "Hello, world!\n");
  assert.equal(frontier.status, "accepted");
  assert.equal(frontier.value.readiness, "fan_in_ready");
  assert.equal(frontier.value.branchPayloads.length, 3);
  assert.equal(interpreted.lifecycle.lifecycleDisposition, "release_readiness_candidate");

  const summaryPath = await writeSandboxSummary(sandbox, {
    artifactSha256: proof.artifactSha256,
    commandProofs: [hello, world, fanIn],
    interpretedDisposition: interpreted.lifecycle.lifecycleDisposition,
    parallelReadiness: frontier.value.readiness,
    sourceRule: "parallel js branch subjects executed in sandbox; ABI branch/frontier truth copied read-only"
  });
  assert.equal(existsSync(summaryPath), true);
});

test("records SCN-GLC-HELLO-WORLD-ABG42-STARTUP in an isolated sandbox", async () => {
  const scenarioId = "SCN-GLC-HELLO-WORLD-ABG42-STARTUP";
  const sandbox = await prepareSandbox(scenarioId);
  const proof = await readPinnedGlcStartupProof();
  await copyStartupProofInputs(sandbox, proof);
  const view = interpretStartupRegistryState({
    proof: proof.proof,
    runtimeEvents: proof.events,
    liveArtifacts: proof.liveArtifacts
  });

  assert.equal(view.status, "accepted");
  assert.equal(view.value.readiness, "traversal_converged");
  assert.equal(view.value.registryEntryCount, 6);
  assert.equal(view.value.selectedEntryKinds.includes("graph_function"), true);
  assert.equal(proof.proof.startOutput.event_kinds.includes("registry_entry_admitted"), true);
  assert.equal(proof.proof.startOutput.event_kinds.includes("graph_function_selected"), true);
  assert.equal(proof.proof.startOutput.event_kinds.includes("graph_call_opened"), true);

  const summaryPath = await writeSandboxSummary(sandbox, {
    artifactSha256: ABIOGENESIS_SUBSTRATE_PROVENANCE.proofArtifacts.glcHelloWorldBootstrapLive.artifactSha256,
    interpretedStartupReadiness: view.value.readiness,
    registryEntryCount: view.value.registryEntryCount,
    sourceRule: "ABG 4.2 startup proof copied read-only; no sandbox re-emission of registry or traversal truth"
  });
  assert.equal(existsSync(summaryPath), true);
});

async function waitForPortFile(portPath, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const info = await stat(portPath);
      if (info.isFile()) {
        const value = Number.parseInt(await readFile(portPath, "utf8"), 10);
        if (Number.isInteger(value) && value > 0) {
          return value;
        }
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    await delay(50);
  }
  throw new Error(`Timed out waiting for service port file at ${portPath}`);
}

test("sandbox runs do not share mutable workspaces", async () => {
  await rm(path.join(sandboxRoot, "workspace-sharing-negative-control"), {
    force: true,
    recursive: true
  });
  const left = await prepareSandbox("workspace-sharing-negative-control");
  const right = await prepareSandbox("workspace-sharing-negative-control");

  assert.notEqual(left.runRoot, right.runRoot);
  assert.notEqual(left.workspace, right.workspace);
  assert.equal(path.dirname(left.runRoot), path.dirname(right.runRoot));
});
