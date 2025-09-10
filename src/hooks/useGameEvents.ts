import { useCallback } from 'react'
import type { GameEventType, GameEventHandler } from '../game/GameEvents'
import { gameEvents } from '../game/GameEvents'

export const useGameEvents = () => {
  const subscribe = useCallback((eventType: GameEventType, handler: GameEventHandler) => {
    gameEvents.on(eventType, handler)
    return () => gameEvents.off(eventType, handler)
  }, [])
  
  const emit = useCallback((eventType: GameEventType, data?: unknown) => {
    gameEvents.emit(eventType, data)
  }, [])
  
  return { subscribe, emit }
}