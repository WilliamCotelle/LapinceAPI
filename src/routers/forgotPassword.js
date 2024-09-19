import { forgotPasswordController } from "../controllers/forgotPasswordController.js";
import { Router } from "express";

export const router = Router();

router.post("/forgot-password", forgotPasswordController.sendResetEmail);
router.post("/reset-password", forgotPasswordController.resetPassword);

export default router;
