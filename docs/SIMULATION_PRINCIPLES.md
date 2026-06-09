# Principes de la simulation — LeVerre Labs

> Document de référence : pose **noir sur blanc** comment la simulation
> visuelle du verre fonctionne aujourd'hui dans le code, ce qu'elle est
> censée représenter, et les décisions de design à trancher.
>
> Sources de vérité dans le code :
> - `src/components/modele/dashboard-simplified.tsx:165-195` (boucle de remplissage)
> - `src/components/modele/dashboard-simplified.tsx:144-162` (boucle horloge / temps de travail)
> - `src/lib/simulation.ts` (scénarios + heuristique débordement)

---

## 1. Vocabulaire — bien distinguer 3 notions différentes

On manipule **trois "vitesses" qui n'ont rien à voir** :

| # | Notion                   | Unité                          | Qui la détermine ?                            |
|---|--------------------------|--------------------------------|-----------------------------------------------|
| 1 | **Score** d'un élément   | 0 → 100 (sans dimension)       | Réponses du participant au questionnaire      |
| 2 | **Vitesse de remplissage** | % du verre par minute *simulée* | Calcul à partir des 5 scores (formule physique) |
| 3 | **Vitesse de simulation** | minutes simulées par seconde *réelle* | Choix pédagogique (scénario / formateur)   |

> **Règle d'or** : la vitesse de remplissage (2) ne doit **PAS** dépendre de
> la vitesse de simulation (3). Sinon accélérer l'horloge fait exploser la
> dynamique. C'est ce que fait le code actuel et c'est ce qu'on doit corriger.

---

## 2. Les 5 scores — rappel

Tous notés sur **0 → 100**. Une seule échelle pour tout simplifier.

| Score | Élément        | Effet sur le verre                                          |
|-------|----------------|--------------------------------------------------------------|
| **R** | 🚰 Robinet     | Débit d'entrée (charge de travail). Plus haut = plus d'eau. |
| **B** | 🫧 Bulle       | Multiplicateur d'environnement. Mauvais env. amplifie R.   |
| **O** | ⛈️ Orage       | Multiplicateur d'aléas. Pics qui s'ajoutent à R.            |
| **P** | 🥤 Paille      | Débit de sortie (récupération). Plus haut = plus de drain. |
| **V** | 🥃 Verre       | Capacité d'absorption (résilience perso). Plus haut = remplit moins vite. |

---

## 3. Formule actuelle (ce qu'il y a dans le code aujourd'hui)

À chaque tick (toutes les **50 ms** réelles) :

```
inflow            = (R / 100) × 0.5 × simulationSpeed
outflow           = (P / 100) × 0.3 × simulationSpeed
environmentFactor = 1 + (B / 200)        // 1.0 → 1.5
stormImpact       = 1 + (O / 150)        // 1.0 → 1.667
capacityFactor    = 1.5 - (V / 100)      // 1.5 → 0.5

netChange = (inflow × environmentFactor × stormImpact - outflow) × capacityFactor
fillLevel = clamp(0, 100, fillLevel + netChange)
```

Le `fillLevel` est exprimé en **% de verre rempli** (0 = vide, 100 = débordement).

### Constante temporelle interne

> `Journée de 8h = 480 secondes simulées` (commentaire `dashboard-simplified.tsx:154`)

Donc à `simulationSpeed = 1` : **1 seconde simulée = 1 minute de travail**.

---

## 4. Bornes — combien de temps faut-il pour remplir le verre ?

> **Calculs faits à `simulationSpeed = 1`** (= cadence "naturelle" de la
> formule, où 1 sec simulée représente 1 min de boulot).

### 4.1 Pire des cas absolu

> R=100, B=100, O=100, P=0, V=0

```
inflow            = 1 × 0.5 × 1 = 0.5
outflow           = 0
environmentFactor = 1.5
stormImpact       = 1.667
capacityFactor    = 1.5

netChange = (0.5 × 1.5 × 1.667 - 0) × 1.5 ≈ 1.875 % par tick de 50 ms
          = 37.5 % par seconde simulée
          = 37.5 % par minute de travail
```

**→ Verre plein en ~2 min 40 s de travail simulé.** C'est un peu violent.

### 4.2 Cas moyen

> Tous les scores à 50

```
inflow = 0.25, outflow = 0.15
envFactor = 1.25, stormImpact = 1.333, capacityFactor = 1.0
netChange = (0.25 × 1.25 × 1.333 - 0.15) × 1.0 ≈ 0.267 % / tick
          = 5.33 % par seconde simulée
          = 5.33 % par minute de travail
```

**→ Verre plein en ~18 min 45 s de travail simulé.**

### 4.3 Meilleur cas

> R=0, P=100, V=100 (B et O peu importe)

```
inflow = 0, outflow = 0.3
netChange ≈ -0.15 / tick → fillLevel reste à 0
```

**→ Verre jamais rempli. Bien.**

---

## 5. Le problème quand on accélère le temps

