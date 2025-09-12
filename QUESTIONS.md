# Implementation Questions

## Branch Sprite Implementation Questions

### 1. Branch Sizing and Scaling
- What should be the target display dimensions for branches in the game?
a width of 170 and scale the branch using aspect ratio.

- Do flying branches need the same dimensions as static tree branches, or different scaling?
same

### 2. Branch Positioning and Alignment
- The branch.png sprite has a different shape than the current rectangles - do we need to adjust the positioning offsets?
no
- Should the branch sprite be centered on the current branch positions, or aligned differently (e.g., branch base aligned with trunk edge)?
center them for now

- How should the CSS `transform-origin` be set for the left-side mirrored branches to ensure proper alignment?

bottom-left side if possible

### 3. Animation Compatibility
- Are there any specific requirements for how flying branches should animate with the new sprite?

no it should be the same way

- Should flying branches rotate during their animation, or maintain the same orientation as static branches?
yes

- Do we need to update collision detection boundaries due to the sprite's irregular shape vs. rectangles?
no

### 4. Visual Style Preferences
- Is the current branch.png sprite style acceptable, or would you prefer any visual adjustments?
yes

- Should branches have any visual effects (shadows, outlines) to match other game elements?
no

- Any preference for how the mirrored left branches should look - any concerns about the flipped appearance?
no

### 5. Performance and Implementation
- Any preference between Phase 1 (direct BranchSprite) vs. immediately implementing the common Sprite system?
No preference

- Should we prioritize getting branches working quickly, or take more time for the unified architecture?
yes

- Are there any other sprite assets planned that would benefit from the common Sprite component design?
yes there will be text sprites later

## Current Assumptions
- Using CSS `transform: scaleX(-1)` for left-side branch mirroring
- Maintaining existing branch positioning system with sprite replacements  
- Two-phase implementation: BranchSprite first, then common Sprite refactoring
- Branch sprites will replace both static tree branches and flying branch animations