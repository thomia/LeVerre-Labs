# Plan MVP - Workflow Béta Testeur
## ProtoVerreTMS - Version Béta

---

## 📋 Vue d'ensemble

Ce document décrit l'architecture et le workflow complet pour les béta testeurs qui participeront aux webinaires de présentation de l'outil ProtoVerreTMS.

---

## 🎯 Objectifs du MVP

### Deux cas d'usage principaux :

1. **Formation/Sensibilisation** : Utiliser le modèle du verre pour imager les propos en formation
2. **Analyse de poste** : Analyser un poste de travail via des sliders simples pour chaque facteur ergonomique

---

## 🏗️ Architecture du Workflow

### 1. Authentification (À implémenter)

**Technologies :**
- Next.js App Router avec Server Actions
- Cookies sécurisés pour les sessions
- Validation côté client et serveur
- Pas de Prisma/DB pour le MVP (utilisation localStorage + API routes)

**Pages :**
```
/auth/inscription     → Création de compte béta testeur
/auth/connexion       → Connexion
/auth/mot-de-passe    → Réinitialisation (optionnel pour MVP)
```

**Données stockées (localStorage pour MVP) :**
```typescript
interface BetaUser {
  id: string
  email: string
  nom: string
  prenom: string
  entreprise?: string
  role: 'beta-testeur'
  dateInscription: string
  derniereConnexion: string
}
```

---

### 2. Dashboard d'accueil (Après connexion)

**Route :** `/dashboard`

**Fonctionnalités :**
- Message de bienvenue personnalisé
- 2 cartes principales :
  - 🎓 **Mode Formation** : Présenter le modèle du verre
  - 🔍 **Mode Analyse** : Analyser un poste de travail

---

### 3. Mode Formation/Présentation

**Route :** `/presentation`

**Description :**
Interface interactive pour présenter le modèle ProtoVerreTMS lors de formations/sensibilisations.

