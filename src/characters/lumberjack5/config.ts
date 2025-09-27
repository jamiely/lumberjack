import type { CharacterConfig, GameState, PoseBounds } from '../types'

// Lumberjack5 Sprite Constants  
export const LUMBERJACK5_SPRITE_PATH = './images/lumberjack5.png'
export const LUMBERJACK5_SHEET_WIDTH = 1024 // Based on 3x256 grid
export const LUMBERJACK5_SHEET_HEIGHT = 1024 // Based on 2x256 grid
export const LUMBERJACK5_PLAYER_HEIGHT = 173
export const LUMBERJACK5_DISPLAY_SIZE = 220

// Lumberjack5 Dimensions & Positioning
export const LUMBERJACK5_PLAYER_WIDTH = LUMBERJACK5_DISPLAY_SIZE
export const LUMBERJACK5_CENTERING_OFFSET = (LUMBERJACK5_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack5 sprite pose bounds (3x2 grid layout)
export const LUMBERJACK5_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 20, y: 70, width: 250, height: 470 },           // Top-left: Idle with axe at side
  chopImpact: { x: 700, y: 115, width: 330, height: 430 },         // Top-right: Axe swing impact
  hitStunned: { x: 0, y: 540, width: 260, height: 480 },         // Bottom-left: Stunned/hit
} as const

// State mapping function
function mapGameStateToLumberjack5Sprite(gameState: GameState): keyof typeof LUMBERJACK5_POSES {
  switch (gameState) {
    case 'idle':
      return 'idleFrame1'
    case 'chopping':
      return 'chopImpact'
    case 'hit':
      return 'hitStunned'
    default:
      return 'idleFrame1'
  }
}

// Complete Lumberjack5 Configuration
export const lumberjack5Config: CharacterConfig = {
  id: 'lumberjack5',
  name: 'Cartoon Lumberjack',
  spriteConfig: {
    sheetPath: LUMBERJACK5_SPRITE_PATH,
    sheetWidth: LUMBERJACK5_SHEET_WIDTH,
    sheetHeight: LUMBERJACK5_SHEET_HEIGHT,
    dimensions: {
      width: LUMBERJACK5_PLAYER_WIDTH,
      height: LUMBERJACK5_PLAYER_HEIGHT,
      displaySize: LUMBERJACK5_DISPLAY_SIZE
    },
    positioning: {
      centeringOffset: LUMBERJACK5_CENTERING_OFFSET,
      bottomOffset: 86, // From original PLAYER_BOTTOM_OFFSET
      leftPosition: 90,  // From original PLAYER_LEFT_POSITION
      rightPosition: 390 // From original PLAYER_RIGHT_POSITION
    },
    poses: LUMBERJACK5_POSES,
    defaultFacing: 'right'
  },
  mapGameStateToSprite: mapGameStateToLumberjack5Sprite,
  availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
}