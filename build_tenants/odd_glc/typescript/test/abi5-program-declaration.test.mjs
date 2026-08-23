import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ABI5_TYPESCRIPT_TENANT_ROOT = process.env.ABI5_TYPESCRIPT_TENANT_ROOT ??
  "/Users/jim/src/apps/abiogenesis-5-root-build/build_tenants/abiogenesis/typescript";
const EXPECTED_ABI5_PACKAGE_VERSION = "5.0.0-dev.286";
const EXPECTED_ABI5_VALIDATOR_SHA256 =
  "e5bb4aeaf14670f17808e0385d64529eb25ad67a15e89beefbb4bfd0e641263c";
const EXPECTED_ABI5_RAW_ADMISSION_SHA256 =
  "fdb3e1257b55ea8ae262742a621b91a7c565d982970bb7d8e67cbec64252ade6";
const EXPECTED_ABI5_PROGRAM_VALIDATION_SHA256 =
  "1020ac3c6c23af0520e463696d19787da6f8bdec4e54d90aeaed811042098337";
const EXPECTED_ABI5_PRODUCT_INDEX_SHA256 =
  "19b2cab5afc3b39b3b9b25d2d91668be32b3c55efc3b8a12d0920417a9051482";
const EXPECTED_ABI5_PRODUCT_SEMANTICS_SHA256 =
  "a66349f8b18c3296b56831e68938b99b58e10277d9c010fefcfa38f03ee20a49";
const EXPECTED_ABI5_SOURCE_DERIVATION_SHA256 =
  "0bb589155b36fceecdad236aa2aab77c3cb05a8168896194edd6b7882e6c0c81";
const EXPECTED_ABI5_PUBLIC_OPERATIONS_SHA256 =
  "cc76169698835fd200027e18e3575c5426f91a5c80ac575dd6cdab3084676e17";

const sha256Bytes = (value) => createHash("sha256").update(value).digest("hex");
const packageJson = JSON.parse(await readFile(
  join(ABI5_TYPESCRIPT_TENANT_ROOT, "package.json"),
  "utf8"
));
const validatorRelativePath = packageJson.exports?.["./validator"]?.import;
const productRelativePath = packageJson.exports?.["./product"]?.import;
assert.equal(typeof validatorRelativePath, "string");
assert.equal(typeof productRelativePath, "string");
const validatorPath = join(ABI5_TYPESCRIPT_TENANT_ROOT, validatorRelativePath);
const productPath = join(ABI5_TYPESCRIPT_TENANT_ROOT, productRelativePath);
const validatorBytes = await readFile(validatorPath);
const rawAdmissionBytes = await readFile(join(validatorPath, "..", "raw_admission.js"));
const programValidationBytes = await readFile(join(validatorPath, "..", "validation.js"));
const productIndexBytes = await readFile(productPath);
const productSemanticsBytes = await readFile(join(productPath, "..", "semantics.js"));
const sourceDerivationBytes = await readFile(join(
  ABI5_TYPESCRIPT_TENANT_ROOT,
  "build/code/src/abg/invocation_admission.js"
));
const publicOperationsBytes = await readFile(join(
  ABI5_TYPESCRIPT_TENANT_ROOT,
  "build/code/src/public/operations.js"
));
const abi5Validator = await import(pathToFileURL(validatorPath).href);
const abi5Product = await import(pathToFileURL(productPath).href);
const sourceCandidateUrl = new URL("../src/abi5_program.mjs", import.meta.url);
const sourceCandidateBytes = await readFile(sourceCandidateUrl);
const sourceCandidateDigest = `sha256:${sha256Bytes(sourceCandidateBytes)}`;

const candidateHarnessRoot = await mkdtemp(join(tmpdir(), "odd-glc-abi5-candidate-"));
const candidateModulePath = join(candidateHarnessRoot, "build/code/src/abi5_program.mjs");
const abi5PackageLink = join(
  candidateHarnessRoot,
  "node_modules/@abiogenesis/typescript-tenant"
);
await mkdir(join(candidateHarnessRoot, "build/code/src"), { recursive: true });
await mkdir(join(candidateHarnessRoot, "node_modules/@abiogenesis"), { recursive: true });
await copyFile(sourceCandidateUrl, candidateModulePath);
await symlink(ABI5_TYPESCRIPT_TENANT_ROOT, abi5PackageLink, "dir");
const candidateModule = await import(pathToFileURL(candidateModulePath).href);
test.after(async () => rm(candidateHarnessRoot, { recursive: true, force: true }));

const {
  ODD_GLC_ABI5_AUTHORITY_BOUNDARY,
  ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT,
  ODD_GLC_ABI5_CLOSURE_CONTRACT,
  ODD_GLC_ABI5_CLOSURE_CONTRACTS,
  ODD_GLC_ABI5_CONTRACTS,
  ODD_GLC_ABI5_GRAPH_FUNCTION,
  ODD_GLC_ABI5_IMPLEMENTATION_BINDING,
  ODD_GLC_ABI5_IMPLEMENTATION_DESCRIPTOR,
  ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION,
  ODD_GLC_ABI5_PACKAGE_IDENTITY,
  ODD_GLC_ABI5_PRODUCT_SEMANTICS,
  ODD_GLC_ABI5_PRODUCT_SEMANTICS_BINDING,
  ODD_GLC_ABI5_PROGRAM,
  ODD_GLC_ABI5_PROGRAM_IDS,
  ODD_GLC_ABI5_SOURCE_CLOSURE_CONTRACT,
  ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION,
  ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING,
  ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_DESCRIPTOR,
  ODD_GLC_ABI5_SOURCE_PROGRAM,
  constructOddGlcAbi5ModulePublication,
  evaluateOddGlcAbi5LifecycleInput,
  interpretAbi5LifecycleProjection,
  realizeOddGlcAbi5FreshSource
} = candidateModule;

