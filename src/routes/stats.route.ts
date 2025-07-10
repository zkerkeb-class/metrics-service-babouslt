import express from "express";
import { StatsController } from "../controllers/stats.controller";
import {
  authenticateToken,
  requireAdmin,
} from "../middlewares/auth.middleware";

const router = express.Router();

// Routes publiques (sans authentification) - décommentez si vous voulez sécuriser
router.use(authenticateToken);
router.use(requireAdmin);

// Route pour obtenir toutes les statistiques
router.get("/", StatsController.getStats);

// Route pour obtenir uniquement les statistiques des utilisateurs
router.get("/users", StatsController.getUserStats);

// Route pour obtenir uniquement les statistiques des analyses
router.get("/analyses", StatsController.getAnalysisStats);

// Route pour obtenir uniquement les statistiques des abonnements
router.get("/subscriptions", StatsController.getSubscriptionStats);

export default router;
