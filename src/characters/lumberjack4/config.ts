import { createCharacterConfig } from '../sharedConfig'
import type { PoseBounds } from '../types'

// Lumberjack4 Sprite Constants  
export const LUMBERJACK4_SPRITE_PATH = './images/lumberjack4.png'
export const LUMBERJACK4_SHEET_WIDTH = 966 // Based on 3x256 grid
export const LUMBERJACK4_SHEET_HEIGHT = 1415 // Based on 3x256 grid
export const LUMBERJACK4_PLAYER_HEIGHT = 173
export const LUMBERJACK4_DISPLAY_SIZE = 220

// Lumberjack4 sprite pose bounds (coordinates provided by user - to be manually corrected)
export const LUMBERJACK4_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 280, y: 0, width: 310, height: 440 },           // Pose 1: Idle Frame 1
  chopImpact: { x: 75, y: 450, width: 400, height: 500, facing: 'left' },        // Pose 4: Chop (Impact)
  hitStunned: { x: 70, y: 1000, width: 370, height: 430 }      // Pose 5: Hit/Stunned
} as const

const LUMBERJACK4_STATE_MAP = {
  idle: 'idleFrame1',
  chopping: 'chopImpact',
  hit: 'hitStunned'
} as const

// Complete Lumberjack4 Configuration
export const lumberjack4Config = createCharacterConfig({
  id: 'lumberjack4',
  name: 'Enhanced Lumberjack',
  sheet: {
    path: LUMBERJACK4_SPRITE_PATH,
    width: LUMBERJACK4_SHEET_WIDTH,
    height: LUMBERJACK4_SHEET_HEIGHT
  },
  displaySize: LUMBERJACK4_DISPLAY_SIZE,
  height: LUMBERJACK4_PLAYER_HEIGHT,
  poses: LUMBERJACK4_POSES,
  defaultFacing: 'right',
  statePoseMap: LUMBERJACK4_STATE_MAP,
  availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
})
