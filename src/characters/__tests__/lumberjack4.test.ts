import { describe, it, expect } from 'vitest'
import { lumberjack4Config } from '../lumberjack4/config'

describe('lumberjack4Config', () => {
  it('has correct id and name', () => {
    expect(lumberjack4Config.id).toBe('lumberjack4')
    expect(lumberjack4Config.name).toBe('Enhanced Lumberjack')
  })

  it('has all required poses', () => {
    const expectedPoses = [
      'idleFrame1',
      'chopImpact',
      'hitStunned'
    ]
    
    expectedPoses.forEach(pose => {
      expect(lumberjack4Config.spriteConfig.poses).toHaveProperty(pose)
    })
  })

  it('has valid pose bounds', () => {
    Object.values(lumberjack4Config.spriteConfig.poses).forEach(pose => {
      expect(pose.x).toBeGreaterThanOrEqual(0)
      expect(pose.y).toBeGreaterThanOrEqual(0)
      expect(pose.width).toBeGreaterThan(0)
      expect(pose.height).toBeGreaterThan(0)
    })
  })

  it('maps game states correctly', () => {
    expect(lumberjack4Config.mapGameStateToSprite('idle')).toBe('idleFrame1')
    expect(lumberjack4Config.mapGameStateToSprite('chopping')).toBe('chopImpact')
    expect(lumberjack4Config.mapGameStateToSprite('hit')).toBe('hitStunned')
  })

  it('has correct sprite sheet configuration', () => {
    expect(lumberjack4Config.spriteConfig.sheetPath).toBe('/images/lumberjack4.png')
    expect(lumberjack4Config.spriteConfig.sheetWidth).toBeGreaterThan(0)
    expect(lumberjack4Config.spriteConfig.sheetHeight).toBeGreaterThan(0)
  })

  it('has correct dimensions', () => {
    expect(lumberjack4Config.spriteConfig.dimensions.width).toBe(220)
    expect(lumberjack4Config.spriteConfig.dimensions.height).toBe(173)
    expect(lumberjack4Config.spriteConfig.dimensions.displaySize).toBe(220)
  })

  it('has all available states', () => {
    expect(lumberjack4Config.availableStates).toEqual([
      'idleFrame1',
      'chopImpact',
      'hitStunned'
    ])
  })
})