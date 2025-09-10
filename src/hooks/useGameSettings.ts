import { useState, useCallback } from 'react'
import type { GameSettings, AudioSettings } from '../game/GameSettings'
import { defaultSettings } from '../game/GameSettings'

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  
  const updateAudioSettings = useCallback((audioSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({
      ...prev,
      audio: { ...prev.audio, ...audioSettings }
    }))
  }, [])
  
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])
  
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])
  
  return { 
    settings, 
    updateAudioSettings, 
    updateSettings, 
    resetSettings 
  }
}