const PRODUCT_CONTENT_DIGEST = `sha256:${"b".repeat(64)}`;
const PRODUCT_MANIFEST_DIGEST = `sha256:${"c".repeat(64)}`;
const EXPECTED_SOURCE_PROGRAM_DIGEST =
  "sha256:4dc4ac7693e71fe45992ae38691b181c24cdd7d2c2b5cd5848cad7901cff08c0";
const EXPECTED_LIFECYCLE_PROGRAM_DIGEST =
  "sha256:8d6d132a3ead96f2a74ea9c93d2995adbe76b9da4f3d52a688d8ec35bae1c89c";

function expectRawAdmission(value, subjectKind, contractRef) {
  const admitted = abi5Validator.rawAdmitValue(value, subjectKind, contractRef);
  assert.equal(admitted.kind, "raw_admitted_value", JSON.stringify(admitted));
  return admitted;
}

function artifactBasis(overrides = {}) {
  return Object.freeze({
    productId: ODD_GLC_ABI5_PACKAGE_IDENTITY.productId,
    packageName: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageName,
    packageVersion: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageVersion,
    artifactDigest: sourceCandidateDigest,
    productContentDigest: PRODUCT_CONTENT_DIGEST,
    productManifestDigest: PRODUCT_MANIFEST_DIGEST,
    ...overrides
  });
}

function contribution(graphFunction, program = ODD_GLC_ABI5_PROGRAM) {
  return Object.freeze({
    handle: graphFunction.name,
    kind: "graph_function",
    declarationOrContractRef: graphFunction.name,
    owningProductId: ODD_GLC_ABI5_PACKAGE_IDENTITY.productId,
    programMembershipRefs: Object.freeze([program.programRef]),
    readinessPrerequisiteRefs: Object.freeze([program.programRef]),
    compatibilityRefs: Object.freeze(["compatibility://abiogenesis/major/5"]),
    provenanceRefs: Object.freeze([sourceCandidateDigest, PRODUCT_MANIFEST_DIGEST])
  });
}

function staticPublication(options) {
  const declaredPublication = constructOddGlcAbi5ModulePublication(artifactBasis());
  if (options === undefined) {
    return Object.freeze({
      publication: declaredPublication,
      contributions: declaredPublication.contributions
    });
  }
  const {
  program = ODD_GLC_ABI5_PROGRAM,
  graphFunctions = [
    ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION,
    ODD_GLC_ABI5_GRAPH_FUNCTION,
    ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION
  ],
  contracts = ODD_GLC_ABI5_CONTRACTS,
  implementationBindings = [
    ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING,
    ODD_GLC_ABI5_IMPLEMENTATION_BINDING
  ],
  closureContracts = ODD_GLC_ABI5_CLOSURE_CONTRACTS,
  productSemanticsBinding = ODD_GLC_ABI5_PRODUCT_SEMANTICS_BINDING
  } = options;
  const programs = Object.freeze([ODD_GLC_ABI5_SOURCE_PROGRAM, program]);
  const contributions = Object.freeze(
    graphFunctions.map((graphFunction) => contribution(
      graphFunction,
      graphFunction.name === ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef
        ? ODD_GLC_ABI5_SOURCE_PROGRAM
        : program
    ))
  );
  return Object.freeze({
    publication: Object.freeze({
      ...declaredPublication,
      productSemanticsBinding,
      contracts,
      evaluators: Object.freeze([]),
      rules: Object.freeze([]),
      implementationBindings,
      closureContracts,
      programs,
      graphFunctions,
      contributions
    }),
    contributions
  });
}

