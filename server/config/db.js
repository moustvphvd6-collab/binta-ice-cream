import mongoose from "mongoose";

export default async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI manquant dans le fichier .env — voir .env.example");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ Connecté à MongoDB");
  } catch (err) {
    console.error("❌ Impossible de se connecter à MongoDB :", err.message);
    process.exit(1);
  }
}
