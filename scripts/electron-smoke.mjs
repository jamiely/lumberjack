// Launches the built Electron app hidden against the packaged renderer and checks that it loads
// and sizes its window to the display's work area. Run `npm run desktop:smoke`.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import electronPath from 'electron'

const projectRoot = process.cwd()
const required = ['dist/index.html', 'dist-electron/main.js', 'dist-electron/preload.js']
const missing = required.filter((file) => !fs.existsSync(path.join(projectRoot, file)))
if (missing.length > 0) {
  console.error(`[electron-smoke] Missing ${missing.join(', ')}. Run the desktop builds first.`)
  process.exit(1)
}

const child = spawn(electronPath, ['dist-electron/main.js'], {
  cwd: projectRoot,
  env: { ...process.env, LUMBERJACK_ELECTRON_SMOKE: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let output = ''
const onData = (chunk) => {
  output += chunk.toString()
  process.stdout.write(chunk)
}
child.stdout.on('data', onData)
child.stderr.on('data', onData)

const timeout = setTimeout(() => {
  child.kill('SIGKILL')
  console.error('[electron-smoke] Timed out after 20000ms')
  process.exit(1)
}, 20_000)

child.on('exit', (code) => {
  clearTimeout(timeout)
  const size = output.match(/window=(\d+)x(\d+) workArea=(\d+)x(\d+)/)
  if (code !== 0 || !output.includes('[electron-smoke] did-finish-load') || !size) {
    console.error(`[electron-smoke] Electron exited with code ${code} before confirming page load and window size.`)
    process.exit(1)
  }
  const [, width, height, areaWidth, areaHeight] = size
  if (width !== areaWidth || height !== areaHeight) {
    console.error('[electron-smoke] Window does not match the display work area.')
    process.exit(1)
  }
  console.log('[electron-smoke] Electron loaded the packaged app filling the work area.')
})
