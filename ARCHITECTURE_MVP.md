# Architecture MVP - Recommandations Techniques
## ProtoVerreTMS - Workflow Béta Testeur

---

## 📊 Analyse de l'Existant

### ✅ Ce qui existe déjà et peut être réutilisé

#### 1. **Système de gestion de données (localStorage)**
- ✅ `src/lib/localStorage.ts` : Système complet avec gestion d'événements
- ✅ Fonctions : `getLocalStorage()`, `setLocalStorage()`, `emitStorageEvent()`
- ✅ Custom events pour synchronisation entre composants
- ⚠️ **À étendre** : Ajouter gestion utilisateurs et analyses

#### 2. **Composants du modèle du verre**
```
src/components/dashboard/
├── dashboard-new.tsx          ✅ Composant principal (799 lignes)
├── tap-component.tsx          ✅ Robinet
├── glass-component.tsx        ✅ Verre
├── straw-component.tsx        ✅ Paille
├── storm-component.tsx        ✅ Orage
├── bubble-component.tsx       ✅ Bulle (particules environnementales)
├── parameter-modals.tsx       ✅ Modales de paramétrage
└── parameter-sections-v2.tsx  ✅ Sections de contrôle
```

#### 3. **Formulaires de paramétrage avancés**
```
src/components/settings/
├── base-settings-form.tsx     ✅ Template de base
├── tap-settings-form.tsx      ✅ Robinet (2145 lignes!) - TRÈS COMPLET
├── glass-settings-form.tsx    ✅ Verre
├── straw-settings-form.tsx    ✅ Paille
├── bubble-settings-form.tsx   ✅ Bulle
└── storm-settings-form.tsx    ✅ Orage
```

**Observation :** Ces formulaires sont TRÈS détaillés avec :
- Méthodes REBA/RULA intégrées
- Échelle NASA-TLX
- Questionnaires RPS (Risques Psychosociaux)
- Antécédents médicaux
- Ajustements posturaux

#### 4. **Espace personnel existant**
```
src/app/espace-personnel/
├── page.tsx                   ✅ Dashboard
├── analyses/
│   ├── page.tsx               ✅ Liste des analyses
│   └── [id]/page.tsx          ✅ Détail d'une analyse
├── nouvelle-analyse/
│   └── page.tsx               ✅ Création via formulaire ou vidéo
└── parametres/
    └── page.tsx               ✅ Paramètres utilisateur
```

#### 5. **Composants UI (Shadcn)**
✅ Tous les composants nécessaires sont installés :
- Dialog, Card, Button, Input, Label
- Slider, Switch, Select, Tabs
- Accordion, Tooltip, Checkbox, Radio
- Framer Motion pour animations

---

## 🏗️ Architecture Proposée pour le MVP

### Option 1 : Approche Progressive (RECOMMANDÉE)

**Stratégie :** Ajouter l'authentification et structurer les données sans tout refaire.

