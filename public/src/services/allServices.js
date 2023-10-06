"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BusService_1 = __importDefault(require("./servicesList/BusService"));
const JWTService_1 = __importDefault(require("./servicesList/JWTService"));
const passwordService_1 = __importDefault(require("./servicesList/passwordService"));
const allServices = {
    passwordService: passwordService_1.default,
    JWTService: JWTService_1.default,
    BusService: BusService_1.default,
};
exports.default = allServices;
