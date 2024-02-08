import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

import { NoteContent, NoteInfo } from '@shared/models'

const loadNotes = async () => {
  const notes = await window.context.getNotes()

  // ordenarlos por mas reciente editado
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedNodeAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex === null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  const noteContent = await window.context.readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNodeAtom = unwrap(
  selectedNodeAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      content: '',
      lastEditTime: Date.now()
    }
)

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNodeAtom)

  if (!selectedNote || !notes) return

  //guardar en disco
  await window.context.writeNote(selectedNote.title, newContent)

  //actualizar nota guardada last edit time
  set(
    notesAtom,
    notes.map((note) => {
      // si es la nota que queremos actualizar
      if (note.title === selectedNote.title) {
        return {
          ...selectedNote,
          lastEditTime: Date.now()
        }
      }

      return note
    })
  )
})

export const createEmptyNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = `Nota ${notes.length + 1}`

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)
})

export const DeleteNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNodeAtom)

  if (!selectedNote || !notes) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})
