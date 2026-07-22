"use client"

/**
 * PopupActions — tableau collaboratif d'actions / recommandations.
 *
 * Moment de clôture de la formation : le groupe propose des actions à voix
 * haute, le formateur les note et les glisse (souris) dans la bonne colonne.
 * Pas de saisie participant — c'est une activité menée en commun, projetée
 * sur l'écran du formateur.
 *
 * Trois zones :
 *   - "À classer"                       : dépôt par défaut à la création
 *   - "Sur mon poste — par moi"         : ce que la personne peut faire elle-même
 *   - "Sur le poste — par l'entreprise" : ce qui relève de l'organisation
 *
 * Le classement se fait en glissant une carte d'une colonne à l'autre
 * (drag & drop natif HTML5).
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Trash2,
  Pencil,
  Check,
  Loader2,
  Inbox,
  User,
  Building2,
  GripVertical,
  type LucideIcon,
} from 'lucide-react'
import { useActions } from '@/hooks/use-actions'
import { ELEMENT_THEME, ELEMENTS_ORDER } from '@/lib/element-theme'
import type { Action, ActionColonne, ElementId } from '@/lib/supabase/types'

interface PopupActionsProps {
  sessionCode: string
  isOpen: boolean
  onClose: () => void
}

const COLONNES: {
  id: ActionColonne
  title: string
  hint: string
  icon: typeof Inbox
  accent: string
}[] = [
  {
    id: 'a_classer',
    title: 'À classer',
    hint: 'Actions proposées par le groupe',
    icon: Inbox,
    accent: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  },
  {
    id: 'moi',
    title: 'Sur mon poste — par moi',
    hint: 'Ce que je peux faire à mon niveau',
    icon: User,
    accent: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  },
  {
    id: 'entreprise',
    title: "Sur le poste — par l'entreprise",
    hint: "Ce qui relève de l'organisation",
    icon: Building2,
    accent: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
]

export function PopupActions({ sessionCode, isOpen, onClose }: PopupActionsProps) {
  const { actions, isLoading, addAction, editAction, moveAction, deleteAction } =
    useActions(sessionCode)
  const [isAdding, setIsAdding] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColonne, setDragOverColonne] = useState<ActionColonne | null>(null)

  function handleDrop(colonne: ActionColonne) {
    if (draggedId) moveAction(draggedId, colonne)
    setDraggedId(null)
    setDragOverColonne(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="actions-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[92vh] w-[96vw] max-w-[1900px] flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Actions et recommandations
                </h2>
                <p className="mt-1 text-base text-slate-400">
                  Notez les idées du groupe, puis glissez chaque carte dans la
                  bonne colonne.
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              </div>
            ) : (
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr_1fr]">
                {COLONNES.map((colonne) => (
                  <Colonne
                    key={colonne.id}
                    colonne={colonne}
                    actions={actions.filter((a) => a.colonne === colonne.id)}
                    isDragOver={dragOverColonne === colonne.id}
                    onDragOverColonne={() => setDragOverColonne(colonne.id)}
                    onDrop={() => handleDrop(colonne.id)}
                    onDragStartCard={(id) => setDraggedId(id)}
                    onDragEndCard={() => {
                      setDraggedId(null)
                      setDragOverColonne(null)
                    }}
                    onDelete={deleteAction}
                    onEdit={editAction}
                    isAdding={colonne.id === 'a_classer' && isAdding}
                    onStartAdd={
                      colonne.id === 'a_classer' ? () => setIsAdding(true) : undefined
                    }
                    onAdd={addAction}
                    onDoneAdd={() => setIsAdding(false)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ColonneProps {
  colonne: (typeof COLONNES)[number]
  actions: Action[]
  isDragOver: boolean
  onDragOverColonne: () => void
  onDrop: () => void
  onDragStartCard: (id: string) => void
  onDragEndCard: () => void
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>
  onEdit: (
    id: string,
    updates: { texte: string; element: ElementId | null }
  ) => Promise<{ ok: boolean; error?: string }>
  isAdding: boolean
  onStartAdd?: () => void
  onAdd: (input: {
    participantId: string | null
    pseudo: string
    element: ElementId | null
    texte: string
  }) => Promise<{ ok: boolean; error?: string }>
  onDoneAdd: () => void
}

function Colonne({
  colonne,
  actions,
  isDragOver,
  onDragOverColonne,
  onDrop,
  onDragStartCard,
  onDragEndCard,
  onDelete,
  onEdit,
  isAdding,
  onStartAdd,
  onAdd,
  onDoneAdd,
}: ColonneProps) {
  const Icon = colonne.icon

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        onDragOverColonne()
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDrop()
      }}
      className={`flex h-full min-h-[500px] flex-col gap-4 overflow-y-auto rounded-2xl border p-4 transition ${
        isDragOver ? 'border-white/40 bg-slate-800/70' : 'border-white/10 bg-slate-900/50'
      }`}
    >
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${colonne.accent}`}>
        <Icon className="h-6 w-6 shrink-0" />
        <div>
          <h3 className="text-lg font-semibold leading-tight">{colonne.title}</h3>
          <p className="text-sm leading-tight opacity-80">{colonne.hint}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <AnimatePresence initial={false}>
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onDragStart={() => onDragStartCard(action.id)}
              onDragEnd={onDragEndCard}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>

        {actions.length === 0 && !isAdding && (
          <p className="rounded-lg border border-dashed border-white/10 px-3 py-8 text-center text-base text-slate-500">
            Dépose une carte ici
          </p>
        )}
      </div>

      {isAdding && <FormAjout onAdd={onAdd} onDone={onDoneAdd} />}

      {onStartAdd && !isAdding && (
        <button
          onClick={onStartAdd}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-800/80 px-4 py-3 text-base text-slate-200 transition hover:bg-slate-700"
        >
          <Plus className="h-5 w-5" />
          Ajouter une action
        </button>
      )}
    </div>
  )
}

interface FormAjoutProps {
  onAdd: ColonneProps['onAdd']
  onDone: () => void
}

function FormAjout({ onAdd, onDone }: FormAjoutProps) {
  return (
    <TexteEtElementForm
      submitLabel="Ajouter"
      submitIcon={Plus}
      onSubmit={(texte, element) =>
        onAdd({ participantId: null, pseudo: 'Groupe', element, texte })
      }
      onDone={onDone}
    />
  )
}

interface TexteEtElementFormProps {
  initialTexte?: string
  initialElement?: ElementId | null
  submitLabel: string
  submitIcon: LucideIcon
  onSubmit: (
    texte: string,
    element: ElementId | null
  ) => Promise<{ ok: boolean; error?: string }>
  /** Appelé après un enregistrement réussi ET quand on annule (bouton X). */
  onDone: () => void
}

