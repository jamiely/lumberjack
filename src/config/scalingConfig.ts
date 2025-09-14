import type { ScalingOptions } from '../hooks/useViewportScaling'

// Default scaling configuration for the game
export const DEFAULT_SCALING_OPTIONS: ScalingOptions = {
  strategy: 'fit-to-screen',
  minScale: 0.1,
  maxScale: 10,
  maintainAspectRatio: true
}

// Scaling options for development mode (can be more flexible)
export const DEVELOPMENT_SCALING_OPTIONS: ScalingOptions = {
  strategy: 'fit-to-screen',
  minScale: 0.5,
  maxScale: 3,
  maintainAspectRatio: true
}

// Scaling options for arcade cabinet (more restrictive)
export const ARCADE_SCALING_OPTIONS: ScalingOptions = {
  strategy: 'fit-to-screen',
  minScale: 1,
  maxScale: 2,
  maintainAspectRatio: true
}

// Function to get scaling options based on environment or URL parameters
export function getScalingOptions(): ScalingOptions {
  // Check URL parameters for scaling configuration
  const urlParams = new URLSearchParams(window.location.search)
  const scalingStrategy = urlParams.get('scaling') as ScalingOptions['strategy']
  const minScale = urlParams.get('minScale')
  const maxScale = urlParams.get('maxScale')
  const maintainAspectRatio = urlParams.get('aspectRatio')

  // Start with default options
  let options = { ...DEFAULT_SCALING_OPTIONS }

  // Check for environment-specific defaults
  if (import.meta.env.MODE === 'development') {
    options = { ...DEVELOPMENT_SCALING_OPTIONS }
  } else if (window.location.pathname.includes('/arcade')) {
    options = { ...ARCADE_SCALING_OPTIONS }
  }

  // Override with URL parameters if provided
  if (scalingStrategy && ['fit-to-screen', 'fit-to-width', 'fit-to-height'].includes(scalingStrategy)) {
    options.strategy = scalingStrategy
  }

  if (minScale && !isNaN(parseFloat(minScale))) {
    options.minScale = parseFloat(minScale)
  }

  if (maxScale && !isNaN(parseFloat(maxScale))) {
    options.maxScale = parseFloat(maxScale)
  }

  if (maintainAspectRatio !== null) {
    options.maintainAspectRatio = maintainAspectRatio !== 'false'
  }

  return options
}

// Debug helper to display current scaling information
export function getScalingDebugInfo(scaling: { 
  scale: number
  actualGameWidth: number
  actualGameHeight: number
  containerWidth: number
  containerHeight: number
  offsetX: number
  offsetY: number
}): string {
  return `Scale: ${scaling.scale.toFixed(2)}x | ` +
         `Game: ${scaling.actualGameWidth}×${scaling.actualGameHeight} | ` +
         `Viewport: ${scaling.containerWidth}×${scaling.containerHeight} | ` +
         `Offset: (${scaling.offsetX}, ${scaling.offsetY})`
}