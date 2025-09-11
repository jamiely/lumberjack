# Audio Implementation Plan for Timberman Arcade Game

This document provides a concrete, step-by-step implementation plan for adding audio to the Timberman arcade game based on the research in RESEARCH.md.

## Overview

**✅ Phase -1 Complete:** Timer system implementation (prerequisite) has been successfully implemented and tested.

**✅ Phase 1 Complete:** Core audio system implementation has been successfully implemented and tested.

The remaining implementation focuses on:
- **Phase 2**: Game integration and arcade optimization

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

**✅ Sprint 0 Complete:** Timer System Implementation has been successfully implemented and tested.

**✅ Sprint 1 (Phase 1) Complete:** Core Audio System has been successfully implemented and tested.
- ✅ AudioManager class with Web Audio API
- ✅ Audio asset structure and definitions
- ✅ React audio context and hooks
- ✅ Comprehensive test coverage (28 tests)

### Sprint 2 (Phase 2): Integration and Optimization
- **Days 11-12**: Game event integration  
- **Day 13**: Audio controls UI
- **Day 14**: Browser compatibility
- **Day 15**: Performance optimization and arcade calibration

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