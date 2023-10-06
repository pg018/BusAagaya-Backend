"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const busModel_1 = __importDefault(require("../models/busModel"));
const weekdaysList = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const updateBuses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const currentDay = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
        });
        const busesToUpdate = yield busModel_1.default.find({
            recurrence: { $in: [currentDay] },
        });
        busesToUpdate.forEach((bus) => __awaiter(void 0, void 0, void 0, function* () {
            const closestDay = bus.recurrence.find((day) => {
                const todayIndex = weekdaysList.indexOf(currentDay);
                const dayIndex = weekdaysList.indexOf(day);
                return dayIndex >= todayIndex;
            });
            if (closestDay) {
                // Calculate the difference in days
                const dayDifference = weekdaysList.indexOf(closestDay) - weekdaysList.indexOf(currentDay);
                // Update main root startTime
                const newStartTime = new Date(bus.startTime);
                newStartTime.setDate(newStartTime.getDate() + dayDifference);
                // Update stops times
                const updatedStops = bus.stops.map((stop) => {
                    const newStopTime = new Date(stop.time);
                    newStopTime.setDate(newStopTime.getDate() + dayDifference);
                    return Object.assign(Object.assign({}, stop), { time: newStopTime });
                });
                yield busModel_1.default.updateOne({ _id: bus._id }, { startTime: newStartTime, stops: updatedStops });
                console.log(`Updated bus ${bus._id}`);
            }
        }));
    }
    catch (error) {
        console.error("Error updating buses:", error);
    }
});
node_cron_1.default.schedule("45 6 * * *", () => {
    console.log("Scheduler Active for Bus Collection");
    updateBuses();
});
