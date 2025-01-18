import {TIME_REGEX} from "@/constants";

export const isValidTime = (value: string) => {
    return TIME_REGEX.test(value);
}