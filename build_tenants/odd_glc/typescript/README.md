# odd_glc TypeScript Tenant

**Status**: Active route-1 tenant

This tenant implements the first `odd_glc` realization line:
read/query and policy interpretation over ABIogenesis `4.1.0-rc.15` public
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

Current proof coverage includes public-facade validation, replay-fact
interpretation, requirement-route runtime-event interpretation, all route-1
disposition labels, conservative disposition priority, fail-closed unknown
disposition refs, data-only F_P/F_H policy overlays, and forbidden
runtime-authority export checks.

This remains a Phase 4 proof. It proves odd_glc route-1 interpretation against
the installed ABIogenesis public facade and route-shaped replay/runtime-event
inputs. Phase 5 requires a serialized real-run ABG lifecycle replay from T-165
or a successor proof artifact.
