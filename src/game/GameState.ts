export interface TreeSegment {
  branchSide: 'left' | 'right' | 'none'
}

export interface AnimatedSegment {
  branchSide: 'left' | 'right' | 'none'
  animationId: string
  startTime: number
  direction: 'left' | 'right'
  startPosition: { x: number; y: number }
}

export interface GameState {
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'
  score: number
  gameOver: boolean
  showDebug: boolean
  treeSegments: TreeSegment[]
  animatedSegments: AnimatedSegment[]
  timeRemaining: number
  maxTime: number
}

import { GAME } from '../config/constants'

export const createInitialGameState = (): GameState => ({
  playerSide: 'left',
  playerState: 'idle',
  score: 0,
  gameOver: false,
  showDebug: false,
  treeSegments: [
    { branchSide: 'none' },
    { branchSide: 'right' },
    { branchSide: 'none' },
    { branchSide: 'left' },
    { branchSide: 'none' },
    { branchSide: 'right' },
    { branchSide: 'none' },
    { branchSide: 'left' }
  ],
  animatedSegments: [],
  timeRemaining: GAME.INITIAL_TIME_REMAINING_SEC,
  maxTime: GAME.MAX_TIME_SEC
})