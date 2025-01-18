<template>
  <div class="flex flex-col gap-2">
    <input
        :class="{ 'border-red-500': error }"
        :min="formatDate()[0]"
        required
        class="border rounded p-2"
        v-model="date"
        placeholder="date"
        type="date"
    />
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import {formatDate} from "@/utils/formatDate.ts";
const { error = '' } = defineProps<{
  error: string;
}>()
const date = defineModel("date", { default: formatDate()[0], required: true })
</script>

<style scoped>

</style>