interface TemplateVars {
  warband: string;
  opponent: string;
  location: string;
  keyMoments?: string[];
}

const victoryTemplates = [
  (v: TemplateVars) =>
    `Under a choking sky, ${v.warband} drove ${v.opponent} from ${v.location}. Faith and iron held where lesser men had broken. The dead were counted, the line advanced, and the war ground forward another bloody yard.`,
  (v: TemplateVars) =>
    `The assault on ${v.location} was swift and merciless. ${v.warband} breached the enemy line at dawn. ${v.opponent} broke before noon. By dusk, only the crows remained to dispute the ground.`,
  (v: TemplateVars) =>
    `${v.location} belongs to ${v.warband} — purchased at the cost of blood and prayer. ${v.opponent} retreated through the wire, leaving their dead in the mud. Victory tastes of ash, but it is victory nonetheless.`,
];

const defeatTemplates = [
  (v: TemplateVars) =>
    `The advance faltered at ${v.location}. ${v.opponent} poured through the gap like a black tide. The survivors of ${v.warband} retreated through mud and wire, counting the dead and cursing the silence of heaven.`,
  (v: TemplateVars) =>
    `${v.location} was lost. ${v.warband} held for three hours against ${v.opponent} before the order came to fall back. The trenches were swallowed. The ground remembers nothing.`,
  (v: TemplateVars) =>
    `There is no glory in this dispatch. ${v.warband} was driven from ${v.location} by ${v.opponent}. The wounded were carried out under fire. The dead were left behind. The war continues.`,
];

const drawTemplates = [
  (v: TemplateVars) =>
    `Neither side claimed ${v.location} when the guns fell silent. Both ${v.warband} and ${v.opponent} bled freely. The trenches hold. The stalemate endures. God watches and says nothing.`,
  (v: TemplateVars) =>
    `The engagement at ${v.location} ended as it began — in blood and confusion. ${v.warband} and ${v.opponent} fought to mutual exhaustion. The line did not move. The war did not care.`,
  (v: TemplateVars) =>
    `Smoke still rises from ${v.location}. ${v.warband} and ${v.opponent} traded ground until neither could stand. The sector remains contested. Tomorrow will bring more of the same.`,
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateNarrative(
  outcome: string,
  warbandName: string | null,
  opponentFaction: string,
  location: string,
  keyMoments?: string[],
  tone?: string
): string {
  const vars: TemplateVars = {
    warband: warbandName || "The warband",
    opponent: opponentFaction,
    location: location || "the front",
    keyMoments,
  };

  let narrative: string;

  switch (outcome) {
    case "VICTORY":
      narrative = pickRandom(victoryTemplates)(vars);
      break;
    case "DEFEAT":
      narrative = pickRandom(defeatTemplates)(vars);
      break;
    default:
      narrative = pickRandom(drawTemplates)(vars);
  }

  if (keyMoments && keyMoments.length > 0) {
    narrative += "\n\nNotable moments: " + keyMoments.join(". ") + ".";
  }

  if (tone === "PYRRHIC" && outcome === "VICTORY") {
    narrative += " But the cost — the cost was too great to call this a triumph.";
  }

  return narrative;
}
