// Core audio system exports
export { AudioManager } from './AudioManager.js';
export { AudioProvider, useAudioContext } from './AudioContext.js';

// Hooks
export { useAudioManager } from './hooks/useAudioManager.js';
export { useGameAudio } from './hooks/useGameAudio.js';

// Types
export type { AudioAsset, PlaySoundOptions, AudioState } from './types.js';

// Assets
export { AUDIO_ASSETS } from './assets/audioAssets.js';