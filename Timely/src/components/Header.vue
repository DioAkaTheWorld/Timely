<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    import { useTimeEntriesStore } from '@/stores/timeEntries'
    import { useProjetStore } from '@/stores/projet'
    import { useActiviteStore } from '@/stores/activite'
    import { useDailyObjectivesStore } from '@/stores/dailyObjectives'

    const router = useRouter()
    const auth = useAuthStore()
    const time = useTimeEntriesStore()
    const projets = useProjetStore()
    const activites = useActiviteStore()
    const daily = useDailyObjectivesStore()
    const menuOpen = ref(false)

    // timer pour activité en cours
    const now = ref(Date.now())
    let interval = null

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

    function goStats() {
      router.push('/stats')
    }

</script>

<template>
    <header class="header">
        <div class="left">
            <img src="../../logo.png" alt="logo" class="logo">
            <h1 class="title">Timely</h1>
        </div>

        <div class="right desktop">
            <button class="btn" @click="goMenu">Menu</button>
            <button class="btn" @click="goStats">Stats</button>
            <button class="btn" @click="goSettings">Paramètres généraux</button>
            <button v-if="auth.user" class="btn btn-red" @click="logout">Se déconnecter</button>
        </div>

    </header>

</template>
