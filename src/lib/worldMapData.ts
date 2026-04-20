// ─── World Map Data ────────────────────────────────────────────────────────────
// Coordinates are expressed as percentages from the top-left corner of the map image.
// x = % from left edge, y = % from top edge.
// Edit these values to reposition markers on the map.

export type LocationSide = "FAITHFUL" | "INFERNAL" | "CONTESTED" | "NEUTRAL";
export type EventType = "BATTLE" | "POLITICAL" | "SUPERNATURAL" | "DISASTER" | "ACHIEVEMENT";
export type EventSide = "FAITHFUL" | "INFERNAL" | "BOTH" | "NEUTRAL";

export interface MapLocation {
  id: string;
  name: string;
  /** % from left edge of the map image. Adjust to reposition. */
  x: number;
  /** % from top edge of the map image. Adjust to reposition. */
  y: number;
  side: LocationSide;
  description: string;
  faction?: string;
}

export interface HistoricalEvent {
  id: string;
  year: number;
  yearEnd?: number;
  title: string;
  type: EventType;
  side: EventSide;
  /** % from left edge of the map image. Adjust to reposition. */
  x: number;
  /** % from top edge of the map image. Adjust to reposition. */
  y: number;
  description: string;
}

// ─── LOCATION MARKERS ─────────────────────────────────────────────────────────
// These show the major powers and territories on the map as circle markers.
// Positions need tuning — adjust x/y values to match the visible map image.

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: "ultima-thule",
    name: "Ultima Thule",
    x: 28, y: 6,
    side: "NEUTRAL",
    description:
      "The northernmost known land, shrouded in perpetual ice. Explorers who venture here report strange lights and voices whispering in forgotten tongues. Its allegiance, if any, remains unknown.",
  },
  {
    id: "kingdom-of-alba",
    name: "Kingdom of Alba",
    x: 22, y: 20,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "The highland kingdom of the north provides the feared Kingdom of Alba Assault Detachment — shock troops trained in brutal close-quarters warfare in the mist-shrouded valleys. Their war-cry has broken many a Heretic line.",
  },
  {
    id: "fortress-britannia",
    name: "England / Fortress Britannia",
    x: 24, y: 30,
    side: "FAITHFUL",
    description:
      "The heart of the Britannian crusader tradition. The moving Fortress of Britannia was completed in 1907 — a mobile iron citadel patrolling the Channel. The White Cliffs fortification defends against Heretic Naval Raiders.",
  },
  {
    id: "holy-francia",
    name: "Holy Francia",
    x: 30, y: 42,
    side: "FAITHFUL",
    description:
      "The spiritual and political center of the Faithful war machine. Paris hosts the Grand Council of the Crusade, where faction leaders debate strategy while the trenches consume men by the thousands.",
  },
  {
    id: "hispania",
    name: "Hispania",
    x: 20, y: 55,
    side: "FAITHFUL",
    description:
      "The Iberian peninsula has been a constant theatre of war. Cordoba was the site of a bloody stalemate in 1910. Gibraltar in the south was captured by Heretic Naval Raiders in 1670, giving Hell access to the Atlantic.",
  },
  {
    id: "free-state-prussia",
    name: "Free State of Prussia",
    x: 44, y: 34,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "Prussian Stosstruppen are the storm-trooper elite of New Antioch — disciplined shock assault units who pioneered trench-clearing tactics. Their iron discipline and tactical acumen make them among the most feared units in the Faithful arsenal.",
  },
  {
    id: "papal-states",
    name: "Papal States / Rome",
    x: 40, y: 56,
    side: "FAITHFUL",
    description:
      "The eternal city is the seat of the Church. In 1894, the Supreme Pontiff was assassinated by Death Commandos — one of three simultaneous killings that shook the Faithful to their foundations in the Year of Broken Trinity.",
  },
  {
    id: "byzantine-ruins",
    name: "Ruins of Byzantium",
    x: 60, y: 50,
    side: "CONTESTED",
    description:
      "Once the great eastern bulwark of Christendom, Byzantium was shattered in 1573. A million heretics were impaled in the hills of Wallachia by the Sacred Order of the Dragon, halting the advance.",
  },
  {
    id: "wallachia",
    name: "Wallachia",
    x: 57, y: 44,
    side: "FAITHFUL",
    description:
      "Where the Sacred Order of the Dragon made their legendary stand in 1573. The hills are still thick with the rusted iron of a million impaling stakes. Even demons are said to refuse to pass through this place at night.",
  },
  {
    id: "abyssinia",
    name: "Abyssinia",
    x: 64, y: 87,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "The Expeditionary Forces of Abyssinia are among the fiercest warriors of the Faithful cause — veteran soldiers hardened by desert warfare and driven by an ancient, unshakeable Christian faith.",
  },
  {
    id: "numidia",
    name: "Kingdom of Numidia",
    x: 29, y: 78,
    side: "FAITHFUL",
    description:
      "The North African kingdom is a vital supply route for the Eastern Crusade. Its ports provide grain and soldiers, while its scholars preserve ancient texts that may hold the key to sealing the Gate of Hell.",
  },
  {
    id: "iron-sultanate-territory",
    name: "Great Iron Wall",
    x: 83, y: 62,
    side: "FAITHFUL",
    faction: "Iron Sultanate",
    description:
      "The Iron Sultanate holds the easternmost line of the Faithful. The Great Iron Wall of Iskandar, re-emerging in 1109, has been fortified for over eight centuries against the demon tide.",
  },
  {
    id: "new-antioch",
    name: "New Antioch",
    x: 77, y: 70,
    side: "FAITHFUL",
    faction: "New Antioch Principality",
    description:
      "The crusader capital. Its walls were completed in 1595. Old Antioch was utterly destroyed in 1545 by a mysterious infernal weapon. It has been rebuilt and re-fortified more times than any city in history.",
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    x: 76, y: 80,
    side: "CONTESTED",
    description:
      "The ultimate prize. The First Heresy was committed here in 1099 when Templar Knights opened the Gate of Hell. The war began here. Every strategy, every sacrifice, every prayer is aimed at reclaiming it.",
  },
  {
    id: "domain-beelzebub",
    name: "Domain of Beelzebub",
    x: 73, y: 76,
    side: "INFERNAL",
    faction: "Cult of the Black Grail",
    description:
      "The Lord of Flies has made this blasted wasteland his earthly throne. The Cult of the Black Grail ministers to the damned here. The Black Grail plague was first unleashed upon the world from this foul domain in 1346.",
  },
  {
    id: "heretic-territory",
    name: "Fallen Crusader Territories",
    x: 50, y: 63,
    side: "INFERNAL",
    faction: "Heretic Legion",
    description:
      "Swathes of once-Faithful territory corrupted by the Heretic Legion. The 1894 Year of Broken Trinity saw a massive Heretic lightning offensive launched from these staging grounds.",
  },
  {
    id: "golden-khanate",
    name: "Golden Khanate",
    x: 87, y: 40,
    side: "NEUTRAL",
    description:
      "The vast steppe empire of the east watches the eternal war with calculating eyes. The Khanate trades with both sides, sells warriors to neither, and waits. Their cavalry is rumoured to be able to outrun demons.",
  },
  {
    id: "tzardom-siberia",
    name: "Tzardom of Siberia",
    x: 83, y: 12,
    side: "FAITHFUL",
    description:
      "The frozen empire of the east maintains wary distance from the main crusade. Its northern borders have been touched by infernal corruption. Siberian sharpshooters are prized mercenaries in the trenches.",
  },
  {
    id: "gibraltar",
    name: "Gibraltar",
    x: 18, y: 60,
    side: "INFERNAL",
    faction: "Heretic Legion",
    description:
      "Captured by the newly created Heretic fleet in the Year of Six Woes (1670). The sea fortress became the Heretic base of operations against Europe and gave Hell's forces their first access to the Atlantic Ocean.",
  },
  {
    id: "alamut",
    name: "Fortress Alamut",
    x: 88, y: 66,
    side: "FAITHFUL",
    faction: "Iron Sultanate",
    description:
      "The mountain fortress defended by the Old Man in the Mountain and his Hashashins since 1165. Besieged for centuries without ever falling. The Sultanate Assassins are trained in its hidden chambers.",
  },
];

