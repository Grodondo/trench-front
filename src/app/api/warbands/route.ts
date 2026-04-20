import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getFactionById, validateWarband, type RosterUnit } from "@/lib/gameData";

// GET /api/warbands — list public warbands (+ user's own if logged in)
export async function GET(req: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const faction = searchParams.get("faction");
  const mine = searchParams.get("mine") === "1";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 20;

  const where: Record<string, unknown> = {};

  if (mine && session) {
    where.userId = session.userId;
  } else {
    where.isPublic = true;
  }
  if (faction) where.faction = faction;

  try {
    const [warbands, total] = await Promise.all([
      prisma.savedWarband.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: perPage,
        skip: (page - 1) * perPage,
        include: { user: { select: { username: true } } },
      }),
      prisma.savedWarband.count({ where }),
    ]);

    return NextResponse.json({
      warbands: warbands.map((w) => ({
        id: w.id,
        name: w.name,
        faction: w.faction,
        subfaction: w.subfaction,
        totalDucats: w.totalDucats,
        totalGlory: w.totalGlory,
        unitCount: Array.isArray(w.rosterJson) ? (w.rosterJson as unknown[]).length : 0,
        username: w.user?.username ?? null,
        createdAt: w.createdAt,
        isOwn: session ? w.userId === session.userId : false,
      })),
      total,
      page,
      pages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error("GET /api/warbands error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/warbands — create a warband (auth required)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, faction, subfaction, notes, isPublic, roster, budgetDucats, budgetGlory } = body as {
      name: string;
      faction: string;
      subfaction?: string;
      notes?: string;
      isPublic?: boolean;
      roster: RosterUnit[];
      budgetDucats?: number;
      budgetGlory?: number;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!faction) return NextResponse.json({ error: "Faction is required" }, { status: 400 });
    if (!getFactionById(faction)) return NextResponse.json({ error: "Invalid faction" }, { status: 400 });
    if (!Array.isArray(roster) || roster.length === 0) {
      return NextResponse.json({ error: "Roster must have at least one unit" }, { status: 400 });
    }

    const validation = validateWarband(faction, roster, budgetDucats ?? 700, budgetGlory ?? 0);
    if (!validation.valid) {
      return NextResponse.json({ error: "Invalid warband", details: validation.errors }, { status: 422 });
    }

    const warband = await prisma.savedWarband.create({
      data: {
        userId: session.userId,
        name: name.trim(),
        faction,
        subfaction: subfaction ?? null,
        notes: notes?.trim() ?? null,
        isPublic: isPublic ?? true,
        totalDucats: validation.totalDucats,
        totalGlory: validation.totalGlory,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rosterJson: roster as any,
      },
    });

    return NextResponse.json({ ok: true, id: warband.id });
  } catch (err) {
    console.error("POST /api/warbands error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
