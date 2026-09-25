# Analyse rapide — découper une vidéo de poste et faire vivre le verre

> Troisième onglet de l'espace formateur, à côté de « Sensibilisation » et
> « Analyse Vidéo ». Pensé pour être filmé en partage d'écran : on lit une
> vidéo de poste, on découpe des moments au fil de l'eau, on les note en
> quelques gestes, et le verre raconte l'activité pendant la lecture.
>
> Code : `src/components/analyse-rapide/` (UI) et `src/lib/analyse-rapide/`
> (critères, scoring, physique). Auto-tests : `/dev/analyse-rapide`.

---

## 1. Disposition de l'écran

```
┌──────────────────────────────────────────────────────────────────────┐
│ titre · nb moments · « la séquence représente » 1h 2h 4h 8h · focus  │
├───────────────────────────────┬──────────────────┬───────────────────┤
│                               │                  │                   │
│          VIDÉO                │  PANNEAU DE      │   LE VERRE        │
│      (zone commentée)         │  NOTATION        │   (le résultat)   │
│                               │  (ouvert à la    │                   │
│  ▶  ✂ Découper  ×0,25 → ×2    │   demande)       │                   │
├───────────────────────────────┴──────────────────┤                   │
│  FRISE : courbe du verre + moments découpés      ├───────────────────┤
│                                                  │ scores chiffrés   │
└──────────────────────────────────────────────────┴───────────────────┘
```

Trois principes, tous dictés par l'enregistrement vidéo :

1. **La cause à gauche, l'effet à droite.** Le regard du spectateur va de la
   scène filmée au verre, dans le sens de la lecture. Le commentaire oral suit
   le même chemin : « regardez ce qu'il fait → regardez ce que ça remplit ».
2. **Rien ne bouge de place.** Le panneau de notation s'insère entre les deux
   sans déplacer la vidéo ni le verre : pas de saut de mise en page au montage,
   on peut recadrer en 9:16 sur la colonne du verre pour un reel sans que la
   cible se déplace d'un plan à l'autre.
3. **La frise est un plan large.** Elle porte à la fois les moments (couleur =
   gravité) et la courbe du verre sur toute la vidéo : c'est le plan de coupe
   naturel pour conclure — « voilà la journée en une image ».

Le **mode focus** (touche `F`) masque l'en-tête du site, passe en plein écran
natif et élargit la colonne du verre : c'est la disposition à utiliser pour la
relecture finale qu'on enregistre.

**Raccourcis** : `Espace` lecture/pause · `M` début/fin de moment · `←` `→`
±5 s · `Échap` fermer le panneau · `F` mode focus.

---

## 2. Méthode de notation : échelle ancrée, pas checklist

Chaque élément a **5 critères**. Pour chacun :

- un **curseur 0-100** = la gravité observée ;
- **4 cases** = l'importance de ce critère dans ce moment précis
  (Mineur ×1, Notable ×2, Important ×3,5, Déterminant ×5) ;
- un **repère** (« quoi regarder ») et **4 ancrages** qui décrivent en clair ce
  que valent 0, 35, 70 et 100. L'ancrage correspondant s'affiche sous le
  curseur pendant qu'on le déplace.

Cliquer sur la case déjà active **écarte** le critère : il sort du calcul.

### Pourquoi pas une checklist cliquable

La checklist est plus rapide à cliquer, mais elle est binaire : « posture
contraignante : oui/non ». Or en vidéo, tout l'intérêt du commentaire est de
dire *à quel point*, et de le justifier. Trois raisons ont tranché :

- **Le discours filmé a besoin de degrés.** « Le dos est à 60° pendant la
  moitié du cycle » n'est pas « il se penche un peu ». Une case cochée ne
  laisse rien à raconter ; un curseur posé à 78 appelle une justification.
- **Le modèle attend des scores 0-100.** Une checklist oblige à rajouter une
  règle de conversion arbitraire (« 3 items cochés sur 5 = 60 »), qu'il
  faudrait défendre. Le curseur alimente directement la formule.
- **Les ancrages donnent la vitesse de la checklist sans sa pauvreté.** Comme
  les descripteurs sont écrits à l'avance, on lit, on pose, on passe : c'est le
  principe des échelles d'évaluation ancrées, utilisées justement parce
  qu'elles réduisent l'écart entre deux évaluateurs.

