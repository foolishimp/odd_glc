---
id: T-018
title: Define generic downstream specialization seam
type: design
ticket_category: requirement_design
status: completed
goal: >-
  Define the generic downstream specialization seam as extension points,
  data-only F_P/F_H policy slots, and forbidden-mechanism law. odd_glc shall
  not author software/test/build/release semantics or reproduce odd_sdlc.
change_class: requirement_reprice
re_entry_point: requirements
owner: odd_glc
priority: high
created_at: 2026-06-30
completed_at: 2026-06-30
governance_scope: STDO Method, ODD Method, downstream specialization
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/REQ-GLC-DOWNSTREAM-SPECIALIZATION.md
closure_law: >-
  Close only when odd_glc defines the generic shape of downstream
  specialization and explicitly excludes copied odd_sdlc code, Sdlc carriers,
  phase flow, local ledgers, retry controllers, closure stores, and
  software-domain semantics from odd_glc scope.
non_closure_conditions:
  - A row can only be described as an odd_sdlc feature instead of a generic
    lifecycle capability.
  - odd_glc authors software/test/build/release semantics that belong to a
    downstream product or plugin.
  - odd_glc copies, ports, or reproduces odd_sdlc code or internals.
required_work:
  - Add generic specialization seam law where needed.
  - Keep the coverage matrix capability-first.
  - Ensure odd_sdlc appears only as workflow-witness and deletion-target
    evidence.
proof_commands:
  - rg -n "workflow-witness|deletion-target|software/test/build/release semantics|copy.*odd_sdlc|reproduce.*odd_sdlc" specification AGENTS.md .ai-workspace/tickets/completed
  - git diff --check
closure_evidence:
  - AGENTS.md, PRODUCT.md, GOALS.md, REQ-GLC-BOUNDARY-AUTHORITY, REQ-GLC-DOWNSTREAM-SPECIALIZATION, and ADR-001 define the generic seam and exclude odd_sdlc reproduction.
  - odd_sdlc appears only as workflow-witness/deletion-target evidence for future downstream specialization.
  - npm test passed 26/26 and negative boundary tests continue to reject local runtime authority.
  - git diff --check passed.
---

# T-018: Generic Downstream Specialization Seam

This ticket is about the hole shape, not a software-domain implementation.
