import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getFactionById, type RosterUnit } from "@/lib/gameData";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WarbandDetailPage({ params }: Props) {
  const { id } = await params;
  const warbandId = parseInt(id, 10);
  if (isNaN(warbandId)) notFound();

  const session = await getSession();

  const warband = await prisma.savedWarband.findUnique({
    where: { id: warbandId },
    include: { user: { select: { username: true } } },
  });

  if (!warband) notFound();
  if (!warband.isPublic && warband.userId !== session?.userId) notFound();

  const faction = getFactionById(warband.faction);
  const roster = warband.rosterJson as unknown as RosterUnit[];
  const isOwn = session?.userId === warband.userId;
  const accentColor = faction?.accentColor ?? "#c8a96e";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link href="/warbands" className="text-[#4a3728] hover:text-[#c8a96e] text-sm transition-colors">
          ← All Warbands
        </Link>
      </div>

      {/* Header */}
      <div className="relative rounded-lg overflow-hidden border border-[#2e1b0e] mb-6">
        {faction?.imageUrl && (
          <div className="h-48 relative">
            <img
              src={faction.imageUrl}
              alt={faction.name}
              className="w-full h-full object-cover object-top opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805] via-[#0d0805]/60 to-transparent" />
          </div>
        )}
        <div className={`${faction?.imageUrl ? "absolute bottom-0 left-0 right-0" : ""} p-6`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#e8d5b0] leading-tight">{warband.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  className="text-xs uppercase tracking-wider font-mono px-2 py-1 rounded"
                  style={{ color: accentColor, backgroundColor: accentColor + "20" }}
                >
                  {faction?.name ?? warband.faction}
                </span>
                {warband.subfaction && (
                  <span className="text-xs text-[#4a3728] italic">{warband.subfaction}</span>
                )}
                <span
                  className="text-xs font-mono"
                  style={{ color: faction?.side === "FAITHFUL" ? "#b8860b" : "#cc3333" }}
                >
                  {faction?.side === "FAITHFUL" ? "⛨ Faithful" : "☩ Infernal"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-[#c8a96e]">
                {warband.totalDucats}d
              </div>
              {warband.totalGlory > 0 && (
                <div className="text-sm font-mono text-amber-400">{warband.totalGlory}⛭ glory</div>
              )}
              <div className="text-xs text-[#4a3728] mt-1">{roster.length} units</div>
            </div>
          </div>

          {warband.user?.username && (
            <p className="text-xs text-[#4a3728] mt-3">
              Mustered by <span className="text-[#e8d5b0]/40">{warband.user.username}</span>
              {" · "}
              <span>{new Date(warband.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            </p>
          )}

          {warband.notes && (
            <p className="text-sm text-[#e8d5b0]/50 mt-3 italic border-l-2 border-[#c8a96e]/20 pl-3">
              {warband.notes}
            </p>
          )}
        </div>
      </div>

      {/* Roster */}
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-widest text-[#4a3728] font-mono mb-4">Roster</h2>

        {(["CAPTAIN", "ELITE", "INFANTRY"] as const).map((role) => {
          const units = roster.filter((ru) => {
            const u = faction?.units.find((u) => u.id === ru.unitTemplateId);
            return u?.role === role;
          });
          if (units.length === 0) return null;

          const roleColor = role === "CAPTAIN" ? "#c8a96e" : role === "ELITE" ? "#9cb4cc" : "#e8d5b0";

          return (
            <div key={role} className="mb-4">
              <div className="text-[10px] uppercase tracking-widest font-mono mb-2 pb-1 border-b border-[#2e1b0e]"
                style={{ color: roleColor + "80" }}>
                {role}
              </div>
              <div className="space-y-2">
                {units.map((ru, idx) => {
                  const unit = faction?.units.find((u) => u.id === ru.unitTemplateId);
                  if (!unit) return null;
                  const equippedItems = (ru.equipment ?? [])
                    .map((eqId) => faction?.armoury.find((e) => e.id === eqId))
                    .filter(Boolean);
                  const unitCost = unit.costType === "DUCATS"
                    ? unit.cost + equippedItems.reduce((s, e) => e!.costType === "DUCATS" ? s + e!.cost : s, 0)
                    : 0;
                  const unitGlory = unit.costType === "GLORY"
                    ? unit.cost
                    : equippedItems.reduce((s, e) => e!.costType === "GLORY" ? s + e!.cost : s, 0);

                  return (
                    <div
                      key={idx}
                      className="bg-[#1a0f0a] border border-[#2e1b0e] rounded p-4 flex flex-col sm:flex-row sm:items-start gap-3"
                      style={{ borderLeftColor: roleColor, borderLeftWidth: 3 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-serif font-bold" style={{ color: roleColor }}>
                            {ru.customName || unit.name}
                          </span>
                          {ru.customName && (
                            <span className="text-xs text-[#4a3728]">({unit.name})</span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-3 text-[10px] font-mono text-[#e8d5b0]/30 mb-2">
                          <span>MV {unit.stats.movement}</span>
                          <span>CC {unit.stats.melee}</span>
                          <span>RG {unit.stats.ranged}</span>
                          <span>AR {unit.stats.armour}</span>
                        </div>

                        {/* Traits */}
                        {unit.traits.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {unit.traits.map((t) => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#2e1b0e] text-[#e8d5b0]/30 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Equipment */}
                        {equippedItems.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {equippedItems.map((eq) => (
                              <span key={eq!.id} className="text-[10px] px-2 py-0.5 rounded bg-[#2e1b0e]/60 text-[#e8d5b0]/40">
                                {eq!.name}
                                <span className="ml-1 text-[#c8a96e]/30 font-mono">
                                  {eq!.costType === "DUCATS" ? `${eq!.cost}d` : `${eq!.cost}⛭`}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-mono text-[#c8a96e]/70">{unitCost}d</div>
                        {unitGlory > 0 && <div className="text-xs font-mono text-amber-600">{unitGlory}⛭</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {isOwn && (
          <Link
            href={`/warbands/build?edit=${warband.id}`}
            className="px-5 py-2 bg-[#2e1b0e] text-[#e8d5b0]/70 rounded font-serif text-sm uppercase tracking-wider hover:bg-[#3a2418] transition-colors"
          >
            Edit Warband
          </Link>
        )}
        <a
          href={faction?.rosterUrl ?? "https://trench-companion.com/compendium/warbands"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 border border-[#2e1b0e] text-[#4a3728] rounded font-serif text-sm uppercase tracking-wider hover:text-[#e8d5b0]/50 transition-colors"
        >
          Faction Rules →
        </a>
      </div>
    </div>
  );
}
