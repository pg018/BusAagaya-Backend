import { Model, Schema, model } from "mongoose";
import { UserTypeEnum } from "../enums/UserTypeEnums";

export interface IUserSchema {
  displayName: string;
  emailId: string;
  mobileNumber: number;
  password: string;
  dateOfBirth: Date;
  dateOfJoining: Date;
  type: string;
}

type UserDataModel = Model<IUserSchema, {}>;

const userSchema = new Schema<IUserSchema, UserDataModel>({
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  mobileNumber: {
    type: Number,
    maxlength: 10,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  dateOfJoining: {
    type: Date,
    required: true,
    default: new Date(),
  },
  type: {
    type: String,
    required: true,
    enum: UserTypeEnum,
  },
});

const userCollection = model<IUserSchema, UserDataModel>(
  "userCollection",
  userSchema,
  "userCollection"
);

export default userCollection;
