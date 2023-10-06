import bookBusCollection from "../../models/bookBusModel";
import busCollection from "../../models/busModel";
import { IBookBusSchema } from "../../types/busTypes";

// returns the matrix of seats in order based on no. of rows and columns
const GetInitialAvailableSeats = (
  noRows: number,
  noColumns: number
): Array<string> => {
  const finalArray = [];
  // for each row
  for (let i = 1; i <= noRows; i++) {
    // for each column
    for (let j = 1; j <= noColumns; j++) {
      finalArray.push(`${i}${String.fromCharCode(64 + j)}`);
    }
  }
  return finalArray;
};

// getting all the booked ticket documents that are booked between two destinations which includes the tickets
const getBookedTicketsForBus = async (
  busId: string,
  startLocation: string,
  endLocation: string,
  travelDate: Date
): Promise<IBookBusSchema[]> => {
  // booked on stops between them also
  travelDate.setHours(0, 0, 0, 0);
  return await bookBusCollection.find({
    busId,
    travelDate: { $gte: travelDate },
    $or: [
      {
        $and: [{ startLocation }, { endLocation }],
      },
      {
        $and: [{ startLocation }, { endLocation: { $ne: endLocation } }],
      },
      {
        $and: [{ startLocation: { $ne: startLocation } }, { endLocation }],
      },
    ],
  });
};

// returns the list of booked seats for a given bus from start to end location
const getAllBookedSeatNumbersForBus = async (
  busId: string,
  startLocation: string,
  endLocation: string,
  travelDate: Date
): Promise<string[]> => {
  // getting the tickets booked
  const tickets = await getBookedTicketsForBus(
    busId,
    startLocation,
    endLocation,
    travelDate
  );
  if (!tickets) {
    return [];
  }
  // getting all the seat numbers that are already reserved
  let finalArray: any = [];
  for (const ticket of tickets) {
    const seatNumbers = ticket.passengerDetails.map(
      (passenger) => passenger.seatNumber
    );
    finalArray = [...finalArray, ...seatNumbers];
  }
  return finalArray;
};

const getQueriedDocuments = async (
  startLocation: string,
  endLocation: string,
  travelDate: string
) => {
  const busInformation = await busCollection.aggregate([
    {
      $match: {
        $or: [
          {
            $and: [
              { startLocation: startLocation },
              {
                startTime: {
                  $gte: new Date(travelDate),
                  $lt: new Date(
                    new Date(travelDate).setDate(
                      new Date(travelDate).getDate() + 1
                    )
                  ),
                },
              },
            ],
          },
          {
            $and: [
              { "stops.stopName": startLocation },
              {
                "stops.time": {
                  $gte: new Date(travelDate),
                  $lt: new Date(
                    new Date(travelDate).setDate(
                      new Date(travelDate).getDate() + 1
                    )
                  ),
                },
              },
            ],
          },
        ],
        $and: [{ "stops.stopName": endLocation }],
      },
    },
    {
      $addFields: {
        startLocationOrder: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$stops",
                as: "stop",
                cond: { $eq: ["$$stop.stopName", startLocation] },
              },
            },
            0,
          ],
        },
        endLocationOrder: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$stops",
                as: "stop",
                cond: { $eq: ["$$stop.stopName", endLocation] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $match: {
        $expr: {
          $lt: ["$startLocationOrder.order", "$endLocationOrder.order"],
        },
      },
    },
  ]);
  return busInformation;
};

const BusService = {
  GetInitialAvailableSeats,
  getBookedTicketsForBus,
  getAllBookedSeatNumbersForBus,
  getQueriedDocuments,
};

export default BusService;
