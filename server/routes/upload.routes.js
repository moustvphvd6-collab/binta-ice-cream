import { Router } from "express";
import streamifier from "streamifier";
import cloudinary, { isCloudinaryReady } from "../config/cloudinary.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

/**
 * POST /api/upload
 * Protégé — reçoit un fichier (champ "image"), l'envoie sur Cloudinary,
 * et renvoie son URL publique (à stocker ensuite dans le produit).
 */
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!isCloudinaryReady()) {
    return res.status(500).json({
      message: "Cloudinary n'est pas configuré (voir CLOUDINARY_* dans le fichier .env du serveur)."
    });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Aucune image reçue." });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "binta-ice-cream/products" },
        (err, uploadResult) => (err ? reject(err) : resolve(uploadResult))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Erreur upload Cloudinary", err);
    res.status(500).json({ message: "Échec de l'upload de l'image sur Cloudinary." });
  }
});

export default router;
