import { prisma } from "@/lib/prisma";
import WarMap from "@/components/WarMap";

export const metadata = {
  title: "War Map — Trench Front",
  description: "The living front line of the Eternal Crusade. Community-driven sector control.",
};

export default async function MapPage() {
  let sectors: Array<{
    id: number;
    name: string;
    slug: string;
    controller: string;
    faithfulScore: number;
    infernalScore: number;
    svgPathId: string | null;
  }> = [];

  try {
    sectors = await prisma.sector.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        controller: true,
        faithfulScore: true,
        infernalScore: true,
        svgPathId: true,
      },
    });
  } catch {
    // DB not ready
  }

  const totalSectors = sectors.length;
  const faithfulCount = sectors.filter((s) => s.controller === "FAITHFUL").length;
  const infernalCount = sectors.filter((s) => s.controller === "INFERNAL").length;
  const contestedCount = sectors.filter((s) => s.controller === "CONTESTED").length;

  const faithPct = totalSectors > 0 ? Math.round((faithfulCount / totalSectors) * 100) : 0;
  const infernalPct = totalSectors > 0 ? Math.round((infernalCount / totalSectors) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-1">
          THE FRONT LINE
        </h1>
        <p className="text-[#4a3728] text-xs uppercase tracking-[0.3em] mb-8">
          Sector Control — Updated with every battle
        </p>

        {totalSectors > 0 && (
          <div className="max-w-lg mx-auto">
            {/* Control bar */}
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
              <span className="text-[#4a3728]">
                {contestedCount} contested
              </span>
              <span className="text-[#cc3333]">
                {infernalCount} / {totalSectors}
                <span className="text-[#cc3333]/50 uppercase tracking-widest ml-1">Infernal</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {sectors.length > 0 ? (
        <WarMap sectors={sectors} />
      ) : (
        <div className="text-center py-20 text-[#4a3728]">
          <p className="text-lg">The map is shrouded in fog.</p>
          <p className="text-sm mt-2">Database connection required. Run migrations and seed data first.</p>
        </div>
      )}
    </div>
  );
}
