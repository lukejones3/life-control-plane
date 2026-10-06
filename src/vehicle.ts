export type VehicleSource = "vehicle" | "email" | "vin" | "manual" | "demo";
export type ConnectorState = "connected" | "available" | "attention" | "unavailable";

export type VehicleField<T> = {
  value: T | null;
  source: VehicleSource;
  sourceLabel: string;
  observedAt: string | null;
};

export type VehicleConnector = {
  id: "vehicle" | "email" | "vin" | "manual";
  label: string;
  detail: string;
  state: ConnectorState;
  lastSyncedAt: string | null;
};

export type VehicleEvent = {
  id: string;
  kind: "service" | "registration" | "insurance" | "inspection" | "repair";
  title: string;
  occurredAt: string;
  mileage: number | null;
  sourceLabel: string;
};

export type VehicleDashboard = {
  vehicleId: string;
  identity: {
    year: number;
    make: string;
    model: string;
    trim: string | null;
  };
  mileage: VehicleField<number>;
  rangeMiles: VehicleField<number>;
  fuelPercent: VehicleField<number>;
  oilLifePercent: VehicleField<number>;
  checkEngine: VehicleField<boolean>;
  estimatedValue: VehicleField<number>;
  registrationDue: VehicleField<string>;
  insurance: {
    provider: VehicleField<string>;
    premium: VehicleField<number>;
    renewalDue: VehicleField<string>;
  };
  connectors: VehicleConnector[];
  events: VehicleEvent[];
  sync: {
    score: number;
    coverage: number;
    freshness: number;
    integrity: number;
    actionClosure: number;
    automationHealth: number;
    updatedAt: string;
    issues: string[];
  };
};

export type ManualVehicleUpdate = {
  mileage?: number | null;
  rangeMiles?: number | null;
  fuelPercent?: number | null;
  oilLifePercent?: number | null;
  checkEngine?: boolean;
};

const DEMO_STORAGE_KEY = "lcp-demo-vehicle-v1";
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR).toISOString();
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY).toISOString();
}

function field<T>(value: T | null, source: VehicleSource, sourceLabel: string, observedAt: string | null): VehicleField<T> {
  return { value, source, sourceLabel, observedAt };
}

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function fieldFreshness(item: VehicleField<unknown>, freshForDays: number) {
  if (item.value == null || !item.observedAt) return 0;
  const age = Math.max(0, Date.now() - new Date(item.observedAt).getTime());
  if (age <= freshForDays * DAY) return 100;
  return clamp(100 - ((age / DAY - freshForDays) / freshForDays) * 100);
}

export function calculateVehicleSync(dashboard: Omit<VehicleDashboard, "sync">): VehicleDashboard["sync"] {
  const expected = [dashboard.mileage, dashboard.registrationDue, dashboard.insurance.provider, dashboard.insurance.renewalDue];
  const optional = [dashboard.rangeMiles, dashboard.fuelPercent, dashboard.oilLifePercent, dashboard.estimatedValue];
  const coverage = clamp((expected.filter(item => item.value != null).length * 2 + optional.filter(item => item.value != null).length) / 12 * 100);
  const freshness = clamp([
    fieldFreshness(dashboard.mileage, 7),
    fieldFreshness(dashboard.registrationDue, 30),
    fieldFreshness(dashboard.insurance.renewalDue, 30),
  ].reduce((total, value) => total + value, 0) / 3);
  const integrity = dashboard.identity.year && dashboard.identity.make && dashboard.identity.model ? 100 : 40;
  const actionClosure = dashboard.checkEngine.value ? 35 : 100;
  const connected = dashboard.connectors.filter(connector => connector.state === "connected");
  const automationHealth = clamp((connected.length / 3) * 100);
  const issues: string[] = [];
  if (dashboard.mileage.value == null) issues.push("Add a current odometer reading");
  else if (fieldFreshness(dashboard.mileage, 7) < 60) issues.push("Refresh the odometer reading");
  if (dashboard.registrationDue.value == null) issues.push("Add registration renewal evidence");
  if (dashboard.insurance.provider.value == null) issues.push("Connect or add insurance coverage");
  if (dashboard.checkEngine.value) issues.push("Resolve the active vehicle alert");
  const score = clamp(coverage * .25 + freshness * .25 + integrity * .2 + actionClosure * .15 + automationHealth * .15);
  return { score, coverage, freshness, integrity, actionClosure, automationHealth, updatedAt: new Date().toISOString(), issues };
}

