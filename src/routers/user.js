import { Router } from "express";
import { userController } from "../controllers/userController.js";
import {
  createValidationMiddleware,
  signUpSchema,
  signInSchema,
} from "../validation/schemas.js";

export const router = Router();

router.post(
  "/register",
  createValidationMiddleware(signUpSchema, "body"),
  userController.signup
);
router.post(
  "/login",
  createValidationMiddleware(signInSchema, "body"),
  userController.signIn
);

export default router;
