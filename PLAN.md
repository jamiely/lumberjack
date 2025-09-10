# Audio Implementation Plan for Timberman Arcade Game

This document provides a concrete, step-by-step implementation plan for adding audio to the Timberman arcade game based on the research in RESEARCH.md.

## Overview

The plan is divided into four phases:
1. **Phase -1**: Timer system implementation (prerequisite)
2. **Phase 0**: Architecture refactoring (prerequisites)
3. **Phase 1**: Core audio system implementation
4. **Phase 2**: Game integration and arcade optimization

## Phase -1: Timer System Implementation (Prerequisite)

**Context:** The current codebase lacks the timer system specified in GAME_DESIGN.md, which is required for timer warning audio events.

### -1.1: Add Timer to GameState

**Files to Modify:**
- `src/game/GameState.ts` - Add timer properties to interface and initial state

**Implementation Details:**

#### Update GameState Interface
```typescript
export interface GameState {
  playerSide: 'left' | 'right'
  score: number
  gameOver: boolean
  showDebug: boolean
  treeSegments: TreeSegment[]
  animatedSegments: AnimatedSegment[]
  // New timer properties
  timeRemaining: number        // Time left in seconds
  maxTime: number             // Maximum time (for timer bar display)
}
```

#### Update Initial State
```typescript
export const createInitialGameState = (): GameState => ({
  playerSide: 'left',
  score: 0,
  gameOver: false,
  showDebug: false,
  treeSegments: [/* existing segments */],
  animatedSegments: [],
  // Timer initialization
  timeRemaining: 10.0,    // Start with 10 seconds
  maxTime: 10.0
})
```

### -1.2: Implement Timer Logic

**Files to Modify:**
- `src/game/GameLogic.ts` - Add timer countdown and extension logic

**Implementation Details:**

#### Add Timer Update Function
```typescript
export const updateTimer = (
  gameState: GameState, 
  deltaTime: number
): GameState => {
  if (gameState.gameOver) {
    return gameState
  }

  const newTimeRemaining = Math.max(0, gameState.timeRemaining - deltaTime)
  
  // Game over if timer expires
  if (newTimeRemaining <= 0) {
    return {
      ...gameState,
      timeRemaining: 0,
      gameOver: true
    }
  }

  return {
    ...gameState,
    timeRemaining: newTimeRemaining
  }
}
```

#### Modify performChop to Extend Timer
```typescript
export const performChop = (
  gameState: GameState, 
  side: 'left' | 'right'
): GameState => {
  // ... existing collision logic ...

  if (collision) {
    return {
      ...gameState,
      gameOver: true
    }
  }

  // ... existing chop logic ...

  return {
    ...gameState,
    playerSide: side,
    score: gameState.score + 1,
    treeSegments: addNewSegmentToTree(gameState.treeSegments),
    animatedSegments: [...gameState.animatedSegments, animatedSegment],
    // Add timer extension
    timeRemaining: Math.min(gameState.maxTime, gameState.timeRemaining + 1.5) // Add 1.5 seconds per chop
  }
}
```

### -1.3: Add Timer to Game Loop

**Files to Modify:**
- `src/hooks/useGameState.ts` - Add timer update logic

**Implementation Details:**

#### Add Timer Update Hook
```typescript
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())
  
  // Add timer update effect
  useEffect(() => {
    if (gameState.gameOver) return

    const interval = setInterval(() => {
      setGameState(current => updateTimer(current, 0.1)) // Update every 100ms
    }, 100)

    return () => clearInterval(interval)
  }, [gameState.gameOver])

  // ... rest of existing logic ...
}
```

### -1.4: Add Timer UI Components

**Files to Create:**
- `src/components/TimerBar.tsx` - Timer progress bar component

**Files to Modify:**
- `src/components/scenes/PlayScreen.tsx` - Add timer bar to play screen

**Implementation Details:**

