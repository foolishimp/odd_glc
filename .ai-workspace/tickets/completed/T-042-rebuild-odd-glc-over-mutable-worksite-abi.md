# T-042 - Bind Generic odd_glc Acceptance Scenarios to ABI5 C0

- id: T-042
- type: integration
- status: completed
- goal: bind_generic_acceptance_scenarios_to_abi5_c0
- owner: odd_glc
- change_class: goal_reprice -> design_reframe
- re_entry_point: specification/GOALS.md#current-goal
- runtime_substrate: ABIogenesis W2-R3-C0 candidate
- generic-scenario-authority: T-025
- zero-code-product-basis: build_tenants/common/design/ODD_GLC_ABI5_MIGRATION.md
- release_status: unselected
- closure: design scope superseded by T-043 live-LLM MVP delivery
- completed_at: 2026-09-01

## Outcome

This bounded design reframe established the reusable-scenario and ABI C0
boundary. T-043 retains that relation and supersedes this ticket for live
execution, iteration, successor proof, and deletion. This ticket grants no
continuing work authority.

Keep generic `odd_glc` declarations and the existing Hello World and Data
Mapper acceptance scenarios reusable. Bind their existing lifecycle edges to
the corrected ABI5 C0/HoG/ABG execution relation. The reprice addresses the
ABI runtime's former workspace-content and causality model; it does not
diagnose an `odd_glc` Product defect without live evidence.

Hello World and Data Mapper remain scenario subjects and acceptance cases, not
Products, Product members, Program identities, or lifecycle catalogue entries.

## Selected Relation

```text
generic odd_glc declaration
  + existing T-025 scenario fixture and subject
  + [T-041 zero-code Product](../../../build_tenants/common/design/ODD_GLC_ABI5_MIGRATION.md)
    where its existing relation applies
  -> ABI5 Program start / HoG traversal
  -> ABI-owned C0 worksite owner
  -> ordinary C-call result admission
  -> Event Calculus and replay
  -> generic odd_glc lifecycle interpretation
```

`WorkspaceBinding` is stable authority. A C0 `WorksiteObservation` is mutable
evidence. A filesystem change, test result, or review result is not runtime
truth until ABI admits its exact C-call result.

## Selected Work

- map existing T-025 fixture edges to C0 predecessor observation, owner effect,
  receipt, successor observation, admission, and replay;
- preserve the reusable generic lifecycle declarations and scenario ladder;
- reuse the [T-041 zero-code Product](../../../build_tenants/common/design/ODD_GLC_ABI5_MIGRATION.md)
  only within its established declaration and
  installed-Product relation;
- record a missing ABI capability as an ABI gap; and
- leave legacy code and tests unchanged.

## Not Selected

- a core, Hello World, or Data Mapper Product, Program, or Product member;
- scenario-specific lifecycle catalogue declarations;
- product-local workers, filesystem owners, admission, event writing,
  scheduling, fan-in, retry, or replay; or
- legacy deletion, release allocation, or ABI qualification.

## C0 Acceptance Criteria

For every reused scenario edge that changes a subject, the binding must show
current `O0`, selected ABI owner and territory, receipt and `O1`, ordinary
C-call-result admission, and fresh replay. A refused admission leaves visible
residue, not success. Existing Data Mapper branch/fan-in acceptance cases keep
their declared disjoint territories and consume admitted branch results.

## Falsifiers

Stop and record the ABI gap if binding requires a new odd_glc Product, Program,
catalogue entry, executor, event family, mutable `WorkspaceBinding`, or replay
from ambient workspace state.

## Return

Return the reused scenario and declaration references, the applicable T-041
relation, ABI C0 result/replay references, refusals, and residual ABI gaps. Do
not describe an acceptance case as a Product.
