import type { CharacterConfig, GameState } from '../types'

// Lumberjack1 Sprite Constants (moved from constants.ts)
export const LUMBERJACK1_SPRITE_SHEET_PATH = '/images/lumberjack.png'
export const LUMBERJACK1_SPRITE_SOURCE_SIZE = 1023
export const LUMBERJACK1_SPRITE_INDIVIDUAL_SIZE = 341
export const LUMBERJACK1_SPRITE_DISPLAY_SIZE = 220
export const LUMBERJACK1_SPRITE_SCALE_FACTOR = LUMBERJACK1_SPRITE_DISPLAY_SIZE / LUMBERJACK1_SPRITE_INDIVIDUAL_SIZE

// Lumberjack1 Dimensions & Positioning
export const LUMBERJACK1_PLAYER_WIDTH = LUMBERJACK1_SPRITE_DISPLAY_SIZE
export const LUMBERJACK1_PLAYER_HEIGHT = 173
export const LUMBERJACK1_CENTERING_OFFSET = (LUMBERJACK1_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack1 sprite coordinates (x1, y1, x2, y2)
export const LUMBERJACK1_SPRITE_COORDS = {
  idle: [0, 0, 341, 341],
  chopping: [0, 406, 341, 747],
  hit: [0, 780, 341, 1121]
} as const

// State mapping function
function mapGameStateToLumberjack1Sprite(gameState: GameState): keyof typeof LUMBERJACK1_SPRITE_COORDS {
  switch (gameState) {
    case 'idle':
      return 'idle'
    case 'chopping':
      return 'chopping'
    case 'hit':
      return 'hit'
    default:
      return 'idle'
  }
}

// Complete Lumberjack1 Configuration
export const lumberjack1Config: CharacterConfig = {
  id: 'lumberjack1',
  name: 'Classic Lumberjack',
  spriteConfig: {
    sheetPath: LUMBERJACK1_SPRITE_SHEET_PATH,
    dimensions: {
      width: LUMBERJACK1_PLAYER_WIDTH,
      height: LUMBERJACK1_PLAYER_HEIGHT,
      displaySize: LUMBERJACK1_SPRITE_DISPLAY_SIZE
    },
    positioning: {
      centeringOffset: LUMBERJACK1_CENTERING_OFFSET,
      bottomOffset: 86, // From original PLAYER_BOTTOM_OFFSET
      leftPosition: 90,  // From original PLAYER_LEFT_POSITION
      rightPosition: 390 // From original PLAYER_RIGHT_POSITION
    },
    scaleFactor: LUMBERJACK1_SPRITE_SCALE_FACTOR,
    coordinates: {
      idle: [...LUMBERJACK1_SPRITE_COORDS.idle],
      chopping: [...LUMBERJACK1_SPRITE_COORDS.chopping],
      hit: [...LUMBERJACK1_SPRITE_COORDS.hit]
    }
  },
  mapGameStateToSprite: mapGameStateToLumberjack1Sprite,
  availableStates: ['idle', 'chopping', 'hit']
}