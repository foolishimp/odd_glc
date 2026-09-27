PC02 implements the ordinary GTL native construction handoff and actual child
output joins. The component candidate is frozen and returns to Executive
`/root`. This is source/component evidence; package, setup, Run, provider and
original-worksite effects were not performed. PC03 evaluation, PC04 independent
assessment, original-task completion and S06 remain open.

The activation extends accepted PC01 checkpoint
`c22eac39d5c3a4e4cfa75ff3387532518dfb19b8`, under T-043's PC02 grant, the same
Product/Design/Owner/Proof routes, verified STDO v2.5.0-rc.4 and accepted HOW
SHA-256 `9dd3233fb54402c73970bbefcce44f3e31618d158bad393f4a47104c9ed1f83f`.
Core46 is unchanged. No missing governing relation or new ABI primitive was
identified.

Changed paths and SHA-256, relative to the repository:

| Path | SHA-256 |
| --- | --- |
| `build_tenants/odd_glc/typescript/src/program-construction.mjs` | `fbbe2257719ced158c404545317d36cbfe9777a808fc30642ab337988953cb4c` |
| `build_tenants/odd_glc/typescript/src/program-construction-contracts.mjs` | `c06a072d06b7f4216e012e111d1fe49fa0d633f831ae8e2463c0d8573abe4ce6` |
| `build_tenants/odd_glc/typescript/src/program-construction-runtime.mjs` | `879f0978a64e74cdb9350fb523c0d69a1346c3e1b7d340b02eadd8c6e2e721f2` |
| `build_tenants/odd_glc/typescript/test/program-construction.test.mjs` | `4ba6f175d70f5e37696d155086a65d460a4d3c48b8a2597e424aa65c6e5c850f` |
| `build_tenants/odd_glc/typescript/test/abi5-installed-program-construction.test.mjs` | `19be72187e59f437f7c88349e91170047ba303eaec6af5dd0494617ff04ddcbd` |
| `.ai-workspace/comments/codex/20260927_PROGRAM_CONSTRUCTION/pc02/return.md` | Final return hash accompanies the Worker handoff. |

The existing emitter needs no change: it already includes all three construction
modules in the ordinary Product package. Its unchanged SHA-256 is
`647b42240d85d7ba7bcb54a7020cf421b9316fa5aada872253ea38f9ee830409` at
`build_tenants/odd_glc/typescript/scripts/build-native-continuation-product.mjs`.

The construction-only Program is ordinary GTL:

```text
native construction entry
  -> authenticate-construction
  -> native reacquisition
  -> prepare-construction
  -> construction-child, repeated in the declared finite group order

each construction-child:
  prepare-native-task -> native-work -> join-native-output
```

The root fixes the child count and order when the Program is authored. Each
selected duty has exactly one group/producer-node correspondence. Independent
duties can share one child. Future-output dependencies must cross an earlier
child boundary; they cannot be unresolved within one group. The child joins its
own input with the actual native output through the existing
`graphInputRetentionBinding`, using ordinary consumer contracts as operands.
The Program admits no C2 or assessor callable.

Preparation compares the actual acquired request with the prepared original
request and requires the complete retained context, including entries, roots
and limits. Observed predecessor digests must match that acquired/current
context. Every dependency must be in `readFirst`, and every dependent must be
inside the selected native write roots. Native tasks contain current
context/grant, selected group/duties/fit and predecessor bindings; historical
job/command envelopes are not copied into their instructions. Checks are empty,
and the instructions prohibit application execution and evaluator-oracle access.

Each joined observation must satisfy the public native contract and match the
exact prepared task. A future dependency obtains its digest and observation
coordinate from the unique prior declared producer's actual output, then checks
that digest against the dependent child's current context. Root-entry copies,
wrong tasks, premature/ambiguous producers and changed current context refuse.
Author gaps, missing dependent files, changed consumed predecessors and changed
retained execution snapshot members remain explicit. Partial output cannot
prepare another dependent child. An unavailable native after-observation cannot
be turned into a valid construction state. Native failure retention itself
remains with the existing owner; this component work does not establish a live
failure result.

