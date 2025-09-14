import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClickInputService } from '../ClickInputService'
import type { ViewportScaling } from '../../hooks/useViewportScaling'

describe('ClickInputService', () => {
  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = ''
  })

  describe('getChopSideFromClick', () => {
    it('should return left for clicks left of tree center', () => {
      const side = ClickInputService.getChopSideFromClick(200) // Left of center (270)
      expect(side).toBe('left')
    })

    it('should return right for clicks right of tree center', () => {
      const side = ClickInputService.getChopSideFromClick(300) // Right of center (270)
      expect(side).toBe('right')
    })

    it('should return right for clicks exactly at tree center', () => {
      const side = ClickInputService.getChopSideFromClick(270) // Exactly at center
      expect(side).toBe('right')
    })
  })

  describe('getChopSideFromScaledClick', () => {
    const mockScaling: ViewportScaling = {
      scale: 2,
      containerWidth: 1080,
      containerHeight: 1920,
      offsetX: 100,
      offsetY: 200,
      actualGameWidth: 1080,
      actualGameHeight: 1920
    }

    it('should correctly handle scaled clicks for left side', () => {
      // Screen coordinates that should map to left side of tree
      const screenX = 300 // Will map to game coordinate (300-100)/2 = 100
      const screenY = 400
      
      const side = ClickInputService.getChopSideFromScaledClick(screenX, screenY, mockScaling)
      expect(side).toBe('left')
    })

    it('should correctly handle scaled clicks for right side', () => {
      // Screen coordinates that should map to right side of tree
      const screenX = 700 // Will map to game coordinate (700-100)/2 = 300
      const screenY = 400
      
      const side = ClickInputService.getChopSideFromScaledClick(screenX, screenY, mockScaling)
      expect(side).toBe('right')
    })

    it('should handle edge case at tree center with scaling', () => {
      // Screen coordinates that map exactly to tree center
      const screenX = 100 + (270 * 2) // offsetX + (treeCenterX * scale) = 640
      const screenY = 400
      
      const side = ClickInputService.getChopSideFromScaledClick(screenX, screenY, mockScaling)
      expect(side).toBe('right')
    })
  })

  describe('isValidChopClick', () => {
    it('should return true for clicks within game board', () => {
      const gameBoard = document.createElement('div')
      gameBoard.setAttribute('data-testid', 'game-board')
      document.body.appendChild(gameBoard)
      
      const childElement = document.createElement('div')
      gameBoard.appendChild(childElement)
      
      const isValid = ClickInputService.isValidChopClick(childElement)
      expect(isValid).toBe(true)
    })

    it('should return true for clicks within scaled game content', () => {
      const scaledContent = document.createElement('div')
      scaledContent.setAttribute('data-testid', 'scaled-game-content')
      document.body.appendChild(scaledContent)
      
      const childElement = document.createElement('div')
      scaledContent.appendChild(childElement)
      
      const isValid = ClickInputService.isValidChopClick(childElement)
      expect(isValid).toBe(true)
    })

    it('should return false for clicks outside game areas', () => {
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      
      const isValid = ClickInputService.isValidChopClick(outsideElement)
      expect(isValid).toBe(false)
    })
  })

  describe('getScalingFromScreenContainer', () => {
    it('should extract scaling information from DOM attributes', () => {
      const container = document.createElement('div')
      container.className = 'screen-container'
      container.setAttribute('data-scale', '1.5')
      container.setAttribute('data-offset-x', '50')
      container.setAttribute('data-offset-y', '75')
      document.body.appendChild(container)

      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true })
      
      const scaling = ClickInputService.getScalingFromScreenContainer()
      
      expect(scaling).not.toBeNull()
      expect(scaling!.scale).toBe(1.5)
      expect(scaling!.offsetX).toBe(50)
      expect(scaling!.offsetY).toBe(75)
      expect(scaling!.actualGameWidth).toBe(540 * 1.5)
      expect(scaling!.actualGameHeight).toBe(960 * 1.5)
      expect(scaling!.containerWidth).toBe(1920)
      expect(scaling!.containerHeight).toBe(1080)
    })

    it('should return null if no screen container exists', () => {
      const scaling = ClickInputService.getScalingFromScreenContainer()
      expect(scaling).toBeNull()
    })

    it('should handle missing attributes gracefully', () => {
      const container = document.createElement('div')
      container.className = 'screen-container'
      // Missing data attributes should use defaults
      document.body.appendChild(container)

      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true })
      
      const scaling = ClickInputService.getScalingFromScreenContainer()
      
      expect(scaling).not.toBeNull()
      expect(scaling!.scale).toBe(1) // Default
      expect(scaling!.offsetX).toBe(0) // Default
      expect(scaling!.offsetY).toBe(0) // Default
    })
  })

  describe('getClickPositionRelativeToElement', () => {
    it('should calculate relative position correctly', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      // Mock getBoundingClientRect
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 100,
        top: 200,
        width: 400,
        height: 600
      })
      
      const mockEvent = new MouseEvent('click', {
        clientX: 250,
        clientY: 350
      })
      
      const position = ClickInputService.getClickPositionRelativeToElement(mockEvent, element)
      
      expect(position.x).toBe(150) // 250 - 100
      expect(position.y).toBe(150) // 350 - 200
    })
  })
})