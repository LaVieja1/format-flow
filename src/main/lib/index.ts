import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { homedir } from 'os'

import { APP_DIRECTORY_NAME, FILE_ENCODING, WELCOME_FILENAME } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { isEmpty } from 'lodash'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}\\${APP_DIRECTORY_NAME}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('No se encontraron notas, creando nota de bienvenida')

    const content = await readFile(welcomeNoteFile, { encoding: FILE_ENCODING })

    // crear la nota de bienvenida
    await writeFile(`${rootDir}\\${WELCOME_FILENAME}`, content, { encoding: FILE_ENCODING })

    notes.push(WELCOME_FILENAME)
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}\\${filename}`)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${filename}.md`, { encoding: FILE_ENCODING })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()

  console.info(`Guardando nota ${filename}`)
  return writeFile(`${rootDir}\\${filename}.md`, content, { encoding: FILE_ENCODING })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Nueva nota',
    defaultPath: `${rootDir}\\SinTitulo.md`,
    buttonLabel: 'Crear',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('Crear nota cancelado')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creación de nota fallida',
      message: `Todas las notas debe ser guardadas en ${rootDir}.`
    })

    return false
  }

  console.info(`Creando nota ${filename}`)
  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Borrar nota',
    message: `¿Seguro que quieres borrar la nota ${filename}?`,
    buttons: ['Borrar', 'Cancelar'], // 0 es borrar, 1 es cancelar
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Borrar nota cancelado')
    return false
  }

  console.info(`Borrando nota: ${filename}`)
  await remove(`${rootDir}\\${filename}.md`)
  return true
}
