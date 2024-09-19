import { Router } from "express";
import { profileEditController } from "../controllers/profileController.js";

export const router = Router();

router.put("/update", profileEditController.updateProfile);
router.get("/", profileEditController.getProfile);

export default router;
