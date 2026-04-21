// ─── Types ────────────────────────────────────────────────────────────────────

export type UnitRole = "CAPTAIN" | "ELITE" | "INFANTRY" | "MERCENARY";
export type CurrencyType = "DUCATS" | "GLORY";
export type EquipmentCategory =
  | "MELEE"
  | "RANGED"
  | "GRENADE"
  | "ARMOUR"
  | "SHIELD"
  | "EQUIPMENT";

export interface UnitStats {
  movement: string;
  melee: string;
  ranged: string;
  armour: string;
}

export interface UnitTemplate {
  id: string;
  name: string;
  role: UnitRole;
  cost: number;
  costType: CurrencyType;
  /** null = unlimited */
  availabilityMax: number | null;
  stats: UnitStats;
  traits: string[];
  keywords: string[];
  imageHint?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  cost: number;
  costType: CurrencyType;
  /** Max copies across the whole warband (null = unlimited) */
  warbandLimit: number | null;
  /** Only units with ELITE keyword may take this */
  eliteOnly?: boolean;
  /** Only specific unit IDs may take this */
  allowedUnitIds?: string[];
  /** Elite units are also allowed even when allowedUnitIds is set */
  allowedForElite?: boolean;
  /** Item occupies the Headgear slot (max 1 per model) */
  headgear?: boolean;
  /** Notes displayed in UI */
  note?: string;
}

export interface SubfactionData {
  id: string;
  name: string;
  slug: string;
}

export interface FactionData {
  id: string;
  name: string;
  slug: string;
  side: "FAITHFUL" | "INFERNAL";
  tagline: string;
  description: string;
  imageUrl: string | null;
  accentColor: string;
  units: UnitTemplate[];
  armoury: EquipmentItem[];
  subfactions?: SubfactionData[];
  rosterUrl: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function d(id: string, name: string, cat: EquipmentCategory, cost: number, warbandLimit: number | null = null, opts?: Partial<EquipmentItem>): EquipmentItem {
  return { id, name, category: cat, cost, costType: "DUCATS", warbandLimit, ...opts };
}
function g(id: string, name: string, cat: EquipmentCategory, cost: number, warbandLimit: number | null = null, opts?: Partial<EquipmentItem>): EquipmentItem {
  return { id, name, category: cat, cost, costType: "GLORY", warbandLimit, ...opts };
}

// ─── Shared / Common Equipment ────────────────────────────────────────────────

/** Common melee weapons available to most factions */
const commonMelee: EquipmentItem[] = [
  d("trench-knife", "Trench Knife", "MELEE", 1),
  d("trench-club", "Trench Club", "MELEE", 3),
  d("sword-axe", "Sword / Axe", "MELEE", 4),
  d("trench-polearm", "Trench Polearm", "MELEE", 7),
  d("great-hammer", "Great Hammer / Maul", "MELEE", 10),
  d("greatsword", "Greatsword / Greataxe", "MELEE", 12),
];

const bayonet = d("bayonet", "Bayonet", "MELEE", 2, null, { note: "BAYONET LUG weapons only" });

/** Common ranged weapons available to most factions */
const commonRangedBasic: EquipmentItem[] = [
  d("pistol", "Pistol / Revolver", "RANGED", 6),
  d("musket", "Musket", "RANGED", 5),
  d("shotgun", "Shotgun", "RANGED", 10),
  d("bolt-action-rifle", "Bolt-Action Rifle", "RANGED", 10),
  d("semi-auto-rifle", "Semi-Automatic Rifle", "RANGED", 15),
  d("auto-shotgun", "Automatic Shotgun", "RANGED", 15),
  d("flamethrower", "Flamethrower", "RANGED", 30, 3),
  d("grenade-launcher", "Grenade Launcher", "RANGED", 30, 2),
  d("machine-gun", "Machine Gun", "RANGED", 50, 1),
  d("heavy-flamethrower", "Heavy Flamethrower", "RANGED", 55, 2),
];

/** Common grenades */
const commonGrenades: EquipmentItem[] = [
  d("frag-grenades", "Frag Grenades", "GRENADE", 7),
  d("incendiary-grenades", "Incendiary Grenades", "GRENADE", 15),
  d("gas-grenades", "Gas Grenades", "GRENADE", 10),
];

/** Common armour */
const commonArmour: EquipmentItem[] = [
  d("standard-armour", "Standard Armour", "ARMOUR", 15),
  d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { eliteOnly: true }),
];

/** Common equipment */
const commonEquipment: EquipmentItem[] = [
  d("combat-helmet", "Combat Helmet", "EQUIPMENT", 5),
  d("gas-mask", "Gas Mask", "EQUIPMENT", 5),
  d("medi-kit", "Medi-Kit", "EQUIPMENT", 5),
  d("shovel", "Shovel", "EQUIPMENT", 5),
  d("mountaineer-kit", "Mountaineer Kit", "EQUIPMENT", 3, 2),
  d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
  g("troop-flag", "Troop Flag", "EQUIPMENT", 1, 1),
];

const trenchShield = d("trench-shield", "Trench Shield", "SHIELD", 10);

const commonGloryEquipment: EquipmentItem[] = [
  g("rocket-propelled-grenade", "Rocket-Propelled Grenade", "GRENADE", 2, 1),
  g("sniper-scope", "Sniper Scope", "EQUIPMENT", 2, 2, { note: "Rifle only" }),
  g("knighthood", "Knighthood", "EQUIPMENT", 4, 1, { eliteOnly: true }),
  g("trench-dog", "Trench Dog Ownership", "EQUIPMENT", 1, 1),
  g("field-hospital", "Field Hospital", "EQUIPMENT", 10, 1),
];

// ─── Factions ─────────────────────────────────────────────────────────────────

