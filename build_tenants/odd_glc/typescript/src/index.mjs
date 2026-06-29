export { ABIOGENESIS_SUBSTRATE_PROVENANCE } from "./substrate_provenance.mjs";

export const REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS = Object.freeze([
  "projectLifecycleState"
]);

export const OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS = Object.freeze([
  "compileEdgeRequirementEnvironment",
  "routeContextConstraint",
  "projectEdgeObligations",
  "projectMaterializationTargets",
  "projectExecutionSchedules",
  "projectAssuranceCase",
  "classifyAttenuation"
]);

export const FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES = Object.freeze([
  "emitRequirementRouteFactsForEdgeClose",
  "mintAdmittedRef",
  "admitDeclarations",
  "bindExecutionEvidence",
  "projectRequirementFoldFromAssuranceClosure",
  "projectRequirementResidualsFromFolds",
  "resolveRequirementLifecycleDisposition"
]);

export const REQUIRED_ROUTE_ONE_SURFACES = Object.freeze([
  "LifeCycleWorksiteAsset",
  "LifecycleContextAsset",
  "IntentAsset",
  "ProductDefinitionAsset",
  "RequirementSetAsset",
  "RequirementEnvironmentViewAsset",
  "DestinationTopologyAsset",
  "InstructionSetAsset",
  "TargetArtifactAsset",
  "CapabilityAsset",
  "EvidenceBindingAsset",
  "AssuranceFoldViewAsset",
  "ResidualPressureViewAsset",
  "ReentryDecisionAsset"
]);

export const REQUIRED_EVIDENCE_EVENT_KINDS = Object.freeze([
  "actor_invocation_started",
  "actor_result_artifact_observed",
  "actor_invocation_closed",
  "evidence_admitted",
  "requirement_route_fact_projected"
]);

const TENANT_ID = "build_tenants/odd_glc/typescript";

function accepted(value, sourceRefs = []) {
  return Object.freeze({
    status: "accepted",
    value: deepFreeze(value),
    diagnostics: Object.freeze([]),
    sourceRefs: Object.freeze([...sourceRefs])
  });
}

function rejected(reason, diagnostics, sourceRefs = []) {
  return Object.freeze({
    status: "rejected",
    reason,
    diagnostics: Object.freeze([...diagnostics]),
    sourceRefs: Object.freeze([...sourceRefs])
  });
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
  if (!isRecord(value) && !Array.isArray(value)) {
    return value;
  }
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }
  return Object.freeze(value);
}

function containsFunction(value) {
  if (typeof value === "function") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(containsFunction);
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).some(containsFunction);
}

export function validateAbgRequirementsFacade(facade) {
  if (!isRecord(facade)) {
    return rejected("malformed_input", ["ABG requirements facade must be an object"]);
  }

  const missing = REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS.filter(
    (name) => typeof facade[name] !== "function"
  );
  if (missing.length > 0) {
    return rejected(
      "missing_public_query",
      missing.map((name) => `Missing ABG public query function ${name}`),
      missing
    );
  }

  const forbidden = FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES.filter(
    (name) => Object.hasOwn(facade, name)
  );
  if (forbidden.length > 0) {
    return rejected(
      "forbidden_authority",
      forbidden.map((name) => `ABG runtime-internal authority is not a public odd_glc dependency: ${name}`),
      forbidden
    );
  }

  const availableFunctions = [
    ...REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS,
    ...OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS.filter((name) => typeof facade[name] === "function")
  ];

  return accepted({
    kind: "abg_requirements_query_facade",
    availableFunctions: Object.freeze(availableFunctions)
  }, availableFunctions);
}

export function defineLifecycleSurfaceMap(input) {
  if (!isRecord(input) || !isRecord(input.surfaces)) {
    return rejected("malformed_input", ["Lifecycle surface map requires a surfaces object"]);
  }

  const missing = REQUIRED_ROUTE_ONE_SURFACES.filter(
    (surface) => typeof input.surfaces[surface] !== "string" || input.surfaces[surface].length === 0
  );
  if (missing.length > 0) {
    return rejected(
      "malformed_input",
      missing.map((surface) => `Missing route-1 lifecycle surface binding ${surface}`),
      missing
    );
  }

  return accepted({
    kind: "odd_glc_lifecycle_surface_map",
    surfaces: Object.freeze({ ...input.surfaces })
  }, Object.values(input.surfaces));
}

export function definePolicyOverlay(input) {
  if (!isRecord(input) || typeof input.id !== "string" || input.id.length === 0) {
    return rejected("malformed_input", ["Policy overlay requires a stable id"]);
  }
  const fp = isRecord(input.fp) ? input.fp : Object.freeze({});
  const fh = isRecord(input.fh) ? input.fh : Object.freeze({});
  if (containsFunction(fp) || containsFunction(fh)) {
    return rejected("forbidden_authority", ["F_P/F_H policy overlays must be data declarations, not executable authority"], [input.id]);
  }
  return accepted({
    kind: "odd_glc_policy_overlay",
    id: input.id,
    fp: Object.freeze({ ...fp }),
    fh: Object.freeze({ ...fh })
  }, [input.id]);
}

