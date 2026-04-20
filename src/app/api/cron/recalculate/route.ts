import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFactionSide } from "@/lib/factions";
import { getWeekNumber } from "@/lib/utils";

const CONTROL_THRESHOLD = 3; // Net wins needed to flip a sector

export async function POST() {
  try {
    const weekNumber = getWeekNumber();

    // Get all sectors
    const sectors = await prisma.sector.findMany();

    for (const sector of sectors) {
      // Get this week's submissions for this sector
      const submissions = await prisma.battleSubmission.findMany({
        where: {
          sectorId: sector.id,
          weekNumber,
        },
      });

      let faithfulWins = 0;
      let infernalWins = 0;

      for (const sub of submissions) {
        const playerSide = getFactionSide(sub.playerFaction);
        if (!playerSide) continue;

        if (sub.outcome === "VICTORY") {
          if (playerSide === "FAITHFUL") faithfulWins++;
          else infernalWins++;
        } else if (sub.outcome === "DEFEAT") {
          if (playerSide === "FAITHFUL") infernalWins++;
          else faithfulWins++;
        }
      }

      const netFaithful = faithfulWins - infernalWins;
      let newController = sector.controller;

      if (netFaithful >= CONTROL_THRESHOLD) {
        newController = "FAITHFUL";
      } else if (netFaithful <= -CONTROL_THRESHOLD) {
        newController = "INFERNAL";
      } else if (Math.abs(netFaithful) < CONTROL_THRESHOLD && sector.controller !== "CONTESTED") {
        // If the margin is less than threshold and sector was controlled, it becomes contested
        if (
          (sector.controller === "FAITHFUL" && netFaithful <= 0) ||
          (sector.controller === "INFERNAL" && netFaithful >= 0)
        ) {
          newController = "CONTESTED";
        }
      }

      await prisma.sector.update({
        where: { id: sector.id },
        data: {
          controller: newController,
          faithfulScore: faithfulWins,
          infernalScore: infernalWins,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Recalculated ${sectors.length} sectors for week ${weekNumber}.`,
    });
  } catch (error) {
    console.error("Recalculation error:", error);
    return NextResponse.json({ error: "Recalculation failed." }, { status: 500 });
  }
}
