# PLAN.md

## Sprite Implementation Plan

Based on finalized specifications from RESEARCH.md. This plan provides clear, unambiguous steps for LLM implementation.

## Implementation Specifications

### Final Requirements:
- **Scaling**: Height-based scaling to 173px (factor 0.51 from 341px source)
- **CSS Method**: background-image with background-position
- **State Timing**: Button press → chopping → idle (200ms), collision → hit
- **Alignment**: Bottom-align sprite within current player bounds
- **Player States**: 'idle' | 'chopping' | 'hit'

### Sprite Coordinates (from RESEARCH.md):
```typescript
const SPRITE_COORDS = {
  idle: [0, 0, 341, 341],           // Pose #1: Idle Frame 1
  chopping: [0, 341, 341, 682],     // Pose #4: Chop (Impact)
  hit: [0, 682, 341, 1023]          // Pose #7: Hit/Stunned
}
```

## Step-by-Step Implementation

### Step 1: Add Sprite Constants
**File**: `src/constants.ts`
**Action**: Add sprite-related constants

```typescript
// Add to existing constants.ts
export const SPRITE_SHEET_PATH = '/images/lumberjack.png'
export const SPRITE_SOURCE_SIZE = 1023 // Original sprite sheet dimension
export const SPRITE_INDIVIDUAL_SIZE = 341 // Individual sprite size
export const SPRITE_SCALE_FACTOR = 173 / 341 // Height-based scaling (0.507)
export const SPRITE_SCALED_SHEET_SIZE = Math.floor(SPRITE_SOURCE_SIZE * SPRITE_SCALE_FACTOR) // 519px

// Sprite coordinates (x1, y1, x2, y2)
export const SPRITE_COORDS = {
  idle: [0, 0, 341, 341],
  chopping: [0, 341, 341, 682], 
  hit: [0, 682, 341, 1023]
} as const

// Player state timing
export const CHOPPING_STATE_DURATION_MS = 200
```

### Step 2: Add Player State to GameState
**File**: `src/game/GameState.ts`
**Action**: Add playerState property

**Find**:
```typescript
export interface GameState {
  playerSide: 'left' | 'right'
  score: number
  gameOver: boolean
  // ... other properties
}
```

**Replace with**:
```typescript
export interface GameState {
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'
  score: number
  gameOver: boolean
  // ... other properties
}
```

**Find**:
```typescript
export const createInitialGameState = (): GameState => ({
  playerSide: 'left',
  score: 0,
  gameOver: false,
  // ... other properties
})
```

**Replace with**:
```typescript
export const createInitialGameState = (): GameState => ({
  playerSide: 'left',
  playerState: 'idle',
  score: 0,
  gameOver: false,
  // ... other properties
})
```

### Step 3: Create LumberjackSprite Component
**File**: `src/components/LumberjackSprite.tsx` (new file)
**Action**: Create sprite component using background-image technique

```typescript
import { SPRITE_SHEET_PATH, SPRITE_COORDS, SPRITE_SCALE_FACTOR, SPRITE_SCALED_SHEET_SIZE } from '../constants'

interface LumberjackSpriteProps {
  state: 'idle' | 'chopping' | 'hit'
  width: number
  height: number
  className?: string
}

export default function LumberjackSprite({ 
  state, 
  width, 
  height, 
  className = '' 
}: LumberjackSpriteProps) {
  const coords = SPRITE_COORDS[state]
  
  // Calculate background-position from sprite coordinates
  const bgPosX = -Math.floor(coords[0] * SPRITE_SCALE_FACTOR)
  const bgPosY = -Math.floor(coords[1] * SPRITE_SCALE_FACTOR)
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${SPRITE_SHEET_PATH})`,
        backgroundSize: `${SPRITE_SCALED_SHEET_SIZE}px ${SPRITE_SCALED_SHEET_SIZE}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat'
      }}
    />
  )
}
```

### Step 4: Create Player Component
**File**: `src/components/Player.tsx` (new file)
**Action**: Extract player logic from GameBoard.tsx

```typescript
import LumberjackSprite from './LumberjackSprite'
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants'

interface PlayerProps {
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'
  gameOver: boolean
  leftPosition: number
  rightPosition: number
  bottomOffset: number
}

export default function Player({
  playerSide,
  playerState,
  gameOver,
  leftPosition,
  rightPosition,
  bottomOffset
}: PlayerProps) {
  const finalState = gameOver ? 'hit' : playerState
  
  return (
    <div style={{
      position: 'absolute',
      left: playerSide === 'left' ? `${leftPosition}px` : `${rightPosition}px`,
      bottom: `${bottomOffset}px`,
      width: `${PLAYER_WIDTH}px`,
      height: `${PLAYER_HEIGHT}px`,
      // Center the 173x173 sprite within the 90x173 player bounds
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end' // Bottom-align sprite
    }}>
      <LumberjackSprite 
        state={finalState}
        width={173} // Full sprite size for detail
        height={173}
      />
    </div>
  )
}
```

### Step 5: Update GameBoard to Use Player Component
**File**: `src/components/GameBoard.tsx`
**Action**: Replace inline player rendering