function runtimeDispositionFacts(runtimeEvents) {
  if (!Array.isArray(runtimeEvents)) {
    return Object.freeze([]);
  }
  return Object.freeze(runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_lifecycle_disposition" ||
      !isRecord(event.requirementPayload) ||
      event.requirementPayload.kind !== "requirement_lifecycle_disposition" ||
      event.requirementPayload.dispositionRef !== event.routePayloadRef
    ) {
      return [];
    }
    return [Object.freeze({
      kind: "requirement_lifecycle_disposition",
      ref: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      payload: event.requirementPayload
    })];
  }));
}

function eventRefFor(event) {
  if (!isRecord(event)) {
    return null;
  }
  return event.eventId ?? event.routeEventRef ?? event.eventRef ?? null;
}

function stringOrNull(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function uniqueStrings(values) {
  return Object.freeze([...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]);
}

function routeEvidenceBindings(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_evidence_bound" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.binding)
    ) {
      return [];
    }
    const binding = event.requirementPayload.binding;
    return [Object.freeze({
      evidenceRef: binding.evidenceRef,
      requirementId: binding.requirementId,
      projectionRef: binding.projectionRef,
      evidenceRole: binding.evidenceRole,
      bindingStatus: binding.bindingStatus,
      digest: binding.digest,
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef
    })];
  });
}

function routeFoldEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_fold_projected" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.fold)
    ) {
      return [];
    }
    const fold = event.requirementPayload.fold;
    return [Object.freeze({
      foldRef: fold.foldRef,
      requirementId: fold.requirementId,
      requirementProjectionRef: fold.requirementProjectionRef,
      state: fold.state,
      evidenceRefs: Object.freeze(Array.isArray(fold.evidenceRefs) ? [...fold.evidenceRefs] : []),
      evidenceBindingRefs: Object.freeze(Array.isArray(fold.evidenceBindingRefs) ? [...fold.evidenceBindingRefs] : []),
      sourceAbgTruthRefs: Object.freeze(Array.isArray(fold.sourceAbgTruthRefs) ? [...fold.sourceAbgTruthRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef
    })];
  });
}

function routeResidualEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_residual_projected" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.residual)
    ) {
      return [];
    }
    const residual = event.requirementPayload.residual;
    return [Object.freeze({
      residualRef: residual.residualRef,
      requirementId: residual.requirementId,
      requirementProjectionRef: residual.requirementProjectionRef,
      foldRef: residual.foldRef,
      pressureClass: residual.pressureClass,
      ownerSurface: residual.ownerSurface,
      evidenceRefs: Object.freeze(Array.isArray(residual.evidenceRefs) ? [...residual.evidenceRefs] : []),
      sourceFoldRefs: Object.freeze(Array.isArray(residual.sourceFoldRefs) ? [...residual.sourceFoldRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      residual
    })];
  });
}

function routeTermEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_term_admitted" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.term)
    ) {
      return [];
    }
    const term = event.requirementPayload.term;
    return [Object.freeze({
      requirementId: term.requirementId,
      stableId: term.stableId,
      termKind: term.termKind,
      sourceRef: term.sourceRef,
      sourceDigest: term.sourceDigest,
      relationRefs: Object.freeze(Array.isArray(term.relationRefs) ? [...term.relationRefs] : []),
      spanRefs: Object.freeze(Array.isArray(term.spanRefs) ? [...term.spanRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      term
    })];
  });
}

function routeRelationEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_relation_admitted" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.relation)
    ) {
      return [];
    }
    const relation = event.requirementPayload.relation;
    return [Object.freeze({
      relationId: relation.relationId,
      relationKind: relation.relationKind,
      fromRequirementId: relation.fromRequirementId,
      toRequirementId: relation.toRequirementId,
      evidenceRefs: Object.freeze(Array.isArray(relation.evidenceRefs) ? [...relation.evidenceRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      relation
    })];
  });
}

function routeDispositionEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_lifecycle_disposition" ||
      !isRecord(event.requirementPayload)
    ) {
      return [];
    }
    return [Object.freeze({
      dispositionRef: event.requirementPayload.dispositionRef,
      disposition: event.requirementPayload.disposition,
      residualRefs: Object.freeze(Array.isArray(event.requirementPayload.residualRefs) ? [...event.requirementPayload.residualRefs] : []),
      continuationRefs: Object.freeze(Array.isArray(event.requirementPayload.continuationRefs) ? [...event.requirementPayload.continuationRefs] : []),
      reentryRefs: Object.freeze(Array.isArray(event.requirementPayload.reentryRefs) ? [...event.requirementPayload.reentryRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef
    })];
  });
}

