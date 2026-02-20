# Timely

## Membre du groupe
- Baptiste Delaborde
- Burak Ozen

## Lien git 
- https://github.com/DioAkaTheWorld/Timely
  

## Fonctionnalités principales

1. **Time Tracker**  
   - Démarrer et stopper des activités.  
   - Affichage dynamique du timer en heures, minutes et secondes.  
   - Liste des entrées du jour avec projet, activité, horaires et commentaires.  

2. **Header intelligent**  
   - Toujours visible une fois connecté.  
   - Affiche le projet et l’activité en cours, avec le timer.  
   - Affiche le temps total travaillé aujourd’hui.  
   - Affiche le nombre d’objectifs atteints sur le total.  
   - Boutons pour accéder à la page d’accueil, aux statistiques et aux paramètres.  
   - Bouton de déconnexion.  

3. **Objectifs du jour**  
   - Création et suivi des objectifs.  
   - Marquage des objectifs comme terminés ou non.  
   - Affichage du ratio `Objectifs terminés / Objectifs totaux`.  

4. **Statistiques**  
   - Graphiques par projet et par activité.  
   - Affichage sous forme de barres et camemberts.  

---

## Installation

1. Cloner le dépôt :  
```bash
git clone https://github.com/DioAkaTheWorld/Timely.git
cd Timely
```
2. Installer les dépendances :
```bash
npm install
npm install axios vue-router pinia pinia-plugin-persist chart.js
```
3. Lancer l’application en développement :

```bash
npm run dev
```
L’application sera disponible sur http://localhost:5173 

# Structure du projet 

```text
src/
├─ stores/
│ ├─ auth.js
│ ├─ projet.js
│ ├─ activite.js
│ ├─ timeEntries.js
│ ├─ dailyObjectives.js
│ └─ stats.js
├─ views/ 
│ ├─ Home.vue
│ ├─ Tracker.vue
│ ├─ Stats.vue
│ ├─ Settings.vue
│ └─ Login.vue
├─ components/ 
│ ├─ Header.vue
│ ├─ DailyObjectives.vue
│ └─ TimeTracker.vue
├─ api/
│ └─ index.js
├─ assets/
│ └─ style.css
├─ router/
  └─ index.js 
```

