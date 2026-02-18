import { defineStore } from 'pinia'
import api from '../api/index.js'
import { useAuthStore } from './auth.js'

export const useActiviteStore = defineStore('activite', {
    state() {
        return{
            activites: [],
        }
    },

    getters: {
        // activités actives
        actifs: (state) => state.activites.filter(p => p.is_enabled == 1),
        // activités desactiver
        desactiver: (state) => state.activites.filter(p => p.is_enabled != 1),
        // get by id
        getById: (state) => (id) => state.activites.find(a => a.id === id),
    },

    actions: {

        // charge les activités
        async loadActivite(){
            const auth = useAuthStore();
            try {
                const response = await api.get('/api/activities',{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                this.activites = response.data;
            } catch (error) {
                console.error('erreur lors du chargement des activités', error);
            }
        },

        // creer une activité
        async creerActivite(name, color) {
            const auth = useAuthStore();
            try {
                const response = await api.post('/api/activities', {
                    name,
                    color
                },{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                const activite = response.data;
                activite.is_enabled = 1; 
                this.activites.push(activite);
            } catch (error) {
                console.error("erreur lors de la creation de l activité", error); 
            }
        },

        // desactive une activité
        async desactiverActivite(id){
            const auth = useAuthStore();
            try {
                const response = await api.patch(`/api/activities/${id}/disable`, {}, {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                const activite = this.activites.find(p => p.id === id);
                activite.is_enabled = 0;
            } catch (error) {
                console.error(`erreur lors de la desactivation de l activité d id: ${id}`, error);
            }
        }, 

        // réactive une activité
        async reactiverActivite(id){
            const auth = useAuthStore();
            try {
                const response = await api.patch(`/api/activities/${id}/enable`, {}, {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                const activite = this.activites.find(p => p.id === id);
                activite.is_enabled = 1; 
            } catch (error) {
                console.error('erreur lors de la reactivation de cette activité', error);
            }
        },

        // modifie une activité
        async modifierActivite(id, name, color) {
            const auth = useAuthStore();
            try {
                const response = await api.put(`/api/activities/${id}`, {
                    name,
                    color
                },{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                const activiteMisAJour = response.data;
                activiteMisAJour.is_enabled = 1;
                const index = this.activites.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.activites[index] = activiteMisAJour;
                }
            } catch (error) {
                console.error('erreur lors de la modification de l activité', error);
            }
        },
    },

    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['activites'] }
        ]
    } 
})