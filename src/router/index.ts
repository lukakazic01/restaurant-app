import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/search',
      name: 'search',
      component: Home,
    },
    {
      path: '/',
      alias: '/home',
      redirect: '/search',
    }
  ],
})

export default router
