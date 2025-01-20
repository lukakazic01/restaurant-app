import {DATE_REGEX} from "@/constants";
import {getFormattedDateTime} from "@/utils/getFormattedDateTime.ts";

export const isValidDate = (date: string) => {
    const currentDate = getFormattedDateTime()[0];
    if (!DATE_REGEX.test(date)) return { isValid: false, errorMessage: "Invalid date format. Use YYYY-MM-DD." };
    if (currentDate > date) return { isValid: false, errorMessage: "Date must be in the future." };
    return { isValid: true, errorMessage: "" };
}