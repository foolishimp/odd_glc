# odd_glc Tenant Registry

**Status**: Active - ABI5 generic live-LLM MVP tenant

The first active build tenant is:

| Tenant | Status | Scope |
| --- | --- | --- |
| `build_tenants/odd_glc/typescript/product/` | active | Zero-code generic lifecycle declarations and Product-owned interpretation over the current ABIogenesis 5 source candidate; `build_tenants/odd_glc/typescript/` version `0.1.0` remains immutable predecessor evidence for ABI `4.6.0-rc.3`. |

The tenant was activated after requirements and ratified design defined:

- lifecycle typed assets;
- lifecycle binding contract over GTL/ABG system-function carriers;
- GTL/ABG consumption boundary;
- proof/query surface;
- test or scenario closure target.

## Realization Line

The active tenant is the zero-code Product rooted at
`build_tenants/odd_glc/typescript/product/`. It publishes declarations and
Product-owned interpretation while the current MVP composes an exact packed
ABIogenesis 5 source candidate through its public GTL/ABG package surface.
Every execution run binds the exact packed artifact digest; the version label
alone is not candidate identity. The accepted ABI 4.6 and odd_glc 0.1 cuts
remain historical conservation evidence, not the current runtime selection.

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
- an odd_glc-owned F_P worker invocation path.

The selected HOW is
[ODD_GLC_ABI5_LIVE_LLM_MVP.md](common/design/ODD_GLC_ABI5_LIVE_LLM_MVP.md).
ABI owns F_P transport, worksite effects, admission, Event Calculus, replay,
retry, and fan-in. The tenant may publish only workflow/scenario declarations
and Product-owned interpretation.
