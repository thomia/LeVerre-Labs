"""
Contenu des phases 3 a 5 (synthese, generalisation, engagement) et annexes.

La phase 3 est le moment ou le support papier doit remplacer l'indicateur
calcule par l'application. Le calcul retenu tient de tete et reproduit la meme
mecanique que `computeOverflowSeconds` : le robinet donne un debit, la bulle le
multiplie, l'orage s'ajoute, la paille se retranche, et la capacite du verre
determine le temps disponible avant debordement.
"""

CALCUL_EXEMPLE = {
    "robinet": 6,
    "bulle": 1.5,
    "orage": 2,
    "paille": 3,
    "verre": 40,
}

DIAPOS_SYNTHESE = [
    {
        "gabarit": "section",
        "numero": "Phase 3",
        "titre": "Votre indicateur",
        "sous_titre": "Combien de temps avant que votre verre déborde ?",
        "duree": "30 minutes",
        "notes": """
        C'est la synthèse visuelle de tout ce qui vient d'être construit.
        Annoncez-le comme tel : « On a cinq notes. On va en faire une seule chose. »
        """,
    },
    {
        "gabarit": "calcul",
        "titre": "Calculez votre indicateur",
        "etapes": [
            {"libelle": "Robinet × Bulle", "detail": "le débit réel, environnement compris", "cle": "robinet"},
            {"libelle": "+ Orage", "detail": "l'eau imprévue", "cle": "orage"},
            {"libelle": "− Paille", "detail": "ce que vous évacuez", "cle": "paille"},
            {"libelle": "= remplissage par heure", "detail": "votre débit net", "cle": None},
        ],
        "exemple": CALCUL_EXEMPLE,
        "formule_finale": "Capacité du verre ÷ remplissage par heure = votre temps avant débordement",
        "notes": """
        Faites le calcul de l'exemple au paperboard, lentement, devant tout le monde
        avant de les lancer : 6 × 1,5 = 9 ; 9 + 2 = 11 ; 11 − 3 = 8 par heure ;
        40 ÷ 8 = 5 heures.

        Si la paille est supérieure ou égale au reste, le résultat est négatif ou nul :
        le verre ne déborde pas. Dites-le clairement, c'est un résultat, pas une
        erreur — et c'est le seul cas où la situation est réellement soutenable.

        Prévoyez d'aider deux ou trois personnes : l'objectif n'est pas de tester
        leur arithmétique.
        """,
    },
    {
        "gabarit": "lecture",
        "titre": "Lisez votre résultat",
        "niveaux": [
            {
                "couleur": "paille",
                "titre": "Plus de 8 heures",
                "texte": "Votre verre ne déborde pas sur une journée. La marge existe : il s'agit de la préserver.",
            },
            {
                "couleur": "orage",
                "titre": "Entre 4 et 8 heures",
                "texte": "Votre verre déborde dans la journée. Tout se joue sur la paille et sur les aléas.",
            },
            {
                "couleur": "bulle",
                "titre": "Moins de 4 heures",
                "texte": "Votre verre déborde avant la pause déjeuner. La situation mérite qu'on s'y attarde sérieusement.",
            },
        ],
        "encadre": [
            {"texte": "Ce n'est pas une vérité absolue. C'est une approximation utile.", "gras": True},
            {"texte": "Suffisamment juste pour orienter l'action — et c'est tout ce qu'on lui demande."},
        ],
        "notes": """
        Ne dramatisez pas les résultats bas, mais ne les minimisez pas non plus :
        « Il y a des situations ici qui méritent vraiment qu'on s'y attarde. C'est
        exactement pour ça qu'on fait ce travail. »

        Court terme, un verre qui déborde, c'est le risque d'accident. Long terme,
        c'est le risque de maladie professionnelle. Reliez explicitement au chiffre
        du début de session.
        """,
    },
    {
        "gabarit": "question",
        "question": "Quel élément a fait le plus bouger votre indicateur ?",
        "precision": "Le robinet ? La bulle ? Les aléas ? L'absence de paille ?\nC'est là que se trouve votre premier levier.",
        "notes": """
        Discussion collective, 10 minutes. Faites un rapide tour de salle en notant
        au paperboard l'élément dominant de chacun.

        Questions utiles : qui a le temps le plus court ? Le plus long ? Pour des
        tâches identiques ou différentes ? Deux personnes du même service avec des
        résultats très différents, c'est le meilleur matériau pédagogique de la
        session.
        """,
    },
    {
        "gabarit": "section",
        "numero": "Phase 4",
        "titre": "Passer à l'action",
        "sous_titre": "Pause active, généralisation, leviers",
        "duree": "45 minutes",
        "notes": """
        Commencez par la pause active : elle illustre la paille au moment exact où
        le groupe commence à fatiguer. C'est une démonstration, pas une récréation.
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Pause active : la paille en direct",
        "sous_titre": "Cinq minutes, tout le monde debout",
        "puces": [
            {"texte": "Se lever et marcher un peu — la station assise prolongée est une contrainte, pas un repos"},
            {"texte": "Mobiliser la nuque et les épaules, lentement, sans forcer"},
            {"texte": "Étirer le dos et les poignets"},
            {"texte": "Boire un verre d'eau"},
        ],
        "encadre": [
            {"texte": "Vous venez d'activer votre paille.", "gras": True},
            {"texte": "Cinq minutes sur quatre heures. Posez-vous la question : combien de fois l'avez-vous fait hier au travail ?"},
        ],
        "notes": """
        Faites-le vraiment, avec eux, sans ironie. C'est le moment le plus mémorisé
        de la session parce qu'il est vécu et non expliqué.

        Au retour : « Ce que vous venez de faire, c'est exactement ce que vous avez
        noté tout à l'heure dans la paille. La différence entre 1 et 4 points, c'est
        ça, répété dans la journée. »
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Ce modèle marche partout",
        "sous_titre": "Ce qui change d'un poste à l'autre, ce ne sont pas les éléments",
        "puces": [
            {"texte": "Les cinq éléments sont toujours les mêmes, quel que soit le métier"},
            {"texte": "Ce qui change, c'est quel facteur ajoute le plus d'eau dans le verre"},
            {"texte": "Certains facteurs se retrouvent partout, d'autres sont spécifiques à votre travail"},
        ],
        "encadre": [
            {"texte": "Vous pouvez refaire cette analyse sur n'importe quelle tâche.", "gras": True},
            {"texte": "Sur un poste que vous occupez, sur un poste que vous encadrez, ou sur un poste que vous concevez."},
        ],
        "notes": """
        Si le temps le permet, faites l'exercice en direct sur une deuxième tâche
        proposée par un participant : c'est la meilleure preuve que le modèle
        n'est pas lié à un métier particulier.
        """,
    },
    {
        "gabarit": "colonnes",
        "titre": "Deux familles de leviers",
        "colonne_gauche": {
            "titre": "Ce que vous pouvez faire",
            "lignes": [
                {"texte": "Activer la paille plus souvent : pauses actives, étirements ciblés"},
                {"texte": "Adapter votre posture sur la tâche de référence"},
                {"texte": "Signaler votre niveau à votre encadrant"},
                {"texte": "Soigner votre sommeil et votre alimentation"},
                {"texte": "Maintenir une activité physique hors travail"},
            ],
        },
        "colonne_droite": {
            "titre": "Ce qui relève de l'organisation",
            "lignes": [
                {"texte": "Adapter l'environnement : éclairage, bruit, température"},
                {"texte": "Revoir les plannings pour réduire la pression temporelle"},
                {"texte": "Formaliser des pauses dans l'organisation du travail"},
                {"texte": "Prévenir les aléas par de la maintenance préventive"},
                {"texte": "Former l'encadrement à repérer les signaux de surcharge"},
            ],
        },
        "bas_de_page": "Les deux colonnes sont légitimes. Aucune ne remplace l'autre.",
        "notes": """
        Ne hiérarchisez pas les deux colonnes : si vous insistez trop sur la gauche,
        le groupe entend « c'est de votre faute » ; si vous n'insistez que sur la
        droite, chacun repart sans rien à faire.

        Ouvrez cinq minutes de discussion sur les leviers que le groupe juge les
        plus réalistes dans son contexte. Ne cherchez pas à tout résoudre ici.
        """,
    },
    {
        "gabarit": "section",
        "numero": "Phase 5",
        "titre": "Engagement et clôture",
        "sous_titre": "Chacun repart avec une action précise",
        "duree": "20 minutes",
        "notes": """
        Tour de salle complet. Ne sautez personne, même si le temps est serré :
        c'est le moment qui transforme la session en changement réel.
        """,
    },
    {
        "gabarit": "consigne",
        "titre": "Quel levier allez-vous appliquer dès demain ?",
        "consigne": [
            {"texte": "Un seul. Sur votre tâche de référence. Écrivez-le sur votre fiche.", "gras": True},
        ],
        "colonnes_exemple": {
            "gauche": {
                "titre": "Ce n'est pas un engagement",
                "couleur": "orange",
                "lignes": [
                    "« Je vais mieux prendre mes pauses »",
                    "« Je vais faire attention à mon dos »",
                    "« Je vais essayer de moins stresser »",
                ],
            },
            "droite": {
                "titre": "Ça, c'en est un",
                "couleur": "bleu",
                "lignes": [
                    "« Je m'étire les épaules 5 minutes après chaque opération de montage »",
                    "« Je règle la hauteur de mon écran demain matin »",
                    "« Je coupe les notifications pendant les phases de précision »",
                ],
            },
        },
        "notes": """
        Le niveau de précision de l'engagement prédit directement sa probabilité
        d'application. Poussez à la précision, gentiment mais systématiquement :
        « Quand exactement ? Après quoi ? Combien de temps ? »

        Faites le tour de la salle à l'oral. Chacun énonce son engagement à voix
        haute : l'énonciation publique change tout.
        """,
    },
    {
        "gabarit": "cloture",
        "titre": "Prenez soin de vous",
        "lignes": [
            "On a regardé ensemble tout ce qui agit sur vous au travail.",
            "Une partie de tout ça, vous n'en avez pas la maîtrise : la charge, l'environnement, les imprévus. C'est inhérent à votre métier.",
            "Mais il y a une chose que personne ne pourra jamais vous enlever : la façon dont vous gérez votre corps.",
            "On fait des choix tous les jours. Sur notre sommeil, notre alimentation, nos pauses, nos postures.",
            "Chaque choix compte. Ce sont des gouttes en moins dans le verre.",
        ],
        "notes": """
        À dire sans notes, naturellement, en regardant la salle. Ne lisez pas.
        Laissez un silence avant de remercier.
        """,
    },
    # --- Annexes -----------------------------------------------------------
    {
        "gabarit": "section",
        "numero": "Annexes",
        "titre": "À imprimer avant la session",
        "sous_titre": "Fiche participant recto-verso, minutage, sources",
        "notes": """
        Les deux diapositives suivantes constituent la fiche participant.
        Imprimez-les en recto-verso, une par personne, plus quelques exemplaires
        de secours.
        """,
    },
    {
        "gabarit": "fiche",
        "titre": "Fiche participant — recto",
        "sous_titre": "Ma tâche de référence, mon Verre et mon Robinet",
        "blocs": [
            {
                "titre": "Ma tâche de référence",
                "couleur": "bleu",
                "lignes_vides": 2,
                "aide": "Une tâche concrète, pas un objectif de travail",
            },
            {
                "titre": "Le Verre — ma capacité",
                "couleur": "verre",
                "aide": "Je pars de 30 et j'ajoute 5 par réponse favorable",
                "items": [
                    "Moins de 45 ans",
                    "Aucune douleur liée au travail depuis 2 ans",
                    "Activité physique régulière",
                    "Sommeil et alimentation satisfaisants",
                ],
                "total": "Capacité de mon verre",
            },
            {
                "titre": "Le Robinet — mon débit",
                "couleur": "robinet",
                "aide": "Je note chaque composante de 0 à 10, puis je fais la moyenne",
                "items": [
                    "Charge manipulée",
                    "Posture",
                    "Fréquence et durée",
                    "Demande cognitive",
                    "Pression psychosociale",
                ],
                "total": "Moyenne — mon Robinet",
            },
            {
                "titre": "Mes notes",
                "couleur": "gris",
                "aide": "Ce que je veux retenir, ce que je veux vérifier sur mon poste",
                "lignes_vides": 4,
            },
        ],
    },
    {
        "gabarit": "fiche",
        "titre": "Fiche participant — verso",
        "sous_titre": "Ma Bulle, mon Orage, ma Paille, mon indicateur et mon engagement",
        "colonnes": 3,
        "blocs": [
            {
                "titre": "La Bulle — mon environnement",
                "couleur": "bulle",
                "aide": "Je coche les facteurs dégradés · × 1 si 0 ou 1 · × 1,5 si 2 ou 3 · × 2 si 4 ou plus",
                "items": [
                    "Température",
                    "Bruit ou vibrations",
                    "Éclairage",
                    "Espace de travail",
                    "Horaires",
                    "Matériel et équipements",
                ],
                "total": "Mon multiplicateur",
            },
            {
                "titre": "L'Orage — mes aléas",
                "couleur": "orage",
                "aide": "+ 0 rares · + 1 un aléa régulier · + 2 plusieurs · + 3 quotidiens et urgents",
                "lignes_vides": 1,
                "total": "Mon Orage",
            },
            {
                "titre": "La Paille — ma récupération",
                "couleur": "paille",
                "aide": "1 point par élément que j'ai réellement fait hier",
                "items": [
                    "Pause quand j'en ai eu besoin",
                    "Alternance de postures, marche",
                    "Étirements",
                    "Hydratation",
                    "Espace de repos",
                ],
                "total": "Ma Paille",
            },
            {
                "titre": "Mon indicateur",
                "couleur": "bleu",
                "aide": "(Robinet × Bulle) + Orage − Paille, puis Capacité ÷ remplissage",
                "items": [
                    "Mon remplissage par heure",
                ],
                "total": "Mon temps avant débordement",
            },
            {
                "titre": "Mon engagement pour demain",
                "couleur": "bleu",
                "lignes_vides": 2,
                "aide": "Une action précise : quoi, quand, combien de temps",
            },
        ],
    },
    {
        "gabarit": "minutage",
        "titre": "Minutage de référence",
        "sous_titre": "Durées indicatives, à adapter à la dynamique du groupe",
        "etapes": [
            ("Phase 0 — Ouverture, données chiffrées, cadrage", "30 min"),
            ("Phase 1 — Fiche de route et tâche de référence", "15 min"),
            ("Le Verre — amorce, notation, débrief", "15 min"),
            ("Le Robinet — amorce, 100 points, notation, débrief", "40 min"),
            ("La Bulle — amorce, notation, débrief", "20 min"),
            ("L'Orage — prescrit / réel, notation, débrief", "25 min"),
            ("La Paille — amorce, notation, débrief", "20 min"),
            ("Phase 3 — Calcul et lecture de l'indicateur", "30 min"),
            ("Phase 4 — Pause active, généralisation, leviers", "45 min"),
            ("Phase 5 — Engagements et clôture", "20 min"),
        ],
        "notes": """
        Total théorique : 4 heures pleines. Priorité aux moments forts sur les
        éléments plutôt qu'à la couverture exhaustive du programme.

        Si vous devez couper, coupez dans la généralisation (phase 4), jamais dans
        les débriefs d'éléments ni dans les engagements.
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Sources et méthode",
        "puces": [
            {"texte": "Données AT/MP : Assurance Maladie — Risques professionnels, statistiques nationales 2024"},
            {"texte": "Modèle du Verre et déroulé pédagogique : LeVerre Labs"},
            {"texte": "Charte graphique : palette et polices corporate publiques du CERN (design-guidelines.web.cern.ch)"},
        ],
        "encadre": [
            {"texte": "Ce support est autonome : il ne nécessite ni connexion, ni smartphone, ni installation.", "gras": True},
            {"texte": "L'application LeVerre Labs reste l'outil de référence lorsque les conditions techniques le permettent : elle calcule le même indicateur en direct."},
        ],
        "notes": """
        Diapositive de fin, à laisser affichée pendant les questions.
        """,
    },
]
