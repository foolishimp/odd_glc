import {
  canonicalJson,
  isSha256Digest,
  sha256Canonical
} from "@abiogenesis/typescript-tenant/product";

export const ODD_GLC_ABI5_PACKAGE_IDENTITY = Object.freeze({
  productId: "product://odd_glc/route-one-typescript@0.2.0-candidate",
  packageName: "@odd-glc/route-one-typescript",
  packageVersion: "0.2.0-candidate",
  modulePath: "build/code/src/abi5_program.mjs"
});

export const ODD_GLC_ABI5_PROGRAM_IDS = Object.freeze({
  programRef: "program://odd_glc/general-lifecycle@5",
  sourceProgramRef: "program://odd_glc/general-lifecycle/fresh-source@5",
  moduleRef: "module://odd_glc/general-lifecycle@5",
  closureContractRef: "contract://odd_glc/general-lifecycle/closure@5",
  childClosureContractRef: "contract://odd_glc/general-lifecycle/interpret-closure@5",
  sourceClosureContractRef: "contract://odd_glc/general-lifecycle/fresh-source-closure@5",
  inputContractRef: "contract://odd_glc/general-lifecycle/context@5",
  outputContractRef: "contract://odd_glc/general-lifecycle/state@5",
  sourceInputContractRef: "contract://odd_glc/general-lifecycle/fresh-source-request@5",
  sourceOutputContractRef: "contract://odd_glc/general-lifecycle/fresh-source-result@5",
  transitionContractRef: "contract://odd_glc/general-lifecycle/transition@5",
  evidenceContractRef: "contract://odd_glc/general-lifecycle/evidence@5",
  leafEvidenceContractRef: "contract://odd_glc/general-lifecycle/leaf-evidence@5",
  failureContractRef: "contract://odd_glc/general-lifecycle/failure@5",
  refusalContractRef: "contract://odd_glc/general-lifecycle/refusal@5",
  judgmentContractRef: "contract://odd_glc/general-lifecycle/judgment@5",
  judgmentPredicateRef: "predicate://odd_glc/general-lifecycle/projection-is-readable@5",
  sourceJudgmentPredicateRef: "predicate://odd_glc/general-lifecycle/fresh-source-identities-preserved@5",
  productSemanticsBindingRef: "product-semantics://odd_glc/general-lifecycle@5",
  implementationBindingRef: "implementation-binding://odd_glc/general-lifecycle/interpret@5",
  implementationRef: "implementation://odd_glc/general-lifecycle/interpret@5",
  sourceImplementationBindingRef: "implementation-binding://odd_glc/general-lifecycle/fresh-source@5",
  sourceImplementationRef: "implementation://odd_glc/general-lifecycle/fresh-source@5",
  locusRef: "locus://odd_glc/general-lifecycle/interpret@5",
  armId: "arm://odd_glc/general-lifecycle/interpret/fd@5",
  startRef: "start://odd_glc/general-lifecycle@5",
  sourceStartRef: "start://odd_glc/general-lifecycle/fresh-source@5",
  graphFunctionRef: "graph-function://odd_glc/general-lifecycle@5",
  sourceGraphFunctionRef: "graph-function://odd_glc/general-lifecycle/fresh-source@5",
  interpretationGraphFunctionRef: "graph-function://odd_glc/general-lifecycle/interpret@5",
  graphRef: "graph://odd_glc/general-lifecycle@5",
  nodeRef: "node://odd_glc/general-lifecycle/interpret@5",
  interpretationGraphRef: "graph://odd_glc/general-lifecycle/interpret@5",
  interpretationNodeRef: "node://odd_glc/general-lifecycle/interpret-leaf@5",
  sourceGraphRef: "graph://odd_glc/general-lifecycle/fresh-source@5",
  sourceNodeRef: "node://odd_glc/general-lifecycle/fresh-source@5",
  sourceLocusRef: "locus://odd_glc/general-lifecycle/fresh-source@5",
  sourceArmId: "arm://odd_glc/general-lifecycle/fresh-source/fd@5"
});

const contract = (contractRef, contractKind, valueKind) => Object.freeze({
  contractRef,
  contractVersion: "5.0.0",
  contractKind,
  valueKind
});

export const ODD_GLC_ABI5_CONTRACTS = Object.freeze([
  contract(ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef, "input", "invocation_source_result_basis"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef, "output", "odd_glc_lifecycle_state"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef, "input", "odd_glc_fresh_source_request"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef, "output", "odd_glc_fresh_source_result"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.evidenceContractRef, "evidence", "sub_traversal_evidence_candidate"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef, "evidence", "deterministic_evidence_candidate"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.failureContractRef, "failure", "odd_glc_lifecycle_interpretation_failure"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef, "refusal", "odd_glc_lifecycle_interpretation_refusal"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef, "judgment", "odd_glc_lifecycle_interpretation_judgment"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef, "transition", "odd_glc_lifecycle_interpretation"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.closureContractRef, "closure", "odd_glc_general_lifecycle_closure"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.childClosureContractRef, "closure", "odd_glc_lifecycle_interpretation_closure"),
  contract(ODD_GLC_ABI5_PROGRAM_IDS.sourceClosureContractRef, "closure", "odd_glc_fresh_source_closure")
]);

