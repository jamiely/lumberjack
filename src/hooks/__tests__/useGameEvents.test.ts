import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameEvents } from '../useGameEvents'
import { gameEvents } from '../../game/GameEvents'

describe('useGameEvents', () => {
  beforeEach(() => {
    gameEvents.clear()
  })

  describe('subscribe', () => {
    it('should subscribe to events and return unsubscribe function', () => {
      const { result } = renderHook(() => useGameEvents())
      const handler = vi.fn()

      let unsubscribe: (() => void) | undefined

      act(() => {
        unsubscribe = result.current.subscribe('chop', handler)
      })

      // Emit event to verify subscription works
      act(() => {
        gameEvents.emit('chop')
      })

      expect(handler).toHaveBeenCalledOnce()
      expect(handler).toHaveBeenCalledWith({
        type: 'chop',
        timestamp: expect.any(Number),
        data: undefined
      })

      // Test unsubscribe
      act(() => {
        unsubscribe?.()
      })

      act(() => {
        gameEvents.emit('chop')
      })

      // Handler should not be called again after unsubscribe
      expect(handler).toHaveBeenCalledOnce()
    })

    it('should handle multiple subscriptions to different events', () => {
      const { result } = renderHook(() => useGameEvents())
      const chopHandler = vi.fn()
      const hitHandler = vi.fn()

      act(() => {
        result.current.subscribe('chop', chopHandler)
        result.current.subscribe('hit', hitHandler)
      })

      act(() => {
        gameEvents.emit('chop')
        gameEvents.emit('hit')
      })

      expect(chopHandler).toHaveBeenCalledWith({
        type: 'chop',
        timestamp: expect.any(Number),
        data: undefined
      })
      expect(hitHandler).toHaveBeenCalledWith({
        type: 'hit',
        timestamp: expect.any(Number),
        data: undefined
      })
    })

    it('should maintain stable subscribe function reference', () => {
      const { result, rerender } = renderHook(() => useGameEvents())
      const firstSubscribe = result.current.subscribe

      rerender()

      expect(result.current.subscribe).toBe(firstSubscribe)
    })
  })

  describe('emit', () => {
    it('should emit events through the hook', () => {
      const { result } = renderHook(() => useGameEvents())
      const handler = vi.fn()

      act(() => {
        result.current.subscribe('gameOver', handler)
      })

      act(() => {
        result.current.emit('gameOver', { score: 100 })
      })

      expect(handler).toHaveBeenCalledWith({
        type: 'gameOver',
        timestamp: expect.any(Number),
        data: { score: 100 }
      })
    })

    it('should emit events without data', () => {
      const { result } = renderHook(() => useGameEvents())
      const handler = vi.fn()

      act(() => {
        result.current.subscribe('timerWarning', handler)
      })

      act(() => {
        result.current.emit('timerWarning')
      })

      expect(handler).toHaveBeenCalledWith({
        type: 'timerWarning',
        timestamp: expect.any(Number),
        data: undefined
      })
    })

    it('should maintain stable emit function reference', () => {
      const { result, rerender } = renderHook(() => useGameEvents())
      const firstEmit = result.current.emit

      rerender()

      expect(result.current.emit).toBe(firstEmit)
    })
  })

  describe('integration with gameEvents', () => {
    it('should work with the global gameEvents instance', () => {
      const { result } = renderHook(() => useGameEvents())
      const handler = vi.fn()

      // Subscribe through hook
      act(() => {
        result.current.subscribe('chop', handler)
      })

      // Emit through global instance
      act(() => {
        gameEvents.emit('chop', { test: 'data' })
      })

      expect(handler).toHaveBeenCalledWith({
        type: 'chop',
        timestamp: expect.any(Number),
        data: { test: 'data' }
      })
    })

    it('should emit to global listeners when using hook emit', () => {
      const { result } = renderHook(() => useGameEvents())
      const handler = vi.fn()

      // Subscribe through global instance
      gameEvents.on('hit', handler)

      // Emit through hook
      act(() => {
        result.current.emit('hit', { damage: 50 })
      })

      expect(handler).toHaveBeenCalledWith({
        type: 'hit',
        timestamp: expect.any(Number),
        data: { damage: 50 }
      })
    })
  })

  describe('cleanup', () => {
    it('should properly unsubscribe when component unmounts', () => {
      const { result, unmount } = renderHook(() => useGameEvents())
      const handler = vi.fn()

      let unsubscribe: (() => void) | undefined

      act(() => {
        unsubscribe = result.current.subscribe('chop', handler)
      })

      // Verify subscription works
      act(() => {
        gameEvents.emit('chop')
      })
      expect(handler).toHaveBeenCalledOnce()

      // Manually unsubscribe
      act(() => {
        unsubscribe?.()
      })

      // Unmount component
      unmount()

      // Event should not trigger handler after unsubscribe
      act(() => {
        gameEvents.emit('chop')
      })

      expect(handler).toHaveBeenCalledOnce()
    })
  })
})