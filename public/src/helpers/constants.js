"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorMessageJSON = exports.getUTCDate = exports.isStringNumeric = exports.isStringAlpha = exports.recurrencesList = void 0;
exports.recurrencesList = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];
// returns true if string is alpha only
const isStringAlpha = (strValue) => {
    return /^[A-Za-z\s]+$/.test(strValue);
};
exports.isStringAlpha = isStringAlpha;
const isStringNumeric = (strValue) => {
    return /^[0-9]+$/.test(strValue);
};
exports.isStringNumeric = isStringNumeric;
const getUTCDate = (dateTimeString) => {
    return new Date(dateTimeString);
};
exports.getUTCDate = getUTCDate;
const generateErrorMessageJSON = (status, message) => {
    return {
        errorMessage: message,
        status,
    };
};
exports.generateErrorMessageJSON = generateErrorMessageJSON;
