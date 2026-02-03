<script setup>
    import { ref } from 'vue'
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router'
    import { useProjetStore } from '@/stores/projet';

    const auth = useAuthStore();
    const projets = useProjetStore();
    const router = useRouter();
    
    // apikey
    const apiKeyInput = ref('')
    const apiKeyError = ref(null)

    // creation de compte 
    const name = ref('')
    const email = ref('')
    const registerError = ref(null)

    // connection apikey deja existante 
    async function loginWithApiKey() {
    apiKeyError.value = null
        try {
            auth.setApiKey(apiKeyInput.value)
            await auth.loadProfile()
            router.push('/home')
            projets.loadProject()
        } catch (e) {
            apiKeyError.value = 'Clé API invalide'
        }
    }

    // creation d'un nouveau compte
    async function register() {
        registerError.value = null
        try {
            await auth.register(name.value, email.value)
            router.push('/home')
        } catch (e) {
            registerError.value = 'Impossible de créer le compte'
        }
    }

</script>

<template>
    <div class="login-container">
        <h1 class="login-title">Connexion</h1>
        <div class="login-card">
            <h2>J’ai déjà une clé API</h2>

            <input
                class="input"
                type="text"
                placeholder="Clé API"
                v-model="apiKeyInput"
            />

            <button class="btn" @click="loginWithApiKey">
                Se connecter
            </button>

            <p v-if="apiKeyError" class="error">
                {{ apiKeyError }}
            </p>
        </div>

        <div class="login-card">
            <h2>Créer un compte</h2>

            <input
                class="input"
                type="text"
                placeholder="Nom complet"
                v-model="name"
            />

            <input
                class="input"
                type="email"
                placeholder="Email"
                v-model="email"
            />

            <button class="btn" @click="register">
                Créer un compte
            </button>

            <p v-if="registerError" class="error">
                {{ registerError }}
            </p>
        </div>
    </div>
</template>