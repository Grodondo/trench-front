import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = await prisma.sector.findUnique({ where: { slug } });
  if (!sector) return { title: "Sector Not Found" };
  return {
    title: `${sector.name} — Trench Front`,
    description: sector.description || `Sector ${sector.name} on the front line.`,
  };
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = await prisma.sector.findUnique({ where: { slug } });

  if (!sector) notFound();

  const recentBattles = await prisma.battleSubmission.findMany({
    where: { sectorId: sector.id },
    take: 10,
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      warbandName: true,
      playerFaction: true,
      opponentFaction: true,
      outcome: true,
      keyMoment: true,
      submittedAt: true,
    },
  });

  const totalBattles = await prisma.battleSubmission.count({
    where: { sectorId: sector.id },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/map" className="text-sm text-[#4a3728] hover:text-[#c8a96e] transition-colors mb-6 inline-block">
        ← Back to War Map
      </Link>

      {/* Sector Header */}
      <div className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          {sector.name}
        </h1>
        {sector.description && (
          <p className="text-[#e8d5b0]/70 italic text-sm leading-relaxed mb-4">
            {sector.description}
          </p>
        )}
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-[#4a3728] uppercase tracking-wider text-xs">Controller</span>
            <p
              className={`font-bold ${
                sector.controller === "FAITHFUL"
                  ? "text-[#c8a96e]"
                  : sector.controller === "INFERNAL"
                  ? "text-[#ff4444]"
                  : "text-[#e8d5b0]/50"
              }`}
            >
              {sector.controller}
            </p>
          </div>
          <div>
            <span className="text-[#4a3728] uppercase tracking-wider text-xs">Faithful Score</span>
            <p className="text-[#c8a96e] font-bold">{sector.faithfulScore}</p>
          </div>
          <div>
            <span className="text-[#4a3728] uppercase tracking-wider text-xs">Infernal Score</span>
            <p className="text-[#ff4444] font-bold">{sector.infernalScore}</p>
          </div>
          <div>
            <span className="text-[#4a3728] uppercase tracking-wider text-xs">Total Battles</span>
            <p className="text-[#e8d5b0] font-bold">{totalBattles}</p>
          </div>
        </div>
      </div>

      {/* Submit battle CTA */}
      <div className="mb-6">
        <Link
          href="/submit"
          className="inline-block px-6 py-2 border border-[#c8a96e] text-[#c8a96e] text-sm font-bold uppercase tracking-widest rounded hover:bg-[#c8a96e]/10 transition-colors"
        >
          Fight for this Sector
        </Link>
      </div>

      {/* Recent Battles */}
      <h2 className="text-xl font-serif text-[#c8a96e] mb-4 tracking-wider">
        Recent Engagements
      </h2>
      {recentBattles.length > 0 ? (
        <div className="space-y-2">
          {recentBattles.map((b) => (
            <div key={b.id} className="bg-[#1a0f0a] border border-[#2e1b0e] rounded p-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                    b.outcome === "VICTORY"
                      ? "bg-[#c8a96e]/20 text-[#c8a96e]"
                      : b.outcome === "DEFEAT"
                      ? "bg-[#8b0000]/20 text-[#ff4444]"
                      : "bg-[#4a3728]/20 text-[#e8d5b0]/60"
                  }`}
                >
                  {b.outcome}
                </span>
                <span className="text-sm">
                  <span className="text-[#c8a96e]">{b.warbandName || b.playerFaction}</span>
                  <span className="text-[#4a3728] mx-2">vs</span>
                  <span className="text-[#e8d5b0]/70">{b.opponentFaction}</span>
                </span>
              </div>
              {b.keyMoment && (
                <p className="text-xs text-[#e8d5b0]/50 italic mt-1 pl-1">&ldquo;{b.keyMoment}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#4a3728] italic text-sm">No battles recorded at this sector yet.</p>
      )}
    </div>
  );
}
