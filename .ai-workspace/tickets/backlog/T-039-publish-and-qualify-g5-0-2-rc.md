---
id: T-039
title: Publish and qualify the G5 0.2 release candidate
type: chore
ticket_category: ordinary
status: backlog
goal: odd-glc-declarations-only-g5
change_intent: >-
  Open the G5 0.2 RC window, assign and publish one immutable RC identity from
  the qualified T-038 source candidate, and prove it against released ABG 5.0.
change_class: realization_refactor
re_entry_point: release_snapshots
owner: odd_glc
priority: critical
triaged_at: 2026-07-11
created_at: 2026-07-11
updated_at: 2026-07-11
source_ticket: T-038
build_tenant: typescript
dependencies:
  - completed odd_glc T-038 source-candidate migration and campaign proof
  - completed abiogenesis T-235 source-candidate qualification
  - completed abiogenesis T-236 exact ABG 5.0 release
authority_refs:
  - specification/PRODUCT.md
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/RELEASE_METHOD.md
final_release_successor: .ai-workspace/tickets/backlog/T-037-release-g5-catalog-product.md
initial_rc_version: 0.2.0-rc.1
initial_rc_package: '@odd-glc/route-one-typescript@0.2.0-rc.1'
accepted_rc_identity: recorded by closure evidence after the final accepted RC cut
---

# T-039: Publish And Qualify The G5 0.2 Release Candidate

## Target Truth

The mutable `rc/0.2.0` window has at least one immutable published RC cut
descended from the exact T-038 source candidate. The accepted cut's branch
point, annotated RC tag, package,
descriptor, contribution manifest, released-ABG compatibility declaration,
tarball, snapshot, checksums, notes, and installed identity are coherent. The
published RC fresh-installs beside released ABG 5.0 and passes the selected
release qualification without mutable-source fallback.

## Ordered RC Work

1. Verify T-038, ABIogenesis T-235, and ABIogenesis T-236 closure evidence.
2. Open `rc/0.2.0`, assign the next lawful RC version, and reconcile the exact
   version/release-asset delta from the digest-bound T-038 source candidate.
3. Run deterministic, package-census, descriptor/contribution, declarations-only,
   ODD 11.5B, install, catalog, Hello World, and full data-mapper qualification.
4. Materialize the immutable RC snapshot, tarball, checksums, notes, evidence,
   dependency lock, and compatibility facts before the RC commit.
5. Commit, tag, push, and verify the RC branch/tag/artifact identities remotely.
6. Record operator review and either close green for T-037 tap or publish a new
   RC after any separately triaged bounded fix and complete rerun.
7. Perform the authority-first phase review against PRODUCT, T-038,
   ABIogenesis T-235/T-236, and RELEASE_METHOD.

## Closure Law

Close when at least one immutable G5 RC cut is published and remotely verified;
the latest accepted RC passes its complete selected qualification beside exact
released ABG 5.0; its lineage to T-038 is reconciled; operator review is
recorded; and no behavioral fix remains unqualified in the mutable RC window.

## Non-Closure Conditions

- A development/source-candidate identity is called a published RC.
- An RC tag or artifact is mutated in place after publication.
- A fix enters after RC publication without a new RC identity and affected-gate rerun.
- Mutable source, a compatibility shim, or a different ABG dependency enters proof.
- A clean skip substitutes for a claimed live qualification result.

## Proof Surface

- deterministic suite and declarations-only/ODD 11.5B census
- package dry-run, closed file census, descriptor/contribution validation
- fresh installed released-ABG catalog and Hello World proof
- fresh installed full data-mapper campaign and replay reconciliation
- RC snapshot, checksums, branch/tag, remote object, and installed identity verification
- phase-end release/code/evidence review
