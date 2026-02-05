<script setup>
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const router = useRouter();

  function login(){
    router.push('/login');
  }
</script>
<template>
  <div class="home-container">
      <h1 class="home-title">Home</h1>
      <div v-if="auth.user" class="home-card">
        <h2>bienvenue sur le home</h2>
      </div>

      <div v-else class="home-loading">
        <p>Veuillez vous connecter ou créer un compte</p>

        <button class="btn" @click="login">
          Se connceter / créer un compte
        </button>
      </div>
    </div>
</template>
