// T-030 requirement-lineage canary.
//
// ROLE (R(m) = diagnostic proof harness only): a READ-ONLY derivation over
// ABG replay events. It reports, per declared requirement obligation and
// span vector: pressure observed entering the prompt, carry-through
// admission, proof-coverage status, fold state, residual pressure, and
// DROPPED obligations. It writes no truth, owns no closure, and tracks no
// obligations — a dropped required obligation is a defect detector for
// ABI/GTL wiring, never an odd_glc responsibility surface.
//
// DROP LAW: a requirement is dropped when its span vector CLOSED in replay
// and no downstream truth exists at all — no carry-through admission, no
// proof-coverage ref, no fold row, no residual pressure. Silence after a
// reached requirement-bearing edge is the pre-carry-through-applicability
// collapse class; on current substrates either coverage or a synthesized
// residual must be replay-visible. A span vector the traversal never
// reached is reported `not_reached`, not dropped.

const COVERAGE_TRUTH_REF_PREFIX = "abg://requirement-proof-coverage/";

function coverageRefStatus(ref) {
  if (typeof ref !== "string" || !ref.startsWith(COVERAGE_TRUTH_REF_PREFIX)) {
    return null;
  }
  const parts = ref.slice(COVERAGE_TRUTH_REF_PREFIX.length).split("/");
  const status = parts[0] ?? null;
  let requirementId = null;
  try {
    requirementId = decodeURIComponent(parts[parts.length - 1] ?? "");
  } catch {
    requirementId = null;
  }
  return status === null || requirementId === null ? null : Object.freeze({ status, requirementId });
}

function routePayload(event) {
  return event.kind === "requirement_route_fact_projected"
    ? event.requirementPayload ?? null
    : null;
}

