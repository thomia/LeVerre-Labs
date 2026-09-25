/**
 * Auto-tests de l'analyse rapide (scoring + physique du verre).
 *
 * Même principe que `src/lib/owas/auto-test.ts` : pas de dépendance externe,
 * on vérifie sur des cas de bornes que
 *   - les 4 cases d'importance pèsent bien comme annoncé,
 *   - l'Orage se neutralise quand aucun imprévu ne survient,
 *   - le Verre et la Paille s'inversent bien (score élevé = favorable),
 *   - le remplissage suit la formule et les durées de calibration attendues,
 *   - le niveau reste déterministe (rejouer la vidéo donne le même verre).
 *
 * Résultats visibles sur `/dev/analyse-rapide` en `npm run dev`.
 */

import {
  CRITERES_PAR_ELEMENT,
  NIVEAUX_POIDS,
  construitSegments,
  courbeNiveau,
  niveauAuTemps,
  notationsParDefaut,
  scoreElement,
  scoresDuMoment,
  tauxParMinute,
  type MomentAnalyse,
  type NotationsMoment,
  type ScoresMoment,
} from './index'

export interface ResultatTest {
  nom: string
  attendu: string
  obtenu: string
  ok: boolean
}

const TOLERANCE = 0.5

function approx(nom: string, obtenu: number, attendu: number, unite = '', tolerance = TOLERANCE): ResultatTest {
  return {
    nom,
    attendu: `${attendu.toFixed(1)}${unite}`,
    obtenu: `${obtenu.toFixed(1)}${unite}`,
    ok: Math.abs(obtenu - attendu) <= tolerance,
  }
}

function vraiSi(nom: string, condition: boolean, attendu: string, obtenu: string): ResultatTest {
  return { nom, attendu, obtenu, ok: condition }
}

/** Notations d'un élément forcées à une même gravité. */
function notationsUniformes(gravite: number): NotationsMoment {
  const notations = notationsParDefaut()
  for (const cle of Object.keys(notations)) notations[cle] = { ...notations[cle], gravite }
  return notations
}

function avecGravite(notations: NotationsMoment, critereId: string, gravite: number): NotationsMoment {
  return { ...notations, [critereId]: { ...notations[critereId], gravite } }
}

function avecPoids(notations: NotationsMoment, critereId: string, niveauPoids: number | null): NotationsMoment {
  return { ...notations, [critereId]: { ...notations[critereId], niveauPoids } }
}

function scores(partiel: Partial<ScoresMoment>): ScoresMoment {
  return { robinet: 0, bulle: 0, orage: 0, paille: 0, verre: 0, ...partiel }
}

