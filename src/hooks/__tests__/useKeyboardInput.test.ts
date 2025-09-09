import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardInput } from '../useKeyboardInput'

describe('useKeyboardInput', () => {
  const mockHandlers = {
    onChopLeft: vi.fn(),
    onChopRight: vi.fn(),
    onReset: vi.fn(),
    onToggleDebug: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up any event listeners
    const events = ['keydown']
    events.forEach(event => {
      document.removeEventListener(event, vi.fn())
    })
  })

  it('sets up keyboard event listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    
    renderHook(() => useKeyboardInput(mockHandlers))
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('calls onChopLeft when ArrowLeft is pressed', () => {
    renderHook(() => useKeyboardInput(mockHandlers))
    
    const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    window.dispatchEvent(keydownEvent)
    
    expect(mockHandlers.onChopLeft).toHaveBeenCalledOnce()
    expect(mockHandlers.onChopRight).not.toHaveBeenCalled()
    expect(mockHandlers.onReset).not.toHaveBeenCalled()
    expect(mockHandlers.onToggleDebug).not.toHaveBeenCalled()
  })

  it('calls onChopRight when ArrowRight is pressed', () => {
    renderHook(() => useKeyboardInput(mockHandlers))
    
    const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    window.dispatchEvent(keydownEvent)
    
    expect(mockHandlers.onChopRight).toHaveBeenCalledOnce()
    expect(mockHandlers.onChopLeft).not.toHaveBeenCalled()
    expect(mockHandlers.onReset).not.toHaveBeenCalled()
    expect(mockHandlers.onToggleDebug).not.toHaveBeenCalled()
  })

  it('calls onReset when r key is pressed', () => {
    renderHook(() => useKeyboardInput(mockHandlers))
    
    const keydownEvent = new KeyboardEvent('keydown', { key: 'r' })
    window.dispatchEvent(keydownEvent)
    
    expect(mockHandlers.onReset).toHaveBeenCalledOnce()
    expect(mockHandlers.onChopLeft).not.toHaveBeenCalled()
    expect(mockHandlers.onChopRight).not.toHaveBeenCalled()
    expect(mockHandlers.onToggleDebug).not.toHaveBeenCalled()
  })

  it('calls onToggleDebug when ? key is pressed', () => {
    renderHook(() => useKeyboardInput(mockHandlers))
    
    const keydownEvent = new KeyboardEvent('keydown', { key: '?' })
    window.dispatchEvent(keydownEvent)
    
    expect(mockHandlers.onToggleDebug).toHaveBeenCalledOnce()
    expect(mockHandlers.onChopLeft).not.toHaveBeenCalled()
    expect(mockHandlers.onChopRight).not.toHaveBeenCalled()
    expect(mockHandlers.onReset).not.toHaveBeenCalled()
  })

  it('does not call any handlers for unrecognized keys', () => {
    renderHook(() => useKeyboardInput(mockHandlers))
    
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(keydownEvent)
    
    expect(mockHandlers.onChopLeft).not.toHaveBeenCalled()
    expect(mockHandlers.onChopRight).not.toHaveBeenCalled()
    expect(mockHandlers.onReset).not.toHaveBeenCalled()
    expect(mockHandlers.onToggleDebug).not.toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useKeyboardInput(mockHandlers))
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('updates event listeners when handlers change', () => {
    const newOnChopLeft = vi.fn()
    const { rerender } = renderHook(
      ({ handlers }) => useKeyboardInput(handlers),
      { 
        initialProps: { 
          handlers: mockHandlers 
        }
      }
    )
    
    // Press key with original handlers
    const keydownEvent1 = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    window.dispatchEvent(keydownEvent1)
    expect(mockHandlers.onChopLeft).toHaveBeenCalledOnce()
    
    // Update handlers and press key again
    rerender({ 
      handlers: { 
        ...mockHandlers, 
        onChopLeft: newOnChopLeft 
      }
    })
    
    const keydownEvent2 = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    window.dispatchEvent(keydownEvent2)
    expect(newOnChopLeft).toHaveBeenCalledOnce()
    expect(mockHandlers.onChopLeft).toHaveBeenCalledOnce() // Should not be called again
  })

  it('handles multiple rapid key presses', () => {
    renderHook(() => useKeyboardInput(mockHandlers))
    
    // Simulate rapid key presses
    const keydownEvent1 = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    const keydownEvent2 = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    const keydownEvent3 = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    
    window.dispatchEvent(keydownEvent1)
    window.dispatchEvent(keydownEvent2)
    window.dispatchEvent(keydownEvent3)
    
    expect(mockHandlers.onChopLeft).toHaveBeenCalledTimes(2)
    expect(mockHandlers.onChopRight).toHaveBeenCalledOnce()
  })
})