export const ODD_GLC_ABI5_CLOSURE_CONTRACT = Object.freeze({
  kind: "closure_contract",
  closureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.closureContractRef,
  predicateRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef,
  evidenceContractRef: ODD_GLC_ABI5_PROGRAM_IDS.evidenceContractRef,
  resultContractRef: ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef,
  refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
  refusalValueKind: "odd_glc_lifecycle_interpretation_refusal",
  judgmentContractRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef,
  rejectionContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
  transitionContractRef: ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef,
  replayProjectionRef: "projection://odd_glc/general-lifecycle/replay@5",
  terminalKind: "completed",
  closureScope: "run",
  eventKindRefs: Object.freeze([
    "terminal_reached",
    "frame_closed",
    "graph_call_closed",
    "run_closed"
  ])
});

export const ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT = Object.freeze({
  kind: "closure_contract",
  closureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.childClosureContractRef,
  predicateRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef,
  evidenceContractRef: ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef,
  resultContractRef: ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef,
  refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
  refusalValueKind: "odd_glc_lifecycle_interpretation_refusal",
  judgmentContractRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef,
  rejectionContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
  transitionContractRef: ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef,
  replayProjectionRef: "projection://odd_glc/general-lifecycle/interpret-replay@5",
  terminalKind: "completed",
  closureScope: "graph_call",
  eventKindRefs: Object.freeze([
    "terminal_reached",
    "frame_closed",
    "graph_call_closed"
  ])
});

export const ODD_GLC_ABI5_SOURCE_CLOSURE_CONTRACT = Object.freeze({
  kind: "closure_contract",
  closureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceClosureContractRef,
  predicateRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceJudgmentPredicateRef,
  evidenceContractRef: ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef,
  resultContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef,
  refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
  refusalValueKind: "odd_glc_lifecycle_interpretation_refusal",
  judgmentContractRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef,
  rejectionContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
  transitionContractRef: ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef,
  replayProjectionRef: "projection://odd_glc/general-lifecycle/fresh-source-replay@5",
  terminalKind: "completed",
  closureScope: "run",
  eventKindRefs: Object.freeze([
    "terminal_reached",
    "frame_closed",
    "graph_call_closed",
    "run_closed"
  ])
});

export const ODD_GLC_ABI5_CLOSURE_CONTRACTS = Object.freeze([
  ODD_GLC_ABI5_CLOSURE_CONTRACT,
  ODD_GLC_ABI5_CHILD_CLOSURE_CONTRACT,
  ODD_GLC_ABI5_SOURCE_CLOSURE_CONTRACT
]);

export const ODD_GLC_ABI5_IMPLEMENTATION_BINDING = Object.freeze({
  kind: "implementation_binding",
  bindingRef: ODD_GLC_ABI5_PROGRAM_IDS.implementationBindingRef,
  implementationRef: ODD_GLC_ABI5_PROGRAM_IDS.implementationRef,
  packageName: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageName,
  packageVersion: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageVersion,
  modulePath: ODD_GLC_ABI5_PACKAGE_IDENTITY.modulePath,
  namedSymbol: "interpretAbi5LifecycleProjection",
  computeRegime: "F_D",
  inputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
  outputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef,
  failureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.failureContractRef,
  refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef
});

export const ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING = Object.freeze({
  kind: "implementation_binding",
  bindingRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceImplementationBindingRef,
  implementationRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceImplementationRef,
  packageName: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageName,
  packageVersion: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageVersion,
  modulePath: ODD_GLC_ABI5_PACKAGE_IDENTITY.modulePath,
  namedSymbol: "realizeOddGlcAbi5FreshSource",
  computeRegime: "F_D",
  inputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef,
  outputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef,
  failureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.failureContractRef,
  refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef
});

const implementationDescriptorBody = Object.freeze({
  computeRegime: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.computeRegime,
  failureContractRef: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.failureContractRef,
  implementationRef: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.implementationRef,
  inputContractRef: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.inputContractRef,
  modulePath: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.modulePath,
  namedSymbol: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.namedSymbol,
  outputContractRef: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.outputContractRef,
  packageName: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.packageName,
  packageVersion: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.packageVersion,
  refusalContractRef: ODD_GLC_ABI5_IMPLEMENTATION_BINDING.refusalContractRef
});

export const ODD_GLC_ABI5_IMPLEMENTATION_DESCRIPTOR = Object.freeze({
  kind: "packaged_leaf_implementation_descriptor",
  schemaVersion: "5.0.0",
  descriptorDigest: sha256Canonical(implementationDescriptorBody),
  ...implementationDescriptorBody
});

const sourceImplementationDescriptorBody = Object.freeze({
  computeRegime: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.computeRegime,
  failureContractRef: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.failureContractRef,
  implementationRef: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.implementationRef,
  inputContractRef: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.inputContractRef,
  modulePath: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.modulePath,
  namedSymbol: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.namedSymbol,
  outputContractRef: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.outputContractRef,
  packageName: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.packageName,
  packageVersion: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.packageVersion,
  refusalContractRef: ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING.refusalContractRef
});

