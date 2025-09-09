# RESEARCH.md

Research document for MVP implementation of scene loading in the Timberman arcade game.

## MVP Scene Implementation

### Overview

Three basic scenes needed for MVP as per GAME_DESIGN.md:
1. **Attract Screen** - Simple title and "Press Button" prompt
2. **Play Screen** - Basic gameplay using existing game logic
3. **Game Over Screen** - Score display and restart option

## MVP Scene Loading Architecture

### Simple Scene Management
- Single React component in App.tsx with conditional rendering based on current screen state
- No dynamic imports or complex loading - all scenes loaded at startup
- Basic state variable to track current scene: `'attract' | 'play' | 'gameOver'`

### Scene Transition Logic
Simple state machine:
- Attract → Play (any button press)
- Play → Game Over (collision or timer expires) 
- Game Over → Attract (5 second timer)
- Game Over → Play (button press)

### MVP Scene Requirements

**Attract Screen MVP:**
- Static title text
- "Press any button to play" message
- No demo gameplay (save for later phase)

**Play Screen MVP:**
- Reuse existing game logic from src/game/
- Integrate existing canvas rendering
- Use existing input handling from src/hooks/

**Game Over Screen MVP:**
- Display final score
- Simple restart button
- Auto-return timer (5 seconds)

## 1. Attract Screen MVP

### Simple Requirements
- Display game title prominently
- Show "Press any button to play" message
- Load high score from localStorage and display
- Wait for any input to transition to Play screen

### Implementation Approach
- Basic React component with centered text layout
- No canvas needed - just HTML/CSS text elements
- Single useEffect to listen for keydown events
- High score retrieved once on component mount

### File Integration
- Integrate with existing App.tsx structure
- Use existing input patterns from src/hooks/useKeyboardInput.tsx
- Follow existing component patterns from src/components/

## 2. Play Screen MVP

### Simple Requirements
- Use existing game logic from src/game/ modules
- Display canvas with tree, player, score, and timer
- Handle left/right arrow keys for chopping
- Transition to Game Over when collision or timer expires

### Implementation Approach
- Reuse existing GameBoard component from src/components/
- Integrate existing useGameState hook from src/hooks/
- Use existing canvas rendering system
- Leverage existing collision detection logic

### MVP Simplifications
- Use existing geometric shapes (no new art needed)
- Keep current timer system as-is
- Use existing tree generation algorithm
- Maintain current input handling patterns

### File Integration
- GameBoard component already handles Play screen functionality
- Hook into existing game over detection
- Minimal changes needed - mostly state management integration

## 3. Game Over Screen MVP

### Simple Requirements
- Display "GAME OVER" message
- Show final score
- Display high score (if beaten, show "NEW HIGH SCORE!")
- Auto-return to Attract screen after 5 seconds
- Allow immediate restart with any button press

### Implementation Approach
- Basic React component with centered text layout
- Simple setTimeout for 5-second auto-return timer
- localStorage integration for high score persistence
- Single useEffect for input handling

### MVP Features
- Static text elements (no animations)
- High score comparison and storage
- Simple countdown display
- Button press detection for restart

### File Integration
- Similar to Attract screen - mostly HTML/CSS
- Reuse localStorage patterns if any exist in codebase
- Simple state management integration

## MVP Scene State Management

### Simple State Implementation
- Single state variable in App.tsx: `currentScreen: 'attract' | 'play' | 'gameOver'`
- No complex state machine - just direct transitions
- State changes trigger conditional rendering of appropriate scene

### Transition Logic
- **Attract → Play**: Set currentScreen to 'play' on any button press
- **Play → Game Over**: Set currentScreen to 'gameOver' when game ends
- **Game Over → Attract**: Auto-transition after 5 seconds OR immediate on button press

### Data Passing
- Score passed from Play screen to Game Over screen
- High score shared between Attract and Game Over screens
- Simple props drilling - no complex state management needed

### Implementation in App.tsx
- Add currentScreen state variable
- Conditional rendering based on currentScreen value
- Pass necessary callbacks and data as props to each scene

