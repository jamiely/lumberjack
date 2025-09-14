import React from 'react'
import type { Character } from '../characters/core/Character'

export interface CharacterRendererProps {
  character: Character
  state: 'idle' | 'chopping' | 'hit'
  position: { x: number; y: number }
  scale?: number
  className?: string
  style?: React.CSSProperties
}

export function CharacterRenderer({
  character,
  state,
  position,
  scale = 1,
  className,
  style
}: CharacterRendererProps) {
  const getSpriteForState = (state: 'idle' | 'chopping' | 'hit'): string => {
    switch (state) {
      case 'idle':
        return character.config.sprites.idle
      case 'chopping':
        return character.config.sprites.chopping
      case 'hit':
        return character.config.sprites.hit
      default:
        return character.config.sprites.idle
    }
  }

  const spriteUrl = getSpriteForState(state)
  const { width, height } = character.config.dimensions

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        backgroundImage: `url(${spriteUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style
      }}
    />
  )
}