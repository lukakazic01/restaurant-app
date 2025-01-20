import {TIME_REGEX} from "@/constants";
import {getFormattedDateTime} from "@/utils/getFormattedDateTime.ts";

export const isValidTime = (time: string) => {
    const notAllowedHours = new Set(['00', '01', '02', '03', '04', '05', '06', '07']);
    const hourPart = time.split(':')[0]
    const currentTime = Number(getFormattedDateTime()[1].replaceAll(":", ""));
    const filterTime = Number(time.replaceAll(':', ''));
    if (!TIME_REGEX.test(time)) return { isValid: false, errorMessage: "Invalid time format. Use HH:mm." };
    if (currentTime > filterTime) return { isValid: false, errorMessage: "Time must be in the future." };
    if (notAllowedHours.has(hourPart)) return { isValid: false, errorMessage: "Time cannot be within restricted hours (00:00 - 07:59)." };
    return { isValid: true, errorMessage: "" };
}