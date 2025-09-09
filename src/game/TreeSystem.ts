import type { TreeSegment } from './GameState'

let deterministicSequence: ('left' | 'right' | 'none')[] | null = null
let deterministicIndex = 0
let checkedTestMode = false

export const generateRandomBranch = (): TreeSegment => {
  // Check for test mode lazily on first call
  if (!checkedTestMode && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('testMode') === 'true') {
      // Deterministic sequence that always has 'right' at position 1 for predictable collisions
      // This ensures ArrowRight will always cause collision when player is on right side
      deterministicSequence = [
        'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right',
        'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right'
      ]
    }
    checkedTestMode = true
  }

  if (deterministicSequence) {
    const branchSide = deterministicSequence[deterministicIndex % deterministicSequence.length]
    deterministicIndex++
    return { branchSide }
  }
  
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