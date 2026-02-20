<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useStatsStore } from '@/stores/stats';
import { useProjetStore } from '@/stores/projet';
import { useActiviteStore } from '@/stores/activite';
import Chart from 'chart.js/auto';

// Stores
const statsStore = useStatsStore();
const projetStore = useProjetStore();
const activiteStore = useActiviteStore();

</script>


<template>
  <h1>Vue Stats</h1>
</template>
