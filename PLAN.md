# Character Config Consolidation Implementation Plan

## Objective
Create a shared character configuration system that eliminates duplicated literals and type conversions across the lumberjack character configs. The new flow must serve both the `src/characters/index.ts` registry and the scene-centric factory introduced under `src/characters/core`.

## Context Summary
- All five lumberjack config files repeat identical positioning defaults, dimension math, and state-mapping switch statements.
- Two incompatible `CharacterConfig` interfaces exist (rich config in `src/characters/types.ts`, simplified config in `src/characters/core/Character.ts`). `CharacterRegistration.ts` bridges the gap with a lossy conversion helper.
- Tests under `src/characters/__tests__` and `src/components/__tests__/Player.test.tsx` assert against current configuration shape.

## Step-by-Step Work Plan
1. **Baseline & Type Audit**
   - Inspect references to both `CharacterConfig` interfaces (`rg "CharacterConfig" src`) to map consumers.
   - Decide on the canonical shape (the richer `src/characters/types.ts` version) and add any missing fields needed by `core/Character.ts` consumers.

2. **Unify Character Types**
   - Update `src/characters/core/Character.ts` to import or re-export the canonical type instead of redefining it.
   - Adjust `CharacterFactory` and any downstream usage to work with the richer config (or derive the slim view internally if necessary).

3. **Design Shared Builder Utilities**
   - Create a new module (e.g. `src/characters/sharedConfig.ts`) that exports:
     - Common positioning defaults (bottom offset, left/right positions).
     - A centering offset helper driven by display width.
     - A `createCharacterConfig` builder that accepts character id, metadata, sprite sheet info, pose map, default facing, and optional overrides, returning the canonical config.
     - A `createStateMapper` helper or inline logic to eliminate duplicated switch statements.

4. **Migrate Existing Character Configs**
   - Refactor each `lumberjack*/config.ts` to consume the shared builder.
   - Keep pose definitions as data constants; rely on shared defaults for positioning and dimensions unless a character needs overrides.
   - Ensure available state lists derive from the pose data or provided overrides for accuracy.

5. **Clean Up Legacy Registration Path**
   - Remove `convertLegacyToNewConfig` in `CharacterRegistration.ts`; register the consolidated configs directly.
   - Confirm `CharacterFactory` usage still works for scene management and update associated docs/comments.

6. **Update Tests & Add Coverage**
   - Adjust existing tests in `src/characters/__tests__` and `src/components/__tests__/Player.test.tsx` to reflect any type or data shape changes (e.g. generated state lists).
   - Add focused unit tests for the builder utilities to lock in default behavior and override handling.

7. **Validation**
   - Run `npm test` to execute unit/integration suites.
   - Run `npm run lint` (and `npm run build` if lint runs there) to ensure type checking passes.
   - If Playwright tests cover character rendering, execute `npm run test:e2e` to confirm no regressions.

8. **Documentation & Cleanup**
   - Update any inline TODOs or comments rendered obsolete by the consolidation.
   - Note the new shared system in `RESEARCH.md` / `PROGRESS.md` as appropriate after implementation (outside this plan scope).

## Risks & Mitigations
- **Type mismatch regressions:** Unifying the config type may surface compilation errors; tackle them immediately to keep diff small.
- **Pose coverage gaps:** Automating available state lists must handle characters with partial pose sets (e.g. `lumberjack3` comments). Provide explicit overrides when data is incomplete.
- **Factory consumers:** Verify any runtime usage (scene selection, player rendering) still receives required fields before deleting conversion helpers.

## Success Criteria
- Single authoritative `CharacterConfig` interface with no conversions between duplicate shapes.
- All lumberjack configs express only pose/sprite specifics; shared defaults handle positioning and state mapping.
- Tests pass without weakening assertions, demonstrating the refactor preserved behavior.
- Character addition workflow reduced to defining sprite metadata and poses while reusing shared helpers.
