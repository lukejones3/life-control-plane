import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownUp, Building2, Cat, Check, ChevronRight,
  Clock3, Download, ExternalLink, Heart, Leaf,
  Map, MapPin, Music2, Route, Search, ShieldCheck, Sparkles,
  Trees, Upload, WashingMachine,
} from "lucide-react";
import { Apartment, apartments, ApartmentStatus, apartmentSourceNotes } from "./apartmentData";
import "./MovePlanner.css";

type ApartmentRecord = {status: ApartmentStatus; note: string};
type PlannerState = Record<string, ApartmentRecord>;
type SortMode = "fit" | "rent" | "commute" | "warmth" | "canopy";

const storageKey = "lcp-apartment-planner-v2";
const statusOptions: {value: ApartmentStatus; label: string}[] = [
  {value: "new", label: "New"}, {value: "saved", label: "Saved"},
  {value: "tour", label: "Tour next"}, {value: "contacted", label: "Contacted"},
  {value: "applied", label: "Applied"}, {value: "passed", label: "Passed"},
];

function initialPlannerState(): PlannerState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}") as PlannerState;
    return Object.fromEntries(apartments.map((apartment) => [apartment.id, saved[apartment.id] || {status: "new", note: ""}]));
  } catch {
    return Object.fromEntries(apartments.map((apartment) => [apartment.id, {status: "new", note: ""}]));
  }
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0}).format(value);
}

function MiniMap({apartment, active}: {apartment: Apartment; active: boolean}) {
  const x = 20 + ((Math.abs(apartment.longitude * 1000) % 53));
  const y = 18 + ((Math.abs(apartment.latitude * 1000) % 39));
  return <div className={`apartment-mini-map ${active ? "active" : ""}`} aria-hidden="true">
    <i className="road road-one"/><i className="road road-two"/><i className="road road-three"/>
    <i className="water"/><span style={{left: `${x}%`, top: `${y}%`}}><MapPin/></span>
    <small>{apartment.neighborhood.split(" /")[0]}</small>
  </div>;
}

function Score({label, value, icon}: {label: string; value: number; icon: React.ReactNode}) {
  return <div className="apartment-score">
    <span>{icon}{label}</span><b>{value}</b><i><em style={{width: `${value}%`}}/></i>
  </div>;
}

