import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'

describe('useGameState', () => {
  it('initializes with default game state', () => {
    const { result } = renderHook(() => useGameState())
    
    expect(result.current.gameState.playerSide).toBe('left')
    expect(result.current.gameState.score).toBe(0)
    expect(result.current.gameState.gameOver).toBe(false)
    expect(result.current.gameState.showDebug).toBe(false)
    expect(result.current.gameState.treeSegments).toHaveLength(8)
  })

  it('provides chop function that updates game state', () => {
    const { result } = renderHook(() => useGameState())
    
    // Initial state: segments[1] has 'right' branch, so chopping 'left' is safe
    act(() => {
      result.current.chop('left')
    })
    
    expect(result.current.gameState.playerSide).toBe('left')
    expect(result.current.gameState.score).toBe(1)
    expect(result.current.gameState.treeSegments).toHaveLength(8)
  })

  it('handles collision correctly in chop function', () => {
    const { result } = renderHook(() => useGameState())
    
    // Get initial state to understand tree structure
    const initialSegments = result.current.gameState.treeSegments
    const nextBottomSegment = initialSegments[1]
    
    if (nextBottomSegment.branchSide !== 'none') {
      // Chop on the side with a branch to trigger collision
      act(() => {
        result.current.chop(nextBottomSegment.branchSide)
      })
      
      expect(result.current.gameState.gameOver).toBe(true)
      expect(result.current.gameState.score).toBe(0) // Score shouldn't increase on collision
    }
  })

  it('provides reset function that resets game state', () => {
    const { result } = renderHook(() => useGameState())
    
    // First, make some changes to the game state (safe chop)
    act(() => {
      result.current.chop('left') // Safe because segments[1] has 'right' branch
      result.current.toggleDebugMode()
    })
    
    expect(result.current.gameState.score).toBe(1)
    expect(result.current.gameState.showDebug).toBe(true)
    
    // Then reset
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.gameState.playerSide).toBe('left')
    expect(result.current.gameState.score).toBe(0)
    expect(result.current.gameState.gameOver).toBe(false)
    expect(result.current.gameState.showDebug).toBe(false)
    expect(result.current.gameState.treeSegments).toHaveLength(8)
  })

  it('provides toggleDebugMode function', () => {
    const { result } = renderHook(() => useGameState())
    
    expect(result.current.gameState.showDebug).toBe(false)
    
    act(() => {
      result.current.toggleDebugMode()
    })
    
    expect(result.current.gameState.showDebug).toBe(true)
    
    act(() => {
      result.current.toggleDebugMode()
    })
    
    expect(result.current.gameState.showDebug).toBe(false)
  })

  it('prevents chopping when game is over', () => {
    const { result } = renderHook(() => useGameState())
    
    // First, find a collision scenario and trigger game over
    const initialSegments = result.current.gameState.treeSegments
    const nextBottomSegment = initialSegments[1]
    
    if (nextBottomSegment.branchSide !== 'none') {
      act(() => {
        result.current.chop(nextBottomSegment.branchSide)
      })
      
      expect(result.current.gameState.gameOver).toBe(true)
      const scoreAfterGameOver = result.current.gameState.score
      
      // Try to chop again - should not change anything
      act(() => {
        result.current.chop('left')
      })
      
      expect(result.current.gameState.score).toBe(scoreAfterGameOver)
    }
  })

  it('maintains immutability of game state updates', () => {
    const { result } = renderHook(() => useGameState())
    
    const initialState = result.current.gameState
    
    act(() => {
      result.current.chop('left') // Safe chop that will actually change state
    })
    
    const updatedState = result.current.gameState
    
    // States should be different objects
    expect(updatedState).not.toBe(initialState)
    expect(updatedState.treeSegments).not.toBe(initialState.treeSegments)
  })
})