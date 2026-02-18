<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { onMounted } from 'vue';

// router
const router = useRouter();

// user
const auth = useAuthStore();
const nameUser = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')

onMounted(async () => {
    if (!auth.user) {
        await auth.loadProfile()
    }
})

</script>

<template>
    <div class="settings-conatiner">
        <h1>Paramètres généraux</h1>

        <div class="profile">
            <h2>Profile</h2>

            <div v-if="auth.user">
                <p>
                    <strong>Connecté en tant que :</strong><br>
                    <strong>Nom : </strong>{{ auth.user.name }} <br>
                    <strong>Email : </strong>{{ auth.user.email }} <br>
                    <strong>API key : </strong>{{ auth.apikey }}
                </p>
            </div>

            <h2>Modifier le profil</h2>

            <strong>Nom</strong>
            <input 
                type="text"
                placeholder="name"
                v-model="nameUser"
            > <br>

            <strong>Email</strong>
            <input 
                type="text"
                placeholder="email"
                v-model="email"
            > <br><br>

            <button class="btn" @click="auth.updateProfile(nameUser, email)">
                Enregistrer
            </button> <br><br>
        </div>
    </div>
</template>
