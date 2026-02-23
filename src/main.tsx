import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { registerWebServiceWorker } from './pwa/registerServiceWorker'

void registerWebServiceWorker()

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
