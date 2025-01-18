<template>
  <div class="flex flex-col gap-2">
    <input :class="{ 'border-red-500': error }"
           required
           type="number"
           min="1"
           max="10" class="border rounded p-2"
           v-model="numberOfPeople"
           placeholder="Number of people" />
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { error = '' } = defineProps<{
  error: string
}>()
const numberOfPeople = defineModel('numberOfPeople', { required: true, default: '1' })
</script>

<style scoped>

</style>