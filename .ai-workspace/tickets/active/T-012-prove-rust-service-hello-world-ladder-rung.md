---
id: T-012
title: Prove Rust service Hello World ladder rung over ABI rc17
status: completed
owner: codex
created_at: 2026-06-29
updated_at: 2026-06-29
closed_at: 2026-06-29
priority: high
ticket_type: implementation
change_class: realization_refactor
re_entry_point: realization_refactor
governance_scope: STDO Method, ODD Method, Hello World ladder, ABI rc17 replay consumption
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-LADDER.md
  - specification/scenarios/SCN-GLC-HELLO-WORLD-RUST-SERVICE.md
  - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-172-prove-generic-process-request-execution-capability.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.17/release-snapshot-manifest.json
target_truth: >-
  odd_glc proves the Rust service/client Hello World ladder rung by consuming
  the digest-pinned ABI rc17 T-172 service process/request replay artifact as
  read-only ABG truth. odd_glc interprets generic lifecycle, evidence, and
  assurance views over admitted refs without starting services, issuing
  requests, supervising processes, admitting evidence, binding evidence, folding
  requirements, projecting residuals, resolving disposition authority, or
  owning protocol/service-readiness policy.
superseded_truth: >-
  A service/client rung requires odd_glc to introduce a local service
  supervisor, HTTP probe, port ledger, cleanup controller, request admission
  path, or product-local evidence ledger.
acceptance_criteria:
  - [x] The ABI rc17 T-172 live replay artifact and manifest are copied into
        odd_glc as a committed digest-pinned fixture of record.
  - [x] substrate.provenance.json records the T-172 source ticket, run id,
        fixture paths, artifact digest, route event count, and replay event
        count.
  - [x] The TypeScript route-one proof verifies the fixture manifest digest
        before interpreting the artifact.
  - [x] The proof asserts ABG route truth for the generic process/request
        capability: admitted requirement, admitted projections, admitted
        evidence bindings, fold, and disposition.
  - [x] The proof distinguishes generic evidence roles for service artifact,
        process/request manifest, process/request execution, and response
        interpretation without turning service/HTTP details into odd_glc
        policy.
  - [x] The proof asserts odd_glc lifecycle/evidence/assurance interpretations
        preserve ABG refs and remain read-only.
  - [x] No odd_glc code path starts services, supervises processes, issues
        client requests, admits payloads, mints refs, binds evidence, folds
        requirements, projects residuals, or routes continuation locally.
  - [x] specification/GOALS.md and the Hello World ladder scenario record the
        service/client rung state and next rung honestly.
non_closure_conditions:
  - The proof uses a hand-built event array instead of the committed ABI T-172
    replay artifact.
  - The proof accepts an artifact whose digest does not match the ABI manifest
    and odd_glc provenance.
  - odd_glc starts, supervises, probes, or cleans up a service locally.
  - odd_glc issues a client request or treats response content as local
    authority.
  - odd_glc defines service readiness, HTTP semantics, response acceptability,
    cleanup policy, Rust language policy, or toolchain acceptability as generic
    lifecycle law.
  - odd_glc admits evidence, mints admitted refs, binds evidence, folds
    requirements, residualizes, or resolves lifecycle disposition locally.
  - The proof treats route bindings alone as execution proof without admitted
    ABG runtime evidence.
required_work:
  - Copy the ABI T-172 replay artifact and manifest into the odd_glc fixture
    tree.
  - Register the T-172 fixture in substrate provenance.
  - Add a route-one interpretation test over the T-172 fixture.
  - Update the Hello World ladder and goals surfaces.
  - Run the focused odd_glc TypeScript proof and boundary checks.
---

# T-012: Rust Service Hello World Ladder Rung

## Boundary

This ticket is an odd_glc consumption proof, not ABI feature work.

ABI rc17/T-172 already owns the generic process/request execution proof:
declared service capability, process-start evidence, client-request evidence,
response/cleanup evidence, runtime evidence admission, requirement evidence
binding, fold, residual/disposition, and replay query truth. The Rust service
and HTTP request are proof bindings for that generic ABI capability, not
generic lifecycle law owned by odd_glc.

odd_glc's work is to verify and interpret the ABI replay truth as lifecycle
state.

## Closure Evidence

Closed 2026-06-29.

- Committed ABI T-172 fixture:
  `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t172-service-process-request/20260629T140453156Z_pid14978/service-process-request-replay-artifact.json`.
- Artifact digest:
  `sha256:0f817cd642667bf042fcb408884fbac5130eb83650ec4a5da9a166b105369c87`.
- Route event count: 26.
- Replay event count: 97.
- Added route-one proof:
  `proves SCN-GLC-HELLO-WORLD-RUST-SERVICE over the committed ABI T-172 replay artifact`.
- Proof command:
  `npm --prefix build_tenants/odd_glc/typescript test`.
- Proof result: 21/21 passing.
- Whitespace gate:
  `git diff --check`.
- Boundary note: the proof reads ABI replay truth and checks admitted generic
  evidence roles. It does not start or supervise a service, issue client
  requests, define service/readiness/HTTP/cleanup policy, admit evidence, mint
  refs, bind evidence, fold requirements, residualize, or route continuation
  locally.
