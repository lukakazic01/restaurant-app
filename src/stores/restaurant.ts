import {defineStore} from "pinia";
import {ref} from "vue";
import type {Restaurant} from "@/types/Restaurant.ts";

export const useRestaurantStore = defineStore('restaurant', () => {
    const restaurants = ref<Restaurant[]>([])

    return { restaurants }
})