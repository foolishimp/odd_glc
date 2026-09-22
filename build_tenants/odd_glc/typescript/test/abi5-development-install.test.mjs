// Dependency-only checks. No lifecycle, event admission, model or subject tool.
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, readFile, realpath } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import * as product from "@abiogenesis/typescript-tenant/product";
import * as bootstrap from "../../../../bootstrap/index.mjs";

const projectRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const json = async path => JSON.parse(await readFile(resolve(projectRoot, path), "utf8"));
const pin = await json("build_tenants/odd_glc/typescript/abi5.development-pin.json");
const candidate = await json(`${pin.evidenceRoot}/native-install-candidate.json`);
const run = promisify(execFile);
const sha = bytes => createHash("sha256").update(bytes).digest("hex");

test("development pin identifies exact durable bytes, not a version label or release", async () => {
  assert.equal(pin.status, "development_candidate_not_release");
  assert.equal(`sha256:${sha(await readFile(resolve(projectRoot, pin.artifactPath)))}`, pin.artifactDigest);
  assert.equal(candidate.packageVersion, pin.packageVersion);
  assert.equal(candidate.artifactDigest, pin.artifactDigest);
  assert.equal(candidate.productContentDigest, pin.productContentDigest);
  assert.equal(candidate.manifestDigest, pin.manifestDigest);
});

test("native materialization and root npm dependency retain the same exact Product content", async () => {
  assert.equal(candidate.kind, "product_install_candidate");
  assert.equal(await product.installedProductContentMatches(candidate), true);
  // This alternate filesystem location is a physical-content check only. It is
  // not a second minted install identity or evidence of event admission.
  assert.equal(await product.installedProductContentMatches({
    ...candidate, installedRoot: resolve(projectRoot, "node_modules/@abiogenesis/typescript-tenant"),
  }), true);
});

test("root dependency, lockfile, thin bootstrap and CLI point to the installed development package", async () => {
  const consumer = await json("package.json");
  const lock = await json("package-lock.json");
  const installed = await json("node_modules/@abiogenesis/typescript-tenant/package.json");
  const dependency = `file:${pin.artifactPath}`;
  assert.equal(consumer.dependencies[pin.packageName], dependency);
  assert.equal(lock.packages[""].dependencies[pin.packageName], dependency);
  assert.equal(lock.packages[`node_modules/${pin.packageName}`].resolved, dependency);
  assert.equal(lock.packages[`node_modules/${pin.packageName}`].version, pin.packageVersion);
  const tarBytes = await readFile(resolve(projectRoot, pin.artifactPath));
  assert.equal(lock.packages[`node_modules/${pin.packageName}`].integrity,
    `sha512-${createHash("sha512").update(tarBytes).digest("base64")}`);
  assert.equal(installed.version, pin.packageVersion);
  assert.equal(bootstrap.ProductInstallPort, product.ProductInstallPort);
  assert.equal(bootstrap.ProductVerificationPort, product.ProductVerificationPort);
  assert.equal(await realpath(resolve(projectRoot, "node_modules/.bin/abg.cli")),
    resolve(projectRoot, "node_modules/@abiogenesis/typescript-tenant", installed.bin["abg.cli"]));
});

test("installed CLI returns its native argument refusal without any invocation", async () => {
  await assert.rejects(run(resolve(projectRoot, "node_modules/.bin/abg.cli"), [], {
    cwd: projectRoot, env: { ...process.env, NODE_OPTIONS: "" },
  }), error => {
    assert.equal(error.code, 2);
    const result = JSON.parse(error.stdout);
    assert.equal(result.kind, "public_transport_refusal");
    assert.equal(result.code, "invalid_arguments");
    assert.equal(error.stderr, "");
    return true;
  });
});

test("exact predecessor default state is recoverable and old active binding is absent", async () => {
  const preimage = await json(`${pin.evidenceRoot}/pre-migration-identities.json`);
  const archive = ".genesis/development-products/abiogenesis-5-dev/predecessor-default-4.6";
  for (const row of preimage.files) {
    if (["AGENTS.md", "CLAUDE.md"].includes(row.path)) continue;
    const archived = row.path.startsWith(".abiogenesis/") ||
      ["package.json", "package-lock.json", "bootstrap/index.mjs"].includes(row.path);
    const path = archived ? `${archive}/${row.path}` : row.path;
    assert.equal(sha(await readFile(resolve(projectRoot, path))), row.sha256, path);
  }
  await assert.rejects(access(resolve(projectRoot, ".abiogenesis")), { code: "ENOENT" });
});

test("current ABI notices preserve generated blocks and all other preexisting guidance", async () => {
  const preimage = await json(`${pin.evidenceRoot}/generated-context-preimages.json`);
  for (const file of preimage.files) {
    const text = await readFile(resolve(projectRoot, file.path), "utf8");
    assert.match(text, /exact ABI5 development pin/);
    assert.match(text, /retained historical predecessor context/);
    const withoutNotice = text.replace(/^## Current ABI dependency\n[\s\S]*?\n(?=<!-- ABG_GTL_CONTEXT_START -->)/m, "");
    assert.equal(sha(withoutNotice), file.preNoticeSha256, `${file.path}: only the notice changed`);
    for (const block of file.blocks) {
      const startMarker = `<!-- ${block.marker}_START -->`;
      const endMarker = `<!-- ${block.marker}_END -->`;
      const start = text.indexOf(startMarker);
      const end = text.indexOf(endMarker);
      assert(start >= 0 && end > start);
      const body = text.slice(start, end + endMarker.length);
      assert.equal(Buffer.byteLength(body), block.bytes);
      assert.equal(sha(body), block.sha256, `${file.path}: ${block.marker}`);
    }
  }
});

test("migration receipt makes no runtime or sandbox-admission claim", async () => {
  const receipt = await json(`${pin.evidenceRoot}/dependency-materialization.json`);
  assert.equal(receipt.admissionStatus, "materialized_only_not_event_admitted");
  assert.equal(receipt.workspaceBinding, null);
  assert.equal(receipt.runtimeInvocations, 0);
  assert.equal(receipt.modelCalls, 0);
  assert.equal(receipt.subjectCommands, 0);
});
