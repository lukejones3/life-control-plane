import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const API = "https://api.vercel.com";
const outputDirectory = "dist";
const token = process.env.VERCEL_TOKEN;
const projectName = process.env.VERCEL_PROJECT_NAME || "life-control-plane";
const teamId = process.env.VERCEL_TEAM_ID;

if (!token) {
  console.error("VERCEL_TOKEN is required. Create an access token in Vercel and pass it only as an environment variable.");
  process.exit(1);
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return nested.flat();
}

function endpoint(path) {
  const url = new URL(path, API);
  if (teamId) url.searchParams.set("teamId", teamId);
  return url;
}

async function api(path, options = {}) {
  const response = await fetch(endpoint(path), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
  const body = await response.text();
  let data;
  try { data = body ? JSON.parse(body) : {}; } catch { data = { message: body }; }
  if (!response.ok) {
    const message = data.error?.message || data.message || response.statusText;
    throw new Error(`Vercel API ${response.status}: ${message}`);
  }
  return data;
}

const paths = await filesIn(outputDirectory);
if (!paths.length) throw new Error("dist is empty; run the production build first.");

const files = await Promise.all(paths.map(async path => {
  const contents = await readFile(path);
  return {
    path,
    contents,
    file: relative(outputDirectory, path).split(sep).join("/"),
    sha: createHash("sha1").update(contents).digest("hex"),
    size: (await stat(path)).size,
  };
}));

for (const file of files) {
  process.stdout.write(`Uploading ${file.file}... `);
  await api("/v2/files", {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream", "x-vercel-digest": file.sha },
    body: file.contents,
  });
  console.log("done");
}

const deployment = await api("/v13/deployments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: projectName,
    target: "production",
    files: files.map(({ file, sha, size }) => ({ file, sha, size })),
    projectSettings: { framework: null },
  }),
});

let current = deployment;
for (let attempt = 0; attempt < 60 && !["READY", "ERROR", "CANCELED"].includes(current.readyState); attempt += 1) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  current = await api(`/v13/deployments/${deployment.id}`);
}

if (current.readyState !== "READY") {
  throw new Error(`Deployment did not become ready (state: ${current.readyState || "unknown"}).`);
}

console.log(`\nPhone URL: https://${current.alias?.[0] || current.url}`);
