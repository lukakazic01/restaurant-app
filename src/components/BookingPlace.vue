<template>
  <div class="flex w-full border gap-4 rounded">
    <img :src="place.cover" class="w-[340px] basis-4/12 aspect-[16/9] object-cover" />
    <div class="flex flex-col gap-2 basis-4/12">
        <div class="flex h-fit items-center gap-4">
          <img :src="place.logo" class="size-14 rounded-full" />
          <div class="flex flex-col">
            <p class="font-bold">{{ place.title }}</p>
            <p class="text-sm">{{ place.address }}</p>
            <p class="text-sm">{{ subtitle }}</p>
          </div>
        </div>
        <div class="flex mt-4 gap-2 flex-wrap">
          <span class="bg-gray-200 text-xs rounded-sm p-2" v-if="place.tag1">{{ place.tag1 }}</span>
          <span class="bg-gray-200 text-xs rounded-sm p-2" v-if="place.tag2">{{ place.tag2 }}</span>
          <span class="bg-gray-200 text-xs rounded-sm p-2" v-if="place.tag3">{{ place.tag3 }}</span>
        </div>
      </div>
    <div class="w-[1px] bg-gray-200" />
    <div class="flex gap-2 items-center pt-2 basis-4/12 justify-center">
      <p class="p-2 border-2 border-black rounded flex flex-col items-center text-center" v-for="recommended in place.availability.recommended">
        <span>
          {{ recommended.time.slice(0,2) + ':' + recommended.time.slice(2) }}
        </span>
        <span class="flex items-center gap-1">
          <span class="size-2 rounded-full bg-blue-500 block" />
          <span class="truncate w-[100px]">{{ recommended.text }}</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Place} from "@/types/Place.ts";
import {computed} from "vue";

const { place } = defineProps<{
  place: Place
}>()

const subtitle = computed(() => place.subtitle.split(',')[0])
</script>

<style scoped>

</style>