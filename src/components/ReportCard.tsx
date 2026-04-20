import { formatCrusadeDate } from "@/lib/utils";

interface ReportCardProps {
  warbandName: string | null;
  playerFaction: string | null;
  opponentFaction: string | null;
  location: string | null;
  outcome: string | null;
  keyMoments: string[] | null;
  generatedNarrative: string | null;
  tone: string | null;
}

function getOutcomeStyle(outcome: string | null) {
  switch (outcome) {
    case "VICTORY":
      return { bg: "bg-[#c8a96e]/20", border: "border-[#c8a96e]", text: "text-[#c8a96e]" };
    case "DEFEAT":
      return { bg: "bg-[#8b0000]/20", border: "border-[#8b0000]", text: "text-[#ff4444]" };
    default:
      return { bg: "bg-[#4a3728]/20", border: "border-[#4a3728]", text: "text-[#e8d5b0]" };
  }
}

function getSideIcon(faction: string | null): string {
  if (!faction) return "⚔";
  // Simple heuristic — could be improved with faction data lookup
  const infernalKeywords = ["Heretic", "Serpent", "Black Grail", "Hunger", "Hegemon", "Beast"];
  const isInfernal = infernalKeywords.some((k) => faction.includes(k));
  return isInfernal ? "🔥" : "⛨";
}

export default function ReportCard({
  warbandName,
  playerFaction,
  opponentFaction,
  location,
  outcome,
  keyMoments,
  generatedNarrative,
}: ReportCardProps) {
  const outcomeStyle = getOutcomeStyle(outcome);

  return (
    <div
      id="report-card"
      className="max-w-2xl mx-auto bg-[#1a0f0a] border border-[#4a3728] rounded-lg overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, #2e1b0e 0%, #1a0f0a 70%)",
      }}
    >
      {/* Header stripe */}
      <div className="bg-[#2e1b0e] border-b border-[#4a3728] px-6 py-4">
        <div className="text-center">
          <p className="text-[10px] text-[#4a3728] uppercase tracking-[0.3em] mb-1">
            ╍╍╍ WAR DISPATCH ╍╍╍
          </p>
          <p className="text-xs text-[#c8a96e]/60 font-mono">
            {formatCrusadeDate()}
          </p>
        </div>
      </div>

      {/* Factions bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#4a3728]/50">
        <div className="text-left">
          <span className="text-lg mr-2">{getSideIcon(playerFaction)}</span>
          <span className="text-sm text-[#c8a96e] font-semibold">{playerFaction || "Unknown"}</span>
        </div>
        <span className="text-[#4a3728] text-xs font-bold tracking-widest">VS</span>
        <div className="text-right">
          <span className="text-sm text-[#c8a96e] font-semibold">{opponentFaction || "Unknown"}</span>
          <span className="text-lg ml-2">{getSideIcon(opponentFaction)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Warband + Location */}
        {(warbandName || location) && (
          <div className="text-center space-y-1">
            {warbandName && (
              <p className="text-lg text-[#c8a96e] font-bold font-serif">{warbandName}</p>
            )}
            {location && (
              <p className="text-xs text-[#4a3728] uppercase tracking-wider">
                Engagement at {location}
              </p>
            )}
          </div>
        )}

        {/* Narrative */}
        {generatedNarrative && (
          <blockquote className="text-[#e8d5b0]/90 text-sm leading-relaxed italic border-l-2 border-[#4a3728] pl-4">
            {generatedNarrative.split("\n\n").map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-3 not-italic text-[#c8a96e]/70 text-xs" : ""}>
                {paragraph}
              </p>
            ))}
          </blockquote>
        )}

        {/* Key Moments */}
        {keyMoments && keyMoments.length > 0 && (
          <div className="space-y-1 pt-2">
            <p className="text-[10px] text-[#4a3728] uppercase tracking-wider">Field Notes</p>
            {keyMoments.map((moment, i) => (
              <p key={i} className="text-xs text-[#e8d5b0]/70 pl-3 border-l border-[#4a3728]/50">
                — {moment}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Outcome footer */}
      <div className={`${outcomeStyle.bg} border-t ${outcomeStyle.border} px-6 py-3 text-center`}>
        <span className={`${outcomeStyle.text} font-bold text-lg uppercase tracking-[0.4em]`}>
          {outcome || "UNKNOWN"}
        </span>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-2 text-center">
        <p className="text-[8px] text-[#4a3728]/60">
          TRENCH FRONT — Unofficial fan tool. Trench Crusade is property of its creators.
        </p>
      </div>
    </div>
  );
}
