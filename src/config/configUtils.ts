import { SCALING } from './constants';
import type { ScalingOptions } from './types';

/**
 * Get scaling options based on environment or URL parameters
 * Moved from scalingConfig.ts
 */
export function getScalingOptions(): ScalingOptions {
  // Check URL parameters for scaling configuration
  const urlParams = new URLSearchParams(window.location.search)
  const scalingStrategy = urlParams.get('scaling') as ScalingOptions['strategy']
  const minScale = urlParams.get('minScale')
  const maxScale = urlParams.get('maxScale')
  const maintainAspectRatio = urlParams.get('aspectRatio')

  // Start with default options - create fresh object to avoid const typing issues
  let options: ScalingOptions = {
    strategy: SCALING.DEFAULT_OPTIONS.strategy,
    minScale: SCALING.DEFAULT_OPTIONS.minScale,
    maxScale: SCALING.DEFAULT_OPTIONS.maxScale,
    maintainAspectRatio: SCALING.DEFAULT_OPTIONS.maintainAspectRatio,
  }

  // Check for environment-specific defaults
  if (import.meta.env.MODE === 'development') {
    options = {
      strategy: SCALING.DEVELOPMENT_OPTIONS.strategy,
      minScale: SCALING.DEVELOPMENT_OPTIONS.minScale,
      maxScale: SCALING.DEVELOPMENT_OPTIONS.maxScale,
      maintainAspectRatio: SCALING.DEVELOPMENT_OPTIONS.maintainAspectRatio,
    }
  } else if (window.location.pathname.includes('/arcade')) {
    options = {
      strategy: SCALING.ARCADE_OPTIONS.strategy,
      minScale: SCALING.ARCADE_OPTIONS.minScale,
      maxScale: SCALING.ARCADE_OPTIONS.maxScale,
      maintainAspectRatio: SCALING.ARCADE_OPTIONS.maintainAspectRatio,
    }
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

/**
 * Debug helper to display current scaling information
 * Moved from scalingConfig.ts
 */
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