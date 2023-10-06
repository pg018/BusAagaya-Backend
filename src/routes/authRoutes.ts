import { Router } from "express";
import authValidators from "../validators/authValidators";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";
import loggingMiddleware from "../middlewares/loggingMiddleware";

const authRoutes = Router();

authRoutes.post(
  "/signup",
  loggingMiddleware,
  authValidators.postSignUpValidator(),
  authController.postSignUp
);

authRoutes.post(
  "/signin",
  loggingMiddleware,
  authValidators.postSignInValidator(),
  authController.postSignIn
);

authRoutes.get(
  "/getme",
  loggingMiddleware,
  authMiddleware,
  authController.getMe
);

authRoutes.post("/signout", authController.postSignOut);

export default authRoutes;
