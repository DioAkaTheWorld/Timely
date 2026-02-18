<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimeEntriesStore } from '@/stores/timeEntries'
import { useProjetStore } from '@/stores/projet'
import { useActiviteStore } from '@/stores/activite'

const projets = useProjetStore()
const activites = useActiviteStore()
const time = useTimeEntriesStore()

// formulaire
const selectedProject = ref('')
const selectedActivity = ref('')
const comment = ref('')

// timer
const now = ref(Date.now())
let interval = null

// format durée
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
}

// durée activité en cours
const currentDuration = computed(function() {
  if (!time.currentEntry) return 0
  const start = new Date(time.currentEntry.start).getTime()
  return Math.floor((now.value - start)/1000)
})

// start activité
async function start() {
  if (!selectedProject.value || !selectedActivity.value) return
  await time.startEntry(selectedProject.value, selectedActivity.value, comment.value)
  comment.value = ''
}

onMounted(async function() {
  await projets.loadProject()
  await activites.loadActivite()
  await time.loadTodayEntries()

  interval = setInterval(function() {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(function() {
  clearInterval(interval)
})
</script>

<template>
  <div class="tracker-container">

    <div class="card tracker">
      <h2>Time Tracker</h2>

      <div v-if="time.currentEntry === null">
        <select v-model="selectedProject" class="input">
          <option disabled value="">Choisir un projet</option>
          <option v-for="projet in projets.actifs || []" :key="projet.id" :value="projet.id">
            {{ projet.name }}
          </option>
        </select>

        <select v-model="selectedActivity" class="input">
          <option disabled value="">Choisir une activité</option>
          <option v-for="act in activites.actifs || []" :key="act.id" :value="act.id">
            {{ act.name }}
          </option>
        </select>

        <textarea v-model="comment" placeholder="Commentaire..." class="input"></textarea>
        <button class="btn btn-green" @click="start">START</button>
      </div>

      <div v-else class="active-session">
        <h3>Activité en cours</h3>
        <p><strong>Projet :</strong> {{ projets.getById(time.currentEntry.project_id)?.name || '' }}</p>
        <p><strong>Activité :</strong> {{ activites.getById(time.currentEntry.activity_id)?.name || '' }}</p>
        <div class="timer">⏱ {{ formatDuration(currentDuration) }}</div>
        <button class="btn btn-red" @click="time.stopEntry(time.currentEntry.id)">STOP</button>
      </div>
    </div>

    <div class="card entries">
      <h2>Entrées du jour</h2>
      <div v-for="entry in time.todayEntries || []" :key="entry.id" class="entry-item">
        <div><strong>{{ projets.getById(entry.project_id)?.name || '' }}</strong> - {{ activites.getById(entry.activity_id)?.name || '' }}</div>
        <div>{{ entry.start ? new Date(entry.start).toLocaleTimeString() : '' }} - {{ entry.end ? new Date(entry.end).toLocaleTimeString() : 'En cours' }}</div>
        <div>{{ entry.comment || '' }}</div>
        <button class="btn btn-red" @click="time.deleteEntry(entry.id)">Supprimer</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.tracker-container { padding: 30px; background: #f4f6f9; min-height: 100vh; }
.card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); margin-bottom: 30px; }
.input { width: 100%; padding: 10px; margin-bottom: 15px; }
.timer { font-size: 28px; font-weight: bold; margin: 15px 0; }
.entry-item { border-bottom: 1px solid #eee; padding: 10px 0; }
.btn-green { background: #22c55e; color: white; }
.btn-red { background: #ef4444; color: white; }
</style>
