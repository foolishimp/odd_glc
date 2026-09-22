## Current ABI dependency

The source-workspace default uses the [exact ABI5 development pin](build_tenants/odd_glc/typescript/abi5.development-pin.json),
not a release. Use the installed `@abiogenesis/typescript-tenant` public exports
(`./public`, `./product`, `./gtl`, `./abg`) and native
`node_modules/.bin/abg.cli --jsonl <request-file>`; `bootstrap/index.mjs` is a thin
public re-export. See the [migration receipt](.ai-workspace/comments/codex/20260918_ABI5_BASIC_CLI_SINGLE_START/migration-return.md).

The generated 4.6 block below is retained historical predecessor context, not
the active ABI/API basis. Its bytes are preserved; no generated ABI5 context
is claimed.

<!-- ABG_GTL_CONTEXT_START -->
# Installed ABG/GTL Context Compression

Version: 4.6.0-rc.3
Package: @abiogenesis/typescript-tenant

This context is owned by the installed ABG/GTL product version. Refresh it with
the ABIogenesis installer; do not hand-maintain it as downstream source truth.

Authoritative source surfaces:
- specification/requirements/mapping/REQ-M-GTL3-PROGRAM-TRAVERSAL.md
- specification/requirements/abg/REQ-R-ABG3-INSTRUCTION-ASSEMBLY.md
- specification/requirements/gtl/REQ-L-GTL3-LANGUAGE-CAPABILITY-MODEL.md
- specification/requirements/product/REQ-P-INSTALL.md

Core chain:

```text
graph-function library -> graph overlay/program -> workspace binding -> ABG traversal -> replay interpretation
```

Constitutional boundaries — these govern YOU, the agent reading this:
- THREE-LAYER OWNERSHIP: GTL declares (syntax); ABG interprets, admits,
  derives, and gates — ABG owns ALL systems functionality (startup,
  admission, traversal, instruction assembly, dispatch, fold, re-entry,
  replay truth); downstream odd_* products ship DOMAIN DECLARATIONS
  ONLY and own no systems functionality. Do not build local prompt
  shells, registries, ledgers, traversal loops, closure truth, or
  duplicate runtime state — however reasonable it seems in the moment.
- EXECUTION DEFAULT: execution belongs to YOUR typed F_P worker turn.
  When a stage declares that tests, builds, mutants, or generation run,
  YOU run them inside your turn and return the typed execution result
  (command, exit status, report identities, counts, typed payload
  sections) in your result artifact. The framework, binding, or harness
  NEVER invokes the subject toolchain — no spawn of build/test commands
  outside the declared worker turn. F_D consumes admitted results; it
  never performs execution. Determinism does not reclassify execution
  as F_D.
- EARNED DEPTH: depth truth derives from admitted intermediate assets
  (your delivered depth-proof map, executed report identities, admitted
  mutation outcomes) plus admitted evidence. Declaration equality never
  closes anything. Proof obligations are DISCOVERED from admitted
  assets, never statically enumerated — deliver the map and the
  obligations follow.
- EVIDENCE PROVENANCE: execution evidence is closure-bearing only with
  admitted worker-turn provenance. Framework-assembled or self-reported
  evidence is inadmissible by construction — the kernel mints
  kill/survived truth from your admitted mutation outcomes (suite red +
  verified restore); attaching such refs directly does nothing.

Installed axioms:
- A GraphFunction is a reusable workflow library function or callable work
  contract. A graph overlay or GTL program composition is the program
  surface binding functions, node types, roles, policies, proof
  obligations, and contracts.
- A workspace is the mutable program instance surface. It does not select
  traversal, call vectors, own closure, or replace ABG startup/admission.
- F_D applies only over known algebra or total functions. F_P/F_H outputs
  may provide admitted evidence or policy judgment, but they do not become
  deterministic traversal law without F_D conformance over admitted truth.
- Instruction and prompt envelopes are ABG-rendered projections over admitted
  carriers. Product templates are data; product renderers are not authority to
  inject a separate prompt shell.
- Tests that claim traversal parity must enter through admitted GTL program and
  workspace startup, or through a documented ABG resume boundary, and must read
  replay truth for traversal-affecting results. Direct vector, plugin, worker,
  or script calls are not traversal parity.

<!-- ABG_GTL_CONTEXT_END -->

<!-- STDO_BOOTSTRAP_START -->
## STDO Bootstrap

This scope is routed by an STDO Product Definition Overlay.

Before constitutional work:

1. Resolve the applicable `stdo_<label>.json` for the requested Product scope.
2. Use `constitution.stdo.basis`, not its mutable selector, as the operative basis.
3. Resolve and verify that exact installed release through the STDO toolchain manager.
4. Load the Product Definition's declared bootstrap entrypoint, then exact owning standards as needed.
5. Resolve the applicable accepted Project Reference-Frame Basis or its declared composition.
6. Enter governed work through its Executive frame or declared project equivalent: bind the exact outcome and basis, inspect the unresolved evaluation frontier, and activate only the smallest dependency-ready context needed for the next decision.
7. Fail closed when the Product Definition, frame basis, subject, authority, or activation is missing, ambiguous, stale, or outside the governed scope.

Mutable methodology source, another installed version, a cache entry, and this
bootstrap cannot replace the exact basis selected by the Product Definition.
A prompt, summary, symbolic map, or prior result may route attention but cannot
replace current source authority or a closed frame result.
<!-- STDO_BOOTSTRAP_END -->
