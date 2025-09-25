import type { GameState, AnimatedSegment } from '../GameState'
import type { GameCommand, GameEvent } from './GameCommand'
import { checkCollision } from '../GameLogic'
import { addNewSegmentToTree } from '../TreeSystem'
import { GAME, TREE } from '../../config/constants'

export class ChopCommand implements GameCommand {
  private side: 'left' | 'right'
  
  constructor(side: 'left' | 'right') {
    this.side = side
  }

  execute(state: GameState): GameState {
    if (state.gameOver) {
      return state
    }

    const collision = checkCollision(this.side, state.treeSegments)
    
    if (collision) {
      return {
        ...state,
        gameOver: true,
        playerState: 'hit'
      }
    }

    // Get the bottom segment that will be removed
    const bottomSegment = state.treeSegments[0]
    
    // Create animated segment from the chopped segment
    const animatedSegment: AnimatedSegment = {
      branchSide: bottomSegment.branchSide,
      animationId: `segment-${Date.now()}-${Math.random()}`,
      startTime: performance.now(),
      direction: this.side === 'left' ? 'right' : 'left', // Fly opposite to player
      startPosition: {
        x: TREE.TREE_TRUNK_LEFT_POSITION, // Tree trunk x position
        y: TREE.TREE_TRUNK_BOTTOM_OFFSET   // Bottom segment y position
      }
    }

    return {
      ...state,
      playerSide: this.side,
      playerState: 'chopping',
      score: state.score + 1,
      treeSegments: addNewSegmentToTree(state.treeSegments),
      animatedSegments: [...state.animatedSegments, animatedSegment],
      timeRemaining: Math.min(state.maxTime, state.timeRemaining + GAME.TIME_ADDED_PER_CHOP_SEC)
    }
  }

  getEvents(): GameEvent[] {
    const events: GameEvent[] = []
    
    // We need to check collision during execution to determine events
    // For now, always emit chop event - collision handling is in execute
    events.push({ type: 'chop', data: { side: this.side } })
    
    return events
  }
}