export const ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_DESCRIPTOR = Object.freeze({
  kind: "packaged_leaf_implementation_descriptor",
  schemaVersion: "5.0.0",
  descriptorDigest: sha256Canonical(sourceImplementationDescriptorBody),
  ...sourceImplementationDescriptorBody
});

const SOURCE_RESULT_BASIS_KEYS = Object.freeze([
  "basisDigest",
  "basisRef",
  "kind",
  "publicAuthorityDigest",
  "schemaVersion",
  "sourceCCallRef",
  "sourceGraphCallId",
  "sourceGraphFunctionRef",
  "sourceInvocationAdmissionRef",
  "sourceInvocationRef",
  "sourceReplayDigest",
  "sourceReplayRef",
  "sourceResultAdmissionEventRef",
  "sourceResultContractRef",
  "sourceResultDigest",
  "sourceResultJudgmentEventRef",
  "sourceResultRef",
  "sourceResultValue",
  "sourceResultValueDigest",
  "sourceRunId",
  "sourceWorkspaceId",
  "workspaceBindingDigest",
  "workspaceBindingId"
]);

const SOURCE_RESULT_DIGEST_KEYS = Object.freeze([
  "basisDigest",
  "publicAuthorityDigest",
  "sourceReplayDigest",
  "sourceResultDigest",
  "sourceResultValueDigest",
  "workspaceBindingDigest"
]);

const SOURCE_RESULT_REF_KEYS = Object.freeze([
  "basisRef",
  "sourceCCallRef",
  "sourceGraphCallId",
  "sourceGraphFunctionRef",
  "sourceInvocationAdmissionRef",
  "sourceInvocationRef",
  "sourceReplayRef",
  "sourceResultAdmissionEventRef",
  "sourceResultContractRef",
  "sourceResultJudgmentEventRef",
  "sourceResultRef",
  "sourceRunId",
  "sourceWorkspaceId",
  "workspaceBindingId"
]);

const FRESH_SOURCE_KEYS = Object.freeze([
  "kind",
  "schemaVersion",
  "workspaceBindingDigest",
  "workspaceBindingId",
  "workspaceId"
]);

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactKeys = (value, keys) =>
  Object.keys(value).sort().join("\0") === [...keys].sort().join("\0");

const nonBlank = (value) => typeof value === "string" && value.trim().length > 0;

function freezeJson(value) {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => freezeJson(entry)));
  }
  if (isRecord(value)) {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, freezeJson(entry)])
    ));
  }
  return value;
}

function inputRefusal(code, message) {
  return Object.freeze({
    kind: "odd_glc_lifecycle_interpretation_refusal",
    schemaVersion: "5.0.0",
    disposition: "refused",
    code,
    message
  });
}

function sourceResultBasisBody(value) {
  const {
    basisDigest: _basisDigest,
    basisRef: _basisRef,
    kind: _kind,
    schemaVersion: _schemaVersion,
    ...body
  } = value;
  return body;
}

function evaluateFreshSourceCarrier(value, expectedKind) {
  if (!isRecord(value) || !hasExactKeys(value, FRESH_SOURCE_KEYS)) {
    return inputRefusal("malformed_carrier", "fresh source requires the exact Product-owned carrier shape");
  }
  if (value.kind !== expectedKind) {
    return inputRefusal("wrong_kind", `fresh source requires ${expectedKind}`);
  }
  if (value.schemaVersion !== "5.0.0") {
    return inputRefusal("wrong_version", "fresh source requires schemaVersion 5.0.0");
  }
  if (!isSha256Digest(value.workspaceBindingDigest)) {
    return inputRefusal("malformed_digest", "fresh source contains a malformed workspace binding digest");
  }
  if (
    ["workspaceId", "workspaceBindingId"].some((key) => !nonBlank(value[key]))
  ) {
    return inputRefusal("empty_ref", "fresh source contains an empty current-workspace identity");
  }
  return Object.freeze({
    kind: "odd_glc_lifecycle_input_evaluation",
    schemaVersion: "5.0.0",
    disposition: "accepted",
    input: freezeJson(JSON.parse(canonicalJson(value)))
  });
}

/**
 * Product-owned contract evaluation for ABIogenesis' exact source-result
 * carrier. Structural acceptance is provisional: ABI Public independently
 * derives the authoritative carrier and the installed provider must match the
 * two in validateInvocationBasis before ABG admits the invocation input.
 */
