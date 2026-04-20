export type FactionSide = "FAITHFUL" | "INFERNAL";

export interface Faction {
  name: string;
  side: FactionSide;
  parent?: string;
}

export const FACTIONS: Faction[] = [
  // FAITHFUL
  { name: "New Antioch Principality", side: "FAITHFUL" },
  { name: "Stosstruppen of the Free State of Prussia", side: "FAITHFUL", parent: "New Antioch Principality" },
  { name: "Kingdom of Alba Assault Detachment", side: "FAITHFUL", parent: "New Antioch Principality" },
  { name: "Expeditionary Forces of Abyssinia", side: "FAITHFUL", parent: "New Antioch Principality" },
  { name: "The Red Brigade", side: "FAITHFUL", parent: "New Antioch Principality" },
  { name: "Trench Pilgrims", side: "FAITHFUL" },
  { name: "Procession of the Sacred Affliction", side: "FAITHFUL", parent: "Trench Pilgrims" },
  { name: "Cavalcade of the Tenth Plague", side: "FAITHFUL", parent: "Trench Pilgrims" },
  { name: "War Pilgrimage of Saint Methodius", side: "FAITHFUL", parent: "Trench Pilgrims" },
  { name: "Iron Sultanate", side: "FAITHFUL" },
  { name: "Crusader Knights", side: "FAITHFUL" },
  { name: "Synod of Strategic Prophecy", side: "FAITHFUL" },

  // INFERNAL
  { name: "Heretic Legion", side: "INFERNAL" },
  { name: "Heretic Naval Raiders", side: "INFERNAL", parent: "Heretic Legion" },
  { name: "Court of the Seven-Headed Serpent", side: "INFERNAL" },
  { name: "Cult of the Black Grail", side: "INFERNAL" },
  { name: "Dirge of the Great Hegemon", side: "INFERNAL", parent: "Cult of the Black Grail" },
  { name: "The Great Hunger", side: "INFERNAL", parent: "Cult of the Black Grail" },
  { name: "Path of the Beast", side: "INFERNAL" },
];

export function getFactionSide(factionName: string): FactionSide | null {
  const faction = FACTIONS.find((f) => f.name === factionName);
  return faction?.side ?? null;
}

export const FAITHFUL_FACTIONS = FACTIONS.filter((f) => f.side === "FAITHFUL");
export const INFERNAL_FACTIONS = FACTIONS.filter((f) => f.side === "INFERNAL");
