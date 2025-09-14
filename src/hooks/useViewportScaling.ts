import { useState, useEffect, useCallback } from 'react'
import { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT } from '../config/uiConfig'

export interface ViewportScaling {
  scale: number
  containerWidth: number
  containerHeight: number
  offsetX: number
  offsetY: number
  actualGameWidth: number
  actualGameHeight: number
}

export interface ScalingOptions {
  strategy?: 'fit-to-screen' | 'fit-to-width' | 'fit-to-height'
  minScale?: number
  maxScale?: number
  maintainAspectRatio?: boolean
}

const TARGET_ASPECT_RATIO = GAME_BOARD_WIDTH / GAME_BOARD_HEIGHT // 540/960 = 9:16

export function useViewportScaling(options: ScalingOptions = {}): ViewportScaling {
  const {
    strategy = 'fit-to-screen',
    minScale = 0.1,
    maxScale = 10,
    maintainAspectRatio = true
  } = options

  const [scaling, setScaling] = useState<ViewportScaling>(() => {
    return calculateScaling(window.innerWidth, window.innerHeight, strategy, minScale, maxScale, maintainAspectRatio)
  })

  const updateScaling = useCallback(() => {
    const newScaling = calculateScaling(
      window.innerWidth, 
      window.innerHeight, 
      strategy, 
      minScale, 
      maxScale, 
      maintainAspectRatio
    )
    setScaling(newScaling)
  }, [strategy, minScale, maxScale, maintainAspectRatio])

  useEffect(() => {
    // Update scaling on window resize
    window.addEventListener('resize', updateScaling)
    return () => window.removeEventListener('resize', updateScaling)
  }, [updateScaling])

  return scaling
}

function calculateScaling(
  viewportWidth: number, 
  viewportHeight: number,
  strategy: string,
  minScale: number,
  maxScale: number,
  maintainAspectRatio: boolean
): ViewportScaling {
  const viewportAspectRatio = viewportWidth / viewportHeight
  
  let scale: number
  let containerWidth: number
  let containerHeight: number

  if (!maintainAspectRatio) {
    // Simple fill strategy - stretch to fit
    scale = Math.min(viewportWidth / GAME_BOARD_WIDTH, viewportHeight / GAME_BOARD_HEIGHT)
    containerWidth = viewportWidth
    containerHeight = viewportHeight
  } else {
    // Maintain aspect ratio
    switch (strategy) {
      case 'fit-to-width':
        scale = viewportWidth / GAME_BOARD_WIDTH
        containerWidth = viewportWidth
        containerHeight = containerWidth / TARGET_ASPECT_RATIO
        break
      
      case 'fit-to-height':
        scale = viewportHeight / GAME_BOARD_HEIGHT
        containerHeight = viewportHeight
        containerWidth = containerHeight * TARGET_ASPECT_RATIO
        break
      
      case 'fit-to-screen':
      default:
        if (viewportAspectRatio > TARGET_ASPECT_RATIO) {
          // Viewport is wider than game - fit to height
          scale = viewportHeight / GAME_BOARD_HEIGHT
          containerHeight = viewportHeight
          containerWidth = containerHeight * TARGET_ASPECT_RATIO
        } else {
          // Viewport is taller than game - fit to width
          scale = viewportWidth / GAME_BOARD_WIDTH
          containerWidth = viewportWidth
          containerHeight = containerWidth / TARGET_ASPECT_RATIO
        }
        break
    }
  }

  // Apply scale limits
  scale = Math.max(minScale, Math.min(maxScale, scale))
  
  // Recalculate container dimensions based on clamped scale
  const actualGameWidth = GAME_BOARD_WIDTH * scale
  const actualGameHeight = GAME_BOARD_HEIGHT * scale
  
  // Calculate centering offsets
  const offsetX = Math.max(0, (viewportWidth - actualGameWidth) / 2)
  const offsetY = Math.max(0, (viewportHeight - actualGameHeight) / 2)

  return {
    scale,
    containerWidth: Math.min(containerWidth, viewportWidth),
    containerHeight: Math.min(containerHeight, viewportHeight),
    offsetX,
    offsetY,
    actualGameWidth,
    actualGameHeight
  }
}

// Utility function to convert screen coordinates to game coordinates
export function screenToGameCoordinates(
  screenX: number, 
  screenY: number, 
  scaling: ViewportScaling
): { x: number; y: number } {
  return {
    x: (screenX - scaling.offsetX) / scaling.scale,
    y: (screenY - scaling.offsetY) / scaling.scale
  }
}

// Utility function to convert game coordinates to screen coordinates
export function gameToScreenCoordinates(
  gameX: number, 
  gameY: number, 
  scaling: ViewportScaling
): { x: number; y: number } {
  return {
    x: gameX * scaling.scale + scaling.offsetX,
    y: gameY * scaling.scale + scaling.offsetY
  }
}