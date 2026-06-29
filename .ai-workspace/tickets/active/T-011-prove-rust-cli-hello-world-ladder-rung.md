---
id: T-011
title: Prove Rust CLI Hello World ladder rung over ABI rc17
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
  - specification/scenarios/SCN-GLC-HELLO-WORLD-RUST-CLI.md
  - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-171-prove-generic-non-default-command-execution-capability.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.17/release-snapshot-manifest.json
target_truth: >-
  odd_glc proves the Rust CLI Hello World ladder rung by consuming the
  digest-pinned ABI rc17 T-171 non-default command execution replay artifact as
  read-only ABG truth. odd_glc interprets generic lifecycle, evidence, and
  assurance views over admitted refs without executing Rust, invoking rustc,
  admitting evidence, binding evidence, folding requirements, projecting
  residuals, resolving disposition authority, or owning toolchain policy.
superseded_truth: >-
  A Rust CLI rung requires odd_glc to introduce a local command runner,
  toolchain adapter, shell proof, Rust policy, or product-local evidence ledger.
acceptance_criteria:
  - [x] The ABI rc17 T-171 live replay artifact and manifest are copied into
        odd_glc as a committed digest-pinned fixture of record.
  - [x] substrate.provenance.json records the T-171 source ticket, run id,
        fixture paths, artifact digest, route event count, and replay event
        count.
  - [x] The TypeScript route-one proof verifies the fixture manifest digest
        before interpreting the artifact.
  - [x] The proof asserts ABG route truth for the generic non-default command
        capability: admitted requirement, admitted projections, admitted
        evidence bindings, fold, and disposition.
  - [x] The proof distinguishes generic evidence roles for artifact,
        command/test source, command/test execution, and semantic
        interpretation without turning Rust/rustc into odd_glc policy.
  - [x] The proof asserts odd_glc lifecycle/evidence/assurance interpretations
        preserve ABG refs and remain read-only.
  - [x] No odd_glc code path executes commands, invokes rustc, admits payloads,
        mints refs, binds evidence, folds requirements, projects residuals, or
        routes continuation locally.
  - [x] specification/GOALS.md and the Hello World ladder scenario record the
        Rust CLI rung state and next rung honestly.
non_closure_conditions:
  - The proof uses a hand-built event array instead of the committed ABI T-171
    replay artifact.
  - The proof accepts an artifact whose digest does not match the ABI manifest
    and odd_glc provenance.
  - odd_glc shells out, invokes rustc/cargo, probes cwd/env, or treats command
    exit status as local authority.
  - odd_glc defines Rust language policy, toolchain acceptability, or compiler
    semantics as generic lifecycle law.
  - odd_glc admits evidence, mints admitted refs, binds evidence, folds
    requirements, residualizes, or resolves lifecycle disposition locally.
  - The proof treats route bindings alone as execution proof without admitted
    ABG runtime evidence.
required_work:
  - Copy the ABI T-171 replay artifact and manifest into the odd_glc fixture
    tree.
  - Register the T-171 fixture in substrate provenance.
  - Add a route-one interpretation test over the T-171 fixture.
  - Update the Hello World ladder and goals surfaces.
  - Run the focused odd_glc TypeScript proof and boundary checks.
---

# T-011: Rust CLI Hello World Ladder Rung

## Boundary

This ticket is an odd_glc consumption proof, not ABI feature work.

ABI rc17/T-171 already owns the generic non-default command execution proof:
declared command capability, cwd/env evidence, runtime evidence admission,
requirement evidence binding, fold, residual/disposition, and replay query
truth. The Rust CLI program and rustc command are proof bindings for that
generic ABI capability, not generic lifecycle law owned by odd_glc.

odd_glc's work is to verify and interpret the ABI replay truth as lifecycle
state.

## Closure Evidence

Closed 2026-06-29.

- Committed ABI T-171 fixture:
  `build_tenants/odd_glc/typescript/test/fixtures/abiogenesis-t171-non-js-toolchain-execution/20260629T134455708Z_pid97032/non-js-toolchain-replay-artifact.json`.
- Artifact digest:
  `sha256:30ffdeda4968bcf49ffacad785ac70ab78474420b07ab4ca5b2779f3d9315235`.
- Route event count: 20.
- Replay event count: 82.
- Added route-one proof:
  `proves SCN-GLC-HELLO-WORLD-RUST-CLI over the committed ABI T-171 replay artifact`.
- Proof command:
  `npm --prefix build_tenants/odd_glc/typescript test`.
- Proof result: 20/20 passing.
- Whitespace gate:
  `git diff --check`.
- Boundary note: the proof reads ABI replay truth and checks admitted generic
  evidence roles. It does not execute Rust, invoke rustc/cargo, define Rust
  policy, admit evidence, mint refs, bind evidence, fold requirements,
  residualize, or route continuation locally.
