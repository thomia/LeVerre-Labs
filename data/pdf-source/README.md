# Sources PDF — Statistiques Assurance Maladie

Ce dossier contient les **rapports annuels** de l'Assurance Maladie sur les
**AT/TR/MP par CTN** (Comités Techniques Nationaux), utilisés comme source
de données pour la section `/ressources/statistiques-assurance-maladie`.

## Fichiers attendus

```
2015_at-tr-mp-fiches-selon-ctn.pdf
2016_at-tr-mp-fiches-selon-ctn.pdf
2017_at-tr-mp-fiches-selon-ctn.pdf
2018_at-tr-mp-fiches-selon-ctn.pdf
2019_at-tr-mp-fiches-selon-ctn.pdf
2020_at-tr-mp-fiches-selon-ctn.pdf
2021_at-tr-mp-fiches-selon-ctn.pdf
2023_at-tr-mp-fiches-selon-ctn.pdf       ← pas de fichier 2022 publié par l'AM
2024_at-tr-mp-fiches-selon-ctn.pdf
```

> **Important** : les PDF eux-mêmes sont **gitignorés** (taille totale ~60 Mo).
> Pour les récupérer : aller sur le site `assurance-maladie.ameli.fr`,
> section "Risques professionnels > Statistiques AT/MP > Sinistralité par CTN".

## Workflow d'extraction

1. Les PDF sont placés ici manuellement.
2. Le script `scripts/extract-pdf-text.mjs` génère un `.txt` par PDF (extraction
   du texte brut via `pdf-parse`).
3. Les `.txt` sont également gitignorés (intermédiaires).
4. Les données structurées finales sont dans `src/data/stats-am/<annee>.json`
   (versionnées dans Git, c'est elles qui sont consommées par l'app).

## Pourquoi les PDF ne sont pas versionnés

- Données **publiques** déjà accessibles via l'AM.
- Taille **trop importante** pour Git (~60 Mo).
- Seule la version structurée (JSON) est utile à l'app.
