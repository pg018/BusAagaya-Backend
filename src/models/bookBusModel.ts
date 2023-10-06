import { Model, Schema, model } from "mongoose";
import { GenderEnums } from "../enums/GenderEnums";
import { IBookBusSchema } from "../types/busTypes";

type BookBusModel = Model<IBookBusSchema, {}>;

const bookBusSchema = new Schema<IBookBusSchema, BookBusModel>({
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
          enum: GenderEnums,
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

const bookBusCollection = model<IBookBusSchema, BookBusModel>(
  "bookBusCollection",
  bookBusSchema,
  "bookBusCollection"
);

export default bookBusCollection;
