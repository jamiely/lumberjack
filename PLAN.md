# Configuration Fragmentation Implementation Plan

## Overview

This plan implements the "Configuration Fragmentation" consolidation identified in RESEARCH.md as a **HIGH IMPACT** refactoring opportunity. Currently, configuration is scattered across 6 separate files totaling ~171 lines. We'll consolidate to 3 files with clear separation of concerns using a hybrid approach.

## Current State Analysis

### Files to Consolidate
- `src/config/gameConfig.ts` (9 lines) - Game timing constants
- `src/config/uiConfig.ts` (17 lines) - UI dimensions  
- `src/config/scalingConfig.ts` (80 lines) - Scaling options
- `src/config/animationConfig.ts` (10 lines) - Animation constants
- `src/config/audioConfig.ts` (8 lines) - Audio settings
- `src/config/treeConfig.ts` (47 lines) - Tree-related constants

### Import Usage Analysis
Based on RESEARCH.md findings, these config files are imported by 15+ different files across the codebase.

## Target Architecture

### New File Structure
```
src/config/
├── constants.ts      # All constants + complex config objects (consolidated from 6 files)
├── configUtils.ts    # Functions like getScalingOptions() and getScalingDebugInfo()
└── types.ts         # Shared types like ScalingOptions (moved from hooks dependency)
```

## Implementation Steps

### Phase 1: Preparation and Analysis

#### Step 1.1: Analyze Current Imports ✅ COMPLETED
**Files**: All current config files  
**Action**: Document all current import statements across codebase
**Goal**: Create comprehensive list of files that need import updates

**ANALYSIS RESULTS:**
Found **17 files** that import from config files:
- **Core Game Files** (6): `GameLogic.ts`, `GameState.ts`, `ChopCommand.ts`, `TickCommand.ts`, `useGameState.ts`, `useAnimationSystem.ts`
- **UI Components** (7): `ScreenContainer.tsx`, `BackgroundSprite.tsx`, `BranchSprite.tsx`, `GrassSprite.tsx`, `GameBoard.tsx`, `useViewportScaling.ts`
- **Services** (2): `ClickInputService.ts`, `AnimationManager.ts`
- **No test files** import config (good - tests use mock data)

**Import Patterns by Config File:**
- `gameConfig.ts`: 6 imports (timing constants)
- `treeConfig.ts`: 10 imports (sprite paths, dimensions, positioning)
- `uiConfig.ts`: 4 imports (board dimensions, player positioning)
- `scalingConfig.ts`: 1 import (getScalingOptions function)
- `animationConfig.ts`: 3 imports (animation constants)
- `audioConfig.ts`: 0 imports (placeholder file)

#### Step 1.2: Extract and Catalog All Constants ✅ COMPLETED
**Files**: All 6 config files
**Action**: Create comprehensive inventory of all constants and their relationships  
**Goal**: Understand dependencies and groupings for consolidation

**CONSTANTS INVENTORY:**

**gameConfig.ts** (6 constants):
- `TIME_ADDED_PER_CHOP_SEC = 0.25`
- `TIMER_UPDATE_INTERVAL_MS = 100` 
- `TIMER_WARNING_THRESHOLD_SEC = 1`
- `MAX_TIME_SEC = 5.0`
- `INITIAL_TIME_REMAINING_SEC = MAX_TIME_SEC` (derived)
- `CHOPPING_STATE_DURATION_MS = 200`

**uiConfig.ts** (11 constants):
- Board: `GAME_BOARD_WIDTH = 540`, `GAME_BOARD_HEIGHT = 960`, `GAME_BOARD_BACKGROUND_COLOR = '#87CEEB'`
- Player: `PLAYER_WIDTH = 90`, `PLAYER_HEIGHT = 173`, `PLAYER_BOTTOM_OFFSET = 86`, `PLAYER_LEFT_POSITION = 90`, `PLAYER_RIGHT_POSITION = 390`
- UI: `TIMER_BAR_HEIGHT = 20`, `DEBUG_PANEL_MARGIN_TOP = 20`, `DEBUG_PANEL_PADDING = 15`, `DEBUG_PANEL_FONT_SIZE = 12`

