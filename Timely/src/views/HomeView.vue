<script setup>
  import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const router = useRouter();

  onMounted(() => {
    auth.loadProfile();
    alert("enregistrer votre apikey quelque part : " + auth.apikey);
  })
  function logout() {
    auth.logout();
    router.push('/login');
  }

</script>
<template>
<div class="home-container">
    <h1 class="home-title">Home</h1>

    <div v-if="auth.user" class="home-card">
      <p class="home-user">
        <strong>Connecté en tant que :</strong><br>
        {{ auth.user.name }}<br>
        {{ auth.user.email }}<br>
      </p>

      <button class="btn logout-btn" @click="logout">
        Se déconnecter
      </button>
    </div>

    <div v-else class="home-loading">
      <p>Chargement du profil...</p>
    </div>
  </div>
</template>