export function evaluateOddGlcAbi5LifecycleInput(contractRef, value) {
  if (contractRef === ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef) {
    return evaluateFreshSourceCarrier(value, "odd_glc_fresh_source_request");
  }
  if (contractRef !== ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef) {
    return inputRefusal("wrong_contract", "odd_glc lifecycle input uses one declared contract");
  }
  if (!isRecord(value) || !hasExactKeys(value, SOURCE_RESULT_BASIS_KEYS)) {
    return inputRefusal("malformed_carrier", "lifecycle input requires the exact ABI source-result carrier shape");
  }
  if (value.kind !== "invocation_source_result_basis") {
    return inputRefusal("wrong_kind", "lifecycle input requires invocation_source_result_basis");
  }
  if (value.schemaVersion !== "5.0.0") {
    return inputRefusal("wrong_version", "lifecycle input requires ABI schemaVersion 5.0.0");
  }
  if (SOURCE_RESULT_DIGEST_KEYS.some((key) => !isSha256Digest(value[key]))) {
    return inputRefusal("malformed_digest", "lifecycle input contains a malformed ABI digest");
  }
  if (SOURCE_RESULT_REF_KEYS.some((key) => !nonBlank(value[key]))) {
    return inputRefusal("empty_ref", "lifecycle input contains an empty ABI identity");
  }
  try {
    canonicalJson(value.sourceResultValue);
  } catch {
    return inputRefusal("malformed_source_value", "source result value is not canonical JSON");
  }
  if (sha256Canonical(value.sourceResultValue) !== value.sourceResultValueDigest) {
    return inputRefusal("source_value_digest_mismatch", "source result value differs from its ABI digest");
  }
  const basisDigest = sha256Canonical(sourceResultBasisBody(value));
  if (
    value.basisDigest !== basisDigest ||
    value.basisRef !==
      `invocation-source-result://abiogenesis/${basisDigest.slice("sha256:".length)}`
  ) {
    return inputRefusal("basis_identity_mismatch", "source-result basis identity differs from its canonical ABI body");
  }
  const input = freezeJson(JSON.parse(canonicalJson(value)));
  return Object.freeze({
    kind: "odd_glc_lifecycle_input_evaluation",
    schemaVersion: "5.0.0",
    disposition: "accepted",
    input
  });
}

function isOddGlcAbi5LifecycleState(value) {
  return isRecord(value) &&
    hasExactKeys(value, [
      "kind",
      "lifecycleDisposition",
      "publicAuthorityDigest",
      "schemaVersion",
      "sourceBasisDigest",
      "sourceBasisRef",
      "sourceCCallRef",
      "sourceGraphCallId",
      "sourceGraphFunctionRef",
      "sourceInvocationAdmissionRef",
      "sourceInvocationRef",
      "sourceReplayDigest",
      "sourceReplayRef",
      "sourceResultAdmissionEventRef",
      "sourceResultContractRef",
      "sourceResultDigest",
      "sourceResultJudgmentEventRef",
      "sourceResultRef",
      "sourceResultValueDigest",
      "sourceRunId",
      "sourceWorkspaceId",
      "workspaceBindingDigest",
      "workspaceBindingId"
    ]) &&
    value.kind === "odd_glc_lifecycle_state" &&
    value.schemaVersion === "5.0.0" &&
    value.lifecycleDisposition === "no_disposition" &&
    SOURCE_RESULT_DIGEST_KEYS.every((key) => {
        const outputKey = key === "basisDigest" ? "sourceBasisDigest" : key;
        return isSha256Digest(value[outputKey]);
      }) &&
    [
      "sourceBasisRef",
      "sourceCCallRef",
      "sourceGraphCallId",
      "sourceGraphFunctionRef",
      "sourceInvocationAdmissionRef",
      "sourceInvocationRef",
      "sourceReplayRef",
      "sourceResultAdmissionEventRef",
      "sourceResultContractRef",
      "sourceResultJudgmentEventRef",
      "sourceResultRef",
      "sourceRunId",
      "sourceWorkspaceId",
      "workspaceBindingId"
    ].every((key) => nonBlank(value[key]));
}

