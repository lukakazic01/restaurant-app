import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {formatDate} from "@/utils/formatDate.ts";
import {useRoute} from "vue-router";

export const useFilterStore = defineStore('filter', () => {
    const route = useRoute()
    const form = ref({
        date: typeof route.query.date === 'string' ? route.query.date : formatDate()[0],
        time: typeof route.query.time === 'string' ? route.query.time : formatDate()[1],
        numberOfPeople: typeof route.query.numberOfPeople === 'string' ? route.query.numberOfPeople : '1'
    })
    const preparedForm = computed(() => {
        return { date: form.value.date.replaceAll('-', ''), time: form.value.time.replaceAll(':', ''), numberOfPeople: form.value.numberOfPeople.toString() }
    })

    return { form, preparedForm }
})