## MVP Canvas Usage

### Simplified Canvas Approach
- **Attract Screen**: No canvas needed - just HTML/CSS text
- **Play Screen**: Reuse existing canvas from GameBoard component
- **Game Over Screen**: No canvas needed - just HTML/CSS text

### Canvas Integration
- Only Play screen uses canvas (existing implementation)
- Attract and Game Over screens are simple React components with HTML/CSS
- Existing canvas rendering system unchanged
- No need for complex scene-specific canvas management

### Performance Benefits
- Minimal canvas usage reduces complexity
- Existing rendering pipeline unchanged
- Simple HTML/CSS for non-game screens
- Focus performance optimization on Play screen only

## MVP Audio Integration

### Simplified Audio Approach
- **Attract Screen**: No sounds needed
- **Play Screen**: Use existing game audio if any exists
- **Game Over Screen**: No sounds needed

### Audio Implementation
- Keep existing audio system unchanged
- Add sounds only if already implemented in codebase
- Focus on visual feedback for MVP
- Audio can be added in later iterations

### Integration Strategy
- Check existing codebase for audio implementation
- If present, maintain as-is
- If not present, skip audio for MVP
- Simple sound on/off toggle if implemented

## MVP Performance Considerations

### Simple Performance Strategy
- **Attract Screen**: Static HTML/CSS - minimal performance impact
- **Play Screen**: Use existing performance optimizations unchanged
- **Game Over Screen**: Static HTML/CSS - minimal performance impact

### Memory Management
- Simple cleanup of timers when scenes unmount
- No complex object pooling needed for MVP
- Existing game logic performance maintained

### Development Testing
- Test scene transitions manually
- Verify high score persistence works
- Check for memory leaks with basic browser dev tools
- Simple integration testing of scene flow

## MVP Implementation Plan with Clean Separation

### File Structure for Clean Architecture
```
src/
├── components/
│   ├── scenes/
│   │   ├── AttractScreen.tsx
│   │   ├── PlayScreen.tsx
│   │   └── GameOverScreen.tsx
│   └── SceneManager.tsx
├── hooks/
│   └── useSceneManager.tsx (optional)
└── App.tsx (minimal scene integration)
```

### Component Responsibilities

#### SceneManager Component
- Manages current scene state
- Handles scene transitions
- Passes data between scenes (scores, callbacks)
- Renders appropriate scene component based on current state

#### AttractScreen Component
- Displays game title and "Press Button" message
- Shows current high score
- Handles input detection for starting game
- Calls onStartGame callback when button pressed

#### PlayScreen Component
- Wraps existing GameBoard component
- Manages game state and lifecycle
- Detects game over conditions
- Calls onGameOver callback with final score

#### GameOverScreen Component
- Displays final score and high score comparison
- Manages 5-second auto-return timer
- Handles immediate restart input
- Calls onRestart or onReturnToAttract callbacks

### Implementation Steps

#### Step 1: Create SceneManager Component
- State management for current scene
- Scene transition functions
- Data passing between scenes
- Conditional rendering of scene components

#### Step 2: Create AttractScreen Component
- Clean component with props interface
- Input handling with callback pattern
- High score display integration
- Proper cleanup on unmount

#### Step 3: Create PlayScreen Component
- Wrapper around existing GameBoard
- Game over detection integration
- Score management and callback
- Maintains existing game functionality

#### Step 4: Create GameOverScreen Component
- Score display and comparison logic
- Timer management with proper cleanup
- Input handling for restart/return
- High score persistence logic

#### Step 5: Integrate with App.tsx
- Import and render SceneManager
- Minimal App.tsx changes
- Pass any global state or callbacks needed

### Benefits of This Approach
- Clear separation of concerns
- Each component has single responsibility
- Easy to test individual scenes
- Scalable for future features
- Follows existing project patterns

### MVP Scope Maintained
- Simple scene transitions
- Basic HTML/CSS for Attract/GameOver screens
- Reuse existing GameBoard for Play screen
- localStorage for high score only
- No complex animations or effects