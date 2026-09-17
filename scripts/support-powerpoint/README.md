# Support PowerPoint — session de sensibilisation

Génère un support de session **autonome**, utilisable sans l'application
LeVerre Labs : ni connexion, ni QR code, ni smartphone, ni installation. Prévu
pour les contextes où l'outil ne peut pas être utilisé (réseau fermé, poste
client verrouillé, politique informatique restrictive).

## Générer le support

```bash
pip install python-pptx Pillow
python3 scripts/support-powerpoint/generer_support.py
```

Le fichier est écrit dans `docs/supports/sensibilisation-tms-charte-cern.pptx`.
Un autre chemin peut être passé en argument.

Pour obtenir une version PDF (projection de secours, sans PowerPoint) :

```bash
soffice --headless --convert-to pdf --outdir docs/supports \
  docs/supports/sensibilisation-tms-charte-cern.pptx
```

## Ce que contient le support

- **47 diapositives** suivant le déroulé de la bible du formateur : ouverture et
  données chiffrées, tâche de référence, les cinq éléments un par un, calcul de
  l'indicateur, leviers d'action, engagements et clôture.
- **Les notes du formateur** sur chaque diapositive, visibles en mode
  présentateur. Elles reprennent les formulations et les points de vigilance de
  la bible.
- **Une fiche participant recto-verso** en annexe, à imprimer. C'est elle qui
  remplace la saisie dans l'application : chaque participant y note ses cinq
  scores et calcule lui-même son temps avant débordement.
- **Un minutage de référence** pour une session de 4 heures.

## Le calcul papier

L'application calcule l'indicateur avec `src/lib/indicateur.ts`. Sur papier, on
garde la même mécanique avec des nombres qui se calculent de tête :

| Élément | Barème papier | Rôle |
|---------|---------------|------|
| Verre   | 30, 40 ou 50  | Capacité avant débordement |
| Robinet | 0 à 10        | Débit de base |
| Bulle   | × 1, × 1,5 ou × 2 | Multiplicateur d'environnement |
| Orage   | + 0 à + 3     | Charge imprévue |
| Paille  | − 0 à − 5     | Récupération |

```
remplissage par heure = (Robinet × Bulle) + Orage − Paille
temps avant débordement = Capacité du verre ÷ remplissage par heure
```

Lecture : plus de 8 h, le verre tient la journée ; entre 4 et 8 h, il déborde
dans la journée ; moins de 4 h, la situation demande un examen sérieux. Si la
paille compense tout, le verre ne déborde pas — c'est un résultat, pas une
erreur de calcul.

## Charte graphique

Le support reprend la charte CERN à partir de ses **sources publiques**
uniquement : la palette officielle du template PowerPoint et les polices
corporate (Arial), documentées sur `design-guidelines.web.cern.ch`.

Le logo CERN et les visuels de l'Organisation ne sont **pas** repris : la
session est animée par un intervenant externe sous sa propre marque. Pour
appliquer le template officiel, ouvrir le `.pptx` dans PowerPoint, puis
`Création > Thèmes > Rechercher les thèmes` et sélectionner le fichier `.potx`
du CERN — la mise en page reste compatible (16:9, Arial, aplats de couleur).

## Organisation des fichiers

| Fichier | Rôle |
|---------|------|
| `charte_cern.py` | Palette, polices, gabarits de base (bandeau, titres, encadrés) |
| `visuels_verre.py` | Dessin des verres et de l'échelle de lecture, en PNG |
| `contenu_ouverture.py` | Phases 0 et 1 — ouverture, chiffres, fiche de route |
| `contenu_elements.py` | Phase 2 — les cinq éléments |
| `contenu_synthese.py` | Phases 3 à 5, fiche participant, minutage, sources |
| `generer_support.py` | Assemblage et mise en page |

Les modules Python sont nommés en `snake_case` : un tiret dans un nom de module
empêcherait l'import. Le dossier, lui, suit la convention `kebab-case` du projet.

## Mettre à jour le contenu

Les textes se modifient dans les trois fichiers `contenu_*.py`, sans toucher à
la mise en page. Chaque diapositive est un dictionnaire : `gabarit` choisit la
mise en page, `notes` alimente le mode présentateur. Les encadrés, les cartes et
la fiche s'adaptent automatiquement à la longueur des textes.
