import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sanitizeText } from "@/lib/utils";
import { FACTIONS } from "@/lib/factions";
import { generateNarrative } from "@/lib/narrativeTemplates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { warbandName, playerFaction, opponentFaction, location, outcome, keyMoments, tone } = body;

    // Validate required fields
    if (!playerFaction || !opponentFaction || !outcome) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!FACTIONS.some((f) => f.name === playerFaction)) {
      return NextResponse.json({ error: "Invalid player faction." }, { status: 400 });
    }
    if (!FACTIONS.some((f) => f.name === opponentFaction)) {
      return NextResponse.json({ error: "Invalid opponent faction." }, { status: 400 });
    }
    if (!["VICTORY", "DEFEAT", "DRAW"].includes(outcome)) {
      return NextResponse.json({ error: "Invalid outcome." }, { status: 400 });
    }

    // Sanitize inputs
    const cleanWarband = warbandName ? sanitizeText(warbandName, 60) : null;
    const cleanLocation = location ? sanitizeText(location, 80) : null;
    const cleanMoments = Array.isArray(keyMoments)
      ? keyMoments
          .filter((m: unknown) => typeof m === "string" && m.trim())
          .slice(0, 3)
          .map((m: string) => sanitizeText(m, 60))
      : null;
    const cleanTone = tone && ["HEROIC", "GRIM", "PYRRHIC"].includes(tone) ? tone : "GRIM";

    // Generate narrative
    const narrative = generateNarrative(
      outcome,
      cleanWarband,
      opponentFaction,
      cleanLocation || "the front",
      cleanMoments || undefined,
      cleanTone
    );

    // Create report
    const slug = nanoid(10);
    const report = await prisma.battleReport.create({
      data: {
        slug,
        warbandName: cleanWarband,
        playerFaction,
        opponentFaction,
        location: cleanLocation,
        outcome,
        keyMoments: cleanMoments ?? undefined,
        tone: cleanTone,
        generatedNarrative: narrative,
      },
    });

    return NextResponse.json({ success: true, slug: report.slug }, { status: 201 });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
