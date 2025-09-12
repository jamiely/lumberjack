import { useState, useEffect } from 'react'
import type { GameState } from '../game/GameState'
import { createInitialGameState } from '../game/GameState'
import { performChop, resetGame, toggleDebug, updateTimer } from '../game/GameLogic'
import { TIMER_UPDATE_INTERVAL_MS, CHOPPING_STATE_DURATION_MS } from '../constants'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())

  // Timer update effect
  useEffect(() => {
    if (gameState.gameOver) return

    const interval = setInterval(() => {
      setGameState(current => updateTimer(current, 0.1)) // Update every 100ms
    }, TIMER_UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [gameState.gameOver])

  // Chopping state timer effect
  useEffect(() => {
    if (gameState.playerState === 'chopping') {
      const timer = setTimeout(() => {
        setGameState(current => ({
          ...current,
          playerState: 'idle'
        }))
      }, CHOPPING_STATE_DURATION_MS)

      return () => clearTimeout(timer)
    }
  }, [gameState.playerState])

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