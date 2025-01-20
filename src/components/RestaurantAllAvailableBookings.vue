<template>
  <div class="bg-gray-200 p-6 flex flex-col gap-2 rounded">
    <template v-if="areas">
      <div v-for="area in areas" :key="area.id" class="space-y-2">
        <p class="font-bold">{{ area.name }}</p>
        <div class="flex gap-2 flex-wrap">
          <RestaurantAvailabilityTime
            v-for="option in area.options"
            :key="option.method"
            :option
            class="md:max-w-[16.6666%] md:w-2/12 w-[calc(33.3333%-6px)] max-w-[calc(33.3333%-6px)]"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <p class="font-bold">Sorry, but currently there are no additional booking options for this filter.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import RestaurantAvailabilityTime from "@/components/RestaurantAvailabilityTime.vue";
import type {Area} from "@/types/Posts.ts";

const { areas } = defineProps<{
  areas: Area[] | undefined;
}>()
</script>

<style scoped>

</style>