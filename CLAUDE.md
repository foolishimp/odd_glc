<!-- ABG_GTL_CONTEXT_START -->
# Installed ABG/GTL Context Compression

Version: 4.2.0-rc.6
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

Installed axioms:
- A GraphFunction is a reusable workflow library function or callable work
  contract.
- A graph overlay or GTL program composition is the program surface. It binds
  graph functions, node types, starts, roles, security, policies, proof
  obligations, plugin contracts, result contracts, and allowed bindings.
- A workspace is the mutable program instance surface. It may provide bootstrap
  config, files, observed state, generated artifacts, run archives, and
  operator data. It does not select traversal, call vectors, own closure, or
  replace ABG startup/admission.
- ABG traversal owns startup, registry projection, selection, graph-call
  opening, vector progression, instruction assembly, worker/effect dispatch,
  admission, fold, residual, continuation, re-entry, block, terminal
  projection, and replay truth.
- Downstream products may publish specialized graph functions and overlays
  through GTL declarations consumed by ABG. They must not create local prompt
  shells, registries, ledgers, traversal loops, closure truth, or duplicate
  runtime state.
- F_D applies only over known algebra or total functions. F_P/F_H outputs may
  provide admitted evidence or policy judgment, but they do not become
  deterministic traversal law without F_D conformance over admitted truth.
- Instruction and prompt envelopes are ABG-rendered projections over admitted
  carriers. Product templates are data; product renderers are not authority to
  inject a separate prompt shell.
- Tests that claim traversal parity must enter through admitted GTL program and
  workspace startup, or through a documented ABG resume boundary, and must read
  replay truth for traversal-affecting results. Direct vector, plugin, worker,
  or script calls are not traversal parity.

<!-- ABG_GTL_CONTEXT_END -->
