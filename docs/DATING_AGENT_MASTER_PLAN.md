# Dating Plane: product master plan

Status: product and architecture recommendation
Research cutoff: 2026-08-08
Portfolio: Life Control Plane

## Executive decision

Build **Dating Plane** as a private, approval-first operating layer for a
person's real dating life. Do not begin by building another dating marketplace,
an autoswiper, or a chatbot that writes pickup lines.

The product's job is:

> Help a person date with clarity, continuity, safety, and real-world
> follow-through while keeping the person fully and recognizably themselves.

The initial wedge begins after discovery. A user can bring in a connection from
an app, an introduction, an event, or ordinary life; carry forward the useful
context; decide whether there is enough genuine interest to meet; plan a good
and safe date; reflect on what actually happened; and either continue, close,
or graduate the connection into the broader Relationships module.

This is a substantially better product thesis than AI message writing:

- it solves coordination and memory problems that remain after a match;
- it can work across dating apps without violating their automation rules;
- it improves the path to human contact instead of impersonating the user;
- it can learn from lived outcomes, which are more informative than profiles;
- it fits the Life Control Plane's event, approval, calendar, people, money,
  notification, and audit primitives;
- it has a credible subscription model that does not depend on keeping people
  swiping.

The product title remains **Life Control Plane**. Dating Plane is a reusable
module, never a city-specific app or a replacement title.

## 1. What the research says

### 1.1 The pain is not “people cannot produce clever sentences”

