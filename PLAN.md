# Implementation Plan: TODO.md UI/UX Enhancements

This plan details the precise implementation steps for all 5 TODO items based on the research analysis.

## Phase 1: Background & Basic UI Cleanup (Low Risk) ✅

### 1.1 Background Styling Fix ✅
**File:** `src/style.css`
- ✅ Change body background-color from `#242424` to `#87CEEB` to match play field color
- ✅ This eliminates black borders and creates seamless background

**File:** `src/components/GameBoard.tsx`
- ✅ Remove the `border: '2px solid #333'` style property from GameBoard container
- ✅ Keep existing `backgroundColor: '#87CEEB'` for play field

### 1.2 Game Over Screen Text Cleanup ✅
**File:** `src/components/scenes/GameOverScreen.tsx`
- ✅ Remove the countdown text display ("Returning to attract") completely
- ✅ Preserve the timer logic and auto-transition functionality
- ✅ Keep all other game over elements (score, high score, restart prompt)

### 1.3 Play Screen Score Display Cleanup ✅
**File:** `src/components/ScoreDisplay.tsx`
**Remove the following text elements:**
- ✅ Line 10: "Score: " prefix → keep only the numeric score
- ✅ Lines 12-14: Instructional text → remove "Use left/right arrows to chop and switch sides • Press '?' to toggle debug info"
- ✅ Lines 15-19: Game over text → remove "GAME OVER! Hit a branch. Press 'R' to restart." from play screen display
- ✅ Increase font size to 200% of current size

## Phase 2: Layout Improvements (Medium Risk) ✅

### 2.1 Play Screen Score Repositioning ✅
**File:** `src/components/scenes/PlayScreen.tsx`
- ✅ Center the ScoreDisplay component horizontally
- ✅ Position in upper middle area of screen
- ✅ Ensure score is prominent and visible for arcade display
- ✅ No other text elements need removal (DebugPanel is toggle-controlled, accessibility title should remain)

### 2.2 Attract Screen Layout Restructuring ✅
**File:** `src/components/scenes/AttractScreen.tsx`

**Remove Current Centered Overlay:**
- ✅ Lines 42-93: Remove entire centered overlay with background and border styling
- ✅ Extract content elements to be repositioned separately

**Create New Layout Elements:**

**Top Banner (High Score):**
- ✅ Extract high score from current overlay
- ✅ Create top banner spanning full width of game screen (540px)
- ✅ Position at top of screen overlaying the game field
- ✅ Text format: "All time highscore: XX"
- ✅ Minimal padding, sized to fit text

**Vertical Center (Game Title):**
- ✅ Extract "LUMBERJACK" title from current overlay
- ✅ Position in vertical center of screen without overlay styling
- ✅ Center both horizontally and vertically
- ✅ Maintain appropriate font size for arcade visibility

**Bottom Overlay:**
- ✅ Extract "PRESS ANY BUTTON TO PLAY" and controls text
- ✅ Position at bottom of screen
- ✅ Keep existing styling for visibility

## Phase 3: Flying Tree Segment Animation (High Priority) ✅

### 3.1 Game State Extensions ✅
**File:** `src/game/GameState.ts`
- ✅ Add `AnimatedSegment` interface with properties:
  - `branchSide`: 'left' | 'right' | 'none'
  - `animationId`: string (unique identifier)
  - `startTime`: number (for animation timing)
  - `direction`: 'left' | 'right' (movement direction)
  - `startPosition`: {x: number, y: number} (initial position)
- ✅ Add `animatedSegments: AnimatedSegment[]` array to GameState interface

### 3.2 Game Logic Modifications ✅
**File:** `src/game/GameLogic.ts`
- ✅ Modify `performChop()` function to create animated segments instead of immediate removal
- ✅ Calculate direction based on player position (opposite direction)
- ✅ Generate unique animation IDs for each flying segment
- ✅ Set start position based on chopped tree segment location

### 3.3 Animation Rendering System ✅
**File:** `src/components/GameBoard.tsx`
- ✅ Add new render layer for flying segments above game field
- ✅ Implement animation loop using useEffect + requestAnimationFrame
- ✅ Calculate linear movement with rotation for each animated segment
- ✅ Remove segments when they exit viewport bounds (540x960)
- ✅ Use simple CSS transforms for position and rotation

### 3.4 State Management Integration ✅
**File:** `src/hooks/useGameState.ts`
- ✅ Add animation cleanup logic to prevent memory leaks
- ✅ Implement segment removal when animation completes
- ✅ Integrate animated segment state updates with game loop
- ✅ Ensure animations don't interfere with core gameplay

## Phase 4: Testing Implementation

### 4.1 Update Existing Tests ✅
**Files to modify:**
- ✅ `src/components/__tests__/ScoreDisplay.test.tsx` - Update for text removal changes
- ✅ `src/App.test.tsx` - Update for layout restructuring  
- ✅ `src/__tests__/GameplayIntegration.test.tsx` - Update for score display changes
- ✅ All test files updated and passing

### 4.2 New Animation Tests ✅
**File:** `src/components/__tests__/GameBoard.test.tsx`
- ✅ Add tests for flying segment animation rendering
- ✅ Test segment cleanup when out of bounds
- ✅ Verify animation doesn't break during rapid chopping

**File:** `src/__tests__/GameplayIntegration.test.tsx`
- ✅ Add integration tests to ensure animations don't interfere with gameplay
- ✅ Test complete chop-to-animation workflow
- ✅ Verify game state consistency during animations

## Implementation Strategy

### Development Order
1. Implement all changes systematically in phases
2. Test each phase before proceeding to next
3. Use `npm run dev` at 540x960 resolution for testing
4. Run `npm run lint` and `npm run test` after each phase

### Key Technical Considerations
- **Animation Performance**: Use requestAnimationFrame for smooth 60fps animation
- **Memory Management**: Clean up animated segments when they exit bounds
- **State Preservation**: Maintain all existing game functionality
- **Visual Consistency**: Ensure changes work at both 540x960 and 1080x1920 resolutions
- **Physics Simplicity**: Linear movement with rotation, no complex physics simulation

### Risk Mitigation
- Start with low-risk styling changes to build confidence
- Test each component change independently
- Maintain existing game loop timing and behavior
- Implement animation with good separation of concerns for maintainability

### Success Criteria
- All 5 TODO items implemented without breaking existing functionality
- Animations are smooth and performant
- Layout changes work across different screen sizes
- All tests pass including new animation tests
- Game maintains arcade-appropriate visual appeal