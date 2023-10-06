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
const UserTypeEnums_1 = require("../enums/UserTypeEnums");
const userModel_1 = __importDefault(require("../models/userModel"));
const postSignUpValidator = () => {
    return [
        (0, express_validator_1.body)("displayName", "Enter Valid Display Name")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .trim() // if space is entered, all spaces removed from front and back
            .isLength({ min: 3 }),
        (0, express_validator_1.body)("emailId", "Enter Valid Email Id")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .trim()
            .isEmail(),
        (0, express_validator_1.body)("mobileNumber", "Enter Valid Mobile Number")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isMobilePhone("en-IN")
            .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const checkIfExists = yield userModel_1.default.findOne({
                $or: [{ mobileNumber: val }, { emailId: req.body.emailId }],
            });
            // user already exists
            if (checkIfExists) {
                // if email id already exists
                if (checkIfExists.emailId === req.body.emailId) {
                    throw new Error("Email ID Already Exists");
                }
                else {
                    // if mobile number already exists
                    throw new Error("Mobile Number Already Exists");
                }
            }
            return true;
        })),
        (0, express_validator_1.body)("password", "Enter Valid Password").isStrongPassword(),
        (0, express_validator_1.body)("confirmPassword", "Enter Valid Confirm Password")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString()
            .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error("Passwords Do Not Match");
            }
            return true;
        }),
        (0, express_validator_1.body)("type", "Enter Valid Type of User").isIn([
            UserTypeEnums_1.UserTypeEnum.BusOffice,
            UserTypeEnums_1.UserTypeEnum.User,
        ]),
    ];
};
const postSignInValidator = () => {
    return [
        (0, express_validator_1.body)("emailId", "Enter Valid Email ID")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isEmail(),
        (0, express_validator_1.body)("password", "Enter Valid Password")
            .exists({
            checkFalsy: true,
            checkNull: true,
        })
            .isString(),
    ];
};
const authValidators = {
    postSignUpValidator,
    postSignInValidator,
};
exports.default = authValidators;
