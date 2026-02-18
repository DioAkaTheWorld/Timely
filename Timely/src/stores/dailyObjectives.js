import { defineStore } from 'pinia'
import api from '../api/index.js'
import { useAuthStore } from './auth.js'

export const useDailyObjectivesStore = defineStore('dailyObjectives', {
  state: () => ({
    todayObjectives: [],
  }),

  actions: {

    // charge les objectifs du jour
    async loadTodayObjectives() {
      const auth = useAuthStore()
      const today = new Date().toISOString().split('T')[0]

      try {
        const response = await api.get(`/api/daily-objectives?date=${today}`, {
          headers: {
            Authorization: `key=${auth.apikey}`
          }
        })
        this.todayObjectives = response.data
      } catch (error) {
        console.error('Erreur loadTodayObjectives', error)
      }
    },

    // marque un objectif comme complété
    async completeObjective(id) {
      const auth = useAuthStore()
      try {
        await api.patch(`/api/daily-objectives/${id}/done`, {}, {
          headers: { Authorization: `key=${auth.apikey}` }
        })
        const obj = this.todayObjectives.find(o => o.id === id)
        if (obj) obj.done = 1
      } catch (error) {
        console.error('Erreur completeObjective', error)
      }
    },

    // marque un objectif comme non complété
    async undoObjective(id) {
      const auth = useAuthStore()
      try {
        await api.patch(`/api/daily-objectives/${id}/undone`, {}, {
          headers: { Authorization: `key=${auth.apikey}` }
        })
        const obj = this.todayObjectives.find(o => o.id === id)
        if (obj) obj.done = 0
      } catch (error) {
        console.error('Erreur undoObjective', error)
      }
    },

    async createObjective(data) {
      const auth = useAuthStore()
      try {
        const response = await api.post('/api/daily-objectives', data, {
          headers: { Authorization: `key=${auth.apikey}` }
        })
        this.todayObjectives.push(response.data)
      } catch (error) {
        console.error('Erreur createObjective', error)
      }
    }
  }
})
