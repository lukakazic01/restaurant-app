<template>
  <div class="flex items-center flex-col pt-10">
    <div class="flex gap-6 mt-2 justify-center">
      <select class="border rounded p-2" v-model="numberOfPeople" placeholder="Number of people">
        <option selected value="1">1 osoba</option>
        <option value="2">2 osobe</option>
        <option value="3">3 osobe</option>
        <option value="4">4 osobe</option>
        <option value="5">5 osoba</option>
        <option value="6">6 osoba</option>
        <option value="7">7 osoba</option>
        <option value="8">8 osoba</option>
        <option value="9">9 osoba</option>
        <option value="10">10 osoba</option>
      </select>
      <input class="border rounded p-2" v-model="date" placeholder="date" type="date" />
      <input class="border rounded p-2" v-model="time" placeholder="Time" type="time" />
    </div>
    <button class="mt-6 bg-red-500 text-white rounded w-96 p-2" @click="searchForRestaurants">Search</button>
    <Restaurant v-for="restaurant in restaurants" :key="restaurant.post.slug" :restaurant="restaurant" />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {formatDate} from "@/utils/formatDate.ts";
import axios from "axios";
import {useUserStore} from "@/stores/user.ts";
import type {SearchToken} from "@/types/SearchToken.ts";
import type {Post, Posts} from "@/types/Posts.ts";
import Restaurant from "@/components/Restaurant.vue";

const userStore = useUserStore()
const numberOfPeople = ref<string>('1')
const date = ref<string>(formatDate()[0]);
const time = ref<string>(formatDate()[1]);
const restaurants = ref<Post[]>([]);


// In the real application, I would make config for the axios so it automatically sends on every request token
const searchForRestaurants = async () => {
  const searchId  = await getSearchId()
  const { data } = await axios.post<Posts>('https://site.ontopo.work/api/search_request', {
    search_id: searchId,
  } , { headers: { 'token': userStore.jwt } })
  restaurants.value = data.posts
  const prepareForAllRequests = data.posts.map((p) => ({ slug: p.post.slug, version: p.post.version, distributor: 14699131 }))
  console.log(prepareForAllRequests)
}

const getSearchId = async () => {
  const { data } = await axios.post<SearchToken>('https://site.ontopo.work/api/search_token', {
    criteria: {
      date: date.value.replaceAll('-', ''),
      time: time.value.replaceAll(':', ''),
      size: numberOfPeople.value,
    },
    marketplace_id: "15380287",
    locale: "en",
    geocodes: ["belgrade"]

  }, { headers: { 'token': userStore.jwt } })
  return data.search_id
}
</script>
