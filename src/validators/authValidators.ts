import { body } from "express-validator";
import { UserTypeEnum } from "../enums/UserTypeEnums";
import userCollection from "../models/userModel";

const postSignUpValidator = () => {
  return [
    body("displayName", "Enter Valid Display Name")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .trim() // if space is entered, all spaces removed from front and back
      .isLength({ min: 3 }),
    body("emailId", "Enter Valid Email Id")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .trim()
      .isEmail(),
    body("mobileNumber", "Enter Valid Mobile Number")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isMobilePhone("en-IN")
      .custom(async (val, { req }) => {
        const checkIfExists = await userCollection.findOne({
          $or: [{ mobileNumber: val }, { emailId: req.body.emailId }],
        });
        // user already exists
        if (checkIfExists) {
          // if email id already exists
          if (checkIfExists.emailId === req.body.emailId) {
            throw new Error("Email ID Already Exists");
          } else {
            // if mobile number already exists
            throw new Error("Mobile Number Already Exists");
          }
        }
        return true;
      }),
    body("password", "Enter Valid Password").isStrongPassword(),
    body("confirmPassword", "Enter Valid Confirm Password")
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
    body("type", "Enter Valid Type of User").isIn([
      UserTypeEnum.BusOffice,
      UserTypeEnum.User,
    ]),
  ];
};

const postSignInValidator = () => {
  return [
    body("emailId", "Enter Valid Email ID")
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isEmail(),
    body("password", "Enter Valid Password")
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

export default authValidators;
