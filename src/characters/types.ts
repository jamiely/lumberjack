export type CharacterType = 'lumberjack1' | 'lumberjack2' | 'lumberjack3'

export type GameState = 'idle' | 'chopping' | 'hit'

export interface CharacterDimensions {
  width: number
  height: number
  displaySize: number
}

export interface CharacterPositioning {
  centeringOffset: number
  bottomOffset: number
  leftPosition: number
  rightPosition: number
}

export interface CharacterSpriteConfig {
  sheetPath: string
  dimensions: CharacterDimensions
  positioning: CharacterPositioning
  scaleFactor: number
  coordinates: Record<string, [number, number, number, number]>
}

export interface CharacterConfig {
  id: CharacterType
  name: string
  spriteConfig: CharacterSpriteConfig
  mapGameStateToSprite: (gameState: GameState) => string
  availableStates: string[]
}