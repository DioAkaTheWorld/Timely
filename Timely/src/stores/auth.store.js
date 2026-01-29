import { defineStore } from 'pinia'

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

        async loadProfile(){
            if (this.apikey != null) {
                try {
                    const response = await api.get('/api/profile');
                    this.user = response.data;
                    this.authenticated = true;
                } catch (error) {
                    this.apikey = null
                    this.user = null
                    this.authenticated = false
                }
            } else {
                return;
            }
        },

        logout(){
            this.apikey = null;
            this.user = null;   
            this.authenticated = false; 
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['apikey'] }
        ]
    } 
})