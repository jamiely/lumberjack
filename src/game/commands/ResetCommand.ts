import type { GameState } from '../GameState'
import type { GameCommand, GameEvent } from './GameCommand'
import { createInitialGameState } from '../GameState'

export class ResetCommand implements GameCommand {
  execute(): GameState {
    return createInitialGameState()
  }

  getEvents(): GameEvent[] {
    return [
      { type: 'reset' }
    ]
  }
}