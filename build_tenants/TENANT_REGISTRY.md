# odd_glc Tenant Registry

**Status**: Active - route-1 TypeScript tenant

The first active build tenant is:

| Tenant | Status | Scope |
| --- | --- | --- |
| `build_tenants/odd_glc/typescript/` | active | Route-1 read/query and policy interpretation over installed ABIogenesis `4.2.0-rc.1` public GTL/ABG surfaces. |

The tenant was activated after requirements and ratified design defined:

- lifecycle typed assets;
- lifecycle binding contract over GTL/ABG system-function carriers;
- GTL/ABG consumption boundary;
- proof/query surface;
- test or scenario closure target.

## Realization Line

The active tenant is a TypeScript-compatible read/query and policy
interpretation library over installed ABIogenesis `4.2.0-rc.1`.

Older committed fixture-of-record replay artifacts retain their original ABI
producer identity. The tenant's current package/runtime dependency is 4.2; a
fixture produced by rc17 remains rc17 proof input.

The tenant descends from
[ADR-001 route-1 GTL/ABG lifecycle consumption](common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md)
and must preserve:

- source package layout under `build_tenants/`;
- consumed ABIogenesis package identity and import path policy;
- public odd_glc interface families;
- negative regression tests for forbidden local runtime authority;
- route-1 proof command.

The tenant shall not contain:

- a native `glc.*` graph-function catalog;
- a local event stream or replay store;
- local admitted-ref minting;
- local evidence admission;
- local fold, residual, retry, continuation, or re-entry controllers;
- an F_P worker invocation path.
