import type { AnimatedSegment } from '../game/GameState'
import { ANIMATION_DURATION, ANIMATION_SPEED, ANIMATION_OUT_OF_BOUNDS_LEFT, ANIMATION_OUT_OF_BOUNDS_RIGHT } from '../config/animationConfig'

export class AnimationManager {
  private static instance: AnimationManager
  private animations: Map<string, AnimatedSegment> = new Map()
  private rafId: number | null = null
  private onRemoveCallback: ((id: string) => void) | null = null

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager()
    }
    return AnimationManager.instance
  }

  addAnimation(segment: AnimatedSegment): void {
    this.animations.set(segment.animationId, segment)
    this.startAnimationLoop()
  }

  removeAnimation(id: string): void {
    this.animations.delete(id)
    if (this.animations.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  setOnRemoveCallback(callback: (id: string) => void): void {
    this.onRemoveCallback = callback
  }

  private startAnimationLoop(): void {
    if (this.rafId !== null) return // Already running

    const animate = (timestamp: number) => {
      if (this.animations.size === 0) {
        this.rafId = null
        return
      }

      this.updateAnimations(timestamp)
      this.rafId = requestAnimationFrame(animate)
    }

    this.rafId = requestAnimationFrame(animate)
  }

  private updateAnimations(timestamp: number): void {
    const toRemove: string[] = []

    this.animations.forEach(segment => {
      if (this.shouldRemoveAnimation(segment, timestamp)) {
        toRemove.push(segment.animationId)
      }
    })

    // Remove completed animations
    toRemove.forEach(id => {
      this.removeAnimation(id)
      this.onRemoveCallback?.(id)
    })
  }

  shouldRemoveAnimation(segment: AnimatedSegment, timestamp: number): boolean {
    const elapsed = timestamp - segment.startTime
    
    // Remove if animation duration exceeded
    if (elapsed > ANIMATION_DURATION) {
      return true
    }

    // Remove if segment moved out of bounds
    const distance = ANIMATION_SPEED * (elapsed / 1000)
    const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
    
    return currentX < ANIMATION_OUT_OF_BOUNDS_LEFT || currentX > ANIMATION_OUT_OF_BOUNDS_RIGHT
  }

  getAnimations(): Map<string, AnimatedSegment> {
    return new Map(this.animations)
  }

  getCurrentAnimationData(timestamp: number): Array<AnimatedSegment & { currentX: number; rotation: number }> {
    return Array.from(this.animations.values()).map(segment => {
      const elapsed = timestamp - segment.startTime
      const distance = ANIMATION_SPEED * (elapsed / 1000)
      const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
      const rotation = (elapsed * 0.36) % 360 // About 1 full rotation per second

      return {
        ...segment,
        currentX,
        rotation
      }
    })
  }

  cleanup(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.animations.clear()
    this.onRemoveCallback = null
  }
}