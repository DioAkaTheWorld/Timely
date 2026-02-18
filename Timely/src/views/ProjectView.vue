<script setup>
import { useProjetStore } from '@/stores/projet';
import { ref, onMounted } from 'vue';

const projets = useProjetStore();

const nameProjet = ref('');
const description = ref('');
const projetAfficher = ref(true);

// edit projet
const projetEnEdition = ref(null);
const editName = ref('');
const editDescription = ref('');

onMounted(async () => {
    await projets.loadProject(); 
})

// affichage du formulaire pour modifier un projet
function modifier(projet) {
    projetEnEdition.value = projet.id;
    editName.value = projet.name;
    editDescription.value = projet.description;
}

// btn enregistrer la modification d'un projet
async function sauvegarderModification(id) {
    await projets.modifierProjet(id, editName.value, editDescription.value);
    projetEnEdition.value = null;
}

// affichage des projets actif
function afficheProjet(){
    projetAfficher.value = true;
}

//affiche les projets desactiver
function afficheSupprProjet(){
    projetAfficher.value = false;
}
</script>

<template>
    <div class="settings-conatiner">

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
                <button @click="projets.creerProjet(nameProjet, description);" class="btn">Créer</button>
            </div>
        </div>

        <div class="projet">
            <h2>Mes Projets</h2>
            <button @click="afficheProjet" class="btn">Projets actifs</button>
            <button @click="afficheSupprProjet" class="btn">Projets désactiver</button>

            <div v-if="projetAfficher">
                <div v-for="projet in projets.actifs" :key="projet.id" class="project-card">

                    <div v-if="projetEnEdition !== projet.id">
                        <h2>{{ projet.name }}</h2>
                        <p><strong>Description : </strong></p>{{ projet.description }} <br><br>
                        <button @click="projets.desactiverProjet(projet.id)" class="btn btn-red">désactiver</button>
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
                <div v-for="projet in projets.desactiver" :key="projet.id" class="project-card">
                    <h2>{{ projet.name }}</h2>
                    <p><strong>Description : </strong></p>{{ projet.description }} <br><br>
                    <button class="btn btn-green" @click="projets.reactiverProjet(projet.id)">Réactiver</button>
                </div>
            </div>

        </div>
    </div>
</template>
