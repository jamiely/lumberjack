# Implementation Questions for TODO Items

## TODO #2: Branch/Trunk Gap

### 1. Gap Tolerance
- What's the acceptable visual tolerance for branch-trunk alignment? Should they touch exactly or is a small gap (1-2px) acceptable?
a small overlap is fine

### 2. Branch Width vs Trunk Width
- Should branches be the same width as the trunk (80px) or maintain their current width? Current branch width may be different.
current width

## TODO #3: Lumberjack Facing Direction

### 1. Character Sprite Availability
- Do all character types (lumberjack1, lumberjack2, lumberjack3, lumberjack4) have both left and right facing sprites in their configs?
let me know if they don't and I can specify which way they face in their sprite

### 2. Animation Consistency
- Should the chopping and hit animations also respect the facing direction, or only the idle state?
all of the animations

### 3. Transition Behavior
- When the player moves from left to right side, should the direction change be instant or should there be a transition animation?
instant

## TODO #5: Game Over Player Position

### 1. Final Position Requirements
- Should the player appear exactly under the branch that hit them, or in their last valid position before the collision?
exactly under (as if gameplay had continued)

### 2. Visual State
- Should the player be shown in 'hit' animation state in the game over screen, or in 'idle' state?
hit

### 3. Branch Rendering
- Should the branch that caused the game over be visually highlighted or different in any way on the game over screen?
no

## TODO #6: Character Consistency

### 1. URL Parameter Behavior
- When a specific character is selected via URL parameter (?character=lumberjack2), should this character be maintained across all screens or only used as the initial selection?
maintained across all screens

### 2. Character Selection Flow (CLARIFIED)
**Character selection happens in attract screen** (since character is displayed there):

**New character selection occurs when entering attract screen:**
- Fresh load → Attract
- Reload → Attract  
- Game over → Attract

**Character flows through entire session:**
- Attract → Play → GameOver (same character throughout)

**Direct restart (Game over → Play):**
- Skips attract screen, needs new character selection at this point

### 3. Demo Mode Character
- Should the attract screen demo use the same character that will be used in gameplay, or can it use any character?
The attract screen shows the character that will be used in gameplay (they are the same)

## Current Assumptions

Based on the RESEARCH.md analysis, proceeding with these assumptions unless clarified otherwise:

- **Gap tolerance**: Exact alignment preferred (0px gap)
- **Character sprites**: All characters have both facing directions available
- **Animation consistency**: All states (idle, chopping, hit) respect facing direction
- **Game over position**: Player shown in exact final position with hit state
- **Character consistency**: Maintain same character for Attract → Play → GameOver flow
- **Session boundary**: Character reselection only when returning to Attract screen