**Find** (lines 149-158):
```typescript
{/* Player */}
<div style={{
  position: 'absolute',
  left: playerSide === 'left' ? `${PLAYER_LEFT_POSITION}px` : `${PLAYER_RIGHT_POSITION}px`,
  bottom: `${PLAYER_BOTTOM_OFFSET}px`,
  width: `${PLAYER_WIDTH}px`,
  height: `${PLAYER_HEIGHT}px`,
  backgroundColor: gameOver ? 'red' : 'blue',
  border: '4px solid #000'
}} />
```

**Replace with**:
```typescript
{/* Player */}
<Player 
  playerSide={playerSide}
  playerState={gameState.playerState}
  gameOver={gameOver}
  leftPosition={PLAYER_LEFT_POSITION}
  rightPosition={PLAYER_RIGHT_POSITION}
  bottomOffset={PLAYER_BOTTOM_OFFSET}
/>
```

**Add import** at top of file:
```typescript
import Player from './Player'
```

**Update GameBoardProps interface** to include playerState:
```typescript
interface GameBoardProps {
  treeSegments: TreeSegment[]
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'  // Add this line
  gameOver: boolean
  mode?: 'interactive' | 'static' | 'frozen'
  animatedSegments?: AnimatedSegment[]
  onRemoveAnimatedSegment?: (animationId: string) => void
}
```

**Update GameBoard function signature**:
```typescript
export default function GameBoard({ 
  treeSegments, 
  playerSide,
  playerState,  // Add this line
  gameOver, 
  mode = 'interactive',
  animatedSegments = [],
  onRemoveAnimatedSegment
}: GameBoardProps) {
```

### Step 6: Update PlayScreen to Pass PlayerState
**File**: `src/components/scenes/PlayScreen.tsx`
**Action**: Pass playerState to GameBoard

**Find** the GameBoard usage:
```typescript
<GameBoard
  treeSegments={gameState.treeSegments}
  playerSide={gameState.playerSide}
  gameOver={gameState.gameOver}
  // ... other props
/>
```

**Update to**:
```typescript
<GameBoard
  treeSegments={gameState.treeSegments}
  playerSide={gameState.playerSide}
  playerState={gameState.playerState}  // Add this line
  gameOver={gameState.gameOver}
  // ... other props
/>
```

### Step 7: Add Player State Management to GameLogic
**File**: `src/game/GameLogic.ts`
**Action**: Update game logic to manage player states

**Add import**:
```typescript
import { CHOPPING_STATE_DURATION_MS } from '../constants'
```

**Find the performChop function**:
```typescript
export const performChop = (
  gameState: GameState, 
  side: 'left' | 'right'
): GameState => {
```

**Update to set chopping state**:
```typescript
export const performChop = (
  gameState: GameState, 
  side: 'left' | 'right'
): GameState => {
  // ... existing collision detection logic ...
  
  if (hitBranch) {
    return {
      ...gameState,
      gameOver: true,
      playerState: 'hit'  // Add this line
    }
  }

  // ... existing chop logic ...
  
  return {
    ...updatedGameState,
    playerSide: side === 'left' ? 'right' : 'left',
    playerState: 'chopping',  // Add this line
    score: gameState.score + 1,
    timeRemaining: Math.min(gameState.timeRemaining + TIME_ADDED_PER_CHOP_SEC, gameState.maxTime)
  }
}
```

### Step 8: Add Chopping State Timer
**File**: `src/hooks/useGameState.ts`
**Action**: Add timer to return to idle state after chopping

**Add to useGameState hook**:
```typescript
// Add useEffect for chopping state timer
useEffect(() => {
  if (gameState.playerState === 'chopping') {
    const timer = setTimeout(() => {
      setGameState(current => ({
        ...current,
        playerState: 'idle'
      }))
    }, CHOPPING_STATE_DURATION_MS)

    return () => clearTimeout(timer)
  }
}, [gameState.playerState])
```

**Add import**:
```typescript
import { CHOPPING_STATE_DURATION_MS } from '../constants'
```

### Step 9: Test and Verify
**Actions**:
1. Run `npm test` - ensure all tests pass
2. Run `npm run lint` - ensure no linting errors  
3. Run `npm run build` - ensure build succeeds
4. Visual verification:
   - Idle sprite shows by default
   - Chopping sprite shows briefly on button press
   - Hit sprite shows when hitting branch
   - Sprites are properly positioned and scaled

## Expected Outcome

After implementation:
- Player rectangle replaced with detailed lumberjack sprites
- Three distinct visual states (idle, chopping, hit)
- Sprites scaled to 173x173px, bottom-aligned within player bounds
- Brief chopping state (200ms) provides visual feedback
- Clean component separation for maintainability
- All existing game functionality preserved

## File Structure After Implementation

```
src/
├── components/
│   ├── LumberjackSprite.tsx (new)
│   ├── Player.tsx (new)  
│   └── GameBoard.tsx (updated)
├── game/
│   ├── GameState.ts (updated)
│   └── GameLogic.ts (updated)
├── hooks/
│   └── useGameState.ts (updated)
├── constants.ts (updated)
└── components/scenes/
    └── PlayScreen.tsx (updated)
```