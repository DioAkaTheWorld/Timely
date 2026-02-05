import { defineStore } from 'pinia'
import api from '../api/index.js'

export const useAuthStore = defineStore('auth', {
    state(){
        return{
            apikey: null,
            user: null,
            authenticated: false,
        }
    },

    actions: {

        // setter apikey
        setApiKey(key) {
            this.apikey = key;
        },

        // setter user
        setUser(user) {
            this.user = user;
        },

        //charge le profil
        async loadProfile() {
            if (!this.apikey) return

            try {
                const response = await api.get('/api/profile', {
                    headers: {
                        Authorization: `key=${this.apikey}`
                    }
                })

                this.user = response.data
                this.authenticated = true
            } catch (error) {
                console.error('Profile error:', error)
                this.apikey = null
                this.user = null
                this.authenticated = false
            }
        },

        // deconnecte l'utilisateur
        logout(){
            this.apikey = null;
            this.user = null;   
            this.authenticated = false; 
        },

        // modifie le profil
        async updateProfile(name, email) {
            const response = await api.put('/api/profile', {
                name,
                email
            },{
                headers: {
                    Authorization: `key=${this.apikey}`
                }
            })

            this.user = response.data
        },

        // enregistrer un user
        async register(name, email) {
            const response = await api.post('/api/apikeys', {
                name,
                email
            })
            this.setApiKey(response.data.key)
            await this.loadProfile()
        },


    },
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['apikey'] }
        ]
    } 
})