#### Timer Bar Component
```typescript
interface TimerBarProps {
  timeRemaining: number
  maxTime: number
}

export const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining, maxTime }) => {
  const percentage = (timeRemaining / maxTime) * 100
  const isLow = timeRemaining < 3 // Warning threshold
  
  return (
    <div style={{
      width: '100%',
      height: '20px',
      backgroundColor: '#333',
      border: '2px solid #fff'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: isLow ? '#ff4444' : '#44ff44',
        transition: 'width 0.1s ease-out'
      }} />
    </div>
  )
}
```

**Quality Gate:** Timer system fully functional, all tests pass (`npm run check`)

## Phase 0: Architecture Refactoring (Prerequisites)

### 0.1: Create Game Event System

**Files to Create:**
- `src/game/GameEvents.ts` - Event types and emitter
- `src/hooks/useGameEvents.ts` - React hook for event handling

**Files to Modify:**
- `src/game/GameLogic.ts` - Add event emission to game functions
- `src/hooks/useGameState.ts` - Integrate event system

**Implementation Details:**

#### `src/game/GameEvents.ts`
```typescript
export type GameEventType = 'chop' | 'hit' | 'gameOver' | 'timerWarning';

export interface GameEvent {
  type: GameEventType;
  timestamp: number;
  data?: any;
}

export type GameEventHandler = (event: GameEvent) => void;

export class GameEventEmitter {
  private listeners: Map<GameEventType, GameEventHandler[]> = new Map();
  
  on(eventType: GameEventType, handler: GameEventHandler): void;
  off(eventType: GameEventType, handler: GameEventHandler): void;
  emit(eventType: GameEventType, data?: any): void;
}

export const gameEvents = new GameEventEmitter();
```

#### `src/hooks/useGameEvents.ts`
```typescript
export const useGameEvents = () => {
  const subscribe = useCallback((eventType: GameEventType, handler: GameEventHandler) => {
    gameEvents.on(eventType, handler);
    return () => gameEvents.off(eventType, handler);
  }, []);
  
  return { subscribe };
};
```

#### Modify `src/game/GameLogic.ts`
- Add `gameEvents.emit('chop')` in `performChop` function after successful chop
- Add `gameEvents.emit('hit')` in collision detection when collision occurs
- Add `gameEvents.emit('gameOver')` when game ends (collision or timer expiry)
- Add `gameEvents.emit('timerWarning')` in `updateTimer` when timeRemaining < 3 seconds

### 0.2: Create Settings Management System

**Files to Create:**
- `src/game/GameSettings.ts` - Settings interface and defaults
- `src/hooks/useGameSettings.ts` - React hook for settings

**Implementation Details:**

#### `src/game/GameSettings.ts`
```typescript
export interface AudioSettings {
  enabled: boolean;
  masterVolume: number; // 0.0 to 1.0
  sfxVolume: number;    // 0.0 to 1.0
}

export interface GameSettings {
  audio: AudioSettings;
  freePlay: boolean;
}

export const defaultSettings: GameSettings = {
  audio: {
    enabled: true,
    masterVolume: 0.8,
    sfxVolume: 1.0
  },
  freePlay: true
};
```

#### `src/hooks/useGameSettings.ts`
```typescript
export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  const updateAudioSettings = useCallback((audioSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({
      ...prev,
      audio: { ...prev.audio, ...audioSettings }
    }));
  }, []);
  
  return { settings, updateAudioSettings };
};
```

### 0.3: Refactor Hook Architecture

**Files to Modify:**
- `src/hooks/useGameState.ts` - Remove event handling, focus on state
- `src/App.tsx` - Update to use new hook structure

**Changes:**
- Move event handling from `useGameState` to separate hooks
- Keep `useGameState` focused on core game state management
- Create composition pattern for combining hooks

**Quality Gate:** All tests pass (`npm run check`)

**Milestone:** Commit refactored architecture and pause for manual intervention before proceeding to Phase 1

