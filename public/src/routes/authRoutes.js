"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authValidators_1 = __importDefault(require("../validators/authValidators"));
const authController_1 = __importDefault(require("../controllers/authController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const loggingMiddleware_1 = __importDefault(require("../middlewares/loggingMiddleware"));
const authRoutes = (0, express_1.Router)();
authRoutes.post("/signup", loggingMiddleware_1.default, authValidators_1.default.postSignUpValidator(), authController_1.default.postSignUp);
authRoutes.post("/signin", loggingMiddleware_1.default, authValidators_1.default.postSignInValidator(), authController_1.default.postSignIn);
authRoutes.get("/getme", loggingMiddleware_1.default, authMiddleware_1.default, authController_1.default.getMe);
authRoutes.post("/signout", authController_1.default.postSignOut);
exports.default = authRoutes;
