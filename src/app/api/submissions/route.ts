import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { hashIP, sanitizeText, getWeekNumber, getClientIP } from "@/lib/utils";
import { FACTIONS, getFactionSide } from "@/lib/factions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { warbandName, playerFaction, opponentFaction, sectorId, outcome, keyMoment } = body;

    // Validate required fields
    if (!playerFaction || !opponentFaction || !sectorId || !outcome) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Validate faction names
    if (!FACTIONS.some((f) => f.name === playerFaction)) {
      return NextResponse.json({ error: "Invalid player faction." }, { status: 400 });
    }
    if (!FACTIONS.some((f) => f.name === opponentFaction)) {
      return NextResponse.json({ error: "Invalid opponent faction." }, { status: 400 });
    }

    // Validate outcome
    if (!["VICTORY", "DEFEAT", "DRAW"].includes(outcome)) {
      return NextResponse.json({ error: "Invalid outcome." }, { status: 400 });
    }

    // Validate sector exists
    const sector = await prisma.sector.findUnique({ where: { id: sectorId } });
    if (!sector) {
      return NextResponse.json({ error: "Invalid sector." }, { status: 400 });
    }

    // Validate same side can't fight same side
    const playerSide = getFactionSide(playerFaction);
    const opponentSide = getFactionSide(opponentFaction);
    if (playerSide && opponentSide && playerSide === opponentSide) {
      return NextResponse.json({ error: "Both factions are on the same side." }, { status: 400 });
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const { allowed, remaining } = checkRateLimit(ipHash);

    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 3 submissions per 24 hours." },
        { status: 429 }
      );
    }

    // Sanitize optional text fields
    const cleanWarbandName = warbandName ? sanitizeText(warbandName, 60) : null;
    const cleanKeyMoment = keyMoment ? sanitizeText(keyMoment, 100) : null;

    // Create submission
    const submission = await prisma.battleSubmission.create({
      data: {
        warbandName: cleanWarbandName,
        playerFaction,
        opponentFaction,
        sectorId,
        outcome,
        keyMoment: cleanKeyMoment,
        ipHash,
        weekNumber: getWeekNumber(),
      },
    });

    // Update sector scores immediately (live pressure indicator)
    if (outcome !== "DRAW" && playerSide) {
      const scoreField = playerSide === "FAITHFUL"
        ? outcome === "VICTORY" ? "faithfulScore" : "infernalScore"
        : outcome === "VICTORY" ? "infernalScore" : "faithfulScore";

      await prisma.sector.update({
        where: { id: sectorId },
        data: { [scoreField]: { increment: 1 } },
      });
    }

    return NextResponse.json(
      { success: true, id: submission.id, remaining },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
