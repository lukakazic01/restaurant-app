import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {getFormattedDateTime} from "@/utils/getFormattedDateTime.ts";
import {useRoute} from "vue-router";
import {parseQueryParam} from "@/utils/parseQueryParam.ts";
import {isValidDate} from "@/utils/validators/isValidDate.ts";
import {isValidTime} from "@/utils/validators/isValidTime.ts";
import {isValidSize} from "@/utils/validators/isValidSize.ts";

export const useFilterStore = defineStore('filter', () => {
    const route = useRoute()
    const filters = ref({
        date: '',
        time:  '',
        numberOfPeople:  ''
    })
    const normalizedFilters = computed(() => {
        return {
            date: filters.value.date.replaceAll('-', ''),
            time: filters.value.time.replaceAll(':', ''),
            numberOfPeople: filters.value.numberOfPeople.toString()
        }
    })

    const validateQueryParams = () => {
        const { numberOfPeople, date, time } = route.query;
        const [currentDate, currentTime] = getFormattedDateTime();
        const parsedDate = parseQueryParam(date)
        const parsedTime = parseQueryParam(time)
        const parsedNumberOfPeople = parseQueryParam(numberOfPeople)
        const size = Number(parsedNumberOfPeople);
        filters.value = {
            numberOfPeople: (!parsedNumberOfPeople || !isValidSize(size).isValid) ? '1' : parsedNumberOfPeople,
            date: isValidDate(parsedDate).isValid ? parsedDate : currentDate,
            //Since it can happen that we access the app for example at 00:00 which is our current time that is not valid, we need to double-check
            time: isValidTime(parsedTime).isValid
                ? parsedTime
                : isValidTime(currentTime).isValid
                ? currentTime
                : "08:00"
        };
    }

    const setDefaultFilters = () => {
        const [currentDate, currentTime] = getFormattedDateTime();
        filters.value.date =  currentDate;
        filters.value.time = currentTime;
        filters.value.numberOfPeople = "1";
    }

    return { filters, normalizedFilters, validateQueryParams, setDefaultFilters };
})