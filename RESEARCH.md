# Audio Implementation Research for Timberman Arcade Game

## Audio Requirements Analysis

Based on GAME_DESIGN.md, the audio requirements for this Timberman arcade cabinet clone are:

### Confirmed Audio Scope (from GAME_DESIGN.md)
- **Essential SFX**: Basic chop sound, branch hit sound, game over sound
- **Timer Warning**: Urgent audio cue when time is low (< 3 seconds remaining)
- **Volume**: Balanced for noisy arcade environment
- **Future Enhancements**: Background music and environmental sounds

### Audio Context
- **Platform**: Arcade cabinet deployment in Chrome kiosk mode
- **Environment**: Noisy arcade setting requiring clear, distinct sounds
- **Session Length**: 1-2 minute quick games
- **Input**: Immediate button response requiring low-latency audio feedback

## Web Audio Implementation

### Web Audio API
The implementation will use the Web Audio API for optimal performance in the arcade environment:

**Key Benefits:**
- Low latency (critical for arcade-style immediate feedback)
- Precise timing control
- Multiple simultaneous sounds
- Advanced audio processing capabilities
- Better performance for repeated sounds

**Implementation Considerations:**
- More complex than basic audio elements but necessary for arcade requirements
- Requires audio context management
- Need to handle browser autoplay policies

### 2. Audio Loading and Management

#### Preloading Strategy
```typescript
interface AudioAsset {
  name: string
  url: string
  buffer?: AudioBuffer
}

const audioAssets: AudioAsset[] = [
  { name: 'chop', url: '/audio/chop.wav' },
  { name: 'hit', url: '/audio/branch-hit.wav' },
  { name: 'gameOver', url: '/audio/game-over.wav' },
  { name: 'timerWarning', url: '/audio/timer-warning.wav' }
]
```

#### Audio Context Management
- Initialize audio context on first user interaction (required by browsers)
- Handle audio context state changes (suspended/running)
- Implement graceful fallbacks for audio failures

### 3. Audio Architecture for React Application

#### Recommended Structure
```
src/audio/
├── AudioManager.ts          # Main audio system
├── AudioContext.tsx         # React context for audio state
├── hooks/
│   ├── useAudioManager.ts   # Hook for audio operations
│   └── useGameAudio.ts      # Game-specific audio hooks
└── assets/
    ├── chop.wav
    ├── branch-hit.wav
    ├── game-over.wav
    └── timer-warning.wav
```

#### Integration with Existing Game State
- Audio events triggered by game state changes
- Volume control integrated with GameSettings
- Audio enabled/disabled state management

## Arcade-Specific Audio Considerations

### 1. Volume and Mixing
- **Base Volume**: Calibrated for arcade cabinet speakers
- **Dynamic Range**: Compressed for consistent volume levels
- **Frequency Response**: Optimized for arcade speaker systems
- **Competing Audio**: Must cut through ambient arcade noise

### 2. Audio File Formats and Optimization
- **Format**: WAV for uncompressed quality, or high-quality MP3/OGG
- **Sample Rate**: 44.1kHz standard
- **Bit Depth**: 16-bit minimum for clarity
- **File Size**: Balance quality vs loading time
- **Compression**: Avoid over-compression that reduces impact

### 3. Latency Requirements
- **Chop Sound**: < 20ms delay from button press
- **Hit Sound**: Immediate response to collision detection
- **Timer Warning**: Precise timing with visual cues

## Prerequisites - Refactoring for Better Architecture

Before implementing audio, the following refactoring should be completed to improve separation of concerns and maintainability:

### 1. Extract Game Event System
**Current Issue**: Game logic functions (`performChop`, `checkCollision`) are pure functions with no way to trigger side effects like audio.

**Refactoring Needed**:
- Create a game event system that can emit events (chop, collision, gameOver)
- Modify GameLogic to emit events alongside state changes
- This will allow audio system to subscribe to game events cleanly

### 2. Add Settings/Configuration Management
**Current Issue**: No centralized configuration system for game settings (audio volume, enabled/disabled, etc.)

**Refactoring Needed**:
- Create `src/game/GameSettings.ts` with settings interface
- Add settings to GameState or create separate settings context
- This will provide foundation for audio volume/mute controls

