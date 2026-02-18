<script setup>
import { ref, onMounted } from 'vue'
import { useDailyObjectivesStore } from '@/stores/dailyObjectives'

const daily = useDailyObjectivesStore()
const newName = ref('')
const newContent = ref('')

async function addObjective() {
  if (!newName.value) return
  await daily.createObjective({ name: newName.value, content: newContent.value })
  newName.value = ''
  newContent.value = ''
}

async function toggleDone(obj) {
  if (obj.done) {
    await daily.undoObjective(obj.id)
  } else {
    await daily.completeObjective(obj.id)
  }
}

onMounted(async () => {
  await daily.loadTodayObjectives()
})
</script>

<template>
  <div class="daily-objectives">
    <h2>Objectifs du jour</h2>

    <div class="add-objective">
      <input v-model="newName" placeholder="Nom de l'objectif" />
      <input v-model="newContent" placeholder="Contenu (facultatif)" />
      <button @click="addObjective">Ajouter</button>
    </div>

    <ul>
      <li v-for="obj in daily.todayObjectives" :key="obj.id">
        <span :style="{ textDecoration: obj.done ? 'line-through' : 'none' }">
          {{ obj.name }} - {{ obj.content || '' }}
        </span>
        <button @click="toggleDone(obj)">
          {{ obj.done ? 'Annuler' : 'Terminé' }}
        </button>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.daily-objectives {
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
}

.daily-objectives h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.add-objective {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.add-objective input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex: 1 1 200px;
}

.add-objective button {
  background-color: #22c55e;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-objective button:hover {
  background-color: #16a34a;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  background: white;
  margin-bottom: 10px;
  border-radius: 8px;
}

li span {
  flex: 1;
}

li button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

li button:hover {
  background-color: #dc2626;
}
</style>
