import type { GameState, PoseBounds, CharacterPositioning } from './types'

export interface CharacterDescriptor {
  id: string
  name: string
  sheet: {
    path: string
    width: number
    height: number
  }
  displaySize: number
  height: number
  defaultFacing: 'left' | 'right'
  poses: Record<string, PoseBounds>
  statePoseMap: Record<GameState, string>
  availableStates: string[]
  width?: number
  positioningOverrides?: Partial<CharacterPositioning>
}

export const characterDescriptors = [
  {
    id: 'lumberjack1',
    name: 'Classic Lumberjack',
    sheet: {
      path: './images/lumberjack.png',
      width: 1023,
      height: 1023
    },
    displaySize: 220,
    height: 173,
    defaultFacing: 'left',
    poses: {
      idle: { x: 30, y: 20, width: 260, height: 380 },
      chopping: { x: 25, y: 405, width: 300, height: 370 },
      hit: { x: 270, y: 790, width: 354, height: 230, facing: 'right' }
    } as const,
    statePoseMap: {
      idle: 'idle',
      chopping: 'chopping',
      hit: 'hit'
    },
    availableStates: ['idle', 'chopping', 'hit']
  },
  {
    id: 'lumberjack2',
    name: 'Enhanced Lumberjack',
    sheet: {
      path: './images/lumberjack2.png',
      width: 1024,
      height: 1536
    },
    displaySize: 220,
    height: 173,
    defaultFacing: 'right',
    poses: {
      idleFrame1: { x: 50, y: 50, width: 350, height: 500 },
      idleFrame2: { x: 256, y: 0, width: 256, height: 512 },
      chopAnticipation: { x: 512, y: 0, width: 256, height: 512 },
      chopImpact: { x: 330, y: 587, width: 356, height: 456 },
      chopFollowThrough: { x: 0, y: 512, width: 256, height: 512 },
      chopRecovery: { x: 256, y: 512, width: 256, height: 512 },
      hitStunned: { x: 50, y: 1050, width: 350, height: 450 },
      knockedDown: { x: 768, y: 512, width: 256, height: 512 }
    } as const,
    statePoseMap: {
      idle: 'idleFrame1',
      chopping: 'chopImpact',
      hit: 'hitStunned'
    },
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
  },
  {
    id: 'lumberjack3',
    name: 'Advanced Lumberjack',
    sheet: {
      path: './images/lumberjack3.png',
      width: 1024,
      height: 1024
    },
    displaySize: 220,
    height: 173,
    defaultFacing: 'right',
    poses: {
      idleFrame1: { x: 70, y: 35, width: 280, height: 450 },
      chopImpact: { x: 370, y: 500, width: 290, height: 465 },
      hitStunned: { x: 20, y: 495, width: 350, height: 465 }
    } as const,
    statePoseMap: {
      idle: 'idleFrame1',
      chopping: 'chopImpact',
      hit: 'hitStunned'
    },
    availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
  },
  {
    id: 'lumberjack4',
    name: 'Enhanced Lumberjack',
    sheet: {
      path: './images/lumberjack4.png',
      width: 966,
      height: 1415
    },
    displaySize: 220,
    height: 173,
    defaultFacing: 'right',
    poses: {
      idleFrame1: { x: 280, y: 0, width: 310, height: 440 },
      chopImpact: { x: 75, y: 450, width: 400, height: 500, facing: 'left' },
      hitStunned: { x: 70, y: 1000, width: 370, height: 430 }
    } as const,
    statePoseMap: {
      idle: 'idleFrame1',
      chopping: 'chopImpact',
      hit: 'hitStunned'
    },
    availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
  },
  {
    id: 'lumberjack5',
    name: 'Cartoon Lumberjack',
    sheet: {
      path: './images/lumberjack5.png',
      width: 1024,
      height: 1024
    },
    displaySize: 220,
    height: 173,
    defaultFacing: 'right',
    poses: {
      idleFrame1: { x: 20, y: 70, width: 250, height: 470 },
      chopImpact: { x: 700, y: 115, width: 330, height: 430 },
      hitStunned: { x: 0, y: 540, width: 260, height: 480 }
    } as const,
    statePoseMap: {
      idle: 'idleFrame1',
      chopping: 'chopImpact',
      hit: 'hitStunned'
    },
    availableStates: ['idleFrame1', 'chopImpact', 'hitStunned']
  }
] as const satisfies readonly CharacterDescriptor[]

export type CharacterDescriptors = typeof characterDescriptors