À `simulationSpeed = 48` (scénario "Journée" : 8 h compressées en 10 s d'animation) :

```
inflow_pire_cas = 1 × 0.5 × 48 = 24 % par tick
                = 480 % par seconde réelle  (!!!)
```

> **Le verre déborde en 1 tick de 50 ms.** L'animation devient illisible.

Cause : la `simulationSpeed` est multipliée *deux fois* — une fois dans
l'horloge (`workTime`), une fois dans la dynamique (`inflow`/`outflow`).
Il ne faut la multiplier qu'**une seule fois**, là où elle a un sens
physique : le passage du temps.

---

## 6. Reformulation propre proposée

On sépare clairement les 3 vitesses du §1.

### 6.1 Vitesse de remplissage **par minute simulée** (pure physique, indépendante du scénario)

```
fillRatePerMinute(R, B, O, P, V)
  = ((R/100) × ENV(B) × STORM(O) - (P/100) × DRAIN_RATIO) × CAP(V) × MAX_FILL_RATE
```

avec :

- `ENV(B)        = 1 + B / 200`         → 1.0 → 1.5
- `STORM(O)      = 1 + O / 150`         → 1.0 → 1.667
- `CAP(V)        = 1.5 - V / 100`       → 1.5 → 0.5
- `DRAIN_RATIO   = 0.6` (la paille à 100 ne peut pas évacuer plus qu'un robinet à ~60)
- `MAX_FILL_RATE = ?` (à fixer — voir §7)

### 6.2 Vitesse de simulation (compression temporelle, indépendante des scores)

C'est juste un facteur multiplicatif sur l'horloge :

```
elapsedSimulatedMinutes = elapsedRealSeconds × simulationSpeedMinPerSec
```

À chaque tick de 50 ms, on calcule combien de minutes simulées se sont
écoulées, et on applique :

```
deltaFill = fillRatePerMinute × elapsedSimulatedMinutesThisTick
fillLevel = clamp(0, 100, fillLevel + deltaFill)
```

Comme ça : **doubler la vitesse de simulation double juste le défilement
visuel**, mais ne change PAS la quantité d'eau qui tombe par minute simulée.

---

## 7. Décisions à trancher (le vrai sujet)

Tant qu'on n'a pas répondu à ça, on ne touche pas au code.

### 7.1 Quelle est la durée "pire cas" ?

> Combien de temps de travail réel doit-il falloir pour qu'un opérateur
> avec scores au max **sans récup** déborde ?

Choix possibles :

| Option | Pire cas | `MAX_FILL_RATE` correspondant     | Lecture pédagogique                              |
|--------|----------|------------------------------------|--------------------------------------------------|
| A      | 30 min   | ~1.33 % / min simulée             | "Une demi-heure d'enfer suffit." Très alarmant. |
| B      | 2 h      | ~0.83 % / min simulée             | "Une matinée et c'est plié." Réaliste choc.    |
| C      | 8 h (1 journée) | ~0.21 % / min simulée       | "Pile une journée pour craquer." Cohérent TMS. |
| D      | 1 semaine (40 h) | ~0.04 % / min simulée      | TMS chroniques. Lent mais juste.                |

**Recommandation** : option **B (2 h)** ou **C (8 h)** selon l'audience.
8 h colle au discours "la journée d'un opérateur", 2 h marque davantage.

### 7.2 Qui choisit la vitesse de simulation ?

Trois options (cf. message précédent) :

- **Choix global formateur** : un seul scénario pour toute la session.
  Plus simple, plus pédagogique (tout le monde voit la même horloge).
- **Choix participant** : ce qu'on a actuellement, mais c'est un cran de
  variabilité supplémentaire pour des opérateurs qui découvrent l'outil.
- **Pas de scénario du tout** : juste une vitesse fixe (ex. journée), on
  retire le `ScenarioSelector` et la column `simulation_scenario`.

### 7.3 La paille peut-elle vider un verre déjà rempli ?

Aujourd'hui : oui, si `outflow > inflow × env × storm × cap`, le niveau
descend. C'est correct (= récup nocturne, pauses), mais on peut vouloir
forcer un "résidu de fond" pour montrer que les TMS s'accumulent même
avec récup. À discuter.

---

## 8. Plan d'implémentation suggéré (une fois §7 tranché)

1. Créer un module `src/lib/glass-physics.ts` qui exporte
   `fillRatePerMinute(scores)` et la constante `MAX_FILL_RATE`.
2. Découpler `simulationSpeed` de la formule de remplissage dans
   `dashboard-simplified.tsx` (la garder uniquement pour l'horloge).
3. Selon la décision §7.2 :
   - Si choix formateur : déplacer `simulation_scenario` de la table
     `participants` vers `sessions`, simplifier `ScenarioSelector`.
   - Si pas de scénario : retirer entièrement le sélecteur côté
     participant + la column.
4. Ajuster `estimateIsOverloaded` pour réutiliser `fillRatePerMinute`
   au lieu de sa propre heuristique → cohérence parfaite mosaïque ↔ animation.
5. Tester les 4 cas de bornes (§4) sur l'animation réelle et vérifier
   qu'ils correspondent aux durées attendues.

---

## 9. Glossaire rapide

- **Tick** : un cycle d'animation. Aujourd'hui : 50 ms réelles.
- **Minute simulée** : 1 minute de "vie d'opérateur" représentée. À
  `simulationSpeed = 48`, 1 minute simulée = ~1.25 secondes réelles.
- **Débordement** : `fillLevel ≥ 100`. Métaphore du TMS / burnout.
