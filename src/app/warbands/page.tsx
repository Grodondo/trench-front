"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { GAME_FACTIONS } from "@/lib/gameData";

interface WarbandSummary {
  id: number;
  name: string;
  faction: string;
  subfaction: string | null;
  totalDucats: number;
  totalGlory: number;
  unitCount: number;
  username: string | null;
  createdAt: string;
  isOwn: boolean;
}

interface Session {
  userId: number;
  username: string;
}

function WarbandCard({ warband, onDelete }: { warband: WarbandSummary; onDelete?: (id: number) => void }) {
  const factionData = GAME_FACTIONS.find((f) => f.id === warband.faction);
  const accentColor = factionData?.accentColor ?? "#c8a96e";
  const side = factionData?.side ?? "FAITHFUL";

  return (
    <Link
      href={`/warbands/${warband.id}`}
      className="group block bg-[#1a0f0a] border border-[#2e1b0e] rounded hover:border-[#c8a96e]/40 transition-all duration-200 overflow-hidden"
    >
      {factionData?.imageUrl && (
        <div className="h-24 overflow-hidden relative">
          <img
            src={factionData.imageUrl}
            alt={factionData.name}
            className="w-full h-full object-cover object-top opacity-50 group-hover:opacity-70 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] to-transparent" />
        </div>
      )}
      {!factionData?.imageUrl && (
        <div className="h-10" style={{ backgroundColor: accentColor + "18" }} />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif font-bold text-[#e8d5b0] group-hover:text-[#c8a96e] transition-colors leading-tight">
            {warband.name}
          </h3>
          {warband.isOwn && onDelete && (
            <button
              onClick={(e) => { e.preventDefault(); onDelete(warband.id); }}
              className="shrink-0 text-[#4a3728] hover:text-red-500 transition-colors text-xs px-1"
              title="Delete"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded"
            style={{ color: accentColor, backgroundColor: accentColor + "18" }}
          >
            {factionData?.name ?? warband.faction}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-[#4a3728]">
          <span className="text-[#e8d5b0]/30">{warband.unitCount} units</span>
          <span className="text-[#c8a96e]/50">{warband.totalDucats}d</span>
          {warband.totalGlory > 0 && <span className="text-amber-700">{warband.totalGlory}⛭</span>}
          <span
            className="ml-auto"
            style={{ color: side === "FAITHFUL" ? "#b8860b80" : "#8b000080" }}
          >
            {side === "FAITHFUL" ? "⛨ Faithful" : "☩ Infernal"}
          </span>
        </div>

        {warband.username && (
          <div className="mt-2 text-[10px] text-[#4a3728]">
            by <span className="text-[#e8d5b0]/30">{warband.username}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function WarbandsPage() {
  const [warbands, setWarbands] = useState<WarbandSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [viewMine, setViewMine] = useState(false);
  const [factionFilter, setFactionFilter] = useState("");

  const fetchSession = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setSession(data.user ?? null);
  }, []);

  const fetchWarbands = useCallback(async (p = 1, mine = false, faction = "") => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p) });
    if (mine) params.set("mine", "1");
    if (faction) params.set("faction", faction);
    const res = await fetch(`/api/warbands?${params}`);
    const data = await res.json();
    setWarbands(data.warbands ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSession(); }, [fetchSession]);
  useEffect(() => { fetchWarbands(page, viewMine, factionFilter); }, [fetchWarbands, page, viewMine, factionFilter]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this warband? This cannot be undone.")) return;
    await fetch(`/api/warbands/${id}`, { method: "DELETE" });
    fetchWarbands(page, viewMine, factionFilter);
  }, [fetchWarbands, page, viewMine, factionFilter]);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setViewMine(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#c8a96e] tracking-wider">WARBANDS</h1>
          <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em] mt-1">
            Community Rosters of the Eternal Crusade
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {session ? (
            <>
              <span className="text-xs text-[#e8d5b0]/40">
                <span className="text-[#c8a96e]/70">{session.username}</span>
              </span>
              <button onClick={handleLogout} className="text-xs text-[#4a3728] hover:text-[#e8d5b0]/50 transition-colors">
                Sign out
              </button>
            </>
          ) : null}
          <Link
            href="/warbands/build"
            className="px-5 py-2 bg-[#c8a96e] text-[#0d0805] rounded font-serif font-bold text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors"
          >
            + Build Warband
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {session && (
          <div className="flex rounded border border-[#2e1b0e] overflow-hidden text-xs font-mono">
            <button
              onClick={() => { setViewMine(false); setPage(1); }}
              className={`px-3 py-1.5 transition-colors ${!viewMine ? "bg-[#c8a96e]/20 text-[#c8a96e]" : "text-[#4a3728] hover:text-[#e8d5b0]/50"}`}
            >
              All Warbands
            </button>
            <button
              onClick={() => { setViewMine(true); setPage(1); }}
              className={`px-3 py-1.5 transition-colors ${viewMine ? "bg-[#c8a96e]/20 text-[#c8a96e]" : "text-[#4a3728] hover:text-[#e8d5b0]/50"}`}
            >
              My Warbands
            </button>
          </div>
        )}
        <select
          value={factionFilter}
          onChange={(e) => { setFactionFilter(e.target.value); setPage(1); }}
          className="bg-[#1a0f0a] border border-[#2e1b0e] rounded px-3 py-1.5 text-xs text-[#e8d5b0]/60 focus:outline-none focus:border-[#c8a96e]/40"
        >
          <option value="">All Factions</option>
          {GAME_FACTIONS.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <span className="text-xs text-[#4a3728] ml-auto">{total} warbands</span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#4a3728]">Mustering the forces…</div>
      ) : warbands.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#4a3728] mb-4">No warbands found.</p>
          <Link href="/warbands/build" className="text-[#c8a96e]/70 hover:text-[#c8a96e] text-sm transition-colors">
            Be the first to muster a warband →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {warbands.map((w) => (
              <WarbandCard key={w.id} warband={w} onDelete={handleDelete} />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-xs font-mono transition-colors ${
                    p === page
                      ? "bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/40"
                      : "text-[#4a3728] hover:text-[#e8d5b0]/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

