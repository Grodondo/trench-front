export type UnitRole = "CAPTAIN" | "ELITE" | "INFANTRY";

export interface Unit {
  name: string;
  role: UnitRole;
  cost: string;
  traits?: string[];
}

export interface FactionData {
  name: string;
  slug: string;
  side: "FAITHFUL" | "INFERNAL";
  tagline: string;
  description: string;
  imageUrl: string | null;
  accentColor: string;
  units: Unit[];
  subfactions?: string[];
  rosterUrl: string;
}

export const FACTION_DATA: FactionData[] = [
  // ─── FAITHFUL ────────────────────────────────────────────────────────────────
  {
    name: "New Antioch Principality",
    slug: "new-antioch",
    side: "FAITHFUL",
    tagline: "Combined-arms crusader state",
    description:
      "The principal military might of the Faithful. New Antioch fields disciplined professional soldiers backed by engineers, snipers, and mechanized heavy infantry — the closest thing to a conventional army in the endless trench wars.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/New-Antioch-Faction-Image-1.jpg",
    accentColor: "#b8860b",
    units: [
      { name: "Lieutenant", role: "CAPTAIN", cost: "70" },
      { name: "Sniper Priest", role: "ELITE", cost: "50", traits: ["Ranged +2D"] },
      { name: "Trench Cleric", role: "ELITE", cost: "60", traits: ["Negate Fear"] },
      { name: "Combat Engineer", role: "INFANTRY", cost: "80", traits: ["Negate Mined"] },
      { name: "Combat Medic", role: "INFANTRY", cost: "65", traits: ["Negate Fear"] },
      { name: "Mechanized Heavy Infantry", role: "INFANTRY", cost: "85", traits: ["Strong", "Tough"] },
      { name: "Shocktrooper", role: "INFANTRY", cost: "45" },
      { name: "Yeoman", role: "INFANTRY", cost: "30" },
    ],
    subfactions: [
      "Stosstruppen of the Free State of Prussia",
      "Kingdom of Alba Assault Detachment",
      "Expeditionary Forces of Abyssinia",
      "The Red Brigade",
    ],
    rosterUrl: "https://trench-companion.com/compendium/warbands/new-antioch",
  },
  {
    name: "Trench Pilgrims",
    slug: "trench-pilgrims",
    side: "FAITHFUL",
    tagline: "Fanatical martyrs of the faith",
    description:
      "Driven by unshakeable devotion, the Trench Pilgrims march into withering fire with hymns on their lips and death in their eyes. They wield improvised weapons, holy relics, and sheer numbers — spending lives freely in the name of salvation.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/Trench-Pilgrims-Faction-Image.jpg",
    accentColor: "#8b1a1a",
    units: [
      { name: "War Prophet", role: "CAPTAIN", cost: "80", traits: ["Leader"] },
      { name: "Castigator", role: "ELITE", cost: "50" },
      { name: "Communicant", role: "ELITE", cost: "100", traits: ["Strong", "Tough", "Regenerate"] },
      { name: "Anchorite Shrine", role: "INFANTRY", cost: "140", traits: ["Fear", "Tough", "Strong"] },
      { name: "Ecclesiastic Prisoner", role: "INFANTRY", cost: "20" },
      { name: "Stigmatic Nun", role: "INFANTRY", cost: "50", traits: ["Regenerate"] },
      { name: "Trench Pilgrim", role: "INFANTRY", cost: "30" },
    ],
    subfactions: [
      "Procession of the Sacred Affliction",
      "Cavalcade of the Tenth Plague",
      "War Pilgrimage of Saint Methodius",
    ],
    rosterUrl: "https://trench-companion.com/compendium/warbands/trench-pilgrims",
  },
  {
    name: "Iron Sultanate",
    slug: "iron-sultanate",
    side: "FAITHFUL",
    tagline: "Eastern warriors of alchemical war",
    description:
      "Masters of alchemical science and ancient martial tradition, the Iron Sultanate fields Janissary veterans, arcane Brazen Bulls, and deadly assassins. They are the eastern shield of the Faithful, holding the line where the desert meets Hell.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/Iron-Sultanate-Faction-Image-2.jpg",
    accentColor: "#2e7d32",
    units: [
      { name: "Yüzbaşı Captain", role: "CAPTAIN", cost: "70", traits: ["Negate Fear", "Tough"] },
      { name: "Jabirean Alchemist", role: "ELITE", cost: "55" },
      { name: "Sultanate Assassin", role: "ELITE", cost: "85", traits: ["Infiltrator"] },
      { name: "Azeb", role: "INFANTRY", cost: "25" },
      { name: "Brazen Bull", role: "INFANTRY", cost: "100", traits: ["Fear", "Strong", "Tough", "Artificial"] },
      { name: "Janissary", role: "INFANTRY", cost: "55", traits: ["Strong"] },
      { name: "Lion of Jabir", role: "INFANTRY", cost: "60", traits: ["Artificial"] },
      { name: "Sultanate Sapper", role: "INFANTRY", cost: "50", traits: ["Negate Mined"] },
    ],
    subfactions: ["Fidai of Alamut", "House of Wisdom", "Defenders of the Iron Wall"],
    rosterUrl: "https://trench-companion.com/compendium/warbands/iron-sultanate",
  },
  {
    name: "Crusader Knights",
    slug: "crusader-knights",
    side: "FAITHFUL",
    tagline: "Armoured holy warriors of the Church",
    description:
      "The Crusader Knights are an ancient order of warrior-monks, clad in sacred armour and bearing blessed blades. Where others are broken by fear, the Knights advance — for they fear neither death nor damnation.",
    imageUrl: null,
    accentColor: "#c0a060",
    units: [
      { name: "Knight Commander", role: "CAPTAIN", cost: "–" },
      { name: "Knight Sergeant", role: "ELITE", cost: "–" },
      { name: "Man-at-Arms", role: "INFANTRY", cost: "–" },
      { name: "Squire", role: "INFANTRY", cost: "–" },
    ],
    rosterUrl: "https://trench-companion.com/compendium/warbands",
  },
  {
    name: "Synod of Strategic Prophecy",
    slug: "synod",
    side: "FAITHFUL",
    tagline: "Oracular strategists who see beyond the veil",
    description:
      "The Synod combines faith and foresight, deploying prophet-warriors who receive battlefield visions. Their warbands fight with uncanny foreknowledge, outmanoeuvring enemies as if following a script only they can read.",
    imageUrl: null,
    accentColor: "#4a2080",
    units: [
      { name: "Grand Prophet", role: "CAPTAIN", cost: "–" },
      { name: "Seer", role: "ELITE", cost: "–" },
      { name: "Augur", role: "INFANTRY", cost: "–" },
      { name: "Penitent Soldier", role: "INFANTRY", cost: "–" },
    ],
    rosterUrl: "https://trench-companion.com/compendium/warbands",
  },

  // ─── INFERNAL ────────────────────────────────────────────────────────────────
  {
    name: "Heretic Legion",
    slug: "heretic-legion",
    side: "INFERNAL",
    tagline: "Fallen crusaders pledged to Hell",
    description:
      "Once holy warriors, the Heretic Legion are crusaders who turned from the light and pledged their souls to Hell. Twisted by demonic blessing, they combine military discipline with infernal power — brutal shock troops who have faced death so often they no longer fear it.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/07/Heretic-Legion-Faction-Image-1.jpg",
    accentColor: "#8b0000",
    units: [
      { name: "Heretic Priest", role: "CAPTAIN", cost: "80", traits: ["Tough", "Leader"] },
      { name: "Death Commando", role: "ELITE", cost: "90", traits: ["Infiltrator"] },
      { name: "Heretic Chorister", role: "ELITE", cost: "65", traits: ["Fear"] },
      { name: "Anointed Heavy Infantry", role: "INFANTRY", cost: "95", traits: ["Strong", "Negate Heavy"] },
      { name: "Artillery Witch", role: "INFANTRY", cost: "100", traits: ["Negate Gas", "Artificial"] },
      { name: "Heretic Trooper", role: "INFANTRY", cost: "30" },
      { name: "War Wolf Assault Beast", role: "INFANTRY", cost: "145", traits: ["Fear", "Tough", "Artificial"] },
      { name: "Wretched", role: "INFANTRY", cost: "25" },
    ],
    subfactions: ["Heretic Naval Raiders", "Trench Ghosts", "Knights of Avarice"],
    rosterUrl: "https://trench-companion.com/compendium/warbands/heretic-legion",
  },
  {
    name: "Court of the Seven-Headed Serpent",
    slug: "court-of-the-serpent",
    side: "INFERNAL",
    tagline: "Ancient demon princes and their damned thralls",
    description:
      "Noble demons of the highest order, the Court descends upon the trenches to claim souls and revel in carnage. Led by winged Praetors and spell-weaving Sorcerers, they command legions of lesser demons and wretched damned souls through a complex hierarchy of infernal power.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/Court-of-the-seven-headed-serpent-Faction-Image-2.jpg",
    accentColor: "#1a5c2a",
    units: [
      { name: "Praetor", role: "CAPTAIN", cost: "115", traits: ["Flying", "Fear", "Strong", "Tough", "Demonic"] },
      { name: "Sorcerer", role: "CAPTAIN", cost: "75", traits: ["Flying", "Fear", "Demonic"] },
      { name: "Hell Knight", role: "ELITE", cost: "100", traits: ["Strong", "Negate Heavy", "Demonic"] },
      { name: "Hunter of the Left-Hand Path", role: "ELITE", cost: "110", traits: ["Infiltrator", "Demonic"] },
      { name: "Desecrated Saint", role: "INFANTRY", cost: "140", traits: ["Fear", "Strong", "Tough", "Demonic"] },
      { name: "Pit Locust", role: "INFANTRY", cost: "90", traits: ["Flying", "Fear", "Demonic"] },
      { name: "Yoke Fiend", role: "INFANTRY", cost: "30", traits: ["Demonic"] },
      { name: "Wretched", role: "INFANTRY", cost: "20" },
    ],
    rosterUrl: "https://trench-companion.com/compendium/warbands/court-of-the-seven-headed-serpent",
  },
  {
    name: "Cult of the Black Grail",
    slug: "cult-of-the-black-grail",
    side: "INFERNAL",
    tagline: "Plague bearers of Beelzebub",
    description:
      "Servants of Beelzebub, Lord of Flies, the Cult spreads infection and despair across the trench lines. Their warriors are bloated with plague-blessings, immune to pain and disease, and utterly devoted to drowning the world in rot and corruption.",
    imageUrl: null,
    accentColor: "#3d5a00",
    units: [
      { name: "Lord of Tumors", role: "CAPTAIN", cost: "130", traits: ["Fear", "Strong", "Tough", "Negate Gas"] },
      { name: "Plague Knight", role: "CAPTAIN", cost: "60", traits: ["Fear", "Strong", "Negate Gas"] },
      { name: "Corpse Guard", role: "ELITE", cost: "55", traits: ["Fear", "Negate Gas"] },
      { name: "Amalgam", role: "INFANTRY", cost: "140", traits: ["Fear", "Strong", "Tough", "Negate Gas"] },
      { name: "Grail Thrall", role: "INFANTRY", cost: "25", traits: ["Fear", "Negate Gas"] },
      { name: "Fly Thrall", role: "INFANTRY", cost: "25", traits: ["Flying", "Fear", "Negate Gas"] },
      { name: "Herald of Beelzebub", role: "INFANTRY", cost: "50", traits: ["Flying", "Fear", "Skirmisher"] },
      { name: "Hounds of the Black Grail", role: "INFANTRY", cost: "55", traits: ["Fear", "Negate Gas"] },
    ],
    subfactions: ["Dirge of the Great Hegemon", "The Great Hunger"],
    rosterUrl: "https://trench-companion.com/compendium/warbands/cult-of-the-black-grail",
  },
  {
    name: "Path of the Beast",
    slug: "path-of-the-beast",
    side: "INFERNAL",
    tagline: "Savage hunters who embrace the primal darkness",
    description:
      "The Path of the Beast forsakes demonic hierarchy for raw, primal savagery. Its followers transform into terrible beasts, hunting across no-man's-land with feral instinct. Where the other Infernal factions scheme, the Beast simply tears.",
    imageUrl: null,
    accentColor: "#5c3a00",
    units: [
      { name: "Beast Lord", role: "CAPTAIN", cost: "–" },
      { name: "Pack Leader", role: "ELITE", cost: "–" },
      { name: "Spawn of the Beast", role: "INFANTRY", cost: "–" },
      { name: "Feral Thrall", role: "INFANTRY", cost: "–" },
    ],
    rosterUrl: "https://trench-companion.com/compendium/warbands",
  },
];
