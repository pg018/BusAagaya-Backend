import { Request, Response } from "express";
import { validationResult } from "express-validator";
import allServices from "../services/allServices";
import userCollection from "../models/userModel";
import AuthExtensions from "../extensions/AuthExtensions";
import { generateErrorMessageJSON } from "../helpers/constants";

const postSignUp = async (req: Request, res: Response) => {
  try {
    console.log("Within Controller");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(generateErrorMessageJSON(400, errors.array()[0].msg));
    }
    console.log("Validation Success");
    const { displayName, mobileNumber, emailId, password, type } = req.body;
    const hashedPassword = await allServices.passwordService.getHashedPassword(
      password
    );
    const finalDetails = {
      displayName,
      emailId,
      mobileNumber,
      password: hashedPassword,
      dateOfJoining: new Date(),
      type,
    };
    console.log("Saving the document");
    await new userCollection(finalDetails).save();
    console.log("Document Saved");
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const postSignIn = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(generateErrorMessageJSON(400, errors.array()[0].msg));
  }
  console.log("Validation Success");
  try {
    const { emailId, password } = req.body;
    console.log("Searching the document if exists");
    const isEmailExists = await userCollection.findOne({ emailId: emailId });
    if (!isEmailExists) {
      console.log("Document does not exist");
      return res
        .status(400)
        .json(generateErrorMessageJSON(400, "User does not Exist"));
    }
    console.log("Verifying the password hash");
    const verifyPasswordHash = await allServices.passwordService.verifyPassword(
      password,
      isEmailExists.password
    );
    if (!verifyPasswordHash) {
      return res
        .status(400)
        .json(generateErrorMessageJSON(400, "Invalid Password"));
    }
    console.log("Creating JWT Token");
    const jwtToken = allServices.JWTService.createToken({
      userId: isEmailExists.id,
      type: isEmailExists.type,
    });
    res.cookie("jwt", jwtToken);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const jwtObject: string = req.cookies.jwt;
    const decodedJwtObj =
      allServices.JWTService.decodedIncomingToken(jwtObject);
    console.log(decodedJwtObj);
    const userData = await userCollection.findById(
      decodedJwtObj.userObject.userId
    );
    if (!userData) {
      return res
        .status(400)
        .json(generateErrorMessageJSON(400, "User Does not Exist"));
    }
    const finalData = AuthExtensions.GetOutgoingGetMeObjectFromModel(
      userData,
      userData.id
    );
    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(generateErrorMessageJSON(500, "Internal Server Error"));
  }
};

const postSignOut = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  return res.sendStatus(200);
};

const authController = {
  postSignUp,
  postSignIn,
  getMe,
  postSignOut,
};

export default authController;
