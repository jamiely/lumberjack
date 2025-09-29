# Timberman Clone - Game Design Document

This document contains the complete game design specification for the Timberman arcade cabinet clone built with React + TypeScript + HTML5 Canvas.

## Game Overview

Timberman is an arcade-style casual game where players control a lumberjack character who must chop down an endless tree while avoiding branches and managing a time limit.

### Core Concept
- **Genre**: Arcade, Casual, Endless
- **Platform**: Arcade Cabinet with Vertical Screen (27" - 13.5" x 24")
- **Target**: Quick sessions, high replayability, coin-op style gameplay
- **Difficulty**: Easy to learn, hard to master

### Display Specifications

#### Development Display (Regular Desktop)
- **Orientation**: Standard landscape monitor
- **Resolution**: Any common desktop resolution (1920x1080, 2560x1440, etc.)
- **Aspect Ratio**: 16:9 or 16:10 (landscape)
- **Viewport Strategy**: Responsive canvas that maintains 9:16 aspect ratio
- **Scaling**: Fit-to-screen with letterboxing if needed
- **Testing**: Window can be resized to test different screen sizes

#### Production Display (Arcade Cabinet)
- **Orientation**: Vertical (Portrait mode)  
- **Screen Size**: ~27" (13.5" x 24" active area)
- **Aspect Ratio**: 9:16 (portrait)
- **Resolution**: 1080x1920 or similar vertical resolution
- **Viewing Distance**: Standing position, ~2-3 feet from screen
- **Deployment**: Full-screen browser (Chrome kiosk mode)

#### Responsive Design Strategy
- **Target Aspect Ratio**: 9:16 (portrait) for consistency
- **Canvas Sizing**: Maintain aspect ratio across different screen sizes
- **UI Scaling**: Proportional scaling of all UI elements
- **Text Scaling**: Font sizes scale with canvas dimensions
- **Development Mode**: Show aspect ratio guides and safe areas

## Game Mechanics

### Basic Gameplay Loop
1. **Chopping**: Player taps left or right to chop the corresponding side of the tree
2. **Branch Avoidance**: Must avoid branches that extend from either side
3. **Time Pressure**: Limited time per action, chopping extends the timer
4. **Progression**: Endless tree with increasing difficulty/speed

### Controls
- **Left Action**: Chop left side of tree, move character to right
- **Right Action**: Chop right side of tree, move character to left
- **Arcade Input**: 2-button setup (Left button / Right button)
- **Button Response**: Immediate action on button press
- **Development Input**: Arrow keys for testing and development

### Win/Lose Conditions
- **Game Over**: Hitting a branch OR timer expiring
- **Scoring**: Simple chop counter (number of successful chops)
- **Session Length**: Target 1-2 minute quick arcade sessions
- **Continues**: No continues - one life per credit/game
- **Difficulty**: Static difficulty throughout game (no progression)

### Timer System
- **Countdown**: Constant time drain during gameplay
- **Extension**: Each successful chop adds time
- **Pressure**: Creates urgency and difficulty scaling

## Game State Representation

### Game Screens/Scenes

The game follows a simple 3-screen flow designed for arcade operation:

#### 1. Attract Screen
- **Purpose**: Draw players and display high scores when idle
- **Display**: Game title, high score, demo gameplay, "Insert Coin" or "Press Button"
- **Duration**: Loops indefinitely until player input
- **Demo**: Automated gameplay showing how to play

#### 2. Play Screen  
- **Purpose**: Active gameplay where player chops tree and avoids branches
- **Display**: Game area with tree, player character, score, timer bar
- **Duration**: Until game over (hit branch or time expires)
- **Input**: Left/Right buttons control chopping

#### 3. Game Over Screen
- **Purpose**: Show final results and prompt for replay
- **Display**: Final score, high score comparison, "Game Over", restart prompt
- **Duration**: Brief display (5-10 seconds) before returning to Attract
- **Transition**: Auto-return to Attract or immediate restart on button press

### Core Game State (Updated)
```typescript
interface GameState {
  currentScreen: 'attract' | 'play' | 'gameOver'
  
  // Play screen state
  score: number
  timeRemaining: number
  playerPosition: 'left' | 'right'
  treeSegments: TreeSegment[]
  
  // Arcade state
  credits: number
  highScore: number
  
  // Screen timers
  attractTimer: number
  gameOverTimer: number
}

interface TreeSegment {
  id: string
  branchSide: 'left' | 'right' | 'none'
}
```

### Player State (Simplified)
```typescript
interface Player {
  position: 'left' | 'right'
  animationState: 'idle' | 'chopping' | 'hit'
  // Removed character selection - single character only
  // Removed unlockables - not in MVP scope
}
```

### Game Settings (Minimal)
```typescript
interface GameSettings {
  soundEnabled: boolean
  freePlay: boolean // true for free play, false for coin-op
  // Removed difficulty - static difficulty only
  // Removed environments - single forest only
  // Removed unlockables - not needed for MVP
}
```

### Arcade-Specific State
```typescript
interface ArcadeState {
  attractMode: {
    active: boolean
    timeUntilDemo: number
    demoScore: number
  }
  creditSystem: {
    coinsInserted: number
    creditsAvailable: number
    freePlayMode: boolean
  }
  highScores: number[] // Simple array of top scores
}
```

## Major Game Objects

### 1. Tree System (MVP Implementation)
- **Tree Segments**: Simple rectangular blocks representing trunk pieces
- **Branch Generation**: Basic algorithm for left/right/none branch patterns
- **Segment Pool**: Array of visible segments (8-10 on screen)
- **Scrolling**: Basic vertical movement as segments are chopped

### 2. Player Character (Simplified)
- **Basic Shape**: Rectangle or circle representing lumberjack
- **Position Management**: Switch between left/right sides of tree
- **Animation State**: Simple state tracking (idle/chopping/hit)
- **No Variants**: Single character only for MVP

### 3. Timer System (Static Difficulty)
- **Progress Bar**: Large, visible countdown bar for arcade viewing
- **Time Management**: Fixed countdown with consistent chop time bonuses
- **Warning State**: Visual/audio cue when time is critically low
- **No Progression**: Static difficulty, no speed increases

### 4. Basic Effects (Geometric)
- **Simple Feedback**: Basic color changes or brief animations
- **Chop Indication**: Visual confirmation of successful chop
- **Hit Feedback**: Clear indication when branch is hit
- **No Complex Particles**: Keep effects simple for MVP

### 5. Arcade UI Components
- **Large Score Display**: Prominent number display for standing viewers
- **Timer Bar**: Full-width progress bar at top or bottom
- **Attract Mode**: Eye-catching demo screen with high score
- **Game Over Screen**: Final score, high score, restart prompt
- **Credit Display**: Show available credits/coins (if coin-op mode)

## Technical Architecture

### Arcade-Specific Considerations
- **Full-Screen Display**: Game fills entire vertical screen (1080x1920)
- **High Visibility**: Large, clear UI elements visible from standing distance
- **2-Button Control**: Everything controllable via Left/Right arcade buttons
- **Auto-Attract Mode**: Demo/attract screen when idle
- **Performance**: Solid 60fps on PC with dedicated graphics
- **Browser Deployment**: Chrome kiosk mode for deployment
- **Credit System**: Configurable between free play and coin-operated modes

### Screen Layout Details

#### Screen Layouts (Base 540x960, scales to fit display)

##### Attract Screen Layout
```
┌─────────────────────────┐
│       TIMBERMAN         │ ← Title (100px from top)
│                         │
│    HIGH SCORE: 1,234    │ ← High score display
│                         │
│  ┌─────────────────┐   │
│  │                 │   │ ← Demo area
│  │  [Demo Game]    │   │   (400x400px)
│  │                 │   │
│  └─────────────────┘   │
│                         │
│   INSERT COIN TO PLAY   │ ← Prompts
│    or PRESS BUTTON      │
│                         │
│      CONTROLS:          │ ← Instructions
│   LEFT BUTTON = LEFT    │
│  RIGHT BUTTON = RIGHT   │
└─────────────────────────┘
Base: 540x960 (scales to screen)
```

##### Play Screen Layout  
```
┌─────────────────────────┐
│ SCORE: 123  TIME: ████  │ ← HUD (50px height)
├─────────────────────────┤
│                         │
│           ●             │ ← Tree center
│          ████           │   (segments)
│       ───████           │ ← Branch left
│          ████           │
│          ████───        │ ← Branch right
│          ████           │
│      [P] ████           │ ← Player left
│          ████           │
│                         │
└─────────────────────────┘
Base: 540x960 (scales to screen)
```

##### Game Over Screen Layout
```
┌─────────────────────────┐
│                         │
│      GAME OVER!         │ ← Large text
│                         │
│   YOUR SCORE: 1,234     │ ← Results
│                         │
│   HIGH SCORE: 5,678     │ ← Comparison
│                         │
│   ★ NEW HIGH SCORE! ★   │ ← If applicable
│                         │
│   PRESS BUTTON TO PLAY  │ ← Restart
│                         │
│  Returning to attract   │ ← Timer
│        in 5...          │
└─────────────────────────┘
Base: 540x960 (scales to screen)
```

### React Component Structure (Updated)
```
App
├── GameCanvas (full screen 1080x1920)
├── ScreenManager
│   ├── AttractScreen (title, high score, demo, instructions)
│   ├── PlayScreen (game area, HUD)
│   └── GameOverScreen (results, restart prompt)
├── UI Components
│   ├── ScoreDisplay (large numbers for arcade viewing)
│   ├── TimerBar (full-width progress bar)
│   └── CreditDisplay (coins/credits if coin-op)
└── InputManager (2-button + arrow key handling)
```

### Screen Transitions

The game follows a simple state machine with clear transitions:

```
    ┌─────────────┐
    │   ATTRACT   │◄────────────────┐
    └─────────────┘                 │
           │                        │
           │ Button Press           │ Auto (5s timer)
           │ (Start Game)           │ or Button Press
           ▼                        │
    ┌─────────────┐                 │
    │    PLAY     │                 │
    └─────────────┘                 │
           │                        │
           │ Game Over              │
           │ (Hit Branch or         │
           │  Time Expires)         │
           ▼                        │
    ┌─────────────┐                 │
    │ GAME OVER   │─────────────────┘
    └─────────────┘
```

#### Transition Rules:

**Attract → Play:**
- **Trigger**: Any button press (Left or Right)
- **Condition**: Credits available (if coin-op mode)
- **Action**: Initialize game state, start gameplay

**Play → Game Over:**
- **Trigger**: Player hits branch OR timer reaches zero
- **Action**: Calculate final score, check for high score, show results

**Game Over → Attract:**
- **Auto Trigger**: 5-10 second timer expires
- **Manual Trigger**: Any button press (immediate restart)
- **Action**: Reset to attract mode, save high score if needed

**Game Over → Play (Direct Restart):**
- **Trigger**: Button press during Game Over screen
- **Condition**: Credits available (if coin-op mode)  
- **Action**: Skip attract, start new game immediately

### Screen State Management
```typescript
interface ScreenTransition {
  fromScreen: 'attract' | 'play' | 'gameOver'
  toScreen: 'attract' | 'play' | 'gameOver'
  trigger: 'buttonPress' | 'gameOver' | 'timer' | 'creditInserted'
  condition?: () => boolean // For credit checks, etc.
}

const transitions: ScreenTransition[] = [
  { fromScreen: 'attract', toScreen: 'play', trigger: 'buttonPress' },
  { fromScreen: 'play', toScreen: 'gameOver', trigger: 'gameOver' },
  { fromScreen: 'gameOver', toScreen: 'attract', trigger: 'timer' },
  { fromScreen: 'gameOver', toScreen: 'play', trigger: 'buttonPress' }
]
```

### Game Loop Architecture
```typescript
// Core game loop in React
const GameLoop = () => {
  const [gameState, setGameState] = useState(initialState)
  
  useEffect(() => {
    const gameLoop = () => {
      updateGame(gameState)
      renderGame(gameState)
      requestAnimationFrame(gameLoop)
    }
    gameLoop()
  }, [])
}
```

### Canvas Rendering System

#### Responsive Canvas Setup
- **Base Resolution**: 540x960 (9:16 aspect ratio, half of 1080x1920)
- **Scaling Strategy**: Scale up/down based on available screen space
- **Letterboxing**: Add black bars if aspect ratio doesn't match
- **Pixel Perfect**: Maintain integer scaling when possible

#### Development Canvas (Desktop Testing)
```typescript
// Example canvas sizing for development
const getCanvasSize = (windowWidth: number, windowHeight: number) => {
  const targetAspect = 9 / 16 // Portrait aspect ratio
  const windowAspect = windowWidth / windowHeight
  
  if (windowAspect > targetAspect) {
    // Window is wider - fit to height
    return {
      width: windowHeight * targetAspect,
      height: windowHeight,
      scale: windowHeight / 960
    }
  } else {
    // Window is taller - fit to width  
    return {
      width: windowWidth,
      height: windowWidth / targetAspect,
      scale: windowWidth / 540
    }
  }
}
```

#### Production Canvas (Arcade)
- **Full Screen**: 1080x1920 native resolution
- **Scale Factor**: 2x from development base (540x960 → 1080x1920)
- **Performance**: Optimized for 60fps at full resolution

#### Rendering Pipeline
- **Layer Management**: Background, tree, character, effects, UI
- **Coordinate System**: Work in base 540x960 coordinates, scale for display
- **UI Scaling**: All elements scale proportionally with canvas
- **Text Rendering**: Font sizes calculated based on scale factor
- **Debug Mode**: Show safe areas and aspect ratio guides during development

## Art & Asset Requirements

### Visual Style (Confirmed Approach)
- **Development Phase**: Basic geometric shapes for initial implementation
- **Art Creation**: Future AI-generated assets when visual style is finalized
- **Character Variety**: Single character only (no unlockables)
- **Environment**: Single forest environment for MVP
- **Resolution Target**: Crisp display on 27" screen at 1080x1920

### Arcade Display Requirements
- **High Contrast**: Clear visibility under arcade lighting conditions
- **Bold Graphics**: Strong visual impact from 2-3 feet viewing distance
- **Large UI Elements**: Score and timer clearly readable while standing
- **Simple Geometry**: Basic shapes during development phase

### Required Art Assets

#### MVP Art Assets (Development Phase)
- **Character**: Simple geometric shape (rectangle/circle) representing lumberjack
- **Tree Segments**: Rectangular blocks representing trunk pieces
- **Branches**: Simple lines/rectangles extending from tree segments
- **Background**: Solid color or simple gradient for forest environment
- **Ground**: Simple rectangle for base platform

#### Future Art Assets (AI-Generated)
- **Character Sprites**: Single lumberjack with idle/chop/hit animations
- **Tree Graphics**: Detailed trunk segments with realistic branches
- **Background**: Forest environment with depth and atmosphere
- **Effects**: Wood chips, impact effects, particle systems

#### UI Elements (Arcade-Sized)
- **Large Buttons**: Start, continue, settings (touch/button friendly)
- **Bold Icons**: Audio, settings, navigation (high visibility)
- **Score Display**: Large, clear numbers visible from distance
- **Timer Bar**: Prominent, easy-to-read time indicator
- **Attract Mode**: Eye-catching title screen and demo gameplay
- **Fonts**: Bold, high-contrast fonts for arcade readability

### Audio Assets (Confirmed Scope)
- **Essential SFX**: Basic chop sound, branch hit sound, game over sound
- **Timer Warning**: Urgent audio cue when time is low
- **Background Music**: Implemented with 20% volume for ambient gameplay
- **Volume**: Balanced for noisy arcade environment
- **Browser CLI Flags**: Use `--autoplay-policy=no-user-gesture-required` for immediate audio playback without user interaction
- **Future Enhancements**: Additional environmental sounds and music tracks

## Implementation Strategy

### Phase 1: MVP Core Game (Confirmed Scope)
1. Full-screen canvas setup (1080x1920 vertical)
2. 2-button input handling (Left/Right + arrow keys for dev)
3. Basic geometric tree segment system
4. Simple player character (rectangle/circle)
5. Basic collision detection
6. Timer system with static difficulty
7. Simple chop counter scoring
8. Game over on branch hit or timer expiry

### Phase 2: Arcade Integration
1. Attract mode with demo gameplay
2. High score persistence (local storage)
3. Credit system (configurable free play/coin-op)
4. Essential audio (chop, hit, game over sounds)
5. Auto-reset after inactivity
6. Large UI elements for arcade visibility

### Phase 3: Visual Enhancement (Future)
1. AI-generated art asset integration
2. Enhanced particle effects and animations
3. Environmental background details
4. Additional audio and music
5. Visual polish and screen effects

### Technology Decisions

#### Canvas vs WebGL
- **HTML5 Canvas**: Simpler, adequate for 2D sprite-based game
- **WebGL**: Overkill for this type of game, added complexity

#### React Integration
- **Game State**: Use React state for UI, separate game state for canvas
- **Component Organization**: Clear separation of concerns
- **Performance**: Optimize for 60fps on arcade hardware
- **Full-Screen**: Handle browser full-screen API for kiosk mode

#### Asset Loading
- **Sprite Sheets**: Single images with multiple frames
- **Preloading**: Load all assets before game start
- **Error Handling**: Graceful fallbacks for missing assets

## Project Specification Summary

Based on answers provided in QUESTIONS.md, here are the confirmed requirements:

### Core Requirements
- **Platform**: Arcade cabinet with 27" vertical screen (1080x1920)
- **Input**: 2-button setup (Left/Right) with immediate response
- **Art**: Basic geometric shapes for MVP, AI-generated assets later
- **Audio**: Essential sounds only (chop, hit, game over)
- **Difficulty**: Static throughout game, no progression
- **Session**: 1-2 minute quick arcade games
- **Scoring**: Simple chop counter
- **Credits**: Configurable between free play and coin-operated

### Technical Specs
- **Hardware**: PC with dedicated graphics card
- **Performance**: 60fps target
- **Deployment**: Chrome browser kiosk mode
- **Development**: Arrow keys for testing
- **Storage**: Local high scores only
- **Operation**: Local only, manual intervention acceptable

This specification provides a clear, focused scope for MVP development while allowing for future visual and audio enhancements.
## Character Descriptor Workflow
- Playable characters are declared in `src/characters/descriptors.ts`. Each entry lists sheet metadata, pose bounds, available poses, and the game-state-to-pose mapping exactly as provided by art.
- The descriptor data is transformed by `src/characters/descriptorBuilder.ts` and emitted through `src/characters/registry.ts`. Runtime systems (selection, rendering, factories) must read from these exports rather than bespoke config files.
- When adding a new character, copy an existing descriptor block, update sprite values, and make sure `availableStates` and `statePoseMap` capture every pose the art team expects.
- Tests cover the descriptor builder (`src/characters/__tests__/descriptorBuilder.test.ts`) and the registry-driven defaults. Update or extend them whenever descriptor structure changes.
- Always run `npm run check` followed by `npm run build` after editing descriptors to verify lint, type, test, and build pipelines.
