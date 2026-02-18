<script setup>
import { useActiviteStore } from '@/stores/activite';
import { ref, onMounted } from 'vue';

const activites = useActiviteStore();

const nameActivite = ref('');
const colorActivite = ref('red'); // couleur par défaut
const activiteAfficher = ref(true);

// edit activite
const activiteEnEdition = ref(null);
const editName = ref('');
const editColor = ref('red');

const couleurs = ['red', 'orange', 'yellow', 'blue', 'green', 'purple'];

onMounted(async () => {
    await activites.loadActivite(); 
});

function modifier(activite) {
    activiteEnEdition.value = activite.id;
    editName.value = activite.name;
    editColor.value = activite.color || 'red';
}

async function sauvegarderModification(id) {
    await activites.modifierActivite(id, editName.value, editColor.value);
    activiteEnEdition.value = null;
}

function afficheActivite() {
    activiteAfficher.value = true;
}

function afficheSupprActivite() {
    activiteAfficher.value = false;
}

async function creer() {
    if (!nameActivite.value) return;
    await activites.creerActivite(nameActivite.value, colorActivite.value);
    nameActivite.value = '';
    colorActivite.value = 'red';
}
</script>

<template>
    <div class="settings-container">

        <!-- Formulaire création d'activités -->
        <div class="projet">
            <h2>Créer une activité</h2>
            <input 
                class="input"
                type="text"
                placeholder="Nom"
                v-model="nameActivite"
            />

            <div class="color-picker">
                <span 
                    v-for="c in couleurs" 
                    :key="c"
                    class="color-circle"
                    :style="{ backgroundColor: c, border: c === colorActivite ? '2px solid black' : '1px solid #ccc' }"
                    @click="colorActivite = c"
                ></span>
            </div>

            <br /><br />
            <button @click="creer" class="btn">Créer</button>
        </div>

        <!-- Liste des activités -->
        <div class="projet">
            <h2>Mes activités</h2>
            <button @click="afficheActivite" class="btn">Actives</button>
            <button @click="afficheSupprActivite" class="btn">Désactivées</button>

            <!-- Activités actives -->
            <div v-if="activiteAfficher">
                <div v-for="activite in activites.actifs" :key="activite.id" class="project-card">
                    <div v-if="activiteEnEdition !== activite.id">
                        <h2>{{ activite.name }}</h2>
                        <p>
                            <strong>Couleur : </strong>
                            <span :style="{ color: activite.color }">{{ activite.color }}</span>
                        </p>
                        <button @click="activites.desactiverActivite(activite.id)" class="btn btn-red">Désactiver</button>
                        <button @click="modifier(activite)" class="btn btn-green">Modifier</button>
                    </div>

                    <div v-else class="edit-card">
                        <input type="text" v-model="editName" placeholder="Nom" class="input" />

                        <div class="color-picker">
                            <span 
                                v-for="c in couleurs" 
                                :key="c"
                                class="color-circle"
                                :style="{ backgroundColor: c, border: c === editColor ? '2px solid black' : '1px solid #ccc' }"
                                @click="editColor = c"
                            ></span>
                        </div>

                        <button @click="sauvegarderModification(activite.id)" class="btn btn-green">Enregistrer</button>
                        <button @click="activiteEnEdition = null" class="btn btn-red">Annuler</button>
                    </div>
                </div>
            </div>

            <!-- Activités désactivées -->
            <div v-if="!activiteAfficher">
                <div v-for="activite in activites.desactiver" :key="activite.id" class="project-card">
                    <h2>{{ activite.name }}</h2>
                    <p>
                        <strong>Couleur : </strong>
                        <span :style="{ color: activite.color }">{{ activite.color }}</span>
                    </p>
                    <button class="btn btn-green" @click="activites.reactiverActivite(activite.id)">Réactiver</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.color-picker {
    display: flex;
    gap: 10px;
    margin-top: 5px;
}

.color-circle {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
}
</style>
