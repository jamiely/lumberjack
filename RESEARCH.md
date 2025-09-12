# RESEARCH.md

## Lumberjack Sprite Sheet Analysis

The sprite sheet located at `public/images/lumberjack.png` contains 9 different poses of the lumberjack character arranged in a 3x3 grid. Each sprite is 341x341 pixels.

### Sprite Breakdown

| Pose # | Pose Name               | Description                                                                 | Suggested Use                          | Crop Coordinates (x1, y1, x2, y2) |
|--------|-------------------------|-----------------------------------------------------------------------------|----------------------------------------|-----------------------------------|
| 1      | Idle Frame 1            | Standing neutral, calm expression, axe resting on his back.                 | Base idle loop                         | (0, 0, 341, 341)                  |
| 2      | Idle Frame 2            | Axe over shoulder, chest slightly expanded, ready stance.                   | Alternate idle frame (breathing motion)| (341, 0, 682, 341)                |
| 3      | Chop (Anticipation)     | Axe raised high, knees bent, brows furrowed in focus.                       | First frame of chopping sequence       | (682, 0, 1023, 341)               |
| 4      | Chop (Impact)           | Axe striking down with force, body leaning into the swing.                  | Main impact frame for chopping         | (0, 341, 341, 682)                |
| 5      | Chop (Follow-through)   | Axe fully down, body leaning forward in completion of chop.                 | End of chop motion                     | (341, 341, 682, 682)              |
| 6      | Chop (Recovery/Return)  | Axe being pulled back up toward neutral stance.                             | Transition back to idle                | (682, 341, 1023, 682)             |
| 7      | Hit/Stunned             | Eyes squeezed shut, sweat drop/stars overhead, staggered expression.        | When hit by branch or stunned event    | (0, 682, 341, 1023)               |
| 8      | Knocked Down (Prone 1)  | Flat on back, axe beside him, dazed expression.                             | Defeat animation, mid-fall recovery    | (341, 682, 682, 1023)             |
| 9      | Knocked Down (Prone 2)  | Fully collapsed on the ground, eyes closed, lying motionless.               | Final defeated state                   | (682, 682, 1023, 1023)            |

### Implementation Strategy

For initial implementation, we can use single sprites for each game state:
- **Idle State**: Use Pose #1 (Idle Frame 1)
- **Chopping State**: Use Pose #4 (Chop Impact) 
- **Hit/Stunned State**: Use Pose #7 (Hit/Stunned)
- **Game Over State**: Use Pose #9 (Knocked Down Prone 2)

Future enhancement could implement full animation sequences using multiple frames for smoother transitions.

### Technical Notes

- Sprite sheet dimensions: 1023x1023 pixels
- Individual sprite size: 341x341 pixels
- Format: PNG with transparent background
- Grid layout: 3 columns × 3 rows

## Current Game Architecture Analysis

### Player Rendering (GameBoard.tsx:149-158)
Currently the lumberjack is rendered as a simple colored rectangle:
- Position: `PLAYER_LEFT_POSITION` (90px) or `PLAYER_RIGHT_POSITION` (390px)
- Size: `PLAYER_WIDTH` × `PLAYER_HEIGHT` (90px × 173px)
- Bottom offset: `PLAYER_BOTTOM_OFFSET` (86px)
- Color: Blue (normal) or Red (game over)
- Simple div with border styling

### Game State Structure
- No player animation state currently tracked in GameState interface
- Player position controlled by `playerSide: 'left' | 'right'`
- Game over state affects visual appearance
- No existing sprite or image handling in codebase

## Game Design Context Analysis

### Key Design Requirements from GAME_DESIGN.md:
- **Visual Style**: "Basic geometric shapes for development phase" (lines 408-410)
- **Character**: "Simple geometric shape (rectangle/circle) representing lumberjack" (line 423)
- **Future Enhancement**: "AI-generated assets when visual style is finalized" (line 409)
- **Player Animation**: "animationState: 'idle' | 'chopping' | 'hit'" (line 121)
- **MVP Focus**: Prioritize gameplay over visual polish

### Screen Specifications:
- **Base Resolution**: 540×960 (scales to 1080×1920 for arcade)
- **Arcade Display**: 27" vertical screen, high visibility requirements
- **Viewing Distance**: 2-3 feet, need bold graphics and high contrast

## Refactoring Prerequisites 

### Current Code Structure Issues
**GameBoard.tsx Analysis (207 lines):**
- **Mixed Concerns**: Player rendering (lines 149-158), tree segments, and animation logic all in one component
- **Inline Styles**: Extensive use of inline styles makes maintenance difficult
- **Complex Rendering**: Animation calculations mixed with rendering logic

### Recommended Refactoring Before Sprite Implementation
1. **Extract Player Component**: Separate player rendering logic from GameBoard.tsx
   - Current player code (lines 149-158) should become standalone Player component
   - Enables cleaner sprite integration
   - Improves testability and maintainability

