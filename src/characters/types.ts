export type CharacterType = 'lumberjack1' | 'lumberjack2' | 'lumberjack3' | 'lumberjack4' | 'lumberjack5'

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

export interface PoseBounds {
  x: number      // Left edge on sprite sheet
  y: number      // Top edge on sprite sheet  
  width: number  // Pose width on sprite sheet
  height: number // Pose height on sprite sheet
  facing?: 'left' | 'right'  // Override default facing direction for this pose
}

export interface CharacterSpriteConfig {
  sheetPath: string
  sheetWidth: number    // Original sprite sheet width
  sheetHeight: number   // Original sprite sheet height
  dimensions: CharacterDimensions
  positioning: CharacterPositioning
  poses: Record<string, PoseBounds>
  defaultFacing: 'left' | 'right'  // Default facing direction for this character
}

export interface CharacterConfig {
  id: CharacterType
  name: string
  spriteConfig: CharacterSpriteConfig
  mapGameStateToSprite: (gameState: GameState) => string
  availableStates: string[]
}