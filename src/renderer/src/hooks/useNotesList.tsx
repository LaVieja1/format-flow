import { useAtom, useAtomValue } from 'jotai'

import { notesAtom, selectedNoteIndexAtom } from '@renderer/store'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom)

  const [selectedNodeIndex, setSelectedNodeIndex] = useAtom(selectedNoteIndexAtom)

  const handleNoteSelect = (index: number) => async () => {
    setSelectedNodeIndex(index)

    if (onSelect) {
      onSelect()
    }
  }

  return {
    notes,
    selectedNodeIndex,
    handleNoteSelect
  }
}
