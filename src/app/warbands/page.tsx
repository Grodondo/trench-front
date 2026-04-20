import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Notable Warbands — Trench Front",
  description: "Warbands that have fought 5 or more battles on the front line.",
};

export default async function WarbandsPage() {
  let notableWarbands: Array<{ warbandName: string; count: number }> = [];
  let allWarbandsList: Array<{ warbandName: string; count: number }> = [];

  try {
    const results = await prisma.battleSubmission.groupBy({
      by: ["warbandName"],
      where: {
        warbandName: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { warbandName: "desc" } },
    });

    const mapped = results
      .filter((r) => r.warbandName !== null)
      .map((r) => ({ warbandName: r.warbandName!, count: r._count._all }));

    notableWarbands = mapped.filter((w) => w.count >= 5);
    allWarbandsList = mapped.slice(0, 20);
  } catch {
    // DB not ready
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          NOTABLE WARBANDS
        </h1>
        <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em]">
          Veterans of the Eternal Crusade
        </p>
        <p className="text-[#e8d5b0]/50 text-sm mt-3 max-w-md mx-auto">
          Warbands that have fought in 5 or more engagements earn a place in the annals of war.
        </p>
      </div>

      {/* Notable Warbands (5+) */}
      {notableWarbands.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#c8a96e] mb-4">
            ⛨ Distinguished Service
          </h2>
          <div className="space-y-2">
            {notableWarbands.map((w) => (
              <div
                key={w.warbandName}
                className="bg-[#1a0f0a] border border-[#c8a96e]/30 rounded p-4 flex items-center justify-between"
              >
                <span className="text-[#c8a96e] font-bold font-serif">
                  {w.warbandName}
                </span>
                <span className="text-xs text-[#4a3728]">
                  {w.count} battles
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Known Warbands */}
      <h2 className="text-lg font-serif text-[#e8d5b0]/70 mb-4">
        All Known Warbands
      </h2>
      {allWarbandsList.length > 0 ? (
        <div className="space-y-1">
          {allWarbandsList.map((w) => (
            <div
              key={w.warbandName}
              className="bg-[#1a0f0a] border border-[#2e1b0e] rounded p-3 flex items-center justify-between"
            >
              <span className="text-sm text-[#e8d5b0]/80">{w.warbandName}</span>
              <span className="text-xs text-[#4a3728]">{w.count} battles</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#4a3728] italic">
          No named warbands have entered the field yet.
        </p>
      )}
    </div>
  );
}
