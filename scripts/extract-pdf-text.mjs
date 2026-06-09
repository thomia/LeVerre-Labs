/**
 * Script d'extraction du texte brut d'un PDF.
 *
 * Usage :
 *   node scripts/extract-pdf-text.mjs 2024
 *   node scripts/extract-pdf-text.mjs all
 *
 * Lit `data/pdf-source/<annee>_at-tr-mp-fiches-selon-ctn.pdf`
 * et écrit `data/pdf-source/<annee>.txt`.
 *
 * Le fichier texte est ensuite lu par Cascade pour construire le JSON
 * structuré dans `src/data/stats-am/<annee>.json`.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

import { PDFParse } from 'pdf-parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')
const PDF_DIR = resolve(ROOT, 'data', 'pdf-source')

async function extractOne(annee) {
  const pdfPath = resolve(PDF_DIR, `${annee}_at-tr-mp-fiches-selon-ctn.pdf`)
  const outPath = resolve(PDF_DIR, `${annee}.txt`)

  console.log(`[${annee}] Lecture de ${pdfPath}`)
  const buffer = await readFile(pdfPath)

  console.log(`[${annee}] Extraction du texte...`)
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  const text = result.text ?? ''
  const numpages = result.pages?.length ?? result.numpages ?? '?'

  console.log(`[${annee}] ${numpages} pages, ${text.length} caractères`)
  await writeFile(outPath, text, 'utf-8')
  console.log(`[${annee}] Ecrit dans ${outPath}\n`)

  await parser.destroy?.()
}

async function main() {
  const arg = process.argv[2]

  if (!arg) {
    console.error('Usage : node scripts/extract-pdf-text.mjs <annee|all>')
    process.exit(1)
  }

  if (arg === 'all') {
    const files = await readdir(PDF_DIR)
    const annees = files
      .filter((f) => /^\d{4}_at-tr-mp/.test(f))
      .map((f) => f.slice(0, 4))
      .sort()

    for (const annee of annees) {
      await extractOne(annee)
    }
  } else {
    await extractOne(arg)
  }
}

main().catch((err) => {
  console.error('Erreur :', err)
  process.exit(1)
})
