import { atom } from 'jotai'

import { notesMock } from '@/store/mocks'
import { NoteInfo } from '@shared/models'

export const notesAtom = atom<NoteInfo[]>(notesMock)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedNodeAtom = atom((get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (!selectedNoteIndex) return null

  const selectedNote = notes[selectedNoteIndex]

  return {
    ...selectedNote,
    content: `Hola desde Note${selectedNoteIndex}`
  }
})
