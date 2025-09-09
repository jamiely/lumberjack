import type { TreeSegment } from './GameState'

export const generateRandomBranch = (): TreeSegment => {
  const random = Math.random()
  if (random < 0.3) return { branchSide: 'left' }
  if (random < 0.6) return { branchSide: 'right' }
  return { branchSide: 'none' }
}

export const addNewSegmentToTree = (segments: TreeSegment[]): TreeSegment[] => {
  return [
    ...segments.slice(1),
    generateRandomBranch()
  ]
}