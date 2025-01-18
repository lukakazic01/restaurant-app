<template>
  <div class="flex items-center flex-col pt-10">
    <Filter @update:restaurants="getRestaurants" />
    <div class="flex flex-col gap-4 mt-6 w-full" ref="scrollContainer">
      <template v-if="restaurantStore.restaurants.length">
        <Restaurant v-for="restaurant in restaurantStore.restaurants" :key="restaurant.title" :restaurant />
      </template>
      <div class="text-center text-xl" v-else-if="!restaurantStore.restaurants.length && !loading">
        <p>Sorry, but currently there are no restaurants for the reservation with this filter. Please try with another one.</p>
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
import type {Posts} from "@/types/Posts.ts";
import type {User} from "@/types/User.ts";
import {useInfiniteScroll} from "@/composables/useInfiniteScroll.ts";
import {useRestaurantStore} from "@/stores/restaurant.ts";
import Restaurant from "@/components/Restaurant.vue";
import Filter from "@/components/Filter.vue";
import {useRoute} from "vue-router";
import Loader from "@/components/Loader.vue";

const route = useRoute()
const restaurantStore = useRestaurantStore()
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const token = ref('');
const loading = ref(false);

useInfiniteScroll(scrollContainer,  () => getRestaurants());

const getRestaurants = async () => {
  try {
    loading.value = true;
    const searchId  = await getSearchId()
    const data = await getSearchData(searchId)
    data.posts.forEach((p) => {
      axios.get(`https://site.ontopo.work/api/slug_content?slug=${p.post.slug}&version=${p.post.version}&distributor=14699131&locale=sr`)
          .then((res) => restaurantStore.restaurants.push({ ...res.data, availability: p.availability }))
    })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false;
  }
}

(async () => {
  try {
    const { data } = await axios.post<User>('https://site.ontopo.work/api/loginAnonymously')
    token.value = data.jwt_token
    await getRestaurants()
  } catch (e) {
    //
  }
})()

const getSearchId = async () => {
  const filters = {
    date: route.query.date as string,
    time: route.query.time as string,
    numberOfPeople: route.query.numberOfPeople as string,
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
  return data
}
</script>