```
ProtoVerreTMS/
├── src/
│   ├── app/
│   │   ├── (public)/                    # Routes publiques
│   │   │   ├── page.tsx                 # Landing page
│   │   │   └── vitrine/                 # Pages de présentation existantes
│   │   │
│   │   ├── (auth)/                      # Routes d'authentification
│   │   │   ├── inscription/
│   │   │   │   └── page.tsx             ➕ NOUVEAU
│   │   │   ├── connexion/
│   │   │   │   └── page.tsx             ➕ NOUVEAU
│   │   │   └── layout.tsx               ➕ NOUVEAU (Layout spécifique)
│   │   │
│   │   └── (dashboard)/                 # Routes protégées (après connexion)
│   │       ├── layout.tsx               ➕ NOUVEAU (Vérification auth)
│   │       ├── accueil/
│   │       │   └── page.tsx             ➕ NOUVEAU (Dashboard principal)
│   │       │
│   │       ├── presentation/            # Mode Formation
│   │       │   └── page.tsx             ➕ NOUVEAU
│   │       │
│   │       ├── analyse/                 # Mode Analyse
│   │       │   ├── nouvelle/
│   │       │   │   └── page.tsx         ➕ NOUVEAU (Workflow étapes)
│   │       │   ├── [id]/
│   │       │   │   └── page.tsx         ➕ NOUVEAU (Résultats)
│   │       │   └── page.tsx             ➕ NOUVEAU (Liste)
│   │       │
│   │       └── espace-personnel/        # CONSERVER L'EXISTANT
│   │           └── ...                  ✅ Garder pour référence
│   │
│   ├── components/
│   │   ├── auth/                        ➕ NOUVEAU
│   │   │   ├── auth-provider.tsx        # Context React pour auth
│   │   │   ├── login-form.tsx           # Formulaire connexion
│   │   │   ├── register-form.tsx        # Formulaire inscription
│   │   │   └── protected-route.tsx      # HOC pour routes protégées
│   │   │
│   │   ├── dashboard/                   ✅ EXISTANT
│   │   │   └── ...                      # Garder tous les composants
│   │   │
│   │   ├── beta/                        ➕ NOUVEAU (Composants spécifiques MVP)
│   │   │   ├── welcome-dashboard.tsx    # Dashboard d'accueil béta
│   │   │   ├── mode-card.tsx            # Carte de sélection mode
│   │   │   ├── analysis-wizard.tsx      # Wizard multi-étapes
│   │   │   ├── slider-group.tsx         # Groupe de sliders réutilisable
│   │   │   ├── glass-preview.tsx        # Preview modèle en temps réel
│   │   │   └── results-report.tsx       # Rapport de résultats
│   │   │
│   │   └── ui/                          ✅ EXISTANT (Shadcn)
│   │
│   ├── lib/
│   │   ├── localStorage.ts              ✅ EXISTANT
│   │   ├── auth.ts                      ➕ NOUVEAU
│   │   │   # Fonctions : login(), register(), logout(), getCurrentUser()
│   │   ├── storage.ts                   ➕ NOUVEAU (Extension localStorage)
│   │   │   # Fonctions pour gérer users et analyses
│   │   └── calculations.ts              ➕ NOUVEAU
│   │       # Calculs des scores, recommandations
│   │
│   └── types/
│       ├── auth.types.ts                ➕ NOUVEAU
│       ├── analysis.types.ts            ➕ NOUVEAU
│       └── glass-model.types.ts         ➕ NOUVEAU
```

---

## 🔐 Système d'Authentification Simplifié

### Structure des données (localStorage)

```typescript
// types/auth.types.ts

export interface BetaUser {
  id: string                    // UUID généré
  email: string                 // Unique, validé
  password: string              // Hashé (simple pour MVP)
  profile: {
    nom: string
    prenom: string
    entreprise?: string
    poste?: string
  }
  role: 'beta-testeur'
  createdAt: string             // ISO date
  lastLogin: string             // ISO date
  preferences?: {
    theme?: 'dark' | 'light'
    language?: 'fr' | 'en'
  }
}

export interface AuthSession {
  userId: string
  token: string                 // Simple token pour MVP
  expiresAt: string            // ISO date
}
```

### Fonctions d'authentification

