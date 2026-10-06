import { existsSync, readFileSync } from "node:fs";

const required = [
  "src/BuildStudio.tsx",
  "src/ContentStudio.tsx",
  "src/buildStudio.css",
  "src/contentStudio.css",
  "src/content.ts",
  "scripts/generate-control-plane-snapshot.mjs",
  "scripts/generate-public-build-snapshot.mjs",
  ".github/workflows/refresh-build-snapshot.yml",
  "public/data/build-snapshot.json",
  "src/generated/privateSnapshot.ts",
];
for (const file of required) if (!existsSync(file)) throw new Error(`Missing Control Plane surface: ${file}`);

const app = readFileSync("src/App.tsx", "utf8");
if (!app.includes("<BuildStudio/>") || !app.includes("<ContentStudio/>")) throw new Error("App is not routing through the real Build and Content surfaces.");

const generated = readFileSync("src/generated/privateSnapshot.ts", "utf8");
for (const marker of ["contributionDays", "recentCommits", "relationships", "accounts", "ideas"]) {
  if (!generated.includes(`\"${marker}\"`)) throw new Error(`Generated snapshot is missing ${marker}.`);
}
const contentRepository = readFileSync("src/content.ts", "utf8");
for (const marker of ["/content/dashboard", "/content/manual", "/content/${provider}/authorize", "/build/dashboard", "Authorization:`Bearer ${token}`", "lcp-content-metrics-v2"]) {
  if (!contentRepository.includes(marker)) throw new Error(`Private content API boundary is missing ${marker}.`);
}
const buildSurface=readFileSync("src/BuildStudio.tsx","utf8");
if(!buildSurface.includes("daily public GitHub sync")||!buildSurface.includes("configureGitHub"))throw new Error("Build surface is missing daily/private GitHub refresh paths.");
const workflow=readFileSync(".github/workflows/refresh-build-snapshot.yml","utf8");
if(!workflow.includes("schedule:")||!workflow.includes("generate-public-build-snapshot.mjs"))throw new Error("Daily GitHub workflow is incomplete.");
if (!readFileSync(".gitignore", "utf8").includes("src/generated/privateSnapshot.ts")) throw new Error("Private snapshot must remain outside Git history.");
console.log("Content and Build surface verification passed.");
