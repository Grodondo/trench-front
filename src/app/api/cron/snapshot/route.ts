import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeekNumber } from "@/lib/utils";

export async function POST() {
  try {
    const weekNumber = getWeekNumber();

    // Check if snapshot already exists for this week
    const existing = await prisma.weeklySnapshot.findUnique({ where: { weekNumber } });
    if (existing) {
      return NextResponse.json({ message: "Snapshot already exists for this week." });
    }

    // Get current sector state
    const sectors = await prisma.sector.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        controller: true,
        faithfulScore: true,
        infernalScore: true,
      },
    });

    // Generate simple narrative summary
    const faithfulSectors = sectors.filter((s) => s.controller === "FAITHFUL");
    const infernalSectors = sectors.filter((s) => s.controller === "INFERNAL");
    const contestedSectors = sectors.filter((s) => s.controller === "CONTESTED");

    let narrative = `Week ${weekNumber} Frontline Report:\n\n`;
    narrative += `The Faithful hold ${faithfulSectors.length} sectors. The Infernal control ${infernalSectors.length}. ${contestedSectors.length} remain contested.\n\n`;

    if (faithfulSectors.length > 0) {
      narrative += `Faithful strongholds: ${faithfulSectors.map((s) => s.name).join(", ")}.\n`;
    }
    if (infernalSectors.length > 0) {
      narrative += `Infernal territory: ${infernalSectors.map((s) => s.name).join(", ")}.\n`;
    }

    narrative += `\nThe war continues. The trenches hold.`;

    await prisma.weeklySnapshot.create({
      data: {
        weekNumber,
        snapshotData: sectors,
        narrativeSummary: narrative,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Snapshot created for week ${weekNumber}.`,
    });
  } catch (error) {
    console.error("Snapshot error:", error);
    return NextResponse.json({ error: "Snapshot failed." }, { status: 500 });
  }
}