After acquisition, the typed intermediate carries a compact basis: model,
selected groups, authority, initial current context, source Result and original
construction/execution coordinates, retained snapshot members, pending duties
and carried bindings. It carries actual new native observations separately.
Each child conserves this basis. Root closure additionally compares it with the
authenticated root input and prepared acquisition identity. All selected
provenance duties remain pending evaluation; the result explicitly says
`evaluationDisposition: not_performed`, `assessmentDisposition: not_performed`
and `originalTaskCompletion: not_claimed`. A partial construction-only result is
not a satisfied edge or independent assessment.

The existing driver now accepts `mode: construction_only` with
`expectation: predecessor_refusal` and a `constructionReview: {path,digest}`
in place of the evaluate-only `evaluatorReview`. All other activation fields
remain: exact source freeze, launch path/digest, setup receipt, installed core
and CLI, environment/admitted installs, preserved prefix, ABI artifact,
new output root and timeout. The driver checks the declared root/child topology
and output-retention binding. This mode requires the actual
`prepare-construction` call to be reached, no completed terminal value, zero
actor events/occurrences and no native constructor, assessor or C2 call.
Merely importing the driver has no runtime effects.

The construction entry is made with `constructNativeConstructionInput` and has
kind `lifecycle_native_construction_input`. Supply the existing exact `model`,
`origin`, `historicalSelection`, `sourceSelection`, `authority`,
`currentContext`, and `selectedDutyRefs`, plus `constructionGroups`; omit the
evaluate-only `evaluator`. Each group has exactly:

```js
{
  ref,
  dutyRefs,
  fitJudgment: {ref, digest},
  outcome,
  instructions,
  readFirst,
  writeRoots,
  checks: []
}
```

Select prospective provenance duties for this dependency-ready subset. Keep the
complete original population, including evaluation/assessment, in the model.
Each such duty declares `dependentPaths` and observed or future dependencies.
Group order must satisfy the declared prerequisites. The exact actual dependent
work, fit and write grant still belong to the effectful activation; component
fixtures do not authorize them.

Author the candidate through the existing `constructLifecycleProgram`, adding
`constructionGroups`. Its selected route uses `roles: ['provenance']`, the
selected obligation refs, fit judgment, and
`permittedEffects: [product.NATIVE_WORKSPACE_WORK_IDS.effectUri]`. Supply the
construction library with `includeNativeConstruction: true`, the existing core
command/reacquisition publication, and the existing native-work publication.
Set `retainEntryAfter: [1]` and these `graphFunctionRefs`:

```js
[
  ids.nativeAuthenticateGraphFunctionRef,
  product.NATIVE_WORK_REACQUISITION_IDS.graphFunctionRef,
  ids.prepareConstructionGraphFunctionRef,
  ...constructionGroups.map(() => ids.constructionChildGraphFunctionRef)
]
```

Use the existing selected `runEnvironment` and ordinary package/catalog/install
owners. Build the valid candidate first. For the targeted refusal, change one
observed dependency digest on a selected prospective duty in the launch input,
leaving its actual original source, context and native selector intact; recompute
the ordinary input/launch digests. Shape admission intentionally leaves this
currentness decision to acquired-context preparation. The same driver's later
authorized command is:

```sh
node test/abi5-installed-program-construction.test.mjs --execute <reviewed-owner-activation.json>
```

That command was not run in PC02. Root must retain its actual refusal and fresh
Result/replay before claiming the installed discriminator.

Component checks used tenant cwd
`/Users/jim/src/apps/odd_glc/build_tenants/odd_glc/typescript` and unchanged
core46 public exports through the existing component loader:

```sh
ABI5_COMPONENT_ROOT='/Users/jim/src/apps/odd_glc/.ai-workspace/comments/codex/20260927_PROGRAM_CONSTRUCTION/installed-04/products/core46/node_modules/@abiogenesis/typescript-tenant' node --loader ./test/fixtures/program-construction/core-loader.mjs --test test/program-construction.test.mjs
```

The first PC02 run passed 24/25 in 136496.453959 ms. Public
`validatePublication` refused unused evaluate-only helper contributions on the
native-only Program and duplicate zero-fixture provenance refs. The bounded
repair emits helpers for the selected regime and unique contribution refs.
The next full focused run passed 25/25, zero failures/skips, in 153220.798791 ms,
including public `validateProgram`, public `validatePublication`, driver
topology checks and all unchanged evaluate-only cases.

