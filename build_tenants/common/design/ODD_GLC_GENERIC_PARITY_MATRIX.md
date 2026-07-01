# odd_glc Generic Parity Matrix

**Status**: Active
**Scope**: Common design backlog
**Derives from**:
[GOALS.md](../../../specification/GOALS.md),
[PRODUCT.md](../../../specification/PRODUCT.md),
[REQ-GLC-DOWNSTREAM-SPECIALIZATION](../../../specification/requirements/REQ-GLC-DOWNSTREAM-SPECIALIZATION.md)

## Position

Parity means user-visible lifecycle capability coverage. It does not mean an
odd_sdlc port.

Each row starts with a generic lifecycle capability. `odd_sdlc` appears only as
workflow witness and deletion-target evidence.

The expanded feature inventory lives in
[ODD_GLC_ODD_SDLC_FEATURE_PARITY_TABLE](./ODD_GLC_ODD_SDLC_FEATURE_PARITY_TABLE.md).

## Matrix

| Generic lifecycle capability | odd_sdlc witness | Old mechanism to retire | GTL/ABG substrate | odd_glc interpretation | Downstream seam | Proof gate |
| --- | --- | --- | --- | --- | --- | --- |
| Lifecycle definition and startup | Project/session bootstrap | Product-local bootstrap shell | GTL node types, GTL library-entry bindings, ABG startup registry | Lifecycle worksite/context/intent/product labels | Product supplies declaration payloads | ABG emits startup admission and selection truth. |
| Bootstrap traversal | Sandbox start-to-work loop | Product-local starter, shell, or tenant loop that directly drives work | ABG startup config, registry lookup, graph-function selection, graph-call opening, traversal unit, runtime events | Bootstrap lifecycle trace view over selected entry, opened graph call, traversal vectors, emitted proof events, and final disposition | Product supplies GTL declarations, overlays, plugin refs, and sandbox proof inputs only | ABG consumes the product startup config, selects a callable graph function, opens a graph call, traverses the vectors, emits runtime/proof truth, and replay proves the selected traversal produced the scenario result. |
| Requirement pressure binding | Ticket requirement capture | `SdlcRequirementClosureRegister` and local requirement ledgers | GTL requirement declarations and ABG requirement route | Requirement set and environment views | Product supplies domain requirement text/policy | ABG admits requirement terms and projections. |
| Execution-grounded proof binding | Hello World command/test/service runs | Local proof/evidence admission | ABG actor/operator invocation and evidence admission | Target artifact, capability, evidence-binding views | Product/plugin supplies domain proof expectations | ABG emits evidence and requirement evidence binding. |
| Assurance and residual | Close/partial/block decisions | `SdlcEdgeAssuranceCloseDecision`, residual ledgers | ABG assurance fold, residual projection, lifecycle disposition | Assurance and residual pressure views | Product policy supplies F_P/F_H data only | ABG emits fold/residual/disposition truth. |
| Re-entry and reprice | Next action/rework/retry | `SdlcNextActionProjection`, retry controller | ABG continuation, correction, re-entry, executive pressure | Re-entry and reprice interpretation | Product maps policy labels to F_H data | ABG emits continuation/re-entry/pressure facts. |
| Parallel branch and fan-in | Parallel work execution | Product-local branch scheduler | ABG frontier, branch lease, fan-in, aggregate fold | Parallel frontier lifecycle view | Product supplies branch-specific policy data | ABG emits branch/fan-in events. |
| Recursive lifecycle | Program/project/task nesting | Local phase hierarchy | ABG frame, span, zoom, foldback, re-entry | Recursive span lifecycle view | Product supplies domain scope labels | ABG emits frame/span/foldback lineage. |
| Release readiness | Release/go/no-go view | Local release closure register | ABG lifecycle, evidence, assurance, residual truth | Release-readiness candidate view | Product supplies release policy data | odd_glc reports readiness only; release authority remains unclaimed unless a later release requirement prices it. |
| Operational feedback | Live observations returning to work | Local operational feedback loop | ABG observed telemetry, executive pressure, continuation | Feedback-to-pressure lifecycle view | Product/plugin supplies telemetry interpretation data | ABG emits telemetry/pressure facts. |

## Guardrails

- A row that can only be described as an odd_sdlc feature does not belong here.
- A row that requires copying odd_sdlc code does not belong here.
- A row that needs local odd_glc runtime authority must be repriced upstream to
  GTL/ABG or downstream to the product/plugin seam.
- Software-build work uses the reusable odd_glc software-build overlay and
  plugin seam. Hello World rungs are scenario witnesses, not separate product
  overlay models.
