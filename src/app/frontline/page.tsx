import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Frontline Updates — Trench Front",
  description: "Weekly frontline reports from the Eternal Crusade.",
};

interface SnapshotSector {
  name: string;
  controller: string;
  faithfulScore: number;
  infernalScore: number;
}

export default async function FrontlinePage() {
  let snapshots: Array<{
    id: number;
    weekNumber: number;
    narrativeSummary: string | null;
    createdAt: Date;
    snapshotData: unknown;
  }> = [];

  try {
    snapshots = await prisma.weeklySnapshot.findMany({
      orderBy: { weekNumber: "desc" },
      take: 12,
    });
  } catch {
    // DB not ready
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          FRONTLINE UPDATES
        </h1>
        <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em]">
          Weekly War Reports
        </p>
      </div>

      {snapshots.length > 0 ? (
        <div className="space-y-6">
          {snapshots.map((snapshot) => {
            const sectors = (snapshot.snapshotData as SnapshotSector[]) || [];
            const faithful = sectors.filter((s) => s.controller === "FAITHFUL").length;
            const infernal = sectors.filter((s) => s.controller === "INFERNAL").length;
            const contested = sectors.filter((s) => s.controller === "CONTESTED").length;

            return (
              <div
                key={snapshot.id}
                className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-serif text-[#c8a96e]">
                    Week {snapshot.weekNumber}
                  </h2>
                  <span className="text-xs text-[#4a3728]">
                    {snapshot.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-4 mb-3 text-xs">
                  <span className="text-[#c8a96e]">Faithful: {faithful}</span>
                  <span className="text-[#ff4444]">Infernal: {infernal}</span>
                  <span className="text-[#e8d5b0]/50">Contested: {contested}</span>
                </div>
                {snapshot.narrativeSummary && (
                  <div className="text-sm text-[#e8d5b0]/70 leading-relaxed whitespace-pre-line">
                    {snapshot.narrativeSummary}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-[#4a3728] italic">
          No frontline updates yet. The first weekly report will appear after the campaign begins.
        </p>
      )}
    </div>
  );
}