export const GAME_FACTIONS: FactionData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FAITHFUL
  // ═══════════════════════════════════════════════════════════════════════════

  // ── New Antioch ──────────────────────────────────────────────────────────
  {
    id: "new-antioch",
    name: "The Principality of New Antioch",
    slug: "new-antioch",
    side: "FAITHFUL",
    tagline: "Combined-arms crusader state",
    description:
      "The principal military might of the Faithful. New Antioch fields disciplined professional soldiers backed by engineers, snipers, and mechanized heavy infantry — the closest thing to a conventional army in the endless trench wars.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/New-Antioch-Faction-Image-1.jpg",
    accentColor: "#b8860b",
    rosterUrl: "https://trench-companion.com/compendium/warbands/new-antioch",
    subfactions: [
      { id: "stosstruppen", name: "Stoßtruppen of the Free State of Prussia", slug: "stosstruppen-of-the-free-state-of-prussia" },
      { id: "alba", name: "Kingdom of Alba Assault Detachment", slug: "kingdom-of-alba-assault-detatchment" },
      { id: "abyssinia", name: "Expeditionary Forces of Abyssinia", slug: "expeditionary-forces-of-abyssinia" },
      { id: "red-brigade", name: "The Red Brigade", slug: "the-red-brigade" },
      { id: "papal-states", name: "Papal States Intervention Force", slug: "papal-states-intervention-force" },
      { id: "eire-rangers", name: "Eire Rangers", slug: "eire-rangers" },
    ],
    units: [
      {
        id: "na-lieutenant",
        name: "Lieutenant",
        role: "CAPTAIN",
        cost: 70, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "+2D", armour: "0" },
        traits: ["Leader", "Tough"],
        keywords: ["ELITE", "NEW ANTIOCH", "CAPTAIN"],
      },
      {
        id: "na-sniper-priest",
        name: "Sniper Priest",
        role: "ELITE",
        cost: 50, costType: "DUCATS",
        availabilityMax: 2,
        stats: { movement: '6"/Infantry', melee: "-1D", ranged: "+2D", armour: "0" },
        traits: [],
        keywords: ["ELITE", "NEW ANTIOCH"],
      },
      {
        id: "na-trench-cleric",
        name: "Trench Cleric",
        role: "ELITE",
        cost: 60, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "+1D", armour: "0" },
        traits: ["Negate Fear"],
        keywords: ["ELITE", "NEW ANTIOCH"],
      },
      {
        id: "na-combat-engineer",
        name: "Combat Engineer",
        role: "INFANTRY",
        cost: 80, costType: "DUCATS",
        availabilityMax: 2,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "0D", armour: "-2" },
        traits: ["Negate Mined"],
        keywords: ["NEW ANTIOCH"],
      },
      {
        id: "na-combat-medic",
        name: "Combat Medic",
        role: "INFANTRY",
        cost: 65, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "0D", armour: "-1" },
        traits: ["Negate Fear"],
        keywords: ["NEW ANTIOCH"],
      },
      {
        id: "na-mech-heavy",
        name: "Mechanized Heavy Infantry",
        role: "INFANTRY",
        cost: 85, costType: "DUCATS",
        availabilityMax: 3,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "+1D", armour: "-2" },
        traits: ["Strong", "Negate Heavy"],
        keywords: ["NEW ANTIOCH"],
      },
      {
        id: "na-shocktrooper",
        name: "Shocktrooper",
        role: "INFANTRY",
        cost: 45, costType: "DUCATS",
        availabilityMax: 5,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "0D", armour: "0" },
        traits: [],
        keywords: ["NEW ANTIOCH"],
      },
      {
        id: "na-yeoman",
        name: "Yeoman",
        role: "INFANTRY",
        cost: 30, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "0D", armour: "0" },
        traits: [],
        keywords: ["NEW ANTIOCH"],
      },
    ],
    armoury: [
      bayonet,
      ...commonMelee,
      d("na-auto-pistol", "Automatic Pistol", "RANGED", 20, 3, { eliteOnly: true }),
      d("na-auto-rifle", "Automatic Rifle", "RANGED", 40, 1),
      ...commonRangedBasic.filter(e => !["musket", "machine-gun", "heavy-flamethrower", "auto-shotgun"].includes(e.id)),
      d("auto-shotgun", "Automatic Shotgun", "RANGED", 15, 2),
      d("machine-gun", "Machine Gun", "RANGED", 50, 2),
      d("heavy-flamethrower", "Heavy Flamethrower", "RANGED", 55, 1),
      d("na-heavy-shotgun", "Heavy Shotgun", "RANGED", 20, 2),
      d("na-sniper-rifle", "Sniper Rifle", "RANGED", 35, 3),
      d("na-submachine-gun", "Submachine Gun", "RANGED", 30, 2),
      d("frag-grenades", "Frag Grenades", "GRENADE", 7),
      d("incendiary-grenades", "Incendiary Grenades", "GRENADE", 15, 2),
      d("na-satchel-charge", "Satchel Charge", "GRENADE", 15, 3),
      d("na-machine-armour", "Machine Armour", "ARMOUR", 50, 1, { eliteOnly: true }),
      d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { allowedUnitIds: ["na-mech-heavy"], allowedForElite: true, note: "Mechanized Heavy Infantry or Elite only" }),
      d("standard-armour", "Standard Armour", "ARMOUR", 15),
      d("na-heavy-ballistic-shield", "Heavy Ballistic Shield", "SHIELD", 15, null, { note: "Machine Armour only" }),
      trenchShield,
      d("binoculars", "Binoculars", "EQUIPMENT", 10, null, { eliteOnly: true }),
      d("combat-helmet", "Combat Helmet", "EQUIPMENT", 5, null, { headgear: true }),
      g("na-field-shrine", "Field Shrine", "EQUIPMENT", 2, 1),
      d("gas-mask", "Gas Mask", "EQUIPMENT", 5, null, { headgear: true }),
      g("na-martyrdom-pills", "Martyrdom Pills", "EQUIPMENT", 1, 2, { eliteOnly: true }),
      d("medi-kit", "Medi-Kit", "EQUIPMENT", 5),
      d("mountaineer-kit", "Mountaineer Kit", "EQUIPMENT", 3, 4),
      d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
      d("shovel", "Shovel", "EQUIPMENT", 5),
      ...commonGloryEquipment,
      g("na-book-of-battle-prayers", "Book of Battle Prayers", "EQUIPMENT", 7, 1, { eliteOnly: true }),
      g("na-great-banner", "Great Banner of New Antioch", "EQUIPMENT", 12, 1),
      g("na-resurrection-engine", "Resurrection Engine", "EQUIPMENT", 11, 1),
      g("na-smokescreen", "Smokescreen", "EQUIPMENT", 5, 1),
      g("na-salvage-golem", "Salvage Golem", "EQUIPMENT", 4, 1),
    ],
  },

  // ── Trench Pilgrims ──────────────────────────────────────────────────────
  {
    id: "trench-pilgrims",
    name: "Trench Pilgrims",
    slug: "trench-pilgrims",
    side: "FAITHFUL",
    tagline: "Fanatical martyrs of the faith",
    description:
      "Driven by unshakeable devotion, the Trench Pilgrims march into withering fire with hymns on their lips and death in their eyes. They wield improvised weapons, holy relics, and sheer numbers — spending lives freely in the name of salvation.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/Trench-Pilgrims-Faction-Image.jpg",
    accentColor: "#8b1a1a",
    rosterUrl: "https://trench-companion.com/compendium/warbands/trench-pilgrims",
    subfactions: [
      { id: "sacred-affliction", name: "Procession of the Sacred Affliction", slug: "procession-of-the-sacred-affliction" },
      { id: "tenth-plague", name: "Cavalcade of the Tenth Plague", slug: "cavalcade-of-the-tenth-plague" },
      { id: "saint-methodius", name: "War Pilgrimage of Saint Methodius", slug: "war-pilgrimage-of-saint-methodius" },
    ],
    units: [
      {
        id: "tp-war-prophet",
        name: "War Prophet",
        role: "CAPTAIN",
        cost: 80, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "+2D", armour: "0" },
        traits: ["Leader"],
        keywords: ["ELITE", "PILGRIM", "CAPTAIN"],
      },
      {
        id: "tp-castigator",
        name: "Castigator",
        role: "ELITE",
        cost: 50, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "+1D", armour: "0" },
        traits: [],
        keywords: ["ELITE", "PILGRIM"],
      },
      {
        id: "tp-communicant",
        name: "Communicant",
        role: "ELITE",
        cost: 100, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "-3D", armour: "0" },
        traits: ["Regenerate 1", "Strong", "Negate Heavy", "Tough"],
        keywords: ["ELITE", "PILGRIM"],
      },
      {
        id: "tp-anchorite-shrine",
        name: "Anchorite Shrine",
        role: "INFANTRY",
        cost: 140, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "0D", armour: "-3" },
        traits: ["Negate Shrapnel", "Fear", "Strong", "Negate Heavy", "Tough"],
        keywords: ["PILGRIM"],
      },
      {
        id: "tp-ecclesiastic-prisoner",
        name: "Ecclesiastic Prisoner",
        role: "INFANTRY",
        cost: 20, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "-1D", ranged: "0D", armour: "0" },
        traits: [],
        keywords: ["PILGRIM"],
      },
      {
        id: "tp-stigmatic-nun",
        name: "Stigmatic Nun",
        role: "INFANTRY",
        cost: 50, costType: "DUCATS",
        availabilityMax: 4,
        stats: { movement: '8"/Infantry', melee: "+1D", ranged: "+1D", armour: "0" },
        traits: ["Regenerate 1"],
        keywords: ["PILGRIM"],
      },
      {
        id: "tp-trench-pilgrim",
        name: "Trench Pilgrim",
        role: "INFANTRY",
        cost: 30, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "0D", armour: "0" },
        traits: [],
        keywords: ["PILGRIM"],
      },
    ],
    armoury: [
      bayonet,
      d("tp-anti-tank-hammer", "Anti-Tank Hammer", "MELEE", 35, 3, { eliteOnly: true }),
      ...commonMelee,
      d("tp-flail-scourge", "Flail / Scourge", "MELEE", 5),
      d("tp-misericordia", "Misericordia", "MELEE", 15, 1),
      d("tp-auto-pistol", "Automatic Pistol", "RANGED", 20, 2),
      d("tp-blunderbuss", "Blunderbuss", "RANGED", 5),
      d("bolt-action-rifle", "Bolt-Action Rifle", "RANGED", 10),
      d("flamethrower", "Flamethrower", "RANGED", 30, 2),
      g("tp-machine-gun", "Machine Gun", "RANGED", 2, null),
      d("musket", "Musket", "RANGED", 5),
      d("pistol", "Pistol / Revolver", "RANGED", 6),
      d("tp-punt-gun", "Punt Gun", "RANGED", 20, 2),
      d("semi-auto-rifle", "Semi-Automatic Rifle", "RANGED", 15),
      d("shotgun", "Shotgun", "RANGED", 10),
      g("tp-sniper-rifle", "Sniper Rifle", "RANGED", 2, null),
      g("tp-submachine-gun", "Submachine Gun", "RANGED", 2, null),
      d("incendiary-grenades", "Incendiary Grenades", "GRENADE", 15),
      d("tp-molotov", "Molotov Cocktail", "GRENADE", 5),
      d("tp-war-cross", "War-Cross", "GRENADE", 5),
      d("standard-armour", "Standard Armour", "ARMOUR", 15),
      d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { eliteOnly: true }),
      g("tp-holy-icon-shield", "Holy Icon Shield", "SHIELD", 2, null, { eliteOnly: true }),
      trenchShield,
      d("tp-blessed-icon", "Blessed Icon", "EQUIPMENT", 15),
      g("tp-field-shrine", "Field Shrine", "EQUIPMENT", 2),
      d("gas-mask", "Gas Mask", "EQUIPMENT", 5, null, { headgear: true }),
      g("tp-holy-relic", "Holy Relic", "EQUIPMENT", 2, null, { eliteOnly: true }),
      d("tp-incendiary-ammo", "Incendiary Ammunition", "EQUIPMENT", 15, 1),
      d("tp-iron-capirote", "Iron Capirote", "EQUIPMENT", 7, null, { headgear: true }),
      d("tp-martyrdom-device", "Martyrdom Device", "EQUIPMENT", 35, 4, { allowedUnitIds: ["tp-ecclesiastic-prisoner"] }),
      d("tp-martyrdom-pills", "Martyrdom Pills", "EQUIPMENT", 20, 3),
      d("medi-kit", "Medi-Kit", "EQUIPMENT", 5),
      d("mountaineer-kit", "Mountaineer Kit", "EQUIPMENT", 3, 1),
      d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
      g("troop-flag", "Troop Flag", "EQUIPMENT", 1, 1),
      g("tp-holy-grenade", "Holy Grenade", "EQUIPMENT", 2, 3),
      g("tp-horn-of-joshua", "Horn of Joshua", "EQUIPMENT", 9, 1),
      g("rocket-propelled-grenade", "Rocket-Propelled Grenade", "GRENADE", 2, 1),
      g("trench-dog", "Trench Dog Ownership", "EQUIPMENT", 1, 1),
    ],
  },

  // ── Iron Sultanate ───────────────────────────────────────────────────────
  {
    id: "iron-sultanate",
    name: "Iron Sultanate",
    slug: "iron-sultanate",
    side: "FAITHFUL",
    tagline: "Eastern warriors of alchemical war",
    description:
      "Masters of alchemical science and ancient martial tradition, the Iron Sultanate fields Janissary veterans, arcane Brazen Bulls, and deadly assassins. They are the eastern shield of the Faithful, holding the line where the desert meets Hell.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/Iron-Sultanate-Faction-Image-2.jpg",
    accentColor: "#2e7d32",
    rosterUrl: "https://trench-companion.com/compendium/warbands/iron-sultanate",
    subfactions: [
      { id: "fidai-alamut", name: "Fidai of Alamut — The Cabal of Assassins", slug: "fidai-of-alamut-the-cabal-of-assassins" },
      { id: "house-of-wisdom", name: "House of Wisdom", slug: "house-of-wisdom" },
      { id: "defenders-iron-wall", name: "Defenders of the Iron Wall", slug: "defenders-of-the-iron-wall" },
    ],
    units: [
      {
        id: "is-captain",
        name: "Yüzbaşı Captain",
        role: "CAPTAIN",
        cost: 70, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "+2D", armour: "0" },
        traits: ["Negate Fear", "Tough", "Leader"],
        keywords: ["ELITE", "SULTANATE", "CAPTAIN"],
      },
      {
        id: "is-alchemist",
        name: "Jabirean Alchemist",
        role: "ELITE",
        cost: 55, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "+2D", armour: "0" },
        traits: [],
        keywords: ["ELITE", "SULTANATE"],
      },
      {
        id: "is-assassin",
        name: "Sultanate Assassin",
        role: "ELITE",
        cost: 85, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "+1D", armour: "0" },
        traits: ["Infiltrator"],
        keywords: ["ELITE", "SULTANATE"],
      },
      {
        id: "is-azeb",
        name: "Azeb",
        role: "INFANTRY",
        cost: 25, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "-1D", ranged: "0D", armour: "0" },
        traits: [],
        keywords: ["SULTANATE"],
      },
      {
        id: "is-brazen-bull",
        name: "Brazen Bull",
        role: "INFANTRY",
        cost: 100, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "0D", armour: "0" },
        traits: ["Fear", "Strong", "Negate Heavy", "Tough", "Artificial"],
        keywords: ["SULTANATE", "ARTIFICIAL"],
      },
      {
        id: "is-janissary",
        name: "Janissary",
        role: "INFANTRY",
        cost: 55, costType: "DUCATS",
        availabilityMax: 6,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "+1D", armour: "0" },
        traits: ["Strong", "Negate Heavy"],
        keywords: ["SULTANATE"],
      },
      {
        id: "is-lion-of-jabir",
        name: "Lion of Jabir",
        role: "INFANTRY",
        cost: 60, costType: "DUCATS",
        availabilityMax: 2,
        stats: { movement: '8"/Infantry', melee: "+1D", ranged: "0D", armour: "0" },
        traits: ["Artificial"],
        keywords: ["SULTANATE", "ARTIFICIAL"],
      },
      {
        id: "is-sapper",
        name: "Sultanate Sapper",
        role: "INFANTRY",
        cost: 50, costType: "DUCATS",
        availabilityMax: 2,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "+1D", armour: "0" },
        traits: ["Negate Mined"],
        keywords: ["SULTANATE"],
      },
    ],
    armoury: [
      d("is-assassins-dagger", "Assassin's Dagger", "MELEE", 15, null, { allowedUnitIds: ["is-assassin"] }),
      bayonet,
      ...commonMelee,
      d("is-halberd-gun", "Halberd-Gun", "MELEE", 20, null, { eliteOnly: true }),
      d("is-titan-zulfiqar", "Titan Zulfiqar", "MELEE", 30, null, { allowedUnitIds: ["is-brazen-bull"] }),
      d("is-alaybozan", "Alaybozan", "RANGED", 9, null, { allowedUnitIds: ["is-sapper"] }),
      d("is-flame-cannon", "Flame Cannon", "RANGED", 60, 1, { allowedUnitIds: ["is-brazen-bull"] }),
      d("flamethrower", "Flamethrower", "RANGED", 30, 3),
      d("is-jezzail", "Jezzail", "RANGED", 7),
      d("is-murad-bombard", "MURAD Bombard", "RANGED", 50, 1, { allowedUnitIds: ["is-brazen-bull"] }),
      d("machine-gun", "Machine Gun", "RANGED", 50, 1),
      d("musket", "Musket", "RANGED", 5),
      d("pistol", "Pistol / Revolver", "RANGED", 6),
      d("shotgun", "Shotgun", "RANGED", 10),
      d("is-siege-jezzail", "Siege Jezzail", "RANGED", 30),
      d("is-sniper-rifle", "Sniper Rifle", "RANGED", 35, 2, { allowedUnitIds: ["is-janissary"], allowedForElite: true, note: "Janissary or Elite only" }),
      d("frag-grenades", "Frag Grenades", "GRENADE", 7),
      d("is-incendiary-grenades", "Incendiary Grenades", "GRENADE", 15, null, { allowedUnitIds: ["is-alchemist"] }),
      d("is-alchemist-armour", "Alchemist Armour", "ARMOUR", 50, 1, { eliteOnly: true }),
      d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { allowedUnitIds: ["is-janissary"], allowedForElite: true, note: "Janissary or Elite only" }),
      d("standard-armour", "Standard Armour", "ARMOUR", 15),
      trenchShield,
      d("is-alchemical-ammo", "Alchemical Ammunition", "EQUIPMENT", 3),
      d("binoculars", "Binoculars", "EQUIPMENT", 10, null, { eliteOnly: true }),
      d("is-cloak-of-alamut", "Cloak of Alamut", "EQUIPMENT", 25, 1, { eliteOnly: true }),
      d("combat-helmet", "Combat Helmet", "EQUIPMENT", 5, null, { headgear: true }),
      d("gas-mask", "Gas Mask", "EQUIPMENT", 5, null, { headgear: true }),
      g("is-holy-relic", "Holy Relic", "EQUIPMENT", 2, null, { eliteOnly: true }),
      d("is-marid-shovel", "Marid Shovel", "EQUIPMENT", 15, null, { allowedUnitIds: ["is-brazen-bull"] }),
      d("medi-kit", "Medi-Kit", "EQUIPMENT", 5),
      d("mountaineer-kit", "Mountaineer Kit", "EQUIPMENT", 3, 2),
      d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
      d("shovel", "Shovel", "EQUIPMENT", 5),
      g("is-takwin-anqa", "Takwin Anqa Bird", "EQUIPMENT", 2, 1, { eliteOnly: true }),
      d("is-wind-amulet", "Wind Amulet", "EQUIPMENT", 10, 2),
      ...commonGloryEquipment,
      g("is-kilij", "Kilij", "MELEE", 2, 2, { eliteOnly: true }),
      g("is-masterworks-jezzail", "Masterworks Jezzail", "RANGED", 4, 1, { eliteOnly: true }),
      g("is-mobile-grand-cannon", "Mobile Sultanate Grand Cannon", "RANGED", 10, 1, { allowedUnitIds: ["is-brazen-bull"] }),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INFERNAL
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Heretic Legion ────────────────────────────────────────────────────────
  {
    id: "heretic-legion",
    name: "Heretic Legion",
    slug: "heretic-legion",
    side: "INFERNAL",
    tagline: "Fallen crusaders pledged to Hell",
    description:
      "Once holy warriors, the Heretic Legion are crusaders who turned from the light and pledged their souls to Hell. Twisted by demonic blessing, they combine military discipline with infernal power — brutal shock troops who have faced death so often they no longer fear it.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/07/Heretic-Legion-Faction-Image-1.jpg",
    accentColor: "#8b0000",
    rosterUrl: "https://trench-companion.com/compendium/warbands/heretic-legion",
    subfactions: [
      { id: "naval-raiders", name: "Heretic Naval Raiders", slug: "heretic-naval-raiders" },
      { id: "trench-ghosts", name: "Trench Ghosts", slug: "trench-ghosts" },
      { id: "knights-avarice", name: "Knights of Avarice", slug: "knights-of-avarice" },
    ],
    units: [
      {
        id: "hl-heretic-priest",
        name: "Heretic Priest",
        role: "CAPTAIN",
        cost: 80, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "+2D", armour: "0" },
        traits: ["Tough", "Leader"],
        keywords: ["ELITE", "HERETIC", "CAPTAIN"],
      },
      {
        id: "hl-death-commando",
        name: "Death Commando",
        role: "ELITE",
        cost: 90, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "+1D", armour: "0" },
        traits: ["Infiltrator"],
        keywords: ["ELITE", "HERETIC"],
      },
      {
        id: "hl-heretic-chorister",
        name: "Heretic Chorister",
        role: "ELITE",
        cost: 65, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "-2D", armour: "0" },
        traits: ["Fear"],
        keywords: ["ELITE", "HERETIC"],
      },
      {
        id: "hl-anointed-heavy",
        name: "Anointed Heavy Infantry",
        role: "INFANTRY",
        cost: 95, costType: "DUCATS",
        availabilityMax: 5,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "+1D", armour: "-2" },
        traits: ["Strong", "Negate Heavy"],
        keywords: ["HERETIC"],
      },
      {
        id: "hl-artillery-witch",
        name: "Artillery Witch",
        role: "INFANTRY",
        cost: 100, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "-1D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Negate Fear", "Artificial"],
        keywords: ["HERETIC", "ARTIFICIAL"],
      },
      {
        id: "hl-heretic-trooper",
        name: "Heretic Trooper",
        role: "INFANTRY",
        cost: 30, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "0D", armour: "0" },
        traits: [],
        keywords: ["HERETIC"],
      },
      {
        id: "hl-war-wolf",
        name: "War Wolf Assault Beast",
        role: "INFANTRY",
        cost: 145, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '8"/Infantry', melee: "+2D", ranged: "0D", armour: "-3" },
        traits: ["Fear", "Tough", "Artificial", "Negate Difficult Terrain"],
        keywords: ["HERETIC", "ARTIFICIAL"],
      },
      {
        id: "hl-wretched",
        name: "Wretched",
        role: "INFANTRY",
        cost: 25, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "-1D", ranged: "-1D", armour: "0" },
        traits: [],
        keywords: ["HERETIC"],
      },
    ],
    armoury: [
      bayonet,
      ...commonMelee,
      g("hl-hellblade", "Hellblade", "MELEE", 1, 2),
      d("hl-tartarus-claws", "Tartarus Claws", "MELEE", 15, null, { allowedUnitIds: ["hl-death-commando"] }),
      d("hl-sacrificial-blade", "Sacrificial Blade", "MELEE", 23, 2, { eliteOnly: true }),
      g("hl-blasphemous-staff", "Blasphemous Staff", "MELEE", 2, null, { eliteOnly: true }),
      ...commonRangedBasic.filter(e => !["musket"].includes(e.id)),
      g("hl-auto-rifle", "Automatic Rifle", "RANGED", 2, 2),
      g("hl-anti-materiel-rifle", "Anti-Materiel Rifle", "RANGED", 3, 1),
      d("hl-silenced-pistol", "Silenced Pistol", "RANGED", 15, null, { eliteOnly: true }),
      g("hl-submachine-gun", "Submachine Gun", "RANGED", 2, null),
      ...commonGrenades,
      ...commonArmour.filter(e => e.id !== "reinforced-armour"),
      d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { allowedUnitIds: ["hl-anointed-heavy"], allowedForElite: true, note: "Anointed Heavy Infantry or Elite only" }),
      trenchShield,
      d("combat-helmet", "Combat Helmet", "EQUIPMENT", 5, null, { headgear: true }),
      d("gas-mask", "Gas Mask", "EQUIPMENT", 5, null, { headgear: true }),
      d("hl-hellbound-contract", "Hellbound Soul Contract", "EQUIPMENT", 5, 3, { allowedUnitIds: ["hl-heretic-trooper"] }),
      d("hl-incendiary-ammo", "Incendiary Ammunition", "EQUIPMENT", 15, 1),
      d("hl-infernal-brand-mark", "Infernal Brand Mark", "EQUIPMENT", 5),
      d("mountaineer-kit", "Mountaineer Kit", "EQUIPMENT", 3, 2),
      d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
      d("shovel", "Shovel", "EQUIPMENT", 5),
      d("hl-unholy-relic", "Unholy Relic", "EQUIPMENT", 15),
      d("hl-unholy-trinket", "Unholy Trinket", "EQUIPMENT", 15),
      ...commonGloryEquipment,
      g("hl-demonic-aura-grenade", "Demonic Aura Grenade", "GRENADE", 3, 1),
      g("hl-executioners-axe", "Executioner's Axe", "MELEE", 6, 1),
      g("hl-mark-of-cain", "The Mark of Cain", "EQUIPMENT", 4, 1, { eliteOnly: true }),
      g("hl-tormentor-chain", "Tormentor Chain", "EQUIPMENT", 3, 2),
      g("trench-dog", "Trench Dog Ownership", "EQUIPMENT", 1, 1),
    ],
  },

  // ── Court of the Seven-Headed Serpent ─────────────────────────────────────
  {
    id: "court-of-the-serpent",
    name: "Court of the Seven-Headed Serpent",
    slug: "court-of-the-serpent",
    side: "INFERNAL",
    tagline: "Ancient demon princes and their damned thralls",
    description:
      "Noble demons of the highest order, the Court descends upon the trenches to claim souls and revel in carnage. Led by winged Praetors and spell-weaving Sorcerers, they command legions of lesser demons and wretched damned souls through a complex hierarchy of infernal power.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/05/Court-of-the-seven-headed-serpent-Faction-Image-2.jpg",
    accentColor: "#1a5c2a",
    rosterUrl: "https://trench-companion.com/compendium/warbands/court-of-the-seven-headed-serpent",
    units: [
      {
        id: "cs-praetor",
        name: "Praetor",
        role: "CAPTAIN",
        cost: 115, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '8"/Flying', melee: "+3D", ranged: "+3D", armour: "0" },
        traits: ["Negate Fire", "Fear", "Strong", "Negate Heavy", "Tough", "Flying", "Leader"],
        keywords: ["ELITE", "DEMONIC", "THE COURT", "FLYING", "CAPTAIN"],
      },
      {
        id: "cs-sorcerer",
        name: "Sorcerer",
        role: "CAPTAIN",
        cost: 75, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Flying', melee: "+1D", ranged: "+1D", armour: "0" },
        traits: ["Negate Fire", "Fear", "Flying"],
        keywords: ["ELITE", "DEMONIC", "THE COURT", "FLYING", "CAPTAIN"],
        imageHint: "Note: Warband may have a Praetor OR a Sorcerer as its leader",
      },
      {
        id: "cs-hell-knight",
        name: "Hell Knight",
        role: "ELITE",
        cost: 100, costType: "DUCATS",
        availabilityMax: 3,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "0D", armour: "-2" },
        traits: ["Negate Fire", "Strong", "Negate Heavy"],
        keywords: ["ELITE", "DEMONIC", "THE COURT"],
      },
      {
        id: "cs-hunter",
        name: "Hunter of the Left-Hand Path",
        role: "ELITE",
        cost: 110, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "+2D", armour: "0" },
        traits: ["Negate Fire", "Infiltrator"],
        keywords: ["ELITE", "DEMONIC", "THE COURT"],
      },
      {
        id: "cs-desecrated-saint",
        name: "Desecrated Saint",
        role: "INFANTRY",
        cost: 140, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+3D", ranged: "0D", armour: "-3" },
        traits: ["Negate Fire", "Fear", "Strong", "Negate Heavy", "Tough"],
        keywords: ["DEMONIC", "THE COURT"],
      },
      {
        id: "cs-pit-locust",
        name: "Pit Locust",
        role: "INFANTRY",
        cost: 90, costType: "DUCATS",
        availabilityMax: 3,
        stats: { movement: '8"/Flying', melee: "+2D", ranged: "0D", armour: "-2" },
        traits: ["Negate Fire", "Fear", "Flying"],
        keywords: ["DEMONIC", "THE COURT", "FLYING"],
      },
      {
        id: "cs-wretched",
        name: "Wretched",
        role: "INFANTRY",
        cost: 20, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "-1D", ranged: "-1D", armour: "0" },
        traits: [],
        keywords: ["THE COURT"],
        imageHint: "Must be outnumbered by DEMONIC models",
      },
      {
        id: "cs-yoke-fiend",
        name: "Yoke Fiend",
        role: "INFANTRY",
        cost: 30, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "0D", armour: "0" },
        traits: ["Negate Fire"],
        keywords: ["DEMONIC", "THE COURT"],
      },
    ],
    armoury: [
      ...commonMelee,
      d("cs-head-taker", "Head Taker", "MELEE", 15, 2),
      d("cs-hellblade", "Hellblade", "MELEE", 15, 3),
      d("cs-malebranche-sword", "Malebranche Sword", "MELEE", 50, 1),
      d("cs-torture-instrument", "Torture Instrument", "MELEE", 8),
      d("cs-arquebus", "Arquebus", "RANGED", 8),
      d("cs-blunderbuss", "Blunderbuss", "RANGED", 5),
      d("flamethrower", "Flamethrower", "RANGED", 30, 2),
      d("heavy-flamethrower", "Heavy Flamethrower", "RANGED", 55, 1),
      d("cs-ophidian-rifle", "Ophidian Rifle", "RANGED", 25, 3, { eliteOnly: true }),
      d("pistol", "Pistol / Revolver", "RANGED", 6),
      d("cs-serpent-assault-gun", "Serpent Assault Gun", "RANGED", 50, 2),
      d("shotgun", "Shotgun", "RANGED", 10),
      d("gas-grenades", "Gas Grenades", "GRENADE", 10),
      d("incendiary-grenades", "Incendiary Grenades", "GRENADE", 15, 2),
      d("standard-armour", "Standard Armour", "ARMOUR", 15),
      d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { eliteOnly: true }),
      trenchShield,
      d("combat-helmet", "Combat Helmet", "EQUIPMENT", 5, null, { headgear: true }),
      d("cs-crown-of-hellfire", "Crown of Hellfire", "EQUIPMENT", 15, null, { allowedUnitIds: ["cs-pit-locust"], allowedForElite: true, headgear: true, note: "Elite or Pit Locust only" }),
      d("gas-mask", "Gas Mask", "EQUIPMENT", 5, null, { headgear: true }),
      d("cs-incendiary-ammo", "Incendiary Ammunition", "EQUIPMENT", 15, 1),
      d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
      d("cs-restraining-muzzle", "Restraining Muzzle", "EQUIPMENT", 10, 3, { allowedUnitIds: ["cs-yoke-fiend"] }),
      d("shovel", "Shovel", "EQUIPMENT", 5, null, { allowedUnitIds: ["cs-yoke-fiend", "cs-wretched"] }),
      d("cs-unholy-relic", "Unholy Relic", "EQUIPMENT", 15),
      d("cs-unholy-trinket", "Unholy Trinket", "EQUIPMENT", 15),
      ...commonGloryEquipment,
      g("cs-cruel-helmet", "Cruel Helmet", "EQUIPMENT", 2, 2, { allowedUnitIds: ["cs-wretched"], headgear: true }),
      g("cs-koraktor", "Koraktor, the Great Tome of Hell", "EQUIPMENT", 8, 1, { allowedUnitIds: ["cs-sorcerer"] }),
      g("cs-lordship-of-the-world", "Lordship of this World", "EQUIPMENT", 9, 1, { allowedUnitIds: ["cs-sorcerer", "cs-praetor"] }),
      g("cs-piece-of-silver", "Piece of Silver", "EQUIPMENT", 12, 1, { eliteOnly: true }),
    ],
  },

  // ── Cult of the Black Grail ───────────────────────────────────────────────
  {
    id: "cult-of-the-black-grail",
    name: "Cult of the Black Grail",
    slug: "cult-of-the-black-grail",
    side: "INFERNAL",
    tagline: "Plague bearers of Beelzebub",
    description:
      "Servants of Beelzebub, Lord of Flies, the Cult spreads infection and despair across the trench lines. Their warriors are bloated with plague-blessings, immune to pain and disease, and utterly devoted to drowning the world in rot and corruption.",
    imageUrl:
      "https://synod.trench-companion.com/wp-content/uploads/2025/07/Cult-of-the-Black-Grail-Faction-Image.jpg",
    accentColor: "#3d5a00",
    rosterUrl: "https://trench-companion.com/compendium/warbands/cult-of-the-black-grail",
    subfactions: [
      { id: "dirge", name: "Dirge of the Great Hegemon", slug: "dirge-of-the-great-hegemon" },
      { id: "great-hunger", name: "The Great Hunger", slug: "the-great-hunger" },
    ],
    units: [
      {
        id: "cbg-lord-of-tumors",
        name: "Lord of Tumors",
        role: "CAPTAIN",
        cost: 130, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+4D", ranged: "+1D", armour: "0" },
        traits: ["Negate Gas", "Fear", "Strong", "Negate Heavy", "Tough", "Leader"],
        keywords: ["ELITE", "BLACK GRAIL", "CAPTAIN"],
      },
      {
        id: "cbg-plague-knight-captain",
        name: "Plague Knight (Captain)",
        role: "CAPTAIN",
        cost: 60, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear", "Strong", "Negate Heavy", "Leader"],
        keywords: ["ELITE", "BLACK GRAIL", "CAPTAIN"],
        imageHint: "Alternative Captain. Choose Lord of Tumors OR Plague Knight as your leader.",
      },
      {
        id: "cbg-corpse-guard",
        name: "Corpse Guard",
        role: "ELITE",
        cost: 55, costType: "DUCATS",
        availabilityMax: 3,
        stats: { movement: '6"/Infantry', melee: "+1D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear"],
        keywords: ["ELITE", "BLACK GRAIL"],
      },
      {
        id: "cbg-plague-knight-elite",
        name: "Plague Knight (Elite)",
        role: "ELITE",
        cost: 60, costType: "DUCATS",
        availabilityMax: 2,
        stats: { movement: '6"/Infantry', melee: "+2D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear", "Strong", "Negate Heavy"],
        keywords: ["ELITE", "BLACK GRAIL"],
      },
      {
        id: "cbg-amalgam",
        name: "Amalgam",
        role: "INFANTRY",
        cost: 140, costType: "DUCATS",
        availabilityMax: 1,
        stats: { movement: '6"/Infantry', melee: "0D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear", "Strong", "Negate Heavy", "Tough"],
        keywords: ["BLACK GRAIL"],
      },
      {
        id: "cbg-grail-thrall",
        name: "Grail Thrall",
        role: "INFANTRY",
        cost: 25, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '5"/Infantry', melee: "-1D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear"],
        keywords: ["BLACK GRAIL"],
      },
      {
        id: "cbg-fly-thrall",
        name: "Fly Thrall",
        role: "INFANTRY",
        cost: 25, costType: "DUCATS",
        availabilityMax: null,
        stats: { movement: '6"/Flying', melee: "-1D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear", "Flying"],
        keywords: ["BLACK GRAIL", "FLYING"],
      },
      {
        id: "cbg-herald",
        name: "Herald of Beelzebub",
        role: "INFANTRY",
        cost: 50, costType: "DUCATS",
        availabilityMax: 4,
        stats: { movement: '10"/Flying', melee: "0D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear", "Skirmisher", "Flying"],
        keywords: ["BLACK GRAIL", "FLYING"],
      },
      {
        id: "cbg-hounds",
        name: "Hounds of the Black Grail",
        role: "INFANTRY",
        cost: 55, costType: "DUCATS",
        availabilityMax: 3,
        stats: { movement: '8"/Infantry', melee: "+1D", ranged: "0D", armour: "0" },
        traits: ["Negate Gas", "Fear"],
        keywords: ["BLACK GRAIL"],
      },
    ],
    armoury: [
      bayonet,
      ...commonMelee,
      d("cbg-beelzebubs-axe", "Beelzebub's Axe", "MELEE", 30, 1, { eliteOnly: true }),
      d("cbg-plague-blade", "Plague Blade", "MELEE", 7, 3, { eliteOnly: true }),
      d("cbg-blunderbuss", "Blunderbuss", "RANGED", 5),
      d("bolt-action-rifle", "Bolt-Action Rifle", "RANGED", 10),
      d("cbg-corruption-belcher", "Corruption Belcher", "RANGED", 30, 2),
      d("cbg-infested-rifle", "Infested Rifle", "RANGED", 15),
      d("machine-gun", "Machine Gun", "RANGED", 50, 1, { allowedUnitIds: ["cbg-amalgam"] }),
      d("musket", "Musket", "RANGED", 5),
      d("pistol", "Pistol / Revolver", "RANGED", 6),
      d("cbg-putrid-shotgun", "Putrid Shotgun", "RANGED", 20, 2),
      d("shotgun", "Shotgun", "RANGED", 10),
      d("cbg-viscera-cannon", "Viscera Cannon", "RANGED", 50, 2, { eliteOnly: true }),
      d("gas-grenades", "Gas Grenades", "GRENADE", 10),
      d("cbg-parasite-grenades", "Parasite Grenades", "GRENADE", 15),
      d("standard-armour", "Standard Armour", "ARMOUR", 15),
      d("reinforced-armour", "Reinforced Armour", "ARMOUR", 40, null, { eliteOnly: true }),
      d("cbg-black-grail-shield", "Black Grail Shield", "SHIELD", 20, null, { eliteOnly: true }),
      trenchShield,
      d("combat-helmet", "Combat Helmet", "EQUIPMENT", 5, null, { headgear: true }),
      d("cbg-compound-eyes-helmet", "Compound Eyes Helmet", "EQUIPMENT", 10, 3, { allowedUnitIds: ["cbg-herald"], allowedForElite: true, headgear: true, note: "Herald or Elite only" }),
      g("cbg-field-shrine", "Field Shrine", "EQUIPMENT", 2),
      d("cbg-grail-devotee-d", "Grail Devotee", "EQUIPMENT", 15, 2, { allowedUnitIds: ["cbg-herald"], allowedForElite: true, note: "Herald or Elite only" }),
      g("cbg-grail-devotee-g", "Grail Devotee", "EQUIPMENT", 2, 2, { allowedUnitIds: ["cbg-herald"], allowedForElite: true, note: "Herald or Elite only" }),
      d("musical-instrument", "Musical Instrument", "EQUIPMENT", 15, 1),
      d("cbg-unholy-trinket", "Unholy Trinket", "EQUIPMENT", 15),
      ...commonGloryEquipment,
      g("cbg-armour-of-the-fly", "Armour of the Fly", "ARMOUR", 7, 1, { eliteOnly: true }),
      g("cbg-beelzebubs-embrace", "Beelzebub's Embrace", "EQUIPMENT", 12, 1, { eliteOnly: true }),
      g("cbg-cup-of-filth", "Cup of Filth", "EQUIPMENT", 4, 1),
      g("cbg-locust-spitter", "Locust Spitter", "RANGED", 6, 1),
    ],
  },
];

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getFactionById(id: string): FactionData | undefined {
  return GAME_FACTIONS.find((f) => f.id === id);
}

