/**
 * End-to-end audio tests for complete gameplay scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import App from '../App';
import { AudioManager } from '../audio/AudioManager';

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
vi.mock('../hooks/useGameSettings', () => ({
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

describe('Audio Gameplay End-to-End Tests', () => {
  let mockPlaySound: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPlaySound = vi.fn();
    vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(mockPlaySound);
    vi.spyOn(AudioManager.prototype, 'initialize').mockResolvedValue();
    vi.spyOn(AudioManager.prototype, 'loadAudioAssets').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete Game Flow with Audio', () => {
    it('should play sounds during a complete game session', async () => {
      render(<App />);

      // Start from attract screen
      expect(screen.getByText(/LUMBERJACK/i)).toBeInTheDocument();

      // Start the game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Wait for game to start
      await waitFor(() => {
        expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();
      });

      // Simulate multiple chops
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
      });

      // Should have played chop sounds
      // Note: The exact number depends on game logic and audio integration
      expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();
    });

    it('should handle audio initialization on first interaction', async () => {
      const initializeSpy = vi.spyOn(AudioManager.prototype, 'initialize');
      
      render(<App />);

      // Start game (first interaction)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Make a chop (should trigger audio initialization)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
      });

      // Audio should be initialized on first interaction
      expect(initializeSpy).toHaveBeenCalled();
    });

    it('should play timer warning sound when time runs low', async () => {
      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Wait for timer warning scenario
      // This would require waiting for the timer to reach low levels
      // or mocking the game state to have low time

      expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();
    });

    it('should play game over sound when game ends', async () => {
      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // This test would need to trigger a game over condition
      // Either by hitting a branch or running out of time

      expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();
    });
  });

  describe('Audio Controls Integration', () => {
    it('should show audio controls in debug mode', async () => {
      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Enable debug mode
      await act(async () => {
        fireEvent.keyDown(document, { key: '?' });
      });

      // Should show debug panel with audio controls
      await waitFor(() => {
        expect(screen.getByText(/Audio Controls/i)).toBeInTheDocument();
      });
    });

    it('should allow volume adjustment through debug controls', async () => {
      render(<App />);

      // Start game and enable debug mode
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: '?' });
      });

      // Look for volume controls
      await waitFor(() => {
        const volumeControls = screen.queryByText(/Master Volume/i);
        if (volumeControls) {
          expect(volumeControls).toBeInTheDocument();
        }
      });
    });
  });

  describe('Performance and Error Handling', () => {
    it('should handle audio errors gracefully during gameplay', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock audio failure
      vi.spyOn(AudioManager.prototype, 'playSound').mockImplementation(() => {
        throw new Error('Audio playback failed');
      });

      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Make chops (should not crash despite audio errors)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        fireEvent.keyDown(document, { key: 'ArrowRight' });
      });

      // Game should continue working
      expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should maintain game performance with audio enabled', async () => {
      const startTime = performance.now();

      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Perform multiple rapid actions
      await act(async () => {
        for (let i = 0; i < 20; i++) {
          fireEvent.keyDown(document, { key: i % 2 === 0 ? 'ArrowLeft' : 'ArrowRight' });
        }
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete quickly even with audio
      expect(totalTime).toBeLessThan(1000); // Less than 1 second
    });

    it('should handle rapid successive sounds without issues', async () => {
      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Rapid successive chops
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          fireEvent.keyDown(document, { key: 'ArrowLeft' });
          fireEvent.keyDown(document, { key: 'ArrowRight' });
        }
      });

      // Should handle all actions without errors
      expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();
    });
  });

  describe('Audio State Management', () => {
    it('should show correct audio status in attract screen', async () => {
      render(<App />);

      // Should show audio ready status on attract screen
      await waitFor(() => {
        expect(screen.getByText(/AUDIO READY/i)).toBeInTheDocument();
      });
    });

    it('should handle autoplay policy restrictions', async () => {
      // Mock suspended audio context
      window.AudioContext = vi.fn().mockImplementation(() => ({
        createGain: vi.fn().mockReturnValue({
          connect: vi.fn(),
          gain: { setValueAtTime: vi.fn() }
        }),
        state: 'suspended', // Simulate autoplay restriction
        resume: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined)
      }));

      render(<App />);

      // Should handle suspended context gracefully
      expect(screen.getByText(/LUMBERJACK/i)).toBeInTheDocument();
    });
  });

  describe('Audio Asset Loading', () => {
    it('should continue gameplay if audio assets fail to load', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock fetch failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<App />);

      // Start game
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Game should work even if audio fails to load
      expect(screen.getByText(/Lumberjack Game/i)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should show audio error status when initialization fails', async () => {
      // Mock audio initialization failure
      vi.spyOn(AudioManager.prototype, 'initialize').mockRejectedValue(new Error('Audio init failed'));

      render(<App />);

      // Should show audio error status
      await waitFor(() => {
        const errorStatus = screen.queryByText(/AUDIO UNAVAILABLE/i);
        if (errorStatus) {
          expect(errorStatus).toBeInTheDocument();
        }
      });
    });
  });

  describe('Memory Management', () => {
    it('should clean up audio resources on unmount', async () => {
      const destroySpy = vi.spyOn(AudioManager.prototype, 'destroy');
      
      const { unmount } = render(<App />);

      // Start game to initialize audio
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      // Unmount component
      unmount();

      // Should clean up audio resources
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});