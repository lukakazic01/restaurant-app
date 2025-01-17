<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from "axios";
import {useUserStore} from "@/stores/user.ts";
import type {User} from "@/types/User.ts";
import {ref} from "vue";

const userStore = useUserStore();
const loading = ref(false);

(async () => {
  try {
    loading.value = true
    const { data } = await axios.post<User>('https://site.ontopo.work/api/loginAnonymously')
    userStore.jwt = data.jwt_token
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
})()
</script>

<style scoped>
</style>
