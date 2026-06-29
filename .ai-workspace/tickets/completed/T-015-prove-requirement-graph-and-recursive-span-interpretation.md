---
id: T-015
title: Prove requirement graph and recursive span interpretation
type: implementation
ticket_category: realization_refactor
status: completed
goal: >-
  Prove that odd_glc interprets ABI T-168 requirement-graph projection and ABI
  T-169 span-lineage/foldback/re-entry replay truth as generic lifecycle graph
  and any-scale lifecycle meaning without owning requirement graph derivation
  or recursive runtime authority.
change_class: realization_refactor
re_entry_point: code
owner: odd_glc
priority: critical
created_at: 2026-06-30
completed_at: 2026-06-30
governance_scope: STDO Method, ODD Method, recursive lifecycle interpretation, GTL/ABG consumption
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - specification/requirements/REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-168-ratify-gtl-requirement-graph-and-abg-refinement-route.md
  - /Users/jim/src/apps/abiogenesis/.ai-workspace/tickets/completed/T-169-ratify-requirement-span-identity-across-recursion.md
closure_law: >-
  Close only when odd_glc consumes digest-pinned ABI T-168 and T-169 artifacts
  and proves graph/span interpretation from emitted ABI truth. It shall not
  derive requirement graphs, mint span identity, open frames, fold back spans,
  or route graph re-entry locally.
non_closure_conditions:
  - odd_glc derives a requirement graph from strings or odd_sdlc feature shape.
  - odd_glc treats vector membership as span identity instead of reading ABI
    span-lineage/foldback truth.
  - Tests hand-author frame, zoom, foldback, or re-entry refs instead of reading
    committed ABI artifacts.
required_work:
  - Commit ABI T-168 and T-169 artifacts and manifests as fixtures-of-record.
  - Record their provenance and digests.
  - Add read-only requirement graph and span-lineage interpretation.
  - Add tests proving parent/child graph and recursive span/foldback refs.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
closure_evidence:
  - Committed ABI T-168 and T-169 artifacts and manifests as fixtures-of-record.
  - substrate.provenance.json pins T-168 digest sha256:f4d548c81af75b084555c669c739dba1c89a7e68aefca64642670851b37644c1 and T-169 digest sha256:666d9414e6a717ff3f4cb4fe8917a6a0bcdd43af6fb2dcb3c6074e2d26cc030f.
  - npm test passed 26/26 and proves parent/child graph, aggregate residuals, recursive frame, zoom, foldback, and re-entry refs from ABI artifacts.
  - git diff --check passed.
---

# T-015: Requirement Graph And Recursive Span Interpretation

This is generic lifecycle interpretation. It does not author software-domain
semantics and does not implement ABG recursion.