function demoDashboard(): VehicleDashboard {
  const saved = readDemoUpdate();
  const base: Omit<VehicleDashboard, "sync"> = {
    vehicleId: "demo-primary",
    identity: { year: 2021, make: "Demo", model: "Compact SUV", trim: "Touring" },
    mileage: field(saved.mileage ?? 41280, saved.mileage == null ? "demo" : "manual", saved.mileage == null ? "Demo vehicle" : "Manual reading", saved.updatedAt ?? hoursAgo(5)),
    rangeMiles: field(saved.rangeMiles ?? 286, saved.rangeMiles == null ? "demo" : "manual", saved.rangeMiles == null ? "Demo vehicle" : "Manual reading", saved.updatedAt ?? hoursAgo(5)),
    fuelPercent: field(saved.fuelPercent ?? 72, saved.fuelPercent == null ? "demo" : "manual", saved.fuelPercent == null ? "Demo vehicle" : "Manual reading", saved.updatedAt ?? hoursAgo(5)),
    oilLifePercent: field(saved.oilLifePercent ?? 74, saved.oilLifePercent == null ? "demo" : "manual", saved.oilLifePercent == null ? "Demo vehicle" : "Manual reading", saved.updatedAt ?? daysAgo(2)),
    checkEngine: field(saved.checkEngine ?? false, saved.checkEngine == null ? "demo" : "manual", saved.checkEngine == null ? "Demo vehicle" : "Manual reading", saved.updatedAt ?? hoursAgo(5)),
    estimatedValue: field(18400, "email", "Valuation evidence", daysAgo(4)),
    registrationDue: field("2026-08-19", "email", "Registration email", daysAgo(3)),
    insurance: {
      provider: field("Demo Mutual", "email", "Policy email", daysAgo(8)),
      premium: field(126, "email", "Policy email", daysAgo(8)),
      renewalDue: field("2026-09-01", "email", "Policy email", daysAgo(8)),
    },
    connectors: [
      { id: "vehicle", label: "Vehicle account", detail: "Live odometer, fuel, range, and health where supported", state: "available", lastSyncedAt: null },
      { id: "email", label: "Email evidence", detail: "Insurance, registration, recalls, and service receipts", state: "connected", lastSyncedAt: daysAgo(1) },
      { id: "vin", label: "Vehicle identity", detail: "Make, model, year, trim, and powertrain from VIN", state: "connected", lastSyncedAt: daysAgo(30) },
      { id: "manual", label: "Manual snapshot", detail: "Fast fallback for dashboard-only readings", state: "connected", lastSyncedAt: saved.updatedAt ?? hoursAgo(5) },
    ],
    events: [
      { id: "demo-service", kind: "service", title: "Oil and filter service", occurredAt: "2026-06-18", mileage: 38104, sourceLabel: "Service receipt" },
      { id: "demo-registration", kind: "registration", title: "Registration renewal notice", occurredAt: "2026-07-28", mileage: null, sourceLabel: "Registration email" },
      { id: "demo-insurance", kind: "insurance", title: "Policy documents renewed", occurredAt: "2026-07-01", mileage: null, sourceLabel: "Policy email" },
    ],
  };
  return { ...base, sync: calculateVehicleSync(base) };
}

type StoredDemoUpdate = ManualVehicleUpdate & { updatedAt?: string };

function readDemoUpdate(): StoredDemoUpdate {
  try {
    return JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || "{}") as StoredDemoUpdate;
  } catch {
    return {};
  }
}

function normalizeUpdate(update: ManualVehicleUpdate): ManualVehicleUpdate {
  return {
    ...update,
    mileage: update.mileage == null ? null : Math.max(0, Math.round(update.mileage)),
    rangeMiles: update.rangeMiles == null ? null : Math.max(0, Math.round(update.rangeMiles)),
    fuelPercent: update.fuelPercent == null ? null : clamp(update.fuelPercent),
    oilLifePercent: update.oilLifePercent == null ? null : clamp(update.oilLifePercent),
  };
}

const apiBase = (import.meta.env.VITE_VEHICLE_API_URL || "").replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const message = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(message.error || `Vehicle service returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const vehicleRepository = {
  mode: apiBase ? "connected" as const : "demo" as const,
  async getDashboard() {
    return apiBase ? request<VehicleDashboard>("/v1/vehicles/primary/dashboard") : demoDashboard();
  },
  async saveManualSnapshot(update: ManualVehicleUpdate) {
    const normalized = normalizeUpdate(update);
    if (apiBase) {
      return request<VehicleDashboard>("/v1/vehicles/primary/manual-snapshot", { method: "PATCH", body: JSON.stringify(normalized) });
    }
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ ...readDemoUpdate(), ...normalized, updatedAt: new Date().toISOString() }));
    return demoDashboard();
  },
  async sync() {
    return apiBase ? request<VehicleDashboard>("/v1/vehicles/primary/sync", { method: "POST", body: "{}" }) : demoDashboard();
  },
};

export function formatVehicleDate(value: string | null) {
  if (!value) return "Not available";
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatObservedAt(value: string | null) {
  if (!value) return "Never synced";
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  if (elapsed < HOUR) return `${Math.max(1, Math.round(elapsed / 60000))}m ago`;
  if (elapsed < DAY) return `${Math.round(elapsed / HOUR)}h ago`;
  return `${Math.round(elapsed / DAY)}d ago`;
}
