<template>
  <form class="w-full flex flex-col items-center" @input="removeErrors" @submit.prevent="searchForRestaurants">
    <div class="flex sm:flex-row flex-col gap-6 mt-2 justify-center w-full">
      <!-- In a real world app, I would try to make all of these components as BaseInputs, so it can accept any type of input -->
      <!-- Also, i wasn't sure if i was supposed to use text inputs, i thought it would be better user experience to use date and time inputs -->
      <FilterNumberOfPeople
        class="basis-4/12"
        :min="1"
        :max="10"
        required
        v-model:numberOfPeople="filterStore.form.numberOfPeople"
        :error="error.numberOfPeople"
      />
      <FilterDate
        class="basis-4/12"
        placeholder="Date"
        :min="getFormattedDateTime()[0]"
        required
        v-model:date="filterStore.form.date"
        :error="error.date"
      />
      <FilterTime
        class="basis-4/12"
        :min="getFormattedDateTime()[1]"
        max="23:00"
        placeholder="Time"
        required
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
import {getFormattedDateTime} from "@/utils/getFormattedDateTime.ts";
import {useRouter, useRoute} from "vue-router";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import FilterNumberOfPeople from "@/components/FilterNumberOfPeople.vue";
import FilterDate from "@/components/FilterDate.vue";
import FilterTime from "@/components/FilterTime.vue";
import {isValidDate} from "@/utils/validators/isValidDate.ts";
import {isValidTime} from "@/utils/validators/isValidTime.ts";
import {useFilterStore} from "@/stores/filter.ts";
import {isValidSize} from "@/utils/validators/isValidSize.ts"

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

if (Object.keys(route.query).length) {
  filterStore.validateQueryParams()
  router.push({ path: '/search', query: { ...filterStore.form } })
}

const searchForRestaurants = () => {
  if(!validateForm()) return;
  router.push({ path: '/search', query: { ...filterStore.form } })
  restaurantsStore.restaurants = []
  emit('update:restaurants')
}

const validateForm = () => {
  const validatedTime = isValidTime(filterStore.form.time)
  const validatedDate = isValidDate(filterStore.form.date)
  if (!validatedDate.isValid) error.value.date = validatedDate.errorMessage;
  if (!validatedTime.isValid) error.value.time = validatedTime.errorMessage;
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
</script>

<style scoped>

</style>