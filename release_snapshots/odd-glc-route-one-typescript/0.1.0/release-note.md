# odd_glc 0.1.0

`odd_glc 0.1.0` is the first immutable pre-1 release of
`@odd-glc/route-one-typescript`. It is an early product release and does not
promise API stability.

## Published Product

The package publishes:

- lifecycle vocabulary and typed node declarations;
- lifecycle and software-build graph overlays and startup bindings;
- policy and exact substrate-provenance data; and
- read-only interpretation of ABG replay and lifecycle state.

ABIogenesis remains the runtime. odd_glc does not publish a standalone runtime
or CLI.

The repository snapshot contains a private npm-format tarball for direct
downstream installation. This release is not published to an npm registry.

## Exact Substrate

This release is pinned to `@abiogenesis/typescript-tenant@4.6.0-rc.3`:

- release tag: `v4.6.0-rc.3`;
- source commit: `5213301cdbfd35952badf19c27519caa9e7e6968`;
- snapshot commit: `f4f081f66ef8d3ce0c737ddb9d7530176711279a`;
- tarball SHA-256: `9cffb372c0dfc00983a5d0e882efbc3d0c3ac937a56f313000f35a4473358113`;
- product-toolchain manifest digest: `92b3f94dd32bca9368a9511d823cc8b6e2eae75cd7168c9e901d3cbe8eadf07d`; and
- release manifest SHA-256: `941d9a00198914120db7d7a1f466f4b3e2efe0fbd9659a71540267ca0f899bf4`.

No broader ABG compatibility range is claimed.

## Qualification

- Source candidate: `70580b93166b1f9e33b7622512c2d5bd442469e2`.
- Deterministic suite: 94 tests, 86 passed, 0 failed, 8 live-gated.
- Packed artifact: six files, 24,972 bytes, SHA-256
  `7e548f92ecd6b4442f9c9f1feb46dd2edd7e9610a7dae8706482fc65d80fa578`.
- Packed install/import: package identity `0.1.0` and exact rc.3 peer and
  provenance identities verified from a clean detached source candidate.
- Live installed-product gate: `SCN-GLC-HELLO-WORLD-CLI-BASIC`, run
  `20260711T042644380Z_pid39224`, using the same tarball digest and installed
  ABG rc.3 product.
- Live result: all eight graph vectors accepted, two worker-executed Node tests
  passed, exact `Hello, world!` behavior verified, and traversal stopped by
  `converged` after 602 events.
- Preserved live-proof SHA-256:
  `9a8bbce08257db6a5b808e629ca7dce5a6f62a293d3f29309e169930228ddfe8`.

The live worker selected `gpt-5.6-sol` through ABG's declared environmental
model binding because the desktop Codex configuration uses `ultra` reasoning.

## Exclusions

- T-033's declarations-only migration remains open.
- The completed rc.2 data-mapper campaign remains predecessor evidence only.
- The full data-mapper campaign was not rerun on rc.3.
- No standalone manager-callable build carrier is included.
- No npm-registry publication or stable public API is claimed.

The qualified operating boundary is a trusted single-developer desktop. The
release relies on GTL type/admission/compiler checks and defensive admission of
likely malformed F_P output; it does not claim hostile local-tamper resistance.
