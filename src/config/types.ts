/**
 * Configuration types extracted from various modules
 * to eliminate circular dependencies
 */

/**
 * Viewport scaling configuration options
 * Moved from hooks/useViewportScaling.ts
 */
export interface ScalingOptions {
  strategy?: 'fit-to-screen' | 'fit-to-width' | 'fit-to-height'
  minScale?: number
  maxScale?: number
  maintainAspectRatio?: boolean
}

/**
 * Viewport scaling calculation results
 * Re-exported for convenience from hooks/useViewportScaling.ts
 */
export interface ViewportScaling {
  scale: number
  containerWidth: number
  containerHeight: number
  offsetX: number
  offsetY: number
  actualGameWidth: number
  actualGameHeight: number
}