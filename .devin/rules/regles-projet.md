---
description: Règles complètes du projet LeVerre Labs (lues automatiquement par Cascade à chaque session)
trigger: always_on
---

# Règles du projet LeVerre Labs

> Ce fichier est **lu systématiquement** par Cascade à chaque démarrage
> de session. Tu peux le modifier à tout moment, ça prendra effet
> immédiatement.
>
> **Une seule source de vérité** : ces règles remplacent celles qui
> étaient dans `user_global` (paramètres Windsurf). Pense à vider
> `user_global` pour éviter les doublons (instructions à la fin du
> fichier).

---

## 1. Communication avec l'utilisateur

- **Toujours répondre en français.**
- L'utilisateur **n'est pas développeur professionnel** → expliquer le
  code de façon simple, sans jargon inutile.
- **Demander plus de contexte** quand il manque une info, plutôt que
  d'inventer.
- **Se référer aux docs officielles** quand une question technique se
  pose (Next.js, React, Supabase, etc.).
- **Prendre le temps de réfléchir** avant d'écrire du code (analyse
  préalable du fichier, du contexte, des impacts).

---

## 2. Stack technique imposée

Toujours utiliser **les dernières versions stables** de :

- **TypeScript**
- **Node.js**
- **Next.js** (App Router uniquement, pas Pages Router)
- **React** (Server Components par défaut)
- **Tailwind CSS**
- **Shadcn UI** + **Radix UI** pour les composants
- **Supabase** pour la base de données + temps réel + auth

---

## 3. Principes de code

- TypeScript **concis et technique**, exemples précis.
- **Programmation fonctionnelle** uniquement → pas de classes.
- **Itération + modularisation** plutôt que duplication.
- **Variables avec verbes auxiliaires** : `isLoading`, `hasError`,
  `shouldRender`, `canSubmit`, etc.
- **Structure d'un fichier composant** :
  1. Composant exporté (en haut)
  2. Sous-composants
  3. Helpers
  4. Contenu statique
  5. Types

---

## 4. Conventions de nommage

### 4.1 Fichiers et dossiers

- **kebab-case minuscule** pour les fichiers et dossiers
  (`mon-composant.tsx`, `auth-wizard/`).
- **Français > anglais** pour les noms qui parlent du métier (composants
  fonctionnels, dossiers organisationnels). On garde l'anglais
  uniquement pour les conventions imposées par le framework
  (`page.tsx`, `route.ts`, `layout.tsx`, `middleware.ts`).
- **Descriptif > générique** : `tableau-de-bord.tsx` plutôt que
  `dashboard.tsx`. Si on doit lire le fichier pour deviner ce qu'il
  fait, le nom est mauvais.
- **Organisation par "qui voit ça"** plutôt que par type technique.
  Exemple : un composant affiché chez le formateur va dans
  `animateur/`, même si c'est un sous-composant.

### 4.2 Code

- **Exports nommés** préférés (pas d'`export default`) pour les
  composants → meilleure lisibilité dans les imports.
- **Composants en PascalCase** (`MonComposant`).
- Le nom de l'export ne suit pas obligatoirement le nom de fichier
  (ex. fichier `tableau-de-bord.tsx` peut exporter `FormateurDashboard`
  pour préserver la cohérence sémantique).

### 4.3 Exemple de structure (formation)

```
src/components/formation/
├── animateur/                       # ce que voit le formateur
│   ├── ecran-connexion.tsx
│   ├── tableau-de-bord.tsx
│   ├── panneau-de-controle.tsx
│   └── ...
└── participant/                     # ce que voit l'opérateur
    ├── ecran-rejoindre.tsx
    ├── vue-participant.tsx
    └── ...
```

---

## 5. TypeScript

- Préférer les **`interface`** aux `type` pour les objets / props.
- **Pas d'`enum`** → utiliser des **maps as const** :

  ```ts
  const STATUS = { idle: 'idle', loading: 'loading', done: 'done' } as const
  type Status = (typeof STATUS)[keyof typeof STATUS]
  ```

- **Composants fonctionnels** uniquement, typés via interface.

---

## 6. Syntaxe et formatage

- Mot-clé **`function`** pour les fonctions pures (pas d'arrow function
  pour les fonctions exportées qui ne sont pas des composants).
- **Pas d'accolades inutiles** dans les conditions simples
  (`if (x) doSomething()` plutôt que `if (x) { doSomething() }`).
- **JSX déclaratif** (pas de `React.createElement`).

---

## 7. UI et style

- **Shadcn UI + Radix + Tailwind** pour tous les composants.
- **Mobile-first** : on style d'abord le mobile, puis on ajoute des
  variantes `sm:`, `md:`, `lg:` pour le desktop.
- **Pas d'inline styles** sauf cas exceptionnel (variables CSS, valeurs
  dynamiques calculées).

---

## 8. Performance

- **Minimiser** `'use client'`, `useEffect`, `useState`.
- **Server Components par défaut** ; `'use client'` uniquement quand on
  a vraiment besoin d'une Web API ou d'un hook React.
- **Wrapper les composants client dans `<Suspense>`** avec un fallback
  pédagogique (skeleton, spinner).
- **Dynamic imports** (`next/dynamic`) pour les composants non
  critiques au-dessus du fold.
- **Images** : WebP, dimensions explicites (`width`/`height`),
  `loading="lazy"` quand pertinent.
- **URL state** : utiliser **`nuqs`** pour persister l'état dans les
  query params (filtres, onglets actifs, etc.).
