# CLOSED — Node spec count interpretation

Worker gpt-6-astra / xhigh; bounded caller realization_refactor selected by Root. Source is frozen: subject-file SHA256 `f0db9055d3bd8a4e179c1037295efd672158ee22cce2693af573946aa44bc35b` ([exact pre/postimages](source-subject.json), [diff](source-diff.patch)).

Only two source paths changed: `build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs:719` (+1/−1) recognizes the existing TAP `#` and actual Node spec `ℹ` prefixes for pass/fail counts; `build_tenants/odd_glc/typescript/test/full-sandbox.test.mjs:261` adds one focused six-case regression (+20 lines). Count aggregation, minimum-count rule, observed-failure handling and independent semantic-review requirement are unchanged.

Both syntax checks passed. The affected three-test selection passed, zero failures/skips: existing successful Hello interpretation, existing verifier failure, and the new TAP/spec/missing-pass/missing-fail/insufficient-count/failed-count cases. A positive failure count is still rejected even when the process exit is zero. [Commands and timings](checks.json), [test output](check-3.log).

The offline [successor projection](projection.json), SHA256 `53fbe236599d9477771f2af7dbaa99bf9986c303a76417d7f7bcde072064e93c`, was recomputed once by the existing interpreter from the exact retained Public Result value and its command outputs. No installed read, native invocation, actor, journal access, build or package mutation occurred. [Recompute](recompute.mjs), [result](recompute.log).

The projection now reports `observed_pass` and `unqualified_pending_independent_semantic_review`. It recognizes the three test invocations as 2/0, 1/0 and 1/0 pass/fail; the unchanged aggregate is 4 against required 2, not a claim of four distinct tests. Independent semantic review remains `required`. The original `full-result-proof.json` remains byte-identical at SHA256 `52c18d8db519f5a1e7d62626d910c479a167e0408bf5a867021231daf4fcd767`; the Public Result remains byte-identical at `6798cf7d88155c214f36843ecc62f7f4a5793f05202bc80f1dac9c5799d2e454`. Both are linked as predecessor/source in the successor, retaining the original unqualified parser outcome.

The exact retained terminal value still has `applicationCoverage: non_closing` and all three residuals:
- `full_source_semantic_completeness_unassessed`
- `application_requirements_not_closed`
- `proof_depth_and_strength_unassessed`

Their Product construction owner is ABI `build_tenants/abiogenesis/typescript/code/src/product/semantic_job.ts:302–309` (literal residuals at 307); `isSemanticJobEnvelope` at 276–280 preserves the non-closing contract. Their observed source is the unchanged Public Result JSON path `receipt.ownerOutput.value.projection.terminalResult.value.remainingGaps`, with value digest `sha256:25d23c2ba1cdae14d60097abf3a070bd33b3330fcdaa778979d104a6483d6b10`. The caller’s independent review questions and pending disposition remain in `full-sandbox-support.mjs:744–751`. No residual is waived by the count correction or successful native execution.
