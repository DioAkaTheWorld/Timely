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


onMounted(loadData);
const entriesWithNames = computed(() => {
  return stats.value.map(e => ({
    ...e,
    projectName: getProjectName(e.project_id),
    activityName: getActivityName(e.activity_id),
    duration: formatTime((new Date(e.end) - new Date(e.start)) / 1000)
  }));
});

// get nom projet
function getProjectName(projectId) {
  return projets.value.find(p => p.id === projectId)?.name || 'Projet inconnu';
}

// get nom activite
function getActivityName(activityId) {
  return activites.value.find(a => a.id === activityId)?.name || 'Activité inconnue';
}

// temps total
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

async function loadData() {
  await projetStore.loadProject();
  projets.value = projetStore.projets;

  await activiteStore.loadActivite();
  activites.value = activiteStore.activites;

  const from = new Date();
  from.setDate(from.getDate() - 30);
  const to = new Date();

  await statsStore.loadStats(from.toISOString().split('T')[0], to.toISOString().split('T')[0]);
  stats.value = statsStore.entries;

  await nextTick();
  drawCharts();
}

// graphique
function drawCharts() {
  if (projectChartInstance) projectChartInstance.destroy();
  if (activityChartInstance) activityChartInstance.destroy();

  const projectLabels = stats.value.map(e => getProjectName(e.project_id));
  const projectData = stats.value.map(e => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    return (end - start) / 60;
  });

  if (projectChartRef.value) {
    projectChartInstance = new Chart(projectChartRef.value, {
      type: 'bar',
      data: {
        labels: projectLabels,
        datasets: [{
          label: 'Temps passé (minutes)',
          data: projectData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  const activityLabels = stats.value.map(e => getActivityName(e.activity_id));
  const activityData = stats.value.map(e => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    return (end - start) / 60; // minutes
  });

  if (activityChartRef.value) {
    activityChartInstance = new Chart(activityChartRef.value, {
      type: 'pie',
      data: {
        labels: activityLabels,
        datasets: [{
          label: 'Temps passé (minutes)',
          data: activityData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
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

    <div class="charts-section">
      <h2>Statistiques par projet</h2>
      <canvas ref="projectChartRef"></canvas>

      <h2>Statistiques par activité</h2>
      <canvas ref="activityChartRef"></canvas>
    </div>
  </div>
</template>
