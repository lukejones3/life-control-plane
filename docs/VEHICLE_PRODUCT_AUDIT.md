# Vehicle product audit and architecture

## Decision

Use TypeScript across the product surface and application API. Keep the current
React/Vite interface as the responsive desktop and mobile-web product. Add
Capacitor when native iOS and Android packaging, push notifications, deep links,
or native provider SDKs become necessary. Native extensions remain small Swift
(iOS) or Java/Kotlin (Android) plugins; Java is not the shared product language.

This preserves one UI and domain model while allowing native platform features.
Capacitor is designed to be added to an existing modern JavaScript application:
https://capacitorjs.com/docs

## Predecessor audit

The earlier local vehicle implementation proved several useful capabilities:

- VIN-derived identity through the NHTSA vPIC API;
- server-side ingestion of vehicle-related email evidence;
- local persistence for mileage, fuel, oil, insurance, and registration;
- manual readings for values unavailable through a supported connector;
- derived insurance and maintenance states;
- evidence links instead of copying full email bodies into the UI.

It is not a product backend:

- one hard-coded vehicle row and one local user;
- a large shared SQLite database coupled to unrelated dashboard modules;
- localhost-only operation with no account or tenant boundary;
- synchronous, route-specific connector code without durable jobs or retries;
- regex-derived evidence promoted directly into canonical fields;
- no field-level conflict policy or accepted/rejected review state;
- freshness timestamps exist but were not used to calculate sync health;
- no durable mobile path while the host computer is unavailable;
- fetched vehicle photography added visual and attribution complexity without
  improving the control task.

The current Car Plane therefore keeps the evidence concepts and rejects the old
HTML, CSS, photo search, single-row schema, and route structure.

## Product data contract

Each vehicle datum is a field observation rather than an unqualified scalar:

```text
value
source                 vehicle | email | vin | manual
source label
observed_at
```

The canonical vehicle aggregate contains:

- identity: year, make, model, trim, powertrain;
- telemetry: odometer, range, fuel/charge, oil life, tire pressure, alerts;
- obligations: registration, insurance, inspection, loans where applicable;
- events: service, repair, recall, inspection, registration, coverage;
- connectors: authorization state, capability set, last success, last error;
- evidence: provider reference, extracted facts, confidence, review state;
- sync health: visible component scores and exact remediation.

The frontend now targets these endpoints:

```text
GET   /v1/vehicles/primary/dashboard
PATCH /v1/vehicles/primary/manual-snapshot
POST  /v1/vehicles/primary/sync
```

## Connector order

1. A connected-vehicle provider for consented live signals. Smartcar exposes a
   standardized vehicle API and compatibility matrix across supported makes:
   https://smartcar.com/docs/api-reference/intro
2. Gmail/document evidence for insurance, registration, recalls, and receipts.
   Gmail supports incremental mailbox synchronization and push notifications:
   https://developers.google.com/workspace/gmail/api/guides/push
3. NHTSA vPIC for one-time VIN identity decoding:
   https://vpic.nhtsa.dot.gov/api/Home/Index
4. Manual snapshots as a first-class fallback, never disguised as live sync.

Users should connect only the source needed for the goal. Unsupported fields stay
visibly unavailable and can be supplied manually. Connector credentials and raw
provider payloads remain server-side.

## Persistence and jobs

The product backend should use Postgres with account-scoped rows, encrypted
provider-token references, idempotent connector jobs, and an append-only field
observation/evidence history. A worker receives provider webhooks, performs
incremental sync, records evidence, recomputes the vehicle aggregate, and emits a
small dashboard update event. The browser never receives provider access tokens.

Plaid belongs to the parallel Money connector, not the vehicle connector. Its
Link token is created server-side, the public token is exchanged server-side,
and incremental transaction ingestion uses `/transactions/sync` plus webhooks:
https://plaid.com/docs/transactions/

## Implemented in this repository

- typed vehicle dashboard, connector, evidence-source, and event contracts;
- deterministic Vehicle Sync component calculation;
- responsive Car Plane UI without external vehicle imagery;
- field-level source and observation-time display;
- visible connector capability and health states;
- manual reading fallback with numeric bounds;
- versioned product API adapter selected by `VITE_VEHICLE_API_URL`;
- synthetic demo repository when no private API is configured.

## Next backend slice

1. Create account-scoped Postgres tables for vehicles, observations, evidence,
   connectors, and events.
2. Implement the three frontend contract endpoints.
3. Add NHTSA VIN identity and manual snapshots.
4. Add email evidence with explicit review/acceptance.
5. Pilot Smartcar compatibility and Connect against the target vehicle.
6. Add webhook-driven sync and connector recovery.
7. Package the proven web application with Capacitor only when native capability
   is required.
