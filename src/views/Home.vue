<template>
  <div class="flex items-center flex-col pt-10 px-6">
    <Filter @update:restaurants="getRestaurants" />
    <div class="flex flex-col gap-4 mt-6 w-full" ref="scrollContainer">
      <template v-if="restaurantStore.restaurants.length">
        <Restaurant v-for="(restaurant, index) in restaurantStore.restaurants" :key="restaurant.title" :restaurant :index />
      </template>
      <div class="text-center" v-else-if="!errorMessage && !searchDataLoader && !tokenLoader && !restaurantStore.restaurants.length">
        Sorry, but currently there are no restaurants to book for this filter, try again later.
      </div>
      <div class="text-center text-red-500" v-else-if="errorMessage && !searchDataLoader">
        {{ errorMessage }}
      </div>
      <div
          class="flex justify-center py-10"
         :class="{ 'visible': searchDataLoader || tokenLoader, '!invisible': !searchDataLoader && !tokenLoader }"
      >
        <Loader />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import type {SearchToken} from "@/types/SearchToken.ts";
import Restaurant from '@/components/Restaurant.vue'
import type {Availability, Posts} from "@/types/Posts.ts";
import type {User} from "@/types/User.ts";
import {useInfiniteScroll} from "@/composables/useInfiniteScroll.ts";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import Filter from "@/components/Filter.vue";
import {useRoute} from "vue-router";
import Loader from "@/components/Loader.vue";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";
import axios from "@/config/axios.ts";
import type {RestaurantI} from "@/types/Restaurant.ts";

const route = useRoute()
const restaurantStore = useRestaurantStore()
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const searchDataLoader = ref(false);
const tokenLoader = ref(false);
const errorMessage = ref("");
let total = 0

useInfiniteScroll(scrollContainer,  () => {
  if (total > restaurantStore.restaurants.length) {
    getRestaurants()
  }
});

(async () => {
  try {
    tokenLoader.value = true;
    const { data } = await axios.post<User>('/api/loginAnonymously')
    localStorage.setItem("token", data.jwt_token)
    await getRestaurants()
  } catch (e) {
    errorMessage.value = getErrorMessage(e)
  } finally {
    tokenLoader.value = false;
  }
})()

async function getRestaurants() {
  try {
    searchDataLoader.value = true;
    const searchId  = await getSearchId()
    const searchData = await getSearchData(searchId)
    const availabilities: Availability[] = []
    const response = await Promise.allSettled(
        searchData.posts.map((p) => {
            availabilities.push(p.availability)
           return axios.get<RestaurantI>(`/api/slug_content?slug=${p.post.slug}&version=${p.post.version}&distributor=14699131&locale=sr`)
        })
    );
    response.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        restaurantStore.restaurants.push({...res.value.data, show_areas: false, availability: availabilities[index]});
      }
    })
  } catch (e) {
    errorMessage.value = getErrorMessage(e)
  } finally {
    searchDataLoader.value = false;
  }
}

const getSearchId = async () => {
  const filters = {
    date: typeof route.query.date === 'string' ? route.query.date : '',
    time: typeof route.query.time === 'string' ? route.query.time : '',
    numberOfPeople: typeof route.query.numberOfPeople === 'string' ? route.query.numberOfPeople : '',
  }
  const { data } = await axios.post<SearchToken>('/api/search_token', {
    criteria: {
      date: filters.date.replaceAll('-', ''),
      time: filters.time.replaceAll(':', ''),
      size: filters.numberOfPeople,
    },
    marketplace_id: "15380287",
    locale: "en",
    geocodes: ["belgrade"]
  })
  return data.search_id
}

const getSearchData = async (searchId: string) => {
  const { data } = await axios.post<Posts>('/api/search_request', {
    search_id: searchId,
  })
  total = data.total
  return data
}
</script>
