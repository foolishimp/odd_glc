---
id: T-036
title: Cut odd_glc 0.1.0 against ABIogenesis 4.6.0-rc.3
type: release
ticket_category: release_qualification
status: completed
execution_state: released
completed_at: 2026-07-11
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
  - completed T-029 installed odd_glc sandbox proof
  - completed T-035 basic CLI execution-contract repair
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

Release qualification and publication are complete.

- Source candidate: `70580b93166b1f9e33b7622512c2d5bd442469e2`.
- Deterministic suite: 94 tests, 86 passed, 0 failed, 8 live-gated.
- Exact package census: `README.md`, `package.json`, `src/index.d.ts`,
  `src/index.mjs`, `src/substrate_provenance.mjs`, and
  `substrate.provenance.json`.
- Tarball: `odd-glc-route-one-typescript-0.1.0.tgz`, 24,972 bytes, SHA-256
  `7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578`.
- Packed install/import verified package `0.1.0` and exact ABG rc.3 peer and
  provenance identities.
- Live installed-product run `20260711T042644380Z_pid39224` used that exact
  tarball, closed all eight vectors, passed two worker-executed Node tests, and
  converged after 602 events.
- Preserved proof SHA-256:
  `9a8bbce08257db6a5b808e629ca7dce5a6f62a293d3f29309e169930228ddfe8`.
- Release commit: `a878475e4609e2d74d3260eb36ee05c4657b1879`.
- Release branch: `release/0.1.0`.
- Annotated release tag: `v0.1.0`.
- The local branch, peeled local tag, remote branch, and peeled remote tag all
  resolve the release commit.
- Release manifest SHA-256:
  `d8bbbd172cd011f68ae569f6c64bafb0e44eea002be2d55181270ae8de634eb1`.
- Checksum-file SHA-256:
  `fcc5a1d1f54d320acbb3103da7d506eb6e82d619b2a749f8bdc6331685a769cb`.
