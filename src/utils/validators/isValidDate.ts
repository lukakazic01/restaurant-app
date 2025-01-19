import {DATE_REGEX} from "@/constants";

export const isValidDate = (date: string) => {
    return DATE_REGEX.test(date);
}