function projectLifecycleState(input) {
  return Object.freeze({
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
}

export function interpretAbi5LifecycleProjection(input) {
  const resultCandidate = projectLifecycleState(input);
  return Object.freeze({
    kind: "leaf_realization_candidate",
    schemaVersion: "5.0.0",
    disposition: "success",
    evidenceCandidates: Object.freeze([Object.freeze({
      kind: "deterministic_evidence_candidate",
      schemaVersion: "5.0.0",
      implementationRef: ODD_GLC_ABI5_PROGRAM_IDS.implementationRef,
      inputDigest: sha256Canonical(input),
      outputDigest: sha256Canonical(resultCandidate)
    })]),
    resultCandidate
  });
}

export function realizeOddGlcAbi5FreshSource(input) {
  const resultCandidate = Object.freeze({
    kind: "odd_glc_fresh_source_result",
    schemaVersion: "5.0.0",
    workspaceId: input.workspaceId,
    workspaceBindingId: input.workspaceBindingId,
    workspaceBindingDigest: input.workspaceBindingDigest
  });
  return Object.freeze({
    kind: "leaf_realization_candidate",
    schemaVersion: "5.0.0",
    disposition: "success",
    evidenceCandidates: Object.freeze([Object.freeze({
      kind: "deterministic_evidence_candidate",
      schemaVersion: "5.0.0",
      implementationRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceImplementationRef,
      inputDigest: sha256Canonical(input),
      outputDigest: sha256Canonical(resultCandidate)
    })]),
    resultCandidate
  });
}

function admittedLifecycleInput(contractRef, value) {
  const evaluated = evaluateOddGlcAbi5LifecycleInput(contractRef, value);
  return evaluated.disposition === "accepted" ? evaluated.input : null;
}

function validateLifecycleContractValue(valueKind, value) {
  if (valueKind === "odd_glc_fresh_source_request") {
    return evaluateFreshSourceCarrier(
      value,
      "odd_glc_fresh_source_request"
    ).disposition === "accepted";
  }
  if (valueKind === "odd_glc_fresh_source_result") {
    return evaluateFreshSourceCarrier(
      value,
      "odd_glc_fresh_source_result"
    ).disposition === "accepted";
  }
  if (valueKind === "invocation_source_result_basis") {
    return evaluateOddGlcAbi5LifecycleInput(
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      value
    ).disposition === "accepted";
  }
  if (valueKind === "odd_glc_lifecycle_state") {
    return isOddGlcAbi5LifecycleState(value);
  }
  if (valueKind === "odd_glc_lifecycle_interpretation_failure") {
    return isRecord(value) &&
      value.kind === "odd_glc_lifecycle_interpretation_failure" &&
      value.schemaVersion === "5.0.0" &&
      nonBlank(value.diagnosticRef);
  }
  if (valueKind === "odd_glc_lifecycle_interpretation_refusal") {
    return isRecord(value) &&
      value.kind === "odd_glc_lifecycle_interpretation_refusal" &&
      value.schemaVersion === "5.0.0" &&
      value.disposition === "refused" &&
      nonBlank(value.code) &&
      nonBlank(value.message);
  }
  return false;
}

const lifecycleJudgmentRelation = Object.freeze({
  predicateRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef,
  advanceReasonRef: "reason://odd_glc/general-lifecycle/source-result-readable@5",
  rejectionReasonRef: "reason://odd_glc/general-lifecycle/source-result-unreadable@5",
  evaluate(input, output) {
    const evaluated = evaluateOddGlcAbi5LifecycleInput(
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      input
    );
    return evaluated.disposition === "accepted" &&
      isOddGlcAbi5LifecycleState(output) &&
      sha256Canonical(output) ===
        sha256Canonical(projectLifecycleState(evaluated.input));
  }
});

const freshSourceJudgmentRelation = Object.freeze({
  predicateRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceJudgmentPredicateRef,
  advanceReasonRef: "reason://odd_glc/general-lifecycle/fresh-source-identities-preserved@5",
  rejectionReasonRef: "reason://odd_glc/general-lifecycle/fresh-source-identities-changed@5",
  evaluate(input, output) {
    const evaluatedInput = evaluateFreshSourceCarrier(
      input,
      "odd_glc_fresh_source_request"
    );
    const evaluatedOutput = evaluateFreshSourceCarrier(
      output,
      "odd_glc_fresh_source_result"
    );
    return evaluatedInput.disposition === "accepted" &&
      evaluatedOutput.disposition === "accepted" &&
      evaluatedInput.input.workspaceId === evaluatedOutput.input.workspaceId &&
      evaluatedInput.input.workspaceBindingId === evaluatedOutput.input.workspaceBindingId &&
      evaluatedInput.input.workspaceBindingDigest === evaluatedOutput.input.workspaceBindingDigest;
  }
});

export const ODD_GLC_ABI5_PRODUCT_SEMANTICS = Object.freeze({
  kind: "product_semantics_provider",
  schemaVersion: "5.0.0",
  bindingRef: ODD_GLC_ABI5_PROGRAM_IDS.productSemanticsBindingRef,
  packageName: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageName,
  packageVersion: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageVersion,
  admitInput: admittedLifecycleInput,
  evaluateInteractionResponse() {
    return null;
  },
  validateContractValue: validateLifecycleContractValue,
  resolveJudgmentRelation(predicateRef) {
    if (predicateRef === lifecycleJudgmentRelation.predicateRef) {
      return lifecycleJudgmentRelation;
    }
    return predicateRef === freshSourceJudgmentRelation.predicateRef
      ? freshSourceJudgmentRelation
      : null;
  },
  validateInvocationBasis(basis) {
    const source = basis.sourceResultBasis;
    if (basis.actionCatalog !== null || basis.catalogApplications.length !== 0) {
      return false;
    }
    if (isRecord(basis.input) && basis.input.kind === "odd_glc_fresh_source_request") {
      const evaluatedFreshSource = evaluateFreshSourceCarrier(
        basis.input,
        "odd_glc_fresh_source_request"
      );
      return source === null &&
        evaluatedFreshSource.disposition === "accepted" &&
        evaluatedFreshSource.input.workspaceId === basis.workspaceId &&
        evaluatedFreshSource.input.workspaceBindingId === basis.workspaceBindingId &&
        evaluatedFreshSource.input.workspaceBindingDigest === basis.workspaceBindingDigest;
    }
    if (source === null) {
      return false;
    }
    const evaluatedInput = evaluateOddGlcAbi5LifecycleInput(
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      basis.input
    );
    const evaluatedSource = evaluateOddGlcAbi5LifecycleInput(
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      source
    );
    const evaluatedFreshSourceResult = evaluateFreshSourceCarrier(
      source.sourceResultValue,
      "odd_glc_fresh_source_result"
    );
    return evaluatedInput.disposition === "accepted" &&
      evaluatedSource.disposition === "accepted" &&
      evaluatedFreshSourceResult.disposition === "accepted" &&
      sha256Canonical(evaluatedInput.input) === sha256Canonical(evaluatedSource.input) &&
      source.sourceGraphFunctionRef === ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef &&
      source.sourceResultContractRef === ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef &&
      evaluatedFreshSourceResult.input.workspaceId === source.sourceWorkspaceId &&
      evaluatedFreshSourceResult.input.workspaceBindingId === source.workspaceBindingId &&
      evaluatedFreshSourceResult.input.workspaceBindingDigest === source.workspaceBindingDigest &&
      source.sourceWorkspaceId === basis.workspaceId &&
      source.workspaceBindingId === basis.workspaceBindingId &&
      source.workspaceBindingDigest === basis.workspaceBindingDigest;
  }
});

export const ODD_GLC_ABI5_PRODUCT_SEMANTICS_BINDING = Object.freeze({
  kind: "product_semantics_binding",
  bindingRef: ODD_GLC_ABI5_PROGRAM_IDS.productSemanticsBindingRef,
  packageName: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageName,
  packageVersion: ODD_GLC_ABI5_PACKAGE_IDENTITY.packageVersion,
  modulePath: ODD_GLC_ABI5_PACKAGE_IDENTITY.modulePath,
  namedSymbol: "ODD_GLC_ABI5_PRODUCT_SEMANTICS"
});

const interpretationTerm = Object.freeze({
  kind: "c_of",
  inputCarrierRef: ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
  outputCarrierRef: ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef,
  programLocusRef: ODD_GLC_ABI5_PROGRAM_IDS.locusRef,
  stageRole: "interpret",
  fibre: "F_D",
  armId: ODD_GLC_ABI5_PROGRAM_IDS.armId,
  compositionRef: null,
  vectorIndex: 0,
  judgmentPredicateRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef,
  resultBearing: true,
  requirement: Object.freeze({
    kind: "executable_leaf_requirement",
    implementationBindingRef: ODD_GLC_ABI5_PROGRAM_IDS.implementationBindingRef,
    inputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
    outputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef,
    evidenceContractRef: ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef,
    failureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.failureContractRef,
    refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
    judgmentContractRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef
  })
});

export const ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION = Object.freeze({
  kind: "graph_function",
  name: ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphFunctionRef,
  version: "5.0.0",
  environment: Object.freeze({
    requires: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef]),
    provides: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef]),
    carries: Object.freeze([
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef
    ])
  }),
  inputs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef]),
  outputs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef]),
  template: Object.freeze({
    kind: "inline_graph",
    graphRef: ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphRef,
    startNodeRef: ODD_GLC_ABI5_PROGRAM_IDS.interpretationNodeRef,
    terminalNodeRefs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.interpretationNodeRef]),
    nodes: Object.freeze([Object.freeze({
      nodeRef: ODD_GLC_ABI5_PROGRAM_IDS.interpretationNodeRef,
      nodeKind: "c_locus",
      term: interpretationTerm
    })]),
    edges: Object.freeze([]),
    applications: Object.freeze([])
  }),
  effects: Object.freeze([]),
  declarations: Object.freeze({
    "abg.compute_regime": "F_D",
    "abg.closure_contract": ODD_GLC_ABI5_PROGRAM_IDS.childClosureContractRef,
    "abg.child_closure_contract": ODD_GLC_ABI5_PROGRAM_IDS.childClosureContractRef,
    "abg.evidence_contract": ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef,
    "abg.judgment_contract": ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef,
    "abg.judgment_predicate": ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef,
    "abg.transition_contract": ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef
  }),
  tags: Object.freeze(["odd_glc", "general_lifecycle", "read_only_interpretation", "fd"])
});

