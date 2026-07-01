# odd_glc Lifecycle Slot Map

**Status**: Active
**Scope**: Common design slot map
**Derives from**:
[PRODUCT.md](../../../specification/PRODUCT.md),
[REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS](../../../specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md),
[REQ-GLC-DOWNSTREAM-SPECIALIZATION](../../../specification/requirements/REQ-GLC-DOWNSTREAM-SPECIALIZATION.md),
[ADR-001](adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md)

## Position

The lifecycle slot map is the `odd_glc` registry of lifecycle interpretation
slots. It is not a GTL graph overlay, graph-function catalog, runtime catalog,
emitter catalog, carrier catalog, or odd_sdlc phase catalog.

Every slot-map entry is data-only. An entry may name lifecycle vocabulary,
policy slots, read-model views, proof bindings, or downstream specialization
seams over GTL/ABG truth. It shall not construct GTL graph truth or ABG runtime
truth.

`odd_glc` may also declare reusable GTL overlay graphs, such as the
software-build lifecycle overlay. Those overlay graphs are GTL declaration
surfaces consumed by ABG startup. They are separate from this lifecycle slot
map.

## Slot Map Shape

The slot map has:

- one slot-map authority block;
- one family-rule map;
- many compact entries.

Family rules carry behavior constraints that apply to all entries in a family.
Entries carry stable identity, binding, and lifecycle meaning.

## Family Rule Shape

Each family rule has this design shape:

| Field | Meaning |
| --- | --- |
| `owner` | Authority that owns the entry meaning. This is normally `odd_glc`; downstream may own specialization payloads. |
| `allowedUse` | What a consumer may do with entries in the family. |
| `forbiddenAuthority` | Authority entries in the family shall not exercise. |
| `extensionRule` | How downstream products or plugins may specialize entries in the family. |

## Slot Entry Shape

Each compact slot-map entry has this design shape:

| Field | Meaning |
| --- | --- |
| `entryId` | Stable odd_glc slot id. |
| `family` | One of `lifecycle_surface`, `policy_overlay`, `read_model`, `proof_binding`, or `specialization_seam`. |
| `surface` | Optional lifecycle surface name when the entry binds one of the generic lifecycle surfaces. |
| `gtlAbgTruth` | GTL/ABG carrier, query, replay fact, or admitted runtime truth consumed by the entry. |
| `overlayMeaning` | Lifecycle meaning supplied by odd_glc. |

An implementation may keep `owner`, `allowedUse`, `forbiddenAuthority`, and
`extensionRule` on the family rule rather than repeating them on every entry.

## Lifecycle Surface Entries

| Entry | Surface | GTL/ABG truth | Overlay meaning |
| --- | --- | --- | --- |
| `surface.lifecycle_worksite` | `LifeCycleWorksiteAsset` | ABG run/worksite refs; GTL module/job refs where present. | Lifecycle scope label. |
| `surface.lifecycle_context` | `LifecycleContextAsset` | ABG `AuthorityContextFragment` and context routing truth. | Lifecycle context label. |
| `surface.intent` | `IntentAsset` | GTL/ABG refs used by requirement declarations and staged context. | Product intent meaning. |
| `surface.product_definition` | `ProductDefinitionAsset` | GTL/ABG refs used by requirement declarations and proof policy. | Product-definition meaning. |
| `surface.requirement_set` | `RequirementSetAsset` | GTL requirement declarations, bundles, and traversal spans. | Lifecycle requirement pressure binding. |
| `surface.requirement_environment_view` | `RequirementEnvironmentViewAsset` | ABG requirement environment projection. | Active requirement environment view. |
| `surface.destination_topology` | `DestinationTopologyAsset` | ABG destination topology and GTL topology declarations. | Lifecycle destination label. |
| `surface.instruction_set` | `InstructionSetAsset` | ABG obligation, target, and schedule projections. | Bounded construction handoff label. |
| `surface.target_artifact` | `TargetArtifactAsset` | GTL asset surfaces and ABG admitted artifact refs. | Lifecycle target artifact label. |
| `surface.capability` | `CapabilityAsset` | GTL/ABG capability carriers and ABG actor/operator invocation truth. | Lifecycle capability label. |
| `surface.evidence_binding` | `EvidenceBindingAsset` | ABG admitted evidence and requirement evidence binding. | Evidence-binding view. |
| `surface.assurance_fold_view` | `AssuranceFoldViewAsset` | ABG assurance fold and assurance-case projections. | Assurance state view. |
| `surface.residual_pressure_view` | `ResidualPressureViewAsset` | ABG residual projection and attenuation classification. | Residual pressure view. |
| `surface.reentry_decision` | `ReentryDecisionAsset` | ABG continuation, correction, re-entry, release, or block facts. | Lifecycle disposition label. |

