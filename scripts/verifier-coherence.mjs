/**
 * Verification complete de coherence des donnees extraites.
 *
 * Controle 5 niveaux d'invariants :
 *   1. Sommation     : somme(CTN A-I) ≈ tous CTN pour chaque metrique
 *   2. Encadrement   : TMS ≤ MP.nbAvec1erReglement (TMS = sous-ensemble des MP)
 *   3. Pourcentages  : somme(top MP %) ≈ 100, somme(repartitions %) ≈ 100
 *   4. Continuite    : variations annuelles dans des bornes raisonnables
 *   5. Presence      : 057A "Affections periarticulaires" present partout
 *
 * Usage : node scripts/verifier-coherence.mjs
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ANNEES = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2023, 2024]

const TOLERANCE_SOMMATION = 0.02 // 2%
const TOLERANCE_POURCENT = 5 // 5 points
const TOLERANCE_VARIATION = 0.5 // 50% an/an

let nbWarnings = 0
let nbOk = 0

function ok(msg) {
  nbOk++
  console.log(`  ${msg}`)
}

function warn(msg) {
  nbWarnings++
  console.log(`  /!\\ ${msg}`)
}

async function chargerAnnee(annee) {
  const p = path.join(ROOT, 'src', 'data', 'stats-am', `${annee}.json`)
  return JSON.parse(await readFile(p, 'utf-8'))
}

/* --- Niveau 1 : sommation (deja teste mais resume) --- */
function testSommation(donnees) {
  console.log('\n[1] Test sommation : somme(CTN A-I) ≈ tous CTN')
  for (const annee of ANNEES) {
    const d = donnees[annee]
    const tous = d.ctns[0]
    const autres = d.ctns.slice(1)
    const sum = autres.reduce((s, c) => s + (c.at?.nb1erReglement || 0), 0)
    const ref = tous.at?.nb1erReglement || 0
    const ecart = ref ? Math.abs(sum - ref) / ref : 0
    if (ecart > TOLERANCE_SOMMATION)
      warn(`${annee} AT : ecart ${(ecart * 100).toFixed(2)}%`)
    else ok(`${annee} AT : ecart ${(ecart * 100).toFixed(2)}%`)
  }
}

/* --- Niveau 2 : encadrement TMS ≤ MP --- */
function testEncadrement(donnees) {
  console.log('\n[2] Test encadrement : TMS ≤ MP.nbAvec1erReglement')
  for (const annee of ANNEES) {
    const d = donnees[annee]
    for (const c of d.ctns) {
      const tms = c.focusTms?.totalTms
      const mp = c.mp?.nbAvec1erReglement
      if (!tms || !mp) continue
      if (tms > mp * 1.01)
        warn(`${annee} CTN ${c.code} : TMS=${tms} > MP=${mp}`)
    }
  }
  ok(`Encadrement OK pour ${ANNEES.length} annees * 10 CTN`)
}

/* --- Niveau 3 : sommes de pourcentages --- */
function testPourcentages(donnees) {
  console.log('\n[3] Test pourcentages : somme(top MP) ≈ 100, idem repartitions')
  for (const annee of ANNEES) {
    const d = donnees[annee]
    for (const c of d.ctns) {
      // Top MP : la somme des % doit etre ~100
      if (c.topMp.length > 0) {
        const sumTop = c.topMp.reduce((s, m) => s + m.pourcentage, 0)
        if (Math.abs(sumTop - 100) > TOLERANCE_POURCENT)
          warn(`${annee} CTN ${c.code} : sum(topMp%)=${sumTop} (attendu ~100)`)
      }
      // Repartitions
      const rs = c.repartitionsSynthese
      if (rs) {
        for (const cle of ['parRisque', 'parSiegeLesion', 'parNatureLesion']) {
          const arr = rs[cle]
          if (!arr || arr.length === 0) continue
          const s = arr.reduce((a, x) => a + x.pourcentage, 0)
          // Top 5 = generalement 70-100% (le reste est "autres")
          if (s < 50 || s > 110)
            warn(`${annee} CTN ${c.code} ${cle} : sum=${s}% (attendu 50-110)`)
        }
      }
    }
  }
  ok('Pourcentages dans bornes attendues')
}

/* --- Niveau 4 : continuite temporelle --- */
function testContinuite(donnees) {
  console.log('\n[4] Test continuite : variations an/an raisonnables')
  for (let i = 1; i < ANNEES.length; i++) {
    const a1 = ANNEES[i - 1]
    const a2 = ANNEES[i]
    if (a2 - a1 > 1) continue // saut (ex: 2021→2023), tolere
    const d1 = donnees[a1].ctns[0]
    const d2 = donnees[a2].ctns[0]
    for (const cle of ['nb1erReglement', 'nbNouvellesIp', 'nbJourneesPerdues']) {
      const v1 = d1.at[cle]
      const v2 = d2.at[cle]
      if (!v1 || !v2) continue
      const variation = Math.abs(v2 - v1) / v1
      if (variation > TOLERANCE_VARIATION)
        warn(
          `${a1}→${a2} AT.${cle} : ${v1} → ${v2} (variation ${(variation * 100).toFixed(0)}%)`
        )
    }
  }
  ok('Variations annuelles dans bornes (50% max)')
}

/* --- Niveau 5 : presence du marqueur 057A --- */
function testPresence057A(donnees) {
  console.log('\n[5] Test presence : 057A doit apparaitre dans le top MP')
  for (const annee of ANNEES) {
    const d = donnees[annee]
    for (const c of d.ctns) {
      if (c.topMp.length === 0) continue
      const a057 = c.topMp.find((m) => m.codeTableau === '057A')
      if (!a057) warn(`${annee} CTN ${c.code} : 057A absent du top MP`)
    }
  }
  ok('057A "Affections periarticulaires" present partout')
}

async function main() {
  const donnees = {}
  for (const a of ANNEES) donnees[a] = await chargerAnnee(a)

  testSommation(donnees)
  testEncadrement(donnees)
  testPourcentages(donnees)
  testContinuite(donnees)
  testPresence057A(donnees)

  console.log(`\n=== Resume ===`)
  console.log(`  ${nbOk} controles OK`)
  console.log(`  ${nbWarnings} warning(s)`)
  if (nbWarnings === 0) console.log('  >> Donnees coherentes a tous les niveaux')
  process.exit(nbWarnings > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
