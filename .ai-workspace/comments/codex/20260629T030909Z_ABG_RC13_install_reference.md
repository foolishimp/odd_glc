# ABG 4.1.0-rc.13 Install Reference For odd_glc

**Status**: Commentary / installed-dev-product reference
**Date**: 2026-06-29
**Change class**: design_reframe
**Target workspace**: `/Users/jim/src/apps/odd_glc`

This post records the local ABIogenesis TypeScript install selected for
`odd_glc` after the upstream GOAL-014 ABI/GTL completion wave. It is a
reference to an installed development product, not `odd_glc` product law and
not an `odd_glc` runtime claim.

## Installed Product

- ABIogenesis source release commit:
  `cc34cf53ceee8d22fba723f47946523eb4d405f8`
- ABIogenesis snapshot commit:
  `d7e044f`
- ABIogenesis release identity: `4.1.0-rc.13`
- Candidate tag: `v4.1.0-rc.13`
- Release snapshot:
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.13`
- Snapshot tarball SHA256:
  `3794567f58ee690e78f4538379198e4c0957f7e69e4f2b95a91885462f2a697a`
- Product-toolchain manifest digest:
  `9576baeafc1000bd4eb29daec4eedf6193f3f53e045839417b036f7ec4d79b13`

## Install Location

- Toolchain root:
  `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant`
- Product root:
  `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.13`
- Package root:
  `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.13/lib/node_modules/@abiogenesis/typescript-tenant`
- Command paths:
  - `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.13/bin/abiogenesis-ts`
  - `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.13/bin/genesis-ts`

## odd_glc Binding

- Workspace binding:
  `/Users/jim/src/apps/odd_glc/.abiogenesis/toolchain-binding.json`
- Installer manifest:
  `/Users/jim/src/apps/odd_glc/.abiogenesis/typescript-installer-manifest.json`
- Install manifest:
  `/Users/jim/src/apps/odd_glc/.abiogenesis/install-manifest.json`
- Runtime binding:
  `/Users/jim/src/apps/odd_glc/.abiogenesis/cli-runtime.mjs`
- Mutable event log:
  `/Users/jim/src/apps/odd_glc/.ai-workspace/events/events.jsonl`

The binding is schema version `2`, selects the toolchain by explicit root, and
binds product `abiogenesis` package `@abiogenesis/typescript-tenant`
`4.1.0-rc.13`.

## Install Command

```bash
cd /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
node build/semantic/code/src/bin/abiogenesis.js install \
  --target /Users/jim/src/apps/odd_glc \
  --package-source /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript \
  --installed-package-name odd-glc-abg-rc12 \
  --toolchain-root /Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant
```

The local installed package name remains `odd-glc-abg-rc12` because the
installer refresh law requires the existing target package name to remain
stable. The bound ABIogenesis product version is `4.1.0-rc.13`.

## Verification

```bash
/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.13/bin/genesis-ts \
  start \
  --workspace /Users/jim/src/apps/odd_glc \
  --scope workspace \
  --target graph_function:installed_cli_runtime_binding_self_test \
  --until converged
```

Result: `status=converged`.

The verification wrote runtime events to
`/Users/jim/src/apps/odd_glc/.ai-workspace/events/events.jsonl`, ending in
`terminal_reached` with `terminalKind=converged`.

## Design Consequence

Future `odd_glc` graph design and implementation should reference this install
when it needs a repeatable local GTL/ABG dev-product substrate. RC13 supersedes
the RC12 route-only substrate for work that needs non-closed lifecycle replay,
multi-requirement graph/refinement, recursive span identity, or recursive
executive observation. The install does not by itself close `odd_glc`
lifecycle design; every lifecycle binding still needs an explicit odd_glc
read/query interpretation and proof against the consumed GTL/ABG public
surfaces.
