# odd_glc Tenant Registry

**Status**: Active - route-1 TypeScript tenant

The first active build tenant is:

| Tenant | Status | Scope |
| --- | --- | --- |
| `build_tenants/odd_glc/typescript/` | active | Route-1 read/query and policy interpretation over ABIogenesis `4.1.0-rc.16` public GTL/ABG surfaces. |

The tenant was activated after requirements and ratified design defined:

- lifecycle typed assets;
- lifecycle binding contract over GTL/ABG system-function carriers;
- GTL/ABG consumption boundary;
- proof/query surface;
- test or scenario closure target.

## Realization Line

The active tenant is a TypeScript-compatible read/query and policy
interpretation library over ABIogenesis `4.1.0-rc.16`.

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
