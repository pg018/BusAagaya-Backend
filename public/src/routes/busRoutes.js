"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BusController_1 = __importDefault(require("../controllers/BusController"));
const busValidators_1 = __importDefault(require("../validators/busValidators"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const busOwnerMiddleware_1 = __importDefault(require("../middlewares/busOwnerMiddleware"));
const loggingMiddleware_1 = __importDefault(require("../middlewares/loggingMiddleware"));
const busRoutes = (0, express_1.Router)();
busRoutes.post("/addbus", loggingMiddleware_1.default, busValidators_1.default.postAddBusValidator(), authMiddleware_1.default, busOwnerMiddleware_1.default, BusController_1.default.postAddBus);
busRoutes.post("/getquerybus", loggingMiddleware_1.default, busValidators_1.default.getQueryBusesValidator(), BusController_1.default.queryBuses);
busRoutes.post("/reservebus", loggingMiddleware_1.default, busValidators_1.default.postReserveBookingValidator(), authMiddleware_1.default, BusController_1.default.reserveUserBooking);
busRoutes.get("/getproviderbookings", loggingMiddleware_1.default, authMiddleware_1.default, busOwnerMiddleware_1.default, BusController_1.default.getBusProviderBuses);
exports.default = busRoutes;
