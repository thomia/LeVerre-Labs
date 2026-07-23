# Guide SEO & Google Search Console — LeVerre Labs

Ce guide explique **ce qui est déjà en place dans le code** et **ce que tu dois faire toi-même**
sur Google pour que le site soit bien référencé. Pas besoin d'être développeur : suis les
étapes dans l'ordre.

---

## 1. Ce qui est déjà fait côté site (rien à faire de ton côté)

Le site envoie déjà à Google tout ce dont il a besoin pour comprendre et indexer les pages :

- **Titres et descriptions** uniques sur chaque page publique (accueil, vitrine, fondements,
  recherche, statistiques, collaborer).
- **`robots.txt`** (adresse : `https://TON-SITE/robots.txt`) : autorise l'indexation des pages
  publiques et bloque les zones privées (sessions de formation, espace formateur, sandbox…).
- **`sitemap.xml`** (adresse : `https://TON-SITE/sitemap.xml`) : la liste des pages à indexer.
  C'est ce fichier que tu vas donner à Google (étape 3).
- **Balises de partage (Open Graph / Twitter)** : jolie carte d'aperçu quand on partage un lien
  sur LinkedIn, WhatsApp, etc.
- **Données structurées (JSON-LD)** : décrivent officiellement la marque « LeVerre Labs » et son
  auteur pour Google.
- **Favicon** : la petite icône dans l'onglet du navigateur.

---

## 2. Ce que tu dois faire côté Google Search Console

Google Search Console (GSC) est l'outil **gratuit** de Google pour suivre comment ton site
apparaît dans les recherches. Adresse : <https://search.google.com/search-console>

### Étape 2.1 — Ajouter ta propriété (= déclarer ton site)

Le site officiel est **`https://leverre-labs.com`** (domaine acheté et géré via Vercel).
Deux méthodes de déclaration possibles :

#### Méthode recommandée — Propriété « Domaine » (vérification DNS)

C'est la plus robuste : elle couvre `http`, `https`, `www` et tous les sous-domaines d'un coup.

1. Dans GSC, choisis le type de propriété **« Domaine »** et entre `leverre-labs.com`.
2. Google te donne un enregistrement **TXT** à ajouter dans le DNS.
3. Comme le domaine est géré par Vercel : va dans **Vercel → ton projet → Settings → Domains →
   `leverre-labs.com`** (ou l'onglet DNS Records du domaine) et ajoute l'enregistrement **TXT**
   fourni par Google.
4. Reviens dans GSC et clique sur **« Vérifier »** (la propagation DNS peut prendre un moment).

#### Méthode alternative — Propriété « Préfixe de l'URL » (balise HTML)

Plus simple si le DNS te rebute :

1. Dans GSC, choisis **« Préfixe de l'URL »** et entre `https://leverre-labs.com`.
2. Utilise la vérification **« Balise HTML »** décrite à l'étape 2.2.

### Étape 2.2 — Vérifier que le site t'appartient (méthode « Balise HTML »)

Si tu es dans le **Cas A** (ou que tu préfères la balise HTML) :

1. Dans GSC, choisis la vérification **« Balise HTML »**.
2. Google affiche une ligne du type :
   `<meta name="google-site-verification" content="XXXXXXXXXXXXXXXX" />`
   **Copie uniquement le code** entre guillemets (la partie `XXXXXXXXXXXXXXXX`).
3. Ajoute-le comme **variable d'environnement** sur Vercel (Project → Settings →
   Environment Variables) :
   - **Name** : `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - **Value** : le code copié
   - Coche les environnements **Production** (et Preview si tu veux).
4. **Redéploie** le site (Vercel → Deployments → Redeploy) pour que la balise soit prise en compte.
5. Reviens dans GSC et clique sur **« Vérifier »**.

> La balise n'apparaît que si la variable est renseignée : tant qu'elle est vide, aucune balise
> parasite n'est ajoutée au site.

### Étape 2.3 — Envoyer le sitemap à Google

Une fois la propriété vérifiée :

1. Dans GSC, menu **« Sitemaps »**.
2. Dans le champ, entre simplement : `sitemap.xml`
3. Clique sur **« Envoyer »**.

Google lira alors la liste de tes pages et commencera à les explorer (cela peut prendre de
quelques jours à quelques semaines).

### Étape 2.4 — Demander l'indexation des pages importantes (accélérateur)

Pour ne pas attendre, tu peux pousser Google manuellement :

1. En haut de GSC, colle l'URL d'une page (ex : `https://TON-SITE/vitrine`) dans la barre
   **« Inspection de l'URL »**.
2. Clique sur **« Demander une indexation »**.
3. Répète pour tes pages clés : `/vitrine`, `/fondements`, `/recherche-scientifique`,
   `/statistiques`, `/collaborer`.

---

## 3. Variables d'environnement liées au SEO

À configurer sur Vercel (Project → Settings → Environment Variables) :

| Variable | À quoi ça sert | Obligatoire ? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Adresse canonique du site (sans `/` final). Utilisée par le sitemap, les liens canoniques et les cartes de partage. | Non : le code utilise déjà `https://leverre-labs.com` par défaut. À définir seulement pour forcer une autre adresse (ex : environnement de preview). |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code de vérification GSC (méthode balise HTML). | Uniquement si tu utilises la méthode « Balise HTML ». |

Après toute modification de ces variables, **redéploie** le site.

---

## 4. Bonnes pratiques pour bien se positionner (dans la durée)

Le référencement se gagne surtout par le **contenu** et la **notoriété**, pas seulement la technique :

- **Écris pour tes lecteurs** : des pages claires qui répondent à de vraies questions
  (« qu'est-ce qu'un TMS ? », « comment prévenir les TMS en entreprise ? »).
- **Ton nom de domaine `leverre-labs.com`** inspire plus confiance qu'une adresse `.vercel.app` :
  pense à l'utiliser partout (signature mail, réseaux, supports de formation).
- **Des liens entrants** : fais parler de LeVerre Labs (articles, réseaux, partenaires,
  publications scientifiques) — chaque lien vers ton site est un vote de confiance pour Google.
- **Google My Business** si tu proposes du conseil/formation localement (Rhône-Alpes).
- **Patience** : un site récent met du temps à gagner en visibilité. Surveille les progrès dans
  l'onglet **« Performances »** de GSC (impressions, clics, requêtes).

---

## 5. Récapitulatif — ta to-do

- [x] Acheter le nom de domaine (`leverre-labs.com`, via Vercel).
- [ ] Vérifier que `https://leverre-labs.com` s'affiche bien (HTTPS actif) et redéployer le site.
- [ ] Créer un compte Google Search Console.
- [ ] Ajouter la propriété `leverre-labs.com` (idéalement type « Domaine » / vérification DNS).
- [ ] Vérifier la propriété (TXT dans le DNS Vercel, ou balise HTML via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
- [ ] Envoyer le sitemap (`sitemap.xml`).
- [ ] Demander l'indexation des pages clés.
