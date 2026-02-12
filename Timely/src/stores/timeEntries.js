import { defineStore } from 'pinia'
import api from '../api/index.js'
import { useAuthStore } from './auth.js'

export const useTimeEntriesStore = defineStore('timeEntries', {
  state: () => ({
    timeEntries: [],
    currentEntry: null,
  }),

  getters: {
    // entrees du jour uniquement
    todayEntries: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.timeEntries.filter(e =>
        e.start?.startsWith(today)
      )
    },

    // total travaille aujourd'hui en secondes
    totalTodaySeconds: (state) => {
      return state.timeEntries.reduce((total, entry) => {
        if (!entry.start) return total

        const start = new Date(entry.start)
        const end = entry.end ? new Date(entry.end) : new Date()

        const diff = (end - start) / 1000
        return total + diff
      }, 0)
    }
  },

  actions: {

    // charge les entrees du jour
    async loadTodayEntries() {
      const auth = useAuthStore();
      const today = new Date().toISOString().split('T')[0];
      try {
        const response = await api.get(
          `/api/time-entries?from=${today}&to=${today}`,
          {
            headers: {
              Authorization: `key=${auth.apikey}`
            }
          }
        );
        this.timeEntries = response.data;
        this.currentEntry = this.timeEntries.find(e => !e.end) || null;
      } catch (error) {
        console.error('Erreur chargement time entries', error)
      }
    },

    // Démarre une activite
    async startEntry(project_id, activity_id, comment = '') {
      const auth = useAuthStore();
      try {
        const response = await api.post(
          '/api/time-entries',
          {
            project_id,
            activity_id,
            comment
          },
          {
            headers: {
              Authorization: `key=${auth.apikey}`
            }
          }
        );
        const entry = response.data;
        this.currentEntry = entry;
        this.timeEntries.push(entry);
      } catch (error) {
        console.error('Erreur start entry', error);
      }
    },

    // Stop une activite en cours
    async stopEntry(id) {
      const auth = useAuthStore();
      try {
        await api.patch(
          `/api/time-entries/${id}/stop`,
          {},
          {
            headers: {
              Authorization: `key=${auth.apikey}`
            }
          }
        );
        const entry = this.timeEntries.find(e => e.id === id)
        if (entry) {
          entry.end = new Date().toISOString();
        }
        this.currentEntry = null;
      } catch (error) {
        console.error('Erreur stop entry', error);
      }
    },

    // Supprime une entree
    async deleteEntry(id) {
      const auth = useAuthStore();
      try {
        await api.delete(
          `/api/time-entries/${id}`,
          {
            headers: {
              Authorization: `key=${auth.apikey}`
            }
          }
        )
        this.timeEntries = this.timeEntries.filter(e => e.id !== id);
      } catch (error) {
        console.error('Erreur delete entry', error)
      }
    },

    // modifie une entree
    async updateEntry(id, data) {
      const auth = useAuthStore();
      try {
        const response = await api.put(
          `/api/time-entries/${id}`,
          data,
          {
            headers: {
              Authorization: `key=${auth.apikey}`
            }
          }
        );
        const updated = response.data;
        const index = this.timeEntries.findIndex(e => e.id === id);
        if (index !== -1) {
          this.timeEntries[index] = updated;
        }
      } catch (error) {
        console.error('Erreur update entry', error);
      }
    }
  }
})
