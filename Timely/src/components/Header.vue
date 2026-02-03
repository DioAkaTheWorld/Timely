<script setup>
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth';

    const auth = useAuthStore();
    const router = useRouter();

    function logout() {
        auth.logout();
        router.push('/login');
    }

    function goSettings() {
        router.push('/settings')
    }

</script>

<template>
    <header class="header">
        <div class="left">
            <img src="../../logo.png" alt="logo" class="logo">
            <h1 class="title">Timely</h1>
        </div>

        <div class="right">
            <button class="btn" @click="goSettings">
                Paramètres généraux
            </button>

            <div v-if="auth.user">
                <button class="btn logout-btn" @click="logout">
                    Se déconnecter
                </button>
            </div>
            
        </div>
    </header>
</template>