import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

export const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
