# QUESTIONS.md

## Implementation Clarification Questions

Based on the analysis in RESEARCH.md, here are questions that need clarification before implementing fixes for the TODO.md items:

## 1. Score Visibility Issue

**Question**: What are the exact visibility requirements for the score display?

I want the score to appear above the playfield.

**Context**: Current score is positioned at top center with 36px font size and no explicit text color/background.

**Specific Questions**:
- Should the score have a background panel/overlay for better contrast against the sky blue background (#87CEEB)?
NO
- What text color would provide optimal visibility?
Keep current.
- Should the score be larger given this is for an arcade cabinet (27" screen, standing distance)?
Yes
- According to GAME_DESIGN.md, this should be "Large Score Display" for "standing viewers" - is 36px adequate?
yes

## 2. Scroll Disable Behavior

**Question**: What specific scrolling behavior needs to be disabled?

**Context**: Multiple scroll-related CSS properties across different elements (body, ScreenContainer, GameBoard).

**Specific Questions**:
- Should the entire page be non-scrollable (body/html level)?
No
- Is the issue with the ScreenContainer's `overflow: 'auto'` setting?
Probably
- Should we prevent all scrolling including keyboard scroll events (arrow keys, page up/down)?
Just on the root container

- Is this related to the arcade cabinet deployment where scrolling would be undesirable?
No

## 3. Background Height Cutoff

**Question**: What is the expected visual behavior for different screen sizes?

**Context**: ScreenContainer is fixed at 540x960px with centering, but background colors may not fill viewport properly.

**Specific Questions**:
- Should the background color (#87CEEB) always fill the entire viewport, even if larger than the game container?
yes
- Is the issue that the sky blue background cuts off when the viewport is taller than 960px?
No there is a strip of white at the bottom, if you scroll down to the bottom. Use your tools to confirm.
- Should we maintain the fixed aspect ratio (9:16) but ensure background extends beyond the game area?
Yes keep the root container as-is. If we can, just make sure the entire background is the same blue.
- What should happen on screens smaller than 540x960px?
Don't worry about this.

## 4. Attract Screen Overlay Issue

**Question**: What is the expected color matching behavior?

**Context**: AttractScreen has a darker background (#2c5234) vs PlayScreen (#87CEEB), with GameBoard set to "static" mode (0.8 opacity).

**Analysis from Code**:
- AttractScreen ScreenContainer: `backgroundColor="#2c5234"` (dark forest green)
- GameBoard in static mode has 0.8 opacity 
- GameBoard background is always #87CEEB (sky blue)
- Result: Semi-transparent sky blue over dark green

**Specific Questions**:
- Should AttractScreen have the same background color as PlayScreen (#87CEEB)?
yes
- Is the GameBoard opacity in "static" mode (0.8) causing the color mismatch?
I thought so, but maybe not.
- Should the GameBoard background be transparent or match the screen's background in attract mode?
No
- What was the intended visual design for attract mode vs play mode?
We should have the same colored background.

## 5. Branch Animation Physics

**Question**: What is the desired animation behavior for chopped tree segments?

**Context**: Currently trunk and branch rotate independently around their own centers, but they should move as a single unit.

**Specific Questions**:
- Should the branch rotate around the trunk's center (like a rigid body)?
No, treat the segment like one object (branch + trunk) and rotate it together
- Should trunk and branch be rendered as a single element that rotates together?
yes
- What rotation speed/physics feel most natural for the "chopped log flying off" effect?
keep existing
- Should the branch maintain its relative position to the trunk throughout the animation?
yes
- Are there any performance considerations for the animation system given this is for an arcade cabinet?
no

## 6. General Arcade Cabinet Considerations

**Questions about deployment context**:

**Screen Resolution/Scaling**:
- The current 540x960px base resolution scales to 1080x1920px for arcade deployment - are all UI elements sized appropriately for the final resolution?
- Should we test/validate fixes at both development (540x960px) and production (1080x1920px) resolutions?

**Visual Contrast**:
- Given arcade lighting conditions, do the current color choices provide sufficient contrast?
- Should score and UI elements be more prominent/bold for arcade viewing distances?

**Input Considerations**:
- Fixes should maintain compatibility with both keyboard (development) and 2-button (arcade) input systems?

## 7. Testing and Validation

**Questions about validation approach**:
- Should visual fixes be validated through automated tests or manual testing?
- Are there specific browser requirements for the kiosk deployment that might affect CSS behavior?
- Should we create visual regression tests for the color matching and layout issues?

## Priority and Dependencies

**Question**: What is the preferred implementation order?

**Context**: Some fixes may affect others (e.g., background color changes might impact score visibility).

**Recommendation**: 
1. Start with simple CSS fixes (scroll, background height)
2. Address score visibility with proper contrast
3. Investigate and fix color matching issue
4. Refactor branch animation system (most complex)

Would you like to clarify any of these points before proceeding with implementation?