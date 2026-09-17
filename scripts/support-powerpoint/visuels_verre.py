"""
Visuels du Modele du Verre generes en PNG.

Le support doit fonctionner sans l'application : ces images remplacent
l'animation du verre qui se remplit. Elles sont dessinees plutot que
photographiees pour rester dans la palette CERN et pour pouvoir montrer
exactement les niveaux de remplissage utiles pendant la session.
"""

from pathlib import Path

from PIL import Image, ImageDraw

# Palette (miroir de charte_cern, en tuples RGB pour Pillow).
BLEU_CERN = (0x00, 0x33, 0xA0)
CYAN = (0x61, 0xC5, 0xD3)
ORANGE = (0xE1, 0x5E, 0x32)
VIOLET = (0x6E, 0x24, 0x66)
GRIS_MOYEN = (0x6D, 0x6E, 0x71)
GRIS_CLAIR = (0xBE, 0xBE, 0xC8)
BLANC = (0xFF, 0xFF, 0xFF)

SUR_ECHANTILLONNAGE = 4


def _profil_verre(largeur, hauteur, marge, etroitesse):
    """Coordonnees du verre : legerement conique, base plus etroite que le col."""
    demi_haut = (largeur - 2 * marge) / 2
    demi_bas = demi_haut * etroitesse
    centre = largeur / 2
    return {
        "y_haut": marge,
        "y_bas": hauteur - marge,
        "x_haut_gauche": centre - demi_haut,
        "x_haut_droit": centre + demi_haut,
        "x_bas_gauche": centre - demi_bas,
        "x_bas_droit": centre + demi_bas,
    }


def _largeur_a_hauteur(profil, y):
    """Interpole les bords du verre a une hauteur donnee."""
    ratio = (y - profil["y_haut"]) / (profil["y_bas"] - profil["y_haut"])
    gauche = profil["x_haut_gauche"] + ratio * (profil["x_bas_gauche"] - profil["x_haut_gauche"])
    droit = profil["x_haut_droit"] + ratio * (profil["x_bas_droit"] - profil["x_haut_droit"])
    return gauche, droit


def dessiner_verre(
    chemin,
    remplissage=0.0,
    largeur=520,
    hauteur=680,
    etroitesse=0.78,
    couleur_eau=BLEU_CERN,
    deborde=False,
    graduations=True,
):
    """
    Dessine un verre rempli a `remplissage` (0 a 1).

    `deborde=True` ajoute la nappe qui deborde et les gouttes : c'est l'image
    qu'on projette au moment ou l'on parle d'accident ou de TMS declare.
    """
    facteur = SUR_ECHANTILLONNAGE
    L, H = largeur * facteur, hauteur * facteur
    marge = 30 * facteur
    image = Image.new("RGBA", (L, H), (0, 0, 0, 0))
    dessin = ImageDraw.Draw(image, "RGBA")

    profil = _profil_verre(L, H, marge, etroitesse)
    epaisseur = 7 * facteur

    # --- eau ---------------------------------------------------------------
    if remplissage > 0:
        y_surface = profil["y_bas"] - remplissage * (profil["y_bas"] - profil["y_haut"])
        gauche_surface, droit_surface = _largeur_a_hauteur(profil, y_surface)
        dessin.polygon(
            [
                (gauche_surface, y_surface),
                (droit_surface, y_surface),
                (profil["x_bas_droit"], profil["y_bas"]),
                (profil["x_bas_gauche"], profil["y_bas"]),
            ],
            fill=couleur_eau + (215,),
        )
        # Ligne de surface, plus claire : rend le niveau lisible de loin.
        dessin.rectangle(
            [gauche_surface, y_surface - 5 * facteur, droit_surface, y_surface + 3 * facteur],
            fill=CYAN + (255,),
        )

    # --- debordement -------------------------------------------------------
    if deborde:
        # Flaque au sol, dessinee avant le verre pour passer derriere lui.
        dessin.ellipse(
            [
                profil["x_bas_gauche"] - 70 * facteur,
                profil["y_bas"] - 10 * facteur,
                profil["x_bas_droit"] + 70 * facteur,
                profil["y_bas"] + 24 * facteur,
            ],
            fill=couleur_eau + (130,),
        )
        # Bourrelet d'eau qui deborde du col.
        dessin.ellipse(
            [
                profil["x_haut_gauche"] - 10 * facteur,
                profil["y_haut"] - 16 * facteur,
                profil["x_haut_droit"] + 10 * facteur,
                profil["y_haut"] + 20 * facteur,
            ],
            fill=couleur_eau + (235,),
        )
        # Coulures le long des parois exterieures.
        for cote in (-1, 1):
            x_haut = profil["x_haut_gauche"] if cote < 0 else profil["x_haut_droit"]
            x_bas = profil["x_bas_gauche"] if cote < 0 else profil["x_bas_droit"]
            for longueur, largeur_trait in ((0.58, 20), (0.34, 13)):
                y_fin = profil["y_haut"] + longueur * (profil["y_bas"] - profil["y_haut"])
                ratio = longueur
                x_fin = x_haut + ratio * (x_bas - x_haut)
                decalage = cote * (largeur_trait / 2 + 2) * facteur
                dessin.line(
                    [(x_haut + decalage, profil["y_haut"]), (x_fin + decalage, y_fin)],
                    fill=couleur_eau + (200,),
                    width=int(largeur_trait * facteur),
                )
                rayon = largeur_trait * 0.8 * facteur
                dessin.ellipse(
                    [x_fin + decalage - rayon, y_fin - rayon, x_fin + decalage + rayon, y_fin + rayon],
                    fill=couleur_eau + (200,),
                )

    # --- parois ------------------------------------------------------------
    dessin.line(
        [
            (profil["x_haut_gauche"], profil["y_haut"]),
            (profil["x_bas_gauche"], profil["y_bas"]),
            (profil["x_bas_droit"], profil["y_bas"]),
            (profil["x_haut_droit"], profil["y_haut"]),
        ],
        fill=GRIS_MOYEN + (255,),
        width=epaisseur,
        joint="curve",
    )

    if graduations:
        for niveau in (0.25, 0.5, 0.75):
            y = profil["y_bas"] - niveau * (profil["y_bas"] - profil["y_haut"])
            _, droit = _largeur_a_hauteur(profil, y)
            dessin.line(
                [(droit - 34 * facteur, y), (droit - 8 * facteur, y)],
                fill=GRIS_MOYEN + (160,),
                width=3 * facteur,
            )

    # Reflet cantonne au haut de la paroi, pour ne pas barrer la surface d'eau.
    x_reflet_haut = profil["x_haut_gauche"] + 20 * facteur
    y_reflet_bas = profil["y_haut"] + 0.28 * (profil["y_bas"] - profil["y_haut"])
    dessin.line(
        [
            (x_reflet_haut, profil["y_haut"] + 34 * facteur),
            (x_reflet_haut + 8 * facteur, y_reflet_bas),
        ],
        fill=BLANC + (150,),
        width=6 * facteur,
    )

    image = image.resize((largeur, hauteur), Image.LANCZOS)
    Path(chemin).parent.mkdir(parents=True, exist_ok=True)
    image.save(chemin)
    return chemin


