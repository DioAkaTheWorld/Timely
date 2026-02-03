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

    actions: {
        async loadProject(){
            const auth = useAuthStore();
            try {
                const response = await api.get('/api/projects', {
                    headers: {
                        Authorization: `key=${auth.apikey}`
                    }
                })

                this.projets = response.data.filter(projet => projet.is_enabled === 1);;
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
                this.projets = this.projets.filter(projet => projet.id !== id);
            } catch (error) {
                console.error('probleme lors de la suppression', error)
            }
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {storage: localStorage, paths: ['projets'] }
        ]
    } 


})