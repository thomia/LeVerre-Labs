# 🧪 Guide de Tests - ProtoVerreTMS MVP

## Tests Disponibles

### 1. 🎨 Prisma Studio (Interface Visuelle)

**C'est quoi ?**
Une interface web graphique pour voir et manipuler vos données.

**Comment lancer ?**
```bash
npx prisma studio
```

**Que faire ?**
1. ✅ Une fenêtre de navigateur s'ouvre sur `http://localhost:5555`
2. ✅ Vous voyez 4 tables : `users`, `analyses`, `scenarios`, `factor_configs`
3. ✅ Cliquez sur chaque table pour voir leur structure
4. ✅ Pour le moment, elles sont vides (c'est normal !)

**Résultat attendu :**
```
✓ Tables visibles : User, Analysis, Scenario, FactorConfig
✓ Colonnes correctes dans chaque table
✓ Aucune erreur de connexion
```

---

### 2. 📊 Vérifier le Schéma Prisma

**Commande :**
```bash
npx prisma validate
```

**Résultat attendu :**
```
✓ Schema valide
✓ Pas d'erreurs de syntaxe
```

---

### 3. 🗄️ Vérifier la Base de Données

**Vérifier que le fichier existe :**
```bash
# Windows PowerShell
Test-Path prisma\dev.db
# Devrait retourner: True
```

**Voir la taille :**
```bash
# Windows PowerShell
(Get-Item prisma\dev.db).Length
```

---

### 4. 🔧 Script de Test Complet (À venir)

**J'ai créé un script `test-db.ts` mais il y a des erreurs TypeScript à résoudre.**

Le problème vient du fait que Prisma a peut-être un ancien schéma en cache. 

**Solution :**
```bash
# 1. Régénérer le client Prisma
npx prisma generate

# 2. Redémarrer votre éditeur (VSCode)
# Fichier > Redémarrer l'éditeur

# 3. Vérifier que les types sont corrects
```

---

## 📋 Checklist de Vérification Rapide

### ✅ Ce qui devrait fonctionner maintenant :

- [x] **Prisma Studio se lance** (`npx prisma studio`)
- [x] **4 tables visibles** (User, Analysis, Scenario, FactorConfig)
- [x] **Base de données existe** (`prisma/dev.db`)
- [x] **Schéma valide** (`npx prisma validate`)
- [x] **Client généré** (dossier `node_modules/@prisma/client`)

### ⏳ Ce qui nécessite encore du travail :

- [ ] Script de test avec données réelles
- [ ] Fonctions d'authentification
- [ ] API Routes
- [ ] Interface utilisateur

---

## 🎯 Tests Visuels dans Prisma Studio

### Test 1 : Créer un Utilisateur Manuellement

1. Ouvrez Prisma Studio (`npx prisma studio`)
2. Cliquez sur "User"
3. Cliquez sur "Add record"
4. Remplissez :
   ```
   email: test@example.com
   password: test123 (temporaire, sera hashé plus tard)
   role: BETA_TESTEUR
   nom: Test
   prenom: User
   ```
5. Cliquez sur "Save 1 change"

**Résultat attendu :**
✓ Utilisateur créé avec un ID généré automatiquement
✓ Dates createdAt, updatedAt, lastLogin remplies automatiquement

### Test 2 : Créer une Analyse Manuellement

1. Dans Prisma Studio, cliquez sur "Analysis"
2. Cliquez sur "Add record"
3. Remplissez :
   ```
   userId: [Copier l'ID de l'utilisateur créé]
   poste: Opérateur
   tache: Test
   duree: 60
   date: [Date actuelle]
   scores: {"robinet":{"total":50},"verre":{"capacite":60}}
   results: {"remplissageMax":70,"risqueTMS":50}
   recommendations: ["Test"]
   ```
4. Cliquez sur "Save 1 change"

**Résultat attendu :**
✓ Analyse créée et liée à l'utilisateur
✓ Relation visible entre User et Analysis

---

## 🔍 Commandes de Diagnostic

### Voir la structure de la DB
```bash
npx prisma studio
# Ou
npx prisma db push --help
```

### Voir les migrations appliquées
```bash
# Windows PowerShell
Get-ChildItem prisma\migrations
```

### Réinitialiser la DB (⚠️ ATTENTION : Supprime toutes les données)
```bash
npx prisma migrate reset
```

### Formater le schéma
```bash
npx prisma format
```

---

## 📊 État Actuel du Projet

```
INFRASTRUCTURE
├─ [✓] Base de données SQLite créée
├─ [✓] Schéma Prisma validé
├─ [✓] Client Prisma généré
├─ [✓] 4 tables créées
└─ [✓] Migrations appliquées

FONCTIONNALITÉS
├─ [ ] Authentification (0%)
├─ [ ] API Routes (0%)
├─ [ ] Interface utilisateur (0%)
└─ [ ] Logique métier (0%)
```

---

## 🚀 Prochaines Étapes de Test

Une fois l'authentification implémentée, vous pourrez tester :

1. **Inscription** : Créer un compte via l'interface
2. **Connexion** : Se connecter avec email/password
3. **Session** : Vérifier que la session persiste
4. **Déconnexion** : Se déconnecter proprement

Mais pour l'instant, **Prisma Studio est votre meilleur ami** pour :
- ✅ Voir la structure des données
- ✅ Comprendre les relations
- ✅ Créer des données de test manuellement
- ✅ Déboguer les problèmes de données

---

## 💡 Astuces Prisma Studio

### Raccourcis Clavier
- `Ctrl + S` : Sauvegarder
- `Ctrl + /` : Commenter
- `Escape` : Annuler

### Filtres
Vous pouvez filtrer les enregistrements :
```
email contains "test"
role equals "BETA_TESTEUR"
createdAt after "2024-12-14"
```

### Relations
Cliquez sur l'icône "→" pour naviguer entre les relations.

---

## 🎯 Test Rapide Maintenant

**Étapes simples pour vérifier que tout fonctionne :**

1. **Ouvrir Prisma Studio**
   ```bash
   npx prisma studio
   ```
   → Devrait ouvrir `http://localhost:5555`

2. **Vérifier les 4 tables**
   - User ✓
   - Analysis ✓
   - Scenario ✓
   - FactorConfig ✓

3. **Créer un utilisateur de test** (voir Test 1 ci-dessus)

4. **Créer une analyse de test** (voir Test 2 ci-dessus)

5. **Vérifier la relation**
   - Cliquer sur User
   - Voir les analyses liées

**Si tout ça fonctionne = ✅ Setup parfait !**

---

*Document créé le 14/12/2024*  
*Guide de tests pour vérification du setup Prisma*
