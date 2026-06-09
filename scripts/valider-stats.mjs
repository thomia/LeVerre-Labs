/**
 * Script de validation par invariants.
 *
 * Pour chaque annee, verifie que la somme des CTN individuels (A..I) est
 * approximativement egale a "tous CTN" pour les principaux scalaires.
 * Tolerance : 1% (les arrondis et compte special expliquent les ecarts).
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const ANNEES = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2023, 2024]
const CHAMPS_AT = [
  'nb1erReglement',
  'nbAvec4JoursArret',
  'nbNouvellesIp',
  'nbDeces',
  'nbJourneesPerdues',
  'nbEtablissements',
]
const CHAMPS_TJ = [
  'nb1erReglement',
  'nbNouvellesIp',
  'nbDeces',
  'nbJourneesPerdues',
]
const CHAMPS_MP = [
  'nbAvec1erReglement',
  'nbNouvellesIp',
  'nbDeces',
  'nbJourneesPerduesIt',
]

const TOLERANCE = 0.02 // 2%

let nbErreurs = 0

for (const annee of ANNEES) {
  const file = path.join(ROOT, 'src', 'data', 'stats-am', `${annee}.json`)
  const data = JSON.parse(await readFile(file, 'utf-8'))

  const tous = data.ctns.find((c) => c.code === 'tous')
  const indiv = data.ctns.filter((c) => c.code !== 'tous')

  console.log(`\n=== ${annee} ===`)

  // Salaries
  const sumSal = indiv.reduce((s, c) => s + (c.nbSalariesActivite || 0), 0)
  console.log(
    `  salaries  | tous=${pad(tous.nbSalariesActivite)} | sum=${pad(sumSal)} | ecart=${ecart(tous.nbSalariesActivite, sumSal)}`
  )

  for (const [type, champs] of [
    ['at', CHAMPS_AT],
    ['tj', CHAMPS_TJ],
    ['mp', CHAMPS_MP],
  ]) {
    for (const champ of champs) {
      const valTous = tous[type][champ] ?? 0
      const valSum = indiv.reduce((s, c) => s + (c[type][champ] ?? 0), 0)
      if (valTous === 0 && valSum === 0) continue
      const e = ecartNum(valTous, valSum)
      const flag = Math.abs(e) > TOLERANCE ? ' ⚠' : '  '
      if (Math.abs(e) > TOLERANCE) nbErreurs++
      console.log(
        `  ${type}.${champ.padEnd(20)} | tous=${pad(valTous)} | sum=${pad(valSum)} | ecart=${(e * 100).toFixed(2)}%${flag}`
      )
    }
  }
}

function pad(n) {
  return String(n).padStart(12)
}
function ecart(tous, sum) {
  if (tous === 0) return 'n/a'
  return ((sum - tous) / tous * 100).toFixed(2) + '%'
}
function ecartNum(tous, sum) {
  if (tous === 0) return sum === 0 ? 0 : 1
  return (sum - tous) / tous
}

console.log(`\n=> ${nbErreurs} ecart(s) > ${(TOLERANCE * 100).toFixed(0)}%`)
process.exit(nbErreurs > 0 ? 1 : 0)
