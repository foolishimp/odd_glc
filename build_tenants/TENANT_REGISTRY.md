# odd_glc Tenant Registry

**Status**: Inactive - first tenant criteria recorded

No active build tenant exists yet.

The first tenant must not be activated until requirements and ratified design
define:

- lifecycle typed assets;
- lifecycle binding contract over GTL/ABG system-function carriers;
- GTL/ABG consumption boundary;
- proof/query surface;
- test or scenario closure target.

## Candidate Realization Line

The first candidate tenant is a TypeScript read/query and policy
interpretation library over ABIogenesis `4.1.0-rc.12`.

The candidate is not active yet. Activation requires a follow-on tenant
decision that descends from
[ADR-001 route-1 GTL/ABG lifecycle consumption](common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md)
and names:

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
