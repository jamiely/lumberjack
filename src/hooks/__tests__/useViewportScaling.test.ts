import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useViewportScaling, screenToGameCoordinates, gameToScreenCoordinates } from '../useViewportScaling'

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

describe('useViewportScaling', () => {
  beforeEach(() => {
    // Reset window dimensions
    mockWindowDimensions(1920, 1080)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should calculate correct scaling for landscape viewport (fit-to-screen)', () => {
    mockWindowDimensions(1920, 1080) // 16:9 landscape
    
    const { result } = renderHook(() => useViewportScaling())
    
    // Should fit to height since viewport is wider than 9:16
    expect(result.current.scale).toBeCloseTo(1080 / 960) // 1.125
    expect(result.current.containerHeight).toBe(1080)
    expect(result.current.actualGameHeight).toBe(1080)
    expect(result.current.offsetY).toBe(0)
    expect(result.current.offsetX).toBeGreaterThan(0) // Centered horizontally
  })

  it('should calculate correct scaling for portrait viewport (fit-to-screen)', () => {
    mockWindowDimensions(1080, 1920) // 9:16 portrait (arcade cabinet)
    
    const { result } = renderHook(() => useViewportScaling())
    
    // Should fit to width since viewport matches aspect ratio
    expect(result.current.scale).toBeCloseTo(1080 / 540) // 2.0
    expect(result.current.containerWidth).toBe(1080)
    expect(result.current.actualGameWidth).toBe(1080)
    expect(result.current.offsetX).toBe(0)
    expect(result.current.offsetY).toBe(0)
  })

  it('should respect min/max scale limits', () => {
    mockWindowDimensions(100, 100) // Very small viewport
    
    const { result } = renderHook(() => 
      useViewportScaling({ 
        minScale: 0.5, 
        maxScale: 2 
      })
    )
    
    expect(result.current.scale).toBeGreaterThanOrEqual(0.5)
    expect(result.current.scale).toBeLessThanOrEqual(2)
  })

  it('should use fit-to-width strategy correctly', () => {
    mockWindowDimensions(1920, 1080)
    
    const { result } = renderHook(() => 
      useViewportScaling({ strategy: 'fit-to-width' })
    )
    
    expect(result.current.scale).toBeCloseTo(1920 / 540) // Scale based on width
    expect(result.current.containerWidth).toBe(1920)
  })

  it('should use fit-to-height strategy correctly', () => {
    mockWindowDimensions(1920, 1080)
    
    const { result } = renderHook(() => 
      useViewportScaling({ strategy: 'fit-to-height' })
    )
    
    expect(result.current.scale).toBeCloseTo(1080 / 960) // Scale based on height
    expect(result.current.containerHeight).toBe(1080)
  })

  it('should update scaling on window resize', () => {
    const { result } = renderHook(() => useViewportScaling())
    
    const initialScale = result.current.scale
    
    act(() => {
      mockWindowDimensions(800, 600)
      window.dispatchEvent(new Event('resize'))
    })
    
    expect(result.current.scale).not.toBe(initialScale)
  })
})

describe('coordinate conversion utilities', () => {
  const mockScaling = {
    scale: 2,
    containerWidth: 1080,
    containerHeight: 1920,
    offsetX: 100,
    offsetY: 200,
    actualGameWidth: 1080,
    actualGameHeight: 1920
  }

  it('should convert screen coordinates to game coordinates', () => {
    const gameCoords = screenToGameCoordinates(300, 400, mockScaling)
    
    expect(gameCoords.x).toBe((300 - 100) / 2) // (300 - offsetX) / scale
    expect(gameCoords.y).toBe((400 - 200) / 2) // (400 - offsetY) / scale
  })

  it('should convert game coordinates to screen coordinates', () => {
    const screenCoords = gameToScreenCoordinates(100, 150, mockScaling)
    
    expect(screenCoords.x).toBe(100 * 2 + 100) // gameX * scale + offsetX
    expect(screenCoords.y).toBe(150 * 2 + 200) // gameY * scale + offsetY
  })

  it('should have symmetric coordinate conversion', () => {
    const originalGameX = 270 // Tree center
    const originalGameY = 480 // Game center
    
    const screenCoords = gameToScreenCoordinates(originalGameX, originalGameY, mockScaling)
    const backToGameCoords = screenToGameCoordinates(screenCoords.x, screenCoords.y, mockScaling)
    
    expect(backToGameCoords.x).toBeCloseTo(originalGameX)
    expect(backToGameCoords.y).toBeCloseTo(originalGameY)
  })
})