function validateStaticProgram(options) {
  const { publication, contributions } = staticPublication(options);
  const publicationAdmission = expectRawAdmission(
    publication,
    "module_publication",
    "contract://abiogenesis/gtl/module-publication@5"
  );
  const contributionAdmissions = contributions.map((value) => expectRawAdmission(
    value,
    "catalog_contribution",
    "contract://abiogenesis/gtl/catalog-contribution@5"
  ));
  const program = options?.program ?? ODD_GLC_ABI5_PROGRAM;
  const graphFunctions = options?.graphFunctions ?? [
    ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION,
    ODD_GLC_ABI5_GRAPH_FUNCTION,
    ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION
  ];
  const contracts = options?.contracts ?? ODD_GLC_ABI5_CONTRACTS;
  const implementationBindings = options?.implementationBindings ?? [
    ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING,
    ODD_GLC_ABI5_IMPLEMENTATION_BINDING
  ];
  const closureContracts = options?.closureContracts ?? ODD_GLC_ABI5_CLOSURE_CONTRACTS;
  const validate = (programValue) => abi5Validator.validateProgram({
    publication: publicationAdmission,
    program: expectRawAdmission(
      programValue,
      "gtl_program",
      "contract://abiogenesis/gtl/program@5"
    ),
    graphFunctions: graphFunctions
      .filter((value) => programValue.callableMembership.includes(value.name))
      .map((value) => expectRawAdmission(
        value,
        "graph_function",
        "contract://abiogenesis/gtl/graph-function@5"
      )),
    contracts: contracts.map((value) => expectRawAdmission(
      value,
      "contract_declaration",
      value.contractRef
    )),
    implementationBindings: implementationBindings.map((value) => expectRawAdmission(
      value,
      "implementation_binding",
      "contract://abiogenesis/gtl/implementation-binding@5"
    )),
    closureContracts: closureContracts.map((value) => expectRawAdmission(
      value,
      "closure_contract",
      value.closureContractRef
    ))
  });
  return Object.freeze({
    publication: abi5Validator.validatePublication(
      publicationAdmission,
      contributionAdmissions
    ),
    sourceProgram: validate(ODD_GLC_ABI5_SOURCE_PROGRAM),
    program: validate(program)
  });
}

const DIGEST = `sha256:${"a".repeat(64)}`;

function freshSourceRequest(overrides = {}) {
  return Object.freeze({
    kind: "odd_glc_fresh_source_request",
    schemaVersion: "5.0.0",
    workspaceId: "workspace://odd-glc/source",
    workspaceBindingId: "workspace-binding://abiogenesis/odd-glc-source",
    workspaceBindingDigest: DIGEST,
    ...overrides
  });
}

function freshSourceResult(overrides = {}) {
  return Object.freeze({
    kind: "odd_glc_fresh_source_result",
    schemaVersion: "5.0.0",
    workspaceId: "workspace://odd-glc/source",
    workspaceBindingId: "workspace-binding://abiogenesis/odd-glc-source",
    workspaceBindingDigest: DIGEST,
    ...overrides
  });
}

function sourceResultBasis(overrides = {}) {
  const sourceResultValue = overrides.sourceResultValue ?? freshSourceResult();
  const body = Object.freeze({
    publicAuthorityDigest: DIGEST,
    sourceInvocationAdmissionRef: "invocation-admission://abiogenesis/odd-glc-source",
    sourceInvocationRef: "invocation://abiogenesis/odd-glc-source",
    sourceRunId: "run://abiogenesis/odd-glc-source",
    sourceGraphCallId: "graph-call://abiogenesis/odd-glc-source",
    sourceGraphFunctionRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef,
    sourceCCallRef: "c-call://abiogenesis/odd-glc-source",
    sourceResultAdmissionEventRef: "event://abiogenesis/odd-glc-source/result",
    sourceResultJudgmentEventRef: "event://abiogenesis/odd-glc-source/judgment",
    sourceResultRef: "result://abiogenesis/odd-glc-source",
    sourceResultDigest: DIGEST,
    sourceResultValueDigest: abi5Product.sha256Canonical(sourceResultValue),
    sourceResultContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef,
    sourceResultValue,
    sourceReplayRef: "replay://abiogenesis/odd-glc-source",
    sourceReplayDigest: DIGEST,
    sourceWorkspaceId: sourceResultValue.workspaceId,
    workspaceBindingId: sourceResultValue.workspaceBindingId,
    workspaceBindingDigest: sourceResultValue.workspaceBindingDigest,
    ...overrides
  });
  const basisDigest = abi5Product.sha256Canonical(body);
  return Object.freeze({
    kind: "invocation_source_result_basis",
    schemaVersion: "5.0.0",
    basisRef:
      `invocation-source-result://abiogenesis/${basisDigest.slice("sha256:".length)}`,
    basisDigest,
    ...body
  });
}

function invocationBasis(input, source = input, overrides = {}) {
  const freshSource = input.kind === "odd_glc_fresh_source_request" ? input : null;
  return Object.freeze({
    input,
    workspaceBindingId: freshSource?.workspaceBindingId ?? source.workspaceBindingId,
    workspaceBindingDigest: freshSource?.workspaceBindingDigest ?? source.workspaceBindingDigest,
    workspaceId: freshSource?.workspaceId ?? source.sourceWorkspaceId,
    actionCatalog: null,
    catalogView: Object.freeze({}),
    catalogApplications: Object.freeze([]),
    sourceResultBasis: freshSource === null ? source : null,
    ...overrides
  });
}

