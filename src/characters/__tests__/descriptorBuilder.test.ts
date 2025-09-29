import { describe, it, expect } from 'vitest'
import { characterDescriptors } from '../descriptors'
import { buildCharacterConfig, createStandardStateMap } from '../descriptorBuilder'

const DEFAULT_STATE_SHAPES = createStandardStateMap()

describe('character descriptor builder', () => {
  it('provides default state mapping when no overrides supplied', () => {
    expect(DEFAULT_STATE_SHAPES).toEqual({ idle: 'idle', chopping: 'chopping', hit: 'hit' })
  })

  characterDescriptors.forEach(descriptor => {
    describe(descriptor.id, () => {
      const config = buildCharacterConfig(descriptor)

      it('keeps descriptor identity and names intact', () => {
        expect(config.id).toBe(descriptor.id)
        expect(config.name).toBe(descriptor.name)
      })

      it('carries forward sprite sheet metadata', () => {
        expect(config.spriteConfig.sheetPath).toBe(descriptor.sheet.path)
        expect(config.spriteConfig.sheetWidth).toBe(descriptor.sheet.width)
        expect(config.spriteConfig.sheetHeight).toBe(descriptor.sheet.height)
      })

      it('uses descriptor poses and facing data', () => {
        expect(config.spriteConfig.poses).toEqual(descriptor.poses)
        expect(config.spriteConfig.defaultFacing).toBe(descriptor.defaultFacing)
      })

      it('derives available states from descriptor list', () => {
        descriptor.availableStates.forEach(state => {
          expect(config.availableStates).toContain(state)
        })
      })

      it('maps game states according to descriptor', () => {
        expect(config.mapGameStateToSprite('idle')).toBe(descriptor.statePoseMap.idle || 'idle')
        expect(config.mapGameStateToSprite('chopping')).toBe(descriptor.statePoseMap.chopping || 'chopping')
        expect(config.mapGameStateToSprite('hit')).toBe(descriptor.statePoseMap.hit || 'hit')
      })
    })
  })
})
