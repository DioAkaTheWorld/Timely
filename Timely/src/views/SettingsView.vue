<script setup>
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue'
    import { onMounted } from 'vue';
    import { useProjetStore } from '@/stores/projet';

    const auth = useAuthStore();
    const router = useRouter();
    const projets = useProjetStore();

    const name = ref(auth.user?.name || '')
    const email = ref(auth.user?.email || '')

    onMounted(async () => {
        if (!auth.user) {
            await auth.loadProfile()
        }

        await projets.loadProject(); 
    })

    function retour() {
        router.push('/home');
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

    function desactiver(id){
        projets.desactiverProjet(id);
    }
 
</script>

<template>
    <button class="btn retour" @click="retour">
        Retour
    </button>
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
            v-model="name"
            > <br>

            <strong>Email</strong>
            <input 
            type="text"
            placeholder="email"
            v-model="email"
            > <br><br>

            <button class="btn" @click="updateProfile">
                Enregistrer
            </button> <br><br>
        </div>

        <div class="projet">
            <h2>Mes Projets</h2>
            <div v-for="projet in projets.projets" :key="projet.id" class="project-card">
                <h2>{{ projet.name }}</h2>
                <p><strong>Description : </strong></p>{{ projet.description }} <br><br>
                <button @click="desactiver(projet.id)" class="logout-btn">Supprimer</button>
            </div>
        </div>
    </div>
</template>