That run exposed repeated full-origin validation in the new pure joins.
`isConstructionState` called native entry/reacquisition validation repeatedly,
and its state projection reselected against the full retained observation.
The representative terminal fixture is 6,471,675 bytes, containing the preserved
native work/execution structure; existing assertions retain 15 original bindings
and nine command results. The compact basis correction removes those historical
envelopes and repeated origin selection from child validation. No cache,
profiling subsystem or new admission authority was added.

After that contraction, only the affected cases were rerun:

```sh
ABI5_COMPONENT_ROOT='/Users/jim/src/apps/odd_glc/.ai-workspace/comments/codex/20260927_PROGRAM_CONSTRUCTION/installed-04/products/core46/node_modules/@abiogenesis/typescript-tenant' node --loader ./test/fixtures/program-construction/core-loader.mjs --test --test-name-pattern='construction groups become|actual acquisition|wrong predecessor|partial output|group coverage' test/program-construction.test.mjs
```

Final affected-source result: exit 0; five tests passed; zero failed, skipped,
cancelled or todo; 40567.632167 ms. Node selected five tests, rather than counting
the other twenty as skips. The unchanged twenty retain the preceding successful
run; no final-source full 25-case rerun is claimed.

Retained per-test timings, milliseconds. The first column is the successful full
focused run before the compact-basis contraction; the second is the final
affected run. A dash means not rerun.

| Test | Full focused | Final affected |
| --- | ---: | ---: |
| Actual retained native projection | 1070.942666 | — |
| Ordinary generated acquisition/evaluation validation | 1099.950167 | — |
| Packaging fixture exact Program membership | 0.971333 | — |
| Missing artifact versus missing execution | 31.165042 | — |
| Assessment exact evidence/scope/independence | 3940.3355 | — |
| All selected duties supported | 963.763625 | — |
| Stale or unknown support | 827.224916 | — |
| Missing historical construction input | 996.555208 | — |
| Future output references | 2744.468625 | — |
| Missing/ambiguous/undeclared/cyclic producers | 6.885458 | — |
| Present/absent/changed/unavailable inputs | 4250.715959 | — |
| Missing prerequisite withdraws assessments | 3323.667125 | — |
| Partial binding carries other duties | 1053.307208 | — |
| Excluded producer/consumer | 1374.672625 | — |
| Construction GTL/publication/driver topology | 1519.968 | 1559.282375 |
| Actual acquisition/child/future digest joins | 40473.104083 | 8023.165917 |
| Wrong predecessor/acquisition/task/root refusal | 34813.078125 | 17774.35125 |
| Partial output/stale execution/unknown after | 36428.427167 | 7982.532833 |
| Group coverage/boundaries/effects | 4871.023458 | 4731.304208 |
| Applicability and cycles | 519.02275 | — |
| Effects/interfaces/ambiguous routes | 1431.772292 | — |
| Irrelevant history/task label identity | 2387.788458 | — |
| First judgment source authentication | 3716.336875 | — |
| Retained stream computation | 2408.523958 | — |
| TAP result attribution | 2481.917334 | — |

These are observed component timings, not an isolated benchmark or installed
cost claim. The refusal test exercises multiple distinct root-entry/acquisition
variants against the real retained fixture; those still perform full initial
source validation. Actual new native observations still receive their public
contract checks. The remaining cost has not been separately profiled and stays
available to the existing proportionality debt owner.

Final syntax checks exited 0 for all five changed JavaScript files, and
`git diff --check` over those files exited 0. Self-check covered the exact diff,
selected callable membership, retained binding operands, no C2/assessor calls,
root/child/task conservation, future producer selection, partial/unknown state,
source-coordinate conservation and exact write territory.

PC03's declared seam is the actual construction-state output joined with the
original entry retained by the enclosing root, using
`graphInputRetentionBinding(ids.nativeInputContractRef, ids.constructionStateContractRef)`
at the next ordinary edge. The original entry supplies authenticated retained
execution records; the actual child state supplies new construction observations.
Neither substitutes for the other. PC03 must compute the construction-edge and
comparison records and conserve accepted evidence; PC04 must bind the actual
author provenance to an independently admitted native assessment. Neither
computation nor assessment is supplied here.

Only the six granted paths listed above were written. No emitter/package/install,
native/Run/provider, old-worksite, ABG-source, Product/HOW, ticket or Git mutation
occurred. Worker editing stops at this frozen return.
