# ABIogenesis T-166 Route Replay Fixture

This fixture is the proof input for odd_glc route-1 replay consumption.

Source run:

- ABIogenesis ticket: `T-166`
- Live proof source: `T-165` Hello World requirements route
- Run id: `20260628T175945864Z_pid34852`
- Artifact digest:
  `sha256:4ba42598bbf309b4568d5d167dc395f31799d32bd5b8fd7b78f76131494fd10e`

The copied `requirements-route-replay-manifest.json` is the ABI-generated
manifest from the source run. Its embedded `artifact.path` names the original
ABIogenesis run location. odd_glc treats the committed artifact bytes plus the
recorded digest as the fixture-of-record.
