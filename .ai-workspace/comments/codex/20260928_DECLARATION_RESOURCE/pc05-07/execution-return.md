# PC05-07 — malformed native assessment refused

The installed preserved-construction suffix closed `runtime_failed`. The actual
host reported successful process completion but its final text is invalid JSON:
`"criterionRef":"criterion":"criterion://...` at character offset6218.
ABG correctly refused this output as `contract_failure`; no valid native
assessment or terminal Result was admitted. Fresh Public Result is `not_found`
and fresh replay records failure. [Result](execution/result.json),
[fresh reads](execution/fresh-readback.json). The failed raw output remains
unchanged; its SHA-256 is
`f3ef35a058acfed2823065d2c49ef5721e1b3ef51f6194ef18073f830865a2c0`.

Run `5489260a43960ca595034fb3f8422c05ac1a60004f8721dcaf02221717c3fbf2`,
digest `59d6b57bb27e3e54cfa76945ed1c9f6b7935f737e89ae815bc722945581fab3b`,
made eleven GraphCalls and eighteen CCalls with one actual Opus5.5/xhigh
assessor through Claude Code2.1.280. There was no repeated author or C2 call.
The prior accepted PC05-06 runtime proof and its unsatisfied assessment retain
their original identities. Neither host success nor this refusal closes the
original source obligations. No process remains active.

| Phase | Observed elapsed |
| --- | ---: |
| Packaging and preflight | 14.139 s |
| Installation | 57.599 s |
| Remaining setup | 59.174 s |
| Exact source-selection reuse, included in setup | 0.149 s |
| Run | 446.681 s |
| Native host actor, included in Run | 276.803 s |
| Fresh Public Result | 92.711 s |
| Fresh Public replay | 92.947 s |
| Two fresh readback processes, combined | 186.965 s |

Host usage is seven turns and $2.727639:14 input,242,779 cache-creation input,
1,426,455 cache-read input and25,003 output tokens. These are reported usage
fields, not credits. Run minus host duration is169.878 s of elapsed time;
it is not CPU attribution or a justified framework minimum.

The [closed-suffix diagnostic](execution/diagnostic-suffix.json) reads the
54,794,116-byte appended range once, after closure, with the installed body
codec. Its range digest is
`7dd1929e2ed2dea59459748818cb2a8133eecc80e7c6b73b36f082bf72b0e3a1`;
1,490 rows resolve with no unresolved body references. The read takes4.917 ms,
the bounded diagnostic349.429 ms. File identity, length and mtime remain
unchanged. This raw inspection supplies diagnostics, not event admission or a
replacement for fresh Public truth.

[Phase intervals](execution/phase-intervals.json) refine the earlier read-only
framework-cost review:83.411 s invocation-to-first-admission,9.326 s
first-admission-to-Run-open,69.620 s Run-open-to-actor-invocation. Start to
prompt timestamp is162.381 s. Child graph durations overlap and must not be
summed. These wall intervals remain unattributed cost observations under
CALLER-DURABLE-CONTEXT-01/LIFE-01; data volume alone does not justify them.
The journal closes at1,300,706,344 B, coordinate
`bf814513652de6f9ea9cb9c078496bc636d60b9a0deba0f704e7da587df4d370`.

The [closed response diagnosis](../../../../../../abiogenesis/.ai-workspace/comments/codex/20260928_DECLARATION_RESOURCE/pc05-structured-response-01/return.md)
finds that current native-assessment HOW deliberately suppresses the host
schema option. Executive selects a bounded HOW/transport repair to pass the
same admitted schema and consume the host's final structured-result carrier,
retaining full independent validation. No returned-text repair, schema weakening,
permission change, budget increase or automatic paid retry is selected.
[PC06](../pc06/evidence-join-preparation.md) remains a prepared fifteen-binding
join, not acceptance. S06, qualification, RC1 and human acceptance remain open.
The shared mutable event journal stays a local dependency, not a remotely
self-contained replay archive.
