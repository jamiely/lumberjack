import { useState } from 'react'
import type { GameState } from '../game/GameState'
import { createInitialGameState } from '../game/GameState'
import { performChop, resetGame, toggleDebug } from '../game/GameLogic'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())

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