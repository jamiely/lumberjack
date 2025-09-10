# PLAN.md

## Implementation Plan for TODO.md Issues

This document provides detailed implementation steps for addressing the five issues identified in TODO.md, based on the research conducted in RESEARCH.md.

## Implementation Strategy

The plan is organized into four phases based on complexity and risk level, allowing for incremental progress and easier debugging.

## Phase 1: Quick CSS Fixes (Low Risk)

### Issue 2: Disable Scroll on Container
**File**: `src/components/ScreenContainer.tsx`
**Function/Location**: Style object (around line 23)
**Change**: 
- Modify the `overflow` property from `'auto'` to `'hidden'`
- This prevents unwanted scrolling within the game container

**Implementation**:
```typescript
// Current: overflow: 'auto'
// Change to: overflow: 'hidden'
```

### Issue 4: Attract Screen Background Color
**File**: `src/components/scenes/AttractScreen.tsx` 
**Component**: `AttractScreen` function
**Location**: ScreenContainer backgroundColor prop (around line 25)
**Change**:
- Change `backgroundColor="#2c5234"` to `backgroundColor="#87CEEB"`
- This matches the sky blue background used elsewhere

### Issue 4: Play Screen Background Color  
**File**: `src/components/scenes/PlayScreen.tsx`
**Component**: `PlayScreen` function  
**Location**: ScreenContainer backgroundColor prop (around line 39)
**Change**:
- Change `backgroundColor="#2c5234"` to `backgroundColor="#87CEEB"`
- Ensures consistency with AttractScreen

## Phase 2: Score Visibility Investigation (Low-Medium Risk)

