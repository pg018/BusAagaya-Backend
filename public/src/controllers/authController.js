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
const userModel_1 = __importDefault(require("../models/userModel"));
const AuthExtensions_1 = __importDefault(require("../extensions/AuthExtensions"));
const constants_1 = require("../helpers/constants");
const postSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Within Controller");
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json((0, constants_1.generateErrorMessageJSON)(400, errors.array()[0].msg));
        }
        console.log("Validation Success");
        const { displayName, mobileNumber, emailId, password, type } = req.body;
        const hashedPassword = yield allServices_1.default.passwordService.getHashedPassword(password);
        const finalDetails = {
            displayName,
            emailId,
            mobileNumber,
            password: hashedPassword,
            dateOfJoining: new Date(),
            type,
        };
        console.log("Saving the document");
        yield new userModel_1.default(finalDetails).save();
        console.log("Document Saved");
        return res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const postSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json((0, constants_1.generateErrorMessageJSON)(400, errors.array()[0].msg));
    }
    console.log("Validation Success");
    try {
        const { emailId, password } = req.body;
        console.log("Searching the document if exists");
        const isEmailExists = yield userModel_1.default.findOne({ emailId: emailId });
        if (!isEmailExists) {
            console.log("Document does not exist");
            return res
                .status(400)
                .json((0, constants_1.generateErrorMessageJSON)(400, "User does not Exist"));
        }
        console.log("Verifying the password hash");
        const verifyPasswordHash = yield allServices_1.default.passwordService.verifyPassword(password, isEmailExists.password);
        if (!verifyPasswordHash) {
            return res
                .status(400)
                .json((0, constants_1.generateErrorMessageJSON)(400, "Invalid Password"));
        }
        console.log("Creating JWT Token");
        const jwtToken = allServices_1.default.JWTService.createToken({
            userId: isEmailExists.id,
            type: isEmailExists.type,
        });
        res.cookie("jwt", jwtToken);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jwtObject = req.cookies.jwt;
        const decodedJwtObj = allServices_1.default.JWTService.decodedIncomingToken(jwtObject);
        console.log(decodedJwtObj);
        const userData = yield userModel_1.default.findById(decodedJwtObj.userObject.userId);
        if (!userData) {
            return res
                .status(400)
                .json((0, constants_1.generateErrorMessageJSON)(400, "User Does not Exist"));
        }
        const finalData = AuthExtensions_1.default.GetOutgoingGetMeObjectFromModel(userData, userData.id);
        return res.status(200).json(finalData);
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, constants_1.generateErrorMessageJSON)(500, "Internal Server Error"));
    }
});
const postSignOut = (req, res) => {
    res.clearCookie("jwt");
    return res.sendStatus(200);
};
const authController = {
    postSignUp,
    postSignIn,
    getMe,
    postSignOut,
};
exports.default = authController;