function admittedEvidence(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (!isRecord(event) || event.kind !== "evidence_admitted") {
      return [];
    }
    return [Object.freeze({
      evidenceRef: event.evidenceRef,
      payloadRef: event.payloadRef,
      authorityRef: event.authorityRef,
      authorityDigest: event.authorityDigest,
      inputDigest: event.inputDigest,
      complete: event.complete === true,
      deferred: event.deferred === true,
      contradictsAuthority: event.contradictsAuthority === true,
      providerRefs: Object.freeze(Array.isArray(event.providerRefs) ? [...event.providerRefs] : []),
      policyRefs: Object.freeze(Array.isArray(event.policyRefs) ? [...event.policyRefs] : []),
      sourceEventRef: eventRefFor(event)
    })];
  });
}

function branchFrontierEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (!isRecord(event)) {
      return [];
    }
    if (
      event.kind !== "branch_lease_acquired" &&
      event.kind !== "branch_payload_admitted" &&
      event.kind !== "branch_lease_released" &&
      event.kind !== "branch_fan_in_projected"
    ) {
      return [];
    }
    return [event];
  });
}

function branchPayloadRows(events) {
  return Object.freeze(events
    .filter((event) => event.kind === "branch_payload_admitted")
    .map((event) => Object.freeze({
      branchRef: event.branchRef,
      payloadDigest: event.payloadDigest,
      evidenceRefs: Object.freeze(Array.isArray(event.evidenceRefs) ? [...event.evidenceRefs] : []),
      sourceEventRef: eventRefFor(event)
    })));
}

function fanInRows(events) {
  return Object.freeze(events
    .filter((event) => event.kind === "branch_fan_in_projected")
    .map((event) => Object.freeze({
      fanInRef: event.fanInRef,
      orderedBranchRefs: Object.freeze(Array.isArray(event.orderedBranchRefs) ? [...event.orderedBranchRefs] : []),
      evidenceRefs: Object.freeze(Array.isArray(event.evidenceRefs) ? [...event.evidenceRefs] : []),
      sourceEventRef: eventRefFor(event)
    })));
}

function graphDisposition(requirementGraph, aggregateStates) {
  if (!isRecord(requirementGraph)) {
    return "no_requirement_graph";
  }
  if (aggregateStates.some((state) =>
    isRecord(state) &&
    state.state === "partial" &&
    Array.isArray(state.residualRefs) &&
    state.residualRefs.length > 0
  )) {
    return "aggregate_residual_pressure";
  }
  if (aggregateStates.length > 0 && aggregateStates.every((state) =>
    isRecord(state) && state.state === "satisfied"
  )) {
    return "aggregate_satisfied";
  }
  return "requirement_graph_projected";
}

function spanLineageRows(lifecycleState) {
  if (!isRecord(lifecycleState) || !Array.isArray(lifecycleState.spanLineage)) {
    return Object.freeze([]);
  }
  return Object.freeze(lifecycleState.spanLineage
    .filter(isRecord)
    .map((lineage) => deepFreeze({ ...lineage })));
}

function graphSpanReplayEvents(lifecycleState) {
  if (
    !isRecord(lifecycleState) ||
    !isRecord(lifecycleState.graphSpanReplay) ||
    !Array.isArray(lifecycleState.graphSpanReplay.events)
  ) {
    return Object.freeze([]);
  }
  return Object.freeze(lifecycleState.graphSpanReplay.events
    .filter(isRecord)
    .map((event) => deepFreeze({ ...event })));
}

function recursiveRuntimeSpanEvents(runtimeEvents) {
  const recursiveKinds = new Set([
    "frame_opened",
    "zoom_frame_opened",
    "graph_span_foldback_evaluated",
    "graph_reentry_planned",
    "graph_reentry_applied"
  ]);
  return Object.freeze(runtimeEvents
    .filter((event) => isRecord(event) && recursiveKinds.has(event.kind))
    .map((event) => deepFreeze({ ...event })));
}

function spanReadiness(lineage, graphEvents, runtimeEvents) {
  if (lineage.length === 0 && graphEvents.length === 0 && runtimeEvents.length === 0) {
    return "no_span_lineage_truth";
  }
  const frameRefs = uniqueStrings(lineage.flatMap((row) => Array.isArray(row.frameRefs) ? row.frameRefs : []));
  const zoomRefs = uniqueStrings(lineage.flatMap((row) => Array.isArray(row.zoomRefs) ? row.zoomRefs : []));
  const foldbackRefs = uniqueStrings(lineage.flatMap((row) => Array.isArray(row.foldbackRefs) ? row.foldbackRefs : []));
  const runtimeKinds = uniqueStrings(runtimeEvents.map((event) => event.kind));
  if (
    frameRefs.length > 1 &&
    zoomRefs.length > 0 &&
    foldbackRefs.length > 0 &&
    runtimeKinds.includes("graph_reentry_planned") &&
    runtimeKinds.includes("graph_reentry_applied")
  ) {
    return "recursive_span_ready";
  }
  if (frameRefs.length > 1 || zoomRefs.length > 0 || foldbackRefs.length > 0 || graphEvents.length > 0) {
    return "span_lineage_projected";
  }
  return "single_frame_span_projected";
}

