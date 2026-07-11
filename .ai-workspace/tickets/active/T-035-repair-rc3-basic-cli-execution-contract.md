---
id: T-035
title: Repair the rc.3 basic CLI worker-execution contract
type: bug
ticket_category: realization_repair
status: active
goal: close-odd-glc-rc3-live-compatibility
change_class: realization_refactor
re_entry_point: build_tenant_proof
owner: odd_glc
priority: high
created_at: 2026-07-11
governance_scope: STDO Method, ODD execution-default law
source_documents:
  - specification/PRODUCT.md
  - .ai-workspace/tickets/active/T-029-install-odd-glc-into-scenario-sandboxes.md
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.6.0-rc.3/release-note.md
---

# T-035: Repair The rc.3 Basic CLI Worker-Execution Contract

## Intake

The first odd_glc basic CLI live run on ABIogenesis `4.6.0-rc.3` closed its
seven construction vectors and then blocked at `test_execution_result`. The
scenario instructed the plan-stage worker not to execute, while the next
deterministic verification stage required the worker-produced
`test-execution-result.json`.

This is a contradictory proof-harness contract. It is not an ABG runtime gap
and does not authorize a framework-owned subject executor.

## Target

The plan-stage F_P worker runs the declared Node test command inside its turn
and returns truthful plan and execution-result files. The following
deterministic verification step reads that evidence without spawning the
subject toolchain. This ticket does not reclassify the current plugin interior
or close T-033's future declarations-only migration.

## Required Work

- Mark the basic CLI execution-planning stage as worker-executed.
- Require `test-execution-plan.json` and `test-execution-result.json` from that
  turn.
- Pin the execution-default instruction and result fields in the deterministic
  test lane.
- Preserve the framework execution-authority conformance gate.

## Closure Law

Close when the deterministic suite proves the corrected contract, the
execution-authority gate remains green, and a fresh basic CLI live run on the
exact rc.3 substrate converges without a framework-owned subject execution
path.

## Non-Closure Conditions

- The framework invokes the generated subject or test command.
- The worker is still forbidden from executing while later verification
  requires its execution result.
- A synthetic result file substitutes for the live worker turn.

## Proof Commands

```sh
cd build_tenants/odd_glc/typescript
npm test
```

```sh
git diff --check
```

## Closure Evidence

Pending.
