"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (userObject) => {
    return jsonwebtoken_1.default.sign({ userObject }, "secretkey", {
        algorithm: "HS256",
        expiresIn: 3600,
    });
};
const decodedIncomingToken = (token) => {
    const decoded = jsonwebtoken_1.default.decode(token, { json: true });
    if (!decoded) {
        throw new Error("Auth Failed");
    }
    return decoded;
};
// returns true if token is expired
const isTokenExpired = (token) => {
    const decodedToken = decodedIncomingToken(token);
    const timeDecided = decodedToken.exp;
    const timeHappened = new Date().getTime() / 1000;
    if (timeHappened >= timeDecided) {
        return true;
    }
    return false;
};
const JWTService = {
    createToken,
    isTokenExpired,
    decodedIncomingToken,
};
exports.default = JWTService;
