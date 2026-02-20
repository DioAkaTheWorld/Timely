<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useStatsStore } from '@/stores/stats';
import { useProjetStore } from '@/stores/projet';
import { useActiviteStore } from '@/stores/activite';
import Chart from 'chart.js/auto';

// stores
const statsStore = useStatsStore();
const projetStore = useProjetStore();
const activiteStore = useActiviteStore();


// refs charts
const projectChartRef = ref(null);
const activityChartRef = ref(null);
let projectChartInstance = null;
let activityChartInstance = null;

// donnees locales
const projets = ref([]);
const activites = ref([]);
const stats = ref([]);

// get nom projet
function getProjectName(projectId) {
  return projets.value.find(p => p.id === projectId)?.name || 'Projet inconnu';
}

// get nom activite
function getActivityName(activityId) {
  return activites.value.find(a => a.id === activityId)?.name || 'Activité inconnue';
}

</script>


<template>
  <div class="stats-container">
    <h2>Historique des entrées</h2>
    <table class="stats-table">
      <thead>
      <tr>
        <th>Date</th>
        <th>Projet</th>
        <th>Activité</th>
        <th>Durée</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="entry in entriesWithNames" :key="entry.id">
        <td>{{ new Date(entry.start).toLocaleDateString() }}</td>
        <td>{{ entry.projectName }}</td>
        <td>{{ entry.activityName }}</td>
        <td>{{ entry.duration }}</td>
      </tr>
      </tbody>
    </table>

  </div>
</template>
