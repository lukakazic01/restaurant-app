<template>
  <div class="flex flex-col gap-2">
    <input
        :class="{ 'border-red-500': error }"
        required
        min="08:00"
        max="23:00"
        class="border rounded p-2"
        v-model="time"
        placeholder="Time"
        type="time"
    />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import {formatDate} from "@/utils/formatDate.ts";
const { error = '' } = defineProps<{
  error: string;
}>()
const time = defineModel("time", { default: formatDate()[1], required: true })
</script>

<style scoped>

</style>