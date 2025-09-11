import type { GameState, AnimatedSegment } from './GameState'
import { createInitialGameState } from './GameState'
import { addNewSegmentToTree } from './TreeSystem'
import { gameEvents } from './GameEvents'

const SECONDS_ADDED_PER_CHOP = 0.25;
const TIMER_WARNING_SECONDS = 1;

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
    gameEvents.emit('hit')
    gameEvents.emit('gameOver')
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

  gameEvents.emit('chop')

  return {
    ...gameState,
    playerSide: side,
    score: gameState.score + 1,
    treeSegments: addNewSegmentToTree(gameState.treeSegments),
    animatedSegments: [...gameState.animatedSegments, animatedSegment],
    timeRemaining: Math.min(gameState.maxTime, gameState.timeRemaining + SECONDS_ADDED_PER_CHOP)
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

export const updateTimer = (
  gameState: GameState, 
  deltaTime: number
): GameState => {
  if (gameState.gameOver) {
    return gameState
  }

  const newTimeRemaining = Math.max(0, gameState.timeRemaining - deltaTime)
  
  // Emit timer warning when time is running low (less than 3 seconds)
  if (newTimeRemaining <= TIMER_WARNING_SECONDS && gameState.timeRemaining > TIMER_WARNING_SECONDS) {
    gameEvents.emit('timerWarning')
  }
  
  // Game over if timer expires
  if (newTimeRemaining <= 0) {
    gameEvents.emit('gameOver')
    return {
      ...gameState,
      timeRemaining: 0,
      gameOver: true
    }
  }

  return {
    ...gameState,
    timeRemaining: newTimeRemaining
  }
}