**treeConfig.ts** (21 constants):
- Trunk: `TREE_TRUNK_WIDTH = 150`, `TREE_TRUNK_HEIGHT = 155`, `TREE_TRUNK_LEFT_POSITION = 195`, `TREE_TRUNK_BOTTOM_OFFSET = 86`, `TREE_SEGMENT_VERTICAL_SPACING = 151`, `TREE_TRUNK_SPRITE_PATH`, `TREE_TRUNK_BORDER`
- Branch: `BRANCH_WIDTH = 150`, `BRANCH_HEIGHT = 86`, positions, styling constants
- Sprites: Background, branch, and grass sprite paths and dimensions

**animationConfig.ts** (6 constants):
- `ANIMATION_DURATION = 1000`, `ANIMATION_SPEED = 1125`, boundary positions, `ANIMATED_BRANCH_OFFSET = 33`

**scalingConfig.ts** (3 objects + 2 functions):
- `DEFAULT_SCALING_OPTIONS`, `DEVELOPMENT_SCALING_OPTIONS`, `ARCADE_SCALING_OPTIONS` 
- `getScalingOptions()` function with URL parameter logic
- `getScalingDebugInfo()` utility function

**audioConfig.ts**: Empty placeholder file

**KEY INSIGHTS:**
- **Shared positioning values**: `PLAYER_BOTTOM_OFFSET = 86` matches `TREE_TRUNK_BOTTOM_OFFSET = 86`
- **Dependencies**: `INITIAL_TIME_REMAINING_SEC` depends on `MAX_TIME_SEC`
- **Complex objects**: Scaling config has sophisticated configuration objects and utility functions
- **Type dependency**: `scalingConfig.ts` imports `ScalingOptions` from hooks - needs extraction

### Phase 2: Create New Architecture

#### Step 2.1: Create types.ts
**File**: `src/config/types.ts`
**Action**: 
- Extract shared types like `ScalingOptions` from hooks
- Create interfaces for config objects
- Export all configuration-related types
**Dependencies**: None

#### Step 2.2: Create constants.ts
**File**: `src/config/constants.ts`  
**Action**:
- Consolidate all constants from 6 files
- Group logically (Game, UI, Animation, Audio, Tree, Scaling)
- Add comprehensive JSDoc documentation
- Create complex config objects with clear structure
**Dependencies**: `./types.ts`

#### Step 2.3: Create configUtils.ts
**File**: `src/config/configUtils.ts`
**Action**:
- Extract utility functions like `getScalingOptions()`
- Extract `getScalingDebugInfo()` function
- Create helper functions for config access patterns
**Dependencies**: `./constants.ts`, `./types.ts`

### Phase 3: Migration Strategy

#### Step 3.1: Update Core Game Files
**Files**: 
- `src/game/` modules
- `src/hooks/useGameState.ts`
- `src/hooks/useScaling.ts`

**Action**: Update imports to use new consolidated config files
**Strategy**: Test each module after update to ensure functionality

#### Step 3.2: Update UI Components  
**Files**:
- `src/components/` modules
- `src/App.tsx`
- Component files using UI config

**Action**: Update imports and verify UI rendering
**Strategy**: Visual testing required for UI-affecting changes

#### Step 3.3: Update Services and Utilities
**Files**:
- `src/services/` modules
- `src/audio/` modules  
- `src/animation/` modules
- Other utility files

**Action**: Update imports and verify service functionality
**Strategy**: Run service-specific tests after each update

### Phase 4: Cleanup and Verification

#### Step 4.1: Remove Old Config Files
**Files**: All 6 original config files
**Action**: Delete old files after confirming all imports updated
**Safety**: Keep backup until all tests pass

#### Step 4.2: Update Tests
**Files**: Test files that import config
**Action**: Update test imports and verify test functionality
**Goal**: Ensure all tests continue to pass

#### Step 4.3: Final Integration Testing
**Action**: 
- Run full test suite: `npm test`
- Run linting: `npm run lint` 
- Run build: `npm run build`
- Manual testing of key features
**Goal**: Confirm no regressions introduced

## Detailed Implementation Specifications

