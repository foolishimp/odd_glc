---
id: T-023
title: Bind overlays and library entries to ABG startup
type: implementation
ticket_category: design_realization
status: completed
goal: >-
  Define the canonical odd_glc startup binding: odd_glc supplies GTL registry
  declarations, overlay refs, policy refs, plugin refs, and startup config;
  ABG consumes them at startup and owns admission, lookup, selection,
  invocation gating, traversal, and emitted truth.
change_class: design_reframe
re_entry_point: build_tenant_design
owner: odd_glc
priority: high
created_at: 2026-07-01
completed_at: 2026-07-01
governance_scope: STDO Method, ODD Method, ABIogenesis 4.2 startup registry, no product-local shell
source_documents:
  - specification/PRODUCT.md
  - build_tenants/common/design/ODD_GLC_LIFECYCLE_SLOT_MAP.md
  - build_tenants/TENANT_REGISTRY.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-177-define-runtime-graph-function-catalog-registry.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-180-ratify-reusable-gtl-node-types-and-type-composition.md
closure_law: >-
  Close only when odd_glc startup data is expressed as GTL/ABG-consumable
  declarations and config, with tests proving that odd_glc exposes no local
  registry, selector, shell, invocation gate, event stream, or graph-call
  authority.
non_closure_conditions:
  - odd_glc startup is driven by a product-local shell instead of ABG startup.
  - odd_glc locally admits registry entries, projects a registry, selects graph
    functions, opens graph calls, invokes actors, or gates invocation.
  - Product plugin advice is treated as selection truth instead of advisory
    input that ABG may accept, reject, or override.
  - A local catalog or map is used as runtime selection truth.
required_work:
  - Define data-only startup config and library entry declarations for odd_glc
    lifecycle node types, overlays, bootstrap graph functions, deployment graph
    functions, plugin refs, policy refs, proof refs, and readiness refs.
  - Validate these declarations against ABIogenesis 4.2 public GTL declaration
    constructors.
  - Add negative tests that the odd_glc package exports no ABG registry
    admission, lookup, selection, invocation, graph-call, or event authority.
  - Defer live startup traversal proof to the next scenario ticket if a
    product-specific bootstrap graph is not yet ratified.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
  - '! rg -n "admitRuntimeGraphFunctionRegistryStartup\\(|lookupRuntimeGraphFunctionRegistry\\(|selectGraphFunctionFromRegistry\\(|assertGraphFunctionInvocationSelected\\(|constructGraphCallOpenedEvent\\(|emit\\(" build_tenants/odd_glc/typescript/src'
closure_evidence:
  - `ODD_GLC_STARTUP_BINDING` defines data-only startup config for ABG
    consumption.
  - `ODD_GLC_PRODUCT_GRAPH_FUNCTION_LIBRARY` defines four product
    graph-function library entry declarations for bootstrap and deployment
    roles without local invocation authority.
  - `defineOddGlcStartupBinding` constructs public GTL registry declaration
    data and product plugin advice through installed ABIogenesis 4.2 public GTL
    constructors.
  - Negative tests prove odd_glc exports no ABG startup, registry selection,
    graph-call, invocation, or event authority.
  - Live startup traversal proof remains correctly deferred to T-024.
  - `cd build_tenants/odd_glc/typescript && npm test` passed for the startup
    binding and negative-authority checks.
---

# T-023: Overlay And Library Startup Binding

This ticket prevents startup drift. Downstream products may add graph functions
and overlays only through GTL declaration/config surfaces consumed by ABG
startup. odd_glc does not run a second shell.
