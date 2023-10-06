import { Request, NextFunction, Response } from "express";
import allServices from "../services/allServices";
import { UserTypeEnum } from "../enums/UserTypeEnums";
import { generateErrorMessageJSON } from "../helpers/constants";

const busOwnerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storedData = allServices.JWTService.decodedIncomingToken(
      req.cookies.jwt
    );
    console.log("In Bus Middleware");
    if (storedData.userObject.type !== UserTypeEnum.BusOffice) {
      return res
        .status(401)
        .json(generateErrorMessageJSON(401, "Unauthorized Access"));
    }
    next();
  } catch (error) {
    console.log("Error in Bus Owner Middleare");
    return res
      .status(401)
      .json(generateErrorMessageJSON(401, "Unauthorized Access"));
  }
};

export default busOwnerMiddleware;
