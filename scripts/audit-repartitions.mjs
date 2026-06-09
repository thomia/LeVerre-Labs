/**
 * Audit des sections REPARTITION dans les fiches AT / TJ / MP.
 *
 * Objectif : pour chaque type de fiche (AT, TJ, MP), lister :
 *   - les sections REPARTITION presentes
 *   - les libelles attendus dans chaque section
 *   - la stabilite entre annees (2015 vs 2018 vs 2024)
 *
 * Pas d'extraction reelle ici : juste de l'observation pour preparer
 * le plan d'extraction.
 *
 * Usage : node scripts/audit-repartitions.mjs > docs/audit-repartitions.txt
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Decoupe le texte d'un PDF en fiches AT/TJ/MP par CTN.
 * Reprend la logique d'extraction du parser principal mais simplifiee.
 */
function extraireFichesSimple(text, annee) {
  // Marqueurs de fiches : SYNTHESE / ACCIDENTS DU TRAVAIL / ACCIDENTS DE TRAJET / MP
  // Tolere "DE TRAVAIL" (faute possible) et l'annee.
  const marqueursRe = new RegExp(
    '(SYNTHESE|ACCIDENTS D[EU] TRAVAIL|ACCIDENTS DE TRAJET|MALADIES PROFESSIONNELLES)\\s+ANNEE\\s+' +
      annee,
    'g'
  )
  const marqueurs = []
  let m
  while ((m = marqueursRe.exec(text)) !== null) {
    let type = m[1].replace(/D[EU] TRAVAIL/, 'DU TRAVAIL')
    marqueurs.push({ pos: m.index, fin: m.index + m[0].length, type })
  }

  // On en deduit les fiches : 4 marqueurs par CTN, dans l'ordre SYNTHESE / AT / TJ / MP.
  // On ne va pas etre tres precis sur le CTN (on assume que les 4 premiers
  // marqueurs sont pour "tous CTN", ce qui est verifie sur les PDF 2015-2024).
  const fiches = []
  for (let i = 0; i < marqueurs.length; i++) {
    const cur = marqueurs[i]
    const next = marqueurs[i + 1]
    const debut = cur.fin
    const fin = next ? next.pos : text.length
    fiches.push({ type: cur.type, contenu: text.slice(debut, fin) })
  }
  return fiches
}

/**
 * Liste les sections REPARTITION presentes dans un texte de fiche.
 * Ne s'occupe pas du contenu, juste des titres.
 */
function listerSections(contenu) {
  const re = /REPARTITION\s+(?:SUIVANT|SELON)\s+([^\n]{1,90}?)(?=\s+\d|\s+\(1\)|$)/g
  const sections = new Set()
  let m
  while ((m = re.exec(contenu)) !== null) {
    let titre = m[1].trim()
    // Nettoyer : enlever les morceaux de la colonne adjacente qui auraient pu
    // s'inserer (heuristique : tout ce qui suit "REPARTITION ..." dans la meme
    // ligne).
    titre = titre.split(/REPARTITION/)[0].trim()
    if (titre) sections.add(titre)
  }
  return [...sections]
}

/**
 * Extrait, pour chaque libelle candidat connu, sa position et les 4 nombres
 * qui le suivent. Permet de verifier qu'on peut effectivement parser.
 */
function extraireLignes(contenu, libellesCandidats) {
  const lignes = []
  for (const lib of libellesCandidats) {
    // Regex : libelle exact suivi de 4 nombres (entiers ou avec espaces).
    const re = new RegExp(
      lib.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '\\s+(\\d{1,3}(?:\\s\\d{3})*)\\s+(\\d{1,3}(?:\\s\\d{3})*)\\s+(\\d{1,3}(?:\\s\\d{3})*)\\s+(\\d{1,3}(?:\\s\\d{3})*)',
      'g'
    )
    const m = re.exec(contenu)
    if (m) {
      lignes.push({ lib, vals: [m[1], m[2], m[3], m[4]] })
    } else {
      lignes.push({ lib, vals: null })
    }
  }
  return lignes
}

/* ---------- Catalogue des libelles connus (a affiner) ---------- */

const LIBELLES_AGE = [
  'Non précisé',
  'Moins de 20 ans',
  'de 20 à 24 ans',
  'de 25 à 29 ans',
  'de 30 à 34 ans',
  'de 35 à 39 ans',
  'de 40 à 49 ans',
  'de 50 à 59 ans',
  'de 60 à 64 ans',
  '65 ans et plus',
]

const LIBELLES_SEXE = ['Masculin', 'Féminin']

const LIBELLES_QUALIFICATION = [
  'Non précisé',
  'Cadres, techniciens, a.m.',
  'Employés',
  'Apprentis',
  'Elèves',
  'Ouvriers non qualifiés',
  'Ouvriers qualifiés',
  'Divers',
  'Non codés',
]

/* ---------- Programme principal ---------- */

async function main() {
  const annees = [2015, 2018, 2024]

  for (const annee of annees) {
    const txt = await readFile(
      path.join(ROOT, 'data', 'pdf-source', `${annee}.txt`),
      'utf-8'
    )
    const fiches = extraireFichesSimple(txt, annee)

    console.log(`\n========== ANNEE ${annee} ==========`)
    console.log(`Nombre de fiches detectees : ${fiches.length}`)

    // On prend les 4 premieres fiches (= "tous CTN" : SYNTHESE / AT / TJ / MP)
    const tousCtn = fiches.slice(0, 4)
    for (const f of tousCtn) {
      console.log(`\n--- ${f.type} (tous CTN, ${f.contenu.length} chars) ---`)
      const sections = listerSections(f.contenu)
      console.log(`  ${sections.length} sections trouvees :`)
      for (const s of sections) console.log(`    • ${s}`)
    }

    // Pour la fiche AT, on teste l'extraction des 3 sections demographiques
    const ficheAt = tousCtn.find((f) => f.type === 'ACCIDENTS DU TRAVAIL')
    if (ficheAt) {
      console.log('\n--- Test extraction AGE (fiche AT tous CTN) ---')
      for (const r of extraireLignes(ficheAt.contenu, LIBELLES_AGE)) {
        console.log(
          `  ${r.lib.padEnd(20)} : ${r.vals ? r.vals.join(' | ') : 'NON TROUVE'}`
        )
      }
      console.log('\n--- Test extraction SEXE (fiche AT tous CTN) ---')
      for (const r of extraireLignes(ficheAt.contenu, LIBELLES_SEXE)) {
        console.log(
          `  ${r.lib.padEnd(20)} : ${r.vals ? r.vals.join(' | ') : 'NON TROUVE'}`
        )
      }
      console.log('\n--- Test extraction QUALIFICATION (fiche AT tous CTN) ---')
      for (const r of extraireLignes(ficheAt.contenu, LIBELLES_QUALIFICATION)) {
        console.log(
          `  ${r.lib.padEnd(30)} : ${r.vals ? r.vals.join(' | ') : 'NON TROUVE'}`
        )
      }
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
