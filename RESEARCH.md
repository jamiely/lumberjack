# MVP Research: Timberman Core Mechanics

## Problem with Current Implementation
The current MVP doesn't match the game design - we have multiple trees and the player moves away from them. According to GAME_DESIGN.md, this should be like Timberman where:
- **ONE tree in the center** 
- **Player switches between left and right SIDES of the tree**
- **Player chops the tree segments, avoiding branches**

## Corrected MVP Goal: Timberman Core Loop
Build the basic Timberman mechanics with geometric shapes.

### Core Loop (from GAME_DESIGN.md):
**Left/Right buttons → Player switches sides of central tree → Chop current segment → Avoid branches**

### Visual Elements:
- **Central tree**: Stack of rectangular segments in the middle
- **Branches**: Horizontal lines extending left or right from some segments  
- **Player**: Blue square that appears on left OR right side of tree
- **Score**: Chop counter
- **Timer**: Progress bar (future)

### Controls:
- **Left arrow**: Move to left side of tree + chop
- **Right arrow**: Move to right side of tree + chop

### Key Mechanics:
- Player position: `'left' | 'right'` relative to tree
- Tree segments scroll down as chopped
- Branch collision detection
- Game over if hit branch

### Implementation Plan:
- Player side state: track whether on left or right of tree
- Tree segments array: each segment has branch direction (left/right/none)
- Chop function: check for branch collision, remove bottom segment, add new top segment
- Game over condition: player chops on same side as branch

### Success Criteria:
- Single tree in center with segments
- Player appears on left/right side when pressing keys
- Segments disappear from bottom and new ones appear on top
- Basic branch collision (game over)
- Score increases with successful chops