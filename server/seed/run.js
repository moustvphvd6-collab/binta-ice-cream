import "dotenv/config";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import { SEED_PRODUCTS } from "./seedProducts.js";

async function run() {
  await connectDB();
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`ℹ️  La base contient déjà ${count} produit(s). Rien n'a été modifié.`);
    console.log("   Pour repartir de zéro, supprimez d'abord la collection 'products' dans Atlas.");
  } else {
    await Product.insertMany(SEED_PRODUCTS);
    console.log(`✅ ${SEED_PRODUCTS.length} produits insérés dans MongoDB.`);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Erreur pendant le seed :", err);
  process.exit(1);
});
