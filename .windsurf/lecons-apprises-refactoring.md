# Leçons Apprises : Refactoring de Modularisation

## 📅 Date : Avril 2026
## 🎯 Contexte : Échec de refactoring du fichier `analysis-modal.tsx`

---

## ❌ Ce qui s'est mal passé

### Situation
- **Demande initiale** : Diviser un gros fichier (`analysis-modal.tsx` ~4000 lignes) en plusieurs fichiers modulaires
- **Objectif** : Extraire les questions dans des fichiers séparés par élément, extraire les types, créer une architecture cohérente
- **Résultat** : Échec complet avec épuisement du quota de tokens

### Erreurs commises

1. **Suppressions partielles itératives** 
   - J'ai tenté de supprimer le code dupliqué par petits morceaux (10-30 lignes à la fois)
   - Chaque suppression créait de nouveaux fragments incomplets
   - Nécessité de 15-20 tentatives de suppression
   - Consommation massive de tokens sans progression

2. **Manque d'analyse préalable**
   - Je n'ai pas pris le temps de comprendre la structure complète du fichier
   - Je n'ai pas identifié où commençaient et finissaient les vrais blocs logiques
   - J'ai travaillé "à l'aveugle" en réagissant aux erreurs

3. **Stratégie inadaptée**
   - Approche "bottom-up" (supprimer les erreurs une par une) au lieu de "top-down" (comprendre puis agir)
   - Pas de plan clair sur la structure cible
   - Modifications destructives sans filet de sécurité

---

## ✅ Ce qu'il aurait fallu faire

### Méthodologie correcte pour ce type de refactoring

#### Phase 1 : ANALYSE (CRITIQUE)
```
1. Lire le fichier en entier pour comprendre sa structure
2. Identifier les blocs logiques distincts :
   - Imports
   - Types/Interfaces
   - Données (questions, configurations)
   - Fonctions utilitaires
   - Composant principal
3. Repérer les duplications et leur emplacement exact
4. Créer un plan de découpage clair
```

#### Phase 2 : CRÉATION DES NOUVEAUX FICHIERS
```
1. Créer TOUS les fichiers modulaires d'abord
   - questions-verre.ts
   - questions-robinet.ts
   - questions-bulle.ts
   - etc.
2. Remplir ces fichiers avec le contenu extrait
3. S'assurer que chaque fichier compile indépendamment
```

#### Phase 3 : NETTOYAGE DU FICHIER PRINCIPAL
```
Option A (PRÉFÉRÉE) : Réécriture complète
- Créer un nouveau fichier temporaire avec SEULEMENT :
  * Les imports nécessaires
  * Le composant principal
  * Les hooks et logique métier
- Remplacer l'ancien fichier par le nouveau

Option B : Suppression massive unique
- Identifier la ligne de fin du composant principal
- Faire UNE SEULE suppression de tout ce qui suit
- Ne PAS faire de suppressions partielles multiples
```

---

## 🎓 Règles d'or pour éviter ce problème

### 1. **Toujours analyser avant d'agir**
```
❌ NE PAS : Commencer à modifier dès qu'on voit des erreurs
✅ FAIRE : Prendre 2-3 minutes pour lire et comprendre la structure
```

### 2. **Création avant destruction**
```
❌ NE PAS : Supprimer du code avant d'avoir créé les nouveaux fichiers
✅ FAIRE : Créer tous les fichiers modulaires PUIS nettoyer
```

### 3. **Suppressions massives > Suppressions itératives**
```
❌ NE PAS : 20 petites suppressions de 30 lignes
✅ FAIRE : 1 grosse suppression de 2000 lignes OU réécriture propre
```

### 4. **Réécriture > Modification pour les gros refactorings**
```
❌ NE PAS : Essayer de "réparer" un fichier de 4000 lignes ligne par ligne
✅ FAIRE : Réécrire proprement le fichier avec juste ce qui est nécessaire
```

