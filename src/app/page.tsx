import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let recentSubmissions: Array<{
    id: number;
    warbandName: string | null;
    playerFaction: string;
    opponentFaction: string;
    outcome: string;
    keyMoment: string | null;
    sector: { name: string };
  }> = [];

  try {
    recentSubmissions = await prisma.battleSubmission.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        warbandName: true,
        playerFaction: true,
        opponentFaction: true,
        outcome: true,
        keyMoment: true,
        sector: { select: { name: true } },
      },
    });
  } catch {
    // DB not available yet — that's fine for initial development
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-[#0d0805] to-[#0d0805]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#c8a96e] tracking-wider mb-4">
            TRENCH FRONT
          </h1>
          <p className="text-[#4a3728] text-sm uppercase tracking-[0.5em] mb-6">
            Community Campaign Map &amp; Battle Report System
          </p>
          <p className="text-[#e8d5b0]/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Eight hundred years of war. The trenches stretch forever. Your battles shape the front line.
            Build your warband, submit your games, and shift the eternal crusade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/map"
              className="px-8 py-3 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] transition-colors"
            >
              The Front Line
            </Link>
            <Link
              href="/map?tab=submit"
              className="px-8 py-3 border border-[#c8a96e] text-[#c8a96e] font-bold uppercase tracking-widest rounded hover:bg-[#c8a96e]/10 transition-colors"
            >
              Submit a Battle
            </Link>
            <Link
              href="/warbands/build"
              className="px-8 py-3 border border-[#4a3728] text-[#e8d5b0]/70 font-bold uppercase tracking-widest rounded hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
            >
              Build a Warband
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Battles */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif text-[#c8a96e] mb-6 text-center tracking-wider">
          Recent Engagements
        </h2>
        {recentSubmissions.length > 0 ? (
          <div className="space-y-3">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#1a0f0a] border border-[#2e1b0e] rounded p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        sub.outcome === "VICTORY"
                          ? "bg-[#c8a96e]/20 text-[#c8a96e]"
                          : sub.outcome === "DEFEAT"
                          ? "bg-[#8b0000]/20 text-[#ff4444]"
                          : "bg-[#4a3728]/20 text-[#e8d5b0]/60"
                      }`}
                    >
                      {sub.outcome}
                    </span>
                    <span className="text-sm text-[#e8d5b0]">
                      {sub.warbandName ? (
                        <span className="text-[#c8a96e] font-semibold">{sub.warbandName}</span>
                      ) : (
                        <span className="text-[#4a3728]">{sub.playerFaction}</span>
                      )}
                      <span className="text-[#4a3728] mx-2">vs</span>
                      <span className="text-[#e8d5b0]/70">{sub.opponentFaction}</span>
                    </span>
                  </div>
                  {sub.keyMoment && (
                    <p className="text-xs text-[#e8d5b0]/50 italic mt-1 pl-1">
                      &ldquo;{sub.keyMoment}&rdquo;
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#4a3728]">{sub.sector.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#4a3728] italic">
            No battles submitted yet. The front awaits your report.
          </p>
        )}
      </section>
    </div>
  );
}
