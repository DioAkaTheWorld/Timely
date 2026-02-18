<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goProfile() {
  router.push('/settings/profile')
}

function goProjects() {
  router.push('/settings/projects')
}

function goActivities() {
  router.push('/settings/activities')
}
</script>

<template>
  <div class="settings-layout">
    <h1>Paramètres généraux</h1>

    <div class="settings-menu">
      <button class="btn" @click="goProfile">Mon profil</button>
      <button class="btn" @click="goProjects">Mes projets</button>
      <button class="btn" @click="goActivities">Mes activités</button>
    </div>

    <div class="settings-content">
      <RouterView />
    </div>
  </div>
</template>
