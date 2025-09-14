# Refactoring Analysis - Lumberjack Game

This document identifies areas for refactoring based on maintainability, separation of concerns, colocation, top-down design, DRY principles, encapsulation, and testability.

## Executive Summary

The codebase shows good overall architecture with proper separation between game logic, components, and hooks. However, there are several opportunities to improve maintainability, reduce coupling, and enhance testability through strategic refactoring.

## High-Priority Refactoring Opportunities

### 1. **Scene Management & State Coordination**
**Location**: `SceneManager.tsx`, `PlayScreen.tsx`
**Principle**: Separation of Concerns, Encapsulation

**Issues**:
- SceneManager handles too many responsibilities: scene transitions, character selection, high score management, and localStorage operations
- PlayScreen contains mixed concerns: UI layout, game state management, input handling, and click coordinate calculations
- Character selection logic scattered across multiple files

**Refactoring Recommendations**:
```typescript
// Extract dedicated services
class HighScoreService {
  static getHighScore(): number
  static saveHighScore(score: number): void
  static isNewHighScore(score: number): boolean
}

class CharacterSelectionService {
  static selectCharacter(): CharacterType
  static isCharacterForced(): boolean
  static getRandomCharacter(): CharacterType
}

// Simplify SceneManager by delegating responsibilities
```

### 2. **Input System Coupling**
**Location**: `PlayScreen.tsx:35-60`, `useKeyboardInput.ts`
**Principle**: Encapsulation, Testability

**Issues**:
- Mouse click handling hardcoded in PlayScreen with complex coordinate calculations
- Keyboard and mouse input handled in different places
- Tree position constants used directly in click handling logic

**Refactoring Recommendations**:
```typescript
// Create unified input abstraction
interface GameInputHandler {
  onChopLeft: () => void
  onChopRight: () => void
  onReset: () => void
  onToggleDebug: () => void
}

class ClickInputService {
  static getChopSideFromClick(clickX: number, gameBoardRect: DOMRect): 'left' | 'right'
  static isValidChopClick(target: HTMLElement): boolean
}

// Consolidate all input handling in a single hook
function useGameInput(handler: GameInputHandler): void
```

### 3. **Animation System Complexity**
**Location**: `GameBoard.tsx:62-110`
**Principle**: Encapsulation, Maintainability

**Issues**:
- Animation logic tightly coupled to GameBoard component
- Complex useEffect with manual requestAnimationFrame management
- Animation state scattered between game state and component state

**Refactoring Recommendations**:
```typescript
// Extract animation system
class AnimationManager {
  private animations: Map<string, Animation>
  
  addAnimation(segment: AnimatedSegment): void
  removeAnimation(id: string): void
  updateAnimations(timestamp: number): void
  shouldRemoveAnimation(segment: AnimatedSegment, timestamp: number): boolean
}

// Custom hook for animation management
function useAnimationSystem(segments: AnimatedSegment[], onRemove: (id: string) => void) {
  // Encapsulate all animation logic
}
```

### 4. **Constants and Configuration Management**
**Location**: `constants.ts`, scattered throughout components
**Principle**: DRY, Maintainability

**Issues**:
- Large monolithic constants file with mixed concerns
- Magic numbers still present in components despite constants
- No configuration hierarchy or theming system

**Refactoring Recommendations**:
```typescript
// Split constants by domain
export const GAME_CONFIG = {
  timer: {
    initialTime: 10,
    maxTime: 15,
    timePerChop: 1.5,
    warningThreshold: 1,
    updateInterval: 100
  },
  tree: {
    segmentHeight: 60,
    segmentWidth: 120,
    segmentSpacing: 60,
    leftPosition: 210,
    bottomOffset: 40
  },
  // ... other config groups
}

// Create configuration builder for different environments
class GameConfigBuilder {
  static forDevelopment(): GameConfig
  static forProduction(): GameConfig
  static forTesting(): GameConfig
}
```

### 5. **Game State Update Patterns**
**Location**: `useGameState.ts`, `GameLogic.ts`
**Principle**: Encapsulation, Testability

**Issues**:
- Game state updates spread across multiple functions
- Timer logic mixed with other game logic
- Side effects (events) mixed with pure state updates

**Refactoring Recommendations**:
```typescript
// Implement Command pattern for game actions
interface GameCommand {
  execute(state: GameState): GameState
  getEvents(): GameEvent[]
}

class ChopCommand implements GameCommand {
  constructor(private side: 'left' | 'right') {}
  execute(state: GameState): GameState { /* pure logic */ }
  getEvents(): GameEvent[] { /* side effects */ }
}

// Game state machine
class GameStateMachine {
  constructor(private eventEmitter: GameEventEmitter) {}
  
  dispatch(command: GameCommand): void {
    const newState = command.execute(this.currentState)
    const events = command.getEvents()
    
    this.currentState = newState
    events.forEach(event => this.eventEmitter.emit(event))
  }
}
```

## Medium-Priority Refactoring Opportunities

### 6. **Component Layout Responsibilities**
**Location**: `PlayScreen.tsx:74-155`
**Principle**: Separation of Concerns

**Issues**:
- Hardcoded positioning values mixed with component logic
- Layout concerns not separated from game concerns

