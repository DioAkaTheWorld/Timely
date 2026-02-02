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

    getters: {
        isAuthenticated(state) {
            return state.authenticated;
        }
    },

    actions: {
        setApiKey(key) {
            this.apikey = key;
        },

        setUser(user) {
            this.user = user;
        },

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

        logout(){
            this.apikey = null;
            this.user = null;   
            this.authenticated = false; 
        },

    },
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['apikey'] }
        ]
    } 
})