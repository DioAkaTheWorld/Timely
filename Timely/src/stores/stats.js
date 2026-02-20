import { defineStore } from 'pinia'
import api from '../api/index.js'
import { useAuthStore } from './auth.js'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    entries: [],
    from: null,
    to: null,
    loading: false,
  }),

  getters: {
    // temps total
    totalTime: (state) => {
      return state.entries.reduce((total, entry) => {
        if (!entry.start || !entry.end) return total
        const start = new Date(entry.start)
        const end = new Date(entry.end)
        return total + (end - start) / 1000
      }, 0)
    },
  },
})