**Refactoring Recommendations**:
```typescript
// Extract layout configuration
const PLAY_SCREEN_LAYOUT = {
  timerBar: { top: '347px', left: '10px', right: '10px' },
  scoreDisplay: { top: '462px', transform: 'translateX(-50%)' },
  debugPanel: { bottom: '10px', left: '10px', right: '10px' }
}

// Create layout component
function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="game-layout">
      {children}
    </div>
  )
}
```

### 7. **Audio System Integration**
**Location**: `PlayScreen.tsx:23`, `useAudioEventHandlers.ts`
**Principle**: Separation of Concerns

**Issues**:
- Audio initialization scattered across components
- Audio events tied to specific components rather than game state

**Refactoring Recommendations**:
```typescript
// Centralize audio management
function useGameAudioSystem(gameState: GameState) {
  // Handle all audio logic based on game state changes
  // Remove need for components to manually initialize audio
}
```

### 8. **Character System Architecture**
**Location**: `characters/` directory, sprite components
**Principle**: Top-down Design, Encapsulation

**Issues**:
- Character configuration spread across multiple files
- No clear character abstraction
- Sprite components tightly coupled to specific character types

**Refactoring Recommendations**:
```typescript
// Unified character system
interface Character {
  type: CharacterType
  config: CharacterConfig
  sprites: CharacterSprites
  animations: CharacterAnimations
}

class CharacterFactory {
  static create(type: CharacterType): Character
  static getAvailable(): CharacterType[]
}

// Generic character renderer
function CharacterRenderer({ character, state, position }: CharacterRendererProps) {
  // Render any character type uniformly
}
```

### 9. **Testing Infrastructure Gaps**
**Location**: Test files throughout codebase
**Principle**: Testability

**Issues**:
- Integration tests mixing multiple concerns
- No test utilities for common game state scenarios
- Animation testing requires complex mocking

**Refactoring Recommendations**:
```typescript
// Test utilities
class GameStateBuilder {
  withScore(score: number): GameStateBuilder
  withTimer(time: number): GameStateBuilder
  withTreeSegments(segments: TreeSegment[]): GameStateBuilder
  build(): GameState
}

// Mock factories
class MockFactory {
  static createGameState(overrides?: Partial<GameState>): GameState
  static createAnimatedSegment(overrides?: Partial<AnimatedSegment>): AnimatedSegment
}
```

## Low-Priority Refactoring Opportunities

### 10. **Type Safety Enhancements**
**Location**: Various files with type casting
**Principle**: Type Safety, Maintainability

**Issues**:
- Some components use loose typing for event handlers
- Magic strings used for character types

**Refactoring Recommendations**:
```typescript
// Stronger typing
type PlayerAction = 'chop-left' | 'chop-right' | 'reset' | 'toggle-debug'
type SceneTransition = 'attract-to-play' | 'play-to-gameOver' | 'gameOver-to-attract'

// Replace string literals with const assertions
const CHARACTER_TYPES = ['lumberjack1', 'lumberjack2', 'lumberjack3', 'lumberjack4'] as const
type CharacterType = typeof CHARACTER_TYPES[number]
```

### 11. **Performance Optimizations**
**Location**: `GameBoard.tsx`, `useGameState.ts`
**Principle**: Performance, Maintainability

**Issues**:
- Animation loop running when not needed
- Potential unnecessary re-renders from state updates

**Refactoring Recommendations**:
```typescript
// Optimize re-renders with React.memo and useMemo
const OptimizedGameBoard = React.memo(GameBoard, (prev, next) => {
  // Custom comparison logic
})

// Optimize animation system
function useOptimizedAnimations(segments: AnimatedSegment[]) {
  // Only start animation loop when segments exist
  // Use RAF more efficiently
}
```

## Refactoring Priority Matrix

### High Impact, Low Effort
1. **Constants organization** - Split into domain-specific files
2. **Input system consolidation** - Create unified input handler
3. **Scene management services** - Extract HighScoreService and CharacterSelectionService

### High Impact, High Effort  
1. **Animation system refactoring** - Extract AnimationManager class
2. **Game state command pattern** - Implement GameStateMachine
3. **Character system unification** - Create CharacterFactory and unified renderer

### Medium Impact, Medium Effort
1. **Layout component extraction** - Separate layout from game logic
2. **Audio system centralization** - Single audio management hook
3. **Testing infrastructure** - Create test utilities and builders

## Implementation Strategy

### Phase 1: Foundation (Week 1)
- Split constants into domain files
- Create service classes for high scores and character selection
- Extract layout configurations

### Phase 2: Core Systems (Week 2-3)
- Implement unified input system
- Refactor animation management
- Create game state command pattern

### Phase 3: Polish (Week 4)
- Enhance testing infrastructure
- Performance optimizations
- Type safety improvements

## Success Metrics

- **Maintainability**: Reduced cyclomatic complexity in components
- **Testability**: Increased test coverage, especially for game logic
- **Separation of Concerns**: Each file has single, clear responsibility  
- **DRY**: Eliminated code duplication across similar components
- **Encapsulation**: Clear public/private interfaces for each system
- **Performance**: Maintained 60fps with cleaner, more organized code

This refactoring plan maintains the existing functionality while improving code organization, testability, and maintainability for future development.