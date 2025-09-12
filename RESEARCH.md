# Tree Trunk Sprite Implementation Research

## Current Implementation Analysis

### Tree Trunk Rendering (GameBoard.tsx:125-133)
Currently, tree trunks are rendered as simple brown rectangular divs using CSS styling:
- **Color**: `#8B4513` (dark brown)
- **Dimensions**: 150px width × 155px height (90% of player height) - **INCORRECT PROPORTIONS**
- **Border**: 4px solid black border
- **Positioning**: Absolute positioning with calculated bottom offsets

**Issue Identified**: The current 150x155px (0.97:1 ratio) actually matches reasonable proportions, but we need to use the actual trunk.png sprite instead of CSS colors.

### Existing Sprite System
The codebase already has a sophisticated sprite system for the lumberjack character:

#### LumberjackSprite Component (LumberjackSprite.tsx)
- Uses CSS `backgroundImage` with sprite sheet positioning
- Handles multiple sprite states (idle, chopping, hit)
- Implements scaling via `SPRITE_SCALE_FACTOR`
- Uses `backgroundPosition` to show different sprite regions
- Includes advanced features like `clipPath` for precise cropping

#### Sprite Constants (constants.ts:51-78)
- **Sprite sheet path**: `/images/lumberjack.png`
- **Scaling system**: Configurable display size with scale factor
- **Coordinate system**: Precise sprite coordinates for each state
- **Flexible sizing**: Multiple size options (150-300px)

### Available Assets
- **Lumberjack sprite**: `/public/images/lumberjack.png` (existing, complex sprite sheet)
- **Trunk sprite**: `/public/images/trunk.png` (confirmed exists, simple single image)

## Refactoring Opportunities

### 1. Refactoring Assessment: Simple vs Complex Sprites
**Lumberjack**: Complex sprite sheet with multiple states, coordinates, scaling, clipping
**Trunk**: Simple single image pattern - just a texture

**Refactoring Analysis**:
- **Different complexity levels** - trunk doesn't need sprite sheet infrastructure
- **Over-engineering risk** - creating TreeTrunkSprite component adds unnecessary complexity
- **Simple solution better** - direct backgroundImage replacement is cleaner
- **No shared abstractions needed** - the use cases are too different

### 2. Tree Trunk Sprite Implementation Options

#### Simple Repeating Pattern (Confirmed)
The `trunk.png` is a simple repeating bark texture pattern:
- **No sprite sheet complexity** - just a single repeating image
- **Simple `backgroundImage`** with the trunk.png file
- **No coordinate system needed** - no multiple states or frames
- **Much simpler than LumberjackSprite** - just image replacement for CSS background
- **Dimensions**: 300x310px (actual trunk.png size) needs scaling to fit 150x155px game size

### 3. Constants Organization
Add tree sprite constants alongside existing lumberjack sprites:
- `TREE_TRUNK_SPRITE_PATH`
- `TREE_TRUNK_SPRITE_SIZE` 
- Tree-specific scaling factors if needed

### 4. Component Architecture Improvements
- Move from inline div styling to dedicated sprite components
- Consistent scaling system across all game elements
- Better separation of concerns (positioning vs rendering)

## Implementation Strategy

### Immediate Changes Needed
1. **Use trunk.png sprite** (300x310px) scaled to current game size (150x155px)
2. **Simple implementation**: Replace CSS background color with `backgroundImage: url('/images/trunk.png')`
3. **Update constants.ts** with `TREE_TRUNK_SPRITE_PATH` and remove `TREE_TRUNK_COLOR`
4. **Update GameBoard.tsx** to use backgroundImage instead of backgroundColor
5. **Update animated segments** to use same trunk.png background

### Dimension Corrections Required
Based on the trunk.png sprite analysis:
- Current: 150x155px (0.97:1 ratio) - reasonable proportions
- Actual trunk.png: 300x310px (0.97:1 ratio) - same proportions, needs scaling
- Needed: Replace CSS `backgroundColor` with `backgroundImage` using trunk.png
- Current dimensions are fine, just need sprite implementation

### Benefits Analysis: Simple Implementation
**Pros of keeping it simple**:
- **No over-engineering** - trunk is just a texture, not a complex sprite
- **Cleaner code** - direct CSS change rather than new component
- **Faster implementation** - minimal changes required
- **Appropriate complexity** - matches the actual need (simple texture vs complex sprite sheet)

