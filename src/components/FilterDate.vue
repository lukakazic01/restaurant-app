<template>
  <div class="flex flex-col gap-2">
    <input
        :class="{ 'border-red-500': error }"
        v-bind="$attrs"
        :min
        class="border rounded p-2"
        v-model="date"
        :value="date"
        type="date"
    />
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { error = '', min } = defineProps<{
  error: string;
  min?: string;
}>()
const date = defineModel("date", { required: true })
</script>

<style scoped>

</style>