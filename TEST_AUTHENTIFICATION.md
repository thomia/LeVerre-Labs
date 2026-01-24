# 🧪 Test de l'Authentification - Guide Complet

## 📋 Prérequis

Avant de commencer, vérifiez que :
- ✅ Node.js est installé
- ✅ Les dépendances sont installées (`npm install`)
- ✅ La base de données est créée (déjà fait !)
- ✅ Prisma Studio peut s'ouvrir

---

## 🚀 Test 1 : Lancer le Serveur de Développement

### Commande

```bash
npm run dev
```

### Résultat Attendu

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Network:      http://xxx.xxx.xxx.xxx:3000

✓ Ready in 2.5s
```

**✅ Si vous voyez ça = Serveur OK !**

---

## 🔍 Test 2 : Tester l'Inscription

### Étape 1 : Ouvrir la Page

Allez sur : **http://localhost:3000/inscription**

### Étape 2 : Vérifier l'Interface

Vous devriez voir :
- ✅ Une belle page sombre (fond slate-950)
- ✅ Un formulaire avec un cercle gradient bleu-violet
- ✅ Titre "Rejoindre le programme Béta"
- ✅ Champs : Nom, Prénom, Email, Entreprise, Poste, Mot de passe x2

### Étape 3 : Remplir le Formulaire

Exemple de données :

```
Nom:         Dupont
Prénom:      Jean
Email:       jean.dupont@test.fr
Entreprise:  LeVerre Labs
Poste:       Ergonome
Mot de passe: test123
Confirmer:   test123
```

### Étape 4 : Soumettre

1. Cliquez sur "Créer mon compte"
2. Le bouton affiche un spinner "Création du compte..."

### Résultat Attendu

**Scénario Succès :**
- ✅ Toast vert "Inscription réussie ! 🎉"
- ✅ Redirection automatique vers `/dashboard`
- ⚠️ **ERREUR 404 normale** (dashboard pas encore créé)

**Si erreur :**
- ❌ Toast rouge avec le message d'erreur
- Voir section "Debugging" plus bas

---

## 🔎 Test 3 : Vérifier dans la Base de Données

### Ouvrir Prisma Studio

```bash
npx prisma studio
```

### Vérifier les Données

1. Allez sur **http://localhost:5555**
2. Cliquez sur **"User"** dans le menu de gauche
3. Vous devriez voir votre utilisateur :

```
ID:         [UUID généré automatiquement]
Email:      jean.dupont@test.fr
Password:   $2b$10$... [Hash bcrypt]
Role:       BETA_TESTEUR
Nom:        Dupont
Prénom:     Jean
Entreprise: LeVerre Labs
Poste:      Ergonome
CreatedAt:  [Date/heure actuelle]
LastLogin:  [Date/heure actuelle]
```

**✅ Si vous voyez l'utilisateur = Base de données OK !**

---

## 🔐 Test 4 : Tester la Connexion

### Étape 1 : Effacer la Session

Avant de tester la connexion, effacez la session actuelle :

**Méthode 1 : Via la Console Navigateur**
1. F12 (Outils développeur)
2. Console
3. Tapez : `localStorage.clear()`
4. Entrée

**Méthode 2 : Via Application**
1. F12
2. Onglet "Application"
3. Local Storage → http://localhost:3000
4. Clic droit → Clear

### Étape 2 : Aller sur la Page de Connexion

Allez sur : **http://localhost:3000/connexion**

### Étape 3 : Se Connecter

1. Email: `jean.dupont@test.fr`
2. Mot de passe: `test123`
3. Cliquez "Se connecter"

### Résultat Attendu

**Succès :**
- ✅ Toast vert "Connexion réussie ! 🎉"
- ✅ Redirection vers `/dashboard`
- ⚠️ Erreur 404 (normal, dashboard pas créé)

**Échec :**
- ❌ Toast "Email ou mot de passe incorrect"

---

## 🧪 Test 5 : Vérifier la Session

### Vérifier localStorage

1. F12 → Console
2. Tapez :

```javascript
// Voir la session
localStorage.getItem('beta_session')

// Voir l'utilisateur
localStorage.getItem('beta_user')
```

### Résultat Attendu

```json
// beta_session
{
  "userId": "abc-123-def-456",
  "token": "abc-123-def-456",
  "expiresAt": "2024-12-21T..." // 7 jours plus tard
}

