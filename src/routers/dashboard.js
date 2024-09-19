import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";

export const router = Router();

router.get("/", dashboardController.getDashboardData);

export default router;
