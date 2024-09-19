import { Router } from "express";
import {
  getNotifications,
  markNotificationAsRead,
  createNotification,
} from "../controllers/notificationController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const router = Router();

// Toutes les routes ici nécessitent une authentification
router.use(authenticateToken);

// Récupérer les notifications de l'utilisateur connecté
router.get("/", getNotifications);

// Marquer une notification comme lue
router.put("/:id/read", markNotificationAsRead);

// creation d'une nouvelle notification
router.post("/", createNotification);

export default router;
