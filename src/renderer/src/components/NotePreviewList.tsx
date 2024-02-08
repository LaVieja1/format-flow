import { isEmpty } from 'lodash'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import { useNotesList } from '@renderer/hooks/useNotesList'

import { NotePreview } from '@/components/NotePreview'

export type NotePreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {
  const { notes, selectedNodeIndex, handleNoteSelect } = useNotesList({ onSelect })

  if (!notes) return null

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No hay notas aún</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>
      {notes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          isActive={selectedNodeIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  )
}
