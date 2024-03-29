import { useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'

import { ActionButton, ActionButtonProps } from '@/components'
import { DeleteNoteAtom } from '@/store'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps) => {
  const deleteNote = useSetAtom(DeleteNoteAtom)
  const handleDelete = async () => {
    await deleteNote()
  }

  return (
    <ActionButton onClick={handleDelete} {...props}>
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
