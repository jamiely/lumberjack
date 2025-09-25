# PLAN: Remove Deprecated Methods

## Implementation Steps

Based on the research in RESEARCH.md, this plan outlines the steps to remove deprecated methods from the codebase.

## Step 1: Verify No Dependencies
- Double-check that no files import from `src/utils/spriteConfig.ts`
- Search for any remaining references to the deprecated functions
- Confirm the file can be safely removed

## Step 2: Remove Deprecated File
- Delete `src/utils/spriteConfig.ts` entirely
- The file contains 4 deprecated functions that are not in use

## Step 3: Verify TypeScript Compilation
- Run `tsc` to ensure no import errors after file removal
- Check that all TypeScript types still resolve correctly

## Step 4: Run Test Suite
- Execute `npm test` to verify no functionality is broken
- Ensure all existing tests pass with deprecated code removed

## Step 5: Run Quality Checks
- Execute `npm run lint` to check for any linting issues
- Run `npm run build` to verify production build works
- Confirm all quality gates pass

## File References

### Files to Delete:
- `src/utils/spriteConfig.ts` - Contains all deprecated methods

### Files to Monitor:
- Any files that might have imported from the deprecated file (none found during research)

## Risk Mitigation

- **Low Risk**: No active usage of deprecated methods found
- **Backup Strategy**: If any hidden dependencies are discovered during testing, they should be updated to use `getCharacterConfig()` from `src/characters/index.ts`
- **Rollback Plan**: If issues arise, the deprecated file can be restored from git history

## Success Criteria

1. ✅ `src/utils/spriteConfig.ts` file removed
2. ✅ TypeScript compilation succeeds
3. ✅ All tests pass
4. ✅ Lint checks pass  
5. ✅ Build succeeds
6. ✅ No deprecated method warnings remain

## Post-Implementation

- Update TODO.md to mark deprecated methods task as complete
- Consider documenting the new character API usage in GAME_DESIGN.md if needed