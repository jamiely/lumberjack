import { describe, it, expect } from 'vitest'
import {
  BASE_CHARACTER_WIDTH,
  DEFAULT_BOTTOM_OFFSET,
  DEFAULT_LEFT_POSITION,
  DEFAULT_RIGHT_POSITION,
  calculateCenteringOffset,
  createCharacterConfig
} from '../sharedConfig'
import type { GameState, PoseBounds } from '../types'

describe('shared character config utilities', () => {
  it('calculates centering offset with lower bound at zero', () => {
    expect(calculateCenteringOffset(BASE_CHARACTER_WIDTH)).toBe(0)
    expect(calculateCenteringOffset(BASE_CHARACTER_WIDTH - 20)).toBe(0)
    expect(calculateCenteringOffset(BASE_CHARACTER_WIDTH + 40)).toBe(20)
  })

  it('creates configs with shared defaults', () => {
    const poses: Record<string, PoseBounds> = {
      idle: { x: 0, y: 0, width: 100, height: 200 },
      chopping: { x: 100, y: 0, width: 120, height: 200 },
      hit: { x: 220, y: 0, width: 90, height: 200 }
    }

    const config = createCharacterConfig({
      id: 'lumberjack1',
      name: 'Test Jack',
      sheet: { path: './sheet.png', width: 512, height: 512 },
      displaySize: 200,
      height: 180,
      poses,
      defaultFacing: 'left',
      statePoseMap: {
        idle: 'idle',
        chopping: 'chopping',
        hit: 'hit'
      }
    })

    expect(config.spriteConfig.dimensions.width).toBe(200)
    expect(config.spriteConfig.dimensions.height).toBe(180)
    expect(config.spriteConfig.positioning.bottomOffset).toBe(DEFAULT_BOTTOM_OFFSET)
    expect(config.spriteConfig.positioning.leftPosition).toBe(DEFAULT_LEFT_POSITION)
    expect(config.spriteConfig.positioning.rightPosition).toBe(DEFAULT_RIGHT_POSITION)
    expect(config.availableStates).toEqual(['idle', 'chopping', 'hit'])
  })

  it('allows overriding available states and positioning', () => {
    const poses: Record<string, PoseBounds> = {
      idle: { x: 0, y: 0, width: 100, height: 200 },
      powerSwing: { x: 100, y: 0, width: 100, height: 200 },
      stagger: { x: 200, y: 0, width: 100, height: 200 }
    }

    const config = createCharacterConfig({
      id: 'lumberjack2',
      name: 'Overrides Jack',
      sheet: { path: './sheet.png', width: 256, height: 256 },
      displaySize: 180,
      poses,
      defaultFacing: 'right',
      statePoseMap: {
        idle: 'idle',
        chopping: 'powerSwing',
        hit: 'stagger'
      },
      availableStates: ['idle', 'comboStart'],
      positioningOverrides: {
        bottomOffset: 64,
        leftPosition: 80,
        rightPosition: 320,
        centeringOffset: 22
      }
    })

    expect(config.spriteConfig.positioning.bottomOffset).toBe(64)
    expect(config.spriteConfig.positioning.leftPosition).toBe(80)
    expect(config.spriteConfig.positioning.rightPosition).toBe(320)
    expect(config.spriteConfig.positioning.centeringOffset).toBe(22)
    expect(config.availableStates).toEqual(['idle', 'comboStart', 'powerSwing', 'stagger'])
  })

  it('maps game states using supplied pose mapping', () => {
    const poses: Record<string, PoseBounds> = {
      idlePose: { x: 0, y: 0, width: 100, height: 200 },
      chopPose: { x: 0, y: 0, width: 100, height: 200 },
      hitPose: { x: 0, y: 0, width: 100, height: 200 }
    }

    const config = createCharacterConfig({
      id: 'lumberjack3',
      name: 'Mapper Jack',
      sheet: { path: './sheet.png', width: 128, height: 128 },
      displaySize: 150,
      poses,
      defaultFacing: 'left',
      statePoseMap: {
        idle: 'idlePose',
        chopping: 'chopPose',
        hit: 'hitPose'
      }
    })

    const states: GameState[] = ['idle', 'chopping', 'hit']
    expect(states.map(config.mapGameStateToSprite)).toEqual(['idlePose', 'chopPose', 'hitPose'])
  })
})
