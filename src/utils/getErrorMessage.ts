import type {ErrorApi} from "@/types/ErrorApi.ts";
import {AxiosError} from "axios";

export const getErrorMessage = (e: unknown) => {
    if(e instanceof AxiosError && e.response) {
      try {
        const error = JSON.parse(e.response.data.message) as ErrorApi;
        return error.response.errors[0].message;
      } catch (e) {
        return "There was an issue parsing the error message. Please try again later.";
      }
    } else return "There was an error when trying to fetch restaurants. Please try again later."
}