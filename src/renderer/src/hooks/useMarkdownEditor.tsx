import { useAtomValue } from 'jotai'

import { selectedNodeAtom } from '@renderer/store'

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNodeAtom)

  return {
    selectedNote
  }
}
