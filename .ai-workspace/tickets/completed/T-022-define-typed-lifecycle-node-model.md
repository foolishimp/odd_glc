---
id: T-022
title: Define typed lifecycle node model
type: design
ticket_category: requirement_design
status: completed
goal: >-
  Define reusable odd_glc lifecycle node types as GTL node-type declarations
  and identity graph functions over ABIogenesis 4.2 surfaces, without minting
  native odd_glc carriers.
change_class: design_reframe
re_entry_point: build_tenant_design
owner: odd_glc
priority: high
created_at: 2026-07-01
completed_at: 2026-07-01
governance_scope: STDO Method, ODD Method, GTL node types, ABG 4.2 substrate consumption
source_documents:
  - specification/PRODUCT.md
  - specification/GOALS.md
  - specification/requirements/REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md
  - build_tenants/common/design/ODD_GLC_LIFECYCLE_SLOT_MAP.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-180-ratify-reusable-gtl-node-types-and-type-composition.md
closure_law: >-
  Close only when odd_glc has a reviewed lifecycle node-type catalog expressed
  as GTL-compatible declaration data, proves the declarations use ABIogenesis
  4.2 node-type/type-composition surfaces, and does not create native shadow
  carriers.
non_closure_conditions:
  - A lifecycle node type is represented as an odd_glc-native carrier instead
    of a GTL node type or GTL-bound declaration.
  - A node-type entry is callable or selectable as a runtime graph function.
  - Type composition duplicates ABG/GTL composition logic in odd_glc.
  - odd_sdlc phase names, Sdlc carriers, or software-domain policy become node
    type law.
required_work:
  - Define lifecycle node-type ids, type refs, asset surfaces, and composition
    roles for the generic lifecycle model.
  - Bind node types to the existing lifecycle slot-map surfaces.
  - Add tests that verify the catalog is data-only and compatible with ABG 4.2
    GTL node-type constructors.
  - Record remaining gaps as named parity-wave tickets, not local shortcuts.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
  - '! rg -n "Sdlc|odd_sdlc.*carrier|phase flow|retry loop|closure ledger" build_tenants/odd_glc/typescript/src build_tenants/common/design'
closure_evidence:
  - `ODD_GLC_LIFECYCLE_NODE_TYPES` and
    `ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES` define reusable lifecycle type refs
    as GTL-compatible declaration data, not native carriers.
  - The lifecycle node-type set now covers every surface in
    `REQUIRED_ROUTE_ONE_SURFACES` / the generic lifecycle surface model:
    worksite, context, intent, product definition, requirement set,
    requirement environment, destination topology, instruction set, target
    artifact, capability, evidence binding, assurance fold, residual pressure,
    and re-entry decision.
  - Node-type library declarations bind each lifecycle type to its matching
    data-only lifecycle slot-map surface where the slot map defines one, rather
    than assigning every node type to a generic worksite/lifecycle-state pair.
  - `defineLifecycleNodeTypeDeclarations` materializes those entries through
    installed ABIogenesis 4.2 public GTL node-type and type-composition
    constructors.
  - `ODD_GLC_ABG42_TYPED_STARTUP_BINDING.md` records the design decision that
    node types use one generic lifecycle asset carrier shape with per-type
    contracts so ABI 4.2 composition law is preserved.
  - `cd build_tenants/odd_glc/typescript && npm test` passed after the
    corrected catalog and overlay-binding regression checks were added.
---

# T-022: Typed Lifecycle Node Model

This ticket defines the reusable lifecycle type vocabulary that downstream
products can compose without copying odd_glc internals or odd_sdlc legacy
mechanisms.
