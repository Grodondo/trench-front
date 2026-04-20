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

  const faithfulCount = sectors.filter((s) => s.controller === "FAITHFUL").length;
  const infernalCount = sectors.filter((s) => s.controller === "INFERNAL").length;
  const contestedCount = sectors.filter((s) => s.controller === "CONTESTED").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          THE FRONT LINE
        </h1>
        <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em]">
          Sector Control — Updated Daily
        </p>
        <div className="flex justify-center gap-8 mt-4 text-sm">
          <span className="text-[#c8a96e]">
            Faithful: <strong>{faithfulCount}</strong>
          </span>
          <span className="text-[#ff4444]">
            Infernal: <strong>{infernalCount}</strong>
          </span>
          <span className="text-[#e8d5b0]/50">
            Contested: <strong>{contestedCount}</strong>
          </span>
        </div>
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
