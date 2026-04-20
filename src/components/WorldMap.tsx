"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Hotspot {
  id: string;
  name: string;
  /** % from left of image */
  x: number;
  /** % from top of image */
  y: number;
  side: "FAITHFUL" | "INFERNAL" | "CONTESTED" | "NEUTRAL";
  description: string;
  faction?: string;
}

const HOTSPOTS: Hotspot[] = [
  // ── NEUTRAL POWERS ──────────────────────────────────────────────────────────
  {
    id: "ultima-thule",
    name: "Ultima Thule",
    x: 28,
    y: 8,
    side: "NEUTRAL",
    description:
      "The northernmost known land, shrouded in perpetual ice. Explorers who venture here report strange lights and voices whispering in forgotten tongues. Its allegiance, if any, remains unknown.",
  },
  {
    id: "kingdom-of-alba",
    name: "Kingdom of Alba",
    x: 21,
    y: 22,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "The highland kingdom of the north provides the feared Kingdom of Alba Assault Detachment — shock troops trained in brutal close-quarters warfare in the mist-shrouded valleys. Their war-cry has broken many a Heretic line.",
  },
  {
    id: "england",
    name: "England",
    x: 23,
    y: 32,
    side: "FAITHFUL",
    description:
      "The heart of the Britannian crusader tradition. English longbowmen and armoured knights have fought the Infernal for generations. Many Crusader Knights trace their lineage to English noble houses.",
  },
  {
    id: "paris",
    name: "Paris / Holy Francia",
    x: 28,
    y: 44,
    side: "FAITHFUL",
    description:
      "The spiritual and political center of the Faithful war machine. Paris hosts the Grand Council of the Crusade, where faction leaders debate strategy while the trenches consume men by the thousands.",
  },
  {
    id: "free-state-prussia",
    name: "Free State of Prussia",
    x: 43,
    y: 36,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "Prussian Stosstruppen are the storm-trooper elite of New Antioch — disciplined shock assault units who pioneered trench-clearing tactics. Their iron discipline and tactical acumen make them among the most feared units in the Faithful arsenal.",
  },
  {
    id: "rome",
    name: "Rome & Naval States",
    x: 38,
    y: 58,
    side: "FAITHFUL",
    description:
      "The eternal city is the seat of the Church and the most heavily fortified city in the Faithful territories. The Naval States launch crusader fleets from these coasts, and it is here that the Heretic Naval Raiders strike their most devastating blows.",
  },
  {
    id: "byzantine",
    name: "Ruins of Byzantium",
    x: 60,
    y: 56,
    side: "CONTESTED",
    description:
      "Once the great eastern bulwark of Christendom, Byzantium was shattered centuries ago in the opening salvos of the eternal war. Its ruins are now a no-man's-land between the Faithful kingdoms and the corrupted east — a haunted wasteland of broken spires.",
  },
  {
    id: "kingdom-of-abyssinia",
    name: "Abyssinia",
    x: 62,
    y: 88,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "The Expeditionary Forces of Abyssinia are among the fiercest warriors of the Faithful cause — veteran soldiers hardened by desert warfare and driven by ancient Christian faith. They fight under their own banner but answer to New Antioch.",
  },
  {
    id: "kingdom-numidia",
    name: "Kingdom of Numidia",
    x: 27,
    y: 80,
    side: "FAITHFUL",
    description:
      "The North African kingdom is a vital supply route for the Eastern Crusade. Its ports provide grain and soldiers, while its scholars preserve ancient texts that may hold the key to closing the gates of Hell.",
  },
  {
    id: "iron-sultanate-territory",
    name: "Sultanate of the Great Wall",
    x: 84,
    y: 64,
    side: "FAITHFUL",
    faction: "Iron Sultanate",
    description:
      "The Iron Sultanate holds the easternmost line of the Faithful — a vast fortified border stretching from the desert to the mountains. Here the alchemical sciences have been weaponised into Brazen Bulls and Janissary rifles, forming a wall of iron against the demon tide.",
  },
  {
    id: "new-antioch",
    name: "New Antioch",
    x: 78,
    y: 72,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "The crusader capital and seat of the Principality. Founded when the crusaders first reached the Holy Land, New Antioch has been besieged, rebuilt, and re-fortified more times than any city in history. It is the last major Faithful stronghold before Jerusalem.",
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    x: 77,
    y: 82,
    side: "CONTESTED",
    description:
      "The ultimate prize of the eternal war. Jerusalem has changed hands countless times, its streets running alternately with holy water and infernal ichor. Currently under siege from multiple directions, its fall would be catastrophic for the Faithful — or so the prophets say.",
  },
  {
    id: "beelzebub",
    name: "Domain of Beelzebub",
    x: 74,
    y: 78,
    side: "INFERNAL",
    faction: "Cult of the Black Grail",
    description:
      "The Lord of Flies has made this blasted wasteland his earthly throne. The air here buzzes with plague-flies, the ground writhes with infestation, and the Cult of the Black Grail ministers to the damned. It is from here that Herald swarms rise to blot out the sun.",
  },
  {
    id: "domain-mammon",
    name: "Domain of Mammon",
    x: 63,
    y: 90,
    side: "INFERNAL",
    description:
      "A vast corrupted territory in the south where a great demon lord has established dominion. The land itself has been transformed into a hellscape of twisted metal and burning sulphur — a preview of what the Infernal wish to make of the entire world.",
  },
  {
    id: "golden-khanate",
    name: "Golden Khanate",
    x: 86,
    y: 42,
    side: "NEUTRAL",
    description:
      "The vast steppe empire of the east watches the eternal war with calculating eyes. The Khanate trades with both sides, sells warriors to neither, and waits for the moment to strike when the warring powers have exhausted themselves. Their cavalry is rumoured to be able to outrun demons.",
  },
  {
    id: "tzardom-siberia",
    name: "Tzardom of Siberia",
    x: 82,
    y: 14,
    side: "FAITHFUL",
    description:
      "The frozen empire of the east maintains a wary distance from the main crusade, but its northern borders have been touched by infernal corruption spreading from the east. Siberian sharpshooters are prized mercenaries in the trenches — they know how to survive.",
  },
  {
    id: "heretic-territory",
    name: "Fallen Crusader Territories",
    x: 50,
    y: 65,
    side: "INFERNAL",
    faction: "Heretic Legion",
    description:
      "Swathes of once-Faithful territory that fell to the Heretic Legion generations ago. The corrupted villages and shattered churches of these lands now serve as staging grounds for Heretic offensives. Scouts who venture in rarely return.",
  },
];

