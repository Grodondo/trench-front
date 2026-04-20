"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";

export interface SectorMarker {
  id: number;
  name: string;
  slug: string;
  controller: string;
  faithfulScore: number;
  infernalScore: number;
  x: number;
  y: number;
}

function controllerColors(controller: string) {
  switch (controller) {
    case "FAITHFUL":
      return {
        fill: "#c8a96e", stroke: "#8b6914",
        label: "Faithful",
        badge: "bg-[#c8a96e]/10 border-[#c8a96e]/30 text-[#c8a96e]",
      };
    case "INFERNAL":
      return {
        fill: "#cc3333", stroke: "#7a0000",
        label: "Infernal",
        badge: "bg-[#cc3333]/10 border-[#cc3333]/30 text-[#cc3333]",
      };
    default:
      return {
        fill: "#a08060", stroke: "#5a3f2a",
        label: "Contested",
        badge: "bg-[#a08060]/10 border-[#a08060]/30 text-[#a08060]",
      };
  }
}

function MarkerIcon({
  fill, stroke, size = 18, glow,
}: {
  fill: string; stroke: string; size?: number; glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: size, height: size,
        filter: glow
          ? `drop-shadow(0 0 6px ${fill})`
          : `drop-shadow(0 0 3px ${fill})`,
      }}
    >
      <path
        d="M12 2L22 12L12 22L2 12Z"
        fill={fill}
        fillOpacity={glow ? 0.95 : 0.85}
        stroke={stroke}
        strokeWidth={glow ? 2 : 1.5}
      />
    </svg>
  );
}

function ScoreBar({ faithful, infernal }: { faithful: number; infernal: number }) {
  const total = faithful + infernal;
  if (total === 0) return <div className="h-1.5 w-full bg-[#2e1b0e] rounded-full" />;
  const faithPct = Math.round((faithful / total) * 100);
  return (
    <div className="h-1.5 w-full bg-[#2e1b0e] rounded-full overflow-hidden flex">
      <div style={{ width: `${faithPct}%` }} className="bg-[#c8a96e]/70 transition-all duration-500" />
      <div style={{ width: `${100 - faithPct}%` }} className="bg-[#cc3333]/70 transition-all duration-500" />
    </div>
  );
}

