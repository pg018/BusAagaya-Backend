import { Request, Response } from "express";
import { validationResult } from "express-validator";
import allServices from "../services/allServices";
import busCollection from "../models/busModel";
import {
  IBookBusSchema,
  IBusSchema,
  OutgoingBusDetails,
} from "../types/busTypes";
import bookBusCollection from "../models/bookBusModel";
import BusExtensions from "../extensions/BusExtensions";
import { generateErrorMessageJSON, getUTCDate } from "../helpers/constants";

const postAddBus = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(generateErrorMessageJSON(500, errors.array()[0].msg));
  }
  console.log("Validation Successful");
  try {
    // the person registering bus is bus office who is ultimately the bus owner
    const userId = allServices.JWTService.decodedIncomingToken(req.cookies.jwt)
      .userObject.userId;
    const {
      startTime, // date is already in iso8601 format from frontend
      busName,
      startLocation,
      busOperatorName,
      busOperatorNumber,
      noRows,
      noColumns,
      AfromLeft,
      stops,
      recurrence,
    } = req.body;
    const finalDetails: IBusSchema = {
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
    await new busCollection(finalDetails).save();
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const queryBuses = async (req: Request, res: Response) => {
  try {
    // user requirements for location
    const { startLocation, endLocation, travelDate } = req.body;
    // getting all the documents for the query
    const busInformation = await allServices.BusService.getQueriedDocuments(
      startLocation,
      endLocation,
      travelDate
    );
    if (!busInformation) {
      return res.status(404).json({ errorMessage: "Bus Not Found!" });
    }
    const finalBusInformation: OutgoingBusDetails[] = [];
    for (const bus of busInformation) {
      const finalBusId = bus._id.toString();
      const finalObj = BusExtensions.GetOutgoingObjectForBus(bus, finalBusId);
      // initial seat arrangement of the bus
      let initialSeats = allServices.BusService.GetInitialAvailableSeats(
        bus.noRows,
        bus.noColumns
      );
      finalObj.availableSeats = initialSeats;
      // getting the list of booked tickets of the bus
      const bookedTickets =
        await allServices.BusService.getAllBookedSeatNumbersForBus(
          finalBusId,
          startLocation,
          endLocation,
          travelDate
        );
      if (!bookedTickets) {
        finalBusInformation.push(finalObj);
        continue;
      }
      // filtering out the booked tickets and only keeping the unbooked tickets
      initialSeats = initialSeats.filter(
        (seat) => !bookedTickets.includes(seat)
      );
      finalObj.availableSeats = initialSeats;
      finalBusInformation.push(finalObj);
    }
    return res.status(200).json(finalBusInformation);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const reserveUserBooking = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(generateErrorMessageJSON(400, errors.array()[0].msg));
    }
    const {
      busId,
      startLocation,
      endLocation,
      passengerDetails,
      travelDate,
      destinationDate,
      totalCost,
    } = req.body;
    console.log(travelDate);
    const userId = allServices.JWTService.decodedIncomingToken(req.cookies.jwt)
      .userObject.userId;
    console.log("Final Object Made");
    const finalObject: IBookBusSchema = {
      busId,
      userId,
      travelDate: getUTCDate(travelDate),
      destinationDate: getUTCDate(destinationDate),
      startLocation,
      endLocation,
      passengerDetails,
      totalCost,
    };
    // getting all the tickets for the bus that are already reserved
    const bookedTickets =
      await allServices.BusService.getAllBookedSeatNumbersForBus(
        busId,
        startLocation,
        endLocation,
        travelDate
      );
    // checking if existing ticket already booked in case of parallel booking of different users
    for (const passenger of passengerDetails) {
      if (bookedTickets.includes(passenger.seatNumber)) {
        return res
          .status(422) // conflict
          .json({ errorMessage: "Ticket Not Available! Please book again" });
      }
    }
    console.log("Saving to database and making the changes");
    await new bookBusCollection(finalObject).save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const getBusProviderBuses = async (req: Request, res: Response) => {
  try {
    const userId = allServices.JWTService.decodedIncomingToken(req.cookies.jwt)
      .userObject.userId;
    const allBuses = await busCollection.find({ busOwnerId: userId });
    if (!allBuses) {
      return res.status(200).json([]);
    }
    const finalBusList =
      BusExtensions.GetOutgoingObjectForProviderBookings(allBuses);
    return res.status(200).json(finalBusList);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const busController = {
  postAddBus,
  queryBuses,
  reserveUserBooking,
  getBusProviderBuses,
};

export default busController;
