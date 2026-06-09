# Audit des répartitions dans les PDFs Assurance Maladie

> Document préparatoire à l'extension du parser pour les répartitions
> détaillées (au-delà des scalaires AT/TJ/MP déjà extraits).
> Basé sur l'analyse des PDFs 2015, 2018 et 2024.

---

## 1. Structure générale d'un PDF AM

Le PDF est organisé par CTN (« tous » + 9 CTN A à I). Chaque CTN contient
**4 fiches successives** :

```
CTN tous → SYNTHESE → AT → TJ → MP
CTN A    → SYNTHESE → AT → TJ → MP
CTN B    → SYNTHESE → AT → TJ → MP
... (jusqu'à CTN I)
```

Soit **40 fiches** au total par PDF. Chaque fiche est marquée en haut par
un titre du type `SYNTHESE ANNEE 2024` ou `ACCIDENTS DU TRAVAIL ANNEE 2024`.

> **Layout 2 colonnes** : la mise en page PDF présente 2 sections côte à
> côte sur la même page. Le texte extrait par `pdf-parse` interleave les
> lignes des 2 colonnes. Cela impacte directement le parsing.

---

## 2. Sections REPARTITION par type de fiche

### Fiche **SYNTHESE** (déjà partiellement extraite)

10-11 sections présentes (en pourcentages sur les graphiques) :

| Section                                | Libellés (exemples)                                |
| -------------------------------------- | -------------------------------------------------- |
| L'AGE DE LA VICTIME                    | 10 tranches (Moins de 20, 20-24...65+)             |
| LE SEXE DE LA VICTIME                  | Masculin, Féminin                                  |
| LA QUALIFICATION PROFESSIONNELLE       | Cadres, Employés, Ouvriers...                      |
| LE TYPE DE LIEU DE L'ACCIDENT          | Lieu d'activité tertiaire, Chantier...             |
| LA DEVIATION                           | Pertes de contrôle, Glissade...                    |
| L'AGENT MATERIEL DE LA DEVIATION       | Bâtiments, Outils à main...                        |
| LA NATURE DES LESIONS                  | Plaies, Fractures, Contusions...                   |
| L'ACTIVITE PHYSIQUE SPECIFIQUE         | Manipulation d'objets, Opération de machine...     |
| LE SIEGE DES LESIONS                   | Tête, Membres supérieurs, Dos...                   |
| LA MODALITE DE LA BLESSURE             | Chocs traumatiques, Contraintes physiques...       |
| LE LIEU DE L'ACCIDENT                  | (Synthèse 2024 uniquement)                         |

Format : valeurs en **pourcentages** sur les graphiques + données brutes
sur le tableau de droite. Les 3 répartitions « clé » (risque, siège,
nature) en % sont **déjà extraites** dans `repartitionsSynthese`.

### Fiche **ACCIDENTS DU TRAVAIL** (AT)

8 sections détaillées (en valeurs absolues, 4 colonnes) :

| Section                          | Stable 2015→2024 | Nb lignes typique |
| -------------------------------- | ---------------- | ----------------- |
| L'AGE DE LA VICTIME              | ✅                | 10                |
| LE SEXE DE LA VICTIME            | ✅                | 2                 |
| LA QUALIFICATION PROFESSIONNELLE | ✅                | 8 + Non codés     |
| LA DEVIATION                     | ✅                | 9 + Non codés     |
| L'AGENT MATERIEL DE LA DEVIATION | ✅                | ~15-20            |
| LA NATURE DES LESIONS            | ✅                | ~20               |
| L'ACTIVITE PHYSIQUE SPECIFIQUE   | ✅                | ~10               |
| LA MODALITE DE LA BLESSURE       | ✅                | ~10-15            |

Format de chaque ligne :
`{N°} {Libellé} {nb 1er règlement} {nb IP} {nb décès} {nb journées perdues}`

Exemple (2015 fiche AT tous CTN, section AGE) :

```
1 Non précisé             0       0    0          0
2 Moins de 20 ans         6 076   181  21         266 002
3 de 20 à 24 ans          12 921  499  27         612 869
... etc
```

### Fiche **ACCIDENTS DE TRAJET** (TJ)

Sections différentes de la fiche AT :

| Section                          | Détail                                |
| -------------------------------- | ------------------------------------- |
| L'AGE DE LA VICTIME              | Identique AT (10 tranches)            |
| LE SEXE DE LA VICTIME            | Identique AT                          |
| **REPARTITION SELON LA PROFESSION** | ≠ qualification AT (Agriculteurs, Artisans, Cadres, Employés, Conducteurs...) |
| **REPARTITION SUIVANT LA DUREE D'EXPOSITION** | Spécifique TJ : Non précisé, < 1 an, 1-4 ans, 5-9 ans, 10+ ans |
| LA NATURE DES LESIONS            | Présent en 2015, à confirmer 2024     |
| LE SIEGE DES LESIONS             | Présent en 2015, à confirmer 2024     |
| Autres                           | À explorer                            |

> **Note** : mon audit initial n'a détecté que 2 sections en fiche TJ,
> mais c'est dû à un bug de ma regex (les sections « SELON LA PROFESSION »
> et « SUIVANT LA DUREE D'EXPOSITION » utilisent un autre format que mon
> filtre). Elles existent bien (vérifié manuellement).

