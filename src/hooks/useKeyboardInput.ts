import { useEffect } from 'react'

interface KeyboardInputHandlers {
  onChopLeft: () => void
  onChopRight: () => void
  onReset: () => void
  onToggleDebug: () => void
}

export function useKeyboardInput({
  onChopLeft,
  onChopRight,
  onReset,
  onToggleDebug
}: KeyboardInputHandlers) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
          onChopLeft()
          break
        case 'ArrowRight':
          onChopRight()
          break
        case 'r':
          onReset()
          break
        case '?':
          onToggleDebug()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onChopLeft, onChopRight, onReset, onToggleDebug])
}