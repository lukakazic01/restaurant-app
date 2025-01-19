<template>
  <div class="bg-gray-200 p-6 flex flex-col gap-2 rounded">
    <div v-for="area in areas" :key="area.id" class="space-y-2">
      <p class="font-bold">{{ area.name }}</p>
      <div class="flex gap-2">
        <RestaurantAvailabilityTime v-for="option in area.options" :key="option.method" :option />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RestaurantAvailabilityTime from "@/components/RestaurantAvailabilityTime.vue";
import type {Area} from "@/types/Posts.ts";

const { areas } = defineProps<{
  areas: Area[]
}>()
</script>

<style scoped>

</style>