export function getFactionBySlug(slug: string): FactionData | undefined {
  return GAME_FACTIONS.find((f) => f.slug === slug);
}

// ─── Warband Validation ───────────────────────────────────────────────────────

export interface RosterUnit {
  unitTemplateId: string;
  customName?: string;
  equipment: string[]; // equipment item IDs
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  totalDucats: number;
  totalGlory: number;
}

export function validateWarband(
  factionId: string,
  roster: RosterUnit[],
  budgetDucats = 700,
  budgetGlory = 0
): ValidationResult {
  const faction = getFactionById(factionId);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!faction) {
    return { valid: false, errors: ["Unknown faction"], warnings: [], totalDucats: 0, totalGlory: 0 };
  }

  // --- Tally costs ---
  let totalDucats = 0;
  let totalGlory = 0;

  // Track unit counts
  const unitCounts: Record<string, number> = {};
  // Track warband-wide equipment counts
  const equipmentCounts: Record<string, number> = {};

  for (const ru of roster) {
    const unit = faction.units.find((u) => u.id === ru.unitTemplateId);
    if (!unit) {
      errors.push(`Unknown unit: ${ru.unitTemplateId}`);
      continue;
    }
    unitCounts[unit.id] = (unitCounts[unit.id] ?? 0) + 1;

    // Unit base cost
    if (unit.costType === "DUCATS") totalDucats += unit.cost;
    else totalGlory += unit.cost;

    // Per-unit slot counts
    let headgearCount = 0;
    let armourCount = 0;
    let shieldCount = 0;

    // Equipment costs + restrictions
    for (const eqId of ru.equipment) {
      const eq = faction.armoury.find((e) => e.id === eqId);
      if (!eq) continue;

      equipmentCounts[eq.id] = (equipmentCounts[eq.id] ?? 0) + 1;

      if (eq.costType === "DUCATS") totalDucats += eq.cost;
      else totalGlory += eq.cost;

      // Elite-only check
      if (eq.eliteOnly && !unit.keywords.includes("ELITE")) {
        errors.push(`${unit.name} cannot take ${eq.name} (Elite only)`);
      }
      // Allowed unit check
      if (eq.allowedUnitIds && eq.allowedUnitIds.length > 0 && !eq.allowedUnitIds.includes(unit.id)) {
        if (!eq.allowedForElite || !unit.keywords.includes("ELITE")) {
          errors.push(`${unit.name} cannot take ${eq.name} (restricted to specific units)`);
        }
      }

      // Per-unit slot limits
      if (eq.headgear) {
        headgearCount++;
        if (headgearCount > 1) errors.push(`${ru.customName ?? unit.name} cannot wear more than one piece of Headgear`);
      }
      if (eq.category === "ARMOUR") {
        armourCount++;
        if (armourCount > 1) errors.push(`${ru.customName ?? unit.name} cannot wear more than one piece of Armour`);
      }
      if (eq.category === "SHIELD") {
        shieldCount++;
        if (shieldCount > 1) errors.push(`${ru.customName ?? unit.name} cannot carry more than one Shield`);
      }
    }
  }

  // --- Captain check ---
  const captains = roster.filter((ru) => {
    const unit = faction.units.find((u) => u.id === ru.unitTemplateId);
    return unit?.role === "CAPTAIN";
  });
  if (captains.length === 0) {
    errors.push("Warband must include at least one Captain");
  } else if (captains.length > 1) {
    errors.push("Warband may only have one Captain");
  }

  // --- Max 6 Elites ---
  const eliteCount = roster.filter((ru) => {
    const unit = faction.units.find((u) => u.id === ru.unitTemplateId);
    return unit?.keywords.includes("ELITE");
  }).length;
  if (eliteCount > 6) {
    errors.push(`Too many Elite models (${eliteCount} / max 6)`);
  }

  // --- Availability limits ---
  for (const [unitId, count] of Object.entries(unitCounts)) {
    const unit = faction.units.find((u) => u.id === unitId);
    if (!unit) continue;
    if (unit.availabilityMax !== null && count > unit.availabilityMax) {
      errors.push(`Too many ${unit.name} (max ${unit.availabilityMax}, have ${count})`);
    }
  }

  // --- Equipment warband limits ---
  for (const [eqId, count] of Object.entries(equipmentCounts)) {
    const eq = faction.armoury.find((e) => e.id === eqId);
    if (!eq) continue;
    if (eq.warbandLimit !== null && count > eq.warbandLimit) {
      errors.push(`Too many ${eq.name} across warband (limit ${eq.warbandLimit})`);
    }
  }

  // --- Budget check ---
  if (totalDucats > budgetDucats) {
    errors.push(`Over budget: ${totalDucats} / ${budgetDucats} ducats`);
  }
  if (totalGlory > budgetGlory) {
    warnings.push(`Spending ${totalGlory} glory points (budget: ${budgetGlory})`);
  }

  // --- Minimum size ---
  if (roster.length < 3) {
    warnings.push("Very small warband (recommended minimum 3 models)");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalDucats,
    totalGlory,
  };
}