function executivePressureRows(runtimeEvents, pressureEvents) {
  const rows = new Map();
  const candidates = [
    ...(Array.isArray(runtimeEvents) ? runtimeEvents : []),
    ...(Array.isArray(pressureEvents) ? pressureEvents : [])
  ];
  for (const event of candidates) {
    if (!isRecord(event)) {
      continue;
    }
    const fact = isRecord(event.executivePressureFact)
      ? event.executivePressureFact
      : event.kind === "abg_executive_pressure_fact_projection"
        ? event
        : null;
    if (!isRecord(fact) || fact.kind !== "abg_executive_pressure_fact_projection") {
      continue;
    }
    const pressureFactRef = fact.pressureFactRef;
    if (typeof pressureFactRef !== "string" || pressureFactRef.length === 0) {
      continue;
    }
    rows.set(pressureFactRef, Object.freeze({
      pressureFactRef,
      observationRef: fact.observationRef,
      disposition: fact.disposition,
      closeDisposition: fact.closeDisposition,
      attenuation: fact.attenuation,
      requirementIds: Object.freeze(Array.isArray(fact.requirementIds) ? [...fact.requirementIds] : []),
      residualPressureRefs: Object.freeze(Array.isArray(fact.residualPressureRefs) ? [...fact.residualPressureRefs] : []),
      continuationRefs: Object.freeze(Array.isArray(fact.continuationRefs) ? [...fact.continuationRefs] : []),
      evidenceRefs: Object.freeze(Array.isArray(fact.evidenceRefs) ? [...fact.evidenceRefs] : []),
      diagnosticRefs: Object.freeze(Array.isArray(fact.diagnosticRefs) ? [...fact.diagnosticRefs] : []),
      spanRefs: Object.freeze(Array.isArray(fact.spanRefs) ? [...fact.spanRefs] : []),
      sourceEventRef: eventRefFor(event),
      fact
    }));
  }
  return Object.freeze([...rows.values()]);
}

function pressureDisposition(rows) {
  if (rows.length === 0) {
    return "no_pressure";
  }
  const dispositions = rows.map((row) => row.disposition);
  const closeDispositions = rows.map((row) => row.closeDisposition);
  if (dispositions.includes("blocked") || closeDispositions.includes("block")) {
    return "blocked";
  }
  if (
    dispositions.includes("nonlocal_reentry") ||
    dispositions.includes("reentry_available") ||
    closeDispositions.includes("reprice")
  ) {
    return "reprice_required";
  }
  if (rows.some((row) => row.residualPressureRefs.length > 0 || row.continuationRefs.length > 0)) {
    return "local_repair_available";
  }
  if (closeDispositions.includes("close")) {
    return "close_candidate";
  }
  return "pressure_observed";
}

function releaseReadiness(lifecycleStateView, assuranceStateView, evidenceStateView) {
  const lifecycleDisposition = isRecord(lifecycleStateView)
    ? lifecycleStateView.lifecycleDisposition
    : "no_disposition";
  const assurance = isRecord(assuranceStateView)
    ? assuranceStateView.assuranceDisposition
    : "no_assurance";
  const evidence = isRecord(evidenceStateView)
    ? evidenceStateView.evidenceDisposition
    : "no_evidence";
  if (lifecycleDisposition === "blocked" || assurance === "assurance_blocked") {
    return "blocked";
  }
  if (
    lifecycleDisposition === "continuation_available" ||
    lifecycleDisposition === "reentry_available" ||
    assurance === "residual_pressure" ||
    assurance === "assurance_partial"
  ) {
    return "not_ready_residual";
  }
  if (
    lifecycleDisposition === "release_readiness_candidate" &&
    assurance === "assurance_satisfied" &&
    evidence === "admitted_bound_and_executed"
  ) {
    return "ready_candidate";
  }
  return "not_ready";
}

function actorInvocationViews(runtimeEvents) {
  const byInvocation = new Map();
  for (const event of runtimeEvents) {
    if (!isRecord(event) || typeof event.actorInvocationId !== "string") {
      continue;
    }
    if (
      event.kind !== "actor_invocation_started" &&
      event.kind !== "actor_result_artifact_observed" &&
      event.kind !== "actor_invocation_closed"
    ) {
      continue;
    }
    const current = byInvocation.get(event.actorInvocationId) ?? {
      actorInvocationId: event.actorInvocationId,
      workerId: null,
      backendId: null,
      dispatchRef: null,
      resultRef: null,
      artifactRef: null,
      closureStatus: null,
      edge: null,
      sourceEventRefs: []
    };
    current.workerId = current.workerId ?? stringOrNull(event.workerId);
    current.backendId = current.backendId ?? stringOrNull(event.backendId);
    current.dispatchRef = current.dispatchRef ?? stringOrNull(event.dispatchRef);
    current.resultRef = current.resultRef ?? stringOrNull(event.resultRef);
    current.artifactRef = current.artifactRef ?? stringOrNull(event.artifactRef);
    current.closureStatus = current.closureStatus ?? stringOrNull(event.closureStatus);
    current.edge = current.edge ?? stringOrNull(event.edge);
    const sourceEventRef = eventRefFor(event);
    if (sourceEventRef !== null) {
      current.sourceEventRefs.push(sourceEventRef);
    }
    byInvocation.set(event.actorInvocationId, current);
  }
  return Object.freeze([...byInvocation.values()].map((entry) => Object.freeze({
    ...entry,
    sourceEventRefs: uniqueStrings(entry.sourceEventRefs)
  })));
}

