// The below objects are for busModel which stores the available buses by bus owners
export interface BusStops {
  stopName: string;
  time: Date;
  order: number;
  cost: number;
}

export interface IBusSchema {
  busOwnerId: string;
  startTime: Date;
  busName: string;
  startLocation: string;
  busOperatorName: string;
  busOperatorNumber: number;
  noRows: number;
  noColumns: number;
  AfromLeft: boolean;
  stops: Array<BusStops>;
  recurrence: Array<string>;
}

// this object is for the queried bus results
export interface OutgoingBusDetails extends IBusSchema {
  availableSeats: Array<string>;
  id: string;
}

// this object is for the bus results of a user
export interface OutgoingUserBusItem extends Omit<IBusSchema, "busOwnerId"> {
  id: string;
}

// The below objects are for bookBusModel which stores the booked tickets of the users
export interface PassengerDetailsObj {
  passengerName: string;
  passengerAge: number;
  seatNumber: string;
  passengerGender: string;
}

export interface IBookBusSchema {
  busId: string;
  userId: string;
  travelDate: Date;
  destinationDate: Date;
  passengerDetails: Array<PassengerDetailsObj>;
  startLocation: string;
  endLocation: string;
  totalCost: number;
}