### constants.ts Structure
```typescript
import type { ScalingOptions } from './types';

/**
 * Game timing and scoring constants
 */
export const GAME = {
  TIME_ADDED_PER_CHOP_SEC: 0.25,
  TIMER_UPDATE_INTERVAL_MS: 100,
  TIMER_WARNING_THRESHOLD_SEC: 1,
  MAX_TIME_SEC: 5.0,
  INITIAL_TIME_REMAINING_SEC: 5.0, // Derived from MAX_TIME_SEC
  CHOPPING_STATE_DURATION_MS: 200,
} as const;

/**
 * UI dimensions and layout constants
 */
export const UI = {
  // Game Board Dimensions
  GAME_BOARD_WIDTH: 540,
  GAME_BOARD_HEIGHT: 960,
  GAME_BOARD_BACKGROUND_COLOR: '#87CEEB',
  
  // Player Dimensions & Positioning  
  PLAYER_WIDTH: 90,
  PLAYER_HEIGHT: 173,
  PLAYER_BOTTOM_OFFSET: 86,
  PLAYER_LEFT_POSITION: 90,
  PLAYER_RIGHT_POSITION: 390,
  
  // UI Layout Constants
  TIMER_BAR_HEIGHT: 20,
  DEBUG_PANEL_MARGIN_TOP: 20,
  DEBUG_PANEL_PADDING: 15,
  DEBUG_PANEL_FONT_SIZE: 12,
} as const;

/**
 * Animation timing and movement constants
 */
export const ANIMATION = {
  ANIMATION_DURATION: 1000,
  ANIMATION_SPEED: 1125,
  ANIMATION_OUT_OF_BOUNDS_LEFT: -338,
  ANIMATION_OUT_OF_BOUNDS_RIGHT: 1553,
  ANIMATED_BRANCH_OFFSET: 33,
} as const;

/**
 * Tree, branch, and sprite constants
 */
export const TREE = {
  // Tree Trunk
  TREE_TRUNK_WIDTH: 150,
  TREE_TRUNK_HEIGHT: 155, // Math.floor(173 * 0.9)
  TREE_TRUNK_LEFT_POSITION: 195,
  TREE_TRUNK_BOTTOM_OFFSET: 86,
  TREE_SEGMENT_VERTICAL_SPACING: 151, // TREE_TRUNK_HEIGHT - 4
  TREE_TRUNK_SPRITE_PATH: './images/trunk.png',
  TREE_TRUNK_BORDER: '4px solid #000',
  
  // Branches
  BRANCH_WIDTH: 150,
  BRANCH_HEIGHT: 86,
  BRANCH_LEFT_POSITION: 45,
  BRANCH_RIGHT_POSITION: 325,
  BRANCH_VERTICAL_OFFSET: 120, // Calculated offset for centering
  BRANCH_COLOR: '#654321',
  BRANCH_BORDER: '4px solid #000',
  
  // Sprite Paths and Dimensions
  BRANCH_SPRITE_PATH: './images/branch.png',
  BRANCH_SPRITE_WIDTH: 170,
  BRANCH_SPRITE_HEIGHT: 124,
  BACKGROUND_SPRITE_PATH: './images/background.png',
  BACKGROUND_SPRITE_WIDTH: 540,
  BACKGROUND_SPRITE_HEIGHT: 960,
  GRASS_SPRITE_PATH: './images/grass.png',
  GRASS_SPRITE_WIDTH: 540,
  GRASS_SPRITE_HEIGHT: 120,
} as const;

/**
 * Scaling configuration objects
 */
export const SCALING = {
  DEFAULT_OPTIONS: {
    strategy: 'fit-to-screen' as const,
    minScale: 0.1,
    maxScale: 10,
    maintainAspectRatio: true,
  },
  DEVELOPMENT_OPTIONS: {
    strategy: 'fit-to-screen' as const,
    minScale: 0.5,
    maxScale: 3,
    maintainAspectRatio: true,
  },
  ARCADE_OPTIONS: {
    strategy: 'fit-to-screen' as const,
    minScale: 1,
    maxScale: 2,
    maintainAspectRatio: true,
  },
} as const;
```

