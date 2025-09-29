# Character Config Consolidation Plan

## Objective
Streamline the lumberjack character configuration system by centralizing shared metadata, deriving canonical types, and ensuring all consumers (registries, factories, selection services, tests) read from a single source of truth without changing runtime behavior.

## Preconditions & References
- Review existing configs in `src/characters/lumberjack*/config.ts` to capture per-character differences that must remain explicit.
- Confirm shared helpers in `src/characters/sharedConfig.ts` and types in `src/characters/types.ts` stay authoritative.
- Keep legacy behavior verified by `src/characters/__tests__/orientation.test.ts`, `src/components/__tests__/Player.test.tsx`, and `src/characters/__tests__/sharedConfig.test.ts`.

## Implementation Steps
1. **Design Descriptor Schema**
   - Create `src/characters/descriptors.ts` (or similar) exporting a `CharacterDescriptor` interface and a `characterDescriptors` array.
   - Each descriptor should capture id, display name, sprite sheet metadata (path, dimensions, frame layout), pose bounds, state pose labels, default facing, and optional positioning overrides.
   - Include explicit values even when they match defaults to satisfy art team expectations from `RESEARCH.md`.

2. **Builder Utilities**
   - Author helper functions in a new module (e.g., `src/characters/descriptorBuilder.ts`) that transform descriptors into `CharacterConfig` entries using `createCharacterConfig` and `createStateMapper` from `src/characters/sharedConfig.ts`.
   - Provide a shared `createStandardStateMap(overrides)` helper so individual descriptors only specify deviations from the default `idle/chopping/hit` mapping.

3. **Type Derivation**
   - In `src/characters/types.ts` (or a dedicated export file), derive `CharacterType` from the descriptor array (`typeof characterDescriptors[number]['id']`).
   - Ensure consumer modules import the derived type instead of maintaining manual unions; adjust any related enums or helper types if necessary.

4. **Generate Canonical Registry**
   - Produce a `characterConfigs` record and `characterEntries` tuple from the descriptor builder and export them from a central module (e.g., `src/characters/registry.ts`).
   - Replace manual spread logic inside each lumberjack config with imports from the generated registry and remove redundant config files if their content is fully covered by descriptors.

5. **Update Character Index & Factory**
   - Refactor `src/characters/index.ts` to re-export `characterConfigs`, `getCharacterConfig`, `getCharacterTypes`, and `isValidCharacterType` derived from the new registry.
   - Update `src/characters/core/CharacterRegistration.ts` (and any other factory bootstrapper) to iterate `characterEntries` instead of hard-coded arrays.

6. **Align Selection Service and Utilities**
   - Modify `src/services/CharacterSelectionService.ts` and `src/utils/characterSelection.ts` to consume `getCharacterTypes()` or accept the descriptor list so available characters remain synchronized automatically.
   - Audit components (`src/components/SceneManager.tsx`, `PlayScreen.tsx`, `GameOverScreen.tsx`, `AttractScreen.tsx`, `Player.tsx`, `UniversalSprite.tsx`) to ensure they read from the updated exports without relying on removed constants.

7. **Test Suite Adjustments**
   - Update orientation and Player tests to iterate over the centralized registry/descriptors while preserving their expectations.
   - Add focused unit tests for descriptor-to-config conversion (e.g., validate state map creation, default facing, pose shapes) to cover the new builder logic.

8. **Documentation Refresh**
   - Document the descriptor workflow in `GAME_DESIGN.md` (or another agreed doc) so future contributors know how to add/modify characters.
   - Note migration details in `PROGRESS.md` if that log is being maintained.

9. **Validation**
   - Run `npm run lint`, `npm run test`, `npm run check`, and `npm run build` to ensure no regressions.
   - Manually verify that character selection and animations still behave as expected in development mode if feasible.

## Risks & Mitigations
- **Accidental Type Drift**: Ensure the derived `CharacterType` matches existing usages; provide type guards where necessary.
- **Behavior Changes**: Compare generated configs against legacy constants during development, potentially logging or snapshot testing for parity.
- **Large Descriptor File**: If descriptors become unwieldy, consider splitting into per-character modules that feed a unified array, but keep the single point of truth export.

## Deliverables
- New descriptor-based configuration system with matching runtime behavior.
- Updated registry, factory, services, and tests aligned with the centralized source.
- Passing quality gates (lint, tests, check, build) and refreshed documentation reflecting the new workflow.
