<template>
  <div class="flex items-center flex-col pt-10">
    <Filter @update:restaurants="getRestaurants" />
    <div class="flex flex-col gap-4 mt-6 w-full" ref="scrollContainer">
      <template v-if="restaurantStore.restaurants.length">
        <Restaurant v-for="(restaurant, index) in restaurantStore.restaurants" :key="restaurant.title" :restaurant :index />
      </template>
      <div class="text-center" v-else-if="!errorMessage && !loading && !restaurantStore.restaurants.length">
        Sorry, but currently there are no restaurants to book for this filter, try again later.
      </div>
      <div class="text-center text-red-500" v-else-if="errorMessage && !loading">
        {{ errorMessage }}
      </div>
      <div class="flex justify-center py-10" :class="{ 'visible': loading, '!invisible': !loading }">
        <Loader />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import axios from "axios";
import type {SearchToken} from "@/types/SearchToken.ts";
import type {Post, Posts} from "@/types/Posts.ts";
import type {User} from "@/types/User.ts";
import {useInfiniteScroll} from "@/composables/useInfiniteScroll.ts";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import Restaurant from "@/components/Restaurant.vue";
import Filter from "@/components/Filter.vue";
import {useRoute} from "vue-router";
import Loader from "@/components/Loader.vue";
import {getErrorMessage} from "@/utils/getErrorMessage.ts";

const route = useRoute()
const restaurantStore = useRestaurantStore()
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const token = ref('');
const loading = ref(false);
const errorMessage = ref("");
let total = 0
let posts: Post[] = [];

useInfiniteScroll(scrollContainer,  () => {
  if (total > posts.length) {
    getRestaurants()
  }
});

// For the simplicity, token is stored in local variable and passed to every request manually
// In real application, I would make config and pass from localStorage on every request token automatically
(async () => {
  try {
    const { data } = await axios.post<User>('https://site.ontopo.work/api/loginAnonymously')
    token.value = data.jwt_token
    await getRestaurants()
  } catch (e) {
    errorMessage.value = getErrorMessage(e)
  }
})()

async function getRestaurants() {
  try {
    loading.value = true;
    const searchId  = await getSearchId()
    const searchData = await getSearchData(searchId)
    searchData.posts.forEach((p) => {
      axios.get(`https://site.ontopo.work/api/slug_content?slug=${p.post.slug}&version=${p.post.version}&distributor=14699131&locale=sr`)
          .then((res) => restaurantStore.restaurants.push({ ...res.data, availability: p.availability, show_areas: false }))
    })
  } catch (e) {
    errorMessage.value = getErrorMessage(e)
  } finally {
    loading.value = false;
  }
}

const getSearchId = async () => {
  const filters = {
    date: typeof route.query.date === 'string' ? route.query.date : '',
    time: typeof route.query.time === 'string' ? route.query.time : '',
    numberOfPeople: typeof route.query.numberOfPeople === 'string' ? route.query.numberOfPeople : '',
  }
  const { data } = await axios.post<SearchToken>('https://site.ontopo.work/api/search_token', {
    criteria: {
      date: filters.date.replaceAll('-', ''),
      time: filters.time.replaceAll(':', ''),
      size: filters.numberOfPeople,
    },
    marketplace_id: "15380287",
    locale: "en",
    geocodes: ["belgrade"]
  }, { headers: { token: token.value } })
  return data.search_id
}

const getSearchData = async (searchId: string) => {
  const { data } = await axios.post<Posts>('https://site.ontopo.work/api/search_request', {
    search_id: searchId,
  } , { headers: { token: token.value } })
  posts = [...posts, ...data.posts]
  total = data.total
  return data
}
</script>