test("focused proof uses exact built ABIogenesis 5 Product and validator exports", () => {
  assert.equal(packageJson.version, EXPECTED_ABI5_PACKAGE_VERSION);
  assert.equal(packageJson.exports["./product"].import, "./build/code/src/product/index.js");
  assert.equal(packageJson.exports["./public"].import, "./build/code/src/public/index.js");
  assert.equal(packageJson.exports["./validator"].import, "./build/code/src/validator/index.js");
  assert.equal(sha256Bytes(validatorBytes), EXPECTED_ABI5_VALIDATOR_SHA256);
  assert.equal(sha256Bytes(rawAdmissionBytes), EXPECTED_ABI5_RAW_ADMISSION_SHA256);
  assert.equal(sha256Bytes(programValidationBytes), EXPECTED_ABI5_PROGRAM_VALIDATION_SHA256);
  assert.equal(sha256Bytes(productIndexBytes), EXPECTED_ABI5_PRODUCT_INDEX_SHA256);
  assert.equal(sha256Bytes(productSemanticsBytes), EXPECTED_ABI5_PRODUCT_SEMANTICS_SHA256);
  assert.equal(sha256Bytes(sourceDerivationBytes), EXPECTED_ABI5_SOURCE_DERIVATION_SHA256);
  assert.equal(sha256Bytes(publicOperationsBytes), EXPECTED_ABI5_PUBLIC_OPERATIONS_SHA256);
  assert.equal(typeof abi5Validator.rawAdmitValue, "function");
  assert.equal(typeof abi5Validator.validatePublication, "function");
  assert.equal(typeof abi5Validator.validateProgram, "function");
  assert.equal(typeof abi5Product.canonicalJson, "function");
  assert.equal(typeof abi5Product.isSha256Digest, "function");
  assert.equal(typeof abi5Product.sha256Canonical, "function");
  assert.equal(typeof abi5Product.loadInstalledProductSemantics, "function");
});

test("ABIogenesis 5 declares a fresh identity source Program and a source-derived lifecycle Program", () => {
  assert.deepEqual(Object.keys(ODD_GLC_ABI5_PROGRAM).sort(), [
    "callableMembership",
    "closureContractRef",
    "kind",
    "moduleRef",
    "policies",
    "programRef",
    "starts",
    "version"
  ]);
  assert.equal(ODD_GLC_ABI5_PROGRAM.kind, "gtl_program");
  assert.equal(ODD_GLC_ABI5_PROGRAM.version, "5.0.0");
  assert.deepEqual(ODD_GLC_ABI5_PROGRAM.starts, [{
    startRef: ODD_GLC_ABI5_PROGRAM_IDS.startRef,
    graphFunctionRef: ODD_GLC_ABI5_PROGRAM_IDS.graphFunctionRef
  }]);
  assert.deepEqual(ODD_GLC_ABI5_PROGRAM.callableMembership, [
    ODD_GLC_ABI5_PROGRAM_IDS.graphFunctionRef,
    ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphFunctionRef
  ]);
  assert.deepEqual(ODD_GLC_ABI5_SOURCE_PROGRAM.starts, [{
    startRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceStartRef,
    graphFunctionRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef
  }]);
  assert.deepEqual(ODD_GLC_ABI5_SOURCE_PROGRAM.callableMembership, [
    ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef
  ]);
  assert.equal(
    ODD_GLC_ABI5_GRAPH_FUNCTION.template.nodes[0].term.graphFunctionRef,
    ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphFunctionRef
  );
  assert.equal(Object.isFrozen(ODD_GLC_ABI5_PROGRAM), true);
  assert.equal(Object.isFrozen(ODD_GLC_ABI5_PROGRAM.starts), true);
  assert.equal(Object.isFrozen(ODD_GLC_ABI5_PROGRAM.callableMembership), true);
  assert.equal(Object.isFrozen(ODD_GLC_ABI5_PROGRAM.policies), true);
});

test("source, workflow root, and deterministic leaves close over distinct evidence contracts", () => {
  const contractRefs = new Set(ODD_GLC_ABI5_CONTRACTS.map((entry) => entry.contractRef));
  assert.equal(contractRefs.size, ODD_GLC_ABI5_CONTRACTS.length);
  assert.equal(ODD_GLC_ABI5_CONTRACTS.length, 13);
  for (const entry of ODD_GLC_ABI5_CONTRACTS) {
    assert.equal(entry.contractVersion, "5.0.0");
    assert.equal(Object.isFrozen(entry), true);
  }
  for (const closure of ODD_GLC_ABI5_CLOSURE_CONTRACTS) {
    for (const ref of [
      closure.closureContractRef,
      closure.evidenceContractRef,
      closure.resultContractRef,
      closure.refusalContractRef,
      closure.judgmentContractRef,
      closure.rejectionContractRef,
      closure.transitionContractRef
    ]) {
      assert.equal(contractRefs.has(ref), true, ref);
    }
  }
  assert.equal(ODD_GLC_ABI5_CLOSURE_CONTRACT.closureScope, "run");
  assert.equal(
    ODD_GLC_ABI5_CLOSURE_CONTRACT.predicateRef,
    ODD_GLC_ABI5_GRAPH_FUNCTION.declarations["abg.judgment_predicate"]
  );
  assert.deepEqual(ODD_GLC_ABI5_CLOSURE_CONTRACT.eventKindRefs, [
    "terminal_reached",
    "frame_closed",
    "graph_call_closed",
    "run_closed"
  ]);
  assert.equal(ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT.closureScope, "graph_call");
  assert.equal(
    ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT.predicateRef,
    ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION.declarations["abg.judgment_predicate"]
  );
  assert.equal(ODD_GLC_ABI5_SOURCE_CLOSURE_CONTRACT.closureScope, "run");
  assert.equal(
    ODD_GLC_ABI5_SOURCE_CLOSURE_CONTRACT.evidenceContractRef,
    ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef
  );
  assert.equal(
    ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT.evidenceContractRef,
    ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef
  );
  assert.equal(
    ODD_GLC_ABI5_CLOSURE_CONTRACT.evidenceContractRef,
    ODD_GLC_ABI5_PROGRAM_IDS.evidenceContractRef
  );
  assert.equal(
    ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION.declarations["abg.evidence_contract"],
    ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef
  );
  assert.equal(
    ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION.declarations["abg.evidence_contract"],
    ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef
  );
  assert.equal(
    ODD_GLC_ABI5_GRAPH_FUNCTION.declarations["abg.evidence_contract"],
    ODD_GLC_ABI5_PROGRAM_IDS.evidenceContractRef
  );
  assert.equal(
    ODD_GLC_ABI5_CONTRACTS.find((row) =>
      row.contractRef === ODD_GLC_ABI5_PROGRAM_IDS.evidenceContractRef
    ).valueKind,
    "sub_traversal_evidence_candidate"
  );
  assert.equal(
    ODD_GLC_ABI5_CONTRACTS.find((row) =>
      row.contractRef === ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef
    ).valueKind,
    "deterministic_evidence_candidate"
  );
  assert.equal(
    ODD_GLC_ABI5_CONTRACTS.find((row) =>
      row.contractRef === ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef
    ).valueKind,
    "odd_glc_fresh_source_request"
  );
  assert.equal(
    ODD_GLC_ABI5_CONTRACTS.find((row) =>
      row.contractRef === ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef
    ).valueKind,
    "odd_glc_fresh_source_result"
  );
  assert.deepEqual(ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION.effects, []);
  assert.deepEqual(ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT.eventKindRefs, [
    "terminal_reached",
    "frame_closed",
    "graph_call_closed"
  ]);
  assert.equal(
    ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION.declarations["abg.child_closure_contract"],
    ODD_GLC_ABI5_PROGRAM_IDS.childClosureContractRef
  );
  assert.deepEqual(ODD_GLC_ABI5_GRAPH_FUNCTION.effects, []);
  assert.deepEqual(ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION.effects, []);
});

