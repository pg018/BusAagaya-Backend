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
const bookBusModel_1 = __importDefault(require("../../models/bookBusModel"));
const busModel_1 = __importDefault(require("../../models/busModel"));
// returns the matrix of seats in order based on no. of rows and columns
const GetInitialAvailableSeats = (noRows, noColumns) => {
    const finalArray = [];
    // for each row
    for (let i = 1; i <= noRows; i++) {
        // for each column
        for (let j = 1; j <= noColumns; j++) {
            finalArray.push(`${i}${String.fromCharCode(64 + j)}`);
        }
    }
    return finalArray;
};
// getting all the booked ticket documents that are booked between two destinations which includes the tickets
const getBookedTicketsForBus = (busId, startLocation, endLocation, travelDate) => __awaiter(void 0, void 0, void 0, function* () {
    // booked on stops between them also
    travelDate.setHours(0, 0, 0, 0);
    return yield bookBusModel_1.default.find({
        busId,
        travelDate: { $gte: travelDate },
        $or: [
            {
                $and: [{ startLocation }, { endLocation }],
            },
            {
                $and: [{ startLocation }, { endLocation: { $ne: endLocation } }],
            },
            {
                $and: [{ startLocation: { $ne: startLocation } }, { endLocation }],
            },
        ],
    });
});
// returns the list of booked seats for a given bus from start to end location
const getAllBookedSeatNumbersForBus = (busId, startLocation, endLocation, travelDate) => __awaiter(void 0, void 0, void 0, function* () {
    // getting the tickets booked
    const tickets = yield getBookedTicketsForBus(busId, startLocation, endLocation, travelDate);
    if (!tickets) {
        return [];
    }
    // getting all the seat numbers that are already reserved
    let finalArray = [];
    for (const ticket of tickets) {
        const seatNumbers = ticket.passengerDetails.map((passenger) => passenger.seatNumber);
        finalArray = [...finalArray, ...seatNumbers];
    }
    return finalArray;
});
const getQueriedDocuments = (startLocation, endLocation, travelDate) => __awaiter(void 0, void 0, void 0, function* () {
    const busInformation = yield busModel_1.default.aggregate([
        {
            $match: {
                $or: [
                    {
                        $and: [
                            { startLocation: startLocation },
                            {
                                startTime: {
                                    $gte: new Date(travelDate),
                                    $lt: new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)),
                                },
                            },
                        ],
                    },
                    {
                        $and: [
                            { "stops.stopName": startLocation },
                            {
                                "stops.time": {
                                    $gte: new Date(travelDate),
                                    $lt: new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1)),
                                },
                            },
                        ],
                    },
                ],
                $and: [{ "stops.stopName": endLocation }],
            },
        },
        {
            $addFields: {
                startLocationOrder: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$stops",
                                as: "stop",
                                cond: { $eq: ["$$stop.stopName", startLocation] },
                            },
                        },
                        0,
                    ],
                },
                endLocationOrder: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$stops",
                                as: "stop",
                                cond: { $eq: ["$$stop.stopName", endLocation] },
                            },
                        },
                        0,
                    ],
                },
            },
        },
        {
            $match: {
                $expr: {
                    $lt: ["$startLocationOrder.order", "$endLocationOrder.order"],
                },
            },
        },
    ]);
    return busInformation;
});
const BusService = {
    GetInitialAvailableSeats,
    getBookedTicketsForBus,
    getAllBookedSeatNumbersForBus,
    getQueriedDocuments,
};
exports.default = BusService;
