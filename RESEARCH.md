# Background Game Display Research

## Current State Analysis

### Existing Architecture
- **Scene Management**: Uses `SceneManager` with three distinct screens: `attract`, `play`, `gameOver`
- **Screen Isolation**: Each screen is completely separate with no shared game state display
- **Game Field Size**: Currently fixed at 400x500px in `GameBoard` component (src/components/GameBoard.tsx:13-14)
- **Target Size**: Should be 540x960 (full screen, 9:16 aspect ratio)
- **Layout Approach**: Each screen uses full viewport (`minHeight: '100vh'`) with centered content

### Current Screen Implementations

#### AttractScreen (src/components/scenes/AttractScreen.tsx)
- Full-screen layout with title, high score, and instructions
- No game field displayed - only text and UI elements
- Green background (#2c5234) 

#### GameOverScreen (src/components/scenes/GameOverScreen.tsx)  
- Full-screen layout showing scores and restart options
- Dark background (#1a1a1a)
- No game field displayed - final game state is not preserved/shown

#### PlayScreen (src/components/scenes/PlayScreen.tsx)
- Contains the actual GameBoard component with game field
- Game field dimensions: 400x500px with sky blue background (#87CEEB)
- Tree segments, branches, and player character rendered here

## Requirements Analysis

Based on GAME_DESIGN.md and user requirements:

### Target Layout Specifications
- **Base Resolution**: 540x960 (9:16 aspect ratio)
- **Production**: 1080x1920 arcade display
- **Game Field**: Should be consistent size across all screens

### Required Changes
1. **Full Screen Layout**: All screens should be 540x960 (full target resolution)
2. **Background Game Display**: Attract and Game Over screens need to show game state
3. **Game State Preservation**: Game Over screen must show final collision state
4. **Consistent Sizing**: Remove current 400x500px game field constraint

## Implementation Strategy

### MVP Approach

#### 1. Full Screen Layout Implementation
- Create shared screen container component with 540x960 dimensions
- Remove game field size constraints - use full screen area
- Implement proper scaling/scrolling for different viewport sizes

#### 2. Background Game State Management
- **Attract Screen**: Show initial/default game state (static display)
- **Game Over Screen**: Preserve and display the final game state (frozen at collision moment)

#### 3. Component Architecture Changes

```
Current:
AttractScreen -> [No Game Display]
PlayScreen -> GameBoard (interactive)  
GameOverScreen -> [No Game Display]

Proposed MVP:
AttractScreen -> GameBoard (initial state, static)
PlayScreen -> GameBoard (interactive)
GameOverScreen -> GameBoard (final state, frozen)
```

### Technical Implementation Plan

#### Phase 1: Full Screen Layout Container
1. Create `ScreenContainer` component with 540x960 dimensions
2. Modify all three screens to use full screen layout
3. Update GameBoard to use full available space instead of fixed 400x500px

#### Phase 2: Static Game Display for Attract Screen  
1. Use initial game state from `createInitialGameState()` for attract screen
2. Integrate static game state into AttractScreen 
3. No input handling needed for static display

#### Phase 3: Final State Preservation
1. Modify SceneManager to pass final game state to GameOverScreen
2. Update GameOverScreen to display frozen game state
3. Show collision state where branch intersects player

### Key Components to Modify

1. **SceneManager.tsx**: Pass game state between screens
2. **AttractScreen.tsx**: Add static game display 
3. **GameOverScreen.tsx**: Add final state display
4. **GameBoard.tsx**: Support different interaction modes (static, interactive, frozen)

### Static Game Display Implementation

#### Simple Initial State Display (Recommended for MVP)
- Use `createInitialGameState()` to show consistent starting game state
- No animation or interaction needed
- Lightweight and predictable

### Scaling Considerations

Implementing 540x960 base resolution aligns with GAME_DESIGN.md:
- 540x960 scales perfectly to 1080x1920 (2x scaling)
- Maintains proper 9:16 aspect ratio throughout
- Allows scrolling on smaller desktop screens during development
- Ready for arcade cabinet deployment

## Implementation & Testing Plan

### Development Steps
1. Create ScreenContainer component with 540x960 dimensions
2. Update GameBoard component to use full screen space
3. Add static initial game state to AttractScreen with GameBoard
4. Preserve and display final state in GameOverScreen with GameBoard
5. Test full screen layout with scrolling on various viewport sizes

### Testing Requirements
1. **Unit Tests**: Test new components (ScreenContainer, updated GameBoard)
2. **Component Tests**: Test all three screens with new layouts
3. **Integration Tests**: Test screen transitions with game state preservation
4. **E2E Tests**: Test complete user flows across all screens
5. **Quality Gates**: Ensure `npm run check` passes (unit tests + lint + e2e)

### Quality Assurance
- All existing tests must continue to pass
- New functionality must be covered by tests
- Code must pass ESLint with zero warnings
- E2E tests must verify visual consistency across screens