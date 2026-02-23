/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => {
  const base =
    command === 'build'
      ? process.env.BUILD_TARGET === 'desktop'
        ? './'
        : '/lumberjack/'
      : '/'

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        includeAssets: ['images/*.png', 'audio/*.wav', 'vite.svg'],
        manifest: {
          name: 'Lumberjack',
          short_name: 'Lumberjack',
          description: 'Arcade lumberjack game playable offline after first load.',
          theme_color: '#173f2b',
          background_color: '#0f2a1b',
          display: 'standalone',
          scope: base,
          start_url: base,
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          navigateFallback: 'index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,wav,webmanifest}'],
          maximumFileSizeToCacheInBytes: 7 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) =>
                url.origin === self.location.origin &&
                ['style', 'script', 'image', 'font', 'audio'].includes(
                  request.destination,
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-runtime-assets',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ].filter(Boolean),
    base,
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/__tests__/setup.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**']
    }
  }
})