/** Formulaire partagé texte + tag élément, utilisé pour ajouter et pour modifier une action. */
function TexteEtElementForm({
  initialTexte = '',
  initialElement = null,
  submitLabel,
  submitIcon: SubmitIcon,
  onSubmit,
  onDone,
}: TexteEtElementFormProps) {
  const [texte, setTexte] = useState(initialTexte)
  const [element, setElement] = useState<ElementId | null>(initialElement)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    const clean = texte.trim()
    if (clean.length < 3) {
      setError("Note quelques mots sur l'action")
      return
    }
    setIsSaving(true)
    setError(null)
    const res = await onSubmit(clean, element)
    setIsSaving(false)
    if (!res.ok) {
      setError(res.error ?? "Échec de l'enregistrement")
      return
    }
    onDone()
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4">
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        rows={3}
        autoFocus
        maxLength={200}
        placeholder="ex: S'étirer les épaules 5 min après chaque montage"
        className="w-full resize-none rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-lg text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />

      <div>
        <p className="mb-2 text-sm uppercase tracking-wider text-slate-500">
          Élément concerné (optionnel)
        </p>
        <div className="flex flex-nowrap gap-2">
          {ELEMENTS_ORDER.map((el) => {
            const theme = ELEMENT_THEME[el]
            const isSelected = element === el
            return (
              <button
                key={el}
                type="button"
                onClick={() => setElement(isSelected ? null : el)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-base font-semibold transition ${
                  isSelected
                    ? theme.chipClass
                    : 'border-white/10 bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {theme.name}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-base text-red-300">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-lg font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <SubmitIcon className="h-5 w-5" />}
          {submitLabel}
        </button>
        <button
          onClick={onDone}
          disabled={isSaving}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-slate-700 disabled:opacity-60"
          aria-label="Annuler"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

interface ActionCardProps {
  action: Action
  onDragStart: () => void
  onDragEnd: () => void
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>
  onEdit: (
    id: string,
    updates: { texte: string; element: ElementId | null }
  ) => Promise<{ ok: boolean; error?: string }>
}

function ActionCard({ action, onDragStart, onDragEnd, onDelete, onEdit }: ActionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const theme = action.element ? ELEMENT_THEME[action.element] : null

  async function handleDelete() {
    setIsDeleting(true)
    const res = await onDelete(action.id)
    if (!res.ok) setIsDeleting(false)
  }

  if (isEditing) {
    return (
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
        <TexteEtElementForm
          initialTexte={action.texte}
          initialElement={action.element}
          submitLabel="Enregistrer"
          submitIcon={Check}
          onSubmit={(texte, element) => onEdit(action.id, { texte, element })}
          onDone={() => setIsEditing(false)}
        />
      </motion.div>
    )
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
      {/* Le drag & drop natif (draggable/onDragStart) est porté par un <div>
          simple : les handlers de `motion.div` sont réservés au geste de drag
          de Framer Motion et ont une signature différente. */}
      <div
        draggable
        onDragStart={(e) => {
          onDragStart()
          // Nécessaire pour Firefox : sans données, le drag n'est pas déclenché.
          e.dataTransfer.setData('text/plain', action.id)
        }}
        onDragEnd={onDragEnd}
        className="cursor-grab rounded-xl border border-white/10 bg-slate-900/80 p-4 active:cursor-grabbing"
      >
        <div className="flex items-start gap-3">
          <GripVertical className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
          <p className="flex-1 text-lg text-slate-100">{action.texte}</p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-blue-400"
              aria-label="Modifier"
            >
              <Pencil className="h-6 w-6" />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-red-400 disabled:opacity-50"
              aria-label="Supprimer"
            >
              {isDeleting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Trash2 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {theme && (
          <div className="mt-3 flex items-center gap-2 pl-8">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${theme.chipClass}`}
            >
              {theme.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
