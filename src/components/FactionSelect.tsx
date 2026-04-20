"use client";

import { FACTIONS } from "@/lib/factions";

interface FactionSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function FactionSelect({
  name,
  label,
  value,
  onChange,
  required,
}: FactionSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-semibold text-[#c8a96e] uppercase tracking-wider">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="bg-[#1a0f0a] border border-[#4a3728] text-[#e8d5b0] px-3 py-2 rounded focus:outline-none focus:border-[#c8a96e] transition-colors"
      >
        <option value="">— Select Faction —</option>
        <optgroup label="THE FAITHFUL">
          {FACTIONS.filter((f) => f.side === "FAITHFUL").map((f) => (
            <option key={f.name} value={f.name}>
              {f.parent ? `  ↳ ${f.name}` : f.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="THE INFERNAL">
          {FACTIONS.filter((f) => f.side === "INFERNAL").map((f) => (
            <option key={f.name} value={f.name}>
              {f.parent ? `  ↳ ${f.name}` : f.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
