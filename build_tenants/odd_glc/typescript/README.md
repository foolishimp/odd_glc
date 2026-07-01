# odd_glc TypeScript Tenant

**Status**: Active route-1 tenant

This tenant implements the first `odd_glc` realization line:
read/query and policy interpretation over ABIogenesis `4.2.0-rc.1` public
GTL/ABG surfaces.

The consumed substrate identity is declared in
[substrate.provenance.json](substrate.provenance.json). That provenance is
part of the tenant source and records the ABIogenesis release tag, snapshot
commit, package version, and tarball digest validated by the tests.

It does not implement graph functions, runtime execution, event replay,
admission, evidence binding, assurance fold, residual projection,
continuation, or re-entry authority.

It exports a frozen `ODD_GLC_LIFECYCLE_SLOT_MAP` as a data-only library
interface for lifecycle surface, policy overlay, read-model, proof-binding, and
specialization-seam discovery. That slot map is not a GTL overlay graph,
graph-function catalog, and does not grant runtime authority.

It also exports `ODD_GLC_SOFTWARE_BUILD_OVERLAY` as a reusable GTL overlay
graph declaration for ABG startup consumption. The overlay declaration is data;
ABG owns registry admission, lookup, selection, graph-call opening, traversal,
event emission, and proof truth.

Graph-function refs exported by this tenant are startup bindings under ABG
catalog reuse audit. They are not a product-local graph-function catalog.
When an equivalent GTL/ABG system-library function exists, the binding must
reuse that catalog entry rather than ratify a duplicate `odd_glc` function.

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

The tenant is read/query only. It consumes committed ABI proof artifacts and
the installed ABIogenesis public facade; live LLM-backed proofs run only when
the live test flag is set.
