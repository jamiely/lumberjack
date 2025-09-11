/**
 * Arcade-specific audio configuration and calibration settings
 * Optimized for arcade cabinet speakers and noisy environments
 */

export interface ArcadeAudioConfig {
  masterVolume: number;           // Higher for noisy environment
  compressionRatio: number;       // Compress dynamic range
  highFrequencyBoost: number;     // Enhance clarity
  lowLatencyMode: boolean;        // Minimize delay
  maxConcurrentSounds: number;    // Prevent audio overload
  bufferSize: number;            // Lower for reduced latency
  sampleRate: number;            // Optimized for arcade hardware
}

export const ARCADE_AUDIO_CONFIG: ArcadeAudioConfig = {
  masterVolume: 0.9,           // Higher for noisy environment
  compressionRatio: 3.0,       // Compress dynamic range for consistent volume
  highFrequencyBoost: 1.2,     // Enhance clarity in noisy environment
  lowLatencyMode: true,        // Minimize delay for responsive gameplay
  maxConcurrentSounds: 8,      // Prevent audio overload and maintain performance
  bufferSize: 256,             // Lower buffer size for reduced latency
  sampleRate: 44100            // Standard rate for good quality/performance balance
};

export const ARCADE_PERFORMANCE_CONFIG = {
  // Memory management
  maxAudioBuffers: 20,         // Limit memory usage
  bufferCleanupInterval: 30000, // Clean up unused buffers every 30s
  
  // CPU optimization
  useObjectPooling: true,      // Reuse audio nodes
  maxSourceNodes: 16,          // Limit concurrent source nodes
  
  // Quality vs Performance
  audioQuality: 'balanced' as 'low' | 'balanced' | 'high',
  enableAudioWorklets: false,  // Disable for compatibility
  
  // Latency optimization
  enableLowLatency: true,
  targetLatency: 20,           // Target 20ms latency
  
  // Error handling
  enableFallbacks: true,
  silentMode: false            // Don't fall back to silent mode in arcade
};

/**
 * Apply arcade-specific optimizations to AudioContext
 */
export function applyArcadeOptimizations(context: AudioContext): {
  compressor?: DynamicsCompressorNode;
  limiter?: DynamicsCompressorNode;
} {
  try {
    // Create compressor for dynamic range control
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -24;    // Start compression at -24dB
    compressor.knee.value = 30;          // Smooth compression curve
    compressor.ratio.value = ARCADE_AUDIO_CONFIG.compressionRatio;
    compressor.attack.value = 0.003;     // Fast attack for responsive compression
    compressor.release.value = 0.25;     // Medium release for natural sound
    
    // Create limiter to prevent clipping
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -6;        // Hard limit at -6dB
    limiter.knee.value = 0;              // Hard knee for limiting
    limiter.ratio.value = 20;            // Very high ratio for limiting
    limiter.attack.value = 0.001;        // Very fast attack
    limiter.release.value = 0.1;         // Fast release
    
    return { compressor, limiter };
  } catch (error) {
    console.warn('Failed to apply arcade audio optimizations:', error);
    return {};
  }
}

/**
 * Create optimized gain node with frequency shaping for arcade environment
 */
export function createArcadeGainNode(context: AudioContext): GainNode {
  const gainNode = context.createGain();
  
  try {
    // Apply high-frequency boost for clarity in noisy environment
    const filter = context.createBiquadFilter();
    filter.type = 'highshelf';
    filter.frequency.value = 2000;      // Boost frequencies above 2kHz
    filter.gain.value = ARCADE_AUDIO_CONFIG.highFrequencyBoost;
    
    // Connect filter to gain node
    filter.connect(gainNode);
    
    return gainNode;
  } catch (error) {
    console.warn('Failed to create arcade gain node with filtering:', error);
    return gainNode;
  }
}

/**
 * Performance monitoring for arcade audio system
 */
export class ArcadeAudioMonitor {
  private static instance: ArcadeAudioMonitor;
  private metrics = {
    activeSources: 0,
    peakConcurrentSounds: 0,
    averageLatency: 0,
    droppedSounds: 0,
    memoryUsage: 0
  };

  static getInstance(): ArcadeAudioMonitor {
    if (!this.instance) {
      this.instance = new ArcadeAudioMonitor();
    }
    return this.instance;
  }

  trackSourceActivated(): void {
    this.metrics.activeSources++;
    this.metrics.peakConcurrentSounds = Math.max(
      this.metrics.peakConcurrentSounds,
      this.metrics.activeSources
    );
  }

  trackSourceDeactivated(): void {
    this.metrics.activeSources = Math.max(0, this.metrics.activeSources - 1);
  }

  trackDroppedSound(): void {
    this.metrics.droppedSounds++;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      activeSources: 0,
      peakConcurrentSounds: 0,
      averageLatency: 0,
      droppedSounds: 0,
      memoryUsage: 0
    };
  }
}

/**
 * Arcade-specific audio presets
 */
export const ARCADE_PRESETS = {
  quiet: {
    ...ARCADE_AUDIO_CONFIG,
    masterVolume: 0.6,
    compressionRatio: 2.0
  },
  normal: ARCADE_AUDIO_CONFIG,
  loud: {
    ...ARCADE_AUDIO_CONFIG,
    masterVolume: 1.0,
    compressionRatio: 4.0,
    highFrequencyBoost: 1.5
  }
} as const;