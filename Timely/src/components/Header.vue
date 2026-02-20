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

    // formatage sécurisé du temps
    function formatTime(seconds = 0) {
      if (!seconds || isNaN(seconds) || seconds < 0) seconds = 0
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = Math.floor(seconds % 60)
      return `${h}h ${m}m ${s}s`
    }

    // durée activité en cours
    const currentDuration = computed(() => {
      if (!time.currentEntry || !time.currentEntry.start) return 0
      const start = new Date(time.currentEntry.start).getTime()
      if (isNaN(start)) return 0
      return Math.floor((now.value - start) / 1000)
    })

    // total aujourd'hui (y compris activité en cours)
    const totalToday = computed(() => {
      const entries = time.todayEntries || []
      let total = entries.reduce((acc, e) => {
        const start = e.start ? new Date(e.start).getTime() : NaN
        const end = e.end ? new Date(e.end).getTime() : now.value
        if (isNaN(start) || isNaN(end)) return acc
        return acc + (end - start) / 1000
      }, 0)
      return formatTime(total)
    })

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
