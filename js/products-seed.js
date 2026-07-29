/* ============ Icônes par catégorie (SVG inline, monochrome) ============ */
export const ICONS = {
  baton: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="4" width="16" height="38" rx="6" fill="#fff" fill-opacity="0.95"/>
    <rect x="29" y="40" width="6" height="20" rx="3" fill="#fff" fill-opacity="0.75"/>
  </svg>`,
  barre: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="22" width="40" height="20" rx="6" fill="#fff" fill-opacity="0.95"/>
    <path d="M12 26L4 22V42L12 38V26Z" fill="#fff" fill-opacity="0.75"/>
    <path d="M52 26L60 22V42L52 38V26Z" fill="#fff" fill-opacity="0.75"/>
  </svg>`,
  pot: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 24H48L44 52C43.6 55 41 57 38 57H26C23 57 20.4 55 20 52L16 24Z" fill="#fff" fill-opacity="0.95"/>
    <ellipse cx="32" cy="23" rx="17" ry="6" fill="#fff" fill-opacity="0.85"/>
    <path d="M25 12C25 12 27 16 32 16C37 16 39 12 39 12" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-opacity="0.85"/>
  </svg>`
};

export const CATEGORY_LABEL = { baton: "Bâtonnet", barre: "Barre enveloppée", pot: "Pot / Cup" };

/* ============ Catalogue initial (sert aussi de secours si Firebase est hors-ligne) ============ */
export const SEED_PRODUCTS = [
  { id: "zingzing", name: "Zing-Zing", desc: "Bâtonnet torsadé chocolat-vanille", pack: 24, unitPrice: 300, boxPrice: 7200, category: "barre", swatch: ["#8A5A38", "#F3E4D0"], imageUrl: "" },
  { id: "arad", name: "Arad", desc: "Vanille glacée, mini-perles et nappage chocolat", pack: 24, unitPrice: 650, boxPrice: 15600, category: "barre", swatch: ["#5C3A24", "#F3E4D0"], imageUrl: "" },
  { id: "cup-cacao", name: "Two Color Cup — Cacao-Vanille", desc: "Pot glacé bicolore cacao et vanille", pack: 60, unitPrice: 250, boxPrice: 15000, category: "pot", swatch: ["#5C3A24", "#F3E4D0"], imageUrl: "" },
  { id: "cup-fraise", name: "Two Color Cup — Fraise-Vanille", desc: "Pot glacé bicolore fraise et vanille", pack: 60, unitPrice: 250, boxPrice: 15000, category: "pot", swatch: ["#E9557B", "#F3E4D0"], imageUrl: "" },
  { id: "gaz", name: "Gaz Ice Cream", desc: "Bâtonnet vanille nappé de chocolat", pack: 24, unitPrice: 600, boxPrice: 14400, category: "baton", swatch: ["#F3E4D0", "#8A5A38"], imageUrl: "img/gaz.png" },
  { id: "amiral", name: "Amiral", desc: "Vanille glacée nappée de chocolat", pack: 24, unitPrice: 650, boxPrice: 15600, category: "barre", swatch: ["#F3E4D0", "#4A2E1C"], imageUrl: "" },
  { id: "amiralplus", name: "Amiral+", desc: "Chocolat glacé nappé de chocolat", pack: 24, unitPrice: 650, boxPrice: 15600, category: "barre", swatch: ["#4A2E1C", "#2C1810"], imageUrl: "" },
  { id: "shirka-milky", name: "Shirka — Milky", desc: "Bâtonnet glacé au lait, tout doux", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#E7C88B", "#FBEFDD"], imageUrl: "" },
  { id: "shirka-choco", name: "Shirka — Chocolat", desc: "Bâtonnet glacé au chocolat", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#5C3A24", "#2C1810"], imageUrl: "" },
  { id: "saina-choco", name: "Saina — Chocolat", desc: "Bâtonnet chocolat nappé de chocolat", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#4A2E1C", "#2C1810"], imageUrl: "" },
  { id: "saina-vanille", name: "Saina — Vanille", desc: "Bâtonnet vanille nappé de chocolat", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#F3E4D0", "#8A5A38"], imageUrl: "" },
  { id: "sarin", name: "Sarin", desc: "Bâtonnet vanille nappé au concentré de fruit", pack: 24, unitPrice: 600, boxPrice: 14400, category: "baton", swatch: ["#E13A4B", "#F3E4D0"], imageUrl: "" }
];
// , swatch: ["#F3E4D0", "#8A5A38"]