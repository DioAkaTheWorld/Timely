<script setup>
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { useProjetStore } from '@/stores/projet';
  
  const auth = useAuthStore();
  const router = useRouter();
  const projets = useProjetStore();

  const name = ref('');
  const description = ref('');

  function login(){
    router.push('/login');
  }

  function creerProjet() {
    projets.ajouterProjet(name.value, description.value);
    alert('projet créer');
  }


</script>
<template>
  <div class="home-container">
      <h1 class="home-title">Home</h1>
      <div v-if="auth.user" class="home-card">
        <h2>Formulaire création de projets</h2>
        <input 
        type="text"
        placeholder="nom"
        v-model="name"
        > <br>
        <input 
        type="text"
        placeholder="description"
        v-model="description"
        > <br> <br>
        <button @click="creerProjet" class="btn">Créer</button>
      </div>

      <div v-else class="home-loading">
        <p>Chargement du profil...</p>

        <button class="btn" @click="login">
          Se connceté / créer un compte
        </button>
      </div>
    </div>
</template>
