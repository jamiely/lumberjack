import { describe, it, expect } from 'vitest'
import { lumberjack5Config } from '../lumberjack5/config'

describe('lumberjack5Config', () => {
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
    expect(lumberjack5Config.spriteConfig.sheetWidth).toBeGreaterThan(0)
    expect(lumberjack5Config.spriteConfig.sheetHeight).toBeGreaterThan(0)
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

  it('has correct sprite sheet layout for 3x2 grid', () => {
    expect(lumberjack5Config.spriteConfig.sheetWidth).toBe(768) // 3 columns * 256px
    expect(lumberjack5Config.spriteConfig.sheetHeight).toBe(512) // 2 rows * 256px
  })

  it('has poses positioned correctly in 3x2 grid', () => {
    const poses = lumberjack5Config.spriteConfig.poses
    
    // Top row
    expect(poses.idleFrame1).toEqual({ x: 0, y: 0, width: 256, height: 256 })
    expect(poses.chopAnticipation).toEqual({ x: 256, y: 0, width: 256, height: 256 })
    expect(poses.chopImpact).toEqual({ x: 512, y: 0, width: 256, height: 256 })
    
    // Bottom row
    expect(poses.hitStunned).toEqual({ x: 0, y: 256, width: 256, height: 256 })
    expect(poses.chopFollowThrough).toEqual({ x: 256, y: 256, width: 256, height: 256 })
    expect(poses.knockedDown).toEqual({ x: 512, y: 256, width: 256, height: 256 })
  })
})