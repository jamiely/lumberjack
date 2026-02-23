import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  registerWebServiceWorker,
  shouldRegisterServiceWorker
} from './registerServiceWorker'

const registerSWMock = vi.hoisted(() => vi.fn())

vi.mock('virtual:pwa-register', () => ({
  registerSW: registerSWMock
}))

describe('registerServiceWorker', () => {
  beforeEach(() => {
    registerSWMock.mockReset()
  })

  it('returns false when service workers are unavailable', () => {
    const canRegister = shouldRegisterServiceWorker({
      navigator: {
        userAgent: 'Mozilla/5.0'
      } as Navigator
    })

    expect(canRegister).toBe(false)
  })

  it('returns false in Electron runtime', () => {
    const canRegister = shouldRegisterServiceWorker({
      navigator: {
        userAgent: 'Mozilla/5.0 Electron/40.0',
        serviceWorker: {} as ServiceWorkerContainer
      } as Navigator
    })

    expect(canRegister).toBe(false)
  })

  it('returns true for standard web runtime with service workers', () => {
    const canRegister = shouldRegisterServiceWorker({
      navigator: {
        userAgent: 'Mozilla/5.0',
        serviceWorker: {} as ServiceWorkerContainer
      } as Navigator
    })

    expect(canRegister).toBe(true)
  })

  it('does not register service worker when guard blocks registration', async () => {
    const didRegister = await registerWebServiceWorker({
      navigator: {
        userAgent: 'Mozilla/5.0 Electron/40.0',
        serviceWorker: {} as ServiceWorkerContainer
      } as Navigator
    })

    expect(didRegister).toBe(false)
    expect(registerSWMock).not.toHaveBeenCalled()
  })

  it('registers service worker with immediate updates in web runtime', async () => {
    const didRegister = await registerWebServiceWorker({
      navigator: {
        userAgent: 'Mozilla/5.0',
        serviceWorker: {} as ServiceWorkerContainer
      } as Navigator
    })

    expect(didRegister).toBe(true)
    expect(registerSWMock).toHaveBeenCalledWith({ immediate: true })
  })
})