**Composants :**
- Modèle du verre interactif (basé sur dashboard-new.tsx)
- Sliders globaux pour chaque élément :
  - 🚰 **Robinet** (Charge de travail) : 0-100
  - 🥃 **Verre** (Capacité d'absorption) : 0-100
  - 🥤 **Paille** (Récupération) : 0-80
  - 🫧 **Bulle** (Environnement) : 0-100
  - ⛈️ **Orage** (Aléas) : 0-100

**Fonctionnalités :**
- Contrôles de simulation (Play/Pause/Reset)
- Vitesse de simulation (x1 à x10)
- Chronomètre de travail simulé (8 minutes = journée)
- Visualisation en temps réel du modèle hydraulique
- Mode plein écran pour présentations
- Bouton "Randomiser" pour générer des scénarios

**Explication pédagogique intégrée :**
- Tooltips explicatifs sur chaque élément
- Panneau latéral avec explications textuelles
- Codes couleur selon les niveaux de risque

---

### 4. Mode Analyse de Poste

**Route :** `/analyse/nouvelle`

**Workflow étape par étape :**

#### Étape 1 : Informations de base
```typescript
interface AnalyseBase {
  poste: string          // Ex: "Opérateur d'assemblage"
  tache: string          // Ex: "Assemblage de modules électroniques"
  duree: number          // En minutes
  date: Date
  operateur?: string     // Optionnel
}
```

#### Étape 2 : Évaluation simplifiée par sliders

**🚰 Robinet - Charge de travail (0-100)**
5 sous-facteurs via sliders :
- Charge physique (0-20 pts)
- Postures contraignantes (0-20 pts)
- Fréquence/répétitivité (0-20 pts)
- Charge mentale (0-20 pts)
- Risques psychosociaux (0-20 pts)

**🥃 Verre - Capacité individuelle (30-100)**
Facteurs via sliders :
- Âge et condition physique (0-25 pts)
- Ancienneté au poste (0-25 pts)
- Formation/expérience (0-25 pts)
- Antécédents médicaux (0-25 pts)

**🥤 Paille - Récupération (0-80)**
4 sous-facteurs via sliders :
- Pauses actives (0-20 pts)
- Étirements/échauffements (0-20 pts)
- Relaxation (0-20 pts)
- Qualité du sommeil (0-20 pts)

**🫧 Bulle - Environnement (0-100)**
Facteurs via sliders :
- Température (0-15 pts)
- Éclairage (0-15 pts)
- Bruit (0-15 pts)
- Vibrations (0-10 pts)
- Hygiène/propreté (0-10 pts)
- Espace de travail (0-15 pts)
- Équipements/outils (0-20 pts)

**⛈️ Orage - Aléas (0-100)**
Calcul pondéré via sliders :
- Impact des aléas (0-50 pts)
- Durée des perturbations (0-30 pts)
- Fréquence (0-20 pts)

#### Étape 3 : Visualisation et recommandations

**Composants :**
1. Modèle du verre avec les valeurs saisies
2. Simulation automatique sur 8 minutes
3. Graphiques d'évolution :
   - Niveau de remplissage du verre
   - Risque TMS
   - Risque d'accident

4. **Recommandations automatiques** basées sur les scores :
   - Actions prioritaires
   - Mesures correctives
   - Améliorations environnementales

5. **Export des résultats** :
   - PDF avec captures d'écran
   - Rapport texte
   - Données JSON pour suivi

---

### 5. Historique des Analyses

**Route :** `/analyses`

**Fonctionnalités :**
- Liste des analyses sauvegardées
- Filtres par date, poste, tâche
- Recherche textuelle
- Comparaison entre analyses
- Suppression/modification

**Carte d'analyse :**
```
┌─────────────────────────────────────────┐
│ 🔍 Assemblage - Module électronique     │
│ 📅 14/12/2024  ⏱️ 60 min               │
│                                         │
│ Scores :                                │
│ 🚰 Robinet : 75/100  [████████░░]      │
│ 🥃 Verre   : 45/100  [████░░░░░░]      │
│ 🥤 Paille  : 30/80   [███░░░░░░░]      │
│ 🫧 Bulle   : 60/100  [██████░░░░]      │
│ ⛈️ Orage   : 40/100  [████░░░░░░]      │
│                                         │
│ Risque global : ⚠️ Vigilance           │
│                                         │
│ [Voir détails] [Modifier] [Supprimer]  │
└─────────────────────────────────────────┘
```

---

## 🎨 Design System

### Couleurs thématiques

```css
🚰 Robinet (Bleu)    : #60A5FA / rgb(96, 165, 250)
🥃 Verre (Transparent): Gradient selon remplissage
🥤 Paille (Vert)     : #4ADE80 / rgb(74, 222, 128)
🫧 Bulle (Violet)    : #A855F7 / rgb(168, 85, 247)
⛈️ Orage (Doré)      : #FBBF24 / rgb(251, 191, 36)
```

### Niveaux de risque

```
0-60%   : 🟢 Normal    (vert)
60-80%  : 🟡 Vigilance (jaune)
80-90%  : 🟠 Danger    (orange)
90-100% : 🔴 Critique  (rouge)
```

---

## 📦 Composants Réutilisables

### 1. SliderWithLabel
```typescript
interface SliderWithLabelProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  step?: number
  color: 'blue' | 'green' | 'purple' | 'amber'
  description?: string
  showValue?: boolean
}
```

### 2. GlassVisualization
```typescript
interface GlassVisualizationProps {
  flowRate: number
  capacity: number
  absorptionRate: number
  environmentScore: number
  stormIntensity: number
  isPaused?: boolean
  showControls?: boolean
  compact?: boolean
}
```

### 3. ScoreCard
```typescript
interface ScoreCardProps {
  element: 'robinet' | 'verre' | 'paille' | 'bulle' | 'orage'
  score: number
  maxScore: number
  description: string
  icon: React.ReactNode
}
```

---

## 🔐 Sécurité et Données

### Pour le MVP (Sans base de données)

**Storage :**
- Utilisation de `localStorage` pour les données utilisateur
- Chiffrement des données sensibles côté client
- Session tokens stockés en cookies httpOnly

**Limitations MVP :**
- Pas de persistance serveur
- Données limitées au navigateur
- Pas de synchronisation multi-device
- Capacité limitée (~5MB par domaine)

### Pour la version Production (Future)

**Base de données recommandée :**
- PostgreSQL avec Prisma ORM
- Tables : Users, Analyses, AnalysisResults
- Relations : User → Analyses (1-to-many)
- Backups automatiques

---

## 📱 Responsive Design

**Breakpoints :**
```
Mobile  : < 640px   (Navigation simplifiée, sliders verticaux)
Tablet  : 640-1024px (Layout 1 colonne)
Desktop : > 1024px   (Layout 2 colonnes, sidebar fixe)
```

---

## 🚀 Plan de Déploiement

### Phase 1 : MVP Béta (2-3 semaines)
- ✅ Authentification basique
- ✅ Mode présentation complet
- ✅ Mode analyse simplifié
- ✅ Historique local
- ✅ Export PDF

### Phase 2 : Amélioration Béta (1-2 semaines)
- 📊 Statistiques d'utilisation
- 🔄 Comparaison d'analyses
- 📧 Partage par email
- 🎯 Tableaux de bord avancés

### Phase 3 : Production (après feedback)
- 💾 Base de données
- 👥 Multi-utilisateurs
- 🏢 Gestion entreprise
- 📈 Analytics avancés
- 🔐 SSO/OAuth

---

## 📊 Métriques de Succès MVP

**Engagement :**
- Taux de complétion des analyses
- Temps moyen par analyse
- Nombre d'analyses créées par utilisateur

**Satisfaction :**
- NPS (Net Promoter Score)
- Feedback qualitatif post-webinaire
- Taux de retour sur la plateforme

**Technique :**
- Temps de chargement < 2s
- Taux d'erreur < 1%
- Compatibilité navigateurs modernes

---

## 🛠️ Stack Technique

**Frontend :**
- Next.js 15+ (App Router)
- React 19+
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Shadcn/ui (composants)
- Lucide React (icônes)

**State Management :**
- React Context API
- localStorage pour persistance
- URL search params (nuqs)

**Visualisation :**
- Composants custom SVG/Canvas
- Animations CSS + Framer Motion

**Build & Deploy :**
- Vercel (recommandé)
- Variables d'environnement pour config

---

## 📝 Notes Importantes

### Priorités MVP :
1. ✅ Simplicité d'utilisation
2. ✅ Workflow intuitif
3. ✅ Visualisation claire du modèle
4. ✅ Performance fluide
5. ⚠️ Base de données (Phase 2)

### Décisions techniques :
- **Pas de Prisma pour MVP** : Utilisation localStorage
- **Authentification simple** : Pas de OAuth pour MVP
- **Export local** : PDF générés côté client
- **Offline-first** : Fonctionne sans connexion

### Points d'attention :
- Limites localStorage (~5MB)
- Pas de sync multi-device
- Données volatiles (effacement cache)
- Migration future vers DB nécessaire

---

## 📅 Timeline Estimée

```
Semaine 1 :
- [x] Analyse architecture existante
- [ ] Authentification basique
- [ ] Structure pages principales

Semaine 2 :
- [ ] Mode présentation
- [ ] Composants sliders
- [ ] Visualisation temps réel

Semaine 3 :
- [ ] Mode analyse complète
- [ ] Historique et exports
- [ ] Tests et corrections

Semaine 4 :
- [ ] Documentation utilisateur
- [ ] Préparation webinaire
- [ ] Déploiement production
```

---

## 🎓 Support et Documentation

**Pour les béta testeurs :**
- Guide de démarrage rapide
- Tutoriel vidéo (< 5 min)
- FAQ intégrée
- Support par email

**Pour le développement :**
- Ce document (PLAN_MVP_BETA.md)
- README technique
- Documentation composants
- Changelog

---

*Document créé le 14/12/2024*
*Dernière mise à jour : 14/12/2024*