test("typed input evaluation refuses malformed ABI source-result carriers", () => {
  const accepted = evaluateOddGlcAbi5LifecycleInput(
    ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
    sourceResultBasis()
  );
  assert.equal(accepted.disposition, "accepted");
  assert.equal(Object.isFrozen(accepted.input), true);
  assert.equal(Object.isFrozen(accepted.input.sourceResultValue), true);

  const cases = [
    [undefined, "malformed_carrier"],
    [{}, "malformed_carrier"],
    [{ ...sourceResultBasis(), kind: "caller_shadow_context" }, "wrong_kind"],
    [{ ...sourceResultBasis(), schemaVersion: "4.0.0" }, "wrong_version"],
    [{ ...sourceResultBasis(), sourceReplayDigest: "sha256:not-a-digest" }, "malformed_digest"],
    [{ ...sourceResultBasis(), sourceResultRef: "" }, "empty_ref"],
    [{ ...sourceResultBasis(), sourceResultValueDigest: DIGEST }, "source_value_digest_mismatch"]
  ];
  for (const [value, code] of cases) {
    const refusal = evaluateOddGlcAbi5LifecycleInput(
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      value
    );
    assert.equal(refusal.kind, "odd_glc_lifecycle_interpretation_refusal");
    assert.equal(refusal.disposition, "refused");
    assert.equal(refusal.code, code);
  }
});

test("fresh source accepts only Product request identities authenticated by Public", () => {
  const request = freshSourceRequest();
  const accepted = evaluateOddGlcAbi5LifecycleInput(
    ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef,
    request
  );
  assert.equal(accepted.disposition, "accepted");
  assert.deepEqual(accepted.input, request);
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(invocationBasis(request)),
    true
  );
  for (const invalid of [
    { ...request, workspaceId: "" },
    { ...request, workspaceBindingDigest: "sha256:not-a-digest" },
    {
      ...request,
      admissionEventRef: "event://abiogenesis/forged-workspace-admission"
    },
    { ...request, disposition: "admitted" }
  ]) {
    assert.equal(evaluateOddGlcAbi5LifecycleInput(
      ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef,
      invalid
    ).disposition, "refused");
  }
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(request, request, { workspaceId: `${request.workspaceId}/other` })
    ),
    false
  );
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(request, request, {
        workspaceBindingDigest: `sha256:${"d".repeat(64)}`
      })
    ),
    false
  );
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(request, request, { sourceResultBasis: sourceResultBasis() })
    ),
    false
  );
});

test("Product semantics requires Public's exact source Run and workspace scope", () => {
  const authority = sourceResultBasis();
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(authority)
    ),
    true
  );
  const otherRun = sourceResultBasis({ sourceRunId: `${authority.sourceRunId}/other` });
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(otherRun, authority)
    ),
    false,
    "a structurally valid caller carrier cannot substitute Public's independently derived Run basis"
  );
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(authority, authority, { workspaceId: `${authority.sourceWorkspaceId}/other` })
    ),
    false
  );
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(authority, authority, { workspaceBindingDigest: `sha256:${"b".repeat(64)}` })
    ),
    false
  );
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(authority, authority, { sourceResultBasis: null })
    ),
    false
  );
  const wrongSourceProgram = sourceResultBasis({
    sourceGraphFunctionRef: "graph-function://other/fresh-source@5"
  });
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(wrongSourceProgram)
    ),
    false
  );
  const mismatchedSeedResult = sourceResultBasis({
    sourceResultValue: freshSourceResult({ workspaceId: "workspace://other" }),
    sourceWorkspaceId: authority.sourceWorkspaceId
  });
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateInvocationBasis(
      invocationBasis(mismatchedSeedResult)
    ),
    false
  );
});

