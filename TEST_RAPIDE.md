# ⚡ Test Rapide - 5 Minutes

## 🎨 Prisma Studio est lancé !

**URL :** http://localhost:5555

---

## ✅ Test 1 : Voir les Tables (30 secondes)

1. Ouvrez votre navigateur sur `http://localhost:5555`
2. Vous devriez voir 4 modèles sur la gauche :
   - ✓ **User**
   - ✓ **Analysis**  
   - ✓ **Scenario**
   - ✓ **FactorConfig**

3. Cliquez sur chaque modèle pour voir les colonnes

**✅ Si vous voyez ces 4 tables = SUCCESS !**

---

## ✅ Test 2 : Créer un Utilisateur (2 minutes)

1. Dans Prisma Studio, cliquez sur **"User"**
2. Cliquez sur **"Add record"** (bouton en haut à droite)
3. Remplissez les champs :

```
id: [Laissez vide - auto-généré]
email: william@leverre.fr
password: test123
role: BETA_TESTEUR
nom: Votre nom
prenom: Votre prénom
entreprise: LeVerre Labs
poste: Ergonome
[Les dates se remplissent automatiquement]
```

4. Cliquez sur **"Save 1 change"** (bouton vert en bas)

**✅ Résultat attendu :**
- Un ID est généré automatiquement (ex: `abc123-def456-...`)
- Les dates `createdAt`, `updatedAt`, `lastLogin` sont remplies
- L'utilisateur apparaît dans la liste

---

## ✅ Test 3 : Créer une Analyse (3 minutes)

1. Cliquez sur **"Analysis"** dans le menu de gauche
2. Cliquez sur **"Add record"**
3. Remplissez :

```
id: [Laissez vide]
userId: [Copiez l'ID de l'utilisateur créé précédemment]
poste: Opérateur de production
tache: Assemblage de modules
duree: 480
date: [Choisissez la date du jour]
operateur: Jean Dupont
notes: Analyse de test

scores: {"robinet":{"total":65,"chargePhysique":15,"postures":12,"frequence":14,"chargeMentale":13,"rps":11},"verre":{"capacite":60,"age":15,"anciennete":18,"formation":15,"antecedents":12},"paille":{"total":45,"pausesActives":12,"etirements":10,"relaxation":13,"sommeil":10},"bulle":{"total":55,"temperature":10,"eclairage":12,"bruit":8,"vibrations":6,"hygiene":7,"espace":8,"equipements":4},"orage":{"total":40,"impact":20,"duree":12,"frequence":8}}

results: {"remplissageMax":78,"risqueTMS":65,"risqueAccident":58,"niveauGlobal":"vigilance"}

recommendations: ["Réduire la charge physique","Améliorer l'ergonomie du poste","Augmenter la fréquence des pauses"]
```

4. Cliquez sur **"Save 1 change"**

**✅ Résultat attendu :**
- Analyse créée avec succès
- Elle est liée à votre utilisateur

---

## ✅ Test 4 : Vérifier les Relations (1 minute)

1. Retournez sur **"User"**
2. Cliquez sur votre utilisateur
3. Vous devriez voir un onglet **"analyses"** 
4. Il devrait afficher "1" analyse liée

**✅ Si vous voyez la relation = Les relations fonctionnent !**

---

## 🎯 Résumé des Tests

| Test | Statut | Description |
|------|--------|-------------|
| Tables visibles | ✅ | 4 modèles dans Prisma Studio |
| Créer User | ✅ | Utilisateur créé avec ID auto |
| Créer Analysis | ✅ | Analyse liée à l'utilisateur |
| Relations | ✅ | User ↔ Analysis fonctionne |

---

## 🚀 Commandes Utiles

### Démarrer Prisma Studio
```bash
npx prisma studio
```

### Arrêter Prisma Studio
```
Ctrl + C dans le terminal
```

### Réinitialiser la DB (⚠️ Supprime tout)
```bash
npx prisma migrate reset
```

### Valider le schéma
```bash
npx prisma validate
```

---

## 📊 Ce que Vous Pouvez Tester

### ✅ Maintenant (avec Prisma Studio)
- [x] Créer des utilisateurs
- [x] Créer des analyses
- [x] Créer des scénarios
- [x] Voir les relations
- [x] Modifier des données
- [x] Supprimer des données

### ⏳ Après l'implémentation de l'authentification
- [ ] S'inscrire via l'interface
- [ ] Se connecter
- [ ] Créer une analyse via l'interface
- [ ] Exporter en PDF

---

## 💡 Astuces Prisma Studio

### Copier un ID
1. Cliquez sur l'ID de l'utilisateur
2. Il se copie automatiquement
3. Collez-le dans le champ `userId` de l'analyse

### Naviguer dans les relations
1. Cliquez sur l'icône "→" à côté du champ relationnel
2. Vous êtes redirigé vers l'enregistrement lié

### Filtrer les données
En haut : "Add filter"
```
email contains "leverre"
role equals "BETA_TESTEUR"
```

---

## ✅ Checklist Finale

- [x] Prisma Studio se lance correctement
- [x] 4 tables sont visibles
- [x] Peut créer un utilisateur
- [x] Peut créer une analyse
- [x] Les relations fonctionnent
- [x] Les données sont persistées
- [x] Les dates auto-générées fonctionnent
- [x] Les IDs UUID sont générés

**🎉 Si tout est coché = Setup parfait !**

---

## 🎯 Prochaine Étape

Une fois ces tests validés, nous allons :
1. Créer les fonctions d'authentification (`src/lib/auth.ts`)
2. Créer les API routes (`app/api/auth/`)
3. Créer l'interface de connexion/inscription
4. Tester le workflow complet

Mais pour l'instant : **Amusez-vous avec Prisma Studio !** 🎨

---

*Test créé le 14/12/2024*  
*Durée estimée : 5-10 minutes*
