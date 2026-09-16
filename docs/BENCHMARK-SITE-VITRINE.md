# Benchmark du site vitrine — LeVerre Labs

**Date de l'audit :** septembre 2026 · **Périmètre :** pages publiques (`/`, `/fondements`,
`/statistiques`, `/recherche-scientifique`, `/collaborer`, `/session`) · **Version analysée :**
`master` (commit `1346aa0`) et le site en ligne `https://leverre-labs.com`.

Ce document répond à une question simple : **le site donne-t-il l'impression d'une entreprise
qui vend une prestation, ou d'un projet personnel bien réalisé ?**

---

## 1. Verdict en une page

> **Aujourd'hui, le site est une très belle démonstration de produit, pas un site de service.**
> Un visiteur peut comprendre le modèle du verre, jouer avec, lire des statistiques nationales —
> mais il ne peut ni savoir ce que vous vendez, ni combien ça coûte, ni comment vous êtes joignable
> autrement que par une adresse Gmail. Le travail à faire n'est pas un redesign : le design est déjà
> au-dessus de la moyenne du secteur. **Ce qui manque, c'est la couche commerciale et la couche de
> confiance.**

### Note globale : **2,4 / 5** en tant que site professionnel de prestation

| Critère | Note | En une phrase |
|---|---|---|
| Qualité graphique et soin | **4,5 / 5** | Très au-dessus des concurrents du secteur : sombre, cohérent, animations maîtrisées. |
| Clarté de l'offre | **1,5 / 5** | On comprend le sujet (les TMS) mais jamais la prestation vendue. |
| Parcours de conversion | **1 / 5** | Un seul point de contact sur tout le site : un `mailto:` vers une adresse Gmail. |
| Crédibilité / preuve | **2 / 5** | Bonne caution scientifique, aucune preuve commerciale (client, certification, chiffre). |
| Conformité légale | **0 / 5** | Ni mentions légales, ni politique de confidentialité, ni information sur l'entité. |
| Contenu et SEO | **3,5 / 5** | Contenu riche et bien balisé, mais organisé par « thème », jamais par « besoin client ». |
| Performance | **1,5 / 5** | **54 Mo téléchargés** sur la page d'accueil (vidéo de 28,7 Mo, chargée deux fois). |
| Accessibilité | **1,5 / 5** | La page d'accueil est **impossible à parcourir au clavier**. |
| Expérience mobile | **2,5 / 5** | Mise en page correcte, mais page d'accueil de 16 500 px et 28 Mo de vidéo en 4G. |

---

## 2. Comment cet audit a été fait

Rien ici n'est une impression : tout a été mesuré sur le site réellement construit.

| Vérification | Outil / méthode |
|---|---|
| Rendu des 6 pages publiques, desktop (1440×900) et mobile (390×844) | Navigation automatisée + captures d'écran |
| Poids réseau, temps de chargement, LCP | Build de production (`next build` + `next start`) mesuré depuis un profil mobile |
| Navigation clavier, `prefers-reduced-motion`, structure des titres | Script d'audit exécuté dans la page |
| Inventaire du contenu, des CTA, des pages légales | Lecture systématique du code des pages vitrine |
| Comparaison concurrentielle | Capture et analyse automatisée de 5 sites du secteur |
| État réel en ligne | Requêtes HTTP directes sur `leverre-labs.com` |

---

## 3. Les 10 signaux qui font « projet » et non « entreprise »

Classés par impact sur la crédibilité, du plus grave au plus léger.

### 3.1 — Le seul moyen de vous contacter est une adresse Gmail

Sur tout le site, il y a exactement **un** point de contact : `leverrelabs@gmail.com`, en lien
`mailto:` dans le pied de page et sur `/collaborer`. Pas de formulaire, pas de téléphone, pas
d'adresse professionnelle sur le domaine (`contact@leverre-labs.com`).

Pour un responsable QHSE ou un DRH qui doit justifier un achat en interne, une adresse Gmail est
un signal de risque : *« c'est quelqu'un tout seul, pas une structure. »* Aucun des cinq concurrents
analysés n'utilise d'adresse grand public : tous communiquent sur leur propre domaine, et quatre
sur cinq proposent une page contact avec formulaire (14 à 18 champs chez My Ostéo Prévention,
OFSP et Atout Synergia).

### 3.2 — Aucune mention légale, aucune politique de confidentialité

