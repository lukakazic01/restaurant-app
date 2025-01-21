import {TIME_REGEX} from "@/constants";

export const isValidTime = (time: string) => {
    const notAllowedHours = new Set(['00', '01', '02', '03', '04', '05', '06', '07', '23']);
    const hourPart = time.split(':')[0]
    if (!TIME_REGEX.test(time)) return { isValid: false, errorMessage: "Invalid time format. Use HH:mm." };
    if (notAllowedHours.has(hourPart)) return { isValid: false, errorMessage: "Time cannot be within 00:00 - 07:59." };
    return { isValid: true, errorMessage: "" };
}