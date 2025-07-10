import express from "express";
import statsRoutes from "./stats.route";

const router = express.Router();

// Routes pour les statistiques
router.use("/stats", statsRoutes);

// Route de test pour vérifier que l'API fonctionne
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AuthService copy API is running",
    timestamp: new Date(),
  });
});

export default router;