const sourceTerm = Object.freeze({
  kind: "c_of",
  inputCarrierRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef,
  outputCarrierRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef,
  programLocusRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceLocusRef,
  stageRole: "interpret",
  fibre: "F_D",
  armId: ODD_GLC_ABI5_PROGRAM_IDS.sourceArmId,
  compositionRef: null,
  vectorIndex: 0,
  judgmentPredicateRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceJudgmentPredicateRef,
  resultBearing: true,
  requirement: Object.freeze({
    kind: "executable_leaf_requirement",
    implementationBindingRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceImplementationBindingRef,
    inputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef,
    outputContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef,
    evidenceContractRef: ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef,
    failureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.failureContractRef,
    refusalContractRef: ODD_GLC_ABI5_PROGRAM_IDS.refusalContractRef,
    judgmentContractRef: ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef
  })
});

export const ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION = Object.freeze({
  kind: "graph_function",
  name: ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef,
  version: "5.0.0",
  environment: Object.freeze({
    requires: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef]),
    provides: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef]),
    carries: Object.freeze([
      ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef,
      ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef
    ])
  }),
  inputs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.sourceInputContractRef]),
  outputs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.sourceOutputContractRef]),
  template: Object.freeze({
    kind: "inline_graph",
    graphRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphRef,
    startNodeRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceNodeRef,
    terminalNodeRefs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.sourceNodeRef]),
    nodes: Object.freeze([Object.freeze({
      nodeRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceNodeRef,
      nodeKind: "c_locus",
      term: sourceTerm
    })]),
    edges: Object.freeze([]),
    applications: Object.freeze([])
  }),
  effects: Object.freeze([]),
  declarations: Object.freeze({
    "abg.compute_regime": "F_D",
    "abg.closure_contract": ODD_GLC_ABI5_PROGRAM_IDS.sourceClosureContractRef,
    "abg.evidence_contract": ODD_GLC_ABI5_PROGRAM_IDS.leafEvidenceContractRef,
    "abg.judgment_contract": ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef,
    "abg.judgment_predicate": ODD_GLC_ABI5_PROGRAM_IDS.sourceJudgmentPredicateRef,
    "abg.transition_contract": ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef
  }),
  tags: Object.freeze(["odd_glc", "general_lifecycle", "fresh_source", "fd"])
});

