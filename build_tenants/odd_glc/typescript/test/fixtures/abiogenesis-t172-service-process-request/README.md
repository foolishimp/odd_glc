# ABIogenesis T-172 Service Process Request Fixture

This fixture is a committed copy of the ABIogenesis T-172 live replay artifact
used by odd_glc for the Rust service/client Hello World ladder rung.

Source:

- product: `abiogenesis`
- release: `4.1.0-rc.17`
- ticket: `T-172`
- run id: `20260629T140453156Z_pid14978`
- source manifest:
  `/Users/jim/src/apps/abiogenesis/build_tenants/abiogenesis/typescript/test_env/test_runs/t172_service_process_request_live/20260629T140453156Z_pid14978/service-process-request-replay-manifest.json`
- artifact sha256:
  `sha256:0f817cd642667bf042fcb408884fbac5130eb83650ec4a5da9a166b105369c87`

The fixture is ABG replay truth for a generic process/request capability.
Service readiness, protocol semantics, response acceptability, and cleanup
policy are proof-binding or downstream plugin policy. odd_glc tests may read
the artifact, verify its digest, and interpret lifecycle/evidence/fold/
disposition views. They must not use it as authority to emit, mint, admit,
execute, supervise processes, issue requests, bind evidence, fold requirements,
residualize, or route continuation locally.
