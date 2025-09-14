import { useEffect, useState } from 'react'
import type { AnimatedSegment } from '../game/GameState'
import { ANIMATION_SPEED } from '../config/animationConfig'

// Simplified animation system that works directly with segments
export function useAnimationSystem(
  segments: AnimatedSegment[]
) {
  const [currentTime, setCurrentTime] = useState(0)

  // Calculate animation data directly from segments
  const animationData = segments.map(segment => {
    const elapsed = currentTime - segment.startTime
    const distance = ANIMATION_SPEED * (elapsed / 1000)
    const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
    const rotation = (elapsed * 0.36) % 360 // About 1 full rotation per second

    return {
      ...segment,
      currentX,
      rotation
    }
  })

  useEffect(() => {
    if (segments.length === 0) return

    let isActive = true

    const animate = (timestamp: number) => {
      if (!isActive) return
      
      setCurrentTime(timestamp)

      if (segments.length > 0) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      isActive = false
    }
  }, [segments.length])

  return {
    currentTime,
    animationData
  }
}