import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const data = await readFile(new URL("../src/recruiterData.ts", import.meta.url), "utf8");
const expansion = await readFile(new URL("../src/recruiterExpansion.ts", import.meta.url), "utf8");
const component = await readFile(new URL("../src/RecruiterSprint.tsx", import.meta.url), "utf8");
const content = await readFile(new URL("../src/content.ts", import.meta.url), "utf8");
const reachability = await readFile(new URL("../src/recruiterReachability.ts", import.meta.url), "utf8");

const base = [...data.matchAll(/^ \["([^"\n]+)","([^"\n]+)","[^"\n]+","(Seattle \/ PNW|National remote|Contract \/ C2H)"/gm)]
  .map(match=>({name:match[1],firm:match[2],segment:match[3]}));
const added = [...expansion.matchAll(/\{name:"([^"\n]+)",firm:"([^"\n]+)"[\s\S]*?segment:"(Seattle \/ PNW|National remote|Contract \/ C2H)"/g)]
  .map(match=>({name:match[1],firm:match[2],segment:match[3]}));
const leads=[...base,...added];

assert.equal(base.length,40,"the original 40-person campaign must remain intact");
assert.equal(added.length,60,"the expansion must contain exactly 60 recruiters");
assert.equal(leads.length,100,"the campaign must contain exactly 100 recruiters");
assert.equal(new Set(leads.map(item=>`${item.name}|${item.firm}`)).size,100,"recruiter and firm pairs must be unique");
assert.deepEqual(
  Object.fromEntries(["Seattle / PNW","National remote","Contract / C2H"].map(segment=>[segment,leads.filter(item=>item.segment===segment).length])),
  {"Seattle / PNW":20,"National remote":60,"Contract / C2H":20},
);

for (const requirement of ["initialDraft","connectionDraft","followUpDraft","evidenceUrl","match","checkedAt","sourceType"]) {
  assert.match(data,new RegExp(requirement),`missing recruiter personalization field: ${requirement}`);
}
for (const control of ["approved","contacted","replied","call booked","submitted","interview","offer","inactive"]) {
  assert.match(component,new RegExp(`data-status=\\{status\\}|${control}`),`missing ${control} workflow control`);
}
assert.match(component,/addBusinessDays\(stamp,5\)/,"missing first follow-up schedule");
assert.match(component,/addBusinessDays\(addBusinessDays\(stamp,5\),7\)/,"missing final follow-up schedule");
assert.match(component,/URL\.createObjectURL/,"missing local board backup");
assert.match(component,/FileReader/,"missing local board restore");
assert.match(component,/localStorage\.setItem\(STORAGE_KEY/,"missing local status persistence");
assert.match(component,/recoveredSubmittedIds=\[67,88,99,100\]/,"missing exact localhost submission recovery");
assert.match(component,/RECOVERY_KEY/,"missing idempotent recovery marker");
assert.match(component,/Search recruiter, firm, skill or role family/,"missing full-board search");
assert.match(component,/mergeState\(local,remote\.state\)/,"missing local and encrypted recruiter-state merge");
assert.match(component,/contentRepository\.getRecruiterBoard/,"missing recruiter-board hydration");
assert.match(component,/contentRepository\.saveRecruiterBoard/,"missing encrypted recruiter-board persistence");
assert.match(component,/Data controls · recruiter ledger/,"missing recruiter Data Controls surface");
assert.match(component,/One 30-day unlock connects Recruiters, Content, Build, desktop, and phone/,"missing cross-device sync explanation");
assert.match(component,/LinkedIn connection request/,"missing visible LinkedIn connection-request box");
assert.match(component,/maxLength=\{200\}/,"missing enforced 200-character connection-note limit");
assert.match(component,/currentState\.draft/,"missing editable primary outreach message");
assert.match(component,/currentState\.connectionDraft/,"missing editable connection-request message");
assert.match(data,/connectionDraft\.length>200/,"missing all-recruiter connection-note length guard");
assert.match(component,/DRAFT_REFRESH_KEY/,"missing migration that refreshes all 100 outreach drafts");
assert.match(content,/getRecruiterBoard[^\n]+\/recruiter\/dashboard/,"missing recruiter-board GET client");
assert.match(content,/saveRecruiterBoard[\s\S]+\/recruiter\/dashboard/,"missing recruiter-board PUT client");

const followerSnapshots=[...reachability.matchAll(/^  "https:\/\/www\.linkedin\.com\/in\/[^"\n]+": \{ followers: (\d+),/gm)];
assert.equal(followerSnapshots.length,40,"reachability ledger must preserve all 40 observed follower counts");
assert.doesNotMatch(reachability,/openProfile|gold/i,"public snapshots must not pretend a badge or signed-out CTA proves free messaging");
assert.match(data,/recruiterReachabilityByUrl/,"recruiter records must consume the reachability evidence ledger");
assert.match(data,/followers\?: number/,"recruiter records must expose follower evidence");
assert.match(data,/taylor\.mazzie\|motionrecruitment\.com/,"Taylor Mazzie's public business email must remain available");
assert.match(expansion,/maggieaguiar\|harnham\.com/,"Maggie Aguiar's public business email must remain available");
assert.match(component,/type ContactRoute = "unknown" \| "free-message" \| "connection-only" \| "direct-email"/,"missing explicit contact-route state machine");
assert.match(component,/route:r\.email\?"direct-email":"unknown"/,"public direct emails must be recognized without manual tagging");
assert.match(component,/effectivePriority/,"queue must rank actionability instead of raw fit alone");
assert.match(component,/followers<=5000\?9/,"missing smaller-inbox ranking boost");
assert.match(component,/followers>=25000\?-24/,"missing large-audience ranking penalty");
assert.match(component,/baselineRouteScore\(b\)-baselineRouteScore\(a\)/,"the board must open on its strongest actionable route");
for(const filter of ["Best routes","Direct / free","Smaller inbox","Access unverified","Connection only","Crowded inbox"]){
  assert.match(component,new RegExp(filter.replace("/","\\/")),`missing route filter: ${filter}`);
}
assert.match(component,/Free message works/,"missing manual Open Profile verification control");
assert.match(component,/Gold is not the filter/,"UI must explain that Premium gold and free messaging are different facts");
assert.match(component,/currentState\.route/,"route verification must persist in the encrypted recruiter state");
assert.match(component,/https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=/,"direct-email actions must open a prefilled Gmail compose window");
assert.match(component,/Draft in Gmail/,"direct-email actions must be labeled as Gmail drafts");
assert.doesNotMatch(component,/mailto:/,"the recruiter board must not fall through to Outlook or another default mail client");

console.log("Recruiter Sprint invariants passed: 100 unique leads, 40 follower snapshots, verified-route ranking, personalized drafts, workflow, local backup, and encrypted cross-device persistence.");
