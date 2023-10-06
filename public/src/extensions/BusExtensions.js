"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BusExtensions {
    static GetOutgoingObjectForBus(modelObj, id) {
        return {
            id,
            busOwnerId: modelObj.busOwnerId,
            startTime: modelObj.startTime,
            busName: modelObj.busName,
            startLocation: modelObj.startLocation,
            busOperatorName: modelObj.busOperatorName,
            busOperatorNumber: modelObj.busOperatorNumber,
            noRows: modelObj.noRows,
            noColumns: modelObj.noColumns,
            AfromLeft: modelObj.AfromLeft,
            stops: modelObj.stops,
            recurrence: modelObj.recurrence,
            availableSeats: [],
        };
    }
    static GetOutgoingObjectForProviderBookings(modelObjList) {
        const finalList = [];
        for (const busItem of modelObjList) {
            const newObj = {
                id: busItem.id,
                busName: busItem.busName,
                startLocation: busItem.startLocation,
                busOperatorName: busItem.busOperatorName,
                busOperatorNumber: busItem.busOperatorNumber,
                startTime: busItem.startTime,
                recurrence: busItem.recurrence,
                stops: busItem.stops,
                noRows: busItem.noRows,
                noColumns: busItem.noColumns,
                AfromLeft: busItem.AfromLeft,
            };
            finalList.push(newObj);
        }
        return finalList;
    }
}
exports.default = BusExtensions;
