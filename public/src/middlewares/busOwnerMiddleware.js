"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allServices_1 = __importDefault(require("../services/allServices"));
const UserTypeEnums_1 = require("../enums/UserTypeEnums");
const constants_1 = require("../helpers/constants");
const busOwnerMiddleware = (req, res, next) => {
    try {
        const storedData = allServices_1.default.JWTService.decodedIncomingToken(req.cookies.jwt);
        console.log("In Bus Middleware");
        if (storedData.userObject.type !== UserTypeEnums_1.UserTypeEnum.BusOffice) {
            return res
                .status(401)
                .json((0, constants_1.generateErrorMessageJSON)(401, "Unauthorized Access"));
        }
        next();
    }
    catch (error) {
        console.log("Error in Bus Owner Middleare");
        return res
            .status(401)
            .json((0, constants_1.generateErrorMessageJSON)(401, "Unauthorized Access"));
    }
};
exports.default = busOwnerMiddleware;
