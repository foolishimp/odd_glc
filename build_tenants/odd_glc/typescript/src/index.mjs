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