### Issue 1: Score Not Visible in Play Screen
**Root Cause** (CONFIRMED VIA BROWSER INSPECTION): Text color inheritance creates invisible text
- ScoreDisplay has no explicit color property
- Inherits `color: rgb(33, 53, 71)` (#213547 dark blue) from CSS light mode media query
- Score positioned at top center (top: 50px) over sky blue background area, NOT trunk area  
- Dark blue (#213547) against sky blue (#87CEEB) creates completely invisible text

**File**: `src/components/ScoreDisplay.tsx`
**Component**: `ScoreDisplay` function
**Location**: Style object (line 8)
**Required Changes**:
```typescript
// Current style object:
style={{ marginBottom: '10px', fontSize: '36px' }}

// Change to:
style={{ 
  marginBottom: '10px', 
  fontSize: '48px',
  color: '#ffffff',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
}}
```

**Implementation Details**:
- Add `color: '#ffffff'` for high contrast against sky blue background
- Increase `fontSize` from '36px' to '48px' for better arcade visibility
- Add `fontWeight: 'bold'` for improved readability
- Add `textShadow` for better text definition against varying backgrounds

## Phase 3: Background Color Consistency (Medium Risk)

### Issue 3: Background Height Cutoff/White Strip
**Root Cause** (CONFIRMED VIA BROWSER INSPECTION): HTML element has white background
- HTML computed background: `rgb(255, 255, 255)` (white) instead of sky blue
- When content height (960px) > viewport height (744px), HTML white background shows through
- Body has correct sky blue but HTML background creates white strip on overflow

**File**: `src/style.css`
**Location**: HTML and body selectors (lines 35-43)
**Required Changes**:
```css
/* Current CSS has redundant/conflicting rules: */
html {
  height: 100%;
  background-color: #87CEEB;
}

html, body {
  height: 100%;
  background-color: #87CEEB;
}

/* Problem: The CSS isn't being applied properly to HTML element */
/* SOLUTION: Ensure HTML background is explicitly set */
/* Replace the above with: */
html {
  min-height: 100%;
  background-color: #87CEEB !important;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
  overflow-x: auto;
  background-color: #87CEEB;
}
```

**Implementation Details**:
- Add `!important` to HTML background-color to ensure it overrides browser defaults
- Change HTML height from `100%` to `min-height: 100%` for better overflow handling
- Keep body background as backup
- Remove redundant `html, body` selector that may be causing conflicts

## Phase 4: Animation System Refactoring (Medium-High Risk)

### Issue 5: Branch Animation Independence Fix
**File**: `src/components/GameBoard.tsx`
**Function**: Component render method
**Location**: Animated segments rendering (lines 134-175)

**Current Architecture**:
- Trunk and branch rendered as separate div elements
- Both apply same rotation transform independently
- Branch positioned relative to trunk but rotates around its own center

**New Architecture**:
- Create wrapper div for each animated segment
- Apply single rotation transform to wrapper
- Render trunk and branch as children within wrapper
- Branch positioned relative to trunk within wrapper

**Implementation Details**:

**New Interface** (add to existing types):
```typescript
interface AnimatedSegmentWrapper {
  animatedSegment: AnimatedSegment;
  rotation: number;
  position: { x: number; y: number };
}
```

**New Rendering Structure**:
```typescript
// Wrapper div with rotation transform
<div style={{
  position: 'absolute',
  left: wrapperX,
  top: wrapperY,
  transform: `rotate(${rotation}deg)`,
  transformOrigin: 'center center'
}}>
  {/* Trunk positioned at 0,0 within wrapper */}
  <div style={{ /* trunk styles */ }}>
    {/* trunk content */}
  </div>
  
  {/* Branch positioned relative to trunk within wrapper */}
  <div style={{ /* branch styles relative to trunk */ }}>
    {/* branch content */}
  </div>
</div>
```

**Animation Logic Changes**:
- Keep existing `rotation` calculation from `animationTime`
- Apply rotation only to wrapper container
- Position trunk at wrapper origin (0,0)
- Calculate branch position relative to trunk within wrapper
- Maintain existing 1000ms duration and physics

**Functions to Modify**:
- Animation rendering logic in GameBoard component
- May need to adjust trunk/branch positioning calculations
- Keep existing cleanup and bounds-checking logic

## Testing Strategy

### Phase 1 Testing
- Visual verification of background color consistency
- Test scroll behavior on ScreenContainer
- Verify no regression in screen transitions

### Phase 2 Testing  
- Confirm score visibility during active gameplay
- Test score display across different game states
- Verify positioning and readability

### Phase 3 Testing
- Test scrolling behavior across different screen sizes
- Verify no white strips or background gaps
- Check background consistency across all screens

### Phase 4 Testing
- Test branch animation during tree chopping
- Verify branch stays attached to trunk throughout rotation
- Confirm animation performance and cleanup
- Test multiple concurrent animated segments

## Risk Mitigation

### Low Risk (Phases 1-2)
- Simple CSS property changes with easy rollback
- No game logic modifications required
- Changes isolated to specific components

### Medium Risk (Phase 3)
- May reveal deeper CSS architecture issues
- Could affect responsive design
- Test thoroughly across different viewport sizes

### High Risk (Phase 4)
- Complex rendering logic modifications
- Potential performance implications
- Could affect game feel and user experience
- Requires careful testing of animation timing

## Dependencies and Prerequisites

1. Development server running (`npm run dev`)
2. Ability to test visual changes in browser
3. Access to different screen sizes for responsive testing
4. Understanding of React component lifecycle for animation changes

## Success Criteria

1. **Score Visibility**: Score clearly visible and readable during gameplay
2. **Scroll Behavior**: No unwanted scrolling within game container
3. **Background Consistency**: All screens show uniform #87CEEB background
4. **Branch Animation**: Branch segments rotate as single unit with trunk
5. **No Regressions**: All existing functionality preserved

## Implementation Order

Execute phases sequentially to isolate issues and minimize risk:
1. Phase 1 (CSS fixes) - Immediate visual improvements
2. Phase 2 (Score investigation) - Address usability issue  
3. Phase 3 (Background consistency) - Fix visual polish issues
4. Phase 4 (Animation refactor) - Complex feature enhancement

Each phase should be completed and tested before proceeding to the next to ensure stability and easier debugging.