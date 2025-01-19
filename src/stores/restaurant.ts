import {defineStore} from "pinia";
import {ref} from "vue";
import type {Restaurant} from "@/types/Restaurant.ts";

export const useRestaurantStore = defineStore('restaurant', () => {
    const restaurants = ref<Restaurant[]>([])

    // Since it happens that we get duplicates from response, index was needed to check against it
    const showAreasForSelectedRestaurant = (restaurant: Restaurant, index: number) => {
        if (!restaurants.value.length) return
        if (restaurant.show_areas) {
            restaurant.show_areas = false
            return;
        }
        restaurants.value = restaurants.value.map((r, i) => {
            return index === i ?
                { ...r, show_areas: true }
                :
                {...r, show_areas: false}
        })
    }

    return { restaurants, showAreasForSelectedRestaurant }
})