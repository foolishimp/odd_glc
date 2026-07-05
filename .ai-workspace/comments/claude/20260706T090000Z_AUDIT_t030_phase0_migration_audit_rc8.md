# T-030 Phase 0 Audit: Live Traversal Migration onto ABI 4.2.0-rc.8

Commentary (Phase 0 deliverable per T-030). Verified against the tree at
audit time. Substrate target UPDATED: the ticket was written against
rc.6; the substrate is now 4.2.0-rc.8 and several ticket-predicted gaps
are retired upstream law.

## A. Substrate delta: rc.6 -> rc.8 (what the migration inherits)

The pin: build_tenants/odd_glc/typescript/substrate.provenance.json
declares packageVersion 4.2.0-rc.6 (source f3816835) and drives the
default toolchain path (.abg-toolchains/.../4.2.0-rc.6). Migration step
one is repinning provenance to rc.8 + installing the rc.8 snapshot into
the toolchain root.

Retired-upstream since the ticket was written (all closed-ticket truth):
- T-188 CLOSED: requirementProofCarryThroughStartup + producer-computed
  coverage + fold gating (uncovered shall not close) — the ticket's
  Phase-4 carriers exist; odd_glc supplies contract/table/template DATA.
- T-183/T-189/T-190 CLOSED: instruction assembly on every F_P arm;
  evaluate-stage plans REQUIRED (depth_policy_incomplete otherwise);
  registered-arm bind census.
- T-192 CLOSED: the five standing audit gates run as declared per-run
  temporal properties via temporalPropertyStartup — the ticket's
  "manifest count vs dispatch count" and "no worker without startup"
  non_closures are now PER-RUN LAW the substrate enforces when the
  binding declares the standing rules.
- T-193 CLOSED: drift law — substrate.provenance vs installed ABG version
  becomes a witnessed constitutional row (odd_glc gets version-drift
  detection for free).
- One-passthrough authority (F1): the runtime binding's startup families
  (instructionAssembly, carryThrough, route bundle, temporal) flow
  binding -> CLI -> engine with no per-field seam work.
- REFERENCE CONSUMER: ABI's test_env/sandbox/support/glc-binding-source
  builder is the canonical rc.8 binding (per-vector transform+evaluate
  plans WITH proofDepth+dependency truth, carry contract on the
  requirement edge, standing gates, latitude/calibration sections).

## B. Entry points (complete list)

- test/glc-software-build-overlay-live.test.mjs (4258 lines) — THE live
  lane: installs odd_glc product (@odd-glc/route-one-typescript
  0.0.0-source), resolves installed ABG genesis-ts from the toolchain
  root, writes .abiogenesis/typescript-runtime.mjs, invokes ABG ONCE,
  reads replay. Single-invocation law already honored.
- test/abg42-startup-binding.test.mjs — binding-shape regressions.
- test/glc-hello-world-sandbox-port.test.mjs, hello-world-subject-smoke,
  live-proof-shape, route-one/generic-lifecycle interpretation tests —
  read-only interpretation + fixtures.
