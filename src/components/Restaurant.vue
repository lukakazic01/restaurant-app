<template>
  <div class="flex md:flex-row flex-col gap-2 w-full border rounded">
    <img :src="restaurant.cover" class="md:w-[calc(33.3333%-4px)] md:max-w-[calc(33.3333%-4px)] w-full aspect-[16/9] object-cover" alt="Restaurant cover" />
    <div class="flex flex-col gap-2 md:px-0 px-4 md:w-[calc(33.3333%-4px)] md:max-w-[calc(33.3333%-4px)] w-full">
        <div class="flex items-center gap-4">
          <img :src="restaurant.logo" class="size-14 rounded-full" alt="Restaurant logo" />
          <div class="flex flex-col">
            <p class="font-bold">{{ restaurant.title }}</p>
            <p class="text-sm">{{ restaurant.address }}</p>
            <p class="text-sm">{{ subtitle }}</p>
          </div>
        </div>
        <div class="flex mt-4 gap-2 flex-wrap">
          <span class="bg-gray-200 text-xs rounded-sm p-2" v-if="restaurant.tag1">{{ restaurant.tag1 }}</span>
          <span class="bg-gray-200 text-xs rounded-sm p-2" v-if="restaurant.tag2">{{ restaurant.tag2 }}</span>
          <span class="bg-gray-200 text-xs rounded-sm p-2" v-if="restaurant.tag3">{{ restaurant.tag3 }}</span>
        </div>
      </div>
    <div class="flex flex-col gap-2 items-center border-l border-l-200 md:p-2 p-4 md:w-[calc(33.3333%-4px)] md:max-[calc(33.3333%-4px)] justify-center">
      <div class="flex flex-row gap-2 w-full">
        <RestaurantAvailabilityTime
          v-for="option in restaurant.availability.recommended"
          :key="option.id"
          :option class="w-[calc(50%-4px)] max-w-[calc(50%-4px)]"
        />
      </div>
      <button @click="showAreasForSelectedRestaurant(restaurant, index)">{{ showAreasBtnText }}</button>
    </div>
  </div>
  <RestaurantAllAvailableBookings v-show="restaurant.show_areas" :areas="restaurant.availability.areas" />
</template>

<script setup lang="ts">
import type {RestaurantI} from "@/types/Restaurant.ts";
import {computed} from "vue";
import RestaurantAvailabilityTime from "@/components/RestaurantAvailabilityTime.vue";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import RestaurantAllAvailableBookings from "@/components/RestaurantAllAvailableBookings.vue";

const { restaurant, index } = defineProps<{
  restaurant: RestaurantI,
  index: number;
}>()
const { showAreasForSelectedRestaurant } = useRestaurantStore()

const subtitle = computed(() => restaurant.subtitle.split(',')[0])
const showAreasBtnText = computed(() => restaurant.show_areas ? restaurant.availability.page.showLess : restaurant.availability.page.showMore)
</script>

<style scoped>

</style>