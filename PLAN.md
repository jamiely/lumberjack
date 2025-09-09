# Implementation Plan

## ✅ 1. Extract Game Logic + Tests
- ✅ Create `src/game/GameState.ts` with interfaces and initial state
- ✅ Create `src/game/GameLogic.ts` with pure functions for chop, collision detection, reset
- ✅ Create `src/game/__tests__/GameLogic.test.ts` - test collision, scoring, game over
- ✅ Create `src/game/TreeSystem.ts` with branch generation and segment management
- ✅ Create `src/game/__tests__/TreeSystem.test.ts` - test branch generation
- ⏭️ Move game logic out of `App.tsx` into these modules (deferred to step 4)
- ✅ **Run `npm test` to ensure all tests pass**
- ✅ **Update progress.md and commit changes**

## ✅ 2. Create UI Components + Tests
- ✅ Create `src/components/GameBoard.tsx` for tree and player rendering
- ✅ Create `src/components/__tests__/GameBoard.test.tsx` - test rendering
- ✅ Create `src/components/DebugPanel.tsx` for debug info display
- ✅ Create `src/components/__tests__/DebugPanel.test.tsx` - test debug display
- ✅ Create `src/components/ScoreDisplay.tsx` for score and game status
- ✅ Create `src/components/__tests__/ScoreDisplay.test.tsx` - test score display
- ⏭️ Extract rendering logic from `App.tsx` into these components (deferred to step 4)
- ✅ **Run `npm test` to ensure all tests pass**
- ✅ **Update progress.md and commit changes**

## ✅ 3. Create Custom Hooks + Tests
- ✅ Create `src/hooks/useGameState.ts` for centralized state management
- ✅ Create `src/hooks/__tests__/useGameState.test.ts` - test state management
- ✅ Create `src/hooks/useKeyboardInput.ts` for input handling
- ✅ Create `src/hooks/__tests__/useKeyboardInput.test.ts` - test input handling
- ⏭️ Move state and input logic from `App.tsx` into these hooks (deferred to step 4)
- ✅ **Run `npm test` to ensure all tests pass**
- ✅ **Update progress.md and commit changes**

## ✅ 4. Refactor App.tsx + Update Tests
- ✅ Remove game logic functions (move to game modules)
- ✅ Remove direct state management (use custom hooks)
- ✅ Remove rendering logic (use new components)
- ✅ Keep only high-level component orchestration
- ✅ Replace placeholder tests in `src/App.test.tsx` with actual integration tests
- ✅ **Run `npm test` to ensure all tests pass**
- ✅ **Update progress.md and commit changes**
- ⏸️ **PAUSE FOR MANUAL TESTING** - Verify game still works correctly

## ✅ 5. Add Integration Test
- ✅ Create `src/__tests__/GameplayIntegration.test.tsx` - test complete gameplay loop
- ✅ **Run `npm test` to ensure all tests pass**
- ✅ **Update progress.md and commit changes**

## ✅ 6. Setup ESLint
- ✅ Install ESLint with React/TypeScript presets
- ✅ Create `eslint.config.js` configuration file (modern v9 format)
- ✅ Add lint scripts to `package.json`
- ✅ Add lint command to build process
- ✅ **Run `npm run lint` to ensure linting passes**
- ✅ **Run `npm test` to ensure all tests still pass**
- ✅ **Update progress.md and commit changes**

## ✅ 7. Update Documentation  
- ✅ Update `CLAUDE.md` with new architecture information
- ✅ Update `progress.md` with refactoring completion
- ✅ **Final commit**

---

# 🎉 PLAN COMPLETE!

All 7 steps successfully executed:
1. ✅ Game Logic + Tests - Extracted pure functions to dedicated modules  
2. ✅ UI Components + Tests - Created reusable, tested components
3. ✅ Custom Hooks + Tests - Built state management and input handling hooks
4. ✅ App.tsx Refactor - Reduced from 209 to 46 lines with full integration
5. ✅ Integration Tests - Added comprehensive end-to-end testing
6. ✅ ESLint Setup - Modern v9 config with React/TypeScript presets  
7. ✅ Documentation Update - Complete architecture documentation

**Result:** Transformed monolithic game into clean, modular, fully-tested React application!