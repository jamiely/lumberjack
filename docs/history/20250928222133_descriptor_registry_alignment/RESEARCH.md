# Character Configuration Duplication Research

## Context
- Goal: eliminate repeated boilerplate across the lumberjack character configuration modules (`src/characters/lumberjack*/config.ts`) while preserving the existing `CharacterConfig` API consumed by UI, selection utilities, and factories.
- Source guidance: `REFACTORING_PLAN.md` flags "Character Configuration Duplication" as a high-impact opportunity; prior consolidation work (`PROGRESS.md`, `src/characters/sharedConfig.ts`) already centralizes some defaults but repetition remains across character-specific files and downstream consumers.

## Current Architecture Touchpoints
- Types live in `src/characters/types.ts` (`CharacterType`, `PoseBounds`, `GameState`, `CharacterConfig`, etc.) and must remain canonical for TypeScript safety.
- `src/characters/sharedConfig.ts` provides shared defaults (`DEFAULT_BOTTOM_OFFSET`, `calculateCenteringOffset`, `createCharacterConfig`, `createStateMapper`) and is already used by every lumberjack config.
- Character configs are registered twice:
  - `src/characters/index.ts` exports the top-level registry (`characterRegistry`, `getCharacterConfig`, `getCharacterTypes`, `isValidCharacterType`).
  - `src/characters/core/CharacterRegistration.ts` seeds `CharacterFactory` with the same configs for the scene-based system.
- Selection and rendering rely on the registry output:
  - `src/services/CharacterSelectionService.ts` keeps a hard-coded `availableCharacters` array that mirrors the `CharacterType` union.
  - `src/utils/characterSelection.ts`, scene components (`src/components/SceneManager.tsx`, `src/components/scenes/PlayScreen.tsx`, `GameOverScreen.tsx`, `AttractScreen.tsx`), and rendering (`src/components/Player.tsx`, `UniversalSprite.tsx`) hydrate character data through `getCharacterConfig`.
- Test coverage references these configs directly (`src/characters/__tests__/orientation.test.ts`, `src/components/__tests__/Player.test.tsx`, `src/characters/__tests__/sharedConfig.test.ts`). Any refactor must keep their expectations intact.

## Duplication Pain Points
- **State pose mapping**: Each config declares a `const ...STATE_MAP` with the same three keys (`idle`, `chopping`, `hit`) mapping to pose identifiers. The mapping differs only when a character chooses a different animation alias, yet all files duplicate the structure.
- **Positioning defaults**: Although `createCharacterConfig` supplies defaults, most configs still hard-code constants such as `LUMBERJACK*_DISPLAY_SIZE = 220` and `height = 173`. These numbers repeat even if unchanged from defaults.
- **Naming/metadata boilerplate**: Every file redefines `id`, `name`, `sheet` metadata, and a `poses` dictionary. Many fields (e.g., `sheetWidth`, `sheetHeight` for 1024×1536 sprites) are repeated verbatim across characters.
- **Registry wiring**: Both the top-level registry and the factory registration list contain similar ordered tuples of `(CharacterType, CharacterConfig)` and must be kept in sync manually.
- **Consumer duplication**: `CharacterSelectionService` duplicates `CharacterType` values in an array, diverging from central sources if new characters are added.

## Opportunities for Consolidation
- **Single descriptor list**: Introduce a shared `CharacterDescriptor` structure that captures the per-character differences—id, display name, sprite sheet metadata, pose bounds, state pose labels, and optional positioning overrides. Keep all descriptors in one module (e.g., `src/characters/descriptors.ts`) so every character follows the same schema.
  - Example pseudocode:
    ```ts
    const descriptors = [
      {
        id: 'lumberjack1',
        name: 'Classic Lumberjack',
        sheet: { path: './images/lumberjack.png', width: 1023, height: 1023 },
        displaySize: 220,
        height: 173,
        poses,
        statePoseMap: defaultStatePoseMap('idle', 'chopping', 'hit'),
        defaultFacing: 'left'
      },
      // others
    ] as const
    ```
  - A builder consumes each descriptor and invokes `createCharacterConfig`, so defaults, state mapping, and registration logic run centrally.
- **Shared state mapping helpers**: Provide utilities such as `createStandardStateMap(descriptorOverrides)` or `buildStateMap({ idle: 'idleFrame1', ... })` to avoid hand-written map constants.
- **Registry bootstrapping**: Generate `characterRegistry` and `characterEntries` from the descriptor list to remove manual maintenance. `CharacterFactory` initialization and `getCharacterTypes()` simply read from the derived record.
- **Selection service alignment**: Refactor `CharacterSelectionService` to accept available IDs (derived from descriptors) via constructor or factory so its list stays synchronized automatically.

## Safeguards and Considerations
- **Type enforcement**: Derive `CharacterType` from the descriptor array (`type CharacterType = typeof descriptors[number]['id']`). This keeps exhaustiveness checking while eliminating duplicate union maintenance.
- **Explicit baseline values**: Even when a value matches the shared default, keep it spelled out in the descriptor for readability, per stakeholder guidance.
- **Testing updates**: Adjust orientation, player, and shared-config tests to iterate over descriptors or the generated registry; verify default facing, pose shapes, and state mapping remain unchanged after the refactor.
- **Pose data maintenance**: Gathering pose dictionaries in one module increases file size, so consider split exports (e.g., `descriptors/lumberjack1.ts`) if it becomes unwieldy, but they still funnel through a single descriptor list export.
- **Asset paths**: Confirm each descriptor still points to the correct asset in `public/images/`. If multiple characters reference the same sprite sheet intentionally, document that choice within the descriptor comments to avoid confusion.
- **Extensibility**: No non-lumberjack characters are planned, but the descriptor schema should remain flexible enough to tweak pose layouts, sprite dimensions, or facing rules if future assets diverge subtly.

## Implementation Backbone (Pseudocode)
1. Define `CharacterDescriptor` interface and helper builders (`buildStateMap`, `buildCharacterConfigFromDescriptor`).
2. Export a const `characterDescriptors` array containing one descriptor per lumberjack with explicit metadata fields.
3. Reduce the descriptors into a `Record<CharacterType, CharacterConfig>` via `createCharacterConfig`; export this record from a central module.
4. Update `src/characters/index.ts` and `src/characters/core/CharacterRegistration.ts` to consume the generated record/entries instead of manually listing each config.
5. Modify `CharacterSelectionService` to pull `getCharacterTypes()` (or accept the list via dependency injection) rather than hard-coded arrays.
6. Refresh affected tests to use the new exports while asserting legacy behavior (facing, pose shape, state mapping, available states) stays intact.

## Confirmed Decisions
- Derive `CharacterType` from the descriptor list instead of maintaining a manual union.
- Maintain a single shared descriptor module that lists every character using the same schema.
- Keep repeated values (display size, height, etc.) explicit in each descriptor even when they match defaults.
- No additional non-lumberjack characters are planned; focus consolidation on the existing lumberjack set while leaving room for minor sprite differences.