Lifecycle surface entries shall preserve ABG refs and source truth. They shall
not mint replacement carriers when GTL/ABG already carries the role.

## Policy Overlay Entries

| Entry | Family | Allowed use | Forbidden authority |
| --- | --- | --- | --- |
| `policy.fp_semantic_judgment` | `policy_overlay` | Data-only prompts, rubrics, evidence expectations, semantic judgment criteria. | F_P worker invocation, evidence admission, closure decision, or treating text as admitted proof. |
| `policy.fh_human_decision` | `policy_overlay` | Data-only owner, risk, reprice, block, escalation, release-readiness policy. | Hidden retry loop, release controller, re-entry router, or owner-decision controller. |

Policy entries may be supplied by `odd_glc` or by downstream products/plugins.
They are declarations consumed by GTL/ABG or interpreted after ABG replay truth
exists. They are not executable authority.

## Read-Model Entries

| Entry | Family | GTL/ABG truth | Overlay meaning |
| --- | --- | --- | --- |
| `view.lifecycle_state` | `read_model` | ABG `projectLifecycleState` read model and replayed disposition facts. | Lifecycle disposition vocabulary. |
| `view.evidence_state` | `read_model` | ABG admitted evidence and requirement evidence-binding facts. | Evidence readiness vocabulary. |
| `view.assurance_state` | `read_model` | ABG fold, residual, and lifecycle disposition facts. | Assurance and residual vocabulary. |
| `view.requirement_graph_state` | `read_model` | ABG requirement graph/refinement projections. | Requirement graph lifecycle view. |
| `view.recursive_span_state` | `read_model` | ABG frame, zoom, span, foldback, and re-entry facts. | Recursive lifecycle readiness view. |
| `view.executive_pressure_state` | `read_model` | ABG executive pressure facts and continuation refs. | Reprice, block, and pressure-preservation view. |
| `view.release_readiness_state` | `read_model` | Lifecycle, assurance, and evidence views. | Release-readiness interpretation without release authority. |
| `view.parallel_frontier_state` | `read_model` | ABG saga/frontier, branch, fan-in, fold, and disposition facts. | Parallel branch/fan-in lifecycle view. |

Read-model entries are replay/query interpretation only. They shall not emit
events, admit evidence, mint refs, fold requirements, residualize pressure, or
route continuation.

## Proof-Binding Entries

| Entry | Family | Meaning |
| --- | --- | --- |
| `proof.committed_abg_proof_input` | `proof_binding` | Digest-pinned ABI artifact and manifest consumed as read-only proof input. |
| `proof.live_run_reference` | `proof_binding` | Pointer to ABI live proof run metadata, when available. |
| `proof.negative_boundary` | `proof_binding` | Regression proof that forbidden emitters, carriers, or executable policy are absent. |

Proof-binding entries describe how odd_glc consumes proof. They do not create
proof truth. ABI owns live execution and runtime event admission.

## Specialization Seam Entries

| Entry | Family | Downstream may add | Downstream shall not add |
| --- | --- | --- | --- |
| `seam.domain_asset_roles` | `specialization_seam` | Domain asset role names bound to GTL/ABG refs. | Replacement lifecycle carriers that shadow GTL/ABG. |
| `seam.domain_policy_slots` | `specialization_seam` | Domain-specific F_P/F_H data policy. | Direct evaluator invocation or owner-decision controller. |
| `seam.domain_proof_expectations` | `specialization_seam` | Domain evidence expectations over ABG admitted evidence. | Local evidence admission, closure ledger, or residual ledger. |
| `seam.plugin_binding_refs` | `specialization_seam` | Plugin refs that supply data declarations or downstream interpretation. | Product-local runtime, scheduler, retry loop, or graph-function catalog. |

Plugins fill downstream specialization seams. The catalog defines the slot and
boundary. The plugin supplies domain content through GTL/ABG-bound data.

## Non-Slot-Map Surfaces

The following are explicitly outside the odd_glc lifecycle slot map:

- GTL graph-function catalogs;
- GTL overlay graphs and public-start overlay rows;
- GTL graph, node, vector, module, job, interface, wrapper, or carrier law;
- ABG runtime emitters, admission commands, fold/residual projection commands,
  actor/operator invocation, continuation, correction, or re-entry authority;
- product-local requirement compilers, ledgers, retry loops, replay stores, or
  closure stores;
- odd_sdlc phase names, `Sdlc*` carriers, software-domain policy, local ledgers,
  retry behavior, or closure rules.

## Implementation Binding

The TypeScript tenant may export a frozen data constant representing this
slot map. That export is a library interface for validation and discovery. It
shall contain no functions and shall not grant runtime authority.
