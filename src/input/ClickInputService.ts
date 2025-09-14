import { TREE_TRUNK_LEFT_POSITION, TREE_TRUNK_WIDTH } from '../config/treeConfig'

export class ClickInputService {
  static getChopSideFromClick(clickX: number): 'left' | 'right' {
    // Calculate the tree center position using trunk configuration
    const treeCenterX = TREE_TRUNK_LEFT_POSITION + TREE_TRUNK_WIDTH / 2
    
    return clickX < treeCenterX ? 'left' : 'right'
  }

  static isValidChopClick(target: HTMLElement): boolean {
    // Check if the click target is within the game board or a descendant of it
    const gameBoard = target.closest('[data-testid="game-board"]')
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
}