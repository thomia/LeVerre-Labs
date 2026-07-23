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

Deux méthodes possibles. **La plus simple pour toi dépend de ton adresse de site :**

#### Cas A — Tu utilises l'adresse Vercel par défaut (`leverre-labs.vercel.app`)

Choisis le type de propriété **« Préfixe de l'URL »** et entre l'adresse complète
(`https://leverre-labs.vercel.app`). Puis utilise la méthode de vérification **« Balise HTML »**
(voir étape 2.2). C'est le cas le plus simple ici, car tu ne peux pas modifier le DNS d'un
sous-domaine `.vercel.app`.

#### Cas B — Tu as (ou tu veux) un nom de domaine à toi (ex : `leverre-labs.fr`)

C'est **fortement recommandé** pour la crédibilité et le référencement. Dans ce cas :

1. Achète le domaine (OVH, Gandi, etc.) et branche-le sur Vercel (Project → Settings → Domains).
2. Dans GSC, choisis le type de propriété **« Domaine »** (vérification par DNS) : c'est la
   méthode la plus robuste, elle couvre `http`, `https`, `www` et tous les sous-domaines.
3. Google te donnera un enregistrement **TXT** à ajouter chez ton hébergeur de domaine.
4. **Préviens-moi du nouveau domaine** : je mettrai à jour `NEXT_PUBLIC_SITE_URL` (voir §3) pour
   que le sitemap, les liens canoniques et les cartes de partage pointent vers la bonne adresse.

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
| `NEXT_PUBLIC_SITE_URL` | Adresse canonique du site (sans `/` final). Utilisée par le sitemap, les liens canoniques et les cartes de partage. | Non tant que tu restes sur `leverre-labs.vercel.app` ; **oui** dès que tu as un domaine à toi. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code de vérification GSC (méthode balise HTML). | Uniquement si tu utilises la méthode « Balise HTML ». |

Après toute modification de ces variables, **redéploie** le site.

---

## 4. Bonnes pratiques pour bien se positionner (dans la durée)

Le référencement se gagne surtout par le **contenu** et la **notoriété**, pas seulement la technique :

- **Écris pour tes lecteurs** : des pages claires qui répondent à de vraies questions
  (« qu'est-ce qu'un TMS ? », « comment prévenir les TMS en entreprise ? »).
- **Un nom de domaine à toi** inspire plus confiance qu'une adresse `.vercel.app`.
- **Des liens entrants** : fais parler de LeVerre Labs (articles, réseaux, partenaires,
  publications scientifiques) — chaque lien vers ton site est un vote de confiance pour Google.
- **Google My Business** si tu proposes du conseil/formation localement (Rhône-Alpes).
- **Patience** : un site récent met du temps à gagner en visibilité. Surveille les progrès dans
  l'onglet **« Performances »** de GSC (impressions, clics, requêtes).

---

## 5. Récapitulatif — ta to-do

- [ ] Créer un compte Google Search Console.
- [ ] Ajouter la propriété du site (Domaine si domaine perso, sinon Préfixe de l'URL).
- [ ] Vérifier la propriété (DNS ou balise HTML via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
- [ ] Envoyer le sitemap (`sitemap.xml`).
- [ ] Demander l'indexation des pages clés.
- [ ] (Recommandé) Acheter un nom de domaine et me le communiquer pour mettre à jour `NEXT_PUBLIC_SITE_URL`.
