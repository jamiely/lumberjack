import type { GameState } from '../GameState'
import type { GameCommand, GameEvent } from './GameCommand'
import { GAME } from '../../config/constants'

export class TickCommand implements GameCommand {
  private deltaTime: number
  
  constructor(deltaTime: number) {
    this.deltaTime = deltaTime
  }

  execute(state: GameState): GameState {
    if (state.gameOver) {
      return state
    }

    const newTimeRemaining = Math.max(0, state.timeRemaining - this.deltaTime)
    
    // Game over if timer expires
    if (newTimeRemaining <= 0) {
      return {
        ...state,
        timeRemaining: 0,
        gameOver: true,
        playerState: 'hit'
      }
    }

    return {
      ...state,
      timeRemaining: newTimeRemaining
    }
  }

  getEvents(): GameEvent[] {
    const events: GameEvent[] = []
    
    const currentTime = performance.now() / 1000 // Convert to seconds for consistency
    const newTimeRemaining = Math.max(0, currentTime - this.deltaTime)
    
    // Emit timer warning when time is running low (less than 1 second)
    if (newTimeRemaining <= GAME.TIMER_WARNING_THRESHOLD_SEC) {
      events.push({ type: 'timerWarning' })
    }
    
    // Game over if timer expires
    if (newTimeRemaining <= 0) {
      events.push({ type: 'gameOver' })
    }
    
    return events
  }
}