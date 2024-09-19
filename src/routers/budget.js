import { Router } from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetsByAccount,
} from "../controllers/budgetController.js";

export const router = Router();

router.post("/", createBudget);
router.get("/", getAllBudgets);
router.get("/:accountId", getBudgetsByAccount);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
