import {
  IBusSchema,
  OutgoingBusDetails,
  OutgoingUserBusItem,
} from "../types/busTypes";

class BusExtensions {
  static GetOutgoingObjectForBus(
    modelObj: IBusSchema,
    id: string
  ): OutgoingBusDetails {
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

  static GetOutgoingObjectForProviderBookings(
    modelObjList: any
  ): Array<OutgoingUserBusItem> {
    const finalList: Array<OutgoingUserBusItem> = [];
    for (const busItem of modelObjList) {
      const newObj: OutgoingUserBusItem = {
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

export default BusExtensions;
