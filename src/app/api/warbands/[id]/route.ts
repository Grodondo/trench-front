import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getFactionById, validateWarband, type RosterUnit } from "@/lib/gameData";

// GET /api/warbands/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const warbandId = parseInt(id, 10);
  if (isNaN(warbandId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const session = await getSession();

  const warband = await prisma.savedWarband.findUnique({
    where: { id: warbandId },
    include: { user: { select: { username: true } } },
  });

  if (!warband) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!warband.isPublic && warband.userId !== session?.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: warband.id,
    name: warband.name,
    faction: warband.faction,
    subfaction: warband.subfaction,
    notes: warband.notes,
    isPublic: warband.isPublic,
    totalDucats: warband.totalDucats,
    totalGlory: warband.totalGlory,
    roster: warband.rosterJson,
    username: warband.user?.username ?? null,
    createdAt: warband.createdAt,
    isOwn: session ? warband.userId === session.userId : false,
  });
}

// PUT /api/warbands/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const warbandId = parseInt(id, 10);
  if (isNaN(warbandId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const warband = await prisma.savedWarband.findUnique({ where: { id: warbandId } });
  if (!warband || warband.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { name, subfaction, notes, isPublic, roster, budgetDucats, budgetGlory } = body as {
      name?: string;
      subfaction?: string;
      notes?: string;
      isPublic?: boolean;
      roster?: RosterUnit[];
      budgetDucats?: number;
      budgetGlory?: number;
    };

    let totalDucats = warband.totalDucats;
    let totalGlory = warband.totalGlory;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rosterJson: any = warband.rosterJson;

    if (roster) {
      if (!getFactionById(warband.faction)) return NextResponse.json({ error: "Invalid faction" }, { status: 400 });
      const validation = validateWarband(warband.faction, roster, budgetDucats ?? 700, budgetGlory ?? 0);
      if (!validation.valid) {
        return NextResponse.json({ error: "Invalid warband", details: validation.errors }, { status: 422 });
      }
      totalDucats = validation.totalDucats;
      totalGlory = validation.totalGlory;
      rosterJson = roster;
    }

    const updated = await prisma.savedWarband.update({
      where: { id: warbandId },
      data: {
        name: name?.trim() ?? warband.name,
        subfaction: subfaction !== undefined ? (subfaction || null) : warband.subfaction,
        notes: notes !== undefined ? (notes?.trim() || null) : warband.notes,
        isPublic: isPublic !== undefined ? isPublic : warband.isPublic,
        totalDucats,
        totalGlory,
        rosterJson,
      },
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (err) {
    console.error("PUT /api/warbands/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/warbands/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const warbandId = parseInt(id, 10);
  if (isNaN(warbandId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const warband = await prisma.savedWarband.findUnique({ where: { id: warbandId } });
  if (!warband || warband.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.savedWarband.delete({ where: { id: warbandId } });
  return NextResponse.json({ ok: true });
}