test("publication resolves the real loadable provider and refuses substituted identities", () => {
  const publication = constructOddGlcAbi5ModulePublication(artifactBasis());
  const binding = publication.productSemanticsBinding;
  assert.equal(binding.namedSymbol, "ODD_GLC_ABI5_PRODUCT_SEMANTICS");
  assert.equal(candidateModule[binding.namedSymbol], ODD_GLC_ABI5_PRODUCT_SEMANTICS);
  assert.equal(ODD_GLC_ABI5_PRODUCT_SEMANTICS.kind, "product_semantics_provider");
  assert.equal(ODD_GLC_ABI5_PRODUCT_SEMANTICS.bindingRef, binding.bindingRef);
  assert.equal(ODD_GLC_ABI5_PRODUCT_SEMANTICS.packageName, binding.packageName);
  assert.equal(ODD_GLC_ABI5_PRODUCT_SEMANTICS.packageVersion, binding.packageVersion);
  assert.equal(candidateModule.SUBSTITUTED_PRODUCT_SEMANTICS, undefined);
  assert.notEqual(ODD_GLC_ABI5_PRODUCT_SEMANTICS.bindingRef, `${binding.bindingRef}/other`);
  assert.notEqual(ODD_GLC_ABI5_PRODUCT_SEMANTICS.packageVersion, `${binding.packageVersion}.other`);
  assert.notEqual(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS,
    candidateModule[ODD_GLC_ABI5_IMPLEMENTATION_BINDING.namedSymbol],
    "the Product provider and executable leaf are distinct publication relations"
  );
  assert.deepEqual(publication.programs, [ODD_GLC_ABI5_SOURCE_PROGRAM, ODD_GLC_ABI5_PROGRAM]);
  assert.deepEqual(publication.implementationBindings, [
    ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING,
    ODD_GLC_ABI5_IMPLEMENTATION_BINDING
  ]);
  for (const row of publication.contributions) {
    assert.deepEqual(row.provenanceRefs, [sourceCandidateDigest, PRODUCT_MANIFEST_DIGEST]);
    assert.equal(row.provenanceRefs.includes(PRODUCT_CONTENT_DIGEST), false);
  }
});

test("fresh leaf proposes only Product workspace identities for ABG result admission", () => {
  const input = freshSourceRequest();
  const realization = realizeOddGlcAbi5FreshSource(input);
  assert.deepEqual(realization.resultCandidate, freshSourceResult());
  assert.equal(Object.isFrozen(realization.resultCandidate), true);
  assert.equal(realization.evidenceCandidates[0].kind, "deterministic_evidence_candidate");
  assert.equal(
    realization.evidenceCandidates[0].implementationRef,
    ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.implementationRef
  );
  assert.equal(realization.evidenceCandidates[0].inputDigest, abi5Product.sha256Canonical(input));
  assert.equal(
    realization.evidenceCandidates[0].outputDigest,
    abi5Product.sha256Canonical(realization.resultCandidate)
  );
  const relation = ODD_GLC_ABI5_PRODUCT_SEMANTICS.resolveJudgmentRelation(
    ODD_GLC_ABI5_PROGRAM_IDS.sourceJudgmentPredicateRef
  );
  assert.equal(relation.evaluate(input, realization.resultCandidate), true);
  assert.equal(
    relation.evaluate(input, freshSourceResult({ workspaceId: "workspace://other" })),
    false
  );
  const forgedAdmission = {
    ...realization.resultCandidate,
    admissionEventRef: "event://abiogenesis/forged-workspace-admission"
  };
  assert.equal(relation.evaluate(input, forgedAdmission), false);
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateContractValue(
      "odd_glc_fresh_source_result",
      forgedAdmission
    ),
    false
  );
  assert.equal(
    ODD_GLC_ABI5_PRODUCT_SEMANTICS.validateContractValue(
      "odd_glc_fresh_source_result",
      { ...realization.resultCandidate, disposition: "admitted" }
    ),
    false
  );

  const { bindingRef: _bindingRef, kind: _bindingKind, ...bindingBody } =
    ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING;
  const {
    descriptorDigest,
    kind: _descriptorKind,
    schemaVersion: _descriptorSchemaVersion,
    ...descriptorBody
  } = ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_DESCRIPTOR;
  assert.deepEqual(descriptorBody, bindingBody);
  assert.equal(descriptorDigest, abi5Product.sha256Canonical(descriptorBody));
});

