import { OutgoingBookingDetails } from "../types/userTypes";

class UserExtensions {
  static GetOutgoingBookingDetailsList(
    bookingListModel: any
  ): Array<OutgoingBookingDetails> {
    const finalArray: Array<OutgoingBookingDetails> = [];
    for (const booking of bookingListModel) {
      const finalObject: OutgoingBookingDetails = {
        bookingId: booking.id,
        busName: booking.busId.busName,
        travelDate: booking.travelDate,
        destinationDate: booking.destinationDate,
        startLocation: booking.startLocation,
        endLocation: booking.endLocation,
        passengerDetails: booking.passengerDetails,
        busOperatorName: booking.busId.busOperatorName,
        busOperatorNumber: booking.busId.busOperatorNumber,
        stops: booking.busId.stops,
      };
      finalArray.push(finalObject);
    }
    return finalArray;
  }
}

export default UserExtensions;
