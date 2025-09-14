# Questions for Clarification - Lumberjack Game Refactoring

## High-Priority Implementation Decisions

### 1. **Animation System Refactoring Approach**
**Context**: RESEARCH.md proposes extracting animation logic from GameBoard.tsx into an AnimationManager class.

**Questions**:
- Should the AnimationManager be a singleton service or an instance created per game session?
one instance per app lifetime

- Do you prefer the proposed class-based approach or would you prefer a functional approach using hooks/contexts?
class-based approach

- Should animations be managed through a global state (like Redux/Zustand) or kept local with the proposed AnimationManager?
local

### 2. **Game State Management Pattern**
**Context**: RESEARCH.md suggests implementing a Command pattern with GameStateMachine for state updates.

**Questions**:
- Are you comfortable with the Command pattern complexity, or would you prefer a simpler reducer-based approach?
command pattern is fine

- Should the GameEventEmitter be a custom implementation or should we use an existing event library?
Can we use the HTML EventTarget concept?

- How important is undo/redo functionality? (This would influence the command pattern implementation)
- We don't need undo/redo

### 3. **Constants Organization Strategy**
**Context**: RESEARCH.md proposes splitting the large constants.ts file into domain-specific files.

**Questions**:
- Should we create a nested folder structure (e.g., `config/game/`, `config/ui/`, `config/audio/`) or keep flat files?
flat files

- Do you want environment-specific configuration (development/production) or just the base configuration?
no

- Should configuration be runtime-changeable or compile-time only?
compile time

### 4. **Input System Architecture**
**Context**: RESEARCH.md suggests unifying keyboard and mouse input handling.

**Questions**:
- Should the unified input system support gamepad/controller input for future expansion?
no

- Do you want the input system to be configurable (custom key bindings) or hardcoded?
hardcoded

- Should input handling be completely abstracted from components or is some direct event handling acceptable?
completely abstracted

### 5. **Character System Refactoring Scope**
**Context**: RESEARCH.md proposes a unified Character interface and factory pattern.

**Questions**:
- Are you planning to add more character types in the future? (This affects the abstraction level needed)
yes

- Should character selection be completely random or do you want user choice/progression systems?
random for now, but I may want to add character selection on non-arcade platforms later

- Do characters need different gameplay mechanics or just visual differences?
visual differences

### 6. **Testing Strategy Priority**
**Context**: RESEARCH.md identifies testing infrastructure gaps.

**Questions**:
- What's your preferred balance between unit tests vs integration tests vs e2e tests?
mostly unit tests
fewer integration tests
even fewer e2e tests

- Should we focus on testing game logic first or component behavior first?
either

- Are performance benchmarks important, or just functional correctness?
functional correctness

### 7. **Implementation Timeline**
**Context**: RESEARCH.md suggests a 4-week phased approach.

**Questions**:
- What's your preferred refactoring pace - all at once or gradual incremental changes?
gradual

- Which refactoring areas are most important to you personally?
no pref

- Should we maintain 100% backward compatibility during refactoring or are breaking changes acceptable?
breaking changes are ok as long as the game runs

### 8. **Service Layer Architecture**
**Context**: RESEARCH.md proposes HighScoreService and CharacterSelectionService classes.

**Questions**:
- Should these services be injectable/mockable for testing or simple static classes?
injectable

- Do you want these services to be persistent (localStorage) or session-based?
local storage

- Should services have async capabilities for future API integration?
no

## Medium-Priority Clarifications

### 9. **Layout System Approach**
- Do you want CSS-in-JS, CSS modules, or traditional CSS for the layout system?
css modules

- Should layout be responsive or fixed for game consistency?
responsive, but prioritizing the arcade display

### 10. **Audio System Integration**
- Are you planning to add more complex audio features (music, sound mixing)?
no
- Should audio be completely optional/disable-able?
no

### 11. **Performance Requirements**
- What's the target FPS for the game?
- Are there memory usage constraints we should consider?

don't worry about this for now
