import {DATE_REGEX} from "@/constants";

export const isValidDate = (value: string) => {
    return DATE_REGEX.test(value);
}