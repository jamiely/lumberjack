import type { AudioAsset, PlaySoundOptions, AudioState } from './types.js';
import { ARCADE_PERFORMANCE_CONFIG, applyArcadeOptimizations, ArcadeAudioMonitor } from './ArcadeAudioCalibration.js';

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private state: AudioState = 'uninitialized';
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private autoplayBlocked: boolean = false;
  private arcadeMode: boolean = false;
  private compressor: DynamicsCompressorNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private monitor: ArcadeAudioMonitor;

  constructor(options: { arcadeMode?: boolean } = {}) {
    this.arcadeMode = options.arcadeMode ?? false;
    this.monitor = ArcadeAudioMonitor.getInstance();
  }

  async initialize(): Promise<void> {
    try {
      this.state = 'loading';
      
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.context = new AudioContextClass();
      
      // Create master gain node for volume control
      this.masterGain = this.context.createGain();
      
      // Apply arcade optimizations if enabled
      if (this.arcadeMode) {
        const { compressor, limiter } = applyArcadeOptimizations(this.context);
        this.compressor = compressor || null;
        this.limiter = limiter || null;
        
        if (compressor && limiter) {
          // Audio chain: masterGain -> compressor -> limiter -> destination
          this.masterGain.connect(compressor);
          compressor.connect(limiter);
          limiter.connect(this.context.destination);
        } else {
          this.masterGain.connect(this.context.destination);
        }
      } else {
        this.masterGain.connect(this.context.destination);
      }
      
      // Handle autoplay policy - context may start suspended
      if (this.context.state === 'suspended') {
        this.autoplayBlocked = true;
        console.log('AudioContext suspended due to autoplay policy - will resume on user interaction');
      } else {
        console.log('AudioContext created successfully in running state');
      }
      
      this.state = 'ready';
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
      this.state = 'error';
      throw error;
    }
  }

  async loadAudioAssets(assets: AudioAsset[]): Promise<void> {
    if (!this.context) {
      throw new Error('AudioManager not initialized');
    }

    const loadPromises = assets.map(async (asset) => {
      try {
        const response = await fetch(asset.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio asset: ${asset.url}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context!.decodeAudioData(arrayBuffer);
        
        this.buffers.set(asset.name, audioBuffer);
        console.log(`Loaded audio asset: ${asset.name}`);
      } catch (error) {
        console.error(`Failed to load audio asset ${asset.name}:`, error);
        // Continue loading other assets even if one fails
      }
    });

    await Promise.allSettled(loadPromises);
  }

  playSound(name: string, options: PlaySoundOptions = {}): void {
    if (!this.context || !this.masterGain || this.state !== 'ready') {
      console.warn('AudioManager not ready for playback');
      return;
    }

    // Performance optimization: limit concurrent sounds in arcade mode
    if (this.arcadeMode && this.activeSources.size >= ARCADE_PERFORMANCE_CONFIG.maxSourceNodes) {
      console.warn(`Maximum concurrent sounds reached (${ARCADE_PERFORMANCE_CONFIG.maxSourceNodes}), dropping sound: ${name}`);
      this.monitor.trackDroppedSound();
      return;
    }

    // Resume context if suspended (handles autoplay policy)
    if (this.context.state === 'suspended') {
      this.context.resume().then(() => {
        this.autoplayBlocked = false;
        console.log('AudioContext resumed successfully');
      }).catch(error => {
        console.error('Failed to resume audio context:', error);
        this.autoplayBlocked = true;
      });
    }

    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Audio buffer not found: ${name}`);
      return;
    }

    try {
      // Create source node
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      
      // Create gain node for this sound
      const gainNode = this.context.createGain();
      const volume = options.volume ?? 1.0;
      gainNode.gain.setValueAtTime(volume, this.context.currentTime);
      
      // Handle fade in
      if (options.fadeIn && options.fadeIn > 0) {
        gainNode.gain.setValueAtTime(0, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + options.fadeIn);
      }
      
      // Set loop
      source.loop = options.loop ?? false;
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // Track active source
      this.activeSources.add(source);
      this.monitor.trackSourceActivated();
      
      // Clean up when sound ends
      source.onended = () => {
        this.activeSources.delete(source);
        this.monitor.trackSourceDeactivated();
      };
      
      // Start playback
      source.start();
      
    } catch (error) {
      console.error(`Failed to play sound ${name}:`, error);
    }
  }

  setMasterVolume(volume: number): void {
    if (!this.masterGain) {
      console.warn('AudioManager not initialized');
      return;
    }
    
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.setValueAtTime(clampedVolume, this.context!.currentTime);
  }

  suspend(): void {
    if (this.context && this.context.state === 'running') {
      this.context.suspend().catch(error => {
        console.error('Failed to suspend audio context:', error);
      });
    }
  }

  resume(): void {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume().catch(error => {
        console.error('Failed to resume audio context:', error);
      });
    }
  }

  destroy(): void {
    // Stop all active sources
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch {
        // Source may already be stopped
      }
    });
    this.activeSources.clear();
    
    // Close audio context
    if (this.context) {
      this.context.close().catch(error => {
        console.error('Failed to close audio context:', error);
      });
    }
    
    // Clear references
    this.context = null;
    this.masterGain = null;
    this.buffers.clear();
    this.state = 'uninitialized';
  }

  get audioState(): AudioState {
    return this.state;
  }

  get isReady(): boolean {
    return this.state === 'ready' && this.context !== null;
  }

  get contextState(): string | null {
    return this.context?.state ?? null;
  }

  get isAutoplayBlocked(): boolean {
    return this.autoplayBlocked || this.context?.state === 'suspended';
  }

  getPerformanceMetrics() {
    return this.monitor.getMetrics();
  }

  get isArcadeMode(): boolean {
    return this.arcadeMode;
  }

  get hasCompressor(): boolean {
    return this.compressor !== null;
  }

  get hasLimiter(): boolean {
    return this.limiter !== null;
  }

  // Try to detect autoplay policy without user interaction
  static async detectAutoplayPolicy(): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Create temporary context to test autoplay policy
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const testContext = new AudioContextClass();
      
      if (testContext.state === 'suspended') {
        testContext.close();
        return { allowed: false, reason: 'AudioContext starts suspended' };
      }
      
      // Try to play a silent buffer to test
      const buffer = testContext.createBuffer(1, 1, 22050);
      const source = testContext.createBufferSource();
      source.buffer = buffer;
      source.connect(testContext.destination);
      source.start();
      
      testContext.close();
      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: `AudioContext creation failed: ${error}` };
    }
  }
}