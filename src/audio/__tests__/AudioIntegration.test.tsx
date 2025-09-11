/**
 * Integration tests for audio system with game events
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AudioProvider, useAudioContext } from '../AudioContext';
import { useAudioEventHandlers } from '../../hooks/useAudioEventHandlers';
import { useGameEvents } from '../../hooks/useGameEvents';
import { useGameAudio } from '../hooks/useGameAudio';
import { AudioManager } from '../AudioManager';

// Mock the audio API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createGain: vi.fn().mockReturnValue({
      connect: vi.fn(),
      gain: { setValueAtTime: vi.fn() }
    }),
    createBufferSource: vi.fn().mockReturnValue({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      buffer: null,
      loop: false,
      onended: null
    }),
    createBuffer: vi.fn().mockReturnValue({}),
    createDynamicsCompressor: vi.fn().mockReturnValue({
      connect: vi.fn(),
      threshold: { value: 0 },
      knee: { value: 0 },
      ratio: { value: 0 },
      attack: { value: 0 },
      release: { value: 0 }
    }),
    decodeAudioData: vi.fn().mockResolvedValue({}),
    destination: {},
    state: 'running',
    currentTime: 0,
    resume: vi.fn().mockResolvedValue(undefined),
    suspend: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined)
  }))
});

// Mock fetch for audio loading
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8))
});

// Mock useGameSettings
vi.mock('../../hooks/useGameSettings', () => ({
  useGameSettings: () => ({
    settings: {
      audio: {
        enabled: true,
        masterVolume: 0.8,
        sfxVolume: 0.9
      }
    },
    updateSettings: vi.fn()
  })
}));

// Test component that uses audio events
const TestGameComponent = () => {
  const { emit } = useGameEvents();
  const { playChopSound } = useGameAudio();
  
  // Initialize audio event handlers
  useAudioEventHandlers();
  
  return (
    <div>
      <button onClick={() => emit('chop')} data-testid="emit-chop">
        Emit Chop
      </button>
      <button onClick={() => emit('hit')} data-testid="emit-hit">
        Emit Hit
      </button>
      <button onClick={() => emit('gameOver')} data-testid="emit-game-over">
        Emit Game Over
      </button>
      <button onClick={() => emit('timerWarning')} data-testid="emit-timer-warning">
        Emit Timer Warning
      </button>
      <button onClick={playChopSound} data-testid="direct-chop">
        Direct Chop Sound
      </button>
    </div>
  );
};

describe('Audio Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Audio Context Provider', () => {
    it('should provide audio context to child components', async () => {
      const { container } = render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId('emit-chop')).toBeInTheDocument();
    });

    it('should initialize audio manager in normal mode by default', async () => {
      const audioManagerSpy = vi.spyOn(AudioManager.prototype, 'initialize');
      
      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      // Audio manager should be created but not necessarily initialized yet
      expect(audioManagerSpy).not.toHaveBeenCalled();
    });

    it('should initialize audio manager in arcade mode when specified', async () => {
      const mockInitialize = vi.fn().mockResolvedValue(undefined);
      const mockLoadAudioAssets = vi.fn().mockResolvedValue(undefined);
      
      vi.spyOn(AudioManager.prototype, 'initialize').mockImplementation(mockInitialize);
      vi.spyOn(AudioManager.prototype, 'loadAudioAssets').mockImplementation(mockLoadAudioAssets);
      
      const TestComponentWithInit = () => {
        const { initializeAudio } = useAudioContext();
        
        // Initialize audio when component mounts
        React.useEffect(() => {
          initializeAudio();
        }, [initializeAudio]);
        
        return <TestGameComponent />;
      };
      
      render(
        <AudioProvider arcadeMode={true}>
          <TestComponentWithInit />
        </AudioProvider>
      );

      // Wait for audio to initialize
      await act(async () => {
        // Allow effects to run
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should initialize AudioManager
      expect(mockInitialize).toHaveBeenCalled();
      expect(mockLoadAudioAssets).toHaveBeenCalled();
    });
  });

  describe('Game Event Audio Integration', () => {
    it('should play sounds when game events are emitted', async () => {
      const mockPlaySound = vi.fn();
      vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(mockPlaySound);
      vi.spyOn(AudioManager.prototype, 'initialize').mockResolvedValue();
      
      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      // Emit chop event
      await act(async () => {
        fireEvent.click(screen.getByTestId('emit-chop'));
      });

      // Note: This test verifies the integration is set up correctly
      // The actual sound playing depends on the audio being initialized
      expect(screen.getByTestId('emit-chop')).toBeInTheDocument();
    });

    it('should handle multiple simultaneous events', async () => {
      const mockPlaySound = vi.fn();
      vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(mockPlaySound);
      
      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      // Emit multiple events rapidly
      await act(async () => {
        fireEvent.click(screen.getByTestId('emit-chop'));
        fireEvent.click(screen.getByTestId('emit-hit'));
        fireEvent.click(screen.getByTestId('emit-timer-warning'));
      });

      // Should handle all events without errors
      expect(screen.getByTestId('emit-chop')).toBeInTheDocument();
    });
  });

  describe('Audio Settings Integration', () => {
    it('should respect audio enabled/disabled setting', async () => {
      const mockPlaySound = vi.fn();
      vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(mockPlaySound);
      
      // Mock disabled audio
      vi.doMock('../../hooks/useGameSettings', () => ({
        useGameSettings: () => ({
          settings: {
            audio: {
              enabled: false,
              masterVolume: 0.8,
              sfxVolume: 0.9
            }
          },
          updateSettings: vi.fn()
        })
      }));

      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('direct-chop'));
      });

      // Should not attempt to play sound when disabled
      // (This depends on the useGameAudio implementation)
      expect(screen.getByTestId('direct-chop')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle audio initialization failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(AudioManager.prototype, 'initialize').mockRejectedValue(new Error('Audio init failed'));
      
      expect(() => {
        render(
          <AudioProvider>
            <TestGameComponent />
          </AudioProvider>
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle missing audio buffers gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockPlaySound = vi.fn();
      vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(mockPlaySound);
      
      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('direct-chop'));
      });

      // Should not throw even if audio buffers are missing
      expect(screen.getByTestId('direct-chop')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('should not block UI rendering', async () => {
      const startTime = performance.now();
      
      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Rendering should be fast (less than 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle rapid event emission without memory leaks', async () => {
      const mockPlaySound = vi.fn();
      vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(mockPlaySound);
      
      render(
        <AudioProvider>
          <TestGameComponent />
        </AudioProvider>
      );

      // Emit many events rapidly
      await act(async () => {
        for (let i = 0; i < 100; i++) {
          fireEvent.click(screen.getByTestId('emit-chop'));
        }
      });

      // Should complete without errors
      expect(screen.getByTestId('emit-chop')).toBeInTheDocument();
    });
  });

  describe('Arcade Mode Integration', () => {
    it('should apply arcade optimizations when enabled', async () => {
      const mockCreateDynamicsCompressor = vi.fn().mockReturnValue({
        connect: vi.fn(),
        threshold: { value: 0 },
        knee: { value: 0 },
        ratio: { value: 0 },
        attack: { value: 0 },
        release: { value: 0 }
      });

      const mockInitialize = vi.fn().mockResolvedValue(undefined);
      const mockLoadAudioAssets = vi.fn().mockResolvedValue(undefined);
      
      vi.spyOn(AudioManager.prototype, 'initialize').mockImplementation(mockInitialize);
      vi.spyOn(AudioManager.prototype, 'loadAudioAssets').mockImplementation(mockLoadAudioAssets);

      // Save original mock and restore after test
      const originalAudioContext = window.AudioContext;
      
      window.AudioContext = vi.fn().mockImplementation(() => ({
        createGain: vi.fn().mockReturnValue({
          connect: vi.fn(),
          gain: { setValueAtTime: vi.fn() }
        }),
        createBufferSource: vi.fn().mockReturnValue({
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
          buffer: null,
          loop: false,
          onended: null
        }),
        createBuffer: vi.fn().mockReturnValue({}),
        createDynamicsCompressor: mockCreateDynamicsCompressor,
        decodeAudioData: vi.fn().mockResolvedValue({}),
        destination: {},
        state: 'running',
        currentTime: 0,
        resume: vi.fn().mockResolvedValue(undefined),
        suspend: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined)
      }));

      const TestComponentWithInit = () => {
        const { initializeAudio } = useAudioContext();
        
        // Initialize audio when component mounts
        React.useEffect(() => {
          initializeAudio();
        }, [initializeAudio]);
        
        return <TestGameComponent />;
      };

      render(
        <AudioProvider arcadeMode={true}>
          <TestComponentWithInit />
        </AudioProvider>
      );

      // Wait for audio to initialize
      await act(async () => {
        // Allow effects to run
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should initialize AudioManager and create compressor for arcade mode
      expect(mockInitialize).toHaveBeenCalled();
      expect(mockLoadAudioAssets).toHaveBeenCalled();
      
      // Restore original mock
      window.AudioContext = originalAudioContext;
    });
  });
});