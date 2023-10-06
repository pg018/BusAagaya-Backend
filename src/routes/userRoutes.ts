import { Router } from "express";
import loggingMiddleware from "../middlewares/loggingMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

const userRoutes = Router();

userRoutes.get(
  "/getbookings",
  loggingMiddleware,
  authMiddleware,
  userController.getUserBookedTickets
);

export default userRoutes;
