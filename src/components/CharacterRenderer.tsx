import React from 'react'
import type { Character } from '../characters/core/Character'
import UniversalSprite from './UniversalSprite'

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
  const { spriteConfig, mapGameStateToSprite } = character.config
  const poseKey = mapGameStateToSprite(state)
  const { width, height } = spriteConfig.dimensions

  const scaledWidth = width * scale
  const scaledHeight = height * scale

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        ...style
      }}
    >
      <UniversalSprite
        characterConfig={character.config}
        spriteState={poseKey}
        width={scaledWidth}
        height={scaledHeight}
      />
    </div>
  )
}
