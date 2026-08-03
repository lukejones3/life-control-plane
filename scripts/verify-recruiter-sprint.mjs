import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const data = await readFile(new URL("../src/recruiterData.ts", import.meta.url), "utf8");
const component = await readFile(new URL("../src/RecruiterSprint.tsx", import.meta.url), "utf8");
const seeds = [...data.matchAll(/^ \["([^"\n]+)","([^"\n]+)","[^"\n]+","(Seattle \/ PNW|National remote|Contract \/ C2H)"/gm)];

assert.equal(seeds.length, 40, "the campaign must contain exactly 40 recruiter seeds");
assert.equal(new Set(seeds.map(match => `${match[1]}|${match[2]}`)).size, 40, "recruiter and firm pairs must be unique");
assert.deepEqual(
  Object.fromEntries(["Seattle / PNW", "National remote", "Contract / C2H"].map(segment => [segment, seeds.filter(match => match[3] === segment).length])),
  { "Seattle / PNW": 20, "National remote": 10, "Contract / C2H": 10 },
);
for (const control of ["Approve", "Mark sent", "Replied", "Call booked", "Submitted"]) {
  assert.match(component, new RegExp(`>${control.replace(" ", "\\s+")}<`), `missing ${control} workflow control`);
}
assert.match(component, /addBusinessDays\(today,5\)/, "missing first follow-up schedule");
assert.match(component, /addBusinessDays\(addBusinessDays\(today,5\),7\)/, "missing final follow-up schedule");
console.log("Recruiter Sprint invariants passed: 40 unique leads, 20/10/10 segmentation, workflow and follow-ups present.");
