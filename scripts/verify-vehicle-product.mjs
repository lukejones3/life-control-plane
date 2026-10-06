import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const model = await readFile(new URL("../src/vehicle.ts", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

for (const field of ["sourceLabel", "observedAt", "connectors", "events", "sync"]) {
  assert.match(model, new RegExp(`\\b${field}\\b`), `vehicle contract must include ${field}`);
}
for (const endpoint of [
  "/v1/vehicles/primary/dashboard",
  "/v1/vehicles/primary/manual-snapshot",
  "/v1/vehicles/primary/sync",
]) {
  assert.match(model, new RegExp(endpoint), `vehicle repository must implement ${endpoint}`);
}
assert.match(model, /coverage \* \.25 \+ freshness \* \.25 \+ integrity \* \.2 \+ actionClosure \* \.15 \+ automationHealth \* \.15/, "Vehicle Sync weights must remain explicit and deterministic");
assert.match(app, /Product demo · source-aware vehicle/, "Car Plane must identify synthetic demo state");
assert.match(app, /VehicleReading/, "Car Plane must show field-level evidence");
assert.doesNotMatch(app.slice(app.indexOf("function CarView"), app.indexOf("function Metric")), /<img|photo|Wikimedia/i, "Car Plane must not reintroduce fetched vehicle imagery");
assert.match(styles, /@media\(max-width:650px\).*vehicle-connectors/s, "Car Plane must retain a mobile connector layout");

console.log("Vehicle product invariants passed: typed evidence, deterministic sync, API contract, no vehicle imagery, and mobile layout verified.");
