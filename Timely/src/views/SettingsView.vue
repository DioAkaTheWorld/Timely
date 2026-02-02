<script setup>
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue'

    const auth = useAuthStore();
    const router = useRouter();

    const name = ref('')
    const email = ref('')

    function retour() {
        router.push('/home');
    }
  
    function logout() {
        auth.logout();
        router.push('/login');
    }
    async function updateProfile() {
        try {
            const response = await api.put('/api/profile', {
                name: name.value,
                email: email.value
            })

            auth.setUser(response.data)
        } catch (error) {
            console.error('Erreur update profile', error)
                throw error
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
            <p>
                <strong>Connecté en tant que :</strong><br>
                <strong>Nom : </strong>{{ auth.user.name }} <br>
                <strong>Email : </strong>{{ auth.user.email }} <br>
                <strong>API key : </strong>{{ auth.apikey }}
            </p>

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