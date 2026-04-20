"use client";

import { useState, useCallback, useMemo } from "react";
import {
  GAME_FACTIONS,
  getFactionById,
  validateWarband,
  type FactionData,
  type UnitTemplate,
  type EquipmentItem,
  type RosterUnit,
  type ValidationResult,
} from "@/lib/gameData";

// ─── Sub-components ───────────────────────────────────────────────────────────

function FactionPicker({ onPick }: { onPick: (id: string) => void }) {
  const faithful = GAME_FACTIONS.filter((f) => f.side === "FAITHFUL");
  const infernal = GAME_FACTIONS.filter((f) => f.side === "INFERNAL");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-[#c8a96e] text-center tracking-wider mb-2">
        WARBAND BUILDER
      </h1>
      <p className="text-center text-[#e8d5b0]/50 text-sm mb-10 tracking-widest uppercase">
        Choose your allegiance
      </p>

      <div className="grid grid-cols-1 gap-10">
        {/* Faithful */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#b8860b]/30" />
            <span className="text-[#b8860b] font-serif tracking-widest text-sm uppercase">The Faithful</span>
            <div className="h-px flex-1 bg-[#b8860b]/30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {faithful.map((f) => (
              <FactionCard key={f.id} faction={f} onPick={onPick} />
            ))}
          </div>
        </div>

        {/* Infernal */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#8b0000]/40" />
            <span className="text-[#cc3333] font-serif tracking-widest text-sm uppercase">The Infernal</span>
            <div className="h-px flex-1 bg-[#8b0000]/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {infernal.map((f) => (
              <FactionCard key={f.id} faction={f} onPick={onPick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactionCard({ faction, onPick }: { faction: FactionData; onPick: (id: string) => void }) {
  return (
    <button
      onClick={() => onPick(faction.id)}
      className="group relative overflow-hidden rounded border border-[#2e1b0e] hover:border-[#c8a96e]/60 bg-[#1a0f0a] transition-all duration-200 text-left w-full"
    >
      {faction.imageUrl && (
        <div className="h-36 overflow-hidden relative">
          <img
            src={faction.imageUrl}
            alt={faction.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 opacity-70 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-[#1a0f0a]/30 to-transparent" />
        </div>
      )}
      {!faction.imageUrl && (
        <div
          className="h-20 flex items-center justify-center"
          style={{ backgroundColor: faction.accentColor + "22" }}
        >
          <span className="text-3xl opacity-40">⚔</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[#c8a96e] font-serif font-bold text-sm leading-tight group-hover:text-[#d4b87a] transition-colors">
            {faction.name}
          </h3>
          <span
            className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono"
            style={{ color: faction.accentColor, borderColor: faction.accentColor + "60", border: "1px solid" }}
          >
            {faction.side === "FAITHFUL" ? "Faithful" : "Infernal"}
          </span>
        </div>
        <p className="text-[#e8d5b0]/40 text-xs mt-1 italic">{faction.tagline}</p>
        <p className="text-[#e8d5b0]/50 text-xs mt-2 leading-relaxed line-clamp-2">{faction.description}</p>
        <div className="mt-3 text-xs text-[#c8a96e]/60 uppercase tracking-wider font-mono">
          {faction.units.length} unit types →
        </div>
      </div>
    </button>
  );
}

// ─── Roster Item ──────────────────────────────────────────────────────────────

interface RosterEntry extends RosterUnit {
  _key: string; // unique per entry in roster
}

function UnitRosterCard({
  entry,
  faction,
  onRemove,
  onEquipmentChange,
  onRename,
}: {
  entry: RosterEntry;
  faction: FactionData;
  onRemove: (key: string) => void;
  onEquipmentChange: (key: string, eqId: string, add: boolean) => void;
  onRename: (key: string, name: string) => void;
}) {
  const unit = faction.units.find((u) => u.id === entry.unitTemplateId)!;
  const [showEqPicker, setShowEqPicker] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(entry.customName ?? "");

  // Determine available equipment for this unit
  const availableEq = faction.armoury.filter((eq) => {
    if (eq.eliteOnly && !unit.keywords.includes("ELITE")) return false;
    if (eq.allowedUnitIds && !eq.allowedUnitIds.includes(unit.id)) return false;
    return true;
  });

  const equippedItems = entry.equipment
    .map((id) => faction.armoury.find((e) => e.id === id))
    .filter(Boolean) as EquipmentItem[];

  const roleColor =
    unit.role === "CAPTAIN"
      ? "#c8a96e"
      : unit.role === "ELITE"
      ? "#9cb4cc"
      : "#e8d5b0";

  return (
    <div className="border border-[#2e1b0e] rounded bg-[#1a0f0a] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-[#2e1b0e]"
        style={{ borderLeftColor: roleColor, borderLeftWidth: 3 }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="text-[10px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded shrink-0"
            style={{ color: roleColor, backgroundColor: roleColor + "18" }}
          >
            {unit.role}
          </span>
          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => {
                setEditingName(false);
                onRename(entry._key, nameInput.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setEditingName(false); onRename(entry._key, nameInput.trim()); }
                if (e.key === "Escape") { setEditingName(false); setNameInput(entry.customName ?? ""); }
              }}
              className="text-sm font-serif text-[#e8d5b0] bg-[#2e1b0e] border border-[#c8a96e]/40 rounded px-2 py-0.5 flex-1 min-w-0"
              placeholder={unit.name}
            />
          ) : (
            <button
              className="text-sm font-serif text-left truncate hover:text-[#c8a96e] transition-colors flex-1 min-w-0"
              style={{ color: roleColor }}
              onClick={() => { setEditingName(true); setNameInput(entry.customName ?? ""); }}
              title="Click to rename"
            >
              {entry.customName || unit.name}
              {entry.customName && (
                <span className="text-[#e8d5b0]/30 text-xs ml-1">({unit.name})</span>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-[#c8a96e]/70">
            {unit.costType === "DUCATS" ? `${unit.cost}d` : `${unit.cost}⛭`}
          </span>
          <button
            onClick={() => onRemove(entry._key)}
            className="text-[#4a3728] hover:text-red-500 transition-colors text-sm leading-none px-1"
            title="Remove unit"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 px-3 py-1.5 text-[10px] font-mono text-[#e8d5b0]/40 border-b border-[#2e1b0e]/50">
        <span title="Movement">MV {unit.stats.movement}</span>
        <span title="Melee">CC {unit.stats.melee}</span>
        <span title="Ranged">RG {unit.stats.ranged}</span>
        <span title="Armour">AR {unit.stats.armour}</span>
        {unit.traits.length > 0 && (
          <span className="text-[#e8d5b0]/25 truncate">· {unit.traits.join(", ")}</span>
        )}
      </div>

      {/* Equipment */}
      <div className="px-3 py-2">
        {equippedItems.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {equippedItems.map((eq) => (
              <button
                key={eq.id}
                onClick={() => onEquipmentChange(entry._key, eq.id, false)}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#2e1b0e] text-[#e8d5b0]/60 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                title={`Remove ${eq.name}`}
              >
                {eq.name}
                <span className="text-[#c8a96e]/60 font-mono">
                  {eq.costType === "DUCATS" ? `+${eq.cost}d` : `+${eq.cost}⛭`}
                </span>
                <span className="opacity-40">✕</span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowEqPicker(!showEqPicker)}
          className="text-[10px] text-[#c8a96e]/50 hover:text-[#c8a96e] transition-colors uppercase tracking-wider"
        >
          {showEqPicker ? "▲ Close equipment" : "▼ Add equipment"}
          <span className="ml-1 text-[#4a3728]">({availableEq.length} available)</span>
        </button>

        {showEqPicker && (
          <div className="mt-2 grid grid-cols-1 gap-0.5 max-h-52 overflow-y-auto pr-1">
            {(["MELEE", "RANGED", "GRENADE", "ARMOUR", "SHIELD", "EQUIPMENT"] as const).map((cat) => {
              const items = availableEq.filter((e) => e.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="text-[9px] uppercase tracking-widest text-[#4a3728] mt-1.5 mb-0.5 px-1">{cat}</div>
                  {items.map((eq) => {
                    const isEquipped = entry.equipment.includes(eq.id);
                    return (
                      <button
                        key={eq.id}
                        onClick={() => onEquipmentChange(entry._key, eq.id, !isEquipped)}
                        className={`w-full text-left text-[10px] px-2 py-1 rounded flex items-center justify-between transition-colors ${
                          isEquipped
                            ? "bg-[#c8a96e]/15 text-[#c8a96e]"
                            : "hover:bg-[#2e1b0e] text-[#e8d5b0]/50 hover:text-[#e8d5b0]"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {isEquipped && <span className="text-[#c8a96e]">✓</span>}
                          {eq.name}
                          {eq.note && <span className="text-[#4a3728] italic"> · {eq.note}</span>}
                        </span>
                        <span className="font-mono text-[#c8a96e]/60 shrink-0 ml-2">
                          {eq.costType === "DUCATS" ? `${eq.cost}d` : `${eq.cost}⛭`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Save Modal ───────────────────────────────────────────────────────────────

function SaveModal({
  faction,
  roster,
  validation,
  onClose,
  onSaved,
}: {
  faction: FactionData;
  roster: RosterEntry[];
  validation: ValidationResult;
  onClose: () => void;
  onSaved: (id: number) => void;
}) {
  const [step, setStep] = useState<"form" | "login" | "register">("form");
  const [warbandName, setWarbandName] = useState("");
  const [subfaction, setSubfaction] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.user) setAuthed(true);
  }, []);

  useState(() => { checkAuth(); });

  const doLogin = async () => {
    setSaving(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setAuthed(true); setStep("form");
  };

  const doRegister = async () => {
    setSaving(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password: regPassword }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setAuthed(true); setStep("form");
  };

  const doSave = async () => {
    if (!warbandName.trim()) { setError("Please enter a name for your warband"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/warbands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: warbandName,
        faction: faction.id,
        subfaction: subfaction || undefined,
        notes: notes || undefined,
        isPublic,
        roster: roster.map(({ _key: _k, ...r }) => r),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error + (data.details ? ": " + data.details.join(", ") : ""));
      return;
    }
    onSaved(data.id);
  };

  const inputClass = "w-full bg-[#0d0805] border border-[#2e1b0e] rounded px-3 py-2 text-[#e8d5b0] text-sm focus:outline-none focus:border-[#c8a96e]/60 placeholder:text-[#4a3728]";
  const btnClass = "w-full py-2.5 rounded font-serif font-bold text-sm uppercase tracking-widest transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#4a3728] hover:text-[#e8d5b0] transition-colors text-lg leading-none"
        >
          ✕
        </button>

        {step === "form" && (
          <div className="p-6">
            <h2 className="text-xl font-serif font-bold text-[#c8a96e] mb-1">Save Warband</h2>
            <p className="text-xs text-[#e8d5b0]/40 mb-5">
              {faction.name} · {validation.totalDucats}d / {validation.totalGlory}⛭
            </p>

            {!authed && (
              <div className="mb-4 p-3 bg-[#2e1b0e]/50 rounded text-xs text-[#e8d5b0]/60 flex items-center justify-between">
                <span>Sign in to save and publish your warband</span>
                <div className="flex gap-2">
                  <button onClick={() => { setStep("login"); setError(""); }} className="text-[#c8a96e] hover:underline">Login</button>
                  <span className="text-[#4a3728]">·</span>
                  <button onClick={() => { setStep("register"); setError(""); }} className="text-[#c8a96e] hover:underline">Register</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#e8d5b0]/50 mb-1 uppercase tracking-wider">Warband Name *</label>
                <input value={warbandName} onChange={(e) => setWarbandName(e.target.value)} className={inputClass} placeholder="e.g. The Crimson Oath" maxLength={60} />
              </div>
              {faction.subfactions && faction.subfactions.length > 0 && (
                <div>
                  <label className="block text-xs text-[#e8d5b0]/50 mb-1 uppercase tracking-wider">Variant / Subfaction</label>
                  <select value={subfaction} onChange={(e) => setSubfaction(e.target.value)} className={inputClass}>
                    <option value="">— Standard {faction.name} —</option>
                    {faction.subfactions.map((sf) => (
                      <option key={sf.id} value={sf.id}>{sf.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs text-[#e8d5b0]/50 mb-1 uppercase tracking-wider">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass + " resize-none"} rows={2} placeholder="Lore, tactics, story..." maxLength={500} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-[#c8a96e]" />
                <span className="text-sm text-[#e8d5b0]/60">Make this warband public (visible to all)</span>
              </label>
            </div>

            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

            <button
              onClick={authed ? doSave : () => { setStep("login"); setError(""); }}
              disabled={saving}
              className={`${btnClass} mt-5 bg-[#c8a96e] text-[#0d0805] hover:bg-[#d4b87a] disabled:opacity-50`}
            >
              {saving ? "Saving…" : authed ? "Save Warband" : "Sign In to Save"}
            </button>
          </div>
        )}

        {step === "login" && (
          <div className="p-6">
            <h2 className="text-xl font-serif font-bold text-[#c8a96e] mb-5">Sign In</h2>
            <div className="space-y-3">
              <input value={login} onChange={(e) => setLogin(e.target.value)} className={inputClass} placeholder="Username or email" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={inputClass} placeholder="Password" onKeyDown={(e) => e.key === "Enter" && doLogin()} />
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <button onClick={doLogin} disabled={saving} className={`${btnClass} mt-4 bg-[#c8a96e] text-[#0d0805] hover:bg-[#d4b87a] disabled:opacity-50`}>
              {saving ? "…" : "Sign In"}
            </button>
            <p className="text-center text-xs text-[#4a3728] mt-3">
              No account?{" "}
              <button onClick={() => { setStep("register"); setError(""); }} className="text-[#c8a96e] hover:underline">Register here</button>
            </p>
            <button onClick={() => { setStep("form"); setError(""); }} className="w-full mt-2 text-xs text-[#4a3728] hover:text-[#e8d5b0]/50 transition-colors">← Back</button>
          </div>
        )}

        {step === "register" && (
          <div className="p-6">
            <h2 className="text-xl font-serif font-bold text-[#c8a96e] mb-5">Create Account</h2>
            <div className="space-y-3">
              <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="Username (3–30 chars, a-z 0-9 _ -)" maxLength={30} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="Email address" type="email" />
              <input value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputClass} placeholder="Password (8+ characters)" type="password" onKeyDown={(e) => e.key === "Enter" && doRegister()} />
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <button onClick={doRegister} disabled={saving} className={`${btnClass} mt-4 bg-[#c8a96e] text-[#0d0805] hover:bg-[#d4b87a] disabled:opacity-50`}>
              {saving ? "…" : "Create Account"}
            </button>
            <p className="text-center text-xs text-[#4a3728] mt-3">
              Already have one?{" "}
              <button onClick={() => { setStep("login"); setError(""); }} className="text-[#c8a96e] hover:underline">Sign in</button>
            </p>
            <button onClick={() => { setStep("form"); setError(""); }} className="w-full mt-2 text-xs text-[#4a3728] hover:text-[#e8d5b0]/50 transition-colors">← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

let _keyCounter = 0;
function newKey() { return `unit-${++_keyCounter}`; }

export default function WarbandBuilder({ initialFactionId }: { initialFactionId?: string }) {
  const [factionId, setFactionId] = useState<string | null>(initialFactionId ?? null);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [budgetDucats] = useState(700);
  const [budgetGlory] = useState(6);

  const faction = factionId ? getFactionById(factionId) : null;

  const validation = useMemo(
    () =>
      faction
        ? validateWarband(factionId!, roster.map(({ _key: _k, ...r }) => r), budgetDucats, budgetGlory)
        : { valid: false, errors: [], warnings: [], totalDucats: 0, totalGlory: 0 },
    [faction, factionId, roster, budgetDucats, budgetGlory]
  );

  // Count how many of each unit template are in roster
  const unitCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of roster) c[r.unitTemplateId] = (c[r.unitTemplateId] ?? 0) + 1;
    return c;
  }, [roster]);

  const addUnit = useCallback((unit: UnitTemplate) => {
    setRoster((prev) => [...prev, { _key: newKey(), unitTemplateId: unit.id, equipment: [] }]);
  }, []);

  const removeUnit = useCallback((key: string) => {
    setRoster((prev) => prev.filter((r) => r._key !== key));
  }, []);

  const updateEquipment = useCallback((key: string, eqId: string, add: boolean) => {
    setRoster((prev) =>
      prev.map((r) =>
        r._key !== key
          ? r
          : {
              ...r,
              equipment: add
                ? r.equipment.includes(eqId) ? r.equipment : [...r.equipment, eqId]
                : r.equipment.filter((id) => id !== eqId),
            }
      )
    );
  }, []);

  const renameUnit = useCallback((key: string, name: string) => {
    setRoster((prev) =>
      prev.map((r) => (r._key === key ? { ...r, customName: name || undefined } : r))
    );
  }, []);

  const resetBuilder = useCallback(() => {
    setFactionId(null);
    setRoster([]);
    setSavedId(null);
    setShowSave(false);
  }, []);

  if (!faction) {
    return <FactionPicker onPick={setFactionId} />;
  }

  if (savedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">⚔</div>
        <h2 className="text-2xl font-serif font-bold text-[#c8a96e] mb-2">Warband Saved!</h2>
        <p className="text-[#e8d5b0]/50 mb-8">Your warband has been mustered and added to the rolls.</p>
        <div className="flex gap-3 justify-center">
          <a href={`/warbands/${savedId}`} className="px-6 py-2.5 bg-[#c8a96e] text-[#0d0805] rounded font-serif font-bold text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors">
            View Warband
          </a>
          <button onClick={resetBuilder} className="px-6 py-2.5 bg-[#2e1b0e] text-[#e8d5b0]/70 rounded font-serif text-sm uppercase tracking-wider hover:bg-[#3a2418] transition-colors">
            Build Another
          </button>
        </div>
      </div>
    );
  }

  const byRole = (role: UnitTemplate["role"]) => faction.units.filter((u) => u.role === role);
  const captains = byRole("CAPTAIN");
  const elites = byRole("ELITE");
  const infantry = byRole("INFANTRY");

  const ducatPct = Math.min(100, (validation.totalDucats / budgetDucats) * 100);
  const overBudget = validation.totalDucats > budgetDucats;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={resetBuilder} className="text-[#4a3728] hover:text-[#c8a96e] transition-colors text-sm">
            ← Change faction
          </button>
          <div className="h-4 w-px bg-[#2e1b0e]" />
          <div>
            <h1 className="text-lg font-serif font-bold" style={{ color: faction.accentColor }}>
              {faction.name}
            </h1>
            <p className="text-xs text-[#e8d5b0]/30 italic">{faction.tagline}</p>
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-xl font-mono font-bold ${overBudget ? "text-red-400" : "text-[#c8a96e]"}`}>
              {validation.totalDucats}
              <span className="text-sm text-[#e8d5b0]/30"> / {budgetDucats}</span>
              <span className="text-sm ml-1 text-[#e8d5b0]/50">ducats</span>
            </div>
            {validation.totalGlory > 0 && (
              <div className="text-sm font-mono text-amber-400">
                {validation.totalGlory}⛭ glory
              </div>
            )}
          </div>
          {/* Progress bar */}
          <div className="w-32 h-2 bg-[#2e1b0e] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${overBudget ? "bg-red-500" : "bg-[#c8a96e]"}`}
              style={{ width: `${ducatPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Unit picker */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-[#4a3728] mb-3 font-mono">Add Units</h2>
          <div className="space-y-4">
            {[
              { label: "Captain", units: captains },
              { label: "Elite", units: elites },
              { label: "Infantry", units: infantry },
            ].map(({ label, units: roleUnits }) => (
              roleUnits.length > 0 && (
                <div key={label}>
                  <div className="text-[10px] uppercase tracking-widest text-[#4a3728] mb-2 font-mono border-b border-[#2e1b0e] pb-1">
                    {label}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {roleUnits.map((unit) => {
                      const count = unitCounts[unit.id] ?? 0;
                      const atMax = unit.availabilityMax !== null && count >= unit.availabilityMax;
                      const isCapt = unit.role === "CAPTAIN";
                      const captInRoster = roster.some((r) => {
                        const u = faction.units.find((u) => u.id === r.unitTemplateId);
                        return u?.role === "CAPTAIN";
                      });
                      const captBlocked = isCapt && captInRoster;

                      return (
                        <button
                          key={unit.id}
                          onClick={() => addUnit(unit)}
                          disabled={atMax || captBlocked}
                          className={`group text-left p-3 rounded border transition-all duration-150 ${
                            atMax || captBlocked
                              ? "border-[#2e1b0e] bg-[#0d0805] opacity-40 cursor-not-allowed"
                              : "border-[#2e1b0e] bg-[#1a0f0a] hover:border-[#c8a96e]/40 hover:bg-[#1e1208] cursor-pointer"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className={`text-sm font-serif leading-tight ${atMax || captBlocked ? "text-[#e8d5b0]/30" : "text-[#e8d5b0]/80 group-hover:text-[#e8d5b0]"} transition-colors`}>
                              {unit.name}
                            </span>
                            <span className="text-xs font-mono text-[#c8a96e]/60 shrink-0">
                              {unit.costType === "DUCATS" ? `${unit.cost}d` : `${unit.cost}⛭`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono">
                            <span className="text-[#e8d5b0]/25">
                              {unit.stats.movement} · CC{unit.stats.melee} · RG{unit.stats.ranged} · AR{unit.stats.armour}
                            </span>
                          </div>
                          {unit.traits.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {unit.traits.map((t) => (
                                <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-[#2e1b0e] text-[#e8d5b0]/30">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[9px] text-[#4a3728]">
                              {unit.availabilityMax === null
                                ? "Unlimited"
                                : `0–${unit.availabilityMax}`}
                              {count > 0 && ` · ${count} in roster`}
                            </span>
                            {!atMax && !captBlocked && (
                              <span className="text-[10px] text-[#c8a96e]/40 group-hover:text-[#c8a96e] transition-colors">+ Add</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* RIGHT: Roster */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-widest text-[#4a3728] font-mono">
              Your Roster · {roster.length} models
            </h2>
            {roster.length > 0 && (
              <button
                onClick={() => setShowSave(true)}
                disabled={!validation.valid}
                className={`px-4 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider transition-colors ${
                  validation.valid
                    ? "bg-[#c8a96e] text-[#0d0805] hover:bg-[#d4b87a]"
                    : "bg-[#2e1b0e] text-[#4a3728] cursor-not-allowed"
                }`}
              >
                Save Warband
              </button>
            )}
          </div>

          {/* Validation */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div className="mb-3 space-y-1">
              {validation.errors.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-red-400 bg-red-900/10 border border-red-900/30 rounded px-3 py-1.5">
                  <span>✕</span> {e}
                </div>
              ))}
              {validation.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-400 bg-amber-900/10 border border-amber-900/30 rounded px-3 py-1.5">
                  <span>!</span> {w}
                </div>
              ))}
            </div>
          )}

          {roster.length === 0 ? (
            <div className="border border-dashed border-[#2e1b0e] rounded p-8 text-center text-[#4a3728] text-sm">
              <p className="text-2xl mb-2 opacity-30">⚔</p>
              <p>No units mustered yet.</p>
              <p className="text-xs mt-1 opacity-60">Add units from the list on the left.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {roster.map((entry) => (
                <UnitRosterCard
                  key={entry._key}
                  entry={entry}
                  faction={faction}
                  onRemove={removeUnit}
                  onEquipmentChange={updateEquipment}
                  onRename={renameUnit}
                />
              ))}
            </div>
          )}

          {/* Rules reference */}
          <div className="mt-4 p-3 bg-[#1a0f0a] border border-[#2e1b0e] rounded text-xs text-[#4a3728] space-y-1">
            <p>Standard budget: <span className="text-[#e8d5b0]/40">{budgetDucats} ducats + {budgetGlory} glory points</span></p>
            <p>All warbands need exactly 1 Captain (Leader model).</p>
            <p>
              Full rules:{" "}
              <a href={faction.rosterUrl} target="_blank" rel="noopener noreferrer" className="text-[#c8a96e]/50 hover:text-[#c8a96e] transition-colors">
                trench-companion.com →
              </a>
            </p>
          </div>
        </div>
      </div>

      {showSave && (
        <SaveModal
          faction={faction}
          roster={roster}
          validation={validation}
          onClose={() => setShowSave(false)}
          onSaved={(id) => { setShowSave(false); setSavedId(id); }}
        />
      )}
    </div>
  );
}
