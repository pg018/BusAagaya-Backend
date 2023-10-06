import { Model, Schema, model } from "mongoose";
import { IBusSchema } from "../types/busTypes";

type BusModel = Model<IBusSchema, {}>;

const busSchema = new Schema<IBusSchema, BusModel>({
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

const busCollection = model<IBusSchema, BusModel>(
  "busCollection",
  busSchema,
  "busCollection"
);

export default busCollection;
