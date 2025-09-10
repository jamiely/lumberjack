import { describe, it, expect } from 'vitest'
import { defaultSettings } from '../GameSettings'
import type { GameSettings, AudioSettings } from '../GameSettings'

describe('GameSettings', () => {
  describe('defaultSettings', () => {
    it('should provide default audio settings', () => {
      expect(defaultSettings.audio).toEqual({
        enabled: true,
        masterVolume: 0.8,
        sfxVolume: 1.0
      })
    })

    it('should provide default game settings', () => {
      expect(defaultSettings.freePlay).toBe(true)
    })

    it('should have valid volume ranges', () => {
      expect(defaultSettings.audio.masterVolume).toBeGreaterThanOrEqual(0)
      expect(defaultSettings.audio.masterVolume).toBeLessThanOrEqual(1)
      expect(defaultSettings.audio.sfxVolume).toBeGreaterThanOrEqual(0)
      expect(defaultSettings.audio.sfxVolume).toBeLessThanOrEqual(1)
    })

    it('should be immutable reference', () => {
      const settings1 = defaultSettings
      const settings2 = defaultSettings
      expect(settings1).toBe(settings2)
    })
  })

  describe('AudioSettings interface', () => {
    it('should accept valid audio settings', () => {
      const audioSettings: AudioSettings = {
        enabled: false,
        masterVolume: 0.5,
        sfxVolume: 0.7
      }

      expect(audioSettings.enabled).toBe(false)
      expect(audioSettings.masterVolume).toBe(0.5)
      expect(audioSettings.sfxVolume).toBe(0.7)
    })

    it('should accept edge case volumes', () => {
      const minVolumeSettings: AudioSettings = {
        enabled: true,
        masterVolume: 0.0,
        sfxVolume: 0.0
      }

      const maxVolumeSettings: AudioSettings = {
        enabled: true,
        masterVolume: 1.0,
        sfxVolume: 1.0
      }

      expect(minVolumeSettings.masterVolume).toBe(0.0)
      expect(minVolumeSettings.sfxVolume).toBe(0.0)
      expect(maxVolumeSettings.masterVolume).toBe(1.0)
      expect(maxVolumeSettings.sfxVolume).toBe(1.0)
    })
  })

  describe('GameSettings interface', () => {
    it('should accept valid game settings', () => {
      const gameSettings: GameSettings = {
        audio: {
          enabled: true,
          masterVolume: 0.9,
          sfxVolume: 0.8
        },
        freePlay: false
      }

      expect(gameSettings.audio.enabled).toBe(true)
      expect(gameSettings.audio.masterVolume).toBe(0.9)
      expect(gameSettings.audio.sfxVolume).toBe(0.8)
      expect(gameSettings.freePlay).toBe(false)
    })

    it('should be extensible for future settings', () => {
      const extendedSettings: GameSettings & { newFeature?: boolean } = {
        ...defaultSettings,
        newFeature: true
      }

      expect(extendedSettings.freePlay).toBe(true)
      expect(extendedSettings.newFeature).toBe(true)
    })
  })

  describe('settings composition', () => {
    it('should allow partial audio settings updates', () => {
      const updatedSettings: GameSettings = {
        ...defaultSettings,
        audio: {
          ...defaultSettings.audio,
          enabled: false
        }
      }

      expect(updatedSettings.audio.enabled).toBe(false)
      expect(updatedSettings.audio.masterVolume).toBe(defaultSettings.audio.masterVolume)
      expect(updatedSettings.audio.sfxVolume).toBe(defaultSettings.audio.sfxVolume)
    })

    it('should allow complete settings override', () => {
      const customSettings: GameSettings = {
        audio: {
          enabled: false,
          masterVolume: 0.3,
          sfxVolume: 0.6
        },
        freePlay: false
      }

      expect(customSettings).not.toEqual(defaultSettings)
      expect(customSettings.audio.enabled).toBe(false)
      expect(customSettings.audio.masterVolume).toBe(0.3)
      expect(customSettings.audio.sfxVolume).toBe(0.6)
      expect(customSettings.freePlay).toBe(false)
    })
  })
})