## Phase 1: Core Audio System Implementation

### 1.1: Create AudioManager Class

**Files to Create:**
- `src/audio/AudioManager.ts` - Core Web Audio API implementation
- `src/audio/types.ts` - Audio-related TypeScript interfaces

**Implementation Details:**

#### `src/audio/types.ts`
```typescript
export interface AudioAsset {
  name: string;
  url: string;
  buffer?: AudioBuffer;
}

export interface PlaySoundOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: number;
}

export type AudioState = 'uninitialized' | 'loading' | 'ready' | 'error';
```

#### `src/audio/AudioManager.ts`
```typescript
export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private state: AudioState = 'uninitialized';
  
  // Core methods
  async initialize(): Promise<void>;
  async loadAudioAssets(assets: AudioAsset[]): Promise<void>;
  playSound(name: string, options?: PlaySoundOptions): void;
  setMasterVolume(volume: number): void;
  suspend(): void;
  resume(): void;
  destroy(): void;
  
  // Getters
  get audioState(): AudioState;
  get isReady(): boolean;
}
```

**Specific Implementation Requirements:**
- Handle browser autoplay policies
- Implement graceful fallbacks for audio failures
- Support multiple simultaneous sounds
- Optimize for low latency (< 20ms for chop sound)

### 1.2: Create Audio Assets Structure

**Directories to Create:**
- `public/audio/` - Audio asset files
- `src/audio/assets/` - Audio asset definitions

**Files to Create:**
- `src/audio/assets/audioAssets.ts` - Asset definitions
- `public/audio/chop.wav` - Placeholder or actual audio file
- `public/audio/branch-hit.wav` - Placeholder or actual audio file
- `public/audio/game-over.wav` - Placeholder or actual audio file
- `public/audio/timer-warning.wav` - Placeholder or actual audio file

#### `src/audio/assets/audioAssets.ts`
```typescript
export const AUDIO_ASSETS: AudioAsset[] = [
  { name: 'chop', url: '/audio/chop.wav' },
  { name: 'hit', url: '/audio/branch-hit.wav' },
  { name: 'gameOver', url: '/audio/game-over.wav' },
  { name: 'timerWarning', url: '/audio/timer-warning.wav' }
];
```

### 1.3: Create React Audio Context

**Files to Create:**
- `src/audio/AudioContext.tsx` - React context provider
- `src/audio/hooks/useAudioManager.ts` - Hook for accessing audio manager
- `src/audio/hooks/useGameAudio.ts` - Game-specific audio hooks

**Implementation Details:**

#### `src/audio/AudioContext.tsx`
```typescript
interface AudioContextType {
  audioManager: AudioManager | null;
  audioState: AudioState;
  initializeAudio: () => Promise<void>;
}

export const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioManager] = useState(() => new AudioManager());
  const [audioState, setAudioState] = useState<AudioState>('uninitialized');
  
  const initializeAudio = useCallback(async () => {
    // Implementation
  }, [audioManager]);
  
  return (
    <AudioContext.Provider value={{ audioManager, audioState, initializeAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
```

#### `src/audio/hooks/useGameAudio.ts`
```typescript
export const useGameAudio = () => {
  const { audioManager } = useAudioContext();
  const { settings } = useGameSettings();
  
  const playChopSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('chop', { volume: settings.audio.sfxVolume * 0.8 });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume]);
  
  const playHitSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('hit', { volume: settings.audio.sfxVolume });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume]);
  
  const playGameOverSound = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('gameOver', { volume: settings.audio.sfxVolume });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume]);
  
  const playTimerWarning = useCallback(() => {
    if (settings.audio.enabled && audioManager?.isReady) {
      audioManager.playSound('timerWarning', { volume: settings.audio.sfxVolume * 0.6 });
    }
  }, [audioManager, settings.audio.enabled, settings.audio.sfxVolume]);
  
  return { playChopSound, playHitSound, playGameOverSound, playTimerWarning };
};
```

