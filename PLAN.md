# Branch Sprite Implementation Plan

## Overview
Replace current rectangle-based branch rendering with sprite-based system using branch.png (340×248px) scaled to 170×124px display size. Implement two-phase approach: direct BranchSprite component first, then common sprite system refactoring.

## Phase 1: Branch Sprite Implementation

### 1. Add Branch Sprite Constants
**File**: `src/constants.ts`
- Add `BRANCH_SPRITE_PATH = '/images/branch.png'`
- Add `BRANCH_WIDTH = 170` 
- Add `BRANCH_HEIGHT = 124` (calculated from aspect ratio)
- Add sprite-related constants alongside existing trunk constants

### 2. Create BranchSprite Component
**File**: `src/components/BranchSprite.tsx`
- Create functional component with TypeScript interface
- Props: `side: 'left' | 'right'`, optional `className`, `style`
- Implement directional logic:
  - Right branches: use sprite as-is
  - Left branches: apply `transform: scaleX(-1)` with `transform-origin: bottom-left`
- Set dimensions: 170px width × 124px height
- Use `backgroundImage: url('/images/branch.png')`
- Include `backgroundSize: cover` for proper scaling

### 3. Update GameBoard Component
**File**: `src/components/GameBoard.tsx` (around lines 125-133)
- Import BranchSprite component
- Replace branch rectangle div elements with BranchSprite components
- Update left branch rendering to use `<BranchSprite side="left" />`
- Update right branch rendering to use `<BranchSprite side="right" />`
- Maintain existing positioning logic (absolute positioning with calculated offsets)
- Preserve existing className and styling patterns

### 4. Update Flying Branch Animations
**Files**: Identify and update files handling flying branch animations
- Replace rectangle-based flying branches with BranchSprite components
- Maintain existing animation behavior (rotation, movement)
- Ensure BranchSprite works with CSS animations/transforms
- Keep same collision detection boundaries

### 5. Testing and Verification
- Test static branches render correctly on both sides
- Verify left branches are properly mirrored
- Test flying branch animations work with new sprites
- Verify collision detection still functions
- Check visual alignment and scaling

## Phase 2: Common Sprite System (Future)

### 6. Create Common Sprite Component
**File**: `src/components/Sprite.tsx`
- Extract shared sprite functionality from BranchSprite
- Implement SpriteProps interface:
  ```typescript
  interface SpriteProps {
    src: string;
    width: number;
    height: number;
    className?: string;
    style?: CSSProperties;
    transform?: string;
  }
  ```

### 7. Refactor BranchSprite
**File**: `src/components/BranchSprite.tsx`
- Refactor to use common Sprite component internally
- Keep existing BranchSprite API unchanged
- Move directional logic to wrapper around Sprite component

### 8. Convert Trunk Rendering
**File**: `src/components/GameBoard.tsx`
- Replace trunk CSS backgroundColor with Sprite component
- Add trunk sprite constants to constants.ts
- Update trunk segments to use common sprite system

## Implementation Details

### BranchSprite Component Structure
```typescript
interface BranchSpriteProps {
  side: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const BranchSprite: React.FC<BranchSpriteProps> = ({ side, className, style }) => {
  const transform = side === 'left' ? 'scaleX(-1)' : undefined;
  const transformOrigin = side === 'left' ? 'bottom-left' : undefined;
  
  return (
    <div
      className={className}
      style={{
        width: BRANCH_WIDTH,
        height: BRANCH_HEIGHT,
        backgroundImage: `url(${BRANCH_SPRITE_PATH})`,
        backgroundSize: 'cover',
        transform,
        transformOrigin,
        ...style
      }}
    />
  );
};
```

### Constants to Add
```typescript
// Branch sprite constants
export const BRANCH_SPRITE_PATH = '/images/branch.png';
export const BRANCH_WIDTH = 170;
export const BRANCH_HEIGHT = 124; // 170 * (248/340) = 124
```

## Success Criteria
- ✅ Branch rectangles replaced with sprite rendering
- ✅ Left branches properly mirrored using CSS transforms
- ✅ Flying branch animations work with new sprites
- ✅ No visual regressions in branch positioning
- ✅ Collision detection remains functional
- ✅ Code follows existing patterns and TypeScript conventions
- ✅ All tests pass after implementation

## Files to Modify
1. `src/constants.ts` - Add branch sprite constants
2. `src/components/BranchSprite.tsx` - New component (create)
3. `src/components/GameBoard.tsx` - Replace branch rectangles with BranchSprite
4. Flying branch animation files - Update to use BranchSprite (identify during implementation)

## Preparation Steps
1. Identify current branch rendering locations in GameBoard.tsx
2. Locate flying branch animation implementation
3. Examine existing component patterns for consistency
4. Review current branch positioning and styling logic