import fs from "node:fs";

const data = fs.readFileSync(new URL("../src/apartmentData.ts", import.meta.url), "utf8");
const planner = fs.readFileSync(new URL("../src/MovePlanner.tsx", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const ids = [...data.matchAll(/\bid: "([^"]+)"/g)].map((match) => match[1]);
const rents = [...data.matchAll(/\brent: (\d+)/g)].map((match) => Number(match[1]));
const highRents = [...data.matchAll(/\brentHigh: (\d+)/g)].map((match) => Number(match[1]));
const squareFeet = [...data.matchAll(/\bsquareFeet: (\d+)/g)].map((match) => Number(match[1]));

assert(ids.length === 25, `Expected 25 screened apartment candidates; found ${ids.length}.`);
assert(new Set(ids).size === 25, "Apartment IDs must be unique.");
assert((data.match(/cats: true, laundry: "In-unit"/g) || []).length === 25, "Every candidate must explicitly pass both the cat and in-unit laundry screens.");
assert(rents.length === 25 && rents.every((rent) => rent <= 2400), "Every base rent must remain at or below $2,400.");
assert(highRents.every((rent) => rent <= 2400), "Every displayed high rent must remain at or below $2,400.");
assert(squareFeet.length === 25 && squareFeet.every((size) => size >= 630), "Every candidate must clear the hard 630 sq ft minimum.");
assert(!/Capitol Hill|Downtown Seattle/i.test(data), "Excluded central neighborhoods cannot enter the candidate dataset.");
assert(!/South Seattle|Renton|Tukwila|SeaTac/i.test(data), "The search cannot drift south.");
for (const area of ["Shoreline", "Edmonds", "Mountlake Terrace", "Kenmore", "Bothell", "Kirkland"]) {
  assert(data.includes(area), `Expanded search field must include ${area}.`);
}
assert((data.match(/sourceUrl: "https:\/\//g) || []).length === 25, "Every candidate needs a live HTTPS evidence link.");
assert(planner.includes("lcp-apartment-planner-v2"), "Replacement planner status and notes must persist locally.");
assert(planner.includes("seattle.gov/police") && planner.includes("seattle.gov/trees"), "Planner must expose official street-context and canopy research tools.");
assert(planner.includes("washington-apartment-search.json"), "Planner must support portable JSON backup.");
assert(app.includes('import { MovePlanner } from "./MovePlanner"') && app.includes("return <MovePlanner/>"), "The Move view must render the apartment planner.");

console.log("Apartment planner verification passed: 25 unique candidates all clear 630 sq ft, cat, laundry, geography, rent, evidence, persistence, maps, and controls.");
