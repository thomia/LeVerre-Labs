/**
 * Types TypeScript pour les tables Supabase
 * Feature : Session Sensibilisation Collective
 */

export type SessionStatus = 'waiting' | 'active' | 'ended'

export type ElementId = 'verre' | 'robinet' | 'bulle' | 'orage' | 'paille'

/**
 * Scénario de simulation choisi par le participant.
 * Détermine l'échelle horaire affichée et la vitesse de simulation.
 *   - 'tache'   : ~1h compressée
 *   - 'journee' : ~8h compressées (par défaut implicite)
 *   - 'semaine' : ~40h compressées (5×8h)
 */
export type SimulationScenario = 'tache' | 'journee' | 'semaine'

export interface ParticipantScores {
  verre?: number
  robinet?: number
  bulle?: number
  orage?: number
  paille?: number
}

export interface ParticipantAnswers {
  // { "verre_age": 8, "robinet_poids": 20, "paille_multi": [30, 60], ... }
  // On stocke des points numériques (ou tableau pour les questions multiples,
  // ou du texte libre pour les questions ouvertes comme le titre d'un imprévu).
  [questionId: string]: number | number[] | string
}

export interface Session {
  code: string
  status: SessionStatus
  current_element: ElementId | null
  timer_end_at: string | null
  timer_duration: number
  /** @deprecated Ancien système de simulation, conservé pour compat BDD. */
  simulation_started_at: string | null
  created_at: string
}

export interface Participant {
  id: string
  session_code: string
  pseudo: string
  /** Nom libre de la tâche de référence choisie par le participant. */
  tache_reference: string | null
  scores: ParticipantScores
  answers: ParticipantAnswers
  /**
   * Score final "temps avant débordement" (secondes-modèle) figé en fin de
   * session pour les statistiques. `null` = le verre ne déborde pas.
   */
  overflow_seconds: number | null
  /** @deprecated Ancien système de simulation, conservé pour compat BDD. */
  simulation_scenario: SimulationScenario | null
  joined_at: string
}

/**
 * Colonne du tableau d'actions.
 *   - 'a_classer'  : zone de dépôt par défaut, avant tri par le formateur.
 *   - 'moi'        : action sur mon poste, par moi.
 *   - 'entreprise'  : action sur le poste, par l'entreprise.
 */
export type ActionColonne = 'a_classer' | 'moi' | 'entreprise'

/**
 * Action / recommandation posée dans le tableau collaboratif de fin de
 * session (pop-up formateur, rempli et trié en commun avec le groupe).
 * `element` (optionnel) rattache l'action à l'un des 5 éléments du modèle.
 */
export interface Action {
  id: string
  session_code: string
  participant_id: string | null
  pseudo: string
  colonne: ActionColonne
  element: ElementId | null
  texte: string
  created_at: string
}

/**
 * Database schema utilisé par le client Supabase generic-typed
 * Structure complète requise par @supabase/supabase-js v2.x
 */
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      sessions: {
        Row: Session
        Insert: Omit<Session, 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Session>
        Relationships: []
      }
      participants: {
        Row: Participant
        Insert: Omit<Participant, 'id' | 'joined_at' | 'tache_reference'> & {
          id?: string
          joined_at?: string
          tache_reference?: string | null
        }
        Update: Partial<Participant>
        Relationships: [
          {
            foreignKeyName: 'participants_session_code_fkey'
            columns: ['session_code']
            referencedRelation: 'sessions'
            referencedColumns: ['code']
          }
        ]
      }
      actions: {
        Row: Action
        Insert: Omit<Action, 'id' | 'created_at' | 'colonne'> & {
          id?: string
          created_at?: string
          colonne?: ActionColonne
        }
        Update: Partial<Action>
        Relationships: [
          {
            foreignKeyName: 'actions_session_code_fkey'
            columns: ['session_code']
            referencedRelation: 'sessions'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'actions_participant_id_fkey'
            columns: ['participant_id']
            referencedRelation: 'participants'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
