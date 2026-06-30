# odd_glc TypeScript Tenant

**Status**: Active route-1 tenant

This tenant implements the first `odd_glc` realization line:
read/query and policy interpretation over ABIogenesis `4.1.0-rc.17` public
GTL/ABG surfaces.

The consumed substrate identity is declared in
[substrate.provenance.json](substrate.provenance.json). That provenance is
part of the tenant source and records the ABIogenesis release tag, snapshot
commit, package version, and tarball digest validated by the tests.

It does not implement graph functions, runtime execution, event replay,
admission, evidence binding, assurance fold, residual projection,
continuation, or re-entry authority.

## Commands

```sh
npm --prefix build_tenants/odd_glc/typescript test
```

The tests import the installed ABIogenesis public `abg.requirements` facade
from the local toolchain path by default. Set `ABG_TYPESCRIPT_TENANT_ROOT` to
override that package root.

Current proof coverage includes public-facade validation, digest-pinned real
ABI replay artifact consumption, requirement-route runtime-event
interpretation, all route-1 disposition labels, conservative disposition
priority, fail-closed unknown disposition refs, data-only F_P/F_H policy
overlays, forbidden runtime-authority export checks, non-closed lifecycle
interpretation, requirement-graph interpretation, recursive span/foldback
interpretation, executive pressure/reprice interpretation, release/readiness
interpretation, and the Hello World ladder through basic CLI, JavaScript
tenant/test, Rust CLI, Rust service/client, and parallel JavaScript witnesses.

The tenant is read/query only. It consumes committed ABI fixture-of-record
artifacts and the installed ABIogenesis public facade; it does not execute the
live proofs itself.
