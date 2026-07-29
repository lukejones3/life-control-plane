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
