# T-167 Non-Closed Proof Correction

**Project**: odd_glc
**Date**: 2026-06-30
**Status**: T-014 reopened

## Finding

The ABI T-167 artifact consumed by odd_glc is not execution-grounded closure
evidence. The ABI producer is `npm run test:t167`, not a live script. Its run
directory carries `non-closed-requirement.txt` plus replay artifact files, but
no live worker/process capture comparable to the live T-160, T-168, T-169, or
T-174 runs. The producing test uses `partialFpEvaluatorPlugin`, defaults
`closeDisposition` to `no_close`, and the requirement text carries the
non-closure answer.

This is a substrate-proof defect, not an odd_glc boundary breach. odd_glc did
not emit, admit, fold, residualize, retry, or route continuation. It interpreted
the supplied ABI artifact read-only. The artifact was the wrong class of proof.

## Correction

- `T-014` is moved back to active.
- `specification/GOALS.md` now marks the generic lifecycle interpretation wave
  as partially earned.
- `substrate.provenance.json` classifies the T-167 artifact as
  `synthetic_engine_mechanics` with `blocked_live_proof_missing`.
- The T-167 odd_glc test name and assertions now prevent treating the artifact
  as closure evidence.
- The source checkpoint record is qualified rather than reverted.

## Boundary

The fix belongs upstream in ABI. odd_glc must wait for a digest-pinned live
non-closed requirements-route artifact, then consume it through the same
read-only interpretation surface.
