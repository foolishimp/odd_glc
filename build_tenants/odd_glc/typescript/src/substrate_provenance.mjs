import { readFileSync } from "node:fs";

function deepFreeze(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }
  return Object.freeze(value);
}

export const ABIOGENESIS_SUBSTRATE_PROVENANCE = deepFreeze(
  JSON.parse(
    readFileSync(new URL("../substrate.provenance.json", import.meta.url), "utf8")
  )
);