### configUtils.ts Structure
```typescript
import { SCALING } from './constants';
import type { ScalingOptions } from './types';

/**
 * Get scaling options based on environment or URL parameters
 * Moved from scalingConfig.ts
 */
export function getScalingOptions(): ScalingOptions {
  // Check URL parameters for scaling configuration
  const urlParams = new URLSearchParams(window.location.search)
  const scalingStrategy = urlParams.get('scaling') as ScalingOptions['strategy']
  const minScale = urlParams.get('minScale')
  const maxScale = urlParams.get('maxScale')
  const maintainAspectRatio = urlParams.get('aspectRatio')

  // Start with default options
  let options = { ...SCALING.DEFAULT_OPTIONS }

  // Check for environment-specific defaults
  if (import.meta.env.MODE === 'development') {
    options = { ...SCALING.DEVELOPMENT_OPTIONS }
  } else if (window.location.pathname.includes('/arcade')) {
    options = { ...SCALING.ARCADE_OPTIONS }
  }

  // Override with URL parameters if provided
  if (scalingStrategy && ['fit-to-screen', 'fit-to-width', 'fit-to-height'].includes(scalingStrategy)) {
    options.strategy = scalingStrategy
  }

  if (minScale && !isNaN(parseFloat(minScale))) {
    options.minScale = parseFloat(minScale)
  }

  if (maxScale && !isNaN(parseFloat(maxScale))) {
    options.maxScale = parseFloat(maxScale)
  }

  if (maintainAspectRatio !== null) {
    options.maintainAspectRatio = maintainAspectRatio !== 'false'
  }

  return options
}

/**
 * Debug helper to display current scaling information
 * Moved from scalingConfig.ts
 */
export function getScalingDebugInfo(scaling: { 
  scale: number
  actualGameWidth: number
  actualGameHeight: number
  containerWidth: number
  containerHeight: number
  offsetX: number
  offsetY: number
}): string {
  return `Scale: ${scaling.scale.toFixed(2)}x | ` +
         `Game: ${scaling.actualGameWidth}×${scaling.actualGameHeight} | ` +
         `Viewport: ${scaling.containerWidth}×${scaling.containerHeight} | ` +
         `Offset: (${scaling.offsetX}, ${scaling.offsetY})`
}
```

### types.ts Structure
```typescript
/**
 * Configuration types extracted from various modules
 * to eliminate circular dependencies
 */

/**
 * Viewport scaling configuration options
 * Moved from hooks/useViewportScaling.ts
 */
export interface ScalingOptions {
  strategy?: 'fit-to-screen' | 'fit-to-width' | 'fit-to-height'
  minScale?: number
  maxScale?: number
  maintainAspectRatio?: boolean
}

/**
 * Viewport scaling calculation results
 * Re-exported for convenience from hooks/useViewportScaling.ts
 */
export interface ViewportScaling {
  scale: number
  containerWidth: number
  containerHeight: number
  offsetX: number
  offsetY: number
  actualGameWidth: number
  actualGameHeight: number
}
```

## Risk Mitigation

### Big Bang Migration Strategy
- **Approach**: Update all imports simultaneously to avoid partial state
- **Benefit**: Cleaner transition, no temporary compatibility layers
- **Risk**: Higher chance of missing imports
- **Mitigation**: Comprehensive import analysis in Phase 1

### Testing Strategy
- **Unit tests**: Run after each major update
- **Integration tests**: Run after each phase
- **Manual testing**: Verify key game functionality works
- **Build verification**: Ensure TypeScript compilation succeeds

### Rollback Plan
- **Backup**: Keep original files until verification complete  
- **Git strategy**: Implement in feature branch with atomic commits
- **Verification**: All tests pass and manual testing confirms functionality

## Success Criteria

### Functional Requirements
- [ ] All existing functionality preserved
- [ ] No runtime errors introduced
- [ ] All tests continue to pass
- [ ] Build process succeeds without errors

### Structural Improvements
- [ ] 6 config files consolidated to 3 files
- [ ] Clear separation: constants, utilities, types
- [ ] Improved import patterns (fewer imports needed)
- [ ] Better organization of related constants

### Documentation and Maintainability  
- [ ] Enhanced JSDoc documentation
- [ ] Clear logical grouping of constants
- [ ] Consistent naming patterns
- [ ] Easier configuration discovery

## Dependencies and Prerequisites

### Code Dependencies
- All 6 current config files must remain unchanged until migration complete
- Import analysis must identify all dependent files
- Type definitions must be extracted before constants migration

### Testing Prerequisites
- Current test suite must be passing before starting
- Manual testing checklist for key game features
- Build verification process established

## Timeline Estimate

- **Phase 1 (Analysis)**: 2-3 hours
- **Phase 2 (New Architecture)**: 3-4 hours  
- **Phase 3 (Migration)**: 4-6 hours
- **Phase 4 (Cleanup/Verification)**: 2-3 hours
- **Total**: 11-16 hours

This represents a significant but manageable refactoring that will substantially improve the codebase's maintainability and organization.