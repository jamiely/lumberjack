import type { CharacterConfig, GameState, PoseBounds } from '../types'

// Lumberjack3 Sprite Constants  
export const LUMBERJACK3_SPRITE_PATH = './images/lumberjack3.png'
export const LUMBERJACK3_SHEET_WIDTH = 877 // Based on actual sprite coordinates
export const LUMBERJACK3_SHEET_HEIGHT = 1494 // Based on actual sprite coordinates
export const LUMBERJACK3_PLAYER_HEIGHT = 173
export const LUMBERJACK3_DISPLAY_SIZE = 220

// Lumberjack3 Dimensions & Positioning
export const LUMBERJACK3_PLAYER_WIDTH = LUMBERJACK3_DISPLAY_SIZE
export const LUMBERJACK3_CENTERING_OFFSET = (LUMBERJACK3_PLAYER_WIDTH - 90) / 2 // 90 is original PLAYER_WIDTH

// Lumberjack3 sprite pose bounds (exact pixel coordinates on sprite sheet)
export const LUMBERJACK3_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 30, y: 0, width: 250, height: 480 },           // Pose 1: Idle Frame 1
  idleFrame2: { x: 370, y: 0, width: 380, height: 480 },         // Pose 2: Idle Frame 2  
  chopAnticipation: { x: 0, y: 520, width: 350, height: 391 },   // Pose 3: Chop (Anticip.) - calculated width/height
  chopImpact: { x: 350, y: 520, width: 490, height: 480 },       // Pose 4: Chop (Impact)
  hitStunned: { x: 0, y: 1015, width: 320, height: 455 },        // Pose 5: Hit/Stunned
  recovery: { x: 0, y: 1015, width: 320, height: 455 },          // Pose 6: Recovery (reusing hitStunned for now)
  knockedDown: { x: 400, y: 1040, width: 477, height: 454 }      // Pose 7: Knocked Down
} as const

// State mapping function
function mapGameStateToLumberjack3Sprite(gameState: GameState): keyof typeof LUMBERJACK3_POSES {
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
    sheetWidth: LUMBERJACK3_SHEET_WIDTH,
    sheetHeight: LUMBERJACK3_SHEET_HEIGHT,
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
    poses: LUMBERJACK3_POSES,
    defaultFacing: 'right'
  },
  mapGameStateToSprite: mapGameStateToLumberjack3Sprite,
  availableStates: ['idleFrame1', 'idleFrame2', 'chopAnticipation', 'chopImpact', 'hitStunned', 'recovery', 'knockedDown']
}