test("pure interpretation leaf preserves ABI source identities without inventing disposition", () => {
  const input = sourceResultBasis();
  const realization = interpretAbi5LifecycleProjection(input);
  assert.equal(realization.kind, "leaf_realization_candidate");
  assert.equal(realization.disposition, "success");
  assert.deepEqual(realization.resultCandidate, {
    kind: "odd_glc_lifecycle_state",
    schemaVersion: "5.0.0",
    lifecycleDisposition: "no_disposition",
    sourceBasisRef: input.basisRef,
    sourceBasisDigest: input.basisDigest,
    publicAuthorityDigest: input.publicAuthorityDigest,
    sourceRunId: input.sourceRunId,
    sourceGraphCallId: input.sourceGraphCallId,
    sourceGraphFunctionRef: input.sourceGraphFunctionRef,
    sourceCCallRef: input.sourceCCallRef,
    sourceInvocationAdmissionRef: input.sourceInvocationAdmissionRef,
    sourceInvocationRef: input.sourceInvocationRef,
    sourceResultAdmissionEventRef: input.sourceResultAdmissionEventRef,
    sourceResultJudgmentEventRef: input.sourceResultJudgmentEventRef,
    sourceResultRef: input.sourceResultRef,
    sourceResultDigest: input.sourceResultDigest,
    sourceResultValueDigest: input.sourceResultValueDigest,
    sourceResultContractRef: input.sourceResultContractRef,
    sourceReplayRef: input.sourceReplayRef,
    sourceReplayDigest: input.sourceReplayDigest,
    sourceWorkspaceId: input.sourceWorkspaceId,
    workspaceBindingId: input.workspaceBindingId,
    workspaceBindingDigest: input.workspaceBindingDigest
  });
  const output = realization.resultCandidate;
  assert.equal(realization.evidenceCandidates[0].inputDigest, abi5Product.sha256Canonical(input));
  assert.equal(realization.evidenceCandidates[0].outputDigest, abi5Product.sha256Canonical(output));
  assert.equal(
    realization.evidenceCandidates[0].implementationRef,
    ODD_GLC_ABI5_IMPLEMENTATION_BINDING.implementationRef
  );
  assert.equal(Object.isFrozen(realization), true);
  assert.equal(Object.isFrozen(realization.evidenceCandidates), true);
  assert.equal(Object.isFrozen(realization.evidenceCandidates[0]), true);
  assert.equal(Object.isFrozen(realization.resultCandidate), true);

  const { bindingRef: _bindingRef, kind: _bindingKind, ...bindingBody } =
    ODD_GLC_ABI5_IMPLEMENTATION_BINDING;
  const {
    descriptorDigest,
    kind: _descriptorKind,
    schemaVersion: _descriptorSchemaVersion,
    ...descriptorBody
  } = ODD_GLC_ABI5_IMPLEMENTATION_DESCRIPTOR;
  assert.deepEqual(descriptorBody, bindingBody);
  assert.equal(descriptorDigest, abi5Product.sha256Canonical(descriptorBody));
  const relation = ODD_GLC_ABI5_PRODUCT_SEMANTICS.resolveJudgmentRelation(
    ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef
  );
  assert.equal(relation.evaluate(input, output), true);
  assert.equal(relation.evaluate(input, { ...output, lifecycleDisposition: "closed" }), false);
});

test("built ABIogenesis validator accepts the declared Program shape without proving runtime readiness", () => {
  const validation = validateStaticProgram();
  assert.equal(validation.publication.kind, "publication_validation", JSON.stringify(validation.publication));
  assert.deepEqual(validation.publication.diagnostics, []);
  assert.equal(validation.program.kind, "program_validation", JSON.stringify(validation.program));
  assert.deepEqual(validation.program.diagnostics, []);
  assert.equal(validation.sourceProgram.kind, "program_validation", JSON.stringify(validation.sourceProgram));
  assert.deepEqual(validation.sourceProgram.diagnostics, []);
  assert.equal(validation.sourceProgram.programRef, ODD_GLC_ABI5_PROGRAM_IDS.sourceProgramRef);
  assert.equal(validation.sourceProgram.programDigest, EXPECTED_SOURCE_PROGRAM_DIGEST);
  assert.equal(validation.sourceProgram.graphFunctionDigests.length, 1);
  assert.equal(validation.sourceProgram.contractDigests.length, 13);
  assert.equal(validation.sourceProgram.implementationBindingDigests.length, 2);
  assert.equal(validation.sourceProgram.closureContractDigests.length, 3);
  assert.equal(validation.sourceProgram.executableLeafRows.length, 1);
  assert.equal(
    validation.sourceProgram.executableLeafRows[0].graphFunctionRef,
    ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef
  );
  assert.equal(validation.program.programRef, ODD_GLC_ABI5_PROGRAM_IDS.programRef);
  assert.equal(validation.program.programDigest, EXPECTED_LIFECYCLE_PROGRAM_DIGEST);
  assert.equal(validation.program.graphFunctionDigests.length, 2);
  assert.equal(validation.program.contractDigests.length, 13);
  assert.equal(validation.program.implementationBindingDigests.length, 2);
  assert.equal(validation.program.closureContractDigests.length, 3);
  assert.equal(validation.program.executableLeafRows.length, 1);
  assert.equal(
    validation.program.executableLeafRows[0].graphFunctionRef,
    ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphFunctionRef
  );
  assert.equal(validation.program.executableLeafRows[0].fibre, "F_D");
  assert.equal(validation.program.transitiveReachableExecutableLeafKeys.length, 1);
  assert.deepEqual(validation.program.transitiveReachableInteractionLeafKeys, []);
});

