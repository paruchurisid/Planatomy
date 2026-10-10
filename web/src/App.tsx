import { useEffect, useMemo, useState } from "react";
import type { ComponentOccurrence, Configuration } from "./types";
import AircraftScene from "./AircraftScene";
import { COMPONENT_GUIDE, LOCAL_COMPONENTS } from "./aircraftCatalog";
import { SUBSYSTEM_PARTS, type SubsystemPartDefinition } from "./subsystemParts";

const API = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
type CatalogStatus = "connecting" | "live" | "local";

function isA320Reference(value: Configuration) {
  // Never attach another aircraft's catalog to the A320 illustration.
  return /a320/i.test(value.family) && /^a320(?:ceo|[ -]?200)?$/i.test(value.variant.trim());
}

export default function App() {
  const [config, setConfig] = useState<Configuration | null>(null);
  const [components, setComponents] = useState<ComponentOccurrence[]>(LOCAL_COMPONENTS);
  const [liveNames, setLiveNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>("Primary structure");
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [expandedSystems, setExpandedSystems] = useState<string[]>([]);
  const [partExplosion, setPartExplosion] = useState(0.55);
  const [isIsolated, setIsIsolated] = useState(false);
  const [focusKey, setFocusKey] = useState(0);
  const [query, setQuery] = useState("");
  const [explosion, setExplosion] = useState(0.78);
  const [labels, setLabels] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>("connecting");
  const [catalogMessage, setCatalogMessage] = useState("Checking for a connected A320 catalog.");
  const [retryKey, setRetryKey] = useState(0);
  const [showMethodology, setShowMethodology] = useState(false);
  const mode = explosion > 0 ? "exploded" : "assembled";

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    const timeout = window.setTimeout(() => controller.abort(), 6500);
    setCatalogStatus("connecting");
    setCatalogMessage("Checking for a connected A320 catalog.");

    async function load() {
      try {
        const aircraftResponse = await fetch(`${API}/aircraft`, { signal: controller.signal });
        if (!aircraftResponse.ok) throw new Error("The catalog service is unavailable.");
        const aircraft = await aircraftResponse.json() as { items?: Configuration[] };
        if (!Array.isArray(aircraft.items)) throw new Error("The catalog returned an unreadable aircraft list.");
        const reference = aircraft.items.filter((item) =>
          typeof item.id === "string" && typeof item.family === "string" && typeof item.variant === "string",
        ).find(isA320Reference);
        if (!reference) throw new Error("No matching A320ceo or A320-200 reference was found.");
        const componentResponse = await fetch(`${API}/aircraft/${encodeURIComponent(reference.id)}/components`, { signal: controller.signal });
        if (!componentResponse.ok) throw new Error("The A320 component catalog is unavailable.");
        const data = await componentResponse.json() as { items?: ComponentOccurrence[] };
        if (!Array.isArray(data.items)) throw new Error("The catalog returned an unreadable component list.");
        const recognized = data.items.filter((item) =>
          typeof item.id === "string" && Object.hasOwn(COMPONENT_GUIDE, item.canonical_name),
        );
        if (!recognized.length) throw new Error("The A320 reference has no matching illustrated systems.");
        if (!current) return;
        setComponents(LOCAL_COMPONENTS.map((local) => {
          const live = recognized.find((item) => item.canonical_name === local.canonical_name);
          return live ? { ...local, ...live, description: live.description || local.description } : local;
        }));
        setLiveNames(recognized.map((item) => item.canonical_name));
        setConfig(reference);
        setCatalogStatus("live");
        setCatalogMessage("Connected catalog descriptions; geometry remains an original illustration.");
      } catch (reason) {
        if (!current) return;
        setComponents(LOCAL_COMPONENTS);
        setLiveNames([]);
        setConfig(null);
        setCatalogStatus("local");
        setCatalogMessage(controller.signal.aborted
          ? "Catalog connection timed out. The local aircraft illustration is ready to explore."
          : `${reason instanceof Error ? reason.message : "Catalog connection failed."} The local illustration remains available.`);
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => { current = false; window.clearTimeout(timeout); controller.abort(); };
  }, [retryKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return components.map((component) => {
      const parts = SUBSYSTEM_PARTS.filter((part) => part.system === component.canonical_name);
      const matchesSystem = !q || `${component.canonical_name} ${component.description ?? ""} ${component.position_label ?? ""} ${COMPONENT_GUIDE[component.canonical_name]?.ata ?? ""}`.toLowerCase().includes(q);
      const matchingParts = matchesSystem ? parts : parts.filter((part) => `${part.name} ${part.description} ${part.ata}`.toLowerCase().includes(q));
      return { component, parts, matchingParts, matchesSystem };
    }).filter(({ matchesSystem, matchingParts }) => matchesSystem || matchingParts.length > 0);
  }, [components, query]);
  const selected = components.find((component) => component.canonical_name === selectedName) ?? null;
  const selectedPart = SUBSYSTEM_PARTS.find((part) => part.id === selectedPartId) ?? null;
  const systemParts = SUBSYSTEM_PARTS.filter((part) => part.system === selectedName);
  const selectedLive = !!selected && liveNames.includes(selected.canonical_name);
  const selectedGuide = selected ? COMPONENT_GUIDE[selected.canonical_name] : null;

  function selectSystem(name: string | null) {
    setSelectedName(name);
    setSelectedPartId(null);
    if (name) setExpandedSystems((current) => current.includes(name) ? current : [...current, name]);
    if (isIsolated) setFocusKey((current) => current + 1);
  }

  function selectPart(part: SubsystemPartDefinition) {
    setSelectedName(part.system);
    setSelectedPartId(part.id);
    setExpandedSystems((current) => current.includes(part.system) ? current : [...current, part.system]);
    setQuery("");
    setIsIsolated(true);
    setFocusKey((current) => current + 1);
  }

  function toggleSystem(name: string) {
    setExpandedSystems((current) => current.includes(name) ? current.filter((value) => value !== name) : [...current, name]);
  }

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-mark"><span className="brand-glyph" aria-hidden="true">◭</span><div><strong>PLANATOMY</strong><small>aircraft anatomy atlas</small></div></div>
      <div className="header-meta"><span className={`live-dot ${catalogStatus === "live" ? "" : "local-dot"}`} />{catalogStatus === "live" ? "A320 CATALOG CONNECTED" : "ORIGINAL AIRCRAFT STUDY"}</div>
      <button className="about-button" onClick={() => setShowMethodology((value) => !value)} aria-expanded={showMethodology}>About this model <span aria-hidden="true">↗</span></button>
    </header>
    <section className="workspace">
      <aside className="sidebar left-panel">
        <div className="eyebrow">AIRFRAME STUDY / 001</div>
        <h1>Airbus A320<span className="aircraft-subtitle">Delta-inspired · A320-200</span></h1>
        <p className="muted">An original 3D illustration.<br />Open the aircraft. Explore what is inside.</p>
        <div className="reference-chip"><span className="chip-dot" /> ORIGINAL MODEL <span className="reference-code">A320</span></div>
        <div className="panel-divider" />
        <div className="section-heading"><span>EXPLORE SYSTEMS</span><span className="count-badge">{components.length}</span></div>
        <p className="catalog-summary">{SUBSYSTEM_PARTS.length} illustrated parts · open a system to explore</p>
        <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search aircraft systems and parts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parts, systems or ATA…" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}>×</button>}</label>
        <ul className="system-list" aria-label="Aircraft systems and parts">{filtered.map(({ component, parts, matchingParts }) => {
          const expanded = !!query.trim() || expandedSystems.includes(component.canonical_name);
          const selectedSystem = component.canonical_name === selectedName;
          const childListId = `parts-${component.canonical_name.toLowerCase().replace(/\W+/g, "-")}`;
          return <li className={`system-group ${selectedSystem ? "current-system" : ""}`} key={component.canonical_name}>
            <div className="system-heading-row">
              <button className={`system-row ${selectedSystem ? "active" : ""}`} onClick={() => selectSystem(component.canonical_name)} aria-pressed={selectedSystem && !selectedPart}>
                <span className="system-icon" aria-hidden="true">{COMPONENT_GUIDE[component.canonical_name]?.ata.split(" ")[0]}</span>
                <span className="system-copy"><strong>{component.canonical_name}</strong><small>{parts.length} illustrated parts</small></span>
              </button>
              <button className="system-expand" onClick={() => toggleSystem(component.canonical_name)} aria-label={`${expanded ? "Collapse" : "Expand"} ${component.canonical_name} parts`} aria-expanded={expanded} aria-controls={childListId} disabled={!!query.trim()}><span aria-hidden="true">{expanded ? "−" : "+"}</span></button>
            </div>
            {expanded && <ul className="part-list" id={childListId} aria-label={`${component.canonical_name} parts`}>
              {matchingParts.map((part) => <li key={part.id}><button className={`part-row ${part.id === selectedPartId ? "active" : ""}`} onClick={() => selectPart(part)} aria-pressed={part.id === selectedPartId}><span className="part-marker" aria-hidden="true" /><span>{part.name}</span><span className="part-row-arrow" aria-hidden="true">↗</span></button></li>)}
              {!matchingParts.length && <li className="no-subparts">Assembly geometry only</li>}
            </ul>}
          </li>;
        })}</ul>
        {!filtered.length && <div className="empty-state">No systems or parts match “{query}”. <button onClick={() => setQuery("")}>Clear search</button></div>}
        <div className="sidebar-footer" role="status"><div><span className={`status-orb ${catalogStatus === "live" ? "connected" : ""}`} />{catalogStatus === "live" ? `${liveNames.length} systems linked to catalog` : catalogStatus === "connecting" ? "Connecting to catalog…" : "Local illustration catalog"}</div><p>{catalogMessage}</p>{catalogStatus === "local" && <button className="text-button" onClick={() => setRetryKey((value) => value + 1)}>Reconnect catalog ↻</button>}</div>
      </aside>
      <section className="viewer-panel" aria-label="Interactive aircraft viewer">
        <div className="viewer-toolbar">
          <div className="toolbar-pill"><span className="toolbar-dot" />{mode === "assembled" ? "ASSEMBLED" : "EXPLODED"}<span className="toolbar-subtitle"> / A320-200</span></div>
          <div className="toolbar-actions" aria-label="Aircraft view"><button onClick={() => setExplosion(0)} className={mode === "assembled" ? "selected" : ""} aria-pressed={mode === "assembled"}>Assembled</button><button onClick={() => setExplosion(0.78)} className={mode === "exploded" ? "selected" : ""} aria-pressed={mode === "exploded"}>Exploded</button></div>
        </div>
        <div className="inspection-toolbar">
          <div className="inspection-context"><span className="context-label">{isIsolated ? "SYSTEM STUDY" : "AIRCRAFT OVERVIEW"}</span><strong>{isIsolated ? selectedName : `${SUBSYSTEM_PARTS.length} parts to discover`}</strong>{isIsolated && selectedPart && <span className="context-part">/ {selectedPart.name}</span>}</div>
          <button className={`context-button ${isIsolated ? "enabled" : ""}`} disabled={!selected} onClick={() => setIsIsolated((value) => !value)} aria-pressed={isIsolated}>{isIsolated ? "Show aircraft" : "Isolate system"}</button>
          <button className="context-button" disabled={!selected} onClick={() => { setIsIsolated(true); setFocusKey((value) => value + 1); }}>Focus selection</button>
        </div>
        <div className="scene-wrap"><AircraftScene selected={selected} selectedPartId={selectedPartId} mode={mode} explosion={explosion} partExplosion={isIsolated ? partExplosion : 0} isolatedSystem={isIsolated ? selectedName : null} focusKey={focusKey} labels={labels} resetKey={resetKey} onSelect={(id) => selectSystem(components.find((component) => component.id === id)?.canonical_name ?? null)} onSelectPart={(id) => { const part = SUBSYSTEM_PARTS.find((item) => item.id === id); if (part) selectPart(part); }} components={components} /></div>
        <div className="viewer-controls">
          <div className="separation-controls">
            <label className="explosion-control" htmlFor="explosion"><span>ASSEMBLY SPREAD</span><input id="explosion" type="range" min="0" max="100" step="1" value={Math.round(explosion * 100)} onChange={(event) => setExplosion(Number(event.target.value) / 100)} aria-valuetext={`${Math.round(explosion * 100)} percent separated`} /><output htmlFor="explosion">{Math.round(explosion * 100)}%</output></label>
            <label className={`explosion-control ${!isIsolated ? "inactive-control" : ""}`} htmlFor="part-explosion"><span>SUBSYSTEM SPREAD</span><input id="part-explosion" type="range" min="0" max="100" step="1" value={Math.round(partExplosion * 100)} disabled={!isIsolated} onChange={(event) => setPartExplosion(Number(event.target.value) / 100)} aria-describedby="subsystem-spread-hint" aria-valuetext={`${Math.round(partExplosion * 100)} percent separated`} /><output htmlFor="part-explosion">{isIsolated ? `${Math.round(partExplosion * 100)}%` : "—"}</output></label>
            <p id="subsystem-spread-hint" className="spread-hint">{isIsolated ? "Separate the parts within this system." : "Select a part or isolate a system to spread its parts."}</p>
          </div>
          <button className={`control-button ${labels ? "enabled" : ""}`} onClick={() => setLabels((value) => !value)} aria-pressed={labels}>Labels {labels ? "on" : "off"}</button>
          <button className="control-button" onClick={() => setResetKey((value) => value + 1)}>↺ Reset view</button>
        </div>
        <div className="viewer-help"><span>Drag to orbit</span><span>Scroll or pinch to zoom</span><span>Click a part to inspect</span></div>
        <div className="coverage-banner"><span className="small-triangle" aria-hidden="true">△</span><span>Original geometry & livery art. {SUBSYSTEM_PARTS.length} illustrative parts; layouts and sizes are simplified.</span><button onClick={() => setShowMethodology((value) => !value)} aria-expanded={showMethodology}>Model notes ↗</button></div>
        {showMethodology && <div className="methodology-panel">
          <div className="section-heading"><span>ABOUT THIS ILLUSTRATION</span><button className="close-button" aria-label="Close model notes" onClick={() => setShowMethodology(false)}>×</button></div>
          <p>This aircraft and its Delta-inspired livery are drawn in code for Planatomy. No downloaded aircraft mesh is used. It is an educational A320-200 study with simplified parts, an illustrative cabin and representative system locations.</p>
          <p>The exploded arrangement explains assembly relationships. It is not engineering CAD, a maintenance manual, an exact Delta aircraft configuration or a complete parts inventory. Delta and Airbus do not endorse this project.</p>
          <p>Reference context: <a href="https://www.delta.com/us/en/aircraft/airbus/a320" target="_blank" rel="noreferrer">Delta A320</a> · <a href="https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a320-family" target="_blank" rel="noreferrer">Airbus A320 family</a>. Geometry and dimensions are approximate.</p>
        </div>}
      </section>
      <aside className="sidebar detail-panel" aria-label={selectedPart ? "Selected part details" : "Selected system details"}>
        <div className="detail-topline"><span className="eyebrow">{selectedPart ? "PART INSPECTOR" : "SYSTEM INSPECTOR"}</span><span className="inspector-dot" /></div>
        {selected ? <>
          {selectedPart && <button className="inspector-breadcrumb" onClick={() => selectSystem(selected.canonical_name)}>← {selected.canonical_name}</button>}
          <div className="detail-title-row"><div><h2>{selectedPart?.name ?? selected.canonical_name}</h2><span className="verified-pill">{selectedPart ? "ILLUSTRATED PART" : selectedLive ? "CATALOG-LINKED SYSTEM" : "ILLUSTRATED SYSTEM"}</span></div>{!selectedPart && <div className="detail-number">{String(components.indexOf(selected) + 1).padStart(2, "0")}</div>}</div>
          <div className="detail-card"><div className="card-label">WHAT IT DOES</div><p>{selectedPart?.description ?? selected.description ?? "A representative aircraft system shown as a simplified assembly."}</p><div className="card-grid"><div><span>ATA REFERENCE</span><strong>{selectedPart?.ata ?? selectedGuide?.ata ?? "—"}</strong></div><div><span>GEOMETRY</span><strong>Original illustration</strong></div>{selectedPart ? <><div className="grid-full"><span>PARENT SYSTEM</span><button className="inline-system-link" onClick={() => selectSystem(selected.canonical_name)}>{selected.canonical_name} ↗</button></div><div className="grid-full"><span>PARENT ASSEMBLY</span><strong className="assembly-name">{selectedPart.assemblyId.replace(/[-_]+/g, " ")}</strong></div></> : <div className="grid-full"><span>MODEL LOCATION</span><strong>{selectedGuide?.cue ?? selected.position_label ?? "Aircraft system"}</strong></div>}</div></div>
          <div className="detail-section inspector-parts"><div className="section-heading"><span>{selectedPart ? "PARTS IN THIS SYSTEM" : "EXPLORE INDIVIDUAL PARTS"}</span><span className="count-badge">{systemParts.length}</span></div><p className="parts-intro">{selectedPart ? "Select another part to inspect its function." : "Choose a part to isolate this system and look inside."}</p><ul className="sibling-list">{systemParts.map((part, index) => <li key={part.id}><button className={part.id === selectedPartId ? "active" : ""} onClick={() => selectPart(part)} aria-pressed={part.id === selectedPartId}><span className="sibling-number">{String(index + 1).padStart(2, "0")}</span><span>{part.name}</span><span className="sibling-arrow" aria-hidden="true">↗</span></button></li>)}</ul></div>
          <div className="detail-section cost-section"><div className="section-heading"><span>PART COST</span><span className="lock-label">EVIDENCE PENDING</span></div><div className="price-empty"><div className="price-placeholder">— <span>USD</span></div><strong>No verified part price</strong><p>{selectedPart ? "This illustrated part has no verified manufacturer part number or price evidence. Its appearance and function do not establish aircraft applicability." : "A system can contain many individual parts. This illustration is not mapped to specific manufacturer part numbers or comparable price evidence."}</p><details className="requirements"><summary>What is needed for a price?</summary><p>A verified part number, aircraft applicability, condition, source, currency and observation date. Assembly and individual-part prices must be distinguished.</p></details></div></div>
          <div className="detail-section reference-section"><div className="section-heading"><span>REFERENCE STATUS</span></div><div className="trace-row"><span>{selectedPart ? "Part description" : "Component description"}</span><b>{selectedPart ? "Local illustration" : selectedLive ? "Connected catalog" : "Local illustration"}</b></div><div className="trace-row"><span>{selectedPart ? "Manufacturer part number" : "Catalog revision"}</span><b>{selectedPart ? "Not verified" : selectedLive && config ? `R${config.revision}` : "Not linked"}</b></div><div className="trace-row"><span>Aircraft configuration</span><b>Illustrative</b></div><div className="trace-row"><span>Engineering review</span><b>Not performed</b></div></div>
          <div className="inspection-hint"><span aria-hidden="true">↗</span> {isIsolated ? "Use Subsystem spread to separate these parts, or Show aircraft to return to the full model." : "Choose a part from either list, or isolate a system to inspect its internal geometry."}</div>
        </> : <div className="empty-detail">Select a component from the aircraft or systems list.</div>}
      </aside>
    </section>
  </main>;
}
