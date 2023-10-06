import { NextFunction, Request, Response } from "express";
import allServices from "../services/allServices";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwtCookie = req.cookies.jwt;
    if (!jwtCookie) {
      console.log("JWT Cookie does not exist");
      return res.sendStatus(401);
    }
    // if decoded token is incorrect, will throw error
    const isTokenExpire = allServices.JWTService.isTokenExpired(jwtCookie);
    if (isTokenExpire) {
      // token has expired, as it has exceeded the alloted time
      console.log("Token Expired");
      res.clearCookie("jwt");
      return res.sendStatus(401);
    }
    // auth success, moving to next function in the route chain
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};

export default authMiddleware;
