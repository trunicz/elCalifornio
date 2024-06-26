import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'node:fs'
import os from 'os'
import { PDFDocument } from 'pdf-lib'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

function createWindow(): void {
  // Create the browser window.
  autoUpdater.checkForUpdates()

  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 720,
    minWidth: 1240,
    minHeight: 720,
    show: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const dir = join(os.homedir(), 'elCalifornio')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  ipcMain.handle('saveFile', async (_event, buffer: Buffer, name: string): Promise<string> => {
    try {
      const filePath = join(dir, name)
      fs.writeFile(filePath, buffer, () => console.log('Archivo guardado:', filePath))
      return filePath
    } catch (error) {
      console.error('Error al guardar el archivo:', error)
      throw error
    }
  })

  ipcMain.handle('createBill', async (_event, formData): Promise<Uint8Array | void> => {
    try {
      const pdfUrl =
        'https://kbwswwnpmbkmgzeqxyuv.supabase.co/storage/v1/object/public/pdfs/recibo.pdf'
      const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' })
      const pdfBytes = new Uint8Array(response.data)
      const pdfDoc = await PDFDocument.load(pdfBytes)
      const contract = pdfDoc.getForm()

      for (const fieldName of Object.keys(formData)) {
        const field = contract.getTextField(fieldName)
        if (field) {
          field.setText(`${formData[fieldName]}`)
        } else {
          console.log(`Campo "${fieldName}" no encontrado en el PDF`)
        }
      }
      return pdfDoc.save()
    } catch (error) {
      console.log('Error al llenar el PDF', error)
      throw error
    }
  })

  ipcMain.handle('createContract', async (_event, formData): Promise<Uint8Array | void> => {
    try {
      const pdfUrl =
        'https://kbwswwnpmbkmgzeqxyuv.supabase.co/storage/v1/object/public/pdfs/contract_.pdf'
      const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' })
      const pdfBytes = new Uint8Array(response.data)
      const pdfDoc = await PDFDocument.load(pdfBytes)
      const contract = pdfDoc.getForm()

      for (const fieldName of Object.keys(formData)) {
        if (typeof formData[fieldName] === 'boolean') {
          const checkBoxField = contract.getCheckBox(fieldName)
          if (checkBoxField) {
            if (formData[fieldName]) {
              checkBoxField.check()
            } else {
              checkBoxField.uncheck()
            }
          } else {
            console.log(`Campo "${fieldName}" no encontrado como casilla de verificación en el PDF`)
          }
        } else {
          const field = contract.getTextField(fieldName)
          if (field) {
            field.setText(`${formData[fieldName]}`)
          } else {
            console.log(`Campo "${fieldName}" no encontrado en el PDF`)
          }
        }
      }

      return pdfDoc.save()
    } catch (error) {
      console.log('Error al llenar el PDF', error)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