### 1.4: Basic Audio Testing

**Files to Create:**
- `src/audio/__tests__/AudioManager.test.ts` - Unit tests for AudioManager
- `src/audio/__tests__/useGameAudio.test.ts` - Hook tests

**Test Coverage:**
- AudioManager initialization
- Audio asset loading
- Sound playback functionality
- Volume control
- Error handling and fallbacks
- React hook behavior

**Quality Gate:** All tests pass (`npm run check`)

## Phase 2: Game Integration and Optimization

### 2.1: Integrate Audio with Game Events

**Files to Modify:**
- `src/App.tsx` - Add AudioProvider wrapper
- `src/hooks/useGameState.ts` - Add audio event subscriptions
- `src/components/scenes/PlayScreen.tsx` - Add audio initialization on first interaction

**Implementation Steps:**
1. Wrap App with AudioProvider
2. Subscribe to game events in a dedicated hook
3. Trigger audio initialization on first button press (required by browsers)
4. Connect game events to appropriate audio calls

#### Audio Event Integration Hook
```typescript
const useAudioEventHandlers = () => {
  const { subscribe } = useGameEvents();
  const { playChopSound, playHitSound, playGameOverSound, playTimerWarning } = useGameAudio();
  
  useEffect(() => {
    const unsubscribeChop = subscribe('chop', playChopSound);
    const unsubscribeHit = subscribe('hit', playHitSound);
    const unsubscribeGameOver = subscribe('gameOver', playGameOverSound);
    const unsubscribeTimer = subscribe('timerWarning', playTimerWarning);
    
    return () => {
      unsubscribeChop();
      unsubscribeHit();
      unsubscribeGameOver();
      unsubscribeTimer();
    };
  }, [subscribe, playChopSound, playHitSound, playGameOverSound, playTimerWarning]);
};
```

### 2.2: Add Audio Controls UI

**Files to Create:**
- `src/components/AudioControls.tsx` - Volume and mute controls

**Files to Modify:**
- `src/components/DebugPanel.tsx` - Add audio controls to debug panel
- `src/components/scenes/AttractScreen.tsx` - Add audio enable prompt

**Implementation Details:**
- Master volume slider (0-100%)
- SFX volume slider (0-100%)
- Audio enable/disable toggle
- Visual feedback for audio state
- Arcade-friendly large controls

### 2.3: Browser Compatibility and Autoplay Handling

**Files to Modify:**
- `src/audio/AudioManager.ts` - Add autoplay policy handling
- `src/components/scenes/AttractScreen.tsx` - Add "tap to enable audio" prompt

**Implementation Requirements:**
- Detect autoplay policy restrictions
- Show clear user prompt for audio enablement
- Handle audio context suspension/resume
- Graceful fallback when audio fails

### 2.4: Performance Optimization

**Optimization Areas:**
1. **Memory Management:**
   - Implement audio buffer cleanup
   - Monitor memory usage during long sessions
   - Reuse AudioBuffer instances

2. **CPU Usage:**
   - Minimize audio processing overhead
   - Optimize event handler efficiency
   - Use object pooling for frequent audio calls

3. **Latency Optimization:**
   - Pre-warm audio context
   - Minimize processing in audio playback path
   - Use high-priority scheduling for critical sounds

### 2.5: Arcade Environment Calibration

**Files to Create:**
- `src/audio/ArcadeAudioCalibration.ts` - Arcade-specific audio settings

**Calibration Requirements:**
- Volume levels optimized for arcade cabinet speakers
- Frequency response adjustment for speaker system
- Dynamic range compression for noisy environment
- Audio quality settings for cabinet hardware