def dessiner_trois_verres(chemin, largeur=1100, hauteur=540):
    """Trois capacites differentes : illustre le score Verre."""
    facteur = SUR_ECHANTILLONNAGE
    L, H = largeur * facteur, hauteur * facteur
    image = Image.new("RGBA", (L, H), (0, 0, 0, 0))

    for index, (echelle, remplissage) in enumerate(((0.72, 0.55), (0.86, 0.46), (1.0, 0.4))):
        largeur_verre = int(300 * echelle)
        hauteur_verre = int(430 * echelle)
        verre = Image.new("RGBA", (largeur_verre, hauteur_verre), (0, 0, 0, 0))
        chemin_temporaire = Path(chemin).parent / f"_verre_tmp_{index}.png"
        dessiner_verre(
            chemin_temporaire,
            remplissage=remplissage,
            largeur=largeur_verre,
            hauteur=hauteur_verre,
            graduations=False,
        )
        verre = Image.open(chemin_temporaire).convert("RGBA")
        x = int((index + 0.5) * L / 3 - largeur_verre * facteur / 2)
        verre = verre.resize((largeur_verre * facteur, hauteur_verre * facteur), Image.LANCZOS)
        image.paste(verre, (x, H - hauteur_verre * facteur - 30 * facteur), verre)
        chemin_temporaire.unlink()

    image = image.resize((largeur, hauteur), Image.LANCZOS)
    image.save(chemin)
    return chemin


def dessiner_echelle_lecture(chemin, largeur=1200, hauteur=210):
    """Barre de lecture du resultat : au-dela de 8 h, entre 4 et 8 h, sous 4 h."""
    facteur = SUR_ECHANTILLONNAGE
    L, H = largeur * facteur, hauteur * facteur
    image = Image.new("RGBA", (L, H), (0, 0, 0, 0))
    dessin = ImageDraw.Draw(image, "RGBA")

    segments = [
        (CYAN, 0.0, 0.34),
        (ORANGE, 0.34, 0.67),
        (VIOLET, 0.67, 1.0),
    ]
    haut_barre = 40 * facteur
    bas_barre = 110 * facteur
    for couleur, debut, fin in segments:
        dessin.rectangle([L * debut, haut_barre, L * fin, bas_barre], fill=couleur + (255,))

    image = image.resize((largeur, hauteur), Image.LANCZOS)
    image.save(chemin)
    return chemin


def generer_visuels(dossier):
    """Genere l'ensemble des visuels utilises par le support."""
    dossier = Path(dossier)
    dossier.mkdir(parents=True, exist_ok=True)
    fichiers = {}

    for nom, remplissage, deborde in (
        ("verre-vide", 0.0, False),
        ("verre-quart", 0.25, False),
        ("verre-moitie", 0.5, False),
        ("verre-haut", 0.8, False),
        ("verre-deborde", 1.0, True),
    ):
        chemin = dossier / f"{nom}.png"
        dessiner_verre(chemin, remplissage=remplissage, deborde=deborde)
        fichiers[nom] = chemin

    fichiers["trois-verres"] = dessiner_trois_verres(dossier / "trois-verres.png")
    fichiers["echelle-lecture"] = dessiner_echelle_lecture(dossier / "echelle-lecture.png")
    return fichiers


if __name__ == "__main__":
    import sys

    cible = sys.argv[1] if len(sys.argv) > 1 else "visuels"
    for nom, chemin in generer_visuels(cible).items():
        print(f"{nom}: {chemin}")
