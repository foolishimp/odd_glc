# odd_glc TypeScript Tenant

**Status**: Active route-1 tenant

This tenant implements the first `odd_glc` realization line:
read/query and policy interpretation over ABIogenesis `4.1.0-rc.12` public
GTL/ABG surfaces.

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
