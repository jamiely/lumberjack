import { describe, it, expect, vi } from 'vitest'
import { generateRandomBranch, addNewSegmentToTree } from '../TreeSystem'
import type { TreeSegment } from '../GameState'

describe('TreeSystem', () => {
  describe('generateRandomBranch', () => {
    it('generates left branch when random < 0.3', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      const branch = generateRandomBranch()
      expect(branch.branchSide).toBe('left')
    })

    it('generates right branch when random is between 0.3 and 0.6', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4)
      const branch = generateRandomBranch()
      expect(branch.branchSide).toBe('right')
    })

    it('generates no branch when random >= 0.6', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      const branch = generateRandomBranch()
      expect(branch.branchSide).toBe('none')
    })
  })

  describe('addNewSegmentToTree', () => {
    it('removes first segment and adds new segment at end', () => {
      const initialSegments: TreeSegment[] = [
        { branchSide: 'left' },
        { branchSide: 'right' },
        { branchSide: 'none' }
      ]
      
      vi.spyOn(Math, 'random').mockReturnValue(0.2) // will generate 'left'
      
      const result = addNewSegmentToTree(initialSegments)
      
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ branchSide: 'right' })
      expect(result[1]).toEqual({ branchSide: 'none' })
      expect(result[2]).toEqual({ branchSide: 'left' })
    })

    it('maintains segment count', () => {
      const segments = Array.from({ length: 8 }, () => ({ branchSide: 'none' as const }))
      const result = addNewSegmentToTree(segments)
      expect(result).toHaveLength(8)
    })
  })
})