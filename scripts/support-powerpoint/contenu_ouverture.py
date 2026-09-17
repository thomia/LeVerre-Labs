"""
Contenu des phases 0 et 1 : ouverture, donnees chiffrees, cadrage, et mise en
place de la fiche papier qui remplace l'application le temps de la session.

Les chiffres proviennent de `src/data/stats-am/2024.json` (statistiques
nationales AT/MP de l'Assurance Maladie, exercice 2024), deja utilisees par
l'application : le support et l'outil racontent donc exactement la meme chose.
"""

DIAPOS_OUVERTURE = [
    {
        "gabarit": "couverture",
        "titre": "Le Modèle du Verre",
        "sous_titre": "Sensibilisation au risque lié à l'activité physique au travail",
        "mentions": [
            "Session de sensibilisation — 4 heures",
            "LeVerre Labs",
        ],
        "notes": """
        Support autonome : il ne dépend pas de l'application. Chaque participant
        construit son verre sur la fiche papier distribuée en phase 1.
        Prévoir : fiches imprimées (une par participant), stylos, un paperboard.
        Vérifier avant la session que le vidéoprojecteur affiche bien le 16:9.
        """,
    },
    {
        "gabarit": "section",
        "numero": "Phase 0",
        "titre": "Ouverture et ancrage",
        "sous_titre": "On part de leur vécu, pas de la théorie",
        "duree": "30 minutes",
        "notes": """
        Objectif de la phase : faire exister le risque dans la salle avant
        d'introduire le moindre concept. Ne pas démarrer par le modèle.
        """,
    },
    {
        "gabarit": "question",
        "question": "Qui a déjà ressenti une douleur musculaire ou articulaire liée à son travail ?",
        "precision": "Une tension dans le dos, les épaules, les poignets. Même passagère. Même bénigne.",
        "notes": """
        Levez la main vous-même en posant la question. Dans la quasi-totalité des
        groupes, toutes les mains se lèvent. Laissez ce moment exister une seconde,
        sans commenter tout de suite : c'est la prise de conscience que le risque
        n'est pas théorique, il est déjà vécu par tout le monde dans la salle.

        Enchaînez : « On se comporte très différemment face à un risque quand on
        a compris ce qu'il fait à notre corps. En général, on comprend quand on y
        a été confronté. Aujourd'hui, l'idée c'est de ne pas attendre. »
        """,
    },
    {
        "gabarit": "chiffre",
        "valeur": "549 614",
        "legende": "accidents du travail avec arrêt en France, en 2024",
        "details": [
            {"texte": "1 accident sur 2 est lié à la manutention manuelle", "gras": True},
            {"texte": "Devant les chutes de plain-pied (15 %) et les chutes de hauteur (12 %)"},
        ],
        "source": "Assurance Maladie — Risques professionnels, statistiques 2024 (publiées en 2026)",
        "notes": """
        Ton factuel, sans dramatiser ni minimiser. Après « un accident sur deux »,
        marquez une pause et laissez le chiffre exister.

        Puis : « Ce qui est troublant, ce n'est pas le chiffre, c'est sa stabilité.
        Ces données sont les mêmes depuis vingt ans. On a formé, on a acheté du
        matériel, on a affiché des consignes, on a distribué des EPI. Et le chiffre
        ne bouge pas. Ça veut dire que les réponses mises en place jusqu'ici ne
        s'attaquent pas au bon problème. »
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Ce que ça représente vraiment",
        "puces": [
            {"texte": "764 décès liés à un accident du travail", "gras": True},
            {"texte": "54 millions de journées de travail perdues — l'équivalent d'environ 148 000 années"},
            {"texte": "Les lésions touchent d'abord les membres supérieurs (33 %), les membres inférieurs (25 %) et le dos (19 %)"},
        ],
        "encadre": [
            {"texte": "Ce ne sont pas des accidents spectaculaires.", "gras": True},
            {"texte": "Ce sont des gestes ordinaires, faits des milliers de fois, dans des conditions qui s'accumulent."},
        ],
        "source": "Assurance Maladie — Risques professionnels, statistiques 2024",
        "notes": """
        Le but de cette diapositive est de sortir de l'abstraction statistique.
        Évitez d'énumérer : appuyez sur le fait que les sièges de lésion
        correspondent exactement aux zones que le groupe a citées en levant la main.
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Et sur le long terme : les maladies professionnelles",
        "puces": [
            {"texte": "50 598 maladies professionnelles reconnues en 2024", "gras": True},
            {"texte": "44 723 sont des troubles musculo-squelettiques, soit près de 9 sur 10"},
            {"texte": "Localisation : épaule 37 %, main / poignet / doigts 31 %, coude 23 %"},
        ],
        "encadre": [
            {"texte": "L'accident, c'est le court terme. Le TMS, c'est le long terme.", "gras": True},
            {"texte": "Les deux viennent de la même accumulation. C'est exactement ce que le verre va représenter."},
        ],
        "source": "Assurance Maladie — Risques professionnels, statistiques 2024",
        "notes": """
        Point clé à faire passer : on ne parle pas de deux sujets différents.
        Un verre qui déborde d'un coup, c'est l'accident. Un verre qui reste plein
        en permanence pendant des années, c'est la maladie professionnelle.
        """,
    },
    {
        "gabarit": "colonnes",
        "titre": "Au bureau comme à l'atelier, c'est le même premier risque",
        "colonne_gauche": {
            "titre": "Activités tertiaires",
            "lignes": [
                {"texte": "38 %", "taille_grande": True},
                {"texte": "des accidents du travail sont liés à la manutention manuelle"},
                {"texte": "C'est le premier risque, devant les chutes de plain-pied (24 %)"},
            ],
        },
        "colonne_droite": {
            "titre": "Activités techniques et métallurgie",
            "lignes": [
                {"texte": "54 %", "taille_grande": True},
                {"texte": "des accidents du travail sont liés à la manutention manuelle"},
                {"texte": "Devant l'outillage à main (16 %)"},
            ],
        },
        "bas_de_page": "Le risque ne change pas de nature d'un métier à l'autre : ce sont les facteurs qui le nourrissent qui changent.",
        "source": "Assurance Maladie 2024 — comités techniques nationaux H (services) et A (métallurgie)",
        "notes": """
        Adaptez l'exemple au public présent dans la salle : population très mixte
        dans un organisme de recherche, avec des postes administratifs, des postes
        techniques en atelier et des interventions sur installations.

        Le message : « Le collègue de bureau et le collègue d'atelier n'ont pas les
        mêmes gestes, mais ils ont le même premier risque. Ce qui change, c'est ce
        qui remplit leur verre. »
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Pourquoi ce risque-là ne recule pas",
        "sous_titre": "Comparons avec les risques qui, eux, ont reculé",
        "puces": [
            {"texte": "Risque électrique : personne ne touche un câble sans habilitation"},
            {"texte": "Risque chimique : pictogrammes, fiches de données de sécurité, EPI"},
            {"texte": "Risque incendie : extincteurs, exercices d'évacuation"},
        ],
        "encadre": [
            {"texte": "Ces risques ont reculé parce qu'on a créé une conscience du risque.", "gras": True},
            {"texte": "Le risque physique, lui, reste invisible : on voit la charge lourde, on voit la mauvaise posture, mais on ne voit jamais l'accumulation."},
        ],
        "notes": """
        C'est l'argument le plus structurant de la phase 0. Prenez le temps.
        Terminez par : « On ne voit pas le verre se remplir. C'est exactement pour
        ça qu'on est là aujourd'hui. »
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Le cadre de la session",
        "puces": [
            {"texte": "Il n'y a pas de bonne ni de mauvaise réponse. Ce que vous notez vous appartient."},
            {"texte": "On n'est pas là pour désigner des responsables, mais pour identifier des leviers."},
            {"texte": "Profitez-en pour remettre en question vos façons de faire. Posez vos questions au fil de l'eau."},
        ],
        "notes": """
        À dire à l'oral, sur un ton décontracté. Ne lisez pas la diapositive.
        Précisez bien que rien de ce qui est noté sur la fiche ne sera ramassé.
        """,
    },
    {
        "gabarit": "visuel",
        "titre": "« C'est la goutte qui fait déborder le vase »",
        "image": "verre-haut",
        "lignes": [
            {"texte": "Aujourd'hui, on ne s'intéresse pas à la goutte.", "taille_grande": True},
            {"texte": "On s'intéresse au vase.", "taille_grande": True, "gras": True},
            {"texte": ""},
            {"texte": "Ce qui provoque l'accident, ce n'est jamais le dernier geste. C'est tout ce qu'il y avait dans le verre avant lui."},
        ],
        "notes": """
        Diapositive de bascule entre le constat et le modèle. Après cette phrase,
        on ne revient plus aux statistiques.

        Enchaînez directement : « Et pour regarder ce vase, on va utiliser un outil
        simple que vous allez construire vous-mêmes. »
        """,
    },
    {
        "gabarit": "section",
        "numero": "Phase 1",
        "titre": "Votre fiche de route",
        "sous_titre": "Chacun construit son propre verre",
        "duree": "15 minutes",
        "notes": """
        C'est ici que la session papier remplace l'application. Distribuez la fiche
        participant (annexes en fin de support, à imprimer en recto-verso).
        """,
    },
    {
        "gabarit": "puces",
        "titre": "Comment on va travailler",
        "sous_titre": "Une fiche, cinq notes, un résultat personnel",
        "puces": [
            {"texte": "Vous allez noter cinq éléments, un par un, sur une seule tâche de votre travail"},
            {"texte": "À chaque élément, vous notez votre score sur la fiche — personne d'autre ne le voit"},
            {"texte": "À la fin, un calcul simple vous donne votre indicateur : le temps que met votre verre à déborder"},
        ],
        "encadre": [
            {"texte": "Votre fiche ne sera pas ramassée.", "gras": True},
            {"texte": "Elle repart avec vous, avec l'action que vous aurez choisie en fin de session."},
        ],
        "notes": """
        Distribuez la fiche maintenant et laissez trente secondes pour la parcourir.
        Montrez physiquement la case « tâche de référence » en haut : c'est le point
        d'ancrage de toute la session.

        Si un participant bloque sur les chiffres, rassurez : « On ne cherche pas la
        précision au dixième. On cherche l'ordre de grandeur et ce qu'il révèle. »
        """,
    },
    {
        "gabarit": "consigne",
        "titre": "Choisissez votre tâche de référence",
        "consigne": [
            {"texte": "Une tâche concrète, que vous faites régulièrement, et que vous allez garder pendant toute la session.", "gras": True},
        ],
        "colonnes_exemple": {
            "gauche": {
                "titre": "Un objectif de travail",
                "couleur": "orange",
                "lignes": [
                    "« Faire la maintenance d'un équipement »",
                    "« Préparer une commande »",
                    "« Assurer une permanence »",
                ],
            },
            "droite": {
                "titre": "Une tâche réelle",
                "couleur": "bleu",
                "lignes": [
                    "« Démonter le capot au-dessus de ma tête, à deux, en zone étroite »",
                    "« Descendre 40 cartons de 12 kg d'une palette, seul »",
                    "« Rester assis 4 h devant deux écrans mal placés »",
                ],
            },
        },
        "notes": """
        Point pédagogique important, souvent nouveau pour le groupe.

        Demandez d'abord : « Donnez-moi un exemple de tâche dans votre boulot. »
        Les réponses seront des objectifs. Rebondissez : « Ce que votre responsable
        vous demande, ce qui est écrit sur votre fiche de poste, c'est un objectif.
        Nous, on regarde ce que vous mettez concrètement en place pour l'atteindre. »

        Laissez 3 minutes d'écriture. Passez dans les rangs : c'est le meilleur
        moment pour repérer les participants qui auront des choses à partager.
        """,
    },
]