export function deriveRequirementLineageCanary(input) {
  const events = Array.isArray(input?.events) ? input.events : [];

  const spansById = new Map();
  const requirementSpanIds = new Map();
  const carryRowsByRequirement = new Map();
  const evidenceBindingsByRequirement = new Map();
  const foldRowsByRequirement = new Map();
  const closedVectors = new Map();
  const plannedVectors = new Map();
  const manifestsByVector = new Map();

  const noteRequirementSpan = (requirementId, spanId) => {
    if (typeof requirementId !== "string" || requirementId.length === 0) {
      return;
    }
    const spanIds = requirementSpanIds.get(requirementId) ?? new Set();
    if (typeof spanId === "string" && spanId.length > 0) {
      spanIds.add(spanId);
    }
    requirementSpanIds.set(requirementId, spanIds);
  };

  for (const event of events) {
    if (event.kind === "vector_closed" && Number.isInteger(event.vectorIndex)) {
      closedVectors.set(event.vectorIndex, Object.freeze({
        edge: event.edge ?? null,
        eventTimeUnixMs: event.eventTimeUnixMs ?? null
      }));
      continue;
    }
    if (event.kind === "vector_traversal_planned" && Number.isInteger(event.vectorIndex)) {
      if (!plannedVectors.has(event.vectorIndex)) {
        plannedVectors.set(event.vectorIndex, event.eventTimeUnixMs ?? null);
      }
      continue;
    }
    if (event.kind === "instruction_prompt_manifest_projected" && Number.isInteger(event.vectorIndex)) {
      const rows = manifestsByVector.get(event.vectorIndex) ?? [];
      rows.push(Array.isArray(event.includedCarrierRefs) ? event.includedCarrierRefs : []);
      manifestsByVector.set(event.vectorIndex, rows);
      continue;
    }
    if (event.kind === "requirement_proof_carry_through_admitted") {
      const requirementIds = Array.isArray(event.coverageRequirementIds)
        ? event.coverageRequirementIds
        : [];
      requirementIds.forEach((requirementId, index) => {
        const rows = carryRowsByRequirement.get(requirementId) ?? [];
        rows.push(Object.freeze({
          vectorIndex: event.vectorIndex ?? null,
          accepted: event.accepted === true,
          coverageStatus: Array.isArray(event.coverageStatuses)
            ? event.coverageStatuses[index] ?? null
            : null,
          coverageTruthRef: Array.isArray(event.coverageTruthRefs)
            ? event.coverageTruthRefs[index] ?? null
            : null
        }));
        carryRowsByRequirement.set(requirementId, rows);
      });
      continue;
    }
    const payload = routePayload(event);
    if (payload === null) {
      continue;
    }
    if (payload.kind === "requirement_term_admitted") {
      const term = payload.term ?? {};
      for (const spanRef of Array.isArray(term.spanRefs) ? term.spanRefs : []) {
        noteRequirementSpan(term.requirementId, spanRef);
      }
      noteRequirementSpan(term.requirementId, null);
    } else if (payload.kind === "traversal_span_admitted") {
      const span = payload.span ?? {};
      if (typeof span.spanId === "string") {
        spansById.set(span.spanId, Object.freeze({
          vectorIndexes: Array.isArray(span.vectorIndexes) ? span.vectorIndexes : []
        }));
      }
    } else if (payload.kind === "requirement_projection_admitted") {
      const projection = payload.projection ?? {};
      noteRequirementSpan(projection.requirementId, projection.spanId ?? null);
    } else if (payload.kind === "requirement_evidence_bound") {
      const binding = payload.binding ?? {};
      if (typeof binding.requirementId === "string") {
        const rows = evidenceBindingsByRequirement.get(binding.requirementId) ?? [];
        rows.push(Object.freeze({ bindingStatus: binding.bindingStatus ?? null }));
        evidenceBindingsByRequirement.set(binding.requirementId, rows);
      }
    } else if (payload.kind === "requirement_fold_projected") {
      const fold = payload.fold ?? {};
      if (typeof fold.requirementId === "string") {
        const rows = foldRowsByRequirement.get(fold.requirementId) ?? [];
        rows.push(Object.freeze({
          state: fold.state ?? null,
          sourceAbgTruthRefs: Array.isArray(fold.sourceAbgTruthRefs) ? fold.sourceAbgTruthRefs : [],
          residualPressureRefs: Array.isArray(fold.residualPressureRefs)
            ? fold.residualPressureRefs
            : []
        }));
        foldRowsByRequirement.set(fold.requirementId, rows);
      }
    }
  }

  const requirements = [];
  const droppedRequirementIds = [];
  for (const [requirementId, spanIds] of requirementSpanIds) {
    const vectorIndexes = [...new Set(
      [...spanIds].flatMap((spanId) => spansById.get(spanId)?.vectorIndexes ?? [])
    )].sort((a, b) => a - b);
    const carryRows = carryRowsByRequirement.get(requirementId) ?? [];
    const foldRows = foldRowsByRequirement.get(requirementId) ?? [];
    const coverageStatuses = [
      ...carryRows.map((row) => coverageRefStatus(row.coverageTruthRef)?.status ?? row.coverageStatus),
      ...foldRows.flatMap((row) =>
        row.sourceAbgTruthRefs
          .map((ref) => coverageRefStatus(ref))
          .filter((parsed) => parsed !== null && parsed.requirementId === requirementId)
          .map((parsed) => parsed.status)
      )
    ].filter((status) => typeof status === "string");
    const residualPressureRefs = foldRows.flatMap((row) => row.residualPressureRefs);
    const enteringPromptRefCounts = vectorIndexes.map((vectorIndex) => {
      const manifests = manifestsByVector.get(vectorIndex) ?? [];
      return manifests
        .flat()
        .filter((ref) => typeof ref === "string" && ref.includes(requirementId)).length;
    });
    const reachedVectorIndexes = vectorIndexes.filter((vectorIndex) => closedVectors.has(vectorIndex));
    const notReachedVectorIndexes = vectorIndexes.filter((vectorIndex) => !closedVectors.has(vectorIndex));
    const downstreamTruthPresent =
      carryRows.length > 0 ||
      foldRows.length > 0 ||
      coverageStatuses.length > 0 ||
      residualPressureRefs.length > 0;
    const dropped = reachedVectorIndexes.length > 0 && !downstreamTruthPresent;
    if (dropped) {
      droppedRequirementIds.push(requirementId);
    }
    requirements.push(Object.freeze({
      requirementId,
      spanIds: Object.freeze([...spanIds].sort()),
      vectorIndexes: Object.freeze(vectorIndexes),
      reachedVectorIndexes: Object.freeze(reachedVectorIndexes),
      notReachedVectorIndexes: Object.freeze(notReachedVectorIndexes),
      enteringPromptRefCounts: Object.freeze(enteringPromptRefCounts),
      carryThroughAdmittedCount: carryRows.filter((row) => row.accepted).length,
      coverageStatuses: Object.freeze([...new Set(coverageStatuses)].sort()),
      evidenceBindingCount: (evidenceBindingsByRequirement.get(requirementId) ?? []).length,
      foldStates: Object.freeze([...new Set(foldRows.map((row) => row.state))].sort()),
      residualPressureRefs: Object.freeze([...new Set(residualPressureRefs)].sort()),
      dropped
    }));
  }

  const vectors = [...closedVectors.entries()]
    .sort(([a], [b]) => a - b)
    .map(([vectorIndex, closed]) => {
      const plannedAt = plannedVectors.get(vectorIndex) ?? null;
      const closedAt = closed.eventTimeUnixMs;
      return Object.freeze({
        vectorIndex,
        edge: closed.edge,
        manifestCount: (manifestsByVector.get(vectorIndex) ?? []).length,
        durationMs: plannedAt !== null && closedAt !== null ? closedAt - plannedAt : null
      });
    });

  return Object.freeze({
    kind: "odd_glc_requirement_lineage_canary",
    role: "diagnostic_proof_instrumentation_read_only",
    requirements: Object.freeze(requirements),
    droppedRequirementIds: Object.freeze(droppedRequirementIds.sort()),
    vectors: Object.freeze(vectors)
  });
}
