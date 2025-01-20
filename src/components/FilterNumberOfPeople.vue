<template>
  <div class="flex flex-col gap-2">
    <input :class="{ 'border-red-500': error }"
           v-bind="$attrs"
           type="number"
           :min
           :max
           class="border rounded p-2"
           v-model="numberOfPeople"
           placeholder="Number of people" />
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { error = '', min, max } = defineProps<{
  error: string
  min?: number,
  max?: number
}>()
const numberOfPeople = defineModel('numberOfPeople', { required: true })
</script>

<style scoped>

</style>