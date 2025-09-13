import type { CharacterConfig, GameState } from '../types'

// Lumberjack3 Sprite Constants
export const LUMBERJACK3_SPRITE_PATH = '/images/lumberjack3.png'
export const LUMBERJACK3_SHEET_WIDTH = 768 // 3 columns × 256px
export const LUMBERJACK3_SHEET_HEIGHT = 768 // 3 rows × 256px  
export const LUMBERJACK3_INDIVIDUAL_SIZE = 256
export const LUMBERJACK3_PLAYER_HEIGHT = 173
// Scale factor based on Y-direction only to maintain aspect ratio
export const LUMBERJACK3_Y_SCALE_FACTOR = LUMBERJACK3_PLAYER_HEIGHT / LUMBERJACK3_INDIVIDUAL_SIZE
// Width calculated to maintain aspect ratio
export const LUMBERJACK3_PLAYER_WIDTH = Math.round(LUMBERJACK3_INDIVIDUAL_SIZE * LUMBERJACK3_Y_SCALE_FACTOR)
export const LUMBERJACK3_DISPLAY_SIZE = LUMBERJACK3_PLAYER_WIDTH
// Use uniform scale factor for background positioning (sprite sheet scaling)
export const LUMBERJACK3_SCALE_FACTOR = LUMBERJACK3_Y_SCALE_FACTOR

// Lumberjack3 Dimensions & Positioning
export const LUMBERJACK3_CENTERING_OFFSET = (LUMBERJACK3_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack3 sprite coordinates based on your provided table
export const LUMBERJACK3_COORDS = {
  idleFrame1: [30, 0, 280, 480],           // Pose 1: Idle Frame 1
  idleFrame2: [370, 0, 750, 480],         // Pose 2: Idle Frame 2  
  chopAnticipation: [0, 520, 350, 911],   // Pose 3: Chop (Anticip.)
  chopImpact: [350, 520, 840, 1000],         // Pose 4: Chop (Impact)
  hitStunned: [0, 1015, 320, 1470],       // Pose 5: Hit/Stunned
  recovery: [0, 1, 0, 1],         // Pose 6: Recovery
  knockedDown: [400, 760, 877, 1494]         // Pose 7: Knocked Down
} as const

// State mapping function
function mapGameStateToLumberjack3Sprite(gameState: GameState): keyof typeof LUMBERJACK3_COORDS {
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

// Complete Lumberjack3 Configuration
export const lumberjack3Config: CharacterConfig = {
  id: 'lumberjack3',
  name: 'Advanced Lumberjack',
  spriteConfig: {
    sheetPath: LUMBERJACK3_SPRITE_PATH,
    dimensions: {
      width: LUMBERJACK3_PLAYER_WIDTH,
      height: LUMBERJACK3_PLAYER_HEIGHT,
      displaySize: LUMBERJACK3_DISPLAY_SIZE
    },
    positioning: {
      centeringOffset: LUMBERJACK3_CENTERING_OFFSET,
      bottomOffset: 86, // From original PLAYER_BOTTOM_OFFSET
      leftPosition: 90,  // From original PLAYER_LEFT_POSITION
      rightPosition: 390 // From original PLAYER_RIGHT_POSITION
    },
    scaleFactor: LUMBERJACK3_SCALE_FACTOR,
    coordinates: {
      idleFrame1: [...LUMBERJACK3_COORDS.idleFrame1],
      idleFrame2: [...LUMBERJACK3_COORDS.idleFrame2],
      chopAnticipation: [...LUMBERJACK3_COORDS.chopAnticipation],
      chopImpact: [...LUMBERJACK3_COORDS.chopImpact],
      hitStunned: [...LUMBERJACK3_COORDS.hitStunned],
      recovery: [...LUMBERJACK3_COORDS.recovery],
      knockedDown: [...LUMBERJACK3_COORDS.knockedDown]
    }
  },
  mapGameStateToSprite: mapGameStateToLumberjack3Sprite,
  availableStates: ['idleFrame1', 'idleFrame2', 'chopAnticipation', 'chopImpact', 'hitStunned', 'recovery', 'knockedDown']
}