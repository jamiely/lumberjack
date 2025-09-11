import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AudioManager } from './AudioManager.js';
import type { AudioState } from './types.js';
import { AUDIO_ASSETS } from './assets/audioAssets.js';

interface AudioContextType {
  audioManager: AudioManager | null;
  audioState: AudioState;
  initializeAudio: () => Promise<void>;
  isInitialized: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioManager] = useState(() => new AudioManager());
  const [audioState, setAudioState] = useState<AudioState>('uninitialized');
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAudio = useCallback(async () => {
    if (isInitialized || audioState === 'loading') {
      return;
    }

    try {
      setAudioState('loading');
      
      // Initialize the audio manager
      await audioManager.initialize();
      
      // Load audio assets
      await audioManager.loadAudioAssets(AUDIO_ASSETS);
      
      setAudioState('ready');
      setIsInitialized(true);
      console.log('Audio system initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize audio system:', error);
      setAudioState('error');
    }
  }, [audioManager, isInitialized, audioState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioManager.destroy();
    };
  }, [audioManager]);

  const contextValue: AudioContextType = {
    audioManager,
    audioState,
    initializeAudio,
    isInitialized
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};