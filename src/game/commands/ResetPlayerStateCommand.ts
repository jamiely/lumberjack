import type { GameState } from '../GameState'
import type { GameCommand, GameEvent } from './GameCommand'

export class ResetPlayerStateCommand implements GameCommand {
  execute(state: GameState): GameState {
    return {
      ...state,
      playerState: 'idle'
    }
  }

  getEvents(): GameEvent[] {
    return []
  }
}