### 3. Improve Hook Architecture
**Current Issue**: `useGameState` hook is becoming large and handles multiple concerns

**Refactoring Needed**:
- Keep `useGameState` focused on core game state management
- Create separate hooks for specific concerns (useGameEvents, useGameSettings)
- This will make audio integration cleaner with dedicated hooks

**Files to Modify for Prerequisites**:
1. `src/game/GameLogic.ts` - Add event emission capability
2. `src/game/GameSettings.ts` - New settings management
3. `src/game/GameState.ts` - Add settings to state or separate context
4. `src/hooks/useGameState.ts` - Refactor to use event system
5. `src/hooks/useGameEvents.ts` - New hook for event handling
6. `src/hooks/useGameSettings.ts` - New hook for settings management

## Implementation Plan

### Phase 0: Architecture Refactoring (Prerequisites)
1. **Game Event System**: Create event emission in game logic
2. **Settings Management**: Add configuration system for audio controls
3. **Hook Refactoring**: Separate concerns for cleaner audio integration
4. **Quality Gate**: Ensure `npm run check` passes (unit tests + lint + e2e tests)

### Phase 1: Basic Audio System
1. **AudioManager Class**: Core audio system with Web Audio API
2. **Audio Asset Loading**: Preload all required sounds
3. **React Integration**: Audio context and hooks
4. **Basic Sound Playback**: Chop, hit, game over sounds

### Phase 2: Game Integration
1. **Event-Driven Audio**: Trigger sounds based on game events
2. **Volume Control**: Integrate with game settings
3. **Audio State Management**: Enable/disable functionality
4. **Error Handling**: Graceful fallbacks for audio failures
5. **Quality Gate**: Ensure `npm run check` passes after integration

### Phase 3: Arcade Optimization
1. **Volume Calibration**: Optimize for arcade environment
2. **Performance Testing**: Ensure stable performance during gameplay
3. **Browser Compatibility**: Test in Chrome kiosk mode
4. **Audio Quality**: Final tuning for arcade speakers
5. **Final Quality Gate**: Ensure `npm run check` passes after full implementation

## Technical Implementation Details

### 1. Web Audio API Setup
```typescript
class AudioManager {
  private context: AudioContext
  private buffers: Map<string, AudioBuffer> = new Map()
  private gainNode: GainNode
  
  async initialize() {
    this.context = new AudioContext()
    this.gainNode = this.context.createGain()
    this.gainNode.connect(this.context.destination)
    await this.loadAudioAssets()
  }
  
  playSound(name: string, volume: number = 1) {
    const buffer = this.buffers.get(name)
    if (!buffer) return
    
    const source = this.context.createBufferSource()
    const gain = this.context.createGain()
    
    source.buffer = buffer
    source.connect(gain)
    gain.connect(this.gainNode)
    gain.gain.value = volume
    
    source.start(0)
  }
}
```

### 2. React Context Integration
```typescript
interface AudioContextType {
  audioManager: AudioManager | null
  isEnabled: boolean
  volume: number
  setVolume: (volume: number) => void
  toggleAudio: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)
```

### 3. Game Event Integration
```typescript
// In game logic
const useGameAudio = () => {
  const { audioManager, isEnabled } = useAudioContext()
  
  const playChopSound = useCallback(() => {
    if (isEnabled && audioManager) {
      audioManager.playSound('chop', 0.8)
    }
  }, [audioManager, isEnabled])
  
  const playHitSound = useCallback(() => {
    if (isEnabled && audioManager) {
      audioManager.playSound('hit', 1.0)
    }
  }, [audioManager, isEnabled])
  
  return { playChopSound, playHitSound }
}
```

## Audio Asset Requirements

### 1. Sound Design Guidelines
- **Chop Sound**: Sharp, satisfying wood-chopping sound (200-500ms duration)
- **Branch Hit**: Impactful, negative feedback sound (100-300ms duration)
- **Game Over**: Clear, definitive ending sound (500-1000ms duration)
- **Timer Warning**: Urgent, attention-grabbing beep or tone (100-200ms duration)

