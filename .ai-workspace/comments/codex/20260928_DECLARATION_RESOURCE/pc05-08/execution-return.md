# PC05-08 — installed host schema refusal

The core49 installed suffix closed `runtime_failed`. The pinned Claude2.1.280
host rejected the unchanged consumer schema: `no schema with key or ref
"https://json-schema.org/draft/2020-12/schema"`. Transport exits1 with
`transport_failure`; stdout/final output are empty. No valid assessment or
terminal Result was admitted. No model usage is reported; this is not evidence
of a successful LLM context. Fresh Public Result is absent and replay is failed.
[Result](execution/result.json), [fresh reads](execution/fresh-readback.json).

Run `72b259268b50397cee107c93dcce0dbf62beff1bced85dc88d4ffec559134259`,
digest `4c1391d7d3ce5d62c4fe73d85be8efb62805ed4a4fadbbcd4cab03009041c632`,
contains11 GraphCalls,18 CCalls and one actor invocation occurrence. That
occurrence counts host invocation, not a completed model response. No author
or C2 was repeated. Original04 author,05 selection, source/oracle and twelve
reports remain selected unchanged. Source and independent response validation
remain authoritative; no schema translation, text fallback or repair occurred.

| Phase | Observed elapsed |
| --- | ---: |
| Packaging/preflight | 14.554 s |
| Installation | 61.594 s |
| Remaining setup | 61.512 s |
| Run | 176.844 s |
| Invocation start to prompt timestamp, included in Run | 169.379 s |
| Fresh Public Result | 98.184 s |
| Fresh Public replay | 98.896 s |
| Two fresh readback processes, combined | 198.468 s |

These elapsed intervals are not CPU attribution or justified minimums. The
host refusal does not explain the preceding169 s framework interval. Existing
LIFE-01/CALLER-DURABLE-CONTEXT-01 cost findings remain open. The Run appends
51,235,907 B and genuinely closes at1,354,273,180 B, coordinate
`4222dc3ba916d002290b5f75ae8134630cca1413e8f04af5d1ff4d70e4b0c94d`.
No further journal inspection or recovery was needed to identify the host cause.
No process remains running.

Core49's source/adapter correction retains its accepted scope and demonstrates
truthful unsupported-host refusal. Successful installed typed assessment and
PC06 original-condition closure remain unproved. Executive selects bounded
read-only consumer-schema portability triage before another attempt. The host
argument is not silently stripped or weakened. No implementation or paid retry
is selected by this failed result. The shared journal remains a local dependency;
this receipt is not a self-contained remote replay archive.
