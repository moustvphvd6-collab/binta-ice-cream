import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { SEED_PRODUCTS } from "../seed/seedProducts.js";

const router = Router();

/**
 * GET /api/products
 * Public — retourne tous les produits.
 * Si la base est vide (premier lancement), elle est automatiquement
 * remplie avec le catalogue de départ (SEED_PRODUCTS).
 */
router.get("/", async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: 1 });
    if (products.length === 0) {
      await Product.insertMany(SEED_PRODUCTS);
      products = await Product.find().sort({ createdAt: 1 });
    }
    res.json(products);
  } catch (err) {
    console.error("Erreur GET /products", err);
    res.status(500).json({ message: "Erreur serveur lors de la lecture des produits." });
  }
});

/**
 * POST /api/products
 * Protégé — crée un nouveau produit.
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { id, name, desc, category, pack, unitPrice, boxPrice, swatch, imageUrl } = req.body;
    if (!id || !name || !desc || !category || !pack || unitPrice == null || boxPrice == null) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }
    const exists = await Product.findOne({ id });
    if (exists) {
      return res.status(409).json({ message: "Un produit avec cet identifiant existe déjà." });
    }
    const product = await Product.create({ id, name, desc, category, pack, unitPrice, boxPrice, swatch, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    console.error("Erreur POST /products", err);
    res.status(400).json({ message: err.message || "Impossible de créer le produit." });
  }
});

/**
 * PUT /api/products/:id
 * Protégé — met à jour un produit existant.
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Produit introuvable." });
    res.json(product);
  } catch (err) {
    console.error("Erreur PUT /products/:id", err);
    res.status(400).json({ message: err.message || "Impossible de modifier le produit." });
  }
});

/**
 * DELETE /api/products/:id
 * Protégé — supprime un produit.
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Produit introuvable." });
    res.json({ ok: true });
  } catch (err) {
    console.error("Erreur DELETE /products/:id", err);
    res.status(400).json({ message: err.message || "Impossible de supprimer le produit." });
  }
});

export default router;
