import type { GameState, AnimatedSegment } from './GameState'
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

  // Get the bottom segment that will be removed
  const bottomSegment = gameState.treeSegments[0]
  
  // Create animated segment from the chopped segment
  const animatedSegment: AnimatedSegment = {
    branchSide: bottomSegment.branchSide,
    animationId: `segment-${Date.now()}-${Math.random()}`,
    startTime: performance.now(),
    direction: side === 'left' ? 'right' : 'left', // Fly opposite to player
    startPosition: {
      x: 236, // Tree trunk x position
      y: 38   // Bottom segment y position
    }
  }

  return {
    ...gameState,
    playerSide: side,
    score: gameState.score + 1,
    treeSegments: addNewSegmentToTree(gameState.treeSegments),
    animatedSegments: [...gameState.animatedSegments, animatedSegment]
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