---
id: T-021
title: Reprice product state for ABG 4.2 parity wave
type: governance
ticket_category: product_reprice
status: completed
goal: >-
  Align odd_glc constitutional and ticket state with the completed T-001
  through T-020 source checkpoint, the active TypeScript tenant, and the
  installed ABIogenesis 4.2.0-rc.1 substrate before opening the typed startup
  parity wave.
change_class: product_reprice
re_entry_point: product
owner: odd_glc
priority: high
created_at: 2026-07-01
completed_at: 2026-07-01
governance_scope: STDO Method, ODD Method, product-definition authority, ticket-state consistency
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - build_tenants/TENANT_REGISTRY.md
  - .ai-workspace/tickets/completed/T-020-upgrade-installed-abg-substrate-to-4-2.md
closure_law: >-
  Close only when PRODUCT, GOALS, active tickets, and tenant registry agree
  that T-001 through T-020 are completed, ABIogenesis 4.2.0-rc.1 is installed,
  the TypeScript tenant is active, and the next parity wave is startup and
  typed-GTL work rather than old fixture-only replay consumption.
non_closure_conditions:
  - PRODUCT still says T-001 is active or that no build tenant exists.
  - GOALS or tickets imply odd_glc has runtime, registry, selection, execution,
    admission, fold, residual, continuation, or release authority.
  - The parity wave treats odd_sdlc feature shape as odd_glc product law.
  - The work hides the ABG 4.2 startup/registry/node-type dependency behind a
    product-local shell or catalog.
required_work:
  - Update PRODUCT current-state language.
  - Keep active ticket state accurate.
  - Open the ABG 4.2 startup/typed-node parity tickets with odd_sdlc only as a
    witness/deletion-target surface.
  - Prove the tenant still passes its read-only boundary tests.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
  - '! rg -n "T-001.*active|no active build tenant|no claimed lifecycle closure" specification/PRODUCT.md'
closure_evidence:
  - PRODUCT current-state language now records completed T-001 through T-020,
    active TypeScript tenant, installed ABIogenesis 4.2.0-rc.1 substrate, and
    the ABG-owned startup/registry/traversal boundary for the next wave.
  - Active tickets T-022 through T-028 define the next typed startup parity
    wave without treating odd_sdlc as product law.
  - `cd build_tenants/odd_glc/typescript && npm test` passed for the typed
    startup parity wave.
---

# T-021: Reprice Product State For ABG 4.2 Parity Wave

This ticket is the state-alignment gate for the next work wave. It does not add
runtime behavior. It removes stale product-state language and establishes the
next work as ABG 4.2 startup, registry, node-type, and typed-composition
consumption through GTL declarations.
