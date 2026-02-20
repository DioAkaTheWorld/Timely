import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'
import ProjectView from '../views/ProjectView.vue'
import ProfileView from '../views/ProfileView.vue'
import ActivityView from '../views/ActivityView.vue'
import StatsView from '../views/StatsView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      children: [
        {
          path: 'profile',
          component: ProfileView,
        },
        {
          path: 'projects',
          component: ProjectView,
        },
        {
          path: 'activities',
          component: ActivityView,
        }
      ]
    },
    {
      path: '/stats',
      component: StatsView,
    }
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.name !== 'login' && !auth.apikey) {
    next({ name: 'login' })
  } else {
    next()
  }
})


export default router
