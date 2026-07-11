---
id: T-037
title: Release the qualified G5 catalog product
type: chore
ticket_category: ordinary
status: backlog
goal: odd-glc-declarations-only-g5
change_intent: >-
  Tap the exact G5 bytes qualified by T-033 and ABIogenesis T-235 against the
  released ABG 5.0 product, then publish and verify one immutable odd_glc release.
change_class: realization_refactor
re_entry_point: release_snapshots
owner: odd_glc
priority: critical
triaged_at: 2026-07-11
created_at: 2026-07-11
updated_at: 2026-07-11
source_ticket: T-033
build_tenant: typescript
dependencies:
  - completed odd_glc T-033 with frozen exact G5 candidate bytes
  - completed abiogenesis T-235 exact-candidate qualification
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
installed identity all name the exact bytes already qualified by T-033 and
ABIogenesis T-235. G5 declares compatibility with the exact released ABG 5.0
product and remains an independent catalog product.

## Ordered Release Work

1. Verify T-033, ABIogenesis T-235, and ABIogenesis T-236 closure evidence.
2. Confirm the frozen G5 candidate is already
   `@odd-glc/route-one-typescript@0.2.0` and its package, descriptor,
   contribution manifest, dependency, content, and qualification digests have
   not changed. Refuse release rather than assigning or rewriting product bytes.
3. Pack and inspect exact `0.2.0`; fresh-install only that artifact beside
   released ABG 5.0 and rerun the bounded catalog/data-mapper release smoke.
4. Finalize release-scoped snapshot, checksums, notes,
   install/compatibility evidence, closed
   file census, branch, and tag inputs before the canonical release commit.
5. Commit the final release assets and create annotated tag `v0.2.0` on the
   canonical release commit.
6. Push `release/0.2.0` and `v0.2.0`, then perform remote object, artifact,
   checksum, and installed-identity verification only; do not mutate release assets.

## Closure Law

Close when remote branch/tag/product identities match the exact qualified G5
bytes, the product fresh-installs beside exact released ABG 5.0 without source
fallback, and every public odd_glc release claim is backed by the immutable record.

## Non-Closure Conditions

- G5 bytes differ from the T-033/T-235 candidate.
- G5 bundles ABG runtime or claims compiler/self-host authority.
- A red gate is bypassed or rerun against modified candidate bytes.
- Mutable source, a local compatibility shim, or an unverified local tag enters the proof.

## Proof Surface

- deterministic odd_glc gates
- package dry-run and closed file census
- exact checksum and descriptor/contribution validation
- fresh installed released-ABG compatibility smoke
- annotated tag and remote branch object verification
- phase-end release/code review against PRODUCT, T-033, ABIogenesis T-235/T-236, and RELEASE_METHOD
