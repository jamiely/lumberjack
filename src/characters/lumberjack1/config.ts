import { createCharacterConfig } from '../sharedConfig'
import type { PoseBounds } from '../types'

// Lumberjack1 Sprite Constants
export const LUMBERJACK1_SPRITE_SHEET_PATH = './images/lumberjack.png'
export const LUMBERJACK1_SHEET_WIDTH = 1023
export const LUMBERJACK1_SHEET_HEIGHT = 1023
export const LUMBERJACK1_SPRITE_DISPLAY_SIZE = 220
export const LUMBERJACK1_PLAYER_HEIGHT = 173

// Lumberjack1 sprite pose bounds (exact pixel coordinates on sprite sheet)
export const LUMBERJACK1_POSES: Record<string, PoseBounds> = {
  idle: { x: 30, y: 20, width: 260, height: 380 },
  chopping: { x: 25, y: 405, width: 300, height: 370 },
  hit: { x: 270, y: 790, width: 354, height: 230, facing: 'right' }
} as const

const LUMBERJACK1_STATE_MAP = {
  idle: 'idle',
  chopping: 'chopping',
  hit: 'hit'
} as const

// Complete Lumberjack1 Configuration
export const lumberjack1Config = createCharacterConfig({
  id: 'lumberjack1',
  name: 'Classic Lumberjack',
  sheet: {
    path: LUMBERJACK1_SPRITE_SHEET_PATH,
    width: LUMBERJACK1_SHEET_WIDTH,
    height: LUMBERJACK1_SHEET_HEIGHT
  },
  displaySize: LUMBERJACK1_SPRITE_DISPLAY_SIZE,
  height: LUMBERJACK1_PLAYER_HEIGHT,
  poses: LUMBERJACK1_POSES,
  defaultFacing: 'left',
  statePoseMap: LUMBERJACK1_STATE_MAP
})