**Implementation:**
```typescript
export const ARCADE_AUDIO_CONFIG = {
  masterVolume: 0.9,           // Higher for noisy environment
  compressionRatio: 3.0,       // Compress dynamic range
  highFrequencyBoost: 1.2,     // Enhance clarity
  lowLatencyMode: true         // Minimize delay
};
```

### 2.6: Error Handling and Fallbacks

**Error Scenarios to Handle:**
1. Audio context creation failure
2. Network issues during asset loading
3. Unsupported audio formats
4. Audio device unavailable
5. Browser restrictions

**Fallback Strategy:**
- Silent mode with visual feedback only
- Retry mechanisms for network failures
- Progressive audio quality degradation
- User notification of audio issues

### 2.7: Testing and Quality Assurance

**Files to Create:**
- `src/audio/__tests__/AudioIntegration.test.tsx` - Integration tests
- `src/__tests__/AudioGameplay.test.tsx` - End-to-end audio tests

**Testing Requirements:**
1. **Functional Tests:**
   - Audio plays on correct game events
   - Volume controls work properly
   - Enable/disable functionality
   - Settings persistence

2. **Performance Tests:**
   - Audio latency measurements (< 20ms for chop)
   - Memory usage during extended gameplay
   - CPU usage impact assessment

3. **Integration Tests:**
   - Audio synchronization with game events
   - Multiple simultaneous sounds
   - Game state transitions with audio

4. **Browser Tests:**
   - Chrome kiosk mode compatibility
   - Autoplay policy handling
   - Audio context lifecycle

**Quality Gate:** All tests pass (`npm run check`), performance benchmarks met

## Implementation Timeline

### Sprint 0 (Phase -1): Timer System Implementation
- **Days 1-2**: Add timer to GameState and GameLogic
- **Day 3**: Implement timer update loop and game integration
- **Day 4**: Add timer UI components and testing
- **Day 5**: Timer system quality gate and commit

### Sprint 1 (Phase 0): Architecture Refactoring
- **Days 6-7**: Create game event system
- **Day 8**: Create settings management
- **Day 9**: Refactor hook architecture
- **Day 10**: Testing and quality gate
- **Milestone**: Commit refactored architecture and pause for manual intervention

### Sprint 2 (Phase 1): Core Audio System
- **Days 11-12**: Implement AudioManager class
- **Day 13**: Create audio asset structure
- **Day 14**: Build React audio context
- **Day 15**: Audio system testing

### Sprint 3 (Phase 2): Integration and Optimization
- **Days 16-17**: Game event integration
- **Day 18**: Audio controls UI
- **Day 19**: Browser compatibility
- **Day 20**: Performance optimization and arcade calibration

## Risk Mitigation

### Technical Risks
1. **Browser Autoplay Restrictions:**
   - Mitigation: Clear user interaction prompts, graceful fallbacks

2. **Audio Latency Issues:**
   - Mitigation: Web Audio API optimization, pre-warming techniques

3. **Performance Impact:**
   - Mitigation: Profiling, memory management, efficient event handling

### Implementation Risks
1. **Complex Refactoring:**
   - Mitigation: Incremental changes, comprehensive testing

2. **Integration Conflicts:**
   - Mitigation: Feature flags, isolated development, thorough testing

## Success Criteria

### Functional Requirements
- ✅ All four required sounds play correctly (chop, hit, gameOver, timerWarning)
- ✅ Audio latency < 20ms for chop sound
- ✅ Volume controls work properly
- ✅ Audio enable/disable functionality
- ✅ Graceful fallbacks when audio unavailable

### Performance Requirements
- ✅ No frame rate impact (maintain 60fps)
- ✅ Memory usage stable during long sessions
- ✅ CPU usage impact < 5%

### Quality Requirements
- ✅ All tests pass (`npm run check`)
- ✅ Compatible with Chrome kiosk mode
- ✅ Arcade environment testing successful

This plan provides concrete implementation steps with specific file changes, code examples, and clear success criteria for adding audio to the Timberman arcade game.