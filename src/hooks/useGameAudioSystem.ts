import { useEffect } from 'react'
import type { GameState } from '../game/GameState'
import { useGameAudio } from '../audio/hooks/useGameAudio'

export function useGameAudioSystem(_gameState: GameState, stateMachine?: EventTarget) {
  const { playChopSound, playHitSound, playGameOverSound, playTimerWarning } = useGameAudio()

  useEffect(() => {
    if (!stateMachine) return

    // Listen to game events for audio responses
    const handleChop = () => {
      playChopSound()
    }

    const handleHit = () => {
      playHitSound()
    }

    const handleGameOver = () => {
      playGameOverSound()
    }

    const handleTimerWarning = () => {
      playTimerWarning()
    }

    // Add event listeners
    stateMachine.addEventListener('chop', handleChop)
    stateMachine.addEventListener('hit', handleHit)
    stateMachine.addEventListener('gameOver', handleGameOver)
    stateMachine.addEventListener('timerWarning', handleTimerWarning)

    return () => {
      // Clean up event listeners
      stateMachine.removeEventListener('chop', handleChop)
      stateMachine.removeEventListener('hit', handleHit)
      stateMachine.removeEventListener('gameOver', handleGameOver)
      stateMachine.removeEventListener('timerWarning', handleTimerWarning)
    }
  }, [stateMachine, playChopSound, playHitSound, playGameOverSound, playTimerWarning])

  // Additional audio system initialization could go here
}