Les URL `/mentions-legales`, `/contact`, `/tarifs` répondent **404** en production. Aucune page ne
mentionne l'entité juridique, le SIRET, le directeur de publication, l'hébergeur.

C'est à la fois un signal d'amateurisme **et** une obligation légale non remplie (loi pour la
confiance dans l'économie numérique, article 6-III). Les 5 concurrents analysés ont tous des
mentions légales. Comme le site collecte des données en session de formation via Supabase, une
politique de confidentialité RGPD est également attendue.

### 3.3 — Le premier écran ne vend rien

Le visiteur qui arrive voit : le nom « LeVerre Labs », la phrase *« Une approche visuelle des
risques au travail »*, et l'instruction *« Faites défiler pour découvrir notre solution »*. Il n'y
a **aucun bouton**, aucune indication de ce que vous proposez, ni à qui.

Chez les concurrents, le même écran contient systématiquement quatre éléments : ce qui est vendu,
pour qui, une preuve, et deux boutons d'action. Exemple mesuré chez My Ostéo Prévention :
« Formation TMS en entreprise » + badge « Organisme certifié Qualiopi » + « Demander un devis » +
« Découvrir le programme ».

### 3.4 — Le mot « formation » n'apparaît nulle part dans la navigation

Le menu est : Accueil · Fondements · Ressources · Collaborer · Rejoindre une session. C'est un menu
de **documentation de projet**. Un menu de site de service ressemblerait plutôt à : Nos formations ·
Notre méthode · Ressources · Références · Contact.

« Collaborer » en particulier s'adresse à des pairs (chercheurs, ergonomes) et non à des clients.
La page est belle — un radar interactif des disciplines — mais elle occupe la place qu'occuperait
une page « Contact » sur un site commercial.

### 3.5 — Aucune preuve commerciale

Inventaire de ce qui est absent : logo client, témoignage, nombre d'entreprises accompagnées,
nombre de participants formés, certification Qualiopi, habilitation INRS, statut IPRP, secteurs
d'intervention, zone géographique.

Ce qui est présent en revanche est précieux et sous-exploité : le poster ModACT 2026 distingué
« meilleur poster scientifique », et la console de statistiques CNAM. Ce sont de vraies preuves,
mais elles sont rangées dans un menu « Ressources » au lieu d'être mises en avant.

### 3.6 — « Développé avec ❤️ » dans le pied de page

Cette mention (`src/components/layout/footer.tsx`) est typique d'un portfolio de développeur. Sur un
site qui vend une prestation aux entreprises, c'est la ligne qui devrait accueillir le statut
juridique, le numéro de déclaration d'activité ou un lien vers les mentions légales.

### 3.7 — Des pages internes accessibles publiquement

`https://leverre-labs.com/dev/owas` répond **200** et affiche un outil de test interne. Idem pour
`/sandbox`. Ces pages sont exclues du `robots.txt` — donc invisibles pour Google — mais restent
accessibles à quiconque tape l'adresse, et à quiconque explore le site un peu sérieusement.

### 3.8 — Des fichiers de travail publiés avec le site

Le dossier `public/photo video/` (avec un espace dans le nom, ce qui produit des URL du type
`/photo%20video/...`) contient des fichiers bruts non destinés au web : `logo noir.png` (1,2 Mo),
`1er model` (5,4 Mo, sans extension), `Soumission ModACT- Final - Relot Thomas.pdf`,
`Recordtest.m4a`, `Capture.JPG`, `videoframe_25199.png`. Tout cela est téléchargeable publiquement.

### 3.9 — La page d'accueil pèse 54 Mo

Mesure faite sur le build de production, profil mobile :

```
===== /
requêtes: 25 | poids annoncé total: 54599 Ko | load: 1863 ms
top ressources:
  28027 Ko  /photo%20video/Vidéo pres.mp4?v=3
  25627 Ko  /photo%20video/Vidéo pres.mp4?v=3
   688 Ko  /photo%20video/TMSsht-1-1372841116.jpg
```

La vidéo de présentation fait **28,7 Mo** (41 s, 5,5 Mbit/s), elle est déclarée en `preload="auto"`
et `autoPlay`, et le navigateur la télécharge **deux fois** (requête initiale puis requête de plage).
En production elle est servie avec `cache-control: max-age=0, must-revalidate`.

Concrètement : un visiteur en 4G attend environ 45 secondes et consomme 54 Mo de forfait pour voir
une page d'accueil. Les autres pages sont exemplaires en comparaison (104 Ko chacune) — le problème
est entièrement concentré sur la vidéo du premier écran.

### 3.10 — La page d'accueil est inutilisable au clavier

Le composant `scroll-expansion-hero.tsx` intercepte la molette (`preventDefault` sur `wheel`) et
remet la page en haut à chaque tentative de défilement (`window.scrollTo(0, 0)`). Résultat mesuré :

```
CLAVIER accueil : scrollY après 12x PageDown = 0 | après 20x ArrowDown = 0 | après End = 0
REDUCED-MOTION : état vidéo hero = {"paused":false,"preload":"auto","autoplay":true}
```

Un visiteur qui navigue au clavier — y compris un lecteur d'écran — **reste bloqué sur le premier
écran**. C'est un manquement au critère 2.1.1 du RGAA/WCAG (tout contenu accessible au clavier).
De plus, le réglage système « réduire les animations » est ignoré : la vidéo démarre quand même.

Deux points annexes relevés au passage : la page contient **quatre `<h2>` avant son `<h1>`** (le
titre principal n'arrive qu'en 11ᵉ position dans l'ordre du document), et il n'y a pas de lien
d'évitement vers le contenu.

---

## 4. Ce que le site fait déjà mieux que les concurrents

Il serait injuste de ne lister que les manques. Trois atouts réels, que la version commerciale
devra impérativement conserver :

1. **Le niveau graphique.** Les cinq sites concurrents analysés sont des sites WordPress classiques.
   LeVerre Labs est visuellement d'un autre niveau. C'est un avantage de différenciation immédiat,
   à condition de le mettre au service d'un message commercial.
2. **L'outil interactif.** Personne dans le secteur ne propose une maquette manipulable en ligne.
   C'est un argument de vente en soi (« essayez le modèle avant de nous appeler ») et actuellement
   il n'est pas présenté comme tel.
3. **La caution scientifique et les données publiques.** Les références bibliographiques des
   sections du modèle, le poster ModACT 2026 primé et la console statistique CNAM constituent une
   crédibilité que les concurrents remplacent par des logos de certification. C'est un
   positionnement plus solide — encore faut-il le revendiquer explicitement.

---

## 5. Benchmark concurrentiel

Cinq sites du secteur analysés automatiquement (page d'entrée sur le sujet TMS), septembre 2026.

| | **LeVerre Labs** | My Ostéo Prévention | OFSP | ULTEAM | Moovency | Atout Synergia |
|---|---|---|---|---|---|---|
| Nature | Outil + formation | Organisme de formation | Organisme de formation | Prestataire santé au travail | Éditeur logiciel + ergonomes | Organisme de formation |
| H1 orienté offre | ❌ « Prévention des TMS : rendre visibles les facteurs de risque » | ✅ « Formation TMS en entreprise » | ✅ « Formation Gestes et Postures — Prévention TMS » | ✅ « Prévention TMS & santé physique au travail » | ⚠️ « Kimea » | ✅ Liste des formations |
| CTA commercial | ❌ aucun | ✅ 9 (devis, programme, contact) | ✅ 5 (devis, programmes PDF) | ✅ 6 (devis en ligne, contact) | ✅ 3 (contact) | ⚠️ 2 (email, contact) |
| Téléphone affiché | ❌ | ⚠️ non vérifié | ⚠️ non vérifié | ⚠️ non vérifié | ✅ 09 72 16 89 45 | ✅ 04 73 69 11 09 |
| Email sur domaine propre | ❌ Gmail | ✅ | ✅ | ✅ | ✅ | ✅ |
| Page contact avec formulaire | ❌ | ✅ 18 champs | ✅ 14 champs | ✅ devis en ligne | ⚠️ coordonnées seules | ✅ 15 champs |
| Mentions légales | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Politique de confidentialité | ❌ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |
| Preuves affichées | ⚠️ poster scientifique | ✅ Qualiopi, IPRP, INRS, 600 entreprises | ✅ Qualiopi n°04088, INRS | ✅ +450 entreprises, INRS | ✅ ergonomes IPRP, cas clients | ✅ habilité INRS |
| Témoignages / cas clients | ❌ | ✅ | ⚠️ | ✅ | ✅ (PDF de cas d'usage) | ⚠️ |
| Description d'offres nommées | ❌ | ✅ 3 formats | ✅ 2 programmes | ✅ 3 offres | ✅ KIMEA Start / Cloud / App / Lite | ✅ PRAP, SST, Personne ressource TMS |
| Blog / ressources SEO | ⚠️ 2 pages ressources | ✅ blog | ✅ fiches | ✅ ressources | ✅ cas clients | ⚠️ |
| Qualité graphique | ✅✅ nettement supérieure | ⚠️ standard | ⚠️ standard | ✅ soignée | ✅ soignée | ❌ datée |

**Lecture du tableau :** LeVerre Labs gagne sur le seul critère esthétique et perd sur les onze
critères commerciaux. Le point commun de tous les concurrents, y compris le plus modeste : un
visiteur sait en 10 secondes ce qu'on lui vend et comment demander un devis.

### Les trois modèles possibles

Le secteur se répartit en trois archétypes. Le choix détermine tout le reste du site.

| Modèle | Exemple | Ce qui est vendu | Ce que le site doit contenir |
|---|---|---|---|
| **Organisme de formation** | My Ostéo Prévention, OFSP | Des jours de formation en intra | Catalogue de formations, programme téléchargeable, Qualiopi, financement OPCO, devis |
| **Éditeur de logiciel** | Moovency (KIMEA) | Des licences + accompagnement | Pages produit par module, offres nommées, tarif ou « demander une démo », cas clients |
| **Cabinet de conseil** | Atout Synergia | Des missions d'ergonomie | Méthodologie, références, expertise du consultant, prise de rendez-vous |

LeVerre Labs est aujourd'hui **à cheval sur les trois** sans en assumer aucun. C'est la décision
n°1 à prendre avant d'écrire la moindre ligne du futur site.

---

## 6. Ce que le visiteur cherche et ne trouve pas

Parcours reconstitué d'un responsable QHSE qui arrive sur le site depuis Google.

| Sa question | Réponse sur le site | Où elle devrait être |
|---|---|---|
| « Qu'est-ce que vous vendez ? » | Introuvable | Titre de la page d'accueil |
| « C'est pour mon entreprise ? » | Déductible, jamais dit | Page d'accueil, section secteurs |
| « À quoi ressemble une séance ? » | Introuvable (la vidéo montre l'outil, pas la prestation) | Page « Nos formations » : durée, format, effectif, déroulé |
| « Combien ça coûte ? » | Introuvable | Page tarifs, ou « à partir de X € / journée », ou « devis sous 48 h » |
| « C'est finançable OPCO ? » | Introuvable | Argument majeur du secteur, absent |
| « Qui êtes-vous ? » | Le fondateur n'est nommé que dans le code (JSON-LD) | Page « À propos » avec photo, parcours, qualifications |
| « D'autres l'ont fait ? » | Introuvable | Références, témoignages, chiffres |
| « Comment je vous joins ? » | Un `mailto:` Gmail | Formulaire + téléphone + email professionnel |

Huit questions d'achat, **une seule** obtient une réponse — et la moins rassurante.

---

## 7. Diagnostic technique complet

### Performance (mesurée sur build de production, profil mobile)

| Page | Requêtes | Poids | Chargement |
|---|---|---|---|
| `/` | 25 | **54 599 Ko** | 1 863 ms (en local ; ≈ 45 s en 4G réelle) |
| `/fondements` | 22 | 104 Ko | 182 ms |
| `/statistiques` | 19 | 104 Ko | 436 ms |
| `/collaborer` | 16 | 104 Ko | 218 ms |
| `/recherche-scientifique` | 16 | 104 Ko | 170 ms |

Poids du JavaScript au premier chargement : 211 Ko sur `/`, 283 Ko sur `/statistiques`. C'est
acceptable ; le sujet est uniquement la vidéo.

**Trois corrections à faire sur la vidéo**, par ordre d'efficacité :

1. Recompresser en 1080p H.264 + version WebM, cible **2 à 4 Mo** au lieu de 28,7 Mo (gain ≈ 90 %).
2. Passer de `preload="auto"` à `preload="none"` avec l'image poster affichée immédiatement : la
   vidéo ne se charge que si le visiteur reste.
3. Servir la vidéo depuis un hébergement média (Vercel Blob, Mux, Cloudflare Stream) plutôt que
   depuis `public/`, pour bénéficier du streaming adaptatif et d'un cache long.

### Accessibilité

| Point | État |
|---|---|
| Navigation clavier sur `/` | ❌ **bloquée** (PageDown, flèches et End sans effet) |
| `prefers-reduced-motion` | ❌ ignoré (vidéo `autoPlay`, 87 éléments animés) |
| Ordre des titres | ❌ 4 `<h2>` avant le `<h1>` |
| Lien d'évitement | ❌ absent |
| Attributs `alt` sur les images | ✅ tous présents |
| Boutons et liens nommés | ✅ aucun élément sans nom accessible |
| `lang="fr"` | ✅ |

L'accessibilité n'est pas un détail de confort ici : les entreprises publiques et les grands comptes
demandent de plus en plus une déclaration de conformité RGAA à leurs prestataires.

### SEO

Ce qui est déjà bien fait : `sitemap.xml` et `robots.txt` générés, titres et descriptions uniques
par page, Open Graph et Twitter Card, JSON-LD `Organization` + `WebSite` + `FAQPage`, URL canoniques,
redirection 301 de `/vitrine` vers `/`.

Ce qui manque du point de vue commercial : aucune page ne cible une requête d'achat. Les visiteurs
qui tapent « formation TMS entreprise », « formation gestes et postures Lyon », « sensibilisation
TMS intra », « prévention TMS financement OPCO » n'ont **aucune page à atteindre**. Le site est
optimisé pour des requêtes de compréhension (« qu'est-ce qu'un TMS »), pas d'intention d'achat.

Manquent également : `LocalBusiness` ou `Course` en JSON-LD, page par secteur d'activité, page par
zone géographique, avis structurés.

---

## 8. Plan d'évolution vers un site professionnel

Trois étapes, de la plus rentable à la plus ambitieuse. Chaque étape est utile même si les
suivantes n'arrivent jamais.

### Étape 1 — Rendre le site vendable et conforme

*Aucune refonte graphique. On ajoute ce qui manque, on ne touche pas à ce qui existe.*

1. **Décider du modèle économique** (formation / logiciel / conseil — voir §5). Tout découle de là.
2. **Créer une page `/contact`** avec un vrai formulaire (nom, entreprise, effectif concerné,
   besoin, email professionnel, téléphone) et une promesse de délai de réponse.
3. **Basculer l'email** vers `contact@leverre-labs.com` et retirer l'adresse Gmail du site.
4. **Créer `/mentions-legales` et `/politique-de-confidentialite`**, avec liens dans le pied de page.
5. **Ajouter des CTA** : un bouton permanent dans la barre de navigation, un dans le premier écran,
   un en fin de page d'accueil.
6. **Réécrire le premier écran** pour qu'il dise en une phrase ce que vous vendez et à qui, avec
   deux boutons (action principale + action secondaire).
7. **Compresser la vidéo** et passer en `preload="none"`.
8. **Réparer la navigation clavier** du hero et respecter `prefers-reduced-motion`.
9. **Nettoyer** : supprimer « Développé avec ❤️ », protéger ou supprimer `/dev/owas`, sortir les
   fichiers de travail de `public/`, renommer `photo video` en `medias`.

### Étape 2 — Construire l'argumentaire commercial

*C'est surtout un travail de rédaction, pas de code.*

1. **Page `/formations`** (ou `/solutions`) : une fiche par prestation avec objectifs, public visé,
   durée, effectif, déroulé, modalités, tarif ou fourchette, programme téléchargeable en PDF.
2. **Page `/a-propos`** : qui est derrière le projet, parcours, qualifications, photo. Un visage
   vaut dix paragraphes de crédibilité quand on est une petite structure.
3. **Page `/references`** : premières entreprises accompagnées, verbatims, chiffres (nombre de
   participants, de sessions, taux de satisfaction). Même trois références valent mieux que zéro.
4. **Remonter les preuves existantes** : le poster ModACT primé mérite le premier écran, pas une
   sous-page de menu.
5. **Repositionner `/collaborer`** comme une page secondaire « Recherche & partenariats »,
   distincte du contact commercial.
6. **Restructurer la navigation** autour du client : Formations · Méthode · Ressources · Références ·
   Contact, avec « Rejoindre une session » traité comme un lien utilitaire discret.
7. **Transformer l'outil interactif en argument** : une page « Essayer le modèle » avec un CTA
   « organiser une session dans mon entreprise » à la sortie.

### Étape 3 — Faire venir les clients

1. **Pages d'atterrissage par intention** : « formation TMS en entreprise », « sensibilisation TMS
   collective », « formation gestes et postures », une page par secteur (industrie, logistique,
   médico-social), une page par zone géographique si vous intervenez localement.
2. **Financement** : page dédiée OPCO / Qualiopi si vous obtenez la certification. C'est
   l'argument le plus recherché du secteur.
3. **Contenu régulier** : articles appuyés sur la console statistique CNAM, qui est un actif unique
   et renouvelable chaque année.
4. **Mesure** : analytics respectueux de la vie privée (Vercel Analytics, Plausible), suivi des
   demandes de contact, et un vrai objectif chiffré de conversion.
5. **Preuve sociale continue** : collecter un témoignage après chaque session, publier les logos
   avec accord écrit.

### Arborescence cible

```
/                         Accueil vendeur : offre, preuve, CTA, démo du modèle
/formations               Catalogue des prestations
  /formations/[nom]       Fiche détaillée par prestation
/methode                  Le modèle du verre expliqué (contenu actuel de l'accueil)
/a-propos                 L'entité, le fondateur, la démarche
/references               Clients, témoignages, chiffres
/ressources               Statistiques CNAM, recherche scientifique, articles
/contact                  Formulaire + coordonnées professionnelles
/mentions-legales         Obligatoire
/politique-de-confidentialite  Obligatoire (RGPD, Supabase)
/session                  Utilitaire participant (inchangé)
/espace-formateur         Privé (inchangé)
```

---

## 9. Checklist de suivi

**Conformité (bloquant)**

- [ ] Page mentions légales publiée et liée dans le pied de page
- [ ] Page politique de confidentialité (traitement Supabase des données de session)
- [ ] Entité juridique et responsable de publication identifiés
- [ ] Bandeau cookies si des outils de mesure sont ajoutés

**Conversion**

- [ ] Premier écran : offre + destinataire + preuve + 2 boutons
- [ ] Page contact avec formulaire
- [ ] Email sur le domaine, Gmail retiré
- [ ] Téléphone ou créneau de rendez-vous en ligne
- [ ] CTA permanent dans la barre de navigation
- [ ] Au moins une page décrivant une prestation vendable

**Crédibilité**

- [ ] Page « À propos » avec le fondateur
- [ ] 3 références ou témoignages
- [ ] Preuves remontées en page d'accueil (ModACT, références bibliographiques)
- [ ] « Développé avec ❤️ » remplacé par une information de structure

**Technique**

- [ ] Vidéo d'accueil sous 4 Mo, `preload="none"`
- [ ] Navigation clavier fonctionnelle sur l'accueil
- [ ] `prefers-reduced-motion` respecté
- [ ] `<h1>` en tête du document, hiérarchie des titres corrigée
- [ ] `/dev/owas` protégé ou supprimé
- [ ] `public/photo video/` nettoyé et renommé

---

## 10. Annexes — mesures brutes

### Poids de la page d'accueil

```
===== /
requêtes: 25 | poids annoncé total: 54599 Ko | load: 1863 ms
vitals: {"domContentLoaded":99,"fcp":204,"lcp":204}
par type: font/woff2=47Ko image/jpeg=688Ko image/png=55Ko video/mp4=53681Ko image/avif=127Ko
```

### Navigation clavier et animations

```
CLAVIER accueil : scrollY après 12x PageDown = 0 | après 20x ArrowDown = 0 | après End = 0
REDUCED-MOTION : état vidéo hero = {"paused":false,"preload":"auto","autoplay":true}
```

### Ordre des titres de la page d'accueil

```
H2: LeVerre · H2: Labs · H2: Comprendre pour transformer · H2: Une approche complète
H3: Sensibiliser … H3: Adapter
H1: Prévention des TMS : rendre visibles les facteurs de risque au travail   ← 11ᵉ titre
H2: Le Verre … H2: Questions fréquentes sur la prévention des TMS
```

### État des routes en production

```
/dev/owas           -> 200   (outil interne accessible publiquement)
/sandbox            -> 200
/espace-formateur   -> 200   (protégé par mot de passe)
/mentions-legales   -> 404
/contact            -> 404
/tarifs             -> 404
/formations         -> 404
```

### Vidéo d'accueil en production

```
content-type: video/mp4
content-length: 28699736        (28,7 Mo)
cache-control: public, max-age=0, must-revalidate
durée: 41,8 s · débit: 5,5 Mbit/s
```
