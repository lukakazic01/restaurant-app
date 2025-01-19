<template>
  <button
    :disabled="option.method === 'disabled'"
    class="p-1 border-2 border-black rounded flex flex-col items-center text-center"
  >
    {{ time }}
    <span class="flex items-center gap-1 w-11/12 justify-center" v-if="option.text">
      <span class="size-2 min-w-[8px] rounded-full bg-blue-500 block" />
      <span class="truncate">{{ option.text }}</span>
    </span>
    <IconDisabled v-else />
  </button>
</template>

<script setup lang="ts">
import type {Option, Recommended} from "@/types/Posts.ts";
import {computed} from "vue";
import IconDisabled from "@/components/icons/IconDisabled.vue";

const { option } = defineProps<{
  option: Recommended | Option
}>()

const time = computed(() => option.time.slice(0,2) + ':' + option.time.slice(2))
</script>

<style scoped>

</style>