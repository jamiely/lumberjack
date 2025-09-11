import { useCallback } from 'react';
import { useAudioContext } from '../AudioContext.js';
import { useGameSettings } from '../../hooks/useGameSettings.js';

export const useGameAudio = () => {
  const { audioManager } = useAudioContext();
  const { settings } = useGameSettings();
  
  const playChopSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('chop', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume * 0.8 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playHitSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('hit', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playGameOverSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('gameOver', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  const playTimerWarning = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('timerWarning', { 
        volume: settings.audio.sfxVolume * settings.audio.masterVolume * 0.6 
      });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume, settings.audio.masterVolume]);
  
  return { 
    playChopSound, 
    playHitSound, 
    playGameOverSound, 
    playTimerWarning 
  };
};