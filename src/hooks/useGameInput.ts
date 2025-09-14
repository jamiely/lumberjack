import { useEffect } from 'react'
import type { GameInputHandler } from '../input/GameInputHandler'
import { ClickInputService } from '../input/ClickInputService'

interface UseGameInputOptions {
  enableKeyboard?: boolean
  enableMouse?: boolean
  gameOver?: boolean
}

export function useGameInput(
  handlers: GameInputHandler, 
  options: UseGameInputOptions = {}
) {
  const { 
    enableKeyboard = true, 
    enableMouse = true, 
    gameOver = false 
  } = options

  // Keyboard input handling
  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
          handlers.onChopLeft()
          break
        case 'ArrowRight':
          handlers.onChopRight()
          break
        case 'r':
          handlers.onReset()
          break
        case '?':
          handlers.onToggleDebug()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handlers, enableKeyboard])

  // Mouse input handling
  useEffect(() => {
    if (!enableMouse) return

    const handleClick = (e: MouseEvent) => {
      if (gameOver) return
      
      const target = e.target as HTMLElement
      
      // Check if click is within a valid game area
      if (!ClickInputService.isValidChopClick(target)) return
      
      // Get the game board element to calculate click position
      const gameBoard = target.closest('[data-testid="game-board"]') as HTMLElement
      if (!gameBoard) return
      
      const gameBoardRect = gameBoard.getBoundingClientRect()
      const clickX = e.clientX - gameBoardRect.left
      
      // Determine which side was clicked and call appropriate handler
      const side = ClickInputService.getChopSideFromClick(clickX)
      if (side === 'left') {
        handlers.onChopLeft()
      } else {
        handlers.onChopRight()
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [handlers, enableMouse, gameOver])
}