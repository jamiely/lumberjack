import { describe, it, expect } from 'vitest'
import { getCharacterConfig } from '../index'

describe('lumberjack5Config', () => {
  const lumberjack5Config = getCharacterConfig('lumberjack5')

  it('has correct id and name', () => {
    expect(lumberjack5Config.id).toBe('lumberjack5')
    expect(lumberjack5Config.name).toBe('Cartoon Lumberjack')
  })

  it('has all required poses', () => {
    const expectedPoses = [
      'idleFrame1',
      'chopImpact',
      'hitStunned'
    ]
    
    expectedPoses.forEach(pose => {
      expect(lumberjack5Config.spriteConfig.poses).toHaveProperty(pose)
    })
  })

  it('has valid pose bounds', () => {
    Object.values(lumberjack5Config.spriteConfig.poses).forEach(pose => {
      expect(pose.x).toBeGreaterThanOrEqual(0)
      expect(pose.y).toBeGreaterThanOrEqual(0)
      expect(pose.width).toBeGreaterThan(0)
      expect(pose.height).toBeGreaterThan(0)
    })
  })

  it('maps game states correctly', () => {
    expect(lumberjack5Config.mapGameStateToSprite('idle')).toBe('idleFrame1')
    expect(lumberjack5Config.mapGameStateToSprite('chopping')).toBe('chopImpact')
    expect(lumberjack5Config.mapGameStateToSprite('hit')).toBe('hitStunned')
  })

  it('has correct sprite sheet configuration', () => {
    expect(lumberjack5Config.spriteConfig.sheetPath).toBe('./images/lumberjack5.png')
    expect(lumberjack5Config.spriteConfig.sheetWidth).toBe(1024)
    expect(lumberjack5Config.spriteConfig.sheetHeight).toBe(1024)
  })

  it('has correct dimensions', () => {
    expect(lumberjack5Config.spriteConfig.dimensions.width).toBe(220)
    expect(lumberjack5Config.spriteConfig.dimensions.height).toBe(173)
    expect(lumberjack5Config.spriteConfig.dimensions.displaySize).toBe(220)
  })

  it('has all available states', () => {
    expect(lumberjack5Config.availableStates).toEqual([
      'idleFrame1',
      'chopImpact',
      'hitStunned'
    ])
  })

  it('matches defined sprite data coordinates', () => {
    const poses = lumberjack5Config.spriteConfig.poses

    expect(poses.idleFrame1).toEqual({ x: 20, y: 70, width: 250, height: 470 })
    expect(poses.chopImpact).toEqual({ x: 700, y: 115, width: 330, height: 430 })
    expect(poses.hitStunned).toEqual({ x: 0, y: 540, width: 260, height: 480 })
  })
})
