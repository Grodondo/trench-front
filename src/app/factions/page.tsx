import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FACTION_DATA, type FactionData, type Unit, type UnitRole } from "@/lib/factionsData";

export const metadata: Metadata = {
  title: "Factions — Trench Front",
  description:
    "Browse all Trench Crusade factions. Learn about their units, playstyle, and lore — from the faithful armies of New Antioch to the demon princes of the Court.",
};

const ROLE_LABEL: Record<UnitRole, { label: string; color: string }> = {
  CAPTAIN: { label: "Captain", color: "bg-[#c8a96e]/20 text-[#c8a96e] border-[#c8a96e]/40" },
  ELITE: { label: "Elite", color: "bg-[#9b6e9b]/20 text-[#c8a0c8] border-[#9b6e9b]/40" },
  INFANTRY: { label: "Infantry", color: "bg-[#4a7a5a]/20 text-[#7ab58a] border-[#4a7a5a]/40" },
};

function UnitCard({ unit }: { unit: Unit }) {
  const role = ROLE_LABEL[unit.role];
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#2e1b0e]/60 last:border-0">
      <span className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${role.color}`}>
        {role.label}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-[#e8d5b0] text-sm leading-tight">{unit.name}</span>
        {unit.traits && unit.traits.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {unit.traits.map((t) => (
              <span key={t} className="text-[10px] text-[#c8a96e]/50 font-mono">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {unit.cost !== "–" && (
        <span className="shrink-0 text-xs text-[#c8a96e]/50 font-mono">{unit.cost}₯</span>
      )}
    </div>
  );
}

function FactionCard({ faction }: { faction: FactionData }) {
  const captains = faction.units.filter((u) => u.role === "CAPTAIN");
  const elites = faction.units.filter((u) => u.role === "ELITE");
  const infantry = faction.units.filter((u) => u.role === "INFANTRY");

  return (
    <div className="flex flex-col rounded-lg border border-[#2e1b0e] bg-[#120a05] overflow-hidden">
      {/* Faction image */}
      <div className="relative h-52 w-full bg-[#1a0f0a]">
        {faction.imageUrl ? (
          <Image
            src={faction.imageUrl}
            alt={faction.name}
            fill
            className="object-cover object-top"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-60"
            style={{ background: `${faction.accentColor}18` }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-current opacity-40 flex items-center justify-center"
              style={{ color: faction.accentColor }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M12 2L2 19h20L12 2zm0 3.5L19 17H5L12 5.5z" />
              </svg>
            </div>
            <span className="text-xs font-mono text-[#c8a96e]/30 tracking-widest uppercase">No Art Available</span>
          </div>
        )}
        {/* Side badge */}
        <div className={`absolute top-3 right-3 text-xs font-mono uppercase tracking-widest px-2 py-1 rounded
          ${faction.side === "FAITHFUL"
            ? "bg-[#1a3a5c]/80 text-[#7ab0d8] border border-[#7ab0d8]/30"
            : "bg-[#3a1a1a]/80 text-[#d87a7a] border border-[#d87a7a]/30"
          }`}>
          {faction.side === "FAITHFUL" ? "Faithful" : "Infernal"}
        </div>
      </div>

      {/* Faction info */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-3">
          <h3 className="font-serif text-lg font-bold text-[#c8a96e] leading-tight">{faction.name}</h3>
          <p className="text-xs text-[#c8a96e]/50 font-mono uppercase tracking-wider mt-0.5">{faction.tagline}</p>
        </div>

        <p className="text-sm text-[#e8d5b0]/70 leading-relaxed mb-4">{faction.description}</p>

        {/* Subfactions */}
        {faction.subfactions && faction.subfactions.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/40 mb-1.5">Subfactions</p>
            <div className="flex flex-wrap gap-1">
              {faction.subfactions.map((sf) => (
                <span key={sf} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2e1b0e] text-[#c8a96e]/60 border border-[#2e1b0e]">
                  {sf}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unit roster */}
        <div className="flex-1 mb-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#c8a96e]/40 mb-2">Roster</p>
          <div className="space-y-0">
            {captains.map((u) => <UnitCard key={u.name} unit={u} />)}
            {elites.map((u) => <UnitCard key={u.name} unit={u} />)}
            {infantry.map((u) => <UnitCard key={u.name} unit={u} />)}
          </div>
        </div>

        {/* Link to full rules */}
        <Link
          href={faction.rosterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-center text-xs font-mono uppercase tracking-wider text-[#c8a96e]/50 hover:text-[#c8a96e] border border-[#2e1b0e] hover:border-[#c8a96e]/30 rounded py-2 transition-colors"
        >
          Full Roster & Rules →
        </Link>
      </div>
    </div>
  );
}

export default function FactionsPage() {
  const faithful = FACTION_DATA.filter((f) => f.side === "FAITHFUL");
  const infernal = FACTION_DATA.filter((f) => f.side === "INFERNAL");

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#c8a96e]/50 mb-3">
          Codex Militaris
        </p>
        <h1 className="font-serif text-4xl font-black text-[#c8a96e] mb-4">Factions of the Eternal War</h1>
        <p className="text-[#e8d5b0]/60 max-w-2xl mx-auto leading-relaxed">
          Eight hundred years of unending war have forged fearsome armies on both sides of the great divide.
          Learn their warriors, their doctrines, and the dark blessings that drive them into the trenches.
        </p>
      </div>

      {/* Faithful */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-[#2e1b0e]" />
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#7ab0d8]/60 mb-1">Holy Alliance</p>
            <h2 className="font-serif text-2xl font-bold text-[#7ab0d8]">The Faithful</h2>
          </div>
          <div className="h-px flex-1 bg-[#2e1b0e]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {faithful.map((f) => (
            <FactionCard key={f.slug} faction={f} />
          ))}
        </div>
      </section>

      {/* Infernal */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-[#2e1b0e]" />
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#d87a7a]/60 mb-1">Servants of Hell</p>
            <h2 className="font-serif text-2xl font-bold text-[#d87a7a]">The Infernal</h2>
          </div>
          <div className="h-px flex-1 bg-[#2e1b0e]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {infernal.map((f) => (
            <FactionCard key={f.slug} faction={f} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="mt-16 text-center text-xs text-[#c8a96e]/30 font-mono">
        Unit data sourced from{" "}
        <a
          href="https://trench-companion.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#c8a96e]/50"
        >
          trench-companion.com
        </a>
        . Faction artwork © Trench Crusade / Trench Companion. This is a community tool.
      </p>
    </main>
  );
}
