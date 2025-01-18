<template>
  <div class="flex items-center flex-col pt-10">
    <div class="flex gap-6 mt-2 justify-center w-full">
      <select class="border basis-4/12 rounded p-2" v-model="numberOfPeople" placeholder="Number of people">
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
      <input class="border basis-4/12 rounded p-2" v-model="date" placeholder="date" type="date" />
      <input class="border basis-4/12 rounded p-2" v-model="time" placeholder="Time" type="time" />
    </div>
    <button class="mt-6 bg-red-500 text-white rounded w-96 p-2" @click="searchForPlaces">Search</button>
    <div class="flex flex-col gap-4 mt-6 w-full" ref="scrollContainer">
      <BookingPlace v-for="place in places" :key="place.title" :place />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import {formatDate} from "@/utils/formatDate.ts";
import axios from "axios";
import {useUserStore} from "@/stores/user.ts";
import type {SearchToken} from "@/types/SearchToken.ts";
import type {Posts} from "@/types/Posts.ts";
import type {Place} from "@/types/Place.ts";
import BookingPlace from "@/components/BookingPlace.vue";
import type {User} from "@/types/User.ts";
import {useInfiniteScroll} from "@/composables/useInfiniteScroll.ts";

const userStore = useUserStore()
const numberOfPeople = ref<string>('1')
const date = ref<string>(formatDate()[0]);
const time = ref<string>(formatDate()[1]);
const places = ref<Place[]>([])
const loading = ref(false);
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');

useInfiniteScroll(scrollContainer,  () => searchForPlaces());

const searchForPlaces = async () => {
  const searchId  = await getSearchId()
  const data = await getSearchData(searchId)
  data.posts.forEach((p) => {
    axios.get(`https://site.ontopo.work/api/slug_content?slug=${p.post.slug}&version=${p.post.version}&distributor=14699131&locale=sr`)
        .then((res) => places.value.push({ ...res.data, availability: p.availability }))
  })
}

//Fetching the jwt and immediately fetching the restaurants for booking
(async () => {
  try {
    loading.value = true
    const { data } = await axios.post<User>('https://site.ontopo.work/api/loginAnonymously')
    userStore.jwt = data.jwt_token
    await searchForPlaces()
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
})()

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

const getSearchData = async (searchId: string) => {
  const { data } = await axios.post<Posts>('https://site.ontopo.work/api/search_request', {
    search_id: searchId,
  } , { headers: { 'token': userStore.jwt } })
  return data
}
</script>