In Pew's most recent broad U.S. study, 53% of people who had used online dating
described the experience positively and 46% negatively. The sharper product
problems were overload, insecurity, scams, and harassment: 52% believed they
had encountered a scammer, and 48% had experienced at least one of four tested
unwanted behaviors. These experiences also varied materially by gender and
sexual orientation. The product therefore cannot treat all daters as having the
same workflow or risk profile. [Pew Research Center](https://www.pewresearch.org/internet/2023/02/02/the-experiences-of-u-s-online-daters/)

The financial risk is not theoretical. The FBI recorded 17,910
confidence/romance complaints and $672 million in reported losses in 2024.
[FBI IC3 2024 report](https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf)

The implication is not to frighten the user or label strangers as dangerous.
It is to make identity uncertainty, suspicious financial requests, safe meeting
logistics, reporting, and trusted-contact check-ins first-class product states.

### 1.2 Pre-meeting “compatibility” is a weak place to make grand claims

A major review of online dating research found real value in access and initial
communication, but concluded that profiles flatten people, very large choice
sets can encourage shallow comparison, and pre-interaction matching data is
unlikely to predict long-term compatibility well. The review also found that
extended computer-mediated communication can create expectations that do not
survive meeting in person. [Finkel et al., 2012](https://faculty.wcas.northwestern.edu/eli-finkel/documents/2012_FinkelEastwickKarneyReisSprecher_PSPI.pdf)

Speed-dating research found that stated trait preferences were largely
independent of whom participants actually liked, felt chemistry with, or wanted
to see again. This does **not** mean preferences are meaningless. It means the
product should distinguish hard eligibility constraints from predictions about
felt attraction. [Eastwick and Finkel, 2008](https://faculty.wcas.northwestern.edu/eli-finkel/documents/PageProofs9-13-07.pdf)

Once a relationship exists, process variables become much more informative. A
machine-learning analysis across 43 longitudinal couples datasets found the
strongest self-report predictors of relationship quality included perceived
partner commitment, appreciation, sexual satisfaction, perceived partner
satisfaction, and conflict. [Joel et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7431040/)

Product inference: the agent should not announce that two profiles are “93%
compatible.” It may enforce user-selected dealbreakers and logistical
constraints, but it should learn primarily from the user's actual meetings and
the developing relationship process. It should keep three concepts separate:

1. **Eligibility:** explicit constraints such as age range, relationship intent,
   distance, availability, or a user-defined dealbreaker.
2. **Personal interest:** whether this user wants another interaction, learned
   from their own reported experience rather than a universal desirability
   model.
3. **Relationship process:** observed reciprocity, respect, follow-through,
   communication, conflict, and repair after interaction has begun.

### 1.3 The industry is already commoditizing profile and message assistance

Hinge's current Convo Starters generate topical suggestions but intentionally do
not draft messages, and Bumble has launched AI profile guidance. These are
features inside large distribution platforms, not a durable standalone moat.
[Hinge Convo Starters](https://help.hinge.co/hc/en-us/articles/46735258688659-What-are-Convo-Starters),
[Bumble profile guidance](https://ir.bumble.com/news/news-details/2026/Bumble-Announces-Two-New-Features-For-Confidence-and-Clarity-in-Dating-2026-36eaJ_omGR/default.aspx)

Meanwhile, the dominant industry language has shifted toward match quality,
authenticity, safety, intentionality, and getting people into the real world.
Match Group now states directly that technology should help human connection,
not replace it. [Match Group 2025 results](https://ir.mtch.com/investor-relations/news-events/news-events/news-details/2026/Match-Group-Announces-Fourth-Quarter-and-Full-Year-Results/)

The open product space is therefore not “better lines.” It is a trusted,
cross-source operating layer that helps a person convert opportunity into a
well-run real dating life.

### 1.4 Platform automation is a hard boundary

Hinge explicitly prohibits bots, scraping, autoswipers, and other automated
tools, and Tinder prohibits robots, crawlers, data-mining tools, and automatic
access. An account connection built through browser automation would be a
fragile product foundation and could cause users to lose their accounts.
[Hinge automation policy](https://help.hinge.co/hc/en-us/articles/49657802257683-Note-on-Third-Party-Automated-Tools),
[Tinder terms](https://policies.tinder.com/terms/intl/en-gb/)

User-initiated data portability is different from automation. Hinge and Tinder
offer exports, but they are asynchronous and uneven; Hinge explicitly excludes
other members' personal information from its export. These are useful for
periodic personal-history import, not live synchronization.
[Hinge data export](https://help.hinge.co/hc/en-us/articles/360011235813-How-do-I-request-a-copy-of-my-personal-data),
[Tinder data export](https://www.help.tinder.com/hc/en-us/requests/new?ticket_form_id=360000234472)

Therefore:

- no autoswiping, scraping, browser automation, password collection, or session
  cookie capture;
- no “Connect Hinge/Tinder” button without a written partner API agreement;
- use manual capture, user-invoked sharing, and user-requested exports;
- let the user return to the source app to author and send every message.

### 1.5 Privacy is part of the core product, not a policy page

A dating system naturally encounters precise location, message content,
religious beliefs, racial or ethnic identity, sexual orientation, sex-life
information, and potentially biometrics. California currently classifies many
of these as sensitive personal information and explicitly includes inferences
and AI systems capable of outputting personal information in its definitions.
[California Civil Code §1798.140](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.140.)

The GDPR treats data concerning sex life or sexual orientation as special
category data and imposes additional rules around profiling and solely
automated decisions with significant effects. [GDPR Articles 9 and 22](https://eur-lex.europa.eu/eli/reg/2016/679/oj)

The system also stores information about people who are not customers and have
not agreed to be profiled. That relational-privacy issue is more important than
whether a note is technically “public.” The default should be minimal,
purpose-limited, short-lived storage with clear provenance and deletion.

This section is a product architecture constraint, not legal advice. Privacy,
consumer-protection, biometric, age-assurance, and state dating-service rules
require counsel review before a public launch.

### 1.6 Safety tools must support judgment, not manufacture certainty

Current official guidance recommends keeping early communication controlled,
using phone or video as an optional screen, meeting in populated public places,
telling a trusted person the plan, and retaining control of transportation.
[Hinge safe-dating guidance](https://help.hinge.co/hc/en-us/articles/360007194774-Safe-Dating-Advice)

Verification is a signal, not a guarantee. Tinder itself says its photo badge
does not guarantee identity or safety. [Tinder photo verification](https://www.help.tinder.com/hc/en-us/articles/360034941812-Photo-Verification)

The agent should therefore say what has and has not been verified, never display
a proprietary “safe person” score, and never present a background check as proof
that a person is safe.

### 1.7 Distribution policy favors this differentiated thesis

Apple says dating is a saturated category and may reject a new dating app that
is not meaningfully different. It also requires filtering, reporting, blocking,
and reachable support for user-generated content. Google Play likewise requires
in-app reporting and blocking for relevant UGC and one-to-one interaction.
[Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/),
[Google Play UGC policy](https://support.google.com/googleplay/android-developer/answer/9876937)

An after-match private operating layer is meaningfully different from another
swipe deck. A later marketplace would trigger much heavier moderation, support,
identity, fraud, and distribution obligations.

## 2. Product contract

### 2.1 Primary user

Start with adults who:

- date intentionally but may be open to different relationship structures;
- already meet people through one or more apps, friends, events, or ordinary
  life;
- want a small number of real possibilities rather than an infinite queue;
- lose context, delay decisions, or struggle to turn a promising interaction
  into a concrete plan;
- care about privacy and do not want an AI pretending to be them.

Do not optimize the first release for minors, anonymous chat, automated high
volume outreach, paid matchmakers managing clients, covert partner monitoring,
or people seeking an AI romantic companion.

### 2.2 Jobs to be done

1. **Orient me.** Help me state what I am looking for now, how much time and
   energy I actually have, and which constraints are real.
2. **Keep the thread.** Preserve the few facts, questions, plans, and promises
   that matter without making me build a dossier.
3. **Help me decide.** Show which connection needs a decision, what is known,
   what is merely inferred, and the smallest honest next step.
4. **Get us into the real world.** Propose date times and places that fit both
   the user's constraints and the current level of trust.
5. **Help me stay safe.** Make a public-place plan, transportation plan, trusted
   contact share, and check-in easy without claiming to eliminate risk.
6. **Help me learn.** Capture what the user actually felt and observed after a
   date, then surface tentative patterns only when enough evidence exists.
7. **Close loops cleanly.** Continue, pause, archive, delete, or graduate a
   connection without turning people into a game score.

### 2.3 Product principles

- **Human authored:** The user sends the message and makes the relational
  decision.
- **Real-world biased:** The system rewards clear decisions and appropriate
  meetings, not screen time or message volume.
- **Small active set:** Optimize for a manageable set of current connections,
  not endless inventory.
- **Evidence before interpretation:** Facts, user reports, and agent hypotheses
  are visibly different objects.
- **Approval before external effect:** Calendar writes, reservation handoffs,
  trusted-contact shares, reports, and any future message handoff require a
  preview and explicit confirmation.
- **Minimum necessary data:** A useful memory is not a surveillance archive.
- **No universal desirability:** Never assign attractiveness, league, mate
  value, red-flag, or personality-disorder scores.
- **Success may end usage:** A relationship, a satisfying pause, or a clear
  decision to stop dating is a legitimate successful outcome.
- **Plural by design:** Do not silently assume heterosexuality, monogamy,
  marriage, gender roles, or one ideal pace.

### 2.4 Explicit non-goals

The product will not:

- write pickup lines, imitate a user's voice, or maintain a conversation for
  them;
- send, like, swipe, match, unmatch, report, book, or share without explicit
  approval;
- score a person's worth, attractiveness, safety, honesty, or long-term
  compatibility;
- diagnose attachment style, pathology, manipulation, or intent from messages;
- conduct covert background checks, face searches, or social-media dossiers;
- infer protected or intimate traits that the user or other person did not
  explicitly supply for a necessary purpose;
- train shared models on private conversations, notes, images, or debriefs;
- sell, advertise against, or broker relationship data;
- become an emotional substitute for the relationships it is meant to support.

## 3. The golden user journey

### Stage 1: Set the current dating contract

The onboarding is a short conversation, not a personality test. It records:

- current intent in the user's own words;
- relationship structures they are open to;
- hard constraints and softer preferences;
- time, energy, travel, and approximate date-budget capacity;
- preferred pace from match to phone/video/in-person;
- safety defaults and trusted-contact preference;
- which data the user permits the agent to process.

Every field has a “why this is used” explanation. The user can skip fields.
Intent expires for review after 30 days because people's circumstances change.

### Stage 2: Add a connection

Supported inputs, in order:

1. a 30-second manual card;
2. a user-invoked share sheet from another app;
3. an optional screenshot or copied excerpt processed for a proposed summary;
4. an optional user-requested platform export;
5. a future approved partner API.

The intake asks for only what the next decision needs: name or pseudonym,
source, stage, what caught the user's attention, known logistics, uncertainty,
and next promised action. Raw screenshots are transient and deleted after the
user accepts or rejects the extracted facts.

### Stage 3: Decide the next honest step

Each active connection has exactly one next-decision state:

- learn one material fact;
- schedule a phone/video conversation;
- propose an in-person date;
- decide whether the user wants another date;
- clarify an incompatibility or boundary;
- continue naturally with no task;
- pause, close, archive, or delete;
- graduate to Relationships.

The system can offer a **conversation compass**—the genuine question, topic, or
decision the user said matters—but never a generated line to paste. Examples:
“You wanted to learn whether your weekend rhythms fit” or “You both mentioned
live music; deciding whether to meet is now more useful than more profile
analysis.”

### Stage 4: Build a date proposal

When the user chooses to meet, the agent combines:

- calendar free/busy, never the titles of unrelated private events;
- a coarse start area selected for this plan, not stored home/work coordinates;
- travel time and independent return options;
- venue hours, accessibility, noise, price band, and reservation requirements;
- the user's current date budget allowance;
- known constraints explicitly shared by the other person.

It produces two or three inspectable proposals with sources, tradeoffs, and an
expiration time. The user chooses. The system may then open a reservation or
calendar handoff after approval. It does not contact the other person.

### Stage 5: Prepare without scripting

Before a date, show a compact context brief:

- confirmed time, place, transit, and reservation state;
- two or three facts the user chose to remember;
- any promise the user made;
- one genuine curiosity the user previously recorded;
- verification state as reported by the source platform;
- safety plan and check-in state.

Do not provide a performance script, tactics, manipulation advice, or a list of
predicted “red flags.”

### Stage 6: Safety check-in

For first or higher-uncertainty meetings, offer:

- public-place confirmation;
- independent-arrival and departure plan;
- a trusted-contact share preview containing only the chosen details;
- a scheduled “home safe?” notification;
- one-tap access to call, ride, venue, platform reporting, and local emergency
  resources;
- an inconspicuous exit action that opens the user's chosen contact or ride app.

Failure to answer a check-in never automatically messages police or the other
person. Escalation behavior must be explicitly configured and legally reviewed.

### Stage 7: Ninety-second debrief

The first debrief captures experience before narrative:

- Do I want to see them again: yes / maybe / no / not ready?
- Did I feel at ease enough to be myself?
- Was curiosity reciprocal?
- Was attraction present, absent, or unclear?
- Were my boundaries and time respected?
- Did their actions match what was agreed?
- What did I observe, as distinct from what am I guessing?
- What is the next decision and by when?

Free-form reflection is optional. The agent may summarize only after the user
records their own view.

### Stage 8: Continue, close, or graduate

- **Continue:** create the next event and carry forward only relevant context.
- **Close:** record the user's decision, help them mark the loop complete, and
  delete raw imported material on schedule.
- **Graduate:** move the connection into Relationships, stop comparison and
  discovery nudges, and shift from selection to shared-life continuity.
- **Pause dating:** clear attention prompts while preserving or deleting data
  according to the user's choice.

## 4. Agent roles and authority

The agent is one product with five constrained roles, not five chatbots.

| Role | May do | Must not do |
|---|---|---|
| Navigator | Surface the next decision and stale open loops | Pressure the user to date or optimize activity volume |
| Memory keeper | Summarize approved facts with sources | Turn inference into fact or build a covert dossier |
| Concierge | Propose times, venues, travel, and budget tradeoffs | Book, contact, or disclose without approval |
| Safety aide | Assemble a plan, reminders, and resource links | Certify a person as safe or silently escalate |
| Reflection partner | Ask structured questions and surface tentative patterns | Diagnose either person or overrule the user's lived judgment |

### Autonomy classes

- **A0 — local read:** Read authorized, purpose-matched data for the open task.
- **A1 — reversible suggestion:** Compute Dating Sync, summarize approved
  evidence, or propose a next step.
- **A2 — private draft:** Prepare a calendar event, venue shortlist, or trusted
  contact share for preview.
- **A3 — external effect:** Write the event, open booking, share the plan, or
  file a report only after item-specific confirmation.
- **A4 — prohibited:** Send relational messages, operate a dating account,
  disclose private context to a connection, covertly investigate a person, or
  make a high-impact automated decision about them.

There is no blanket “always allow” permission for person-specific external
actions.

## 5. Dating Sync

The familiar sync-score concept should be retained, but renamed and explained
as **system readiness**, never personal worth or dating performance.

Dating Sync is an inspectable weighted mean of applicable components:

| Component | Default weight | Deterministic checks |
|---|---:|---|
| Intent clarity | 20 | current goal, constraints, capacity, and permissions reviewed |
| Context integrity | 20 | active cards have source, stage, freshness, and no unresolved fact conflict |
| Decision closure | 20 | each active connection has one explicit next decision or “no action” state |
| Date readiness | 20 | scheduled dates have confirmed logistics, travel, and a valid venue state |
| Safety readiness | 15 | applicable dates have reviewed location, transport, check-in, and share state |
| Connector health | 5 | authorized calendar, maps, notification, and import jobs are healthy |

Rules:

- non-applicable components are excluded and the denominator is rebalanced;
- every lost point maps to an exact remediation action;
- an LLM never assigns the score;
- no input uses message response time, match count, attractiveness, sexual
  activity, popularity, or whether another person chose the user;
- the score may be hidden entirely by the user;
- product analytics record component health, not private component contents.

Example display:

> Dating Sync 82 · System ready
> −8: Friday venue closes before the proposed end time
> −5: trusted-contact share has not been reviewed
> −5: one imported fact is still unconfirmed

## 6. Information architecture and interaction design

### Desktop

Preserve the current Car Plane visual language: a restrained dark control
surface, strong hierarchy, source chips, observation times, visible connector
states, and exact remediation. Do not use stock romance photography, hearts,
swipe cards, gender-coded pink/blue UI, or giant profile photos.

Recommended layout:

- **Left:** Life Control Plane navigation with Dating as a module.
- **Center:** Dating Sync, next-decision queue, active connections, upcoming
  dates, and weekly review.
- **Right:** selected connection context, evidence/provenance, date-plan state,
  and agent proposal/approval panel.

### Mobile

The mobile app is action-first, not a compressed desktop dashboard:

1. next decision;
2. tonight/this week;
3. quick add or debrief;
4. safety check-in when active;
5. connection context on demand.

Suggested bottom tabs: **Today, People, Dates, Reflect, Data**. Dating-specific
records remain behind Dating even though the underlying Person graph is shared.

### Core screens

1. Dating home and Sync breakdown
2. Intent and capacity contract
3. Active connection board
4. Connection evidence timeline
5. Date proposal comparison
6. Date plan and safety check-in
7. Post-date debrief
8. Weekly pattern review
9. Data permissions, retention, export, and deletion

## 7. Product data model

Dating Plane should use the portfolio event graph, but add a privacy boundary
around dating-specific views.

### Primary entities

- `dating_intention`: current goal, structures, constraints, capacity, review
  date;
- `person`: minimal shared identity or user-selected pseudonym;
- `dating_connection`: user-owned stage and relationship to the person;
- `observation`: a fact, user report, or proposed inference with provenance;
- `interaction_event`: match, message noted, call, date, decision, closure;
- `date_plan`: proposals, chosen venue, time, travel, budget, and state;
- `safety_plan`: public-place check, transportation, trusted contact, check-in;
- `approval`: preview, exact payload, decision, actor, and timestamp;
- `reflection`: structured post-event user responses;
- `hypothesis`: tentative user-level pattern with evidence count and user
  acceptance state;
- `connector`: permission, capability, scope, last success, and last error;
- `retention_rule`: sensitivity, purpose, expiration, and deletion state.

### Observation contract

Every value that could influence a decision carries:

```text
subject              user | connection | date | relationship
value
kind                 fact | user_report | agent_hypothesis
source               manual | share | export | calendar | maps | derived
source_reference
observed_at
confidence
sensitivity
purpose
review_state         proposed | accepted | rejected | superseded
retention_until
```

Agent output enters as `proposed`. It cannot silently become canonical.
Conflicting observations coexist until the user resolves or supersedes them.

### Data sensitivity and defaults

| Class | Examples | Default handling |
|---|---|---|
| D0 Operational | connector health, job state | account-scoped, ordinary retention |
| D1 User private | intention, capacity, preferences | encrypted, user-controlled |
| D2 Third-party | name, source profile facts, plans | minimum necessary, purpose-bound |
| D3 Intimate | message content, sexual/health notes, precise location | opt-in, separately gated, short retention |
| D4 Restricted | biometrics, financial credentials, safety incident evidence | do not collect in MVP; dedicated design if ever required |

Recommended defaults:

- raw screenshots and pasted transcripts: delete immediately after the user
  reviews extraction, with a hard maximum of 24 hours;
- normalized connection observations: expire 90 days after inactivity unless
  the user pins them;
- closed connection raw material: 30-day recoverable deletion window;
- user-level learning: retain only deidentified-to-the-other-person features,
  such as “I prefer earlier plans,” never a named person's private details;
- no model training, ads, data sale, cross-user identity resolution, or global
  graph of noncustomers;
- one-click per-connection export and deletion plus whole-account deletion.

Before launch, validate these periods against operational, litigation-hold,
abuse-reporting, and applicable legal requirements.

## 8. Personalization without fake certainty

### What the model may learn

- explicitly stated hard constraints;
- which logistics lead the user to cancel or follow through;
- what the user reports wanting after actual dates;
- recurring conditions associated with ease, curiosity, attraction,
  reciprocity, and desire for another meeting;
- which agent interventions the user found useful.

### What it may not learn or optimize

- a universal rank of people;
- protected-class proxies or inferred sensitive traits;
- “market value,” league, hotness, scarcity, or likelihood of sex;
- tactics that maximize replies regardless of authenticity;
- dependence on the agent, session length, or a perpetual active pipeline.

### Hypothesis format

Patterns are expressed with humility and evidence:

> Possible pattern: you have wanted a second date more often when plans were
> made at least two days ahead (3 of 4 recent dates). Keep testing / dismiss.

The user can accept, edit, or dismiss every hypothesis. Do not surface a pattern
from one event as a stable trait.

## 9. Connectors and ingestion sequence

### MVP connectors

1. **Manual and quick capture:** always available, fast, provenance-preserving.
2. **Calendar:** free/busy read and item-specific event writes after approval.
3. **Maps/places:** venue facts, coarse travel estimates, deep links.
4. **Notifications:** date reminders, check-ins, retention warnings.
5. **User share/import:** per-item text/image share with transient processing.

### Next connectors

6. **Contacts:** picker-based access to a selected contact, never whole-address-
   book ingestion by default.
7. **Email evidence:** reservation or ticket confirmations only, with narrowly
   scoped search and review.
8. **Platform exports:** explicit one-time parsers for user-requested archives.
9. **Trusted-contact share:** user-owned Messages/SMS/email share sheet.

### Deferred or rejected connectors

- dating app credential capture or headless login: rejected;
- background message-history scraping: rejected;
- social graph crawling and face search: rejected;
- precise continuous location tracking: rejected;
- platform API: deferred until a written, supported partner agreement;
- biometrics: defer to source-platform verification and store only the stated
  badge plus observation time;
- background checks: separate legal and safety product decision, not an MVP
  feature.

### Plaid boundary

Plaid belongs to Money Plane. Dating Plane may request only a user-approved
aggregate such as “discretionary date budget remaining this month: $120” or a
price-band constraint. It must not receive institutions, account numbers,
balances, transactions, merchant history, or financial credentials. A date
should never be evaluated against another person's apparent income or spending.

## 10. Technical architecture and language

### Language decision

Use **TypeScript end to end** for the shared product surface, domain contracts,
API, jobs, and evaluation harness.

- Keep React and Vite for the responsive desktop/mobile web interface.
- Add Capacitor when native packaging, push notifications, share extensions,
  calendar APIs, or secure storage require it.
- Use small Swift and Kotlin native bridges where necessary.
- Do not use Java as the shared product language. Java or Kotlin is appropriate
  only for isolated Android-native work.

This matches the Car Plane decision and prevents desktop, mobile, and server
behavior from drifting into separate domain models.

### Target topology

```text
React/Vite PWA + Capacitor shells
              |
        versioned TypeScript API
              |
  identity / policy / approvals / audit
              |
 Postgres event graph + encrypted object store
              |
 durable jobs / connector workers / notification worker
              |
 calendar | places | email | user imports | model gateway
```

### Service boundaries

- **Identity:** real multi-user OIDC/passkey sessions, device/session inventory,
  step-up authentication for export or deletion.
- **Policy:** deterministic permission and sensitivity checks outside the LLM.
- **Dating domain:** connection, date, reflection, graduation, and retention
  state machines.
- **Approval service:** exact proposed payload, expiry, confirmation, result,
  and idempotency key.
- **Connector service:** capability-scoped tokens, incremental jobs, webhook
  validation, and visible health.
- **Model gateway:** provider abstraction, structured outputs, context
  allow-list, redaction, no-training contract, and retention controls.
- **Audit:** append-only security and action events without copying full
  intimate payloads into logs.

### Persistence

- account-scoped Postgres rows with row-level authorization enforced in the API;
- envelope encryption for D2/D3 fields with KMS-backed keys;
- provider tokens only in a secrets vault;
- raw imports in an encrypted bucket with deletion jobs and object-level TTL;
- a Postgres-backed durable job queue initially; introduce a separate workflow
  system only when connector volume or long-running orchestration requires it;
- server-sent events for small dashboard updates; no need for a complex
  real-time chat infrastructure in the first product.

### Local/private and product modes

The public repository remains synthetic. A private single-user build can use a
local connector service. A commercial multi-device product requires a real
account boundary and encrypted hosted control plane; device-local passcode data
is not sufficient. The same TypeScript domain contracts should power both.

## 11. AI behavior and evaluation contract

### Model uses that create value

- extract proposed facts from a user-shared item;
- summarize accepted context into a short pre-date brief;
- translate the user's own stated constraints into venue-search filters;
- organize free-form reflection into proposed observations;
- surface tentative user-level patterns with linked evidence;
- explain why a deterministic Sync component changed.

### Deterministic code owns

- permissions, age gate, retention, and deletion;
- connector scopes and token handling;
- Dating Sync calculation;
- hard constraints and calendar conflicts;
- approval requirements and outbound payloads;
- safety escalation rules;
- tenant isolation and audit.

### Required adversarial tests

- imported text attempts to instruct the agent or exfiltrate other data;
- a user asks the agent to impersonate them or secretly operate an account;
- a user asks for a protected-trait or attractiveness ranking;
- the model fabricates a fact, source, venue hour, or verification state;
- an ambiguous message is labeled abusive, deceptive, or diagnostic;
- one person's data appears in another account;
- raw screenshots survive their TTL;
- a calendar, trusted-contact share, or report occurs without confirmation;
- the safety UI implies a guarantee;
- the model pressures a user to continue a connection they want to end.

### Launch gates

- 100% of outbound effects pass an approval integration test;
- 100% of displayed inferred facts have a visible source and review state;
- zero cross-tenant access in automated authorization tests and an external
  penetration test;
- deletion jobs meet the published SLA under retry and outage conditions;
- users can correctly explain what Dating Sync does and does not measure;
- qualitative testing shows that users feel more like themselves, not more
  dependent on generated language;
- safety and privacy red-team findings have owners and blocking severity rules.

## 12. Metrics and incentives

### North-star outcome

Use **useful real-world progression per active user-month**, where progression
is user-confirmed and can mean:

- a mutually wanted real meeting;
- a mutually wanted second date;
- a clear, respectful closure that ended uncertainty;
- graduation into an ongoing relationship;
- a deliberate pause aligned with the user's current goals.

This is better than matches, messages, swipes, session time, or app retention.

### Leading metrics

- time from “I want to meet” to a confirmed plan;
- percentage of active connections with one clear next decision;
- planned dates completed or deliberately canceled;
- debrief completion and usefulness;
- accepted versus dismissed agent hypotheses;
- weekly time saved on logistics;
- percentage of users who say the system preserved their authentic voice;
- privacy controls understood, exports completed, and deletion SLA.

### Guardrail metrics

- unapproved outbound actions: target zero;
- false or unsupported factual claims;
- safety false-certainty reports;
- harassment/reporting flow failures;
- raw sensitive data beyond TTL;
- cross-tenant access attempts and incidents;
- users reporting pressure, dependency, judgment, or unwanted profiling;
- outcome disparity by gender, sexual orientation, race/ethnicity, age band,
  disability, and relationship structure where lawful and consented to measure.

Do not make retention the north star. Graduation churn can be success.

## 13. Business model and positioning

### Positioning

> Your private control plane for dating after the match.

Alternative explanatory line:

> Remember what matters, make the plan, meet safely, and learn from real dates—
> without an AI pretending to be you.

### Revenue

A subscription aligns better than ads, boosts, or pay-per-message mechanics.

- **Private beta:** included as a Life Control Plane module.
- **Core:** intention, limited active set, dates, reminders, and debriefs.
- **Plus:** multi-device encrypted history, calendar/places integrations,
  advanced weekly review, and travel-aware planning.
- **Human support later:** optional vetted coach or matchmaker review with
  explicit, time-limited data sharing.

Never monetize access to another person's data, visibility rankings, emotional
urgency, or a user's insecurity.

### Defensibility

The moat is not the language model. It is:

- the permissioned longitudinal event graph;
- excellent provenance and privacy UX;
- real-world planning across calendar, places, travel, and budget;
- user-specific learning from observed outcomes;
- a trustworthy approval and audit layer;
- successful transitions across Dating, Relationships, Travel, Moving, Money,
  and People without leaking context between them.

## 14. Delivery roadmap

Durations assume one product designer and two to four engineers. Gates matter
more than calendar dates.

### Phase 0 — Product contract and threat model (2 weeks)

Deliver:

- ten to fifteen interviews across different genders, orientations, ages, app
  mixes, and safety needs;
- clickable desktop/mobile prototype;
- data map and D0–D4 classification;
- abuse cases, privacy impact assessment, and legal issue list;
- precise MVP event and approval state machines;
- research consent for any pilot data.

Exit when:

- users clearly prefer logistics/continuity/reflection over ghostwriting;
- they understand and value Dating Sync as system readiness;
- every collected field has a named purpose and retention rule.

### Phase 1 — Private, manual-first Dating Plane (4–6 weeks)

Build in this repository:

- typed domain contracts and synthetic demo repository;
- responsive Dating Plane home using Car Plane's source-aware visual language;
- intent contract, active connections, next-decision queue, and evidence
  timeline;
- deterministic Dating Sync;
- date proposal mock data, safety checklist, debrief, closure, and graduation;
- local-only state for the private alpha;
- verification scripts for score, privacy, state transitions, and responsive UI.

No model, account scraping, message drafting, or real connector is required.

Exit when:

- the golden path works on desktop and mobile;
- every state is understandable without chat;
- no UI resembles a swipe deck or pickup-line assistant;
- a connection can be fully deleted.

### Phase 2 — Product backend and real logistics (6–8 weeks)

Build:

- multi-user identity, account-scoped Postgres, encryption, audit, and approval
  service;
- calendar free/busy and approved event writes;
- maps/places venue proposals with source freshness;
- notification and check-in jobs;
- selected-contact trusted-share handoff;
- privacy center, data export, deletion jobs, and admin incident tooling.

Exit when:

- external security review finds no blocking issue;
- zero external effects occur without item-specific approval;
- connector failure and token revocation are visible and recoverable;
- deletion and audit SLAs survive job retries and partial outages.

### Phase 3 — Constrained intelligence (6–8 weeks)

Add:

- transient share/import extraction;
- source-linked context briefs;
- free-form reflection organization;
- user-level hypothesis ledger;
- structured model outputs and deterministic policy gateway;
- prompt-injection, sensitive-inference, hallucination, and coercion eval suites.

Exit when:

- proposed facts never bypass review;
- provenance precision and extraction accuracy meet defined test thresholds;
- users report increased clarity without reduced authenticity;
- red-team and privacy review approve a limited pilot.

### Phase 4 — Native pilot (8–12 weeks)

Add Capacitor shells only now:

- secure device storage;
- push notifications;
- iOS/Android share extensions;
- calendar and selected-contact native bridges;
- deep links to maps, ride, reservation, and source dating apps;
- accessible, discreet safety check-in surfaces.

Pilot with 50–100 consented users for at least eight weeks. Segment findings;
do not treat one demographic's workflow as universal.

Exit when:

- the product improves real-world progression or clean closure;
- safety, privacy, and authenticity guardrails remain healthy;
- enough users pay for the operating layer without a discovery marketplace.

### Phase 5 — Scale the operating layer, not the swipe deck

Potential additions:

- travel-aware long-distance dates through Travel Plane;
- user-approved date budget through Money Plane;
- relationship graduation and shared agreement tracking;
- human coach/matchmaker collaboration with narrow consent;
- approved platform partnerships;
- aggregate, privacy-preserving research into which workflows help.

A first-party discovery network is a separate company-level decision. Require
evidence that the operating-layer thesis cannot reach its potential without it,
plus a cold-start plan, reciprocal-recommendation fairness research, identity
verification, UGC moderation, appeals, safety operations, and a new privacy
impact assessment.

## 15. Initial implementation backlog

### P0 — Product skeleton

- `dating.ts`: domain types, demo repository, state transitions, Sync function;
- `DatingView.tsx`: responsive home and active connection selection;
- intent editor with a review date;
- next-decision queue;
- provenance-aware observation timeline;
- plan, safety, debrief, close, delete, and graduate flows;
- browser-local synthetic/private-alpha adapter;
- verification script and README architecture link.

### P0 — Trust contract

- field-purpose labels;
- raw-import transient state only;
- export/delete controls;
- approval preview component shared with other control-plane modules;
- no outbound-message component;
- visible “system readiness, not compatibility” explanation;
- private/public data fixture boundary tests.

### P1 — Shared platform extraction

- move `Person`, `Observation`, `Evidence`, `Event`, `Approval`, `Connector`, and
  `SyncComponent` into shared TypeScript contracts;
- reuse them in Vehicle, People, Dating, Money, Travel, and Moving;
- add account and purpose scopes before any hosted real-data integration;
- define the Dating-to-Relationships graduation event.

### P1 — Backend

- migrations and account authorization;
- observation conflict/review semantics;
- idempotent approval execution;
- retention/deletion worker;
- connector health and revocation;
- security/audit event schema without intimate payload duplication.

### P2 — Intelligence and native

- model gateway and eval harness;
- share extension/import processors;
- calendar, maps, notification, and trusted-contact adapters;
- hypothesis review UI;
- mobile packaging and store compliance evidence.

## 16. Major risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| The product feels creepy | It stores data about nonusers | Minimal fields, pseudonyms, provenance, short TTL, per-connection delete |
| Users mistake advice for truth | Romance is uncertain and models sound confident | Facts/reports/hypotheses separated; no compatibility or safety score |
| Platform bans | Automation violates major app terms | User-invoked import only; partner APIs only with written permission |
| Breach of intimate data | The corpus is unusually sensitive | Minimize, encrypt, isolate, expire, no training/ads, external security review |
| Agent erodes authenticity | Ghostwriting creates a synthetic self | No generated messages; conversation compass and user-authored decisions |
| Safety theater | A checklist can imply protection | Describe limits, show verification scope, no “safe” badge, expert review |
| Confirmation bias | Debriefs can become dossiers proving a narrative | Experience-first prompts, fact/inference split, evidence counts, dismissible hypotheses |
| Unequal outcomes | Ranking systems can amplify popularity and protected-class bias | No marketplace rank in MVP; segment guardrails; fairness review before discovery |
| Engagement incentive conflict | Successful users leave | Subscription plus graduation-as-success metrics, not ads or boosts |
| Integration scarcity | iOS and dating apps restrict message access | Manual/share-first workflow designed to be useful without hidden access |

## 17. Decisions to lock now

1. Keep **Life Control Plane** as the product title; call this module **Dating
   Plane**.
2. Build an after-match operating layer before considering a marketplace.
3. Do not ship AI message generation, autoswiping, scraping, or impersonation.
4. Use TypeScript across web, API, jobs, contracts, and tests; add small
   Swift/Kotlin bridges only when native packaging requires them.
5. Reuse the Car Plane's source-aware interface and Sync pattern, but make the
   score about system readiness rather than people.
6. Use the shared People/event graph with a separate dating-purpose privacy
   boundary.
7. Require preview and approval for every external effect.
8. Keep Plaid in Money Plane and expose only an optional budget aggregate.
9. Treat raw messages, screenshots, precise location, sexual/health information,
   and biometrics as separately gated data, not ordinary profile fields.
10. Make close, delete, pause, and graduate first-class successful outcomes.

## 18. Questions to validate in Phase 0

These are research questions, not blockers to prototyping:

- Is the sharpest initial wedge date planning, cross-app continuity, structured
  debrief, or the combination?
- How many active connections feels clarifying rather than managerial for
  different user groups?
- Does “Dating Plane” feel right in-product, or should the visible module be
  simply “Dating” while the architecture keeps the Plane name?
- Which information will users record manually if the value is immediate?
- Which debrief questions produce clarity without making dating clinical?
- What safety defaults differ by gender, orientation, age, disability, city,
  and relationship structure?
- Would users pay for privacy and logistics without message generation?
- When should a connection graduate so that selection mechanics disappear at
  the right time?

## Final recommendation

Build the first private prototype as a **dating control plane, not a dating
bot**. Its signature interaction is not a chat box. It is a calm, source-aware
decision surface that says:

> Here is what you said you want. Here are the few people currently in motion.
> Here is what is known, what is uncertain, and what needs a decision. Here are
> two viable ways to meet. Nothing leaves this system until you approve it.

That is differentiated, useful across apps, compatible with the existing
portfolio, and much closer to the real work of dating than a machine that writes
pickup lines.
