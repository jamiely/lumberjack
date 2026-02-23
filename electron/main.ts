import { app, BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    minWidth: 540,
    minHeight: 960,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  const startUrl = process.env.ELECTRON_START_URL
  if (startUrl) {
    void mainWindow.loadURL(startUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    const rendererPath = path.join(__dirname, '../dist/index.html')
    void mainWindow.loadFile(rendererPath)
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentUrl = mainWindow.webContents.getURL()
    if (url !== currentUrl) {
      event.preventDefault()
      void shell.openExternal(url)
    }
  })

  return mainWindow
}

app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
