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

The first visit asks the user to create a local name and passcode. The passcode
is salted and hashed with Web Crypto and stored only in that browser profile;
it is not a server account and cannot be recovered or used from another device.

The owner's private hosted build uses a preview deployment protected by Vercel
Authentication and is built with `VITE_PLATFORM_AUTH=true`. Authentication then
happens at Vercel's edge before application assets are served. The device-local
passcode is disabled in that build because it is not a network access boundary.

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