**Cons of creating TreeTrunkSprite component**:
- **Unnecessary abstraction** - trunk doesn't need sprite sheet features
- **Code bloat** - adds component for essentially `backgroundImage: url()`
- **Maintenance overhead** - more files and complexity for simple use case

### Recommended Approach: Direct CSS Implementation
**File Changes Required (Minimal)**:
- `src/constants.ts` - Add `TREE_TRUNK_SPRITE_PATH`, keep existing dimensions
- `src/components/GameBoard.tsx` - Replace `backgroundColor` with `backgroundImage`

**Avoid These Over-Engineered Approaches**:
- ❌ `src/components/TreeTrunkSprite.tsx` - Not needed for simple texture
- ❌ `src/components/Sprite.tsx` - LumberjackSprite and trunk are too different
- ❌ Complex sprite coordinate systems - trunk is just one image

## Branch Sprite Implementation Analysis

### Branch Asset Analysis
- **Location**: `/public/images/branch.png`
- **Format**: Single PNG image (not a sprite sheet)
- **Dimensions**: 340×248 pixels (1.37:1 aspect ratio)
- **Content**: Side-view tree branch with green leaves
- **Orientation**: Designed as a right-side branch extending rightward
- **Style**: Cartoon/stylized art matching game aesthetic

### Current Branch Rendering System
Branches are currently rendered as simple colored rectangles in the GameBoard component:
- **Implementation**: Simple div elements with CSS background colors
- **Left branches**: Green rectangles (`#228B22`)
- **Right branches**: Green rectangles (`#228B22`) 
- **Positioning**: Absolute positioning on left/right sides of trunk segments

### Branch Sprite Implementation Requirements

#### 1. Directional Sprite Handling
**Critical Issue**: The branch.png sprite faces right and must be mirrored for left-side branches:
- **Right branches**: Use branch.png as-is
- **Left branches**: Apply CSS `transform: scaleX(-1)` to flip horizontally
- **Alternative**: Create separate left/right sprite assets (less efficient)

#### 2. Sprite Integration Options

##### Option A: Direct CSS Implementation (Recommended for Consistency)
- Replace rectangle `backgroundColor` with `backgroundImage: url('/images/branch.png')`
- Add conditional CSS transform for left-side mirroring
- Maintain existing positioning system
- Simple implementation matching trunk sprite approach

##### Option B: Branch Sprite Component (Better for Complex Needs)
Create `BranchSprite.tsx` component with:
- Props for side determination (`side: 'left' | 'right'`)
- Automatic mirroring logic for left branches
- Consistent sizing and scaling
- Reusable for both static and animated branches

#### 3. Scaling and Positioning Considerations (REQUIREMENTS CLARIFIED)
- **Target dimensions**: 170px width, height scaled by aspect ratio (170 × 248/340 = ~124px height)
- **Sprite scaling**: Scale 340×248px sprite to 170×124px display size
- **Position alignment**: Center branches on current positions (no offset adjustments needed)
- **Transform origin**: Use `bottom-left` for left-side mirrored branches
- **Animation compatibility**: Same animation behavior, flying branches should rotate
- **Collision detection**: No updates needed (keep existing rectangular boundaries)

### Refactoring Opportunities

#### Unified Sprite System Architecture
With both trunk and branch sprites, a common sprite abstraction becomes valuable:

**Common Sprite Patterns Identified**:
- **Background image rendering** - both use `backgroundImage` CSS property
- **Scaling and sizing** - both need consistent dimension management
- **Positioning** - both use absolute positioning in game coordinates
- **Asset path management** - both reference sprite files in `/public/images/`

**Proposed Common Sprite Interface**:
```typescript
interface SpriteProps {
  src: string;           // sprite image path
  width: number;         // display width in pixels
  height: number;        // display height in pixels
  className?: string;    // additional CSS classes
  style?: CSSProperties; // additional inline styles
  transform?: string;    // CSS transform (for mirroring, rotation)
}
```

#### Branch vs Trunk Sprite Complexity Comparison
**Branch sprites** (complex needs):
- **Directional logic** - left/right mirroring with transforms
- **Side-specific behavior** - different rendering based on position
- **Multiple instances** - used throughout tree segments and animations

