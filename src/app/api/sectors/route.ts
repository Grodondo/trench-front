import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sectors = await prisma.sector.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      controller: true,
      faithfulScore: true,
      infernalScore: true,
      svgPathId: true,
      description: true,
    },
  });

  return NextResponse.json({ sectors });
}