export function MovePlanner() {
  const [records, setRecords] = useState<PlannerState>(initialPlannerState);
  const [selectedId, setSelectedId] = useState(apartments[0].id);
  const [query, setQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState("All target areas");
  const [status, setStatus] = useState<ApartmentStatus | "all">("all");
  const [sort, setSort] = useState<SortMode>("fit");
  const [maxRent, setMaxRent] = useState(2400);
  const [showMap, setShowMap] = useState(true);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(records)), [records]);

  const neighborhoods = useMemo(() => [
    "All target areas", ...Array.from(new Set(apartments.map((item) => item.neighborhood.split(" /")[0]))),
  ], []);

  const filtered = useMemo(() => apartments.filter((apartment) => {
    const text = `${apartment.name} ${apartment.neighborhood} ${apartment.address} ${apartment.style} ${apartment.description}`.toLowerCase();
    const inNeighborhood = neighborhood === "All target areas" || apartment.neighborhood.startsWith(neighborhood);
    const inStatus = status === "all" || records[apartment.id]?.status === status;
    return text.includes(query.toLowerCase()) && inNeighborhood && inStatus && apartment.rent <= maxRent;
  }).sort((a, b) => {
    if (sort === "rent") return a.rent - b.rent;
    if (sort === "commute") return a.commuteMinutes - b.commuteMinutes;
    if (sort === "warmth") return b.scores.warmth - a.scores.warmth;
    if (sort === "canopy") return b.scores.canopy - a.scores.canopy;
    return b.scores.overall - a.scores.overall;
  }), [maxRent, neighborhood, query, records, sort, status]);

  const selected = apartments.find((item) => item.id === selectedId) || filtered[0] || apartments[0];
  const selectedRecord = records[selected.id] || {status: "new" as ApartmentStatus, note: ""};
  const savedCount = Object.values(records).filter((item) => ["saved", "tour", "contacted", "applied"].includes(item.status)).length;
  const tourCount = Object.values(records).filter((item) => item.status === "tour").length;
  const monthlyGross = apartmentSourceNotes.income / 12;
  const ceilingRatio = Math.round((apartmentSourceNotes.rentCeiling / monthlyGross) * 1000) / 10;
  const ceilingIncome = apartmentSourceNotes.rentCeiling * 36;
  const bestApartment = apartments.slice().sort((a, b) => b.scores.overall - a.scores.overall)[0];
  const medianSpace = apartments.map((item) => item.squareFeet).sort((a, b) => a - b)[Math.floor(apartments.length / 2)];

  const updateRecord = (id: string, patch: Partial<ApartmentRecord>) => setRecords((current) => ({
    ...current, [id]: {...(current[id] || {status: "new", note: ""}), ...patch},
  }));

  const exportData = () => {
    const payload = JSON.stringify({exportedAt: new Date().toISOString(), records}, null, 2);
    const url = URL.createObjectURL(new Blob([payload], {type: "application/json"}));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "washington-apartment-search.json"; anchor.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as {records?: PlannerState};
      if (parsed.records) setRecords((current) => ({...current, ...parsed.records}));
    } catch { window.alert("That file is not a valid apartment planner backup."); }
  };

  const bbox = `${selected.longitude - .009}%2C${selected.latitude - .006}%2C${selected.longitude + .009}%2C${selected.latitude + .006}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${selected.latitude}%2C${selected.longitude}`;

  return <div className="page apartment-planner">
    <section className="apartment-hero">
      <div className="apartment-hero-copy">
        <span><Trees/>Washington home search · rebuilt field</span>
        <h2>Enough room to become<br/><em>an actual home.</em></h2>
        <p>Twenty-five current floor-plan candidates across north Seattle, Shoreline, Edmonds, Mountlake Terrace, Kenmore, Bothell and selective Kirkland—ranked for lived-in warmth before lobby polish.</p>
        <div className="apartment-hard-filters">
          <b><WashingMachine/>In-unit laundry</b><b><Cat/>Cats allowed</b><b><Building2/>630+ square feet</b><b><MapPin/>Nothing south</b><b><Music2/>Character over boxes</b>
        </div>
      </div>
      <div className="apartment-money-card">
        <span>Qualification model</span><strong>$99K</strong><small>$80K salary + $19K recurring income</small>
        <div><i style={{width: `${ceilingRatio * 2.6}%`}}/><em>{ceilingRatio}% gross at $2,400</em></div>
        <p><Check/>3× rent threshold at the ceiling: <b>{money(ceilingIncome)}</b></p>
        <p><Check/>Monthly gross used here: <b>{money(monthlyGross)}</b></p>
      </div>
    </section>

    <section className="apartment-metrics">
      <button onClick={() => setStatus("all")}><span>Screened field</span><b>25</b><small>real properties</small></button>
      <button onClick={() => setStatus("saved")}><span>Active shortlist</span><b>{savedCount}</b><small>saved or moving</small></button>
      <button onClick={() => setStatus("tour")}><span>Tour queue</span><b>{tourCount}</b><small>ready to inspect</small></button>
      <div><span>Current best fit</span><b>{bestApartment.scores.overall}</b><small>{bestApartment.name} · {bestApartment.squareFeet} sq ft</small></div>
      <div><span>Median living space</span><b>{medianSpace}</b><small>square feet · hard floor {apartmentSourceNotes.squareFeetFloor}</small></div>
      <div><span>Research freshness</span><b>Today</b><small>{apartmentSourceNotes.researchedAt}</small></div>
    </section>

    <section className="apartment-method">
      <div><ShieldCheck/><p><b>Street context, not a fake “safe” badge</b><span>Scores favor residential blocks, park access and separation from higher-friction corridors. The selected card tells you exactly what to inspect after dark.</span></p></div>
      <a href="https://seattle.gov/police/information-and-data/data/crime-dashboard" target="_blank" rel="noreferrer">Seattle street map<ExternalLink/></a>
      <a href="https://www.seattle.gov/trees/management/canopy-cover/" target="_blank" rel="noreferrer">Seattle canopy reference<ExternalLink/></a>
    </section>

    <section className="apartment-toolbar">
      <label className="apartment-search"><Search/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search building, neighborhood, style or park"/></label>
      <div className="apartment-neighborhoods">{neighborhoods.map((item) => <button key={item} className={neighborhood === item ? "active" : ""} onClick={() => setNeighborhood(item)}>{item}</button>)}</div>
      <div className="apartment-controls">
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as ApartmentStatus | "all")}><option value="all">Every status</option>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}><option value="fit">Best fit</option><option value="rent">Lowest rent</option><option value="commute">Fastest access</option><option value="warmth">Most home-like</option><option value="canopy">Most green</option></select></label>
        <label className="rent-slider"><span>Max rent <b>{money(maxRent)}</b></span><input type="range" min="1500" max="2400" step="25" value={maxRent} onChange={(event) => setMaxRent(Number(event.target.value))}/></label>
        <button className={showMap ? "active" : ""} onClick={() => setShowMap((current) => !current)}><Map/>Map</button>
        <button onClick={exportData}><Download/>Backup</button>
        <button onClick={() => importRef.current?.click()}><Upload/>Restore</button>
        <input ref={importRef} hidden type="file" accept="application/json" onChange={(event) => importData(event.target.files?.[0])}/>
      </div>
    </section>

    <section className={`apartment-workspace ${showMap ? "with-map" : ""}`}>
      <div className="apartment-list-panel">
        <div className="apartment-list-caption"><p><b>{filtered.length} candidates</b><span>Every card clears 630 sq ft + cat + in-unit laundry</span></p><span><ArrowDownUp/>Click any card to inspect</span></div>
        <div className="apartment-list">
          {filtered.map((apartment, index) => {
            const record = records[apartment.id] || {status: "new" as ApartmentStatus, note: ""};
            const active = apartment.id === selected.id;
            return <article key={apartment.id} className={`apartment-card ${active ? "active" : ""}`} onClick={() => setSelectedId(apartment.id)}>
              <MiniMap apartment={apartment} active={active}/>
              <div className="apartment-card-copy">
                <div className="apartment-card-top"><span>#{String(index + 1).padStart(2,"0")} · {apartment.neighborhood}</span><b>{apartment.scores.overall}</b></div>
                <h3>{apartment.name}</h3><p>{apartment.style}</p>
                <div className="apartment-card-facts"><b>{money(apartment.rent)}{apartment.rentHigh ? `–${money(apartment.rentHigh)}` : ""}</b><span>{apartment.squareFeet} sq ft</span><span>{apartment.floorplan}</span><span><Clock3/>{apartment.commuteMinutes} min</span></div>
                <div className="apartment-card-tags"><span><Trees/>{apartment.scores.canopy} green</span><span><Sparkles/>{apartment.scores.warmth} warmth</span><span><Route/>{apartment.scores.access} access</span></div>
              </div>
              <div className="apartment-card-actions">
                <button className={`apartment-status status-${record.status}`} onClick={(event) => {event.stopPropagation(); updateRecord(apartment.id, {status: record.status === "saved" ? "new" : "saved"});}} aria-label={`Save ${apartment.name}`}><Heart fill={record.status === "saved" ? "currentColor" : "none"}/>{record.status === "new" ? "Save" : statusOptions.find((item) => item.value === record.status)?.label}</button>
                <ChevronRight/>
              </div>
            </article>;
          })}
          {!filtered.length && <div className="apartment-empty"><Building2/><b>No cards survive those filters.</b><span>Raise the rent ceiling or reopen the complete target field.</span></div>}
        </div>
      </div>

      {showMap && <div className="apartment-detail">
        <div className="apartment-map-frame"><iframe title={`Map of ${selected.name}`} src={mapUrl}/><span><MapPin/>{selected.neighborhood}</span></div>
        <div className="apartment-detail-head"><div><span>{selected.address}</span><h3>{selected.name}</h3><p>{money(selected.rent)}{selected.rentHigh ? `–${money(selected.rentHigh)}` : ""} · {selected.floorplan} · <b>{selected.squareFeet} sq ft</b></p></div><strong>{selected.scores.overall}<small>fit</small></strong></div>
        <div className="apartment-guarantees"><b><WashingMachine/>In-unit W/D</b><b><Cat/>Cats accepted</b><b><Clock3/>{selected.commute}</b></div>
        <p className="apartment-description">{selected.description}</p>
        <div className="apartment-fit-callout"><Sparkles/><p><span>Why it made the 25</span><b>{selected.strongestFit}</b></p></div>
        <div className="apartment-score-grid">
          <Score label="Tree / outdoor field" value={selected.scores.canopy} icon={<Trees/>}/>
          <Score label="Character / warmth" value={selected.scores.warmth} icon={<Sparkles/>}/>
          <Score label="City access" value={selected.scores.access} icon={<Route/>}/>
          <Score label="Street context" value={selected.scores.street} icon={<ShieldCheck/>}/>
        </div>
        <div className="apartment-nearby"><span>Life around it</span>{selected.nearby.map((item) => <b key={item}><Leaf/>{item}</b>)}</div>
        <div className="apartment-watch"><ShieldCheck/><p><span>Inspect before advancing</span>{selected.watch}</p></div>
        <div className="apartment-transit"><Route/><p><span>Connection</span><b>{selected.transit}</b></p></div>
        <label className="apartment-status-control"><span>Search status</span><select value={selectedRecord.status} onChange={(event) => updateRecord(selected.id, {status: event.target.value as ApartmentStatus})}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="apartment-notes"><span>Private field notes</span><textarea value={selectedRecord.note} onChange={(event) => updateRecord(selected.id, {note: event.target.value})} placeholder="Unit orientation, tour notes, fees, sound, actual block impression…"/></label>
        <div className="apartment-detail-actions"><a className="source" href={selected.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink/>Verify live listing</a><button onClick={() => updateRecord(selected.id, {status: "tour"})}><MapPin/>Move to tour queue</button></div>
        <footer><span>Checked {selected.checked}</span><b>{selected.sourceName}</b><small>Availability and rent can move; the source link is the authority at action time.</small></footer>
      </div>}
    </section>
  </div>;
}
