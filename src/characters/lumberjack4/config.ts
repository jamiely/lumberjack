import type { CharacterConfig, GameState, PoseBounds } from '../types'

// Lumberjack4 Sprite Constants  
export const LUMBERJACK4_SPRITE_PATH = '/images/lumberjack4.png'
export const LUMBERJACK4_SHEET_WIDTH = 966 // Based on 3x256 grid
export const LUMBERJACK4_SHEET_HEIGHT = 1415 // Based on 3x256 grid
export const LUMBERJACK4_PLAYER_HEIGHT = 173
export const LUMBERJACK4_DISPLAY_SIZE = 220

// Lumberjack4 Dimensions & Positioning
export const LUMBERJACK4_PLAYER_WIDTH = LUMBERJACK4_DISPLAY_SIZE
export const LUMBERJACK4_CENTERING_OFFSET = (LUMBERJACK4_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack4 sprite pose bounds (coordinates provided by user - to be manually corrected)
export const LUMBERJACK4_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 280, y: 0, width: 310, height: 440 },           // Pose 1: Idle Frame 1
  // idleFrame2: { x: 256, y: 0, width: 256, height: 256 },        // Pose 2: Idle Frame 2  
  // chopAnticipation: { x: 512, y: 0, width: 256, height: 256 },  // Pose 3: Chop (Anticip.)
  chopImpact: { x: 75, y: 450, width: 400, height: 500 },        // Pose 4: Chop (Impact)
  hitStunned: { x: 70, y: 1000, width: 370, height: 430 },      // Pose 5: Hit/Stunned
  // recovery: { x: 512, y: 256, width: 256, height: 256 },        // Pose 6: Recovery
  // knockedDown: { x: 0, y: 512, width: 256, height: 256 }        // Pose 7: Knocked Down
} as const

// State mapping function
function mapGameStateToLumberjack4Sprite(gameState: GameState): keyof typeof LUMBERJACK4_POSES {
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

// Complete Lumberjack4 Configuration
export const lumberjack4Config: CharacterConfig = {
  id: 'lumberjack4',
  name: 'Enhanced Lumberjack',
  spriteConfig: {
    sheetPath: LUMBERJACK4_SPRITE_PATH,
    sheetWidth: LUMBERJACK4_SHEET_WIDTH,
    sheetHeight: LUMBERJACK4_SHEET_HEIGHT,
    dimensions: {
      width: LUMBERJACK4_PLAYER_WIDTH,
      height: LUMBERJACK4_PLAYER_HEIGHT,
      displaySize: LUMBERJACK4_DISPLAY_SIZE
    },
    positioning: {
      centeringOffset: LUMBERJACK4_CENTERING_OFFSET,
      bottomOffset: 86, // From original PLAYER_BOTTOM_OFFSET
      leftPosition: 90,  // From original PLAYER_LEFT_POSITION
      rightPosition: 390 // From original PLAYER_RIGHT_POSITION
    },
    poses: LUMBERJACK4_POSES
  },
  mapGameStateToSprite: mapGameStateToLumberjack4Sprite,
  availableStates: ['idleFrame1', 'idleFrame2', 'chopAnticipation', 'chopImpact', 'hitStunned', 'recovery', 'knockedDown']
}