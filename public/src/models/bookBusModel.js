"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GenderEnums_1 = require("../enums/GenderEnums");
const bookBusSchema = new mongoose_1.Schema({
    busId: {
        type: String,
        ref: "busCollection",
    },
    userId: {
        type: String,
        ref: "userCollection",
    },
    travelDate: {
        type: Date,
    },
    destinationDate: {
        type: Date,
    },
    startLocation: {
        type: String,
    },
    endLocation: {
        type: String,
    },
    passengerDetails: {
        type: [
            {
                passengerName: {
                    type: String,
                    required: true,
                },
                passengerAge: {
                    type: Number,
                    required: true,
                },
                passengerGender: {
                    type: String,
                    required: true,
                    enum: GenderEnums_1.GenderEnums,
                },
                seatNumber: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    totalCost: {
        type: Number,
    },
});
// setting required option for all properties
bookBusSchema.eachPath((path, schemaType) => {
    schemaType.required(true, `Field ${path} is Required`);
});
const bookBusCollection = (0, mongoose_1.model)("bookBusCollection", bookBusSchema, "bookBusCollection");
exports.default = bookBusCollection;