function evidenceDisposition(evidence, bindings, invocations) {
  const completeEvidence = evidence.filter((item) =>
    item.complete && !item.deferred && !item.contradictsAuthority
  );
  const admittedBindings = bindings.filter((item) => item.bindingStatus === "admitted");
  const completedInvocations = invocations.filter((item) => item.closureStatus === "completed");
  if (completeEvidence.length > 0 && admittedBindings.length > 0 && completedInvocations.length > 0) {
    return "admitted_bound_and_executed";
  }
  if (completeEvidence.length > 0 && admittedBindings.length > 0) {
    return "admitted_and_bound";
  }
  if (completeEvidence.length > 0) {
    return "admitted_unbound";
  }
  if (admittedBindings.length > 0) {
    return "bound_without_runtime_evidence";
  }
  return "no_evidence";
}

function assuranceDisposition(folds, residuals, dispositions) {
  if (residuals.length > 0) {
    return "residual_pressure";
  }
  const foldStates = folds.map((fold) => fold.state);
  if (foldStates.includes("failed")) {
    return "assurance_failed";
  }
  if (foldStates.includes("blocked")) {
    return "assurance_blocked";
  }
  if (foldStates.includes("partial")) {
    return "assurance_partial";
  }
  if (foldStates.includes("satisfied")) {
    return "assurance_satisfied";
  }
  if (dispositions.some((disposition) => disposition.disposition === "blocked")) {
    return "assurance_blocked";
  }
  return "no_assurance";
}

function dispositionPayloadsFor(readModel, replayFacts, runtimeEvents) {
  const facts = Object.freeze([
    ...(Array.isArray(replayFacts) ? replayFacts : []),
    ...runtimeDispositionFacts(runtimeEvents)
  ]);
  return readModel.dispositionRefs.map((ref) => {
    const fact = facts.find((candidate) => (
      isRecord(candidate) &&
      candidate.kind === "requirement_lifecycle_disposition" &&
      candidate.ref === ref
    ));
    return isRecord(fact) ? fact.payload : null;
  }).filter((payload) => payload !== null);
}

function interpretDisposition(dispositions) {
  if (dispositions.length === 0) {
    return "no_disposition";
  }
  const kinds = dispositions.map((payload) => isRecord(payload) ? payload.disposition : null);
  if (kinds.includes("blocked")) {
    return "blocked";
  }
  if (kinds.includes("reentry_available")) {
    return "reentry_available";
  }
  if (kinds.includes("continuation_available")) {
    return "continuation_available";
  }
  if (kinds.includes("closed")) {
    return "release_readiness_candidate";
  }
  return "no_disposition";
}

export function interpretLifecycleState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Lifecycle interpretation requires an input object"]);
  }

  const facade = validateAbgRequirementsFacade(input.abgRequirements);
  if (facade.status === "rejected") {
    return facade;
  }

  const queryInput = {
    query: input.query,
    dispositionRefs: Array.isArray(input.dispositionRefs) ? Object.freeze([...input.dispositionRefs]) : Object.freeze([]),
    replayFacts: Array.isArray(input.replayFacts) ? Object.freeze([...input.replayFacts]) : Object.freeze([]),
    runtimeEvents: Array.isArray(input.runtimeEvents) ? Object.freeze([...input.runtimeEvents]) : Object.freeze([])
  };

  const routeResult = input.abgRequirements.projectLifecycleState(queryInput);
  if (!isRecord(routeResult) || routeResult.status !== "accepted") {
    return rejected(
      "abg_query_rejected",
      isRecord(routeResult) && Array.isArray(routeResult.diagnostics)
        ? routeResult.diagnostics
        : ["ABG projectLifecycleState rejected or returned a malformed result"],
      isRecord(routeResult) && Array.isArray(routeResult.sourceRefs) ? routeResult.sourceRefs : []
    );
  }

  const readModel = routeResult.value;
  if (!isRecord(readModel) || readModel.kind !== "requirement_lifecycle_state_read_model") {
    return rejected("abg_query_rejected", ["ABG lifecycle state query returned an unexpected read model"]);
  }

  const interpretedDispositions = dispositionPayloadsFor(
    readModel,
    queryInput.replayFacts,
    queryInput.runtimeEvents
  );
  const requirementIds = isRecord(readModel.requirementQuery) && Array.isArray(readModel.requirementQuery.requirementIds)
    ? readModel.requirementQuery.requirementIds
    : [];

  return accepted({
    kind: "odd_glc_lifecycle_state_view",
    tenant: TENANT_ID,
    lifecycleDisposition: interpretDisposition(interpretedDispositions),
    requirementIds: Object.freeze([...requirementIds]),
    dispositionRefs: Object.freeze([...(readModel.dispositionRefs ?? [])]),
    sourceEventRefs: Object.freeze([...(readModel.sourceEventRefs ?? [])]),
    sourceProjectionRefs: Object.freeze([...(readModel.sourceProjectionRefs ?? [])]),
    interpretedDispositions: Object.freeze(interpretedDispositions),
    surfaceMap: input.surfaceMap ?? null,
    policyOverlayId: input.policyOverlay?.id ?? null,
    abgReadModel: readModel
  }, [
    ...requirementIds,
    ...(readModel.dispositionRefs ?? []),
    ...(readModel.sourceEventRefs ?? [])
  ]);
}

