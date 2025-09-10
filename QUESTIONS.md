# Questions for TODO.md Implementation

## Priority and Scope Questions

### 1. Implementation Order
- Should we implement the TODO items in the order listed, or would you prefer to prioritize by impact/difficulty?
YES
- The research suggests starting with quick wins (background styling, text removal) before tackling animations. Does this approach align with your preferences?
YES

### 2. Flying Segment Animation Complexity
- For the tree segment animation (TODO item #1), how realistic should the physics be?
  - Simple linear movement with little rotation
  - Remove tree segment when it goes beyond bounds of screen

### 3. Blue Background Color
- What is the exact blue color (#RGB or hex value) that should be used for the body background?
The same as the play field
- Should we match the existing game's blue color scheme, or is there a specific color preference?
Yes the existing

## Technical Implementation Questions

### 4. Current Codebase Understanding
- Should we first examine the existing component structure to understand how screens are currently implemented?
Yes
- Are there any specific files or components you'd like us to focus on or avoid modifying?
No

### 5. Testing Requirements
- Do you want automated tests added for these UI changes?
Yes
- Should we verify the changes work correctly with the existing game loop and interactions?
Yes

### 6. Attract Screen Layout Details
- For the high score banner at the top (TODO item #3), should it span the full width of the screen?
Of the game screen, yes. The banner should overlay the game field.

- How much vertical space should separate the high score banner from the centered game title?
Don't worry about that. Only center the game title. The banner should be just big enough to fit the text.

### 7. Score Display Specifications
- For the centered score display (TODO item #4), what size should it be relative to the current display?
200%

- Should it use a specific font or styling to ensure arcade visibility?
Not at this time.

## Development Process Questions

### 8. Development Environment
- Should we test these changes using the local development server (npm run dev) that's currently running?
yes

- Are there specific screen resolutions or browser configurations we should test with?
540x960.

### 9. Game State Preservation
- Do these UI changes need to work across all game states (attract, play, game over), or are they specific to certain screens only?
certain screens
- Should we preserve all existing functionality while making these visual improvements?
yes

### 10. Performance Considerations
- For the flying segment animation, are there any performance constraints we should be aware of?
no
- Should we implement object pooling or other optimization techniques from the start?
no

## User Experience Questions

### 11. Animation Duration and Style
- How long should the flying segment animation last?
until the segment leaves the bounds
- Should segments fly in realistic arcs, or simple straight lines?
straight lines with rotation

### 12. Backwards Compatibility
- Should these changes maintain compatibility with the existing arcade cabinet specifications mentioned in GAME_DESIGN.md?
yes
- Are there any changes that might affect the 1080x1920 resolution or arcade button functionality?
no

## Validation Questions

### 13. Definition of "Done"
- How will we know each TODO item has been successfully completed?
I'll manually test
- Should we provide before/after screenshots or recordings for visual changes?
no

### 14. User Feedback Integration
- Would you like to review each change individually, or should we implement all items and present them together?
all together
- Are there any specific aspects of the current game design that should NOT be changed while implementing these todos?
no
