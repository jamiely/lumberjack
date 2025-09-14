import type { GameState } from '../GameState'

export interface GameEvent {
  type: string
  data?: unknown
}

export interface GameCommand {
  execute(state: GameState): GameState
  getEvents(): GameEvent[]
}