"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserExtensions {
    static GetOutgoingBookingDetailsList(bookingListModel) {
        const finalArray = [];
        for (const booking of bookingListModel) {
            const finalObject = {
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
exports.default = UserExtensions;
