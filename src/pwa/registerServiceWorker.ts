const ELECTRON_USER_AGENT_TOKEN = 'Electron'

type ServiceWorkerEnvironment = Pick<Window, 'navigator'>

export const shouldRegisterServiceWorker = (
  environment: ServiceWorkerEnvironment = window,
): boolean => {
  const { navigator } = environment
  const inElectron = navigator.userAgent.includes(ELECTRON_USER_AGENT_TOKEN)

  return 'serviceWorker' in navigator && !inElectron
}

export const registerWebServiceWorker = async (
  environment: ServiceWorkerEnvironment = window,
): Promise<boolean> => {
  if (!shouldRegisterServiceWorker(environment)) {
    return false
  }

  const { registerSW } = await import('virtual:pwa-register')
  registerSW({ immediate: true })

  return true
}
