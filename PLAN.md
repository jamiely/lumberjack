# Implementation Plan - Lumberjack Game Refactoring

Based on decisions in QUESTIONS.md and analysis in RESEARCH.md.

## Phase 1: Foundation & Services (High Impact, Low Effort)

### Task 1.1: Split Constants into Domain Files
**Files**: `src/constants.ts` → multiple files
**Goal**: Replace monolithic constants with domain-specific flat files

**Steps**:
1. Create `src/config/gameConfig.ts` - timer, scoring, gameplay constants
2. Create `src/config/treeConfig.ts` - tree dimensions, positioning, segments
3. Create `src/config/uiConfig.ts` - layout positions, colors, sizing
4. Create `src/config/audioConfig.ts` - audio file paths, volume levels
5. Create `src/config/animationConfig.ts` - animation durations, easing
6. Update imports across all files using these constants
7. Remove original `src/constants.ts`

**Files to Update**:
- `src/game/GameLogic.ts`
- `src/components/GameBoard.tsx`
- `src/components/PlayScreen.tsx`
- `src/hooks/useGameState.ts`

### Task 1.2: Create Service Classes
**Files**: New service files
**Goal**: Extract high score and character selection logic into injectable services

**Steps**:
1. Create `src/services/HighScoreService.ts`:
   ```typescript
   interface IHighScoreService {
     getHighScore(): number
     saveHighScore(score: number): void
     isNewHighScore(score: number): boolean
   }
   
   export class HighScoreService implements IHighScoreService {
     // localStorage implementation
   }
   ```

2. Create `src/services/CharacterSelectionService.ts`:
   ```typescript
   interface ICharacterSelectionService {
     selectCharacter(): CharacterType
     isCharacterForced(): boolean
     getRandomCharacter(): CharacterType
   }
   
   export class CharacterSelectionService implements ICharacterSelectionService {
     // Random selection with future user choice support
   }
   ```

3. Create `src/services/index.ts` for service exports
4. Update `src/components/SceneManager.tsx` to use services
5. Create dependency injection pattern for testing

**Files to Update**:
- `src/components/SceneManager.tsx:45-65` (high score logic)
- `src/components/SceneManager.tsx:25-40` (character selection)

### Task 1.3: Extract Layout Configurations
**Files**: Component files with hardcoded positions
**Goal**: Separate layout concerns from component logic using CSS modules

**Steps**:
1. Create `src/styles/layouts/` directory
2. Create `PlayScreenLayout.module.css` with responsive layout
3. Create `GameBoardLayout.module.css` for game board positioning
4. Update `src/components/PlayScreen.tsx:74-155` to use CSS modules
5. Create layout utility types for TypeScript support

**Files to Update**:
- `src/components/PlayScreen.tsx` (remove hardcoded positions)
- `src/components/GameBoard.tsx` (positioning logic)

## Phase 2: Core Systems Refactoring (High Impact, High Effort)

### Task 2.1: Implement Unified Input System
**Files**: `src/components/PlayScreen.tsx`, `src/hooks/useKeyboardInput.ts`
**Goal**: Completely abstract input handling from components

**Steps**:
1. Create `src/input/GameInputHandler.ts` interface:
   ```typescript
   interface GameInputHandler {
     onChopLeft: () => void
     onChopRight: () => void
     onReset: () => void
     onToggleDebug: () => void
   }
   ```

2. Create `src/input/ClickInputService.ts`:
   ```typescript
   class ClickInputService {
     static getChopSideFromClick(clickX: number, gameBoardRect: DOMRect): 'left' | 'right'
     static isValidChopClick(target: HTMLElement): boolean
   }
   ```

3. Create `src/hooks/useGameInput.ts` - unified input hook
4. Remove click handling from `src/components/PlayScreen.tsx:35-60`
5. Consolidate keyboard and mouse input logic

**Files to Update**:
- `src/components/PlayScreen.tsx` (remove direct input handling)
- `src/hooks/useKeyboardInput.ts` (integrate with unified system)

### Task 2.2: Create Animation Management System
**Files**: `src/components/GameBoard.tsx:62-110`
**Goal**: Extract animation logic into singleton AnimationManager class

**Steps**:
1. Create `src/animation/AnimationManager.ts`:
   ```typescript
   class AnimationManager {
     private static instance: AnimationManager
     private animations: Map<string, AnimatedSegment>
     private rafId: number | null = null
     
     static getInstance(): AnimationManager
     addAnimation(segment: AnimatedSegment): void
     removeAnimation(id: string): void
     private updateAnimations(timestamp: number): void
     shouldRemoveAnimation(segment: AnimatedSegment, timestamp: number): boolean
   }
   ```

2. Create `src/hooks/useAnimationSystem.ts`:
   ```typescript
   function useAnimationSystem(
     segments: AnimatedSegment[], 
     onRemove: (id: string) => void
   ) {
     // Interface with singleton AnimationManager
   }
   ```

3. Update `src/components/GameBoard.tsx` to use animation system
4. Remove manual requestAnimationFrame logic from component

**Files to Update**:
- `src/components/GameBoard.tsx` (remove animation logic)
- `src/types/index.ts` (animation-related types)

### Task 2.3: Implement Game State Command Pattern
**Files**: `src/hooks/useGameState.ts`, `src/game/GameLogic.ts`
**Goal**: Create command-based state management with HTML EventTarget events

**Steps**:
1. Create `src/game/commands/` directory with command interfaces:
   ```typescript
   interface GameCommand {
     execute(state: GameState): GameState
     getEvents(): GameEvent[]
   }
   
   class ChopCommand implements GameCommand {
     constructor(private side: 'left' | 'right') {}
     execute(state: GameState): GameState
     getEvents(): GameEvent[]
   }
   ```

