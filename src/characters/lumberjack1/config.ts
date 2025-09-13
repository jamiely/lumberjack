import type { CharacterConfig, GameState, PoseBounds } from '../types'

// Lumberjack1 Sprite Constants
export const LUMBERJACK1_SPRITE_SHEET_PATH = './images/lumberjack.png'
export const LUMBERJACK1_SHEET_WIDTH = 1023
export const LUMBERJACK1_SHEET_HEIGHT = 1023
export const LUMBERJACK1_SPRITE_DISPLAY_SIZE = 220

// Lumberjack1 Dimensions & Positioning
export const LUMBERJACK1_PLAYER_WIDTH = LUMBERJACK1_SPRITE_DISPLAY_SIZE
export const LUMBERJACK1_PLAYER_HEIGHT = 173
export const LUMBERJACK1_CENTERING_OFFSET = (LUMBERJACK1_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack1 sprite pose bounds (exact pixel coordinates on sprite sheet)
export const LUMBERJACK1_POSES: Record<string, PoseBounds> = {
  idle: { x: 30, y: 20, width: 260, height: 380 },
  chopping: { x: 25, y: 405, width: 300, height: 370 },
  hit: { x: 270, y: 790, width: 354, height: 230, facing: 'right' }
} as const

// State mapping function
function mapGameStateToLumberjack1Sprite(gameState: GameState): keyof typeof LUMBERJACK1_POSES {
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
    sheetWidth: LUMBERJACK1_SHEET_WIDTH,
    sheetHeight: LUMBERJACK1_SHEET_HEIGHT,
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
    poses: LUMBERJACK1_POSES,
    defaultFacing: 'left'
  },
  mapGameStateToSprite: mapGameStateToLumberjack1Sprite,
  availableStates: ['idle', 'chopping', 'hit']
}