```typescript
// lib/auth.ts

import { BetaUser, AuthSession } from '@/types/auth.types'
import { getLocalStorage, setLocalStorage } from './localStorage'

const USERS_KEY = 'beta_users'
const SESSION_KEY = 'beta_session'

// Hash simple pour MVP (à remplacer en production !)
function simpleHash(password: string): string {
  // Pour MVP uniquement - utiliser bcrypt en production
  return btoa(password + 'proto-verre-salt')
}

export async function register(data: {
  email: string
  password: string
  nom: string
  prenom: string
  entreprise?: string
}): Promise<{ success: boolean; error?: string; user?: BetaUser }> {
  try {
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Email invalide' }
    }
    
    // Validation mot de passe
    if (data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }
    }
    
    // Vérifier si l'utilisateur existe déjà
    const users = getAllUsers()
    const existingUser = users.find(u => u.email === data.email)
    
    if (existingUser) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }
    
    // Créer le nouvel utilisateur
    const newUser: BetaUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password: simpleHash(data.password),
      profile: {
        nom: data.nom,
        prenom: data.prenom,
        entreprise: data.entreprise
      },
      role: 'beta-testeur',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    // Sauvegarder
    users.push(newUser)
    setLocalStorage(USERS_KEY, JSON.stringify(users))
    
    // Créer une session automatiquement
    await createSession(newUser.id)
    
    return { success: true, user: newUser }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

export async function login(
  email: string, 
  password: string
): Promise<{ success: boolean; error?: string; user?: BetaUser }> {
  try {
    const users = getAllUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
    
    const hashedPassword = simpleHash(password)
    if (user.password !== hashedPassword) {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
    
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date().toISOString()
    updateUser(user)
    
    // Créer une session
    await createSession(user.id)
    
    return { success: true, user }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
  // Rediriger vers la page de connexion
  window.location.href = '/auth/connexion'
}

export function getCurrentUser(): BetaUser | null {
  const session = getCurrentSession()
  if (!session) return null
  
  // Vérifier si la session a expiré
  if (new Date(session.expiresAt) < new Date()) {
    logout()
    return null
  }
  
  const users = getAllUsers()
  return users.find(u => u.id === session.userId) || null
}

export function getCurrentSession(): AuthSession | null {
  const sessionData = getLocalStorage(SESSION_KEY)
  if (!sessionData) return null
  
  try {
    return JSON.parse(sessionData)
  } catch {
    return null
  }
}

function createSession(userId: string): void {
  const session: AuthSession = {
    userId,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
  }
  
  setLocalStorage(SESSION_KEY, JSON.stringify(session))
}

function getAllUsers(): BetaUser[] {
  const usersData = getLocalStorage(USERS_KEY)
  if (!usersData) return []
  
  try {
    return JSON.parse(usersData)
  } catch {
    return []
  }
}

function updateUser(user: BetaUser): void {
  const users = getAllUsers()
  const index = users.findIndex(u => u.id === user.id)
  
  if (index !== -1) {
    users[index] = user
    setLocalStorage(USERS_KEY, JSON.stringify(users))
  }
}

// Hook React pour utiliser l'authentification
export function useAuth() {
  const [user, setUser] = React.useState<BetaUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])
  
  return { user, loading, login, logout, register }
}
```

---

## 📊 Gestion des Analyses

### Structure des données

```typescript
// types/analysis.types.ts

export interface Analysis {
  id: string
  userId: string              // Lien avec l'utilisateur
  createdAt: string
  updatedAt: string
  
  // Informations de base
  metadata: {
    poste: string
    tache: string
    duree: number            // En minutes
    date: string
    operateur?: string
    notes?: string
  }
  
  // Scores des 5 éléments (simplifiés pour MVP)
  scores: {
    robinet: RobinetScore
    verre: VerreScore
    paille: PailleScore
    bulle: BulleScore
    orage: OrageScore
  }
  
  // Résultats calculés
  results: {
    remplissageMax: number      // % max atteint
    tempsDebordement?: number   // En minutes (si débordement)
    risqueTMS: number          // 0-100
    risqueAccident: number     // 0-100
    niveauGlobal: 'normal' | 'vigilance' | 'danger' | 'critique'
  }
  
  // Recommandations générées
  recommendations: string[]
}

// Scores détaillés pour chaque élément
export interface RobinetScore {
  total: number              // 0-100
  chargePhysique: number     // 0-20
  postures: number           // 0-20
  frequence: number          // 0-20
  chargeMentale: number      // 0-20
  rps: number                // 0-20
}

export interface VerreScore {
  capacite: number           // 30-100
  age: number                // 0-25
  anciennete: number         // 0-25
  formation: number          // 0-25
  antecedents: number        // 0-25
}

export interface PailleScore {
  total: number              // 0-80
  pausesActives: number      // 0-20
  etirements: number         // 0-20
  relaxation: number         // 0-20
  sommeil: number            // 0-20
}

export interface BulleScore {
  total: number              // 0-100
  temperature: number        // 0-15
  eclairage: number          // 0-15
  bruit: number              // 0-15
  vibrations: number         // 0-10
  hygiene: number            // 0-10
  espace: number             // 0-15
  equipements: number        // 0-20
}

export interface OrageScore {
  total: number              // 0-100
  impact: number             // 0-50
  duree: number              // 0-30
  frequence: number          // 0-20
}
```

### Fonctions de gestion