### 5. **Plan explicite avant exécution**
```
✅ FAIRE : Créer un plan en 3-5 étapes claires
✅ FAIRE : Partager ce plan avec l'utilisateur
✅ FAIRE : Suivre le plan sans dévier
```

---

## 📋 Checklist pour les futures modularisations

### Avant de commencer
- [ ] J'ai lu le fichier complet pour comprendre sa structure
- [ ] J'ai identifié tous les blocs logiques à extraire
- [ ] J'ai un plan clair en 3-5 étapes
- [ ] J'ai partagé ce plan avec l'utilisateur

### Pendant l'exécution
- [ ] Je crée TOUS les nouveaux fichiers avant de nettoyer
- [ ] Chaque nouveau fichier compile et exporte correctement
- [ ] Si je dois supprimer >200 lignes, je fais UNE suppression massive
- [ ] Si je me retrouve à faire >3 suppressions, je STOP et réfléchis

### Après l'exécution
- [ ] Le fichier principal compile sans erreurs
- [ ] Les imports fonctionnent correctement
- [ ] L'application fonctionne comme avant

---

## 🔧 Pattern recommandé pour ce type de demande

### Quand l'utilisateur dit : "divise ce gros fichier en plusieurs fichiers"

```typescript
// ÉTAPE 1 : Analyse
read_file(fichier_principal) // Lire en entier
// Identifier : imports, types, data, utils, component

// ÉTAPE 2 : Création des modules
write_to_file(nouveau_fichier_1) // Types
write_to_file(nouveau_fichier_2) // Data 1
write_to_file(nouveau_fichier_3) // Data 2
write_to_file(nouveau_fichier_4) // Utils
// etc.

// ÉTAPE 3 : Réécriture propre du fichier principal
write_to_file(fichier_principal + ".new") {
  imports_depuis_nouveaux_fichiers,
  logique_du_composant_uniquement
}

// ÉTAPE 4 : Remplacer
rename(fichier_principal.new -> fichier_principal)
```

---

## 💡 Signaux d'alarme

Si je me retrouve dans ces situations, je dois ARRÊTER et reconsidérer ma stratégie :

1. **>3 tentatives de suppression** → Je suis probablement dans une mauvaise approche
2. **Erreurs qui augmentent au lieu de diminuer** → Je casse plus que je ne répare
3. **Fichier qui grandit au lieu de rétrécir** → Quelque chose ne va pas
4. **Duplications qui réapparaissent** → Je ne comprends pas la structure

### Action corrective
1. Faire une pause
2. Relire ce fichier de leçons
3. Proposer une approche alternative à l'utilisateur
4. Obtenir son accord avant de continuer

---

## 📝 Template de réponse pour ce type de demande

```markdown
# Plan de modularisation

## Structure actuelle
- [Fichier principal] : X lignes
- Contenu : [imports, types, data, utils, component]

## Structure cible
1. [nouveau_fichier_1] : [types]
2. [nouveau_fichier_2] : [questions element 1]
3. [nouveau_fichier_3] : [questions element 2]
4. [fichier_principal] : [imports + component uniquement]

## Approche
1. Créer tous les nouveaux fichiers (étapes 1-X)
2. Réécrire le fichier principal proprement (étape X+1)
3. Vérifier la compilation (étape X+2)

Temps estimé : X appels de fonctions

Est-ce que cette approche vous convient ?
```

---

## 🎯 Principe fondamental

> **"Pour modulariser un gros fichier : CRÉER d'abord, NETTOYER ensuite. Jamais l'inverse."**

La création de nouveaux fichiers ne coûte que quelques tokens et ajoute de la valeur.
La suppression itérative coûte énormément et crée du chaos.

---

## 📌 À relire avant chaque refactoring de ce type

**Question à se poser** : "Est-ce que je comprends parfaitement la structure du fichier avant d'agir ?"

- Si **OUI** → Procéder avec le plan création → nettoyage
- Si **NON** → Prendre 2-3 minutes pour analyser d'abord

---

*Ce fichier doit être relu par l'IA à chaque fois que l'utilisateur demande une modularisation ou restructuration de code.*
