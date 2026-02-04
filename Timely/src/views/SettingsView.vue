<script setup>
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue'
    import { onMounted } from 'vue';
    import { useProjetStore } from '@/stores/projet';

    const auth = useAuthStore();
    const router = useRouter();
    const projets = useProjetStore();

    // user
    const nameUser = ref(auth.user?.name || '')
    const email = ref(auth.user?.email || '')

    // projet
    const nameProjet = ref('');
    const description = ref('');
    const projetAfficher = ref(true);

    // edit projet
    const projetEnEdition = ref(null);
    const editName = ref('');
    const editDescription = ref('');

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
        if (!nameUser.value || !email.value) {
            alert('Nom et email obligatoires')
            return
        }

        try {
            await auth.updateProfile(nameUser.value, email.value)
            alert('Profil mis à jour')
        } catch (error) {
            alert('Erreur lors de la mise à jour')
        }
    }

    function desactiver(id){
        projets.desactiverProjet(id);
    }
    function reactiverProjet(id){
        projets.recupererProjet(id);
    }

    async function creerProjet() {
        await projets.ajouterProjet(nameProjet.value, description.value);
    }

    function modifier(projet) {
        projetEnEdition.value = projet.id;
        editName.value = projet.name;
        editDescription.value = projet.description;
    }

    async function sauvegarderModification(id) {
        await projets.modifierProjet(id, editName.value, editDescription.value);
        projetEnEdition.value = null;
    }

    function afficheProjet(){
        projetAfficher.value = true;
    }

    function afficheSupprProjet(){
        projetAfficher.value = false;
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
                v-model="nameUser"
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
            <div>
                <h2>Formulaire création de projets</h2>
                <input 
                    class="input"
                    type="text"
                    placeholder="nom"
                    v-model="nameProjet"
                > <br>
                <input 
                    class="input"
                    type="text"
                    placeholder="description"
                    v-model="description"
                > <br> <br>
                <button @click="creerProjet" class="btn">Créer</button>
            </div>
        </div>

        <div class="projet">
            <h2>Mes Projets</h2>
            <button @click="afficheProjet" class="btn">Projets Actuels</button>
            <button @click="afficheSupprProjet" class="btn">Projets supprimer</button>
            <div v-if="projetAfficher">
                <div v-for="projet in projets.projets" :key="projet.id" class="project-card">

                    <div v-if="projetEnEdition !== projet.id">
                        <h2>{{ projet.name }}</h2>
                        <p><strong>Description : </strong></p>{{ projet.description }} <br><br>
                        <button @click="desactiver(projet.id)" class="btn btn-red">Supprimer</button>
                        <button @click="modifier(projet)" class="btn btn-green">Modifier</button>
                    </div>

                    <div v-else class="edit-card">
                        <input
                            type="text"
                            v-model="editName"
                            placeholder="Nom du projet"
                            class="input"
                        />
                        <input
                            type="text"
                            v-model="editDescription"
                            placeholder="Description"
                            class="input"
                        />

                        <button @click="sauvegarderModification(projet.id)" class="btn btn-green">
                            Enregistrer
                        </button>
                        <button @click="projetEnEdition = null" class="btn btn-red">
                            Annuler
                        </button>

                    </div>
                </div>
            </div>

            <div v-if="!projetAfficher">
                <div v-for="projet in projets.projetSuppr" :key="projet.id" class="project-card">
                    <h2>{{ projet.name }}</h2>
                    <p><strong>Description : </strong></p>{{ projet.description }} <br><br>
                    <button class="btn btn-green" @click="reactiverProjet(projet.id)">Réactiver</button>
                </div>
            </div>

        </div>
    </div>
</template>