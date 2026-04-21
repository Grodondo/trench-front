import { prisma } from "@/lib/prisma";
import { type SectorMarker } from "@/components/SectorWarMap";
import { SECTOR_POSITIONS } from "@/lib/sectorMapData";
import FrontlineShell from "@/components/FrontlineShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Front Line — Trench Front",
  description: "The living front line of the Eternal Crusade. Submit battles, track campaigns, and shift sector control.",
};

export default async function MapPage() {
  let sectors: SectorMarker[] = [];

  try {
    const rows = await prisma.sector.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        controller: true,
        faithfulScore: true,
        infernalScore: true,
      },
    });
    sectors = rows.map((s) => ({
      ...s,
      x: SECTOR_POSITIONS[s.slug]?.x ?? 50,
      y: SECTOR_POSITIONS[s.slug]?.y ?? 50,
    }));
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
    <FrontlineShell
      sectors={sectors}
      faithfulCount={faithfulCount}
      infernalCount={infernalCount}
      contestedCount={contestedCount}
      totalSectors={totalSectors}
      faithPct={faithPct}
      infernalPct={infernalPct}
    />
  );
}