// beta_user
{
  "id": "abc-123-def-456",
  "email": "jean.dupont@test.fr",
  "role": "BETA_TESTEUR",
  "nom": "Dupont",
  "prenom": "Jean",
  "entreprise": "LeVerre Labs",
  "poste": "Ergonome",
  "createdAt": "...",
  "lastLogin": "..."
}
```

**✅ Si vous voyez ces données = Session OK !**

---

## 🧰 Test 6 : Tester les API Routes Directement

### Test avec curl (ou Postman)

#### Test Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"marie@test.fr\",
    \"password\": \"test123\",
    \"nom\": \"Martin\",
    \"prenom\": \"Marie\",
    \"entreprise\": \"Test Corp\",
    \"poste\": \"RH\"
  }"
```

**Résultat Attendu :**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "marie@test.fr",
    "role": "BETA_TESTEUR",
    "nom": "Martin",
    "prenom": "Marie",
    "entreprise": "Test Corp",
    "poste": "RH",
    "createdAt": "...",
    "lastLogin": "..."
  }
}
```

#### Test Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"marie@test.fr\",
    \"password\": \"test123\"
  }"
```

**Résultat Attendu :**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "marie@test.fr",
    ...
  }
}
```

---

## ✅ Checklist Complète

Cochez au fur et à mesure :

### Serveur
- [ ] `npm run dev` démarre sans erreur
- [ ] Serveur accessible sur http://localhost:3000

### Page Inscription
- [ ] Page `/inscription` se charge
- [ ] Design moderne visible (dark theme)
- [ ] Tous les champs présents
- [ ] Formulaire se soumet
- [ ] Toast de succès s'affiche
- [ ] Redirection vers `/dashboard` (404 OK)

### Base de Données
- [ ] Prisma Studio s'ouvre (http://localhost:5555)
- [ ] Table "User" visible
- [ ] Utilisateur créé apparaît
- [ ] Mot de passe est hashé (commence par $2b$)
- [ ] Dates sont remplies automatiquement

### Page Connexion
- [ ] Page `/connexion` se charge
- [ ] Design cohérent avec inscription
- [ ] Connexion avec bon mot de passe fonctionne
- [ ] Connexion avec mauvais mot de passe échoue
- [ ] Toast de succès s'affiche
- [ ] Redirection fonctionne

### Session
- [ ] `localStorage` contient `beta_session`
- [ ] `localStorage` contient `beta_user`
- [ ] Session persiste après rafraîchissement
- [ ] Session expire après 7 jours (à vérifier plus tard)

### API
- [ ] POST `/api/auth/register` fonctionne
- [ ] POST `/api/auth/login` fonctionne
- [ ] Erreurs renvoient les bons codes HTTP
- [ ] Validation fonctionne (email invalide, etc.)

---

## 🐛 Debugging - Si ça ne Marche Pas

### Erreur : Page blanche

**Cause possible :** Erreur JavaScript

**Solution :**
1. F12 → Console
2. Regardez l'erreur
3. Si erreur TypeScript, redémarrez VS Code

### Erreur : "Cannot find module '@/contexts/AuthContext'"

**Solution :**
```bash
# Redémarrer le serveur
Ctrl + C
npm run dev
```

### Erreur : "Email déjà utilisé"

**Solution :**
1. Ouvrez Prisma Studio
2. Supprimez l'utilisateur existant
3. OU utilisez un autre email

### Erreur : Pas de redirection après inscription

**Solution :**
1. F12 → Console
2. Regardez les erreurs
3. Vérifiez que la session est bien créée dans localStorage

### Erreur : 500 Internal Server Error

**Solution :**
1. Regardez le terminal où `npm run dev` tourne
2. L'erreur complète s'affiche là
3. Probablement un problème de connexion Prisma

**Vérifier Prisma :**
```bash
npx prisma generate
npx prisma db push
```

### Erreur : Mot de passe incorrect alors qu'il est bon

**Cause :** Problème de hash bcrypt

**Solution :**
1. Supprimez l'utilisateur dans Prisma Studio
2. Recréez-le via le formulaire
3. Si le problème persiste, vérifiez les logs serveur

---

## 📊 Résultats Attendus - Résumé

| Test | Status | Temps |
|------|--------|-------|
| Serveur démarre | ✅ | 10 sec |
| Page inscription charge | ✅ | Immédiat |
| Inscription fonctionne | ✅ | 2 sec |
| Utilisateur en DB | ✅ | Immédiat |
| Page connexion charge | ✅ | Immédiat |
| Connexion fonctionne | ✅ | 1 sec |
| Session persistante | ✅ | Immédiat |

**Si tout est ✅ = Authentification 100% fonctionnelle !**

---

## 🎯 Test Scénario Complet (End-to-End)

### Scénario : Nouveau utilisateur → Connexion → Vérification

```
1. Ouvrir http://localhost:3000/inscription
   ✓ Page charge correctement

