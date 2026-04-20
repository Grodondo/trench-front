"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  MAP_LOCATIONS,
  HISTORICAL_EVENTS,
  EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
  LOCATION_SIDE_COLORS,
  MIN_YEAR,
  MAX_YEAR,
  type MapLocation,
  type HistoricalEvent,
  type EventType,
  type LocationSide,
} from "@/lib/worldMapData";

// Types
type Selected =
  | { kind: "location"; item: MapLocation }
  | { kind: "event"; item: HistoricalEvent }
  | null;

const YEAR_PRESETS = [
  { label: "All Eras", from: MIN_YEAR, to: MAX_YEAR },
  { label: "Early Crusade", from: 1099, to: 1399 },
  { label: "1400-1700", from: 1400, to: 1700 },
  { label: "Modern War", from: 1700, to: MAX_YEAR },
];

const ALL_SIDES: LocationSide[] = ["FAITHFUL", "INFERNAL", "CONTESTED", "NEUTRAL"];
const ALL_EVENT_TYPES: EventType[] = ["BATTLE", "POLITICAL", "SUPERNATURAL", "DISASTER", "ACHIEVEMENT"];

function DiamondIcon({ fill, stroke, size = 18, glow }: { fill: string; stroke: string; size?: number; glow?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, filter: glow ? `drop-shadow(0 0 5px ${fill})` : `drop-shadow(0 0 2px ${fill})` }}>
      <path d="M12 2L22 12L12 22L2 12Z" fill={fill} fillOpacity={glow ? 0.95 : 0.75} stroke={stroke} strokeWidth={glow ? 2 : 1.5} />
    </svg>
  );
}

function CircleIcon({ fill, stroke, size = 18, glow }: { fill: string; stroke: string; size?: number; glow?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, filter: glow ? `drop-shadow(0 0 5px ${fill})` : `drop-shadow(0 0 2px ${fill})` }}>
      <circle cx="12" cy="12" r="9" fill={fill} fillOpacity={glow ? 0.9 : 0.7} stroke={stroke} strokeWidth={glow ? 2.5 : 1.5} />
      <circle cx="12" cy="12" r="3.5" fill="white" fillOpacity={0.9} />
    </svg>
  );
}

