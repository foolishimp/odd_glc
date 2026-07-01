# SCN-GLC-HELLO-WORLD-RUST-CLI - Rust CLI Hello World

**Status**: Active
**Date**: 2026-06-29
**Derives from**: [SCN-GLC-HELLO-WORLD-LADDER](SCN-GLC-HELLO-WORLD-LADDER.md),
[T-008](../../.ai-workspace/tickets/completed/T-008-govern-hello-world-scenario-ladder.md)

---

## Purpose

Prove that lifecycle interpretation is not tied to JavaScript or Node.js.

The scenario exercises a declared toolchain capability, command working
directory, generated manifest/source assets, and stdout proof through ABG-owned
execution evidence.

## odd_sdlc Witness

The source witnesses are the Rust minimum-overhead and Rust-lite Hello World
behaviors from `odd_sdlc`.

Witness behavior:

- generate `build_tenants/hello_world_rust/Cargo.toml`;
- generate `build_tenants/hello_world_rust/src/main.rs`;
- run `cargo run --quiet` from the tenant root;
- prove exact `Hello, world!` stdout.

## Generic Lifecycle Capability

Non-JS toolchain execution proof.

Any governed lifecycle may require a domain-specific capability contract with
toolchain, cwd, env, and process evidence.

## Trace

1. GTL declares Cargo manifest, Rust source, and Cargo execution capability
   refs.
2. ABG admits requirement pressure for declared files and stdout behavior.
3. ABG admits generated Cargo/source assets.
4. ABG invokes `cargo run --quiet` as the proof edge.
5. ABG binds exit status and stdout evidence to the requirement projection.
6. odd_glc interprets the capability and evidence binding as lifecycle proof.

## Closure Expectation

The scenario closes only when admitted ABG evidence proves Cargo execution and
stdout against the active requirement projection.

odd_glc does not infer Rust build success from file presence, worker prose, or
local command logs.
