# PLAN.md - Implementation Plan for Lumberjack2 TODO Items

## Overview

This plan addresses 6 TODO items for the Lumberjack2 game, organized into three phases based on priority and dependencies. Total estimated time: 90 minutes.

## Implementation Phases

### Phase 1: Quick Fixes (30 minutes)
Core infrastructure and rendering improvements with minimal risk.

### Phase 2: Character System (45 minutes) 
Player-facing functionality requiring character system modifications.

### Phase 3: Edge Cases (15 minutes)
Game over state handling improvements.

## Detailed Implementation Plan

### TODO #1: Add typecheck npm script and integrate with check command
**Priority:** Critical | **Phase:** 1 | **Time:** 5 minutes

**Current Issue:**
- Missing standalone `typecheck` script in package.json
- `check` command doesn't validate TypeScript

**Files to Modify:**
- `package.json`

**Implementation:**
1. Add `"typecheck": "tsc --noEmit"` to scripts section
2. Update check script: `"check": "npm run typecheck && npm test -- --run && npm run lint && npm run test:e2e"`

**Verification:**
- `npm run typecheck` succeeds
- `npm run check` includes TypeScript validation

---

### TODO #4: Fix branch/trunk rendering order (z-index)
**Priority:** High | **Phase:** 1 | **Time:** 10 minutes

**Current Issue:**
- Branches may render on top of trunk instead of behind

**Files to Modify:**
- `src/components/GameBoard.tsx:125-133`

**Implementation:**
1. Examine current JSX rendering order in GameBoard.tsx
2. Reorder elements for proper layering:
   - Background elements first
   - Branches behind trunk
   - Trunk segments
   - Player on top

**Verification:**
- Visual inspection shows branches behind trunk
- Player renders on top of all elements

---

### TODO #2: Branch/trunk gap positioning issue  
**Priority:** Medium | **Phase:** 1 | **Time:** 15 minutes

**Current Issue:**
- Gap between branches and trunk due to misaligned positioning constants

**Files to Modify:**
- `src/constants.ts` (branch and trunk positioning constants)
- `src/components/BranchSprite.tsx` (positioning logic)

**Implementation:**
1. Examine current positioning:
   - `TREE_TRUNK_LEFT_POSITION` (230px) + `TREE_TRUNK_WIDTH` (80px) = 310px right edge
   - `BRANCH_LEFT_POSITION` (150px) and `BRANCH_RIGHT_POSITION` (310px)
2. Adjust `BRANCH_LEFT_POSITION` to align with trunk left edge (230px)
3. Ensure `BRANCH_RIGHT_POSITION` aligns with trunk right edge (310px)

**Verification:**
- Visual alignment of branches with trunk edges
- No regression in existing tests

---

### TODO #6: Character consistency across screens
**Priority:** High | **Phase:** 2 | **Time:** 30 minutes

**Current Issue:**
- Character reselected on every screen transition instead of maintaining consistency
- Attract → Play → GameOver should keep same character

**Files to Modify:**
- `src/components/SceneManager.tsx`
- `src/utils/characterSelection.ts` (understand current logic)

**Implementation:**
1. Add character state management to SceneManager:
   ```typescript
   const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null)
   ```

2. Modify scene transition handlers:
   - `handleStartGame()`: Select character only if none selected (first time)
   - `handleRestart()`: Keep same character
   - `handleReturnToAttract()`: Clear character for new session

**Flow Requirements:**
- Attract → Play: Character selected once
- Play → GameOver → Play: Same character maintained
- GameOver → Attract: Character cleared for new selection

**Verification:**
- Character consistency through game session
- Character changes only on new session from attract

---

### TODO #3: Lumberjack facing direction issue
**Priority:** Medium | **Phase:** 2 | **Time:** 15 minutes

**Current Issue:**
- Player always faces left regardless of position
- Should face toward trunk (right when on left side, left when on right side)

**Files to Modify:**
- `src/components/Player.tsx`
- Character configs in `src/characters/*/config.ts`

**Implementation:**
1. Check character configs have both left and right facing sprites
2. Add facing direction logic to Player.tsx:
   ```typescript
   const shouldFaceRight = playerSide === 'left'  // Face right when on left side
   const spriteDirection = shouldFaceRight ? 'right' : 'left'
   ```
3. Update sprite selection to use direction

**Verification:**
- Player on left side faces right
- Player on right side faces left
- Animation states maintain correct facing direction

---

### TODO #5: Game over player position rendering
**Priority:** Low | **Phase:** 3 | **Time:** 15 minutes

**Current Issue:**
- Player position may not render correctly when hit by branch in game over state

**Files to Examine:**
- `src/components/scenes/GameOverScreen.tsx`
- `src/components/GameBoard.tsx` (mode="frozen")
- `src/hooks/useGameState.ts` (game over state handling)

**Implementation:**
1. Trace game over flow to ensure final player position is captured
2. Verify GameOverScreen passes correct final state to GameBoard
3. Ensure GameBoard frozen mode renders player under branch that caused game over

**Verification:**
- Player position correctly shown in game over screen
- Player appears under the branch that caused game over

## Quality Gates

After each phase, run these commands to ensure no regressions:

1. **Tests**: `npm test` - All tests must pass
2. **Linting**: `npm run lint` - No warnings allowed
3. **TypeScript**: `npm run typecheck` - No type errors (after TODO #1)
4. **Build**: `npm run build` - Must succeed
5. **E2E**: `npm run test:e2e` - Integration tests must pass

## Implementation Order Rationale

### Phase 1: Infrastructure First
- **TODO #1** enables proper TypeScript validation for remaining work
- **TODO #4** fixes visual rendering without gameplay logic changes  
- **TODO #2** addresses positioning constants used by other components

### Phase 2: Character System
- **TODO #6** establishes character persistence required for **TODO #3**
- **TODO #3** builds on character system improvements

### Phase 3: Edge Cases
- **TODO #5** addresses game over state, less critical than active gameplay

## Dependencies

- All TODOs can be implemented independently except:
  - TODO #6 should be completed before TODO #3 (character system dependency)
  - TODO #1 should be completed first to enable proper validation

## Risk Assessment

**Low Risk:**
- TODO #1: Simple script additions
- TODO #4: JSX reordering  
- TODO #2: Constant adjustments

**Medium Risk:**
- TODO #6: State management changes across scene transitions
- TODO #3: Sprite direction logic modifications

**Low Risk:**
- TODO #5: Game over state rendering (edge case scenario)

## Success Criteria

- All 6 TODO items resolved
- No test regressions
- No linting errors
- Successful production build
- Character consistency maintained across game sessions
- Proper visual alignment and layering
- TypeScript validation integrated into build pipeline