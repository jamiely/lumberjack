export type GameEventType = 'chop' | 'hit' | 'gameOver' | 'timerWarning'

export interface GameEvent {
  type: GameEventType
  timestamp: number
  data?: unknown
}

export type GameEventHandler = (event: GameEvent) => void

export class GameEventEmitter {
  private listeners: Map<GameEventType, GameEventHandler[]> = new Map()
  
  on(eventType: GameEventType, handler: GameEventHandler): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(handler)
  }
  
  off(eventType: GameEventType, handler: GameEventHandler): void {
    const handlers = this.listeners.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
  
  emit(eventType: GameEventType, data?: unknown): void {
    const handlers = this.listeners.get(eventType)
    if (handlers) {
      const event: GameEvent = {
        type: eventType,
        timestamp: performance.now(),
        data
      }
      handlers.forEach(handler => handler(event))
    }
  }
  
  clear(): void {
    this.listeners.clear()
  }
}

export const gameEvents = new GameEventEmitter()