import cron from "node-cron";
import busCollection from "../models/busModel";

const weekdaysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const updateBuses = async () => {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const busesToUpdate = await busCollection.find({
      recurrence: { $in: [currentDay] },
    });

    busesToUpdate.forEach(async (bus) => {
      const closestDay = bus.recurrence.find((day) => {
        const todayIndex = weekdaysList.indexOf(currentDay);
        const dayIndex = weekdaysList.indexOf(day);
        return dayIndex >= todayIndex;
      });

      if (closestDay) {
        // Calculate the difference in days
        const dayDifference =
          weekdaysList.indexOf(closestDay) - weekdaysList.indexOf(currentDay);

        // Update main root startTime
        const newStartTime = new Date(bus.startTime);
        newStartTime.setDate(newStartTime.getDate() + dayDifference);

        // Update stops times
        const updatedStops = bus.stops.map((stop) => {
          const newStopTime = new Date(stop.time);
          newStopTime.setDate(newStopTime.getDate() + dayDifference);
          return { ...stop, time: newStopTime };
        });

        await busCollection.updateOne(
          { _id: bus._id },
          { startTime: newStartTime, stops: updatedStops }
        );

        console.log(`Updated bus ${bus._id}`);
      }
    });
  } catch (error) {
    console.error("Error updating buses:", error);
  }
};

cron.schedule("45 6 * * *", () => {
  console.log("Scheduler Active for Bus Collection");
  updateBuses();
});
