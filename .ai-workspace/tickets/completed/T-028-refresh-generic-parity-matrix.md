---
id: T-028
title: Refresh generic parity matrix
type: governance
ticket_category: requirement_design
status: completed
goal: >-
  Refresh the parity backlog so every row is a generic lifecycle capability,
  with odd_sdlc appearing only as workflow witness and deletion-target evidence.
change_class: requirement_reprice
re_entry_point: requirements
owner: odd_glc
priority: medium
created_at: 2026-07-01
completed_at: 2026-07-01
governance_scope: STDO Method, ODD Method, parity without reproduction
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/REQ-GLC-DOWNSTREAM-SPECIALIZATION.md
closure_law: >-
  Close only when the parity matrix cannot be read as an odd_sdlc port plan:
  row identity is generic lifecycle capability; odd_sdlc is witness and
  deletion target only.
non_closure_conditions:
  - A row can only be named as an odd_sdlc feature.
  - A row requires copying odd_sdlc code, Sdlc carriers, phase flow, local
    ledgers, retry behavior, closure rules, or software-domain policy.
required_work:
  - Add or refresh the generic parity matrix.
  - Map old mechanisms only as deletion targets.
  - Identify any downstream-product work that belongs outside odd_glc.
proof_commands:
  - git diff --check
  - rg -n "workflow-witness|deletion-target|generic lifecycle capability" specification build_tenants .ai-workspace/tickets/active
closure_evidence:
  - `ODD_GLC_GENERIC_PARITY_MATRIX.md` defines row identity as generic
    lifecycle capability.
  - odd_sdlc appears only as workflow witness and deletion-target evidence.
  - The matrix explicitly excludes copying odd_sdlc code, Sdlc carriers, phase
    flow, local ledgers, retry behavior, closure rules, or software-domain
    policy.
---

# T-028: Generic Parity Matrix

This is the control surface that prevents the parity wave from becoming an
odd_sdlc port.
