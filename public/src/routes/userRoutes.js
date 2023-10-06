"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loggingMiddleware_1 = __importDefault(require("../middlewares/loggingMiddleware"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRoutes = (0, express_1.Router)();
userRoutes.get("/getbookings", loggingMiddleware_1.default, authMiddleware_1.default, userController_1.default.getUserBookedTickets);
exports.default = userRoutes;