export default function SectorWarMap({ sectors }: { sectors: SectorMarker[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selected, setSelected] = useState<SectorMarker | null>(null);

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

  const resetView = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setSelected(null);
  };

  const MAP_HEIGHT = "65vh";

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
      <div className="flex items-center flex-wrap gap-3 bg-[#120a05] border border-[#2e1b0e] rounded-lg px-4 py-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30">
          {sectors.length} Frontline Sector{sectors.length !== 1 ? "s" : ""}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => zoom(0.3)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors font-mono"
          >+</button>
          <button
            onClick={() => zoom(-0.3)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors font-mono"
          >−</button>
          <button
            onClick={resetView}
            className="px-2.5 h-7 rounded border border-[#2e1b0e] bg-[#1a0f0a] text-[10px] font-mono uppercase text-[#c8a96e]/60 hover:text-[#c8a96e] hover:border-[#c8a96e]/40 transition-colors"
          >Reset</button>
          <span className="text-[10px] font-mono text-[#c8a96e]/30 w-9 text-center">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      {/* Map + detail panel */}
      <div className="flex gap-4 items-start">
        {/* Map canvas */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border border-[#2e1b0e] bg-[#0d0805] flex-1"
          style={{ height: MAP_HEIGHT, cursor: dragging ? "grabbing" : "grab" }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: dragging ? "none" : "transform 0.12s ease",
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
                alt="Trench Crusade World Map"
                className="max-w-none select-none"
                style={{ maxHeight: MAP_HEIGHT, width: "auto" }}
                draggable={false}
                onLoad={() => setImgLoaded(true)}
              />

              {imgLoaded && sectors.map((sector) => {
                const colors = controllerColors(sector.controller);
                const isSel = selected?.id === sector.id;
                return (
                  <button
                    key={sector.id}
                    data-marker="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(isSel ? null : sector);
                    }}
                    style={{
                      position: "absolute",
                      left: `${sector.x}%`,
                      top: `${sector.y}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: isSel ? 20 : 10,
                    }}
                    className="group"
                    aria-label={sector.name}
                  >
                    <MarkerIcon
                      fill={colors.fill}
                      stroke={colors.stroke}
                      size={isSel ? 28 : 18}
                      glow={isSel}
                    />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded bg-[#0d0805]/95 border border-[#2e1b0e] text-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity z-30">
                      {sector.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="absolute bottom-2 left-3 text-[9px] font-mono text-[#c8a96e]/20 pointer-events-none">
            Scroll to zoom · Drag to pan · Click markers for frontline intel
          </p>
        </div>

        {/* Detail panel */}
        <div
          className="shrink-0 rounded-lg border border-[#2e1b0e] bg-[#120a05] overflow-hidden"
          style={{ width: "17rem", height: MAP_HEIGHT }}
        >
          {selected ? (() => {
            const colors = controllerColors(selected.controller);
            const total = selected.faithfulScore + selected.infernalScore;
            return (
              <div className="flex flex-col gap-4 h-full p-5 overflow-y-auto">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border inline-block mb-2 ${colors.badge}`}>
                    {colors.label}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#c8a96e] leading-tight">
                    {selected.name}
                  </h3>
                </div>

                <div className="h-px w-full bg-[#2e1b0e]" />

                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30 mb-2">
                    Pressure
                  </p>
                  <ScoreBar faithful={selected.faithfulScore} infernal={selected.infernalScore} />
                  {total > 0 ? (
                    <div className="flex justify-between mt-1.5 text-[9px] font-mono">
                      <span className="text-[#c8a96e]/60">{selected.faithfulScore} Faith</span>
                      <span className="text-[#4a3728]">{total} total</span>
                      <span className="text-[#cc3333]/60">{selected.infernalScore} Inf.</span>
                    </div>
                  ) : (
                    <p className="text-[9px] font-mono text-[#4a3728] mt-1">No battles recorded yet</p>
                  )}
                </div>

                <Link
                  href={`/map/sector/${selected.slug}`}
                  className="mt-auto px-3 py-2 text-center text-xs font-mono uppercase tracking-wider border border-[#c8a96e]/30 text-[#c8a96e]/70 rounded hover:bg-[#c8a96e]/10 hover:border-[#c8a96e]/60 hover:text-[#c8a96e] transition-colors"
                >
                  View Sector →
                </Link>

                <button
                  onClick={() => setSelected(null)}
                  className="text-[10px] font-mono uppercase tracking-wider text-[#c8a96e]/30 hover:text-[#c8a96e]/60 transition-colors text-left"
                >
                  × Close
                </button>
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center gap-4 h-full opacity-40 p-6">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#c8a96e]/30" fill="currentColor">
                <path d="M12 2L22 12L12 22L2 12Z" />
              </svg>
              <p className="text-xs font-mono text-center text-[#c8a96e]/40 leading-relaxed">
                Click a sector marker to see frontline intel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 bg-[#120a05] border border-[#2e1b0e] rounded-lg px-4 py-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/30 self-center">
          Legend
        </span>
        {[
          { fill: "#c8a96e", stroke: "#8b6914", label: "Faithful" },
          { fill: "#a08060", stroke: "#5a3f2a", label: "Contested" },
          { fill: "#cc3333", stroke: "#7a0000", label: "Infernal" },
        ].map(({ fill, stroke, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" width="12" height="12">
              <path d="M8 1L15 8L8 15L1 8Z" fill={fill} fillOpacity="0.85" stroke={stroke} strokeWidth="1.5" />
            </svg>
            <span className="text-[10px] font-mono text-[#e8d5b0]/60">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
