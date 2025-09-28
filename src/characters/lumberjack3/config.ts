import { createCharacterConfig } from '../sharedConfig'
import type { PoseBounds } from '../types'

// Lumberjack3 Sprite Constants  
export const LUMBERJACK3_SPRITE_PATH = './images/lumberjack3.png'
export const LUMBERJACK3_SHEET_WIDTH = 1024 // Based on actual sprite coordinates
export const LUMBERJACK3_SHEET_HEIGHT = 1024 // Based on actual sprite coordinates
export const LUMBERJACK3_PLAYER_HEIGHT = 173
export const LUMBERJACK3_DISPLAY_SIZE = 220

// Lumberjack3 sprite pose bounds (exact pixel coordinates on sprite sheet)
export const LUMBERJACK3_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 70, y: 35, width: 280, height: 450 },           // Pose 1: Idle Frame 1
  chopImpact: { x: 370, y: 500, width: 290, height: 465 },       // Pose 4: Chop (Impact)
  hitStunned: { x: 20, y: 495, width: 350, height: 465 }        // Pose 5: Hit/Stunned
} as const

const LUMBERJACK3_STATE_MAP = {
  idle: 'idleFrame1',
  chopping: 'chopImpact',
  hit: 'hitStunned'
} as const

// Complete Lumberjack3 Configuration
export const lumberjack3Config = createCharacterConfig({
  id: 'lumberjack3',
  name: 'Advanced Lumberjack',
  sheet: {
    path: LUMBERJACK3_SPRITE_PATH,
    width: LUMBERJACK3_SHEET_WIDTH,
    height: LUMBERJACK3_SHEET_HEIGHT
  },
  displaySize: LUMBERJACK3_DISPLAY_SIZE,
  height: LUMBERJACK3_PLAYER_HEIGHT,
  poses: LUMBERJACK3_POSES,
  defaultFacing: 'right',
  statePoseMap: LUMBERJACK3_STATE_MAP,
  availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
})
