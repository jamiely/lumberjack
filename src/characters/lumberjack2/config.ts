import type { CharacterConfig, GameState } from '../types'

// Lumberjack2 Sprite Constants (moved from constants.ts)
export const LUMBERJACK2_SPRITE_PATH = '/images/lumberjack2.png'
export const LUMBERJACK2_SHEET_WIDTH = 768 // 3 columns × 256px
export const LUMBERJACK2_SHEET_HEIGHT = 768 // 3 rows × 256px
export const LUMBERJACK2_INDIVIDUAL_SIZE = 256
export const LUMBERJACK2_PLAYER_HEIGHT = 173
// Scale factor based on Y-direction only to maintain aspect ratio
export const LUMBERJACK2_Y_SCALE_FACTOR = LUMBERJACK2_PLAYER_HEIGHT / LUMBERJACK2_INDIVIDUAL_SIZE
// Width calculated to maintain aspect ratio
export const LUMBERJACK2_PLAYER_WIDTH = Math.round(LUMBERJACK2_INDIVIDUAL_SIZE * LUMBERJACK2_Y_SCALE_FACTOR)
export const LUMBERJACK2_DISPLAY_SIZE = LUMBERJACK2_PLAYER_WIDTH
// Use uniform scale factor for background positioning (sprite sheet scaling)
export const LUMBERJACK2_SCALE_FACTOR = LUMBERJACK2_Y_SCALE_FACTOR

// Lumberjack2 Dimensions & Positioning
export const LUMBERJACK2_CENTERING_OFFSET = (LUMBERJACK2_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack2 sprite coordinates
export const LUMBERJACK2_COORDS = {
  idleFrame1: [0, 0, 256, 256],
  idleFrame2: [256, 0, 512, 256],
  chopAnticipation: [512, 0, 768, 256],
  chopImpact: [0, 256, 256, 512],
  chopFollowThrough: [256, 256, 512, 512],
  chopRecovery: [512, 256, 768, 512],
  hitStunned: [0, 512, 256, 768],
  knockedDown: [256, 512, 512, 768]
} as const

// State mapping function
function mapGameStateToLumberjack2Sprite(gameState: GameState): keyof typeof LUMBERJACK2_COORDS {
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

// Complete Lumberjack2 Configuration
export const lumberjack2Config: CharacterConfig = {
  id: 'lumberjack2',
  name: 'Enhanced Lumberjack',
  spriteConfig: {
    sheetPath: LUMBERJACK2_SPRITE_PATH,
    dimensions: {
      width: LUMBERJACK2_PLAYER_WIDTH,
      height: LUMBERJACK2_PLAYER_HEIGHT,
      displaySize: LUMBERJACK2_DISPLAY_SIZE
    },
    positioning: {
      centeringOffset: LUMBERJACK2_CENTERING_OFFSET,
      bottomOffset: 86, // From original PLAYER_BOTTOM_OFFSET
      leftPosition: 90,  // From original PLAYER_LEFT_POSITION
      rightPosition: 390 // From original PLAYER_RIGHT_POSITION
    },
    scaleFactor: LUMBERJACK2_SCALE_FACTOR,
    coordinates: {
      idleFrame1: [...LUMBERJACK2_COORDS.idleFrame1],
      idleFrame2: [...LUMBERJACK2_COORDS.idleFrame2],
      chopAnticipation: [...LUMBERJACK2_COORDS.chopAnticipation],
      chopImpact: [...LUMBERJACK2_COORDS.chopImpact],
      chopFollowThrough: [...LUMBERJACK2_COORDS.chopFollowThrough],
      chopRecovery: [...LUMBERJACK2_COORDS.chopRecovery],
      hitStunned: [...LUMBERJACK2_COORDS.hitStunned],
      knockedDown: [...LUMBERJACK2_COORDS.knockedDown]
    }
  },
  mapGameStateToSprite: mapGameStateToLumberjack2Sprite,
  availableStates: ['idleFrame1', 'idleFrame2', 'chopAnticipation', 'chopImpact', 'chopFollowThrough', 'chopRecovery', 'hitStunned', 'knockedDown']
}