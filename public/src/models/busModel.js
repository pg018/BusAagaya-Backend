"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const busSchema = new mongoose_1.Schema({
    busOwnerId: {
        type: String,
        required: true,
        ref: "userCollection",
    },
    busName: {
        type: String,
    },
    startTime: {
        type: Date,
    },
    startLocation: {
        type: String,
    },
    busOperatorName: {
        type: String,
    },
    busOperatorNumber: {
        type: Number,
    },
    noRows: {
        type: Number,
    },
    noColumns: {
        type: Number,
    },
    AfromLeft: {
        type: Boolean,
    },
    stops: {
        type: [
            {
                stopName: {
                    type: String,
                    required: true,
                },
                time: {
                    type: Date,
                    required: true,
                },
                order: {
                    type: Number,
                    required: true,
                },
                cost: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    recurrence: {
        type: [String],
    },
});
// setting required option for all properties
busSchema.eachPath((path, schemaType) => {
    schemaType.required(true, `Field ${path} is Required`);
});
const busCollection = (0, mongoose_1.model)("busCollection", busSchema, "busCollection");
exports.default = busCollection;
