import { useCallback } from 'react';
import { useAudioContext } from '../AudioContext.js';
import { useGameSettings } from '../../hooks/useGameSettings.js';

// Volume multipliers for different sound effects (0.0 - 1.0)
const SOUND_VOLUMES = {
  chop: 0.35,       // Reduced by 30% from 0.5 - main gameplay sound, keep moderate
  hit: 1.0,         // Full volume - important feedback for mistakes
  gameOver: 0.5,    // Reduced by 50% from 1.0 - important game state change
  timerWarning: 0.6 // Moderate volume - warning but not overwhelming
} as const;

// Background music volume (20% as specified in requirements)
const BACKGROUND_MUSIC_VOLUME = 0.2;

export const useGameAudio = () => {
  const { audioManager } = useAudioContext();
  const { settings } = useGameSettings();
  
  const playChopSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('chop', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume * SOUND_VOLUMES.chop 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playHitSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('hit', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume * SOUND_VOLUMES.hit 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playGameOverSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('gameOver', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume * SOUND_VOLUMES.gameOver 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playTimerWarning = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('timerWarning', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume * SOUND_VOLUMES.timerWarning 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playBackgroundMusic = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      // Set background music volume (20% of master volume)
      audioManager.setBackgroundMusicVolume(settings.audio.masterVolume * BACKGROUND_MUSIC_VOLUME);
      audioManager.playBackgroundMusic('background');
    }
  }, [audioManager, settings.audio.enabled, settings.audio.masterVolume]);
  
  const stopBackgroundMusic = useCallback(() => {
    if (audioManager?.isReady) {
      audioManager.stopBackgroundMusic();
    }
  }, [audioManager]);
  
  return { 
    playChopSound, 
    playHitSound, 
    playGameOverSound, 
    playTimerWarning,
    playBackgroundMusic,
    stopBackgroundMusic
  };
};