function DetailPanel({ selected, onClose }: { selected: Selected; onClose: () => void }) {
  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full opacity-40 p-6">
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#c8a96e]/30" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <p className="text-xs font-mono text-center text-[#c8a96e]/40 leading-relaxed">Click a marker on the map to see details</p>
      </div>
    );
  }

  if (selected.kind === "location") {
    const loc = selected.item;
    const colors = LOCATION_SIDE_COLORS[loc.side];
    const sideLabel = loc.side === "FAITHFUL" ? "Faithful Territory" : loc.side === "INFERNAL" ? "Infernal Domain" : loc.side === "CONTESTED" ? "Contested Territory" : "Neutral Power";
    return (
      <div className="flex flex-col gap-4 h-full p-5 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CircleIcon fill={colors.fill} stroke={colors.stroke} size={14} />
            <span className={`text-[10px] font-mono uppercase tracking-widest ${colors.text}`}>{sideLabel}</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#c8a96e] leading-tight">{loc.name}</h3>
          {loc.faction && <p className="text-xs text-[#c8a96e]/50 font-mono mt-0.5">{loc.faction}</p>}
        </div>
        <div className="h-px w-full" style={{ background: colors.fill, opacity: 0.3 }} />
        <p className="text-sm text-[#e8d5b0]/75 leading-relaxed flex-1">{loc.description}</p>
        <button onClick={onClose} className="text-xs font-mono uppercase tracking-wider text-[#c8a96e]/40 hover:text-[#c8a96e]/70 transition-colors text-left">x Close</button>
      </div>
    );
  }

  const ev = selected.item;
  const colors = EVENT_TYPE_COLORS[ev.type];
  const yearLabel = ev.yearEnd ? `${ev.year} - ${ev.yearEnd}` : String(ev.year);
  return (
    <div className="flex flex-col gap-4 h-full p-5 overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DiamondIcon fill={colors.fill} stroke={colors.stroke} size={14} />
          <span className={`text-[10px] font-mono uppercase tracking-widest ${colors.text}`}>{EVENT_TYPE_LABELS[ev.type]}</span>
        </div>
        <p className="text-xs font-mono text-[#c8a96e]/40 mb-1">{yearLabel}</p>
        <h3 className="font-serif text-xl font-bold text-[#c8a96e] leading-tight">{ev.title}</h3>
      </div>
      <div className="h-px w-full" style={{ background: colors.fill, opacity: 0.3 }} />
      <p className="text-sm text-[#e8d5b0]/75 leading-relaxed flex-1">{ev.description}</p>
      <button onClick={onClose} className="text-xs font-mono uppercase tracking-wider text-[#c8a96e]/40 hover:text-[#c8a96e]/70 transition-colors text-left">x Close</button>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded border transition-colors whitespace-nowrap ${
        active
          ? "border-[#c8a96e]/60 bg-[#c8a96e]/10 text-[#c8a96e]"
          : "border-[#2e1b0e] text-[#4a3728] hover:border-[#4a3728] hover:text-[#c8a96e]/50"
      }`}
    >
      {children}
    </button>
  );
}

export default function WorldMapClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const [showLocations, setShowLocations] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [yearFrom, setYearFrom] = useState(MIN_YEAR);
  const [yearTo, setYearTo] = useState(MAX_YEAR);
  const [activeSides, setActiveSides] = useState<Set<LocationSide>>(new Set(ALL_SIDES));
  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(ALL_EVENT_TYPES));
  const [selected, setSelected] = useState<Selected>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try { await outerRef.current?.requestFullscreen(); } catch { /* CSS fallback active */ }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch { /* ignore */ } }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const clampTranslate = useCallback((tx: number, ty: number, s: number) => {
    const cw = containerRef.current?.clientWidth ?? 800;
    const ch = containerRef.current?.clientHeight ?? 500;
    const iw = (imgRef.current?.offsetWidth ?? 800) * s;
    const ih = (imgRef.current?.offsetHeight ?? 500) * s;
    const maxX = Math.max(0, (iw - cw) / 2);
    const maxY = Math.max(0, (ih - ch) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, tx)), y: Math.max(-maxY, Math.min(maxY, ty)) };
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    const next = Math.max(0.5, Math.min(5, scale + delta));
    setScale(next);
    setTranslate((t) => clampTranslate(t.x, t.y, next));
  }, [scale, clampTranslate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.marker) return;
    setDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setTranslate(clampTranslate(e.clientX - dragStart.x, e.clientY - dragStart.y, scale));
  }, [dragging, dragStart, scale, clampTranslate]);

  const stopDrag = () => setDragging(false);
  const zoom = (delta: number) => {
    const next = Math.max(0.5, Math.min(5, scale + delta));
    setScale(next);
    setTranslate((t) => clampTranslate(t.x, t.y, next));
  };
  const resetView = () => { setScale(1); setTranslate({ x: 0, y: 0 }); setSelected(null); };

  const toggleSide = (side: LocationSide) => setActiveSides((prev) => { const n = new Set(prev); n.has(side) ? n.delete(side) : n.add(side); return n; });
  const toggleType = (type: EventType) => setActiveTypes((prev) => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n; });

  const filteredLocations = MAP_LOCATIONS.filter((l) => showLocations && activeSides.has(l.side));
  const filteredEvents = HISTORICAL_EVENTS.filter((e) => {
    if (!showEvents) return false;
    const eEnd = e.yearEnd ?? e.year;
    if (e.year > yearTo || eEnd < yearFrom) return false;
    if (!activeTypes.has(e.type)) return false;
    if (e.side === "BOTH") return true;
    return activeSides.has(e.side as LocationSide);
  });

  const mapHeight = isFullscreen ? "calc(100vh - 230px)" : "62vh";

  return (
    <div
      ref={outerRef}
      className={isFullscreen ? "fixed inset-0 z-[9999] bg-[#0d0805] flex flex-col gap-3 p-4 overflow-hidden" : "flex flex-col gap-3"}
    >
      {/* Filter bar */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-center bg-[#120a05] border border-[#2e1b0e] rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30">Layers</span>
          <Chip active={showLocations} onClick={() => setShowLocations((v) => !v)}>Locations</Chip>
          <Chip active={showEvents} onClick={() => setShowEvents((v) => !v)}>Events</Chip>
        </div>
        <div className="w-px h-4 bg-[#2e1b0e] hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30">Side</span>
          {ALL_SIDES.map((side) => <Chip key={side} active={activeSides.has(side)} onClick={() => toggleSide(side)}>{side === "FAITHFUL" ? "Faith" : side === "INFERNAL" ? "Infernal" : side === "CONTESTED" ? "Contested" : "Neutral"}</Chip>)}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <button onClick={() => zoom(0.3)} className="w-7 h-7 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors font-mono">+</button>
          <button onClick={() => zoom(-0.3)} className="w-7 h-7 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors font-mono">-</button>
          <button onClick={resetView} className="px-2.5 h-7 rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[10px] font-mono uppercase text-[#c8a96e]/60 hover:text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors">Reset</button>
          <span className="text-[10px] font-mono text-[#c8a96e]/30 w-9 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"} className="w-7 h-7 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e]/60 hover:text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors">
            {isFullscreen
              ? <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
              : <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Year + event type filter */}
      {showEvents && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center bg-[#120a05] border border-[#2e1b0e] rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30">Era</span>
            {YEAR_PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => { setYearFrom(p.from); setYearTo(p.to); }}
                className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border transition-colors ${yearFrom === p.from && yearTo === p.to ? "border-[#c8a96e]/60 bg-[#c8a96e]/10 text-[#c8a96e]" : "border-[#2e1b0e] text-[#4a3728] hover:border-[#4a3728]"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#c8a96e]/30">From</span>
            <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearFrom} onChange={(e) => setYearFrom(Math.min(Number(e.target.value), yearTo - 1))} className="w-28 accent-amber-400" />
            <span className="text-[10px] font-mono text-[#c8a96e] w-10">{yearFrom}</span>
            <span className="text-[10px] font-mono text-[#c8a96e]/30">To</span>
            <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearTo} onChange={(e) => setYearTo(Math.max(Number(e.target.value), yearFrom + 1))} className="w-28 accent-amber-400" />
            <span className="text-[10px] font-mono text-[#c8a96e] w-10">{yearTo}</span>
          </div>
          <div className="w-px h-4 bg-[#2e1b0e] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30">Type</span>
            {ALL_EVENT_TYPES.map((type) => <Chip key={type} active={activeTypes.has(type)} onClick={() => toggleType(type)}>{EVENT_TYPE_LABELS[type]}</Chip>)}
          </div>
          <div className="ml-auto text-[10px] font-mono text-[#c8a96e]/30">{filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} shown</div>
        </div>
      )}

      {/* Map + panel */}
      <div className="flex gap-4 items-start flex-1 min-h-0">
        <div ref={containerRef} className="relative overflow-hidden rounded-lg border border-[#2e1b0e] bg-[#0d0805] flex-1"
          style={{ height: mapHeight, cursor: dragging ? "grabbing" : "grab" }}
          onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={stopDrag} onMouseLeave={stopDrag}>
          <div style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transformOrigin: "center center", transition: dragging ? "none" : "transform 0.12s ease", position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} src="/trench_crusade_map.webp" alt="Official Trench Crusade World Map"
                className="max-w-none select-none" style={{ maxHeight: isFullscreen ? "calc(100vh - 250px)" : "62vh", width: "auto" }}
                draggable={false} onLoad={() => setImgLoaded(true)} />

              {imgLoaded && filteredLocations.map((loc) => {
                const colors = LOCATION_SIDE_COLORS[loc.side];
                const isSel = selected?.kind === "location" && selected.item.id === loc.id;
                return (
                  <button key={loc.id} data-marker="true"
                    onClick={(e) => { e.stopPropagation(); setSelected(isSel ? null : { kind: "location", item: loc }); }}
                    style={{ position: "absolute", left: `${loc.x}%`, top: `${loc.y}%`, transform: "translate(-50%, -50%)", zIndex: isSel ? 20 : 10 }}
                    className="group" aria-label={loc.name}>
                    <CircleIcon fill={colors.fill} stroke={colors.stroke} size={isSel ? 26 : 18} glow={isSel} />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded bg-[#0d0805]/95 border border-[#2e1b0e] text-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity z-30">{loc.name}</span>
                  </button>
                );
              })}

              {imgLoaded && filteredEvents.map((ev) => {
                const colors = EVENT_TYPE_COLORS[ev.type];
                const isSel = selected?.kind === "event" && selected.item.id === ev.id;
                return (
                  <button key={ev.id} data-marker="true"
                    onClick={(e) => { e.stopPropagation(); setSelected(isSel ? null : { kind: "event", item: ev }); }}
                    style={{ position: "absolute", left: `${ev.x}%`, top: `${ev.y}%`, transform: "translate(-50%, -50%)", zIndex: isSel ? 20 : 10 }}
                    className="group" aria-label={`${ev.year}: ${ev.title}`}>
                    <DiamondIcon fill={colors.fill} stroke={colors.stroke} size={isSel ? 24 : 16} glow={isSel} />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded bg-[#0d0805]/95 border border-[#2e1b0e] z-30 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.stroke }}>{ev.year}{ev.yearEnd ? `-${ev.yearEnd}` : ""}: {ev.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="absolute bottom-2 left-3 text-[9px] font-mono text-[#c8a96e]/25 pointer-events-none">Scroll to zoom · Drag to pan · Click markers for details</p>
        </div>

        <div className="w-64 shrink-0 rounded-lg border border-[#2e1b0e] bg-[#120a05]" style={{ width: "17rem", height: mapHeight }}>
          <DetailPanel selected={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 bg-[#120a05] border border-[#2e1b0e] rounded-lg px-4 py-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30 self-center">Legend</span>
        {(["FAITHFUL","INFERNAL","CONTESTED","NEUTRAL"] as LocationSide[]).map((side) => { const c = LOCATION_SIDE_COLORS[side]; return (
          <div key={side} className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" width="12" height="12"><circle cx="8" cy="8" r="6" fill={c.fill} fillOpacity="0.7" stroke={c.stroke} strokeWidth="1.5"/><circle cx="8" cy="8" r="2.5" fill="white" fillOpacity="0.9"/></svg>
            <span className={`text-[10px] font-mono ${c.text}`}>{side === "FAITHFUL" ? "Faithful" : side === "INFERNAL" ? "Infernal" : side === "CONTESTED" ? "Contested" : "Neutral"}</span>
          </div>
        ); })}
        <div className="w-px h-4 bg-[#2e1b0e] self-center" />
        {ALL_EVENT_TYPES.map((type) => { const c = EVENT_TYPE_COLORS[type]; return (
          <div key={type} className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 1L15 8L8 15L1 8Z" fill={c.fill} fillOpacity="0.75" stroke={c.stroke} strokeWidth="1.5"/></svg>
            <span className={`text-[10px] font-mono ${c.text}`}>{EVENT_TYPE_LABELS[type]}</span>
          </div>
        ); })}
      </div>
    </div>
  );
}
