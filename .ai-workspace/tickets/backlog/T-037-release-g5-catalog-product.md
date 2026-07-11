---
id: T-037
title: Release the qualified G5 catalog product
type: chore
ticket_category: ordinary
status: backlog
goal: odd-glc-declarations-only-g5
change_intent: >-
  Tap the G5 source accepted through T-038, ABIogenesis T-235, and the published
  T-039 RC window as odd_glc 0.2.0, then publish and verify one immutable release.
change_class: realization_refactor
re_entry_point: release_snapshots
owner: odd_glc
priority: critical
triaged_at: 2026-07-11
created_at: 2026-07-11
updated_at: 2026-07-11
source_ticket: T-039
build_tenant: typescript
dependencies:
  - completed odd_glc T-039 published-RC qualification
  - completed abiogenesis T-236 exact ABG 5.0 release
authority_refs:
  - specification/PRODUCT.md
  - /Users/jim/src/apps/abiogenesis/specification/PRODUCT.md
  - /Users/jim/src/apps/specification_methodology/specification/standards/RELEASE_METHOD.md
target_version: 0.2.0
target_package: '@odd-glc/route-one-typescript@0.2.0'
---

# T-037: Release The Qualified G5 Catalog Product

## Target Truth

The `release/0.2.0` branch, annotated `v0.2.0` tag, package, catalog-product descriptor,
contribution manifest, tarball, release snapshot, checksums, notes, and
installed identity name one tapped product cut descended coherently from the
qualified T-039 RC. G5 declares compatibility with the exact released ABG 5.0
product and remains an independent catalog product. Version and release-scoped
asset changes between RC and tap are explicit; product behavior may not change.

## Ordered Release Work

1. Verify T-038, ABIogenesis T-235/T-236, and T-039 closure evidence and the
   published RC lineage.
2. Tap `0.2.0`; update only version and release-scoped assets, then reconcile
   the final delta against the qualified RC. Any behavioral or declaration
   change reopens the RC window rather than entering the tap.
3. Pack and inspect final `0.2.0`; fresh-install only that artifact beside
   released ABG 5.0 and rerun deterministic gates plus the bounded catalog,
   Hello World, and data-mapper release smoke affected by the final delta.
4. Finalize release-scoped snapshot, checksums, notes,
   install/compatibility evidence, closed
   file census, branch, and tag inputs before the canonical release commit.
5. Commit the final release assets and create annotated tag `v0.2.0` on the
   canonical release commit.
6. Push `release/0.2.0` and `v0.2.0`, then perform remote object, artifact,
   checksum, and installed-identity verification only; do not mutate release assets.

## Closure Law

Close when remote branch/tag/product identities match the tapped `0.2.0` cut,
its lineage and allowed delta from the qualified T-039 RC are reconciled, the
product fresh-installs beside exact released ABG 5.0 without source fallback,
and every public odd_glc release claim is backed by the immutable record.

## Non-Closure Conditions

- Product behavior or declarations differ from the qualified T-039 RC.
- G5 bundles ABG runtime or claims compiler/self-host authority.
- A red gate is bypassed, or an unqualified behavioral change enters at tap.
- Mutable source, a local compatibility shim, or an unverified local tag enters the proof.

## Proof Surface

- deterministic odd_glc gates
- package dry-run and closed file census
- exact checksum and descriptor/contribution validation
- fresh installed released-ABG compatibility smoke
- annotated tag and remote branch object verification
- phase-end release/code review against PRODUCT, T-038/T-039, ABIogenesis T-235/T-236, and RELEASE_METHOD
