---
id: T-020
title: Upgrade installed ABG substrate to 4.2
type: implementation
ticket_category: realization_refactor
status: completed
goal: >-
  Retarget the odd_glc route-1 TypeScript tenant from ABIogenesis
  4.1.0-rc.17 to the installed ABIogenesis 4.2.0-rc.1 product while preserving
  the existing odd_glc read-only boundary.
change_class: realization_refactor
re_entry_point: build_tenant_provenance
owner: odd_glc
priority: high
created_at: 2026-07-01
completed_at: 2026-07-01
governance_scope: STDO Method, ODD Method, installed-substrate provenance, route-1 tenant boundary
source_documents:
  - specification/GOALS.md
  - build_tenants/TENANT_REGISTRY.md
  - build_tenants/common/design/adrs/ADR-001-route-1-gtl-abg-lifecycle-consumption.md
  - build_tenants/odd_glc/typescript/substrate.provenance.json
  - /Users/jim/src/apps/abiogenesis/release_snapshots/abiogenesis-typescript-tenant/4.2.0-rc.1/release-snapshot-manifest.json
closure_law: >-
  Close only when odd_glc records ABIogenesis 4.2.0-rc.1 as its installed
  substrate, proves the installed 4.2 public facade is consumed successfully,
  and does not claim new lifecycle capability merely because the substrate was
  upgraded.
non_closure_conditions:
  - The tenant package/install binding points at ABI 4.2.0-rc.1 but
    substrate provenance or design still identifies 4.1.0-rc.17 as the
    consumed runtime substrate.
  - The upgrade rewrites historical fixture provenance for rc17 proof artifacts
    as if those artifacts were produced by 4.2.0-rc.1.
  - The tenant imports ABG emitters, admission commands, registry selection
    commands, graph-call factories, execution/supervision functions, or
    admitted-ref minting authority.
  - The ticket claims odd_glc now owns node-type, registry, startup, graph-call,
    execution, or selection capability because ABI 4.2 provides it.
  - The install refresh requires a product-local shell or manual package-name
    workaround that creates a second install truth.
required_work:
  - Record T-020 as the active upgrade ticket.
  - Update GOALS and tenant/design surfaces to distinguish the installed ABI
    4.2 substrate from older rc17 fixture-of-record proofs.
  - Retarget `build_tenants/odd_glc/typescript/substrate.provenance.json` to
    ABIogenesis 4.2.0-rc.1 with package, source, snapshot, tarball, release
    manifest, and product-toolchain manifest identity.
  - Keep older proof artifact provenance unchanged where those artifacts were
    actually produced by ABI 4.1.0-rc.17.
  - Prove the tenant tests import and validate the installed 4.2 public
    `abg/requirements` query facade.
  - Preserve negative boundary tests for forbidden local runtime authority.
proof_commands:
  - cd build_tenants/odd_glc/typescript && npm test
  - git diff --check
  - rg -n "4\\.2\\.0-rc\\.1|T-020|installed ABIogenesis 4\\.2" specification build_tenants .ai-workspace/tickets/active
  - '! rg -n "emitRequirementRouteFactsForEdgeClose\\(|mintAdmittedRef\\(|admitDeclarations\\(|bindExecutionEvidence\\(|projectRequirementFoldFromAssuranceClosure\\(|projectRequirementResidualsFromFolds\\(|resolveRequirementLifecycleDisposition\\(" build_tenants/odd_glc/typescript/src build_tenants/odd_glc/typescript/test'
closure_evidence:
  - ABIogenesis `4.2.0-rc.1` was replaced with a regenerated RC1 snapshot whose
    release manifest records `sourceCommit`
    `54c21ce1f984f0be922199232fd8cb981f000ce4` and `sourceDirty: false`.
  - The installed shared toolchain product at
    `/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.2.0-rc.1`
    was replaced from the new source using the installer without
    `--installed-package-name`.
  - The refresh preserved `installedPackageName: odd-glc-abg-rc12`.
  - `build_tenants/odd_glc/typescript/substrate.provenance.json` records the
    replacement RC1 source commit, snapshot commit, tarball digest, release
    manifest digest, and product-toolchain manifest digest.
  - `cd build_tenants/odd_glc/typescript && npm test` passed 28/28.
  - `git diff --check` passed.
  - The forbidden-authority call grep returned no matches.
---

# T-020: Upgrade Installed ABG Substrate To 4.2

This ticket records the installed-substrate upgrade for `odd_glc`.

The upgrade is not a new odd_glc capability claim. ABIogenesis 4.2.0-rc.1
publishes reusable GTL node types, typed composition, startup registry binding,
and graph-call guards. `odd_glc` may later consume those through GTL/ABG, but
this ticket only retargets the route-1 tenant to the installed 4.2 substrate
and re-proves the existing read/query interpretation boundary.

Historical fixture-of-record artifacts stay historically pinned. A replay
artifact produced by ABI 4.1.0-rc.17 remains a 4.1 artifact. The current
runtime dependency and public facade used by the tenant are what move to 4.2.
