---
id: T-036
title: Cut odd_glc 0.1.0 against ABIogenesis 4.6.0-rc.3
type: release
ticket_category: release_qualification
status: active
goal: publish-first-odd-glc-product
change_class: realization_refactor
re_entry_point: release_candidate
owner: odd_glc
priority: critical
created_at: 2026-07-11
governance_scope: STDO Method, RELEASE_METHOD
release_scope: '@odd-glc/route-one-typescript 0.1.0'
implementation_authorization: >-
  Version, package, qualify, snapshot, record, tag, branch, and publish the
  existing declaration/read-model product. T-033 architecture and ABG 5 work
  are excluded.
dependencies:
  - ABIogenesis 4.6.0-rc.3 immutable release candidate
  - T-029 installed odd_glc sandbox proof
  - T-035 basic CLI execution-contract repair
---

# T-036: Cut odd_glc 0.1.0

## Release Claim

`odd_glc 0.1.0` is the first immutable pre-1 release of the TypeScript
lifecycle declaration and read-model package. It is exact-compatible with
ABIogenesis `4.6.0-rc.3` as identified by the release manifest.

The package publishes lifecycle vocabulary and node declarations,
lifecycle/software-build overlays and startup bindings, policy data,
substrate provenance, and read-only lifecycle interpretation. ABIogenesis
remains the runtime.

## Exclusions

- no API-stability promise;
- no standalone odd_glc runtime or CLI;
- no general ABIogenesis compatibility range;
- no T-033 declarations-only campaign closure;
- no claim that the full data-mapper campaign was rerun on rc.3.

The completed rc.2 data-mapper campaign is predecessor evidence only.

## Required Work

1. Set package and public declaration identities to `0.1.0`.
2. Publish exact rc.3 compatibility metadata and a closed package file list.
3. Pass the full deterministic suite.
4. Pack, inspect, install, and import the exact tarball in a clean workspace.
5. Run one fresh installed-product basic CLI Hello World live sandbox using
   that tarball and the exact rc.3 product.
6. Freeze the note, manifest, tarball, and checksums.
7. Commit the release assets and point `release/0.1.0` and `v0.1.0` at the
   same release commit.

## Closure Law

Close only when package metadata, public declaration identities, source
commit, tarball, manifest, checksums, release note, installed-product proof,
release branch, and release tag identify one accepted cut.

## Non-Closure Conditions

- The tarball includes tests, test runs, or mutable workspaces.
- The live proof copies odd_glc from the mutable source tree.
- Historical rc.2 evidence is relabeled as rc.3 proof.
- T-033 is called complete or included in the 0.1 claim.
- Branch, tag, package, manifest, or tarball identities disagree.

## Closure Evidence

Pending.
