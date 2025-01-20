<template>
  <div class="flex flex-col gap-2">
    <input
        :class="{ 'border-red-500': error }"
        v-bind="$attrs"
        class="border rounded p-2"
        v-model="time"
        type="time"
        :value="time"
    />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { error = '' } = defineProps<{
  error: string;
}>()
const time = defineModel("time", { required: true })
</script>

<style scoped>

</style>