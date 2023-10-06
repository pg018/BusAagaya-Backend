"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const constants_1 = require("../helpers/constants");
const postAddBusValidator = () => {
    return [
        (0, express_validator_1.body)("busName", "Enter Valid Bus Name")
            .exists({ checkFalsy: true, checkNull: true })
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("startTime", "Enter Valid Start Time")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isISO8601(),
        (0, express_validator_1.body)("startLocation", "Enter Valid Start Location")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .trim()
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("busOperatorName", "Enter Valid Bus Operator Name")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .trim()
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("busOperatorNumber", "Enter Valid Bus Operator Number")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isMobilePhone("en-IN"),
        (0, express_validator_1.body)("noRows", "Enter Valid Number of Rows")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .trim()
            .isNumeric(),
        (0, express_validator_1.body)("noColumns", "Enter Valid Number of Columns")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .trim()
            .isNumeric(),
        (0, express_validator_1.body)("AfromLeft", "Enter Valid A from Left")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isBoolean(),
        (0, express_validator_1.body)("stops", "Enter Valid Stops")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isArray()
            .custom((val, { req }) => {
            for (const stop of val) {
                if (typeof stop.stopName !== "string" ||
                    typeof stop.order !== "number" ||
                    isNaN(new Date(stop.time).getTime()) ||
                    typeof stop.cost !== "number") {
                    throw new Error("Invalid Stops Format");
                }
            }
            return true;
        }),
        (0, express_validator_1.body)("recurrence", "Enter Valid Recurrences")
            .isArray()
            .custom((val) => {
            console.log("her");
            for (const recur of val) {
                if (!constants_1.recurrencesList.includes(recur)) {
                    throw new Error("Invalid Recurrence Input");
                }
            }
            return true;
        }),
    ];
};
const getQueryBusesValidator = () => {
    return [
        (0, express_validator_1.body)("startLocation", "Enter Valid Start Location")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("endLocation", "Enter Valid End Location")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("travelDate", "Enter Valid Travel Date").toDate().isISO8601(),
    ];
};
const postReserveBookingValidator = () => {
    return [
        (0, express_validator_1.body)("busId", "Enter Valid Bus Id")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isMongoId(),
        (0, express_validator_1.body)("passengerDetails", "Enter Valid Passenger Details")
            .isArray()
            .custom((val) => {
            for (const passenger of val) {
                if (!(0, constants_1.isStringAlpha)(passenger.passengerName) ||
                    !(0, constants_1.isStringNumeric)(passenger.passengerAge) ||
                    typeof passenger.seatNumber !== "string") {
                    throw new Error("Invalid Format of Passenger Details!");
                }
                return true;
            }
        }),
        (0, express_validator_1.body)("startLocation", "Enter Valid Start Location")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("endLocation", "Enter Valid End Location")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("travelDate", "Enter Valid Travel Date")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .toDate()
            .isISO8601(),
        (0, express_validator_1.body)("travelDate", "Enter Valid Destination Date")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .toDate()
            .isISO8601(),
        (0, express_validator_1.body)("totalCost", "Enter Valid Total Cost")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isNumeric(),
    ];
};
const busValidators = {
    postAddBusValidator,
    getQueryBusesValidator,
    postReserveBookingValidator,
};
exports.default = busValidators;
