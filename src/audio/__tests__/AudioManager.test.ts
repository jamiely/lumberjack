import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioManager } from '../AudioManager.js';
import type { AudioAsset } from '../types.js';

// Mock Web Audio API
const mockAudioContext = {
  state: 'running',
  currentTime: 0,
  createGain: vi.fn(),
  createBufferSource: vi.fn(),
  decodeAudioData: vi.fn(),
  suspend: vi.fn().mockResolvedValue(undefined),
  resume: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  destination: {}
};

const mockGainNode = {
  gain: {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn()
  },
  connect: vi.fn()
};

const mockBufferSource = {
  buffer: null,
  loop: false,
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  onended: null
};

const mockAudioBuffer = {
  duration: 1.0,
  numberOfChannels: 2,
  sampleRate: 44100
};

// Mock global fetch
global.fetch = vi.fn();

// Mock AudioContext constructor - need to reset this in each test
let audioContextMock = vi.fn(() => mockAudioContext);
// @ts-expect-error - Intentionally mocking AudioContext for testing
(global as unknown as { AudioContext: typeof AudioContext }).AudioContext = audioContextMock;
// @ts-expect-error - Intentionally mocking webkitAudioContext for testing
(global as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext = audioContextMock;

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mocks for each test
    mockAudioContext.createGain.mockReturnValue(mockGainNode);
    mockAudioContext.createBufferSource.mockReturnValue(mockBufferSource);
    mockAudioContext.decodeAudioData.mockResolvedValue(mockAudioBuffer);
    mockAudioContext.state = 'running';
    
    // Reset the AudioContext constructor
    audioContextMock = vi.fn(() => mockAudioContext);
    // @ts-expect-error - Intentionally mocking AudioContext for testing
    (global as unknown as { AudioContext: typeof AudioContext }).AudioContext = audioContextMock;
    // @ts-expect-error - Intentionally mocking webkitAudioContext for testing
    (global as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext = audioContextMock;
    
    audioManager = new AudioManager();
  });

  afterEach(() => {
    audioManager.destroy();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await audioManager.initialize();
      
      expect(audioManager.audioState).toBe('ready');
      expect(audioManager.isReady).toBe(true);
      expect(mockAudioContext.createGain).toHaveBeenCalled();
      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
    });

    it('should handle initialization error', async () => {
      const error = new Error('AudioContext failed');
      const failingAudioManager = new AudioManager();
      
      // Mock AudioContext to throw error
      (global as unknown as { AudioContext: typeof AudioContext }).AudioContext = vi.fn(() => {
        throw error;
      });

      await expect(failingAudioManager.initialize()).rejects.toThrow(error);
      expect(failingAudioManager.audioState).toBe('error');
      expect(failingAudioManager.isReady).toBe(false);
      
      failingAudioManager.destroy();
    });

    it('should handle suspended audio context', async () => {
      mockAudioContext.state = 'suspended';
      
      await audioManager.initialize();
      
      expect(audioManager.audioState).toBe('ready');
      expect(audioManager.contextState).toBe('suspended');
    });
  });

  describe('audio asset loading', () => {
    const mockAssets: AudioAsset[] = [
      { name: 'test1', url: './audio/test1.wav' },
      { name: 'test2', url: './audio/test2.wav' }
    ];

    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should load audio assets successfully', async () => {
      const mockArrayBuffer = new ArrayBuffer(1024);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(mockArrayBuffer)
      });

      await audioManager.loadAudioAssets(mockAssets);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith('./audio/test1.wav');
      expect(global.fetch).toHaveBeenCalledWith('./audio/test2.wav');
      expect(mockAudioContext.decodeAudioData).toHaveBeenCalledTimes(2);
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 404
      });

      // Should not throw even if assets fail to load
      await expect(audioManager.loadAudioAssets(mockAssets)).resolves.toBeUndefined();
    });

    it('should throw if not initialized', async () => {
      const uninitializedManager = new AudioManager();
      
      await expect(uninitializedManager.loadAudioAssets(mockAssets))
        .rejects.toThrow('AudioManager not initialized');
    });
  });

  describe('sound playback', () => {
    beforeEach(async () => {
      await audioManager.initialize();
      
      // Mock loaded buffer
      const mockAssets: AudioAsset[] = [{ name: 'test', url: './audio/test.wav' }];
      const mockArrayBuffer = new ArrayBuffer(1024);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(mockArrayBuffer)
      });
      
      await audioManager.loadAudioAssets(mockAssets);
    });

    it('should play sound with default options', () => {
      audioManager.playSound('test');

      expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
      expect(mockBufferSource.buffer).toBe(mockAudioBuffer);
      expect(mockBufferSource.loop).toBe(false);
      expect(mockBufferSource.connect).toHaveBeenCalledWith(mockGainNode);
      expect(mockGainNode.connect).toHaveBeenCalled();
      expect(mockBufferSource.start).toHaveBeenCalled();
    });

    it('should play sound with custom volume', () => {
      audioManager.playSound('test', { volume: 0.5 });

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
    });

    it('should play sound with loop enabled', () => {
      audioManager.playSound('test', { loop: true });

      expect(mockBufferSource.loop).toBe(true);
    });

    it('should handle fade in', () => {
      audioManager.playSound('test', { volume: 0.8, fadeIn: 0.5 });

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
      expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.8, 0.5);
    });

    it('should handle unknown sound name', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      audioManager.playSound('unknown');

      expect(consoleSpy).toHaveBeenCalledWith('Audio buffer not found: unknown');
      expect(mockAudioContext.createBufferSource).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle playback when not ready', () => {
      const uninitializedManager = new AudioManager();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      uninitializedManager.playSound('test');

      expect(consoleSpy).toHaveBeenCalledWith('AudioManager not ready for playback');
      
      consoleSpy.mockRestore();
    });
  });

  describe('volume control', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should set master volume', () => {
      audioManager.setMasterVolume(0.7);

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.7, 0);
    });

    it('should clamp volume between 0 and 1', () => {
      audioManager.setMasterVolume(1.5);
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(1, 0);

      audioManager.setMasterVolume(-0.5);
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    });

    it('should handle volume control when not initialized', () => {
      const uninitializedManager = new AudioManager();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      uninitializedManager.setMasterVolume(0.5);

      expect(consoleSpy).toHaveBeenCalledWith('AudioManager not initialized');
      
      consoleSpy.mockRestore();
    });
  });

  describe('context control', () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it('should suspend audio context', () => {
      audioManager.suspend();

      expect(mockAudioContext.suspend).toHaveBeenCalled();
    });

    it('should resume audio context', () => {
      mockAudioContext.state = 'suspended';
      audioManager.resume();

      expect(mockAudioContext.resume).toHaveBeenCalled();
    });

    it('should not resume if context is running', () => {
      mockAudioContext.state = 'running';
      audioManager.resume();

      expect(mockAudioContext.resume).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should destroy resources properly', async () => {
      await audioManager.initialize();
      
      audioManager.destroy();

      expect(mockAudioContext.close).toHaveBeenCalled();
      expect(audioManager.audioState).toBe('uninitialized');
      expect(audioManager.isReady).toBe(false);
      expect(audioManager.contextState).toBe(null);
    });
  });
});