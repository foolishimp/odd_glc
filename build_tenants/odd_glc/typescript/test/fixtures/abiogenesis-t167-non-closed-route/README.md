# ABIogenesis T-167 Non-Closed Route Fixture

This fixture is a committed copy of the ABIogenesis T-167 installed replay
artifact for non-closed requirements-route mechanics.

`odd_glc` consumes it as read-only ABG replay truth. It does not emit residuals,
select continuation, route re-entry, or construct disposition truth.

2026-06-30 qualification: this fixture is not a live execution-grounded
fixture-of-record. The upstream producer uses an installed test evaluator stub
for non-closure, so this fixture may guard read-model mechanics only. T-014
must close against a successor live ABI artifact.
