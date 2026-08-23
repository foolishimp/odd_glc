# odd_glc Common Design

Ratified common design for `odd_glc` lives here.

Common design governs realization choices that apply across future build
tenants. Tenant-specific implementation details belong under the selected
tenant after the tenant registry activates it.

## Active Decisions

- `ODD_GLC_ABI5_MIGRATION` —
  [ABIogenesis 5 data-only Product migration](ODD_GLC_ABI5_MIGRATION.md):
  active ratified T-041 Program-only design over exact ABIogenesis
  `v5.0.0-dev.286`, admitted through the exact-tree record in
  `specification/GOVERNANCE.md`; broader lifecycle migration is deferred.
- [ADR-001 route-1 GTL/ABG lifecycle consumption](adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md)

## Preserved Predecessor And Deferred Evidence

- [ABIogenesis 4.2 typed startup binding](ODD_GLC_ABG42_TYPED_STARTUP_BINDING.md)
- [generic parity matrix](ODD_GLC_GENERIC_PARITY_MATRIX.md)
- [dense odd_sdlc feature parity table](ODD_GLC_ODD_SDLC_FEATURE_PARITY_TABLE.md)

These surfaces preserve released 0.1 or deferred full-lifecycle reasoning. They
do not override or enlarge the active ratified T-041 design.
