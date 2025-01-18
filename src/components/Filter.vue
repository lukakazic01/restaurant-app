<template>
  <form class="w-full flex flex-col items-center" @input="removeErrors" @submit.prevent="searchForRestaurants">
    <div class="flex gap-6 mt-2 justify-center w-full">
      <!-- In a real world app, I would try to make all of these components as BaseInputs, so it can accept any type of input -->
      <FilterNumberOfPeople class="basis-4/12" v-model:numberOfPeople="form.numberOfPeople" :error="error.numberOfPeople" />
      <FilterDate class="basis-4/12" v-model:date="form.date" :error="error.date" />
      <FilterTime class="basis-4/12" v-model:time="form.time" :error="error.time" />
    </div>
    <button type="submit" class="mt-6 bg-red-500 text-white rounded w-96 p-2">Search</button>
  </form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {formatDate} from "@/utils/formatDate.ts";
import type {RestaurantFilter} from "@/types/RestaurantFilter.ts";
import {useRouter, useRoute} from "vue-router";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import FilterNumberOfPeople from "@/components/FilterNumberOfPeople.vue";
import FilterDate from "@/components/FilterDate.vue";
import FilterTime from "@/components/FilterTime.vue";
import {DATE_REGEX, TIME_REGEX} from "@/constants";
import {isValidDate} from "@/utils/validators/isValidDate.ts";
import {isValidTime} from "@/utils/validators/isValidTime.ts";

const emit = defineEmits<{
  'update:restaurants': [val: RestaurantFilter]
}>()

const router = useRouter()
const restaurantsStore = useRestaurantStore()
const route = useRoute()

const form = reactive({
  date: route.query.date as string || formatDate()[0],
  time: route.query.time as string || formatDate()[1],
  numberOfPeople: route.query.numberOfPeople as string || '1'
})
const error = reactive({
  date: '',
  time: '',
  numberOfPeople: ''
})

if (!route.query.length) {
  validateQueryParams()
  router.push({ path: '/search', query: { ...form } })
}

function isValidSize(size: number) {
  if(size < 1 || size > 10) return false
  return false
}

// I didn't take into account that some months have 30 days and some 31 and so on, this should be improved
// Also, time can't be between 23:00 and 08:00 which I didn't validate, so this should be improved as well in real world app
function validateQueryParams() {
  const { numberOfPeople, date, time } = route.query;
  const size = parseInt(numberOfPeople as string);
  if (!numberOfPeople || isValidSize(size)) form.numberOfPeople = '1'
  if (isValidDate(date as string)) form.date = formatDate()[0]
  if (isValidTime(time as string)) form.time = formatDate()[1]
}

const searchForRestaurants = () => {
  if(!validateInputs()) return;
  router.push({ path: '/search', query: { ...form } })
  emit('update:restaurants', form)
  restaurantsStore.restaurants = []
}

const validateInputs = () => {
  if (!isValidDate(form.date)) error.date = 'Invalid date';
  if (!isValidTime(form.time)) error.time = 'Invalid time';
  const size = parseInt(form.numberOfPeople)
  if (isValidSize(size)) error.numberOfPeople = 'Number of people must be between 1 and 10';
  for(const [_, error] of Object.entries(form)) {
    if (error) return false;
  }
  return true
}

const removeErrors = () => {
  error.time = ''
  error.date = ''
  error.numberOfPeople = ''
}
</script>

<style scoped>

</style>