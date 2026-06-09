/**
 * Parser automatique des statistiques de sinistralite AT/MP (Assurance Maladie).
 *
 * Lit un fichier `data/pdf-source/{annee}.txt` (texte extrait du PDF officiel)
 * et produit `src/data/stats-am/{annee}.json` conforme au schema `types.ts`.
 *
 * Usage :
 *   node scripts/parse-pdf-stats.mjs 2024
 *   node scripts/parse-pdf-stats.mjs all
 *
 * Etapes d'extraction (a venir, on commence par les scalaires) :
 *   1. Indicateurs scalaires AT/TJ/MP (cette etape)
 *   2. Repartitions age/sexe/qualification
 *   3. Top MP de la fiche synthese
 *   4. Focus TMS (uniquement "tous CTN")
 *   5. Validation par invariants (sommes coherentes)
 */

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  parseRepartitionsAt,
  parseRepartitionsMp,
  parseListeMpCibles,
  validerRepartition,
  TOTAL_REFERENCE_AT,
  TOTAL_REFERENCE_MP,
} from './lib/parse-repartitions.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

/* ---------- Constantes metier ---------- */

const CTN_CODES = ['tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

const CTN_LIBELLES = {
  tous: "Ensemble des 9 grandes branches d'activite",
  A: 'Industries de la metallurgie',
  B: 'Industries du batiment et des travaux publics',
  C: 'Transports, eau, gaz, electricite, livre, communication',
  D: "Services, commerces et industries de l'alimentation",
  E: 'Chimie, caoutchouc, plasturgie',
  F: 'Bois, ameublement, papier-carton, textile, cuir, pierres',
  G: 'Commerce non alimentaire',
  H: 'Services I (banques, assurances, administrations)',
  I: 'Services II (interim, action sociale, sante, nettoyage)',
}

/* ---------- Helpers de parsing ---------- */

/** "1 777 902" -> 1777902. "0" -> 0. */
function parseNb(s) {
  if (s == null || s === '' || s === '-') return 0
  const cleaned = String(s).replace(/\s+/g, '').replace(/\u00A0/g, '')
  const n = parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

/** "22,6" -> 22.6. "nc" / "nc**" -> null. */
function parseDecimal(s) {
  if (s == null) return null
  const t = String(s).trim()
  if (t === 'nc' || t === 'nc**' || t === '-' || t === '') return null
  const n = parseFloat(t.replace(',', '.').replace(/\s/g, ''))
  return Number.isFinite(n) ? n : null
}

/* ---------- Decoupage du texte en fiches ---------- */

/**
 * Decoupe le texte en blocs, un par fiche (synthese/AT/TJ/MP) et par CTN.
 *
 * Format moderne (2023-2024) : chaque fiche est precedee en pied de page
 * par une "balise CTN" qui identifie sans ambiguite le CTN :
 *   "9 CTN : ENSEMBLE DES NEUF GRANDES BRANCHES D'ACTIVITE\nSYNTHESE ANNEE YYYY"
 *   "CTN : A\nACCIDENTS DU TRAVAIL ANNEE YYYY"
 *   "CTN A : Industries de la metallurgie\nACCIDENTS DE TRAJET ANNEE YYYY"
 *
 * Format ancien (2015-2022) : idem, mais :
 *   - la balise "tous" s'ecrit "CTN 9CTN : 9 CTN" ou "CTN : 9CTN"
 *   - le marqueur AT s'ecrit "ACCIDENTS DE TRAVAIL" (au lieu de "DU TRAVAIL")
 *   - les fiches TJ/MP de "tous" n'ont PAS de balise CTN au-dessus :
 *     on herite du CTN de la fiche precedente.
 *
 * Strategie :
 *   1. Trouver toutes les "balises CTN" (positions + code CTN).
 *   2. Trouver tous les "marqueurs de fiche" (positions + type).
 *   3. Pour chaque marqueur, associer la balise la plus proche au-dessus,
 *      dans l'intervalle [marqueur precedent, marqueur courant]. Si pas
 *      de balise dans cet intervalle, heriter du CTN precedent.
 *   4. Contenu de la fiche = texte entre fin du marqueur precedent et
 *      debut de la balise (ou du marqueur courant si pas de balise).
 */
function decouperFiches(text, annee) {
  // 1. Balises CTN : chaque variante est une alternative capturee
  //    dans un groupe different pour determiner facilement le code.
  //    Toutes les alternatives sont suivies d'un lookahead obligatoire
  //    vers un marqueur de fiche, car une vraie balise est toujours un
  //    en-tete immediatement suivi d'un marqueur "SYNTHESE/ACCIDENTS/
  //    MALADIES ANNEE NNNN". Sans ce lookahead, on capture aussi les
  //    titres internes des pages "Synthese 2024 et evolutions" qui
  //    contiennent les memes mots-cles.
  const APRES_MARQUEUR =
    '(?=\\s*\\n\\s*(?:SYNTHESE|ACCIDENTS|MALADIES) ANNEE\\s+\\d{4})'
  const balisesRe = new RegExp(
    [
      // (1) "tous" : "ENSEMBLE DES NEUF GRANDES BRANCHES" avec prefixe
      //     optionnel ("9 CTN : " moderne, "CTN 9CTN : " ancien 2016) ou
      //     sans prefixe (2020 fiche TJ). Inclut "ET COMPTE SPECIAL".
      '((?:(?:9\\s+CTN|CTN(?:\\s+9CTN)?)\\s*:\\s*)?ENSEMBLE DES NEUF GRANDES BRANCHES[^\\n]*)' +
        APRES_MARQUEUR,
      // (2) "tous" ancien : "CTN 9CTN : 9 CTN" ou "CTN : 9CTN" (sans ENSEMBLE)
      '|(CTN(?:\\s+9CTN)?\\s*:\\s*9\\s*CTN[^\\n]*)' + APRES_MARQUEUR,
      // (3) "tous" 2020-2023 : juste "9 CTN" en fin de ligne (sans ":")
      '|(9\\s+CTN)' + APRES_MARQUEUR,
      // (4) CTN individuel moderne court : "CTN : A" (et tolere typo "CTN : II"
      //     du PDF 2020 ligne 6540 ou "II" est utilise pour CTN I).
      '|CTN\\s*:\\s*([A-I])I?' + APRES_MARQUEUR,
      // (5) CTN individuel avec libelle : "CTN A : ..."
      '|CTN\\s+([A-I])\\s*:[^\\n]*' + APRES_MARQUEUR,
    ].join(''),
    'g'
  )
  const balises = []
  let b
  while ((b = balisesRe.exec(text)) !== null) {
    const code = b[4] || b[5] || 'tous'
    balises.push({ pos: b.index, fin: b.index + b[0].length, code })
  }

  // 2. Marqueurs de fiches (tolerant sur DU/DE TRAVAIL)
  const marqueursRe = new RegExp(
    '(SYNTHESE|ACCIDENTS D[EU] TRAVAIL|ACCIDENTS DE TRAJET|MALADIES PROFESSIONNELLES) ANNEE ' +
      annee,
    'g'
  )
  const marqueurs = []
  let m
  while ((m = marqueursRe.exec(text)) !== null) {
    let type = m[1]
    if (/^ACCIDENTS D[EU] TRAVAIL$/.test(type)) type = 'ACCIDENTS DU TRAVAIL'
    marqueurs.push({ pos: m.index, fin: m.index + m[0].length, type })
  }

  // 3. Associer a chaque marqueur la balise CTN qui le precede (entre le
  //    marqueur precedent et celui-ci). Si pas de balise dans cet intervalle,
  //    on herite du CTN du marqueur precedent.
  //
  //    Cas particulier 2017 : le tout premier marqueur SYNTHESE n'a pas de
  //    balise CTN au-dessus (juste "Nombre de salariés / évolution 2017/2016").
  //    On part donc du principe que le PDF commence toujours par "tous CTN",
  //    ce qui est verifie sur tous les PDF AM 2015-2024.
  const ctnParMarqueur = []
  let ctnCourant = 'tous'
  for (let i = 0; i < marqueurs.length; i++) {
    const cur = marqueurs[i]
    const debutIntervalle = i === 0 ? 0 : marqueurs[i - 1].fin
    let baliseIci = null
    for (const bal of balises) {
      if (bal.pos >= debutIntervalle && bal.pos < cur.pos) baliseIci = bal
      else if (bal.pos >= cur.pos) break
    }
    if (baliseIci) ctnCourant = baliseIci.code
    ctnParMarqueur.push(ctnCourant)
  }

  // 4. Le contenu d'une fiche commence APRES son propre marqueur et se
  //    termine avant la balise CTN du marqueur suivant (ou le marqueur
  //    suivant lui-meme si pas de balise intermediaire).
  const fiches = []
  for (let i = 0; i < marqueurs.length; i++) {
    const code = ctnParMarqueur[i]
    if (!code) continue
    const cur = marqueurs[i]
    const next = marqueurs[i + 1]

    let finContenu
    if (next) {
      // Chercher la balise CTN qui precede le marqueur suivant
      let baliseDuSuivant = null
      for (const bal of balises) {
        if (bal.pos > cur.fin && bal.pos < next.pos) baliseDuSuivant = bal
        else if (bal.pos >= next.pos) break
      }
      finContenu = baliseDuSuivant ? baliseDuSuivant.pos : next.pos
    } else {
      finContenu = text.length
    }

    const contenu = text.slice(cur.fin, finContenu)

    // Filtrer les fiches "focus NAF" du PDF 2018 : elles apparaissent au debut
    // du document avec un libelle "... Code NAF : XXXXX" et contiennent les
    // chiffres d'un sous-secteur (chiffres tres petits, ex. 6 AT). Si on les
    // garde, elles polluent la premiere occurrence des regex et faussent les
    // resultats du CTN auquel elles sont rattachees.
    if (/Code NAF\s*:/i.test(contenu.slice(0, 400))) continue

    fiches.push({ type: cur.type, ctn: code, contenu })
  }

  return fiches
}

/* ---------- Parsers de fiches (scalaires uniquement pour l'instant) ---------- */

/**
 * Normalise le texte d'une fiche : sauts de ligne -> espaces, espaces multiples
 * compactes. Permet d'avoir des regex tolerantes au passage a la ligne du PDF.
 */
function normaliser(text) {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Cherche un entier (eventuellement avec espaces de milliers) place juste
 * apres l'etiquette `label` (regex). Renvoie 0 si non trouve.
 *
 * Exemple : `getNombre(t, "Nombre de d[ée]c[èe]s")` => 59
 */
function getNombre(t, labelRegex) {
  // Pattern strict d'entier francais : 1-3 chiffres + 0+ groupes (" "+3 chiffres).
  // Lookahead negatif :
  //   - "(?!\\d)"   evite les flux compactes mal formes ("345678..." reduits a "345")
  //   - "(?!\\s*%)" evite les pourcentages des pages graphiques de la SYNTHESE
  // Si le premier match est rejete, le moteur regex cherche l'occurrence
  // suivante du label dans le texte (tres utile car le texte fusionne contient
  // plusieurs occurrences du meme label, dont certaines sans valeur exploitable).
  const re = new RegExp(
    labelRegex + '\\s+(\\d{1,3}(?:\\s\\d{3})*)(?!\\d|\\s*%)',
    'i'
  )
  const m = t.match(re)
  return m ? parseNb(m[1]) : 0
}

/**
 * Cherche un decimal (ou "nc") place juste apres l'etiquette. Renvoie null
 * si non trouve ou si la valeur est "nc".
 *
 * Exemple : `getDecimal(t, "Taux de fr[ée]quence")` => 13.0
 */
function getDecimal(t, labelRegex) {
  const re = new RegExp(labelRegex + '\\s+(nc(?:\\*\\*)?|[\\d,.]+)', 'i')
  const m = t.match(re)
  return m ? parseDecimal(m[1]) : null
}

/**
 * Parse une fiche AT (Accidents du Travail) detaillee.
 *
 * Format attendu (extrait du PDF 2024 CTN A) :
 *   Nombre de salariés en activité 1 777 902 Indice de fréquence 22,6
 *   Nombre d'accidents du travail en premier règlement 40 161 Taux de fréquence 13,0
 *   dont avec au moins 4 jours d'arrêt 35 555 Taux de gravité 1,1
 *   Nombre de nouvelles incapacités permanentes 2 443 Indice de gravité 9,9
 *   Nombre de décès 59 Nombre d'établissements 120 802
 *   Nombre de journées perdues 3 309 177
 */
function parseFicheAt(text) {
  const t = normaliser(text)
  // Le separateur apres l'etiquette peut etre "" (moderne) ou " :" (ancien).
  const SEP = "\\s*:?"
  return {
    nbSalariesActivite: getNombre(t, LABEL_SALARIES + SEP),
    nb1erReglement: getNombre(
      t,
      "Nombre d['’]accidents d[eu] travail en (?:premier|1er) r[èe]glement" + SEP
    ),
    nbAvec4JoursArret: getNombre(
      t,
      "dont avec au moins 4 jours d['’]arr[êe]t" + SEP
    ),
    nbNouvellesIp: getNombre(
      t,
      "Nombre de nouvelles incapacit[ée]s permanentes" + SEP
    ),
    nbDeces: getNombre(t, "Nombre de d[ée]c[èe]s" + SEP),
    nbJourneesPerdues: getNombre(
      t,
      "Nombre de journ[ée]es perdues(?:\\s+par (?:incapacit[ée] temporaire|I\\.T\\.))?" + SEP
    ),
    indiceFrequence: getDecimal(t, "Indice de fr[ée]quence" + SEP),
    tauxFrequence: getDecimal(t, "Taux de fr[ée]quence" + SEP),
    tauxGravite: getDecimal(t, "Taux de gravit[ée]" + SEP),
    indiceGravite: getDecimal(t, "Indice de gravit[ée]" + SEP),
    nbEtablissements:
      getNombre(t, "Nombre d['’]?[ée]tablissements" + SEP) || null,
  }
}

/**
 * Parse une fiche TJ (Accidents de Trajet).
 * Format similaire a AT mais sans TF, TG, IG, etablissements.
 *
 * Note : l'IF affiche dans la fiche detaillee est en fait l'IF des AT (par
 * convention de mise en page du PDF). On le laisse a null, il sera recupere
 * depuis la fiche synthese plus tard.
 */
function parseFicheTj(text) {
  const t = normaliser(text)
  const SEP = "\\s*:?"
  return {
    nb1erReglement: getNombre(
      t,
      "Nombre d['’]accidents avec (?:premier|1er) r[èe]glement" + SEP
    ),
    nbAvec4JoursArret: getNombre(
      t,
      "dont avec au moins 4 jours d['’]arr[êe]t" + SEP
    ),
    nbNouvellesIp: getNombre(
      t,
      "Nombre de nouvelles incapacit[ée]s permanentes" + SEP
    ),
    nbDeces: getNombre(t, "Nombre de d[ée]c[èe]s" + SEP),
    nbJourneesPerdues: getNombre(
      t,
      "Nombre de journ[ée]es perdues(?:\\s+par (?:incapacit[ée] temporaire|I\\.T\\.))?" + SEP
    ),
    indiceFrequence: null, // recupere depuis la synthese plus tard
  }
}

/**
 * Parse une fiche MP (Maladies Professionnelles).
 * Format different : pas de TF/TG/IG/etablissements.
 *   Nombre de salariés en activité 1 777 902
 *   Nombre de maladies avec 1er règlement 6 237
 *   Nombre de nouvelles incapacités permanentes (taux compris entre 1% et 100%) 3 366
 *   Nombre de décès 56
 *   Nombre de journées perdues par incapacité temporaire 1 771 887
 */
function parseFicheMp(text) {
  const t = normaliser(text)
  const SEP = "\\s*:?"
  return {
    nbAvec1erReglement: getNombre(
      t,
      "Nombre de maladies avec (?:1er|premier) r[èe]glement" + SEP
    ),
    nbNouvellesIp: getNombre(
      t,
      "Nombre de nouvelles incapacit[ée]s permanentes(?:\\s*\\([^)]*\\))?" + SEP
    ),
    nbDeces: getNombre(t, "Nombre de d[ée]c[èe]s" + SEP),
    nbJourneesPerduesIt: getNombre(
      t,
      "Nombre de journ[ée]es perdues par (?:incapacit[ée] temporaire|I\\.T\\.)" + SEP
    ),
  }
}

/**
 * Etiquette "Nombre de salaries" et ses variantes selon le format PDF :
 *   - "Nombre de salaries" (2015-2018, format ancien sans suffixe)
 *   - "Nombre de salaries en activite" (2019, 2022-2024)
 *   - "Nombre de salaries en activite ou au chomage partiel" (2020)
 *   - "Nombre de salaries en activite (ou au chomage partiel)" (2021)
 *   - "Nombre de salaries en activite (ou au chomage partiel)*" (2021 page MP)
 */
const LABEL_SALARIES =
  "Nombre de salari[ée]s(?:\\s+en activit[ée](?:\\s*\\(?\\s*ou au ch[ôo]mage partiel\\)?\\*?)?)?"

/**
 * Parse le nombre de salaries en activite (mutualise AT/TJ/MP).
 */
function parseNbSalaries(text) {
  return getNombre(normaliser(text), LABEL_SALARIES + '\\s*:?')
}

/* ---------- Extraction par micro-blocs scalaires ---------- */

/**
 * Un "micro-bloc scalaire" est l'unite reelle de donnees dans le PDF AM :
 *   CTN : X
 *   Nombre de salaries en activite [valeur]
 *   Nombre d'[accidents/maladies] ... [valeur]
 *   ...autres scalaires...
 *   REPARTITION ...  <- limite haute
 *
 * Chaque CTN a typiquement 3 micro-blocs (AT/TJ/MP), parfois 4 dans les anciens
 * PDFs (la fiche SYNTHESE 2015-2018 contient un micro-bloc AT enrichi en
 * indices et taux que l'on n'a pas dans la fiche AT-page).
 *
 * Le decoupage par fiche (decouperFiches) est trop sensible aux variations de
 * mise en page (header vs footer du marqueur fiche). Travailler directement
 * sur les micro-blocs evite ces aleas.
 */
function extraireMicroBlocs(text) {
  const startRe = new RegExp(LABEL_SALARIES + '\\s*:?', 'g')
  const positions = []
  let m
  while ((m = startRe.exec(text)) !== null) positions.push(m.index)

  const limitesRe = [
    /REPARTITION/g,
    /N°\s*Libell/g,
    /\(1\)\s+Nombre d['’]/g,
    /(?:SYNTHESE|ACCIDENTS|MALADIES) ANNEE/g,
    /Code NAF\s*:/g,
  ]

  const blocs = positions.map((debut, i) => {
    let fin = i + 1 < positions.length ? positions[i + 1] : text.length
    for (const re of limitesRe) {
      const r = new RegExp(re.source, 'g')
      r.lastIndex = debut + 1
      const match = r.exec(text)
      if (match && match.index < fin) fin = match.index
    }
    return { debut, fin, contenu: text.slice(debut, fin) }
  })

  // Filtrer le bruit. Un VRAI micro-bloc CTN doit verifier :
  //   - longueur >= 100 chars,
  //   - presence d'au moins 2 labels "Nombre d..." (salaries + au moins un autre),
  //   - une valeur "Nombre de salaries" comprise entre 50 000 et 50 000 000.
  //     => exclut les "focus NAF" du PDF 2018 (sous-secteurs ~1 000 salaries
  //        avec "Nombre de maladies avec 1er reglement 6" qui seraient pris
  //        a tort pour le bloc MP CTN tous).
  //     => exclut les tableaux d'evolution sur 5 ans ("Nombre de salaries
  //        18 286 989 18 449 720 ...") dont la valeur captee, par concatenation,
  //        depasse 50 millions.
  //     => le seuil bas (50k) est confortable : le plus petit CTN (E ou F)
  //        a ~400k salaries.
  return blocs.filter((b) => {
    if (b.contenu.length < 100) return false
    const occurrencesNombre = (b.contenu.match(/Nombre d/gi) || []).length
    if (occurrencesNombre < 2) return false

    const matchVal = b.contenu.match(
      // Tolere "Nombre de salaries 18 449 720", "Nombre de salaries* 18 775 282",
      // "Nombre de salaries * 18 775 282" (espaces flottants autour de l'asterisque),
      // "Nombre de salaries : 18 449 720".
      new RegExp(
        '^' + LABEL_SALARIES + '\\s*\\*?\\s*:?\\s*(\\d{1,3}(?:\\s\\d{3})*)',
        'i'
      )
    )
    if (!matchVal) return false
    const valeur = parseNb(matchVal[1])
    if (valeur < 50000 || valeur > 50000000) return false

    return true
  })
}

/**
 * A partir des micro-blocs d'un CTN, identifie celui qui correspond a chaque
 * type (AT, TJ, MP). Strategie :
 *   - MP : presence du label distinctif "maladies avec 1er reglement".
 *   - AT : presence du label distinctif moderne "accidents du travail en
 *     premier reglement", OU richesse en labels AT-specifiques (Taux de
 *     frequence/gravite, Indice de gravite, Nombre d'etablissements) >= 2.
 *   - TJ : le DERNIER micro-bloc situe strictement entre blocAt et blocMp
 *     (ou null s'il n'y en a pas, ex. PDF 2023 sans fiche TJ publiee).
 */
function classerMicroBlocs(blocs) {
  const blocMp = blocs.find((b) =>
    /maladies avec (?:1er|premier) r[èe]glement/i.test(b.contenu)
  ) || null

  let blocAt = blocs.find((b) =>
    /accidents d[eu] travail en (?:premier|1er) r[èe]glement/i.test(b.contenu)
  ) || null

  if (!blocAt) {
    blocAt = blocs.find((b) => {
      let score = 0
      if (/Taux de fr[ée]quence/i.test(b.contenu)) score++
      if (/Taux de gravit[ée]/i.test(b.contenu)) score++
      if (/Indice de gravit[ée]/i.test(b.contenu)) score++
      if (/Nombre d['’]?[ée]tablissements/i.test(b.contenu)) score++
      return score >= 2
    }) || null
  }

  let blocTj = null
  if (blocAt && blocMp) {
    const candidats = blocs.filter(
      (b) => b.debut > blocAt.debut && b.debut < blocMp.debut
    )
    blocTj = candidats[candidats.length - 1] || null
  } else if (blocAt && !blocMp) {
    // Cas theorique : pas de bloc MP. On prend le dernier bloc apres AT.
    const candidats = blocs.filter((b) => b.debut > blocAt.debut)
    blocTj = candidats[candidats.length - 1] || null
  }

  return { blocAt, blocTj, blocMp }
}

/* ---------- Decoupage par "bloc CTN" pour Top MP & repartitions ---------- */

/**
 * Construit la regex des balises CTN (identique a celle de decouperFiches).
 * Mise dans une fonction separee pour eviter la duplication de la logique.
 *
 * Une "balise CTN" identifie le debut d'une section CTN dans le PDF :
 *   - "9 CTN : ENSEMBLE DES NEUF GRANDES BRANCHES..." pour le code "tous"
 *   - "CTN : A" ou "CTN A : Industries de la metallurgie" pour les codes A-I
 *
 * Le lookahead vers un marqueur de fiche garantit qu'on capture une vraie
 * balise (et pas un titre interne similaire).
 */
function regexBalisesCtn() {
  const APRES_MARQUEUR =
    '(?=\\s*\\n\\s*(?:SYNTHESE|ACCIDENTS|MALADIES) ANNEE\\s+\\d{4})'
  return new RegExp(
    [
      '((?:(?:9\\s+CTN|CTN(?:\\s+9CTN)?)\\s*:\\s*)?ENSEMBLE DES NEUF GRANDES BRANCHES[^\\n]*)' +
        APRES_MARQUEUR,
      '|(CTN(?:\\s+9CTN)?\\s*:\\s*9\\s*CTN[^\\n]*)' + APRES_MARQUEUR,
      '|(9\\s+CTN)' + APRES_MARQUEUR,
      '|CTN\\s*:\\s*([A-I])I?' + APRES_MARQUEUR,
      '|CTN\\s+([A-I])\\s*:[^\\n]*' + APRES_MARQUEUR,
    ].join(''),
    'g'
  )
}

/**
 * Decoupe le texte brut du PDF en "blocs CTN" : un bloc par CTN qui contient
 * la page de SYNTHESE du CTN (= 1ere page) ou se trouvent le "Top MP" et
 * les "Repartitions des AT par risque/siege/nature".
 *
 * Subtilite cle : la balise CTN ("CTN : A", "9 CTN : ENSEMBLE..." etc.) est
 * en PIED DE PAGE de la fiche synthese, pas en en-tete. Donc le contenu
 * utile de la page synthese N est AVANT la balise N, pas apres.
 *
 * Strategie :
 *   - bloc CTN tous : de 0 a la balise tous (= sa propre page synthese)
 *   - bloc CTN A    : de la balise tous a la balise A (= contient AT/TJ/MP
 *                     du tous, puis la page synthese A juste avant la balise A)
 *   - bloc CTN B    : de la balise A a la balise B
 *   - ...
 *   - bloc CTN I    : de la balise H a la balise I
 *
 * Cette zone est "large" (capture aussi les fiches AT/TJ/MP du CTN
 * precedent), mais les regex de Top MP et repartitions (libelles tres
 * specifiques) ne matchent que dans la page synthese : le risque de faux
 * positif est faible.
 *
 * Cette fonction est complementaire a `decouperFiches` :
 *   - decouperFiches : decoupage fin par fiche, pour les scalaires
 *     ("Nombre de salaries", "Indice de frequence", ...).
 *   - decouperBlocsCtn : decoupage par "page synthese", pour les sections
 *     inline ("Top MP", "Repartition par risque/siege/nature").
 */
function decouperBlocsCtn(text) {
  const re = regexBalisesCtn()
  const balises = []
  let m
  while ((m = re.exec(text)) !== null) {
    const code = m[4] || m[5] || 'tous'
    balises.push({ pos: m.index, code })
  }

  // Ordre PDF : trier par position. Pour chaque CTN, prendre la PREMIERE
  // occurrence (les balises se repetent en bas de chaque page d'un meme CTN).
  balises.sort((a, b) => a.pos - b.pos)
  const premiereBalise = {}
  for (const b of balises) {
    if (premiereBalise[b.code] === undefined) premiereBalise[b.code] = b.pos
  }

  // Fallback pour le CTN "tous" : dans certains PDFs anciens (ex: 2017), la
  // balise "ENSEMBLE DES NEUF GRANDES BRANCHES" n'est pas suivie d'un
  // marqueur "SYNTHESE/ACCIDENTS/MALADIES ANNEE YYYY", donc le lookahead de
  // regexBalisesCtn ne matche pas. On cherche alors la PREMIERE occurrence
  // brute "ENSEMBLE DES NEUF GRANDES BRANCHES" (= pied de page de la
  // 1ere page synthese tous), suivante du debut du texte.
  if (premiereBalise.tous === undefined) {
    const fallback = text.indexOf('ENSEMBLE DES NEUF GRANDES BRANCHES')
    if (fallback >= 0) premiereBalise.tous = fallback
  }

  // Ordre PDF des CTN (typiquement tous, A, B, C, D, E, F, G, H, I).
  const ordreCtn = Object.entries(premiereBalise)
    .sort(([, a], [, b]) => a - b)
    .map(([code]) => code)

  // Bloc CTN N = de la balise du CTN N-1 (ou 0 pour le 1er) a la balise du
  // CTN N. Cela capture la page synthese du CTN N, qui est juste avant sa
  // balise, ainsi que les fiches AT/TJ/MP du CTN N-1 (ce qui est sans
  // consequence car les Top MP / repartitions y sont absentes).
  const blocs = {}
  for (let i = 0; i < ordreCtn.length; i++) {
    const code = ordreCtn[i]
    const debut = i === 0 ? 0 : premiereBalise[ordreCtn[i - 1]]
    const fin = premiereBalise[code]
    blocs[code] = text.slice(debut, fin)
  }

  return blocs
}

/* ---------- Extraction des donnees detaillees (TMS, Top MP, repartitions) ---------- */

/**
 * Extrait le nombre total de TMS d'un CTN.
 *
 * Format PDF : "Répartition des Troubles Musculo-Squelettiques (TMS) par syndrome
 * (année YYYY)\ntotal TMS : 44 723 TMS en 1er règlement\n..."
 *
 * Cette information se trouve dans la fiche MP de chaque CTN. Pour le "tous CTN",
 * la valeur inclut le compte special (mention explicite dans le PDF).
 */
function parseTotalTms(text) {
  const t = normaliser(text)
  const m = t.match(/total TMS\s*:?\s*(\d{1,3}(?:\s\d{3})*)\s*TMS en 1er/i)
  return m ? parseNb(m[1]) : 0
}

/**
 * Liste ordonnee des 6 localisations anatomiques telles que le PDF AM
 * les place dans le texte (depuis 2015). Verifie par observation :
 * sur 40 cas (2015-2024 x 10 CTN), la somme des % est toujours ~100.
 */
const TMS_LOCALISATIONS_ORDRE = [
  'coude',
  'main, poignet, doigts',
  'épaule',
  'genou',
  'cheville, pied',
  'dos',
]

/**
 * Extrait la repartition TMS par localisation anatomique (6 categories).
 *
 * Le PDF affiche un graphique radial. Les 6 % sont rendus sous forme
 * d'une sequence consecutive "\nXX%\nYY%\nZZ%\n..." juste avant le libelle
 * "Coiffe des rotateurs tendinopathie (T57)".
 *
 * @param {string} text - Texte de la fiche MP (qui contient la zone TMS).
 * @returns {Array<{localisation: string, pourcentage: number}>}
 */
function parseTmsParLocalisation(text) {
  if (!text) return []
  const idxCoiffe = text.indexOf('Coiffe des rotateurs')
  if (idxCoiffe < 0) return []

  // Capturer la sequence consecutive de "XX%\n" juste avant "Coiffe".
  // La regex evite que "8%" soit confondu avec "18%" via le lookbehind.
  const avant = text.slice(Math.max(0, idxCoiffe - 100), idxCoiffe)
  const pcts = [...avant.matchAll(/(?<!\d)(\d{1,2})%(?=\n)/g)].map((m) =>
    parseInt(m[1], 10)
  )

  // On attend exactement 6 % qui somment a ~100%.
  if (pcts.length !== 6) return []
  const somme = pcts.reduce((a, b) => a + b, 0)
  if (somme < 95 || somme > 105) return []

  return TMS_LOCALISATIONS_ORDRE.map((loc, i) => ({
    localisation: loc,
    pourcentage: pcts[i],
  }))
}

/**
 * Echappe les metacaracteres regex d'un libelle pour qu'il soit utilisable
 * tel quel dans une regex.
 */
function echapperRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Parse le "Top des maladies professionnelles" d'un CTN (typiquement 5-6 lignes).
 *
 * Format PDF :
 *   Code tableau Libellé du tableau Nb MP % Nb {annee-1}
 *   057A Affections périarticulaires 39 498 82% 36 801
 *   098A Aff. Rachis lombaire/manutention charges lourdes 2 182 5% 2 229
 *   030A Aff/amiante 926 2% 914
 *   Hors tableau Alinéa 7 2 451 5% 2 167
 *   Autres MP 2 079 4% 1 942
 *
 * Les lignes sont entrelacees avec d'autres tableaux (mise en page 2 colonnes),
 * mais le pattern "{code} {libelle} {nb} {pct}% {nb_prec}" reste distinctif.
 *
 * Pour les codes specifiques (057A, 030A, ...), un libelle suit le code.
 * Pour les codes auto-suffisants ("Hors tableau Alinéa N", "Autres MP",
 * "Autres Alinéa N"), il n'y a pas de libelle separe.
 */
function parseTopMp(text) {
  const t = normaliser(text)
  const lignes = []
  const vus = new Set()

  // Ancrage : on restreint la recherche au TABLEAU "Top MP" reel, qui debute
  // par le header "Code tableau Libellé du tableau Nb MP % Nb YYYY". Sans cet
  // ancrage, le regex peut avaler par erreur des fragments de la fiche
  // synthese (ex: "051Z Nombre de salariés 1 661 Nombre d'accidents... 057A
  // Affections périarticulaires 37 316 82% 35 686") et capturer un faux code
  // MP, ce qui fait rater le vrai 057A.
  //
  // On prend une fenetre de 1500 caracteres apres le header (= place pour 6
  // lignes de tableau, marges de securite incluses). Si le header n'est pas
  // trouve, on garde le texte entier (compatibilite avec d'eventuels PDFs au
  // format different).
  const header = /Code tableau\s+Libell[ée] du tableau\s+Nb MP\s+%\s+Nb \d{4}/i
  const mHeader = t.match(header)
  const zone = mHeader
    ? t.slice(mHeader.index, mHeader.index + 1500)
    : t

  // Pattern 1 : codes 057A / 030A / 098A / 042A / 030B / 069A / 079A / 097A...
  // Le libelle peut contenir n'importe quels caracteres, mais on s'arrete
  // au premier nombre (qui est forcement la valeur nb). Le libelle ne doit
  // pas commencer par un chiffre (pour ne pas attraper les lignes du tableau
  // d'evolution sur 5 ans qui suivent un code numerique).
  // Lookahead (?![A-Z]) sur les nombres : evite que "4 541 030A" capture
  // "4 541 030" comme nb_prec en avalant le "030" du code MP suivant.
  // Lookahead (?!\d) : evite la concatenation avec des chiffres adjacents.
  const re1 = /(\d{3}[A-Z])\s+([^\d][^]*?)\s+(\d{1,3}(?:\s\d{3})*)(?![A-Z\d])\s+(\d+)%\s+(\d{1,3}(?:\s\d{3})*)(?![A-Z\d])/g
  let m
  while ((m = re1.exec(zone)) !== null) {
    const code = m[1]
    if (vus.has(code)) continue
    const libelle = m[2].trim()
    // Sanity check : le libelle doit etre raisonnable (pas trop long, pas
    // un fragment d'autre tableau). Les libelles MP font typiquement
    // 5-60 caracteres.
    if (libelle.length > 80) continue
    vus.add(code)
    lignes.push({
      codeTableau: code,
      libelle,
      nbMp: parseNb(m[3]),
      pourcentage: parseInt(m[4], 10),
      nbMpAnneePrecedente: parseNb(m[5]) || null,
    })
  }

  // Pattern 2 : libelles auto-suffisants. Pas de libelle separe a extraire.
  // Memes lookahead que re1 pour eviter d'avaler le code de la ligne suivante.
  const re2 = /(Hors tableau Alin[ée]a \d|Autres Alin[ée]a \d|Autres MP)\s+(\d{1,3}(?:\s\d{3})*)(?![A-Z\d])\s+(\d+)%\s+(\d{1,3}(?:\s\d{3})*)(?![A-Z\d])/g
  while ((m = re2.exec(zone)) !== null) {
    const libelle = m[1]
    if (vus.has(libelle)) continue
    vus.add(libelle)
    lignes.push({
      codeTableau: libelle, // pas de code reel, on stocke le libelle comme code
      libelle,
      nbMp: parseNb(m[2]),
      pourcentage: parseInt(m[3], 10),
      nbMpAnneePrecedente: parseNb(m[4]) || null,
    })
  }

  // Tri par pourcentage decroissant pour avoir le vrai "top".
  lignes.sort((a, b) => b.pourcentage - a.pourcentage)
  return lignes
}

/**
 * Libelles connus pour chaque type de repartition de la fiche SYNTHESE.
 *
 * Les libelles ont ete extraits manuellement des PDFs 2015-2024. Certains
 * sont specifiques a certains CTN (ex: "Risque routier" pour le CTN B,
 * "Machines" pour le CTN A). Ils sont quand meme dans la liste : si un CTN
 * ne les contient pas, on ne les ajoute pas dans le resultat.
 *
 * Le libelle "Autre" est exclu : il apparait dans plusieurs categories
 * (parRisque et parNatureLesion), ce qui rend son extraction ambigue.
 * Si besoin, l'app peut calculer "Autre = 100 - somme des autres".
 */
const LIBELLES_RISQUE = [
  'Manutention manuelle',
  'Chutes de plain-pied',
  'Chutes de hauteur',
  'Outillage à main',
  'Agressions (y compris par animaux)',
  'Risque routier',
  'Machines',
  'Inconnue ou non précisée',
]

const LIBELLES_SIEGE = [
  // Variantes pour "Tête et cou" (avec/sans la mention "y compris yeux")
  ['Tête et cou', 'Tête et cou, y compris yeux'],
  // "Membres supérieurs" est suivi d'une virgule puis du % puis "y compris doigts et mains"
  ['Membres supérieurs'],
  ['Torse et organes'],
  ['Dos'],
  ['Membres inférieurs'],
  ['Multiples endroits du corps affectés'],
]

const LIBELLES_NATURE = [
  // L'ordre compte : on cherche les libelles longs d'abord pour eviter
  // que "Traumatismes internes" matche aussi "Commotions et traumatismes internes".
  'Commotions et traumatismes internes',
  'Traumatismes internes',
  'Entorses et foulures',
  'Chocs traumatiques',
  'Plaies ouvertes',
]

/**
 * Cherche un pourcentage entier qui suit immediatement un libelle dans le texte.
 *
 * Tolerances :
 *   - virgule optionnelle apres le libelle (ex: "Membres supérieurs, 33%")
 *   - 1 a 40 caracteres entre le libelle et le pourcentage (texte parasite
 *     de l'autre colonne du PDF)
 *   - le pourcentage est suivi de "%" eventuellement separe par des espaces
 *
 * Renvoie null si non trouve.
 */
function chercherPourcentage(text, libelle) {
  const re = new RegExp(
    echapperRegex(libelle) + ',?\\s+(\\d+)\\s*%',
    'i'
  )
  const m = text.match(re)
  return m ? parseInt(m[1], 10) : null
}

/**
 * Parse les 3 repartitions en pourcentage (par risque, siege, nature) d'une
 * fiche SYNTHESE.
 *
 * Strategie : pour chaque libelle de la liste, chercher son pourcentage dans
 * le texte. Si trouve, l'ajouter au resultat. L'ordre du resultat suit la
 * valeur du pourcentage (decroissant) pour faciliter l'affichage UI.
 */
function parseRepartitionsSynthese(text) {
  const t = normaliser(text)

  const parRisque = []
  for (const libelle of LIBELLES_RISQUE) {
    const pct = chercherPourcentage(t, libelle)
    if (pct !== null) parRisque.push({ libelle, pourcentage: pct })
  }

  const parSiegeLesion = []
  for (const variantes of LIBELLES_SIEGE) {
    // Essayer les variantes du plus long au plus court pour eviter les faux positifs.
    const ordreLong = [...variantes].sort((a, b) => b.length - a.length)
    for (const v of ordreLong) {
      const pct = chercherPourcentage(t, v)
      if (pct !== null) {
        parSiegeLesion.push({ libelle: variantes[0], pourcentage: pct })
        break
      }
    }
  }

  const parNatureLesion = []
  const dejaVus = new Set()
  for (const libelle of LIBELLES_NATURE) {
    const pct = chercherPourcentage(t, libelle)
    if (pct !== null && !dejaVus.has(libelle)) {
      parNatureLesion.push({ libelle, pourcentage: pct })
      dejaVus.add(libelle)
    }
  }

  // Tri decroissant pour faciliter l'affichage UI (top des plus frequents).
  parRisque.sort((a, b) => b.pourcentage - a.pourcentage)
  parSiegeLesion.sort((a, b) => b.pourcentage - a.pourcentage)
  parNatureLesion.sort((a, b) => b.pourcentage - a.pourcentage)

  return { parRisque, parSiegeLesion, parNatureLesion }
}

/* ---------- Assemblage par annee ---------- */

/**
 * Extrait les metadonnees du PDF (reference interne et date de publication)
 * depuis les premieres lignes du texte. Renvoie des valeurs eventuellement
 * indefinies si le format a change.
 *
 * Exemple de donnees cibles (PDF 2024) :
 *   "2026-026-CTN.docx"  -> referenceCnam = "2026-026"
 *   "2026-04-01"         -> datePublication = "2026-04-01"
 */
function extraireMetadonnees(text) {
  const head = text.slice(0, 3000)
  const ref = head.match(/(\d{4}-\d{3,})-CTN\.docx/)
  const date = head.match(/(\d{4}-\d{2}-\d{2})/)
  return {
    referenceCnam: ref ? ref[1] : undefined,
    datePublication: date ? date[1] : undefined,
  }
}

async function parseAnnee(annee) {
  const txtPath = path.join(ROOT, 'data', 'pdf-source', `${annee}.txt`)
  console.log(`[${annee}] Lecture ${txtPath}`)
  const text = await readFile(txtPath, 'utf-8')

  const meta = extraireMetadonnees(text)
  const fiches = decouperFiches(text, annee)
  const blocsCtn = decouperBlocsCtn(text)
  console.log(`[${annee}] ${fiches.length} fiches detectees`)

  // Indexer par (ctn, type). On garde la DERNIERE fiche trouvee plutot que
  // la premiere : pour le PDF 2018, les fiches "intro" (sous-secteurs NAF
  // ou ensemble de pages d'introduction) apparaissent en premier et seraient
  // selectionnees a tort. Les vraies fiches arrivent toujours apres.
  const index = {}
  for (const f of fiches) {
    const key = `${f.ctn}/${f.type}`
    index[key] = f.contenu
  }

  const ctns = []
  for (const code of CTN_CODES) {
    // Strategie : on concatene toutes les fiches d'un CTN (synthese + AT + TJ
    // + MP) puis on extrait les micro-blocs scalaires. Chaque micro-bloc est
    // identifie par ses labels distinctifs (cf. classerMicroBlocs). Cette
    // approche est independante de la mise en page du PDF (header vs footer).
    const texteCtn = [
      index[`${code}/SYNTHESE`],
      index[`${code}/ACCIDENTS DU TRAVAIL`],
      index[`${code}/ACCIDENTS DE TRAJET`],
      index[`${code}/MALADIES PROFESSIONNELLES`],
    ]
      .filter(Boolean)
      .join('\n')

    const blocs = extraireMicroBlocs(texteCtn)
    const { blocAt, blocTj, blocMp } = classerMicroBlocs(blocs)

    const at = blocAt
      ? parseFicheAt(blocAt.contenu)
      : parseFicheAt('') // bloc vide => tous les champs a 0/null
    const tj = blocTj
      ? parseFicheTj(blocTj.contenu)
      : parseFicheTj('')
    const mp = blocMp
      ? parseFicheMp(blocMp.contenu)
      : parseFicheMp('')

    // ---- Repartitions detaillees des fiches AT et TJ ----
    // Les balises de fiches (SYNTHESE / ACCIDENTS DU TRAVAIL / ACCIDENTS DE
    // TRAJET / MALADIES PROFESSIONNELLES) sont en PIED de page dans les PDFs
    // AM 2015-2024. Ce qui SUIT chaque balise est donc la page SUIVANTE.
    // Mapping reel :
    //   index[CTN+'/SYNTHESE']            -> contient la fiche AT detaillee
    //   index[CTN+'/ACCIDENTS DU TRAVAIL'] -> contient la fiche TJ detaillee
    //   index[CTN+'/ACCIDENTS DE TRAJET']  -> contient la fiche MP detaillee
    // (cf. audit-repartitions.md section "Decalage des balises".)
    //
    // Les sections REPARTITION sont identiques entre AT et TJ (Age, Sexe,
    // Qualification, Siege, Deviation, Agent materiel, Nature, Activite
    // physique, Modalite blessure). Le meme parser fonctionne pour les deux.

    function extraireRepartitions(texte) {
      if (!texte) return null
      const brut = parseRepartitionsAt(texte)
      const filtrees = {}
      let nbRempli = 0
      for (const [k, v] of Object.entries(brut)) {
        if (v.length > 0) {
          filtrees[k] = v
          nbRempli++
        }
      }
      return nbRempli > 0 ? filtrees : null
    }

    const repartAt = extraireRepartitions(index[`${code}/SYNTHESE`])
    if (repartAt) at.repartitions = repartAt

    // Mapping conditionnel selon le format du PDF :
    //   - Format STANDARD (2015-2021, 2024) : 5 pages par CTN
    //       SYNTHESE          -> AT detaillee
    //       ACCIDENTS TRAVAIL -> TJ detaillee
    //       ACCIDENTS TRAJET  -> MP detaillee
    //   - Format REDUIT (2023 uniquement) : 4 pages par CTN, PAS DE FICHE TJ
    //       SYNTHESE          -> AT detaillee
    //       ACCIDENTS TRAVAIL -> MP detaillee (= page suivante directe, pas TJ)
    // On detecte le format en regardant si la balise 'ACCIDENTS DE TRAJET'
    // existe pour ce CTN.
    const texteApresAt = index[`${code}/ACCIDENTS DU TRAVAIL`]
    const texteApresTj = index[`${code}/ACCIDENTS DE TRAJET`]
    const formatReduit = !texteApresTj
    const texteFicheTj = formatReduit ? null : texteApresAt
    const texteFicheMp = formatReduit ? texteApresAt : texteApresTj

    if (texteFicheTj) {
      const repartTj = extraireRepartitions(texteFicheTj)
      if (repartTj) tj.repartitions = repartTj
    }

    // Repartitions MP : 4 sections (Age, Profession, Sexe, Duree d'exposition).
    if (texteFicheMp) {
      const brut = parseRepartitionsMp(texteFicheMp)
      const filtrees = {}
      let nbRempli = 0
      for (const [k, v] of Object.entries(brut)) {
        if (v.length > 0) {
          filtrees[k] = v
          nbRempli++
        }
      }
      if (nbRempli > 0) mp.repartitions = filtrees

      // Liste MP par code tableau cible (TMS, lombalgies, surdite, etc.)
      const listeParTableau = parseListeMpCibles(texteFicheMp)
      if (listeParTableau.length > 0) mp.listeParTableau = listeParTableau
    }

    // nbSalariesActivite : on prend la valeur du bloc AT (la plus fiable),
    // puis fallback TJ puis MP si AT absent.
    const nbSalariesActivite =
      (blocAt && parseNbSalaries(blocAt.contenu)) ||
      (blocTj && parseNbSalaries(blocTj.contenu)) ||
      (blocMp && parseNbSalaries(blocMp.contenu)) ||
      0

    // ---- Donnees detaillees ----
    // Top MP et repartitions en % sont sur la PAGE 1 (= fiche SYNTHESE) du
    // CTN, qui est juste AVANT la balise CTN dans le PDF. On les extrait
    // depuis le "bloc CTN" decoupe par decouperBlocsCtn (= page synthese).
    //
    // Le total TMS est dans la fiche MP detaillee du CTN, indexee a part
    // (apres la balise CTN). On l'extrait depuis la fiche MP.
    const blocCtn = blocsCtn[code] || ''
    const ficheMp = index[`${code}/MALADIES PROFESSIONNELLES`] || ''
    const topMp = parseTopMp(blocCtn)
    const totalTms = parseTotalTms(ficheMp)
    const tmsParLocalisation = parseTmsParLocalisation(ficheMp)
    const repartitionsSynthese = parseRepartitionsSynthese(blocCtn)

    const stats = {
      code,
      libelle: CTN_LIBELLES[code],
      nbSalariesActivite,
      at,
      tj,
      mp,
      topMp,
    }
    if (totalTms > 0) {
      stats.focusTms = { totalTms }
      if (tmsParLocalisation.length > 0) {
        stats.focusTms.parLocalisation = tmsParLocalisation
      }
    }
    if (
      repartitionsSynthese.parRisque.length > 0 ||
      repartitionsSynthese.parSiegeLesion.length > 0 ||
      repartitionsSynthese.parNatureLesion.length > 0
    ) {
      stats.repartitionsSynthese = repartitionsSynthese
    }
    ctns.push(stats)
  }

  // On construit l'objet de facon a ne pas serialiser les cles undefined.
  const data = { annee: parseInt(annee, 10) }
  if (meta.datePublication) data.datePublication = meta.datePublication
  if (meta.referenceCnam) data.referenceCnam = meta.referenceCnam
  data.ctns = ctns
  return data
}

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: node scripts/parse-pdf-stats.mjs <annee|all>')
    process.exit(1)
  }

  const annees = arg === 'all' ? [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2023, 2024] : [parseInt(arg, 10)]

  for (const annee of annees) {
    const data = await parseAnnee(annee)
    const outPath = path.join(ROOT, 'src', 'data', 'stats-am', `${annee}.json`)
    await writeFile(outPath, JSON.stringify(data, null, 2))
    console.log(`[${annee}] Ecrit ${outPath}`)

    // Resume pour validation
    for (const ctn of data.ctns) {
      console.log(
        `  ${ctn.code.padEnd(5)} | AT: ${ctn.at.nb1erReglement.toString().padStart(7)} | TJ: ${ctn.tj.nb1erReglement
          .toString()
          .padStart(6)} | MP: ${ctn.mp.nbAvec1erReglement.toString().padStart(6)} | salaries: ${ctn.nbSalariesActivite.toString().padStart(10)}`
      )
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
