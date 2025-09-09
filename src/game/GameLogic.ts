import type { GameState } from './GameState'
import { createInitialGameState } from './GameState'
import { addNewSegmentToTree } from './TreeSystem'

export const checkCollision = (
  playerSide: 'left' | 'right', 
  treeSegments: GameState['treeSegments']
): boolean => {
  const nextBottomSegment = treeSegments[1]
  return nextBottomSegment?.branchSide === playerSide
}

export const performChop = (
  gameState: GameState, 
  side: 'left' | 'right'
): GameState => {
  if (gameState.gameOver) {
    return gameState
  }

  const collision = checkCollision(side, gameState.treeSegments)
  
  if (collision) {
    return {
      ...gameState,
      gameOver: true
    }
  }

  return {
    ...gameState,
    playerSide: side,
    score: gameState.score + 1,
    treeSegments: addNewSegmentToTree(gameState.treeSegments)
  }
}

export const resetGame = (): GameState => {
  return createInitialGameState()
}

export const toggleDebug = (gameState: GameState): GameState => {
  return {
    ...gameState,
    showDebug: !gameState.showDebug
  }
}