export function interpretEvidenceState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Evidence interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const bindings = routeEvidenceBindings(runtimeEvents);
  const evidence = admittedEvidence(runtimeEvents);
  const invocations = actorInvocationViews(runtimeEvents);
  const sourceEventRefs = uniqueStrings([
    ...bindings.map((item) => item.sourceEventRef),
    ...evidence.map((item) => item.sourceEventRef),
    ...invocations.flatMap((item) => item.sourceEventRefs)
  ]);
  const targetArtifactRefs = uniqueStrings(invocations.map((item) => item.artifactRef));
  const capabilityRefs = uniqueStrings(invocations.flatMap((item) => [
    item.workerId,
    item.backendId,
    item.dispatchRef
  ]));

  return accepted({
    kind: "odd_glc_evidence_state_view",
    tenant: TENANT_ID,
    evidenceDisposition: evidenceDisposition(evidence, bindings, invocations),
    targetArtifactRefs,
    capabilityRefs,
    actorInvocations: invocations,
    admittedEvidence: Object.freeze(evidence),
    requirementEvidenceBindings: Object.freeze(bindings),
    sourceEventRefs,
    runtimeEventCount: runtimeEvents.length
  }, [
    ...targetArtifactRefs,
    ...capabilityRefs,
    ...sourceEventRefs
  ]);
}

export function interpretParallelFrontierState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Parallel frontier interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const lifecycleState = isRecord(input.lifecycleState) ? input.lifecycleState : Object.freeze({});
  const events = branchFrontierEvents(runtimeEvents);
  const branchPayloads = branchPayloadRows(events);
  const fanIns = fanInRows(events);
  const acquiredBranchRefs = uniqueStrings(events
    .filter((event) => event.kind === "branch_lease_acquired")
    .map((event) => event.branchRef));
  const releasedBranchRefs = uniqueStrings(events
    .filter((event) => event.kind === "branch_lease_released")
    .map((event) => event.branchRef));
  const aggregateStates = Object.freeze(
    Array.isArray(lifecycleState.aggregateStates)
      ? lifecycleState.aggregateStates.map((state) => deepFreeze({ ...state }))
      : []
  );
  const requirementGraph = isRecord(lifecycleState.requirementGraph)
    ? lifecycleState.requirementGraph
    : null;
  const readiness =
    fanIns.length > 0 && branchPayloads.length > 0
      ? "fan_in_ready"
      : branchPayloads.length > 0
        ? "branch_payloads_admitted"
        : acquiredBranchRefs.length > 0
          ? "frontier_started"
          : "no_frontier_truth";

  return accepted({
    kind: "odd_glc_parallel_frontier_state_view",
    tenant: TENANT_ID,
    readiness,
    branchRefs: uniqueStrings([
      ...acquiredBranchRefs,
      ...releasedBranchRefs,
      ...branchPayloads.map((row) => row.branchRef),
      ...fanIns.flatMap((row) => row.orderedBranchRefs)
    ]),
    acquiredBranchRefs,
    releasedBranchRefs,
    branchPayloads,
    fanIns,
    fanInRefs: uniqueStrings(fanIns.map((row) => row.fanInRef)),
    payloadDigests: uniqueStrings(branchPayloads.map((row) => row.payloadDigest)),
    evidenceRefs: uniqueStrings([
      ...branchPayloads.flatMap((row) => row.evidenceRefs),
      ...fanIns.flatMap((row) => row.evidenceRefs)
    ]),
    aggregateStates,
    requirementGraph,
    sourceEventRefs: uniqueStrings(events.map((event) => eventRefFor(event)))
  }, [
    ...events.map((event) => eventRefFor(event)),
    ...branchPayloads.map((row) => row.payloadDigest),
    ...fanIns.map((row) => row.fanInRef)
  ]);
}

