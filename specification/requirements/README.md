# odd_glc Requirements

Project-specific requirement families live in this folder.

Use these method surfaces as governing references:

- `../GOVERNANCE.md`, which selects the complete immutable STDO `v2.3.0`
  distribution and governs exact upstream member access

## Rules

- Write requirement families as separate `*.md` files.
- Use deterministic requirement ids in the form `REQ-GLC-...`.
- Make status and category explicit in each family header.
- Link each active family to its source authority.
- Link each active family to authoring design when design exists.
- Keep ABG/GTL substrate requirements out of `odd_glc` unless this project is
  declaring a consumption contract or downstream specialization boundary.
- Do not encode `odd_sdlc` domain policy as generic lifecycle law without
  generalization and ratification.

## Initial Families To Author

- lifecycle boundary and authority:
  [REQ-GLC-BOUNDARY-AUTHORITY](REQ-GLC-BOUNDARY-AUTHORITY.md);
- lifecycle typed assets and vocabulary:
  [REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS](REQ-GLC-LIFECYCLE-VOCABULARY-ASSETS.md);
- requirements-algebra consumption and GTL/ABG system-function binding
  contract:
  [REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION](REQ-GLC-ABG-REQUIREMENTS-ALGEBRA-CONSUMPTION.md);
- lifecycle read models, query, proof, fold interpretation, residual pressure,
  and re-entry:
  [REQ-GLC-READ-QUERY-PROOF](REQ-GLC-READ-QUERY-PROOF.md);
- downstream product/program specialization contract:
  [REQ-GLC-DOWNSTREAM-SPECIALIZATION](REQ-GLC-DOWNSTREAM-SPECIALIZATION.md);
- release and operational-feedback interpretation:
  [REQ-GLC-RELEASE-OPERATIONAL-FEEDBACK](REQ-GLC-RELEASE-OPERATIONAL-FEEDBACK.md).
