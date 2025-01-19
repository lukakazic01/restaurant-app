<template>
  <div class="flex w-full border gap-4 rounded">
    <img :src="restaurant.cover" class="w-[340px] basis-4/12 aspect-[16/9] object-cover" />
    <div class="flex flex-col gap-2 basis-4/12">
        <div class="flex h-fit items-center gap-4">
          <img :src="restaurant.logo" class="size-14 rounded-full" />
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
    <div class="w-[1px] bg-gray-200" />
    <div class="flex flex-col gap-2 items-center pt-2 basis-4/12 justify-center">
      <div class="flex flex-row gap-2">
        <RestaurantAvailabilityTime v-for="option in restaurant.availability.recommended" :key="option.id" :option />
      </div>
      <button @click="showAreasForSelectedRestaurant(restaurant, index)">{{ showAreasBtnText }}</button>
    </div>
  </div>
  <RestaurantAllAvailabbleBookings v-if="restaurant.show_areas" :areas="restaurant.availability.areas" />
</template>

<script setup lang="ts">
import type {Restaurant} from "@/types/Restaurant.ts";
import {computed} from "vue";
import RestaurantAvailabilityTime from "@/components/RestaurantAvailabilityTime.vue";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import RestaurantAllAvailabbleBookings from "@/components/RestaurantAllAvailabbleBookings.vue";

const { restaurant } = defineProps<{
  restaurant: Restaurant,
  index: number;
}>()
const { showAreasForSelectedRestaurant } = useRestaurantStore()

const subtitle = computed(() => restaurant.subtitle.split(',')[0])
const showAreasBtnText = computed(() => restaurant.show_areas ? restaurant.availability.page.showLess : restaurant.availability.page.showMore)
</script>

<style scoped>

</style>