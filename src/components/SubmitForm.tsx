"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FactionSelect from "./FactionSelect";

// Maps gameData faction IDs â†’ FACTIONS names used by the submissions API
const FACTION_ID_TO_NAME: Record<string, string> = {
  "new-antioch": "New Antioch Principality",
  "trench-pilgrims": "Trench Pilgrims",
  "iron-sultanate": "Iron Sultanate",
  "heretic-legion": "Heretic Legion",
  "court-of-seven-headed-serpent": "Court of the Seven-Headed Serpent",
  "cult-of-black-grail": "Cult of the Black Grail",
};

const FAITHFUL_IDS = new Set(["new-antioch", "trench-pilgrims", "iron-sultanate"]);
const INFERNAL_IDS = new Set(["heretic-legion", "court-of-seven-headed-serpent", "cult-of-black-grail"]);

function factionSide(id: string): "FAITHFUL" | "INFERNAL" | null {
  if (FAITHFUL_IDS.has(id)) return "FAITHFUL";
  if (INFERNAL_IDS.has(id)) return "INFERNAL";
  return null;
}

interface Sector { id: number; name: string; }
interface WarbandInfo { id: string; name: string; faction: string; isOwn?: boolean; }

export default function SubmitForm() {
  const [sectors, setSectors] = useState<Sector[]>([]);

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState<"none" | "login" | "register">("none");

  // Login fields
  const [loginValue, setLoginValue] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Warband data
  const [myWarbands, setMyWarbands] = useState<WarbandInfo[]>([]);
  const [publicWarbands, setPublicWarbands] = useState<WarbandInfo[]>([]);
  const [loadingWarbands, setLoadingWarbands] = useState(false);

  // Form fields
  const [myWarbandId, setMyWarbandId] = useState("");
  const [opponentWarbandId, setOpponentWarbandId] = useState("");
  const [manualOpponentFaction, setManualOpponentFaction] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [outcome, setOutcome] = useState("");
  const [keyMoment, setKeyMoment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Derived
  const selectedWarband = myWarbands.find((w) => w.id === myWarbandId);
  const playerFactionName = selectedWarband
    ? (FACTION_ID_TO_NAME[selectedWarband.faction] ?? selectedWarband.faction)
    : "";
  const playerSide = selectedWarband ? factionSide(selectedWarband.faction) : null;
  const opponentWarband = publicWarbands.find((w) => w.id === opponentWarbandId);
  const opponentFactionName = opponentWarband
    ? (FACTION_ID_TO_NAME[opponentWarband.faction] ?? opponentWarband.faction)
    : manualOpponentFaction;
  const eligibleOpponents = publicWarbands.filter((w) => {
    if (w.isOwn) return false;
    const s = factionSide(w.faction);
    return playerSide && s && s !== playerSide;
  });

  const loadWarbands = useCallback(() => {
    setLoadingWarbands(true);
    Promise.all([
      fetch("/api/warbands?mine=1").then((r) => r.json()).then((d) => d.warbands ?? []),
      fetch("/api/warbands").then((r) => r.json()).then((d) => d.warbands ?? []),
    ])
      .then(([mine, all]) => {
        setMyWarbands(mine);
        setPublicWarbands(all);
      })
      .catch(() => {})
      .finally(() => setLoadingWarbands(false));
  }, []);

  useEffect(() => {
    fetch("/api/sectors")
      .then((r) => r.json())
      .then((d) => setSectors(d.sectors ?? []))
      .catch(() => {});

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const loggedIn = !!d.user;
        setIsLoggedIn(loggedIn);
        setAuthChecked(true);
        if (loggedIn) loadWarbands();
      })
      .catch(() => setAuthChecked(true));
  }, [loadWarbands]);

  const doLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginValue, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error ?? "Login failed."); return; }
      setIsLoggedIn(true);
      setAuthStep("none");
      loadWarbands();
    } finally {
      setAuthLoading(false);
    }
  };

  const doRegister = async () => {
    setAuthError("");
    if (regPassword !== regPasswordConfirm) { setAuthError("Passwords do not match."); return; }
    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: regUsername, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error ?? "Registration failed."); return; }
      setIsLoggedIn(true);
      setAuthStep("none");
      setRegPasswordConfirm("");
      loadWarbands();
    } finally {
      setAuthLoading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!myWarbandId || !opponentFactionName || !sectorId || !outcome) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warbandName: selectedWarband?.name ?? null,
          playerFaction: playerFactionName,
          opponentFaction: opponentFactionName,
          sectorId: parseInt(sectorId),
          outcome,
          keyMoment: keyMoment || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: "Battle submitted. The front line acknowledges your sacrifice." });
        setMyWarbandId("");
        setOpponentWarbandId("");
        setManualOpponentFaction("");
        setSectorId("");
        setOutcome("");
        setKeyMoment("");
      } else {
        setResult({ success: false, message: data.error ?? "Submission failed." });
      }
    } catch {
      setResult({ success: false, message: "Network error. The lines are down." });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors placeholder:text-[#4a3728] w-full";

  // â”€â”€ Inline auth panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (authStep === "login") {
    return (
      <div className="space-y-4 max-w-sm w-full">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-serif font-bold text-[#c8a96e]">Sign In</h2>
          <button onClick={() => { setAuthStep("none"); setAuthError(""); }} className="text-xs text-[#4a3728] hover:text-[#e8d5b0] transition-colors">â† Back</button>
        </div>
        <input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} placeholder="Email or username" className={inputClass} />
        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className={inputClass}
          onKeyDown={(e) => e.key === "Enter" && doLogin()} />
        {authError && <p className="text-xs text-red-400">{authError}</p>}
        <button onClick={doLogin} disabled={authLoading || !loginValue || !loginPassword}
          className="w-full py-2.5 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] disabled:opacity-40 transition-colors text-sm">
          {authLoading ? "Signing inâ€¦" : "Sign In"}
        </button>
        <p className="text-xs text-center text-[#4a3728]">
          No account?{" "}
          <button onClick={() => { setAuthStep("register"); setAuthError(""); }} className="text-[#c8a96e] hover:underline">Register</button>
        </p>
      </div>
    );
  }

  if (authStep === "register") {
    return (
      <div className="space-y-4 max-w-sm w-full">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-serif font-bold text-[#c8a96e]">Create Account</h2>
          <button onClick={() => { setAuthStep("none"); setAuthError(""); }} className="text-xs text-[#4a3728] hover:text-[#e8d5b0] transition-colors">â† Back</button>
        </div>
        <input value={regUsername} onChange={(e) => setRegUsername(e.target.value)} placeholder="Username (max 30 chars)" className={inputClass} maxLength={30} />
        <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" className={inputClass} />
        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Password (min 8 chars)" className={inputClass} minLength={8} />
        <input type="password" value={regPasswordConfirm} onChange={(e) => setRegPasswordConfirm(e.target.value)} placeholder="Confirm password" className={inputClass + (regPasswordConfirm && regPassword !== regPasswordConfirm ? " border-red-700" : "")} />
        {authError && <p className="text-xs text-red-400">{authError}</p>}
        <button onClick={doRegister} disabled={authLoading || !regUsername || !regEmail || !regPassword || !regPasswordConfirm}
          className="w-full py-2.5 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] disabled:opacity-40 transition-colors text-sm">
          {authLoading ? "Creating accountâ€¦" : "Create Account"}
        </button>
        <p className="text-xs text-center text-[#4a3728]">
          Already have one?{" "}
          <button onClick={() => { setAuthStep("login"); setAuthError(""); }} className="text-[#c8a96e] hover:underline">Sign in</button>
        </p>
      </div>
    );
  }

  // â”€â”€ Main form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg w-full">

      {/* Auth callout */}
      {authChecked && !isLoggedIn && (
        <div className="p-4 rounded border border-[#4a3728] bg-[#1a0f0a] text-sm">
          <p className="text-[#e8d5b0]/70 mb-3">
            You need a saved warband to submit a battle.
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setAuthStep("login"); setAuthError(""); }}
              className="flex-1 py-2 rounded border border-[#c8a96e]/40 text-[#c8a96e] text-sm font-bold uppercase tracking-wider hover:bg-[#c8a96e]/10 transition-colors">
              Sign In
            </button>
            <button type="button" onClick={() => { setAuthStep("register"); setAuthError(""); }}
              className="flex-1 py-2 rounded border border-[#4a3728] text-[#e8d5b0]/60 text-sm uppercase tracking-wider hover:border-[#c8a96e]/40 hover:text-[#c8a96e] transition-colors">
              Register
            </button>
          </div>
        </div>
      )}

      {/* Your Warband */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Your Warband
        </label>
        {!authChecked || loadingWarbands ? (
          <div className={inputClass + " text-[#4a3728]"}>Loading warbandsâ€¦</div>
        ) : !isLoggedIn ? (
          <div className={inputClass + " text-[#4a3728] cursor-not-allowed opacity-60"}>
            Sign in to select your warband
          </div>
        ) : myWarbands.length === 0 ? (
          <div className="p-3 rounded border border-[#4a3728] bg-[#1a0f0a] text-sm text-[#e8d5b0]/60">
            No warbands yet.{" "}
            <Link href="/warbands/build" className="text-[#c8a96e] hover:underline">
              Build one first â†’
            </Link>
          </div>
        ) : (
          <select
            value={myWarbandId}
            onChange={(e) => { setMyWarbandId(e.target.value); setOpponentWarbandId(""); setManualOpponentFaction(""); }}
            required
            className={inputClass}
          >
            <option value="">â€” Select your warband â€”</option>
            {myWarbands.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({FACTION_ID_TO_NAME[w.faction] ?? w.faction})
              </option>
            ))}
          </select>
        )}
        {selectedWarband && (
          <p className="text-xs font-mono text-[#c8a96e]/50 mt-0.5">
            {playerFactionName} Â· {playerSide}
          </p>
        )}
      </div>

      {/* Opponent Warband (optional) */}
      {isLoggedIn && myWarbandId && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
            Opponent&apos;s Warband <span className="text-[#4a3728] normal-case font-normal">(optional)</span>
          </label>
          {eligibleOpponents.length > 0 ? (
            <select
              value={opponentWarbandId}
              onChange={(e) => { setOpponentWarbandId(e.target.value); setManualOpponentFaction(""); }}
              className={inputClass}
            >
              <option value="">â€” Select opponent warband (optional) â€”</option>
              {eligibleOpponents.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({FACTION_ID_TO_NAME[w.faction] ?? w.faction})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-[#4a3728]">No opposing warbands found in the public gallery.</p>
          )}
        </div>
      )}

      {/* Opponent Faction (manual, shown when no opponent warband selected) */}
      {(!opponentWarbandId) && (
        <FactionSelect
          name="opponentFaction"
          label={
            opponentWarbandId
              ? "Opponent Faction (auto)"
              : "Opponent Faction"
          }
          value={manualOpponentFaction}
          onChange={setManualOpponentFaction}
          required={!opponentWarbandId}
        />
      )}
      {opponentWarband && (
        <p className="text-xs font-mono text-[#cc3333]/60 -mt-3">
          {opponentWarband.name} Â· {FACTION_ID_TO_NAME[opponentWarband.faction] ?? opponentWarband.faction}
        </p>
      )}

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
          className={inputClass}
        >
          <option value="">â€” Select Sector â€”</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
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

      {/* Key Moment */}
      <div className="flex flex-col gap-1">
        <label htmlFor="keyMoment" className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
          Key Moment <span className="text-[#4a3728] normal-case font-normal">(optional, 100 chars)</span>
        </label>
        <input
          id="keyMoment"
          type="text"
          value={keyMoment}
          onChange={(e) => setKeyMoment(e.target.value)}
          maxLength={100}
          placeholder="e.g., Brother Aldric fell holding the line"
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          submitting ||
          !isLoggedIn ||
          !myWarbandId ||
          !opponentFactionName ||
          !sectorId ||
          !outcome
        }
        className="w-full py-3 bg-[#c8a96e] text-[#1a0f0a] font-bold uppercase tracking-widest rounded hover:bg-[#d4b87a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Transmittingâ€¦" : "Submit Battle Report"}
      </button>

      {/* Result */}
      {result && (
        <div className={`p-3 rounded border text-sm ${
          result.success
            ? "border-[#c8a96e]/40 text-[#c8a96e] bg-[#c8a96e]/10"
            : "border-[#8b0000]/40 text-[#ff4444] bg-[#8b0000]/10"
        }`}>
          {result.message}
        </div>
      )}
    </form>
  );
}

