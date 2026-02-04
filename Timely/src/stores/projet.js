import { defineStore } from 'pinia'
import api from '../api/index.js'
import { useAuthStore } from './auth.js'

export const useProjetStore = defineStore('projet', {
    state(){
        return {
            projets: [],
            projetSuppr: [],
            projetSelect: null,
        }
    },

    actions: {
        async loadProject(){
            const auth = useAuthStore();
            try {
                const response = await api.get('/api/projects', {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                })

                this.projets = response.data.filter(projet => projet.is_enabled === 1);
                this.projetSuppr = response.data.filter(projet => projet.is_enabled !== 1);
            } catch (error) {
                console.error('vous ne semblez pas avoir de projet pour le moment')
            }
        },

        async ajouterProjet(name, description) {
            const auth = useAuthStore();
            try {
                const response = await api.post('/api/projects', {
                    name,
                    description
                },{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                })

                this.projets.push(response.data);
            }catch (error) {
                console.error("error"); 
            }
        },

        async desactiverProjet(id){
            const auth = useAuthStore();
            try {
                const response = await api.patch(`/api/projects/${id}/disable`, {},
                {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                }) 
                const projet = this.projets.find(p => p.id === id);
                if (projet) {
                    projet.is_enabled = 0;
                    this.projets = this.projets.filter(p => p.id !== id);
                    this.projetSuppr.push(projet);
                }
            } catch (error) {
                console.error('probleme lors de la suppression', error)
            }
        },

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

                const index = this.projets.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.projets[index] = projetMisAJour;
                }
            } catch (error) {
                console.error('probleme lors de la modification', error)
            }
        },

        async recupererProjet(id){
            const auth = useAuthStore();
            try {
                const response = await api.patch(`/api/projects/${id}/enable`,{},{
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                })
                const projet = this.projetSuppr.find(p => p.id === id);
                if (projet) {
                    projet.is_enabled = 1;
                    this.projetSuppr = this.projetSuppr.filter(p => p.id !== id);
                    this.projets.push(projet);
                }
                
            } catch (error) {
               console.error('probleme pendant la reactivation du projet', error) 
            }
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['projets', 'projetSuppr'] }
        ]
    } 


})