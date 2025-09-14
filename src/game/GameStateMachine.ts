import type { GameState } from './GameState'
import type { GameCommand } from './commands/GameCommand'
import { createInitialGameState } from './GameState'

export class GameStateMachine extends EventTarget {
  private currentState: GameState

  constructor(initialState?: GameState) {
    super()
    this.currentState = initialState || createInitialGameState()
  }

  getState(): GameState {
    return { ...this.currentState }
  }

  dispatch(command: GameCommand): void {
    const newState = command.execute(this.currentState)
    const events = command.getEvents()
    
    this.currentState = newState
    
    // Dispatch all events from the command
    events.forEach(event => {
      this.dispatchEvent(new CustomEvent(event.type, { detail: event.data }))
    })

    // Always dispatch a state change event
    this.dispatchEvent(new CustomEvent('stateChange', { detail: this.currentState }))
  }

  reset(): void {
    this.currentState = createInitialGameState()
    this.dispatchEvent(new CustomEvent('stateChange', { detail: this.currentState }))
  }
}