const workflowTerm = Object.freeze({
  kind: "c_workflow",
  inputCarrierRef: ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
  outputCarrierRef: ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef,
  graphFunctionRef: ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphFunctionRef
});

const graphNode = Object.freeze({
  nodeRef: ODD_GLC_ABI5_PROGRAM_IDS.nodeRef,
  nodeKind: "c_locus",
  term: workflowTerm
});

export const ODD_GLC_ABI5_GRAPH_FUNCTION = Object.freeze({
  kind: "graph_function",
  name: ODD_GLC_ABI5_PROGRAM_IDS.graphFunctionRef,
  version: "5.0.0",
  environment: Object.freeze({
    requires: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef]),
    provides: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef]),
    carries: Object.freeze([
      ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef,
      ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef
    ])
  }),
  inputs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.inputContractRef]),
  outputs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.outputContractRef]),
  template: Object.freeze({
    kind: "inline_graph",
    graphRef: ODD_GLC_ABI5_PROGRAM_IDS.graphRef,
    startNodeRef: ODD_GLC_ABI5_PROGRAM_IDS.nodeRef,
    terminalNodeRefs: Object.freeze([ODD_GLC_ABI5_PROGRAM_IDS.nodeRef]),
    nodes: Object.freeze([graphNode]),
    edges: Object.freeze([]),
    applications: Object.freeze([])
  }),
  effects: Object.freeze([]),
  declarations: Object.freeze({
    "abg.compute_regime": "F_D",
    "abg.closure_contract": ODD_GLC_ABI5_PROGRAM_IDS.closureContractRef,
    "abg.evidence_contract": ODD_GLC_ABI5_PROGRAM_IDS.evidenceContractRef,
    "abg.judgment_contract": ODD_GLC_ABI5_PROGRAM_IDS.judgmentContractRef,
    "abg.judgment_predicate": ODD_GLC_ABI5_PROGRAM_IDS.judgmentPredicateRef,
    "abg.transition_contract": ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef,
    "odd_glc.transition_contract": ODD_GLC_ABI5_PROGRAM_IDS.transitionContractRef,
    "odd_glc.interpretation_authority": "read_only_public_projection"
  }),
  tags: Object.freeze(["odd_glc", "general_lifecycle", "declarations_only"])
});

const starts = Object.freeze([
  Object.freeze({
    startRef: ODD_GLC_ABI5_PROGRAM_IDS.startRef,
    graphFunctionRef: ODD_GLC_ABI5_PROGRAM_IDS.graphFunctionRef
  })
]);

const callableMembership = Object.freeze([
  ODD_GLC_ABI5_PROGRAM_IDS.graphFunctionRef,
  ODD_GLC_ABI5_PROGRAM_IDS.interpretationGraphFunctionRef
]);

const policies = Object.freeze({
  "abg.compute_regime": "F_D",
  "abg.default_start_ref": ODD_GLC_ABI5_PROGRAM_IDS.startRef,
  "abg.root_mode": "direct",
  "odd_glc.lifecycle_authority": "declarations_and_read_only_interpretation",
  "odd_glc.runtime_truth_authority": "abiogenesis_event_calculus"
});

/**
 * An odd_glc-owned GTL 5 Program declaration candidate.
 *
 * This immutable value declares lifecycle meaning only. ABIogenesis owns
 * validation, canonical identity, catalog admission, traversal, effects,
 * events, currentness, replay, continuation, and closure.
 */
export const ODD_GLC_ABI5_PROGRAM = Object.freeze({
  kind: "gtl_program",
  programRef: ODD_GLC_ABI5_PROGRAM_IDS.programRef,
  version: "5.0.0",
  moduleRef: ODD_GLC_ABI5_PROGRAM_IDS.moduleRef,
  starts,
  callableMembership,
  closureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.closureContractRef,
  policies
});

export const ODD_GLC_ABI5_SOURCE_PROGRAM = Object.freeze({
  kind: "gtl_program",
  programRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceProgramRef,
  version: "5.0.0",
  moduleRef: ODD_GLC_ABI5_PROGRAM_IDS.moduleRef,
  starts: Object.freeze([Object.freeze({
    startRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceStartRef,
    graphFunctionRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef
  })]),
  callableMembership: Object.freeze([
    ODD_GLC_ABI5_PROGRAM_IDS.sourceGraphFunctionRef
  ]),
  closureContractRef: ODD_GLC_ABI5_PROGRAM_IDS.sourceClosureContractRef,
  policies: Object.freeze({
    "abg.compute_regime": "F_D",
    "abg.default_start_ref": ODD_GLC_ABI5_PROGRAM_IDS.sourceStartRef,
    "abg.root_mode": "direct",
    "odd_glc.lifecycle_authority": "public_authenticated_fresh_source_declaration",
    "odd_glc.runtime_truth_authority": "abiogenesis_event_calculus"
  })
});

