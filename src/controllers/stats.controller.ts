import { Request, Response } from "express";
import { User } from "../models/user.model";
import MedicalAnalysis from "../models/medicalAnalysis.model";
import { Subscription } from "../models/subscription.model";

export class StatsController {
  // Obtenir toutes les statistiques
  static async getStats(req: Request, res: Response) {
    try {
      // Compter le nombre total d'utilisateurs
      const totalUsers = await User.countDocuments();

      // Compter le nombre total d'analyses
      const totalAnalyses = await MedicalAnalysis.countDocuments();

      // Compter les analyses des dernières 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const analysesLast24h = await MedicalAnalysis.countDocuments({
        createdAt: { $gte: twentyFourHoursAgo },
      });

      // Compter les abonnements actifs (status: active, trialing, past_due)
      const activeSubscriptions = await Subscription.countDocuments({
        status: { $in: ["active", "trialing", "past_due"] },
      });

      // Statistiques détaillées des abonnements par statut
      const subscriptionStats = await Subscription.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Utilisateurs premium vs gratuits
      const premiumUsers = await User.countDocuments({ isPremium: true });
      const freeUsers = await User.countDocuments({ isPremium: false });

      // Statistiques des analyses par jour (7 derniers jours)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const analysesByDay = await MedicalAnalysis.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const stats = {
        users: {
          total: totalUsers,
          premium: premiumUsers,
          free: freeUsers,
        },
        analyses: {
          total: totalAnalyses,
          last24h: analysesLast24h,
          last7Days: analysesByDay,
        },
        subscriptions: {
          active: activeSubscriptions,
          byStatus: subscriptionStats,
        },
        timestamp: new Date(),
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // Obtenir uniquement les statistiques des utilisateurs
  static async getUserStats(req: Request, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const premiumUsers = await User.countDocuments({ isPremium: true });
      const freeUsers = await User.countDocuments({ isPremium: false });

      // Nouveaux utilisateurs des dernières 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newUsers24h = await User.countDocuments({
        createdAt: { $gte: twentyFourHoursAgo },
      });

      // Nouveaux utilisateurs des 7 derniers jours
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newUsers7Days = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      });

      res.status(200).json({
        success: true,
        data: {
          total: totalUsers,
          premium: premiumUsers,
          free: freeUsers,
          newLast24h: newUsers24h,
          newLast7Days: newUsers7Days,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques utilisateurs:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques utilisateurs",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // Obtenir uniquement les statistiques des analyses
  static async getAnalysisStats(req: Request, res: Response) {
    try {
      const totalAnalyses = await MedicalAnalysis.countDocuments();

      // Analyses des dernières 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const analysesLast24h = await MedicalAnalysis.countDocuments({
        createdAt: { $gte: twentyFourHoursAgo },
      });

      // Analyses des 7 derniers jours
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const analysesLast7Days = await MedicalAnalysis.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      });

      // Statistiques par jour (7 derniers jours)
      const analysesByDay = await MedicalAnalysis.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.status(200).json({
        success: true,
        data: {
          total: totalAnalyses,
          last24h: analysesLast24h,
          last7Days: analysesLast7Days,
          byDay: analysesByDay,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques d'analyses:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques d'analyses",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // Obtenir uniquement les statistiques des abonnements
  static async getSubscriptionStats(req: Request, res: Response) {
    try {
      const activeSubscriptions = await Subscription.countDocuments({
        status: { $in: ["active", "trialing", "past_due"] },
      });

      const totalSubscriptions = await Subscription.countDocuments();

      // Statistiques détaillées par statut
      const subscriptionStats = await Subscription.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      // Abonnements créés dans les dernières 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newSubscriptions24h = await Subscription.countDocuments({
        createdAt: { $gte: twentyFourHoursAgo },
      });

      res.status(200).json({
        success: true,
        data: {
          active: activeSubscriptions,
          total: totalSubscriptions,
          byStatus: subscriptionStats,
          newLast24h: newSubscriptions24h,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques d'abonnements:",
        error
      );
      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la récupération des statistiques d'abonnements",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }
}
