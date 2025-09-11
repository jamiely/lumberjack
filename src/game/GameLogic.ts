import type { GameState, AnimatedSegment } from './GameState'
import { createInitialGameState } from './GameState'
import { addNewSegmentToTree } from './TreeSystem'
import { gameEvents } from './GameEvents'
import {
  TIME_ADDED_PER_CHOP_SEC,
  TIMER_WARNING_THRESHOLD_SEC,
  TREE_TRUNK_LEFT_POSITION,
  TREE_TRUNK_BOTTOM_OFFSET
} from '../constants'

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
      x: TREE_TRUNK_LEFT_POSITION, // Tree trunk x position
      y: TREE_TRUNK_BOTTOM_OFFSET   // Bottom segment y position
    }
  }

  gameEvents.emit('chop')

  return {
    ...gameState,
    playerSide: side,
    score: gameState.score + 1,
    treeSegments: addNewSegmentToTree(gameState.treeSegments),
    animatedSegments: [...gameState.animatedSegments, animatedSegment],
    timeRemaining: Math.min(gameState.maxTime, gameState.timeRemaining + TIME_ADDED_PER_CHOP_SEC)
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
  
  // Emit timer warning when time is running low (less than 1 second)
  if (newTimeRemaining <= TIMER_WARNING_THRESHOLD_SEC && gameState.timeRemaining > TIMER_WARNING_THRESHOLD_SEC) {
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