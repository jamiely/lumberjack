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
  score: number
  gameOver: boolean
  showDebug: boolean
  treeSegments: TreeSegment[]
  animatedSegments: AnimatedSegment[]
  timeRemaining: number
  maxTime: number
}

export const createInitialGameState = (): GameState => ({
  playerSide: 'left',
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
  timeRemaining: 10.0,
  maxTime: 10.0
})