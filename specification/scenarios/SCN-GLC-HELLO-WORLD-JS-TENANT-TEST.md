# SCN-GLC-HELLO-WORLD-JS-TENANT-TEST - JavaScript Tenant And Test Proof

**Status**: Active
**Date**: 2026-06-29
**Derives from**: [SCN-GLC-HELLO-WORLD-LADDER](SCN-GLC-HELLO-WORLD-LADDER.md),
[T-008](../../.ai-workspace/tickets/active/T-008-govern-hello-world-scenario-ladder.md)

---

## Purpose

Prove a lifecycle where the produced subject artifact and its proof artifact
are separate assets.

The scenario exercises source artifact interpretation, test artifact
interpretation, test execution evidence, and requirement evidence binding
without giving odd_glc a local materialization or test ledger.

## odd_sdlc Witness

- T-132 JavaScript single-tenant bootstrap:
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t132_hello_world_single_tenant/bootstrap.md`

Witness behavior:

- generate `build_tenants/hello_world_javascript/src/hello.js`;
- generate `build_tenants/hello_world_javascript/test/hello.test.js`;
- run `node --test test/hello.test.js`;
- prove exact `Hello, world!` behavior.

## Generic Lifecycle Capability

Artifact plus test evidence.

Any governed lifecycle may need to distinguish a subject artifact from a proof
artifact while folding both through one admitted requirement environment.

## Trace

1. GTL declares product artifact and proof artifact refs.
2. ABG admits requirement pressure for executable behavior and test proof.
3. ABG admits materialized source and test assets.
4. ABG invokes the test command as an actor/operator edge.
5. ABG binds test execution evidence to the active requirement projection.
6. odd_glc interprets the product artifact and proof artifact as lifecycle
   evidence views.

## Closure Expectation

The scenario closes only when ABG replay/query truth shows both artifact roles
and the test execution evidence bound to the active requirement projection.

odd_glc shall not maintain a tenant materialization ledger, test ledger,
stdout parser, or local execution runner.

