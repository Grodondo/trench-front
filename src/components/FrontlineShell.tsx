"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SectorWarMap, { type SectorMarker } from "@/components/SectorWarMap";
import SubmitForm from "@/components/SubmitForm";

type Tab = "map" | "submit" | "campaigns";

interface Props {
  sectors: SectorMarker[];
  faithfulCount: number;
  infernalCount: number;
  contestedCount: number;
  totalSectors: number;
  faithPct: number;
  infernalPct: number;
}

function FrontlineShellInner({
  sectors,
  faithfulCount,
  infernalCount,
  contestedCount,
  totalSectors,
  faithPct,
  infernalPct,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get("tab");
    if (t === "submit" || t === "campaigns") return t;
    return "map";
  });

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "submit" || t === "campaigns") setTab(t);
    else setTab("map");
  }, [searchParams]);

  const switchTab = (t: Tab) => {
    setTab(t);
    const params = new URLSearchParams(searchParams.toString());
    if (t === "map") params.delete("tab");
    else params.set("tab", t);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "map", label: "War Map" },
    { id: "submit", label: "Submit Battle" },
    { id: "campaigns", label: "Campaigns", badge: "soon" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Page title + front bar */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-1">
          THE FRONT LINE
        </h1>
        <p className="text-[#4a3728] text-xs uppercase tracking-[0.3em] mb-6">
          Sector Control — Updated with every battle
        </p>

        {totalSectors > 0 && (
          <div className="max-w-lg mx-auto mb-6">
            <div className="h-2 w-full bg-[#2e1b0e] rounded-full overflow-hidden flex mb-3">
              <div
                style={{ width: `${faithPct}%` }}
                className="bg-[#c8a96e]/80 transition-all duration-500"
              />
              <div
                style={{ width: `${100 - faithPct - infernalPct}%` }}
                className="bg-[#4a3728]/60"
              />
              <div
                style={{ width: `${infernalPct}%` }}
                className="bg-[#cc3333]/80 transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#c8a96e]">
                <span className="text-[#c8a96e]/50 uppercase tracking-widest mr-1">Faithful</span>
                {faithfulCount} / {totalSectors}
              </span>
              <span className="text-[#4a3728]">{contestedCount} contested</span>
              <span className="text-[#cc3333]">
                {infernalCount} / {totalSectors}
                <span className="text-[#cc3333]/50 uppercase tracking-widest ml-1">Infernal</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex items-end gap-0 border-b border-[#2e1b0e] mb-6">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-serif tracking-wider transition-colors border-b-2 -mb-px ${
                active
                  ? "text-[#c8a96e] border-[#c8a96e]"
                  : "text-[#4a3728] border-transparent hover:text-[#e8d5b0]/50 hover:border-[#2e1b0e]"
              }`}
            >
              {t.label}
              {t.badge && (
                <span className="text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded bg-[#2e1b0e] text-[#c8a96e]/50 border border-[#c8a96e]/20">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {tab === "map" && (
        <div>
          {sectors.length > 0 ? (
            <SectorWarMap sectors={sectors} />
          ) : (
            <div className="text-center py-20 text-[#4a3728]">
              <p className="text-lg">The map is shrouded in fog.</p>
              <p className="text-sm mt-2">
                Database connection required. Run migrations and seed data first.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "submit" && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#c8a96e] tracking-wider mb-1">
              SUBMIT BATTLE
            </h2>
            <p className="text-[#4a3728] text-xs uppercase tracking-[0.3em] mb-3">
              Report from the Front Line
            </p>
            <p className="text-[#e8d5b0]/40 text-sm max-w-md mx-auto">
              Submit the results of your tabletop game. Your battle will contribute to
              the global front line. Maximum 3 submissions per 24 hours.
            </p>
          </div>
          <SubmitForm />
        </div>
      )}

      {tab === "campaigns" && (
        <CampaignsPlaceholder onSubmitBattle={() => switchTab("submit")} />
      )}
    </div>
  );
}

function CampaignsPlaceholder({ onSubmitBattle }: { onSubmitBattle: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest font-mono px-3 py-1 rounded bg-[#2e1b0e] text-[#c8a96e]/50 border border-[#c8a96e]/20 mb-4">
          Coming Soon
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#c8a96e] tracking-wider mb-3">
          CAMPAIGNS
        </h2>
        <p className="text-[#e8d5b0]/50 text-sm max-w-xl mx-auto leading-relaxed">
          A series of linked battles with persistent consequences. Build your warband&apos;s legend
          across multiple games — every death, promotion, and hard-won skill recorded for all to see.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          {
            title: "Track Every Warband",
            icon: "⚔",
            desc: "Add all participating warbands at the start of a campaign. Each player's roster is tracked separately as it evolves.",
          },
          {
            title: "Post-Game Phase",
            icon: "☠",
            desc: "After each game, record trauma rolls for casualties, promotions from Troop to Elite, and experience points earned.",
          },
          {
            title: "Living Rosters",
            icon: "📜",
            desc: "Each unit accumulates battle scars, injuries, skills, and a history. The fallen are remembered in a graveyard.",
          },
          {
            title: "Threshold Scaling",
            icon: "⚖",
            desc: "Ducat budgets and Field Strength grow with games played — from 700d/10 models up to 1800d/22 over 12 games.",
          },
          {
            title: "Glory & Ducats",
            icon: "✦",
            desc: "Track glory points and ducat income per warband. Spend them in the Quartermaster step to recruit and re-equip.",
          },
          {
            title: "Campaign Log",
            icon: "📋",
            desc: "A full game-by-game history of every match: scenarios, outcomes, and the story of how each side changed.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-5 flex flex-col gap-2"
          >
            <div className="text-2xl">{f.icon}</div>
            <h3 className="text-sm font-serif font-bold text-[#c8a96e] tracking-wider">{f.title}</h3>
            <p className="text-xs text-[#e8d5b0]/40 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* How a campaign works */}
      <div className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6 mb-8">
        <h3 className="text-sm font-serif font-bold text-[#c8a96e] uppercase tracking-widest mb-4">
          How It Works
        </h3>
        <ol className="space-y-3">
          {[
            ["Start a Campaign", "Name your campaign, add 2+ players, each picks a warband and a Patron."],
            ["Play Games", "Battle each other. Record the outcome and log it here."],
            ["Post-Game Phase", "Roll trauma for casualties. Mark promotions. Award XP to elites. Spend ducats on new recruits."],
            ["Watch Rosters Evolve", "Every unit gains a history. Veterans accumulate skills. The dead are remembered."],
            ["Crown a Victor", "End the campaign when your group decides. The standings tell the whole story."],
          ].map(([step, desc], i) => (
            <li key={step} className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#2e1b0e] border border-[#c8a96e]/20 text-[#c8a96e]/50 text-[10px] font-mono flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <span className="text-xs font-bold text-[#e8d5b0]/70">{step} — </span>
                <span className="text-xs text-[#e8d5b0]/40">{desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <div className="text-xs text-[#4a3728] max-w-xs">
          In the meantime, submit your individual battle results to the global war map to shift sector control.
        </div>
        <button
          onClick={onSubmitBattle}
          className="shrink-0 px-6 py-2.5 bg-[#c8a96e] text-[#0d0805] rounded font-serif font-bold text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors"
        >
          Submit a Battle →
        </button>
      </div>
    </div>
  );
}

export default function FrontlineShell(props: Props) {
  return (
    <Suspense fallback={null}>
      <FrontlineShellInner {...props} />
    </Suspense>
  );
}
