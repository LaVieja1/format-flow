import { useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'

import { MDXEditorMethods } from '@mdxeditor/editor'
import { saveNoteAtom, selectedNodeAtom } from '@renderer/store'
import { AUTO_SAVING_TIME } from '@shared/constants'
import { NoteContent } from '@shared/models'
import { throttle } from 'lodash'

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNodeAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleAutoSaving = throttle(
    async (content: NoteContent) => {
      if (!selectedNote) return

      console.info('Auto guardando:', selectedNote.title)

      await saveNote(content)
    },
    AUTO_SAVING_TIME,
    {
      leading: false,
      trailing: true
    }
  )

  const handleBlur = async () => {
    if (!selectedNote) return

    handleAutoSaving.cancel()

    const content = editorRef.current?.getMarkdown()

    if (content != null) {
      await saveNote(content)
    }
  }

  return {
    editorRef,
    handleAutoSaving,
    selectedNote,
    handleBlur
  }
}
