<script setup>
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const router = useRouter();

  function param() {
    router.push('/settings')
  }

</script>
<template>
  <div class="home-container">
      <h1 class="home-title">Home</h1>

      <div>
        <button @click="param">
          Paramètres
        </button>
      </div>

      <div v-if="auth.user" class="home-card">
        <p>
          tu es bien connecté
        </p>
      </div>

      <div v-else class="home-loading">
        <p>Chargement du profil...</p>

        <button @click="login">
          Se connceté / créer un compte
        </button>
      </div>
    </div>
</template>
