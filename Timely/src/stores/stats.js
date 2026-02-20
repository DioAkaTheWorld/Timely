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

    // total par projet
    byProject: (state) => {
      const result = {};
      state.entries.forEach(entry => {
        if (!entry.start || !entry.end) return;
        const start = new Date(entry.start);
        const end = new Date(entry.end);
        const diff = (end - start) / 1000;
        if (!result[entry.project_id]) result[entry.project_id] = 0;
        result[entry.project_id] += diff;
      });
      return result;
    },

    // total par activite
    byActivity: (state) => {
      const result = {};
      state.entries.forEach(entry => {
        if (!entry.start || !entry.end) return;
        const start = new Date(entry.start);
        const end = new Date(entry.end);
        const diff = (end - start) / 1000;
        if (!result[entry.activity_id]) result[entry.activity_id] = 0;
        result[entry.activity_id] += diff;
      });
      return result;
    },

    // Liste chronologique
    sortedEntries: (state) => {
      return [...state.entries].sort((a, b) => new Date(a.start) - new Date(b.start));
    }
  },
  actions: {
    async loadStats(from, to) {
      const auth = useAuthStore()
      if (!from || !to) return;
      this.loading = true;
      this.from = from;
      this.to = to;

      try {
        const response = await api.get(`/api/time-entries?from=${from}&to=${to}`, {
          headers: {
            Authorization: `key=${auth.apikey}`
          }
        });
        this.entries = response.data;
      } catch (error) {
        console.error('Erreur loadStats', error);
      }
      this.loading = false;
    }
  }
})
