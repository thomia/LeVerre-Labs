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
  // On stocke des points numériques (ou tableau pour les questions multiples)
  [questionId: string]: number | number[]
}

export interface Session {
  code: string
  status: SessionStatus
  current_element: ElementId | null
  timer_end_at: string | null
  timer_duration: number
  /** ISO timestamp ou null. Non-null = simulation lancée par le formateur. */
  simulation_started_at: string | null
  created_at: string
}

export interface Participant {
  id: string
  session_code: string
  pseudo: string
  scores: ParticipantScores
  answers: ParticipantAnswers
  /** Scénario choisi pour la simulation, null tant que pas choisi. */
  simulation_scenario: SimulationScenario | null
  joined_at: string
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
        Insert: Omit<Session, 'created_at'> & { created_at?: string }
        Update: Partial<Session>
        Relationships: []
      }
      participants: {
        Row: Participant
        Insert: Omit<Participant, 'id' | 'joined_at'> & { id?: string; joined_at?: string }
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
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
