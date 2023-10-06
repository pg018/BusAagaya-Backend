"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserTypeEnums_1 = require("../enums/UserTypeEnums");
const userSchema = new mongoose_1.Schema({
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
        enum: UserTypeEnums_1.UserTypeEnum,
    },
});
const userCollection = (0, mongoose_1.model)("userCollection", userSchema, "userCollection");
exports.default = userCollection;