export const ODD_GLC_ABI5_AUTHORITY_BOUNDARY = Object.freeze({
  kind: "odd_glc_abi5_authority_boundary",
  schemaVersion: "1",
  declares: Object.freeze([
    "lifecycle_vocabulary",
    "lifecycle_program_membership",
    "fresh_source_identity_contract",
    "immutable_policy",
    "read_only_interpretation"
  ]),
  consumes: Object.freeze([
    "public_authenticated_workspace_identities",
    "gtl_program_validation",
    "canonical_program_identity",
    "catalog_admission",
    "installed_product_semantics",
    "installed_implementation_resolution",
    "hog_traversal",
    "abg_event_admission",
    "event_calculus_currentness",
    "replay_projection",
    "continuation_and_closure_truth"
  ]),
  prohibits: Object.freeze([
    "product_local_dispatch",
    "product_local_response_admission",
    "product_local_evidence_admission",
    "product_local_implementation_resolution",
    "product_local_materialization",
    "product_local_event_or_currentness_truth",
    "product_local_retry_continuation_or_closure"
  ])
});

function assertArtifactBasis(artifact) {
  if (
    !isRecord(artifact) ||
    artifact.productId !== ODD_GLC_ABI5_PACKAGE_IDENTITY.productId ||
    artifact.packageName !== ODD_GLC_ABI5_PACKAGE_IDENTITY.packageName ||
    artifact.packageVersion !== ODD_GLC_ABI5_PACKAGE_IDENTITY.packageVersion ||
    !isSha256Digest(artifact.artifactDigest) ||
    !isSha256Digest(artifact.productContentDigest) ||
    !isSha256Digest(artifact.productManifestDigest)
  ) {
    throw new TypeError("odd_glc publication requires one exact 0.2 source-candidate artifact basis");
  }
}

/**
 * Assemble the declarations for one digest-bound installed Product artifact.
 * The caller supplies artifact/install identities; this function does not mint
 * or admit them.
 */
export function constructOddGlcAbi5ModulePublication(artifact) {
  assertArtifactBasis(artifact);
  const provenanceRefs = Object.freeze([
    artifact.artifactDigest,
    artifact.productManifestDigest
  ]);
  const contributions = Object.freeze([
    Object.freeze({
      graphFunction: ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION,
      program: ODD_GLC_ABI5_SOURCE_PROGRAM
    }),
    Object.freeze({
      graphFunction: ODD_GLC_ABI5_GRAPH_FUNCTION,
      program: ODD_GLC_ABI5_PROGRAM
    }),
    Object.freeze({
      graphFunction: ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION,
      program: ODD_GLC_ABI5_PROGRAM
    })
  ].map(({ graphFunction, program }) => Object.freeze({
    handle: graphFunction.name,
    kind: "graph_function",
    declarationOrContractRef: graphFunction.name,
    owningProductId: artifact.productId,
    programMembershipRefs: Object.freeze([program.programRef]),
    readinessPrerequisiteRefs: Object.freeze([program.programRef]),
    compatibilityRefs: Object.freeze(["compatibility://abiogenesis/major/5"]),
    provenanceRefs
  })));
  return Object.freeze({
    kind: "module_publication",
    moduleRef: ODD_GLC_ABI5_PROGRAM_IDS.moduleRef,
    moduleVersion: "5.0.0",
    owningProductId: artifact.productId,
    artifactDigest: artifact.artifactDigest,
    productContentDigest: artifact.productContentDigest,
    productManifestDigest: artifact.productManifestDigest,
    descriptorRef:
      `descriptor://odd_glc/route-one-typescript/${artifact.productContentDigest.slice("sha256:".length)}`,
    contributionManifestRef:
      `contribution-manifest://odd_glc/route-one-typescript/${artifact.productContentDigest.slice("sha256:".length)}`,
    productSemanticsBinding: ODD_GLC_ABI5_PRODUCT_SEMANTICS_BINDING,
    contracts: ODD_GLC_ABI5_CONTRACTS,
    evaluators: Object.freeze([]),
    rules: Object.freeze([]),
    implementationBindings: Object.freeze([
      ODD_GLC_ABI5_SOURCE_IMPLEMENTATION_BINDING,
      ODD_GLC_ABI5_IMPLEMENTATION_BINDING
    ]),
    closureContracts: ODD_GLC_ABI5_CLOSURE_CONTRACTS,
    programs: Object.freeze([
      ODD_GLC_ABI5_SOURCE_PROGRAM,
      ODD_GLC_ABI5_PROGRAM
    ]),
    graphFunctions: Object.freeze([
      ODD_GLC_ABI5_SOURCE_GRAPH_FUNCTION,
      ODD_GLC_ABI5_GRAPH_FUNCTION,
      ODD_GLC_ABI5_INTERPRETATION_GRAPH_FUNCTION
    ]),
    contributions
  });
}