### 2. Audio Production Specifications
- **Format**: WAV (uncompressed) or high-quality MP3 (320kbps)
- **Mono vs Stereo**: Mono sufficient for arcade cabinet
- **Normalization**: Consistent peak levels across all sounds
- **No Clipping**: Clean audio without digital distortion

## Browser and Platform Considerations

### 1. Chrome Kiosk Mode
- Audio context initialization requirements
- Autoplay policies and user gesture requirements
- Performance optimization for continuous operation

### 2. Mobile Compatibility (Future)
- iOS audio limitations and workarounds
- Android audio latency considerations
- Touch interaction requirements for audio activation

### 3. Error Handling and Fallbacks
- Audio context creation failures
- Network issues during asset loading
- Graceful degradation when audio is unavailable

## Performance Considerations

### 1. Memory Management
- Audio buffer cleanup and garbage collection
- Efficient audio source node management
- Memory usage monitoring for long arcade sessions

### 2. CPU Usage
- Minimize audio processing overhead
- Efficient event handling for rapid button presses
- Background audio context maintenance

### 3. Network Loading
- Optimize audio file sizes without quality loss
- Implement progressive loading if needed
- Handle slow network conditions gracefully

## Testing Strategy

### 1. Functional Testing
- Audio playback on different browsers
- Volume control functionality
- Enable/disable audio settings
- Error condition handling

### 2. Performance Testing
- Audio latency measurements
- Memory usage during extended gameplay
- CPU usage impact assessment

### 3. Integration Testing
- Audio synchronization with game events
- Multiple simultaneous sound playback
- Audio state persistence across game sessions

### 4. Arcade Environment Testing
- Volume levels in noisy environment
- Speaker system compatibility
- Long-term operational stability

## Post-Implementation Considerations

### Future Enhancement Opportunities
- **Background Music System**: Looping music tracks for attract mode and gameplay
- **Environmental Sound Effects**: Ambient forest sounds, wind effects
- **Advanced Audio Effects**: Reverb, filters, dynamic processing
- **Dynamic Audio Mixing**: Adaptive volume based on gameplay intensity
- **Additional Sound Variations**: Multiple chop sounds, randomized effects

### Long-term Maintenance Requirements
- **Audio Asset Management**: Organized file structure, versioning system
- **Browser Compatibility**: Regular updates for new browser versions
- **Performance Monitoring**: Continuous monitoring of memory usage and latency
- **User Feedback Integration**: Analytics and feedback system for audio preferences
- **Hardware Compatibility**: Testing with different arcade cabinet speaker systems

## Implementation Questions - Resolved from Codebase Analysis

### Question 1: Audio Asset Sources ✅ RESOLVED
**Answer:** Audio files already exist in `public/audio/` directory:
- **Files Available**: `chop.wav`, `branch-hit.wav`, `game-over.wav`, `timer-warning.wav`
- **Format**: WAV files, 16-bit mono, 44.1kHz sample rate (optimal for arcade)
- **Quality**: Professional audio files ready for implementation
- **Additional File**: `67_knock.wav` (alternative chop sound available)

### Question 2: Game Logic Integration Points ✅ PARTIALLY RESOLVED
**Current Architecture Analysis:**
- **Collision Detection**: `checkCollision()` function in `src/game/GameLogic.ts:5-11`
- **Chop Function**: `performChop()` function in `src/game/GameLogic.ts:13-52`
- **Event Emission Points**:
  - **Chop Event**: Add after line 21 (after collision check passes)
  - **Hit Event**: Add at line 24 (when collision is true, before gameOver)
  - **Game Over Event**: Add at line 26 (when setting gameOver: true)

**Timer System Status**: ⚠️ NOT YET IMPLEMENTED
- **Current State**: No timer system exists in current GameState or GameLogic
- **Design Requirement**: GAME_DESIGN.md specifies timer system with countdown/extension
- **Implementation Needed**: Timer system must be added to GameState before audio integration
- **Timer Warning Event**: Will require timer implementation first (< 3 seconds remaining)

### Question 3: Hook Architecture Analysis ✅ RESOLVED
**Current Hook Structure:**
- **`useGameState`**: Focused on core game state management (lines 6-35)
  - Currently NO event handling - only state mutations via `chop()`, `reset()`, etc.
  - Clean separation of concerns already maintained