2. Create `src/game/GameStateMachine.ts`:
   ```typescript
   class GameStateMachine extends EventTarget {
     private currentState: GameState
     
     dispatch(command: GameCommand): void {
       const newState = command.execute(this.currentState)
       const events = command.getEvents()
       
       this.currentState = newState
       events.forEach(event => this.dispatchEvent(new CustomEvent(event.type, { detail: event })))
     }
   }
   ```

3. Create command classes: `ChopCommand`, `ResetCommand`, `TickCommand`
4. Update `src/hooks/useGameState.ts` to use GameStateMachine
5. Replace direct state mutations with command dispatching

**Files to Update**:
- `src/hooks/useGameState.ts` (use command pattern)
- `src/game/GameLogic.ts` (extract into commands)
- Components using game state events

## Phase 3: Character System & Testing (Medium Impact, Medium Effort)

### Task 3.1: Unify Character System
**Files**: `src/characters/` directory, sprite components
**Goal**: Create factory pattern and unified character renderer

**Steps**:
1. Create `src/characters/Character.ts` interface:
   ```typescript
   interface Character {
     type: CharacterType
     config: CharacterConfig
     sprites: CharacterSprites
     animations: CharacterAnimations
   }
   ```

2. Create `src/characters/CharacterFactory.ts`:
   ```typescript
   class CharacterFactory {
     static create(type: CharacterType): Character
     static getAvailable(): CharacterType[]
     private static loadCharacterConfig(type: CharacterType): CharacterConfig
   }
   ```

3. Create `src/components/CharacterRenderer.tsx`:
   ```typescript
   function CharacterRenderer({ 
     character, 
     state, 
     position 
   }: CharacterRendererProps) {
     // Render any character type uniformly
   }
   ```

4. Update existing sprite components to use unified system
5. Consolidate character configuration files

**Files to Update**:
- `src/characters/lumberjack1/` (consolidate)
- `src/characters/lumberjack2/` (consolidate)
- `src/components/sprites/` (use CharacterRenderer)

### Task 3.2: Audio System Centralization
**Files**: `src/components/PlayScreen.tsx:23`, `src/hooks/useAudioEventHandlers.ts`
**Goal**: Single audio management hook responding to game state

**Steps**:
1. Create `src/audio/AudioManager.ts` singleton
2. Create `src/hooks/useGameAudioSystem.ts`:
   ```typescript
   function useGameAudioSystem(gameState: GameState) {
     // Listen to game state changes via EventTarget
     // Trigger appropriate audio responses
   }
   ```
3. Remove audio initialization from components
4. Connect audio system to GameStateMachine events

**Files to Update**:
- `src/components/PlayScreen.tsx` (remove audio init)
- `src/hooks/useAudioEventHandlers.ts` (integrate with central system)

### Task 3.3: Testing Infrastructure Enhancement
**Files**: Test files throughout codebase
**Goal**: Create test utilities and improve test organization

**Steps**:
1. Create `src/__tests__/utils/GameStateBuilder.ts`:
   ```typescript
   class GameStateBuilder {
     withScore(score: number): GameStateBuilder
     withTimer(time: number): GameStateBuilder
     withTreeSegments(segments: TreeSegment[]): GameStateBuilder
     build(): GameState
   }
   ```

2. Create `src/__tests__/utils/MockFactory.ts`:
   ```typescript
   class MockFactory {
     static createGameState(overrides?: Partial<GameState>): GameState
     static createAnimatedSegment(overrides?: Partial<AnimatedSegment>): AnimatedSegment
     static createMockServices(): ServiceContainer
   }
   ```

3. Create service container for dependency injection in tests
4. Update existing tests to use builders and mocks
5. Add unit tests for new command classes and services

**Files to Update**:
- All existing test files
- Add tests for new service classes
- Add tests for command pattern implementation

## Implementation Order & Dependencies

### Week 1: Foundation
- Task 1.1: Split Constants (no dependencies)
- Task 1.2: Create Services (depends on constants)
- Task 1.3: Layout Extraction (parallel with services)

### Week 2-3: Core Systems  
- Task 2.1: Input System (depends on layout extraction)
- Task 2.2: Animation System (parallel with input)
- Task 2.3: Command Pattern (depends on services)

### Week 4: Integration & Polish
- Task 3.1: Character System (depends on command pattern)
- Task 3.2: Audio System (depends on command pattern) 
- Task 3.3: Testing Infrastructure (parallel with other tasks)

## Success Criteria

### After Each Task
- All existing tests pass
- `npm run lint` passes
- `npm run build` succeeds
- Game functionality remains identical

### After Each Phase
- Improved separation of concerns
- Reduced component complexity
- Enhanced testability
- Maintained 60fps performance

### Final Success Metrics
- **Maintainability**: Each file has single, clear responsibility
- **Testability**: >80% test coverage for game logic
- **DRY**: No code duplication across components  
- **Encapsulation**: Clear public/private interfaces
- **Performance**: Maintained smooth gameplay experience

## Risk Mitigation

### High Risk Areas
- Animation system changes (performance impact)
- Input system refactoring (user experience impact)
- Game state command pattern (complexity increase)

### Mitigation Strategies
- Implement feature flags for gradual rollout
- Extensive testing at each step
- Performance monitoring during development
- Rollback plan for each major change

This plan maintains existing functionality while systematically improving code organization, testability, and maintainability for future development.