WP-01 correction, 2026-09-27. Root Writer under T-043; `realization_refactor`.
Basis: frozen PC04 `cb24fd9`, unchanged accepted HOW and core46. The closed
whole-path review identified incomplete per-dependent/predecessor evidence
coverage; its SHA-256 is
`269adfa34bfb84ad366f3cbdda8160832ef12fffac2e80ee5360564291d3572c`.

The existing assessment owner now derives the required edge population from
the conserved input. Each selected record consumes exactly one required
`(duty, dependent path, predecessor path, declared digest, producer duty)`
tuple. Missing or duplicate/mismatched edges refuse before assessor dispatch.
Existing obligation/binding checks, canonical record bytes, citation checks
and truth gating apply to the complete selected population. Domain conditions
remain in the supplied evaluator. Production delta: seven added lines.

Frozen files relative to `build_tenants/odd_glc/typescript/`:

| File | SHA-256 |
| --- | --- |
| `src/program-construction-runtime.mjs` | `3a6386752c139df6c1742475af07503dc523a9a3624e80e2bb7e66b3327edeaa` |
| `test/program-construction.test.mjs` | `e076ad2834fe960d8c727e146e8a94bc727964911b6949ae65787b5d501137f7` |

One affected test invocation used exact installed core46 via `ABI5_COMPONENT_ROOT`
and `core-loader.mjs`, selecting `WP-01|PC04 finite|PC04 actual PC03` from
`test/program-construction.test.mjs`: **4 passed, 0 failed/skipped, 22.617 s**.
The new finite case uses the actual supplied evaluator for two dependents ×
two predecessors: complete true succeeds; omitted true/false/unknown evidence
refuses; included false/unknown stays unsatisfied. Missing output records,
duplicate edge identities, wrong declared digest and wrong producer duty also
refuse. Native premises are explicitly unadmitted synthetic values; no actors
or effects run. The existing actual PC03-state/publication/package/assessment
join passes, including future-produced inputs and comparison. Both changed
JavaScript files pass syntax checks; both repository whitespace checks pass.

Root returns to Executive with this source frozen. The same independent
Reviewer is selected for WP-01 delta verification only. PC05 remains held
pending its disposition; no installed/live outcome or release is claimed.
