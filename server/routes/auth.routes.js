import { Router } from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * POST /api/auth/login
 * Compare l'email/mot de passe envoyés à ceux définis dans le .env
 * (ADMIN_EMAIL / ADMIN_PASSWORD). Il n'y a qu'un seul compte admin,
 * il n'y a pas de page d'inscription — c'est voulu, pour la sécurité.
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  const validEmail = email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const validPassword = password === process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, email });
});

/**
 * GET /api/auth/me
 * Protégé — permet au frontend de vérifier qu'un token est toujours valide.
 */
router.get("/me", requireAuth, (req, res) => {
  res.json({ email: req.admin.email });
});

export default router;
