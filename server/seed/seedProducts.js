// Catalogue de départ, utilisé pour remplir automatiquement la base
// MongoDB au tout premier démarrage (si elle est vide).
export const SEED_PRODUCTS = [
  { id: "zingzing", name: "Zing-Zing", desc: "Bâtonnet torsadé chocolat-vanille", pack: 24, unitPrice: 300, boxPrice: 7200, category: "barre", swatch: ["#8A5A38", "#F3E4D0"], imageUrl: "" },
  { id: "arad", name: "Arad", desc: "Vanille glacée, mini-perles et nappage chocolat", pack: 24, unitPrice: 650, boxPrice: 15600, category: "barre", swatch: ["#5C3A24", "#F3E4D0"], imageUrl: "" },
  { id: "cup-cacao", name: "Two Color Cup — Cacao-Vanille", desc: "Pot glacé bicolore cacao et vanille", pack: 60, unitPrice: 250, boxPrice: 15000, category: "pot", swatch: ["#5C3A24", "#F3E4D0"], imageUrl: "" },
  { id: "cup-fraise", name: "Two Color Cup — Fraise-Vanille", desc: "Pot glacé bicolore fraise et vanille", pack: 60, unitPrice: 250, boxPrice: 15000, category: "pot", swatch: ["#E9557B", "#F3E4D0"], imageUrl: "" },
  { id: "gaz", name: "Gaz Ice Cream", desc: "Bâtonnet vanille nappé de chocolat", pack: 24, unitPrice: 600, boxPrice: 14400, category: "baton", swatch: ["#F3E4D0", "#8A5A38"], imageUrl: "" },
  { id: "amiral", name: "Amiral", desc: "Vanille glacée nappée de chocolat", pack: 24, unitPrice: 650, boxPrice: 15600, category: "barre", swatch: ["#F3E4D0", "#4A2E1C"], imageUrl: "" },
  { id: "amiralplus", name: "Amiral+", desc: "Chocolat glacé nappé de chocolat", pack: 24, unitPrice: 650, boxPrice: 15600, category: "barre", swatch: ["#4A2E1C", "#2C1810"], imageUrl: "" },
  { id: "shirka-milky", name: "Shirka — Milky", desc: "Bâtonnet glacé au lait, tout doux", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#E7C88B", "#FBEFDD"], imageUrl: "" },
  { id: "shirka-choco", name: "Shirka — Chocolat", desc: "Bâtonnet glacé au chocolat", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#5C3A24", "#2C1810"], imageUrl: "" },
  { id: "saina-choco", name: "Saina — Chocolat", desc: "Bâtonnet chocolat nappé de chocolat", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#4A2E1C", "#2C1810"], imageUrl: "" },
  { id: "saina-vanille", name: "Saina — Vanille", desc: "Bâtonnet vanille nappé de chocolat", pack: 24, unitPrice: 250, boxPrice: 6000, category: "baton", swatch: ["#F3E4D0", "#8A5A38"], imageUrl: "" },
  { id: "sarin", name: "Sarin", desc: "Bâtonnet vanille nappé au concentré de fruit", pack: 24, unitPrice: 600, boxPrice: 14400, category: "baton", swatch: ["#E13A4B", "#F3E4D0"], imageUrl: "" }
];
