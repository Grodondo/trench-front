"use client";

import { useState } from "react";
import FactionSelect from "./FactionSelect";

export default function ReportForm() {
  const [warbandName, setWarbandName] = useState("");
  const [playerFaction, setPlayerFaction] = useState("");
  const [opponentFaction, setOpponentFaction] = useState("");
  const [location, setLocation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [keyMoments, setKeyMoments] = useState(["", "", ""]);
  const [tone, setTone] = useState("GRIM");
  const [submitting, setSubmitting] = useState(false);
  const [reportSlug, setReportSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateKeyMoment(index: number, value: string) {
    const updated = [...keyMoments];
    updated[index] = value;
    setKeyMoments(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warbandName: warbandName || null,
          playerFaction,
          opponentFaction,
          location,
          outcome,
          keyMoments: keyMoments.filter((m) => m.trim()),
          tone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReportSlug(data.slug);
      } else {
        setError(data.error || "Failed to generate report.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reportSlug) {
    return (
      <div className="text-center space-y-4">
        <p className="text-[#c8a96e] text-lg">War dispatch generated.</p>
        <a
          href={`/report/${reportSlug}`}
          className="inline-block py-3 px-8 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] transition-colors"
        >
          View Report
        </a>
        <button
          onClick={() => {
            setReportSlug(null);
            setWarbandName("");
            setPlayerFaction("");
            setOpponentFaction("");
            setLocation("");
            setOutcome("");
            setKeyMoments(["", "", ""]);
            setTone("GRIM");
          }}
          className="block mx-auto text-sm text-[#4a3728] hover:text-[#c8a96e] transition-colors"
        >
          Generate another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* Warband Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reportWarband" className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Warband Name
        </label>
        <input
          id="reportWarband"
          type="text"
          value={warbandName}
          onChange={(e) => setWarbandName(e.target.value)}
          maxLength={60}
          placeholder="e.g., The Ashen Wardens"
          className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#4a3728]"
        />
      </div>

      <FactionSelect name="reportPlayerFaction" label="Your Faction" value={playerFaction} onChange={setPlayerFaction} required />
      <FactionSelect name="reportOpponentFaction" label="Opponent Faction" value={opponentFaction} onChange={setOpponentFaction} required />

      {/* Location */}
      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Location / Sector
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={80}
          placeholder="e.g., The Ossuary Crossing"
          className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#4a3728]"
        />
      </div>

      {/* Outcome */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">Outcome</label>
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

      {/* Key Moments */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Key Moments <span className="text-[#4a3728] normal-case">(up to 3, 60 chars each)</span>
        </label>
        {keyMoments.map((moment, i) => (
          <input
            key={i}
            type="text"
            value={moment}
            onChange={(e) => updateKeyMoment(i, e.target.value)}
            maxLength={60}
            placeholder={
              i === 0
                ? "e.g., Brother Aldric fell holding the line"
                : i === 1
                ? "e.g., Demonic artillery silenced by faith"
                : "e.g., The relic was secured at great cost"
            }
            className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#4a3728]"
          />
        ))}
      </div>

      {/* Tone */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">Tone</label>
        <div className="flex gap-3">
          {["HEROIC", "GRIM", "PYRRHIC"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={`flex-1 py-2 px-3 rounded border text-sm font-bold uppercase tracking-wider transition-all ${
                tone === t
                  ? "bg-[#c8a96e]/20 border-[#c8a96e] text-[#c8a96e]"
                  : "bg-transparent border-[#2e1b0e] text-[#4a3728] hover:border-[#4a3728]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !playerFaction || !opponentFaction || !outcome}
        className="w-full py-3 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Generating Dispatch..." : "Generate War Dispatch"}
      </button>

      {error && (
        <div className="p-3 rounded border border-[#8b0000]/40 text-[#ff4444] bg-[#8b0000]/10 text-sm">
          {error}
        </div>
      )}
    </form>
  );
}
