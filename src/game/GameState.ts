export interface TreeSegment {
  branchSide: 'left' | 'right' | 'none'
}

export interface GameState {
  playerSide: 'left' | 'right'
  score: number
  gameOver: boolean
  showDebug: boolean
  treeSegments: TreeSegment[]
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
  ]
})