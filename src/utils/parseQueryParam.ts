import type {LocationQueryValue} from "vue-router";

export const parseQueryParam = (queryParam: LocationQueryValue | LocationQueryValue[]) => {
    return typeof queryParam === "string" ? queryParam : ''
}