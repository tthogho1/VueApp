import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/loginFormView.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue')
    }
  ]
})

export default router
