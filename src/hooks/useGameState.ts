import { useState, useEffect } from 'react'
import type { GameState } from '../game/GameState'
import { createInitialGameState } from '../game/GameState'
import { performChop, resetGame, toggleDebug, updateTimer } from '../game/GameLogic'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())

  // Timer update effect
  useEffect(() => {
    if (gameState.gameOver) return

    const interval = setInterval(() => {
      setGameState(current => updateTimer(current, 0.1)) // Update every 100ms
    }, 100)

    return () => clearInterval(interval)
  }, [gameState.gameOver])

  const chop = (side: 'left' | 'right') => {
    setGameState(current => performChop(current, side))
  }

  const reset = () => {
    setGameState(resetGame())
  }

  const toggleDebugMode = () => {
    setGameState(current => toggleDebug(current))
  }

  const removeAnimatedSegment = (animationId: string) => {
    setGameState(current => ({
      ...current,
      animatedSegments: current.animatedSegments.filter(segment => segment.animationId !== animationId)
    }))
  }

  return {
    gameState,
    chop,
    reset,
    toggleDebugMode,
    removeAnimatedSegment
  }
}