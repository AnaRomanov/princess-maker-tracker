// Game-design data for Life Maker. Pure config — no rendering logic here.
// Mirrors the data previously inlined in index.html's <script>.

export const STAT_GROUPS = {
  Body: ["Strength", "Stamina", "Agility"],
  Mind: ["Intelligence", "Magic", "Spirit"],
  Society: ["Manners", "Elegance", "Speech"],
  Arts: ["Sense", "Sensitivity", "Charm"],
};

export const STATS = Object.values(STAT_GROUPS).flat();

// Eight active jobs focused on life beyond day-to-day work.
export const ACTS = [
  { id: "literature", name: "Literature", mono: "Li", kind: "class", sub: "Reading", up: ["Speech", "Sensitivity"], down: ["Magic"] },
  { id: "history", name: "History", mono: "Hi", kind: "class", sub: "History", up: ["Intelligence", "Elegance"], down: ["Sense"] },
  { id: "etiquette", name: "Etiquette", mono: "Et", kind: "class", sub: "Etiquette", up: ["Manners", "Elegance"], down: ["Agility"] },
  { id: "sword", name: "Swordsmanship", mono: "Sw", kind: "class", sub: "Ice skating", up: ["Agility", "Stamina"], down: ["Speech"] },
  { id: "martial", name: "Martial Arts", mono: "MA", kind: "class", sub: "Strength training", up: ["Strength", "Stamina"], down: ["Elegance"] },
  { id: "magic", name: "Magic Studies", mono: "Mg", kind: "class", sub: "French", up: ["Magic", "Intelligence"], down: ["Manners"] },
  { id: "art", name: "Art", mono: "Ar", kind: "class", sub: "Photography", up: ["Sense", "Sensitivity"], down: ["Stamina"] },
  { id: "dance", name: "Dance", mono: "Da", kind: "class", sub: "Ballet", up: ["Charm", "Sense"], down: ["Magic"] },
  { id: "alchemy", name: "Alchemy", mono: "Al", kind: "class", sub: "Tech Lab", up: ["Intelligence", "Spirit"], down: ["Sensitivity"] },
  { id: "music", name: "Music", mono: "Mu", kind: "class", sub: "Open slot", up: ["Sensitivity", "Charm"], down: ["Strength"] },
  { id: "housework", name: "Housework", mono: "Hw", kind: "job", sub: "Cleaning & life admin", up: ["Agility", "Sense"], down: [], pay: 1, stress: 3 },
  { id: "workshop", name: "Woodworking Workshop", mono: "Wo", kind: "job", sub: "Personal projects", up: ["Intelligence", "Sense"], down: [], pay: 25 },
  { id: "garden", name: "Botanical Garden", mono: "Bo", kind: "job", sub: "Outdoor adventures", up: ["Stamina", "Sensitivity"], down: [], pay: 23, stress: -4 },
  { id: "clothing", name: "Clothing Store", mono: "Cl", kind: "job", sub: "Style & wardrobe", up: ["Elegance", "Charm"], down: [], pay: 16, stress: 4 },
  { id: "academy", name: "Academy", mono: "Ac", kind: "job", sub: "Certifications & development", up: ["Intelligence", "Spirit"], down: [], pay: 23 },
  { id: "maidcafe", name: "Maid Cafe", mono: "MC", kind: "job", sub: "Socialising & community", up: ["Charm", "Speech"], down: [], pay: 18, stress: -5 },
  { id: "checkpoint", name: "Checkpoint", mono: "Ch", kind: "job", sub: "Finance & admin", up: ["Intelligence", "Manners"], down: [], pay: 22, stress: 5 },
  { id: "tavern", name: "Tavern", mono: "Ta", kind: "job", sub: "Writing & publishing", up: ["Speech", "Sensitivity"], down: [], pay: 22, stress: 5 },
  { id: "holiday", name: "Free Time", mono: "☾", kind: "free", sub: "Gaming, trips, nothing at all", up: [], down: [] },
];

export const ACT = Object.fromEntries(ACTS.map((a) => [a.id, a]));

// Each class and job gets its own pictorial tile, inspired by the illustrated activity cards in Princess Maker.
export const ACT_IMAGES = {
  literature: "/activities/literature.webp",
  history: "/activities/history.webp",
  etiquette: "/activities/etiquette.webp",
  sword: "/activities/sword.webp",
  martial: "/activities/martial.webp",
  magic: "/activities/magic.webp",
  art: "/activities/art.webp",
  dance: "/activities/dance.webp",
  alchemy: "/activities/alchemy.webp",
  music: "/activities/music.webp",
  housework: "/activities/housework.webp",
  workshop: "/activities/workshop.webp",
  garden: "/activities/garden.webp",
  clothing: "/activities/clothing.webp",
  checkpoint: "/activities/checkpoint.webp",
  academy: "/activities/academy.webp",
  maidcafe: "/activities/maidcafe.webp",
  tavern: "/activities/tavern.webp",
  holiday: "/activities/holiday.webp",
};

/* Rules. Day marks: 0 unlogged, 1 missed, 2 did it, 3 big success.
   Rank comes from practice points: did it = 1, big success = 2. */
export const RANKS = ["D", "C", "B", "A", "S"];
export const RANK_PTS = [0, 25, 60, 100, 150];
export const MULT = { D: 1, C: 1.25, B: 1.5, A: 1.75, S: 2 };
export const DAYF = { 2: 1, 3: 1.5 }; // effort factor per day
export const PTS = { 2: 1, 3: 2 };
export const GAIN = { class: 5, job: 3 };
export const DROP = 2;
export const FEE = 15; // per full block; FEE is a placeholder until real class fees are known
export const STRESS = { class: 6, job: 10, free: -30 }; // per full block of worked days

export const DAYNAMES = { 1: "Missed", 2: "Did it", 3: "Big success" };

export const MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WHEN = ["Early", "Mid", "Late"];

export const STATUS_STYLE = {
  Body: { icon: "♥", line: "Strength grows through every adventure." },
  Mind: { icon: "✧", line: "A curious mind, always seeking new knowledge." },
  Society: { icon: "♛", line: "A thoughtful presence, growing more confident." },
  Arts: { icon: "❀", line: "Creativity and expression are flourishing." },
};
