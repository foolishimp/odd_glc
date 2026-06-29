# SCN-GLC-HELLO-WORLD-RUST-SERVICE - Rust Client/Server Hello World

**Status**: Active
**Date**: 2026-06-29
**Derives from**: [SCN-GLC-HELLO-WORLD-LADDER](SCN-GLC-HELLO-WORLD-LADDER.md),
[T-008](../../.ai-workspace/tickets/completed/T-008-govern-hello-world-scenario-ladder.md)

---

## Purpose

Prove lifecycle interpretation for a long-running process and client
observation.

The scenario exercises service start, environment-bound port selection, local
HTTP client proof, response evidence, and residual/block interpretation for
service startup or probe failure.

## odd_sdlc Witness

- T-164 Rust hello service lite bootstrap:
  `/Users/jim/src/apps/odd_sdlc/build_tenants/typescript/test_env/fixtures/t164_rust_hello_service_lite/bootstrap.md`

Witness behavior:

- generate a Rust binary crate under
  `build_tenants/hello_world_rust_service`;
- read `HELLO_SERVICE_PORT`;
- bind to `127.0.0.1`;
- serve `GET /`;
- return exactly `helloworld`;
- prove the service by starting it and making a local HTTP request.

## Generic Lifecycle Capability

Client/server process proof.

Any governed lifecycle may need to prove a capability that is not a single
short command: start a process, observe readiness, execute a client request,
and bind the observation to requirement pressure.

## Trace

1. GTL declares service artifact, process capability, environment binding, and
   client request proof refs.
2. ABG admits requirement pressure for service start and response behavior.
3. ABG admits generated service assets.
4. ABG starts the service through actor/operator invocation.
5. ABG performs or admits the client request proof.
6. ABG binds response evidence to the active requirement projection.
7. odd_glc interprets ready, residual, re-entry, or block disposition from ABG
   truth.

## Closure Expectation

The scenario closes only when ABG replay/query truth shows service start,
client request, response body evidence, and requirement fold/disposition.

odd_glc shall not own service supervision, port allocation, HTTP probing,
process cleanup, or evidence admission.

