# RESEARCH: Deprecated Methods Refactoring

## Overview

Analysis of the codebase to identify deprecated methods and prepare for refactoring to use new APIs.

## Deprecated Methods Found

### Location: src/utils/spriteConfig.ts

The entire `src/utils/spriteConfig.ts` file contains deprecated methods that should be replaced with the new character configuration system.

#### Deprecated Functions:

1. **getDefaultSpriteConfig()** - Line 9
   - **Status**: Deprecated
   - **Replacement**: `getCharacterConfig('lumberjack1')` from `../characters`
   - **Current Usage**: Not found in active codebase

2. **getSpriteConfig(characterType)** - Line 16
   - **Status**: Deprecated
   - **Replacement**: `getCharacterConfig(characterType)` from `../characters`
   - **Current Usage**: Not found in active codebase

3. **getLumberjack2SpriteConfig()** - Line 30
   - **Status**: Deprecated
   - **Replacement**: `getCharacterConfig('lumberjack2')` from `../characters`
   - **Current Usage**: Not found in active codebase

4. **mapGameStateToLumberjack2Pose(gameState)** - Line 37
   - **Status**: Deprecated
   - **Replacement**: `getCharacterConfig('lumberjack2').mapGameStateToSprite()` from `../characters`
   - **Current Usage**: Not found in active codebase

## New Character API Structure

### Available Functions (src/characters/index.ts):
- `getCharacterConfig(characterType: CharacterType): CharacterConfig` - Main function to get character configurations
- `getAllCharacters(): CharacterConfig[]` - Get all available characters
- `getCharacterTypes(): CharacterType[]` - Get all character type names
- `isValidCharacterType(type: string): type is CharacterType` - Type guard function

### Character Registry:
- `lumberjack1`: lumberjack1Config
- `lumberjack2`: lumberjack2Config  
- `lumberjack3`: lumberjack3Config
- `lumberjack4`: lumberjack4Config

## Analysis Results

### Good News:
- **No Active Usage Found**: The deprecated functions appear to have no current usage in the active codebase
- **Clean Migration Path**: The new API provides clear replacements for all deprecated functionality
- **No React Deprecations**: No deprecated React patterns found (no old lifecycle methods, ReactDOM.render, etc.)
- **No Node.js Deprecations**: No deprecated Node.js APIs found (no Buffer constructor, substr, etc.)

### Migration Strategy:
Since the deprecated methods are not actively used, the safest approach is to:
1. Remove the entire `src/utils/spriteConfig.ts` file
2. Verify no imports reference this file
3. Run tests to ensure no functionality is broken
4. Update any TypeScript imports or references if discovered during testing

## Risk Assessment

**Low Risk**: The deprecated methods appear to be legacy code that is no longer used. Removal should be straightforward without breaking changes.

## Next Steps

1. Create implementation plan in PLAN.md
2. Remove deprecated file
3. Verify no breaking imports
4. Run comprehensive tests
5. Run lint and build checks