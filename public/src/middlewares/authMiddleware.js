"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allServices_1 = __importDefault(require("../services/allServices"));
const authMiddleware = (req, res, next) => {
    try {
        const jwtCookie = req.cookies.jwt;
        if (!jwtCookie) {
            console.log("JWT Cookie does not exist");
            return res.sendStatus(401);
        }
        // if decoded token is incorrect, will throw error
        const isTokenExpire = allServices_1.default.JWTService.isTokenExpired(jwtCookie);
        if (isTokenExpire) {
            // token has expired, as it has exceeded the alloted time
            console.log("Token Expired");
            res.clearCookie("jwt");
            return res.sendStatus(401);
        }
        // auth success, moving to next function in the route chain
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(401);
    }
};
exports.default = authMiddleware;
