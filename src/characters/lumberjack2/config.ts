import { createCharacterConfig } from '../sharedConfig'
import type { PoseBounds } from '../types'

// Lumberjack2 Sprite Constants - Updated for 1024x1536 sprite sheet
export const LUMBERJACK2_SPRITE_PATH = './images/lumberjack2.png'
export const LUMBERJACK2_SHEET_WIDTH = 1024
export const LUMBERJACK2_SHEET_HEIGHT = 1536
export const LUMBERJACK2_PLAYER_HEIGHT = 173
export const LUMBERJACK2_DISPLAY_SIZE = 220

// Lumberjack2 sprite pose bounds - 4 columns × 3 rows layout in 1024x1536 sheet
// Each pose is approximately 256x512 pixels
export const LUMBERJACK2_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 50, y: 50, width: 350, height: 500 },
  idleFrame2: { x: 256, y: 0, width: 256, height: 512 },
  chopAnticipation: { x: 512, y: 0, width: 256, height: 512 },
  chopImpact: { x: 330, y: 587, width: 356, height: 456 },
  chopFollowThrough: { x: 0, y: 512, width: 256, height: 512 },
  chopRecovery: { x: 256, y: 512, width: 256, height: 512 },
  hitStunned: { x: 50, y: 1050, width: 350, height: 450 },
  knockedDown: { x: 768, y: 512, width: 256, height: 512 }
} as const

const LUMBERJACK2_STATE_MAP = {
  idle: 'idleFrame1',
  chopping: 'chopImpact',
  hit: 'hitStunned'
} as const

// Complete Lumberjack2 Configuration
export const lumberjack2Config = createCharacterConfig({
  id: 'lumberjack2',
  name: 'Enhanced Lumberjack',
  sheet: {
    path: LUMBERJACK2_SPRITE_PATH,
    width: LUMBERJACK2_SHEET_WIDTH,
    height: LUMBERJACK2_SHEET_HEIGHT
  },
  displaySize: LUMBERJACK2_DISPLAY_SIZE,
  height: LUMBERJACK2_PLAYER_HEIGHT,
  poses: LUMBERJACK2_POSES,
  defaultFacing: 'right',
  statePoseMap: LUMBERJACK2_STATE_MAP,
  availableStates: [
    'idleFrame1',
    'idleFrame2',
    'chopAnticipation',
    'chopImpact',
    'chopFollowThrough',
    'chopRecovery',
    'hitStunned',
    'knockedDown'
  ]
})
