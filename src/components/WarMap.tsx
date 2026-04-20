"use client";

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

function controllerStyle(controller: string): {
  label: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
} {
  switch (controller) {
    case "FAITHFUL":
      return { label: "Faithful", color: "#c8a96e", bg: "#c8a96e14", border: "#c8a96e40", barColor: "#c8a96e" };
    case "INFERNAL":
      return { label: "Infernal", color: "#cc3333", bg: "#cc333314", border: "#cc333340", barColor: "#cc3333" };
    default:
      return { label: "Contested", color: "#a08060", bg: "#a0806014", border: "#a0806040", barColor: "#a08060" };
  }
}

function ScoreBar({ faithful, infernal }: { faithful: number; infernal: number }) {
  const total = faithful + infernal;
  if (total === 0) return <div className="h-1 w-full bg-[#2e1b0e] rounded-full" />;
  const faithPct = Math.round((faithful / total) * 100);
  return (
    <div className="h-1 w-full bg-[#2e1b0e] rounded-full overflow-hidden flex">
      <div style={{ width: `${faithPct}%` }} className="bg-[#c8a96e]/70" />
      <div style={{ width: `${100 - faithPct}%` }} className="bg-[#cc3333]/70" />
    </div>
  );
}

export default function WarMap({ sectors }: WarMapProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {sectors.map((sector) => {
        const s = controllerStyle(sector.controller);
        const total = sector.faithfulScore + sector.infernalScore;

        return (
          <Link
            key={sector.id}
            href={`/map/sector/${sector.slug}`}
            className="group block rounded border bg-[#1a0f0a] p-3 transition-colors duration-150 hover:bg-[#1f1208]"
            style={{ borderColor: s.border }}
          >
            <span
              className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded inline-block mb-2"
              style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
            >
              {s.label}
            </span>

            <p className="font-serif text-[#e8d5b0] text-sm leading-snug mb-3 group-hover:text-[#c8a96e] transition-colors line-clamp-2">
              {sector.name}
            </p>

            <ScoreBar faithful={sector.faithfulScore} infernal={sector.infernalScore} />

            {total > 0 && (
              <div className="flex justify-between mt-1.5 text-[9px] font-mono text-[#4a3728]">
                <span className="text-[#c8a96e]/50">{sector.faithfulScore}</span>
                <span>{total} pts</span>
                <span className="text-[#cc3333]/50">{sector.infernalScore}</span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
