import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const main = await readFile(new URL("../src/main.tsx", import.meta.url), "utf8");
const worker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");

assert.match(packageJson.scripts["build:private"], /^VITE_PLATFORM_AUTH=true /, "private builds must force platform auth");
assert.match(packageJson.scripts["deploy:private"], /^npm run build:private /, "private deploys must use the protected build");
assert.match(app, /if \(!platformAuth && \(!credential \|\| !unlocked\)\)/, "the local passcode must be bypassed behind platform auth");
assert.match(main, /sw\.js\?auth=\$\{authMode\}/, "the service worker must receive the authentication mode");
assert.match(worker, /if \(event\.request\.method !== "GET" \|\| PLATFORM_AUTH\) return;/, "protected builds must not cache authenticated responses");
assert.match(worker, /event\.request\.mode === "navigate"/, "demo navigation responses must not be cached as authentication state");
assert.doesNotMatch(worker, /caches\.match\(BASE\)/, "navigation must never fall back to a cached app shell");

console.log("Authentication boundary invariants passed: private build flag, shared edge auth, and cache isolation verified.");
