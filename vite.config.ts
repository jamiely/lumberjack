/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const base =
    command === 'build'
      ? process.env.BUILD_TARGET === 'desktop'
        ? './'
        : '/lumberjack/'
      : '/'

  return {
    plugins: [react()],
    base,
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/__tests__/setup.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**']
    }
  }
})
