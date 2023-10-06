import { body } from "express-validator";
import {
  isStringAlpha,
  isStringNumeric,
  recurrencesList,
} from "../helpers/constants";

const postAddBusValidator = () => {
  return [
    body("busName", "Enter Valid Bus Name")
      .exists({ checkFalsy: true, checkNull: true })
      .isLength({ min: 3 }),
    body("startTime", "Enter Valid Start Time")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isISO8601(), // date format
    body("startLocation", "Enter Valid Start Location")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isString()
      .trim()
      .isLength({ min: 3 }),
    body("busOperatorName", "Enter Valid Bus Operator Name")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isString()
      .trim()
      .isLength({ min: 3 }),
    body("busOperatorNumber", "Enter Valid Bus Operator Number")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isMobilePhone("en-IN"),
    body("noRows", "Enter Valid Number of Rows")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .trim()
      .isNumeric(),
    body("noColumns", "Enter Valid Number of Columns")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .trim()
      .isNumeric(),
    body("AfromLeft", "Enter Valid A from Left")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isBoolean(),
    body("stops", "Enter Valid Stops")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isArray()
      .custom((val, { req }) => {
        for (const stop of val) {
          if (
            typeof stop.stopName !== "string" ||
            typeof stop.order !== "number" ||
            isNaN(new Date(stop.time).getTime()) ||
            typeof stop.cost !== "number"
          ) {
            throw new Error("Invalid Stops Format");
          }
        }
        return true;
      }),
    body("recurrence", "Enter Valid Recurrences")
      .isArray()
      .custom((val) => {
        console.log("her");
        for (const recur of val) {
          if (!recurrencesList.includes(recur)) {
            throw new Error("Invalid Recurrence Input");
          }
        }
        return true;
      }),
  ];
};

const getQueryBusesValidator = () => {
  return [
    body("startLocation", "Enter Valid Start Location")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isString()
      .isLength({ min: 3 }),
    body("endLocation", "Enter Valid End Location")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isString()
      .isLength({ min: 3 }),
    body("travelDate", "Enter Valid Travel Date").toDate().isISO8601(),
  ];
};

const postReserveBookingValidator = () => {
  return [
    body("busId", "Enter Valid Bus Id")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isMongoId(),
    body("passengerDetails", "Enter Valid Passenger Details")
      .isArray()
      .custom((val) => {
        for (const passenger of val) {
          if (
            !isStringAlpha(passenger.passengerName) ||
            !isStringNumeric(passenger.passengerAge) ||
            typeof passenger.seatNumber !== "string"
          ) {
            throw new Error("Invalid Format of Passenger Details!");
          }
          return true;
        }
      }),
    body("startLocation", "Enter Valid Start Location")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isString()
      .isLength({ min: 3 }),
    body("endLocation", "Enter Valid End Location")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isString()
      .isLength({ min: 3 }),
    body("travelDate", "Enter Valid Travel Date")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .toDate()
      .isISO8601(),
    body("travelDate", "Enter Valid Destination Date")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .toDate()
      .isISO8601(),
    body("totalCost", "Enter Valid Total Cost")
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

export default busValidators;
