import { defineStore } from 'pinia'
import api from '../api/index.js'
import { useAuthStore } from './auth.js'

export const useProjetStore = defineStore('projet', {
    state(){
        return {
            projets: [],
            projetSelect: null,
        }
    },

    getters: {
        // projet actifs
        actifs: (state) => state.projets.filter(p => p.is_enabled === 1),
        // projets desactiver
        desactiver: (state) => state.projets.filter(p => p.is_enabled !== 1),
    },

    actions: {

        // charge les projets
        async loadProject(){
            const auth = useAuthStore();
            try {
                const response = await api.get('/api/projects', {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                })
                this.projets = response.data;
            } catch (error) {
                console.error('erreur lors du chargement des projets', error);
            }
        },

        // cree un projet
        async creerProjet(name, description) {
            const auth = useAuthStore();
            try {
                const response = await api.post('/api/projects', {
                    name,
                    description
                },{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                const projet = response.data;
                projet.is_enabled = 1; 
                this.projets.push(projet);
            }catch (error) {
                console.error("error"); 
            }
        },

        // desactive un projet
        async desactiverProjet(id){
            const auth = useAuthStore();
            try {
                const response = await api.patch(`/api/projects/${id}/disable`, {},
                {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                }); 
                const projet = this.projets.find(p => p.id === id);
                if (projet) projet.is_enabled = 0;
            } catch (error) {
                console.error('probleme lors de la suppression', error)
            }
        },

        //reactive un projet
        async reactiverProjet(id){
            const auth = useAuthStore();
            try {
                const response = await api.patch(`/api/projects/${id}/enable`,{},{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                });
                const projet = this.projets.find(p => p.id === id);
                if (projet) projet.is_enabled = 1; 
            } catch (error) {
               console.error('probleme pendant la reactivation du projet', error) 
            }
        },

        // modifie un projet
        async modifierProjet(id, name, description){
            const auth = useAuthStore();
            try {
                const response = await api.put(`/api/projects/${id}`, {
                    name,
                    description, 
                },{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                    
                })
                const projetMisAJour = response.data;
                projetMisAJour.is_enabled = 1;
                const index = this.projets.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.projets[index] = projetMisAJour;
                }
            } catch (error) {
                console.error('probleme lors de la modification', error)
            }
        },

    },

    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['projets'] }
        ]
    } 


})