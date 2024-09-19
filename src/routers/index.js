import { Router } from "express";
import { router as userRouter } from "./user.js";
import { router as transactionRouter } from "./transaction.js";
import { router as budgetRouter } from "./budget.js";
import { router as categoryRouter } from "./category.js";
import { router as bankAccountRouter } from "./bankAccount.js";
import { router as dashboardRouter } from "./dashboard.js";
import { router as profileRouter } from "./profile.js";
import { router as uploadRouter } from "./upload.js";
import { router as forgotPasswordRouter } from "./forgotPassword.js";
import { router as notificationRouter } from "./notification.js";
import {
  authenticateToken,
  ensureNotAuthenticated,
} from "../middlewares/authenticateToken.js";

export const router = Router();

// Routes publiques
router.use("/user", ensureNotAuthenticated, userRouter);
router.use("/", forgotPasswordRouter);

// Applique le middleware d'authentification à toutes les routes suivantes
router.use(authenticateToken);

// Routes privées
router.use("/transactions", transactionRouter);
router.use("/budget", budgetRouter);
router.use("/bank-accounts", bankAccountRouter);
router.use("/category", categoryRouter);
router.use("/dashboard", dashboardRouter);
router.use("/profile", profileRouter);
router.use("/upload", uploadRouter);
router.use("/notifications", notificationRouter);

export default router;
