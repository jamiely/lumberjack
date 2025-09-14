import type { GameState } from '../GameState'
import type { GameCommand, GameEvent } from './GameCommand'

export class ToggleDebugCommand implements GameCommand {
  execute(state: GameState): GameState {
    return {
      ...state,
      showDebug: !state.showDebug
    }
  }

  getEvents(): GameEvent[] {
    return [
      { type: 'debugToggle' }
    ]
  }
}