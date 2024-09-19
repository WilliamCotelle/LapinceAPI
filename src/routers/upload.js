import { Router } from "express";
import { profileEditController } from "../controllers/profileController.js";
import { upload } from "../middlewares/uploadMiddleware.js"; // Middleware pour multer

export const router = Router();

// Route pour uploader la photo de profil
router.post(
  "/",
  upload.single("profilePhoto"),
  profileEditController.uploadProfilePhoto
);

export default router;