// ─── HISTORICAL EVENTS ────────────────────────────────────────────────────────
// Key events from the 800-year timeline of the Trench Crusade.
// Source: The official lore timeline (trenchcrusader.com/lore/)
// Events are shown as diamond markers on the map, filterable by year range.

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: "ev-first-heresy",
    year: 1099,
    title: "The First Heresy",
    type: "SUPERNATURAL",
    side: "INFERNAL",
    x: 76, y: 80,
    description:
      "The Knights Templar discover a demonic artifact beneath the Temple Mount in Jerusalem and commit the Act of Ultimate Heresy. The Gate of Hell is torn open on Earth. Jerusalem is destroyed in the cataclysm, and eight centuries of unending war begin.",
  },
  {
    id: "ev-year-three-battles",
    year: 1101,
    title: "Year of Three Battles",
    type: "BATTLE",
    side: "INFERNAL",
    x: 74, y: 74,
    description:
      "The Heretics, reinforced by the armies of the Third Circle of Hell, conquer most of the Levant in a series of devastating offensives. The Faithful are thrown back to the walls of the old cities.",
  },
  {
    id: "ev-antioch-fortified",
    year: 1102,
    title: "Antioch Fortified",
    type: "ACHIEVEMENT",
    side: "FAITHFUL",
    x: 75, y: 69,
    description:
      "The ancient city of Antioch is fortified and becomes the focal point of Faithful resistance against the forces of Hell. For four centuries it will serve as the crusade's primary eastern stronghold.",
  },
  {
    id: "ev-sultanate-formed",
    year: 1109,
    title: "Great Sultanate Formed",
    type: "POLITICAL",
    side: "FAITHFUL",
    x: 84, y: 60,
    description:
      "The Great Sultanate of the Invincible Iron Wall of the Two Horns That Pierce the Sky is formed, unifying the Islamic factions into a single alliance. The Great Iron Wall of Iskandar is reinforced against the Heretic advance.",
  },
  {
    id: "ev-seventeen-martyrs",
    year: 1117,
    title: "The Seventeen Martyrs",
    type: "SUPERNATURAL",
    side: "FAITHFUL",
    x: 72, y: 73,
    description:
      "The legendary Seventeen Martyrs travel into the Earthly Domains of Hell to convert the Heretics. Captured and tortured, they are kept in a perpetual state of agony within white-hot Brazen Bulls — where they remain to this day.",
  },
  {
    id: "ev-alamut-siege",
    year: 1165,
    title: "Siege of Alamut Begins",
    type: "BATTLE",
    side: "FAITHFUL",
    x: 89, y: 65,
    description:
      "The Old Man in the Mountain and his Hashashins begin their defence of the mountain fortress of Alamut. The siege will continue for over seven centuries without the fortress ever falling.",
  },
  {
    id: "ev-triclavianism",
    year: 1215,
    yearEnd: 1306,
    title: "Wars of Triclavianism",
    type: "DISASTER",
    side: "FAITHFUL",
    x: 40, y: 50,
    description:
      "The Church splits into warring factions in a catastrophic internal conflict lasting ninety years. Heretic domains extend across Europe while the Faithful fight each other. Millions perish by sword and fire.",
  },
  {
    id: "ev-black-grail-plague",
    year: 1346,
    yearEnd: 1353,
    title: "The Black Grail — Corpse Wars",
    type: "DISASTER",
    side: "INFERNAL",
    x: 46, y: 48,
    description:
      "Beelzebub unleashes the Black Grail across Europe and the Levant. Tens of millions are infected and become metastatic plague-vessels. The Corpse Wars begin — a catastrophe that reshapes the political map of the world.",
  },
  {
    id: "ev-jeanne-arc",
    year: 1429,
    title: "Jeanne d'Arc Drives Back the Plague",
    type: "ACHIEVEMENT",
    side: "FAITHFUL",
    x: 28, y: 42,
    description:
      "Living Saint Jeanne d'Arc leads a crusade against the Black Grail, driving Beelzebub's plague-carriers from mainland Europe. She becomes the most venerated saint of the Faithful in the modern era.",
  },
  {
    id: "ev-antioch-destroyed",
    year: 1545,
    title: "Antioch Destroyed",
    type: "DISASTER",
    side: "INFERNAL",
    x: 74, y: 67,
    description:
      "Old Antioch is destroyed utterly by a mysterious infernal weapon — its nature classified by the Synod of Strategic Prophecy to this day. The city's inhabitants and four centuries of crusader fortifications are simply gone.",
  },
  {
    id: "ev-wallachia-impaling",
    year: 1573,
    title: "The Great Impalement",
    type: "BATTLE",
    side: "FAITHFUL",
    x: 57, y: 43,
    description:
      "The Sacred Order of the Dragon halts the heretic advance after the destruction of Byzantium. A million heretics are impaled in the hills of Wallachia — a sight so terrible that demons still refuse to cross those plains at night.",
  },
  {
    id: "ev-new-antioch-walls",
    year: 1595,
    title: "Walls of New Antioch Completed",
    type: "ACHIEVEMENT",
    side: "FAITHFUL",
    x: 78, y: 71,
    description:
      "After decades of construction using orichalcum-reinforced masonry, the Walls of New Antioch are completed. The greatest fortification in the known world, proof against all mortal and infernal siege engines.",
  },
  {
    id: "ev-gibraltar-falls",
    year: 1670,
    title: "Year of Six Woes — Gibraltar Falls",
    type: "DISASTER",
    side: "INFERNAL",
    x: 18, y: 59,
    description:
      "In a surprise raid, the newly created Heretic fleet captures Gibraltar in the Year of Six Woes. The sea fortress becomes the Heretic base of operations against Europe. Forces of Hell gain access to the Atlantic for the first time.",
  },
  {
    id: "ev-hebrew-knights",
    year: 1703,
    title: "Hebrew Knights Destroy Acre",
    type: "BATTLE",
    side: "FAITHFUL",
    x: 74, y: 77,
    description:
      "Against all odds, a small force of Hebrew Knights striking from their secret fortress destroys the Templar stronghold at Acre — erasing one of the original sites of the First Heresy in a single bold night raid.",
  },
  {
    id: "ev-fortress-white-cliffs",
    year: 1805,
    title: "Fortress of the White Cliffs",
    type: "ACHIEVEMENT",
    side: "FAITHFUL",
    x: 24, y: 33,
    description:
      "Due to constant coastal raids by the Heretic Fleet, the Crown of England begins construction of the Fortress of the White Cliffs — a vast fortification system along the English Channel designed to deny Heretic Naval Raiders a beachhead.",
  },
  {
    id: "ev-broken-trinity",
    year: 1894,
    title: "Year of Broken Trinity",
    type: "DISASTER",
    side: "INFERNAL",
    x: 39, y: 54,
    description:
      "Death Commandos simultaneously assassinate the Supreme Pontiff, the High Prophetess Aelia, and the Holy Roman Emperor. The Heretic Legions launch simultaneous lightning offensives in the Levant and Europe. The Faithful barely survive.",
  },
  {
    id: "ev-church-space",
    year: 1899,
    title: "Church Space Program",
    type: "ACHIEVEMENT",
    side: "FAITHFUL",
    x: 41, y: 55,
    description:
      "Following the catastrophe of the Year of Broken Trinity, the Church announces a secret Space Program, reasoning that if Hell can claim the Earth, Heaven must be reached by other means. Its current status is unknown.",
  },
  {
    id: "ev-fortress-britannia",
    year: 1907,
    title: "Moving Fortress of Britannia",
    type: "ACHIEVEMENT",
    side: "FAITHFUL",
    x: 25, y: 31,
    description:
      "The construction of the moving fortress of Britannia is completed. A mobile iron citadel the size of a small city, it patrols the North Sea and Channel, preventing Heretic Naval Raiders from establishing a beachhead on English soil.",
  },
  {
    id: "ev-battle-cordoba",
    year: 1910,
    title: "Battle of Cordoba",
    type: "BATTLE",
    side: "BOTH",
    x: 19, y: 56,
    description:
      "A bloody stalemate. Heretic artillery devastates the ancient city of Cordoba, but the Heretic forces fail to break through into the heartlands of Hispania. The ruins become a permanent, contested killing ground.",
  },
];