// ─── Unit Images ──────────────────────────────────────────────────────────────

const CDN = "https://synod.trench-companion.com/wp-content/uploads";

export const UNIT_IMAGES: Record<string, string> = {
  // New Antioch
  "na-lieutenant":     `${CDN}/2025/05/Lieutnenant.jpg`,
  "na-sniper-priest":  `${CDN}/2025/05/Sniper-Priest-1.jpg`,
  "na-trench-cleric":  `${CDN}/2025/05/Trench-Cleric.jpg`,
  "na-combat-engineer":`${CDN}/2025/05/Combat-Engineer.jpg`,
  "na-combat-medic":   `${CDN}/2025/05/Medic.jpg`,
  "na-mech-heavy":     `${CDN}/2025/05/HMI-3.jpg`,
  "na-shocktrooper":   `${CDN}/2025/05/NA-Shocktrooper.jpg`,
  "na-yeoman":         `${CDN}/2025/05/Yeoman-3.jpg`,

  // Trench Pilgrims
  "tp-war-prophet":          `${CDN}/2025/05/War-Prophet.jpg`,
  "tp-castigator":           `${CDN}/2025/05/Castigator.jpg`,
  "tp-communicant":          `${CDN}/2025/05/Communicant.jpg`,
  "tp-anchorite-shrine":     `${CDN}/2025/05/Anchorite-Shrine.jpg`,
  "tp-ecclesiastic-prisoner":`${CDN}/2025/04/Ecclesiastic-prisoner.jpg`,
  "tp-stigmatic-nun":        `${CDN}/2025/05/Stigmatic-Nun.jpg`,
  "tp-trench-pilgrim":       `${CDN}/2025/04/Trench-Pilgrim.jpg`,

  // Iron Sultanate
  "is-captain":    `${CDN}/2025/05/Yuzbasi-captain.jpg`,
  "is-alchemist":  `${CDN}/2025/07/Alchemist.jpg`,
  "is-assassin":   `${CDN}/2025/07/Assassin-1.jpg`,
  "is-azeb":       `${CDN}/2025/07/Azeb-Jezzail.jpg`,
  "is-brazen-bull":`${CDN}/2025/07/Brazen-Bull-1.jpg`,
  "is-janissary":  `${CDN}/2025/05/Janissary-Jezzail-3.jpg`,
  "is-lion-of-jabir":`${CDN}/2025/07/Lion-of-Jabir-1.jpg`,
  "is-sapper":     `${CDN}/2025/07/Sapper.jpg`,

  // Heretic Legion
  "hl-heretic-priest":   `${CDN}/2025/05/Heretic-Priest.jpg`,
  "hl-death-commando":   `${CDN}/2025/05/Death-Commando.jpg`,
  "hl-heretic-chorister":`${CDN}/2025/05/Chorister.jpg`,
  "hl-anointed-heavy":   `${CDN}/2025/05/Anointed-Heavy-Infantry-Axe.jpg`,
  "hl-artillery-witch":  `${CDN}/2025/05/Artillery-Witch.jpg`,
  "hl-heretic-trooper":  `${CDN}/2025/05/Heretic-Trooper-Pistol.jpg`,
  "hl-war-wolf":         `${CDN}/2025/05/War-Wolf.jpg`,
  "hl-wretched":         `${CDN}/2025/05/Wretched-1.jpg`,

  // Court of the Seven-Headed Serpent
  "cs-praetor":         `${CDN}/2025/05/Court-Preator.jpg`,
  "cs-sorcerer":        `${CDN}/2025/04/Sorcerer.jpg`,
  "cs-hell-knight":     `${CDN}/2025/04/Hell-Knight.jpg`,
  "cs-hunter":          `${CDN}/2025/04/Hunter-of-the-left-hand-path.jpg`,
  "cs-desecrated-saint":`${CDN}/2025/05/Desecrated-Saint-1.jpg`,
  "cs-pit-locust":      `${CDN}/2025/04/Pit-Locust.jpg`,
  "cs-wretched":        `${CDN}/2025/05/Wretched-1.jpg`,
  "cs-yoke-fiend":      `${CDN}/2025/04/Yoke-Fiend.jpg`,

  // Cult of the Black Grail
  "cbg-lord-of-tumors":       `${CDN}/2025/05/Lord-of-Tumors.jpg`,
  "cbg-plague-knight-captain":`${CDN}/2025/05/Plague-Knight.jpg`,
  "cbg-corpse-guard":         `${CDN}/2025/05/Corpse-Guard-3.jpg`,
  "cbg-plague-knight-elite":  `${CDN}/2025/05/Plague-Knight.jpg`,
  "cbg-amalgam":              `${CDN}/2025/05/Amalgam.jpg`,
  "cbg-grail-thrall":         `${CDN}/2025/05/Grail-Thrall-2.jpg`,
  "cbg-fly-thrall":           `${CDN}/2025/05/Grail-Thrall.jpg`,
  "cbg-herald":               `${CDN}/2025/05/Herald-of-Beelzebub.jpg`,
  "cbg-hounds":               `${CDN}/2025/05/Grail-Hound.jpg`,
};
