import { app, BrowserWindow, screen, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { windowLayout } from './window.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Smoke mode loads the packaged renderer hidden, reports the window size and quits.
const isSmokeMode = process.env.LUMBERJACK_ELECTRON_SMOKE === '1'

function createMainWindow(): BrowserWindow {
  // Fill the display's work area in whatever orientation it has (a rotated cabinet monitor is tall),
  // or start fullscreen with `--fullscreen`. F11 toggles fullscreen at any time.
  const display = screen.getPrimaryDisplay()
  const layout = windowLayout(display, process.argv)
  const mainWindow = new BrowserWindow({
    ...layout.bounds,
    fullscreen: layout.fullscreen && !isSmokeMode,
    show: !isSmokeMode,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  if (!layout.fullscreen && !isSmokeMode) {
    mainWindow.maximize()
  }

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      event.preventDefault()
      mainWindow.setFullScreen(!mainWindow.isFullScreen())
    }
  })

  if (isSmokeMode) {
    mainWindow.webContents.once('did-finish-load', () => {
      const bounds = mainWindow.getBounds()
      const { workArea } = display
      console.log(`[electron-smoke] window=${bounds.width}x${bounds.height} workArea=${workArea.width}x${workArea.height}`)
      console.log('[electron-smoke] did-finish-load')
      setTimeout(() => app.quit(), 250)
    })
    mainWindow.webContents.once('did-fail-load', (_event, code, description) => {
      console.error(`[electron-smoke] did-fail-load code=${code} description=${description}`)
      app.exit(1)
    })
  }

  const startUrl = process.env.ELECTRON_START_URL
  if (startUrl) {
    void mainWindow.loadURL(startUrl)
    if (!isSmokeMode) {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
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
