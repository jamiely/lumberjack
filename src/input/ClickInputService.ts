import { TREE } from '../config/constants'
import { screenToGameCoordinates, type ViewportScaling } from '../hooks/useViewportScaling'

export class ClickInputService {
  static getChopSideFromClick(clickX: number): 'left' | 'right' {
    // Calculate the tree center position using trunk configuration
    const treeCenterX = TREE.TREE_TRUNK_LEFT_POSITION + TREE.TREE_TRUNK_WIDTH / 2
    
    return clickX < treeCenterX ? 'left' : 'right'
  }

  static getChopSideFromScaledClick(
    screenX: number, 
    screenY: number,
    scaling: ViewportScaling
  ): 'left' | 'right' {
    // Convert screen coordinates to game coordinates
    const gameCoords = screenToGameCoordinates(screenX, screenY, scaling)
    return this.getChopSideFromClick(gameCoords.x)
  }

  static isValidChopClick(target: HTMLElement): boolean {
    // Check if the click target is within the game board or a descendant of it
    const gameBoard = target.closest('[data-testid="game-board"]') || 
                     target.closest('[data-testid="scaled-game-content"]')
    return gameBoard !== null
  }

  static getClickPositionRelativeToElement(
    event: MouseEvent, 
    element: HTMLElement
  ): { x: number; y: number } {
    const rect = element.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  static getScalingFromScreenContainer(): ViewportScaling | null {
    // Get scaling information from the screen container data attributes
    const container = document.querySelector('.screen-container')
    if (!container) return null

    const scale = parseFloat(container.getAttribute('data-scale') || '1')
    const offsetX = parseFloat(container.getAttribute('data-offset-x') || '0')
    const offsetY = parseFloat(container.getAttribute('data-offset-y') || '0')

    // Calculate other properties based on scale
    const actualGameWidth = 540 * scale
    const actualGameHeight = 960 * scale

    return {
      scale,
      containerWidth: window.innerWidth,
      containerHeight: window.innerHeight,
      offsetX,
      offsetY,
      actualGameWidth,
      actualGameHeight
    }
  }
}