2. Remplir formulaire
   Nom: TestUser
   Prénom: Demo
   Email: demo@test.fr
   Password: demo123

3. Soumettre
   ✓ Toast "Inscription réussie !"
   ✓ Redirect /dashboard (404 OK)

4. Vérifier Prisma Studio
   ✓ Utilisateur visible
   ✓ Password hashé
   ✓ Role = BETA_TESTEUR

5. Effacer session (localStorage.clear())

6. Aller sur /connexion
   ✓ Page charge

7. Se connecter (demo@test.fr / demo123)
   ✓ Toast "Connexion réussie !"
   ✓ Redirect /dashboard

8. Vérifier localStorage
   ✓ beta_session présent
   ✓ beta_user présent

9. Rafraîchir la page (F5)
   ✓ Session persiste
   ✓ Pas de déconnexion

✅ TOUT FONCTIONNE !
```

---

## 💡 Commandes Utiles

```bash
# Démarrer le serveur
npm run dev

# Ouvrir Prisma Studio
npx prisma studio

# Régénérer le client Prisma
npx prisma generate

# Voir la base de données
ls prisma/dev.db  # ou dir prisma\dev.db sur Windows

# Réinitialiser la DB (⚠️ SUPPRIME TOUT)
npx prisma migrate reset
```

---

## 📸 Captures d'Écran Attendues

### 1. Page Inscription
- Fond dégradé slate-950 → slate-900
- Card centrale avec blur
- Icône UserPlus en gradient bleu-violet
- Formulaire avec 7 champs
- Bouton gradient

### 2. Page Connexion
- Même style que inscription
- Icône LogIn
- 2 champs seulement (email, password)
- Lien vers inscription en bas

### 3. Prisma Studio
- Table User avec colonnes
- Utilisateur avec toutes les infos
- Password commençant par $2b$10$

### 4. localStorage (F12)
- Clé `beta_session` avec JSON
- Clé `beta_user` avec JSON
- Dates valides

---

## 🎓 Comprendre ce qui se Passe

### Flux d'Inscription

```
1. Utilisateur remplit formulaire
   ↓
2. Clic "Créer mon compte"
   ↓
3. Validation côté client (password match, etc.)
   ↓
4. Fetch POST /api/auth/register
   ↓
5. API: Validation Zod
   ↓
6. API: Hash password avec bcrypt
   ↓
7. API: Prisma.user.create()
   ↓
8. API: Retourne user (sans password)
   ↓
9. Client: login(user)
   ↓
10. Client: saveSession() → localStorage
   ↓
11. Client: Redirect /dashboard
```

### Flux de Connexion

```
1. Utilisateur entre email/password
   ↓
2. Fetch POST /api/auth/login
   ↓
3. API: Prisma.user.findUnique(email)
   ↓
4. API: bcrypt.compare(password, hash)
   ↓
5. API: Update lastLogin
   ↓
6. API: Retourne user
   ↓
7. Client: login(user)
   ↓
8. Client: saveSession()
   ↓
9. Client: Redirect /dashboard
```

---

## ✅ Validation Finale

**Vous avez réussi si :**

1. ✅ Vous pouvez créer un compte
2. ✅ Le compte apparaît dans Prisma Studio
3. ✅ Vous pouvez vous connecter
4. ✅ La session persiste (F5)
5. ✅ Les données sont dans localStorage
6. ✅ Les toasts s'affichent correctement

**Si 6/6 = 🎉 Authentification PARFAITE !**

---

**🚀 Prêt pour le Dashboard !**

*Guide créé le 14/12/2024*  
*Tests complets de l'authentification MVP*
