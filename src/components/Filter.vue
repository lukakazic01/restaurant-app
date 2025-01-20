<template>
  <form class="w-full flex flex-col items-center" @input="removeErrors" @submit.prevent="searchForRestaurants">
    <div class="flex sm:flex-row flex-col gap-6 mt-2 justify-center w-full">
      <!-- In a real world app, I would try to make all of these components as BaseInputs, so it can accept any type of input -->
      <!-- Also, i wasn't sure if i was supposed to use text inputs, i thought this would be better user experience -->
      <FilterNumberOfPeople
          class="basis-4/12"
          v-model:numberOfPeople="filterStore.form.numberOfPeople"
          :error="error.numberOfPeople"
      />
      <FilterDate
          class="basis-4/12"
          v-model:date="filterStore.form.date"
          :error="error.date"
      />
      <FilterTime
          class="basis-4/12"
          v-model:time="filterStore.form.time"
          :error="error.time"
      />
    </div>
    <button
      :disabled="loading"
      type="submit"
      class="mt-6 disabled:bg-red-300 transition-[background] duration-300 hover:bg-red-600 active:bg-red-700 disabled:cursor-not-allowed bg-red-500 text-white rounded sm:w-96 w-full p-2">
        Search
    </button>
  </form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {formatDate} from "@/utils/formatDate.ts";
import {useRouter, useRoute} from "vue-router";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import FilterNumberOfPeople from "@/components/FilterNumberOfPeople.vue";
import FilterDate from "@/components/FilterDate.vue";
import FilterTime from "@/components/FilterTime.vue";
import {isValidDate} from "@/utils/validators/isValidDate.ts";
import {isValidTime} from "@/utils/validators/isValidTime.ts";
import {useFilterStore} from "@/stores/filter.ts";

const emit = defineEmits<{
  'update:restaurants': []
}>()
const { loading = false } = defineProps<{
  loading: boolean
}>()

const router = useRouter()
const route = useRoute()
const restaurantsStore = useRestaurantStore()
const filterStore = useFilterStore()
const error = ref({
  date: '',
  time: '',
  numberOfPeople: ''
})

if (!Object.keys(route.query).length) {
  validateQueryParams()
  router.push({ path: '/search', query: { ...filterStore.form } })
}

function validateQueryParams() {
  const { numberOfPeople, date, time } = route.query;
  const parsedDate = typeof date === "string" ? date : ''
  const parsedTime = typeof time === "string" ? time : ''
  const parsedNumberOfPeople = typeof numberOfPeople === "string" ? numberOfPeople : ''
  const size = Number(parsedNumberOfPeople);
  if (!parsedNumberOfPeople || !isValidSize(size)) filterStore.form.numberOfPeople = '1'
  if (!isValidDate(parsedDate) || formatDate()[0] > parsedDate) filterStore.form.date = formatDate()[0]
  if (!isValidTime(parsedTime)) filterStore.form.time = formatDate()[1]
}

const searchForRestaurants = () => {
  if(!validateForm()) return;
  router.push({ path: '/search', query: { ...filterStore.form } })
  emit('update:restaurants')
  restaurantsStore.restaurants = []
}

const validateForm = () => {
  if (!isValidDate(filterStore.form.date)) error.value.date = 'Date must be in dd-mm-yyyy format';
  if (!isValidTime(filterStore.form.time)) error.value.time = 'Time must be in hh-mm format';
  const size = Number(filterStore.form.numberOfPeople)
  if (!isValidSize(size)) error.value.numberOfPeople = 'Number of guests must be between 1 and 10';
  for(const [_, e] of Object.entries(error.value)) {
    if (e) return false;
  }
  return true
}

const removeErrors = () => {
  error.value.time = ''
  error.value.date = ''
  error.value.numberOfPeople = ''
}

function isValidSize(size: number) {
  return !(size < 1 || size > 10);
}
</script>

<style scoped>

</style>