- test/proof_inputs/* — copied ABI replay evidence, diagnostic-only.
- No other live entry points found.

## C. R(m) classification of every audited local surface

| Surface | Finding | R(m) |
| --- | --- | --- |
| STAGE_PLAN (live test :1573; SCENARIO.stagePlan fallback with stage order, vector ids, source/target type refs, requiredNodeTypes, deterministicMaterialize) | PRESENT — the ticket's "duplicate stage/vector truth" | ILLEGAL as closure truth -> becomes GTL declaration data: stage/vector truth derives from the admitted overlay graph (vectors carry source/target nodes + types); plan derivation reads the admitted graphFunction template, as the ABI canonical binding does |
| compiledPromptPlanForStage + instructionAssemblyStartup (:3456) | PRESENT and lawful in SHAPE (plans admitted via ABG startup, transform+evaluate per stage) but SOURCED from STAGE_PLAN rows | ABG startup input; replumb plan inputs from admitted overlay/vector truth + odd_glc policy data |
| promptFor / evaluatorPromptFor | ABSENT (0 hits) — prior wave removed them | retired |
| priorStageArtifacts in-memory carry | ABSENT (0 hits) | retired (verify causal carry via manifest sections in P5 regressions) |
| Worker + evaluator plugins consume pluginInput.instructionPromptManifest.renderedPrompt (:3587, :3806) | PRESENT — unified path, both stages | odd_glc consumer surface; ADD digest/vector-identity fail-closed checks (P3 checklist) |
| requirementRouteDeclarationBundle / requirementProofCarryThroughStartup / temporalPropertyStartup | ABSENT | ABG startup inputs — the REAL remaining migration (Phase 4): declare REQ route span on the prove-artifact edge, carry contract with execution-evidence strength refs, standing temporal gates |
| Local response/proof gates (parsed JSON, path checks) in the live lane | To be re-verified during P4; ticket names them | Any closure-affecting instance -> ABG response-contract + T-188 envelope admission; remaining checks reclassified diagnostic-only |
| substrate.provenance.json | rc.6 pin | odd_glc config data + NEW: witnessed constitutional row (T-193) — provenance-vs-installed-ABG version drift becomes a typed diagnostic |

## D. GTL surface -> rc.8 carrier mapping (the requested full map)

Overlays (2):
| Overlay | rc.8 carrier |
| --- | --- |
| overlay://odd_glc/general-lifecycle | registry entry (overlayRefs on product startup config) + interpretation bundles stay read-only |
| overlay://odd_glc/software-build-lifecycle | same + carries the requirement-bearing edges: requirementRouteDeclarationBundle span(s) on prove-artifact; carry-through contract/template declared as product data on its edges |

Typed nodes (5) — all map 1:1 onto node_type registry entries (the exact
shapes ABI's t180/t194 lanes already admit):
| node-type://odd_glc/... | rc.8 |
| GlcBootstrapContext | node_type entry + composeWithTypeWiring source |
| GlcLifecycleArtifact | node_type entry (prior-artifact causal slot) |
| GlcExecutableArtifact | node_type entry |
| GlcHelloWorldProgramArtifact | node_type entry (wiring provided->required) |
| GlcExecutionEvidence | node_type entry + STRENGTH REF HOME: its ref is the carry contract's fdStrengthCriterionRef (the toy-scenario pattern: artifact assessments declare it; accepted payload admits it; strength resolves typed) |

Graph functions (8+2 composed):
| graph-function://odd_glc/... | rc.8 |
| bootstrap/observe-lifecycle-context, bootstrap/bind-requirement-pressure | graph_function registry entries; bind-requirement-pressure's meaning is NOW REALIZED by ABG lineage pressure (manifest-carried obligation refs) — reclassify as interpretation over ABG truth or declaration data |
| software-build/{bootstrap-worksite, materialize-artifact, prove-artifact, fan-in-branches} | graph_function entries; per-vector candidate constraints (runtime_registry_candidate_refs as TYPED SerializedAttrs entries — F5 law: constraint lawfully resolves; unauthorized ambiguity halts) |
| software-build/{sdlc-software-build, full-lifecycle} composed | composed graph_function entries; compose preserves vector declarations |
| deployment/{project-release-readiness, observe-operational-feedback} | graph_function entries, interpretation-only bundles |

Per-vector instruction plans: transform+evaluate per F_P vector via
compileInstructionAssemblyPlan WITH dependencyInstructionTruth +
proofDepthInstructionTruth (rc.8 REQUIRES both for target_work — the
exact gap that broke ABI's own canonical lane; the fixture shape is in
the ABI binding builder). Declared latitude (program shape) + golden
instance calibration (execution-evidence examples/counterexamples) ride
the same plans as product data.

## E. Updated phase plan

- P0 = this audit. P1 = the mapping above IS the Prime design (no odd_glc
  carrier minted anywhere; every row reuses an ABI carrier or is data);
  DMM review rides the implementation commits.
- P2 (finish): repin provenance to rc.8; install rc.8 toolchain; derive
  plan inputs from admitted overlay/vector truth (retire STAGE_PLAN as
  closure truth).
- P3 (verify+harden): manifest digest + vector-identity fail-closed in
  both plugins.
- P4 (the core): route bundle + carry-through startup + temporal standing
  gates in the binding; lineage canary as read-only replay report.
- P5: non-live regressions per ticket list.
- P6: live software-build Hello World through installed ABG once.
