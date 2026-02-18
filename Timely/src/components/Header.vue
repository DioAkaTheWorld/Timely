<script setup>
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth';
    import { ref } from 'vue' 

    const auth = useAuthStore();
    const router = useRouter();

    const menuOpen = ref(false)

    function logout() {
        auth.logout();
        router.push('/login');
    }

    function goSettings() {
        router.push('/settings');
    }

    function goMenu() {
        router.push('/home');
    }

</script>

<template>
    <header class="header">
        <div class="left">
            <img src="../../logo.png" alt="logo" class="logo">
            <h1 class="title">Timely</h1>
        </div>

        <!-- Conteneur unique pour les boutons à droite -->
        <div class="right desktop">
            <button class="btn" @click="goMenu">Menu</button>
            <button class="btn" @click="goSettings">Paramètres généraux</button>
            <button v-if="auth.user" class="btn btn-red" @click="logout">Se déconnecter</button>
        </div>

    </header>

</template>