import { describe, it, expect, vi } from 'vitest'
import { GameEventEmitter, gameEvents } from '../GameEvents'
import type { GameEventType } from '../GameEvents'

describe('GameEventEmitter', () => {
  let emitter: GameEventEmitter

  beforeEach(() => {
    emitter = new GameEventEmitter()
  })

  describe('on and emit', () => {
    it('should register and call event handlers', () => {
      const handler = vi.fn()
      emitter.on('chop', handler)
      
      emitter.emit('chop')
      
      expect(handler).toHaveBeenCalledOnce()
      expect(handler).toHaveBeenCalledWith({
        type: 'chop',
        timestamp: expect.any(Number),
        data: undefined
      })
    })

    it('should pass data to event handlers', () => {
      const handler = vi.fn()
      const testData = { score: 10 }
      
      emitter.on('gameOver', handler)
      emitter.emit('gameOver', testData)
      
      expect(handler).toHaveBeenCalledWith({
        type: 'gameOver',
        timestamp: expect.any(Number),
        data: testData
      })
    })

    it('should call multiple handlers for the same event', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      emitter.on('hit', handler1)
      emitter.on('hit', handler2)
      emitter.emit('hit')
      
      expect(handler1).toHaveBeenCalledOnce()
      expect(handler2).toHaveBeenCalledOnce()
    })

    it('should handle multiple different event types', () => {
      const chopHandler = vi.fn()
      const hitHandler = vi.fn()
      
      emitter.on('chop', chopHandler)
      emitter.on('hit', hitHandler)
      
      emitter.emit('chop')
      emitter.emit('hit')
      
      expect(chopHandler).toHaveBeenCalledOnce()
      expect(hitHandler).toHaveBeenCalledOnce()
    })
  })

  describe('off', () => {
    it('should remove specific event handlers', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      emitter.on('chop', handler1)
      emitter.on('chop', handler2)
      emitter.off('chop', handler1)
      
      emitter.emit('chop')
      
      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledOnce()
    })

    it('should handle removing non-existent handlers gracefully', () => {
      const handler = vi.fn()
      
      expect(() => {
        emitter.off('chop', handler)
      }).not.toThrow()
    })

    it('should handle removing handlers from non-existent event types', () => {
      const handler = vi.fn()
      
      expect(() => {
        emitter.off('timerWarning' as GameEventType, handler)
      }).not.toThrow()
    })
  })

  describe('clear', () => {
    it('should remove all event handlers', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      emitter.on('chop', handler1)
      emitter.on('hit', handler2)
      emitter.clear()
      
      emitter.emit('chop')
      emitter.emit('hit')
      
      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })
  })

  describe('event timing', () => {
    it('should provide timestamp in events', () => {
      const handler = vi.fn()
      const startTime = performance.now()
      
      emitter.on('chop', handler)
      emitter.emit('chop')
      
      const endTime = performance.now()
      const event = handler.mock.calls[0][0]
      
      expect(event.timestamp).toBeGreaterThanOrEqual(startTime)
      expect(event.timestamp).toBeLessThanOrEqual(endTime)
    })
  })
})

describe('global gameEvents instance', () => {
  beforeEach(() => {
    gameEvents.clear()
  })

  it('should be a GameEventEmitter instance', () => {
    expect(gameEvents).toBeInstanceOf(GameEventEmitter)
  })

  it('should work as a global event bus', () => {
    const handler = vi.fn()
    
    gameEvents.on('chop', handler)
    gameEvents.emit('chop', { test: 'data' })
    
    expect(handler).toHaveBeenCalledWith({
      type: 'chop',
      timestamp: expect.any(Number),
      data: { test: 'data' }
    })
  })
})