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
const express_validator_1 = require("express-validator");
const allServices_1 = __importDefault(require("../services/allServices"));
const busModel_1 = __importDefault(require("../models/busModel"));
const bookBusModel_1 = __importDefault(require("../models/bookBusModel"));
const BusExtensions_1 = __importDefault(require("../extensions/BusExtensions"));
const constants_1 = require("../helpers/constants");
const postAddBus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json((0, constants_1.generateErrorMessageJSON)(500, errors.array()[0].msg));
    }
    console.log("Validation Successful");
    try {
        // the person registering bus is bus office who is ultimately the bus owner
        const userId = allServices_1.default.JWTService.decodedIncomingToken(req.cookies.jwt)
            .userObject.userId;
        const { startTime, // date is already in iso8601 format from frontend
        busName, startLocation, busOperatorName, busOperatorNumber, noRows, noColumns, AfromLeft, stops, recurrence, } = req.body;
        const finalDetails = {
            busOwnerId: userId,
            busName: busName,
            startTime,
            startLocation,
            busOperatorName,
            busOperatorNumber,
            noRows,
            noColumns,
            AfromLeft,
            stops,
            recurrence,
        };
        console.log(finalDetails);
        console.log("Saving the document");
        yield new busModel_1.default(finalDetails).save();
        return res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const queryBuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // user requirements for location
        const { startLocation, endLocation, travelDate } = req.body;
        // getting all the documents for the query
        const busInformation = yield allServices_1.default.BusService.getQueriedDocuments(startLocation, endLocation, travelDate);
        if (!busInformation) {
            return res.status(404).json({ errorMessage: "Bus Not Found!" });
        }
        const finalBusInformation = [];
        for (const bus of busInformation) {
            const finalBusId = bus._id.toString();
            const finalObj = BusExtensions_1.default.GetOutgoingObjectForBus(bus, finalBusId);
            // initial seat arrangement of the bus
            let initialSeats = allServices_1.default.BusService.GetInitialAvailableSeats(bus.noRows, bus.noColumns);
            finalObj.availableSeats = initialSeats;
            // getting the list of booked tickets of the bus
            const bookedTickets = yield allServices_1.default.BusService.getAllBookedSeatNumbersForBus(finalBusId, startLocation, endLocation, travelDate);
            if (!bookedTickets) {
                finalBusInformation.push(finalObj);
                continue;
            }
            // filtering out the booked tickets and only keeping the unbooked tickets
            initialSeats = initialSeats.filter((seat) => !bookedTickets.includes(seat));
            finalObj.availableSeats = initialSeats;
            finalBusInformation.push(finalObj);
        }
        return res.status(200).json(finalBusInformation);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const reserveUserBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json((0, constants_1.generateErrorMessageJSON)(400, errors.array()[0].msg));
        }
        const { busId, startLocation, endLocation, passengerDetails, travelDate, destinationDate, totalCost, } = req.body;
        console.log(travelDate);
        const userId = allServices_1.default.JWTService.decodedIncomingToken(req.cookies.jwt)
            .userObject.userId;
        console.log("Final Object Made");
        const finalObject = {
            busId,
            userId,
            travelDate: (0, constants_1.getUTCDate)(travelDate),
            destinationDate: (0, constants_1.getUTCDate)(destinationDate),
            startLocation,
            endLocation,
            passengerDetails,
            totalCost,
        };
        // getting all the tickets for the bus that are already reserved
        const bookedTickets = yield allServices_1.default.BusService.getAllBookedSeatNumbersForBus(busId, startLocation, endLocation, travelDate);
        // checking if existing ticket already booked in case of parallel booking of different users
        for (const passenger of passengerDetails) {
            if (bookedTickets.includes(passenger.seatNumber)) {
                return res
                    .status(422) // conflict
                    .json({ errorMessage: "Ticket Not Available! Please book again" });
            }
        }
        console.log("Saving to database and making the changes");
        yield new bookBusModel_1.default(finalObject).save();
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const getBusProviderBuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = allServices_1.default.JWTService.decodedIncomingToken(req.cookies.jwt)
            .userObject.userId;
        const allBuses = yield busModel_1.default.find({ busOwnerId: userId });
        if (!allBuses) {
            return res.status(200).json([]);
        }
        const finalBusList = BusExtensions_1.default.GetOutgoingObjectForProviderBookings(allBuses);
        return res.status(200).json(finalBusList);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const busController = {
    postAddBus,
    queryBuses,
    reserveUserBooking,
    getBusProviderBuses,
};
exports.default = busController;
