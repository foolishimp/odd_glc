# ABG 4.1.0-rc.12 Install Reference For odd_glc

**Status**: Commentary / installed-dev-product reference
**Date**: 2026-06-28
**Change class**: design_reframe
**Target workspace**: `/Users/jim/src/apps/odd_glc`

This post records the local ABIogenesis TypeScript install selected for
`odd_glc` downstream design and proof work. It is a reference to an installed
development product, not `odd_glc` product law and not an `odd_glc` runtime
claim.

## Installed Product

- ABIogenesis source release commit: `c39cd262c8feb8d048a271d91a36c30a3895a5d5`
- ABIogenesis snapshot commit: `b4d4d9803ded88aff125c6ef8881e97989959fdf`
- ABIogenesis tag: `v4.1.0-rc.12`
- Release snapshot:
  `/Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.1.0-rc.12`
- Snapshot tarball SHA256:
  `8212f394366337c373556f445068dd2728c2f9761e3f64d801b04124d40e7de5`

## Install Location

- Toolchain root:
  `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant`
- Product root:
  `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12`
- Package root:
  `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/lib/node_modules/@abiogenesis/typescript-tenant`
- Command paths:
  - `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/bin/abiogenesis-ts`
  - `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/bin/genesis-ts`

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
`4.1.0-rc.12`.

## Install Command

```bash
cd /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript
node build/semantic/code/src/bin/abiogenesis.js install \
  --target /Users/jim/src/apps/odd_glc \
  --package-source /Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript \
  --installed-package-name odd-glc-abg-rc12 \
  --toolchain-root /Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant
```

## Verification

```bash
/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/bin/genesis-ts \
  start \
  --workspace /Users/jim/src/apps/odd_glc \
  --scope workspace \
  --target graph_function:installed_cli_runtime_binding_self_test \
  --until converged
```

Result: `status=converged`.

The verification wrote 14 runtime events to
`/Users/jim/src/apps/odd_glc/.ai-workspace/events/events.jsonl`, ending in
`terminal_reached` with `terminalKind=converged`.

## Design Consequence

Future `odd_glc` graph design should reference this install when it needs a
repeatable local GTL/ABG dev-product substrate. The install does not by itself
close `odd_glc` lifecycle design. It only removes the prior `unpinned` local
substrate condition for ABIogenesis `4.1.0-rc.12`; every lifecycle binding still
needs an explicit readiness classification and proof against the consumed
GTL/ABG public surfaces.