- **Optimiser Web Vitals** : LCP, CLS, FID.

---

## 9. Spécificités LeVerre Labs

### 9.1 Modèle métier (5 éléments)

1. **🚰 Robinet** (bleu) — charge de travail (entrée d'eau).
2. **🫧 Bulle** (violet) — environnement (multiplicateur).
3. **⛈️ Orage** (doré) — aléas (pics de charge).
4. **🥤 Paille** (vert) — récupération (sortie d'eau).
5. **🥃 Verre** (transparent) — capacité personnelle (résilience).

> Pour la mécanique de simulation, voir
> `docs/SIMULATION_PRINCIPLES.md`.

### 9.2 Structure du projet

```
src/
├── app/                     # routes Next.js App Router
│   ├── formation/[code]/    # côté formateur (mosaïque salle)
│   ├── session/[code]/      # côté participant (mobile)
│   └── api/                 # routes API
├── components/
│   ├── formation/           # composants spécifiques aux sessions live
│   │   ├── animateur/       # vu par le formateur
│   │   └── participant/     # vu par l'opérateur
│   ├── modele/              # composants visuels du verre/robinet/etc.
│   └── ui/                  # composants génériques (Shadcn + custom)
├── hooks/                   # hooks React partagés
├── lib/
│   ├── questions/           # définitions des questionnaires par élément
│   ├── supabase/            # client + types DB
│   ├── element-theme.ts     # thème couleur des 5 éléments
│   └── simulation.ts        # logique de la simulation
└── docs/                    # documentation produit
```

### 9.3 Supabase

- **Realtime** : on utilise les channels par session (`session:CODE`)
  pour synchroniser participants ↔ formateur.
- **Migrations SQL** : toujours créer un fichier dans
  `supabase/migrations/` avec un préfixe numéroté
  (`002_add_simulation.sql`).
- **RLS** : à activer sur toutes les tables, jamais de bypass côté
  client.
- **Types TS** : régénérer `src/lib/supabase/types.ts` après chaque
  migration via `supabase gen types`.

### 9.4 Tailwind config

Le scan de Tailwind doit inclure `src/lib` et `src/hooks` (en plus de
`src/components` et `src/app`) car certains thèmes y génèrent des
classes dynamiquement (cf. `element-theme.ts`).

---

## 10. Discipline Cascade (méthodes de travail)

### 10.1 Avant de créer ou déplacer un fichier

1. Vérifier si le **nom est parlant pour un non-dev**.
2. Vérifier si l'**emplacement** suit la logique "qui voit ça" / cohérent
   avec la structure §9.2.
3. Si non, **proposer un meilleur nom à l'utilisateur AVANT** de créer.
4. Préserver l'**historique Git** via `git mv` lors d'un renommage
   (uniquement si le fichier est tracké).

### 10.2 Avant un refactoring important

> Leçon apprise (cf. `.windsurf/lecons-apprises-refactoring.md`) :

1. **Lire le fichier en entier** pour comprendre la structure.
2. **Identifier les blocs logiques** complets (pas de découpage à la
   ligne).
3. **Faire un plan top-down** : structure cible → étapes → validation.
4. **Une grosse édition propre** plutôt que 15 petites éditions
   itératives (consomme moins de tokens et évite les états
   intermédiaires cassés).
5. **Vérifier TypeScript** après chaque étape importante (`npx tsc
   --noEmit`).

### 10.3 Pour fixer un bug

1. **Identifier la cause racine**, pas les symptômes.
2. **Préférer un fix minimal en amont** plutôt qu'un workaround en aval.
3. **Une ligne de changement** suffit souvent — éviter le sur-engineering.
4. **Ajouter des logs** descriptifs si la cause est floue.
5. **Vérifier que le fix passe TypeScript** + tester visuellement quand
   pertinent.

### 10.4 Communication

- **Réponses concises**, pas de paraphrase de la demande.
- **Pas d'acquiescement préliminaire** ("Excellente question !",
  "Tu as raison !"...) — aller directement à la réponse.
- **Demander confirmation** avant les actions destructives (suppression
  de fichiers, refactoring large, modifications irréversibles).
- **Utiliser `ask_user_question`** pour les choix entre 2-4 options
  claires.

---

## 11. Comment vider les règles `user_global` (à faire **par toi**)

Pour éviter les doublons entre ce fichier et tes règles globales
Windsurf, va vider tes règles globales :

1. Dans Windsurf, ouvre le panneau **Cascade** (à droite).
2. Clique sur l'icône ⚙️ ou **Settings** en haut du panneau.
3. Cherche la section **"Memories"** ou **"Global Rules"**
   (selon la version de Windsurf).
4. **Supprime le contenu** ou désactive la mémoire `user_global`
   contenant tes règles techniques (TypeScript, Tailwind, etc.).
5. Garde uniquement, si tu veux, des règles **vraiment universelles**
   à tous tes projets (ex. "réponds en français" si tu travailles aussi
   sur d'autres projets non-français).

> Une fois fait, ce fichier `regles-projet.md` devient ta **seule source
> de vérité** pour LeVerre Labs.

---

## 12. Comment modifier ces règles plus tard

- Ouvre `.windsurf/rules/regles-projet.md` directement dans l'IDE.
- Modifie ce que tu veux, sauvegarde.
- Cascade lit la nouvelle version dès la prochaine action.
- Si tu veux un changement temporaire, dis-le-moi simplement dans le
  chat ; si tu veux que ça devienne **permanent**, ajoute-le ici.
