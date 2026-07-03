---
id: T-029
title: Install odd_glc into scenario sandboxes
type: implementation
ticket_category: realization
status: active
goal: >-
  Make odd_glc live scenario sandboxes reproduce app consumption shape by
  installing ABG/GTL and an immutable odd_glc product snapshot into each
  sandbox before ABG startup/traversal runs.
change_class: realization_refactor
re_entry_point: build_tenant_proof
owner: odd_glc
priority: high
created_at: 2026-07-03
governance_scope: STDO Method, ODD Method, sandbox proof discipline
source_documents:
  - specification/GOALS.md
  - specification/PRODUCT.md
  - .ai-workspace/tickets/active/T-025-replay-scenario-ladder-as-typed-glc-declarations.md
closure_law: >-
  Close only when live scenario sandboxes install ABIogenesis through the
  installed ABG command path, install an immutable odd_glc package/context
  snapshot into the same sandbox run, and run ABG startup/traversal using
  odd_glc declarations imported from that installed snapshot rather than from
  the mutable odd_glc source tree.
non_closure_conditions:
  - A live sandbox imports `build_tenants/odd_glc/typescript/src/index.mjs`
    directly from the mutable source repo.
  - A live sandbox writes odd_glc declaration data without an odd_glc install
    manifest, package root, file digests, and workspace reference.
  - A sandbox claims app-like reproduction while only installing ABG/GTL and
    not installing odd_glc.
  - A sandbox uses the odd_glc install step to gain runtime authority, emit
    events, select graph functions, open graph calls, invoke F_P workers, admit
    evidence, fold, residualize, or route continuation locally.
  - A sandbox shares a mutable odd_glc install root across scenario runs.
  - The subject-smoke layer is treated as closure evidence for this ticket.
required_work:
  - Add an odd_glc sandbox install helper for the TypeScript tenant.
  - The helper shall copy the odd_glc package surface needed by ABG runtime
    binding into a per-run product root under the sandbox run.
  - The helper shall write an odd_glc install manifest and workspace reference
    with package version, source tenant path, installed package root, copied
    files, and sha256 digests.
  - Update the live software-build sandbox runtime binding to import odd_glc
    from the installed package root.
  - Record both installed ABG/GTL and installed odd_glc locations in sandbox
    identity/proof output.
  - Add a non-live regression proving the generated runtime binding does not
    import odd_glc from the source tenant path.
  - Preserve the boundary: odd_glc install is declaration/context delivery
    only; ABG still owns startup, registry, traversal, events, and replay.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
closure_evidence: []
execution_record:
  - at: 2026-07-03
    status: implemented_not_closed
    notes:
      - Added the TypeScript sandbox odd_glc install helper.
      - Updated setup-port and live software-build sandbox paths to install
        odd_glc into a per-run product root and write workspace install
        manifests.
      - Updated ABG runtime binding generation to import odd_glc from the
        installed package root instead of the mutable source tenant.
      - Added a non-live regression proving the generated runtime binding does
        not import `build_tenants/odd_glc/typescript/src/index.mjs`.
      - Kept ticket active because the live-worker scenario sandboxes have not
        yet been rerun under the installed odd_glc package shape.
    verification:
      - cd build_tenants/odd_glc/typescript && node --test test/glc-software-build-overlay-live.test.mjs test/glc-hello-world-sandbox-port.test.mjs
      - cd build_tenants/odd_glc/typescript && npm test
      - git diff --check
---

# T-029: Install odd_glc Into Scenario Sandboxes

Current live scenario sandboxes install ABG/GTL, but then generate an ABG
runtime binding that imports odd_glc directly from the mutable source tree.
That does not reproduce how an app should consume odd_glc.

The target sandbox shape is:

```text
test_runs/<scenario>/<timestamp>/
  sandbox-identity.json
  toolchain/
    abiogenesis/... installed ABG/GTL product
  products/
    odd_glc/<version>/lib/node_modules/@odd-glc/route-one-typescript/
      package.json
      src/index.mjs
      src/index.d.ts
      src/substrate_provenance.mjs
      substrate.provenance.json
  instance/
    .abiogenesis/
      install-manifest.json
      install-provenance.json
      typescript-runtime.mjs
    .odd_glc/
      install-manifest.json
    .ai-workspace/
      sandbox-identity.json
      odd-glc-install-manifest.json
```

ABG/GTL remains the runtime substrate. The odd_glc install is a package/context
snapshot that provides declaration data and read interpretation surfaces for
ABG to consume.
