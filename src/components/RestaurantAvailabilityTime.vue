<template>
  <button
    :disabled="option.method === 'disabled'"
    class="p-2 border-2 border-black rounded flex flex-col items-center text-center"
  >
    <span>
      {{ time }}
    </span>
    <span class="flex items-center gap-1" v-if="option.text">
      <span class="size-2 rounded-full bg-blue-500 block" />
      <span class="truncate w-[100px]">{{ option.text }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import type {Option, Recommended} from "@/types/Posts.ts";
import {computed} from "vue";

const { option } = defineProps<{
  option: Recommended | Option
}>()

const time = computed(() => option.time.slice(0,2) + ':' + option.time.slice(2))
</script>

<style scoped>

</style>