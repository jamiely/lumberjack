import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameSettings } from '../useGameSettings'
import { defaultSettings } from '../../game/GameSettings'
import type { AudioSettings, GameSettings } from '../../game/GameSettings'

describe('useGameSettings', () => {
  describe('initial state', () => {
    it('should initialize with default settings', () => {
      const { result } = renderHook(() => useGameSettings())

      expect(result.current.settings).toEqual(defaultSettings)
    })

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useGameSettings())

      expect(typeof result.current.updateAudioSettings).toBe('function')
      expect(typeof result.current.updateSettings).toBe('function')
      expect(typeof result.current.resetSettings).toBe('function')
    })
  })

  describe('updateAudioSettings', () => {
    it('should update partial audio settings', () => {
      const { result } = renderHook(() => useGameSettings())

      act(() => {
        result.current.updateAudioSettings({ enabled: false })
      })

      expect(result.current.settings.audio.enabled).toBe(false)
      expect(result.current.settings.audio.masterVolume).toBe(defaultSettings.audio.masterVolume)
      expect(result.current.settings.audio.sfxVolume).toBe(defaultSettings.audio.sfxVolume)
      expect(result.current.settings.freePlay).toBe(defaultSettings.freePlay)
    })

    it('should update multiple audio settings at once', () => {
      const { result } = renderHook(() => useGameSettings())

      act(() => {
        result.current.updateAudioSettings({
          enabled: false,
          masterVolume: 0.5,
          sfxVolume: 0.7
        })
      })

      expect(result.current.settings.audio).toEqual({
        enabled: false,
        masterVolume: 0.5,
        sfxVolume: 0.7
      })
    })

    it('should update volume settings independently', () => {
      const { result } = renderHook(() => useGameSettings())

      act(() => {
        result.current.updateAudioSettings({ masterVolume: 0.3 })
      })

      expect(result.current.settings.audio.masterVolume).toBe(0.3)
      expect(result.current.settings.audio.enabled).toBe(defaultSettings.audio.enabled)
      expect(result.current.settings.audio.sfxVolume).toBe(defaultSettings.audio.sfxVolume)

      act(() => {
        result.current.updateAudioSettings({ sfxVolume: 0.9 })
      })

      expect(result.current.settings.audio.masterVolume).toBe(0.3)
      expect(result.current.settings.audio.sfxVolume).toBe(0.9)
    })

    it('should maintain stable function reference', () => {
      const { result, rerender } = renderHook(() => useGameSettings())
      const firstUpdateAudioSettings = result.current.updateAudioSettings

      rerender()

      expect(result.current.updateAudioSettings).toBe(firstUpdateAudioSettings)
    })
  })

  describe('updateSettings', () => {
    it('should update non-audio settings', () => {
      const { result } = renderHook(() => useGameSettings())

      act(() => {
        result.current.updateSettings({ freePlay: false })
      })

      expect(result.current.settings.freePlay).toBe(false)
      expect(result.current.settings.audio).toEqual(defaultSettings.audio)
    })

    it('should update audio settings through updateSettings', () => {
      const { result } = renderHook(() => useGameSettings())
      const newAudioSettings: AudioSettings = {
        enabled: false,
        masterVolume: 0.6,
        sfxVolume: 0.8
      }

      act(() => {
        result.current.updateSettings({ audio: newAudioSettings })
      })

      expect(result.current.settings.audio).toEqual(newAudioSettings)
      expect(result.current.settings.freePlay).toBe(defaultSettings.freePlay)
    })

    it('should update multiple settings at once', () => {
      const { result } = renderHook(() => useGameSettings())
      const newSettings: Partial<GameSettings> = {
        audio: {
          enabled: false,
          masterVolume: 0.4,
          sfxVolume: 0.6
        },
        freePlay: false
      }

      act(() => {
        result.current.updateSettings(newSettings)
      })

      expect(result.current.settings).toEqual(newSettings)
    })

    it('should maintain stable function reference', () => {
      const { result, rerender } = renderHook(() => useGameSettings())
      const firstUpdateSettings = result.current.updateSettings

      rerender()

      expect(result.current.updateSettings).toBe(firstUpdateSettings)
    })
  })

  describe('resetSettings', () => {
    it('should reset all settings to defaults', () => {
      const { result } = renderHook(() => useGameSettings())

      // Modify settings first
      act(() => {
        result.current.updateSettings({
          audio: {
            enabled: false,
            masterVolume: 0.1,
            sfxVolume: 0.2
          },
          freePlay: false
        })
      })

      expect(result.current.settings).not.toEqual(defaultSettings)

      // Reset settings
      act(() => {
        result.current.resetSettings()
      })

      expect(result.current.settings).toEqual(defaultSettings)
    })

    it('should maintain stable function reference', () => {
      const { result, rerender } = renderHook(() => useGameSettings())
      const firstResetSettings = result.current.resetSettings

      rerender()

      expect(result.current.resetSettings).toBe(firstResetSettings)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complex settings workflow', () => {
      const { result } = renderHook(() => useGameSettings())

      // Start with defaults
      expect(result.current.settings).toEqual(defaultSettings)

      // Update audio enabled state
      act(() => {
        result.current.updateAudioSettings({ enabled: false })
      })

      // Update volume independently
      act(() => {
        result.current.updateAudioSettings({ masterVolume: 0.5 })
      })

      // Update game settings
      act(() => {
        result.current.updateSettings({ freePlay: false })
      })

      expect(result.current.settings).toEqual({
        audio: {
          enabled: false,
          masterVolume: 0.5,
          sfxVolume: defaultSettings.audio.sfxVolume
        },
        freePlay: false
      })

      // Reset everything
      act(() => {
        result.current.resetSettings()
      })

      expect(result.current.settings).toEqual(defaultSettings)
    })

    it('should preserve settings across re-renders', () => {
      const { result, rerender } = renderHook(() => useGameSettings())

      act(() => {
        result.current.updateAudioSettings({ masterVolume: 0.75 })
      })

      const settingsAfterUpdate = result.current.settings

      rerender()

      expect(result.current.settings).toEqual(settingsAfterUpdate)
    })
  })

  describe('edge cases', () => {
    it('should handle empty audio settings update', () => {
      const { result } = renderHook(() => useGameSettings())
      const originalSettings = result.current.settings

      act(() => {
        result.current.updateAudioSettings({})
      })

      expect(result.current.settings).toEqual(originalSettings)
    })

    it('should handle empty general settings update', () => {
      const { result } = renderHook(() => useGameSettings())
      const originalSettings = result.current.settings

      act(() => {
        result.current.updateSettings({})
      })

      expect(result.current.settings).toEqual(originalSettings)
    })

    it('should handle extreme volume values', () => {
      const { result } = renderHook(() => useGameSettings())

      act(() => {
        result.current.updateAudioSettings({
          masterVolume: 0.0,
          sfxVolume: 1.0
        })
      })

      expect(result.current.settings.audio.masterVolume).toBe(0.0)
      expect(result.current.settings.audio.sfxVolume).toBe(1.0)
    })
  })
})