- **`useKeyboardInput`**: Handles keyboard events separately (lines 16-36)
  - Takes callback handlers as parameters
  - No direct game state manipulation
- **Refactoring Scope**: Minimal - current architecture is already well-separated
- **Integration Strategy**: Add new hooks alongside existing ones rather than major refactoring

### Question 8: Testing Infrastructure ✅ RESOLVED
**Current Testing Setup:**
- **Framework**: Vitest with React Testing Library
- **Commands Available**: `npm test`, `npm run test:watch`, `npm run test:coverage`, `npm run check`
- **Existing Tests**: Unit tests for GameLogic, hooks, and components
- **CI/CD Compatibility**: jsdom environment configured for testing without audio devices
- **Testing Strategy**: Mix of unit tests (for AudioManager) and integration tests (for game events)

### Question 9: Development vs Production Configuration ✅ RESOLVED
**Current Configuration:**
- **Environment**: Single Vite configuration for development and production
- **Debug Mode**: Already implemented in GameState (`showDebug` property)
- **Volume Strategy**: Different volume levels can be set via proposed GameSettings system
- **Build System**: `npm run build` creates production optimized bundle
- **Development Tools**: Debug panel and console logging available in dev mode

### Browser Autoplay Policy Handling ✅ RESOLVED
**Development Solution:** Chrome can be configured to bypass autoplay restrictions for local development.

**Method: Chrome Launch Flags (Recommended)**
```bash
# Development with autoplay disabled:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --autoplay-policy=no-user-gesture-required \
  --disable-web-security \
  --user-data-dir=/tmp/chrome-dev-session
```

**Arcade Deployment Configuration:**
```bash
# Kiosk mode with autoplay enabled:
google-chrome \
  --kiosk \
  --autoplay-policy=no-user-gesture-required \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-translate \
  --no-first-run \
  http://localhost:5173
```

**Implementation Impact:**
- **No User Interaction Required**: Audio can play immediately when events are triggered
- **Simplified Audio System**: No need for complex autoplay policy detection and user prompts
- **Consistent Experience**: Same behavior in development and arcade deployment
- **Reduced Code Complexity**: Eliminates need for "click to enable audio" UI components

### Question 5: Performance Measurement ✅ RESOLVED
**Decision:** Skip detailed performance monitoring for MVP implementation.

**Rationale:**
- **Focus on Core Functionality**: Prioritize getting audio working over complex performance metrics
- **Simplicity**: Avoid over-engineering the initial implementation
- **Future Enhancement**: Performance monitoring can be added later if needed
- **Arcade Environment**: Real-world testing on actual hardware will be more valuable than synthetic benchmarks

### Question 6: Arcade Audio Calibration ✅ RESOLVED  
**Decision:** Skip advanced audio calibration for MVP implementation.

**Rationale:**
- **Manual Tuning**: Volume and audio settings can be adjusted manually during arcade setup
- **Standard Configuration**: Use standard Web Audio API settings initially
- **Iterative Approach**: Test on actual arcade hardware and adjust as needed
- **Simplicity**: Avoid complex audio processing that may introduce latency or compatibility issues

### Question 7: Error Handling Strategy ✅ RESOLVED
**Audio Error Handling Approach:**
- **Failure Mode**: Silent failure with console logging only
- **No Analytics**: No error reporting to external systems  
- **Best Effort Loading**: Partial audio initialization allowed (some sounds may fail to load)
- **Graceful Degradation**: Game continues to function without audio if audio system fails

**Implementation Guidelines:**
- Log audio errors to console for debugging
- Continue game operation even if audio fails completely
- No user-facing error messages for audio failures
- Simple, robust error handling that doesn't impact gameplay

### Timer System Implementation Approach ✅ RESOLVED
**Decision:** Implement timer system as a separate prerequisite phase before audio integration.

**Implementation Strategy:**
- **Separate Phase**: Create "Phase -1: Timer System Implementation" before current Phase 0
- **Complete Timer System**: Implement full timer functionality first
- **Clean Integration**: Audio system can then integrate cleanly with working timer events
- **Reduced Complexity**: Avoid trying to implement timer and audio systems simultaneously