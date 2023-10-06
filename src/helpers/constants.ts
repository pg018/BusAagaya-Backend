export const recurrencesList = [
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
export const isStringAlpha = (strValue: string): boolean => {
  return /^[A-Za-z\s]+$/.test(strValue);
};

export const isStringNumeric = (strValue: string): boolean => {
  return /^[0-9]+$/.test(strValue);
};

export const getUTCDate = (dateTimeString: string): Date => {
  return new Date(dateTimeString);
};

export const generateErrorMessageJSON = (status: number, message: string) => {
  return {
    errorMessage: message,
    status,
  };
};
