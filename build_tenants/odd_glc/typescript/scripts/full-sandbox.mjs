#!/usr/bin/env node
// Public setup/one-start boundary. No semantic stage or application dispatch.
import { prepareFullSandbox, executeFullSandbox, freshFullSandboxReadback } from "../test/full-sandbox-support.mjs";

const [mode, path, extra, configurationPath, unexpected] = process.argv.slice(2);
if (unexpected !== undefined) throw new TypeError("too many arguments");
if (mode === "prepare" && path !== undefined && extra !== undefined && configurationPath !== undefined) {
  console.log(JSON.stringify(await prepareFullSandbox({ candidatePath: path, runRoot: extra, configurationPath }), null, 2));
} else if (mode === "run" && path !== undefined && configurationPath === undefined) {
  console.log(JSON.stringify(await executeFullSandbox(path, process.env, { afterReceiptPath: extra }), null, 2));
} else if (mode === "read" && path !== undefined && extra === undefined) {
  console.log(JSON.stringify(await freshFullSandboxReadback(path), null, 2));
} else {
  throw new TypeError("usage: full-sandbox.mjs prepare <frozen-candidate-basis.json> <empty-resource-root> <preparation-configuration.json> | run <job/prepared.json> [prior-close-receipt.json] | read <job/prepared.json>");
}
