# QUESTIONS.md

## Lumberjack Sprite Implementation Questions

### Context from GAME_DESIGN.md Analysis:
- MVP phase uses "basic geometric shapes" for development
- Player animation states specified: 'idle' | 'chopping' | 'hit' 
- Arcade display requires high visibility at 2-3 feet viewing distance
- Base resolution 540×960, scales to 1080×1920 for arcade

### Refined Questions:

### 1. Sizing Approach (CLARIFIED)
Given GAME_DESIGN.md emphasis on MVP and arcade visibility:
- **Recommended**: Scale sprite down to current constraints (90×173px) for consistency

Yes, but keep in mind we will want to scale everything up for arcade display.

### 2. Animation Timing (SIMPLIFIED)
GAME_DESIGN.md specifies simple state-based animation:
- **Basic**: Single static sprite per state (idle, chopping, hit)
- **Enhanced**: Brief chop sequence for better visual feedback

start with static sprites

### 3. State Transitions (MAPPED TO GAME DESIGN)
Based on game mechanics analysis:
- **Hit State**: When branch hits player (game over trigger)
- **Chopping State**: During active chopping action
- **Idle State**: Default/waiting state

no

### 4. Sprite Positioning (ARCADE CONSIDERATION)
Current bottom-aligned positioning works for arcade visibility:
- **Maintain**: Keep current ground-level alignment
- **Adjust**: Fine-tune for sprite proportions

minor adjustments are ok

### 5. MVP vs Enhancement Priority
basic replacement is fine

## Additional Implementation Ambiguities

### 6. Sprite Scaling Specifics
Current player is 90×173px (rectangular), sprite is 341×341px (square):
- **Width-based scaling**: Scale to 90px width (factor ~0.26) → sprite becomes 90×90px
- **Height-based scaling**: Scale to 173px height (factor ~0.51) → sprite becomes 173×173px
- **Question**: Which scaling approach should we use?
height

### 7. CSS Implementation Technique
Multiple options available:
- **Background-image**: Use CSS background-image with background-position
- **CSS clip/mask**: Use CSS clipping to show sprite sections
- **Canvas rendering**: HTML5 canvas for sprite handling
- **Question**: Which CSS technique should we implement?


### 8. State Transition Timing
- **Question**: When exactly does player state change?
  - Idle → Chopping: On button press? Or when chop animation starts?
  button press

  - Chopping → Idle: Immediately after chop? Or after brief duration?
  after brief duration

  - Idle → Hit: On branch collision detection?
  yes

### 9. Sprite Alignment Within Player Bounds
Square sprite in rectangular player area:
- **Center**: Center sprite within current 90×173px bounds
- **Bottom-align**: Align sprite bottom with current player bottom
- **Custom**: Adjust player bounds to match sprite proportions
- **Question**: How should sprite align within player area?
bottom align

### 10. Arcade Scaling Impact
User mentioned "keep in mind we will want to scale everything up for arcade display":
- **Question**: Should sprite implementation consider arcade scaling factor now, or handle later?
- **Question**: Does this affect sprite coordinate calculations or constants?
We can ignore for now.
