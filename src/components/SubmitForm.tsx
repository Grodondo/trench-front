"use client";

import { useState, useEffect } from "react";
import FactionSelect from "./FactionSelect";

interface Sector {
  id: number;
  name: string;
  slug: string;
}

export default function SubmitForm() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [warbandName, setWarbandName] = useState("");
  const [playerFaction, setPlayerFaction] = useState("");
  const [opponentFaction, setOpponentFaction] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [outcome, setOutcome] = useState("");
  const [keyMoment, setKeyMoment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/sectors")
      .then((r) => r.json())
      .then((data) => setSectors(data.sectors || []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warbandName: warbandName || null,
          playerFaction,
          opponentFaction,
          sectorId: parseInt(sectorId),
          outcome,
          keyMoment: keyMoment || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: "Battle submitted. The front line acknowledges your sacrifice." });
        setWarbandName("");
        setPlayerFaction("");
        setOpponentFaction("");
        setSectorId("");
        setOutcome("");
        setKeyMoment("");
      } else {
        setResult({ success: false, message: data.error || "Submission failed." });
      }
    } catch {
      setResult({ success: false, message: "Network error. The lines are down." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* Warband Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="warbandName" className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Warband Name <span className="text-[#4a3728] normal-case">(optional)</span>
        </label>
        <input
          id="warbandName"
          type="text"
          value={warbandName}
          onChange={(e) => setWarbandName(e.target.value)}
          maxLength={60}
          placeholder="e.g., The Iron Penitents"
          className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#4a3728]"
        />
      </div>

      {/* Factions */}
      <FactionSelect
        name="playerFaction"
        label="Your Faction"
        value={playerFaction}
        onChange={setPlayerFaction}
        required
      />
      <FactionSelect
        name="opponentFaction"
        label="Opponent Faction"
        value={opponentFaction}
        onChange={setOpponentFaction}
        required
      />

      {/* Sector */}
      <div className="flex flex-col gap-1">
        <label htmlFor="sectorId" className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Sector
        </label>
        <select
          id="sectorId"
          value={sectorId}
          onChange={(e) => setSectorId(e.target.value)}
          required
          className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors"
        >
          <option value="">— Select Sector —</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Outcome */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Outcome
        </label>
        <div className="flex gap-3">
          {["VICTORY", "DEFEAT", "DRAW"].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOutcome(o)}
              className={`flex-1 py-2 px-3 rounded border text-sm font-bold uppercase tracking-wider transition-all ${
                outcome === o
                  ? o === "VICTORY"
                    ? "bg-[#c8a96e]/20 border-[#c8a96e] text-[#c8a96e]"
                    : o === "DEFEAT"
                    ? "bg-[#8b0000]/20 border-[#8b0000] text-[#ff4444]"
                    : "bg-[#4a3728]/30 border-[#4a3728] text-[#e8d5b0]"
                  : "bg-transparent border-[#2e1b0e] text-[#4a3728] hover:border-[#4a3728]"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Key Moment */}
      <div className="flex flex-col gap-1">
        <label htmlFor="keyMoment" className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Key Moment <span className="text-[#4a3728] normal-case">(optional, 100 chars)</span>
        </label>
        <input
          id="keyMoment"
          type="text"
          value={keyMoment}
          onChange={(e) => setKeyMoment(e.target.value)}
          maxLength={100}
          placeholder="e.g., Brother Aldric fell holding the line"
          className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#4a3728]"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !playerFaction || !opponentFaction || !sectorId || !outcome}
        className="w-full py-3 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Transmitting..." : "Submit Battle Report"}
      </button>

      {/* Result message */}
      {result && (
        <div
          className={`p-3 rounded border text-sm ${
            result.success
              ? "border-[#c8a96e]/40 text-[#c8a96e] bg-[#c8a96e]/10"
              : "border-[#8b0000]/40 text-[#ff4444] bg-[#8b0000]/10"
          }`}
        >
          {result.message}
        </div>
      )}
    </form>
  );
}
