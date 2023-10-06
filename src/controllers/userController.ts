import { Request, Response } from "express";
import allServices from "../services/allServices";
import bookBusCollection from "../models/bookBusModel";
import UserExtensions from "../extensions/UserExtensions";
import { generateErrorMessageJSON } from "../helpers/constants";

const getUserBookedTickets = async (req: Request, res: Response) => {
  try {
    const userId = allServices.JWTService.decodedIncomingToken(req.cookies.jwt)
      .userObject.userId;
    const allBookings = await bookBusCollection
      .find({ userId })
      .populate("busId");
    console.log("Successfull retrieved the list of documents");
    if (!allBookings) {
      return res.status(200).json([]);
    }
    const finalList = UserExtensions.GetOutgoingBookingDetailsList(allBookings);
    return res.status(200).json(finalList);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const userController = {
  getUserBookedTickets,
};

export default userController;