2. **Benefits of Player Extraction**:
   - Clean separation for sprite implementation
   - Easier to test player-specific logic  
   - Preparation for enhanced visual states
   - Maintains single responsibility principle

### Refactoring Impact
- **Low Risk**: Simple component extraction with clear boundaries
- **High Value**: Sets up clean architecture for sprite system
- **MVP Compatible**: Maintains current functionality while improving structure

## Implementation Strategy

### Phase 0: Refactoring (Prerequisite)
1. **Extract Player Component**: Create `src/components/Player.tsx` with current player logic
2. **Update GameBoard**: Replace inline player rendering with Player component
3. **Test**: Ensure no functional regressions

### Phase 1: Replace Rectangle with Static Sprite
1. **Add Player State Enum**: Extend GameState to track player states (idle, chopping, hit, knocked_down)
2. **Create Sprite Component**: Build reusable component to render sprite sections  
3. **Integrate into GameBoard**: Replace rectangle div with sprite component
4. **Update Constants**: Scale sprite appropriately for current game layout
5. **Maintain MVP Approach**: Simple implementation focusing on functionality

### Phase 2: Add State-Based Sprite Selection
1. **Game Logic Integration**: Update game logic to set appropriate player states
2. **State Transitions**: Map game events to visual states with defined timing:
   - **Idle → Chopping**: On button press
   - **Chopping → Idle**: After brief duration (~200ms)
   - **Idle → Hit**: On branch collision detection
3. **Timing Coordination**: Implement brief chopping state duration for visual feedback

### Implementation Details

#### Sprite Component Structure
```typescript
interface SpriteProps {
  spriteSheet: string
  cropCoords: [number, number, number, number] // x1, y1, x2, y2
  width: number
  height: number
  className?: string
}
```

#### Sizing Analysis & Final Specifications
- **Current Player**: 90×173px rectangle (aspect ~0.52, portrait orientation)
- **Sprite Source**: 341×341px square (aspect 1.0, needs cropping/scaling)
- **Arcade Requirements**: High visibility at 2-3 feet viewing distance
- **Scaling Approach**: Height-based scaling to 173px height (factor ~0.51)
- **Final Sprite Size**: 173×173px (maintains sprite detail, fits player height)
- **Position Alignment**: Bottom-align sprite with current player bottom position
- **Player Bounds**: Keep current 90×173px bounds, sprite extends beyond width

#### CSS Implementation Technique
**Selected Approach**: CSS background-image with background-position
- **Rationale**: Simple implementation, excellent browser support, optimal performance for arcade
- **Method**: Set sprite sheet as background-image, use background-position for sprite selection
- **Scaling**: Use background-size to scale sprite sheet to desired dimensions
- **Positioning**: Calculate background-position from sprite coordinates

#### Background-Position Calculations
```css
/* Example for idle sprite (coords: 0, 0, 341, 341) */
.sprite-idle {
  background-image: url('/images/lumberjack.png');
  background-size: 507px 507px; /* Scale 1023x1023 to 173x3 ratio */
  background-position: 0px 0px;
  width: 173px;
  height: 173px;
}
```

### Design Decision Impact
Given GAME_DESIGN.md emphasis on "basic geometric shapes for development phase" and MVP focus:
- **Conservative Approach**: Implement sprite system but maintain current sizing
- **Future-Proof**: Structure allows easy transition to detailed art assets later
- **Arcade Compatibility**: Ensure sprites remain visible at arcade viewing distances

### Refactoring Scope for Sprite Implementation
**Focus**: Extract only Player component - minimal refactoring to enable clean sprite integration

**Rationale**: 
- GameBoard.tsx has mixed concerns that complicate sprite implementation
- Player rendering (lines 149-158) should be isolated for sprite replacement
- Keep refactoring minimal and focused on sprite implementation needs only

### Final Implementation Specifications

#### All Requirements Resolved:
- **Scaling**: Height-based (173px), bottom-aligned
- **CSS Technique**: background-image with background-position  
- **State Timing**: Button press → chopping → idle (200ms), collision → hit
- **Sprite Alignment**: Bottom-align within current player bounds
- **Arcade Scaling**: Ignore for now (handle later)

### File Changes Required
1. **New file**: `components/Player.tsx` - Extract current player rendering logic
2. **GameBoard.tsx**: Replace inline player rendering with Player component  
3. **GameState.ts**: Add `playerState: 'idle' | 'chopping' | 'hit'` (per GAME_DESIGN.md line 121)
4. **constants.ts**: Add sprite coordinates, scaling factor (0.51), and timing constants
5. **New file**: `components/LumberjackSprite.tsx` - background-image sprite component
6. **Player.tsx**: Update to use LumberjackSprite instead of rectangle
7. **GameLogic.ts**: Update game actions to set appropriate player states and timing
8. **Add chopping state timer**: Brief duration (~200ms) before returning to idle