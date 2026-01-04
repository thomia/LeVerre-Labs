# 🚀 Setup Initial - MVP Béta Testeur

## Étapes Complétées ✅

### 1. Dependencies ajoutées au package.json
```json
"dependencies": {
  "@prisma/client": "^5.22.0",
  "bcryptjs": "^2.4.3",
  "jspdf": "^2.5.2",
  "react-hot-toast": "^2.4.1",
  "zod": "^3.23.8"
},
"devDependencies": {
  "@types/bcryptjs": "^2.4.6",
  "prisma": "^5.22.0"
}
```

### 2. Schéma Prisma créé
- ✅ `prisma/schema.prisma` avec modèles :
  - User (utilisateurs béta)
  - Analysis (analyses ergonomiques)
  - Scenario (scénarios de présentation)
  - FactorConfig (configuration personnalisable)

### 3. Types TypeScript créés
- ✅ `src/types/auth.types.ts`
- ✅ `src/types/analysis.types.ts`
- ✅ `src/types/scenario.types.ts`

### 4. Configuration Prisma
- ✅ `src/lib/db.ts` (client Prisma singleton)
- ✅ `.gitignore` mis à jour

---

## 📋 Prochaines Étapes

### Étape 1 : Installation des Dépendances (EN COURS)
```bash
npm install
```
Cette commande est en train de s'exécuter...

### Étape 2 : Initialisation Base de Données
```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et exécuter les migrations
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio pour voir la DB
npx prisma studio
```

### Étape 3 : Vérification
```bash
# Démarrer le serveur de dev
npm run dev
```

---

## 🗂️ Structure Créée

```
ProtoVerreTMS/
├── prisma/
│   └── schema.prisma          ✅ Schéma de base de données
│
├── src/
│   ├── lib/
│   │   └── db.ts              ✅ Client Prisma
│   │
│   └── types/
│       ├── auth.types.ts      ✅ Types auth
│       ├── analysis.types.ts  ✅ Types analyses
│       └── scenario.types.ts  ✅ Types scénarios
│
└── package.json               ✅ Dépendances ajoutées
```

---

## 📊 Modèles de Données

### User
- Authentification béta testeurs
- Profil (nom, prénom, entreprise)
- Rôle (BETA_TESTEUR, ADMIN)

### Analysis
- Métadonnées (poste, tâche, durée, date)
- Scores JSON (robinet, verre, paille, bulle, orage)
- Résultats calculés
- Recommandations

### Scenario
- Nom et description
- Configuration des 5 éléments
- Code de partage unique

### FactorConfig
- Configuration flexible des facteurs
- Par utilisateur ou entreprise
- Personnalisation des poids et limites

---

## ⚠️ Notes Importantes

### Erreur Lint Temporaire
L'erreur sur `@prisma/client` est normale et disparaîtra après :
1. `npm install` (en cours)
2. `npx prisma generate`

### Base de Données SQLite
- Fichier créé : `prisma/dev.db`
- Léger et sans configuration serveur
- Facile à migrer vers PostgreSQL plus tard

---

## 🔄 Commandes Prisma Utiles

```bash
# Générer le client après modification du schéma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la DB (ATTENTION : supprime données)
npx prisma migrate reset

# Ouvrir l'interface visuelle
npx prisma studio

# Vérifier le schéma
npx prisma validate

# Formater le schéma
npx prisma format
```

---

## 🎯 Prochaine Implémentation

Une fois le setup terminé, nous allons créer :
1. **Système d'authentification** (lib/auth.ts)
2. **API Routes** (app/api/auth/*)
3. **Pages d'inscription/connexion**
4. **AuthProvider** (Context React)

---

*Setup créé le 14/12/2024*  
*Prêt pour l'implémentation MVP Béta*
