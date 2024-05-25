/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  saveFile: async (blob: Blob, name: string): Promise<any> => {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const data = ipcRenderer.invoke('saveFile', buffer, name)
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  createContract: async (formData: object): Promise<Uint8Array> => {
    try {
      const filledPdfBytes = await ipcRenderer.invoke('createContract', formData)
      return filledPdfBytes
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
