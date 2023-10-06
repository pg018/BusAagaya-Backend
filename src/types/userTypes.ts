import { BusStops, PassengerDetailsObj } from "./busTypes";

export interface OutgoingBookingDetails {
  bookingId: string;
  travelDate: Date;
  destinationDate: Date;
  startLocation: string;
  endLocation: string;
  passengerDetails: PassengerDetailsObj;
  busOperatorName: string;
  busOperatorNumber: number;
  stops: BusStops[];
  busName: string;
}