export function lancerAutotests(): ResultatTest[] {
  const tests: ResultatTest[] = []

  // --- Scoring -------------------------------------------------------------

  tests.push(approx('Robinet : tous les curseurs à 0', scoreElement('robinet', notationsUniformes(0)), 0))
  tests.push(approx('Robinet : tous les curseurs à 100', scoreElement('robinet', notationsUniformes(100)), 100))

  // Un seul critère à 100 en "Déterminant" (×5), les 4 autres à 0 avec leurs
  // poids par défaut (5 + 3.5 + 2 + 2 = 12.5) : A = √(5×100² / 17.5) = 53.5.
  const robinetUnFacteur = avecPoids(avecGravite(notationsUniformes(0), 'r_charge', 100), 'r_charge', 3)
  tests.push(approx('Robinet : un seul facteur déterminant à 100', scoreElement('robinet', robinetUnFacteur), 53))

  // Le même critère en "Mineur" (×1) pèse deux fois moins : A = √(100²/13.5) = 27.2.
  const robinetMineur = avecPoids(robinetUnFacteur, 'r_charge', 0)
  tests.push(approx('Robinet : le même facteur en mineur', scoreElement('robinet', robinetMineur), 27))

  // Critère écarté : il sort complètement du calcul.
  const robinetEcarte = avecPoids(avecGravite(notationsUniformes(0), 'r_charge', 100), 'r_charge', null)
  tests.push(approx('Robinet : facteur écarté ignoré', scoreElement('robinet', robinetEcarte), 0))

  // Orage : occurrence nulle → criticité nulle (esprit AMDEC).
  const orageSansOccurrence = avecGravite(notationsUniformes(100), 'o_occurrence', 0)
  tests.push(approx('Orage : aucun imprévu survenu', scoreElement('orage', orageSansOccurrence), 0))

  const orageMoitie = avecGravite(notationsUniformes(100), 'o_occurrence', 50)
  tests.push(approx('Orage : imprévu survenu à 50 %', scoreElement('orage', orageMoitie), 50))

  // Éléments positifs : la défaveur est inversée.
  tests.push(approx('Paille : aucun manque observé', scoreElement('paille', notationsUniformes(0)), 100))
  tests.push(approx('Paille : tout est dégradé', scoreElement('paille', notationsUniformes(100)), 0))
  tests.push(approx('Verre : aucune fragilité observée', scoreElement('verre', notationsUniformes(0)), 100))

  // Point de départ d'un moment vierge.
  const defaut = scoresDuMoment(notationsParDefaut())
  tests.push(
    vraiSi(
      'Moment vierge : hypothèse neutre sur les 5 éléments',
      defaut.robinet === 50 && defaut.bulle === 50 && defaut.orage === 0 && defaut.paille === 50 && defaut.verre === 50,
      'R50 B50 O0 P50 V50',
      `R${defaut.robinet} B${defaut.bulle} O${defaut.orage} P${defaut.paille} V${defaut.verre}`
    )
  )

  tests.push(
    vraiSi(
      'Les 4 cases vont bien de ×1 à ×5',
      NIVEAUX_POIDS[0].poids === 1 && NIVEAUX_POIDS[3].poids === 5,
      '×1 → ×5',
      `×${NIVEAUX_POIDS[0].poids} → ×${NIVEAUX_POIDS[3].poids}`
    )
  )

  tests.push(
    vraiSi(
      'Chaque élément a au moins 4 critères observables',
      Object.values(CRITERES_PAR_ELEMENT).every((liste) => liste.length >= 4),
      '≥ 4 par élément',
      Object.values(CRITERES_PAR_ELEMENT)
        .map((liste) => liste.length)
        .join(' / ')
    )
  )

  // --- Physique du verre ---------------------------------------------------

  const pireCas = scores({ robinet: 100, bulle: 100, orage: 100, paille: 0, verre: 0 })
  tests.push(approx('Pire cas : taux de remplissage', tauxParMinute(pireCas), 206.3, ' %/min'))
  tests.push(approx('Pire cas : verre plein en', (100 / tauxParMinute(pireCas)) * 60, 29.1, ' s'))

  const momentMoyen = scores({ robinet: 50, bulle: 50, orage: 0, paille: 50, verre: 50 })
  tests.push(approx('Moment neutre : taux de remplissage', tauxParMinute(momentMoyen), 17.9, ' %/min'))

  const momentLeger = scores({ robinet: 20, bulle: 20, orage: 0, paille: 80, verre: 80 })
  tests.push(
    vraiSi(
      'Moment léger : le verre se vide',
      tauxParMinute(momentLeger) < 0,
      'taux négatif',
      `${tauxParMinute(momentLeger).toFixed(1)} %/min`
    )
  )

  // Intégration : 2 min à 17.9 %/min = 35.8 % de verre.
  const moment: MomentAnalyse = {
    id: 'test',
    nom: 'Test',
    debut: 0,
    fin: 120,
    notations: notationsParDefaut(),
    commentaire: '',
  }
  const segments = construitSegments([moment], 240)
  tests.push(approx('2 min de moment neutre remplissent', niveauAuTemps(segments, 120), 35.8, ' %'))

  // Après le moment, plus de robinet : la paille héritée vide le verre.
  tests.push(
    vraiSi(
      'Hors moment : le verre redescend',
      niveauAuTemps(segments, 240) < niveauAuTemps(segments, 120),
      'niveau décroissant',
      `${niveauAuTemps(segments, 120).toFixed(1)} % → ${niveauAuTemps(segments, 240).toFixed(1)} %`
    )
  )

  // Déterminisme : deux appels au même instant donnent le même verre.
  tests.push(
    vraiSi(
      'Déterminisme : rejouer donne le même niveau',
      niveauAuTemps(segments, 90) === niveauAuTemps(segments, 90),
      'identique',
      `${niveauAuTemps(segments, 90).toFixed(3)} %`
    )
  )

  // Bornes.
  const momentExtreme: MomentAnalyse = {
    ...moment,
    notations: avecGravite(notationsUniformes(100), 'o_occurrence', 100),
  }
  const segmentsExtremes = construitSegments([momentExtreme], 600)
  const niveauMax = niveauAuTemps(segmentsExtremes, 600)
  tests.push(
    vraiSi('Le niveau ne dépasse jamais 100 %', niveauMax <= 100, '≤ 100 %', `${niveauMax.toFixed(1)} %`)
  )

  const niveauMin = niveauAuTemps(construitSegments([{ ...moment, notations: notationsUniformes(0) }], 600), 600)
  tests.push(vraiSi('Le niveau ne descend jamais sous 0 %', niveauMin >= 0, '≥ 0 %', `${niveauMin.toFixed(1)} %`))

  // La courbe de la frise doit raconter la même chose que le verre.
  const courbe = courbeNiveau(segments, 240, 241)
  tests.push(approx('Courbe de la frise = niveau du verre (t=120 s)', courbe[120], niveauAuTemps(segments, 120), ' %', 1))

  return tests
}
