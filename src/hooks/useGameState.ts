import { useState, useEffect, useMemo } from 'react'
import type { GameState } from '../game/GameState'
import { GameStateMachine } from '../game/GameStateMachine'
import { ChopCommand } from '../game/commands/ChopCommand'
import { ResetCommand } from '../game/commands/ResetCommand'
import { ToggleDebugCommand } from '../game/commands/ToggleDebugCommand'
import { TickCommand } from '../game/commands/TickCommand'
import { ResetPlayerStateCommand } from '../game/commands/ResetPlayerStateCommand'
import { TIMER_UPDATE_INTERVAL_MS, CHOPPING_STATE_DURATION_MS } from '../config/gameConfig'

export function useGameState() {
  // Create game state machine
  const stateMachine = useMemo(() => new GameStateMachine(), [])
  const [gameState, setGameState] = useState<GameState>(stateMachine.getState())

  // Listen to state machine events
  useEffect(() => {
    const handleStateChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setGameState(customEvent.detail)
    }

    stateMachine.addEventListener('stateChange', handleStateChange)
    return () => stateMachine.removeEventListener('stateChange', handleStateChange)
  }, [stateMachine])

  // Timer update effect
  useEffect(() => {
    if (gameState.gameOver) return

    const interval = setInterval(() => {
      stateMachine.dispatch(new TickCommand(0.1)) // Update every 100ms
    }, TIMER_UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [gameState.gameOver, stateMachine])

  // Chopping state timer effect
  useEffect(() => {
    if (gameState.playerState === 'chopping') {
      const timer = setTimeout(() => {
        stateMachine.dispatch(new ResetPlayerStateCommand())
      }, CHOPPING_STATE_DURATION_MS)

      return () => clearTimeout(timer)
    }
  }, [gameState.playerState, stateMachine])

  const chop = (side: 'left' | 'right') => {
    stateMachine.dispatch(new ChopCommand(side))
  }

  const reset = () => {
    stateMachine.dispatch(new ResetCommand())
  }

  const toggleDebugMode = () => {
    stateMachine.dispatch(new ToggleDebugCommand())
  }

  return {
    gameState,
    chop,
    reset,
    toggleDebugMode,
    stateMachine // Expose state machine for audio handlers
  }
}