const SIDE_COLORS = {
  FAITHFUL: { fill: "#3b82f6", stroke: "#93c5fd", label: "text-[#7ab0d8]" },
  INFERNAL: { fill: "#dc2626", stroke: "#fca5a5", label: "text-[#d87a7a]" },
  CONTESTED: { fill: "#d97706", stroke: "#fcd34d", label: "text-[#d4b87a]" },
  NEUTRAL: { fill: "#6b7280", stroke: "#d1d5db", label: "text-[#a0a0a0]" },
};

export default function WorldMapClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  // Measure image size after mount
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const update = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    if (img.complete) update();
    else img.addEventListener("load", update);
    return () => img.removeEventListener("load", update);
  }, []);

  const clampTranslate = useCallback(
    (tx: number, ty: number, s: number) => {
      const cw = containerRef.current?.clientWidth ?? 800;
      const ch = containerRef.current?.clientHeight ?? 500;
      const iw = (imgRef.current?.offsetWidth ?? 800) * s;
      const ih = (imgRef.current?.offsetHeight ?? 500) * s;
      const maxX = Math.max(0, (iw - cw) / 2);
      const maxY = Math.max(0, (ih - ch) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, tx)),
        y: Math.max(-maxY, Math.min(maxY, ty)),
      };
    },
    []
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      const next = Math.max(0.5, Math.min(4, scale + delta));
      const clamped = clampTranslate(translate.x, translate.y, next);
      setScale(next);
      setTranslate(clamped);
    },
    [scale, translate, clampTranslate]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.hotspot) return;
    setDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const raw = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
      setTranslate(clampTranslate(raw.x, raw.y, scale));
    },
    [dragging, dragStart, scale, clampTranslate]
  );

  const stopDrag = () => setDragging(false);

  const zoom = (delta: number) => {
    const next = Math.max(0.5, Math.min(4, scale + delta));
    const clamped = clampTranslate(translate.x, translate.y, next);
    setScale(next);
    setTranslate(clamped);
  };

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setSelected(null);
  };

  return (
    <div className="relative flex flex-col gap-4">
      {/* Zoom controls */}
      <div className="flex items-center gap-2 self-end">
        <button
          onClick={() => zoom(0.25)}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e] hover:border-[#c8a96e]/40 text-lg font-mono transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => zoom(-0.25)}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e] hover:border-[#c8a96e]/40 text-lg font-mono transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={reset}
          className="px-3 h-8 rounded border border-[#2e1b0e] bg-[#1a0f0a] text-xs font-mono uppercase tracking-wider text-[#c8a96e]/60 hover:text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors"
        >
          Reset
        </button>
        <span className="text-xs font-mono text-[#c8a96e]/30">{Math.round(scale * 100)}%</span>
      </div>

      {/* Map + panel layout */}
      <div className="flex gap-4 items-start">
        {/* Map container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border border-[#2e1b0e] bg-[#0d0805] flex-1"
          style={{ height: "65vh", cursor: dragging ? "grabbing" : "grab" }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {/* The map image + hotspot overlay */}
          <div
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: dragging ? "none" : "transform 0.15s ease",
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src="/trench_crusade_map.webp"
                alt="The Lands of the Great Powers — Official Trench Crusade World Map"
                className="max-w-none select-none"
                style={{ maxHeight: "65vh", width: "auto" }}
                draggable={false}
              />

              {/* Hotspots */}
              {imgSize.w > 0 &&
                HOTSPOTS.map((h) => {
                  const colors = SIDE_COLORS[h.side];
                  const isSelected = selected?.id === h.id;
                  return (
                    <button
                      key={h.id}
                      data-hotspot="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(selected?.id === h.id ? null : h);
                      }}
                      style={{
                        position: "absolute",
                        left: `${h.x}%`,
                        top: `${h.y}%`,
                        transform: "translate(-50%, -50%)",
                        zIndex: isSelected ? 20 : 10,
                      }}
                      className="group"
                      aria-label={h.name}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="transition-all duration-200"
                        style={{
                          width: isSelected ? "28px" : "20px",
                          height: isSelected ? "28px" : "20px",
                          filter: isSelected
                            ? `drop-shadow(0 0 6px ${colors.fill})`
                            : `drop-shadow(0 0 3px ${colors.fill})`,
                        }}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill={colors.fill}
                          fillOpacity={isSelected ? 0.9 : 0.7}
                          stroke={colors.stroke}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                        />
                        <circle cx="12" cy="12" r="4" fill="white" fillOpacity={0.9} />
                      </svg>
                      {/* Tooltip on hover */}
                      <span
                        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded bg-[#0d0805]/95 border border-[#2e1b0e] text-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {h.name}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Pan hint */}
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#c8a96e]/30 pointer-events-none">
            Scroll to zoom · Drag to pan · Click markers for details
          </div>
        </div>

        {/* Detail panel */}
        <div
          className="w-72 shrink-0 rounded-lg border border-[#2e1b0e] bg-[#120a05] overflow-hidden transition-all duration-300"
          style={{ minHeight: "65vh" }}
        >
          {selected ? (
            <div className="p-5 flex flex-col gap-4">
              <div>
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest ${SIDE_COLORS[selected.side].label}`}
                >
                  {selected.side === "CONTESTED"
                    ? "Contested Territory"
                    : selected.side === "NEUTRAL"
                    ? "Neutral Power"
                    : selected.side === "FAITHFUL"
                    ? "Faithful Territory"
                    : "Infernal Domain"}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#c8a96e] mt-1">{selected.name}</h3>
                {selected.faction && (
                  <p className="text-xs text-[#c8a96e]/50 font-mono mt-0.5">{selected.faction}</p>
                )}
              </div>

              <div
                className="h-px w-full"
                style={{ background: SIDE_COLORS[selected.side].fill, opacity: 0.3 }}
              />

              <p className="text-sm text-[#e8d5b0]/75 leading-relaxed">{selected.description}</p>

              <button
                onClick={() => setSelected(null)}
                className="mt-auto text-xs font-mono uppercase tracking-wider text-[#c8a96e]/40 hover:text-[#c8a96e]/70 transition-colors"
              >
                ✕ Close
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 gap-4 opacity-50">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#c8a96e]/30" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <p className="text-xs font-mono text-center text-[#c8a96e]/40 leading-relaxed">
                Click a marker on the map to learn about that location
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        {(["FAITHFUL", "CONTESTED", "INFERNAL", "NEUTRAL"] as const).map((side) => (
          <div key={side} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ background: SIDE_COLORS[side].fill, borderColor: SIDE_COLORS[side].stroke }}
            />
            <span className={`text-xs font-mono ${SIDE_COLORS[side].label}`}>
              {side === "CONTESTED" ? "Contested" : side === "NEUTRAL" ? "Neutral" : side === "FAITHFUL" ? "Faithful" : "Infernal"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
