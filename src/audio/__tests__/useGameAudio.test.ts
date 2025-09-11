import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameAudio } from '../hooks/useGameAudio.js';
import * as AudioContextModule from '../AudioContext.js';
import * as GameSettingsModule from '../../hooks/useGameSettings.js';

// Mock dependencies
vi.mock('../AudioContext.js');
vi.mock('../../hooks/useGameSettings.js');

describe('useGameAudio', () => {
  const mockAudioManager = {
    isReady: true,
    playSound: vi.fn()
  };

  const mockAudioContext = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioManager: mockAudioManager as any,
    audioState: 'ready' as const,
    initializeAudio: vi.fn(),
    isInitialized: true
  };

  const mockGameSettings = {
    settings: {
      audio: {
        enabled: true,
        masterVolume: 0.8,
        sfxVolume: 1.0
      },
      freePlay: true
    },
    updateAudioSettings: vi.fn(),
    updateSettings: vi.fn(),
    resetSettings: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AudioContextModule.useAudioContext).mockReturnValue(mockAudioContext);
    vi.mocked(GameSettingsModule.useGameSettings).mockReturnValue(mockGameSettings);
  });

  describe('playChopSound', () => {
    it('should play chop sound with correct volume', () => {
      const { result } = renderHook(() => useGameAudio());
      
      result.current.playChopSound();

      expect(mockAudioManager.playSound).toHaveBeenCalledWith('chop', {
        volume: 0.8 * 1.0 * 0.35 // masterVolume * sfxVolume * chopVolumeMultiplier
      });
    });

    it('should not play when audio is disabled', () => {
      const disabledSettings = {
        ...mockGameSettings,
        settings: {
          ...mockGameSettings.settings,
          audio: {
            ...mockGameSettings.settings.audio,
            enabled: false
          }
        }
      };
      vi.mocked(GameSettingsModule.useGameSettings).mockReturnValue(disabledSettings);

      const { result } = renderHook(() => useGameAudio());
      
      result.current.playChopSound();

      expect(mockAudioManager.playSound).not.toHaveBeenCalled();
    });

    it('should not play when audio manager is not ready', () => {
      const notReadyAudioContext = {
        ...mockAudioContext,
        audioManager: {
          ...mockAudioManager,
          isReady: false
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      };
      vi.mocked(AudioContextModule.useAudioContext).mockReturnValue(notReadyAudioContext);

      const { result } = renderHook(() => useGameAudio());
      
      result.current.playChopSound();

      expect(mockAudioManager.playSound).not.toHaveBeenCalled();
    });
  });

  describe('playHitSound', () => {
    it('should play hit sound with correct volume', () => {
      const { result } = renderHook(() => useGameAudio());
      
      result.current.playHitSound();

      expect(mockAudioManager.playSound).toHaveBeenCalledWith('hit', {
        volume: 0.8 * 1.0 // masterVolume * sfxVolume
      });
    });
  });

  describe('playGameOverSound', () => {
    it('should play game over sound with correct volume', () => {
      const { result } = renderHook(() => useGameAudio());
      
      result.current.playGameOverSound();

      expect(mockAudioManager.playSound).toHaveBeenCalledWith('gameOver', {
        volume: 0.8 * 1.0 * 0.5 // masterVolume * sfxVolume * gameOverVolumeMultiplier
      });
    });
  });

  describe('playTimerWarning', () => {
    it('should play timer warning sound with correct volume', () => {
      const { result } = renderHook(() => useGameAudio());
      
      result.current.playTimerWarning();

      expect(mockAudioManager.playSound).toHaveBeenCalledWith('timerWarning', {
        volume: 0.8 * 1.0 * 0.6 // masterVolume * sfxVolume * timerVolumeMultiplier
      });
    });
  });

  describe('volume calculations', () => {
    it('should respect different volume settings', () => {
      const customSettings = {
        ...mockGameSettings,
        settings: {
          ...mockGameSettings.settings,
          audio: {
            enabled: true,
            masterVolume: 0.5,
            sfxVolume: 0.7
          }
        }
      };
      vi.mocked(GameSettingsModule.useGameSettings).mockReturnValue(customSettings);

      const { result } = renderHook(() => useGameAudio());
      
      result.current.playChopSound();
      result.current.playHitSound();
      result.current.playTimerWarning();

      expect(mockAudioManager.playSound).toHaveBeenCalledWith('chop', {
        volume: 0.5 * 0.7 * 0.35 // masterVolume * sfxVolume * chopMultiplier = 0.1225
      });
      expect(mockAudioManager.playSound).toHaveBeenCalledWith('hit', {
        volume: 0.5 * 0.7 * 1.0 // masterVolume * sfxVolume * hitMultiplier = 0.35
      });
      expect(mockAudioManager.playSound).toHaveBeenCalledWith('timerWarning', {
        volume: 0.5 * 0.7 * 0.6 // masterVolume * sfxVolume * timerWarningMultiplier = 0.21
      });
    });
  });

  describe('hook dependencies', () => {
    it('should memoize callbacks properly', () => {
      const { result, rerender } = renderHook(() => useGameAudio());
      
      const firstRender = {
        playChopSound: result.current.playChopSound,
        playHitSound: result.current.playHitSound,
        playGameOverSound: result.current.playGameOverSound,
        playTimerWarning: result.current.playTimerWarning
      };

      rerender();

      // Callbacks should be the same if dependencies haven't changed
      expect(result.current.playChopSound).toBe(firstRender.playChopSound);
      expect(result.current.playHitSound).toBe(firstRender.playHitSound);
      expect(result.current.playGameOverSound).toBe(firstRender.playGameOverSound);
      expect(result.current.playTimerWarning).toBe(firstRender.playTimerWarning);
    });

    it('should update callbacks when settings change', () => {
      const { result, rerender } = renderHook(() => useGameAudio());
      
      const firstPlayChopSound = result.current.playChopSound;

      // Change settings
      const newSettings = {
        ...mockGameSettings,
        settings: {
          ...mockGameSettings.settings,
          audio: {
            ...mockGameSettings.settings.audio,
            masterVolume: 0.5
          }
        }
      };
      vi.mocked(GameSettingsModule.useGameSettings).mockReturnValue(newSettings);

      rerender();

      // Callback should be different due to changed dependency
      expect(result.current.playChopSound).not.toBe(firstPlayChopSound);
    });
  });
});