"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allServices_1 = __importDefault(require("../services/allServices"));
const bookBusModel_1 = __importDefault(require("../models/bookBusModel"));
const UserExtensions_1 = __importDefault(require("../extensions/UserExtensions"));
const constants_1 = require("../helpers/constants");
const getUserBookedTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = allServices_1.default.JWTService.decodedIncomingToken(req.cookies.jwt)
            .userObject.userId;
        const allBookings = yield bookBusModel_1.default
            .find({ userId })
            .populate("busId");
        console.log("Successfull retrieved the list of documents");
        if (!allBookings) {
            return res.status(200).json([]);
        }
        const finalList = UserExtensions_1.default.GetOutgoingBookingDetailsList(allBookings);
        return res.status(200).json(finalList);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const userController = {
    getUserBookedTickets,
};
exports.default = userController;
