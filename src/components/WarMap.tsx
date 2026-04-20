"use client";

import { useState } from "react";
import Link from "next/link";

interface SectorData {
  id: number;
  name: string;
  slug: string;
  controller: string;
  faithfulScore: number;
  infernalScore: number;
  svgPathId: string | null;
}

interface WarMapProps {
  sectors: SectorData[];
}

// Generate SVG map layout: 5 columns x 4 rows grid with irregular polygon shapes
function getSectorPath(index: number): string {
  const col = index % 5;
  const row = Math.floor(index / 5);
  const cellW = 180;
  const cellH = 140;
  const x = col * cellW + 20;
  const y = row * cellH + 20;

  // Create irregular polygon shapes for each sector
  const jitter = (base: number, range: number) =>
    base + ((index * 7 + base) % range) - range / 2;

  const x1 = jitter(x + 10, 16);
  const y1 = jitter(y + 8, 12);
  const x2 = jitter(x + cellW / 2, 20);
  const y2 = jitter(y - 2, 8);
  const x3 = jitter(x + cellW - 10, 16);
  const y3 = jitter(y + 10, 14);
  const x4 = jitter(x + cellW - 5, 12);
  const y4 = jitter(y + cellH / 2, 16);
  const x5 = jitter(x + cellW - 8, 18);
  const y5 = jitter(y + cellH - 8, 12);
  const x6 = jitter(x + cellW / 2, 14);
  const y6 = jitter(y + cellH + 2, 10);
  const x7 = jitter(x + 8, 14);
  const y7 = jitter(y + cellH - 6, 14);
  const x8 = jitter(x + 4, 10);
  const y8 = jitter(y + cellH / 2, 12);

  return `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5} ${x6},${y6} ${x7},${y7} ${x8},${y8}`;
}

function getControllerColor(controller: string): string {
  switch (controller) {
    case "FAITHFUL":
      return "#c8a96e";
    case "INFERNAL":
      return "#8b0000";
    default:
      return "#4a3728";
  }
}

function getControllerStroke(controller: string): string {
  switch (controller) {
    case "FAITHFUL":
      return "#d4b87a";
    case "INFERNAL":
      return "#a00000";
    default:
      return "#5a4838";
  }
}

function getControllerLabel(controller: string): string {
  switch (controller) {
    case "FAITHFUL":
      return "⛨ Faithful";
    case "INFERNAL":
      return "🔥 Infernal";
    default:
      return "⚔ Contested";
  }
}

export default function WarMap({ sectors }: WarMapProps) {
  const [hoveredSector, setHoveredSector] = useState<SectorData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative">
      <svg
        viewBox="0 0 940 600"
        className="w-full h-auto"
        style={{ filter: "url(#noise)" }}
      >
        <defs>
          {/* Noise filter for gritty texture */}
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>

          {/* Glow filter for hovered sectors */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Trench line pattern */}
          <pattern id="trenches" patternUnits="userSpaceOnUse" width="12" height="12">
            <line x1="0" y1="6" x2="12" y2="6" stroke="#2e1b0e" strokeWidth="0.5" opacity="0.3" />
            <line x1="6" y1="0" x2="6" y2="12" stroke="#2e1b0e" strokeWidth="0.3" opacity="0.2" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="940" height="600" fill="#1a0f0a" />
        <rect width="940" height="600" fill="url(#trenches)" />

        {/* Sectors */}
        {sectors.map((sector, i) => {
          const points = getSectorPath(i);
          const isHovered = hoveredSector?.id === sector.id;

          return (
            <Link key={sector.id} href={`/map/sector/${sector.slug}`}>
              <polygon
                points={points}
                fill={getControllerColor(sector.controller)}
                stroke={getControllerStroke(sector.controller)}
                strokeWidth={isHovered ? 2.5 : 1.5}
                opacity={isHovered ? 1 : 0.85}
                filter={isHovered ? "url(#glow)" : undefined}
                className="cursor-pointer transition-opacity duration-200"
                onMouseEnter={(e) => {
                  setHoveredSector(sector);
                  const svg = e.currentTarget.ownerSVGElement;
                  if (svg) {
                    const pt = svg.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                    setTooltipPos({ x: svgP.x, y: svgP.y - 10 });
                  }
                }}
                onMouseLeave={() => setHoveredSector(null)}
              />
            </Link>
          );
        })}

        {/* Sector labels */}
        {sectors.map((sector, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const cellW = 180;
          const cellH = 140;
          const cx = col * cellW + 20 + cellW / 2;
          const cy = row * cellH + 20 + cellH / 2;

          return (
            <text
              key={`label-${sector.id}`}
              x={cx}
              y={cy}
              textAnchor="middle"
              className="pointer-events-none select-none"
              fill="#e8d5b0"
              fontSize="9"
              fontFamily="'Cinzel', serif"
              opacity="0.9"
            >
              {sector.name.length > 22
                ? sector.name.slice(0, 20) + "…"
                : sector.name}
            </text>
          );
        })}

        {/* Tooltip */}
        {hoveredSector && (
          <g>
            <rect
              x={tooltipPos.x - 100}
              y={tooltipPos.y - 55}
              width="200"
              height="50"
              rx="4"
              fill="#1a0f0a"
              stroke="#c8a96e"
              strokeWidth="1"
              opacity="0.95"
            />
            <text
              x={tooltipPos.x}
              y={tooltipPos.y - 38}
              textAnchor="middle"
              fill="#c8a96e"
              fontSize="11"
              fontFamily="'Cinzel', serif"
              fontWeight="bold"
            >
              {hoveredSector.name}
            </text>
            <text
              x={tooltipPos.x}
              y={tooltipPos.y - 22}
              textAnchor="middle"
              fill="#e8d5b0"
              fontSize="9"
            >
              {getControllerLabel(hoveredSector.controller)} | F:{hoveredSector.faithfulScore} / I:{hoveredSector.infernalScore}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#c8a96e" }} />
          <span className="text-[#c8a96e]">Faithful</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#8b0000" }} />
          <span className="text-[#8b0000]">Infernal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4a3728" }} />
          <span className="text-[#c8a96e]/60">Contested</span>
        </div>
      </div>
    </div>
  );
}
