import { useAudioContext } from '../AudioContext.js';

export const useAudioManager = () => {
  const { audioManager, audioState, initializeAudio, isInitialized } = useAudioContext();

  return {
    audioManager,
    audioState,
    initializeAudio,
    isInitialized,
    isReady: audioManager?.isReady ?? false,
    contextState: audioManager?.contextState ?? null
  };
};