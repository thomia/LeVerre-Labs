"""
Contenu de la phase 2 : la decouverte des cinq elements du modele.

Chaque element suit le meme cycle pedagogique, repris de la bible du formateur :
1. une amorce (on fait deviner les composantes au lieu de les annoncer),
2. la fiche de l'element (ce qu'il represente, de quoi il est fait),
3. la notation sur la fiche papier, avec des reperes concrets.

Les baremes sont volontairement simples : ils doivent se calculer de tete, sans
l'application, tout en conservant la logique de `src/lib/indicateur.ts` — le
robinet donne un debit, la bulle l'amplifie, l'orage ajoute, la paille retire,
et le verre fixe la capacite.
"""

DIAPOS_ELEMENTS = [
    {
        "gabarit": "section",
        "numero": "Phase 2",
        "titre": "Les cinq éléments",
        "sous_titre": "Verre · Robinet · Bulle · Orage · Paille",
        "duree": "2 heures",
        "notes": """
        Cœur de la session. Pour chaque élément : on fait deviner, on structure,
        on note, on débriefe. Ne jamais annoncer les composantes avant que le
        groupe ne les ait nommées lui-même.
        """,
    },
    {
        "gabarit": "modele",
        "titre": "Le modèle en une image",
        "elements": [
            {
                "cle": "robinet",
                "nom": "Le Robinet",
                "role": "Ce que la tâche demande à votre corps et à votre esprit. Il remplit le verre.",
            },
            {
                "cle": "bulle",
                "nom": "La Bulle",
                "role": "L'environnement dans lequel vous travaillez. Il amplifie le débit du robinet.",
            },
            {
                "cle": "orage",
                "nom": "L'Orage",
                "role": "Les imprévus. Ils ajoutent de l'eau qui n'était pas prévue.",
            },
            {
                "cle": "paille",
                "nom": "La Paille",
                "role": "Tout ce qui permet de vider une partie du verre. La seule sortie du système.",
            },
            {
                "cle": "verre",
                "nom": "Le Verre",
                "role": "Votre capacité d'absorption. Elle détermine à partir de quand ça déborde.",
            },
        ],
        "encadre": [
            {"texte": "Un accident ou un TMS n'arrive jamais à cause d'un seul facteur. C'est toujours une combinaison.", "gras": True},
            {"texte": "Cinq éléments, donc cinq portes d'entrée différentes pour agir."},
        ],
        "notes": """
        À placer avant le premier élément. C'est ici qu'on pose la philosophie :

        « Les outils qui existent s'arrêtent souvent à deux ou trois dimensions :
        les postures, les charges, parfois l'environnement. Si on ne voit qu'une
        partie du tableau, on ne peut agir que sur une partie du problème. »

        Certains éléments dépendent du travailleur, d'autres de l'organisation.
        Identifier lesquels, c'est déjà gagner en lucidité.
        """,
    },
    # --- LE VERRE ----------------------------------------------------------
    {
        "gabarit": "question",
        "question": "Trois questions avant de commencer",
        "precision": "Deux personnes du même âge ont-elles les mêmes capacités physiques ?\n"
        "Une ancienne blessure peut-elle encore influencer votre corps aujourd'hui ?\n"
        "Quelqu'un qui fait du sport réagit-il comme une personne sédentaire au même effort ?",
        "couleur": "verre",
        "notes": """
        Ces trois questions suffisent à faire émerger les quatre composantes du
        Verre : âge, antécédents médicaux, condition physique, hygiène de vie.

        Une fois qu'elles ont été nommées par le groupe, résumez : « Vous venez
        d'identifier ce qui définit la taille de votre verre. Maintenant, à vous
        de définir le vôtre. »

        Ton bienveillant et factuel, jamais moralisateur : c'est l'élément le plus
        intime du modèle.
        """,
    },
    {
        "gabarit": "element",
        "cle": "verre",
        "nom": "Le Verre",
        "sous_titre": "Votre capacité d'absorption",
        "definition": "À débit égal, un petit verre déborde plus vite qu'un grand. "
        "Le verre ne dit pas si vous êtes solide ou fragile : il dit combien votre corps peut encaisser avant que le risque augmente.",
        "composantes": [
            "L'âge — le corps récupère moins vite avec le temps",
            "Les antécédents — une zone déjà lésée reste plus sensible",
            "La condition physique — les tissus entraînés encaissent davantage",
            "L'hygiène de vie — sommeil, alimentation, activité physique hors travail",
        ],
        "image": "trois-verres",
        "notes": """
        Insistez sur le fait que plusieurs de ces facteurs sont modifiables : c'est
        ce qui rend l'élément mobilisateur plutôt que fataliste.

        Débrief : « Vos verres ont déjà des tailles différentes. Pour la même tâche,
        certains ont une capacité d'absorption naturellement plus grande. »
        """,
    },
    {
        "gabarit": "notation",
        "cle": "verre",
        "titre": "À vous : la taille de votre verre",
        "intitule": "Partez de 30, et ajoutez 5 pour chaque réponse favorable",
        "baremes": [
            {"note": "+5", "libelle": "Vous avez moins de 45 ans"},
            {"note": "+5", "libelle": "Aucune douleur ni blessure liée au travail depuis 2 ans"},
            {"note": "+5", "libelle": "Vous avez une activité physique régulière"},
            {"note": "+5", "libelle": "Sommeil et alimentation globalement satisfaisants"},
        ],
        "resultat": "Votre capacité : entre 30 (petit verre) et 50 (grand verre)",
        "encadre": [
            {"texte": "Vous démarrez la journée déjà fatigué ou douloureux ? Retirez 10.", "gras": True},
            {"texte": "Un verre ne repart pas toujours de zéro le matin."},
        ],
        "notes": """
        Laissez 2 minutes. Ne commentez pas les résultats individuels à voix haute.

        Si quelqu'un se retrouve à 20 et le prend mal, recadrez : « Ce n'est pas une
        note sur votre personne. C'est une marge de manœuvre. Plus elle est faible,
        plus les autres éléments comptent — et sur ceux-là, on peut agir. »
        """,
    },
    # --- LE ROBINET --------------------------------------------------------
    {
        "gabarit": "question",
        "question": "Qu'est-ce que votre tâche demande concrètement ?",
        "precision": "À votre corps. À votre esprit.\nQu'est-ce qui, dans ce que vous faites, sollicite vos articulations, vos muscles, votre concentration ?",
        "couleur": "robinet",
        "notes": """
        Laissez le groupe répondre librement et notez les mots clés au paperboard.
        Vous verrez émerger les cinq composantes sans avoir à les annoncer :
        charge manipulée, posture, fréquence et durée, demande cognitive,
        pression psychosociale.

        Résumez ensuite : « C'est ce que vous faites, comment, pendant combien de
        temps, et dans quel état cognitif et psychique. »

        C'est l'élément qui prend le plus de temps. C'est normal.
        """,
    },
    {
        "gabarit": "element",
        "cle": "robinet",
        "nom": "Le Robinet",
        "sous_titre": "Ce que la tâche verse dans le verre",
        "definition": "Son débit dépend de l'intensité des sollicitations. "
        "Charge physique et charge mentale sont indissociables : la seconde est aussi déterminante que la première.",
        "composantes": [
            "La charge manipulée — le poids, mais surtout la prise et la distance au corps",
            "La posture — angles articulaires, bras au-dessus des épaules, postures statiques maintenues",
            "La fréquence et la durée — un geste léger répété mille fois pèse plus qu'un effort intense isolé",
            "La demande cognitive — concentration, décisions, mémorisation en cours de tâche",
            "La pression psychosociale — urgence, peur de l'erreur, tension relationnelle",
        ],
        "image": "verre-quart",
        "notes": """
        Charge manipulée : un objet de 10 kg à bout de bras n'a rien à voir avec le
        même objet collé au corps. Si le groupe est technique, appuyez-vous sur les
        seuils de la norme NF X35-109 et demandez : « êtes-vous souvent au-dessus ? »

        Posture : la posture statique maintenue est souvent plus contraignante que
        le mouvement. C'est contre-intuitif, insistez.

        Fréquence : « en pourcentage de votre temps de travail, combien de temps
        êtes-vous en posture contraignante ou en effort ? »

        Pression psychosociale : elle augmente la tension musculaire de base et
        réduit la tolérance à la douleur. L'impact est réel et documenté.
        """,
    },
    {
        "gabarit": "consigne",
        "titre": "Avant de noter : répartissez 100 points",
        "consigne": [
            {"texte": "Répartissez 100 points entre les cinq composantes du Robinet, selon ce qui pèse le plus dans votre tâche.", "gras": True},
            {"texte": "Instinctivement, en deux minutes. Il n'y a pas de bonne réponse."},
        ],
        "liste_simple": [
            "Charge manipulée",
            "Posture",
            "Fréquence et durée",
            "Demande cognitive",
            "Pression psychosociale",
        ],
        "notes": """
        Exercice court mais très rentable. Il force chacun à hiérarchiser, ce qui
        est déjà un acte d'analyse de son propre travail.

        Il révèle des angles morts : beaucoup sous-estiment la part mentale et la
        fréquence, et surestiment la charge brute. Et il crée des écarts surprenants
        entre des personnes qui font pourtant le même métier — excellent matériau
        de débrief. Demandez à deux ou trois personnes de donner leur répartition.
        """,
    },
    {
        "gabarit": "notation",
        "cle": "robinet",
        "titre": "À vous : le débit de votre robinet",
        "intitule": "Notez chaque composante de 0 à 10, puis faites la moyenne des cinq",
        "baremes": [
            {"note": "0 – 3", "libelle": "Sollicitation faible : geste léger, posture confortable, rythme choisi"},
            {"note": "4 – 6", "libelle": "Sollicitation modérée : c'est fatigant, mais ça reste gérable sur la durée"},
            {"note": "7 – 10", "libelle": "Sollicitation forte : effort marqué, posture contraignante, rythme subi"},
        ],
        "resultat": "Votre débit Robinet : une note de 0 à 10",
        "notes": """
        Laissez 5 minutes, c'est l'élément le plus long à renseigner.

        Débrief : « Certains ont un débit très physique, d'autres un débit largement
        mental. Deux personnes peuvent arriver au même niveau de remplissage par des
        chemins complètement différents. »

        C'est à partir d'ici que l'indicateur commence à exister. Demandez à chacun
        de garder sa note sous les yeux : elle va bouger avec les éléments suivants.
        """,
    },
    # --- LA BULLE ----------------------------------------------------------
    {
        "gabarit": "question",
        "question": "Il manque une question essentielle : le où ?",
        "precision": "Même tâche, même posture, même charge — mais à 38 °C.\nVotre corps consomme plus d'énergie, votre concentration baisse plus vite, votre récupération est plus lente.",
        "couleur": "bulle",
        "notes": """
        La canicule est l'exemple le plus parlant, parce que tout le monde l'a vécu.

        Faites ensuite deviner les autres facteurs : bruit, vibrations, éclairage,
        espace exigu, insalubrité, travail de nuit, équipements contraignants.
        Demandez des exemples tirés de leur propre environnement.

        Message central : « La Bulle ne crée pas les contraintes. Elle les amplifie. »
        C'est l'élément qui crée le plus de surprises, parce que l'environnement est
        perçu comme un décor, pas comme une contrainte active.
        """,
    },
    {
        "gabarit": "element",
        "cle": "bulle",
        "nom": "La Bulle",
        "sous_titre": "L'environnement qui amplifie le débit",
        "definition": "La Bulle explique pourquoi deux personnes avec le même Robinet "
        "ne ressentent pas la même chose et n'ont pas le même risque réel.",
        "composantes": [
            "Température — chaud, froid, écarts thermiques",
            "Bruit et vibrations",
            "Éclairage — insuffisant, éblouissant, clignotant",
            "Espace de travail — exigu, encombré, accès difficile",
            "Horaires — nuit, postes alternés, coupures",
            "Matériel et équipements — inadaptés, manquants, contraignants",
        ],
        "image": "verre-moitie",
        "notes": """
        Adaptez aux environnements présents dans la salle : local technique, zone
        d'intervention à accès restreint, atelier, bureau paysager.

        Le passage en EPI est un excellent exemple à faire émerger : la même tâche
        réalisée avec des protections contraignantes n'a pas le même coût pour le
        corps.
        """,
    },
    {
        "gabarit": "notation",
        "cle": "bulle",
        "titre": "À vous : votre multiplicateur d'environnement",
        "intitule": "Comptez les facteurs vraiment dégradés dans votre environnement",
        "baremes": [
            {"note": "× 1", "libelle": "0 ou 1 facteur dégradé — environnement globalement favorable"},
            {"note": "× 1,5", "libelle": "2 ou 3 facteurs dégradés"},
            {"note": "× 2", "libelle": "4 facteurs ou plus — l'environnement pèse lourd"},
        ],
        "resultat": "Votre multiplicateur Bulle : × 1, × 1,5 ou × 2",
        "notes": """
        Débrief : « Pour certains, l'environnement change peu les choses. Pour
        d'autres, c'est le facteur majeur. »

        Faites remarquer que la Bulle est très souvent un levier organisationnel :
        contrairement à la posture, on ne demande pas au travailleur de changer la
        température ou l'éclairage.
        """,
    },
    # --- L'ORAGE -----------------------------------------------------------
    {
        "gabarit": "colonnes",
        "titre": "Travail prescrit et travail réel",
        "couleur": "orage",
        "colonne_gauche": {
            "titre": "Le travail prescrit",
            "lignes": [
                {"texte": "Le chemin idéal"},
                {"texte": "Celui prévu par la procédure, le planning, la fiche de poste"},
                {"texte": "Pas de panne, pas de pièce manquante, pas de collègue absent"},
            ],
        },
        "colonne_droite": {
            "titre": "Le travail réel",
            "lignes": [
                {"texte": "Ce que vous faites vraiment"},
                {"texte": "Avec les pannes, les pièces manquantes, les changements de dernière minute"},
                {"texte": "Souvent en urgence, souvent en fin de poste, quand la marge est déjà fine"},
            ],
        },
        "bas_de_page": "Un imprévu n'est pas seulement une perte de temps : c'est une mobilisation de ressources supplémentaires.",
        "notes": """
        Si vous avez un visuel de parcours d'obstacles, c'est le moment de le
        projeter : le même trajet avec et sans obstacles.

        Demandez ensuite à chacun de cibler deux aléas qui reviennent souvent sur sa
        tâche de référence. Deux, pas plus : on cherche les récurrents, pas
        l'exhaustivité.
        """,
    },
    {
        "gabarit": "element",
        "cle": "orage",
        "nom": "L'Orage",
        "sous_titre": "L'eau qui n'était pas prévue",
        "definition": "L'Orage, ce sont les aléas et les perturbations non planifiées. "
        "Ils ajoutent une charge qui ne figure nulle part dans la description du poste.",
        "composantes": [
            "Pannes et dysfonctionnements matériels",
            "Pièces, outils ou informations manquantes",
            "Changements de dernière minute et urgences",
            "Absences et renforts non prévus",
            "Interruptions — appels, sollicitations, coactivité",
        ],
        "image": "verre-haut",
        "notes": """
        C'est l'élément le plus facile à ancrer : tout le monde a des histoires
        d'imprévus. Laissez-en raconter deux ou trois, pas plus.

        Débrief : « Vous voyez apparaître une source de remplissage qui ne faisait
        pas partie du robinet de base. Ceux dont l'indicateur vient de chuter,
        est-ce que vous voulez bien nous dire pourquoi ? » Ce sont souvent les
        situations les plus révélatrices de la session.
        """,
    },
    {
        "gabarit": "notation",
        "cle": "orage",
        "titre": "À vous : vos aléas",
        "intitule": "Pensez aux deux aléas qui reviennent le plus souvent sur votre tâche",
        "baremes": [
            {"note": "+ 0", "libelle": "Rares, et sans conséquence sur votre effort"},
            {"note": "+ 1", "libelle": "Un aléa régulier, gérable"},
            {"note": "+ 2", "libelle": "Plusieurs aléas réguliers, qui demandent un effort supplémentaire"},
            {"note": "+ 3", "libelle": "Quotidiens, dans l'urgence, avec de la reprise de travail"},
        ],
        "resultat": "Votre Orage : de + 0 à + 3",
        "notes": """
        Repère utile si le groupe hésite : « Est-ce que vous en parlez encore le
        soir en rentrant ? Si oui, c'est au moins un + 2. »
        """,
    },
    # --- LA PAILLE ---------------------------------------------------------
    {
        "gabarit": "question",
        "question": "On n'a vu que ce qui remplit. Et pour vider ?",
        "precision": "À votre avis, qu'est-ce qui permet de faire baisser le niveau du verre ?",
        "couleur": "paille",
        "notes": """
        Laissez le groupe répondre librement : pauses, étirements, sport, sommeil,
        changement de posture, hydratation.

        Puis structurez autour des composantes. La Paille est le seul élément qui
        joue en faveur du travailleur — présentez-la avec enthousiasme, mais avec
        précision : elle ne remet pas le verre à zéro. Les contraintes déjà subies
        restent dans le corps.
        """,
    },
    {
        "gabarit": "element",
        "cle": "paille",
        "nom": "La Paille",
        "sous_titre": "La seule sortie du système",
        "definition": "Elle ne supprime pas les contraintes déjà subies, mais elle réduit le risque de débordement. "
        "Une paille efficace, c'est souvent l'inverse de la tâche : si vous portez des charges, un étirement ciblé vaut mieux qu'une pause assise.",
        "composantes": [
            "Les pauses — leur fréquence compte plus que leur durée",
            "L'alternance posturale et la marche",
            "Les étirements ciblés sur les zones sollicitées",
            "L'hydratation",
            "Un espace de repos réellement disponible",
        ],
        "image": "verre-quart",
        "notes": """
        Distinguez bien les deux cas de figure, c'est le point clé :

        1. Tâche en autonomie : vous avez une marge de manœuvre, la paille peut
           être activée quand vous le décidez.
        2. Tâche contrainte par une cadence ou une coactivité : très peu de fenêtres
           de récupération. La paille doit alors être intégrée à la conception même
           du poste, pas laissée à l'initiative individuelle.

        Cette distinction évite le discours culpabilisant du « il suffit de faire
        des pauses ».
        """,
    },
    {
        "gabarit": "notation",
        "cle": "paille",
        "titre": "À vous : votre récupération",
        "intitule": "Comptez 1 point par élément réellement présent dans votre journée",
        "baremes": [
            {"note": "1 pt", "libelle": "Vous pouvez faire une pause quand vous en avez besoin"},
            {"note": "1 pt", "libelle": "Vous alternez les postures ou vous marchez régulièrement"},
            {"note": "1 pt", "libelle": "Vous vous étirez, même brièvement"},
            {"note": "1 pt", "libelle": "Vous vous hydratez suffisamment"},
            {"note": "1 pt", "libelle": "Vous disposez d'un vrai espace de repos"},
        ],
        "resultat": "Votre Paille : de 0 à 5",
        "encadre": [
            {"texte": "« Réellement », c'est-à-dire : vous l'avez fait hier.", "gras": True},
            {"texte": "Pas ce qui serait possible en théorie, ni ce qui est écrit quelque part."},
        ],
        "notes": """
        L'exigence du « vous l'avez fait hier » est essentielle : sans elle, tout le
        monde se met 5 et la session perd son intérêt.

        Débrief : demandez qui a moins de 2 points, et pourquoi. Vous verrez très
        vite apparaître la différence entre tâche autonome et tâche contrainte.
        """,
    },
]
