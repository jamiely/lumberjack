import { describe, it, expect, vi } from 'vitest'
import { checkCollision, performChop, resetGame, toggleDebug } from '../GameLogic'
import { createInitialGameState, GameState, TreeSegment } from '../GameState'

describe('GameLogic', () => {
  describe('checkCollision', () => {
    it('returns true when player side matches next segment branch', () => {
      const segments: TreeSegment[] = [
        { branchSide: 'none' },
        { branchSide: 'left' },
        { branchSide: 'right' }
      ]
      
      const collision = checkCollision('left', segments)
      expect(collision).toBe(true)
    })

    it('returns false when player side does not match next segment branch', () => {
      const segments: TreeSegment[] = [
        { branchSide: 'none' },
        { branchSide: 'left' },
        { branchSide: 'right' }
      ]
      
      const collision = checkCollision('right', segments)
      expect(collision).toBe(false)
    })

    it('returns false when next segment has no branch', () => {
      const segments: TreeSegment[] = [
        { branchSide: 'none' },
        { branchSide: 'none' },
        { branchSide: 'right' }
      ]
      
      const collision = checkCollision('left', segments)
      expect(collision).toBe(false)
    })
  })

  describe('performChop', () => {
    it('returns same state when game is already over', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        gameOver: true
      }
      
      const result = performChop(gameState, 'left')
      expect(result).toBe(gameState)
    })

    it('sets game over when collision occurs', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        treeSegments: [
          { branchSide: 'none' },
          { branchSide: 'left' },
          { branchSide: 'right' }
        ]
      }
      
      const result = performChop(gameState, 'left')
      expect(result.gameOver).toBe(true)
      expect(result.score).toBe(0) // score should not increase on collision
    })

    it('updates player side, increases score, and shifts tree when no collision', () => {
      const gameState: GameState = {
        ...createInitialGameState(),
        playerSide: 'left',
        score: 5,
        treeSegments: [
          { branchSide: 'none' },
          { branchSide: 'right' }, // no collision when chopping left
          { branchSide: 'left' }
        ]
      }
      
      vi.spyOn(Math, 'random').mockReturnValue(0.8) // generates 'none'
      
      const result = performChop(gameState, 'left')
      
      expect(result.gameOver).toBe(false)
      expect(result.playerSide).toBe('left')
      expect(result.score).toBe(6)
      expect(result.treeSegments).toHaveLength(3)
      expect(result.treeSegments[0]).toEqual({ branchSide: 'right' })
      expect(result.treeSegments[1]).toEqual({ branchSide: 'left' })
      expect(result.treeSegments[2]).toEqual({ branchSide: 'none' })
    })
  })

  describe('resetGame', () => {
    it('returns initial game state', () => {
      const result = resetGame()
      const expected = createInitialGameState()
      expect(result).toEqual(expected)
    })
  })

  describe('toggleDebug', () => {
    it('toggles debug mode from false to true', () => {
      const gameState = { ...createInitialGameState(), showDebug: false }
      const result = toggleDebug(gameState)
      expect(result.showDebug).toBe(true)
    })

    it('toggles debug mode from true to false', () => {
      const gameState = { ...createInitialGameState(), showDebug: true }
      const result = toggleDebug(gameState)
      expect(result.showDebug).toBe(false)
    })
  })
})