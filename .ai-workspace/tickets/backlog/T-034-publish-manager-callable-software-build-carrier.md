---
id: T-034
title: Publish a manager-callable software-build carrier descriptor
type: feature
ticket_category: ordinary
status: backlog
review_status: pending
proof_status: pending
goal: publish-standard-declarations-only-software-build-consumer-contract
owner: odd_glc
change_intent: >-
  Publish a data-only, versioned software-build carrier descriptor that lets an
  external control plane discover and invoke the standard declarations-only
  odd_glc build path through ABIogenesis without importing a test harness,
  arbitrary executable path, or product-local runtime authority.
change_class: product_reprice
re_entry_point: product_definition
affected_boundary: >-
  odd_glc product definition, software-build requirements, typed startup design,
  public TypeScript package contract, install/worksite provisioning contract,
  ABIogenesis start adapter identity, conformance tests, and downstream
  odd_manager consumption
priority: high
triaged_at: 2026-07-11
created_at: 2026-07-11
updated_at: 2026-07-11
dependencies:
  - T-033
source_ticket: odd_manager/T-036
governance_scope: STDO Method, ODD Method, GTL/ABG declarations-only and startup ownership
intake_source: >-
  odd_manager T-032 W15 carrier census: odd_glc publishes overlay, startup
  binding, graph-function bindings, and public start targets, but the only full
  data-mapper worksite provisioning/invocation path remains inside a node:test
  live proof harness.
target_truth: >-
  odd_glc publishes one immutable descriptor over a standard declarations-only
  Job, GraphFunction, or workorder carrier. The descriptor names product and
  carrier identity, startup config, public start target, input schema,
  worksite-provisioner identity, execution-adapter identity, supported commands,
  expected requirement/asset catalogs, and proof refs. External managers can
  admit the descriptor and call ABIogenesis while GTL owns declarations and ABG
  owns startup, traversal, runtime events, evidence, continuation, and closure.
closure_law: >-
  Close only after product and requirement authority admit the external
  consumer contract, T-033 closes the standard declarations-only path, the
  installed odd_glc package publishes and validates the versioned descriptor,
  a fresh non-test consumer provisions and starts one build through the
  descriptor, and negative proof rejects arbitrary argv, test-harness imports,
  local runtime mechanisms, and stale product identity.
evaluation_criteria:
  - The descriptor is data-only and part of the installed public odd_glc package.
  - It names a published semantic carrier and standard ABG start target.
  - Worksite and execution adapter refs resolve through a published consumer contract rather than browser-provided paths.
  - Input, requirement, expected-asset, command-capability, and proof refs are versioned and runtime-validatable.
  - T-033 declarations-only and 11.5B authority gates remain satisfied.
  - A non-test integration consumer can provision and start a fresh build from the descriptor.
proof_surface:
  - specification/PRODUCT.md
  - specification/requirements/
  - build_tenants/common/design/ODD_GLC_ABG42_TYPED_STARTUP_BINDING.md or its current-release successor
  - build_tenants/odd_glc/typescript/src/index.mjs
  - build_tenants/odd_glc/typescript/src/index.d.ts
  - build_tenants/odd_glc/typescript/test/
  - downstream odd_manager T-036 admission fixture
non_closure_conditions:
  - The descriptor points at glc-software-build-overlay-live.test.mjs or invokes node --test.
  - The descriptor carries arbitrary executable paths or argv supplied by a browser consumer.
  - Worksite provisioning regenerates the current product-local dispatch, evaluator, materialization, archive, or consequence mechanisms.
  - A wrapper calls ABIogenesis while retaining odd_glc traversal, continuation, evidence, or closure authority.
  - Historical rc.2 data-mapper proof substitutes for fresh descriptor-consumer proof.
---

# T-034: Manager-Callable Software-Build Carrier

## Triage

The first missing layer is product definition. Current odd_glc law publishes
declarations for ABG startup and forbids a product-local startup shell, but it
does not yet publish the external consumer descriptor that binds an admitted
semantic build to a standard worksite and ABIogenesis adapter.

## Boundary

The descriptor may name declarations, schemas, product identity, install
inputs, adapter identities, supported commands, and proof obligations. It may
not contain executable product logic or become a second runtime.

Implementation begins only after T-033's declarations-only design and upstream
ABG dependencies are admitted.