export const MIN_YEAR = 1099;
export const MAX_YEAR = 1914;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  BATTLE: "Battle",
  POLITICAL: "Political",
  SUPERNATURAL: "Supernatural",
  DISASTER: "Disaster",
  ACHIEVEMENT: "Achievement",
};

export const EVENT_TYPE_COLORS: Record<EventType, { fill: string; stroke: string; text: string }> = {
  BATTLE:       { fill: "#d97706", stroke: "#fcd34d", text: "text-[#fbbf24]" },
  POLITICAL:    { fill: "#3b82f6", stroke: "#93c5fd", text: "text-[#60a5fa]" },
  SUPERNATURAL: { fill: "#8b5cf6", stroke: "#c4b5fd", text: "text-[#a78bfa]" },
  DISASTER:     { fill: "#dc2626", stroke: "#fca5a5", text: "text-[#f87171]" },
  ACHIEVEMENT:  { fill: "#10b981", stroke: "#6ee7b7", text: "text-[#34d399]" },
};

export const LOCATION_SIDE_COLORS: Record<LocationSide, { fill: string; stroke: string; text: string }> = {
  FAITHFUL:  { fill: "#3b82f6", stroke: "#93c5fd", text: "text-[#7ab0d8]" },
  INFERNAL:  { fill: "#dc2626", stroke: "#fca5a5", text: "text-[#d87a7a]" },
  CONTESTED: { fill: "#d97706", stroke: "#fcd34d", text: "text-[#d4b87a]" },
  NEUTRAL:   { fill: "#6b7280", stroke: "#d1d5db", text: "text-[#a0a0a0]" },
};
