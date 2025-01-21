<template>
  <div class="flex items-center flex-col pt-10 px-6">
    <Filter @update:restaurants="getAllData" :loading="tokenLoader || restaurantStore.loading" />
    <div class="flex flex-col gap-4 mt-6 w-full" ref="scrollContainer">
      <template v-if="restaurantStore.restaurants.length">
        <Restaurant v-for="(restaurant, index) in restaurantStore.restaurants" :key="restaurant.title" :restaurant :index />
      </template>
      <div class="text-center" v-if="shouldShowBadFilterMessage">
        Sorry, but currently there are no restaurants to book for this filter, try again later.
      </div>
      <div class="text-center text-red-500" v-if="shouldShowErrorMessage">
        {{ errorMessage }}
      </div>
      <div
        v-if="!errorMessage"
        class="flex justify-center py-10"
       :class="{ 'visible': restaurantStore.loading || tokenLoader, '!invisible': !restaurantStore.loading && !tokenLoader }">
        <Loader />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, useTemplateRef} from "vue";
import type {SearchToken} from "@/types/SearchToken.ts";
import Restaurant from '@/components/Restaurant.vue'
import type {Availability, Posts} from "@/types/Posts.ts";
import type {User} from "@/types/User.ts";
import {useInfiniteScroll} from "@/composables/useInfiniteScroll.ts";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import Filter from "@/components/Filter.vue";
import Loader from "@/components/Loader.vue";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";
import type {RestaurantI} from "@/types/Restaurant.ts";
import {useFilterStore} from "@/stores/filter.ts";
import {useAxios} from "@/composables/useAxios.ts";
import {TOKEN} from "@/constants";

const axios = useAxios()
const restaurantStore = useRestaurantStore()
const filterStore = useFilterStore()
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const tokenLoader = ref(false);
const errorMessage = ref("");

const shouldShowBadFilterMessage = computed(() => !errorMessage.value && !restaurantStore.loading && !tokenLoader.value && !restaurantStore.restaurants.length)
const shouldShowErrorMessage = computed(() => errorMessage.value && !restaurantStore.loading && !tokenLoader.value)

let total = 0
let searchId: null | string = null

useInfiniteScroll(scrollContainer, () => {
  if (total > restaurantStore.restaurants.length && !errorMessage.value) {
    getRestaurants()
  }
});

getAllData()

async function getAllData() {
  try {
    tokenLoader.value = true;
    await getToken();
    await getSearchId()
    await getRestaurants()
  } catch (e) {
    errorMessage.value = getErrorMessage(e)
  } finally {
    tokenLoader.value = false;
  }
}

async function getRestaurants() {
  try {
    restaurantStore.loading = true;
    const searchData = await getSearchData()
    const restaurantAvailabilities: Availability[] = []
    const response = await Promise.allSettled(
      searchData.posts.map((p) => {
        restaurantAvailabilities.push(p.availability)
        return axios.get<RestaurantI>(`/api/slug_content?slug=${p.post.slug}&version=${p.post.version}&distributor=14699131&locale=sr`)
      })
    );
    response.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        restaurantStore.restaurants.push({...res.value.data, show_areas: false, availability: restaurantAvailabilities[index]});
      }
    })
  } catch (e) {
    errorMessage.value = getErrorMessage(e)
  } finally {
    restaurantStore.loading = false;
  }
}

const getSearchData = async () => {
  const { data } = await axios.post<Posts>('/api/search_request', {
    search_id: searchId,
  })
  total = data.total
  return data
}

async function getSearchId()  {
  const filters = filterStore.preparedForm;
  const { data } = await axios.post<SearchToken>('/api/search_token', {
    criteria: {
      date: filters.date,
      time: filters.time,
      size: filters.numberOfPeople,
    },
    marketplace_id: "15380287",
    locale: "en",
    geocodes: ["belgrade"],
    ...(searchId && { search_id: searchId }),
  })
  searchId = data.search_id
}

async function getToken() {
  const { data } = await axios.post<User>('/api/loginAnonymously')
  localStorage.setItem(TOKEN, data.jwt_token)
}
</script>
