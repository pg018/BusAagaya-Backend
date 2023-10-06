import { Router } from "express";
import busController from "../controllers/BusController";
import busValidators from "../validators/busValidators";
import authMiddleware from "../middlewares/authMiddleware";
import busOwnerMiddleware from "../middlewares/busOwnerMiddleware";
import loggingMiddleware from "../middlewares/loggingMiddleware";

const busRoutes = Router();

busRoutes.post(
  "/addbus",
  loggingMiddleware,
  busValidators.postAddBusValidator(),
  authMiddleware,
  busOwnerMiddleware,
  busController.postAddBus
);

busRoutes.post(
  "/getquerybus",
  loggingMiddleware,
  busValidators.getQueryBusesValidator(),
  busController.queryBuses
);

busRoutes.post(
  "/reservebus",
  loggingMiddleware,
  busValidators.postReserveBookingValidator(),
  authMiddleware,
  busController.reserveUserBooking
);

busRoutes.get(
  "/getproviderbookings",
  loggingMiddleware,
  authMiddleware,
  busOwnerMiddleware,
  busController.getBusProviderBuses
);

export default busRoutes;