```typescript
// lib/storage.ts

import { Analysis } from '@/types/analysis.types'
import { getLocalStorage, setLocalStorage } from './localStorage'

const ANALYSES_KEY = 'beta_analyses'

export function saveAnalysis(analysis: Analysis): void {
  const analyses = getAllAnalyses()
  
  const existingIndex = analyses.findIndex(a => a.id === analysis.id)
  
  if (existingIndex !== -1) {
    analyses[existingIndex] = analysis
  } else {
    analyses.push(analysis)
  }
  
  setLocalStorage(ANALYSES_KEY, JSON.stringify(analyses))
}

export function getAllAnalyses(): Analysis[] {
  const data = getLocalStorage(ANALYSES_KEY)
  if (!data) return []
  
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getUserAnalyses(userId: string): Analysis[] {
  return getAllAnalyses().filter(a => a.userId === userId)
}

export function getAnalysisById(id: string): Analysis | null {
  return getAllAnalyses().find(a => a.id === id) || null
}

export function deleteAnalysis(id: string): void {
  const analyses = getAllAnalyses().filter(a => a.id !== id)
  setLocalStorage(ANALYSES_KEY, JSON.stringify(analyses))
}
```

---

## 🎯 Workflow Simplifié - Mode Analyse

### Composant Wizard Multi-étapes

```typescript
// components/beta/analysis-wizard.tsx

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'

// Étapes du wizard
const STEPS = [
  { id: 'info', title: 'Informations', icon: '📋' },
  { id: 'robinet', title: 'Charge de travail', icon: '🚰' },
  { id: 'verre', title: 'Capacité', icon: '🥃' },
  { id: 'paille', title: 'Récupération', icon: '🥤' },
  { id: 'bulle', title: 'Environnement', icon: '🫧' },
  { id: 'orage', title: 'Aléas', icon: '⛈️' },
  { id: 'results', title: 'Résultats', icon: '📊' }
]

export function AnalysisWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<Partial<Analysis>>({})
  
  const progress = ((currentStep + 1) / STEPS.length) * 100
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSave = () => {
    // Sauvegarder l'analyse
    // ...
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">
            {STEPS[currentStep].icon} {STEPS[currentStep].title}
          </h2>
          <span className="text-gray-400">
            Étape {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Contenu de l'étape */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          {renderStepContent(currentStep, data, setData)}
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            Suivant
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        )}
      </div>
    </div>
  )
}

function renderStepContent(step: number, data: any, setData: any) {
  switch (step) {
    case 0:
      return <InfoStep data={data} setData={setData} />
    case 1:
      return <RobinetStep data={data} setData={setData} />
    // ... autres étapes
    case 6:
      return <ResultsStep data={data} />
    default:
      return null
  }
}
```

---

## ⚡ Priorités d'Implémentation

### Sprint 1 (Semaine 1) - Fondations
1. ✅ Créer le système d'authentification (auth.ts)
2. ✅ Créer les pages inscription/connexion
3. ✅ Créer le AuthProvider React Context
4. ✅ Créer le dashboard d'accueil béta
5. ✅ Créer les types TypeScript

### Sprint 2 (Semaine 2) - Mode Présentation
1. ✅ Créer la page `/presentation`
2. ✅ Adapter `dashboard-new.tsx` pour la présentation
3. ✅ Ajouter contrôles simplifiés
4. ✅ Ajouter mode plein écran
5. ✅ Ajouter tooltips pédagogiques

### Sprint 3 (Semaine 3) - Mode Analyse
1. ✅ Créer le composant AnalysisWizard
2. ✅ Créer les steps avec sliders
3. ✅ Intégrer la visualisation en temps réel
4. ✅ Calculer les résultats et recommandations
5. ✅ Créer la page de liste des analyses

### Sprint 4 (Semaine 4) - Polish & Test
1. ✅ Export PDF
2. ✅ Tests end-to-end
3. ✅ Documentation utilisateur
4. ✅ Corrections bugs
5. ✅ Préparation webinaire

---

## 🎨 Composants Réutilisables à Créer

### 1. SliderGroup
Groupe de sliders avec labels et totaux automatiques.

### 2. GlassPreview
Version compacte du modèle pour prévisualisation dans le wizard.

### 3. RiskIndicator
Indicateur visuel de niveau de risque.

### 4. RecommendationCard
Carte de recommandation générée automatiquement.

---

## 📝 Notes Importantes

### Limitations localStorage
- **Capacité** : ~5-10 MB selon le navigateur
- **Persistance** : Volatile (effacement cache)
- **Sécurité** : Données non chiffrées (attention aux données sensibles)
- **Sync** : Pas de synchronisation multi-device

### Migration future vers DB
Prévoir une fonction d'export/import JSON pour faciliter la migration :
```typescript
export function exportAllData() {
  return {
    users: getAllUsers(),
    analyses: getAllAnalyses(),
    version: '1.0.0'
  }
}
```

---

*Document créé le 14/12/2024*
