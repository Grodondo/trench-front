import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { RosterUnit } from "@/lib/gameData";
import WarbandBuilder from "@/components/WarbandBuilder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Build a Warband — Trench Front",
  description: "Build and save your Trench Crusade warband. Choose your faction, muster your units, and equip them for war.",
};

export default async function BuildWarbandPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  if (edit) {
    const editId = parseInt(edit, 10);
    if (isNaN(editId)) notFound();

    const session = await getSession();
    if (!session) redirect(`/warbands/${editId}`);

    const warband = await prisma.savedWarband.findUnique({ where: { id: editId } });
    if (!warband || warband.userId !== session.userId) notFound();

    return (
      <WarbandBuilder
        initialWarband={{
          id: warband.id,
          name: warband.name,
          faction: warband.faction,
          subfaction: warband.subfaction,
          notes: warband.notes,
          isPublic: warband.isPublic,
          roster: warband.rosterJson as unknown as RosterUnit[],
        }}
      />
    );
  }

  return <WarbandBuilder />;
}