export function interpretRequirementGraphState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Requirement graph interpretation requires an input object"]);
  }
  const lifecycleState = isRecord(input.lifecycleState) ? input.lifecycleState : Object.freeze({});
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const requirementGraph = isRecord(lifecycleState.requirementGraph)
    ? lifecycleState.requirementGraph
    : null;
  const aggregateStates = Object.freeze(
    Array.isArray(lifecycleState.aggregateStates)
      ? lifecycleState.aggregateStates.filter(isRecord).map((state) => deepFreeze({ ...state }))
      : []
  );
  const terms = routeTermEvents(runtimeEvents);
  const relations = routeRelationEvents(runtimeEvents);
  const sourceEventRefs = uniqueStrings([
    ...(Array.isArray(lifecycleState.sourceEventRefs) ? lifecycleState.sourceEventRefs : []),
    ...terms.map((term) => term.sourceEventRef),
    ...relations.map((relation) => relation.sourceEventRef)
  ]);

  return accepted({
    kind: "odd_glc_requirement_graph_state_view",
    tenant: TENANT_ID,
    graphDisposition: graphDisposition(requirementGraph, aggregateStates),
    graphRef: requirementGraph?.graphRef ?? null,
    requirementIds: uniqueStrings([
      ...(Array.isArray(requirementGraph?.requirementIds) ? requirementGraph.requirementIds : []),
      ...terms.map((term) => term.requirementId)
    ]),
    rootRequirementIds: uniqueStrings(Array.isArray(requirementGraph?.rootRequirementIds) ? requirementGraph.rootRequirementIds : []),
    leafRequirementIds: uniqueStrings(Array.isArray(requirementGraph?.leafRequirementIds) ? requirementGraph.leafRequirementIds : []),
    relationRefs: uniqueStrings([
      ...(Array.isArray(requirementGraph?.relationRefs) ? requirementGraph.relationRefs : []),
      ...relations.map((relation) => relation.relationId)
    ]),
    parentChildPairs: Object.freeze(Array.isArray(requirementGraph?.parentChildPairs)
      ? requirementGraph.parentChildPairs.filter(isRecord).map((pair) => deepFreeze({ ...pair }))
      : []),
    aggregateStates,
    residualRefs: uniqueStrings(aggregateStates.flatMap((state) => Array.isArray(state.residualRefs) ? state.residualRefs : [])),
    terms: Object.freeze(terms),
    relations: Object.freeze(relations),
    sourceRefs: uniqueStrings([
      ...(Array.isArray(requirementGraph?.sourceRefs) ? requirementGraph.sourceRefs : []),
      ...terms.map((term) => term.sourceRef),
      ...relations.map((relation) => relation.relationId)
    ]),
    sourceEventRefs,
    abgRequirementGraph: requirementGraph
  }, [
    requirementGraph?.graphRef,
    ...sourceEventRefs,
    ...(Array.isArray(requirementGraph?.sourceRefs) ? requirementGraph.sourceRefs : [])
  ]);
}

export function interpretRecursiveSpanState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Recursive span interpretation requires an input object"]);
  }
  const lifecycleState = isRecord(input.lifecycleState) ? input.lifecycleState : Object.freeze({});
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const lineage = spanLineageRows(lifecycleState);
  const graphEvents = graphSpanReplayEvents(lifecycleState);
  const recursiveEvents = recursiveRuntimeSpanEvents(runtimeEvents);
  const sourceEventRefs = uniqueStrings([
    ...(Array.isArray(lifecycleState.sourceEventRefs) ? lifecycleState.sourceEventRefs : []),
    ...graphEvents.map((event) => eventRefFor(event)),
    ...recursiveEvents.map((event) => eventRefFor(event))
  ]);

  return accepted({
    kind: "odd_glc_recursive_span_state_view",
    tenant: TENANT_ID,
    readiness: spanReadiness(lineage, graphEvents, recursiveEvents),
    spanLineageRefs: uniqueStrings(lineage.map((row) => row.lineageRef)),
    spanIds: uniqueStrings(lineage.map((row) => row.spanId)),
    frameRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.frameRefs) ? row.frameRefs : [])),
    zoomRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.zoomRefs) ? row.zoomRefs : [])),
    foldbackRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.foldbackRefs) ? row.foldbackRefs : [])),
    aliasRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.aliasRefs) ? row.aliasRefs : [])),
    graphVectorRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.graphVectorRefs) ? row.graphVectorRefs : [])),
    graphSpanEventKinds: uniqueStrings(graphEvents.map((event) => event.kind)),
    runtimeSpanEventKinds: uniqueStrings(recursiveEvents.map((event) => event.kind)),
    lineage,
    graphSpanReplay: Object.freeze(graphEvents),
    runtimeSpanEvents: Object.freeze(recursiveEvents),
    sourceEventRefs
  }, [
    ...sourceEventRefs,
    ...lineage.map((row) => row.lineageRef),
    ...lineage.map((row) => row.spanId)
  ]);
}