test("focused proof pins current ABI-owned static-validation gaps", () => {
  const baseline = validateStaticProgram().program;
  const reordered = validateStaticProgram({
    contracts: Object.freeze([...ODD_GLC_ABI5_CONTRACTS].reverse())
  }).program;
  assert.equal(baseline.kind, "program_validation");
  assert.equal(reordered.kind, "program_validation");
  assert.notEqual(
    baseline.sourceDigest,
    reordered.sourceDigest,
    "current static source identity is declaration-order-sensitive"
  );

  const duplicateContract = validateStaticProgram({
    contracts: Object.freeze([...ODD_GLC_ABI5_CONTRACTS, ODD_GLC_ABI5_CONTRACTS[0]])
  }).program;
  assert.equal(
    duplicateContract.kind,
    "program_validation",
    "current validator does not reject duplicate ContractDeclaration identity"
  );

  const emptyValueKind = Object.freeze({
    ...ODD_GLC_ABI5_CONTRACTS[0],
    valueKind: ""
  });
  const emptyValueValidation = validateStaticProgram({
    contracts: Object.freeze([emptyValueKind, ...ODD_GLC_ABI5_CONTRACTS.slice(1)])
  }).program;
  assert.equal(
    emptyValueValidation.kind,
    "program_validation",
    "current validator does not reject an empty ContractDeclaration valueKind"
  );

  const unresolvedProvider = validateStaticProgram({
    productSemanticsBinding: Object.freeze({
      ...ODD_GLC_ABI5_PRODUCT_SEMANTICS_BINDING,
      namedSymbol: "SUBSTITUTED_PRODUCT_SEMANTICS"
    })
  });
  assert.equal(unresolvedProvider.publication.kind, "publication_validation");
  assert.equal(unresolvedProvider.program.kind, "program_validation");
});

test("validator rejects a workflow target removed from Program membership", () => {
  const invalidProgram = Object.freeze({
    ...ODD_GLC_ABI5_PROGRAM,
    callableMembership: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.graphFunctionRef])
  });
  const validation = validateStaticProgram({ program: invalidProgram }).program;
  assert.equal(validation.kind, "static_validation_refusal");
  assert.equal(validation.stage, "program");
  assert.equal(validation.diagnostics.some((row) => row.code === "invalid_reference"), true);
});

test("validator rejects a run-scope contract presented as subordinate closure", () => {
  const invalidChild = Object.freeze({
    ...ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION,
    declarations: Object.freeze({
      ...ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION.declarations,
      "abg.child_closure_contract": ODD_GLC_ABI5_PROGRAM_IDS.closureContractRef
    })
  });
  const validation = validateStaticProgram({
    graphFunctions: [ODD_GLC_ABI5_GRAPH_FUNCTION, invalidChild]
  }).program;
  assert.equal(validation.kind, "static_validation_refusal");
  assert.equal(validation.stage, "program");
  assert.equal(validation.diagnostics.some((row) =>
    row.path.includes("abg.child_closure_contract") && row.code === "missing_contract"
  ), true);
});

test("ABIogenesis 5 source candidate adds no runtime authority or 0.1 package surface", async () => {
  assert.deepEqual(ODD_GLC_ABI5_AUTHORITY_BOUNDARY.declares, [
    "lifecycle_vocabulary",
    "lifecycle_program_membership",
    "fresh_source_identity_contract",
    "immutable_policy",
    "read_only_interpretation"
  ]);
  assert.equal(
    ODD_GLC_ABI5_AUTHORITY_BOUNDARY.consumes.includes("event_calculus_currentness"),
    true
  );
  assert.equal(
    ODD_GLC_ABI5_AUTHORITY_BOUNDARY.consumes.includes("installed_implementation_resolution"),
    true
  );
  assert.equal(
    ODD_GLC_ABI5_AUTHORITY_BOUNDARY.consumes.includes(
      "public_authenticated_workspace_identities"
    ),
    true
  );
  assert.equal(
    ODD_GLC_ABI5_AUTHORITY_BOUNDARY.prohibits.includes("product_local_retry_continuation_or_closure"),
    true
  );
  for (const value of Object.values(ODD_GLC_ABI5_PROGRAM)) {
    assert.notEqual(typeof value, "function");
  }

  const source = sourceCandidateBytes.toString("utf8");
  assert.deepEqual(
    [...source.matchAll(/from\s+["']([^"']+)["']/gu)].map((match) => match[1]),
    ["@abiogenesis/typescript-tenant/product"]
  );
  assert.equal(/fpDispatch|fpEvaluator|reenter_graph_span|child_process|node:fs/u.test(source), false);
  assert.equal(/@abiogenesis\/typescript-tenant\/(?:build|code|src)/u.test(source), false);
  assert.equal(/\bWorkspaceBinding\b|\bworkspace_binding\b|\badmissionEventRef\b/u.test(source), false);

  const oddGlcPackage = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(oddGlcPackage.version, "0.1.0");
  assert.deepEqual(oddGlcPackage.files, [
    "README.md",
    "src/index.d.ts",
    "src/index.mjs",
    "src/substrate_provenance.mjs",
    "substrate.provenance.json"
  ]);
  assert.equal(Object.hasOwn(oddGlcPackage.exports, "./abi5_program"), false);
});
