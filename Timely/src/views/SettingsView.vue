<script setup>
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue'
    import { onMounted } from 'vue';

    const auth = useAuthStore();
    const router = useRouter();

    const name = ref(auth.user?.name || '')
    const email = ref(auth.user?.email || '')

    onMounted(async () => {
        if (!auth.user) {
            await auth.loadProfile()
        }
    })

    function retour() {
        router.push('/home');
    }
  
    function logout() {
        auth.logout();
        router.push('/login');
    }

    async function updateProfile() {
        if (!name.value || !email.value) {
            alert('Nom et email obligatoires')
            return
        }

        try {
            await auth.updateProfile(name.value, email.value)
            alert('Profil mis à jour')
        } catch (error) {
            alert('Erreur lors de la mise à jour')
        }
    }
 
</script>

<template>
    <div class="settings-conatiner">
        <button @click="retour">
            Retour
        </button>
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
            v-model="name"
            > <br>

            <strong>Email</strong>
            <input 
            type="text"
            placeholder="email"
            v-model="email"
            > <br>

            <button @click="updateProfile">
                Enregistrer
            </button> <br>


            <button class="btn logout-btn" @click="logout">
                Se déconnecter
            </button>
        </div>
    </div>
</template>