# odd_glc Common Design

Ratified common design for `odd_glc` lives here.

Common design governs realization choices that apply across future build
tenants. Tenant-specific implementation details belong under the selected
tenant after the tenant registry activates it.

## Active Decisions

- [ADR-001 route-1 GTL/ABG lifecycle consumption](adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md)

## Proposed Decisions Awaiting Exact-Tree Acceptance

- `ODD_GLC_ABI5_MIGRATION` —
  [ABIogenesis 5 data-only Product migration](ODD_GLC_ABI5_MIGRATION.md):
  proposed T-041 design over exact ABIogenesis `v5.0.0-dev.286`; it becomes an
  active ratified Program-only design only after the Executive/F_H exact-tree
  gate in `specification/GOVERNANCE.md` holds. Broader lifecycle migration is
  deferred.

## Preserved Predecessor And Deferred Evidence

- [ABIogenesis 4.2 typed startup binding](ODD_GLC_ABG42_TYPED_STARTUP_BINDING.md)
- [generic parity matrix](ODD_GLC_GENERIC_PARITY_MATRIX.md)
- [dense odd_sdlc feature parity table](ODD_GLC_ODD_SDLC_FEATURE_PARITY_TABLE.md)

These surfaces preserve released 0.1 or deferred full-lifecycle reasoning. They
do not override or enlarge the proposed T-041 design if it is admitted.