**Trunk sprites** (simple needs):
- **Single texture** - just background image replacement
- **No directional logic** - same rendering regardless of position
- **Repeating pattern** - simple background texture

#### Two-Phase Refactoring Strategy
**Phase 1: Implement BranchSprite with temporary direct approach**
- Create BranchSprite component with built-in sprite logic
- Replace branch rectangles with sprite-based rendering
- Get branch sprites working with mirroring

**Phase 2: Extract common Sprite component and refactor**
- Create reusable `Sprite` component with common functionality
- Refactor BranchSprite to use common Sprite component
- Convert trunk rendering from direct CSS to Sprite component
- Establish consistent sprite system across game elements

#### Benefits of Common Sprite System
**Advantages**:
- **Consistent API** - same props pattern for all game sprites
- **Reusable logic** - shared positioning, scaling, and styling
- **Maintainable** - single place for sprite-related utilities
- **Extensible** - easy to add new sprites (text sprites, obstacles, power-ups, etc.)
- **Type safety** - unified TypeScript interfaces for all sprites
- **Future assets confirmed** - text sprites will be added later, validating common system approach

**Implementation locations requiring updates**:
- Static tree segments in GameBoard.tsx
- Flying branch animations in game logic  
- Trunk rendering (post-refactor phase)
- Branch collision detection (may need sprite boundary adjustments)

### Implementation Strategy

#### Phase 1: Branch Sprite Implementation (Immediate)
1. **Create BranchSprite component** with side-aware rendering
2. **Add branch constants** to constants.ts (path, dimensions, scaling)
3. **Update GameBoard.tsx** to use BranchSprite instead of div rectangles
4. **Update animation system** to use BranchSprite for flying branches
5. **Test collision detection** with new sprite boundaries

#### Phase 2: Common Sprite System Refactoring (Post-Branch)
1. **Create common Sprite component** with shared functionality
2. **Refactor BranchSprite** to use common Sprite component internally
3. **Convert trunk CSS** to use Sprite component instead of direct backgroundImage
4. **Update LumberjackSprite** to consider common patterns (optional)
5. **Establish sprite system conventions** for future game elements

#### File Changes Required

**Phase 1 Files**:
- `src/components/BranchSprite.tsx` - New component with mirroring logic
- `src/constants.ts` - Add `BRANCH_SPRITE_PATH` and related constants
- `src/components/GameBoard.tsx` - Replace rectangle divs with BranchSprite
- Flying branch animation code - Update to use BranchSprite component

**Phase 2 Files**:
- `src/components/Sprite.tsx` - New common sprite component
- `src/components/BranchSprite.tsx` - Refactor to use common Sprite
- `src/components/GameBoard.tsx` - Update trunk rendering to use Sprite
- `src/constants.ts` - Organize sprite constants with common patterns

### Technical Implementation Notes (REQUIREMENTS CONFIRMED)
- **CSS Transform**: `transform: scaleX(-1)` for left-side branches
- **Transform Origin**: `transform-origin: bottom-left` for left-side branches
- **Sprite dimensions**: 340×248px source → 170×124px display (exactly 50% scale)
- **Positioning**: Center on existing branch positions (no offset changes needed)
- **Animation**: Flying branches maintain rotation behavior, same as current system
- **Collision**: Keep existing rectangular collision boundaries (no sprite shape detection)
- **Performance**: CSS transforms are GPU-accelerated, minimal performance impact
- **Future compatibility**: Common sprite system will support upcoming text sprites

## Next Steps

### Phase 1: Branch Sprite Implementation
1. ~~Examine branch.png sprite format and orientation~~
2. Create BranchSprite component with directional mirroring
3. Add branch sprite constants to constants.ts
4. Update GameBoard to use BranchSprite instead of rectangles
5. Update flying branch animations to use BranchSprite
6. Test branch rendering, scaling, and collision detection

### Phase 2: Common Sprite System Refactoring  
7. Create common Sprite component with shared functionality
8. Refactor BranchSprite to use common Sprite component
9. ~~Implement trunk sprite replacement~~ → Convert to use common Sprite component
10. Establish unified sprite system patterns and conventions
11. Test all sprites work consistently across game elements