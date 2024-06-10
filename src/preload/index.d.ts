/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveFile: (blob: Blob, name: string) => Promise<string>
      createContract: (formData: object) => Promise<Uint8Array>
      createBill: (formData: object) => Promise<Uint8Array>
    }
  }
}