### Fiche **MALADIES PROFESSIONNELLES** (MP)

> ⚠ **IMPORTANT** : la fiche MP **NE CONTIENT PAS de tableaux
> démographiques** (age/sexe/qualification) au sens des fiches AT/TJ.

Contenu réel d'une fiche MP :

| Section                                | Statut extraction       |
| -------------------------------------- | ----------------------- |
| Total TMS (avec 1er règl.)             | ✅ Déjà extrait (`focusTms.totalTms`) |
| TMS par syndrome (épaule, dos...)      | ❌ Pas encore extrait, format complexe |
| Top MP (avec %, évolution)             | ✅ Déjà extrait (`topMp`) |
| Focus 057A "Affections périarticulaires" | Sous-table dans top MP |
| Liste exhaustive des codes MP avec valeurs | ❌ Pas encore extrait, ~40 lignes |

**Si on veut des répartitions par age/sexe/profession pour les MP**, il
faut chercher si l'AM publie ces données dans un autre document que le
PDF annuel principal (par exemple un fichier Excel ou un autre rapport
détaillé).

---

## 3. Difficulté de parsing (layout 2 colonnes)

Les sections d'une même fiche sont **présentées côte à côte** sur la
page PDF. Le texte extrait alterne donc les lignes des 2 colonnes :

```
Section gauche (AGE)              Section droite (SIEGE LESIONS)
1 Non précisé      0  0  0  0     1 Localisation non déterminée    2 594 196 255 370 358
2 Moins de 20 ans  ...             2 Tête                          ...
```

→ Dans le texte extrait :

```
1 Non précisé 0 0 0 0 1 Localisation non déterminée 2 594 196 255 370 358 2 Moins de 20 ans 7 069 138 21 307 352 2 Tête 3 515 220 6 260 214 ...
```

### Conséquences

1. **Ambiguïté de découpage des nombres** : `7 069 138` peut être lu
   comme `7 069` + `138` ou comme `7 069 138` (un seul nombre). Le
   regex glouton se trompe.
2. **Solution** : utiliser le **catalogue de libellés connus** par
   section + une approche par paires de libellés successifs (les bornes
   donnent le découpage exact).

---

## 4. Catalogue de libellés (à valider)

### Section AGE (fiches AT et TJ)

```
Non précisé
Moins de 20 ans
de 20 à 24 ans
de 25 à 29 ans
de 30 à 34 ans
de 35 à 39 ans
de 40 à 49 ans
de 50 à 59 ans
de 60 à 64 ans
65 ans et plus
```

### Section SEXE (fiches AT et TJ)

```
Masculin
Féminin
```

### Section QUALIFICATION PROFESSIONNELLE (fiche AT uniquement)

```
Non précisé
Cadres, techniciens, a.m.
Employés
Apprentis
Elèves
Ouvriers non qualifiés
Ouvriers qualifiés
Divers
Non codés
```

### Section PROFESSION (fiche TJ — différent de QUALIFICATION)

```
À confirmer en lisant le PDF :
Agriculteurs
Artisans, commerçants...
Cadres et professions intellectuelles
Professions intermédiaires
Employés
Ouvriers
Conducteurs (?)
... (à compléter)
```

### Sections « techniques » (NATURE / SIEGE / DEVIATION / etc.)

→ Catalogues à constituer en lisant les PDFs (~10-20 libellés par
section). Plus de travail, mais le format est le même.

---

## 5. Plan d'extraction proposé

### Phase 1 — Démographique stricte (fiches AT + TJ)

Extraction de **3 sections** seulement :
- AGE de la victime
- SEXE de la victime
- QUALIFICATION PROFESSIONNELLE (AT) / PROFESSION (TJ)

→ Données disponibles pour 9 années × 10 CTN × 2 fiches (AT et TJ)
   = **180 jeux de données démographiques**.

→ Permet déjà de répondre à : « qui est touché par les AT/TJ ? Hommes
  ou femmes ? Quel âge ? Quel statut ? »

### Phase 2 — Lésions (fiches AT)

- NATURE DES LESIONS
- SIEGE DES LESIONS
- ACTIVITE PHYSIQUE SPECIFIQUE
- MODALITE DE LA BLESSURE

→ Données « risque physique » détaillées.

### Phase 3 — Contexte (fiches AT)

- DEVIATION
- AGENT MATERIEL DE LA DEVIATION
- TYPE DE LIEU / LIEU DE L'ACCIDENT

→ Données utiles mais moins directement liées au métier LeVerre Labs.

### Phase 4 (optionnelle) — MP détaillé

- TMS par syndrome (épaule, coude, main, dos, genou, cheville)
- Liste exhaustive des codes MP

→ Si l'AM publie un format machine (Excel/CSV) à côté du PDF, l'utiliser
  plutôt que de re-parser le PDF.

---

## 6. Validation des données extraites (invariants)

Pour chaque section démographique extraite, on vérifiera que :

- **Somme par catégorie** = total de la fiche (ex: somme des âges =
  nb 1er règlement total).
- **Tolérance** : ±0,5% (arrondis et lignes « Non codés »).

Ces invariants sont automatisables dans `scripts/verifier-coherence.mjs`.