Les 4 cases d'importance sont ce que la checklist ne sait pas faire : dire que
dans *ce* moment-là, c'est la charge qui fait tout et que la charge mentale est
anecdotique. C'est là que se joue l'expertise, et c'est un clic.

### Du curseur au score

Moyenne quadratique pondérée, comme le reste de l'application
(`src/lib/questions/scoring.ts`) : `A = √( Σ wᵢ·xᵢ² / Σ wᵢ )`.

Elle fait remonter le score dès qu'**un** facteur est très dégradé, au lieu de
le noyer dans la moyenne — ce qui correspond à la réalité d'un poste où un seul
facteur peut suffire à faire mal.

- Robinet, Bulle, Orage : score = défaveur (100 = mauvais).
- Paille, Verre : score inversé (100 = favorable), critères rédigés côté
  défavorable pour que tous les curseurs se lisent pareil : « à droite = pire ».
- Orage : le critère « survenue dans ce moment » est un **multiplicateur**
  (esprit AMDEC). À 0, l'orage est nul quelle que soit la gravité des autres
  critères : rien ne s'est passé, donc rien ne compte.

---

## 3. Physique du verre

Formule du §6.1 de `SIMULATION_PRINCIPLES.md`, inchangée :

```
taux (% de verre par minute de travail)
  = ( R/100 × ENV(B) × STORM(O) − P/100 × 0,6 ) × CAP(V) × TAUX_MAX
```

**Calibration** : option B du §7.1 — au pire cas absolu, le verre déborde après
**2 h de travail**. D'où `TAUX_MAX = 100 / (120 × 3,75) ≈ 0,222`.

Repères qui en découlent :

| Situation                                  | Verre plein après |
|--------------------------------------------|-------------------|
| Pire cas absolu (100/100/100/0/0)          | 2 h               |
| Moment dur (100/80/60/10/20)               | ~3 h              |
| Moment chargé (80/60/30/30/40)             | ~6 h 30           |
| Moment neutre (tous à 50, pas d'imprévu)   | ~23 h             |
| Moment tenable (20/20/0/80/80)             | jamais (il vide)  |

### La projection : « la séquence représente… »

Une vidéo de poste est un **échantillon**. Filmer 2 minutes ne veut pas dire que
l'opérateur travaille 2 minutes. On annonce donc explicitement la durée de
travail que la séquence résume (1 h, 2 h, 4 h par défaut, 8 h), et la lecture
fait défiler ce temps-là.

C'est exactement la « vitesse de simulation » du §6.2 : elle agit sur le temps
qui passe, **jamais** sur le débit. Le bandeau affiche donc toujours le rythme
en « % par heure de travail » et le débordement en temps de travail, deux
grandeurs qui ne bougent pas quand on change la projection.

### Entre deux moments

Le temps non découpé n'est pas du repos : c'est surtout du travail qu'on n'a pas
analysé. Le robinet se ferme, l'orage s'éteint, et la paille n'agit qu'**à
moitié** (`RECUPERATION_HORS_MOMENT = 0.5`). Le verre redescend doucement au
lieu de se vider d'un coup.

### Déterminisme

Le niveau à l'instant `t` est une fonction pure des moments notés, intégrée par
segments à taux constant. Rembobiner, sauter dans la frise ou refaire une prise
donne toujours exactement le même verre — indispensable quand on recommence une
prise pour la vidéo.

---

## 4. Données

- La vidéo est lue **localement** (object URL) : rien ne part sur le réseau.
- Le découpage est sauvegardé dans le navigateur, indexé par nom de fichier +
  durée (`leverre:analyse-rapide:<fichier>:<durée>`).
- « Exporter » produit un JSON avec les moments, leurs notations détaillées et
  les 5 scores calculés.

---

## 5. Vérifier que le moteur est juste

`npm run dev` puis `/dev/analyse-rapide` : 29 cas de bornes (poids des 4 cases,
neutralisation de l'orage, inversion Paille/Verre, durées de calibration, effet
de la projection, clamps 0/100, cohérence courbe ↔ verre).
