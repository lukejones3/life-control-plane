# Life Control Plane

A public-safe, local-first personal operations dashboard.

The control plane consolidates the fragments normally scattered across email,
calendar, banking portals, notes, task apps, vehicle records, job boards, music
notes, relationship context, and project repositories.

This repository contains a fully synthetic demo. It contains no private corpus,
real contacts, account information, credentials, personal history, or generated
subject-level analysis.

## Modules

- Control center and urgent matters
- Career applications and evidence
- Money, bills, accounts, and connector surfaces
- Relocation planning and dependency tracking
- Relationship context
- Music fragments and listening signals
- Project and commit activity
- Content pipeline
- Unified life administration
- Vehicle maintenance, insurance, and registration

## Run

```bash
npm install
npm run dev
```

To open the development server from a phone on the same Wi-Fi network:

```bash
npm run dev -- --host 0.0.0.0
```

Then visit the computer's LAN address at port `5188`. Home-screen installation
and offline use require a production build served over HTTPS (except on
`localhost`). On iPhone, use **Share → Add to Home Screen**; on Android, use the
browser's **Install app** action.

The public demo asks the user to create a local name and passcode. That login is
deliberately device-local and protects only demo state.

The owner's private hosted build uses a preview deployment protected by Vercel
Authentication. `npm run deploy:private` always builds with
`VITE_PLATFORM_AUTH=true`; authentication happens at Vercel's edge before any
application asset is served, and the same Vercel account works on desktop and
mobile. The device-local passcode is disabled in that build because it is not a
network access boundary. Authenticated responses are not service-worker cached,
so an expired session cannot be replaced by a cached app or login page.
After the preview is ready, the command also repoints the two stable protected
Vercel aliases. Existing desktop bookmarks and the installed phone app therefore
receive the new bundle instead of remaining attached to an older preview.

## Publish through an API for phone use

The app is deployed directly through Vercel's HTTPS API. It does not use GitHub
Pages, require a Git provider, or send the device-local login to Vercel.

Create a Vercel access token, keep it outside the repository, and run:

```bash
VERCEL_TOKEN=your_token npm run deploy:api
```

The command builds the app, uploads the static output by content hash, creates a
production deployment, waits for it to become ready, and prints the HTTPS phone
URL. `VERCEL_PROJECT_NAME` can override the default `life-control-plane` project
name; `VERCEL_TEAM_ID` can select a team account.

Open the printed URL in Safari or Chrome. On iPhone choose **Share → Add to Home
Screen**; on Android choose **Install app**. After the first successful visit,
the installed app shell can start offline.

## Recruiter sprint

The Recruiters module contains a 40-person, approval-only Seattle outreach
campaign. Recruiter research and public professional links ship as seed data;
statuses, drafts, contact dates, follow-ups, and candidate project links stay in
the device's local storage. The app never sends a message automatically. An
explicit email/link action opens the user's own client, and **Mark sent** only
updates the local campaign ledger.

## Vehicle product architecture

Car Plane uses a typed, source-aware vehicle model. Every reading carries its
source and observation time; the Vehicle Sync score measures coverage,
freshness, integrity, action closure, and connector health. The public demo uses
synthetic records and a browser-local manual-reading fallback.

Set `VITE_VEHICLE_API_URL` for a private or product build backed by the versioned
vehicle API described in `docs/VEHICLE_PRODUCT_AUDIT.md`. The intended connector
order is connected-vehicle data where supported, email/document evidence for
obligations and service, NHTSA for VIN identity, and a fast manual snapshot for
dashboard-only readings.

## Private Content and Build surfaces

The Build plane combines a local repository snapshot with a daily GitHub
activity refresh. Public repositories update through a scheduled GitHub Action;
the encrypted private connector adds private repositories after it is unlocked.
Local source scale and worktree motion remain local by design.

The Content plane combines a private account snapshot, a persistent research
vault, evidence-backed format observations, YouTube owner OAuth, TikTok Login
Kit/Display API, and a dated manual video ledger. Provider credentials and
refresh tokens remain encrypted on the private server. Run
`npm run snapshot` before local inspection; `npm run build` and private deploys
do this automatically. The generated snapshot is intentionally ignored by Git,
so personal account data and private project state never enter the public source
repository. Connector boundaries are documented in
`docs/CONTENT_CONNECTOR_ARCHITECTURE.md`.

To connect an existing Google desktop OAuth client to the private YouTube
analytics service, run `npm run connect:youtube -- /path/to/client_secret.json`.
This is a one-time, read-only bootstrap; subsequent refreshes run on the private
server.

## Privacy architecture

The public frontend uses synthetic data from `src/demoData.ts`. A real
installation should keep integrations behind a local service:

```text
email / calendar / banks / vehicle / messages / repositories
                           ↓
                 local connector service
                           ↓
              normalized local event store
                           ↓
                 Life Control Plane UI
```

Tokens, message content, financial transactions, and relationship data should
never be bundled into the browser or committed to Git.

Run `npm run privacy:scan` before every push.

## Product status

The public repository is a clean-room interface and architecture extraction.
The private personal installation has deeper local connectors and data
ingestion; those records and connector credentials are deliberately absent.