export function interpretExecutivePressureState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Executive pressure interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const pressureEvents = Array.isArray(input.pressureEvents)
    ? Object.freeze([...input.pressureEvents])
    : Object.freeze([]);
  const pressureFacts = executivePressureRows(runtimeEvents, pressureEvents);
  const sourceEventRefs = uniqueStrings([
    ...pressureFacts.map((fact) => fact.sourceEventRef),
    ...pressureFacts.flatMap((fact) => Array.isArray(fact.fact.sourceEventRefs) ? fact.fact.sourceEventRefs : [])
  ]);

  return accepted({
    kind: "odd_glc_executive_pressure_state_view",
    tenant: TENANT_ID,
    pressureDisposition: pressureDisposition(pressureFacts),
    pressureFactRefs: uniqueStrings(pressureFacts.map((fact) => fact.pressureFactRef)),
    observationRefs: uniqueStrings(pressureFacts.map((fact) => fact.observationRef)),
    requirementIds: uniqueStrings(pressureFacts.flatMap((fact) => fact.requirementIds)),
    residualPressureRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.residualPressureRefs)),
    continuationRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.continuationRefs)),
    evidenceRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.evidenceRefs)),
    diagnosticRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.diagnosticRefs)),
    spanRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.spanRefs)),
    dispositions: uniqueStrings(pressureFacts.map((fact) => fact.disposition)),
    closeDispositions: uniqueStrings(pressureFacts.map((fact) => fact.closeDisposition)),
    attenuation: uniqueStrings(pressureFacts.map((fact) => fact.attenuation)),
    pressureFacts: Object.freeze(pressureFacts),
    sourceEventRefs
  }, [
    ...sourceEventRefs,
    ...pressureFacts.map((fact) => fact.pressureFactRef)
  ]);
}

export function interpretReleaseReadinessState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Release readiness interpretation requires an input object"]);
  }
  const lifecycleStateView = isRecord(input.lifecycleStateView) ? input.lifecycleStateView : Object.freeze({});
  const assuranceStateView = isRecord(input.assuranceStateView) ? input.assuranceStateView : Object.freeze({});
  const evidenceStateView = isRecord(input.evidenceStateView) ? input.evidenceStateView : Object.freeze({});
  const sourceEventRefs = uniqueStrings([
    ...(Array.isArray(lifecycleStateView.sourceEventRefs) ? lifecycleStateView.sourceEventRefs : []),
    ...(Array.isArray(assuranceStateView.sourceEventRefs) ? assuranceStateView.sourceEventRefs : []),
    ...(Array.isArray(evidenceStateView.sourceEventRefs) ? evidenceStateView.sourceEventRefs : [])
  ]);

  return accepted({
    kind: "odd_glc_release_readiness_state_view",
    tenant: TENANT_ID,
    readiness: releaseReadiness(lifecycleStateView, assuranceStateView, evidenceStateView),
    lifecycleDisposition: lifecycleStateView.lifecycleDisposition ?? "no_disposition",
    assuranceDisposition: assuranceStateView.assuranceDisposition ?? "no_assurance",
    evidenceDisposition: evidenceStateView.evidenceDisposition ?? "no_evidence",
    residualRefs: uniqueStrings(Array.isArray(assuranceStateView.residualRefs) ? assuranceStateView.residualRefs : []),
    dispositionRefs: uniqueStrings(Array.isArray(lifecycleStateView.dispositionRefs) ? lifecycleStateView.dispositionRefs : []),
    evidenceRefs: uniqueStrings(Array.isArray(evidenceStateView.admittedEvidence)
      ? evidenceStateView.admittedEvidence.map((event) => isRecord(event) ? event.evidenceRef : null)
      : []),
    releaseAuthority: "not_claimed",
    sourceEventRefs
  }, [
    ...sourceEventRefs,
    ...(Array.isArray(assuranceStateView.residualRefs) ? assuranceStateView.residualRefs : [])
  ]);
}

export function interpretAssuranceState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Assurance interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const folds = routeFoldEvents(runtimeEvents);
  const residuals = routeResidualEvents(runtimeEvents);
  const dispositions = routeDispositionEvents(runtimeEvents);
  const evidenceRefs = uniqueStrings(folds.flatMap((fold) => fold.evidenceRefs));
  const sourceAbgTruthRefs = uniqueStrings(folds.flatMap((fold) => fold.sourceAbgTruthRefs));
  const sourceEventRefs = uniqueStrings([
    ...folds.map((fold) => fold.sourceEventRef),
    ...residuals.map((residual) => residual.sourceEventRef),
    ...dispositions.map((disposition) => disposition.sourceEventRef)
  ]);

  return accepted({
    kind: "odd_glc_assurance_state_view",
    tenant: TENANT_ID,
    assuranceDisposition: assuranceDisposition(folds, residuals, dispositions),
    foldRefs: uniqueStrings(folds.map((fold) => fold.foldRef)),
    foldStates: uniqueStrings(folds.map((fold) => fold.state)),
    residualRefs: uniqueStrings(residuals.map((residual) => residual.residualRef)),
    dispositionRefs: uniqueStrings(dispositions.map((disposition) => disposition.dispositionRef)),
    evidenceRefs,
    sourceAbgTruthRefs,
    folds: Object.freeze(folds),
    residuals: Object.freeze(residuals),
    dispositions: Object.freeze(dispositions),
    sourceEventRefs,
    runtimeEventCount: runtimeEvents.length
  }, [
    ...sourceEventRefs,
    ...sourceAbgTruthRefs
  ]);
}
