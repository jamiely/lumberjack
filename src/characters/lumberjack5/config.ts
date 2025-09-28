import { createCharacterConfig } from '../sharedConfig'
import type { PoseBounds } from '../types'

// Lumberjack5 Sprite Constants  
export const LUMBERJACK5_SPRITE_PATH = './images/lumberjack5.png'
export const LUMBERJACK5_SHEET_WIDTH = 1024 // Based on 3x256 grid
export const LUMBERJACK5_SHEET_HEIGHT = 1024 // Based on 2x256 grid
export const LUMBERJACK5_PLAYER_HEIGHT = 173
export const LUMBERJACK5_DISPLAY_SIZE = 220

// Lumberjack5 sprite pose bounds (3x2 grid layout)
export const LUMBERJACK5_POSES: Record<string, PoseBounds> = {
  idleFrame1: { x: 20, y: 70, width: 250, height: 470 },           // Top-left: Idle with axe at side
  chopImpact: { x: 700, y: 115, width: 330, height: 430 },         // Top-right: Axe swing impact
  hitStunned: { x: 0, y: 540, width: 260, height: 480 }         // Bottom-left: Stunned/hit
} as const

const LUMBERJACK5_STATE_MAP = {
  idle: 'idleFrame1',
  chopping: 'chopImpact',
  hit: 'hitStunned'
} as const

// Complete Lumberjack5 Configuration
export const lumberjack5Config = createCharacterConfig({
  id: 'lumberjack5',
  name: 'Cartoon Lumberjack',
  sheet: {
    path: LUMBERJACK5_SPRITE_PATH,
    width: LUMBERJACK5_SHEET_WIDTH,
    height: LUMBERJACK5_SHEET_HEIGHT
  },
  displaySize: LUMBERJACK5_DISPLAY_SIZE,
  height: LUMBERJACK5_PLAYER_HEIGHT,
  poses: LUMBERJACK5_POSES,
  defaultFacing: 'right',
  statePoseMap: LUMBERJACK5_STATE_MAP,
  availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
})
