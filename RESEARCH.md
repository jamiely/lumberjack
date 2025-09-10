# RESEARCH.md

## Implementation Plan Research for TODO.md Items

This document provides detailed research and context for implementing the issues identified in TODO.md, updated with user requirements.

## TODO Items Analysis (Updated with User Requirements)

### 1. Score Visibility Issue in Play Screen ✅ CLARIFIED

**Problem**: "The current score is not visible in the Play screen."

**User Requirements**:
- Score should appear above the playfield
- Keep current text color (no background panel needed)
- Increase size for arcade cabinet viewing (36px adequate but can be larger)

**Current Implementation Analysis**:
- Score is rendered in `src/components/scenes/PlayScreen.tsx:77-81`
- Uses `ScoreDisplay` component positioned at top center with transform
- Style: `position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)'`
- Current fontSize: '36px' in `src/components/ScoreDisplay.tsx:8`

**Root Cause Identified** (CONFIRMED VIA BROWSER INSPECTION):
- ScoreDisplay component has NO explicit text color defined (src/components/ScoreDisplay.tsx:8)
- Component inherits CSS color: rgb(33, 53, 71) = #213547 (dark blue) from light mode media query
- Score is positioned at top: 50px, left: 270px (center of screen) via PlayScreen.tsx positioning
- This places score over SKY BLUE BACKGROUND (#87CEEB), NOT over brown trunk area
- Dark blue text (#213547) against sky blue background (#87CEEB) creates invisible text
- Browser inspection confirms: score element exists and is accessible but visually invisible

**Implementation Plan**:
- Add explicit color property to ScoreDisplay component style object
- Use high-contrast color against #87CEEB background (white or black)
- Increase font size from 36px to 48px for better arcade visibility

### 2. Scroll Disable Issue ✅ CLARIFIED

**Problem**: "Disable scroll on the play field container (possibly root container)"

**User Requirements**:
- Disable scrolling just on the root container (ScreenContainer)
- Issue is probably with `overflow: 'auto'` setting
- Don't prevent all page scrolling

**Current Implementation Analysis**:
- Main container: `src/components/ScreenContainer.tsx:14-30`
- Current overflow setting: `overflow: 'auto'` (line 23)

**Implementation Plan**:
- Change ScreenContainer overflow from 'auto' to 'hidden'
- Keep other scroll behaviors intact

### 3. Background Height Cutoff Issue ✅ CLARIFIED

**Problem**: "Body/HTML element background is cutoff at the bottom compared to the root container"

**User Requirements**:
- Background color (#87CEEB) should fill entire viewport
- There's a white strip at the bottom when scrolling down
- Keep root container as-is, just ensure entire background is blue
- Don't worry about screens smaller than 540x960px

**Current Implementation Analysis**:
- Background color inconsistency between elements
- ScreenContainer has minHeight: 100vh but may not cover all cases
- Need to investigate white strip issue

**Implementation Plan**:
- Ensure all background elements use consistent #87CEEB color
- Fix white strip issue at bottom of page
- Maintain current container sizing

### 4. Attract Screen Overlay Issue ✅ CLARIFIED

**Problem**: "There is some overlay on top of the Attract screen that makes the color of the playfield not match the background"

**User Requirements**:
- AttractScreen should have same background color as PlayScreen (#87CEEB)
- Both screens should have matching colored backgrounds

**Current Implementation Analysis**:
- AttractScreen ScreenContainer: `backgroundColor="#2c5234"` (dark forest green) 
- PlayScreen ScreenContainer: `backgroundColor="#2c5234"` (also dark green)
- GameBoard always uses #87CEEB background
- GameBoard in static mode has 0.8 opacity

**Root Cause Identified**:
- Both screens use dark green (#2c5234) container background
- GameBoard uses sky blue (#87CEEB) background
- In PlayScreen: opaque GameBoard covers container background
- In AttractScreen: semi-transparent GameBoard (0.8 opacity) shows dark green underneath

**Implementation Plan**:
- Change both AttractScreen and PlayScreen ScreenContainer to use #87CEEB
- This will make backgrounds consistent across all screens

### 5. Branch Animation Issue ✅ CLARIFIED

**Problem**: "After a chop and tree segment is animated out, the branch should remain affixed to the tree trunk. Right now it rotates independently."

**User Requirements**:
- Treat segment as one object (branch + trunk) and rotate together
- Branch should maintain relative position to trunk throughout animation
- Keep existing rotation speed/physics
- Render trunk and branch as single element that rotates together

**Current Implementation Analysis**:
- Trunk and branch rendered as separate elements with same rotation
- Both rotate around their individual centers, not as a unit
- Branch positioned relative to trunk but with independent transform origin

**Implementation Plan**:
- Refactor animated segment rendering to treat trunk+branch as single unit
- Use wrapper container with single rotation transform
- Position branch relative to trunk within the wrapper
- Keep existing rotation calculation and speed

## Current Architecture Context

### Component Structure
```
App (src/App.tsx)
└── SceneManager (src/components/SceneManager.tsx)
    ├── AttractScreen (src/components/scenes/AttractScreen.tsx)
    ├── PlayScreen (src/components/scenes/PlayScreen.tsx)
    └── GameOverScreen (src/components/scenes/GameOverScreen.tsx)
```

### Key Components and Their Responsibilities

**PlayScreen** (`src/components/scenes/PlayScreen.tsx`):
- Main game screen orchestration
- Score display overlay (lines 68-81)
- Debug panel overlay (lines 83-99)
- GameBoard integration (lines 46-54)

**GameBoard** (`src/components/GameBoard.tsx`):
- Canvas-like game rendering (540x960px)
- Tree segment rendering (lines 94-120)
- Player character rendering (lines 122-131)
- Animated segment system (lines 134-175)

**ScreenContainer** (`src/components/ScreenContainer.tsx`):
- Fixed aspect ratio container (540x960px)
- Background color management
- Responsive centering

**ScoreDisplay** (`src/components/ScoreDisplay.tsx`):
- Simple score text rendering (36px font)
- No explicit styling for visibility

### Styling Architecture

**Global Styles** (`src/style.css`):
- Root background: #87CEEB (sky blue)
- Body/HTML: Full height, centered layout
- App container: Full size, flex centering

**Component Styles**:
- Inline styles throughout components
- No CSS modules or styled-components
- Fixed pixel-based positioning

### Game State Management

**Core State** (`src/game/GameState.ts`):
- TreeSegment interface for static segments
- AnimatedSegment interface for flying pieces
- GameState interface with player, score, tree data

**Game Logic** (`src/game/GameLogic.ts`):
- performChop: Creates animated segments, updates score
- Animation creation: Lines 34-43 with position and timing data

### Animation System

**Implementation** (`src/components/GameBoard.tsx:31-81`):
- RequestAnimationFrame-based animation loop
- 1000ms duration, 500px/second speed
- Automatic cleanup when segments leave bounds
- Independent rotation for trunk and branch pieces

## Technical Debt and Considerations

### Styling Approach
- Heavy reliance on inline styles makes maintenance difficult
- No consistent color/spacing variables
- Limited responsive design considerations

### Animation System
- Current animation creates visual artifacts (independent branch rotation)
- No animation state management beyond simple arrays
- Performance considerations for multiple concurrent animations

### Component Architecture
- Good separation between game logic and presentation
- Clear screen management pattern
- Could benefit from more granular component breakdown

## Implementation Complexity Assessment (Updated)

1. **Score Visibility** - LOW: Investigate visibility issue, possibly increase font size
2. **Scroll Disable** - LOW: Change overflow property in ScreenContainer
3. **Background Height** - MEDIUM: Fix white strip issue and ensure consistent background color
4. **Attract Screen Overlay** - LOW: Change ScreenContainer background colors to #87CEEB
5. **Branch Animation** - MEDIUM: Refactor to use wrapper container with single rotation

## Detailed Implementation Plan

### Phase 1: Quick CSS Fixes (Low Risk)
1. **Scroll Disable**: Change `src/components/ScreenContainer.tsx:23` from `overflow: 'auto'` to `overflow: 'hidden'`
2. **Attract Screen Background**: Change `src/components/scenes/AttractScreen.tsx:25` from `backgroundColor="#2c5234"` to `backgroundColor="#87CEEB"`
3. **Play Screen Background**: Change `src/components/scenes/PlayScreen.tsx:39` from `backgroundColor="#2c5234"` to `backgroundColor="#87CEEB"`

### Phase 2: Background Color Investigation (Medium Risk)
1. **White Strip Issue**: Investigate and fix white strip appearing at bottom when scrolling
   - Check all elements using background colors
   - Ensure consistent #87CEEB usage across all containers
   - Test scrolling behavior after changes

### Phase 3: Score Visibility Investigation (Low Risk)
1. **Diagnose Issue**: Determine why score is not visible
   - Check text color inheritance
   - Verify positioning doesn't place it off-screen
   - Test contrast against #87CEEB background
2. **Potential Solutions**:
   - Add explicit text color if needed
   - Increase font size beyond 36px
   - Adjust positioning if necessary

### Phase 4: Animation Refactoring (Medium Risk)
1. **Branch Animation Fix**: Modify `src/components/GameBoard.tsx:134-175`
   - Create wrapper div for each animated segment
   - Apply rotation transform to wrapper
   - Position trunk and branch as children within wrapper
   - Ensure branch maintains relative position to trunk

## Testing Strategy

### Visual Validation Required
1. **Color Consistency**: Verify all screens have matching #87CEEB backgrounds
2. **Score Visibility**: Confirm score is clearly visible during gameplay
3. **Animation Physics**: Test that branch stays attached to trunk during rotation
4. **Scroll Behavior**: Verify no unwanted scrolling in game container

### Regression Testing
- Ensure all existing functionality remains intact
- Test keyboard input (arrow keys) still works
- Verify game logic (chopping, collision detection) unchanged
- Confirm screen transitions work properly

## Risk Assessment

**Low Risk Items** (Phases 1 & 3):
- Simple CSS property changes
- No logic modifications
- Easy to revert if issues arise

**Medium Risk Items** (Phases 2 & 4):
- Background color investigation may reveal deeper CSS issues
- Animation refactoring touches complex rendering logic
- Changes affect visual presentation significantly

## Files to Modify

### Confirmed Changes:
1. `src/components/ScreenContainer.tsx` - overflow property
2. `src/components/scenes/AttractScreen.tsx` - background color
3. `src/components/scenes/PlayScreen.tsx` - background color
4. `src/components/GameBoard.tsx` - animation rendering (branch fix)

### Investigation Required:
1. `src/style.css` - background color consistency
2. `src/components/ScoreDisplay.tsx` - text visibility
3. Various components - white strip issue source